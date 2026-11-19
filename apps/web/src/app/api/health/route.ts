import { NextRequest, NextResponse } from "next/server";
import { getHealthReport } from "@/lib/health";
import {
  getDegradationSnapshot,
  hasRecentDegradation,
} from "@/lib/observability/degradation";
import { getAdminSession } from "@/lib/security/admin-session";
import { verifyAgentToken } from "@/lib/security/agent-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * GET /api/health
 *
 * - 200 `ok`: todo lo crítico responde.
 * - 200 `degraded`: algo opcional falla, o en los últimos 10 min el sitio sirvió
 *   contenido reducido por una caída de la base (degradación silenciosa). Caduca solo:
 *   refleja el estado reciente, no el histórico de la instancia.
 * - 503 `down`: falla una dependencia crítica (la base de datos).
 *
 * Sin autenticación solo se devuelve `{ status, timestamp }`: nada de
 * infraestructura. El detalle por dependencia (tiempos, qué falló) lo ve un
 * ADMIN con sesión o quien presente `Authorization: Bearer <HEALTH_CHECK_TOKEN>`
 * (para el monitor de disponibilidad).
 */
export async function GET(request: NextRequest) {
  const checked = await getHealthReport();
  // Una degradación reciente baja "ok" a "degraded"; nunca sube un "down" ni lo oculta.
  const report =
    checked.status === "ok" && hasRecentDegradation() ? { ...checked, status: "degraded" as const } : checked;
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

  // `degradations`: `recent` (ventana, decide el estado) y `sinceInstanceStart` (acumulado, solo informativo).
  return NextResponse.json(
    { ...report, degradations: getDegradationSnapshot() },
    { status: httpStatus, headers: NO_STORE },
  );
}
