/**
 * API Route: GET /api/gbif/search
 * Proxy de GBIF occurrence search (SEC-003): parámetros validados, límite en memoria (sin clave
 * propia; lectura pública cacheable), timeout y errores sin cuerpo del proveedor.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  fetchUpstreamJson,
  guardPublicProxy,
  proxyJson,
  queryInt,
  queryIntClamped,
  queryText,
  queryToken,
  toUpstreamQuery,
} from "@/lib/security/public-proxy";

const querySchema = z.strictObject({
  hasCoordinate: z.enum(["true", "false"]).optional(),
  country: z.string().regex(/^[A-Za-z]{2}$/, "código ISO de 2 letras").optional(),
  year: z.string().regex(/^\d{4}(,\d{4})?$/, "año o rango AAAA,AAAA").optional(),
  taxonKey: z.string().regex(/^\d{1,12}$/).optional(),
  scientificName: queryText(120).optional(),
  basisOfRecord: queryToken(40).optional(),
  geometry: z.string().max(2000).regex(/^[A-Za-z0-9 ,.()\-]+$/, "WKT inválido").optional(),
  limit: queryIntClamped(1, 300).optional(), // máximo de GBIF: 300
  offset: queryInt(0, 100000).optional(),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "gbif:search",
    schema: querySchema,
    perMinutePerIp: 30,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;

  const result = await fetchUpstreamJson(
    "gbif:search",
    `https://api.gbif.org/v1/occurrence/search?${toUpstreamQuery(guard.query)}`,
    { headers: { Accept: "application/json" }, timeoutMs: 15_000, maxBytes: 8 * 1024 * 1024 },
  );
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 3600, swr: 7200 });
}
