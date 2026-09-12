import { v4 } from 'uuid';
import { pool } from '../database/index.js';
import { acquireLock, releaseLock, cacheDel } from '../redis/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import { logger } from '../utils/logger.js';
import { bookingSagaCounter } from '../utils/metrics.js';
import { withExponentialBackoff } from '../utils/retry.js';

export interface CreateBookingDTO {
  patientId: string;
  doctorId: string;
  slotId: string;
  consultationType: 'AUDIO' | 'VIDEO' | 'CHAT';
  paymentGatewayToken?: string;
}

export class BookingService {
  /**
   * Books a consultation using Redlock Distributed Locking + Optimistic Slot Locking + Orchestration Saga Pattern
   */
  async bookConsultation(dto: CreateBookingDTO) {
    const lockId = `lock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const resourceKey = `slot:${dto.slotId}`;

    // 1. Acquire Distributed Lock from Redis to prevent simultaneous double-booking
    const lockAcquired = await acquireLock(resourceKey, lockId, 5000); // 5s TTL
    if (!lockAcquired) {
      bookingSagaCounter.inc({ status: 'FAILED_LOCK' });
      throw new AppError(
        'Slot is currently being booked by another request. Please try again.',
        409,
        'https://amrutam.co/errors/slot-locked'
      );
    }

    const client = await pool.connect();
    let sagaStep = 0;
    let consultationId: string | null = null;
    let paymentId: string | null = null;

    try {
      await client.query('BEGIN');

      // Step 1: Check Slot Availability & Lock Row with SELECT FOR UPDATE
      const slotRes = await client.query(
        `SELECT id, doctor_id, start_time, end_time, is_booked, version 
         FROM availability_slots 
         WHERE id = $1 FOR UPDATE;`,
        [dto.slotId]
      );

      if (slotRes.rows.length === 0) {
        throw new AppError('Availability slot not found', 404);
      }

      const slot = slotRes.rows[0];
      if (slot.is_booked) {
        throw new AppError('This slot is already booked', 409, 'https://amrutam.co/errors/already-booked');
      }

      // Step 2: Fetch Doctor Fee
      const docRes = await client.query(`SELECT consultation_fee FROM doctors WHERE id = $1;`, [dto.doctorId]);
      if (docRes.rows.length === 0) {
        throw new AppError('Doctor not found', 404);
      }
      const fee = docRes.rows[0].consultation_fee;

      // Step 3: Optimistic Concurrency Update on Slot
      const updateSlotRes = await client.query(
        `UPDATE availability_slots 
         SET is_booked = TRUE, version = version + 1 
         WHERE id = $1 AND is_booked = FALSE AND version = $2 
         RETURNING id;`,
        [dto.slotId, slot.version]
      );

      if (updateSlotRes.rows.length === 0) {
        throw new AppError('Concurrent booking detected. Slot update failed.', 409);
      }
      sagaStep = 1; // Slot reserved

      // Step 4: Create Consultation Record in status SCHEDULED
      const consRes = await client.query(
        `INSERT INTO consultations (patient_id, doctor_id, slot_id, status, type)
         VALUES ($1, $2, $3, 'SCHEDULED', $4)
         RETURNING id, status, created_at;`,
        [dto.patientId, dto.doctorId, dto.slotId, dto.consultationType]
      );
      consultationId = consRes.rows[0].id;
      sagaStep = 2; // Consultation created

      // Step 5: Process Payment Transaction (Simulated Payment Gateway integration with backoff retry)
      const paymentSuccess = await withExponentialBackoff(
        async () => {
          // Simulate 99% payment success
          if (dto.paymentGatewayToken === 'FAIL') return false;
          return true;
        },
        { maxRetries: 2, initialDelayMs: 50 }
      );

      if (!paymentSuccess) {
        throw new AppError('Payment processing failed', 402, 'https://amrutam.co/errors/payment-failed');
      }

      const payRes = await client.query(
        `INSERT INTO payments (consultation_id, amount, status, payment_gateway_ref)
         VALUES ($1, $2, 'SUCCESS', $3)
         RETURNING id, amount, status;`,
        [consultationId, fee, `PAY-${Date.now()}`]
      );
      paymentId = payRes.rows[0].id;
      sagaStep = 3; // Payment completed

      await client.query('COMMIT');
      bookingSagaCounter.inc({ status: 'SUCCESS' });

      // Invalidate Slot Cache
      cacheDel(`doctor:${dto.doctorId}:slots`).catch(() => {});

      logger.info(
        { consultationId, patientId: dto.patientId, doctorId: dto.doctorId, slotId: dto.slotId },
        'Booking Saga completed successfully'
      );

      return {
        consultationId,
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        slotId: dto.slotId,
        status: 'SCHEDULED',
        type: dto.consultationType,
        payment: payRes.rows[0],
      };
    } catch (err: any) {
      await client.query('ROLLBACK');
      bookingSagaCounter.inc({ status: 'FAILED_SAGA' });

      logger.error(
        { sagaStep, error: err.message, slotId: dto.slotId },
        'Booking Saga failed, executing rollback / compensation'
      );

      // Perform Saga Compensating Actions if needed (already handled by DB ROLLBACK)
      throw err;
    } finally {
      client.release();
      // Always release distributed lock
      await releaseLock(resourceKey, lockId);
    }
  }
}
