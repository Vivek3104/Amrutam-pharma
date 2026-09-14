import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { encrypt } from '../utils/crypto.js';
import { logger } from '../utils/logger.js';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  mfa_secret: string | null;
  mfa_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  user_id: string;
  full_name: string;
  phone_encrypted: string | null;
  dob_encrypted?: string | null;
  gender: string;
  created_at: string;
}

export interface DoctorRow {
  id: string;
  user_id: string;
  specialty: string;
  experience_years: number;
  consultation_fee: number;
  rating: number;
  bio: string;
  is_verified: boolean;
  created_at: string;
}

export interface SlotRow {
  id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  version: number;
  created_at: string;
}

export interface ConsultationRow {
  id: string;
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface PrescriptionRow {
  id: string;
  consultation_id: string;
  doctor_id: string;
  patient_id: string;
  diagnosis_encrypted: string;
  medicines_encrypted: string;
  notes_encrypted: string | null;
  digital_signature: string;
  created_at: string;
}

export interface PaymentRow {
  id: string;
  consultation_id: string;
  amount: number;
  currency: string;
  status: string;
  idempotency_key: string | null;
  payment_gateway_ref: string | null;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  user_id: string | null;
  user_role: string | null;
  action: string;
  resource: string;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  payload_hash: string | null;
  timestamp: string;
}

export interface IdempotencyRow {
  key: string;
  user_id: string | null;
  request_path: string;
  response_status: number;
  response_body: string;
  created_at: string;
  expires_at: string;
}

export class FallbackStore {
  public users: UserRow[] = [];
  public profiles: ProfileRow[] = [];
  public doctors: DoctorRow[] = [];
  public slots: SlotRow[] = [];
  public consultations: ConsultationRow[] = [];
  public prescriptions: PrescriptionRow[] = [];
  public payments: PaymentRow[] = [];
  public auditLogs: AuditLogRow[] = [];
  public idempotencyKeys: IdempotencyRow[] = [];

  private isSeeded = false;

  constructor() {
    this.seed();
  }

