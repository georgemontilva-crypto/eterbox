import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../../db";
import { users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, generateToken, generateVerificationToken } from "../../auth-service";
import { sendWelcomeEmail, sendPasswordChangedEmail } from "../../email";

export const authRouter = router({
  /**
   * Register a new user with email and password
   */
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      
      if (existingUser.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await hashPassword(input.password);
      
      // Generate verification token
      const verificationToken = generateVerificationToken();

      // Create user
      const [newUser] = await db.insert(users).values({
        openId: undefined, // Not using OAuth
        name: input.name,
        email: input.email,
        password: hashedPassword,
        loginMethod: "email",
        emailVerified: false,
        verificationToken,
        planId: 1, // Free plan by default
      });

      // Send welcome email
      try {
        await sendWelcomeEmail(input.email, input.name, 'en'); // Default to English, can be customized
      } catch (emailError) {
        console.error('[Auth] Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }

      // Generate JWT token for immediate authentication
      const token = generateToken({
        userId: newUser.insertId,
        email: input.email,
        role: "user",
      });

      return {
        success: true,
        message: "Registration successful! Please check your email to verify your account.",
        userId: newUser.insertId,
        token,
      };
    }),

  /**
   * Login with email and password
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      // Check if user registered with email/password
      if (!user.password) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "This account uses social login. Please sign in with Google or Apple." 
        });
      }

      // Verify password
      const isValidPassword = await verifyPassword(input.password, user.password);

      if (!isValidPassword) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      // Check if email is verified
      if (!user.emailVerified) {
        throw new TRPCError({ 
          code: "FORBIDDEN", 
          message: "Please verify your email before logging in" 
        });
      }

      // Check if 2FA is enabled
      if (user.twoFactorEnabled) {
        // Return a special response indicating 2FA is required
        return {
          success: false,
          requires2FA: true,
          userId: user.id,
          email: user.email,
        };
      }

      // Update last signed in
      await db.update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.id, user.id));

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        requires2FA: false,
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
   * Get current user info
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      planId: user.planId,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      loginMethod: user.loginMethod,
    };
  }),

  /**
   * Verify email with token
   */
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

      const [user] = await db.select().from(users).where(eq(users.verificationToken, input.token)).limit(1);

      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid verification token" });
      }

      await db.update(users)
        .set({ 
          emailVerified: true, 
          verificationToken: null 
        })
        .where(eq(users.id, user.id));

      return {
        success: true,
        message: "Email verified successfully! You can now log in.",
      };
    }),

  /**
   * Logout (client-side will remove token)
   */
  logout: protectedProcedure.mutation(async () => {
    return {
      success: true,
      message: "Logged out successfully",
    };
  }),

  /**
   * Change user password
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(8, "New password must be at least 8 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

      // Get user from database
      const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Check if user has a password (not OAuth user)
      if (!user.password) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "Cannot change password for social login accounts" 
        });
      }

      // Verify current password
      const isValidPassword = await verifyPassword(input.currentPassword, user.password);

      if (!isValidPassword) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await hashPassword(input.newPassword);

      // Update password
      await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, ctx.user.id));

      // Send password changed notification email
      try {
        const ipAddress = ctx.req?.ip || ctx.req?.headers?.['x-forwarded-for'] as string || 'Unknown';
        await sendPasswordChangedEmail(
          user.email,
          user.name || 'User',
          ipAddress,
          user.language as 'en' | 'es' || 'en'
        );
      } catch (emailError) {
        console.error('[Auth] Failed to send password changed email:', emailError);
        // Don't fail password change if email fails
      }

      return {
        success: true,
        message: "Password updated successfully",
      };
    }),
});
