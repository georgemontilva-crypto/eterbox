import { z } from 'zod';
import { protectedProcedure, router } from '../../_core/trpc';
import {
  getEmailPreferences,
  updateEmailPreferences,
  sendMarketingEmail,
  sendSecurityAlertEmail
} from '../../email-notification-service';

export const notificationsRouter = router({
  /**
   * Get user's email notification preferences
   */
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const prefs = await getEmailPreferences(ctx.user.id);
    return prefs || {
      security_alerts: true,
      marketing_promos: true,
      product_updates: true,
      account_activity: true
    };
  }),

  /**
   * Update user's email notification preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        security_alerts: z.boolean().optional(),
        marketing_promos: z.boolean().optional(),
        product_updates: z.boolean().optional(),
        account_activity: z.boolean().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await updateEmailPreferences(ctx.user.id, input);
      if (!result.success) {
        throw new Error('Failed to update preferences');
      }
      return { success: true };
    }),

  /**
   * Send test notification (for testing purposes)
   */
  sendTestNotification: protectedProcedure
    .input(
      z.object({
        type: z.enum(['security', 'marketing'])
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === 'security') {
        const result = await sendSecurityAlertEmail({
          userId: ctx.user.id,
          userEmail: ctx.user.email,
          alertType: 'new_login',
          details: {
            ip: '192.168.1.1',
            location: 'Madrid, España',
            device: 'Chrome en Windows 11',
            timestamp: new Date().toLocaleString('es-ES')
          },
          isTest: true
        });
        return result;
      } else {
        const result = await sendMarketingEmail({
          userId: ctx.user.id,
          userEmail: ctx.user.email,
          subject: '🎉 ¡Prueba de Notificación!',
          title: 'Esta es una notificación de prueba',
          body: '<p>Si recibes este correo, las notificaciones están funcionando correctamente.</p>',
          actionUrl: 'https://eterbox.com',
          actionText: 'Visitar EterBox',
          isTest: true
        });
        return result;
      }
    })
});
