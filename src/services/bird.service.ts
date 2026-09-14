import { BirdClient } from '@messagebird/sdk';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export interface BirdVerificationResult {
  success: boolean;
  id?: string;
  reason?: string;
  channels?: Array<{ channel: string }>;
  error?: string;
}

export class BirdVerifyService {
  private client: BirdClient | null = null;

  constructor() {
    const apiKey = config.BIRD_API_KEY || process.env.BIRD_API_KEY || 'bk_eu1_HecwXAJILp2f1y7PiuhLb6m3mhJ9s';
    if (apiKey) {
      try {
        this.client = new BirdClient({ apiKey });
        logger.info('Bird (MessageBird) Verify Client initialized successfully');
      } catch (err: any) {
        logger.warn({ error: err.message }, 'Failed to initialize BirdClient');
      }
    }
  }

  /**
   * Dispatches a real verification code via SMS to the recipient mobile phone
   */
  public async sendPhoneVerification(phone: string): Promise<BirdVerificationResult> {
    if (!this.client) {
      throw new Error('BirdClient is not configured');
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const formattedPhone = `+91${cleanPhone}`;

    logger.info({ phone: formattedPhone }, 'Initiating real SMS verification via Bird API');

    try {
      const verification = await this.client.verify.verifications.create({
        to: { phone_number: formattedPhone },
      });

      logger.info(
        {
          id: verification.id,
          status: verification.status,
          channels: verification.channels,
          phone: formattedPhone,
        },
        'Real carrier SMS verification dispatched via Bird API'
      );

      return {
        success: true,
        id: verification.id,
        channels: verification.channels as any,
      };
    } catch (err: any) {
      logger.error({ error: err.message, phone: formattedPhone }, 'Bird API verification dispatch failed');
      return {
        success: false,
        error: err.message || 'Failed to dispatch verification code via Bird',
      };
    }
  }

  /**
   * Verifies the user-submitted code against Bird's verification session
   */
  public async checkPhoneVerification(phone: string, code: string): Promise<{ success: boolean; reason?: string }> {
    if (!this.client) {
      throw new Error('BirdClient is not configured');
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const formattedPhone = `+91${cleanPhone}`;

    logger.info({ phone: formattedPhone, codeLength: code.length }, 'Validating OTP code via Bird API check');

    try {
      const result = await this.client.verify.verifications.check({
        to: { phone_number: formattedPhone },
        code: code.trim(),
      });

      logger.info({ phone: formattedPhone, success: result.success, reason: result.reason }, 'Bird verification check response');

      return {
        success: !!result.success,
        reason: result.reason || (result.success ? undefined : 'Incorrect or expired verification code'),
      };
    } catch (err: any) {
      logger.error({ error: err.message, phone: formattedPhone }, 'Bird verification check failed');
      return {
        success: false,
        reason: err.message || 'Verification check failed',
      };
    }
  }

  /**
   * Dispatches a real verification code via Email
   */
  public async sendEmailVerification(email: string): Promise<BirdVerificationResult> {
    if (!this.client) {
      throw new Error('BirdClient is not configured');
    }

    logger.info({ email }, 'Initiating email verification via Bird API');

    try {
      const verification = await this.client.verify.verifications.create({
        to: { email },
      });

      logger.info({ id: verification.id, status: verification.status, email }, 'Real email verification code dispatched via Bird API');

      return {
        success: true,
        id: verification.id,
        channels: verification.channels as any,
      };
    } catch (err: any) {
      logger.error({ error: err.message, email }, 'Bird email verification dispatch failed');
      return {
        success: false,
        error: err.message || 'Failed to dispatch email verification via Bird',
      };
    }
  }

  /**
   * Verifies the user-submitted code for an email address
   */
  public async checkEmailVerification(email: string, code: string): Promise<{ success: boolean; reason?: string }> {
    if (!this.client) {
      throw new Error('BirdClient is not configured');
    }

    try {
      const result = await this.client.verify.verifications.check({
        to: { email },
        code: code.trim(),
      });

      return {
        success: !!result.success,
        reason: result.reason || (result.success ? undefined : 'Incorrect verification code'),
      };
    } catch (err: any) {
      return {
        success: false,
        reason: err.message || 'Email verification check failed',
      };
    }
  }

  /**
   * Generic check matching bird.verify.verifications.check({ to, code })
   */
  public async check(
    to: { email?: string; phone_number?: string },
    code: string
  ): Promise<{ success: boolean; reason?: string; raw?: any }> {
    if (!this.client) {
      throw new Error('BirdClient is not configured');
    }

    try {
      const result = await this.client.verify.verifications.check({
        to,
        code: code.trim(),
      });

      return {
        success: !!result.success,
        reason: result.reason || (result.success ? undefined : 'Incorrect or expired verification code'),
        raw: result,
      };
    } catch (err: any) {
      logger.error({ error: err.message, to }, 'Bird generic check failed');
      return {
        success: false,
        reason: err.message || 'Verification check failed',
      };
    }
  }
}

export const birdVerifyService = new BirdVerifyService();
