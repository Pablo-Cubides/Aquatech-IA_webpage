/**
 * Proxy de la API del Banco Mundial (v2): GET /api/proxy/worldbank?path=...
 *
 * SEC-005a: el patrón de SEC-001 (`/^[a-zA-Z0-9/_-]+$/`) no admitía el punto, y TODOS los indicadores
 * del Banco Mundial lo llevan (`AG.LND.FRST.ZS`, `EN.GHG.CO2.PC.CE.AR5`, `NY.GDP.MKTP.CD`…): la fuente nunca
 * devolvía datos. Ahora el `path` se valida POR SEGMENTOS: cada segmento es un identificador
 * (letras, dígitos, `_`, `-` y puntos INTERNOS); un segmento `.` o `..`, vacío, con `:`, `;`, `\`,
 * `%` o un esquema se rechaza. Sin clave propia => límite en memoria (lectura pública cacheable).
 *
 * Parámetros de consulta: solo los que envía el cliente de `analisis-correlaciones` (format,
 * per_page, page, date, q); cualquier otro, o repetido, es un 400.
 *
 * Latencia real medida (2026-11-17): la primera consulta de un indicador tarda hasta ~45 s en el
 * Banco Mundial y las siguientes ~0,3 s (su caché); el cliente reintenta.
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import {
  fetchUpstreamJson,
  guardPublicProxy,
  proxyJson,
  queryInt,
  queryText,
} from "@/lib/security/public-proxy";

const WB_API_BASE = "https://api.worldbank.org/v2";

/** Un segmento: identificador con puntos solo entre caracteres (nunca `.`/`..`, nunca vacío). */
const SEGMENT = /^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/;
const MAX_SEGMENTS = 6;

function isValidWorldBankPath(path: string): boolean {
  if (path.length === 0 || path.length > 200) return false;
  const segments = path.split("/");
  return segments.length <= MAX_SEGMENTS && segments.every((segment) => SEGMENT.test(segment));
}

const querySchema = z.strictObject({
  path: z
    .string()
    .transform((raw) => raw.trim())
    .refine(isValidWorldBankPath, "path inválido"),
  format: z.literal("json").optional(),
  per_page: queryInt(1, 1000).optional(),
  page: queryInt(1, 100000).optional(),
  // `2000:2020` o `2020`
  date: z.string().regex(/^\d{4}(:\d{4})?$/, "date inválido").optional(),
  q: queryText(100).optional(),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "worldbank",
    schema: querySchema,
    perMinutePerIp: 60,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;
  const { path, ...rest } = guard.query;

  const search = new URLSearchParams();
  for (const key of Object.keys(rest).sort()) {
    const value = (rest as Record<string, string | number | undefined>)[key];
    if (value !== undefined) search.set(key, String(value));
  }
  const query = search.toString();

  const result = await fetchUpstreamJson("worldbank", `${WB_API_BASE}/${path}${query ? `?${query}` : ""}`, {
    headers: { Accept: "application/json" },
    // Cold start del Banco Mundial: hasta ~45 s la primera vez (ver cabecera del archivo).
    timeoutMs: 25_000,
    maxBytes: 8 * 1024 * 1024,
  });
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 3600, swr: 86400 });
}
