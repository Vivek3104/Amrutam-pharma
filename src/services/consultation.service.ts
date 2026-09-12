import { query } from '../database/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import { activeConsultationsGauge } from '../utils/metrics.js';

export class ConsultationService {
  async getConsultationById(id: string) {
    const res = await query(
      `SELECT c.*, 
              s.start_time, s.end_time, 
              p.full_name as patient_name, 
              dp.full_name as doctor_name, d.specialty
       FROM consultations c
       JOIN availability_slots s ON s.id = c.slot_id
       JOIN users pu ON pu.id = c.patient_id
       JOIN profiles p ON p.user_id = pu.id
       JOIN doctors d ON d.id = c.doctor_id
       JOIN users du ON du.id = d.user_id
       JOIN profiles dp ON dp.user_id = du.id
       WHERE c.id = $1`,
      [id]
    );

    if (res.rows.length === 0) {
      throw new AppError('Consultation not found', 404);
    }
    return res.rows[0];
  }

  async updateStatus(id: string, newStatus: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED', userId: string) {
    const cons = await this.getConsultationById(id);

    // State machine transition validation
    const validTransitions: Record<string, string[]> = {
      SCHEDULED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[cons.status]?.includes(newStatus)) {
      throw new AppError(
        `Invalid state transition from ${cons.status} to ${newStatus}`,
        400,
        'https://amrutam.co/errors/invalid-state-transition'
      );
    }

    const res = await query(
      `UPDATE consultations 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *;`,
      [newStatus, id]
    );

    // Update active consultations Prometheus Gauge
    if (newStatus === 'IN_PROGRESS') {
      activeConsultationsGauge.inc();
    } else if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
      activeConsultationsGauge.dec();
    }

    return res.rows[0];
  }

  async getUserConsultations(userId: string, role: 'PATIENT' | 'DOCTOR') {
    let sql = '';
    if (role === 'PATIENT') {
      sql = `
        SELECT c.*, s.start_time, s.end_time, dp.full_name as doctor_name, d.specialty
        FROM consultations c
        JOIN availability_slots s ON s.id = c.slot_id
        JOIN doctors d ON d.id = c.doctor_id
        JOIN profiles dp ON dp.user_id = d.user_id
        WHERE c.patient_id = $1
        ORDER BY s.start_time DESC;
      `;
    } else {
      sql = `
        SELECT c.*, s.start_time, s.end_time, p.full_name as patient_name
        FROM consultations c
        JOIN availability_slots s ON s.id = c.slot_id
        JOIN doctors d ON d.id = c.doctor_id
        JOIN profiles p ON p.user_id = c.patient_id
        WHERE d.user_id = $1
        ORDER BY s.start_time DESC;
      `;
    }

    const res = await query(sql, [userId]);
    return res.rows;
  }
}
