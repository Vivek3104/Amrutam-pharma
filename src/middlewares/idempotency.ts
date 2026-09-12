import { Request, Response, NextFunction } from 'express';
import { query } from '../database/index.js';
import { cacheGet, cacheSet } from '../redis/index.js';
import { logger } from '../utils/logger.js';

export interface IdempotencyRecord {
  status: number;
  body: any;
}

export async function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const idempotencyKey = req.headers['x-idempotency-key'] as string;
  if (!idempotencyKey) {
    return next(); // Proceed normally if no idempotency key provided
  }

  const cacheKey = `idempotency:${idempotencyKey}`;

  try {
    // 1. Check Redis Cache
    const cachedRecord = await cacheGet<IdempotencyRecord>(cacheKey);
    if (cachedRecord) {
      logger.info({ idempotencyKey }, 'Idempotent request cache hit (Redis)');
      res.setHeader('X-Cache-Lookup', 'HIT');
      return res.status(cachedRecord.status).json(cachedRecord.body);
    }

    // 2. Check Database Record
    const dbRes = await query(
      `SELECT response_status, response_body FROM idempotency_keys WHERE key = $1 AND expires_at > NOW()`,
      [idempotencyKey]
    );

    if (dbRes.rows.length > 0) {
      const record = dbRes.rows[0];
      const parsedBody = JSON.parse(record.response_body);
      logger.info({ idempotencyKey }, 'Idempotent request cache hit (Database)');
      
      // Populate Redis Cache
      await cacheSet(cacheKey, { status: record.response_status, body: parsedBody }, 86400);

      res.setHeader('X-Cache-Lookup', 'HIT');
      return res.status(record.response_status).json(parsedBody);
    }

    // 3. Intercept Response Write to Save
    const originalJson = res.json.bind(res);
    res.json = (body: any): Response => {
      // Only cache successful or business error responses (2xx / 4xx)
      if (res.statusCode >= 200 && res.statusCode < 500) {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Save to Redis asynchronously
        cacheSet(cacheKey, { status: res.statusCode, body }, 86400).catch((err) =>
          logger.warn({ error: err.message }, 'Failed to write idempotency key to Redis')
        );

        // Save to Postgres asynchronously
        query(
          `INSERT INTO idempotency_keys (key, user_id, request_path, response_status, response_body, expires_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (key) DO NOTHING;`,
          [idempotencyKey, req.user?.id || null, req.originalUrl, res.statusCode, JSON.stringify(body), expiresAt]
        ).catch((err) => logger.warn({ error: err.message }, 'Failed to persist idempotency key to DB'));
      }
      return originalJson(body);
    };

    next();
  } catch (err: any) {
    logger.error({ error: err.message }, 'Error in idempotency middleware');
    next();
  }
}
