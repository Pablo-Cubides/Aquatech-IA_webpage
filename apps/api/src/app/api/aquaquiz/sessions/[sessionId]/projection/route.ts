import { NextRequest } from "next/server";
import { prisma } from "@ia-next/database";
import {
  allowAquaQuizRequest,
  aquaQuizError,
  aquaQuizResponse,
  createParticipantToken,
  getSessionForTeacher,
  hashParticipantToken,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const access = await getSessionForTeacher(request, sessionId);
  if (!access.ok) return access.response;
  const limited = await allowAquaQuizRequest(
    request,
    `projection:${access.account.id}`,
  );
  if (limited) return limited;

  const token = createParticipantToken();
  const updated = await prisma.quizSession.updateMany({
    where: {
      id: sessionId,
      meeting: { course: { ownerId: access.account.id } },
    },
    data: { projectionTokenHash: hashParticipantToken(token) },
  });
  if (updated.count !== 1)
    return aquaQuizError("La sala ya no está disponible.", 404);
  return aquaQuizResponse({ token });
}
