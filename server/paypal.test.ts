import { describe, expect, it } from "vitest";
import axios from "axios";

/**
 * Test to validate PayPal and SMTP credentials
 * This ensures the environment variables are correctly set before proceeding
 */

describe("PayPal Integration", () => {
  it("should validate PayPal credentials by obtaining an access token", async () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET_KEY;
    const mode = process.env.PAYPAL_MODE || "sandbox";

    expect(clientId).toBeDefined();
    expect(clientSecret).toBeDefined();

    const baseUrl = mode === "sandbox" 
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com";

    try {
      const response = await axios.post(
        `${baseUrl}/v1/oauth2/token`,
        "grant_type=client_credentials",
        {
          auth: {
            username: clientId!,
            password: clientSecret!,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.access_token).toBeDefined();
      expect(response.data.token_type).toBe("Bearer");
      
      console.log("✓ PayPal credentials are valid");
    } catch (error: any) {
      console.error("✗ PayPal credentials validation failed:", error.message);
      throw new Error(`PayPal credentials are invalid: ${error.message}`);
    }
  });

  it("should validate SMTP credentials", async () => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    expect(smtpHost).toBeDefined();
    expect(smtpPort).toBeDefined();
    expect(smtpUser).toBeDefined();
    expect(smtpPassword).toBeDefined();

    // Basic validation - in production, you would test actual connection
    expect(typeof smtpHost).toBe("string");
    expect(typeof smtpPort).toBe("string");
    expect(typeof smtpUser).toBe("string");
    expect(typeof smtpPassword).toBe("string");

    // Validate port is a number
    const port = parseInt(smtpPort!);
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThanOrEqual(65535);

    console.log("✓ SMTP configuration is valid");
  });

  it("should have support email configured", () => {
    const supportEmail = process.env.SUPPORT_EMAIL;
    expect(supportEmail).toBeDefined();
    expect(supportEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    console.log(`✓ Support email configured: ${supportEmail}`);
  });
});
