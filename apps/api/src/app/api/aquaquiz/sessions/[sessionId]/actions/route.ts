import { NextRequest } from "next/server";
import { aquaQuizActionSchema } from "@ia-next/contracts";
import { prisma } from "@ia-next/database";
import {
  aquaQuizError,
  aquaQuizResponse,
  allowAquaQuizRequest,
  getSessionForTeacher,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const access = await getSessionForTeacher(request, sessionId);
  if (!access.ok) return access.response;

  const parsed = aquaQuizActionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return aquaQuizError("No se pudo ejecutar esa acción.", 400);

  const limited = await allowAquaQuizRequest(
    request,
    `control:${access.account.id}`,
  );
  if (limited) return limited;

  const { session } = access;
  if (parsed.data.expectedVersion !== session.stateVersion) {
    return aquaQuizError(
      "La sala cambió desde que abriste el control. Actualiza la pantalla.",
      409,
    );
  }

  const now = new Date();
  const timedOut = Boolean(
    session.status === "QUESTION" &&
    session.questionEndsAt &&
    session.questionEndsAt.getTime() <= now.getTime(),
  );

  let data: {
    status: string;
    questionIndex: number;
    questionStartedAt: Date | null;
    questionEndsAt: Date | null;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  };
  switch (parsed.data.action) {
    case "start": {
      if (session.status !== "LOBBY")
        return aquaQuizError("Esta sala ya comenzó.", 409);
      const first = session.quizSet.questions[0];
      data = {
        status: "QUESTION",
        questionIndex: 0,
        questionStartedAt: now,
        questionEndsAt: new Date(now.getTime() + first.seconds * 1000),
        startedAt: now,
      };
      break;
    }
    case "reveal": {
      if (session.status !== "QUESTION")
        return aquaQuizError("No hay una pregunta para revelar.", 409);
      data = {
        status: "REVEAL",
        questionIndex: session.questionIndex,
        questionStartedAt: session.questionStartedAt,
        questionEndsAt: now,
      };
      break;
    }
    case "next": {
      if (session.status !== "REVEAL" && !timedOut) {
        return aquaQuizError(
          "Revela la respuesta o espera a que termine el tiempo.",
          409,
        );
      }
      const nextIndex = session.questionIndex + 1;
      const nextQuestion = session.quizSet.questions[nextIndex];
      if (!nextQuestion) {
        data = {
          status: "FINISHED",
          questionIndex: session.questionIndex,
          questionStartedAt: null,
          questionEndsAt: null,
          finishedAt: now,
        };
      } else {
        data = {
          status: "QUESTION",
          questionIndex: nextIndex,
          questionStartedAt: now,
          questionEndsAt: new Date(now.getTime() + nextQuestion.seconds * 1000),
        };
      }
      break;
    }
    case "finish": {
      if (session.status === "FINISHED")
        return aquaQuizError("La sala ya finalizó.", 409);
      data = {
        status: "FINISHED",
        questionIndex: session.questionIndex,
        questionStartedAt: session.questionStartedAt,
        questionEndsAt: now,
        finishedAt: now,
      };
      break;
    }
  }

  const updated = await prisma.quizSession.updateMany({
    where: { id: session.id, stateVersion: session.stateVersion },
    data: { ...data, stateVersion: { increment: 1 } },
  });
  if (updated.count !== 1)
    return aquaQuizError("La sala cambió. Actualiza la pantalla.", 409);
  return aquaQuizResponse({
    accepted: true,
    stateVersion: session.stateVersion + 1,
  });
}
