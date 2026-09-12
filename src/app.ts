import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { metricsRegistry } from './utils/metrics.js';
import { metricsMiddleware } from './middlewares/metricsMiddleware.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import apiRouter from './routes/index.js';
import { pool } from './database/index.js';
import { redisClient } from './redis/index.js';

export const app: Express = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Observability: Metrics Collection
app.use(metricsMiddleware);

// Liveness Health Check Endpoint
app.get('/health/liveness', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Readiness Health Check Endpoint (Probes DB & Redis Connections)
app.get('/health/readiness', async (req: Request, res: Response) => {
  try {
    // Check Database Connection
    await pool.query('SELECT 1');
    
    // Check Redis Connection
    const redisReady = redisClient && redisClient.status === 'ready';

    if (redisReady) {
      return res.status(200).json({
        status: 'READY',
        database: 'CONNECTED',
        redis: 'CONNECTED',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      status: 'DEGRADED',
      database: 'CONNECTED',
      redis: 'DISCONNECTED',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(503).json({
      status: 'NOT_READY',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Prometheus Metrics Endpoint
app.get('/metrics', async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', metricsRegistry.contentType);
    res.end(await metricsRegistry.metrics());
  } catch (err: any) {
    res.status(500).end(err.message);
  }
});

// Rate Limiting
app.use(rateLimiter);

// API v1 Routes
app.use('/api/v1', apiRouter);

// Centralized RFC 7807 Error Handler
app.use(errorHandler);
