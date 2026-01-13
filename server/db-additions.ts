/**
 * Additional database functions for plan limits
 * These should be added to server/db.ts
 */

import { getDb } from "./db";
import { eq, sql } from "drizzle-orm";
import { users, activityLogs } from "../drizzle/schema";

/**
 * Get user devices (based on activity logs with unique device info)
 * This is a simplified version - in production you might want a dedicated devices table
 */
export async function getUserDevices(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    // Get unique devices from activity logs
    const devices = await db
      .selectDistinct({
        deviceInfo: activityLogs.deviceInfo,
        ipAddress: activityLogs.ipAddress,
        lastUsed: activityLogs.createdAt,
      })
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .limit(100);

    // Filter out null/empty device info and group by device
    const uniqueDevices = devices.filter(d => d.deviceInfo && d.deviceInfo.trim() !== '');
    
    return uniqueDevices;
  } catch (error) {
    console.error("[Database] Error getting user devices:", error);
    return [];
  }
}

/**
 * Increment user's generated keys counter
 */
export async function incrementUserGeneratedKeys(userId: number) {
  const db = await getDb();
  if (!db) return;

  try {
    await db
      .update(users)
      .set({
        generatedKeysUsed: sql`${users.generatedKeysUsed} + 1`,
      })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Error incrementing generated keys:", error);
  }
}

/**
 * Reset all users' generated keys counter (monthly reset)
 */
export async function resetAllUsersGeneratedKeys() {
  const db = await getDb();
  if (!db) return;

  try {
    await db
      .update(users)
      .set({
        generatedKeysUsed: 0,
      });
    
    console.log("[Database] Reset all users' generated keys counter");
  } catch (error) {
    console.error("[Database] Error resetting generated keys:", error);
  }
}

/**
 * Count user's active sessions (devices)
 * This is a more accurate way to count devices if you have a sessions table
 */
export async function countUserActiveSessions(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  try {
    // Get activity logs from the last 30 days with unique device info
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const devices = await db
      .selectDistinct({
        deviceInfo: activityLogs.deviceInfo,
      })
      .from(activityLogs)
      .where(
        sql`${activityLogs.userId} = ${userId} AND ${activityLogs.createdAt} >= ${thirtyDaysAgo}`
      );

    // Filter out null/empty device info
    const uniqueDevices = devices.filter(d => d.deviceInfo && d.deviceInfo.trim() !== '');
    
    return uniqueDevices.length;
  } catch (error) {
    console.error("[Database] Error counting user sessions:", error);
    return 0;
  }
}
