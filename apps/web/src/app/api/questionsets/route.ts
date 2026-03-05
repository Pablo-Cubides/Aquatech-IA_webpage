import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const ALLOWED_ROLES = new Set(["ADMIN", "MODERATOR"]);

async function requirePrivilegedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user?.role || !ALLOWED_ROLES.has(user.role)) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Acceso denegado. Se requiere rol de administrador." },
        { status: 403 },
      ),
    };
  }

  return { ok: true as const };
}

// Validation schema
const questionSetSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  questions: z
    .array(z.string().min(1))
    .min(1, "Debe haber al menos una pregunta"),
});

/**
 * GET /api/questionsets
 * Returns list of saved question sets
 */
export async function GET() {
  try {
    const access = await requirePrivilegedUser();
    if (!access.ok) {
      return access.response;
    }

    const questionSets = await prisma.questionSet.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questionSets);
  } catch (error) {
    console.error("Error fetching question sets:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      {
        error: "Error al obtener conjuntos de preguntas",
        details: message,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/questionsets
 * Creates a new question set with questions
 */
export async function POST(req: Request) {
  try {
    const access = await requirePrivilegedUser();
    if (!access.ok) {
      return access.response;
    }

    const body = await req.json();

    // Validate input
    const validation = questionSetSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.error.issues },
        { status: 400 },
      );
    }

    const { name, questions } = validation.data;

    // Check if name already exists
    const existing = await prisma.questionSet.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un conjunto con ese nombre" },
        { status: 409 },
      );
    }

    // Create question set with questions
    const questionSet = await prisma.questionSet.create({
      data: {
        name,
        questions: {
          create: questions.map((text) => ({ text })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(questionSet, { status: 201 });
  } catch (error) {
    console.error("Error creating question set:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error al crear conjunto de preguntas", details: message },
      { status: 500 },
    );
  }
}
