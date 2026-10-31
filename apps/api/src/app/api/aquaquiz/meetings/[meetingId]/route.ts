import { NextRequest } from "next/server";
import { prisma } from "@ia-next/database";
import {
  aquaQuizError,
  aquaQuizResponse,
  allowAquaQuizRequest,
  csvCell,
  requireAquaQuizTeacher,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> },
) {
  const auth = await requireAquaQuizTeacher(request);
  if (!auth.ok) return auth.response;

  const { meetingId } = await params;
  const meeting = await prisma.quizMeeting.findFirst({
    where: { id: meetingId, course: { ownerId: auth.account.id } },
    include: {
      attendances: {
        orderBy: [{ studentCode: "asc" }],
        select: {
          id: true,
          enrollmentId: true,
          studentCode: true,
          nickname: true,
          initialAccess: true,
          status: true,
          arrivedAt: true,
        },
      },
      sessions: {
        orderBy: { createdAt: "desc" },
        include: {
          quizSet: {
            select: { title: true, _count: { select: { questions: true } } },
          },
          participants: {
            orderBy: [{ score: "desc" }, { joinedAt: "asc" }],
            select: {
              nickname: true,
              score: true,
              initialAccess: true,
              enrollment: { select: { id: true, studentCode: true } },
              answers: { select: { correct: true } },
            },
          },
        },
      },
      course: {
        select: {
          title: true,
          groupName: true,
          enrollments: {
            select: { id: true, studentCode: true, source: true },
          },
        },
      },
    },
  });
  if (!meeting) return aquaQuizError("No se encontró esa clase.", 404);

  const rowsByEnrollment = new Map<
    string,
    {
      attendanceId: string | null;
      enrollmentId: string;
      studentCode: string;
      nickname: string;
      initialAccess: string;
      status: string;
      firstArrival: Date | null;
      questionsAnswered: number;
      correctAnswers: number;
      score: number;
    }
  >(
    meeting.attendances.map((attendance) => [
      attendance.enrollmentId,
      {
        attendanceId: attendance.id,
        enrollmentId: attendance.enrollmentId,
        studentCode: attendance.studentCode,
        nickname: attendance.nickname,
        initialAccess: attendance.initialAccess,
        status: attendance.status,
        firstArrival:
          attendance.initialAccess === "TEACHER" &&
          attendance.status === "EXCUSED"
            ? null
            : attendance.arrivedAt,
        questionsAnswered: 0,
        correctAnswers: 0,
        score: 0,
      },
    ]),
  );

  for (const session of meeting.sessions) {
    for (const participant of session.participants) {
      const current = rowsByEnrollment.get(participant.enrollment.id);
      if (current) {
        current.questionsAnswered += participant.answers.length;
        current.correctAnswers += participant.answers.filter(
          (answer) => answer.correct,
        ).length;
        current.score += participant.score;
      }
    }
  }

  if (meeting.attendanceLockedAt) {
    for (const enrollment of meeting.course.enrollments) {
      if (
        enrollment.source === "ROSTER" &&
        !rowsByEnrollment.has(enrollment.id)
      ) {
        rowsByEnrollment.set(enrollment.id, {
          attendanceId: null,
          enrollmentId: enrollment.id,
          studentCode: enrollment.studentCode,
          nickname: "",
          initialAccess: "",
          status: "ABSENT",
          firstArrival: null,
          questionsAnswered: 0,
          correctAnswers: 0,
          score: 0,
        });
      }
    }
  }

  const rows = [...rowsByEnrollment.values()].sort((left, right) =>
    left.studentCode.localeCompare(right.studentCode, "es-CO", {
      numeric: true,
    }),
  );

  if (request.nextUrl.searchParams.get("format") === "csv") {
    const csv = [
      [
        "Fecha",
        "Curso",
        "Grupo",
        "Código",
        "Apodo",
        "Ingreso",
        "Primera entrada",
        "Estado",
        "Respuestas",
        "Aciertos",
        "Puntos",
      ],
      ...rows.map((row) => [
        meeting.classDate.toISOString().slice(0, 10),
        meeting.course.title,
        meeting.course.groupName,
        row.studentCode,
        row.nickname,
        row.initialAccess,
        row.firstArrival?.toISOString() ?? "",
        row.status,
        row.questionsAnswered,
        row.correctAnswers,
        row.score,
      ]),
    ]
      .map((cells) => cells.map(csvCell).join(","))
      .join("\r\n");
    return new Response(`\uFEFF${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="aquatech-asistencia-${meeting.classDate.toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  }

  return aquaQuizResponse({
    meeting: {
      id: meeting.id,
      date: meeting.classDate.toISOString().slice(0, 10),
      startTime: meeting.classStartTime,
      lateAfterMinutes: meeting.lateAfterMinutes,
      attendanceLocked: Boolean(meeting.attendanceLockedAt),
      lockedAt: meeting.attendanceLockedAt,
      course: meeting.course,
      sessions: meeting.sessions.map((session) => {
        const nicknameCounts = new Map<string, number>();
        for (const participant of session.participants) {
          const key = participant.nickname.toLocaleLowerCase("es-CO");
          nicknameCounts.set(key, (nicknameCounts.get(key) ?? 0) + 1);
        }
        const nicknameOccurrences = new Map<string, number>();
        return {
          id: session.id,
          pin: session.joinCode,
          phase: session.status,
          quizTitle: session.quizSet.title,
          questionCount: session.quizSet._count.questions,
          participantCount: session.participants.length,
          leaderboard: session.participants
            .slice(0, 10)
            .map((participant, index) => {
              const key = participant.nickname.toLocaleLowerCase("es-CO");
              const occurrence = (nicknameOccurrences.get(key) ?? 0) + 1;
              nicknameOccurrences.set(key, occurrence);
              return {
                place: index + 1,
                nickname:
                  (nicknameCounts.get(key) ?? 0) > 1
                    ? `${participant.nickname} · ${occurrence}`
                    : participant.nickname,
                score: participant.score,
              };
            }),
        };
      }),
    },
    rows,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> },
) {
  const auth = await requireAquaQuizTeacher(request);
  if (!auth.ok) return auth.response;
  const { meetingId } = await params;
  const limited = await allowAquaQuizRequest(
    request,
    `attendance:${auth.account.id}`,
  );
  if (limited) return limited;
  const body: unknown = await request.json().catch(() => null);
  if (
    typeof body !== "object" ||
    body === null ||
    !("locked" in body) ||
    typeof body.locked !== "boolean"
  ) {
    return aquaQuizError(
      "Selecciona si quieres abrir o cerrar la asistencia.",
      400,
    );
  }

  const updated = await prisma.quizMeeting.updateMany({
    where: { id: meetingId, course: { ownerId: auth.account.id } },
    data: { attendanceLockedAt: body.locked ? new Date() : null },
  });
  if (updated.count !== 1)
    return aquaQuizError("No se encontró esa clase.", 404);
  return aquaQuizResponse({ attendanceLocked: body.locked });
}
