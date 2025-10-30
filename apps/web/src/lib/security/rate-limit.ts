/**
 * Rate limiting using Upstash Redis
 * Protects API routes from abuse
 */

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export type RateLimitConfig = {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RateLimitError'
  }
}

/**
 * Rate limiter using sliding window algorithm
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 requests per minute
  }
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  const key = `rate-limit:${identifier}`
  const now = Date.now()
  const window = config.interval

  try {
    // Get current count
    const current = await redis.get<number>(key)

    if (current === null) {
      // First request in window
      await redis.set(key, 1, { px: window })
      return {
        success: true,
        limit: config.uniqueTokenPerInterval,
        remaining: config.uniqueTokenPerInterval - 1,
        reset: now + window,
      }
    }

    if (current >= config.uniqueTokenPerInterval) {
      // Rate limit exceeded
      const ttl = await redis.ttl(key)
      return {
        success: false,
        limit: config.uniqueTokenPerInterval,
        remaining: 0,
        reset: now + ttl * 1000,
      }
    }

    // Increment counter
    await redis.incr(key)

    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval - current - 1,
      reset: now + window,
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Fail open - allow request if Redis is down
    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval,
      reset: now + window,
    }
  }
}

/**
 * IP-based rate limiting
 */
export async function rateLimitByIP(
  ip: string,
  config?: RateLimitConfig
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  return rateLimit(`ip:${ip}`, config)
}

/**
 * User-based rate limiting
 */
export async function rateLimitByUser(
  userId: string,
  config?: RateLimitConfig
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  return rateLimit(`user:${userId}`, config)
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  // Try various headers that may contain the real IP
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }

  const cfConnectingIP = headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }

  return 'unknown'
}
