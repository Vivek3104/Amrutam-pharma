import { app } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { pool } from './database/index.js';
import { redisClient } from './redis/index.js';

const server = app.listen(config.PORT, config.HOST, () => {
  logger.info(`Amrutam Telemedicine Backend listening at http://${config.HOST}:${config.PORT}`);
  logger.info(`Prometheus Metrics available at http://${config.HOST}:${config.PORT}/metrics`);
  logger.info(`Health check available at http://${config.HOST}:${config.PORT}/health/readiness`);
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      await pool.end();
      logger.info('PostgreSQL connection pool closed.');

      if (redisClient) {
        await redisClient.quit();
        logger.info('Redis connection closed.');
      }
    } catch (err: any) {
      logger.error({ error: err.message }, 'Error during graceful cleanup');
    }

    process.exit(0);
  });

  // Force exit if cleanup takes longer than 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
