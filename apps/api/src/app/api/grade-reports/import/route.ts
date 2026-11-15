import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAquaQuizAccount } from "@/lib/aquaquiz";
import { prisma } from "@ia-next/database";
import { importGradeReports } from "@/lib/grade-reports";
import { limitGradeRequest } from "@/lib/grade-request-limit";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  const account = await getAquaQuizAccount(request);
  if (!account)
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401, headers },
    );
  if (account.role !== "ADMIN")
    return NextResponse.json({ error: "Prohibido." }, { status: 403, headers });
  const limit = await limitGradeRequest(request, "import", account.id);
  if (!limit.success)
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429, headers },
    );
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > 3000000)
      return NextResponse.json(
        { error: "El archivo excede 3 MB." },
        { status: 413, headers },
      );
    const body = JSON.parse(text);
    if (body.publish !== undefined && typeof body.publish !== "boolean")
      throw Error("Elige si deseas publicar la consulta.");
    return NextResponse.json(
      {
        ok: true,
        ...(await importGradeReports(
          prisma,
          body.batch,
          body.publish === true,
        )),
      },
      { headers },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Exportación inválida.";
    return NextResponse.json(
      {
        error:
          message.includes("versión") || message.includes("archivos distintos")
            ? message
            : "El archivo debe ser una exportación conciliada y sin nombres de Colega.",
      },
      { status: 400, headers },
    );
  }
}
