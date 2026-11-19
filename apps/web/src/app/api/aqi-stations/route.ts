/**
 * AQI Stations API Route
 * Búsqueda de estaciones de monitoreo (OpenAQ v3).
 *
 * SEC-003:
 *  - Se eliminó la acción `latest`: llamaba a /v3/latest, que no existe en OpenAQ v3.
 *  - El cliente ahora envía X-API-Key (la v3 responde 401 sin clave); antes esta ruta fallaba siempre.
 *  - Parámetros validados (country = lista de countries_id numéricos, como los usa el cliente),
 *    límite con clave propia (almacén compartido, cerrado) y presupuesto global de la clave.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";
import {
  searchLocations,
  getCountries,
} from "@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/lib/openaq-client";
import { OPENAQ_BUDGET } from "@/lib/security/openaq-upstream";
import { guardPublicProxy, proxyError, proxyJson, queryIntClamped, queryText } from "@/lib/security/public-proxy";

const querySchema = z.strictObject({
  action: z.enum(["search", "countries"]).default("search"),
  country: z.string().regex(/^\d{1,9}(,\d{1,9}){0,19}$/, "lista de ids de país").optional(),
  city: queryText(100).optional(),
  limit: queryIntClamped(1, 1000).optional(),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "aqi:stations",
    schema: querySchema,
    perMinutePerIp: 30,
    limiter: "shared",
    upstreamBudget: OPENAQ_BUDGET,
  });
  if (!guard.ok) return guard.response;
  const { action, country, city, limit } = guard.query;

  if (!process.env.OPENAQ_API_KEY?.trim()) {
    logger.error("[proxy:aqi:stations] OPENAQ_API_KEY no está configurada");
    return proxyError(503, "not_configured", "Los datos de calidad del aire no están disponibles en este momento.");
  }

  try {
    if (action === "countries") {
      return proxyJson({ countries: await getCountries() }, { sMaxAge: 86400, swr: 172800 });
    }
    const stations = await searchLocations({ country, city, limit: limit ?? 100 });
    return proxyJson({ stations }, { sMaxAge: 3600, swr: 7200 });
  } catch (error) {
    // El mensaje del cliente solo trae el estado del proveedor; no se reenvía.
    logger.warn(`[proxy:aqi:stations] fallo del proveedor: ${error instanceof Error ? error.message : "desconocido"}`);
    return NextResponse.json(
      { error: "upstream_error", message: "El proveedor de datos devolvió un error." },
      { status: 502, headers: { "Cache-Control": "public, s-maxage=15" } },
    );
  }
}
