/**
 * Router Updates with Plan Limits Validation
 * 
 * These are the changes that need to be applied to server/routers.ts
 * to implement plan limits validation
 */

// Add this import at the top of routers.ts:
import * as planLimits from "./plan-limits-service";

// ============ FOLDERS ============
// Replace the folders.create mutation with this:

/*
create: protectedProcedure
  .input(z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(500).optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    icon: z.string().max(50).optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    // Check plan limits using the service
    const canCreate = await planLimits.canCreateFolder(ctx.user.id);
    if (!canCreate.allowed) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: canCreate.reason,
      });
    }

    const result = await db.createFolder(ctx.user.id, {
      name: input.name,
      description: input.description,
      color: input.color,
      icon: input.icon,
    });

    await db.recordActivity(ctx.user.id, "folder_created", "folder", result?.insertId);

    return { success: true, id: result?.insertId || 0 };
  }),
*/

// ============ CREDENTIALS ============
// Replace the credentials.create mutation with this:

/*
create: protectedProcedure
  .input(z.object({
    platformName: z.string().min(1).max(255),
    username: z.string().min(1).max(255),
    email: z.string().email().optional(),
    password: z.string().min(1),
    folderId: z.number().optional(),
    url: z.string().url().optional(),
    notes: z.string().max(1000).optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    // Check plan limits using the service
    const canCreate = await planLimits.canCreateCredential(ctx.user.id);
    if (!canCreate.allowed) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: canCreate.reason,
      });
    }

    // Get user for encryption
    const user = await db.getUserById(ctx.user.id);
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    // Auto-generate category from platform name
    const category = input.platformName.toLowerCase().replace(/\s+/g, "-");

    // Encrypt password
    const encryptedPassword = crypto.encryptPassword(input.password, String(user.id));

    const result = await db.createCredential(ctx.user.id, {
      platformName: input.platformName,
      category,
      username: input.username,
      email: input.email,
      encryptedPassword,
      folderId: input.folderId,
      url: input.url,
      notes: input.notes,
    });

    await db.recordActivity(ctx.user.id, "credential_created", "credential", undefined, ctx.req.headers["x-forwarded-for"] as string);

    return { success: true, id: result?.insertId || 0 };
  }),
*/

// ============ PASSWORD GENERATOR ============
// Add this new router for password generation with limits:

/*
passwordGenerator: router({
  generate: protectedProcedure
    .input(z.object({
      length: z.number().min(8).max(128).default(16),
      includeUppercase: z.boolean().default(true),
      includeLowercase: z.boolean().default(true),
      includeNumbers: z.boolean().default(true),
      includeSymbols: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check plan limits
      const canGenerate = await planLimits.canGeneratePassword(ctx.user.id);
      if (!canGenerate.allowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: canGenerate.reason,
        });
      }

      // Generate password
      const charset = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
      };

      let chars = '';
      if (input.includeUppercase) chars += charset.uppercase;
      if (input.includeLowercase) chars += charset.lowercase;
      if (input.includeNumbers) chars += charset.numbers;
      if (input.includeSymbols) chars += charset.symbols;

      if (chars.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "At least one character type must be selected",
        });
      }

      let password = '';
      const randomBytes = require('crypto').randomBytes(input.length);
      for (let i = 0; i < input.length; i++) {
        password += chars[randomBytes[i] % chars.length];
      }

      // Increment counter
      await planLimits.incrementGeneratedKeys(ctx.user.id);

      // Get updated usage
      const user = await db.getUserById(ctx.user.id);
      const limits = await planLimits.getUserPlanLimits(ctx.user.id);

      return {
        password,
        usage: {
          used: user?.generatedKeysUsed || 0,
          limit: limits.maxGeneratedKeys,
        },
      };
    }),

  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.getUserById(ctx.user.id);
    const limits = await planLimits.getUserPlanLimits(ctx.user.id);

    return {
      used: user?.generatedKeysUsed || 0,
      limit: limits.maxGeneratedKeys,
    };
  }),
}),
*/

// ============ EXPORT/IMPORT ============
// Add this new router for export/import with limits:

