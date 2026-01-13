import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../../db";
import { sendContactFormNotification, sendNewsletterNotification } from "../../email-service";
import { ENV } from "../../_core/env";

/**
 * Verify reCAPTCHA token with Google API
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!ENV.recaptchaSecretKey) {
    console.warn('[reCAPTCHA] Secret key not configured, skipping verification');
    return true; // Allow if not configured
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${ENV.recaptchaSecretKey}&response=${token}`,
    });

    const data = await response.json();
    console.log('[reCAPTCHA] Verification result:', { success: data.success, score: data.score });

    // For v3, check score (0.0 - 1.0, higher is better)
    if (data.success && data.score !== undefined) {
      return data.score >= 0.5; // Adjust threshold as needed
    }

    return data.success;
  } catch (error) {
    console.error('[reCAPTCHA] Verification error:', error);
    return true; // Allow on error to not block legitimate users
  }
}

export const contactRouter = router({
  /**
   * Submit contact form
   */
  submitContactForm: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        subject: z.string().min(5, "Subject must be at least 5 characters"),
        message: z.string().min(10, "Message must be at least 10 characters"),
        recaptchaToken: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Verify reCAPTCHA if token is provided
      if (input.recaptchaToken) {
        const isValid = await verifyRecaptcha(input.recaptchaToken);
        if (!isValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "reCAPTCHA verification failed. Please try again.",
          });
        }
      }
      try {
        // Send notification to admin
        await sendContactFormNotification(
          input.name,
          input.email,
          input.subject,
          input.message
        );

        return {
          success: true,
          message: "Your message has been sent successfully. We'll get back to you soon!",
        };
      } catch (error) {
        console.error('[Contact] Failed to send contact form:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message. Please try again later.",
        });
      }
    }),

  /**
   * Subscribe to newsletter
   */
  subscribeNewsletter: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        source: z.string().optional().default("website"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      try {
        // Check if email already exists in newsletter subscribers
        // For now, we'll just send the notification
        // You can add a newsletter_subscribers table later if needed
        
        // Get total subscribers count (placeholder - implement when table exists)
        const totalSubscribers = 1; // TODO: Get actual count from database

        // Send notification to admin
        await sendNewsletterNotification(
          input.email,
          input.source,
          totalSubscribers
        );

        return {
          success: true,
          message: "Thank you for subscribing to our newsletter!",
        };
      } catch (error) {
        console.error('[Newsletter] Failed to subscribe:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe. Please try again later.",
        });
      }
    }),
});
