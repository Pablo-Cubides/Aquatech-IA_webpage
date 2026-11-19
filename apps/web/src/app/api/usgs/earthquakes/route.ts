/**
 * API Route: GET /api/usgs/earthquakes
 * Proxy de los feeds GeoJSON del USGS (SEC-003). `period` y `minMagnitude` se interpolan en la
 * RUTA del upstream: solo se admiten los nombres de feed que el USGS publica, nunca texto libre.
 * Sin clave propia => límite en memoria (lectura pública cacheable en el CDN).
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { fetchUpstreamJson, guardPublicProxy, proxyJson } from "@/lib/security/public-proxy";

const querySchema = z.strictObject({
  period: z.enum(["hour", "day", "week", "month"]).default("week"),
  minMagnitude: z.enum(["significant", "4.5", "2.5", "1.0", "all"]).default("2.5"),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "usgs:earthquakes",
    schema: querySchema,
    perMinutePerIp: 60,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;
  const { period, minMagnitude } = guard.query;

  const result = await fetchUpstreamJson(
    "usgs:earthquakes",
    `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${minMagnitude}_${period}.geojson`,
    { timeoutMs: 15_000, maxBytes: 8 * 1024 * 1024 },
  );
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 300, swr: 600 });
}
