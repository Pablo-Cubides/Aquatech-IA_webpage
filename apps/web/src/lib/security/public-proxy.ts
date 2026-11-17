/**
 * Helper único para los proxies públicos hacia APIs de terceros (SEC-003).
 *
 * Una ruta de proxy es un endpoint SIN autenticación que gasta algo nuestro:
 * la cuota de una cuenta con el proveedor (clave propia), la reputación de la
 * IP de Vercel ante el proveedor, o CPU. Este helper fija, en un solo sitio, lo
 * que toda ruta de proxy debe cumplir:
 *
 *  1. Parámetros validados con Zod ESTRICTO (`z.strictObject`): una clave
 *     desconocida o repetida es un 400, nunca se reenvía al upstream.
 *  2. Límite de tasa por IP. Elección explícita del almacén:
 *       - "memory": en memoria, por instancia, sin escritura en BD. Para
 *         proxies SIN clave propia (lectura pública cacheable en el CDN).
 *       - "shared": almacén compartido, falla CERRADO. Para proxies CON clave
 *         propia: el abuso cuesta cuota o cuenta, así que ante duda se
 *         deniega (criterio general: cerrado donde el fallo niega un privilegio
 *         o protege coste).
 *     Con clave propia puede añadirse además un PRESUPUESTO global de
 *     llamadas al upstream, para no agotar la cuota de la clave aunque el
 *     ataque venga de muchas IP.
 *  3. Llamada al upstream con timeout, sin reenviar el cuerpo de error del
 *     proveedor, sin registrar la URL (puede llevar la clave) y con un tope de
 *     tamaño de respuesta.
 *  4. Respuestas correctas con `Cache-Control` público; errores sin caché larga.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { localRateLimit } from "./local-rate-limit";
import { getClientIP, rateLimit } from "./rate-limit";

export type ProxyGuardOptions<S extends z.ZodType> = {
  /** Nombre corto para logs y claves del límite, p. ej. "openaq:locations". */
  name: string;
  /** Debe ser `z.strictObject({...})` sobre los parámetros de la query. */
  schema: S;
  /** Peticiones por minuto y por IP. */
  perMinutePerIp: number;
  /** "memory" = sin clave propia (lectura pública); "shared" = con clave propia (cerrado). */
  limiter: "memory" | "shared";
  /**
   * Solo con limiter "shared": máximo de llamadas al upstream por ventana, sumando
   * todas las IP. Protege la cuota de la clave propia.
   */
  upstreamBudget?: { max: number; intervalMs: number };
};

export type GuardResult<S extends z.ZodType> =
  | { ok: true; query: z.output<S>; ip: string }
  | { ok: false; response: NextResponse };

const NO_STORE = "no-store";
/** Un error del upstream se cachea poco: protege al proveedor sin ocultar la recuperación. */
const ERROR_CACHE = "public, s-maxage=15";

export function proxyError(
  status: number,
  code: string,
  message: string,
  extraHeaders: Record<string, string> = {},
): NextResponse {
  const cacheable = status === 502 || status === 503 || status === 504;
  return NextResponse.json(
    { error: code, message },
    {
      status,
      headers: { "Cache-Control": cacheable ? ERROR_CACHE : NO_STORE, ...extraHeaders },
    },
  );
}

