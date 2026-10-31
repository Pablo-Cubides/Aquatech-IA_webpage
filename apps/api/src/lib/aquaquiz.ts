import { createHash, randomBytes } from "node:crypto";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@ia-next/database";

const TEACHER_ROLES = new Set(["ADMIN", "MODERATOR"]);

export function aquaQuizResponse<T>(data: T, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

export function aquaQuizError(message: string, status: number) {
  return aquaQuizResponse({ error: message }, { status });
}

export function validationError() {
  return aquaQuizError("Revisa los datos ingresados.", 400);
}

export async function allowAquaQuizRequest(
  request: Request,
  identifier: string,
): Promise<NextResponse | null> {
  try {
    const { checkRateLimit, getClientIP } = await import("./rate-limit");
    const ip = getClientIP(request);
    const result = await checkRateLimit("api", `aquaquiz:${identifier}:${ip}`);
    if (!result.success) {
      return aquaQuizResponse(
        {
          error:
            "Demasiadas solicitudes. Espera un momento e inténtalo otra vez.",
        },
        {
          status: 429,
          headers: { "Retry-After": "60" },
        },
      );
    }
    return null;
  } catch {
    return null;
  }
}

export async function getAquaQuizAccount(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  const secureCookie =
    process.env.NEXTAUTH_URL?.startsWith("https://") ??
    process.env.NODE_ENV === "production";
  const token = await getToken({
    req: request,
    secret,
    secureCookie,
    cookieName: secureCookie
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
  }).catch(() => null);

  const accountId = token?.uid;
  if (typeof accountId !== "string" || !accountId) return null;

  return prisma.user.findUnique({
    where: { id: accountId },
    select: { id: true, role: true },
  });
}

export async function requireAquaQuizTeacher(request: NextRequest) {
  const account = await getAquaQuizAccount(request);
  if (!account) {
    return {
      ok: false as const,
      response: aquaQuizError("Inicia sesión para continuar.", 401),
    };
  }
  if (!TEACHER_ROLES.has(account.role)) {
    return {
      ok: false as const,
      response: aquaQuizError(
        "No tienes permiso para administrar clases.",
        403,
      ),
    };
  }
  return { ok: true as const, account };
}

export function participantCookieName(sessionId: string) {
  return `aqp_${sessionId}`;
}

export function hashParticipantToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createParticipantToken() {
  return randomBytes(32).toString("base64url");
}

export function bogotaClassStart(
  classDate: Date,
  classStartTime: string | null,
) {
  if (!classStartTime) return null;
  const [year, month, day] = classDate
    .toISOString()
    .slice(0, 10)
    .split("-")
    .map(Number);
  const [hour, minute] = classStartTime.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour + 5, minute));
}

export function serializeOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];
  return options.filter(
    (option): option is string => typeof option === "string",
  );
}

export async function getSessionForTeacher(
  request: NextRequest,
  sessionId: string,
) {
  const auth = await requireAquaQuizTeacher(request);
  if (!auth.ok) return { ok: false as const, response: auth.response };

  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: {
      meeting: { include: { course: { select: { id: true, ownerId: true } } } },
      quizSet: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });
  if (!session) {
    return {
      ok: false as const,
      response: aquaQuizError("La sesión no existe.", 404),
    };
  }
  if (session.meeting.course.ownerId !== auth.account.id) {
    return {
      ok: false as const,
      response: aquaQuizError("No tienes acceso a esta sesión.", 403),
    };
  }
  return { ok: true as const, account: auth.account, session };
}

export async function getSessionParticipant(
  request: NextRequest,
  sessionId: string,
) {
  const token = request.cookies.get(participantCookieName(sessionId))?.value;
  if (token) {
    const participant = await prisma.quizParticipant.findFirst({
      where: {
        sessionId,
        resumeTokenHash: hashParticipantToken(token),
      },
      include: {
        enrollment: { select: { accountUserId: true, studentCode: true } },
      },
    });
    if (participant) return { participant, account: null };
  }

  const account = await getAquaQuizAccount(request);
  if (!account) return null;
  const participant = await prisma.quizParticipant.findFirst({
    where: { sessionId, enrollment: { accountUserId: account.id } },
    include: {
      enrollment: { select: { accountUserId: true, studentCode: true } },
    },
  });
  return participant ? { participant, account } : null;
}

