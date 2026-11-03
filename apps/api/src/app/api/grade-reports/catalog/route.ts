import { NextResponse } from "next/server";
import { prisma } from "@ia-next/database";
import { limitGradeRequest } from "@/lib/grade-request-limit";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const headers = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
  };
  const limit = await limitGradeRequest(request, "catalog");
  if (!limit.success)
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429, headers },
    );
  try {
    const courses = await prisma.gradeReport.findMany({
      where: { published: true },
      select: {
        period: true,
        courseId: true,
        courseTitle: true,
        groupLabel: true,
        university: true,
        cut: true,
      },
      distinct: ["period", "courseId", "cut"],
      orderBy: [{ period: "desc" }, { courseTitle: "asc" }],
    });
    return NextResponse.json({ courses }, { headers });
  } catch {
    return NextResponse.json(
      { error: "El catálogo de calificaciones no está disponible." },
      { status: 503, headers },
    );
  }
}
