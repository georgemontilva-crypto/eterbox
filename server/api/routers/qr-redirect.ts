import { publicProcedure, router } from "../../_core/trpc";
import { z } from "zod";
import * as qrCodesDb from "../../qr-codes-db";
import { TRPCError } from "@trpc/server";

export const qrRedirectRouter = router({
  // Get QR code by short code for redirection
  getByShortCode: publicProcedure
    .input(z.object({ shortCode: z.string() }))
    .query(async ({ input }) => {
      const qrCode = await qrCodesDb.getQrCodeByShortCode(input.shortCode);
      
      if (!qrCode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "QR code not found",
        });
      }
      
      // Increment scan count
      await qrCodesDb.incrementQrScansByShortCode(input.shortCode);
      
      return {
        content: qrCode.content,
        type: qrCode.type,
        name: qrCode.name,
      };
    }),
});
