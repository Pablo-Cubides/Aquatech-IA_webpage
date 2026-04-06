import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "./logger";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

// Lazy initialization — avoids crash at build time when env vars are absent
let _redis: Redis | null = null;
let _ratelimits: ReturnType<typeof createRatelimits> | null = null;

function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not configured");
    }
    _redis = new Redis({ url, token });
  }
  return _redis;
}

function createRatelimits(redis: Redis) {
  return {
    // API requests: 100 requests per minute per IP
    api: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "ratelimit:api",
    }),

    // Payment creation: 5 requests per minute per user
    payment: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "ratelimit:payment",
    }),

    // Email sending: 10 emails per hour per user
    email: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "ratelimit:email",
    }),

    // Auth attempts: 10 attempts per 15 minutes per IP
    auth: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "15 m"),
      analytics: true,
      prefix: "ratelimit:auth",
    }),

    // Tool usage: Based on user credits (no hard limit, but logged)
    tool: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1000, "1 d"),
      analytics: true,
      prefix: "ratelimit:tool",
    }),
  };
}

type RatelimitType = keyof ReturnType<typeof createRatelimits>;

function getRatelimits() {
  if (!_ratelimits) {
    _ratelimits = createRatelimits(getRedis());
  }
  return _ratelimits;
}


export async function checkRateLimit(
  limitType: RatelimitType,
  identifier: string,
  context?: Record<string, unknown>,
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}> {
  try {
    const ratelimit = getRatelimits()[limitType];
    const { success, limit, remaining, reset } =
      await ratelimit.limit(identifier);

    if (!success) {
      await logger.warn("Rate limit exceeded", {
        limitType,
        identifier,
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
        ...context,
      });
    }

    return { success, limit, remaining, reset: new Date(reset) };
  } catch (error: unknown) {
    // If rate limiting fails, fail closed for sensitive operations
    await logger.error("Rate limit check failed", {
      limitType,
      identifier,
      error: getErrorMessage(error),
      ...context,
    });

    const failClosedLimitTypes: readonly RatelimitType[] = [
      "payment",
      "email",
      "auth",
    ];

    return {
      success: !failClosedLimitTypes.includes(limitType),
      limit: 0,
      remaining: 0,
      reset: new Date(),
    };
  }
}

export async function hasProcessedWebhookEvent(
  source: string,
  eventId: string,
): Promise<boolean> {
  try {
    if (!eventId.trim()) {
      return false;
    }

    const key = `webhook:event:${source}:${eventId}`;
    const value = await getRedis().get<string>(key);
    return value === "1";
  } catch (error: unknown) {
    await logger.warn("Webhook replay check failed", {
      source,
      eventId,
      error: getErrorMessage(error),
    });
    return false;
  }
}

export async function markWebhookEventProcessed(
  source: string,
  eventId: string,
  ttlSeconds = 60 * 60,
): Promise<void> {
  try {
    if (!eventId.trim()) {
      return;
    }

    const key = `webhook:event:${source}:${eventId}`;
    await getRedis().set(key, "1", { ex: ttlSeconds });
  } catch (error: unknown) {
    await logger.warn("Failed to persist webhook replay marker", {
      source,
      eventId,
      error: getErrorMessage(error),
    });
  }
}

export async function acquireWebhookReplayLock(
  source: string,
  eventId: string,
  ttlSeconds = 60 * 60,
): Promise<"acquired" | "duplicate" | "error"> {
  try {
    if (!eventId.trim()) {
      return "error";
    }

    const key = `webhook:event:${source}:${eventId}`;
    const result = await getRedis().set(key, "1", { ex: ttlSeconds, nx: true });
    return result === "OK" ? "acquired" : "duplicate";
  } catch (error: unknown) {
    await logger.warn("Webhook replay lock acquisition failed", {
      source,
      eventId,
      error: getErrorMessage(error),
    });
    return "error";
  }
}

// Helper function to get client IP address
export function getClientIP(request: Request): string {
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
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("true-client-ip"),
  ];

  for (const headerValue of trustedProxyHeaders) {
    const ip = pickIp(headerValue);
    if (ip) {
      return ip;
    }
  }

  if (trustForwardedHeaders) {
    const forwardedHeaders = [
      request.headers.get("x-forwarded-for"),
      request.headers.get("x-real-ip"),
      request.headers.get("x-client-ip"),
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

// Backward compatibility
export class RateLimit {
  async limit(identifier: string) {
    const result = await checkRateLimit("api", identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
    };
  }
}

export const rateLimit = new RateLimit();
