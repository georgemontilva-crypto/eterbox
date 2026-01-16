import { protectedProcedure, router } from "../../_core/trpc";
import { z } from "zod";
import * as qrCodesDb from "../../qr-codes-db";
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
  }),
});
