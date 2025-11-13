import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'file:./dev.db') {
  process.env.DATABASE_URL = 'postgresql://postgres.nzkxfrvejnicvgizlmza:ddSnabadRAHCAxw3@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require';
  process.env.DIRECT_URL = 'postgresql://postgres.nzkxfrvejnicvgizlmza:ddSnabadRAHCAxw3@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require';
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Validation schema
const questionSetSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  questions: z.array(z.string().min(1)).min(1, 'Debe haber al menos una pregunta'),
});

/**
 * GET /api/questionsets
 * Returns list of saved question sets
 */
export async function GET() {
  try {
    const questionSets = await prisma.questionSet.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(questionSets);
  } catch (error: any) {
    console.error('Error fetching question sets:', error);
    return NextResponse.json(
      { error: 'Error al obtener conjuntos de preguntas', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/questionsets
 * Creates a new question set with questions
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const validation = questionSetSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, questions } = validation.data;

    // Check if name already exists
    const existing = await prisma.questionSet.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un conjunto con ese nombre' },
        { status: 409 }
      );
    }

    // Create question set with questions
    const questionSet = await prisma.questionSet.create({
      data: {
        name,
        questions: {
          create: questions.map(text => ({ text })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(questionSet, { status: 201 });
  } catch (error: any) {
    console.error('Error creating question set:', error);
    return NextResponse.json(
      { error: 'Error al crear conjunto de preguntas', details: error.message },
      { status: 500 }
    );
  }
}
