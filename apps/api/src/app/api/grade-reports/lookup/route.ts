import { NextResponse } from "next/server";
import { prisma } from "@ia-next/database";
import { gradeLookupSchema } from "@ia-next/contracts";
import { lookupGradeReports } from "@/lib/grade-reports";
import { limitGradeRequest } from "@/lib/grade-request-limit";
export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};
export async function POST(request: Request) {
  const limit = await limitGradeRequest(request, "lookup");
  if (!limit.success)
    return NextResponse.json(
      {
        error:
          limit.limit === 0
            ? "La consulta no está disponible momentáneamente. Intenta más tarde."
            : "Demasiadas consultas. Espera un minuto.",
      },
      { status: limit.limit === 0 ? 503 : 429, headers },
    );
  try {
    const text = await request.text();
    if (text.length > 1024)
      return NextResponse.json(
        { error: "Solicitud demasiado grande." },
        { status: 413, headers },
      );
    const parsed = gradeLookupSchema.safeParse(JSON.parse(text));
    if (!parsed.success)
      return NextResponse.json(
        { error: "Ingresa tu código completo." },
        { status: 400, headers },
      );
    return NextResponse.json(await lookupGradeReports(prisma, parsed.data), {
      headers,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudieron consultar las calificaciones. Intenta nuevamente.",
      },
      { status: 503, headers },
    );
  }
}
