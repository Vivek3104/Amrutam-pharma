import pg from 'pg';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { dbQueryDuration } from '../utils/metrics.js';

const { Pool } = pg;

export const pool = new Pool({
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  database: config.POSTGRES_DB,
  user: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  max: config.POSTGRES_MAX_CONNECTIONS,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error({ error: err.message }, 'Unexpected error on idle PostgreSQL client');
});

export async function query<T extends pg.QueryResultRow = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
  const start = Date.now();
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    const duration = (Date.now() - start) / 1000;
    dbQueryDuration.observe({ operation: text.trim().split(' ')[0].toUpperCase() }, duration);
    return res;
  } catch (err: any) {
    logger.error({ query: text, error: err.message }, 'Database query failed');
    throw err;
  } finally {
    client.release();
  }
}

export async function getClient() {
  return await pool.connect();
}
