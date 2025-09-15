import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "./logger";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different rate limits for different operations
export const ratelimits = {
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

export async function checkRateLimit(
  limitType: keyof typeof ratelimits,
  identifier: string,
  context?: Record<string, any>,
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}> {
  try {
    const ratelimit = ratelimits[limitType];
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
  } catch (error: any) {
    // If rate limiting fails, allow the request but log the error
    await logger.error("Rate limit check failed", {
      limitType,
      identifier,
      error: error.message,
      ...context,
    });

    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: new Date(),
    };
  }
}

// Helper function to get client IP address
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const clientIP = request.headers.get("x-client-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  if (clientIP) {
    return clientIP.trim();
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
