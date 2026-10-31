import { NextRequest } from "next/server";
import { prisma, Prisma } from "@ia-next/database";
import { aquaQuizJoinSchema } from "@ia-next/contracts";
import {
  allowAquaQuizRequest,
  aquaQuizError,
  aquaQuizResponse,
  createParticipantToken,
  bogotaClassStart,
  getAquaQuizAccount,
  hashParticipantToken,
  participantCookieName,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limited = await allowAquaQuizRequest(request, "join");
  if (limited) return limited;

  const parsed = aquaQuizJoinSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return aquaQuizError("Ingresa el PIN, tu código y un apodo válido.", 400);

  const account = await getAquaQuizAccount(request);
  if (parsed.data.mode === "account" && !account) {
    return aquaQuizError(
      "Inicia sesión en Aquatech y vuelve a esta sala.",
      401,
    );
  }

  const session = await prisma.quizSession.findUnique({
    where: { joinCode: parsed.data.pin },
    select: {
      id: true,
      status: true,
      meetingId: true,
      quizSet: { select: { courseId: true } },
      meeting: {
        select: {
          attendanceLockedAt: true,
          lateAfterMinutes: true,
          classDate: true,
          classStartTime: true,
        },
      },
    },
  });
  if (!session || session.status === "FINISHED") {
    return aquaQuizError("No encontramos una sala abierta con ese PIN.", 404);
  }
  const courseId = session.quizSet.courseId;
  const studentCode = parsed.data.studentCode;
  const nickname = parsed.data.nickname;
  const mode = parsed.data.mode;
  const cookieName = participantCookieName(session.id);
  const otherResumeHashes = request.cookies
    .getAll()
    .filter(({ name }) => name.startsWith("aqp_"))
    .map(({ value }) => hashParticipantToken(value));

  const existingEnrollment = await prisma.quizEnrollment.findUnique({
    where: { courseId_studentCode: { courseId, studentCode } },
  });
  const existingMeetingAttendance = existingEnrollment
    ? await prisma.quizAttendance.findUnique({
        where: {
          meetingId_enrollmentId: {
            meetingId: session.meetingId,
            enrollmentId: existingEnrollment.id,
          },
        },
        select: { id: true },
      })
    : null;
  if (
    account &&
    existingEnrollment?.accountUserId &&
    existingEnrollment.accountUserId !== account.id
  ) {
    return aquaQuizError(
      "Este código está vinculado a otra cuenta. Consulta al docente.",
      409,
    );
  }
  if (!account && mode === "guest" && existingEnrollment?.accountUserId) {
    return aquaQuizError(
      "Este código se usa con una cuenta de Aquatech. Elige esa opción.",
      409,
    );
  }
  if (
    account &&
    mode === "account" &&
    existingEnrollment?.source === "GUEST" &&
    !existingEnrollment.accountUserId
  ) {
    const ownedGuest = await prisma.quizParticipant.findFirst({
      where: {
        enrollmentId: existingEnrollment.id,
        resumeTokenHash: { in: otherResumeHashes },
      },
      select: { id: true },
    });
    if (!ownedGuest) {
      return aquaQuizError(
        "Este código ya se usó como invitado. Continúa con esa sesión o pide al docente que revise el vínculo.",
        409,
      );
    }
  }

  if (
    account &&
    mode === "account" &&
    existingEnrollment?.source === "ROSTER" &&
    !existingEnrollment.accountUserId
  ) {
    const priorGuest = await prisma.quizParticipant.findFirst({
      where: { enrollmentId: existingEnrollment.id, initialAccess: "GUEST" },
      select: { resumeTokenHash: true },
    });
    if (
      priorGuest &&
      (!priorGuest.resumeTokenHash ||
        !otherResumeHashes.includes(priorGuest.resumeTokenHash))
    ) {
      return aquaQuizError(
        "Este código ya tiene una participación de invitado. Continúa con esa credencial o pide al docente que lo vincule.",
        409,
      );
    }
  }

  if (!existingEnrollment && account && mode === "account") {
    const accountEnrollment = await prisma.quizEnrollment.findUnique({
      where: {
        courseId_accountUserId: { courseId, accountUserId: account.id },
      },
      select: { studentCode: true },
    });
    if (accountEnrollment && accountEnrollment.studentCode !== studentCode) {
      return aquaQuizError(
        "Tu cuenta ya está vinculada a otro código de este curso.",
        409,
      );
    }
  }

  const existingParticipant = existingEnrollment
    ? await prisma.quizParticipant.findUnique({
        where: {
          sessionId_enrollmentId: {
            sessionId: session.id,
            enrollmentId: existingEnrollment.id,
          },
        },
        select: {
          id: true,
          nickname: true,
          initialAccess: true,
          resumeTokenHash: true,
        },
      })
    : null;
  const hasGuestProof = Boolean(
    existingParticipant?.resumeTokenHash &&
    otherResumeHashes.includes(existingParticipant.resumeTokenHash),
  );
  if (
    session.meeting.attendanceLockedAt &&
    !existingParticipant &&
    !existingMeetingAttendance
  ) {
    return aquaQuizError("El docente cerró el ingreso a esta clase.", 403);
  }
  if (
    existingParticipant &&
    existingParticipant.initialAccess === "GUEST" &&
    !hasGuestProof
  ) {
    if (
      mode !== "account" ||
      !account ||
      existingEnrollment?.accountUserId !== account.id
    ) {
      return aquaQuizError(
        "Esta participación ya existe en otro navegador. Pide al docente que recupere el acceso.",
        409,
      );
    }
  }
  if (
    existingParticipant?.initialAccess === "ACCOUNT" &&
    mode === "guest" &&
    !hasGuestProof
  ) {
    return aquaQuizError(
      "Esta participación se creó con una cuenta de Aquatech. Inicia sesión para continuar.",
      409,
    );
  }

  const newToken = existingParticipant ? null : createParticipantToken();
  const access = mode === "account" ? "ACCOUNT" : "GUEST";
  const now = new Date();
  const configuredStart = bogotaClassStart(
    session.meeting.classDate,
    session.meeting.classStartTime,
  );
  const status =
    configuredStart &&
    session.meeting.lateAfterMinutes !== null &&
    now.getTime() >
      configuredStart.getTime() + session.meeting.lateAfterMinutes * 60_000
      ? "LATE"
      : "PRESENT";

  try {
    const result = await prisma.$transaction(async (tx) => {
      let enrollment = await tx.quizEnrollment.findUnique({
        where: { courseId_studentCode: { courseId, studentCode } },
      });
      if (!enrollment) {
        enrollment = await tx.quizEnrollment.create({
          data: {
            courseId,
            studentCode,
            accountUserId: mode === "account" ? account?.id : null,
            source: access,
          },
        });
      } else if (
        mode === "account" &&
        account &&
        (enrollment.source === "GUEST" || enrollment.source === "ROSTER") &&
        !enrollment.accountUserId
      ) {
        const priorGuest = await tx.quizParticipant.findFirst({
          where: { enrollmentId: enrollment.id, initialAccess: "GUEST" },
          select: { id: true },
        });
        if (enrollment.source === "GUEST" || priorGuest) {
          const proof = otherResumeHashes.length
            ? await tx.quizParticipant.findFirst({
                where: {
                  enrollmentId: enrollment.id,
                  resumeTokenHash: { in: otherResumeHashes },
                },
                select: { id: true },
              })
            : null;
          if (!proof) throw new Error("AQUAQUIZ_GUEST_PROOF_REQUIRED");
        }
        enrollment = await tx.quizEnrollment.update({
          where: { id: enrollment.id },
          data: {
            accountUserId: account.id,
            source: enrollment.source === "ROSTER" ? "ROSTER" : "ACCOUNT",
          },
        });
      }

      if (
        mode === "account" &&
        account &&
        enrollment.accountUserId !== account.id
      ) {
        throw new Error("AQUAQUIZ_ACCOUNT_CONFLICT");
      }
      if (
        mode === "guest" &&
        enrollment.accountUserId &&
        enrollment.accountUserId !== account?.id
      ) {
        throw new Error("AQUAQUIZ_ACCOUNT_CONFLICT");
      }

      let participant = await tx.quizParticipant.findUnique({
        where: {
          sessionId_enrollmentId: {
            sessionId: session.id,
            enrollmentId: enrollment.id,
          },
        },
        select: { id: true, initialAccess: true, resumeTokenHash: true },
      });
      if (
        participant &&
        participant.initialAccess === "GUEST" &&
        !hasGuestProof
      ) {
        if (mode !== "account" || enrollment.accountUserId !== account?.id) {
          throw new Error("AQUAQUIZ_GUEST_PROOF_REQUIRED");
        }
      }
      if (
        participant &&
        participant.initialAccess === "ACCOUNT" &&
        mode === "guest" &&
        !hasGuestProof
      ) {
        throw new Error("AQUAQUIZ_ACCOUNT_CONFLICT");
      }

      const attendance = await tx.quizAttendance.findUnique({
        where: {
          meetingId_enrollmentId: {
            meetingId: session.meetingId,
            enrollmentId: enrollment.id,
          },
        },
        select: { id: true },
      });
      if (!attendance) {
        await tx.quizAttendance.create({
          data: {
            meetingId: session.meetingId,
            enrollmentId: enrollment.id,
            studentCode,
            nickname,
            initialAccess: access,
            status,
            arrivedAt: now,
          },
        });
      }

      if (participant) {
        await tx.quizParticipant.update({
          where: { id: participant.id },
          data: { nickname },
        });
      } else {
        participant = await tx.quizParticipant.create({
          data: {
            sessionId: session.id,
            enrollmentId: enrollment.id,
            nickname,
            initialAccess: access,
            resumeTokenHash: hashParticipantToken(newToken!),
          },
          select: { id: true, initialAccess: true, resumeTokenHash: true },
        });
      }
      return participant;
    });

    const response = aquaQuizResponse(
      {
        sessionId: session.id,
        participant: { id: result.id, nickname },
        attendanceRecorded: true,
        message: "Asistencia registrada.",
      },
      { status: existingParticipant ? 200 : 201 },
    );
    if (newToken) {
      response.cookies.set(participantCookieName(session.id), newToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/api/aquaquiz",
        maxAge: 60 * 60 * 24,
      });
    }
    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "AQUAQUIZ_GUEST_PROOF_REQUIRED"
    ) {
      return aquaQuizError(
        "Esta participación requiere su credencial de invitado o una revisión del docente.",
        409,
      );
    }
    if (
      error instanceof Error &&
      error.message === "AQUAQUIZ_ACCOUNT_CONFLICT"
    ) {
      return aquaQuizError(
        "Este código está vinculado a otra cuenta. Consulta al docente.",
        409,
      );
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return aquaQuizError(
        "El código se registró al mismo tiempo. Vuelve a entrar a la sala.",
        409,
      );
    }
    throw error;
  }
}