export function proxyJson(
  data: unknown,
  cache: { sMaxAge: number; swr?: number },
): NextResponse {
  const swr = cache.swr ?? cache.sMaxAge * 2;
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${cache.sMaxAge}, stale-while-revalidate=${swr}`,
    },
  });
}

/** Query -> objeto plano. Una clave repetida es ambigua: se rechaza (devuelve null). */
function searchParamsToObject(params: URLSearchParams): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const [key, value] of params) {
    if (Object.prototype.hasOwnProperty.call(out, key)) return null;
    out[key] = value;
  }
  return out;
}

/**
 * Valida la query y aplica el límite de tasa. No hace ninguna llamada al upstream.
 */
export async function guardPublicProxy<S extends z.ZodType>(
  request: NextRequest | Request,
  options: ProxyGuardOptions<S>,
  extraInput: Record<string, string> = {},
): Promise<GuardResult<S>> {
  const url = new URL(request.url);
  const flat = searchParamsToObject(url.searchParams);
  if (!flat) {
    return {
      ok: false,
      response: proxyError(400, "invalid_query", "Parámetro de consulta repetido."),
    };
  }

  // Los segmentos de ruta (p. ej. [id]) se validan con el mismo esquema que la query.
  const parsed = options.schema.safeParse({ ...flat, ...extraInput });
  if (!parsed.success) {
    const issues = parsed.error.issues.slice(0, 5).map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      ...(issue.code === "unrecognized_keys" ? { keys: (issue as { keys?: string[] }).keys } : {}),
    }));
    return {
      ok: false,
      response: NextResponse.json(
        { error: "invalid_query", message: "Parámetros inválidos.", issues },
        { status: 400, headers: { "Cache-Control": NO_STORE } },
      ),
    };
  }

  const ip = getClientIP(request.headers);

  if (options.limiter === "memory") {
    const limit = localRateLimit(`proxy:${options.name}:${ip}`, options.perMinutePerIp, 60_000);
    if (!limit.success) {
      return {
        ok: false,
        response: proxyError(429, "rate_limited", "Demasiadas solicitudes.", {
          "Retry-After": String(Math.max(Math.ceil((limit.reset - Date.now()) / 1000), 1)),
        }),
      };
    }
  } else {
    // Clave propia: cerrado (decisión SEC-003). Si el almacén no responde se deniega:
    // quemar la cuota de la cuenta es peor que un 503 temporal.
    const perIp = await rateLimit(`proxy:${options.name}:${ip}`, {
      interval: 60_000,
      uniqueTokenPerInterval: options.perMinutePerIp,
      failureMode: "closed",
    });
    if (!perIp.success) {
      return { ok: false, response: limitedResponse(perIp.reason, perIp.reset) };
    }

    if (options.upstreamBudget) {
      const budget = await rateLimit(`proxy-budget:${options.name}`, {
        interval: options.upstreamBudget.intervalMs,
        uniqueTokenPerInterval: options.upstreamBudget.max,
        failureMode: "closed",
      });
      if (!budget.success) {
        return { ok: false, response: limitedResponse(budget.reason, budget.reset, true) };
      }
    }
  }

  return { ok: true, query: parsed.data, ip };
}

function limitedResponse(
  reason: "limit-exceeded" | "backend-unavailable" | undefined,
  reset: number,
  budget = false,
): NextResponse {
  if (reason === "backend-unavailable") {
    return proxyError(503, "unavailable", "Servicio temporalmente no disponible.", {
      "Cache-Control": NO_STORE,
    });
  }
  const retry = String(Math.min(Math.max(Math.ceil((reset - Date.now()) / 1000), 1), 3600));
  return proxyError(
    budget ? 503 : 429,
    budget ? "upstream_budget_exhausted" : "rate_limited",
    budget ? "Cuota del proveedor agotada temporalmente." : "Demasiadas solicitudes.",
    { "Retry-After": retry, "Cache-Control": NO_STORE },
  );
}

export type UpstreamOptions = {
  headers?: Record<string, string>;
  timeoutMs: number;
  /** Tope de la respuesta en bytes (por defecto 2 MB). */
  maxBytes?: number;
};

export type UpstreamResult =
  | { ok: true; text: string; response: Response }
  | { ok: false; response: NextResponse };

const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;

/**
 * GET al upstream. Nunca registra la URL (puede llevar la clave en la ruta o la query)
 * ni reenvía el cuerpo de error del proveedor: solo `name` y el estado.
 */
export async function fetchUpstreamText(
  name: string,
  url: string,
  options: UpstreamOptions,
): Promise<UpstreamResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: options.headers,
      signal: AbortSignal.timeout(options.timeoutMs),
    });
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    logger.warn(`[proxy:${name}] ${timedOut ? "timeout" : "fallo de red"} con el proveedor`);
    return {
      ok: false,
      response: timedOut
        ? proxyError(504, "upstream_timeout", "El proveedor de datos no respondió a tiempo.")
        : proxyError(502, "upstream_unreachable", "No se pudo contactar al proveedor de datos."),
    };
  }

  if (!response.ok) {
    logger.warn(`[proxy:${name}] el proveedor respondió ${response.status}`);
    return { ok: false, response: mapUpstreamStatus(response) };
  }

  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    logger.warn(`[proxy:${name}] respuesta del proveedor demasiado grande`);
    return {
      ok: false,
      response: proxyError(502, "upstream_too_large", "La respuesta del proveedor es demasiado grande."),
    };
  }

  const text = await response.text();
  if (text.length > maxBytes) {
    logger.warn(`[proxy:${name}] respuesta del proveedor demasiado grande`);
    return {
      ok: false,
      response: proxyError(502, "upstream_too_large", "La respuesta del proveedor es demasiado grande."),
    };
  }
  return { ok: true, text, response };
}

export type UpstreamJsonResult =
  | { ok: true; data: unknown }
  | { ok: false; response: NextResponse };

export async function fetchUpstreamJson(
  name: string,
  url: string,
  options: UpstreamOptions,
): Promise<UpstreamJsonResult> {
  const result = await fetchUpstreamText(name, url, options);
  if (!result.ok) return result;
  try {
    return { ok: true, data: JSON.parse(result.text) };
  } catch {
    logger.warn(`[proxy:${name}] el proveedor devolvió algo que no es JSON`);
    return {
      ok: false,
      response: proxyError(502, "upstream_invalid", "Respuesta inválida del proveedor de datos."),
    };
  }
}

function mapUpstreamStatus(upstream: Response): NextResponse {
  const status = upstream.status;
  if (status === 429) {
    const header = Number(upstream.headers.get("retry-after"));
    const retry = Number.isFinite(header) && header >= 1 ? Math.min(Math.ceil(header), 3600) : 60;
    return proxyError(503, "upstream_rate_limited", "El proveedor de datos limitó las solicitudes. Reintenta más tarde.", {
      "Retry-After": String(retry),
    });
  }
  if (status === 404) {
    return proxyError(404, "upstream_not_found", "El proveedor no tiene ese recurso.");
  }
  // 401/403 = clave ausente o inválida de NUESTRA parte; 5xx = fallo suyo. Ninguno es del cliente.
  return proxyError(502, "upstream_error", "El proveedor de datos devolvió un error.");
}

/* ------------------------------------------------------------------ */
/* Piezas reutilizables de esquema                                     */
/* ------------------------------------------------------------------ */

/** Entero decimal canónico (sin signo, sin ceros a la izquierda, sin 1e3/0x1) acotado. */
export function queryInt(min: number, max: number) {
  return z
    .string()
    .regex(/^(0|[1-9]\d{0,8})$/, "debe ser un entero")
    .transform(Number)
    .refine((n) => n >= min && n <= max, `debe estar entre ${min} y ${max}`);
}

const DECIMAL = "-?\\d{1,3}(?:\\.\\d{1,6})?";

/** "lat,lon" con rangos válidos. */
export const latLonString = z
  .string()
  .regex(new RegExp(`^${DECIMAL},${DECIMAL}$`), "formato lat,lon")
  .refine((value) => {
    const [lat, lon] = value.split(",").map(Number);
    return Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
  }, "coordenadas fuera de rango");

/** "oeste,sur,este,norte" con rangos válidos y orden coherente. */
export const bboxString = z
  .string()
  .regex(new RegExp(`^${DECIMAL},${DECIMAL},${DECIMAL},${DECIMAL}$`), "formato oeste,sur,este,norte")
  .refine((value) => {
    const [w, s, e, n] = value.split(",").map(Number);
    return Math.abs(w) <= 180 && Math.abs(e) <= 180 && Math.abs(s) <= 90 && Math.abs(n) <= 90 && w < e && s < n;
  }, "bbox fuera de rango o desordenada");

/** Código corto alfanumérico (p. ej. país ISO, nombre de parámetro). */
export function queryToken(maxLength: number) {
  return z
    .string()
    .min(1)
    .max(maxLength)
    .regex(/^[A-Za-z0-9._-]+$/, "caracteres no permitidos");
}

/** Texto libre acotado, sin caracteres de control (p. ej. nombre de ciudad). */
export function queryText(maxLength: number) {
  return z
    .string()
    .min(1)
    .max(maxLength)
    .refine((value) => !/\p{Cc}/u.test(value), "caracteres de control no permitidos");
}

/** Construye la query saliente en orden alfabético y sin valores indefinidos. */
export function toUpstreamQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const key of Object.keys(params).sort()) {
    const value = params[key];
    if (value !== undefined) search.set(key, String(value));
  }
  return search.toString();
}
