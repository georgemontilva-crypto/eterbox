import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = 'EterBox <noreply@eterbox.com>' }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Email Error]', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('[Email Sent]', { to, subject, id: data?.id });
    return data;
  } catch (error) {
    console.error('[Email Service Error]', error);
    throw error;
  }
}

// Email Templates
export const emailTemplates = {
  welcome: (name: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to EterBox</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🔐 EterBox</h1>
                  <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Security Vault</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px;">Welcome, ${name}! 🎉</h2>
                  <p style="margin: 0 0 16px 0; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                    Thank you for joining EterBox! Your account has been successfully created.
                  </p>
                  <p style="margin: 0 0 24px 0; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                    You can now securely store your passwords, credit cards, and sensitive information with military-grade encryption.
                  </p>
                  
                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
                    <tr>
                      <td style="background-color: #3b82f6; border-radius: 8px; text-align: center;">
                        <a href="https://eterbox.com/dashboard" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                          Go to Dashboard →
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Features -->
                  <div style="background-color: #0f0f0f; border-radius: 12px; padding: 24px; margin: 24px 0;">
                    <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 18px;">What's next?</h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; color: #a0a0a0; font-size: 14px; line-height: 1.8;">
                      <li>Enable Two-Factor Authentication for extra security</li>
                      <li>Set up biometric login (Face ID / Fingerprint)</li>
                      <li>Start adding your first credentials</li>
                      <li>Organize your passwords in folders</li>
                    </ul>
                  </div>
                  
                  <p style="margin: 24px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    Need help? Contact us at <a href="mailto:support@eterbox.com" style="color: #3b82f6; text-decoration: none;">support@eterbox.com</a>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #0f0f0f; padding: 24px; text-align: center; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0; color: #666666; font-size: 12px;">
                    © 2024 EterBox. All rights reserved.
                  </p>
                  <p style="margin: 8px 0 0 0; color: #666666; font-size: 12px;">
                    <a href="https://eterbox.com" style="color: #3b82f6; text-decoration: none;">Website</a> • 
                    <a href="https://eterbox.com/support" style="color: #3b82f6; text-decoration: none;">Support</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  passwordChanged: (name: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🔐 EterBox</h1>
                  <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 16px;">Security Alert</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px;">Password Changed Successfully ✓</h2>
                  <p style="margin: 0 0 16px 0; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                    Hi ${name},
                  </p>
                  <p style="margin: 0 0 24px 0; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                    Your password has been changed successfully. If you made this change, you can safely ignore this email.
                  </p>
                  
                  <!-- Alert Box -->
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                      ⚠️ Didn't make this change?
                    </p>
                    <p style="margin: 8px 0 0 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                      If you didn't change your password, please contact our support team immediately at <a href="mailto:support@eterbox.com" style="color: #92400e; text-decoration: underline;">support@eterbox.com</a>
                    </p>
                  </div>
                  
                  <p style="margin: 24px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    For your security, we recommend:
                  </p>
                  <ul style="margin: 8px 0 0 0; padding: 0 0 0 20px; color: #a0a0a0; font-size: 14px; line-height: 1.8;">
                    <li>Using a strong, unique password</li>
                    <li>Enabling Two-Factor Authentication</li>
                    <li>Never sharing your password with anyone</li>
                  </ul>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #0f0f0f; padding: 24px; text-align: center; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0; color: #666666; font-size: 12px;">
                    © 2024 EterBox. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  paymentSuccess: (name: string, plan: string, amount: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Successful</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">💳 EterBox</h1>
                  <p style="margin: 10px 0 0 0; color: #ede9fe; font-size: 16px;">Payment Confirmation</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px;">Payment Successful! 🎉</h2>
                  <p style="margin: 0 0 16px 0; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                    Hi ${name},
                  </p>
                  <p style="margin: 0 0 24px 0; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                    Thank you for your payment! Your subscription has been activated.
                  </p>
                  
                  <!-- Payment Details -->
                  <div style="background-color: #0f0f0f; border-radius: 12px; padding: 24px; margin: 24px 0;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Plan:</td>
                        <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: 600;">${plan}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Amount:</td>
                        <td style="color: #10b981; font-size: 18px; text-align: right; font-weight: 700;">$${amount}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Status:</td>
                        <td style="color: #10b981; font-size: 14px; text-align: right; font-weight: 600;">✓ Paid</td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                    <tr>
                      <td style="background-color: #8b5cf6; border-radius: 8px; text-align: center;">
                        <a href="https://eterbox.com/dashboard" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                          Go to Dashboard →
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 24px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    Your subscription will renew automatically. You can manage your subscription in your dashboard.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #0f0f0f; padding: 24px; text-align: center; border-top: 1px solid #2a2a2a;">
                  <p style="margin: 0; color: #666666; font-size: 12px;">
                    © 2024 EterBox. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
};
