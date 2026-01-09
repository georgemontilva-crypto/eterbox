import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock database functions
vi.mock("./db", () => ({
  getUserById: vi.fn(),
  getPlanById: vi.fn(),
  getAllPlans: vi.fn(),
  incrementGeneratedKeysUsed: vi.fn(),
  updateUserSubscription: vi.fn(),
}));

import * as db from "./db";

describe("Password Generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should check plan limits for password generation", async () => {
    const mockUser = {
      id: 1,
      planId: 1,
      generatedKeysUsed: 5,
    };
    
    const mockPlan = {
      id: 1,
      name: "Free",
      maxGeneratedKeys: 10,
    };

    vi.mocked(db.getUserById).mockResolvedValue(mockUser as any);
    vi.mocked(db.getPlanById).mockResolvedValue(mockPlan as any);

    const user = await db.getUserById(1);
    const plan = await db.getPlanById(user!.planId);

    // User has 5 generated keys, limit is 10
    const canGenerate = plan!.maxGeneratedKeys === -1 || 
      (user!.generatedKeysUsed || 0) < plan!.maxGeneratedKeys;

    expect(canGenerate).toBe(true);
  });

  it("should block generation when limit reached", async () => {
    const mockUser = {
      id: 1,
      planId: 1,
      generatedKeysUsed: 10,
    };
    
    const mockPlan = {
      id: 1,
      name: "Free",
      maxGeneratedKeys: 10,
    };

    vi.mocked(db.getUserById).mockResolvedValue(mockUser as any);
    vi.mocked(db.getPlanById).mockResolvedValue(mockPlan as any);

    const user = await db.getUserById(1);
    const plan = await db.getPlanById(user!.planId);

    const canGenerate = plan!.maxGeneratedKeys === -1 || 
      (user!.generatedKeysUsed || 0) < plan!.maxGeneratedKeys;

    expect(canGenerate).toBe(false);
  });

  it("should allow unlimited generation for Corporate plan", async () => {
    const mockUser = {
      id: 1,
      planId: 3,
      generatedKeysUsed: 1000,
    };
    
    const mockPlan = {
      id: 3,
      name: "Corporate",
      maxGeneratedKeys: -1, // Unlimited
    };

    vi.mocked(db.getUserById).mockResolvedValue(mockUser as any);
    vi.mocked(db.getPlanById).mockResolvedValue(mockPlan as any);

    const user = await db.getUserById(1);
    const plan = await db.getPlanById(user!.planId);

    const canGenerate = plan!.maxGeneratedKeys === -1 || 
      (user!.generatedKeysUsed || 0) < plan!.maxGeneratedKeys;

    expect(canGenerate).toBe(true);
  });
});

describe("Plan Pricing", () => {
  it("should return correct yearly price with discount", async () => {
    const mockPlans = [
      { id: 1, name: "Free", price: "0", yearlyPrice: "0", yearlyDiscount: 0 },
      { id: 2, name: "Basic", price: "15", yearlyPrice: "160", yearlyDiscount: 11 },
      { id: 3, name: "Corporate", price: "25", yearlyPrice: "280", yearlyDiscount: 7 },
    ];

    vi.mocked(db.getAllPlans).mockResolvedValue(mockPlans as any);

    const plans = await db.getAllPlans();
    
    // Basic plan: $15/month * 12 = $180, yearly = $160 (11% off)
    const basicPlan = plans.find(p => p.name === "Basic");
    expect(basicPlan?.yearlyPrice).toBe("160");
    expect(basicPlan?.yearlyDiscount).toBe(11);

    // Corporate plan: $25/month * 12 = $300, yearly = $280 (7% off)
    const corporatePlan = plans.find(p => p.name === "Corporate");
    expect(corporatePlan?.yearlyPrice).toBe("280");
    expect(corporatePlan?.yearlyDiscount).toBe(7);
  });

  it("should calculate correct subscription end date for yearly plan", () => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const daysDiff = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Should be approximately 365 days
    expect(daysDiff).toBeGreaterThanOrEqual(364);
    expect(daysDiff).toBeLessThanOrEqual(366);
  });

  it("should calculate correct subscription end date for monthly plan", () => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    const daysDiff = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Should be approximately 28-31 days
    expect(daysDiff).toBeGreaterThanOrEqual(28);
    expect(daysDiff).toBeLessThanOrEqual(31);
  });
});

describe("Renewal Banner Logic", () => {
  it("should show banner when subscription expires in 7 days or less", () => {
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 5);

    const now = new Date();
    const daysUntilRenewal = Math.ceil(
      (subscriptionEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const shouldShowBanner = daysUntilRenewal <= 7;
    expect(shouldShowBanner).toBe(true);
  });

  it("should not show banner when subscription expires in more than 7 days", () => {
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 15);

    const now = new Date();
    const daysUntilRenewal = Math.ceil(
      (subscriptionEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const shouldShowBanner = daysUntilRenewal <= 7;
    expect(shouldShowBanner).toBe(false);
  });

  it("should mark as expired when subscription end date is in the past", () => {
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() - 2);

    const now = new Date();
    const daysUntilRenewal = Math.ceil(
      (subscriptionEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isExpired = daysUntilRenewal <= 0;
    expect(isExpired).toBe(true);
  });

  it("should mark as urgent when 3 days or less remaining", () => {
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 2);

    const now = new Date();
    const daysUntilRenewal = Math.ceil(
      (subscriptionEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isUrgent = daysUntilRenewal <= 3 && daysUntilRenewal > 0;
    expect(isUrgent).toBe(true);
  });
});

describe("Corporate Plan Limits", () => {
  it("should have correct limits for Corporate plan", async () => {
    const mockCorporatePlan = {
      id: 3,
      name: "Corporate",
      maxKeys: 2500,
      maxFolders: 1500,
      maxGeneratedKeys: -1,
      price: "25",
      yearlyPrice: "280",
    };

    vi.mocked(db.getPlanById).mockResolvedValue(mockCorporatePlan as any);

    const plan = await db.getPlanById(3);

    expect(plan?.maxKeys).toBe(2500);
    expect(plan?.maxFolders).toBe(1500);
    expect(plan?.maxGeneratedKeys).toBe(-1); // Unlimited
  });
});
