import { NextRequest } from "next/server";
import { aquaQuizAttendanceUpdateSchema } from "@ia-next/contracts";
import { prisma, Prisma } from "@ia-next/database";
import {
  aquaQuizError,
  aquaQuizResponse,
  allowAquaQuizRequest,
  requireAquaQuizTeacher,
  validationError,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string; attendanceId: string }> },
) {
  const auth = await requireAquaQuizTeacher(request);
  if (!auth.ok) return auth.response;
  const { meetingId, attendanceId } = await params;
  const limited = await allowAquaQuizRequest(
    request,
    `attendance-edit:${auth.account.id}`,
  );
  if (limited) return limited;

  const parsed = aquaQuizAttendanceUpdateSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError();
  if (
    !parsed.data.nickname &&
    !parsed.data.studentCode &&
    !parsed.data.status
  ) {
    return aquaQuizError(
      "Elige qué dato quieres corregir e indica el motivo.",
      400,
    );
  }

  const attendance = await prisma.quizAttendance.findFirst({
    where: {
      id: attendanceId,
      meetingId,
      meeting: { course: { ownerId: auth.account.id } },
    },
    include: { enrollment: { select: { courseId: true } } },
  });
  if (!attendance) return aquaQuizError("No se encontró esa asistencia.", 404);

  if (
    parsed.data.studentCode &&
    parsed.data.studentCode !== attendance.studentCode
  ) {
    const conflictingEnrollment = await prisma.quizEnrollment.findUnique({
      where: {
        courseId_studentCode: {
          courseId: attendance.enrollment.courseId,
          studentCode: parsed.data.studentCode,
        },
      },
      select: { id: true },
    });
    if (
      conflictingEnrollment &&
      conflictingEnrollment.id !== attendance.enrollmentId
    ) {
      return aquaQuizError(
        "Ese código ya pertenece a otra inscripción del curso.",
        409,
      );
    }
  }

  const before = {
    studentCode: attendance.studentCode,
    nickname: attendance.nickname,
    status: attendance.status,
  };
  const after = {
    studentCode: parsed.data.studentCode ?? attendance.studentCode,
    nickname: parsed.data.nickname ?? attendance.nickname,
    status: parsed.data.status ?? attendance.status,
  };

  await prisma.$transaction(async (tx) => {
    if (
      parsed.data.studentCode &&
      parsed.data.studentCode !== attendance.studentCode
    ) {
      await tx.quizEnrollment.update({
        where: { id: attendance.enrollmentId },
        data: { studentCode: parsed.data.studentCode },
      });
    }
    await tx.quizAttendance.update({
      where: { id: attendance.id },
      data: after,
    });
    await tx.quizAttendanceAudit.create({
      data: {
        attendanceId: attendance.id,
        editorId: auth.account.id,
        reason: parsed.data.reason,
        before: before as Prisma.InputJsonValue,
        after: after as Prisma.InputJsonValue,
      },
    });
  });

  return aquaQuizResponse({ attendance: { id: attendance.id, ...after } });
}
