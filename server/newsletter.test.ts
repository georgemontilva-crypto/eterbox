import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { db } from "./db";
import { newsletterSubscriptions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Newsletter Subscription", () => {
  const ctx = { user: null }; // Public endpoint, no auth required
  const caller = appRouter.createCaller(ctx);

  beforeAll(async () => {
    // Clean up test data
    await db
      .delete(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, "test-newsletter@example.com"));
  });

  it("should subscribe a new email to newsletter", async () => {
    const result = await caller.newsletter.subscribe({
      email: "test-newsletter@example.com",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("subscribed");

    // Verify in database
    const subscriptions = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, "test-newsletter@example.com"));

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0].email).toBe("test-newsletter@example.com");
    expect(subscriptions[0].isActive).toBe(true);
  });

  it("should not allow duplicate email subscriptions", async () => {
    // First subscription
    await caller.newsletter.subscribe({
      email: "test-duplicate@example.com",
    });

    // Try to subscribe again
    const result = await caller.newsletter.subscribe({
      email: "test-duplicate@example.com",
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("already subscribed");

    // Clean up
    await db
      .delete(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, "test-duplicate@example.com"));
  });

  it("should validate email format", async () => {
    await expect(
      caller.newsletter.subscribe({
        email: "invalid-email",
      })
    ).rejects.toThrow();
  });
});
