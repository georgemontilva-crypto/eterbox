import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow with 2FA support
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(), // Optional for OAuth users
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(), // Required and unique
  password: text("password"), // Hashed password for email/password auth
  loginMethod: varchar("loginMethod", { length: 64 }), // 'email', 'google', 'apple'
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  verificationToken: varchar("verificationToken", { length: 255 }),
  resetToken: varchar("resetToken", { length: 255 }),
  resetTokenExpiry: timestamp("resetTokenExpiry"),
  
  // WebAuthn / Biometric authentication
  webauthnEnabled: boolean("webauthnEnabled").default(false).notNull(),
  webauthnCredentials: text("webauthnCredentials"), // JSON array of registered authenticators
  
  // 2FA fields
  twoFactorEnabled: boolean("twoFactorEnabled").default(false).notNull(),
  twoFactorSecret: text("twoFactorSecret"), // TOTP secret (encrypted)
  backupCodes: text("backupCodes"), // JSON array of backup codes (encrypted)
  
  // Plan information
  planId: int("planId").notNull().default(1), // References plans table
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "canceled", "past_due", "unpaid"]).default("active"),
  
  // Usage tracking
  keysUsed: int("keysUsed").default(0).notNull(),
  foldersUsed: int("foldersUsed").default(0).notNull(),
  generatedKeysUsed: int("generatedKeysUsed").default(0).notNull(), // Secure keys generated this period
  
  // Subscription details
  subscriptionPeriod: mysqlEnum("subscriptionPeriod", ["monthly", "yearly"]).default("monthly"),
  subscriptionStartDate: timestamp("subscriptionStartDate"),
  subscriptionEndDate: timestamp("subscriptionEndDate"),
  paypalSubscriptionId: varchar("paypalSubscriptionId", { length: 255 }),
  
  // Payment method
  savedPaymentMethod: text("savedPaymentMethod"), // JSON with card info (last 4 digits, brand, etc.)
  
  // Preferences
  language: varchar("language", { length: 10 }).default("en").notNull(),
  emailNotifications: boolean("emailNotifications").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Active sessions table for JWT token revocation
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: text("token").notNull(), // JWT token (hashed for security)
  deviceInfo: text("deviceInfo"), // User agent, device name, etc.
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv4 or IPv6
  location: varchar("location", { length: 255 }), // City, Country
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Plans table defining subscription tiers
 */
export const plans = mysqlTable("plans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // "Free", "Basic", "Corporate"
  description: text("description"),
  maxKeys: int("maxKeys").notNull(), // Maximum credentials allowed
  maxFolders: int("maxFolders").notNull(), // Maximum folders allowed
  maxGeneratedKeys: int("maxGeneratedKeys").notNull().default(10), // Maximum secure keys that can be generated
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Monthly price in USD
  yearlyPrice: decimal("yearlyPrice", { precision: 10, scale: 2 }), // Yearly price in USD (with discount)
  yearlyDiscount: int("yearlyDiscount").default(0), // Percentage discount for yearly plan
  stripePriceId: varchar("stripePriceId", { length: 255 }), // Stripe monthly price ID
  stripeYearlyPriceId: varchar("stripeYearlyPriceId", { length: 255 }), // Stripe yearly price ID
  features: text("features"), // JSON array of features
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = typeof plans.$inferInsert;

/**
 * Folders for organizing credentials
 */
export const folders = mysqlTable("folders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#3B82F6"), // Hex color
  icon: varchar("icon", { length: 50 }), // Icon name
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Folder = typeof folders.$inferSelect;
export type InsertFolder = typeof folders.$inferInsert;

/**
 * Credentials/Keys stored with encryption
 */
export const credentials = mysqlTable("credentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  folderId: int("folderId"), // Optional folder reference
  
  // Credential details
  platformName: varchar("platformName", { length: 255 }).notNull(), // e.g., "Gmail", "Shopify"
  category: varchar("category", { length: 100 }).notNull(), // Auto-generated from platformName
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  
  // Encrypted password
  encryptedPassword: text("encryptedPassword").notNull(), // AES-256 encrypted
  
  // Additional fields
  url: varchar("url", { length: 2048 }), // Website URL
  notes: text("notes"), // Additional notes
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastUsed: timestamp("lastUsed"),
});

export type Credential = typeof credentials.$inferSelect;
export type InsertCredential = typeof credentials.$inferInsert;

/**
 * Login attempts for security tracking
 */
