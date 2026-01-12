import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.SUPPORT_EMAIL || 'noreply@eterbox.com';
const APP_NAME = process.env.VITE_APP_TITLE || 'EterBox'const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email with Resend:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw error;
  }
}

export function getPasswordResetEmailTemplate(resetLink: string, userName: string, language: 'en' | 'es' = 'en') {
  const translations = {
    en: {
      subject: `${APP_NAME} - Password Reset Request`,
      greeting: `Hello ${userName},`,
      intro: 'We received a request to reset your password. Click the button below to create a new password:',
      button: 'Reset Password',
      expiry: 'This link will expire in 15 minutes.',
      noRequest: "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
      security: 'For security reasons, never share this link with anyone.',
      footer: `Best regards,<br>The ${APP_NAME} Team`,
    },
    es: {
      subject: `${APP_NAME} - Solicitud de Restablecimiento de Contraseña`,
      greeting: `Hola ${userName},`,
      intro: 'Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:',
      button: 'Restablecer Contraseña',
      expiry: 'Este enlace expirará en 15 minutos.',
      noRequest: 'Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu contraseña permanecerá sin cambios.',
      security: 'Por razones de seguridad, nunca compartas este enlace con nadie.',
      footer: `Saludos cordiales,<br>El equipo de ${APP_NAME}`,
    },
  };

  const t = translations[language];

  return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #3b82f6;">🔐 ${APP_NAME}</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #e5e5e5;">
                    ${t.greeting}
                  </p>
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #a3a3a3;">
                    ${t.intro}
                  </p>
                  
                  <!-- Button -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                          ${t.button}
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 20px; font-size: 14px; line-height: 1.5; color: #a3a3a3;">
                    ${t.expiry}
                  </p>
                  
                  <!-- Security Notice -->
                  <div style="margin: 30px 0; padding: 16px; background-color: #2a2a2a; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #e5e5e5;">
                      ⚠️ ${t.security}
                    </p>
                  </div>
                  
                  <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.5; color: #737373;">
                    ${t.noRequest}
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #737373;">
                    ${t.footer}
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Alternative Link -->
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 0 40px;">
                  <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #525252; text-align: center;">
                    ${language === 'en' ? `If the button doesn't work, copy and paste this link into your browser:` : `Si el botón no funciona, copia y pega este enlace en tu navegador:`}
                  </p>
                  <p style="margin: 10px 0 0; font-size: 12px; line-height: 1.5; color: #3b82f6; text-align: center; word-break: break-all;">
                    ${resetLink}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName: string,
  language: 'en' | 'es' = 'en'
) {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
  const t = language === 'en' ? {
    subject: `${APP_NAME} - Password Reset Request`,
  } : {
    subject: `${APP_NAME} - Solicitud de Restablecimiento de Contraseña`,
  };

  const html = getPasswordResetEmailTemplate(resetLink, userName, language);

  return sendEmail({
    to: email,
    subject: t.subject,
    html,
  });
}

// ============ WELCOME EMAIL ============

