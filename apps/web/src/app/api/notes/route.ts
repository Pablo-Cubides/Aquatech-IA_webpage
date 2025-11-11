import { NextResponse } from 'next/server';
import { prisma } from '@ia-next/database';

// Simple notes API for the visualizador
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const university = searchParams.get('university') ?? undefined;
  const course = searchParams.get('course') ?? undefined;
  const code = searchParams.get('code') ?? undefined;

  try {
    if (code) {
      const note = await prisma.note.findFirst({
        where: { university, course, code },
      });
      return NextResponse.json({ note });
    }

    // when code not provided, allow listing universities or courses
    if (university && !course) {
      const courses = await prisma.note.findMany({
        where: { university },
        select: { course: true },
        distinct: ['course'],
      });
      return NextResponse.json({ courses: courses.map((c: any) => c.course) });
    }

    if (!university) {
      const universities = await prisma.note.findMany({
        select: { university: true },
        distinct: ['university'],
      });
      return NextResponse.json({
        universities: universities.map((u: any) => u.university),
      });
    }

    // fallback - return matching notes
    const notes = await prisma.note.findMany({ where: { university, course } });
    return NextResponse.json({ notes });
  } catch (err) {
    console.error('GET /api/notes error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    // Expect JSON { notes: [...] }
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const notes = body.notes as Array<any> | undefined;
      if (!Array.isArray(notes)) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
      }

      // Normalize and insert many
      const createData = notes.map((n) => ({
        university: n.university || n.univ || '',
        course: n.course || n.curso || '',
        code: String(n.code || n.codigo || ''),
        grade: Number(n.grade ?? n.nota ?? 0),
        studentName: n.name || n.studentName || null,
        metadata: n.metadata || null,
      }));

      // Using createMany for performance; skipDuplicates true
      await prisma.note.createMany({ data: createData, skipDuplicates: true });
      return NextResponse.json({ ok: true, inserted: createData.length });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
  } catch (err) {
    console.error('POST /api/notes error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  // Protected in production - not implemented here
  return NextResponse.json({ error: 'Not allowed' }, { status: 405 });
}
