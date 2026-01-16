import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import { qrCodes, qrFolders, type InsertQrCode, type InsertQrFolder } from "../drizzle/schema";

// ============ QR CODES QUERIES ============

export async function createQrCode(data: InsertQrCode) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(qrCodes).values(data);
  return result;
}

export async function getQrCodesByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.userId, userId))
    .orderBy(desc(qrCodes.createdAt));
}

export async function getQrCodeById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select()
    .from(qrCodes)
    .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, userId)))
    .limit(1);
  
  return result[0] || null;
}

export async function updateQrCode(id: number, userId: number, data: Partial<InsertQrCode>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(qrCodes)
    .set(data)
    .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, userId)));
}

export async function deleteQrCode(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .delete(qrCodes)
    .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, userId)));
}

export async function incrementQrScans(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const qrCode = await getQrCodeById(id, userId);
  if (!qrCode) throw new Error("QR code not found");
  
  return await db
    .update(qrCodes)
    .set({
      scans: (qrCode.scans || 0) + 1,
      lastScanned: new Date(),
    })
    .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, userId)));
}

// ============ QR FOLDERS QUERIES ============

export async function createQrFolder(data: InsertQrFolder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(qrFolders).values(data);
  return result;
}

export async function getQrFoldersByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(qrFolders)
    .where(eq(qrFolders.userId, userId))
    .orderBy(desc(qrFolders.createdAt));
}

export async function getQrFolderById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select()
    .from(qrFolders)
    .where(and(eq(qrFolders.id, id), eq(qrFolders.userId, userId)))
    .limit(1);
  
  return result[0] || null;
}

export async function updateQrFolder(id: number, userId: number, data: Partial<InsertQrFolder>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(qrFolders)
    .set(data)
    .where(and(eq(qrFolders.id, id), eq(qrFolders.userId, userId)));
}

export async function deleteQrFolder(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // First, set folderId to null for all QR codes in this folder
  await db
    .update(qrCodes)
    .set({ folderId: null })
    .where(and(eq(qrCodes.folderId, id), eq(qrCodes.userId, userId)));
  
  // Then delete the folder
  return await db
    .delete(qrFolders)
    .where(and(eq(qrFolders.id, id), eq(qrFolders.userId, userId)));
}

export async function getQrCodesByFolderId(folderId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(qrCodes)
    .where(and(eq(qrCodes.folderId, folderId), eq(qrCodes.userId, userId)))
    .orderBy(desc(qrCodes.createdAt));
}
