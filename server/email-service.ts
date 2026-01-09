import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

let transporter: any = null;

/**
 * Initialize email transporter
 */
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: ENV.smtpHost,
      port: ENV.smtpPort,
      secure: ENV.smtpPort === 465,
      auth: {
        user: ENV.smtpUser,
        pass: ENV.smtpPassword,
      },
    });
  }
  return transporter;
}

/**
 * Send email
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  from: string = ENV.smtpUser
): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Send suspicious login alert
 */
export async function sendSuspiciousLoginAlert(
  email: string,
  userName: string,
  ipAddress: string,
  userAgent: string,
  timestamp: Date
): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Montserrat', sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 15px; }
          .header { color: #000000; text-align: center; margin-bottom: 20px; }
          .alert { background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .details { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .details p { margin: 8px 0; color: #374151; }
          .label { font-weight: bold; color: #000000; }
          .button { background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 15px; }
          .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔒 EterBox Security Alert</h2>
          </div>
          <p>Hi ${userName},</p>
          <div class="alert">
            <strong>Suspicious Login Detected</strong>
            <p>We detected a login attempt to your EterBox account from an unusual location or device.</p>
          </div>
          <div class="details">
            <p><span class="label">Time:</span> ${timestamp.toLocaleString()}</p>
            <p><span class="label">IP Address:</span> ${ipAddress}</p>
            <p><span class="label">Device:</span> ${userAgent}</p>
          </div>
          <p>If this was you, you can ignore this message. If you don't recognize this activity, please:</p>
          <ol>
            <li>Change your password immediately</li>
            <li>Enable two-factor authentication if you haven't already</li>
            <li>Review your account activity</li>
          </ol>
          <a href="https://eterbox.com/account/security" class="button">Review Account Security</a>
          <div class="footer">
            <p>© 2024 EterBox. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, "🔒 EterBox Security Alert: Suspicious Login Detected", htmlContent);
}

/**
 * Send failed login attempts alert
 */
export async function sendFailedAttemptsAlert(
  email: string,
  userName: string,
  attemptCount: number
): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Montserrat', sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 15px; }
          .header { color: #000000; text-align: center; margin-bottom: 20px; }
          .alert { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .button { background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 15px; }
          .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⚠️ Multiple Failed Login Attempts</h2>
          </div>
          <p>Hi ${userName},</p>
          <div class="alert">
            <strong>Multiple Failed Login Attempts</strong>
            <p>We detected ${attemptCount} failed login attempts on your EterBox account in the last 30 minutes.</p>
          </div>
          <p>If this was you, you can ignore this message. If you didn't attempt these logins:</p>
          <ol>
            <li>Change your password immediately</li>
            <li>Enable two-factor authentication</li>
            <li>Contact our support team</li>
          </ol>
          <a href="https://eterbox.com/account/security" class="button">Secure Your Account</a>
          <div class="footer">
            <p>© 2024 EterBox. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, "⚠️ Multiple Failed Login Attempts on Your EterBox Account", htmlContent);
}

/**
 * Send password changed confirmation
 */
export async function sendPasswordChangedConfirmation(
  email: string,
  userName: string
): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Montserrat', sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 15px; }
          .header { color: #000000; text-align: center; margin-bottom: 20px; }
          .success { background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✓ Password Changed Successfully</h2>
          </div>
          <p>Hi ${userName},</p>
          <div class="success">
            <strong>Your password has been changed</strong>
            <p>Your EterBox account password was successfully updated.</p>
          </div>
          <p>If you didn't make this change, please contact our support team immediately.</p>
          <div class="footer">
            <p>© 2024 EterBox. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, "✓ Your EterBox Password Has Been Changed", htmlContent);
}

/**
 * Send plan renewal reminder
 */
export async function sendPlanRenewalReminder(
  email: string,
  userName: string,
  planName: string,
  renewalDate: Date
): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Montserrat', sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 15px; }
          .header { color: #000000; text-align: center; margin-bottom: 20px; }
          .info { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .details { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .details p { margin: 8px 0; color: #374151; }
          .button { background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 15px; }
          .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📅 Plan Renewal Reminder</h2>
          </div>
          <p>Hi ${userName},</p>
          <div class="info">
            <strong>Your ${planName} plan will renew soon</strong>
            <p>Your subscription is set to renew on ${renewalDate.toLocaleDateString()}.</p>
          </div>
          <div class="details">
            <p><span style="font-weight: bold;">Plan:</span> ${planName}</p>
            <p><span style="font-weight: bold;">Renewal Date:</span> ${renewalDate.toLocaleDateString()}</p>
          </div>
          <p>No action is needed if you want to continue your subscription. If you wish to cancel or change your plan, visit your account settings.</p>
          <a href="https://eterbox.com/account/subscription" class="button">Manage Subscription</a>
          <div class="footer">
            <p>© 2024 EterBox. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, "📅 Your EterBox Plan Renewal Reminder", htmlContent);
}

/**
 * Send support ticket confirmation
 */
export async function sendSupportTicketConfirmation(
  email: string,
  name: string,
  ticketId: number,
  subject: string
): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Montserrat', sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 15px; }
          .header { color: #000000; text-align: center; margin-bottom: 20px; }
          .info { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .details { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .details p { margin: 8px 0; color: #374151; }
          .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✓ Support Ticket Received</h2>
          </div>
          <p>Hi ${name},</p>
          <div class="info">
            <strong>We've received your support request</strong>
            <p>Thank you for contacting EterBox support. We'll review your message and get back to you as soon as possible.</p>
          </div>
          <div class="details">
            <p><span style="font-weight: bold;">Ticket ID:</span> #${ticketId}</p>
            <p><span style="font-weight: bold;">Subject:</span> ${subject}</p>
          </div>
          <p>You can track your ticket status using the ticket ID above. Our support team typically responds within 24 hours.</p>
          <div class="footer">
            <p>© 2024 EterBox. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, "✓ Your Support Ticket Has Been Received", htmlContent);
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string
): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Montserrat', sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 15px; }
          .header { color: #000000; text-align: center; margin-bottom: 20px; }
          .welcome { background: linear-gradient(135deg, #000000 0%, #1f2937 100%); color: #ffffff; padding: 30px; border-radius: 15px; text-align: center; margin: 20px 0; }
          .welcome h2 { margin: 0; font-size: 28px; }
          .features { margin: 20px 0; }
          .feature { background-color: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
          .button { background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 15px; }
          .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="welcome">
            <h2>Welcome to EterBox! 🔒</h2>
            <p>Your secure password vault is ready</p>
          </div>
          <p>Hi ${userName},</p>
          <p>Thank you for joining EterBox! We're excited to help you manage your passwords securely.</p>
          <div class="features">
            <div class="feature">
              <strong>🔐 Military-Grade Encryption</strong>
              <p>Your passwords are encrypted with AES-256 encryption</p>
            </div>
            <div class="feature">
              <strong>🔑 Two-Factor Authentication</strong>
              <p>Add an extra layer of security with 2FA</p>
            </div>
            <div class="feature">
              <strong>📁 Organize Your Passwords</strong>
              <p>Create folders to organize your credentials by category</p>
            </div>
          </div>
          <p>Get started by:</p>
          <ol>
            <li>Setting up two-factor authentication</li>
            <li>Creating your first password folder</li>
            <li>Adding your first credential</li>
          </ol>
          <a href="https://eterbox.com/dashboard" class="button">Go to Dashboard</a>
          <div class="footer">
            <p>© 2024 EterBox. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, "Welcome to EterBox - Your Secure Password Vault", htmlContent);
}


/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmation(
  email: string,
  userName: string,
  planName: string,
  amount: string,
  period: "monthly" | "yearly",
  renewalDate: Date,
  transactionId: string
): Promise<boolean> {
  const periodText = period === "yearly" ? "year" : "month";
  const periodTextEs = period === "yearly" ? "año" : "mes";
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Montserrat', sans-serif; background-color: #0a0a0f; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #111118; padding: 30px; border-radius: 20px; border: 1px solid #1e1e2e; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #3b82f6; }
          .success-icon { width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
          .success-icon svg { width: 40px; height: 40px; fill: white; }
          h1 { color: #ffffff; font-size: 24px; margin: 0 0 10px; }
          .subtitle { color: #9ca3af; font-size: 16px; margin: 0; }
          .plan-card { background: linear-gradient(135deg, #1e1e2e 0%, #252532 100%); border-radius: 15px; padding: 25px; margin: 25px 0; border: 1px solid #3b82f6; }
          .plan-name { font-size: 22px; font-weight: bold; color: #3b82f6; margin-bottom: 15px; }
          .plan-details { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .plan-price { font-size: 28px; font-weight: bold; color: #ffffff; }
          .plan-period { color: #9ca3af; font-size: 14px; }
          .details-grid { margin-top: 20px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #2e2e3e; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #9ca3af; }
          .detail-value { color: #ffffff; font-weight: 500; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #2e2e3e; }
          .footer p { color: #6b7280; font-size: 12px; margin: 5px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: 600; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔒 EterBox</div>
          </div>
          
          <div style="text-align: center;">
            <div class="success-icon">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <h1>¡Pago Confirmado!</h1>
            <p class="subtitle">Gracias por tu suscripción, ${userName}</p>
          </div>
          
          <div class="plan-card">
            <div class="plan-name">${planName} Plan</div>
            <div class="plan-details">
              <div>
                <div class="plan-price">$${amount}</div>
                <div class="plan-period">por ${periodTextEs}</div>
              </div>
            </div>
            
            <div class="details-grid">
              <div class="detail-row">
                <span class="detail-label">ID de Transacción</span>
                <span class="detail-value">${transactionId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fecha de Pago</span>
                <span class="detail-value">${new Date().toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Próxima Renovación</span>
                <span class="detail-value">${renewalDate.toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Método de Pago</span>
                <span class="detail-value">PayPal</span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center;">
            <p style="color: #9ca3af;">Tu plan ha sido activado exitosamente. Ya puedes disfrutar de todas las características premium.</p>
            <a href="https://eterbox.com/dashboard" class="button">Ir al Dashboard</a>
          </div>
          
          <div class="footer">
            <p>Si tienes alguna pregunta, contacta a nuestro equipo de soporte.</p>
            <p>© ${new Date().getFullYear()} EterBox. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, `✓ Confirmación de Pago - ${planName} Plan | EterBox`, htmlContent);
}
