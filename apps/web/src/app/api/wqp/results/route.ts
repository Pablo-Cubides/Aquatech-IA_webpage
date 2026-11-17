/**
 * API Route: GET /api/wqp/results
 * Proxy de Water Quality Portal (resultados por estación). SEC-003: `siteid` validado.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { fetchUpstreamJson, guardPublicProxy, proxyJson } from "@/lib/security/public-proxy";

const querySchema = z.strictObject({
  siteid: z.string().regex(/^[A-Za-z0-9._:-]{1,60}$/, "siteid inválido"),
  // El cliente los envía siempre; el proxy fija sus propios valores.
  mimeType: z.literal("json").optional(),
  zip: z.literal("no").optional(),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "wqp:results",
    schema: querySchema,
    perMinutePerIp: 30,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;

  const search = new URLSearchParams({ siteid: guard.query.siteid, mimeType: "json", zip: "no" });
  const result = await fetchUpstreamJson(
    "wqp:results",
    `https://www.waterqualitydata.us/data/Result/search?${search}`,
    { headers: { Accept: "application/json" }, timeoutMs: 25_000, maxBytes: 10 * 1024 * 1024 },
  );
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 3600, swr: 7200 });
}
