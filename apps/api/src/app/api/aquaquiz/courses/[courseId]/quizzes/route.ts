import { NextRequest } from "next/server";
import { aquaQuizSetCreateSchema } from "@ia-next/contracts";
import { prisma } from "@ia-next/database";
import {
  allowAquaQuizRequest,
  aquaQuizError,
  aquaQuizResponse,
  requireAquaQuizTeacher,
  validationError,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function GET(
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

  const quizzes = await prisma.quizSet.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });
  return aquaQuizResponse({ quizzes });
}

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

  const parsed = aquaQuizSetCreateSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError();

  const limited = await allowAquaQuizRequest(
    request,
    `quizzes:${auth.account.id}`,
  );
  if (limited) return limited;

  const { title, questions } = parsed.data;
  const quiz = await prisma.quizSet.create({
    data: {
      courseId,
      title,
      questions: {
        create: questions.map((question, order) => ({ ...question, order })),
      },
    },
    include: { _count: { select: { questions: true } } },
  });
  return aquaQuizResponse({ quiz }, { status: 201 });
}
