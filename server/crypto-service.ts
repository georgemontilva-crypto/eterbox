import { createCipheriv, createDecipheriv, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const AUTH_TAG_LENGTH = 16;

// Master encryption key from environment (MUST be 64 hex characters = 32 bytes)
const MASTER_KEY = process.env.ENCRYPTION_KEY;

if (!MASTER_KEY || MASTER_KEY.length !== 64) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '🔒 SECURITY ERROR: ENCRYPTION_KEY must be set in environment variables and be exactly 64 hex characters (32 bytes). ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  } else {
    console.warn(
      '⚠️  WARNING: ENCRYPTION_KEY not configured. Using temporary key for development. ' +
      'NEVER use this in production! Generate a secure key with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
}

/**
 * Derive an encryption key from userId and master key using scrypt
 * This provides key derivation per user for additional security
 */
function deriveKey(userId: number): Buffer {
  const salt = Buffer.from(`${userId}:${MASTER_KEY}`, 'utf8');
  return scryptSync(MASTER_KEY!, salt, KEY_LENGTH);
}

/**
 * Encrypt a password using AES-256-GCM with user-specific key derivation
 * Returns: base64(iv:authTag:encryptedData)
 */
export function encryptPassword(password: string, userId: number): string {
  const key = deriveKey(userId);
  const iv = randomBytes(IV_LENGTH);
  
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Combine iv + authTag + encrypted data
  const combined = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, 'hex')
  ]);
  
  return combined.toString('base64');
}

/**
 * Decrypt a password using AES-256-GCM with user-specific key derivation
 */
export function decryptPassword(encryptedPassword: string, userId: number): string {
  const key = deriveKey(userId);
  const combined = Buffer.from(encryptedPassword, 'base64');
  
  // Extract iv, authTag, and encrypted data
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  
  return timingSafeEqual(bufA, bufB);
}

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}
