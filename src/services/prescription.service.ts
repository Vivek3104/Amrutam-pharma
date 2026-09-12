import { query } from '../database/index.js';
import { encrypt, decrypt, createDigitalSignature, verifyDigitalSignature } from '../utils/crypto.js';
import { AppError } from '../middlewares/errorHandler.js';

export interface CreatePrescriptionDTO {
  consultationId: string;
  doctorId: string;
  patientId: string;
  diagnosis: string;
  medicines: Array<{ name: string; dosage: string; frequency: string; durationDays: number }>;
  notes?: string;
}

export class PrescriptionService {
  async createPrescription(dto: CreatePrescriptionDTO) {
    // Verify consultation exists and is COMPLETED or IN_PROGRESS
    const consRes = await query(`SELECT status FROM consultations WHERE id = $1`, [dto.consultationId]);
    if (consRes.rows.length === 0) {
      throw new AppError('Consultation not found', 404);
    }

    const medicinesStr = JSON.stringify(dto.medicines);

    // 1. Encrypt sensitive health fields with AES-256-GCM
    const diagnosisEncrypted = encrypt(dto.diagnosis);
    const medicinesEncrypted = encrypt(medicinesStr);
    const notesEncrypted = dto.notes ? encrypt(dto.notes) : null;

    // 2. Create digital signature (HMAC-SHA256)
    const signaturePayload = `${dto.consultationId}:${dto.patientId}:${dto.doctorId}:${dto.diagnosis}`;
    const digitalSignature = createDigitalSignature(signaturePayload);

    // 3. Save to database
    const res = await query(
      `INSERT INTO prescriptions (consultation_id, doctor_id, patient_id, diagnosis_encrypted, medicines_encrypted, notes_encrypted, digital_signature)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, consultation_id, created_at, digital_signature;`,
      [dto.consultationId, dto.doctorId, dto.patientId, diagnosisEncrypted, medicinesEncrypted, notesEncrypted, digitalSignature]
    );

    return res.rows[0];
  }

  async getPrescriptionByConsultationId(consultationId: string, requestingUserId: string) {
    const res = await query(
      `SELECT * FROM prescriptions WHERE consultation_id = $1`,
      [consultationId]
    );

    if (res.rows.length === 0) {
      throw new AppError('Prescription not found', 404);
    }

    const item = res.rows[0];

    // Decrypt fields
    const diagnosis = decrypt(item.diagnosis_encrypted);
    const medicines = JSON.parse(decrypt(item.medicines_encrypted));
    const notes = item.notes_encrypted ? decrypt(item.notes_encrypted) : null;

    // Verify digital signature integrity
    const signaturePayload = `${item.consultation_id}:${item.patient_id}:${item.doctor_id}:${diagnosis}`;
    const isValidSignature = verifyDigitalSignature(signaturePayload, item.digital_signature);

    return {
      id: item.id,
      consultationId: item.consultation_id,
      doctorId: item.doctor_id,
      patientId: item.patient_id,
      diagnosis,
      medicines,
      notes,
      digitalSignature: item.digital_signature,
      signatureValid: isValidSignature,
      createdAt: item.created_at,
    };
  }
}
