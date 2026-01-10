import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../../db";
import { newsletterSubscribers } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "../../services/email";

const ADMIN_EMAIL = "admin@eterbox.com";

export const newsletterRouter = router({
  /**
   * Subscribe to newsletter
   */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database connection failed" });

      // Check if already subscribed
      const existing = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({ 
          code: "CONFLICT", 
          message: "This email is already subscribed to our newsletter" 
        });
      }

      // Add subscriber
      await db.insert(newsletterSubscribers).values({
        email: input.email,
      });

      // Send confirmation email to subscriber
      sendEmail({
        to: input.email,
        subject: "Welcome to EterBox Newsletter! 📰",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px;">📰 EterBox Newsletter</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px;">Thanks for subscribing!</h2>
                        <p style="margin: 0 0 16px 0; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                          You're now subscribed to the EterBox newsletter. You'll receive updates about:
                        </p>
                        <ul style="margin: 16px 0; padding: 0 0 0 20px; color: #a0a0a0; font-size: 14px; line-height: 1.8;">
                          <li>New features and improvements</li>
                          <li>Security tips and best practices</li>
                          <li>Product updates and announcements</li>
                          <li>Special offers and promotions</li>
                        </ul>
                        <p style="margin: 24px 0 0 0; color: #666666; font-size: 14px;">
                          You can unsubscribe at any time by clicking the link in our emails.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #0f0f0f; padding: 24px; text-align: center; border-top: 1px solid #2a2a2a;">
                        <p style="margin: 0; color: #666666; font-size: 12px;">© 2024 EterBox. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }).catch(err => console.error('[Newsletter Confirmation Email Error]', err));

      // Send notification to admin
      sendEmail({
        to: ADMIN_EMAIL,
        subject: "🎉 New Newsletter Subscriber",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 32px;">
                    <tr>
                      <td>
                        <h2 style="margin: 0 0 16px 0; color: #10b981; font-size: 24px;">🎉 New Newsletter Subscriber</h2>
                        <p style="margin: 0 0 16px 0; color: #333333; font-size: 16px;">
                          Someone just subscribed to the EterBox newsletter!
                        </p>
                        <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 16px; margin: 16px 0;">
                          <p style="margin: 0; color: #666666; font-size: 14px;"><strong>Email:</strong></p>
                          <p style="margin: 4px 0 0 0; color: #333333; font-size: 16px; font-weight: 600;">${input.email}</p>
                        </div>
                        <p style="margin: 16px 0 0 0; color: #666666; font-size: 14px;">
                          Subscribed at: ${new Date().toLocaleString()}
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
      }).catch(err => console.error('[Admin Notification Email Error]', err));

      return {
        success: true,
        message: "Successfully subscribed to newsletter! Check your email for confirmation.",
      };
    }),
});
