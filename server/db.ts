import { eq, and, or, like, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { gte } from "drizzle-orm";
import { 
  InsertUser, 
  users, 
  plans, 
  folders, 
  credentials, 
  loginAttempts,
  activityLogs,
  supportTickets,
  emailNotifications,
  stripeEvents,
  paymentHistory,
  InsertPaymentHistory,
  newsletterSubscriptions
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: any = null;

export async function getDb() {
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
  if (!_db && dbUrl) {
    try {
      // Create connection pool
      _pool = mysql.createPool(dbUrl);
      // Initialize drizzle with the pool
      _db = drizzle(_pool);
      console.log("[Database] Connection established successfully");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER QUERIES ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    // Email is now required, openId is optional
    if (!user.email && !user.openId) {
      throw new Error("Either email or openId must be provided");
    }
    
    const values: InsertUser = {
      email: user.email || `temp_${Date.now()}@eterbox.com`, // Temporary email for OAuth users without email
      openId: user.openId || null,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "loginMethod"] as const; // email is already set above
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);
    
    // Handle email separately since it's required
    if (user.email !== undefined && user.email !== null) {
      values.email = user.email;
      updateSet.email = user.email;
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserPlan(userId: number, planId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({ planId }).where(eq(users.id, userId));
}

export async function updateUserSubscription(
  userId: number, 
  planId: number, 
  subscriptionPeriod: "monthly" | "yearly",
  subscriptionEndDate: Date
) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({
    planId,
    subscriptionPeriod,
    subscriptionStartDate: new Date(),
    subscriptionEndDate,
    subscriptionStatus: "active",
  }).where(eq(users.id, userId));
}

export async function incrementGeneratedKeysUsed(userId: number) {
  const db = await getDb();
  if (!db) return;

  const user = await getUserById(userId);
  if (!user) return;

  await db.update(users).set({
    generatedKeysUsed: (user.generatedKeysUsed || 0) + 1,
  }).where(eq(users.id, userId));
}

export async function updateUserTwoFactor(userId: number, enabled: boolean, secret?: string, backupCodes?: string) {
  const db = await getDb();
  if (!db) return;

  const updates: any = { twoFactorEnabled: enabled };
  if (secret) updates.twoFactorSecret = secret;
  if (backupCodes) updates.backupCodes = backupCodes;

  await db.update(users).set(updates).where(eq(users.id, userId));
}

// ============ PLAN QUERIES ============

export async function getPlanById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllPlans() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(plans).where(eq(plans.isActive, true));
}

export async function getPlanByStripePriceId(stripePriceId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(plans).where(eq(plans.stripePriceId, stripePriceId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ FOLDER QUERIES ============

export async function getUserFolders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(folders).where(eq(folders.userId, userId)).orderBy(asc(folders.createdAt));
}

export async function createFolder(userId: number, name: string, description?: string, color?: string, icon?: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(folders).values({
    userId,
    name,
    description,
    color,
    icon,
  });

  return { insertId: (result as any).insertId };
}

export async function getFolderById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(folders).where(and(eq(folders.id, id), eq(folders.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateFolder(id: number, userId: number, updates: any) {
  const db = await getDb();
  if (!db) return;

  await db.update(folders).set(updates).where(and(eq(folders.id, id), eq(folders.userId, userId)));
}

export async function deleteFolder(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;

  await db.delete(folders).where(and(eq(folders.id, id), eq(folders.userId, userId)));
}

// ============ CREDENTIAL QUERIES ============

export async function getUserCredentials(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(credentials).where(eq(credentials.userId, userId)).orderBy(desc(credentials.createdAt));
}

export async function getCredentialById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(credentials).where(and(eq(credentials.id, id), eq(credentials.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCredential(userId: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(credentials).values({
    userId,
    ...data,
  });

  return { insertId: (result as any).insertId };
}

export async function updateCredential(id: number, userId: number, updates: any) {
  const db = await getDb();
  if (!db) return;

  await db.update(credentials).set(updates).where(and(eq(credentials.id, id), eq(credentials.userId, userId)));
}

export async function deleteCredential(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;

  await db.delete(credentials).where(and(eq(credentials.id, id), eq(credentials.userId, userId)));
}

export async function searchCredentials(userId: number, query: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(credentials).where(
    and(
      eq(credentials.userId, userId),
      or(
        like(credentials.platformName, `%${query}%`),
        like(credentials.username, `%${query}%`),
        like(credentials.email, `%${query}%`),
        like(credentials.category, `%${query}%`)
      )
    )
  );
}

export async function getCredentialsByFolder(userId: number, folderId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(credentials).where(
    and(eq(credentials.userId, userId), eq(credentials.folderId, folderId))
  );
}

export async function countUserCredentials(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select().from(credentials).where(eq(credentials.userId, userId));
  return result.length;
}

// ============ LOGIN ATTEMPT QUERIES ============

export async function recordLoginAttempt(userId: number, ipAddress: string, userAgent: string, success: boolean, reason?: string) {
  const db = await getDb();
  if (!db) return;

  await db.insert(loginAttempts).values({
    userId,
    ipAddress,
    userAgent,
    success,
    reason,
  });
}

export async function getRecentFailedAttempts(userId: number, minutes: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const since = new Date(Date.now() - minutes * 60 * 1000);
  return await db.select().from(loginAttempts).where(
    and(
      eq(loginAttempts.userId, userId),
      eq(loginAttempts.success, false),
      gte(loginAttempts.createdAt, since as any)
    )
  );
}

// ============ ACTIVITY LOG QUERIES ============

export async function recordActivity(userId: number, action: string, resourceType?: string, resourceId?: number, ipAddress?: string, userAgent?: string, details?: any) {
  const db = await getDb();
  if (!db) return;

  await db.insert(activityLogs).values({
    userId,
    action,
    resourceType,
    resourceId,
    ipAddress,
    userAgent,
    details: details ? JSON.stringify(details) : undefined,
  });
}

export async function getUserActivityLogs(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(activityLogs).where(eq(activityLogs.userId, userId)).orderBy(desc(activityLogs.createdAt)).limit(limit);
}

// ============ SUPPORT TICKET QUERIES ============

export async function createSupportTicket(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(supportTickets).values(data);
  return { insertId: (result as any).insertId };
}

export async function getSupportTicket(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserSupportTickets(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(supportTickets).where(eq(supportTickets.userId, userId)).orderBy(desc(supportTickets.createdAt));
}

// ============ EMAIL NOTIFICATION QUERIES ============

export async function createEmailNotification(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(emailNotifications).values(data);
  return { insertId: (result as any).insertId };
}

export async function getPendingEmailNotifications(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(emailNotifications).where(eq(emailNotifications.status, "pending")).limit(limit);
}

export async function updateEmailNotificationStatus(id: number, status: string, failureReason?: string) {
  const db = await getDb();
  if (!db) return;

  const updates: any = { status };
  if (status === "sent") updates.sentAt = new Date();
  if (failureReason) updates.failureReason = failureReason;

  await db.update(emailNotifications).set(updates).where(eq(emailNotifications.id, id));
}

// ============ STRIPE EVENT QUERIES ============

export async function recordStripeEvent(eventId: string, eventType: string, userId: number | null, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(stripeEvents).values({
    eventId,
    eventType,
    userId,
    data: JSON.stringify(data),
  });

  return { insertId: (result as any).insertId };
}

export async function getStripeEvent(eventId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(stripeEvents).where(eq(stripeEvents.eventId, eventId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function markStripeEventAsProcessed(eventId: string) {
  const db = await getDb();
  if (!db) return;

  await db.update(stripeEvents).set({ processed: true }).where(eq(stripeEvents.eventId, eventId));
}


// ============ PAYMENT HISTORY QUERIES ============

export async function createPaymentRecord(data: InsertPaymentHistory) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(paymentHistory).values(data);
  return { insertId: (result as any).insertId };
}

export async function updatePaymentStatus(
  id: number, 
  status: "pending" | "completed" | "failed" | "refunded",
  transactionId?: string
) {
  const db = await getDb();
  if (!db) return;

  const updates: any = { status };
  if (transactionId) updates.paypalTransactionId = transactionId;

  await db.update(paymentHistory).set(updates).where(eq(paymentHistory.id, id));
}

export async function getUserPaymentHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(paymentHistory)
    .where(eq(paymentHistory.userId, userId))
    .orderBy(desc(paymentHistory.createdAt))
    .limit(limit);
}

export async function getPaymentByOrderId(orderId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(paymentHistory)
    .where(eq(paymentHistory.paypalOrderId, orderId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// ============ NEWSLETTER ============
export async function subscribeToNewsletter(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  await db.insert(newsletterSubscriptions).values({
    email,
    isActive: true,
  });
}

export async function unsubscribeFromNewsletter(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  await db.update(newsletterSubscriptions)
    .set({ 
      isActive: false,
      unsubscribedAt: new Date(),
    })
    .where(eq(newsletterSubscriptions.email, email));
}

export async function getNewsletterSubscribers(activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) return [];

  if (activeOnly) {
    return await db.select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.isActive, true))
      .orderBy(desc(newsletterSubscriptions.subscribedAt));
  }

  return await db.select()
    .from(newsletterSubscriptions)
    .orderBy(desc(newsletterSubscriptions.subscribedAt));
}
