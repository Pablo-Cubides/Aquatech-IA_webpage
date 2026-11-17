/**
 * API Route: GET /api/openaq/parameters
 * Proxy de OpenAQ v3 /parameters (SEC-003). Sin parámetros: cualquiera se rechaza.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { guardPublicProxy, proxyJson } from "@/lib/security/public-proxy";
import { fetchOpenAq, OPENAQ_BUDGET } from "@/lib/security/openaq-upstream";

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "openaq:parameters",
    schema: z.strictObject({}),
    perMinutePerIp: 30,
    limiter: "shared",
    upstreamBudget: OPENAQ_BUDGET,
  });
  if (!guard.ok) return guard.response;

  const result = await fetchOpenAq("openaq:parameters", "/parameters", "");
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 3600, swr: 7200 });
}
