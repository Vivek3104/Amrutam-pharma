import { encrypt, decrypt, createDigitalSignature, verifyDigitalSignature } from '../src/utils/crypto.js';

describe('Cryptography Utility (AES-256-GCM & HMAC)', () => {
  it('should encrypt and decrypt string accurately', () => {
    const originalText = 'Patient Diagnosis: Hypertension & Mild Fever';
    const encrypted = encrypt(originalText);
    
    expect(encrypted).not.toBe(originalText);
    expect(encrypted).toContain(':'); // Contains IV:AuthTag:Ciphertext

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(originalText);
  });

  it('should generate valid digital signatures and detect tampering', () => {
    const payload = 'cons-123:pat-456:doc-789:Diabetic Evaluation';
    const signature = createDigitalSignature(payload);

    expect(typeof signature).toBe('string');
    expect(signature.length).toBe(64); // SHA-256 hex length

    const isValid = verifyDigitalSignature(payload, signature);
    expect(isValid).toBe(true);

    const isTamperedValid = verifyDigitalSignature(payload + '_tampered', signature);
    expect(isTamperedValid).toBe(false);
  });
});
