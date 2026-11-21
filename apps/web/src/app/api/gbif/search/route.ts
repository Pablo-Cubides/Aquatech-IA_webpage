/**
 * API Route: GET /api/gbif/search
 * Proxy de GBIF occurrence search (SEC-003): parámetros validados, límite en memoria (sin clave
 * propia; lectura pública cacheable), timeout y errores sin cuerpo del proveedor.
 *
 * SEC-006:
 *  - La respuesta se ADELGAZA a los campos que usa el visor (lib/gbif-occurrence.ts): 2,2 MiB -> 210 KB.
 *  - El resultado ya adelgazado se guarda en la caché de datos de Next (`unstable_cache`, 6 h). La
 *    respuesta cruda no cabe (la caché guarda hasta 2 MB por entrada); la adelgazada sí. Una entrada
 *    caducada se sirve al instante y se revalida en segundo plano; si GBIF falla (429, 5xx, timeout) la
 *    copia anterior se conserva y se sigue sirviendo. Sin copia previa, el fallo llega al cliente (503).
 *    El `revalidate` largo es deliberado: cada petición con la entrada caducada relanza la llamada a
 *    GBIF mientras este siga fallando, y no queremos presionar a quien ya nos pide bajar el ritmo.
 */
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { slimOccurrenceSearch } from "@/lib/gbif-occurrence";
import {
  fetchUpstreamJson,
  guardPublicProxy,
  proxyError,
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

/** Seis horas: GBIF cachea 10 min en su Varnish; el CDN de arriba, 1 h. */
const SLIM_REVALIDATE_SECONDS = 6 * 60 * 60;

/**
 * Fallo del proveedor dentro de la función cacheada. Lleva la respuesta ya mapeada para el cliente pero
 * NO enumerable: `unstable_cache` registra el error al revalidar y no debe volcar nada del proveedor.
 */
class UpstreamFailure extends Error {
  readonly response!: NextResponse;
  constructor(response: NextResponse) {
    super(`gbif:search upstream ${response.status}`);
    Object.defineProperty(this, "response", { value: response, enumerable: false });
  }
}

const getSlimSearch = unstable_cache(
  async (query: string) => {
    const result = await fetchUpstreamJson(
      "gbif:search",
      `https://api.gbif.org/v1/occurrence/search?${query}`,
      { headers: { Accept: "application/json" }, timeoutMs: 15_000, maxBytes: 8 * 1024 * 1024 },
    );
    if (!result.ok) throw new UpstreamFailure(result.response);

    const slim = slimOccurrenceSearch(result.data);
    if (!slim) {
      throw new UpstreamFailure(
        proxyError(502, "upstream_invalid", "Respuesta inválida del proveedor de datos."),
      );
    }
    return slim;
  },
  ["gbif-search-slim-v1"],
  { revalidate: SLIM_REVALIDATE_SECONDS },
);

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "gbif:search",
    schema: querySchema,
    perMinutePerIp: 30,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;

  try {
    const data = await getSlimSearch(toUpstreamQuery(guard.query));
    return proxyJson(data, { sMaxAge: 3600, swr: 7200 });
  } catch (error) {
    if (error instanceof UpstreamFailure) return error.response;
    return proxyError(502, "upstream_error", "El proveedor de datos devolvió un error.");
  }
}
