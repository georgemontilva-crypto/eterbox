import { protectedProcedure, router } from "../../_core/trpc";
import { z } from "zod";
import * as qrCodesDb from "../../qr-codes-db";
import * as qrFolderSharesDb from "../../qr-folder-shares-db";
import * as db from "../../db";
import { TRPCError } from "@trpc/server";

export const qrCodesRouter = router({
  // Get all QR codes for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const qrCodes = await qrCodesDb.getQrCodesByUserId(userId);
    return qrCodes;
  }),

  // Get QR codes by folder
  listByFolder: protectedProcedure
    .input(z.object({ folderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const qrCodes = await qrCodesDb.getQrCodesByFolderId(input.folderId, userId);
      return qrCodes;
    }),

  // Get a single QR code
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const qrCode = await qrCodesDb.getQrCodeById(input.id, userId);
      
      if (!qrCode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "QR code not found",
        });
      }
      
      return qrCode;
    }),

  // Create a new QR code
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        content: z.string().min(1),
        type: z.string().default("url"),
        folderId: z.number().nullable().optional(),
        description: z.string().optional(),
        qrImage: z.string(), // Base64 encoded image
        shortCode: z.string().optional(),
        isDynamic: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // TODO: Check plan limits here
      
      const result = await qrCodesDb.createQrCode({
        userId,
        name: input.name,
        content: input.content,
        type: input.type,
        folderId: input.folderId || null,
        description: input.description || null,
        qrImage: input.qrImage,
        shortCode: input.shortCode || null,
        isDynamic: input.isDynamic,
        scans: 0,
      });
      
      return { success: true, id: result.insertId };
    }),

  // Update a QR code
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        type: z.string().optional(),
        folderId: z.number().nullable().optional(),
        description: z.string().optional(),
        qrImage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { id, ...updateData } = input;
      
      // Verify ownership
      const existing = await qrCodesDb.getQrCodeById(id, userId);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "QR code not found",
        });
      }
      
      await qrCodesDb.updateQrCode(id, userId, updateData);
      return { success: true };
    }),

  // Delete a QR code
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Verify ownership
      const existing = await qrCodesDb.getQrCodeById(input.id, userId);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "QR code not found",
        });
      }
      
      await qrCodesDb.deleteQrCode(input.id, userId);
      return { success: true };
    }),

  // Increment scan count
  incrementScans: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await qrCodesDb.incrementQrScans(input.id, userId);
      return { success: true };
    }),

  // ============ QR FOLDERS ============
  
  folders: router({
    // Get all folders
    list: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.user.id;
      const folders = await qrCodesDb.getQrFoldersByUserId(userId);
      return folders;
    }),

    // Create a folder
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          parentFolderId: z.number().nullable().optional(),
          color: z.string().optional(),
          icon: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        
        // TODO: Check plan limits here
        
        const result = await qrCodesDb.createQrFolder({
          userId,
          name: input.name,
          description: input.description || null,
          parentFolderId: input.parentFolderId || null,
          color: input.color || "#3B82F6",
          icon: input.icon || null,
        });
        
        return { success: true, id: result.insertId };
      }),

    // Update a folder
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          description: z.string().optional(),
          parentFolderId: z.number().nullable().optional(),
          color: z.string().optional(),
          icon: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        const { id, ...updateData } = input;
        
        // Verify ownership
        const existing = await qrCodesDb.getQrFolderById(id, userId);
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Folder not found",
          });
        }
        
        await qrCodesDb.updateQrFolder(id, userId, updateData);
        return { success: true };
      }),

    // Delete a folder
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        
        // Verify ownership
        const existing = await qrCodesDb.getQrFolderById(input.id, userId);
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Folder not found",
          });
        }
        
        await qrCodesDb.deleteQrFolder(input.id, userId);
        return { success: true };
      }),

    // Share a QR folder with another user
    share: protectedProcedure
      .input(z.object({
        folderId: z.number(),
        userEmail: z.string().email(),
        permission: z.enum(['read', 'edit']).default('edit'),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user has Corporate or Enterprise plan
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

        const plan = await db.getPlanById(user.planId);
        if (!plan) throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found" });

        if (plan.name !== "Corporate" && plan.name !== "Enterprise") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "QR folder sharing is only available for Corporate and Enterprise plans",
          });
        }

        // Check if folder belongs to user
        const folder = await qrCodesDb.getQrFolderById(input.folderId, ctx.user.id);
        if (!folder) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
        }

        // Find user to share with by email
        const sharedWithUser = await db.getUserByEmail(input.userEmail);
        if (!sharedWithUser) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User with this email not found" });
        }

        // Check if user is trying to share with themselves
        if (sharedWithUser.id === ctx.user.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot share a folder with yourself" });
        }

        // Check if already shared
        const alreadyShared = await qrFolderSharesDb.isQrFolderSharedWithUser(input.folderId, sharedWithUser.id);
        if (alreadyShared) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Folder is already shared with this user" });
        }

        // Create share
        const result = await qrFolderSharesDb.createQrFolderShare(
          input.folderId,
          ctx.user.id,
          sharedWithUser.id,
          input.permission
        );

        return {
          success: true,
          message: "QR folder shared successfully",
          shareId: result?.insertId || 0,
        };
      }),

    // Unshare a QR folder
    unshare: protectedProcedure
      .input(z.object({
        folderId: z.number(),
        sharedWithUserId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify ownership
        const folder = await qrCodesDb.getQrFolderById(input.folderId, ctx.user.id);
        if (!folder) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
        }

        const result = await qrFolderSharesDb.deleteQrFolderShareByUserAndFolder(
          input.folderId,
          ctx.user.id,
          input.sharedWithUserId
        );

        if (!result) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to unshare folder" });
        }

        return { success: true, message: "Folder unshared successfully" };
      }),

    // Get shares for a folder
    getShares: protectedProcedure
      .input(z.object({ folderId: z.number() }))
      .query(async ({ ctx, input }) => {
        // Verify ownership
        const folder = await qrCodesDb.getQrFolderById(input.folderId, ctx.user.id);
        if (!folder) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
        }

        const shares = await qrFolderSharesDb.getQrFolderShares(input.folderId, ctx.user.id);
        return shares;
      }),

    // Get folders shared with me
    getSharedWithMe: protectedProcedure.query(async ({ ctx }) => {
      const sharedFolders = await qrFolderSharesDb.getQrFoldersSharedWithUser(ctx.user.id);
      return sharedFolders;
    }),
  }),
});
