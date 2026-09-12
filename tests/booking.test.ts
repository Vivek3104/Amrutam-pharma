import { BookingService } from '../src/services/booking.service.js';
import { runMigrations } from '../src/database/migrate.js';
import { query, pool } from '../src/database/index.js';
import bcrypt from 'bcrypt';

describe('Booking Service & Double-Booking Concurrency Tests', () => {
  let patientId: string;
  let doctorId: string;
  let slotId: string;

  beforeAll(async () => {
    await runMigrations();

    const pass = await bcrypt.hash('Pass123!', 10);
    // Create Patient
    const pRes = await query(`INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'PATIENT') RETURNING id`, [`patient.booking.${Date.now()}@amrutam.co`, pass]);
    patientId = pRes.rows[0].id;
    await query(`INSERT INTO profiles (user_id, full_name) VALUES ($1, 'Booking Patient')`, [patientId]);

    // Create Doctor
    const dUserRes = await query(`INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'DOCTOR') RETURNING id`, [`doc.booking.${Date.now()}@amrutam.co`, pass]);
    const docUserId = dUserRes.rows[0].id;
    await query(`INSERT INTO profiles (user_id, full_name) VALUES ($1, 'Dr. Concurrency')`, [docUserId]);
    const dRes = await query(`INSERT INTO doctors (user_id, specialty, consultation_fee) VALUES ($1, 'Ayurveda', 500) RETURNING id`, [docUserId]);
    doctorId = dRes.rows[0].id;

    // Create Slot
    const start = new Date(Date.now() + 86400000);
    const end = new Date(start.getTime() + 1800000);
    const slotRes = await query(
      `INSERT INTO availability_slots (doctor_id, start_time, end_time, is_booked) VALUES ($1, $2, $3, FALSE) RETURNING id`,
      [doctorId, start.toISOString(), end.toISOString()]
    );
    slotId = slotRes.rows[0].id;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should successfully book an available slot', async () => {
    const bookingService = new BookingService();
    const result = await bookingService.bookConsultation({
      patientId,
      doctorId,
      slotId,
      consultationType: 'VIDEO',
    });

    expect(result).toBeDefined();
    expect(result.status).toBe('SCHEDULED');
    expect(result.slotId).toBe(slotId);
  });

  it('should reject double-booking of the same slot', async () => {
    const bookingService = new BookingService();
    
    await expect(
      bookingService.bookConsultation({
        patientId,
        doctorId,
        slotId,
        consultationType: 'VIDEO',
      })
    ).rejects.toThrow('This slot is already booked');
  });
});
