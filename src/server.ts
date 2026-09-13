import { app } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { pool } from './database/index.js';
import { redisClient } from './redis/index.js';

const server = app.listen(config.PORT, config.HOST, () => {
  logger.info(`Amrutam Ayurvedic E-Commerce Backend running at http://${config.HOST}:${config.PORT}`);
  logger.info(`API v1 Base URL: http://${config.HOST}:${config.PORT}/api/v1`);
  logger.info(`Health check available at http://${config.HOST}:${config.PORT}/health/readiness`);
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      if (pool) {
        await pool.end().catch(() => {});
        logger.info('PostgreSQL connection pool closed.');
      }

      if (redisClient) {
        await redisClient.quit().catch(() => {});
        logger.info('Redis connection closed.');
      }
    } catch (err: any) {
      logger.error({ error: err.message }, 'Error during graceful cleanup');
    }

    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
