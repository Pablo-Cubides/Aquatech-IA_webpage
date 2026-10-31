import { NextRequest } from "next/server";
import { prisma } from "@ia-next/database";
import {
  aquaQuizError,
  aquaQuizResponse,
  getSessionForTeacher,
  getSessionParticipant,
  hashParticipantToken,
  serializeSessionState,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const projectionToken = request.headers.get("x-aquaquiz-projection");
  if (projectionToken) {
    const projection = await prisma.quizSession.findFirst({
      where: {
        id: sessionId,
        projectionTokenHash: hashParticipantToken(projectionToken),
      },
      select: { id: true },
    });
    if (!projection)
      return aquaQuizError("La clave de proyección ya no es válida.", 403);
    const state = await serializeSessionState(sessionId, null);
    return state
      ? aquaQuizResponse({ state })
      : aquaQuizError("La sesión ya no está disponible.", 404);
  }

  const access = await getSessionParticipant(request, sessionId);

  if (!access) {
    const teacher = await getSessionForTeacher(request, sessionId);
    if (!teacher.ok) {
      if (teacher.response.status === 404) return teacher.response;
      return aquaQuizError(
        "Ingresa con el PIN de la sala antes de consultar el juego.",
        401,
      );
    }
  }

  const state = await serializeSessionState(
    sessionId,
    access?.participant.id ?? null,
  );
  return state
    ? aquaQuizResponse({ state })
    : aquaQuizError("La sesión ya no está disponible.", 404);
}
