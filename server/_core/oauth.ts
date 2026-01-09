import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { verifyTOTPToken, verifyBackupCodeForUser, removeUsedBackupCode } from "../2fa-service";

// Store pending 2FA verifications (in production, use Redis or database)
const pending2FAVerifications = new Map<string, {
  openId: string;
  name: string;
  email: string | null;
  loginMethod: string | null;
  expiresAt: number;
}>();

// Clean up expired pending verifications every 5 minutes
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(pending2FAVerifications.entries());
  for (const [key, value] of entries) {
    if (value.expiresAt < now) {
      pending2FAVerifications.delete(key);
    }
  }
}, 5 * 60 * 1000);

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function generatePendingToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      // Check if user exists and has 2FA enabled
      let existingUser = await db.getUserByOpenId(userInfo.openId);
      
      // If user doesn't exist, create them first
      if (!existingUser) {
        await db.upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: new Date(),
        });
        existingUser = await db.getUserByOpenId(userInfo.openId);
      }

      // If user has 2FA enabled, redirect to 2FA verification page
      if (existingUser?.twoFactorEnabled && existingUser?.twoFactorSecret) {
        const pendingToken = generatePendingToken();
        pending2FAVerifications.set(pendingToken, {
          openId: userInfo.openId,
          name: userInfo.name || "",
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        });
        
        // Redirect to 2FA verification page with pending token
        res.redirect(302, `/verify-2fa?token=${pendingToken}`);
        return;
      }

      // No 2FA, proceed with normal login
      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  // 2FA verification endpoint
  app.post("/api/oauth/verify-2fa", async (req: Request, res: Response) => {
    const { pendingToken, code, isBackupCode } = req.body;

    if (!pendingToken || !code) {
      res.status(400).json({ error: "pendingToken and code are required" });
      return;
    }

    const pending = pending2FAVerifications.get(pendingToken);
    if (!pending) {
      res.status(400).json({ error: "Invalid or expired verification token" });
      return;
    }

    if (pending.expiresAt < Date.now()) {
      pending2FAVerifications.delete(pendingToken);
      res.status(400).json({ error: "Verification token has expired" });
      return;
    }

    try {
      const user = await db.getUserByOpenId(pending.openId);
      if (!user || !user.twoFactorSecret) {
        res.status(400).json({ error: "User not found or 2FA not configured" });
        return;
      }

      let verified = false;

      if (isBackupCode) {
        // Verify backup code
        const backupCodes = user.backupCodes ? JSON.parse(user.backupCodes) : [];
        if (verifyBackupCodeForUser(code, backupCodes)) {
          verified = true;
          // Remove used backup code
          const remainingCodes = removeUsedBackupCode(code, backupCodes);
          await db.updateUserTwoFactor(user.id, true, undefined, JSON.stringify(remainingCodes));
        }
      } else {
        // Verify TOTP code
        verified = verifyTOTPToken(user.twoFactorSecret, code);
      }

      if (!verified) {
        // Record failed attempt
        await db.recordLoginAttempt(user.id, req.ip || "unknown", req.get("user-agent") || "unknown", false, "Invalid 2FA code");
        res.status(400).json({ error: "Invalid verification code" });
        return;
      }

      // 2FA verified, complete login
      pending2FAVerifications.delete(pendingToken);

      await db.upsertUser({
        openId: pending.openId,
        name: pending.name || null,
        email: pending.email ?? null,
        loginMethod: pending.loginMethod ?? null,
        lastSignedIn: new Date(),
      });

      // Record successful login
      await db.recordLoginAttempt(user.id, req.ip || "unknown", req.get("user-agent") || "unknown", true);

      const sessionToken = await sdk.createSessionToken(pending.openId, {
        name: pending.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({ success: true });
    } catch (error) {
      console.error("[OAuth] 2FA verification failed", error);
      res.status(500).json({ error: "2FA verification failed" });
    }
  });

  // Check if pending token is valid
  app.get("/api/oauth/check-2fa-token", async (req: Request, res: Response) => {
    const token = getQueryParam(req, "token");
    
    if (!token) {
      res.status(400).json({ valid: false, error: "Token is required" });
      return;
    }

    const pending = pending2FAVerifications.get(token);
    if (!pending || pending.expiresAt < Date.now()) {
      res.status(400).json({ valid: false, error: "Invalid or expired token" });
      return;
    }

    res.json({ 
      valid: true, 
      userName: pending.name,
      email: pending.email 
    });
  });
}
