import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as crypto from "./crypto";
import * as twoFactorService from "./2fa-service";
import * as emailService from "./email-service";
import * as authService from "./auth-service";
import * as paypalUtils from "./paypal-utils";
import { randomBytes } from "crypto";
import { TRPCError } from "@trpc/server";
import { authRouter } from "./api/routers/auth";
import { webauthnRouter } from "./api/routers/webauthn";
import { adminRouter } from "./api/routers/admin";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: authRouter,
  webauthn: webauthnRouter,
  admin: adminRouter,

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
        maxGeneratedKeys: plan.maxGeneratedKeys,
        price: plan.price,
        yearlyPrice: plan.yearlyPrice,
        yearlyDiscount: plan.yearlyDiscount,
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
        maxGeneratedKeys: plan.maxGeneratedKeys,
        keysUsed: keysCount,
        foldersUsed: folders.length,
        generatedKeysUsed: user.generatedKeysUsed || 0,
        price: plan.price,
        yearlyPrice: plan.yearlyPrice,
        yearlyDiscount: plan.yearlyDiscount,
        subscriptionPeriod: user.subscriptionPeriod || "monthly",
        subscriptionEndDate: user.subscriptionEndDate,
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
      .input(z.object({ 
        id: z.number(),
        deleteCredentials: z.boolean().default(false)
      }))
      .mutation(async ({ ctx, input }) => {
        const folder = await db.getFolderById(input.id, ctx.user.id);
        if (!folder) throw new TRPCError({ code: "NOT_FOUND" });

        // Get all credentials in this folder
        const credentials = await db.getCredentialsByFolder(ctx.user.id, input.id);
        
        if (input.deleteCredentials) {
          // Delete all credentials in this folder
          for (const cred of credentials) {
            await db.deleteCredential(cred.id, ctx.user.id);
          }
        } else {
          // Move credentials to no folder (set folderId to null)
          for (const cred of credentials) {
            await db.updateCredential(cred.id, ctx.user.id, { folderId: null });
          }
        }

        await db.deleteFolder(input.id, ctx.user.id);
        await db.recordActivity(ctx.user.id, "folder_deleted", "folder", input.id);

        return { success: true, movedCredentials: input.deleteCredentials ? 0 : credentials.length };
      }),
  }),

  // ============ CREDENTIALS ============
  credentials: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const credentials = await db.getUserCredentials(ctx.user.id);
      return credentials.map(cred => {
        const decryptedPassword = cred.encryptedPassword ? crypto.decryptPassword(cred.encryptedPassword, String(ctx.user.id)) : "";
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
        const decryptedPassword = credential.encryptedPassword ? crypto.decryptPassword(credential.encryptedPassword, String(ctx.user.id)) : "";
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
        const encryptedPassword = crypto.encryptPassword(input.password, String(user.id));

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
        if (input.password) updates.encryptedPassword = crypto.encryptPassword(input.password, String(user.id));
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
          const decryptedPassword = crypto.decryptPassword(credential.encryptedPassword, String(user.id));
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

    // Verify 2FA code during login
    verifyLogin: publicProcedure
      .input(z.object({
        userId: z.number(),
        token: z.string(),
      }))
      .mutation(async ({ input }) => {
        const user = await db.getUserById(input.userId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

        if (!user.twoFactorEnabled || !user.twoFactorSecret) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "2FA is not enabled for this user" });
        }

        // Verify TOTP token
        const isValid = twoFactorService.verifyTOTPToken(user.twoFactorSecret, input.token);
        
        if (!isValid) {
          // Check if it's a backup code
          if (user.backupCodes) {
            const backupCodes = JSON.parse(user.backupCodes);
            // Simple backup code verification (check if exists in array)
            const codeIndex = backupCodes.findIndex((code: string) => code === input.token);
            
            if (codeIndex !== -1) {
              // Remove used backup code
              const updatedBackupCodes = backupCodes.filter((_: string, i: number) => i !== codeIndex);
              await db.updateUserTwoFactor(user.id, true, user.twoFactorSecret, JSON.stringify(updatedBackupCodes));
            } else {
              throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid 2FA code" });
            }
          } else {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid 2FA code" });
          }
        }

        // Update last signed in (using db helper)
        // Note: This would need a db helper method, for now we skip this

        // Generate JWT token (using auth-service)
        const token = authService.generateToken({
          userId: user.id,
          email: user.email,
          role: user.role,
        });

        await db.recordActivity(user.id, "2fa_login_success", "account");

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

  // ============ PASSWORD GENERATOR ============
  passwordGenerator: router({
    generate: protectedProcedure
      .input(z.object({
        length: z.number().min(8).max(128).default(16),
        includeUppercase: z.boolean().default(true),
        includeLowercase: z.boolean().default(true),
        includeNumbers: z.boolean().default(true),
        includeSymbols: z.boolean().default(true),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const plan = await db.getPlanById(user.planId);
        if (!plan) throw new TRPCError({ code: "NOT_FOUND" });

        // Check generation limits (-1 means unlimited)
        if (plan.maxGeneratedKeys !== -1 && (user.generatedKeysUsed || 0) >= plan.maxGeneratedKeys) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `You have reached the maximum number of generated passwords (${plan.maxGeneratedKeys}) for your plan`,
          });
        }

        // Generate password
        let charset = "";
        if (input.includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (input.includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
        if (input.includeNumbers) charset += "0123456789";
        if (input.includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

        if (charset.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "At least one character type must be selected" });
        }

        let password = "";
        const bytes = randomBytes(input.length);
        for (let i = 0; i < input.length; i++) {
          password += charset[bytes[i] % charset.length];
        }

        // Increment usage counter
        await db.incrementGeneratedKeysUsed(ctx.user.id);

        return { password };
      }),

    getUsage: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const plan = await db.getPlanById(user.planId);
      if (!plan) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        used: user.generatedKeysUsed || 0,
        max: plan.maxGeneratedKeys,
        unlimited: plan.maxGeneratedKeys === -1,
      };
    }),
  }),

  // ============ PAYPAL ============
  paypal: router({
    createOrder: protectedProcedure
      .input(z.object({
        planId: z.number(),
        period: z.enum(["monthly", "yearly"]).default("monthly"),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const plan = await db.getPlanById(input.planId);
        if (!plan) throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found" });

        if (plan.name === "Free") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot purchase free plan" });
        }

        // Determine price based on period
        const price = input.period === "yearly" && plan.yearlyPrice 
          ? plan.yearlyPrice.toString() 
          : plan.price.toString();

        try {
          const order = await paypalUtils.createPayPalOrder(
            plan.name,
            price,
            ctx.user.id.toString(),
            `${input.planId}_${input.period}`
          );

          return {
            orderId: order.id,
            approvalUrl: order.links.find((link: any) => link.rel === "approve")?.href,
          };
        } catch (error) {
          console.error("Failed to create PayPal order:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create order" });
        }
      }),

    captureOrder: protectedProcedure
      .input(z.object({
        orderId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const capture = await paypalUtils.capturePayPalOrder(input.orderId);
          
          if (capture.status === "COMPLETED") {
            // Extract plan ID and period from custom_id (format: userId_planId_period)
            const customId = capture.purchase_units?.[0]?.custom_id;
            const purchaseUnit = capture.purchase_units?.[0];
            const captureDetails = purchaseUnit?.payments?.captures?.[0];
            const transactionId = captureDetails?.id || input.orderId;
            const amount = captureDetails?.amount?.value || purchaseUnit?.amount?.value || "0";
            const payerEmail = capture.payer?.email_address;
            const payerName = capture.payer?.name?.given_name + " " + (capture.payer?.name?.surname || "");
            
            if (customId) {
              const parts = customId.split("_");
              const userId = parts[0];
              const planId = parts[1];
              const period = parts[2] || "monthly";
              const subscriptionPeriod: "monthly" | "yearly" = period === "yearly" ? "yearly" : "monthly";
              
              if (parseInt(userId) === ctx.user.id) {
                // Get plan details
                const plan = await db.getPlanById(parseInt(planId));
                const planName = plan?.name || "Unknown";
                
                // Calculate subscription end date
                const endDate = new Date();
                if (subscriptionPeriod === "yearly") {
                  endDate.setFullYear(endDate.getFullYear() + 1);
                } else {
                  endDate.setMonth(endDate.getMonth() + 1);
                }

                // Update user subscription
                await db.updateUserSubscription(ctx.user.id, parseInt(planId), subscriptionPeriod, endDate);
                await db.recordActivity(ctx.user.id, "plan_upgraded", "subscription", parseInt(planId));
                
                // Record payment in history
                await db.createPaymentRecord({
                  userId: ctx.user.id,
                  planId: parseInt(planId),
                  planName,
                  amount,
                  currency: "USD",
                  period: subscriptionPeriod,
                  paymentMethod: "paypal",
                  paypalOrderId: input.orderId,
                  paypalTransactionId: transactionId,
                  status: "completed",
                  payerEmail: payerEmail || ctx.user.email || undefined,
                  payerName: payerName?.trim() || ctx.user.name || undefined,
                  description: `${planName} Plan - ${subscriptionPeriod === "yearly" ? "Annual" : "Monthly"} subscription`,
                });
                
                // Send confirmation email
                const user = await db.getUserById(ctx.user.id);
                if (user?.email) {
                  const emailService = await import("./email-service");
                  await emailService.sendSubscriptionConfirmation(
                    user.email,
                    user.name || "Customer",
                    planName,
                    amount,
                    subscriptionPeriod,
                    endDate,
                    transactionId
                  );
                }
              }
            }
            return { success: true, status: capture.status };
          }

          return { success: false, status: capture.status };
        } catch (error) {
          console.error("Failed to capture PayPal order:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to capture payment" });
        }
      }),

    getOrderStatus: protectedProcedure
      .input(z.object({
        orderId: z.string(),
      }))
      .query(async ({ input }) => {
        try {
          const order = await paypalUtils.getPayPalOrder(input.orderId);
          return { status: order.status };
        } catch (error) {
          console.error("Failed to get PayPal order status:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get order status" });
        }
      }),
  }),

  // ============ PAYMENT HISTORY ============
  payments: router({
    getHistory: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(50),
      }).optional())
      .query(async ({ ctx, input }) => {
        const limit = input?.limit || 50;
        return await db.getUserPaymentHistory(ctx.user.id, limit);
      }),
  }),

  // ============ NEWSLETTER ============
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        try {
          await db.subscribeToNewsletter(input.email);
          return { success: true, message: "Successfully subscribed to newsletter" };
        } catch (error: any) {
          if (error.code === 'ER_DUP_ENTRY') {
            throw new TRPCError({ 
              code: "CONFLICT", 
              message: "This email is already subscribed" 
            });
          }
          throw new TRPCError({ 
            code: "INTERNAL_SERVER_ERROR", 
            message: "Failed to subscribe to newsletter" 
          });
        }
      }),
  }),
});


export type AppRouter = typeof appRouter;
