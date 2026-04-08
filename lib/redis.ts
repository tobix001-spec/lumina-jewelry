/**
 * lib/redis.ts
 * Shared Redis client (ioredis) for inventory caching and session management.
 *
 * Cache key conventions:
 *   diamond:<id>           — individual diamond detail
 *   diamonds:search:<hash> — paginated search results (TTL: 15 min)
 *   settings:<id>          — individual setting
 *   settings:list:<hash>   — filtered setting results
 *   inventory:sync:lock    — distributed lock for RapNet sync job
 */

import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

  client.on("error", (err) => {
    // Suppress ECONNREFUSED noise in dev when Redis isn't running locally
    if (process.env.NODE_ENV !== "production" && (err as NodeJS.ErrnoException).code === "ECONNREFUSED") return;
    console.error("[Redis] Connection error:", err);
  });

  client.on("connect", () => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Redis] Connected");
    }
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// ─── Cache Helpers ────────────────────────────────────────────────────────────

/** Default TTL values in seconds. */
export const CACHE_TTL = {
  DIAMOND_SEARCH: 60 * 15,   // 15 min — diamond availability changes frequently
  DIAMOND_DETAIL: 60 * 30,   // 30 min
  SETTING_LIST: 60 * 60,     // 1 hour — settings change rarely
  SETTING_DETAIL: 60 * 60 * 2,
  PRICE_CALCULATION: 60 * 5, // 5 min
} as const;

/** Cache-aside read: try Redis, fall back to DB loader, then store result. */
export async function cacheAside<T>(
  key: string,
  ttl: number,
  loader: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }

  const data = await loader();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

/** Invalidate a single cache key. */
export async function invalidateCache(key: string): Promise<void> {
  await redis.del(key);
}

/** Invalidate all keys matching a glob pattern (use sparingly on large datasets). */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

/** Deterministic hash of an object for use as a cache key suffix. */
export function hashParams(params: Record<string, unknown>): string {
  const sorted = Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .sort(([a], [b]) => a.localeCompare(b))
  );
  // Simple djb2-style hash — not cryptographically secure, not needed here
  let hash = 5381;
  const str = JSON.stringify(sorted);
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}
