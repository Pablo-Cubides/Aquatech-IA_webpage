import { NextRequest } from "next/server";
import { aquaQuizManualAttendanceSchema } from "@ia-next/contracts";
import { prisma, Prisma } from "@ia-next/database";
import {
  aquaQuizError,
  aquaQuizResponse,
  allowAquaQuizRequest,
  requireAquaQuizTeacher,
  validationError,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> },
) {
  const auth = await requireAquaQuizTeacher(request);
  if (!auth.ok) return auth.response;
  const { meetingId } = await params;
  const limited = await allowAquaQuizRequest(
    request,
    `attendance-manual:${auth.account.id}`,
  );
  if (limited) return limited;

  const parsed = aquaQuizManualAttendanceSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError();
  const meeting = await prisma.quizMeeting.findFirst({
    where: { id: meetingId, course: { ownerId: auth.account.id } },
    select: { id: true, courseId: true },
  });
  if (!meeting) return aquaQuizError("No se encontró esa clase.", 404);

  const enrollment = await prisma.quizEnrollment.findUnique({
    where: {
      courseId_studentCode: {
        courseId: meeting.courseId,
        studentCode: parsed.data.studentCode,
      },
    },
    select: { id: true },
  });
  if (!enrollment)
    return aquaQuizError(
      "Ese código no está en la lista del curso. Agrégalo antes de registrar asistencia.",
      404,
    );

  const current = await prisma.quizAttendance.findUnique({
    where: {
      meetingId_enrollmentId: { meetingId, enrollmentId: enrollment.id },
    },
  });
  const now = new Date();
  const attendance = await prisma.$transaction(async (tx) => {
    const saved = current
      ? await tx.quizAttendance.update({
          where: { id: current.id },
          data: { nickname: parsed.data.nickname, status: parsed.data.status },
        })
      : await tx.quizAttendance.create({
          data: {
            meetingId,
            enrollmentId: enrollment.id,
            studentCode: parsed.data.studentCode,
            nickname: parsed.data.nickname,
            initialAccess: "TEACHER",
            status: parsed.data.status,
            arrivedAt: now,
          },
        });
    await tx.quizAttendanceAudit.create({
      data: {
        attendanceId: saved.id,
        editorId: auth.account.id,
        reason: parsed.data.reason,
        before: current
          ? ({
              studentCode: current.studentCode,
              nickname: current.nickname,
              status: current.status,
            } as Prisma.InputJsonValue)
          : ({
              status: "ABSENT",
              studentCode: parsed.data.studentCode,
            } as Prisma.InputJsonValue),
        after: {
          studentCode: saved.studentCode,
          nickname: saved.nickname,
          status: saved.status,
          initialAccess: saved.initialAccess,
        } as Prisma.InputJsonValue,
      },
    });
    return saved;
  });

  return aquaQuizResponse(
    { attendance: { id: attendance.id, status: attendance.status } },
    { status: current ? 200 : 201 },
  );
}
