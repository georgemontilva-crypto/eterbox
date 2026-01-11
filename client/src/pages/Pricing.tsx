import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
// import { useAuth } from "@/_core/hooks/useAuth"; // Removed - public page doesn't need auth
import { Check, Lock, Loader2 } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PayPalCheckout } from "@/components/PayPalCheckout";

// Hardcoded plans - no database needed for public view
const PLANS = [
  {
    id: 1,
    name: "Free",
    descriptionKey: "pricing.freeDesc",
    maxKeys: 10,
    maxFolders: 2,
    maxGeneratedKeys: 10,
    price: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
  },
  {
    id: 2,
    name: "Basic",
    descriptionKey: "pricing.basicDesc",
    maxKeys: 100,
    maxFolders: 10,
    maxGeneratedKeys: 300,
    price: 12.99,
    yearlyPrice: 139.08,
    yearlyDiscount: 10,
  },
  {
    id: 3,
    name: "Corporate",
    descriptionKey: "pricing.corporateDesc",
    maxKeys: 1000,
    maxFolders: 100,
    maxGeneratedKeys: -1,
    price: 29,
    yearlyPrice: 319.20,
    yearlyDiscount: 8,
  },
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  // const { user } = useAuth(); // Removed - will check localStorage directly
  const [user, setUser] = useState<any>(null);

  // Check if user is logged in by checking localStorage token
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // User is logged in, we can show their plan
      setUser({ loggedIn: true });
    }
  }, []);
  const { t } = useLanguage();
  // Use hardcoded plans instead of database
  const plans = PLANS;
  // Removed getUserPlan query to prevent auth errors on public page
  const userPlan = null;
  const refetchUserPlan = () => {};
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const captureOrderMutation = trpc.paypal.captureOrder.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(t("pricing.paymentSuccess"));
        refetchUserPlan();
        setLocation("/dashboard?upgraded=true");
      } else {
        toast.error("Payment was not completed");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to process payment");
    },
  });

  // Handle PayPal return (for redirect flow fallback)
  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    const paymentStatus = params.get("payment");

    if (paymentStatus === "cancelled") {
      toast.info(t("pricing.paymentCancelled"));
    } else if (token && !captureOrderMutation.isPending) {
      captureOrderMutation.mutate({ orderId: token });
    }
  }, [search]);

  const handleUpgrade = (plan: any) => {
    if (!user) {
      setLocation("/");
      return;
    }

    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
    refetchUserPlan();
    setLocation("/dashboard?upgraded=true");
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  const isCurrentPlan = (planId: number) => {
    // Always return false since we don't fetch user plan on public page
    return false;
  };

  const getPrice = (plan: any) => {
    if (plan.price === "0" || plan.price === 0) return "0";
    return billingPeriod === "yearly" && plan.yearlyPrice 
      ? plan.yearlyPrice 
      : plan.price;
  };

  const getDiscount = (plan: any) => {
    if (billingPeriod === "yearly" && plan.yearlyDiscount > 0) {
      return plan.yearlyDiscount;
    }
    return 0;
  };

  const getGeneratedKeysLimit = (plan: any) => {
    if (plan.maxGeneratedKeys === -1) return t("plan.unlimited");
    return plan.maxGeneratedKeys;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")} >
            <img src="/logo.png" alt="EterBox Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold">EterBox</h1>
          </div>
          <Button onClick={() => user ? setLocation("/dashboard") : setLocation("/")} variant="ghost">
            {user ? t("menu.dashboard") : t("common.back")}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-16">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">{t("pricing.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("pricing.subtitle")}</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billingPeriod === "monthly"
                ? "bg-accent text-white"
                : "bg-card border border-border/20 text-muted-foreground hover:border-accent/50"
            }`}
          >
            {t("pricing.monthly")}
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              billingPeriod === "yearly"
                ? "bg-accent text-white"
                : "bg-card border border-border/20 text-muted-foreground hover:border-accent/50"
            }`}
          >
            {t("pricing.yearly")}
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
              {t("pricing.saveUp")}
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan: any) => {
            const price = getPrice(plan);
            const discount = getDiscount(plan);
            
            return (
              <Card
                key={plan.id}
                className={`p-8 border rounded-[15px] transition-all duration-300 ${
                  plan.name === "Basic"
                    ? "border-accent bg-accent/5 scale-105"
                    : isCurrentPlan(plan.id)
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-border/20 hover:border-accent/50"
                }`}
              >
                {isCurrentPlan(plan.id) && (
                  <div className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    {t("pricing.currentPlan")}
                  </div>
                )}
                {plan.name === "Basic" && !isCurrentPlan(plan.id) && (
                  <div className="bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    {t("pricing.popular")}
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6 text-sm">{t(plan.descriptionKey)}</p>

                {/* Price */}
                <div className="mb-6">
                  {price === "0" || price === 0 ? (
                    <p className="text-4xl font-bold">{t("pricing.free")}</p>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold">${price}</p>
                        {discount > 0 && (
                          <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        /{billingPeriod === "yearly" ? t("pricing.year") : t("pricing.month")}
                      </p>
                      {billingPeriod === "yearly" && discount > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("pricing.equivalentTo")} ${(Number(price) / 12).toFixed(2)}/{t("pricing.month")}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm">
                      {plan.maxKeys === -1 ? t("plan.unlimited") : plan.maxKeys} {t("pricing.credentials")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm">
                      {plan.maxFolders === -1 ? t("plan.unlimited") : plan.maxFolders} {t("pricing.folders")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm">
                      {getGeneratedKeysLimit(plan)} {t("pricing.generatedKeys")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm">{t("pricing.aesEncryption")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm">{t("pricing.twoFactorAuth")}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={plan.name === "Free" ? "outline" : "default"}
                  onClick={() => {
                    if (plan.name === "Free" || isCurrentPlan(plan.id)) {
                      setLocation("/dashboard");
                    } else {
                      handleUpgrade(plan);
                    }
                  }}
                  disabled={captureOrderMutation.isPending}
                >
                  {captureOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("pricing.processing")}
                    </>
                  ) : isCurrentPlan(plan.id) ? (
                    t("pricing.currentPlan")
                  ) : plan.name === "Free" ? (
                    t("pricing.getStarted")
                  ) : (
                    t("pricing.subscribeNow")
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Payment Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("pricing.securePayment")}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <img 
              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg" 
              alt="PayPal" 
              className="h-8 rounded"
            />
          </div>
        </div>
      </main>

      {/* PayPal Checkout Modal */}
      {showCheckout && selectedPlan && (
        <PayPalCheckout
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          price={getPrice(selectedPlan)}
          period={billingPeriod}
          discount={getDiscount(selectedPlan)}
          onSuccess={handleCheckoutSuccess}
          onCancel={handleCheckoutCancel}
        />
      )}
    </div>
  );
}
