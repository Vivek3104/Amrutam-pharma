import bcrypt from 'bcrypt';
import { pool, query } from './index.js';
import { runMigrations } from './migrate.js';
import { encrypt } from '../utils/crypto.js';
import { logger } from '../utils/logger.js';

export async function seedDatabase() {
  logger.info('Starting database seeding...');
  await runMigrations();

  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 1. Seed Admin User
  const adminRes = await query(`
    INSERT INTO users (email, password_hash, role)
    VALUES ($1, $2, 'ADMIN')
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING id;
  `, ['admin@amrutam.co', passwordHash]);
  const adminId = adminRes.rows[0].id;

  await query(`
    INSERT INTO profiles (user_id, full_name, phone_encrypted, gender)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id) DO NOTHING;
  `, [adminId, 'System Admin', encrypt('+919999999999'), 'OTHER']);

  // 2. Seed Doctor Users & Profiles & Doctor Entries
  const doctorsData = [
    { email: 'dr.ayurveda@amrutam.co', name: 'Dr. Rahul Sharma', specialty: 'Ayurveda', exp: 12, fee: 500.00, rating: 4.9, bio: 'Expert in Panchakarma and Holistic Wellness' },
    { email: 'dr.dermatology@amrutam.co', name: 'Dr. Priya Patel', specialty: 'Dermatology', exp: 8, fee: 700.00, rating: 4.8, bio: 'Specialist in Skin, Hair and Herbal Treatments' },
    { email: 'dr.wellness@amrutam.co', name: 'Dr. Ananya Varma', specialty: 'General Wellness', exp: 15, fee: 600.00, rating: 4.95, bio: 'Integrative medicine and lifestyle care' },
  ];

  const doctorIds: string[] = [];

  for (const doc of doctorsData) {
    const userRes = await query(`
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, 'DOCTOR')
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING id;
    `, [doc.email, passwordHash]);
    const userId = userRes.rows[0].id;

    await query(`
      INSERT INTO profiles (user_id, full_name, phone_encrypted, gender)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO NOTHING;
    `, [userId, doc.name, encrypt('+919876543210'), 'MALE']);

    const docRes = await query(`
      INSERT INTO doctors (user_id, specialty, experience_years, consultation_fee, rating, bio)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id) DO UPDATE SET specialty = EXCLUDED.specialty
      RETURNING id;
    `, [userId, doc.specialty, doc.exp, doc.fee, doc.rating, doc.bio]);

    doctorIds.push(docRes.rows[0].id);
  }

  // 3. Seed Patient Users & Profiles
  const patientRes = await query(`
    INSERT INTO users (email, password_hash, role)
    VALUES ($1, $2, 'PATIENT')
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING id;
  `, ['patient.demo@amrutam.co', passwordHash]);
  const patientId = patientRes.rows[0].id;

  await query(`
    INSERT INTO profiles (user_id, full_name, phone_encrypted, gender)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id) DO NOTHING;
  `, [patientId, 'Amit Kumar', encrypt('+919123456789'), 'MALE']);

  // 4. Seed Availability Slots for Doctors for Tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setMinutes(0, 0, 0);

  for (const docId of doctorIds) {
    for (let hour = 9; hour < 17; hour += 1) {
      const startTime = new Date(tomorrow);
      startTime.setHours(hour);
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + 30);

      await query(`
        INSERT INTO availability_slots (doctor_id, start_time, end_time, is_booked)
        VALUES ($1, $2, $3, FALSE)
        ON CONFLICT (doctor_id, start_time) DO NOTHING;
      `, [docId, startTime.toISOString(), endTime.toISOString()]);
    }
  }

  logger.info('Database seeded successfully.');
}

const isMain = process.argv[1] && process.argv[1].includes('seed');
if (isMain) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
}
