// ============ QR FOLDER SHARES DATABASE FUNCTIONS ============
import { getDb } from "./db";
import { sql } from "drizzle-orm";

// Types
export interface QrFolderShare {
  id: number;
  folderId: number;
  ownerId: number;
  sharedWithUserId: number;
  permission: 'read' | 'edit';
  createdAt: Date;
  updatedAt: Date;
}

export interface QrFolderShareWithUser extends QrFolderShare {
  sharedWithUser: {
    id: number;
    name: string | null;
    email: string;
  };
}

export interface SharedQrFolderWithOwner {
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
  permission: 'read' | 'edit';
  sharedAt: Date;
  qrCodeCount: number;
}

/**
 * Create a QR folder share
 */
export async function createQrFolderShare(
  folderId: number,
  ownerId: number,
  sharedWithUserId: number,
  permission: 'read' | 'edit' = 'edit'
): Promise<{ insertId: number } | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.execute(sql`
      INSERT INTO qr_folder_shares (folder_id, owner_id, shared_with_user_id, permission)
      VALUES (${folderId}, ${ownerId}, ${sharedWithUserId}, ${permission})
    `);
    return { insertId: Number((result as any).insertId) };
  } catch (error) {
    console.error("[DB] Error creating QR folder share:", error);
    throw error;
  }
}

/**
 * Delete a QR folder share by ID
 */
export async function deleteQrFolderShare(shareId: number, ownerId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.execute(sql`
      DELETE FROM qr_folder_shares
      WHERE id = ${shareId} AND owner_id = ${ownerId}
    `);
    return true;
  } catch (error) {
    console.error("[DB] Error deleting QR folder share:", error);
    return false;
  }
}

/**
 * Delete a QR folder share by folderId and sharedWithUserId
 */
export async function deleteQrFolderShareByUserAndFolder(
  folderId: number,
  ownerId: number,
  sharedWithUserId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.execute(sql`
      DELETE FROM qr_folder_shares
      WHERE folder_id = ${folderId} 
        AND owner_id = ${ownerId}
        AND shared_with_user_id = ${sharedWithUserId}
    `);
    return true;
  } catch (error) {
    console.error("[DB] Error deleting QR folder share:", error);
    return false;
  }
}

/**
 * Get all shares for a specific QR folder (with user details)
 */
export async function getQrFolderShares(folderId: number, ownerId: number): Promise<QrFolderShareWithUser[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.execute(sql`
      SELECT 
        fs.id,
        fs.folder_id,
        fs.owner_id,
        fs.shared_with_user_id,
        fs.permission,
        fs.created_at,
        fs.updated_at,
        u.id as userId,
        u.name as userName,
        u.email as userEmail
      FROM qr_folder_shares fs
      INNER JOIN users u ON fs.shared_with_user_id = u.id
      WHERE fs.folder_id = ${folderId} AND fs.owner_id = ${ownerId}
      ORDER BY fs.created_at DESC
    `);

    const rows = (result as any)[0] || [];
    return rows.map((row: any) => ({
      id: row.id,
      folderId: row.folder_id,
      ownerId: row.owner_id,
      sharedWithUserId: row.shared_with_user_id,
      permission: row.permission,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      sharedWithUser: {
        id: row.userId,
        name: row.userName,
        email: row.userEmail,
      },
    }));
  } catch (error) {
    console.error("[DB] Error getting QR folder shares:", error);
    return [];
  }
}

/**
 * Get count of users a QR folder is shared with
 */
export async function getQrFolderShareCount(folderId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM qr_folder_shares
      WHERE folder_id = ${folderId}
    `);

    const rows = (result as any)[0] || [];
    return rows[0]?.count || 0;
  } catch (error) {
    console.error("[DB] Error getting QR folder share count:", error);
    return 0;
  }
}

/**
 * Get all QR folders shared WITH the user (folders others shared with me)
 */
export async function getQrFoldersSharedWithUser(userId: number): Promise<SharedQrFolderWithOwner[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.execute(sql`
      SELECT 
        fs.id,
        fs.folder_id,
        fs.permission,
        fs.created_at as sharedAt,
        f.id as fId,
        f.name as folderName,
        f.description as folderDescription,
        f.color as folderColor,
        f.icon as folderIcon,
        f.createdAt as folderCreatedAt,
        u.id as ownerId,
        u.name as ownerName,
        u.email as ownerEmail,
        (SELECT COUNT(*) FROM qr_codes qr WHERE qr.folderId = f.id) as qrCodeCount
      FROM qr_folder_shares fs
      INNER JOIN qr_folders f ON fs.folder_id = f.id
      INNER JOIN users u ON fs.owner_id = u.id
      WHERE fs.shared_with_user_id = ${userId}
      ORDER BY fs.created_at DESC
    `);

    const rows = (result as any)[0] || [];
    return rows.map((row: any) => ({
      id: row.id,
      folderId: row.folder_id,
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
      qrCodeCount: Number(row.qrCodeCount) || 0,
    }));
  } catch (error) {
    console.error("[DB] Error getting QR folders shared with user:", error);
    return [];
  }
}

/**
 * Check if a QR folder is shared with a specific user
 */
export async function isQrFolderSharedWithUser(folderId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM qr_folder_shares
      WHERE folder_id = ${folderId} AND shared_with_user_id = ${userId}
    `);

    const rows = (result as any)[0] || [];
    return (rows[0]?.count || 0) > 0;
  } catch (error) {
    console.error("[DB] Error checking QR folder share:", error);
    return false;
  }
}

/**
 * Check if user has access to QR folder (either owner or shared with)
 */
export async function userHasQrFolderAccess(folderId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM qr_folders f
      LEFT JOIN qr_folder_shares fs ON f.id = fs.folder_id AND fs.shared_with_user_id = ${userId}
      WHERE f.id = ${folderId} AND (f.userId = ${userId} OR fs.id IS NOT NULL)
    `);

    const rows = (result as any)[0] || [];
    return (rows[0]?.count || 0) > 0;
  } catch (error) {
    console.error("[DB] Error checking QR folder access:", error);
    return false;
  }
}

/**
 * Get QR folder owner ID
 */
export async function getQrFolderOwnerId(folderId: number): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.execute(sql`
      SELECT userId
      FROM qr_folders
      WHERE id = ${folderId}
    `);

    const rows = (result as any)[0] || [];
    return rows[0]?.userId || null;
  } catch (error) {
    console.error("[DB] Error getting QR folder owner:", error);
    return null;
  }
}

/**
 * Get user's permission for a QR folder
 */
export async function getUserQrFolderPermission(folderId: number, userId: number): Promise<'read' | 'edit' | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.execute(sql`
      SELECT permission
      FROM qr_folder_shares
      WHERE folder_id = ${folderId} AND shared_with_user_id = ${userId}
    `);

    const rows = (result as any)[0] || [];
    return rows[0]?.permission || null;
  } catch (error) {
    console.error("[DB] Error getting QR folder permission:", error);
    return null;
  }
}