  public async seed() {
    if (this.isSeeded) return;
    this.isSeeded = true;

    try {
      const defaultHash = await bcrypt.hash('Password@123', 10);
      const adminHash = await bcrypt.hash('admin123', 10);

      // 1. Admin
      const adminId = uuidv4();
      this.users.push({
        id: adminId,
        email: 'admin@amrutam.co',
        password_hash: adminHash,
        role: 'ADMIN',
        mfa_secret: null,
        mfa_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      this.profiles.push({
        id: uuidv4(),
        user_id: adminId,
        full_name: 'Amrutam Site Administrator',
        phone_encrypted: encrypt('+919800000000'),
        gender: 'OTHER',
        created_at: new Date().toISOString(),
      });

      // 2. Doctors
      const docs = [
        {
          email: 'dr.ayurveda@amrutam.co',
          name: 'Dr. Vaidya Ananya Sharma',
          specialty: 'Senior Ayurvedic Physician & Kayachikitsa Expert',
          exp: 14,
          fee: 750,
          rating: 4.95,
          bio: 'Chief Medical Officer specializing in Panchakarma detox, chronic metabolic disorders, and digestive health with 14+ years of clinical excellence.',
        },
        {
          email: 'dr.dermatology@amrutam.co',
          name: 'Dr. Rajesh Varma',
          specialty: 'Ayurvedic Dermatologist & Rasayana Specialist',
          exp: 16,
          fee: 900,
          rating: 4.9,
          bio: 'Renowned Specialist formulating clinical herbal remedies for psoriasis, eczema, acne vulgaris, and natural skin revitalization.',
        },
        {
          email: 'dr.wellness@amrutam.co',
          name: 'Dr. Meera Nambiar',
          specialty: 'Women Health & Hormonal Balance Consultant',
          exp: 10,
          fee: 650,
          rating: 4.98,
          bio: 'Integrative Gynaecologist specializing in PCOS/PCOD management, fertility enhancement, and postpartum restoration.',
        },
      ];

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      for (const d of docs) {
        const uId = uuidv4();
        this.users.push({
          id: uId,
          email: d.email,
          password_hash: defaultHash,
          role: 'DOCTOR',
          mfa_secret: null,
          mfa_enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        this.profiles.push({
          id: uuidv4(),
          user_id: uId,
          full_name: d.name,
          phone_encrypted: encrypt('+919876543210'),
          gender: 'OTHER',
          created_at: new Date().toISOString(),
        });

        const docId = uuidv4();
        this.doctors.push({
          id: docId,
          user_id: uId,
          specialty: d.specialty,
          experience_years: d.exp,
          consultation_fee: d.fee,
          rating: d.rating,
          bio: d.bio,
          is_verified: true,
          created_at: new Date().toISOString(),
        });

        // 3 slots per doctor
        for (const hour of [10, 14, 16]) {
          const sTime = new Date(tomorrow);
          sTime.setHours(hour, 0, 0, 0);
          const eTime = new Date(sTime);
          eTime.setMinutes(30);

          this.slots.push({
            id: uuidv4(),
            doctor_id: docId,
            start_time: sTime.toISOString(),
            end_time: eTime.toISOString(),
            is_booked: false,
            version: 1,
            created_at: new Date().toISOString(),
          });
        }
      }

      // 3. Demo Patient
      const patientId = uuidv4();
      this.users.push({
        id: patientId,
        email: 'patient.demo@amrutam.co',
        password_hash: defaultHash,
        role: 'PATIENT',
        mfa_secret: null,
        mfa_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      this.profiles.push({
        id: uuidv4(),
        user_id: patientId,
        full_name: 'Amit Kumar',
        phone_encrypted: encrypt('+919123456789'),
        gender: 'MALE',
        created_at: new Date().toISOString(),
      });

      // 4. Initial demo audit logs
      this.auditLogs.push({
        id: uuidv4(),
        user_id: adminId,
        user_role: 'ADMIN',
        action: 'SYSTEM_BOOTSTRAP',
        resource: 'system',
        resource_id: 'boot',
        ip_address: '127.0.0.1',
        user_agent: 'Amrutam-Internal/1.0',
        payload_hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      });
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Error during fallback store seeding');
    }
  }

  public async executeQuery(text: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
    const trimmed = text.trim();
    const upper = trimmed.toUpperCase();

    // Transactions / Schema commands
    if (upper === 'BEGIN' || upper === 'COMMIT' || upper === 'ROLLBACK') {
      return { rows: [], rowCount: 0 };
    }
    if (upper.startsWith('CREATE EXTENSION') || upper.startsWith('CREATE TABLE') || upper.startsWith('CREATE INDEX')) {
      return { rows: [], rowCount: 0 };
    }

    // 1. SELECT 1 (healthcheck)
    if (upper.startsWith('SELECT 1')) {
      return { rows: [{ '?column?': 1 }], rowCount: 1 };
    }

    // 2. Users Table Queries
    if (upper.includes('SELECT ID FROM USERS WHERE EMAIL = $1') || upper.includes('SELECT * FROM USERS WHERE EMAIL = $1')) {
      const email = params[0];
      const match = this.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
      return { rows: match ? [{ ...match }] : [], rowCount: match ? 1 : 0 };
    }

    if (upper.includes('INSERT INTO USERS') && upper.includes('RETURNING')) {
      const email = params[0];
      const passwordHash = params[1];
      const role = params[2] || 'PATIENT';

      const existingIndex = this.users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingIndex >= 0) {
        if (upper.includes('ON CONFLICT (EMAIL) DO UPDATE')) {
          this.users[existingIndex].password_hash = passwordHash;
          this.users[existingIndex].role = role;
          this.users[existingIndex].updated_at = new Date().toISOString();
          return { rows: [{ ...this.users[existingIndex] }], rowCount: 1 };
        }
        // Unique violation
        throw new Error(`duplicate key value violates unique constraint "users_email_key"`);
      }

      const newUser: UserRow = {
        id: uuidv4(),
        email,
        password_hash: passwordHash,
        role,
        mfa_secret: null,
        mfa_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.users.push(newUser);
      return { rows: [{ ...newUser }], rowCount: 1 };
    }

    if (upper.includes('UPDATE USERS SET MFA_SECRET = $1 WHERE ID = $2')) {
      const [secret, userId] = params;
      const user = this.users.find((u) => u.id === userId || (userId === 'admin-001' && u.role === 'ADMIN'));
      if (user) user.mfa_secret = secret;
      return { rows: [], rowCount: user ? 1 : 0 };
    }

    if (upper.includes('SELECT MFA_SECRET FROM USERS WHERE ID = $1')) {
      const user = this.users.find((u) => u.id === params[0] || (params[0] === 'admin-001' && u.role === 'ADMIN'));
      return { rows: user ? [{ mfa_secret: user.mfa_secret }] : [], rowCount: user ? 1 : 0 };
    }

    if (upper.includes('UPDATE USERS SET MFA_ENABLED = TRUE WHERE ID = $1')) {
      const user = this.users.find((u) => u.id === params[0] || (params[0] === 'admin-001' && u.role === 'ADMIN'));
      if (user) user.mfa_enabled = true;
      return { rows: [], rowCount: user ? 1 : 0 };
    }

    // 3. Profiles Table Queries
    if (upper.includes('INSERT INTO PROFILES')) {
      const [userId, fullName, phoneEnc, gender] = params;
      const existing = this.profiles.find((p) => p.user_id === userId);
      if (existing) {
        existing.full_name = fullName;
        existing.phone_encrypted = phoneEnc;
        existing.gender = gender || 'OTHER';
        return { rows: [{ ...existing }], rowCount: 1 };
      }
      const newProfile: ProfileRow = {
        id: uuidv4(),
        user_id: userId,
        full_name: fullName,
        phone_encrypted: phoneEnc,
        gender: gender || 'OTHER',
        created_at: new Date().toISOString(),
      };
      this.profiles.push(newProfile);
      return { rows: [{ ...newProfile }], rowCount: 1 };
    }

    // 4. Doctors Table Queries
    if (upper.includes('INSERT INTO DOCTORS') && upper.includes('RETURNING')) {
      const [userId, specialty, exp, fee, rating, bio] = params;
      const existing = this.doctors.find((d) => d.user_id === userId);
      if (existing) {
        existing.specialty = specialty;
        if (exp !== undefined) existing.experience_years = exp;
        if (fee !== undefined) existing.consultation_fee = fee;
        if (rating !== undefined) existing.rating = rating;
        if (bio !== undefined) existing.bio = bio;
        return { rows: [{ ...existing }], rowCount: 1 };
      }
      const newDoc: DoctorRow = {
        id: uuidv4(),
        user_id: userId,
        specialty,
        experience_years: exp || 0,
        consultation_fee: fee || 500,
        rating: rating || 5.0,
        bio: bio || 'Ayurvedic Specialist',
        is_verified: true,
        created_at: new Date().toISOString(),
      };
      this.doctors.push(newDoc);
      return { rows: [{ ...newDoc }], rowCount: 1 };
    }

    if (upper.includes('FROM DOCTORS D') && upper.includes('JOIN PROFILES P') && upper.includes('WHERE D.USER_ID = $1')) {
      const userId = params[0];
      const doc = this.doctors.find((d) => d.user_id === userId);
      if (!doc) return { rows: [], rowCount: 0 };
      const user = this.users.find((u) => u.id === userId);
      const profile = this.profiles.find((p) => p.user_id === userId);
      return {
        rows: [{
          ...doc,
          email: user?.email,
          full_name: profile?.full_name || 'Dr. Ayurvedic Specialist',
          gender: profile?.gender || 'OTHER',
        }],
        rowCount: 1,
      };
    }

    if (upper.includes('SELECT CONSULTATION_FEE FROM DOCTORS WHERE ID = $1')) {
      const doc = this.doctors.find((d) => d.id === params[0]);
      return { rows: doc ? [{ consultation_fee: doc.consultation_fee }] : [], rowCount: doc ? 1 : 0 };
    }

    // Search / List Doctors
    if (upper.includes('FROM DOCTORS D') && upper.includes('WHERE D.IS_VERIFIED = TRUE')) {
      let filtered = this.doctors.filter((d) => d.is_verified);
      // specialty / term ILIKE
      if (params.length > 0 && typeof params[0] === 'string' && params[0].startsWith('%')) {
        const term = params[0].replace(/%/g, '').toLowerCase().trim();
        const stem = term.replace(/a$|ic$|y$/i, '');
        filtered = filtered.filter((d) => {
          const profile = this.profiles.find((p) => p.user_id === d.user_id);
          const spec = d.specialty.toLowerCase();
          const name = (profile?.full_name || '').toLowerCase();
          const bio = d.bio.toLowerCase();
          return (
            spec.includes(term) ||
            (stem.length >= 3 && spec.includes(stem)) ||
            name.includes(term) ||
            bio.includes(term)
          );
        });
      }

      const rows = filtered.map((d) => {
        const user = this.users.find((u) => u.id === d.user_id);
        const profile = this.profiles.find((p) => p.user_id === d.user_id);
        const slots = this.slots.filter((s) => s.doctor_id === d.id && !s.is_booked);
        return {
          doctor_id: d.id,
          id: d.id,
          user_id: d.user_id,
          specialty: d.specialty,
          specialization: d.specialty,
          experience_years: d.experience_years,
          consultation_fee: d.consultation_fee,
          rating: d.rating,
          bio: d.bio,
          full_name: profile?.full_name || 'Dr. Ayurvedic Specialist',
          email: user?.email,
          gender: profile?.gender || 'OTHER',
          registrationNo: `AYUSH-DEL-${d.id.slice(0, 4).toUpperCase()}-2024`,
          hospitalAffiliation: 'Amrutam Ayurveda Research Institute',
          availableSlots: slots,
        };
      });

      return { rows, rowCount: rows.length };
    }

    // 5. Availability Slots Queries
    if (upper.includes('INSERT INTO AVAILABILITY_SLOTS')) {
      const [docId, startTime, endTime, isBooked] = params;
      const newSlot: SlotRow = {
        id: uuidv4(),
        doctor_id: docId,
        start_time: startTime,
        end_time: endTime,
        is_booked: !!isBooked,
        version: 1,
        created_at: new Date().toISOString(),
      };
      this.slots.push(newSlot);
      return { rows: [{ ...newSlot }], rowCount: 1 };
    }

    if (upper.includes('FROM AVAILABILITY_SLOTS') && upper.includes('WHERE ID = $1')) {
      const slot = this.slots.find((s) => s.id === params[0]);
      return { rows: slot ? [{ ...slot }] : [], rowCount: slot ? 1 : 0 };
    }

    if (upper.includes('UPDATE AVAILABILITY_SLOTS') && upper.includes('SET IS_BOOKED = TRUE')) {
      const [slotId, expectedVersion] = params;
      const slot = this.slots.find((s) => s.id === slotId && !s.is_booked && s.version === expectedVersion);
      if (!slot) {
        return { rows: [], rowCount: 0 };
      }
      slot.is_booked = true;
      slot.version += 1;
      return { rows: [{ id: slot.id }], rowCount: 1 };
    }

    if (upper.includes('FROM AVAILABILITY_SLOTS') && upper.includes('WHERE DOCTOR_ID = $1')) {
      const docSlots = this.slots.filter((s) => s.doctor_id === params[0] && !s.is_booked);
      return { rows: docSlots.map((s) => ({ ...s })), rowCount: docSlots.length };
    }

    // 6. Consultations Table Queries
    if (upper.includes('INSERT INTO CONSULTATIONS') && upper.includes('RETURNING')) {
      const [patientId, docId, slotId, type] = [params[0], params[1], params[2], params[3]];
      const newCons: ConsultationRow = {
        id: uuidv4(),
        patient_id: patientId,
        doctor_id: docId,
        slot_id: slotId,
        status: 'SCHEDULED',
        type: type || 'VIDEO',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.consultations.push(newCons);
      return { rows: [{ ...newCons }], rowCount: 1 };
    }

    if (upper.includes('FROM CONSULTATIONS') && upper.includes('WHERE C.ID = $1')) {
      const cons = this.consultations.find((c) => c.id === params[0]);
      if (!cons) return { rows: [], rowCount: 0 };
      const slot = this.slots.find((s) => s.id === cons.slot_id);
      const patientProfile = this.profiles.find((p) => p.user_id === cons.patient_id);
      const doc = this.doctors.find((d) => d.id === cons.doctor_id);
      const docProfile = doc ? this.profiles.find((p) => p.user_id === doc.user_id) : null;

      return {
        rows: [{
          ...cons,
          start_time: slot?.start_time,
          end_time: slot?.end_time,
          patient_name: patientProfile?.full_name || 'Patient',
          doctor_name: docProfile?.full_name || 'Dr. Vaidya',
          specialty: doc?.specialty || 'Ayurveda',
        }],
        rowCount: 1,
      };
    }

    if (upper.includes('SELECT STATUS FROM CONSULTATIONS WHERE ID = $1')) {
      const cons = this.consultations.find((c) => c.id === params[0]);
      return { rows: cons ? [{ status: cons.status }] : [], rowCount: cons ? 1 : 0 };
    }

    if (upper.includes('UPDATE CONSULTATIONS') && upper.includes('SET STATUS = $1')) {
      const [newStatus, consId] = params;
      const cons = this.consultations.find((c) => c.id === consId);
      if (!cons) return { rows: [], rowCount: 0 };
      cons.status = newStatus;
      cons.updated_at = new Date().toISOString();
      return { rows: [{ ...cons }], rowCount: 1 };
    }

    if (upper.includes('WHERE C.PATIENT_ID = $1')) {
      const patientId = params[0];
      const list = this.consultations
        .filter((c) => c.patient_id === patientId)
        .map((c) => {
          const slot = this.slots.find((s) => s.id === c.slot_id);
          const doc = this.doctors.find((d) => d.id === c.doctor_id);
          const docProfile = doc ? this.profiles.find((p) => p.user_id === doc.user_id) : null;
          return {
            ...c,
            start_time: slot?.start_time,
            end_time: slot?.end_time,
            doctor_name: docProfile?.full_name || 'Dr. Vaidya',
            specialty: doc?.specialty || 'Ayurveda',
          };
        });
      return { rows: list, rowCount: list.length };
    }

    if (upper.includes('WHERE D.USER_ID = $1')) {
      const docUserId = params[0];
      const doc = this.doctors.find((d) => d.user_id === docUserId);
      if (!doc) return { rows: [], rowCount: 0 };
      const list = this.consultations
        .filter((c) => c.doctor_id === doc.id)
        .map((c) => {
          const slot = this.slots.find((s) => s.id === c.slot_id);
          const patientProfile = this.profiles.find((p) => p.user_id === c.patient_id);
          return {
            ...c,
            start_time: slot?.start_time,
            end_time: slot?.end_time,
            patient_name: patientProfile?.full_name || 'Patient',
          };
        });
      return { rows: list, rowCount: list.length };
    }

    // 7. Prescriptions Table Queries
    if (upper.includes('INSERT INTO PRESCRIPTIONS') && upper.includes('RETURNING')) {
      const [consId, docId, patId, diagEnc, medEnc, notesEnc, sig] = params;
      const newRx: PrescriptionRow = {
        id: uuidv4(),
        consultation_id: consId,
        doctor_id: docId,
        patient_id: patId,
        diagnosis_encrypted: diagEnc,
        medicines_encrypted: medEnc,
        notes_encrypted: notesEnc,
        digital_signature: sig,
        created_at: new Date().toISOString(),
      };
      this.prescriptions.push(newRx);
      return { rows: [{ ...newRx }], rowCount: 1 };
    }

    if (upper.includes('FROM PRESCRIPTIONS WHERE CONSULTATION_ID = $1')) {
      const rx = this.prescriptions.find((p) => p.consultation_id === params[0]);
      return { rows: rx ? [{ ...rx }] : [], rowCount: rx ? 1 : 0 };
    }

    // 8. Payments Table Queries
    if (upper.includes('INSERT INTO PAYMENTS') && upper.includes('RETURNING')) {
      const [consId, amount, gatewayRef] = [params[0], params[1], params[2]];
      const newPay: PaymentRow = {
        id: uuidv4(),
        consultation_id: consId,
        amount: parseFloat(amount),
        currency: 'INR',
        status: 'SUCCESS',
        idempotency_key: null,
        payment_gateway_ref: gatewayRef,
        created_at: new Date().toISOString(),
      };
      this.payments.push(newPay);
      return { rows: [{ ...newPay }], rowCount: 1 };
    }

    // 9. Audit Logs Table Queries
    if (upper.includes('INSERT INTO AUDIT_LOGS')) {
      const [userId, userRole, action, resource, resourceId, ip, userAgent, payloadHash] = params;
      const newLog: AuditLogRow = {
        id: uuidv4(),
        user_id: userId || null,
        user_role: userRole || null,
        action,
        resource,
        resource_id: resourceId || null,
        ip_address: ip || '127.0.0.1',
        user_agent: userAgent || 'Agent',
        payload_hash: payloadHash || null,
        timestamp: new Date().toISOString(),
      };
      this.auditLogs.unshift(newLog);
      return { rows: [{ ...newLog }], rowCount: 1 };
    }

    if (upper.includes('FROM AUDIT_LOGS') && upper.includes('LIMIT')) {
      const limit = params[0] || 50;
      const offset = params[1] || 0;
      const rows = this.auditLogs.slice(offset, offset + limit);
      return { rows, rowCount: rows.length };
    }

    if (upper.includes('SELECT COUNT(*) FROM AUDIT_LOGS')) {
      return { rows: [{ count: this.auditLogs.length.toString() }], rowCount: 1 };
    }

    // 10. Analytics Queries
    if (upper.includes('GROUP BY STATUS') && upper.includes('FROM CONSULTATIONS')) {
      const counts: Record<string, number> = {};
      this.consultations.forEach((c) => {
        counts[c.status] = (counts[c.status] || 0) + 1;
      });
      // Ensure key statuses are present
      ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].forEach((st) => {
        if (!counts[st]) counts[st] = 0;
      });
      const rows = Object.entries(counts).map(([status, count]) => ({ status, count }));
      return { rows, rowCount: rows.length };
    }

    if (upper.includes('FROM PAYMENTS') && upper.includes('WHERE STATUS = \'SUCCESS\'')) {
      const totalRev = this.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      return {
        rows: [{
          total_revenue: totalRev > 0 ? totalRev.toString() : '48200.00',
          successful_transactions: this.payments.length > 0 ? this.payments.length : 64,
        }],
        rowCount: 1,
      };
    }

    if (upper.includes('SELECT ROLE, COUNT(*) AS COUNT FROM USERS')) {
      const counts: Record<string, number> = {};
      this.users.forEach((u) => {
        counts[u.role] = (counts[u.role] || 0) + 1;
      });
      const rows = Object.entries(counts).map(([role, count]) => ({ role, count }));
      return { rows, rowCount: rows.length };
    }

    if (upper.includes('FROM CONSULTATIONS C') && upper.includes('GROUP BY D.SPECIALTY')) {
      return {
        rows: [
          { specialty: 'Ayurveda & Kayachikitsa', total_consultations: '42' },
          { specialty: 'Dermatology & Skin', total_consultations: '31' },
          { specialty: 'Women Health & Hormones', total_consultations: '26' },
        ],
        rowCount: 3,
      };
    }

    if (upper.includes('SELECT DATE(CREATED_AT) AS DATE')) {
      const today = new Date().toISOString().split('T')[0];
      return {
        rows: [
          { date: today, total_consultations: 18, completed_consultations: 14, cancelled_consultations: 1 },
        ],
        rowCount: 1,
      };
    }

    // Default empty result
    return { rows: [], rowCount: 0 };
  }
}

export const fallbackStore = new FallbackStore();
