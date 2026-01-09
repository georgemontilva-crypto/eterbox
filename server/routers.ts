import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as crypto from "./crypto";
import * as twoFactorService from "./2fa-service";
import * as emailService from "./email-service";
import * as paypalUtils from "./paypal-utils";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ PLANS ============
  plans: router({
    list: publicProcedure.query(async () => {
      const plans = await db.getAllPlans();
      return plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        maxKeys: plan.maxKeys,
        maxFolders: plan.maxFolders,
        price: plan.price,
        features: plan.features ? JSON.parse(plan.features) : [],
      }));
    }),

    getUserPlan: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const plan = await db.getPlanById(user.planId);
      if (!plan) throw new TRPCError({ code: "NOT_FOUND" });

      const keysCount = await db.countUserCredentials(ctx.user.id);
      const folders = await db.getUserFolders(ctx.user.id);

      return {
        id: plan.id,
        name: plan.name,
        maxKeys: plan.maxKeys,
        maxFolders: plan.maxFolders,
        keysUsed: keysCount,
        foldersUsed: folders.length,
        price: plan.price,
        features: plan.features ? JSON.parse(plan.features) : [],
      };
    }),
  }),

  // ============ FOLDERS ============
  folders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserFolders(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        description: z.string().max(500).optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        icon: z.string().max(50).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check plan limits
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const plan = await db.getPlanById(user.planId);
        if (!plan) throw new TRPCError({ code: "NOT_FOUND" });

        const folders = await db.getUserFolders(ctx.user.id);
        if (folders.length >= plan.maxFolders) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `You have reached the maximum number of folders (${plan.maxFolders}) for your plan`,
          });
        }

        const result = await db.createFolder(ctx.user.id, input.name, input.description, input.color, input.icon);
        
        await db.recordActivity(ctx.user.id, "folder_created", "folder", undefined, ctx.req.headers["x-forwarded-for"] as string);

        return result || { insertId: 0 };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().max(500).optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const folder = await db.getFolderById(input.id, ctx.user.id);
        if (!folder) throw new TRPCError({ code: "NOT_FOUND" });

        const updates: any = {};
        if (input.name) updates.name = input.name;
        if (input.description) updates.description = input.description;
        if (input.color) updates.color = input.color;

        await db.updateFolder(input.id, ctx.user.id, updates);
        await db.recordActivity(ctx.user.id, "folder_updated", "folder", input.id);

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const folder = await db.getFolderById(input.id, ctx.user.id);
        if (!folder) throw new TRPCError({ code: "NOT_FOUND" });

        // Delete all credentials in this folder
        const credentials = await db.getCredentialsByFolder(ctx.user.id, input.id);
        for (const cred of credentials) {
          await db.deleteCredential(cred.id, ctx.user.id);
        }

        await db.deleteFolder(input.id, ctx.user.id);
        await db.recordActivity(ctx.user.id, "folder_deleted", "folder", input.id);

        return { success: true };
      }),
  }),

  // ============ CREDENTIALS ============
  credentials: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const credentials = await db.getUserCredentials(ctx.user.id);
      return credentials.map(cred => {
        const decryptedPassword = cred.encryptedPassword ? crypto.decryptPassword(cred.encryptedPassword, ctx.user.openId) : "";
        return {
          ...cred,
          encryptedPassword: decryptedPassword,
        };
      });
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const credential = await db.getCredentialById(input.id, ctx.user.id);
        if (!credential) throw new TRPCError({ code: "NOT_FOUND" });

        // Decrypt password before returning
        const decryptedPassword = credential.encryptedPassword ? crypto.decryptPassword(credential.encryptedPassword, ctx.user.openId) : "";
        return {
          ...credential,
          encryptedPassword: decryptedPassword,
        };
      }),

    create: protectedProcedure
      .input(z.object({
        platformName: z.string().min(1).max(255),
        username: z.string().min(1).max(255),
        email: z.string().email().optional(),
        password: z.string().min(1),
        folderId: z.number().optional(),
        url: z.string().url().optional(),
        notes: z.string().max(1000).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check plan limits
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const plan = await db.getPlanById(user.planId);
        if (!plan) throw new TRPCError({ code: "NOT_FOUND" });

        const credentialsCount = await db.countUserCredentials(ctx.user.id);
        if (credentialsCount >= plan.maxKeys) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `You have reached the maximum number of credentials (${plan.maxKeys}) for your plan`,
          });
        }

        // Auto-generate category from platform name
        const category = input.platformName.toLowerCase().replace(/\s+/g, "-");

        // Encrypt password
        const encryptedPassword = crypto.encryptPassword(input.password, user.openId);

        const result = await db.createCredential(ctx.user.id, {
          platformName: input.platformName,
          category,
          username: input.username,
          email: input.email,
          encryptedPassword,
          folderId: input.folderId,
          url: input.url,
          notes: input.notes,
        });

        await db.recordActivity(ctx.user.id, "credential_created", "credential", undefined, ctx.req.headers["x-forwarded-for"] as string);

        return { success: true, id: result?.insertId || 0 };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        platformName: z.string().min(1).max(255).optional(),
        username: z.string().min(1).max(255).optional(),
        email: z.string().email().optional(),
        password: z.string().min(1).optional(),
        folderId: z.number().optional(),
        url: z.string().url().optional(),
        notes: z.string().max(1000).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const credential = await db.getCredentialById(input.id, ctx.user.id);
        if (!credential) throw new TRPCError({ code: "NOT_FOUND" });

        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const updates: any = {};
        if (input.platformName) {
          updates.platformName = input.platformName;
          updates.category = input.platformName.toLowerCase().replace(/\s+/g, "-");
        }
        if (input.username) updates.username = input.username;
        if (input.email !== undefined) updates.email = input.email;
        if (input.password) updates.encryptedPassword = crypto.encryptPassword(input.password, user.openId);
        if (input.folderId !== undefined) updates.folderId = input.folderId;
        if (input.url !== undefined) updates.url = input.url;
        if (input.notes !== undefined) updates.notes = input.notes;

        await db.updateCredential(input.id, ctx.user.id, updates);
        await db.recordActivity(ctx.user.id, "credential_updated", "credential", input.id);

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const credential = await db.getCredentialById(input.id, ctx.user.id);
        if (!credential) throw new TRPCError({ code: "NOT_FOUND" });

        await db.deleteCredential(input.id, ctx.user.id);
        await db.recordActivity(ctx.user.id, "credential_deleted", "credential", input.id);

        return { success: true };
      }),

    search: protectedProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        const results = await db.searchCredentials(ctx.user.id, input.query);
        return results.map(cred => ({
          ...cred,
          encryptedPassword: undefined,
        }));
      }),

    decrypt: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const credential = await db.getCredentialById(input.id, ctx.user.id);
        if (!credential) throw new TRPCError({ code: "NOT_FOUND" });

        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        try {
          const decryptedPassword = crypto.decryptPassword(credential.encryptedPassword, user.openId);
          return { password: decryptedPassword };
        } catch (error) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to decrypt password" });
        }
      }),
  }),

  // ============ 2FA ============
  twoFactor: router({
    setup: protectedProcedure.mutation(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const { secret, qrCode, backupCodes } = await twoFactorService.generateTwoFactorSecret(user.email || "", user.name || "");

      // Hash backup codes for storage
      const hashedBackupCodes = twoFactorService.hashBackupCodesForStorage(backupCodes);

      return {
        secret,
        qrCode,
        backupCodes,
        hashedBackupCodes: JSON.stringify(hashedBackupCodes),
      };
    }),

    verify: protectedProcedure
      .input(z.object({
        secret: z.string(),
        token: z.string(),
        backupCodes: z.array(z.string()),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify TOTP token
        if (!twoFactorService.verifyTOTPToken(input.secret, input.token)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid 2FA code" });
        }

        // Hash and store backup codes
        const hashedBackupCodes = twoFactorService.hashBackupCodesForStorage(input.backupCodes);

        await db.updateUserTwoFactor(ctx.user.id, true, input.secret, JSON.stringify(hashedBackupCodes));
        await db.recordActivity(ctx.user.id, "2fa_enabled", "account");

        return { success: true };
      }),

    disable: protectedProcedure.mutation(async ({ ctx }) => {
      await db.updateUserTwoFactor(ctx.user.id, false);
      await db.recordActivity(ctx.user.id, "2fa_disabled", "account");

      return { success: true };
    }),
  }),

  // ============ SUPPORT ============
  support: router({
    submitTicket: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().min(1).max(255),
        subject: z.string().min(1).max(255),
        message: z.string().min(1).max(5000),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createSupportTicket({
          email: input.email,
          name: input.name,
          subject: input.subject,
          message: input.message,
          category: input.category || "general",
        });

        // Send confirmation email
        await emailService.sendSupportTicketConfirmation(input.email, input.name, result?.insertId || 0, input.subject);

        // Queue notification to support email
        await db.createEmailNotification({
          email: process.env.SUPPORT_EMAIL,
          type: "support_ticket",
          subject: `New Support Ticket: ${input.subject}`,
          htmlContent: `
            <p><strong>From:</strong> ${input.name} (${input.email})</p>
            <p><strong>Subject:</strong> ${input.subject}</p>
            <p><strong>Category:</strong> ${input.category || "general"}</p>
            <p><strong>Message:</strong></p>
            <p>${input.message.replace(/\n/g, "<br>")}</p>
          `,
          status: "pending",
        });

        return { success: true, ticketId: result?.insertId || 0 };
      }),

    getTickets: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserSupportTickets(ctx.user.id);
    }),
  }),

  // ============ PAYPAL ============
  paypal: router({
    createSubscription: protectedProcedure
      .input(z.object({
        planId: z.string(),
        stripePriceId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const plan = await db.getPlanByStripePriceId(input.stripePriceId);
        if (!plan) throw new TRPCError({ code: "NOT_FOUND" });

        try {
          const returnUrl = `${process.env.VITE_APP_URL || "http://localhost:3000"}/dashboard?subscription=success`;
          const cancelUrl = `${process.env.VITE_APP_URL || "http://localhost:3000"}/pricing?subscription=cancelled`;

          const subscription = await paypalUtils.createPayPalSubscription(
            input.planId,
            returnUrl,
            cancelUrl,
            user.email || "",
            ctx.user.id.toString()
          );

          return {
            approvalUrl: subscription.links.find((link: any) => link.rel === "approve")?.href,
            subscriptionId: subscription.id,
          };
        } catch (error) {
          console.error("Failed to create PayPal subscription:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create subscription" });
        }
      }),
  }),
});


export type AppRouter = typeof appRouter;
