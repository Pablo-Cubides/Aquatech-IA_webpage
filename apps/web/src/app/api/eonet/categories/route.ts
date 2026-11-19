/**
 * API Route: GET /api/eonet/categories
 * Proxy de NASA EONET categories (SEC-003): sin parámetros, límite en memoria, caché 1 día.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { fetchUpstreamJson, guardPublicProxy, proxyJson } from "@/lib/security/public-proxy";

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "eonet:categories",
    schema: z.strictObject({}),
    perMinutePerIp: 60,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;

  const result = await fetchUpstreamJson("eonet:categories", "https://eonet.gsfc.nasa.gov/api/v3/categories", {
    headers: { Accept: "application/json" },
    timeoutMs: 12_000,
  });
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 86400, swr: 172800 });
}
