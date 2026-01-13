/**
 * Subscription Management Router
 * Handles subscription renewals, reminders, and automatic billing
 */

import { router, protectedProcedure } from '../../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import * as subscriptionService from '../../subscription-renewal-service';
import * as adminService from '../../admin-service';

export const subscriptionRouter = router({
  /**
   * Get users with expiring subscriptions (admin only)
   */
  getExpiringSubscriptions: protectedProcedure
    .input(z.object({
      daysBeforeExpiry: z.number().min(1).max(30).default(7)
    }))
    .query(async ({ ctx, input }) => {
      // Check if user is admin
      const isAdmin = await adminService.isAdmin(ctx.user.id);
      if (!isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Solo administradores pueden acceder a esta información'
        });
      }

      const users = await subscriptionService.getUsersWithExpiringSubscriptions(input.daysBeforeExpiry);
      return users;
    }),

  /**
   * Send payment reminders manually (admin only)
   */
  sendPaymentReminders: protectedProcedure
    .input(z.object({
      daysBeforeExpiry: z.number().min(1).max(30).default(7)
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.can_send_bulk_emails) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No tienes permisos para enviar recordatorios'
        });
      }

      const sentCount = await subscriptionService.sendPaymentReminders(input.daysBeforeExpiry);
      return { success: true, sentCount };
    }),

  /**
   * Run all subscription tasks manually (admin only)
   */
  runSubscriptionTasks: protectedProcedure
    .mutation(async ({ ctx }) => {
      // Check if user is super admin
      const permissions = await adminService.getAdminPermissions(ctx.user.id);
      if (!permissions?.is_super_admin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Solo super administradores pueden ejecutar esta acción'
        });
      }

      const results = await subscriptionService.runDailySubscriptionTasks();
      return { success: true, ...results };
    }),

  /**
   * Get user's own subscription info
   */
  getMySubscription: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await import('../../db');
      const user = await db.getUserById(ctx.user.id);
      
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado'
        });
      }

      const plan = await db.getPlanById(user.planId);

      return {
        planId: user.planId,
        planName: plan?.name || 'Free',
        subscriptionEndDate: user.subscriptionEndDate,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPeriod: user.subscriptionPeriod,
        daysRemaining: user.subscriptionEndDate 
          ? Math.max(0, Math.ceil((new Date(user.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
          : null,
        autoRenew: !!user.paypalSubscriptionId
      };
    }),
});
