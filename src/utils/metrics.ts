import client from 'prom-client';

// Collect default Node.js system metrics (CPU, Memory, Event Loop Lag)
client.collectDefaultMetrics({ prefix: 'amrutam_' });

export const httpRequestCounter = new client.Counter({
  name: 'amrutam_http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestDuration = new client.Histogram({
  name: 'amrutam_http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
});

export const activeConsultationsGauge = new client.Gauge({
  name: 'amrutam_active_consultations_total',
  help: 'Current total active consultations',
});

export const bookingSagaCounter = new client.Counter({
  name: 'amrutam_booking_saga_total',
  help: 'Total booking saga executions',
  labelNames: ['status'],
});

export const dbQueryDuration = new client.Histogram({
  name: 'amrutam_db_query_duration_seconds',
  help: 'Database query execution latency',
  labelNames: ['operation'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
});

export const redisCacheCounter = new client.Counter({
  name: 'amrutam_redis_cache_requests_total',
  help: 'Redis cache hit/miss count',
  labelNames: ['result'], // 'hit' or 'miss'
});

export const metricsRegistry = client.register;
