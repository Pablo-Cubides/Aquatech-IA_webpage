/**
 * API Route: GET /api/firms/fires
 * Proxy de la API de NASA FIRMS (requiere MAP_KEY propia, SOLO servidor).
 *
 * SEC-003:
 *  - La clave se lee de `FIRMS_MAP_KEY` (sin NEXT_PUBLIC_: no viaja al navegador). FIRMS
 *    la exige en la RUTA de la URL, por eso la URL nunca se escribe en los logs.
 *  - SIN datos de respaldo: si no hay clave o el proveedor falla se responde 503/502 con un
 *    cuerpo claro. Antes se devolvían incendios inventados al azar con la forma de los reales:
 *    un dato falso presentado como real es peor que ningún dato.
 *  - Parámetros verificados contra la documentación de FIRMS (area/csv): fuente de la lista
 *    documentada, `area` = oeste,sur,este,norte, day_range 1-5.
 *  - Límite: clave propia => almacén compartido, cerrado, más un presupuesto global bajo el
 *    máximo documentado por FIRMS (5000 transacciones / 10 min por clave).
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";
import {
  bboxString,
  fetchUpstreamText,
  guardPublicProxy,
  proxyError,
  proxyJson,
  queryInt,
} from "@/lib/security/public-proxy";

const FIRMS_SOURCES = [
  "VIIRS_SNPP_NRT",
  "VIIRS_NOAA20_NRT",
  "VIIRS_NOAA21_NRT",
  "MODIS_NRT",
] as const;

// Colombia por defecto (no "world": evita respuestas enormes y timeouts).
const DEFAULT_AREA = "-82,-5,-66,14";
const MAX_RECORDS = 5000;

const firmsQuerySchema = z.strictObject({
  source: z.enum(FIRMS_SOURCES).default("VIIRS_SNPP_NRT"),
  day_range: queryInt(1, 5).default(2),
  area: bboxString.default(DEFAULT_AREA),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "firms:fires",
    schema: firmsQuerySchema,
    perMinutePerIp: 30,
    limiter: "shared",
    upstreamBudget: { max: 1000, intervalMs: 10 * 60_000 },
  });
  if (!guard.ok) return guard.response;
  const { source, day_range: dayRange, area } = guard.query;

  const mapKey = process.env.FIRMS_MAP_KEY?.trim();
  if (!mapKey) {
    logger.error("[proxy:firms:fires] FIRMS_MAP_KEY no está configurada");
    return proxyError(
      503,
      "not_configured",
      "Los datos de incendios no están disponibles en este momento.",
    );
  }

  const result = await fetchUpstreamText(
    "firms:fires",
    `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${encodeURIComponent(mapKey)}/${source}/${area}/${dayRange}`,
    { timeoutMs: 15_000, maxBytes: 8 * 1024 * 1024 },
  );
  if (!result.ok) return result.response;

  const lines = result.text.trim().split(/\r?\n/);
  const header = (lines[0] ?? "").split(",").map((h) => h.trim());

  // Un cuerpo vacío es "sin incendios". Una primera línea que no es una cabecera CSV (p. ej.
  // un mensaje de clave inválida con estado 200) NO es "sin incendios": es un fallo.
  if (result.text.trim() === "") {
    return proxyJson([], { sMaxAge: 1800, swr: 3600 });
  }
  if (!header.includes("latitude") || !header.includes("longitude")) {
    logger.warn("[proxy:firms:fires] respuesta del proveedor sin cabecera CSV esperada");
    return proxyError(502, "upstream_invalid", "Respuesta inválida del proveedor de datos.");
  }

  const records = lines.slice(1, MAX_RECORDS + 1).map((line) => {
    const values = line.split(",");
    const record: Record<string, string> = {};
    header.forEach((name, index) => {
      record[name] = (values[index] ?? "").trim();
    });
    return record;
  });

  return proxyJson(records, { sMaxAge: 1800, swr: 3600 });
}
