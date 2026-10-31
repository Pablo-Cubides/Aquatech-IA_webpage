import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { aquaQuizAnswerSchema } from "@ia-next/contracts";
import { prisma } from "@ia-next/database";
import {
  allowAquaQuizRequest,
  aquaQuizError,
  aquaQuizResponse,
  getSessionParticipant,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const participant = await getSessionParticipant(request, sessionId);
  if (!participant)
    return aquaQuizError("Primero ingresa a esta sala con su PIN.", 401);

  const limited = await allowAquaQuizRequest(
    request,
    `answer:${participant.participant.id}`,
  );
  if (limited) return limited;

  const parsed = aquaQuizAnswerSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return aquaQuizError("Selecciona una de las opciones disponibles.", 400);

  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: {
      quizSet: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });
  const now = new Date();
  if (
    !session ||
    session.status !== "QUESTION" ||
    !session.questionEndsAt ||
    session.questionEndsAt.getTime() <= now.getTime()
  ) {
    return aquaQuizError("El tiempo para responder ya terminó.", 409);
  }

  const question = session.quizSet.questions[session.questionIndex];
  if (!question) return aquaQuizError("No hay una pregunta activa.", 409);
  const choices = Array.isArray(question.options) ? question.options : [];
  if (parsed.data.optionIndex >= choices.length) {
    return aquaQuizError("Esa opción no está disponible.", 400);
  }

  const saved = await prisma.quizAnswer.findUnique({
    where: {
      participantId_questionId: {
        participantId: participant.participant.id,
        questionId: question.id,
      },
    },
  });
  if (saved) {
    if (
      saved.requestId === parsed.data.requestId &&
      saved.optionIndex === parsed.data.optionIndex
    ) {
      return aquaQuizResponse({ accepted: true, repeated: true });
    }
    if (saved.optionIndex === parsed.data.optionIndex) {
      return aquaQuizResponse({ accepted: true, repeated: true });
    }
    return aquaQuizError("Ya enviaste una respuesta para esta pregunta.", 409);
  }

  const correct = parsed.data.optionIndex === question.correctOptionIndex;
  const duration =
    session.questionEndsAt.getTime() - session.questionStartedAt!.getTime();
  const points = correct
    ? 1000 +
      (session.speedBonus
        ? Math.min(
            200,
            Math.max(
              0,
              Math.round(
                (200 * (session.questionEndsAt.getTime() - now.getTime())) /
                  duration,
              ),
            ),
          )
        : 0)
    : 0;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.quizAnswer.create({
        data: {
          participantId: participant.participant.id,
          questionId: question.id,
          optionIndex: parsed.data.optionIndex,
          requestId: parsed.data.requestId,
          correct,
          points,
          answeredAt: now,
        },
      });
      if (correct) {
        await tx.quizParticipant.update({
          where: { id: participant.participant.id },
          data: { score: { increment: points } },
        });
      }
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return aquaQuizError("La respuesta ya quedó registrada.", 409);
    }
    throw error;
  }

  return aquaQuizResponse(
    { accepted: true, repeated: false, responseId: randomUUID() },
    { status: 201 },
  );
}
