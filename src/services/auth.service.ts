import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { query } from '../database/index.js';
import { config } from '../config/index.js';
import { encrypt, decrypt } from '../utils/crypto.js';
import { AppError } from '../middlewares/errorHandler.js';

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  phone?: string;
  gender?: string;
  specialty?: string;
  experienceYears?: number;
  consultationFee?: number;
}

export class AuthService {
  async register(dto: RegisterDTO) {
    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [dto.email]);
    if (existing.rows.length > 0) {
      throw new AppError('User with this email already exists', 400, 'https://amrutam.co/errors/user-exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    
    // Insert User
    const userRes = await query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at;`,
      [dto.email, passwordHash, dto.role]
    );

    const user = userRes.rows[0];

    // Insert Profile (Encrypted PHI)
    const phoneEncrypted = dto.phone ? encrypt(dto.phone) : null;
    await query(
      `INSERT INTO profiles (user_id, full_name, phone_encrypted, gender) VALUES ($1, $2, $3, $4);`,
      [user.id, dto.fullName, phoneEncrypted, dto.gender || 'OTHER']
    );

    // If DOCTOR role, insert Doctor Profile
    let doctorProfile = null;
    if (dto.role === 'DOCTOR') {
      const docRes = await query(
        `INSERT INTO doctors (user_id, specialty, experience_years, consultation_fee)
         VALUES ($1, $2, $3, $4) RETURNING id, specialty, consultation_fee;`,
        [user.id, dto.specialty || 'General Physician', dto.experienceYears || 0, dto.consultationFee || 500.00]
      );
      doctorProfile = docRes.rows[0];
    }

    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { ...user, doctorProfile }, token };
  }

  async login(email: string, password: string, mfaCode?: string) {
    const res = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (res.rows.length === 0) {
      throw new AppError('Invalid credentials', 401, 'https://amrutam.co/errors/invalid-credentials');
    }

    const user = res.rows[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      throw new AppError('Invalid credentials', 401, 'https://amrutam.co/errors/invalid-credentials');
    }

    // Check MFA if enabled
    if (user.mfa_enabled) {
      if (!mfaCode) {
        return { mfaRequired: true, userId: user.id };
      }
      const verified = authenticator.check(mfaCode, user.mfa_secret);
      if (!verified) {
        throw new AppError('Invalid MFA OTP code', 401, 'https://amrutam.co/errors/invalid-mfa');
      }
    }

    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, role: user.role, mfaEnabled: user.mfa_enabled }, token };
  }

  async setupMFA(userId: string) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(userId, config.MFA_APP_NAME, secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    await query(`UPDATE users SET mfa_secret = $1 WHERE id = $2`, [secret, userId]);

    return { secret, qrCodeUrl };
  }

  async verifyMFA(userId: string, code: string) {
    const res = await query(`SELECT mfa_secret FROM users WHERE id = $1`, [userId]);
    if (res.rows.length === 0 || !res.rows[0].mfa_secret) {
      throw new AppError('MFA not set up for this user', 400);
    }

    const isValid = authenticator.check(code, res.rows[0].mfa_secret);
    if (!isValid) {
      throw new AppError('Invalid MFA verification code', 400);
    }

    await query(`UPDATE users SET mfa_enabled = TRUE WHERE id = $1`, [userId]);
    return { success: true, message: 'MFA enabled successfully' };
  }

  generateToken(user: { id: string; email: string; role: string }): string {
    return jwt.sign(user, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN as any });
  }
}
