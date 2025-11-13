import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "file:./dev.db") {
  process.env.DATABASE_URL =
    "postgresql://postgres.nzkxfrvejnicvgizlmza:ddSnabadRAHCAxw3@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";
  process.env.DIRECT_URL =
    "postgresql://postgres.nzkxfrvejnicvgizlmza:ddSnabadRAHCAxw3@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require";
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
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);

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
    console.error(`Error fetching question set ${params.id}:`, error);
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
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);

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
    console.error(`Error deleting question set ${params.id}:`, error);
    return NextResponse.json(
      { error: "Error al eliminar conjunto", details: error.message },
      { status: 500 },
    );
  }
}