export function getWelcomeEmailTemplate(userName: string, dashboardLink: string, language: 'en' | 'es' = 'en') {
  const translations = {
    en: {
      subject: `Welcome to ${APP_NAME}! 🎉`,
      greeting: `Welcome, ${userName}!`,
      intro: `Thank you for joining ${APP_NAME}. Your account has been created successfully and you're ready to start securing your passwords.`,
      getStarted: `Here's how to get started:`,
      step1Title: '1. Add Your First Credential',
      step1Desc: 'Store your first password securely in your vault.',
      step2Title: '2. Create Folders',
      step2Desc: 'Organize your credentials by creating folders (Work, Personal, Banking, etc.).',
      step3Title: '3. Enable 2FA',
      step3Desc: 'Add an extra layer of security to your account with two-factor authentication.',
      button: 'Go to Dashboard',
      support: 'If you have any questions, our support team is here to help.',
      footer: `Welcome aboard!<br>The ${APP_NAME} Team`,
    },
    es: {
      subject: `¡Bienvenido a ${APP_NAME}! 🎉`,
      greeting: `¡Bienvenido, ${userName}!`,
      intro: `Gracias por unirte a ${APP_NAME}. Tu cuenta ha sido creada exitosamente y estás listo para comenzar a proteger tus contraseñas.`,
      getStarted: 'Así es como puedes comenzar:',
      step1Title: '1. Añade Tu Primera Credencial',
      step1Desc: 'Guarda tu primera contraseña de forma segura en tu bóveda.',
      step2Title: '2. Crea Carpetas',
      step2Desc: 'Organiza tus credenciales creando carpetas (Trabajo, Personal, Banca, etc.).',
      step3Title: '3. Activa 2FA',
      step3Desc: 'Añade una capa extra de seguridad a tu cuenta con autenticación de dos factores.',
      button: 'Ir al Panel',
      support: 'Si tienes alguna pregunta, nuestro equipo de soporte está aquí para ayudarte.',
      footer: `¡Bienvenido a bordo!<br>El equipo de ${APP_NAME}`,
    },
  };

  const t = translations[language];

  return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;">
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #3b82f6;">🎉</h1>
                  <h2 style="margin: 10px 0 0; font-size: 24px; font-weight: 700; color: #e5e5e5;">${t.greeting}</h2>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #a3a3a3;">
                    ${t.intro}
                  </p>
                  
                  <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #e5e5e5;">
                    ${t.getStarted}
                  </h3>
                  
                  <div style="margin: 0 0 20px; padding: 16px; background-color: #2a2a2a; border-radius: 6px;">
                    <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #3b82f6;">
                      ${t.step1Title}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.step1Desc}
                    </p>
                  </div>
                  
                  <div style="margin: 0 0 20px; padding: 16px; background-color: #2a2a2a; border-radius: 6px;">
                    <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #3b82f6;">
                      ${t.step2Title}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.step2Desc}
                    </p>
                  </div>
                  
                  <div style="margin: 0 0 30px; padding: 16px; background-color: #2a2a2a; border-radius: 6px;">
                    <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #3b82f6;">
                      ${t.step3Title}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.step3Desc}
                    </p>
                  </div>
                  
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${dashboardLink}" style="display: inline-block; padding: 14px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                          ${t.button}
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.5; color: #737373; text-align: center;">
                    ${t.support}
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 30px 40px; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #737373;">
                    ${t.footer}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendWelcomeEmail(email: string, userName: string, language: 'en' | 'es' = 'en') {
  const dashboardLink = `${FRONTEND_URL}/dashboard`;
  const subject = language === 'en' ? `Welcome to ${APP_NAME}! 🎉` : `¡Bienvenido a ${APP_NAME}! 🎉`;
  const html = getWelcomeEmailTemplate(userName, dashboardLink, language);

  return sendEmail({ to: email, subject, html });
}

// ============ PASSWORD CHANGE NOTIFICATION ============

