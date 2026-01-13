/**
 * Plan Limits Service
 * Centralized service for validating plan limits and features
 */

import * as db from "./db";
import { TRPCError } from "@trpc/server";

export interface PlanLimits {
  maxKeys: number; // -1 = unlimited
  maxFolders: number; // -1 = unlimited
  maxGeneratedKeys: number; // -1 = unlimited
  maxDevices: number; // -1 = unlimited
  maxMembers: number; // -1 = unlimited
  canExportImport: boolean;
  canShareCredentials: boolean;
  canUseAutomaticBackup: boolean;
  canUseBiometric: boolean;
  canViewHistory: boolean;
  canReceiveSecurityAlerts: boolean;
  hasPrioritySupport: boolean;
  hasSSO: boolean;
  hasDedicatedOnboarding: boolean;
}

/**
 * Get plan limits based on plan ID
 */
export function getPlanLimits(planId: number): PlanLimits {
  switch (planId) {
    case 1: // Free
      return {
        maxKeys: 25,
        maxFolders: 3,
        maxGeneratedKeys: 20, // per month
        maxDevices: 1, // KEY LIMITATION
        maxMembers: 1,
        canExportImport: false, // KEY LIMITATION
        canShareCredentials: false,
        canUseAutomaticBackup: false, // KEY LIMITATION
        canUseBiometric: false, // KEY LIMITATION
        canViewHistory: false,
        canReceiveSecurityAlerts: false,
        hasPrioritySupport: false,
        hasSSO: false,
        hasDedicatedOnboarding: false,
      };

    case 2: // Basic
      return {
        maxKeys: -1, // unlimited
        maxFolders: -1, // unlimited
        maxGeneratedKeys: -1, // unlimited
        maxDevices: -1, // unlimited
        maxMembers: 1,
        canExportImport: true,
        canShareCredentials: false,
        canUseAutomaticBackup: true,
        canUseBiometric: true,
        canViewHistory: true,
        canReceiveSecurityAlerts: true,
        hasPrioritySupport: true,
        hasSSO: false,
        hasDedicatedOnboarding: false,
      };

    case 3: // Corporate
      return {
        maxKeys: -1, // unlimited
        maxFolders: -1, // unlimited
        maxGeneratedKeys: -1, // unlimited
        maxDevices: -1, // unlimited
        maxMembers: 5, // up to 5 users
        canExportImport: true,
        canShareCredentials: true, // KEY FEATURE
        canUseAutomaticBackup: true,
        canUseBiometric: true,
        canViewHistory: true,
        canReceiveSecurityAlerts: true,
        hasPrioritySupport: true,
        hasSSO: false,
        hasDedicatedOnboarding: false,
      };

    case 4: // Enterprise
      return {
        maxKeys: -1, // unlimited
        maxFolders: -1, // unlimited
        maxGeneratedKeys: -1, // unlimited
        maxDevices: -1, // unlimited
        maxMembers: 10, // up to 10 users included (+ $4.99 per additional)
        canExportImport: true,
        canShareCredentials: true,
        canUseAutomaticBackup: true,
        canUseBiometric: true,
        canViewHistory: true,
        canReceiveSecurityAlerts: true,
        hasPrioritySupport: true,
        hasSSO: true, // KEY FEATURE
        hasDedicatedOnboarding: true, // KEY FEATURE
      };

    default:
      // Default to Free plan limits
      return getPlanLimits(1);
  }
}

/**
 * Check if user can create a new credential
 */
