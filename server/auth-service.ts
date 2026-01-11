import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'development' ? randomBytes(32).toString('hex') : undefined);
const JWT_EXPIRES_IN = '7d'; // 7 days

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '🔒 SECURITY ERROR: JWT_SECRET must be set in environment variables and be at least 32 characters. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  } else if (!process.env.JWT_SECRET) {
    console.warn(
      '⚠️  WARNING: JWT_SECRET not configured. Using temporary random key for development. ' +
      'NEVER use this in production! Generate a secure key with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin';
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate a random verification token for email verification
 */
export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Generate a random password reset token
 */
export function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}
