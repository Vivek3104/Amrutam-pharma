import {
  encrypt,
  decrypt,
  rotateCiphertext,
  registerKey,
  setActiveKeyVersion,
  getActiveKeyVersion,
  createDigitalSignature,
  verifyDigitalSignature,
} from '../src/utils/crypto.js';

describe('Cryptography Utility (AES-256-GCM, Key Rotation & HMAC)', () => {
  it('should encrypt and decrypt string accurately with versioned envelope', () => {
    const originalText = 'Patient Diagnosis: Hypertension & Mild Fever';
    const encrypted = encrypt(originalText);
    
    expect(encrypted).not.toBe(originalText);
    expect(encrypted.startsWith('v1:')).toBe(true); // Contains version:IV:AuthTag:Ciphertext

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(originalText);
  });

  it('should support multi-key ring and key rotation', () => {
    const text = 'Confidential Ayurvedic Medical History';
    const encryptedV1 = encrypt(text, 'v1');
    expect(encryptedV1.startsWith('v1:')).toBe(true);

    // Register a new v2 key (64 hex characters / 32 bytes)
    const newV2KeyHex = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
    registerKey('v2', newV2KeyHex);

    // Rotate ciphertext to v2
    const encryptedV2 = rotateCiphertext(encryptedV1, 'v2');
    expect(encryptedV2.startsWith('v2:')).toBe(true);
    expect(encryptedV2).not.toBe(encryptedV1);

    // Decrypting v2 should successfully yield the original cleartext
    const decryptedV2 = decrypt(encryptedV2);
    expect(decryptedV2).toBe(text);

    // Legacy/older key v1 can still be decrypted concurrently
    const decryptedV1 = decrypt(encryptedV1);
    expect(decryptedV1).toBe(text);
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
