import express from 'express';
import request from 'supertest';
import {
  validate,
  registerSchema,
  createBookingSchema,
  createSlotSchema,
  updateConsultationStatusSchema,
} from '../src/middlewares/validate.js';

describe('Input Validation Middleware (Zod Schemas)', () => {
  const app = express();
  app.use(express.json());

  app.post('/test/register', validate(registerSchema), (req, res) => {
    res.status(200).json({ success: true, data: req.body });
  });

  app.post('/test/booking', validate(createBookingSchema), (req, res) => {
    res.status(200).json({ success: true, data: req.body });
  });

  app.post('/test/slots', validate(createSlotSchema), (req, res) => {
    res.status(200).json({ success: true, data: req.body });
  });

  app.patch('/test/consultation/status', validate(updateConsultationStatusSchema), (req, res) => {
    res.status(200).json({ success: true, data: req.body });
  });

  it('should pass valid registration data', async () => {
    const res = await request(app)
      .post('/test/register')
      .send({
        email: 'patient.test@amrutam.co',
        password: 'ValidPassword123',
        fullName: 'Aarav Sharma',
        role: 'PATIENT',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject registration with invalid email and short password', async () => {
    const res = await request(app)
      .post('/test/register')
      .send({
        email: 'not-an-email',
        password: '123',
        fullName: 'A',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should reject booking when slotId is missing', async () => {
    const res = await request(app)
      .post('/test/booking')
      .send({
        type: 'VIDEO',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('should reject consultation status with invalid enum value', async () => {
    const res = await request(app)
      .patch('/test/consultation/status')
      .send({
        status: 'UNKNOWN_INVALID_STATUS',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('should accept valid consultation status update', async () => {
    const res = await request(app)
      .patch('/test/consultation/status')
      .send({
        status: 'COMPLETED',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('COMPLETED');
  });
});