/*
exportImport: router({
  export: protectedProcedure
    .input(z.object({
      format: z.enum(['json', 'csv']),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check plan limits
      const canExport = await planLimits.canExportImport(ctx.user.id);
      if (!canExport.allowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: canExport.reason,
        });
      }

      // Get all credentials
      const credentials = await db.getUserCredentials(ctx.user.id);
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      // Decrypt passwords
      const decryptedCredentials = credentials.map(cred => ({
        platformName: cred.platformName,
        username: cred.username,
        email: cred.email,
        password: crypto.decryptPassword(cred.encryptedPassword, String(user.id)),
        url: cred.url,
        notes: cred.notes,
      }));

      let exportData: string;
      if (input.format === 'json') {
        exportData = JSON.stringify(decryptedCredentials, null, 2);
      } else {
        // CSV format
        const headers = 'Platform,Username,Email,Password,URL,Notes\n';
        const rows = decryptedCredentials.map(cred => 
          `"${cred.platformName}","${cred.username}","${cred.email || ''}","${cred.password}","${cred.url || ''}","${cred.notes || ''}"`
        ).join('\n');
        exportData = headers + rows;
      }

      await db.recordActivity(ctx.user.id, "credentials_exported", "export", undefined);

      return {
        data: exportData,
        filename: `eterbox-export-${new Date().toISOString().split('T')[0]}.${input.format}`,
      };
    }),

  import: protectedProcedure
    .input(z.object({
      format: z.enum(['json', 'csv']),
      data: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check plan limits
      const canImport = await planLimits.canExportImport(ctx.user.id);
      if (!canImport.allowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: canImport.reason,
        });
      }

      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      let credentials: any[] = [];

      try {
        if (input.format === 'json') {
          credentials = JSON.parse(input.data);
        } else {
          // Parse CSV
          const lines = input.data.split('\n');
          const headers = lines[0].split(',');
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, ''));
            if (values.length >= 4) {
              credentials.push({
                platformName: values[0],
                username: values[1],
                email: values[2] || undefined,
                password: values[3],
                url: values[4] || undefined,
                notes: values[5] || undefined,
              });
            }
          }
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid import data format",
        });
      }

      // Check if importing would exceed plan limits
      const currentCount = await db.countUserCredentials(ctx.user.id);
      const limits = await planLimits.getUserPlanLimits(ctx.user.id);
      
      if (limits.maxKeys !== -1 && currentCount + credentials.length > limits.maxKeys) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Importing ${credentials.length} credentials would exceed your plan limit of ${limits.maxKeys}. Upgrade to Basic for unlimited credentials.`,
        });
      }

      // Import credentials
      let imported = 0;
      for (const cred of credentials) {
        try {
          const encryptedPassword = crypto.encryptPassword(cred.password, String(user.id));
          const category = cred.platformName.toLowerCase().replace(/\s+/g, "-");

          await db.createCredential(ctx.user.id, {
            platformName: cred.platformName,
            category,
            username: cred.username,
            email: cred.email,
            encryptedPassword,
            url: cred.url,
            notes: cred.notes,
          });

          imported++;
        } catch (error) {
          console.error(`Failed to import credential for ${cred.platformName}:`, error);
        }
      }

      await db.recordActivity(ctx.user.id, "credentials_imported", "import", undefined);

      return {
        success: true,
        imported,
        total: credentials.length,
      };
    }),
}),
*/

// ============ DEVICE MANAGEMENT ============
// Add this new router for device management:

/*
devices: router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const devices = await db.getUserDevices(ctx.user.id);
    const limits = await planLimits.getUserPlanLimits(ctx.user.id);

    return {
      devices,
      usage: {
        used: devices.length,
        limit: limits.maxDevices,
      },
    };
  }),

  checkLimit: protectedProcedure.mutation(async ({ ctx }) => {
    const canAdd = await planLimits.canAddDevice(ctx.user.id);
    return canAdd;
  }),
}),
*/

// ============ PLAN FEATURES ============
// Add this new router to check plan features:

/*
planFeatures: router({
  check: protectedProcedure.query(async ({ ctx }) => {
    const limits = await planLimits.getUserPlanLimits(ctx.user.id);
    const user = await db.getUserById(ctx.user.id);
    const plan = await db.getPlanById(user!.planId);

    return {
      planId: plan!.id,
      planName: plan!.name,
      limits: {
        maxKeys: limits.maxKeys,
        maxFolders: limits.maxFolders,
        maxGeneratedKeys: limits.maxGeneratedKeys,
        maxDevices: limits.maxDevices,
        maxMembers: limits.maxMembers,
      },
      features: {
        canExportImport: limits.canExportImport,
        canShareCredentials: limits.canShareCredentials,
        canUseAutomaticBackup: limits.canUseAutomaticBackup,
        canUseBiometric: limits.canUseBiometric,
        canViewHistory: limits.canViewHistory,
        canReceiveSecurityAlerts: limits.canReceiveSecurityAlerts,
        hasPrioritySupport: limits.hasPrioritySupport,
        hasSSO: limits.hasSSO,
        hasDedicatedOnboarding: limits.hasDedicatedOnboarding,
      },
    };
  }),
}),
*/

export {};
