import { z } from "zod";
import { router, protectedProcedure } from "../../_core/trpc";
import { getDb } from "../../db";
import { users, plans } from "../../../drizzle/schema";
import { eq, desc, like, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcrypt";

// Middleware to check if user is admin
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Solo los administradores pueden acceder a este recurso",
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // Get all users with pagination and search
  listUsers: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(20),
        search: z.string().optional(),
        planId: z.number().optional(),
        role: z.enum(["user", "admin"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search, planId, role } = input;
      const offset = (page - 1) * pageSize;

      let conditions = [];
      if (search) {
        conditions.push(
          or(
            like(users.name, `%${search}%`),
            like(users.email, `%${search}%`)
          )
        );
      }
      if (planId) {
        conditions.push(eq(users.planId, planId));
      }
      if (role) {
        conditions.push(eq(users.role, role));
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [usersList, totalCount] = await Promise.all([
        db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            planId: users.planId,
            planName: plans.name,
            emailVerified: users.emailVerified,
            twoFactorEnabled: users.twoFactorEnabled,
            webauthnEnabled: users.webauthnEnabled,
            subscriptionStatus: users.subscriptionStatus,
            createdAt: users.createdAt,
            lastSignedIn: users.lastSignedIn,
            keysUsed: users.keysUsed,
            foldersUsed: users.foldersUsed,
          })
          .from(users)
          .leftJoin(plans, eq(users.planId, plans.id))
          .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
          .orderBy(desc(users.createdAt))
          .limit(pageSize)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(users)
          .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
          .then((res: any) => res[0]?.count || 0),
      ]);

      return {
        users: usersList,
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    }),

  // Get user statistics
  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const [totalUsers, adminUsers, usersByPlan] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .then((res: any) => res[0]?.count || 0),
      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.role, "admin"))
        .then((res: any) => res[0]?.count || 0),
      db
        .select({
          planId: users.planId,
          planName: plans.name,
          userCount: sql<number>`count(*)`,
        })
        .from(users)
        .leftJoin(plans, eq(users.planId, plans.id))
        .groupBy(users.planId, plans.name),
    ]);

    return {
      totalUsers,
      adminUsers,
      regularUsers: totalUsers - adminUsers,
      planStats: usersByPlan,
    };
  }),

  // Create new user manually
  createUser: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
        role: z.enum(["user", "admin"]).default("user"),
        planId: z.number().default(1),
        emailVerified: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if email already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ya existe un usuario con este email",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Create user
      await db.insert(users).values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
        planId: input.planId,
        emailVerified: input.emailVerified,
        twoFactorEnabled: false,
        webauthnEnabled: false,
      });

      // Fetch created user
      const createdUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      return {
        success: true,
        user: createdUsers[0],
      };
    }),

  // Update user plan
  updateUserPlan: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        planId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(users)
        .set({ planId: input.planId })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Update user role
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Prevent admin from demoting themselves
      if (input.userId === ctx.user.id && input.role !== "admin") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No puedes cambiar tu propio rol de administrador",
        });
      }

      await db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Delete user
  deleteUser: adminProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Prevent admin from deleting themselves
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No puedes eliminar tu propia cuenta de administrador",
        });
      }

      await db.delete(users).where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Get all plans
  getPlans: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    return await db.select().from(plans).orderBy(plans.id);
  }),

  // Verify email manually
  verifyUserEmail: adminProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),
});
