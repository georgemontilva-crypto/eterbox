import { describe, expect, it } from "vitest";
import * as twoFactorService from "./2fa-service";

/**
 * Test to validate 2FA service functionality
 */

describe("Two-Factor Authentication Service", () => {
  it("should generate a valid TOTP secret", async () => {
    const result = await twoFactorService.generateTwoFactorSecret(
      "test@example.com",
      "Test User"
    );

    expect(result).toBeDefined();
    expect(result.secret).toBeDefined();
    expect(typeof result.secret).toBe("string");
    expect(result.secret.length).toBeGreaterThan(0);
    
    expect(result.qrCode).toBeDefined();
    expect(result.qrCode).toContain("data:image/png;base64");
    
    expect(result.backupCodes).toBeDefined();
    expect(Array.isArray(result.backupCodes)).toBe(true);
    expect(result.backupCodes.length).toBeGreaterThan(0);
    
    console.log("✓ TOTP secret generation works correctly");
  });

  it("should hash backup codes for storage", () => {
    const backupCodes = ["ABC123", "DEF456", "GHI789"];
    const hashedCodes = twoFactorService.hashBackupCodesForStorage(backupCodes);

    expect(hashedCodes).toBeDefined();
    expect(Array.isArray(hashedCodes)).toBe(true);
    expect(hashedCodes.length).toBe(backupCodes.length);
    
    // Hashed codes should be different from original
    hashedCodes.forEach((hash, index) => {
      expect(hash).not.toBe(backupCodes[index]);
      expect(typeof hash).toBe("string");
    });

    console.log("✓ Backup code hashing works correctly");
  });

  it("should verify TOTP token format", () => {
    // Test with invalid token (should return false)
    const invalidResult = twoFactorService.verifyTOTPToken("invalid_secret", "123456");
    expect(typeof invalidResult).toBe("boolean");
    
    console.log("✓ TOTP token verification function exists and returns boolean");
  });
});

describe("Language Translations", () => {
  it("should have all required translation keys", async () => {
    // Import translations dynamically
    const { translations } = await import("../client/src/contexts/LanguageContext");

    // Required keys for core functionality
    const requiredKeys = [
      "menu.dashboard",
      "menu.twoFactor",
      "menu.settings",
      "menu.logout",
      "dashboard.welcome",
      "dashboard.addCredential",
      "dashboard.createFolder",
      "twoFactor.title",
      "twoFactor.enable",
      "twoFactor.disable",
      "pricing.title",
      "pricing.subscribeNow",
      "common.cancel",
      "common.save",
      "common.language",
    ];

    requiredKeys.forEach((key) => {
      expect(translations[key]).toBeDefined();
      expect(translations[key].en).toBeDefined();
      expect(translations[key].es).toBeDefined();
      expect(typeof translations[key].en).toBe("string");
      expect(typeof translations[key].es).toBe("string");
    });

    console.log(`✓ All ${requiredKeys.length} required translation keys are present`);
  });

  it("should have both English and Spanish translations for all keys", async () => {
    const { translations } = await import("../client/src/contexts/LanguageContext");

    const keys = Object.keys(translations);
    let missingTranslations = 0;

    keys.forEach((key) => {
      if (!translations[key].en || !translations[key].es) {
        console.warn(`Missing translation for key: ${key}`);
        missingTranslations++;
      }
    });

    expect(missingTranslations).toBe(0);
    console.log(`✓ All ${keys.length} translation keys have both EN and ES versions`);
  });
});
