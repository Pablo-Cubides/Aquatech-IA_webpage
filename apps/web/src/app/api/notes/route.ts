import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parsePagination, createPaginatedResponse } from "@/lib/pagination";

// Validate DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please configure it in your .env file.",
  );
}

// Local Prisma singleton
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Helper to validate note data
function validateNoteData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (
    !data.university ||
    typeof data.university !== "string" ||
    data.university.trim() === ""
  ) {
    errors.push("Universidad es requerida");
  }
  if (
    !data.course ||
    typeof data.course !== "string" ||
    data.course.trim() === ""
  ) {
    errors.push("Curso es requerido");
  }
  if (!data.code || String(data.code).trim() === "") {
    errors.push("Código de estudiante es requerido");
  }
  if (
    data.grade === undefined ||
    data.grade === null ||
    isNaN(Number(data.grade))
  ) {
    errors.push("Nota debe ser un número válido");
  }

  const grade = Number(data.grade);
  if (grade < 0 || grade > 5) {
    errors.push("Nota debe estar entre 0 y 5");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * GET /api/notes
 * Query params:
 * - university: string (optional) - filter by university
 * - course: string (optional) - filter by course
 * - code: string (optional) - search by student code
 * - page: number (optional) - page number (default: 1)
 * - limit: number (optional) - items per page (default: 50, max: 100)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const university = searchParams.get("university")?.trim() || undefined;
  const course = searchParams.get("course")?.trim() || undefined;
  const code = searchParams.get("code")?.trim() || undefined;

  const { skip, take, page, limit } = parsePagination({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  try {
    // Search by code (most specific) - no pagination for single result
    if (code) {
      const note = await prisma.note.findFirst({
        where: {
          code,
          ...(university && { university }),
          ...(course && { course }),
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        note,
        found: !!note,
      });
    }

    // List courses for a university - no pagination for metadata
    if (university && !course) {
      const courses = await prisma.note.findMany({
        where: { university },
        select: { course: true },
        distinct: ["course"],
        orderBy: { course: "asc" },
      });

      return NextResponse.json({
        courses: courses.map((c) => c.course),
        count: courses.length,
      });
    }

    // List universities (no filters) - no pagination for metadata
    if (!university) {
      const universities = await prisma.note.findMany({
        select: { university: true },
        distinct: ["university"],
        orderBy: { university: "asc" },
      });

      return NextResponse.json({
        universities: universities.map((u) => u.university),
        count: universities.length,
      });
    }

    // List all notes matching university + course - with pagination
    const where = {
      university,
      ...(course && { course }),
    };

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy: { code: "asc" },
        skip,
        take,
      }),
      prisma.note.count({ where }),
    ]);

    return NextResponse.json(
      createPaginatedResponse(notes, total, page, limit),
    );
  } catch (err: any) {
    console.error("[GET /api/notes] Error:", err);
    return NextResponse.json(
      {
        error: "Error consultando notas",
        message: err.message || "Error desconocido",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/notes
 * Body: { notes: Note[] }
 */
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type debe ser application/json" },
        { status: 415 },
      );
    }

    const body = await req.json();
    const notes = body.notes;

    if (!Array.isArray(notes)) {
      return NextResponse.json(
        { error: 'El campo "notes" debe ser un array' },
        { status: 400 },
      );
    }

    if (notes.length === 0) {
      return NextResponse.json(
        { error: 'El array "notes" está vacío' },
        { status: 400 },
      );
    }

    if (notes.length > 1000) {
      return NextResponse.json(
        { error: "Máximo 1000 notas por solicitud" },
        { status: 400 },
      );
    }

    // Validate and normalize all notes
    const validNotes: any[] = [];
    const errors: Array<{ index: number; errors: string[] }> = [];

    notes.forEach((note, index) => {
      const validation = validateNoteData(note);

      if (validation.valid) {
        validNotes.push({
          university: note.university.trim(),
          course: note.course.trim(),
          code: String(note.code).trim(),
          grade: Number(note.grade),
          studentName: note.studentName?.trim() || note.name?.trim() || null,
          metadata: note.metadata || null,
        });
      } else {
        errors.push({ index, errors: validation.errors });
      }
    });

    if (validNotes.length === 0) {
      return NextResponse.json(
        {
          error: "No hay notas válidas para insertar",
          validationErrors: errors,
        },
        { status: 400 },
      );
    }

    // Insert valid notes
    const result = await prisma.note.createMany({
      data: validNotes,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      inserted: result.count,
      total: notes.length,
      valid: validNotes.length,
      invalid: errors.length,
      ...(errors.length > 0 && { validationErrors: errors.slice(0, 10) }),
    });
  } catch (err: any) {
    console.error("[POST /api/notes] Error:", err);

    if (err.code === "P2002") {
      return NextResponse.json(
        {
          error: "Algunas notas ya existen en la base de datos",
          message: err.message,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Error guardando notas",
        message: err.message || "Error desconocido",
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Operación no permitida" },
    { status: 405 },
  );
}
