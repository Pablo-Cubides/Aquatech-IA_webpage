import { NextRequest } from "next/server";
import { aquaQuizEnrollmentListSchema } from "@ia-next/contracts";
import { prisma } from "@ia-next/database";
import {
  allowAquaQuizRequest,
  aquaQuizError,
  aquaQuizResponse,
  requireAquaQuizTeacher,
  validationError,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const auth = await requireAquaQuizTeacher(request);
  if (!auth.ok) return auth.response;

  const { courseId } = await params;
  const course = await prisma.quizCourse.findFirst({
    where: { id: courseId, ownerId: auth.account.id },
    select: { id: true },
  });
  if (!course) return aquaQuizError("No se encontró ese curso.", 404);

  const parsed = aquaQuizEnrollmentListSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError();

  const limited = await allowAquaQuizRequest(
    request,
    `roster:${auth.account.id}`,
  );
  if (limited) return limited;

  const result = await prisma.quizEnrollment.createMany({
    data: [...new Set(parsed.data.codes)].map((studentCode) => ({
      courseId,
      studentCode,
      source: "ROSTER",
    })),
    skipDuplicates: true,
  });
  const total = await prisma.quizEnrollment.count({ where: { courseId } });
  return aquaQuizResponse({ added: result.count, total });
}
