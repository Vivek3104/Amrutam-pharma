import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../redis/index.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

const memoryStore = new Map<string, { count: number; resetTime: number }>();

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  if (config.NODE_ENV === 'test') {
    return next(); // Bypass rate limit during automated test runs
  }

  const identifier = req.user?.id || req.ip || 'anonymous';
  const key = `ratelimit:${identifier}`;
  const windowMs = config.RATE_LIMIT_WINDOW_MS;
  const maxRequests = config.RATE_LIMIT_MAX_REQUESTS;

  try {
    if (redisClient && redisClient.status === 'ready') {
      const current = await redisClient.incr(key);
      if (current === 1) {
        await redisClient.pexpire(key, windowMs);
      }

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));

      if (current > maxRequests) {
        return res.status(429).json({
          type: 'https://amrutam.co/errors/rate-limit-exceeded',
          title: 'Too Many Requests',
          status: 429,
          detail: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        });
      }
      return next();
    }
  } catch (err: any) {
    logger.warn({ error: err.message }, 'Redis rate limit lookup failed, falling back to memory store');
  }

  // In-Memory Fallback
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record || now > record.resetTime) {
    memoryStore.set(identifier, { count: 1, resetTime: now + windowMs });
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
    return next();
  }

  record.count += 1;
  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));

  if (record.count > maxRequests) {
    return res.status(429).json({
      type: 'https://amrutam.co/errors/rate-limit-exceeded',
      title: 'Too Many Requests',
      status: 429,
      detail: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
    });
  }

  next();
}
