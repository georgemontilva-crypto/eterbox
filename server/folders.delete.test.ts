import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  getFolderById: vi.fn(),
  getCredentialsByFolder: vi.fn(),
  deleteCredential: vi.fn(),
  updateCredential: vi.fn(),
  deleteFolder: vi.fn(),
  recordActivity: vi.fn(),
}));

import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("folders.delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete folder and move credentials when deleteCredentials is false", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Mock folder exists
    vi.mocked(db.getFolderById).mockResolvedValue({
      id: 1,
      userId: 1,
      name: "Test Folder",
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mock credentials in folder
    vi.mocked(db.getCredentialsByFolder).mockResolvedValue([
      { id: 1, userId: 1, platformName: "Gmail", folderId: 1 } as any,
      { id: 2, userId: 1, platformName: "GitHub", folderId: 1 } as any,
    ]);

    vi.mocked(db.updateCredential).mockResolvedValue(undefined);
    vi.mocked(db.deleteFolder).mockResolvedValue(undefined);
    vi.mocked(db.recordActivity).mockResolvedValue(undefined);

    const result = await caller.folders.delete({ id: 1, deleteCredentials: false });

    expect(result).toEqual({ success: true, movedCredentials: 2 });
    expect(db.updateCredential).toHaveBeenCalledTimes(2);
    expect(db.updateCredential).toHaveBeenCalledWith(1, 1, { folderId: null });
    expect(db.updateCredential).toHaveBeenCalledWith(2, 1, { folderId: null });
    expect(db.deleteCredential).not.toHaveBeenCalled();
    expect(db.deleteFolder).toHaveBeenCalledWith(1, 1);
  });

  it("should delete folder and credentials when deleteCredentials is true", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getFolderById).mockResolvedValue({
      id: 1,
      userId: 1,
      name: "Test Folder",
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(db.getCredentialsByFolder).mockResolvedValue([
      { id: 1, userId: 1, platformName: "Gmail", folderId: 1 } as any,
      { id: 2, userId: 1, platformName: "GitHub", folderId: 1 } as any,
    ]);

    vi.mocked(db.deleteCredential).mockResolvedValue(undefined);
    vi.mocked(db.deleteFolder).mockResolvedValue(undefined);
    vi.mocked(db.recordActivity).mockResolvedValue(undefined);

    const result = await caller.folders.delete({ id: 1, deleteCredentials: true });

    expect(result).toEqual({ success: true, movedCredentials: 0 });
    expect(db.deleteCredential).toHaveBeenCalledTimes(2);
    expect(db.deleteCredential).toHaveBeenCalledWith(1, 1);
    expect(db.deleteCredential).toHaveBeenCalledWith(2, 1);
    expect(db.updateCredential).not.toHaveBeenCalled();
    expect(db.deleteFolder).toHaveBeenCalledWith(1, 1);
  });

  it("should throw NOT_FOUND when folder does not exist", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getFolderById).mockResolvedValue(undefined);

    await expect(caller.folders.delete({ id: 999, deleteCredentials: false }))
      .rejects.toThrow("NOT_FOUND");
  });
});