export function getPasswordChangedEmailTemplate(userName: string, timestamp: string, ipAddress: string, language: 'en' | 'es' = 'en') {
  const translations = {
    en: {
      subject: `${APP_NAME} - Password Changed`,
      greeting: `Hello ${userName},`,
      intro: 'Your password was successfully changed.',
      details: 'Change details:',
      time: `Time: ${timestamp}`,
      ip: `IP Address: ${ipAddress}`,
      notYou: "If you didn't make this change, please secure your account immediately:",
      action1: '1. Reset your password using the "Forgot Password" link',
      action2: '2. Enable two-factor authentication for extra security',
      action3: '3. Contact our support team if you need assistance',
      button: 'Secure My Account',
      footer: `Stay secure,<br>The ${APP_NAME} Team`,
    },
    es: {
      subject: `${APP_NAME} - Contraseña Cambiada`,
      greeting: `Hola ${userName},`,
      intro: 'Tu contraseña fue cambiada exitosamente.',
      details: 'Detalles del cambio:',
      time: `Hora: ${timestamp}`,
      ip: `Dirección IP: ${ipAddress}`,
      notYou: 'Si no realizaste este cambio, por favor asegura tu cuenta inmediatamente:',
      action1: '1. Restablece tu contraseña usando el enlace "Olvidé mi contraseña"',
      action2: '2. Activa la autenticación de dos factores para mayor seguridad',
      action3: '3. Contacta a nuestro equipo de soporte si necesitas ayuda',
      button: 'Asegurar Mi Cuenta',
      footer: `Mantente seguro,<br>El equipo de ${APP_NAME}`,
    },
  };

  const t = translations[language];

  return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;">
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center;">
                  <div style="width: 64px; height: 64px; margin: 0 auto 20px; background-color: #3b82f6/10; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 32px;">🔑</span>
                  </div>
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #e5e5e5;">${t.subject.split(' - ')[1]}</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #e5e5e5;">
                    ${t.greeting}
                  </p>
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #a3a3a3;">
                    ${t.intro}
                  </p>
                  
                  <div style="margin: 0 0 30px; padding: 20px; background-color: #2a2a2a; border-radius: 6px;">
                    <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #e5e5e5;">
                      ${t.details}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.time}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.ip}
                    </p>
                  </div>
                  
                  <div style="margin: 0 0 20px; padding: 16px; background-color: #f59e0b/10; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #e5e5e5;">
                      ⚠️ ${t.notYou}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.action1}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.action2}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.action3}
                    </p>
                  </div>
                  
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${FRONTEND_URL}/settings" style="display: inline-block; padding: 14px 32px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                          ${t.button}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 30px 40px; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #737373;">
                    ${t.footer}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendPasswordChangedEmail(
  email: string,
  userName: string,
  ipAddress: string,
  language: 'en' | 'es' = 'en'
) {
  const timestamp = new Date().toLocaleString(language === 'en' ? 'en-US' : 'es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const subject = language === 'en' ? `${APP_NAME} - Password Changed` : `${APP_NAME} - Contraseña Cambiada`;
  const html = getPasswordChangedEmailTemplate(userName, timestamp, ipAddress, language);

  return sendEmail({ to: email, subject, html });
}

// ============ 2FA CHANGE NOTIFICATION ============

export function get2FAChangedEmailTemplate(
  userName: string,
  action: 'enabled' | 'disabled',
  timestamp: string,
  ipAddress: string,
  language: 'en' | 'es' = 'en'
) {
  const translations = {
    en: {
      subjectEnabled: `${APP_NAME} - Two-Factor Authentication Enabled`,
      subjectDisabled: `${APP_NAME} - Two-Factor Authentication Disabled`,
      greeting: `Hello ${userName},`,
      introEnabled: 'Two-factor authentication has been enabled on your account. Great job securing your account!',
      introDisabled: 'Two-factor authentication has been disabled on your account.',
      details: 'Change details:',
      time: `Time: ${timestamp}`,
      ip: `IP Address: ${ipAddress}`,
      notYou: "If you didn't make this change, please secure your account immediately:",
      action1: '1. Reset your password using the "Forgot Password" link',
      action2: action === 'disabled' ? '2. Re-enable two-factor authentication' : '2. Review your backup codes',
      action3: '3. Contact our support team if you need assistance',
      button: 'Manage Security Settings',
      footer: `Stay secure,<br>The ${APP_NAME} Team`,
    },
    es: {
      subjectEnabled: `${APP_NAME} - Autenticación de Dos Factores Activada`,
      subjectDisabled: `${APP_NAME} - Autenticación de Dos Factores Desactivada`,
      greeting: `Hola ${userName},`,
      introEnabled: 'La autenticación de dos factores ha sido activada en tu cuenta. ¡Excelente trabajo asegurando tu cuenta!',
      introDisabled: 'La autenticación de dos factores ha sido desactivada en tu cuenta.',
      details: 'Detalles del cambio:',
      time: `Hora: ${timestamp}`,
      ip: `Dirección IP: ${ipAddress}`,
      notYou: 'Si no realizaste este cambio, por favor asegura tu cuenta inmediatamente:',
      action1: '1. Restablece tu contraseña usando el enlace "Olvidé mi contraseña"',
      action2: action === 'disabled' ? '2. Reactiva la autenticación de dos factores' : '2. Revisa tus códigos de respaldo',
      action3: '3. Contacta a nuestro equipo de soporte si necesitas ayuda',
      button: 'Gestionar Configuración de Seguridad',
      footer: `Mantente seguro,<br>El equipo de ${APP_NAME}`,
    },
  };

  const t = translations[language];
  const subject = action === 'enabled' ? t.subjectEnabled : t.subjectDisabled;
  const intro = action === 'enabled' ? t.introEnabled : t.introDisabled;
  const emoji = action === 'enabled' ? '🔒' : '🔓';
  const bgColor = action === 'enabled' ? '#10b981' : '#f59e0b';

  return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;">
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center;">
                  <div style="width: 64px; height: 64px; margin: 0 auto 20px; background-color: ${bgColor}/10; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 32px;">${emoji}</span>
                  </div>
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #e5e5e5;">${subject.split(' - ')[1]}</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #e5e5e5;">
                    ${t.greeting}
                  </p>
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #a3a3a3;">
                    ${intro}
                  </p>
                  
                  <div style="margin: 0 0 30px; padding: 20px; background-color: #2a2a2a; border-radius: 6px;">
                    <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #e5e5e5;">
                      ${t.details}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.time}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.ip}
                    </p>
                  </div>
                  
                  <div style="margin: 0 0 20px; padding: 16px; background-color: ${bgColor}/10; border-left: 4px solid ${bgColor}; border-radius: 4px;">
                    <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #e5e5e5;">
                      ⚠️ ${t.notYou}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.action1}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.action2}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.action3}
                    </p>
                  </div>
                  
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${FRONTEND_URL}/settings" style="display: inline-block; padding: 14px 32px; background-color: ${bgColor}; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                          ${t.button}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 30px 40px; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #737373;">
                    ${t.footer}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function send2FAChangedEmail(
  email: string,
  userName: string,
  action: 'enabled' | 'disabled',
  ipAddress: string,
  language: 'en' | 'es' = 'en'
) {
  const timestamp = new Date().toLocaleString(language === 'en' ? 'en-US' : 'es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  
  const subject = action === 'enabled'
    ? (language === 'en' ? `${APP_NAME} - Two-Factor Authentication Enabled` : `${APP_NAME} - Autenticación de Dos Factores Activada`)
    : (language === 'en' ? `${APP_NAME} - Two-Factor Authentication Disabled` : `${APP_NAME} - Autenticación de Dos Factores Desactivada`);
  
  const html = get2FAChangedEmailTemplate(userName, action, timestamp, ipAddress, language);

  return sendEmail({ to: email, subject, html });
}

// ============ NEW DEVICE NOTIFICATION ============

export function getNewDeviceEmailTemplate(
  userName: string,
  deviceInfo: string,
  timestamp: string,
  ipAddress: string,
  location: string,
  language: 'en' | 'es' = 'en'
) {
  const translations = {
    en: {
      subject: `${APP_NAME} - New Device Login Detected`,
      greeting: `Hello ${userName},`,
      intro: 'We detected a login to your account from a new device.',
      details: 'Login details:',
      device: `Device: ${deviceInfo}`,
      time: `Time: ${timestamp}`,
      ip: `IP Address: ${ipAddress}`,
      loc: `Location: ${location}`,
      wasYou: 'Was this you?',
      ifYes: 'If this was you, you can safely ignore this email. Your account remains secure.',
      ifNo: "If you don't recognize this login, please secure your account immediately:",
      action1: '1. Change your password right away',
      action2: `2. Enable two-factor authentication if you haven't already`,
      action3: '3. Review your recent account activity',
      action4: '4. Contact our support team if you need help',
      button: 'Secure My Account',
      footer: `Stay vigilant,<br>The ${APP_NAME} Team`,
    },
    es: {
      subject: `${APP_NAME} - Inicio de Sesión desde Nuevo Dispositivo Detectado`,
      greeting: `Hola ${userName},`,
      intro: 'Detectamos un inicio de sesión en tu cuenta desde un nuevo dispositivo.',
      details: 'Detalles del inicio de sesión:',
      device: `Dispositivo: ${deviceInfo}`,
      time: `Hora: ${timestamp}`,
      ip: `Dirección IP: ${ipAddress}`,
      loc: `Ubicación: ${location}`,
      wasYou: '¿Fuiste tú?',
      ifYes: 'Si fuiste tú, puedes ignorar este correo de forma segura. Tu cuenta permanece segura.',
      ifNo: 'Si no reconoces este inicio de sesión, por favor asegura tu cuenta inmediatamente:',
      action1: '1. Cambia tu contraseña de inmediato',
      action2: '2. Activa la autenticación de dos factores si aún no lo has hecho',
      action3: '3. Revisa tu actividad reciente en la cuenta',
      action4: '4. Contacta a nuestro equipo de soporte si necesitas ayuda',
      button: 'Asegurar Mi Cuenta',
      footer: `Mantente alerta,<br>El equipo de ${APP_NAME}`,
    },
  };

  const t = translations[language];

  return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;">
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center;">
                  <div style="width: 64px; height: 64px; margin: 0 auto 20px; background-color: #f59e0b/10; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 32px;">🔔</span>
                  </div>
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #e5e5e5;">${t.subject.split(' - ')[1]}</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #e5e5e5;">
                    ${t.greeting}
                  </p>
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #a3a3a3;">
                    ${t.intro}
                  </p>
                  
                  <div style="margin: 0 0 30px; padding: 20px; background-color: #2a2a2a; border-radius: 6px;">
                    <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #e5e5e5;">
                      ${t.details}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.device}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.time}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.ip}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.loc}
                    </p>
                  </div>
                  
                  <div style="margin: 0 0 20px; padding: 16px; background-color: #10b981/10; border-left: 4px solid #10b981; border-radius: 4px;">
                    <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #e5e5e5;">
                      ✅ ${t.wasYou}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.ifYes}
                    </p>
                  </div>
                  
                  <div style="margin: 0 0 20px; padding: 16px; background-color: #ef4444/10; border-left: 4px solid #ef4444; border-radius: 4px;">
                    <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #e5e5e5;">
                      ⚠️ ${t.ifNo}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.action1}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.action2}
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                      ${t.action3}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
                      ${t.action4}
                    </p>
                  </div>
                  
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${FRONTEND_URL}/settings" style="display: inline-block; padding: 14px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                          ${t.button}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 30px 40px; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #737373;">
                    ${t.footer}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendNewDeviceEmail(
  email: string,
  userName: string,
  deviceInfo: string,
  ipAddress: string,
  location: string,
  language: 'en' | 'es' = 'en'
) {
  const timestamp = new Date().toLocaleString(language === 'en' ? 'en-US' : 'es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  
  const subject = language === 'en'
    ? `${APP_NAME} - New Device Login Detected`
    : `${APP_NAME} - Inicio de Sesión desde Nuevo Dispositivo Detectado`;
  
  const html = getNewDeviceEmailTemplate(userName, deviceInfo, timestamp, ipAddress, location, language);

  return sendEmail({ to: email, subject, html });
}
