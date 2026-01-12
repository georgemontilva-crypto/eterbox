import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.SUPPORT_EMAIL || 'noreply@eterbox.com';
const APP_NAME = process.env.VITE_APP_TITLE || 'EterBox';
const FRONTEND_URL = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000';

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
                    ${language === 'en' ? 'If the button doesn\'t work, copy and paste this link into your browser:' : 'Si el botón no funciona, copia y pega este enlace en tu navegador:'}
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
