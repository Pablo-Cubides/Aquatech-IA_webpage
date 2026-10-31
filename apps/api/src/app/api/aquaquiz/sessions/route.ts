import { randomInt } from "node:crypto";
import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@ia-next/database";
import {
  allowAquaQuizRequest,
  aquaQuizError,
  aquaQuizResponse,
  requireAquaQuizTeacher,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

const startSessionSchema = z.object({
  meetingId: z.string().min(8).max(36),
  quizSetId: z.string().min(8).max(36),
  speedBonus: z.boolean().default(false),
});

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAquaQuizTeacher(request);
  if (!auth.ok) return auth.response;
  const parsed = startSessionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return aquaQuizError("Selecciona la clase y el cuestionario.", 400);

  const limited = await allowAquaQuizRequest(
    request,
    `sessions:${auth.account.id}`,
  );
  if (limited) return limited;

  const [meeting, quizSet] = await Promise.all([
    prisma.quizMeeting.findFirst({
      where: {
        id: parsed.data.meetingId,
        course: { ownerId: auth.account.id },
      },
      select: { id: true, courseId: true },
    }),
    prisma.quizSet.findFirst({
      where: {
        id: parsed.data.quizSetId,
        course: { ownerId: auth.account.id },
      },
      select: {
        id: true,
        courseId: true,
        _count: { select: { questions: true } },
      },
    }),
  ]);
  if (!meeting || !quizSet || meeting.courseId !== quizSet.courseId) {
    return aquaQuizError(
      "Ese cuestionario no pertenece al curso de la clase.",
      404,
    );
  }
  if (quizSet._count.questions < 1) {
    return aquaQuizError(
      "Agrega al menos una pregunta antes de abrir la sala.",
      400,
    );
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const joinCode = randomInt(0, 1_000_000).toString().padStart(6, "0");
    try {
      const session = await prisma.quizSession.create({
        data: {
          meetingId: meeting.id,
          quizSetId: quizSet.id,
          joinCode,
          speedBonus: parsed.data.speedBonus,
        },
        select: { id: true, joinCode: true, status: true },
      });
      return aquaQuizResponse({ session }, { status: 201 });
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
  }
  return aquaQuizError(
    "No se pudo generar un código de ingreso. Inténtalo otra vez.",
    503,
  );
}
