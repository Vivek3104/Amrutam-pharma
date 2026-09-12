import request from 'supertest';
import { app } from '../src/app.js';
import { pool } from '../src/database/index.js';
import { runMigrations } from '../src/database/migrate.js';

describe('Auth API & RBAC Integration Tests', () => {
  beforeAll(async () => {
    await runMigrations();
  });

  afterAll(async () => {
    await pool.end();
  });

  const testEmail = `test.user.${Date.now()}@amrutam.co`;

  it('should register a new patient user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: 'SecurePassword123!',
        fullName: 'Test Patient',
        role: 'PATIENT',
        phone: '+919876543210',
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.token).toBeDefined();
  });

  it('should reject registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: 'SecurePassword123!',
        fullName: 'Test Patient Duplicate',
        role: 'PATIENT',
      });

    expect(res.status).toBe(400);
    expect(res.body.detail).toContain('already exists');
  });

  it('should authenticate user and return JWT token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'SecurePassword123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
  });
});
