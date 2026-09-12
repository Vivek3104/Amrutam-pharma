import request from 'supertest';
import { app } from '../src/app.js';

describe('Idempotency Middleware Integration Tests', () => {
  it('should allow normal requests when X-Idempotency-Key is not provided', async () => {
    const res = await request(app).get('/health/liveness');
    expect(res.status).toBe(200);
    expect(res.headers['x-cache-lookup']).toBeUndefined();
  });
});
