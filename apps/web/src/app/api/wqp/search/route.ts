/**
 * API Route: GET /api/wqp/search
 * Proxy de Water Quality Portal (estaciones, GeoJSON). SEC-003: parámetros validados, límite en
 * memoria, timeout, y sin reenviar el cuerpo de error del proveedor ni registrar la URL.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  bboxString,
  fetchUpstreamJson,
  guardPublicProxy,
  proxyJson,
  queryIntClamped,
  queryText,
} from "@/lib/security/public-proxy";

const DEFAULT_RESULT_LIMIT = 5000;
const wqpDate = z.string().regex(/^(\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/, "fecha inválida");
const code = z.string().regex(/^[A-Za-z0-9:]{1,20}$/, "código inválido");

const querySchema = z.strictObject({
  bBox: bboxString.optional(),
  countrycode: code.optional(),
  statecode: code.optional(),
  countycode: code.optional(),
  characteristicName: queryText(100).optional(),
  characteristicType: queryText(100).optional(),
  siteType: queryText(100).optional(),
  startDateLo: wqpDate.optional(),
  startDateHi: wqpDate.optional(),
  providers: z.array(z.enum(["NWIS", "STEWARDS", "STORET"])).max(3).optional(),
  resultLimit: queryIntClamped(1, 10000).optional(),
  // El cliente los envía siempre; el proxy fija sus propios valores.
  mimeType: z.literal("geojson").optional(),
  zip: z.literal("no").optional(),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "wqp:search",
    schema: querySchema,
    repeatable: ["providers"],
    perMinutePerIp: 20,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;
  const { providers, resultLimit, mimeType: _mimeType, zip: _zip, ...rest } = guard.query;

  const search = new URLSearchParams();
  for (const key of Object.keys(rest).sort()) {
    const value = (rest as Record<string, string | undefined>)[key];
    if (value !== undefined) search.set(key, value);
  }
  for (const provider of providers ?? []) search.append("providers", provider);
  search.set("mimeType", "geojson");
  search.set("zip", "no");

  const result = await fetchUpstreamJson(
    "wqp:search",
    `https://www.waterqualitydata.us/data/Station/search?${search}`,
    { headers: { Accept: "application/json" }, timeoutMs: 30_000, maxBytes: 10 * 1024 * 1024 },
  );
  if (!result.ok) return result.response;

  const data = result.data as { features?: unknown[] };
  const limit = resultLimit ?? DEFAULT_RESULT_LIMIT;
  if (Array.isArray(data?.features) && data.features.length > limit) {
    data.features = data.features.slice(0, limit);
  }
  return proxyJson(data, { sMaxAge: 1800, swr: 3600 });
}
