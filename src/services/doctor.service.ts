import { query } from '../database/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import { cacheDel } from '../redis/index.js';

export interface CreateSlotDTO {
  doctorId: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
}

export class DoctorService {
  async getAllDoctors() {
    const res = await query(
      `SELECT d.id, d.user_id, d.specialty, d.experience_years, d.consultation_fee, d.rating, d.bio,
              p.full_name, p.gender, u.email
       FROM doctors d
       JOIN users u ON u.id = d.user_id
       JOIN profiles p ON p.user_id = u.id
       WHERE d.is_verified = TRUE`
    );

    const doctors = res.rows;
    for (const doc of doctors) {
      const slots = await this.getDoctorSlots(doc.id);
      doc.availableSlots = slots;
      doc.specialization = doc.specialty;
      doc.registrationNo = `AYUSH-DEL-${doc.id.slice(0, 4).toUpperCase()}-2024`;
      doc.hospitalAffiliation = 'Amrutam Ayurveda Research Institute';
    }
    return doctors;
  }

  async getDoctorByUserId(userId: string) {
    const res = await query(
      `SELECT d.*, u.email, p.full_name, p.gender 
       FROM doctors d
       JOIN users u ON u.id = d.user_id
       JOIN profiles p ON p.user_id = u.id
       WHERE d.user_id = $1`,
      [userId]
    );
    if (res.rows.length === 0) {
      throw new AppError('Doctor record not found', 404);
    }
    const doc = res.rows[0];
    doc.specialization = doc.specialty;
    doc.registrationNo = `AYUSH-DEL-${doc.id.slice(0, 4).toUpperCase()}-2024`;
    doc.hospitalAffiliation = 'Amrutam Ayurveda Research Institute';
    return doc;
  }

  async createSlots(dto: CreateSlotDTO) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new AppError('Slot start time must be before end time', 400);
    }

    const res = await query(
      `INSERT INTO availability_slots (doctor_id, start_time, end_time, is_booked)
       VALUES ($1, $2, $3, FALSE)
       ON CONFLICT (doctor_id, start_time) DO NOTHING
       RETURNING *;`,
      [dto.doctorId, start.toISOString(), end.toISOString()]
    );

    // Invalidate Doctor Cache
    await cacheDel(`doctor:${dto.doctorId}:slots`);

    return res.rows[0];
  }

  async getDoctorSlots(doctorId: string) {
    const res = await query(
      `SELECT id, doctor_id, start_time, end_time, is_booked, version
       FROM availability_slots
       WHERE doctor_id = $1 AND is_booked = FALSE
       ORDER BY start_time ASC;`,
      [doctorId]
    );
    return res.rows;
  }
}