export const loginAttempts = mysqlTable("loginAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }).notNull(),
  userAgent: text("userAgent"),
  success: boolean("success").notNull(),
  reason: varchar("reason", { length: 255 }), // "invalid_password", "2fa_failed", etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type InsertLoginAttempt = typeof loginAttempts.$inferInsert;

/**
 * Activity logs for audit trail
 */
export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(), // "credential_created", "credential_deleted", etc.
  resourceType: varchar("resourceType", { length: 50 }), // "credential", "folder", "account"
  resourceId: int("resourceId"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  details: text("details"), // JSON with additional context
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

/**
 * Support tickets
 */
export const supportTickets = mysqlTable("supportTickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  category: varchar("category", { length: 50 }), // "bug", "feature", "support", etc.
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  response: text("response"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

/**
 * Email notifications queue
 */
export const emailNotifications = mysqlTable("emailNotifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // "suspicious_login", "failed_attempts", "password_changed", "plan_renewal", etc.
  subject: varchar("subject", { length: 255 }).notNull(),
  htmlContent: text("htmlContent").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  failureReason: text("failureReason"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertEmailNotification = typeof emailNotifications.$inferInsert;

/**
 * Stripe events log for webhook tracking
 */
export const stripeEvents = mysqlTable("stripeEvents", {
  id: int("id").autoincrement().primaryKey(),
  eventId: varchar("eventId", { length: 255 }).notNull().unique(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  userId: int("userId"),
  data: text("data").notNull(), // JSON event data
  processed: boolean("processed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StripeEvent = typeof stripeEvents.$inferSelect;
export type InsertStripeEvent = typeof stripeEvents.$inferInsert;


/**
 * Payment history for tracking all transactions
 */
export const paymentHistory = mysqlTable("paymentHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  planId: int("planId").notNull(),
  planName: varchar("planName", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  period: mysqlEnum("period", ["monthly", "yearly"]).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).notNull(), // "paypal", "card"
  paypalOrderId: varchar("paypalOrderId", { length: 255 }),
  paypalTransactionId: varchar("paypalTransactionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  payerEmail: varchar("payerEmail", { length: 320 }),
  payerName: varchar("payerName", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentHistory = typeof paymentHistory.$inferSelect;
export type InsertPaymentHistory = typeof paymentHistory.$inferInsert;


/**
 * Newsletter subscriptions
 */
export const newsletterSubscriptions = mysqlTable("newsletterSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  isActive: boolean("isActive").default(true).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;


/**
 * User notification preferences
 */
export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  securityAlerts: boolean("security_alerts").default(true).notNull(),
  marketingPromos: boolean("marketing_promos").default(true).notNull(),
  productUpdates: boolean("product_updates").default(true).notNull(),
  accountActivity: boolean("account_activity").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = typeof notificationPreferences.$inferInsert;


/**
 * QR Folders for organizing QR codes
 */
export const qrFolders = mysqlTable("qr_folders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  parentFolderId: int("parentFolderId"), // For nested folders
  color: varchar("color", { length: 7 }).default("#3B82F6"),
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QrFolder = typeof qrFolders.$inferSelect;
export type InsertQrFolder = typeof qrFolders.$inferInsert;

/**
 * QR Codes table
 */
export const qrCodes = mysqlTable("qr_codes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  folderId: int("folderId"), // Reference to qr_folders
  
  // QR Code details
  name: varchar("name", { length: 255 }).notNull(),
  content: text("content").notNull(), // The actual content/URL encoded in the QR
  type: varchar("type", { length: 50 }).notNull().default("url"), // 'url', 'text', 'email', 'phone', 'wifi', 'vcard'
  
  // QR Code data (stored as base64 image)
  qrImage: text("qrImage").notNull(), // Base64 encoded PNG image
  
  // Dynamic QR support
  shortCode: varchar("shortCode", { length: 20 }).unique(), // Unique short code for dynamic QR redirect
  isDynamic: boolean("isDynamic").default(true).notNull(), // If true, QR points to /qr/:shortCode which redirects to content
  
  // Metadata
  description: text("description"),
  scans: int("scans").default(0).notNull(), // Track how many times it was scanned
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastScanned: timestamp("lastScanned"),
});

export type QrCode = typeof qrCodes.$inferSelect;
export type InsertQrCode = typeof qrCodes.$inferInsert;

/**
 * QR Folder Shares for sharing QR folders with other users
 */
export const qrFolderShares = mysqlTable("qr_folder_shares", {
  id: int("id").autoincrement().primaryKey(),
  folderId: int("folder_id").notNull(), // Reference to qr_folders
  ownerId: int("owner_id").notNull(), // User who owns the folder
  sharedWithUserId: int("shared_with_user_id").notNull(), // User the folder is shared with
  permission: varchar("permission", { length: 20 }).default("edit").notNull(), // 'read' or 'edit'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type QrFolderShare = typeof qrFolderShares.$inferSelect;
export type InsertQrFolderShare = typeof qrFolderShares.$inferInsert;
