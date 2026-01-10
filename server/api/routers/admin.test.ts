import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "../../routers";
import { getDb } from "../../db";
import { users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";

describe("Admin Router", () => {
  let adminContext: any;
  let userContext: any;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Find or create admin user for testing
    let adminUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@test.com"))
      .limit(1);
    
    let adminUser = adminUsers[0];

    if (!adminUser) {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 12);
      await db.insert(users).values({
        name: "Admin Test",
        email: "admin@test.com",
        password: hashedPassword,
        role: "admin",
        planId: 1,
        emailVerified: true,
        twoFactorEnabled: false,
        webauthnEnabled: false,
      });

      // Fetch the created user
      adminUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, "admin@test.com"))
        .limit(1);
      
      adminUser = adminUsers[0];
    }

    // Find regular user for testing
    const regularUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, "user@test.com"))
      .limit(1);
    
    const regularUser = regularUsers[0];

    adminContext = {
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: "admin",
      },
      req: {},
      res: {},
    };

    if (regularUser) {
      userContext = {
        user: {
          id: regularUser.id,
          email: regularUser.email,
          role: "user",
        },
        req: {},
        res: {},
      };
    }
  });

  it("should allow admin to list users", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    try {
      const result = await caller.admin.listUsers({
        page: 1,
        pageSize: 10,
      });

      expect(result).toBeDefined();
      expect(result.users).toBeInstanceOf(Array);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    } catch (error) {
      console.log("List users error:", error);
      throw error;
    }
  });

  it("should allow admin to get stats", async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.getStats();

    expect(result).toBeDefined();
    expect(result.totalUsers).toBeGreaterThan(0);
    expect(result.adminUsers).toBeGreaterThan(0);
    expect(result.planStats).toBeInstanceOf(Array);
  });

  it("should allow admin to get plans", async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.getPlans();

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should allow admin to search users by email", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    try {
      const result = await caller.admin.listUsers({
        page: 1,
        pageSize: 10,
        search: "admin",
      });

      expect(result).toBeDefined();
      expect(result.users).toBeInstanceOf(Array);
      if (result.users.length > 0) {
        expect(result.users.some((u: any) => u.email.includes("admin") || u.name?.includes("admin"))).toBe(true);
      }
    } catch (error) {
      console.log("Search users error:", error);
      throw error;
    }
  });

  it("should allow admin to filter users by role", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    try {
      const result = await caller.admin.listUsers({
        page: 1,
        pageSize: 10,
        role: "admin",
      });

      expect(result).toBeDefined();
      expect(result.users).toBeInstanceOf(Array);
      if (result.users.length > 0) {
        expect(result.users.every((u: any) => u.role === "admin")).toBe(true);
      }
    } catch (error) {
      console.log("Filter users error:", error);
      throw error;
    }
  });

  it("should prevent non-admin from accessing admin endpoints", async () => {
    if (!userContext) {
      console.log("Skipping test: no regular user available");
      return;
    }

    const caller = appRouter.createCaller(userContext);

    await expect(
      caller.admin.listUsers({
        page: 1,
        pageSize: 10,
      })
    ).rejects.toThrow();
  });

  it("should prevent admin from demoting themselves", async () => {
    const caller = appRouter.createCaller(adminContext);

    await expect(
      caller.admin.updateUserRole({
        userId: adminContext.user.id,
        role: "user",
      })
    ).rejects.toThrow();
  });

  it("should prevent admin from deleting themselves", async () => {
    const caller = appRouter.createCaller(adminContext);

    await expect(
      caller.admin.deleteUser({
        userId: adminContext.user.id,
      })
    ).rejects.toThrow();
  });

  it("should create user with hashed password", async () => {
    const caller = appRouter.createCaller(adminContext);
    const randomEmail = `test${Date.now()}@test.com`;

    const result = await caller.admin.createUser({
      name: "Test User",
      email: randomEmail,
      password: "testpass123",
      role: "user",
      planId: 1,
      emailVerified: false,
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(randomEmail);
    expect(result.user.password).toBeDefined();
    expect(result.user.password).not.toBe("testpass123");

    // Verify password can be validated
    const isValid = await bcrypt.compare("testpass123", result.user.password!);
    expect(isValid).toBe(true);

    // Clean up
    await caller.admin.deleteUser({ userId: result.user.id });
  });

  it("should prevent creating user with duplicate email", async () => {
    const caller = appRouter.createCaller(adminContext);

    await expect(
      caller.admin.createUser({
        name: "Duplicate User",
        email: "admin@test.com", // Already exists
        password: "testpass123",
        role: "user",
        planId: 1,
        emailVerified: false,
      })
    ).rejects.toThrow();
  });
});
