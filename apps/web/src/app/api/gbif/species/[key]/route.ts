/**
 * API Route: GET /api/gbif/species/[key]
 * Proxy de los detalles de un taxón de GBIF (SEC-005a). `key` entra en la RUTA del upstream: solo un
 * entero decimal sin ceros a la izquierda.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { fetchUpstreamJson, guardPublicProxy, proxyJson } from "@/lib/security/public-proxy";

const querySchema = z.strictObject({
  key: z.string().regex(/^[1-9]\d{0,11}$/, "key de taxón inválida"),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const guard = await guardPublicProxy(
    request,
    { name: "gbif:species-detail", schema: querySchema, perMinutePerIp: 60, limiter: "memory" },
    { key },
  );
  if (!guard.ok) return guard.response;

  const result = await fetchUpstreamJson("gbif:species-detail", `https://api.gbif.org/v1/species/${guard.query.key}`, {
    headers: { Accept: "application/json" },
    timeoutMs: 10_000,
  });
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 86400, swr: 604800 });
}
