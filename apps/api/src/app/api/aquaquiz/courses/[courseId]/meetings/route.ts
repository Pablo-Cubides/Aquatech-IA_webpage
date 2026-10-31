import { NextRequest } from "next/server";
import { aquaQuizMeetingCreateSchema } from "@ia-next/contracts";
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

  const meetings = await prisma.quizMeeting.findMany({
    where: { courseId },
    orderBy: [{ classDate: "desc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { attendances: true, sessions: true } },
      sessions: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          joinCode: true,
          status: true,
          createdAt: true,
          quizSet: { select: { title: true } },
          _count: { select: { participants: true } },
        },
      },
    },
  });
  return aquaQuizResponse({ meetings });
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

  const parsed = aquaQuizMeetingCreateSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError();
  const classDate = new Date(`${parsed.data.classDate}T00:00:00.000Z`);
  if (classDate.toISOString().slice(0, 10) !== parsed.data.classDate)
    return validationError();

  const limited = await allowAquaQuizRequest(
    request,
    `meetings:${auth.account.id}`,
  );
  if (limited) return limited;

  const meeting = await prisma.quizMeeting.create({
    data: { courseId, ...parsed.data, classDate },
  });
  return aquaQuizResponse({ meeting }, { status: 201 });
}
