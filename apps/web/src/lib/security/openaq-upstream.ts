/**
 * Llamada común a OpenAQ v3 (SEC-003). La v3 exige `X-API-Key` en TODAS las peticiones
 * (sin clave responde 401), así que sin `OPENAQ_API_KEY` se responde un 503 claro en vez
 * de gastar una llamada que sabemos que falla. Cuota documentada: 60 peticiones/min y
 * 2000/h por clave: el presupuesto global de las rutas (30/min) queda por debajo de ambas.
 */
import { logger } from "@/lib/logger";
import {
  fetchUpstreamJson,
  proxyError,
  type UpstreamJsonResult,
} from "./public-proxy";

export const OPENAQ_BASE = "https://api.openaq.org/v3";
export const OPENAQ_BUDGET = { max: 30, intervalMs: 60_000, key: "openaq" } as const;

export async function fetchOpenAq(name: string, path: string, query: string): Promise<UpstreamJsonResult> {
  const apiKey = process.env.OPENAQ_API_KEY?.trim();
  if (!apiKey) {
    logger.error(`[proxy:${name}] OPENAQ_API_KEY no está configurada`);
    return {
      ok: false,
      response: proxyError(503, "not_configured", "Los datos de calidad del aire no están disponibles en este momento."),
    };
  }
  return fetchUpstreamJson(name, `${OPENAQ_BASE}${path}${query ? `?${query}` : ""}`, {
    headers: { Accept: "application/json", "X-API-Key": apiKey },
    timeoutMs: 12_000,
    maxBytes: 8 * 1024 * 1024,
  });
}
