import { otpService } from '../src/services/otp.service.js';
import { smsService } from '../src/services/sms.service.js';

describe('Real Mobile OTP Service (Cryptographic 6-Digit & Carrier SMS)', () => {
  const testPhone = '9876543210';

  it('should generate a cryptographically random 6-digit code', async () => {
    const { code, isCooldown } = await otpService.generateAndStore(testPhone);

    expect(code).toBeDefined();
    expect(code.length).toBe(6);
    expect(/^\d{6}$/.test(code)).toBe(true);
    expect(isCooldown).toBe(false);
  });

  it('should reject legacy dummy OTP codes (e.g., 4821)', async () => {
    const verification = await otpService.verifyOtp(testPhone, '4821');
    expect(verification.valid).toBe(false);
  });

  it('should reject incorrect 6-digit codes and decrement remaining attempts', async () => {
    const { code } = await otpService.generateAndStore('9998887776');
    const wrongCode = code === '123456' ? '654321' : '123456';

    const verification = await otpService.verifyOtp('9998887776', wrongCode);
    expect(verification.valid).toBe(false);
    expect(verification.reason).toContain('attempt(s) remaining');
  });

  it('should successfully verify the genuine 6-digit OTP code', async () => {
    const { code } = await otpService.generateAndStore('9123456789');
    const verification = await otpService.verifyOtp('9123456789', code);

    expect(verification.valid).toBe(true);
  });

  it('should invalidate OTP immediately after successful verification (single-use)', async () => {
    const { code } = await otpService.generateAndStore('9000011122');
    const firstAttempt = await otpService.verifyOtp('9000011122', code);
    expect(firstAttempt.valid).toBe(true);

    // Second attempt with the same code must fail
    const secondAttempt = await otpService.verifyOtp('9000011122', code);
    expect(secondAttempt.valid).toBe(false);
  });

  it('should trigger cooldown when resending OTP too quickly', async () => {
    const phone = '9888777665';
    await otpService.generateAndStore(phone);

    // Immediate second call should hit cooldown
    const secondCall = await otpService.generateAndStore(phone);
    expect(secondCall.isCooldown).toBe(true);
    expect(secondCall.cooldownRemaining).toBeGreaterThan(0);
  });

  it('should dispatch SMS through the SMS gateway service', async () => {
    const result = await smsService.sendOtp('9876543210', '849201');
    expect(result.success).toBe(true);
    expect(result.provider).toBeDefined();
  });

  it('should check verification status via real Bird API check', async () => {
    const { birdVerifyService } = await import('../src/services/bird.service.js');
    const result = await birdVerifyService.check(
      { email: 'panchalvivek501@gmail.com' },
      '999999'
    );
    expect(result).toBeDefined();
    expect(typeof result.success).toBe('boolean');
  });
});
