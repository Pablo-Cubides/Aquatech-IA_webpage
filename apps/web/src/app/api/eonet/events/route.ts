/**
 * API Route: GET /api/eonet/events
 * Proxy de NASA EONET (SEC-003). `category` se interpola en la RUTA del upstream
 * (/categories/{id}): solo un identificador corto, sin barras ni puntos.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  fetchUpstreamJson,
  guardPublicProxy,
  proxyJson,
  queryIntClamped,
  toUpstreamQuery,
} from "@/lib/security/public-proxy";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "fecha AAAA-MM-DD");

const querySchema = z.strictObject({
  status: z.enum(["open", "closed", "all"]).optional(),
  limit: queryIntClamped(1, 500).optional(),
  days: queryIntClamped(1, 365).optional(),
  start: isoDate.optional(),
  end: isoDate.optional(),
  category: z.string().regex(/^[A-Za-z0-9_-]{1,40}$/, "categoría inválida").optional(),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "eonet:events",
    schema: querySchema,
    perMinutePerIp: 60,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;
  const { category, ...forward } = guard.query;

  const base = category
    ? `https://eonet.gsfc.nasa.gov/api/v3/categories/${category}`
    : "https://eonet.gsfc.nasa.gov/api/v3/events";
  const query = toUpstreamQuery(forward);

  const result = await fetchUpstreamJson("eonet:events", query ? `${base}?${query}` : base, {
    headers: { Accept: "application/json" },
    timeoutMs: 15_000,
    maxBytes: 8 * 1024 * 1024,
  });
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 3600, swr: 7200 });
}
