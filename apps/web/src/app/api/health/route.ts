import { NextRequest, NextResponse } from "next/server";
import { getHealthReport } from "@/lib/health";
import { getDegradationSnapshot } from "@/lib/observability/degradation";
import { getAdminSession } from "@/lib/security/admin-session";
import { verifyAgentToken } from "@/lib/security/agent-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * GET /api/health
 *
 * - 200 `ok`: todo lo crítico responde.
 * - 200 `degraded`: algo opcional falla (el sitio funciona).
 * - 503 `down`: falla una dependencia crítica (la base de datos).
 *
 * Sin autenticación solo se devuelve `{ status, timestamp }`: nada de
 * infraestructura. El detalle por dependencia (tiempos, qué falló) lo ve un
 * ADMIN con sesión o quien presente `Authorization: Bearer <HEALTH_CHECK_TOKEN>`
 * (para el monitor de disponibilidad).
 */
export async function GET(request: NextRequest) {
  const report = await getHealthReport();
  const httpStatus = report.status === "down" ? 503 : 200;

  const bearer = request.headers.get("authorization");
  const detailed =
    (bearer !== null &&
      verifyAgentToken(bearer, process.env.HEALTH_CHECK_TOKEN?.trim() || undefined) === "valid") ||
    (await getAdminSession()) !== null;

  if (!detailed) {
    return NextResponse.json(
      { status: report.status, timestamp: report.timestamp },
      { status: httpStatus, headers: NO_STORE },
    );
  }

  // `degradations`: qué fallbacks silenciosos ha visto ESTA instancia (p. ej. artículos solo del código).
  return NextResponse.json(
    { ...report, degradations: getDegradationSnapshot() },
    { status: httpStatus, headers: NO_STORE },
  );
}
