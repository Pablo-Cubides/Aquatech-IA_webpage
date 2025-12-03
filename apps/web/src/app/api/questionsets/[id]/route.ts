import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


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
  _req: Request,
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
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
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Check admin role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json(
        { error: "Acceso denegado. Se requiere rol de administrador." },
        { status: 403 },
      );
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error deleting question set ${idStr}:`, errorMessage);
    return NextResponse.json(
      { error: "Error al eliminar conjunto" },
      { status: 500 },
    );
  }
}
