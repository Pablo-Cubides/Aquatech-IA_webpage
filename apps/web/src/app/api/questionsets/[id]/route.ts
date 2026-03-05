import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const ALLOWED_ROLES = new Set(["ADMIN", "MODERATOR"]);

const updateQuestionSetSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido").max(200),
  questions: z
    .array(z.string().trim().min(1, "Pregunta inválida"))
    .min(1, "Debe haber al menos una pregunta"),
});

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

/**
 * GET /api/questionsets/[id]
 * Returns specific question set with all questions
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let idStr = "unknown";
  try {
    const access = await requirePrivilegedUser();
    if (!access.ok) {
      return access.response;
    }

    const resolvedParams = await params;
    idStr = resolvedParams.id;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const questionSet = await prisma.questionSet.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!questionSet) {
      return NextResponse.json(
        { error: "Conjunto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(questionSet);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error fetching question set ${idStr}:`, errorMessage);
    return NextResponse.json(
      { error: "Error al obtener conjunto" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/questionsets/[id]
 * Deletes a question set and all its questions (CASCADE)
 * Requires authentication and ADMIN role
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let idStr = "unknown";
  try {
    const access = await requirePrivilegedUser();
    if (!access.ok) {
      return access.response;
    }

    const resolvedParams = await params;
    idStr = resolvedParams.id;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Check if exists
    const existing = await prisma.questionSet.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Conjunto no encontrado" },
        { status: 404 },
      );
    }

    // Delete (questions will cascade delete due to FK relation)
    await prisma.questionSet.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Conjunto eliminado exitosamente",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error deleting question set ${idStr}:`, errorMessage);
    return NextResponse.json(
      { error: "Error al eliminar conjunto" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/questionsets/[id]
 * Updates a question set name and/or questions
 * Requires authentication and ADMIN role
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let idStr = "unknown";
  try {
    const access = await requirePrivilegedUser();
    if (!access.ok) {
      return access.response;
    }

    const resolvedParams = await params;
    idStr = resolvedParams.id;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const parsedBody = updateQuestionSetSchema.safeParse(await req.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsedBody.error.issues },
        { status: 400 },
      );
    }

    const { name, questions } = parsedBody.data;

    // Check if exists
    const existing = await prisma.questionSet.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Conjunto no encontrado" },
        { status: 404 },
      );
    }

    // Check for name conflict (if name changed)
    if (name !== existing.name) {
      const nameConflict = await prisma.questionSet.findUnique({
        where: { name },
      });
      if (nameConflict) {
        return NextResponse.json(
          { error: "Ya existe un conjunto con ese nombre" },
          { status: 409 },
        );
      }
    }

    // Update: delete old questions and create new ones
    await prisma.$transaction([
      prisma.question.deleteMany({
        where: { questionSetId: id },
      }),
      prisma.questionSet.update({
        where: { id },
        data: {
          name,
          questions: {
            create: questions.map((text: string) => ({ text })),
          },
        },
      }),
    ]);

    // Fetch updated set
    const updatedSet = await prisma.questionSet.findUnique({
      where: { id },
      include: {
        questions: {
          select: { id: true, text: true },
          orderBy: { id: "asc" },
        },
      },
    });

    return NextResponse.json(updatedSet);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error updating question set ${idStr}:`, errorMessage);
    return NextResponse.json(
      { error: "Error al actualizar conjunto" },
      { status: 500 },
    );
  }
}
