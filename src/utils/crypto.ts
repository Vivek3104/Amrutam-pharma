import crypto from 'crypto';
import { config } from '../config/index.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard 96-bit IV for AES-GCM
const AUTH_TAG_LENGTH = 16;

// Key Ring storing key versions: 'v1' -> Buffer
const keyRing = new Map<string, Buffer>();
let activeKeyVersion = 'v1';

// Initialize default active key
function initDefaultKey() {
  const hexKey = config.ENCRYPTION_KEY;
  if (hexKey.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hexadecimal string (32 bytes)');
  }
  keyRing.set('v1', Buffer.from(hexKey, 'hex'));
}
initDefaultKey();

/**
 * Register an additional encryption key into the Key Ring (for key rotation)
 */
export function registerKey(version: string, hexKey: string): void {
  if (hexKey.length !== 64) {
    throw new Error(`Key ${version} must be a 64-character hexadecimal string (32 bytes)`);
  }
  keyRing.set(version, Buffer.from(hexKey, 'hex'));
}

/**
 * Sets the active key version for subsequent encryptions
 */
export function setActiveKeyVersion(version: string): void {
  if (!keyRing.has(version)) {
    throw new Error(`Key version ${version} is not registered in the Key Ring`);
  }
  activeKeyVersion = version;
}

/**
 * Returns current active key version
 */
export function getActiveKeyVersion(): string {
  return activeKeyVersion;
}

function getKey(version: string = activeKeyVersion): Buffer {
  const key = keyRing.get(version);
  if (!key) {
    throw new Error(`Encryption key version '${version}' not found in Key Ring`);
  }
  return key;
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  authTag: string;
  version?: string;
}

/**
 * Encrypts cleartext using AES-256-GCM with key versioning
 * Format: version:iv:authTag:ciphertext
 */
export function encrypt(text: string, version: string = activeKeyVersion): string {
  if (!text) return text;
  const key = getKey(version);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: version:iv:authTag:ciphertext
  return `${version}:${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts AES-256-GCM encrypted string supporting both versioned and legacy payloads
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  
  const parts = encryptedText.split(':');
  let version = activeKeyVersion;
  let ivHex: string;
  let authTagHex: string;
  let ciphertextHex: string;

  if (parts.length === 4) {
    // Versioned format: version:iv:authTag:ciphertext
    [version, ivHex, authTagHex, ciphertextHex] = parts;
  } else if (parts.length === 3) {
    // Legacy format: iv:authTag:ciphertext (assumes 'v1')
    version = 'v1';
    [ivHex, authTagHex, ciphertextHex] = parts;
  } else {
    throw new Error('Invalid encrypted payload format');
  }
  
  const key = getKey(version);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Rotates an encrypted record from an old key version to a target key version
 */
export function rotateCiphertext(encryptedText: string, targetVersion: string = activeKeyVersion): string {
  const cleartext = decrypt(encryptedText);
  return encrypt(cleartext, targetVersion);
}

/**
 * Creates HMAC-SHA256 signature for digital validation (e.g., prescriptions)
 */
export function createDigitalSignature(payload: string): string {
  const key = getKey();
  return crypto.createHmac('sha256', key).update(payload).digest('hex');
}

/**
 * Verifies HMAC-SHA256 signature
 */
export function verifyDigitalSignature(payload: string, signature: string): boolean {
  const expected = createDigitalSignature(payload);
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
}
