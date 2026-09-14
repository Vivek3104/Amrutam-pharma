import crypto from 'crypto';
import { logger } from '../utils/logger.js';
import { cacheGet, cacheSet, cacheDel } from '../redis/index.js';

export interface OtpRecord {
  phone: string;
  code: string;
  expiresAt: number; // Unix timestamp ms
  attempts: number;
  lastSentAt: number; // Unix timestamp ms
}

export class OtpService {
  private fallbackStore = new Map<string, OtpRecord>();
  private readonly TTL_SECONDS = 300; // 5 minutes
  private readonly COOLDOWN_SECONDS = 45; // 45 seconds between resends
  private readonly MAX_ATTEMPTS = 3;

  /**
   * Generates a cryptographically secure 6-digit OTP
   */
  public generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Generates and stores a real 6-digit OTP for a phone number
   */
  public async generateAndStore(phone: string): Promise<{ code: string; isCooldown: boolean; cooldownRemaining?: number }> {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const key = `otp:${cleanPhone}`;
    const now = Date.now();

    // Check existing record for rate-limiting / resend cooldown
    const existing = await this.getRecord(cleanPhone);
    if (existing) {
      const elapsed = (now - existing.lastSentAt) / 1000;
      if (elapsed < this.COOLDOWN_SECONDS) {
        const remaining = Math.ceil(this.COOLDOWN_SECONDS - elapsed);
        logger.warn({ phone: cleanPhone, remaining }, 'OTP resend requested during active cooldown');
        return { code: existing.code, isCooldown: true, cooldownRemaining: remaining };
      }
    }

    const code = this.generateCode();
    const record: OtpRecord = {
      phone: cleanPhone,
      code,
      expiresAt: now + this.TTL_SECONDS * 1000,
      attempts: 0,
      lastSentAt: now,
    };

    // Store in Redis with TTL or fallback in-memory store
    await this.saveRecord(cleanPhone, record);

    logger.info({ phone: cleanPhone, expiresAt: new Date(record.expiresAt).toISOString() }, 'Generated real 6-digit cryptographic OTP');
    return { code, isCooldown: false };
  }

  /**
   * Verifies the submitted OTP against stored secret
   */
  public async verifyOtp(phone: string, submittedCode: string): Promise<{ valid: boolean; reason?: string }> {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const record = await this.getRecord(cleanPhone);

    if (!record) {
      return { valid: false, reason: 'No active OTP found or code has expired. Please request a new code.' };
    }

    const now = Date.now();
    if (now > record.expiresAt) {
      await this.deleteRecord(cleanPhone);
      return { valid: false, reason: 'OTP code has expired. Please request a new verification code.' };
    }

    if (record.attempts >= this.MAX_ATTEMPTS) {
      await this.deleteRecord(cleanPhone);
      return { valid: false, reason: 'Too many incorrect attempts. Please request a new verification code.' };
    }

    // Increment attempts
    record.attempts += 1;
    await this.saveRecord(cleanPhone, record);

    // Constant-time comparison to prevent timing attacks
    const isCodeMatch =
      submittedCode.length === 6 &&
      crypto.timingSafeEqual(Buffer.from(submittedCode), Buffer.from(record.code));

    if (!isCodeMatch) {
      const remainingAttempts = this.MAX_ATTEMPTS - record.attempts;
      return {
        valid: false,
        reason: `Incorrect verification code. ${remainingAttempts} attempt(s) remaining.`,
      };
    }

    // Success: Invalidate OTP immediately (one-time use)
    await this.deleteRecord(cleanPhone);
    logger.info({ phone: cleanPhone }, 'OTP verified successfully');
    return { valid: true };
  }

  private async getRecord(phone: string): Promise<OtpRecord | null> {
    try {
      const redisRecord = await cacheGet<OtpRecord>(`otp:${phone}`);
      if (redisRecord) return redisRecord;
    } catch {}

    const memRecord = this.fallbackStore.get(phone);
    if (memRecord) {
      if (Date.now() > memRecord.expiresAt) {
        this.fallbackStore.delete(phone);
        return null;
      }
      return memRecord;
    }
    return null;
  }

  private async saveRecord(phone: string, record: OtpRecord): Promise<void> {
    try {
      await cacheSet(`otp:${phone}`, record, this.TTL_SECONDS);
    } catch {}
    this.fallbackStore.set(phone, record);
  }

  private async deleteRecord(phone: string): Promise<void> {
    try {
      await cacheDel(`otp:${phone}`);
    } catch {}
    this.fallbackStore.delete(phone);
  }
}

export const otpService = new OtpService();
