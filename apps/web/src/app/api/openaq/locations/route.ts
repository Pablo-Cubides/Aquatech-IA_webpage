/**
 * API Route: GET /api/openaq/locations
 * Proxy de OpenAQ v3 /locations (SEC-003): parámetros validados, límite con clave propia
 * (almacén compartido, cerrado) y presupuesto global bajo la cuota documentada de la clave.
 * Se reenvían los mismos parámetros que antes (`country`, `city`, `parameter`, `location_id`…);
 * que la v3 los reconozca o no es del cliente del visor (ver bitácora SEC), no de este proxy.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  guardPublicProxy,
  latLonString,
  proxyJson,
  queryIntClamped,
  queryText,
  queryToken,
  toUpstreamQuery,
} from "@/lib/security/public-proxy";
import { fetchOpenAq, OPENAQ_BUDGET } from "@/lib/security/openaq-upstream";

const idList = z.string().regex(/^\d{1,9}(,\d{1,9}){0,19}$/, "lista de ids");

const querySchema = z.strictObject({
  country: queryText(60).optional(),
  countries_id: idList.optional(),
  city: queryText(100).optional(),
  coordinates: latLonString.optional(),
  parameter: queryToken(30).optional(),
  location_id: z.string().regex(/^\d{1,12}$/).optional(),
  radius: queryIntClamped(0, 25000).optional(), // máximo de la API: 25 km
  limit: queryIntClamped(1, 10000).optional(),
  // El cliente los manda; nunca se reenviaron (la v3 solo admite order_by=id).
  order_by: queryToken(30).optional(),
  sort: queryToken(10).optional(),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "openaq:locations",
    schema: querySchema,
    perMinutePerIp: 30,
    limiter: "shared",
    upstreamBudget: OPENAQ_BUDGET,
  });
  if (!guard.ok) return guard.response;
  const { order_by: _orderBy, sort: _sort, ...forward } = guard.query;

  const result = await fetchOpenAq("openaq:locations", "/locations", toUpstreamQuery(forward));
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 3600, swr: 7200 });
}
