import pg from 'pg';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { dbQueryDuration } from '../utils/metrics.js';
import { fallbackStore } from './fallbackStore.js';

const { Pool } = pg;

export const rawPool = new Pool({
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  database: config.POSTGRES_DB,
  user: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  max: config.POSTGRES_MAX_CONNECTIONS,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 1500,
});

let isPostgresAvailable: boolean | null = null;

rawPool.on('error', (err) => {
  logger.warn({ error: err.message }, 'PostgreSQL connection unavailable, operating in in-memory fallback mode');
  isPostgresAvailable = false;
});

class MockClient {
  async query(text: string, params: any[] = []): Promise<pg.QueryResult<any>> {
    const res = await fallbackStore.executeQuery(text, params);
    return {
      rows: res.rows,
      rowCount: res.rowCount,
      command: text.trim().split(' ')[0],
      oid: 0,
      fields: [],
    };
  }

  release() {
    // No-op for mock client
  }
}

async function checkPostgres(): Promise<boolean> {
  if (isPostgresAvailable !== null) {
    return isPostgresAvailable;
  }
  try {
    const client = await rawPool.connect();
    await client.query('SELECT 1');
    client.release();
    isPostgresAvailable = true;
    logger.info('PostgreSQL connection established successfully.');
    return true;
  } catch (err: any) {
    logger.warn({ error: err.message }, 'PostgreSQL unreachable; using resilient in-memory database fallback.');
    isPostgresAvailable = false;
    return false;
  }
}

export const pool = {
  async connect(): Promise<any> {
    const available = await checkPostgres();
    if (available) {
      try {
        return await rawPool.connect();
      } catch (err) {
        isPostgresAvailable = false;
        return new MockClient();
      }
    }
    return new MockClient();
  },

  async query<T extends pg.QueryResultRow = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
    return query(text, params);
  },

  async end(): Promise<void> {
    try {
      if (isPostgresAvailable) {
        await rawPool.end();
      }
    } catch {
      // Safe shutdown
    }
  },

  on(event: string, listener: (...args: any[]) => void) {
    rawPool.on(event as any, listener);
  },
};

export async function query<T extends pg.QueryResultRow = any>(text: string, params: any[] = []): Promise<pg.QueryResult<T>> {
  const start = Date.now();
  const available = await checkPostgres();

  if (available) {
    let client: pg.PoolClient | null = null;
    try {
      client = await rawPool.connect();
      const res = await client.query(text, params);
      const duration = (Date.now() - start) / 1000;
      dbQueryDuration.observe({ operation: text.trim().split(' ')[0].toUpperCase() }, duration);
      return res;
    } catch (err: any) {
      // If network/connection drop, fallback seamlessly
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Connection terminated')) {
        isPostgresAvailable = false;
        logger.warn('Flipping to fallback store due to connection drop');
      } else {
        logger.error({ query: text, error: err.message }, 'Database query error');
        throw err;
      }
    } finally {
      if (client) client.release();
    }
  }

  // Resilient In-Memory Fallback
  const res = await fallbackStore.executeQuery(text, params);
  const duration = (Date.now() - start) / 1000;
  dbQueryDuration.observe({ operation: text.trim().split(' ')[0].toUpperCase() }, duration);

  return {
    rows: res.rows as T[],
    rowCount: res.rowCount,
    command: text.trim().split(' ')[0],
    oid: 0,
    fields: [],
  };
}

export async function getClient() {
  return await pool.connect();
}
