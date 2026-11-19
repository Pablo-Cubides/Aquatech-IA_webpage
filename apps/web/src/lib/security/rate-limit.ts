/**
 * Rate limiting: protege las rutas de la API contra abuso.
 *
 * Almacén (OPS-001): PostgreSQL por defecto (`rate-limit-postgres.ts`, sin
 * dependencias externas). Upstash Redis se usa si `UPSTASH_REDIS_REST_URL` y
 * `UPSTASH_REDIS_REST_TOKEN` están definidas. `RATE_LIMIT_BACKEND=postgres|upstash`
 * fuerza uno. La POLÍTICA cuando el almacén falla (failureMode) no depende del
 * almacén y es del cargo SEC.
 */

import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";
import { incrementWindow } from "./rate-limit-postgres";

let redisClient: Redis | null = null;
let redisDisabled = false;

function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }

  if (redisDisabled) {
    return null;
  }

  const { url, token } = upstashCredentials();

  if (!url || !token) {
    redisDisabled = true;
    logger.warn(
      "Rate limit Redis disabled: missing Upstash environment variables",
    );
    return null;
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

/**
 * Política cuando el almacén de límites no responde (sin Redis configurado o
 * error de red):
 *  - "closed" (por defecto): se DENIEGA la petición. Es lo correcto para
 *    autenticación, escritura, coste o datos personales.
 *  - "open": se PERMITE (sin límite efectivo). Solo para rutas públicas de
 *    lectura sin efectos laterales, y debe elegirse de forma explícita y
 *    justificada en el sitio de la llamada. Nunca se infiere del identificador.
 */
export type RateLimitFailureMode = "closed" | "open";

export type RateLimitConfig = {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
  failureMode?: RateLimitFailureMode; // default: "closed"
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  /**
   * Por qué se rechazó/permitió sin contar: "limit-exceeded" (límite superado) o
   * "backend-unavailable" (el almacén no respondió; se aplicó failureMode).
   */
  reason?: "limit-exceeded" | "backend-unavailable";
};

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export type RateLimitBackend = "postgres" | "upstash";

/** Lee una variable ignorando espacios; vacía o solo espacios cuenta como no definida. */
function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/** Credenciales de Upstash solo si están las DOS y no vacías (Vercel: se pegan a mano). */
function upstashCredentials(): { url?: string; token?: string } {
  const url = readEnv("UPSTASH_REDIS_REST_URL");
  const token = readEnv("UPSTASH_REDIS_REST_TOKEN");
  return url && token ? { url, token } : {};
}

let warnedPartialUpstash = false;

/**
 * Elige el almacén. Upstash solo si URL Y TOKEN están completos; con una sola de
 * las dos (o ninguna) se usa PostgreSQL. `RATE_LIMIT_BACKEND=postgres` fuerza
 * PostgreSQL; `=upstash` fuerza Upstash solo si las credenciales están completas.
 */
export function selectRateLimitBackend(): RateLimitBackend {
  const forced = readEnv("RATE_LIMIT_BACKEND")?.toLowerCase();
  const { url, token } = upstashCredentials();
  const complete = Boolean(url && token);

  if (!complete) {
    const partial =
      Boolean(readEnv("UPSTASH_REDIS_REST_URL")) !==
      Boolean(readEnv("UPSTASH_REDIS_REST_TOKEN"));
    if ((partial || forced === "upstash") && !warnedPartialUpstash) {
      warnedPartialUpstash = true;
      logger.warn(
        "Rate limit: credenciales de Upstash incompletas, se usa PostgreSQL",
      );
    }
    return "postgres";
  }
  return forced === "postgres" ? "postgres" : "upstash";
}

/** Resultado cuando no hay almacén: depende SOLO de failureMode. */
function backendUnavailable(
  failureMode: RateLimitFailureMode,
  limit: number,
  reset: number,
): RateLimitResult {
  const allow = failureMode === "open";
  return {
    success: allow,
    limit,
    remaining: allow ? limit : 0,
    reset,
    reason: "backend-unavailable",
  };
}

/**
 * Rate limiter using sliding window algorithm
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 requests per minute
  },
): Promise<RateLimitResult> {
  const key = `rate-limit:${identifier}`;
  const now = Date.now();
  const window = config.interval;
  const limit = config.uniqueTokenPerInterval;
  const failureMode = config.failureMode ?? "closed";

  if (selectRateLimitBackend() === "postgres") {
    try {
      const { hits, resetAt } = await incrementWindow(key, window, limit);
      if (hits > limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: resetAt,
          reason: "limit-exceeded",
        };
      }
      return {
        success: true,
        limit,
        remaining: Math.max(limit - hits, 0),
        reset: resetAt,
      };
    } catch (error: unknown) {
      logger.error("Rate limiting error (postgres)", error);
      return backendUnavailable(failureMode, limit, now + window);
    }
  }

  const redis = getRedisClient();

  if (!redis) {
    return backendUnavailable(failureMode, limit, now + window);
  }

  try {
    const created = await redis.set(key, 1, { px: window, nx: true });

    if (created === "OK") {
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: now + window,
      };
    }

    const current = await redis.incr(key);
    let ttlSeconds = await redis.ttl(key);

    if (ttlSeconds < 0) {
      ttlSeconds = Math.ceil(window / 1000);
      await redis.expire(key, ttlSeconds);
    }

    const reset = now + ttlSeconds * 1000;

    if (current > limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset,
        reason: "limit-exceeded",
      };
    }

    return {
      success: true,
      limit,
      remaining: Math.max(limit - current, 0),
      reset,
    };
  } catch (error: unknown) {
    logger.error("Rate limiting error", error, { identifier });
    return backendUnavailable(failureMode, limit, now + window);
  }
}

/**
 * IP-based rate limiting
 */
export async function rateLimitByIP(
  ip: string,
  config?: RateLimitConfig,
): Promise<RateLimitResult> {
  return rateLimit(`ip:${ip}`, config);
}

/**
 * User-based rate limiting
 */
export async function rateLimitByUser(
  userId: string,
  config?: RateLimitConfig,
): Promise<RateLimitResult> {
  return rateLimit(`user:${userId}`, config);
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  const trustForwardedHeaders = process.env.TRUST_PROXY_HEADERS === "true";

  const isValidIp = (candidate: string): boolean => {
    const ip = candidate.trim();
    if (!ip) return false;

    const isIpv4 =
      /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(ip);
    const isIpv6 = /^[0-9a-f:]+$/i.test(ip) && ip.includes(":");

    return isIpv4 || isIpv6;
  };

  const pickIp = (headerValue: string | null): string | null => {
    if (!headerValue) return null;

    const candidates = headerValue
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    for (const candidate of candidates) {
      if (isValidIp(candidate)) {
        return candidate;
      }
    }

    return null;
  };

  const trustedProxyHeaders = [
    headers.get("cf-connecting-ip"),
    headers.get("x-vercel-forwarded-for"),
    headers.get("true-client-ip"),
  ];

  for (const headerValue of trustedProxyHeaders) {
    const ip = pickIp(headerValue);
    if (ip) {
      return ip;
    }
  }

  if (trustForwardedHeaders) {
    const forwardedHeaders = [
      headers.get("x-forwarded-for"),
      headers.get("x-real-ip"),
    ];

    for (const headerValue of forwardedHeaders) {
      const ip = pickIp(headerValue);
      if (ip) {
        return ip;
      }
    }
  }

  return "unknown";
}
