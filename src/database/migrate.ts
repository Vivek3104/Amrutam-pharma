import { pool, query } from './index.js';
import { logger } from '../utils/logger.js';

export async function runMigrations() {
  logger.info('Starting database migrations...');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Extensions
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('PATIENT', 'DOCTOR', 'ADMIN')),
        mfa_secret VARCHAR(255),
        mfa_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Profiles Table (Contains Encrypted PHI/PII)
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(255) NOT NULL,
        phone_encrypted TEXT,
        dob_encrypted TEXT,
        gender VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Doctors Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        specialty VARCHAR(100) NOT NULL,
        experience_years INT DEFAULT 0,
        consultation_fee NUMERIC(10, 2) NOT NULL,
        rating NUMERIC(3, 2) DEFAULT 5.0,
        bio TEXT,
        is_verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Availability Slots Table (With Optimistic Lock Versioning)
    await client.query(`
      CREATE TABLE IF NOT EXISTS availability_slots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE NOT NULL,
        is_booked BOOLEAN DEFAULT FALSE,
        version INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_doctor_slot UNIQUE (doctor_id, start_time)
      );
    `);

    // 5. Consultations Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        patient_id UUID NOT NULL REFERENCES users(id),
        doctor_id UUID NOT NULL REFERENCES doctors(id),
        slot_id UUID UNIQUE NOT NULL REFERENCES availability_slots(id),
        status VARCHAR(50) NOT NULL CHECK (status IN ('REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
        type VARCHAR(20) NOT NULL CHECK (type IN ('AUDIO', 'VIDEO', 'CHAT')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Prescriptions Table (Encrypted PHI/Diagnosis with Digital Signature)
    await client.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        consultation_id UUID UNIQUE NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
        doctor_id UUID NOT NULL REFERENCES doctors(id),
        patient_id UUID NOT NULL REFERENCES users(id),
        diagnosis_encrypted TEXT NOT NULL,
        medicines_encrypted TEXT NOT NULL,
        notes_encrypted TEXT,
        digital_signature VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Payments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        consultation_id UUID UNIQUE NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
        amount NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
        idempotency_key VARCHAR(255) UNIQUE,
        payment_gateway_ref VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Audit Logs Table (Immutable Compliance Log)
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        user_role VARCHAR(50),
        action VARCHAR(100) NOT NULL,
        resource VARCHAR(100) NOT NULL,
        resource_id VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent TEXT,
        payload_hash VARCHAR(255),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. Idempotency Keys Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS idempotency_keys (
        key VARCHAR(255) PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        request_path VARCHAR(255) NOT NULL,
        response_status INT NOT NULL,
        response_body TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);

    // Index Optimizations for Scalability & Search Performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_doctors_rating ON doctors(rating DESC);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_slots_doctor_time ON availability_slots(doctor_id, start_time) WHERE is_booked = FALSE;`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations(patient_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON consultations(doctor_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_idempotency_expires ON idempotency_keys(expires_at);`);

    await client.query('COMMIT');
    logger.info('Database migrations completed successfully.');
  } catch (err: any) {
    await client.query('ROLLBACK');
    logger.error({ error: err.message }, 'Database migration failed');
    throw err;
  } finally {
    client.release();
  }
}

const isMain = process.argv[1] && process.argv[1].includes('migrate');
if (isMain) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
