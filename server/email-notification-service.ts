import { getDb } from './db';
import { sql } from 'drizzle-orm';
import mysql from 'mysql2/promise';

// Email service configuration (using Resend which is already configured in ENV)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.SUPPORT_EMAIL || 'noreply@eterbox.com';
const APP_URL = process.env.FRONTEND_URL || 'https://eterbox.com';

export type NotificationType = 'security' | 'marketing' | 'update' | 'activity';

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
  type: NotificationType;
}

/**
 * Send email using Resend API
 */
async function sendEmailViaResend(notification: EmailNotification): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    const errorMsg = 'RESEND_API_KEY not configured';
    console.warn('[Email]', errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    console.log('[Email] Sending email to:', notification.to, 'from:', FROM_EMAIL);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [notification.to],
        subject: notification.subject,
        html: notification.html,
        text: notification.text || notification.subject
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Email] Resend API error:', response.status, errorText);
      
      let errorMsg = 'Email service error';
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.message || errorMsg;
      } catch {
        errorMsg = errorText || errorMsg;
      }
      
      return { success: false, error: errorMsg };
    }

    const result = await response.json();
    console.log('[Email] Email sent successfully:', result.id);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Error sending email:', errorMsg, error);
    return { success: false, error: errorMsg };
  }
}

/**
 * Get notification preferences for a user
 */
export async function getEmailPreferences(userId: number) {
  try {
    const db = await getDb();
    if (!db) return null;

    const result: any = await db.execute(sql`
      SELECT security_alerts, marketing_promos, product_updates, account_activity
      FROM notification_preferences
      WHERE user_id = ${userId}
    `);

    if (!result || result.length === 0) {
      // Create default preferences
      await db.execute(sql`
        INSERT INTO notification_preferences (user_id, security_alerts, marketing_promos, product_updates, account_activity)
        VALUES (${userId}, true, true, true, true)
      `);
      return {
        security_alerts: true,
        marketing_promos: true,
        product_updates: true,
        account_activity: true
      };
    }

    return result[0];
  } catch (error) {
    console.error('[Email] Error getting preferences:', error);
    return null;
  }
}

/**
 * Update email notification preferences
 */
export async function updateEmailPreferences(
  userId: number,
  preferences: {
    security_alerts?: boolean;
    marketing_promos?: boolean;
    product_updates?: boolean;
    account_activity?: boolean;
  }
) {
  try {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const updates: string[] = [];
    if (preferences.security_alerts !== undefined) updates.push(`security_alerts = ${preferences.security_alerts}`);
    if (preferences.marketing_promos !== undefined) updates.push(`marketing_promos = ${preferences.marketing_promos}`);
    if (preferences.product_updates !== undefined) updates.push(`product_updates = ${preferences.product_updates}`);
    if (preferences.account_activity !== undefined) updates.push(`account_activity = ${preferences.account_activity}`);

    if (updates.length > 0) {
      await db.execute(sql.raw(`
        UPDATE notification_preferences
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE user_id = ${userId}
      `));
    }

    return { success: true };
  } catch (error) {
    console.error('[Email] Error updating preferences:', error);
    return { success: false, error };
  }
}

/**
 * Generate HTML email template
 */
