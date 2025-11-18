/**
 * Centralized Redis cache service
 * Replaces in-memory Map() caches with distributed Redis
 */

import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 15 minutes)
  prefix?: string; // Cache key prefix
}

export class RedisCache {
  private prefix: string;
  private defaultTTL: number;

  constructor(prefix: string = "cache", defaultTTL: number = 900) {
    this.prefix = prefix;
    this.defaultTTL = defaultTTL; // 15 minutes default
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = `${this.prefix}:${key}`;
      const value = await redis.get<T>(fullKey);

      if (value) {
        logger.debug("Cache hit", { key: fullKey });
      } else {
        logger.debug("Cache miss", { key: fullKey });
      }

      return value;
    } catch (error) {
      logger.error("Cache get error", { key, error });
      return null;
    }
  }

  /**
   * Set a value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const fullKey = `${this.prefix}:${key}`;
      const expirationSeconds = ttl || this.defaultTTL;

      await redis.set(fullKey, value, { ex: expirationSeconds });

      logger.debug("Cache set", { key: fullKey, ttl: expirationSeconds });
      return true;
    } catch (error) {
      logger.error("Cache set error", { key, error });
      return false;
    }
  }

  /**
   * Delete a value from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const fullKey = `${this.prefix}:${key}`;
      await redis.del(fullKey);

      logger.debug("Cache delete", { key: fullKey });
      return true;
    } catch (error) {
      logger.error("Cache delete error", { key, error });
      return false;
    }
  }

  /**
   * Clear all keys with this prefix
   */
  async clear(): Promise<boolean> {
    try {
      const pattern = `${this.prefix}:*`;
      const keys = await redis.keys(pattern);

      if (keys.length > 0) {
        await redis.del(...keys);
        logger.info("Cache cleared", {
          prefix: this.prefix,
          count: keys.length,
        });
      }

      return true;
    } catch (error) {
      logger.error("Cache clear error", { prefix: this.prefix, error });
      return false;
    }
  }

  /**
   * Get or set pattern: retrieve from cache or compute and cache
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T | null> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Cache miss - compute value
      const value = await factory();

      // Store in cache
      await this.set(key, value, ttl);

      return value;
    } catch (error) {
      logger.error("Cache getOrSet error", { key, error });
      // If cache fails, still try to compute value
      try {
        return await factory();
      } catch (factoryError) {
        logger.error("Factory function error", { key, error: factoryError });
        return null;
      }
    }
  }

  /**
   * Increment a counter in cache
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      const fullKey = `${this.prefix}:${key}`;
      const newValue = await redis.incrby(fullKey, amount);
      return newValue;
    } catch (error) {
      logger.error("Cache increment error", { key, error });
      return 0;
    }
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const fullKey = `${this.prefix}:${key}`;
      const result = await redis.exists(fullKey);
      return result === 1;
    } catch (error) {
      logger.error("Cache exists error", { key, error });
      return false;
    }
  }
}

// Pre-configured cache instances for different domains
export const normasCache = new RedisCache("normas", 900); // 15 minutes
export const sectoresCache = new RedisCache("sectores", 1800); // 30 minutes
export const paisesCache = new RedisCache("paises", 3600); // 1 hour
export const datasetsCache = new RedisCache("datasets", 300); // 5 minutes
