/**
 * Subscription Renewal Service
 * Handles automatic subscription renewals and payment reminders
 */

import { getDb } from './db';
import { sql } from 'drizzle-orm';
import * as emailService from './email-service';
import * as paypalUtils from './paypal-utils';

interface ExpiringSubscription {
  id: number;
  name: string;
  email: string;
  planId: number;
  planName: string;
  subscriptionEndDate: Date;
  subscriptionPeriod: 'monthly' | 'yearly';
  paypalSubscriptionId?: string;
  daysRemaining: number;
}

/**
 * Get users with subscriptions expiring in N days
 */
export async function getUsersWithExpiringSubscriptions(daysBeforeExpiry: number = 7): Promise<ExpiringSubscription[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    const result: any = await db.execute(sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.planId,
        u.subscriptionEndDate,
        u.subscriptionPeriod,
        u.paypalSubscriptionId,
        p.name as planName,
        DATEDIFF(u.subscriptionEndDate, NOW()) as daysRemaining
      FROM users u
      LEFT JOIN plans p ON u.planId = p.id
      WHERE u.subscriptionEndDate IS NOT NULL
        AND u.planId != 1
        AND DATEDIFF(u.subscriptionEndDate, NOW()) <= ${daysBeforeExpiry}
        AND DATEDIFF(u.subscriptionEndDate, NOW()) >= 0
        AND u.subscriptionStatus = 'active'
      ORDER BY u.subscriptionEndDate ASC
    `);

    return result[0] || [];
  } catch (error) {
    console.error('[Subscription] Error getting expiring subscriptions:', error);
    return [];
  }
}

/**
 * Send payment reminder emails
 */
export async function sendPaymentReminders(daysBeforeExpiry: number = 7): Promise<number> {
  try {
    const users = await getUsersWithExpiringSubscriptions(daysBeforeExpiry);
    console.log(`[Subscription] Found ${users.length} subscriptions expiring in ${daysBeforeExpiry} days`);

    let sentCount = 0;

    for (const user of users) {
      try {
        const expiryDate = new Date(user.subscriptionEndDate).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Send reminder email
        await emailService.sendEmail({
          to: user.email,
          subject: `Tu suscripción de EterBox expira en ${user.daysRemaining} días`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">Recordatorio de Renovación</h2>
              <p>Hola ${user.name},</p>
              <p>Tu suscripción al plan <strong>${user.planName}</strong> expirará el <strong>${expiryDate}</strong> (en ${user.daysRemaining} días).</p>
              
              ${user.paypalSubscriptionId ? `
                <p>Tu suscripción se renovará automáticamente. Asegúrate de que tu método de pago esté actualizado.</p>
              ` : `
                <p>Para continuar disfrutando de todas las funciones premium, renueva tu suscripción antes de que expire.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.VITE_APP_URL || 'http://localhost:3000'}/pricing" 
                     style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                    Renovar Ahora
                  </a>
                </div>
              `}
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Si tienes alguna pregunta, no dudes en contactarnos.
              </p>
              <p style="color: #666; font-size: 14px;">
                Saludos,<br>
                El equipo de EterBox
              </p>
            </div>
          `
        });

        sentCount++;
        console.log(`[Subscription] Sent reminder to ${user.email} (${user.daysRemaining} days remaining)`);
      } catch (error) {
        console.error(`[Subscription] Failed to send reminder to ${user.email}:`, error);
      }
    }

    return sentCount;
  } catch (error) {
    console.error('[Subscription] Error sending payment reminders:', error);
    return 0;
  }
}

/**
 * Expire subscriptions that have passed their end date
 */
