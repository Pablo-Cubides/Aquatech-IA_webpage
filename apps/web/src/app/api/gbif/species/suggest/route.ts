/**
 * API Route: GET /api/gbif/species/suggest?q=...&limit=...
 * Proxy del autocompletado de especies de GBIF (SEC-005a).
 *
 * El navegador llamaba directo a api.gbif.org, lo que obligaba a abrir `connect-src` a ese origen. La
 * política es que los terceros pasan por un proxy nuestro y `connect-src` queda en 'self' + GA + vitals.
 * Sin clave propia => límite en memoria. `q` es texto libre de la persona (nombre científico o común):
 * cualquier carácter imprimible, 1-100; lo codifica URLSearchParams.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  fetchUpstreamJson,
  guardPublicProxy,
  proxyJson,
  queryIntClamped,
  queryText,
} from "@/lib/security/public-proxy";

const querySchema = z.strictObject({
  q: queryText(100),
  limit: queryIntClamped(1, 50).optional(),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "gbif:species-suggest",
    schema: querySchema,
    perMinutePerIp: 60,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;

  const search = new URLSearchParams({ limit: String(guard.query.limit ?? 10), q: guard.query.q });
  const result = await fetchUpstreamJson("gbif:species-suggest", `https://api.gbif.org/v1/species/suggest?${search}`, {
    headers: { Accept: "application/json" },
    timeoutMs: 10_000,
  });
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 86400, swr: 604800 });
}
