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

/**
 * Distributed Lock (Redlock Single Instance Pattern)
 * Acquires lock using SET resource_key lock_id NX PX ttlMs
 */
export async function acquireLock(resourceKey: string, lockId: string, ttlMs: number = 10000): Promise<boolean> {
  try {
    const result = await redisClient.set(`lock:${resourceKey}`, lockId, 'PX', ttlMs, 'NX');
    return result === 'OK';
  } catch (err) {
    logger.error({ resourceKey, error: (err as any).message }, 'Failed to acquire distributed lock from Redis');
    return false;
  }
}

/**
 * Releases Distributed Lock using Lua script (atomically checks lockId before deleting)
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
    const result = await redisClient.eval(luaScript, 1, `lock:${resourceKey}`, lockId);
    return result === 1;
  } catch (err) {
    logger.error({ resourceKey, error: (err as any).message }, 'Failed to release distributed lock');
    return false;
  }
}
