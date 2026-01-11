import nodemailer from "nodemailer";
import { ENV } from "./_core/env";
import { emailTemplateService } from "./email-template-service";

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
  return sendEmail(email, "✓ Support Ticket #" + ticketId + " Received", htmlContent);
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string,
  lang: 'en' | 'es' = 'en'
): Promise<boolean> {
  try {
    const data = emailTemplateService.getWelcomeEmailData(userName, lang);
    const htmlContent = await emailTemplateService.renderTemplate('welcome', data);
    const subject = lang === 'es' ? '¡Bienvenido a EterBox!' : 'Welcome to EterBox!';
    return sendEmail(email, subject, htmlContent);
  } catch (error) {
    console.error('[EmailService] Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send new registration notification to admin
 */
export async function sendNewRegistrationNotification(
  userName: string,
  userEmail: string,
  userPlan: string
): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_JOIN_EMAIL || 'join@eterbox.com';
    const data = emailTemplateService.getNewRegistrationAdminData(userName, userEmail, userPlan);
    const htmlContent = await emailTemplateService.renderTemplate('new-registration-admin', data);
    return sendEmail(adminEmail, `🎉 New User Registration: ${userName}`, htmlContent);
  } catch (error) {
    console.error('[EmailService] Failed to send new registration notification:', error);
    return false;
  }
}

/**
 * Send purchase confirmation to customer
 */
export async function sendPurchaseConfirmation(
  email: string,
  userName: string,
  planName: string,
  amount: number,
  transactionId: string,
  lang: 'en' | 'es' = 'en'
): Promise<boolean> {
  try {
    const data = emailTemplateService.getPurchaseConfirmationData(userName, planName, amount, transactionId, lang);
    const htmlContent = await emailTemplateService.renderTemplate('purchase-confirmation', data);
    const subject = lang === 'es' ? '✓ Compra Confirmada - EterBox' : '✓ Purchase Confirmed - EterBox';
    return sendEmail(email, subject, htmlContent);
  } catch (error) {
    console.error('[EmailService] Failed to send purchase confirmation:', error);
    return false;
  }
}

/**
 * Send new sale notification to admin
 */
export async function sendNewSaleNotification(
  customerName: string,
  customerEmail: string,
  planName: string,
  amount: number,
  transactionId: string,
  planFeatures: string
): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_SALES_EMAIL || 'sales@eterbox.com';
    const data = emailTemplateService.getNewSaleAdminData(customerName, customerEmail, planName, amount, transactionId, planFeatures);
    const htmlContent = await emailTemplateService.renderTemplate('new-sale-admin', data);
    return sendEmail(adminEmail, `💰 New Sale: ${planName} - $${amount.toFixed(2)}`, htmlContent);
  } catch (error) {
    console.error('[EmailService] Failed to send new sale notification:', error);
    return false;
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactFormNotification(
  contactName: string,
  contactEmail: string,
  contactSubject: string,
  contactMessage: string
): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_CONTACT_EMAIL || 'contact@eterbox.com';
    const data = emailTemplateService.getContactFormData(contactName, contactEmail, contactSubject, contactMessage);
    const htmlContent = await emailTemplateService.renderTemplate('contact-form', data);
    return sendEmail(adminEmail, `📨 New Contact Message: ${contactSubject}`, htmlContent);
  } catch (error) {
    console.error('[EmailService] Failed to send contact form notification:', error);
    return false;
  }
}

/**
 * Send newsletter subscription notification to admin
 */
export async function sendNewsletterNotification(
  subscriberEmail: string,
  source: string,
  totalSubscribers: number
): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_CONTACT_EMAIL || 'contact@eterbox.com';
    const data = emailTemplateService.getNewsletterSubscriptionData(subscriberEmail, source, totalSubscribers);
    const htmlContent = await emailTemplateService.renderTemplate('newsletter-subscription', data);
    return sendEmail(adminEmail, `📰 New Newsletter Subscription: ${subscriberEmail}`, htmlContent);
  } catch (error) {
    console.error('[EmailService] Failed to send newsletter notification:', error);
    return false;
  }
}
