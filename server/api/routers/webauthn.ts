import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../../db";
import { users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import * as webauthnService from "../../webauthn-service";
import { generateToken } from "../../auth-service";

// Store challenges temporarily (in production, use Redis)
const challenges = new Map<string, { challenge: string; expiresAt: number }>();

// Clean up expired challenges every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Array.from(challenges.entries())) {
    if (value.expiresAt < now) {
      challenges.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const webauthnRouter = router({
  /**
   * Generate registration options for biometric authentication
   */
  generateRegistrationOptions: publicProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

    // Manual JWT verification since this is called right after registration
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
    }
    const user = ctx.user;
    
    // Parse existing authenticators
    let existingAuthenticators: webauthnService.StoredAuthenticator[] = [];
    if (user.webauthnCredentials) {
      try {
        existingAuthenticators = JSON.parse(user.webauthnCredentials);
      } catch (error) {
        console.error("[WebAuthn] Failed to parse existing credentials:", error);
      }
    }

    // Generate registration options
    const options = await webauthnService.generateBiometricRegistrationOptions(
      user.id,
      user.email,
      user.name || user.email,
      existingAuthenticators
    );

    // Store challenge
    challenges.set(`reg_${user.id}`, {
      challenge: options.challenge,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    return options;
  }),

  /**
   * Verify and store biometric registration
   */
  verifyRegistration: publicProcedure
    .input(
      z.object({
        response: z.any(), // RegistrationResponseJSON
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

      // Manual JWT verification since this is called right after registration
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
      }
      const user = ctx.user;
      
      // Get stored challenge
      const challengeData = challenges.get(`reg_${user.id}`);
      if (!challengeData) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Challenge not found or expired" });
      }

      // Verify registration
      const verification = await webauthnService.verifyBiometricRegistration(
        input.response,
        challengeData.challenge
      );

      if (!verification.verified) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Registration verification failed" });
      }

      // Store the new authenticator
      const credInfo = verification.registrationInfo!.credential;
      const newAuthenticator = webauthnService.serializeAuthenticator(
        typeof credInfo.id === 'string' ? Buffer.from(credInfo.id, 'base64') : credInfo.id,
        credInfo.publicKey,
        credInfo.counter,
        input.response.response.transports
      );

      // Parse existing authenticators
      let authenticators: webauthnService.StoredAuthenticator[] = [];
      if (user.webauthnCredentials) {
        try {
          authenticators = JSON.parse(user.webauthnCredentials);
        } catch (error) {
          console.error("[WebAuthn] Failed to parse existing credentials:", error);
        }
      }

      // Add new authenticator
      authenticators.push(newAuthenticator);

      // Update user
      await db.update(users)
        .set({
          webauthnEnabled: true,
          webauthnCredentials: JSON.stringify(authenticators),
        })
        .where(eq(users.id, user.id));

      // Clean up challenge
      challenges.delete(`reg_${user.id}`);

      return {
        success: true,
        message: "Biometric authentication enabled successfully",
      };
    }),

  /**
   * Generate authentication options for biometric login
   */
  generateAuthenticationOptions: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      if (!user || !user.webauthnEnabled || !user.webauthnCredentials) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "Biometric authentication not enabled for this account" 
        });
      }

      // Parse authenticators
      let authenticators: webauthnService.StoredAuthenticator[] = [];
      try {
        authenticators = JSON.parse(user.webauthnCredentials);
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to load credentials" });
      }

      // Generate authentication options
      const options = await webauthnService.generateBiometricAuthenticationOptions(authenticators);

      // Store challenge
      challenges.set(`auth_${user.id}`, {
        challenge: options.challenge,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      });

      return {
        options,
        userId: user.id,
      };
    }),

  /**
   * Verify biometric authentication and login
   */
  verifyAuthentication: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        response: z.any(), // AuthenticationResponseJSON
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

      // Get user
      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);

      if (!user || !user.webauthnEnabled || !user.webauthnCredentials) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid authentication" });
      }

      // Get stored challenge
      const challengeData = challenges.get(`auth_${user.id}`);
      if (!challengeData) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Challenge not found or expired" });
      }

      // Parse authenticators
      let authenticators: webauthnService.StoredAuthenticator[] = [];
      try {
        authenticators = JSON.parse(user.webauthnCredentials);
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to load credentials" });
      }

      // Find the authenticator used
      const authenticator = authenticators.find(
        auth => auth.credentialID === input.response.id
      );

      if (!authenticator) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Authenticator not found" });
      }

      // Verify authentication
      const verification = await webauthnService.verifyBiometricAuthentication(
        input.response,
        challengeData.challenge,
        authenticator
      );

      if (!verification.verified) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication verification failed" });
      }

      // Update authenticator counter
      authenticator.counter = verification.authenticationInfo.newCounter;
      await db.update(users)
        .set({
          webauthnCredentials: JSON.stringify(authenticators),
          lastSignedIn: new Date(),
        })
        .where(eq(users.id, user.id));

      // Clean up challenge
      challenges.delete(`auth_${user.id}`);

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          planId: user.planId,
        },
      };
    }),

  /**
   * Check if user has biometric enabled
   */
  checkBiometricStatus: protectedProcedure.query(async ({ ctx }) => {
    return {
      enabled: ctx.user.webauthnEnabled,
      hasCredentials: !!ctx.user.webauthnCredentials,
    };
  }),

  /**
   * Disable biometric authentication
   */
  disableBiometric: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

    await db.update(users)
      .set({
        webauthnEnabled: false,
        webauthnCredentials: null,
      })
      .where(eq(users.id, ctx.user.id));

    return {
      success: true,
      message: "Biometric authentication disabled",
    };
  }),
});
