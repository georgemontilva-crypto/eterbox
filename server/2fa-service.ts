import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { encryptPassword, decryptPassword, generateBackupCodes, hashBackupCode, verifyBackupCode } from "./crypto";

/**
 * Generate TOTP secret and QR code for 2FA setup
 */
export async function generateTwoFactorSecret(
  userEmail: string,
  userName: string
): Promise<{
  secret: string;
  qrCode: string;
  backupCodes: string[];
}> {
  // Generate TOTP secret
  const secret = speakeasy.generateSecret({
    name: `EterBox (${userEmail})`,
    issuer: "EterBox",
    length: 32,
  });

  if (!secret.otpauth_url) {
    throw new Error("Failed to generate TOTP secret");
  }

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  // Generate backup codes
  const backupCodes = generateBackupCodes(10);

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  };
}

/**
 * Verify TOTP token
 */
export function verifyTOTPToken(secret: string, token: string): boolean {
  try {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 2, // Allow 2 time windows (±30 seconds)
    });

    return verified;
  } catch (error) {
    console.error("Failed to verify TOTP token:", error);
    return false;
  }
}

/**
 * Verify backup code
 */
export function verifyBackupCodeForUser(code: string, hashedCodes: string[]): boolean {
  for (const hashedCode of hashedCodes) {
    if (verifyBackupCode(code, hashedCode)) {
      return true;
    }
  }
  return false;
}

/**
 * Remove used backup code
 */
export function removeUsedBackupCode(usedCode: string, hashedCodes: string[]): string[] {
  return hashedCodes.filter(hashedCode => !verifyBackupCode(usedCode, hashedCode));
}

/**
 * Hash backup codes for storage
 */
export function hashBackupCodesForStorage(codes: string[]): string[] {
  return codes.map(code => hashBackupCode(code));
}

/**
 * Generate new backup codes
 */
export function generateNewBackupCodes(): string[] {
  return generateBackupCodes(10);
}
