import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Validate DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please configure it in your .env file.",
  );
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * GET /api/questionsets/[id]
 * Returns specific question set with all questions
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let idStr = "unknown";
  try {
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
  } catch (error: any) {
    console.error(`Error fetching question set ${idStr}:`, error);
    return NextResponse.json(
      { error: "Error al obtener conjunto", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/questionsets/[id]
 * Deletes a question set and all its questions (CASCADE)
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let idStr = "unknown";
  try {
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
  } catch (error: any) {
    console.error(`Error deleting question set ${idStr}:`, error);
    return NextResponse.json(
      { error: "Error al eliminar conjunto", details: error.message },
      { status: 500 },
    );
  }
}