export async function serializeSessionState(
  sessionId: string,
  participantId: string | null,
) {
  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: {
      meeting: { select: { id: true, courseId: true } },
      quizSet: { include: { questions: { orderBy: { order: "asc" } } } },
      participants: {
        select: {
          id: true,
          nickname: true,
          score: true,
          joinedAt: true,
        },
        orderBy: [{ score: "desc" }, { joinedAt: "asc" }],
      },
    },
  });
  if (!session) return null;

  const now = Date.now();
  const timedOut =
    session.status === "QUESTION" &&
    session.questionEndsAt !== null &&
    now >= session.questionEndsAt.getTime();
  const phase = timedOut ? "REVEAL" : session.status;
  const question = session.quizSet.questions[session.questionIndex] ?? null;
  const reveal = phase === "REVEAL" || phase === "FINISHED";
  const participant = participantId
    ? session.participants.find((entry) => entry.id === participantId)
    : null;
  const myAnswer =
    question && participantId
      ? await prisma.quizAnswer.findUnique({
          where: {
            participantId_questionId: {
              participantId,
              questionId: question.id,
            },
          },
          select: { correct: true, points: true, optionIndex: true },
        })
      : null;
  const activeQuestionAnswers = question
    ? await prisma.quizAnswer.findMany({
        where: { questionId: question.id, participant: { sessionId } },
        select: { participantId: true, points: true },
      })
    : [];
  const activePoints = new Map<string, number>(
    activeQuestionAnswers.map((answer): [string, number] => [
      answer.participantId,
      answer.points,
    ]),
  );
  const answerCount = activeQuestionAnswers.length;

  const adjustedScore = (entry: (typeof session.participants)[number]) =>
    entry.score - (!reveal && question ? (activePoints.get(entry.id) ?? 0) : 0);
  const orderedLeaderboard = [...session.participants].sort(
    (left, right) =>
      adjustedScore(right) - adjustedScore(left) ||
      left.joinedAt.getTime() - right.joinedAt.getTime(),
  );
  const nicknameCounts = new Map<string, number>();
  for (const entry of orderedLeaderboard) {
    const key = entry.nickname.toLocaleLowerCase("es-CO");
    nicknameCounts.set(key, (nicknameCounts.get(key) ?? 0) + 1);
  }
  const nicknameOccurrences = new Map<string, number>();
  const leaderboard = orderedLeaderboard.slice(0, 10).map((entry) => {
    const key = entry.nickname.toLocaleLowerCase("es-CO");
    const occurrence = (nicknameOccurrences.get(key) ?? 0) + 1;
    nicknameOccurrences.set(key, occurrence);
    return {
      place:
        orderedLeaderboard.filter(
          (candidate) => adjustedScore(candidate) > adjustedScore(entry),
        ).length + 1,
      nickname:
        (nicknameCounts.get(key) ?? 0) > 1
          ? `${entry.nickname} · ${occurrence}`
          : entry.nickname,
      score: adjustedScore(entry),
    };
  });
  const currentParticipantScore = participant
    ? participant.score - (!reveal && question ? (myAnswer?.points ?? 0) : 0)
    : null;

  return {
    sessionId: session.id,
    pin: session.joinCode,
    phase,
    stateVersion: session.stateVersion,
    serverNow: new Date(now).toISOString(),
    questionIndex: session.questionIndex,
    questionCount: session.quizSet.questions.length,
    question: question
      ? {
          prompt: question.prompt,
          options: serializeOptions(question.options),
          seconds: question.seconds,
          ...(reveal
            ? {
                correctOptionIndex: question.correctOptionIndex,
                explanation: question.explanation,
              }
            : {}),
        }
      : null,
    opensAt: session.questionStartedAt?.toISOString() ?? null,
    closesAt: session.questionEndsAt?.toISOString() ?? null,
    hasAnswered: myAnswer !== null,
    myCorrect: reveal ? (myAnswer?.correct ?? null) : null,
    myOptionIndex: myAnswer?.optionIndex ?? null,
    myScore: currentParticipantScore,
    myPlace:
      participant && currentParticipantScore !== null
        ? orderedLeaderboard.filter(
            (entry) => adjustedScore(entry) > currentParticipantScore,
          ).length + 1
        : null,
    participantCount: session.participants.length,
    answerCount,
    leaderboard,
  };
}

export function csvCell(value: string | number | Date | null | undefined) {
  const raw = value instanceof Date ? value.toISOString() : String(value ?? "");
  const safe = /^[\s]*[=+@\-]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}
