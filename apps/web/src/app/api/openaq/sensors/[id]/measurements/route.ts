/**
 * API Route: GET /api/openaq/sensors/[id]/measurements
 * Proxy de OpenAQ v3 /sensors/{id}/measurements (SEC-003). El `[id]` entra en la RUTA del
 * upstream: solo se admite un entero decimal, nunca texto libre.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { guardPublicProxy, proxyJson, queryInt, queryIntClamped, toUpstreamQuery } from "@/lib/security/public-proxy";
import { fetchOpenAq, OPENAQ_BUDGET } from "@/lib/security/openaq-upstream";

const querySchema = z.strictObject({
  id: z.string().regex(/^[1-9]\d{0,11}$/, "id de sensor inválido"),
  limit: queryIntClamped(1, 1000).optional(),
  page: queryInt(1, 100000).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guard = await guardPublicProxy(
    request,
    {
      name: "openaq:sensor-measurements",
      schema: querySchema,
      perMinutePerIp: 30,
      limiter: "shared",
      upstreamBudget: OPENAQ_BUDGET,
    },
    { id },
  );
  if (!guard.ok) return guard.response;
  const { id: sensorId, ...forward } = guard.query;

  const result = await fetchOpenAq(
    "openaq:sensor-measurements",
    `/sensors/${sensorId}/measurements`,
    toUpstreamQuery(forward),
  );
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 300, swr: 600 });
}