export async function canCreateCredential(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const user = await db.getUserById(userId);
  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const plan = await db.getPlanById(user.planId);
  if (!plan) {
    return { allowed: false, reason: "Plan not found" };
  }

  const limits = getPlanLimits(plan.id);

  // Check if unlimited
  if (limits.maxKeys === -1) {
    return { allowed: true };
  }

  // Check current usage
  const keysCount = await db.countUserCredentials(userId);
  if (keysCount >= limits.maxKeys) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of credentials (${limits.maxKeys}) for your plan. Upgrade to Basic for unlimited credentials.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can create a new folder
 */
export async function canCreateFolder(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const user = await db.getUserById(userId);
  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const plan = await db.getPlanById(user.planId);
  if (!plan) {
    return { allowed: false, reason: "Plan not found" };
  }

  const limits = getPlanLimits(plan.id);

  // Check if unlimited
  if (limits.maxFolders === -1) {
    return { allowed: true };
  }

  // Check current usage
  const folders = await db.getUserFolders(userId);
  if (folders.length >= limits.maxFolders) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of folders (${limits.maxFolders}) for your plan. Upgrade to Basic for unlimited folders.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can generate a new password
 */
export async function canGeneratePassword(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const user = await db.getUserById(userId);
  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const plan = await db.getPlanById(user.planId);
  if (!plan) {
    return { allowed: false, reason: "Plan not found" };
  }

  const limits = getPlanLimits(plan.id);

  // Check if unlimited
  if (limits.maxGeneratedKeys === -1) {
    return { allowed: true };
  }

  // Check current usage (monthly limit)
  const generatedKeysUsed = user.generatedKeysUsed || 0;
  if (generatedKeysUsed >= limits.maxGeneratedKeys) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of generated passwords (${limits.maxGeneratedKeys}/month) for your plan. Upgrade to Basic for unlimited password generation.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can add a new device
 */
export async function canAddDevice(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const user = await db.getUserById(userId);
  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const plan = await db.getPlanById(user.planId);
  if (!plan) {
    return { allowed: false, reason: "Plan not found" };
  }

  const limits = getPlanLimits(plan.id);

  // Check if unlimited
  if (limits.maxDevices === -1) {
    return { allowed: true };
  }

  // Check current device count
  const devices = await db.getUserDevices(userId);
  if (devices.length >= limits.maxDevices) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of devices (${limits.maxDevices}) for your plan. Upgrade to Basic ($3.99/month) to use EterBox on unlimited devices.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can export/import credentials
 */
export async function canExportImport(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const user = await db.getUserById(userId);
  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const plan = await db.getPlanById(user.planId);
  if (!plan) {
    return { allowed: false, reason: "Plan not found" };
  }

  const limits = getPlanLimits(plan.id);

  if (!limits.canExportImport) {
    return {
      allowed: false,
      reason: "Export/Import is only available for Basic plan and above. Upgrade to Basic ($3.99/month) to import your passwords from other password managers.",
    };
  }

  return { allowed: true };
}

/**
 * Check if user can share credentials
 */
export async function canShareCredentials(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const user = await db.getUserById(userId);
  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const plan = await db.getPlanById(user.planId);
  if (!plan) {
    return { allowed: false, reason: "Plan not found" };
  }

  const limits = getPlanLimits(plan.id);

  if (!limits.canShareCredentials) {
    return {
      allowed: false,
      reason: "Sharing credentials is only available for Corporate plan and above. Upgrade to Corporate ($19.99/month) to share credentials with your team or family.",
    };
  }

  return { allowed: true };
}

/**
 * Check if user can use automatic backup
 */
export async function canUseAutomaticBackup(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const user = await db.getUserById(userId);
  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const plan = await db.getPlanById(user.planId);
  if (!plan) {
    return { allowed: false, reason: "Plan not found" };
  }

  const limits = getPlanLimits(plan.id);

  if (!limits.canUseAutomaticBackup) {
    return {
      allowed: false,
      reason: "Automatic backup is only available for Basic plan and above. Upgrade to Basic ($3.99/month) to protect your data with automatic backups.",
    };
  }

  return { allowed: true };
}

/**
 * Check if user can use biometric authentication
 */
export async function canUseBiometric(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const user = await db.getUserById(userId);
  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const plan = await db.getPlanById(user.planId);
  if (!plan) {
    return { allowed: false, reason: "Plan not found" };
  }

  const limits = getPlanLimits(plan.id);

  if (!limits.canUseBiometric) {
    return {
      allowed: false,
      reason: "Biometric authentication is only available for Basic plan and above. Upgrade to Basic ($3.99/month) for Face ID, Touch ID, and Windows Hello support.",
    };
  }

  return { allowed: true };
}

/**
 * Increment generated keys counter
 */
export async function incrementGeneratedKeys(userId: number): Promise<void> {
  const user = await db.getUserById(userId);
  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  await db.incrementUserGeneratedKeys(userId);
}

/**
 * Reset monthly generated keys counter (called by cron job)
 */
export async function resetMonthlyGeneratedKeys(): Promise<void> {
  await db.resetAllUsersGeneratedKeys();
}

/**
 * Get user's plan limits
 */
export async function getUserPlanLimits(userId: number): Promise<PlanLimits> {
  const user = await db.getUserById(userId);
  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  return getPlanLimits(user.planId);
}