function generateEmailTemplate(params: {
  title: string;
  preheader?: string;
  body: string;
  actionUrl?: string;
  actionText?: string;
  footerText?: string;
}): string {
  const { title, preheader, body, actionUrl, actionText, footerText } = params;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center; }
    .logo { color: #ffffff; font-size: 32px; font-weight: bold; margin: 0; }
    .content { padding: 40px 30px; }
    .title { font-size: 24px; font-weight: bold; color: #18181b; margin: 0 0 20px 0; }
    .body-text { font-size: 16px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0; }
    .button { display: inline-block; padding: 14px 28px; background-color: #3b82f6; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .button:hover { background-color: #2563eb; }
    .footer { background-color: #f4f4f5; padding: 30px; text-align: center; font-size: 14px; color: #71717a; }
    .footer a { color: #3b82f6; text-decoration: none; }
    .divider { height: 1px; background-color: #e4e4e7; margin: 30px 0; }
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .title { font-size: 20px; }
      .body-text { font-size: 15px; }
    }
  </style>
</head>
<body>
  ${preheader ? `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ''}
  <div class="container">
    <div class="header">
      <h1 class="logo">🛡️ EterBox</h1>
    </div>
    <div class="content">
      <h2 class="title">${title}</h2>
      <div class="body-text">
        ${body}
      </div>
      ${actionUrl && actionText ? `
        <a href="${actionUrl}" class="button">${actionText}</a>
      ` : ''}
      <div class="divider"></div>
      <p class="body-text" style="font-size: 14px; color: #71717a;">
        ${footerText || 'Este es un correo automático de EterBox. Por favor no respondas a este mensaje.'}
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0;">© 2026 EterBox. Todos los derechos reservados.</p>
      <p style="margin: 0;">
        <a href="${APP_URL}/settings">Configuración</a> •
        <a href="${APP_URL}/privacy-policy">Privacidad</a> •
        <a href="${APP_URL}/support">Soporte</a>
      </p>
      <p style="margin: 15px 0 0 0; font-size: 12px;">
        <a href="${APP_URL}/settings?tab=notifications">Administrar preferencias de notificaciones</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send security alert email
 */
export async function sendSecurityAlertEmail(params: {
  userId: number;
  userEmail: string;
  alertType: 'new_login' | 'password_changed' | 'new_device' | '2fa_enabled' | 'suspicious_activity';
  details: {
    ip?: string;
    location?: string;
    device?: string;
    timestamp?: string;
  };
  isTest?: boolean;
}) {
  const { userId, userEmail, alertType, details } = params;

  // Check preferences (skip for test emails)
  if (!params.isTest) {
    const prefs = await getEmailPreferences(userId);
    if (!prefs || !prefs.security_alerts) {
      console.log(`[Email] User ${userId} has disabled security alerts`);
      return { success: true, skipped: true };
    }
  }

  const alertMessages = {
    new_login: {
      subject: '🔐 Nuevo inicio de sesión en tu cuenta de EterBox',
      title: 'Nuevo inicio de sesión detectado',
      body: `
        <p>Hemos detectado un nuevo inicio de sesión en tu cuenta de EterBox.</p>
        <p><strong>Detalles del inicio de sesión:</strong></p>
        <ul style="line-height: 1.8;">
          ${details.timestamp ? `<li><strong>Fecha y hora:</strong> ${details.timestamp}</li>` : ''}
          ${details.ip ? `<li><strong>Dirección IP:</strong> ${details.ip}</li>` : ''}
          ${details.location ? `<li><strong>Ubicación:</strong> ${details.location}</li>` : ''}
          ${details.device ? `<li><strong>Dispositivo:</strong> ${details.device}</li>` : ''}
        </ul>
        <p>Si fuiste tú, puedes ignorar este mensaje. Si no reconoces esta actividad, <strong>cambia tu contraseña inmediatamente</strong> y revisa tu cuenta.</p>
      `,
      actionUrl: `${APP_URL}/change-password`,
      actionText: 'Cambiar Contraseña'
    },
    password_changed: {
      subject: '✅ Tu contraseña de EterBox ha sido cambiada',
      title: 'Contraseña cambiada exitosamente',
      body: `
        <p>Tu contraseña de EterBox ha sido cambiada exitosamente.</p>
        <p><strong>Detalles del cambio:</strong></p>
        <ul style="line-height: 1.8;">
          ${details.timestamp ? `<li><strong>Fecha y hora:</strong> ${details.timestamp}</li>` : ''}
          ${details.ip ? `<li><strong>Dirección IP:</strong> ${details.ip}</li>` : ''}
          ${details.location ? `<li><strong>Ubicación:</strong> ${details.location}</li>` : ''}
        </ul>
        <p>Si no realizaste este cambio, <strong>contacta a nuestro equipo de soporte inmediatamente</strong>.</p>
      `,
      actionUrl: `${APP_URL}/support`,
      actionText: 'Contactar Soporte'
    },
    new_device: {
      subject: '📱 Nuevo dispositivo conectado a tu cuenta de EterBox',
      title: 'Nuevo dispositivo detectado',
      body: `
        <p>Se ha conectado un nuevo dispositivo a tu cuenta de EterBox.</p>
        <p><strong>Detalles del dispositivo:</strong></p>
        <ul style="line-height: 1.8;">
          ${details.device ? `<li><strong>Dispositivo:</strong> ${details.device}</li>` : ''}
          ${details.timestamp ? `<li><strong>Fecha y hora:</strong> ${details.timestamp}</li>` : ''}
          ${details.ip ? `<li><strong>Dirección IP:</strong> ${details.ip}</li>` : ''}
          ${details.location ? `<li><strong>Ubicación:</strong> ${details.location}</li>` : ''}
        </ul>
        <p>Puedes revisar todos tus dispositivos conectados en la configuración de tu cuenta.</p>
      `,
      actionUrl: `${APP_URL}/settings?tab=sessions`,
      actionText: 'Ver Dispositivos'
    },
    '2fa_enabled': {
      subject: '🔒 Autenticación de dos factores activada',
      title: '2FA activado exitosamente',
      body: `
        <p>Has activado la autenticación de dos factores (2FA) en tu cuenta de EterBox.</p>
        <p>Tu cuenta ahora tiene una capa adicional de seguridad. Cada vez que inicies sesión, necesitarás ingresar un código de tu aplicación de autenticación.</p>
        <p><strong>Importante:</strong> Guarda tus códigos de respaldo en un lugar seguro. Los necesitarás si pierdes acceso a tu aplicación de autenticación.</p>
      `,
      actionUrl: `${APP_URL}/settings?tab=security`,
      actionText: 'Ver Configuración de Seguridad'
    },
    suspicious_activity: {
      subject: '⚠️ Actividad sospechosa detectada en tu cuenta',
      title: 'Alerta de seguridad',
      body: `
        <p><strong>Hemos detectado actividad sospechosa en tu cuenta de EterBox.</strong></p>
        <p><strong>Detalles:</strong></p>
        <ul style="line-height: 1.8;">
          ${details.timestamp ? `<li><strong>Fecha y hora:</strong> ${details.timestamp}</li>` : ''}
          ${details.ip ? `<li><strong>Dirección IP:</strong> ${details.ip}</li>` : ''}
          ${details.location ? `<li><strong>Ubicación:</strong> ${details.location}</li>` : ''}
        </ul>
        <p>Por tu seguridad, te recomendamos:</p>
        <ol style="line-height: 1.8;">
          <li>Cambiar tu contraseña inmediatamente</li>
          <li>Revisar tus sesiones activas y cerrar las que no reconozcas</li>
          <li>Activar la autenticación de dos factores si aún no lo has hecho</li>
        </ol>
      `,
      actionUrl: `${APP_URL}/change-password`,
      actionText: 'Asegurar mi Cuenta',
      requireInteraction: true
    }
  };

  const message = alertMessages[alertType];

  const html = generateEmailTemplate({
    title: message.title,
    preheader: message.subject,
    body: message.body,
    actionUrl: message.actionUrl,
    actionText: message.actionText,
    footerText: 'Si no reconoces esta actividad, contacta a nuestro equipo de soporte inmediatamente.'
  });

  const result = await sendEmailViaResend({
    to: userEmail,
    subject: message.subject,
    html,
    type: 'security'
  });

  // Log to notification history
  const db = await getDb();
  if (db && result.success) {
    try {
      await db.execute(sql.raw(`
        INSERT INTO notification_history (user_id, type, title, body, data, sent_at)
        VALUES (${userId}, 'security', ${mysql.escape(message.subject)}, ${mysql.escape(message.title)}, ${mysql.escape(JSON.stringify(details))}, NOW())
      `));
    } catch (error) {
      console.error('[Email] Error logging to notification_history:', error);
    }
  }

  return result;
}

/**
 * Send marketing/promotional email
 */
export async function sendMarketingEmail(params: {
  userId: number;
  userEmail: string;
  subject: string;
  title: string;
  body: string;
  actionUrl?: string;
  actionText?: string;
  isTest?: boolean;
}) {
  const { userId, userEmail, subject, title, body, actionUrl, actionText } = params;

  // Check preferences (skip for test emails)
  if (!params.isTest) {
    const prefs = await getEmailPreferences(userId);
    if (!prefs || !prefs.marketing_promos) {
      console.log(`[Email] User ${userId} has disabled marketing emails`);
      return { success: true, skipped: true };
    }
  }

  const html = generateEmailTemplate({
    title,
    preheader: subject,
    body,
    actionUrl,
    actionText,
    footerText: 'Puedes desactivar estos correos en cualquier momento desde tu configuración.'
  });

  const result = await sendEmailViaResend({
    to: userEmail,
    subject,
    html,
    type: 'marketing'
  });

  // Log to notification history
  const db = await getDb();
  if (db && result.success) {
    try {
      await db.execute(sql.raw(`
        INSERT INTO notification_history (user_id, type, title, body, data, sent_at)
        VALUES (${userId}, 'marketing', ${mysql.escape(subject)}, ${mysql.escape(title)}, '{}', NOW())
      `));
    } catch (error) {
      console.error('[Email] Error logging to notification_history:', error);
    }
  }

  return result;
}

/**
 * Send bulk marketing email to multiple users
 */
export async function sendBulkMarketingEmail(params: {
  userIds: number[];
  subject: string;
  title: string;
  body: string;
  actionUrl?: string;
  actionText?: string;
}) {
  const { userIds, subject, title, body, actionUrl, actionText } = params;

  // Get user emails
  const db = await getDb();
  if (!db) {
    console.error('[Email] Database not available');
    return { success: false, sent: 0 };
  }

  const userIdsStr = userIds.join(',');
  const result: any = await db.execute(sql.raw(`
    SELECT id, email FROM users WHERE id IN (${userIdsStr})
  `));

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of result) {
    const sendResult = await sendMarketingEmail({
      userId: user.id,
      userEmail: user.email,
      subject,
      title,
      body,
      actionUrl,
      actionText,
      isTest: true  // Ignore user preferences for admin bulk emails
    });

    if (sendResult.success) {
      if (sendResult.skipped) {
        skipped++;
      } else {
        sent++;
      }
    } else {
      failed++;
    }
  }

  console.log(`[Email] Bulk marketing email: ${sent} sent, ${skipped} skipped, ${failed} failed`);
  return { success: true, sent, skipped, failed };
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(userId: number, userEmail: string, userName: string) {
  const html = generateEmailTemplate({
    title: `¡Bienvenido a EterBox, ${userName}!`,
    preheader: 'Gracias por unirte a EterBox',
    body: `
      <p>Estamos emocionados de tenerte con nosotros. EterBox te ayudará a mantener todas tus contraseñas seguras con encriptación de grado militar.</p>
      <p><strong>Próximos pasos:</strong></p>
      <ol style="line-height: 1.8;">
        <li>Agrega tus primeras contraseñas</li>
        <li>Instala la extensión de navegador para autocompletar</li>
        <li>Activa la autenticación de dos factores (2FA)</li>
        <li>Explora las características premium</li>
      </ol>
      <p>Si tienes alguna pregunta, nuestro equipo de soporte está aquí para ayudarte.</p>
    `,
    actionUrl: `${APP_URL}/dashboard`,
    actionText: 'Ir a mi Dashboard',
    footerText: '¡Gracias por confiar en EterBox para proteger tu identidad digital!'
  });

  const sent = await sendEmailViaResend({
    to: userEmail,
    subject: '🎉 ¡Bienvenido a EterBox!',
    html,
    type: 'activity'
  });

  return { success: sent };
}
