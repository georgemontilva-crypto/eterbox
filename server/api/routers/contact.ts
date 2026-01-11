import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../../db";
import { sendContactFormNotification, sendNewsletterNotification } from "../../email-service";

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
      })
    )
    .mutation(async ({ input }) => {
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