export async function expireOverdueSubscriptions(): Promise<number> {
  try {
    const db = await getDb();
    if (!db) return 0;

    // Find users with expired subscriptions
    const result: any = await db.execute(sql`
      SELECT id, name, email, planId
      FROM users
      WHERE subscriptionEndDate IS NOT NULL
        AND subscriptionEndDate < NOW()
        AND subscriptionStatus = 'active'
        AND planId != 1
    `);

    const expiredUsers = result[0] || [];
    console.log(`[Subscription] Found ${expiredUsers.length} expired subscriptions`);

    for (const user of expiredUsers) {
      try {
        // Downgrade to Free plan
        await db.execute(sql`
          UPDATE users
          SET planId = 1,
              subscriptionStatus = 'expired',
              subscriptionEndDate = NULL,
              subscriptionStartDate = NULL
          WHERE id = ${user.id}
        `);

        // Send expiration email
        await emailService.sendEmail({
          to: user.email,
          subject: 'Tu suscripción de EterBox ha expirado',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">Suscripción Expirada</h2>
              <p>Hola ${user.name},</p>
              <p>Tu suscripción premium ha expirado y tu cuenta ha sido cambiada al plan Free.</p>
              <p>Para recuperar el acceso a todas las funciones premium, renueva tu suscripción:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.VITE_APP_URL || 'http://localhost:3000'}/pricing" 
                   style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Ver Planes
                </a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Saludos,<br>
                El equipo de EterBox
              </p>
            </div>
          `
        });

        console.log(`[Subscription] Expired subscription for user ${user.id} (${user.email})`);
      } catch (error) {
        console.error(`[Subscription] Failed to expire subscription for user ${user.id}:`, error);
      }
    }

    return expiredUsers.length;
  } catch (error) {
    console.error('[Subscription] Error expiring subscriptions:', error);
    return 0;
  }
}

/**
 * Attempt automatic renewal for subscriptions with PayPal subscription ID
 */
export async function processAutomaticRenewals(): Promise<number> {
  try {
    const db = await getDb();
    if (!db) return 0;

    // Find subscriptions expiring in 1 day that have PayPal subscription ID
    const result: any = await db.execute(sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.planId,
        u.subscriptionPeriod,
        u.paypalSubscriptionId,
        p.name as planName,
        p.price,
        p.yearlyPrice
      FROM users u
      LEFT JOIN plans p ON u.planId = p.id
      WHERE u.subscriptionEndDate IS NOT NULL
        AND DATEDIFF(u.subscriptionEndDate, NOW()) = 1
        AND u.paypalSubscriptionId IS NOT NULL
        AND u.subscriptionStatus = 'active'
        AND u.planId != 1
    `);

    const renewals = result[0] || [];
    console.log(`[Subscription] Found ${renewals.length} subscriptions to auto-renew`);

    let successCount = 0;

    for (const user of renewals) {
      try {
        // Check PayPal subscription status
        const subscriptionActive = await paypalUtils.checkSubscriptionStatus(user.paypalSubscriptionId);

        if (subscriptionActive) {
          // Extend subscription by period
          const daysToAdd = user.subscriptionPeriod === 'yearly' ? 365 : 30;
          
          await db.execute(sql`
            UPDATE users
            SET subscriptionEndDate = DATE_ADD(subscriptionEndDate, INTERVAL ${daysToAdd} DAY),
                subscriptionStartDate = NOW()
            WHERE id = ${user.id}
          `);

          // Record payment in history
          const amount = user.subscriptionPeriod === 'yearly' ? user.yearlyPrice : user.price;
          
          await db.execute(sql`
            INSERT INTO payment_history (
              user_id, plan_id, plan_name, amount, currency, period,
              payment_method, status, description
            ) VALUES (
              ${user.id}, ${user.planId}, ${user.planName}, ${amount}, 'USD',
              ${user.subscriptionPeriod}, 'paypal', 'completed',
              'Automatic renewal - ${user.planName} Plan'
            )
          `);

          // Send confirmation email
          await emailService.sendEmail({
            to: user.email,
            subject: 'Tu suscripción de EterBox ha sido renovada',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Renovación Exitosa</h2>
                <p>Hola ${user.name},</p>
                <p>Tu suscripción al plan <strong>${user.planName}</strong> ha sido renovada automáticamente por ${daysToAdd} días más.</p>
                <p><strong>Monto cobrado:</strong> $${amount} USD</p>
                <p>Gracias por seguir confiando en EterBox.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.VITE_APP_URL || 'http://localhost:3000'}/dashboard" 
                     style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                    Ir al Dashboard
                  </a>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  Saludos,<br>
                  El equipo de EterBox
                </p>
              </div>
            `
          });

          successCount++;
          console.log(`[Subscription] Auto-renewed subscription for user ${user.id} (${user.email})`);
        } else {
          console.log(`[Subscription] PayPal subscription ${user.paypalSubscriptionId} is not active, skipping renewal`);
        }
      } catch (error) {
        console.error(`[Subscription] Failed to auto-renew for user ${user.id}:`, error);
      }
    }

    return successCount;
  } catch (error) {
    console.error('[Subscription] Error processing automatic renewals:', error);
    return 0;
  }
}

/**
 * Daily cron job to handle all subscription tasks
 */
export async function runDailySubscriptionTasks() {
  console.log('[Subscription] Starting daily subscription tasks...');

  try {
    // 1. Process automatic renewals (1 day before expiry)
    const renewed = await processAutomaticRenewals();
    console.log(`[Subscription] Auto-renewed ${renewed} subscriptions`);

    // 2. Send reminders for subscriptions expiring in 7 days
    const reminders7 = await sendPaymentReminders(7);
    console.log(`[Subscription] Sent ${reminders7} reminders (7 days)`);

    // 3. Send reminders for subscriptions expiring in 3 days
    const reminders3 = await sendPaymentReminders(3);
    console.log(`[Subscription] Sent ${reminders3} reminders (3 days)`);

    // 4. Send reminders for subscriptions expiring in 1 day
    const reminders1 = await sendPaymentReminders(1);
    console.log(`[Subscription] Sent ${reminders1} reminders (1 day)`);

    // 5. Expire overdue subscriptions
    const expired = await expireOverdueSubscriptions();
    console.log(`[Subscription] Expired ${expired} subscriptions`);

    console.log('[Subscription] Daily tasks completed successfully');
    
    return {
      renewed,
      reminders: reminders7 + reminders3 + reminders1,
      expired
    };
  } catch (error) {
    console.error('[Subscription] Error running daily tasks:', error);
    throw error;
  }
}
