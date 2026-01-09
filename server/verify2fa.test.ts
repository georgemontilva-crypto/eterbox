import { describe, it, expect } from "vitest";
import { verifyTOTPToken, verifyBackupCodeForUser, removeUsedBackupCode, hashBackupCodesForStorage, generateNewBackupCodes } from "./2fa-service";
import { hashBackupCode } from "./crypto";

describe("2FA Login Verification", () => {
  describe("TOTP Verification", () => {
    it("should reject invalid TOTP tokens", () => {
      const secret = "JBSWY3DPEHPK3PXP"; // Test secret
      const invalidToken = "000000";
      
      const result = verifyTOTPToken(secret, invalidToken);
      expect(result).toBe(false);
    });

    it("should reject non-numeric tokens", () => {
      const secret = "JBSWY3DPEHPK3PXP";
      const invalidToken = "abcdef";
      
      const result = verifyTOTPToken(secret, invalidToken);
      expect(result).toBe(false);
    });

    it("should reject tokens with wrong length", () => {
      const secret = "JBSWY3DPEHPK3PXP";
      const shortToken = "12345";
      const longToken = "1234567";
      
      expect(verifyTOTPToken(secret, shortToken)).toBe(false);
      expect(verifyTOTPToken(secret, longToken)).toBe(false);
    });
  });

  describe("Backup Code Verification", () => {
    it("should verify valid backup codes", () => {
      const plainCodes = generateNewBackupCodes();
      const hashedCodes = hashBackupCodesForStorage(plainCodes);
      
      // First code should verify
      const result = verifyBackupCodeForUser(plainCodes[0], hashedCodes);
      expect(result).toBe(true);
    });

    it("should reject invalid backup codes", () => {
      const plainCodes = generateNewBackupCodes();
      const hashedCodes = hashBackupCodesForStorage(plainCodes);
      
      const invalidCode = "invalidcode123";
      const result = verifyBackupCodeForUser(invalidCode, hashedCodes);
      expect(result).toBe(false);
    });

    it("should remove used backup codes", () => {
      const plainCodes = generateNewBackupCodes();
      const hashedCodes = hashBackupCodesForStorage(plainCodes);
      
      expect(hashedCodes.length).toBe(10);
      
      // Remove first code
      const remainingCodes = removeUsedBackupCode(plainCodes[0], hashedCodes);
      expect(remainingCodes.length).toBe(9);
      
      // The removed code should no longer verify
      const verifyRemoved = verifyBackupCodeForUser(plainCodes[0], remainingCodes);
      expect(verifyRemoved).toBe(false);
      
      // Other codes should still verify
      const verifyOther = verifyBackupCodeForUser(plainCodes[1], remainingCodes);
      expect(verifyOther).toBe(true);
    });

    it("should generate 10 backup codes", () => {
      const codes = generateNewBackupCodes();
      expect(codes.length).toBe(10);
      
      // Each code should be a non-empty string
      codes.forEach(code => {
        expect(typeof code).toBe("string");
        expect(code.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Hash Functions", () => {
    it("should hash backup codes consistently", () => {
      const code = "testcode123";
      const hash1 = hashBackupCode(code);
      const hash2 = hashBackupCode(code);
      
      // Same input should produce same hash
      expect(hash1).toBe(hash2);
    });

    it("should produce different hashes for different codes", () => {
      const code1 = "testcode123";
      const code2 = "testcode456";
      
      const hash1 = hashBackupCode(code1);
      const hash2 = hashBackupCode(code2);
      
      expect(hash1).not.toBe(hash2);
    });
  });
});
