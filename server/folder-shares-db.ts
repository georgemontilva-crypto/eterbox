// ============ FOLDER SHARES DATABASE FUNCTIONS ============
import { getDb } from "./db";
import { eq, and, sql } from "drizzle-orm";

// Types
export interface FolderShare {
  id: number;
  folderId: number;
  ownerId: number;
  sharedWithUserId: number;
  permission: 'read';
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderShareWithUser extends FolderShare {
  sharedWithUser: {
    id: number;
    name: string | null;
    email: string;
  };
}

export interface SharedFolderWithOwner {
  id: number;
  folderId: number;
  folder: {
    id: number;
    name: string;
    description: string | null;
    color: string;
    icon: string | null;
    createdAt: Date;
  };
  owner: {
    id: number;
    name: string | null;
    email: string;
  };
  permission: 'read';
  sharedAt: Date;
}

/**
 * Create a folder share
 */
export async function createFolderShare(
  folderId: number,
  ownerId: number,
  sharedWithUserId: number
): Promise<{ insertId: number } | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.execute(sql`
      INSERT INTO folder_shares (folderId, ownerId, sharedWithUserId, permission)
      VALUES (${folderId}, ${ownerId}, ${sharedWithUserId}, 'read')
    `);
    return { insertId: Number((result as any).insertId) };
  } catch (error) {
    console.error("[DB] Error creating folder share:", error);
    throw error;
  }
}

/**
 * Delete a folder share by ID
 */
export async function deleteFolderShare(shareId: number, ownerId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.execute(sql`
      DELETE FROM folder_shares
      WHERE id = ${shareId} AND ownerId = ${ownerId}
    `);
    return true;
  } catch (error) {
    console.error("[DB] Error deleting folder share:", error);
    return false;
  }
}

/**
 * Delete a folder share by folderId and sharedWithUserId
 */
export async function deleteFolderShareByUserAndFolder(
  folderId: number,
  ownerId: number,
  sharedWithUserId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.execute(sql`
      DELETE FROM folder_shares
      WHERE folderId = ${folderId} 
        AND ownerId = ${ownerId}
        AND sharedWithUserId = ${sharedWithUserId}
    `);
    return true;
  } catch (error) {
    console.error("[DB] Error deleting folder share:", error);
    return false;
  }
}

/**
 * Get all shares for a specific folder (with user details)
 */
export async function getFolderShares(folderId: number, ownerId: number): Promise<FolderShareWithUser[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.execute(sql`
      SELECT 
        fs.id,
        fs.folderId,
        fs.ownerId,
        fs.sharedWithUserId,
        fs.permission,
        fs.createdAt,
        fs.updatedAt,
        u.id as userId,
        u.name as userName,
        u.email as userEmail
      FROM folder_shares fs
      INNER JOIN users u ON fs.sharedWithUserId = u.id
      WHERE fs.folderId = ${folderId} AND fs.ownerId = ${ownerId}
      ORDER BY fs.createdAt DESC
    `);

    const rows = (result as any)[0] || [];
    return rows.map((row: any) => ({
      id: row.id,
      folderId: row.folderId,
      ownerId: row.ownerId,
      sharedWithUserId: row.sharedWithUserId,
      permission: row.permission,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      sharedWithUser: {
        id: row.userId,
        name: row.userName,
        email: row.userEmail,
      },
    }));
  } catch (error) {
    console.error("[DB] Error getting folder shares:", error);
    return [];
  }
}

/**
 * Get count of users a folder is shared with
 */
export async function getFolderShareCount(folderId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM folder_shares
      WHERE folderId = ${folderId}
    `);

    const rows = (result as any)[0] || [];
    return rows[0]?.count || 0;
  } catch (error) {
    console.error("[DB] Error getting folder share count:", error);
    return 0;
  }
}

/**
 * Get all folders shared WITH the user (folders others shared with me)
 */
export async function getFoldersSharedWithUser(userId: number): Promise<SharedFolderWithOwner[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.execute(sql`
      SELECT 
        fs.id,
        fs.folderId,
        fs.permission,
        fs.createdAt as sharedAt,
        f.id as fId,
        f.name as folderName,
        f.description as folderDescription,
        f.color as folderColor,
        f.icon as folderIcon,
        f.createdAt as folderCreatedAt,
        u.id as ownerId,
        u.name as ownerName,
        u.email as ownerEmail
      FROM folder_shares fs
      INNER JOIN folders f ON fs.folderId = f.id
      INNER JOIN users u ON fs.ownerId = u.id
      WHERE fs.sharedWithUserId = ${userId}
      ORDER BY fs.createdAt DESC
    `);

    const rows = (result as any)[0] || [];
    return rows.map((row: any) => ({
      id: row.id,
      folderId: row.folderId,
      folder: {
        id: row.fId,
        name: row.folderName,
        description: row.folderDescription,
        color: row.folderColor,
        icon: row.folderIcon,
        createdAt: row.folderCreatedAt,
      },
      owner: {
        id: row.ownerId,
        name: row.ownerName,
        email: row.ownerEmail,
      },
      permission: row.permission,
      sharedAt: row.sharedAt,
    }));
  } catch (error) {
    console.error("[DB] Error getting folders shared with user:", error);
    return [];
  }
}

/**
 * Check if a folder is shared with a specific user
 */
export async function isFolderSharedWithUser(folderId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM folder_shares
      WHERE folderId = ${folderId} AND sharedWithUserId = ${userId}
    `);

    const rows = (result as any)[0] || [];
    return (rows[0]?.count || 0) > 0;
  } catch (error) {
    console.error("[DB] Error checking folder share:", error);
    return false;
  }
}

/**
 * Check if user has access to folder (either owner or shared with)
 */
export async function userHasFolderAccess(folderId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM folders f
      LEFT JOIN folder_shares fs ON f.id = fs.folderId AND fs.sharedWithUserId = ${userId}
      WHERE f.id = ${folderId} AND (f.userId = ${userId} OR fs.id IS NOT NULL)
    `);

    const rows = (result as any)[0] || [];
    return (rows[0]?.count || 0) > 0;
  } catch (error) {
    console.error("[DB] Error checking folder access:", error);
    return false;
  }
}

/**
 * Get folder owner ID
 */
export async function getFolderOwnerId(folderId: number): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.execute(sql`
      SELECT userId
      FROM folders
      WHERE id = ${folderId}
    `);

    const rows = (result as any)[0] || [];
    return rows[0]?.userId || null;
  } catch (error) {
    console.error("[DB] Error getting folder owner:", error);
    return null;
  }
}
