import { Redis } from 'ioredis';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { redisCacheCounter } from '../utils/metrics.js';

export let redisClient: Redis;

try {
  redisClient = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      if (config.NODE_ENV === 'test') return null; // Don't retry indefinitely in unit tests
      return Math.min(times * 100, 3000);
    },
  });

  redisClient.on('error', (err: any) => {
    logger.warn({ error: err.message }, 'Redis client connection warning/error');
  });

  redisClient.on('connect', () => {
    logger.info('Connected to Redis server');
  });
} catch (e: any) {
  logger.warn('Failed to construct Redis client');
}

/**
 * Cache Get Helper with Metrics
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redisClient.get(key);
    if (data) {
      redisCacheCounter.inc({ result: 'hit' });
      return JSON.parse(data) as T;
    }
    redisCacheCounter.inc({ result: 'miss' });
    return null;
  } catch (err) {
    logger.warn({ key, error: (err as any).message }, 'Redis cache get failed, bypassing cache');
    redisCacheCounter.inc({ result: 'miss' });
    return null;
  }
}

/**
 * Cache Set Helper
 */
export async function cacheSet(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    logger.warn({ key, error: (err as any).message }, 'Redis cache set failed');
  }
}

/**
 * Cache Delete Helper
 */
export async function cacheDel(key: string): Promise<void> {
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.warn({ key, error: (err as any).message }, 'Redis cache del failed');
  }
}

const inMemoryLocks = new Map<string, { lockId: string; expiresAt: number }>();

/**
 * Distributed Lock (Redlock Single Instance Pattern with In-Memory Fallback)
 * Acquires lock using SET resource_key lock_id NX PX ttlMs
 */
export async function acquireLock(resourceKey: string, lockId: string, ttlMs: number = 10000): Promise<boolean> {
  try {
    if (redisClient && redisClient.status === 'ready') {
      const result = await redisClient.set(`lock:${resourceKey}`, lockId, 'PX', ttlMs, 'NX');
      return result === 'OK';
    }
  } catch (err) {
    logger.warn({ resourceKey, error: (err as any).message }, 'Failed to acquire distributed lock from Redis, using in-memory lock');
  }

  const now = Date.now();
  const existing = inMemoryLocks.get(resourceKey);
  if (existing && existing.expiresAt > now) {
    return false;
  }
  inMemoryLocks.set(resourceKey, { lockId, expiresAt: now + ttlMs });
  return true;
}

/**
 * Releases Distributed Lock using Lua script or in-memory fallback
 */
export async function releaseLock(resourceKey: string, lockId: string): Promise<boolean> {
  const luaScript = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  try {
    if (redisClient && redisClient.status === 'ready') {
      const result = await redisClient.eval(luaScript, 1, `lock:${resourceKey}`, lockId);
      return result === 1;
    }
  } catch (err) {
    logger.warn({ resourceKey, error: (err as any).message }, 'Failed to release distributed lock');
  }

  const existing = inMemoryLocks.get(resourceKey);
  if (existing && existing.lockId === lockId) {
    inMemoryLocks.delete(resourceKey);
    return true;
  }
  return false;
}
