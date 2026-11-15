/**
 * Rate limiting using Upstash Redis
 * Protects API routes from abuse
 */

import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

let redisClient: Redis | null = null;
let redisDisabled = false;

function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }

  if (redisDisabled) {
    return null;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

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
