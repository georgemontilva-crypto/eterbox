import { z } from "zod";
import { router, protectedProcedure } from "../../_core/trpc";
import { getDb } from "../../db";
import { users, plans } from "../../../drizzle/schema";
import { eq, desc, like, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcrypt";
import * as adminService from "../../admin-service";
import * as emailService from "../../email-notification-service";

// Middleware to check if user is admin
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const isAdminUser = await adminService.isAdmin(ctx.user.id);
  if (!isAdminUser) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Solo los administradores pueden acceder a este recurso",
    });
  }
  return next({ ctx });
});

// Middleware for super admin only
const superAdminProcedure = adminProcedure.use(async ({ ctx, next }) => {
  const isSuperAdminUser = await adminService.isSuperAdmin(ctx.user.id);
  if (!isSuperAdminUser) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Solo los super administradores pueden acceder a este recurso",
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // Check if current user is admin
  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    const isAdminUser = await adminService.isAdmin(ctx.user.id);
    const permissions = isAdminUser ? await adminService.getAdminPermissions(ctx.user.id) : null;
    return {
      isAdmin: isAdminUser,
      permissions
    };
  }),

  // Get analytics data
  getAnalytics: adminProcedure
    .input(
      z.object({
        period: z.enum(['day', 'week', 'month', 'year']).default('month')
      })
    )
    .query(async ({ ctx, input }) => {
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      console.log('[Admin] getAnalytics - User ID:', ctx.user.id);
      console.log('[Admin] getAnalytics - Permissions:', JSON.stringify(permissions));
      console.log('[Admin] getAnalytics - can_view_analytics value:', permissions?.can_view_analytics);
      console.log('[Admin] getAnalytics - can_view_analytics type:', typeof permissions?.can_view_analytics);
      if (!permissions?.can_view_analytics) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver analytics",
        });
      }

      const analytics = await adminService.getAnalytics(input.period);
      return analytics;
    }),

  // Get all users with pagination and search
  listUsers: adminProcedure
    .query(async ({ ctx }) => {
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.can_view_users) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver usuarios",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get all users with plan information
      const result: any = await db.execute(sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.planId as plan_id,
          u.createdAt as created_at,
          u.subscriptionEndDate as subscription_end_date,
          u.subscriptionStatus as subscription_status,
          u.subscriptionPeriod as subscription_period,
          DATEDIFF(u.subscriptionEndDate, NOW()) as days_remaining,
          p.name as plan_name,
          0 as is_restricted
        FROM users u
        LEFT JOIN plans p ON u.planId = p.id
        ORDER BY u.createdAt DESC
      `);

      // db.execute() returns [rows, fields], we need just the rows
      const usersList = Array.isArray(result) && result.length > 0 ? result[0] : [];
      console.log('[Admin] listUsers - Total users found:', usersList.length);
      console.log('[Admin] listUsers - First user sample:', JSON.stringify(usersList[0]));
      
      return usersList;
    }),

  // Update user
  updateUser: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        planId: z.number().optional(),
        role: z.enum(["user", "admin"]).optional(),
        subscriptionEndDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.can_edit_users) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para editar usuarios",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.email) updateData.email = input.email;
      if (input.role) updateData.role = input.role;
      if (input.subscriptionEndDate) updateData.subscriptionEndDate = new Date(input.subscriptionEndDate);
      
      // Si se cambia el plan, establecer fechas de suscripción
      if (input.planId !== undefined) {
        updateData.planId = input.planId;
        
        if (input.planId === 1) {
          // Plan Free: sin fecha de expiración
          updateData.subscriptionStartDate = null;
          updateData.subscriptionEndDate = null;
          updateData.subscriptionStatus = 'active';
          updateData.subscriptionPeriod = 'monthly';
        } else {
          // Planes pagos: establecer 30 días desde hoy
          const now = new Date();
          const endDate = new Date(now);
          endDate.setDate(endDate.getDate() + 30);
          
          updateData.subscriptionStartDate = now;
          updateData.subscriptionEndDate = endDate;
          updateData.subscriptionStatus = 'active';
          updateData.subscriptionPeriod = 'monthly';
        }
      }

      await db.update(users).set(updateData).where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Delete user
  deleteUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.can_delete_users) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para eliminar usuarios",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(users).where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Send bulk email
  sendBulkEmail: adminProcedure
    .input(
      z.object({
        subject: z.string(),
        title: z.string(),
        body: z.string(),
        actionUrl: z.string().optional(),
        actionText: z.string().optional(),
        targetUsers: z.enum(['all', 'free', 'premium']).default('all'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.can_send_bulk_emails) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para enviar emails masivos",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get target users
      let targetUsersList: any[];
      if (input.targetUsers === 'all') {
        targetUsersList = await db.select({ id: users.id, email: users.email }).from(users);
      } else if (input.targetUsers === 'free') {
        targetUsersList = await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.planId, 1));
      } else {
        targetUsersList = await db.select({ id: users.id, email: users.email }).from(users).where(sql`planId IS NOT NULL AND planId != 1`);
      }

      // Create bulk email record
      const bulkEmailResult: any = await db.execute(sql`
        INSERT INTO bulk_emails (
          subject, title, body, target_users, recipients_count, status, created_by
        ) VALUES (
          ${input.subject}, ${input.title}, ${input.body}, ${input.targetUsers}, ${targetUsersList.length}, 'sending', ${ctx.user.id}
        )
      `);
      
      // Extract insertId correctly - it might be in different places depending on driver
      const bulkEmailId = bulkEmailResult?.insertId || bulkEmailResult?.[0]?.insertId || bulkEmailResult?.rows?.insertId;
      console.log('[Admin] sendBulkEmail - Created bulk email record with ID:', bulkEmailId);
      console.log('[Admin] sendBulkEmail - Full result:', JSON.stringify(bulkEmailResult));
      
      if (!bulkEmailId) {
        console.error('[Admin] sendBulkEmail - Failed to get insertId, result:', bulkEmailResult);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create bulk email record",
        });
      }

      // Send emails
      const userIds = targetUsersList.map(u => u.id);
      const result = await emailService.sendBulkMarketingEmail({
        userIds,
        subject: input.subject,
        title: input.title,
        body: input.body,
        actionUrl: input.actionUrl,
        actionText: input.actionText
      });

      // Update bulk email record with results
      await db.execute(sql`
        UPDATE bulk_emails 
        SET 
          sent_count = ${result.sent},
          failed_count = ${result.failed || 0},
          status = 'sent',
          sent_at = NOW()
        WHERE id = ${bulkEmailId}
      `);

      return result;
    }),

  // Get revenue data
  getRevenue: adminProcedure
    .input(
      z.object({
        period: z.enum(['day', 'week', 'month', 'year']).default('month')
      })
    )
    .query(async ({ ctx, input }) => {
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.can_view_revenue) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver ingresos",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      const revenueResult: any = await db.execute(sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as transactions,
          SUM(amount) as total,
          AVG(amount) as average
        FROM payment_history
        WHERE status = 'completed' AND created_at >= ${startDate.toISOString()}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      const totalRevenueResult: any = await db.execute(sql`
        SELECT 
          COUNT(*) as total_transactions,
          SUM(amount) as total_amount,
          AVG(amount) as average_amount
        FROM payment_history
        WHERE status = 'completed' AND created_at >= ${startDate.toISOString()}
      `);

      const revenueData = Array.isArray(revenueResult) ? revenueResult : (revenueResult?.rows || revenueResult || []);
      const totalRevenue = Array.isArray(totalRevenueResult) ? totalRevenueResult : (totalRevenueResult?.rows || totalRevenueResult || []);
      
      console.log('[Admin] getRevenue - Daily data points:', revenueData.length);

      return {
        daily: revenueData,
        summary: totalRevenue?.[0] || { total_transactions: 0, total_amount: 0, average_amount: 0, growth_percentage: 0, today_revenue: 0 },
        period: input.period
      };
    }),

  // Get transactions history
  getTransactions: adminProcedure
    .input(
      z.object({
        limit: z.number().default(50)
      })
    )
    .query(async ({ ctx, input }) => {
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.can_view_revenue) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver transacciones",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result: any = await db.execute(sql`
        SELECT 
          ph.id,
          ph.user_id,
          ph.amount,
          ph.status,
          ph.created_at,
          u.name as user_name,
          u.email as user_email,
          p.name as plan_name
        FROM payment_history ph
        LEFT JOIN users u ON ph.user_id = u.id
        LEFT JOIN plans p ON ph.plan_id = p.id
        ORDER BY ph.created_at DESC
        LIMIT ${input.limit}
      `);

      // db.execute() returns [rows, fields], extract just the rows
      const transactions = Array.isArray(result) && result.length > 0 ? result[0] : [];
      console.log('[Admin] getTransactions - Total transactions found:', transactions.length);
      
      return transactions;
    }),

  // Get email history
  getEmailHistory: adminProcedure
    .query(async ({ ctx }) => {
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.can_send_bulk_emails) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver historial de emails",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result: any = await db.execute(sql`
        SELECT 
          id,
          subject,
          title,
          body,
          target_users,
          recipients_count,
          sent_count,
          status,
          created_at,
          sent_at
        FROM bulk_emails
        ORDER BY created_at DESC
        LIMIT 50
      `);

      const emailHistory = Array.isArray(result) ? result : (result?.rows || result || []);
      console.log('[Admin] getEmailHistory - Total emails found:', emailHistory.length);
      
      return emailHistory;
    }),

  // Get users with expiring subscriptions
  getExpiringSubscriptions: adminProcedure
    .input(z.object({ daysBeforeExpiry: z.number().default(5) }))
    .query(async ({ ctx, input }) => {
      const users = await adminService.getUsersWithExpiringSubscriptions(input.daysBeforeExpiry);
      return users;
    }),

  // Send payment reminders
  sendPaymentReminders: adminProcedure
    .mutation(async ({ ctx }) => {
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.can_send_bulk_emails) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para enviar recordatorios",
        });
      }

      const expiringUsers = await adminService.getUsersWithExpiringSubscriptions(5);
      
      let sent = 0;
      for (const user of expiringUsers) {
        const daysLeft = Math.ceil((new Date(user.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        await emailService.sendMarketingEmail({
          userId: user.id,
          userEmail: user.email,
          subject: `⏰ Tu suscripción a ${user.plan_name} vence en ${daysLeft} días`,
          title: 'Recordatorio de Renovación',
          body: `
            <p>Hola ${user.name},</p>
            <p>Tu suscripción al plan <strong>${user.plan_name}</strong> vencerá el <strong>${new Date(user.subscriptionEndDate).toLocaleDateString('es-ES')}</strong>.</p>
            <p>Para continuar disfrutando de todas las características premium, renueva tu suscripción antes de que expire.</p>
            <p><strong>Precio:</strong> $${user.price}/mes</p>
          `,
          actionUrl: `${process.env.VITE_APP_URL}/pricing`,
          actionText: 'Renovar Ahora'
        });
        sent++;
      }

      return { success: true, sent };
    }),

  // Admin management
  listAdmins: superAdminProcedure.query(async () => {
    const admins = await adminService.getAllAdmins();
    return admins;
  }),

  addAdmin: superAdminProcedure
    .input(
      z.object({
        email: z.string().email(),
        permissions: z.object({
          is_super_admin: z.boolean().optional(),
          can_view_users: z.boolean().optional(),
          can_edit_users: z.boolean().optional(),
          can_delete_users: z.boolean().optional(),
          can_send_bulk_emails: z.boolean().optional(),
          can_view_revenue: z.boolean().optional(),
          can_manage_admins: z.boolean().optional(),
          can_view_analytics: z.boolean().optional(),
        })
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await adminService.addAdmin(input.email, input.permissions, ctx.user.id);
      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.message || "Error al agregar administrador",
        });
      }
      return result;
    }),

  removeAdmin: superAdminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const success = await adminService.removeAdmin(input.userId, ctx.user.id);
      if (!success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error al remover administrador",
        });
      }
      return { success };
    }),

  // Get all plans
  listPlans: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const plansList = await db.select().from(plans).orderBy(plans.id);
    return plansList;
  }),
});
