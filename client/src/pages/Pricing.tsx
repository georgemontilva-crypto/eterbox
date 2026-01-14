import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Check, Lock, Loader2, X } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PlanContactModal } from "@/components/PlanContactModal";

// Updated plans with new pricing strategy
const PLANS = [
  {
    id: 1,
    name: "Free",
    descriptionKey: "pricing.freeDesc",
    maxKeys: 15,
    maxFolders: 3,
    maxGeneratedKeys: 20,
    price: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    features: [
      { key: "15 credentials", included: true, highlight: true },
      { key: "3 folders", included: true },
      { key: "20 generated passwords/month", included: true },
      { key: "AES-256 Encryption", included: true },
      { key: "Two-Factor Authentication", included: true },
      { key: "Unlimited devices", included: true },
      { key: "Export/Import", included: false },
      { key: "Automatic backup", included: false },
      { key: "Biometric authentication", included: false },
      { key: "Priority support", included: false },
    ]
  },
  {
    id: 2,
    name: "Basic",
    descriptionKey: "pricing.basicDesc",
    maxKeys: -1, // Unlimited
    maxFolders: -1, // Unlimited
    maxGeneratedKeys: -1, // Unlimited
    price: 3.99,
    yearlyPrice: 39.99,
    yearlyDiscount: 17,
    popular: true,
    features: [
      { key: "Unlimited credentials", included: true },
      { key: "Unlimited folders", included: true },
      { key: "Unlimited generated passwords", included: true },
      { key: "AES-256 Encryption", included: true },
      { key: "Two-Factor Authentication", included: true },
      { key: "Unlimited devices", included: true, highlight: true },
      { key: "Export/Import Credentials", included: true, highlight: true },
      { key: "Automatic backup", included: true, highlight: true },
      { key: "Biometric authentication", included: true, highlight: true },
      { key: "Change history", included: true },
      { key: "Security alerts", included: true },
      { key: "Priority support (24h)", included: true },
    ]
  },
  {
    id: 3,
    name: "Corporate",
    descriptionKey: "pricing.corporateDesc",
    maxKeys: -1,
    maxFolders: -1,
    maxGeneratedKeys: -1,
    maxMembers: 5, // NEW: Up to 5 users
    price: 19.99,
    yearlyPrice: 199.99,
    yearlyDiscount: 17,
    features: [
      { key: "Up to 5 users", included: true, highlight: true },
      { key: "Everything in Basic", included: true, highlight: true },
      { key: "Share credentials/folders", included: true, highlight: true },
      { key: "Team admin panel", included: true },
      { key: "Unlimited credentials", included: true },
      { key: "Unlimited folders", included: true },
      { key: "Unlimited devices", included: true },
      { key: "Export/Import", included: true },
      { key: "Automatic backup", included: true },
      { key: "Biometric authentication", included: true },
      { key: "Complete audits and compliance", included: true },
      { key: "24/7 dedicated support", included: true },
    ]
  },
  {
    id: 4,
    name: "Enterprise",
    descriptionKey: "pricing.enterpriseDesc",
    maxKeys: -1,
    maxFolders: -1,
    maxGeneratedKeys: -1,
    maxMembers: 10, // NEW: Up to 10 users included
    price: 49.99,
    yearlyPrice: 499.99,
    yearlyDiscount: 17,
    pricePerAdditionalUser: 4.99,
    features: [
      { key: "Up to 10 users included", included: true, highlight: true },
      { key: "$4.99 per additional user", included: true },
      { key: "Everything in Corporate", included: true, highlight: true },
      { key: "SSO Integration", included: true, highlight: true },
      { key: "Advanced multi-user (unlimited)", included: true },
      { key: "Share credentials/folders", included: true },
      { key: "Team admin panel", included: true },
      { key: "Unlimited credentials", included: true },
      { key: "Unlimited folders", included: true },
      { key: "Unlimited devices", included: true },
      { key: "Export/Import", included: true },
      { key: "Automatic backup", included: true },
      { key: "Biometric authentication", included: true },
      { key: "Complete audits and compliance", included: true },
      { key: "24/7 dedicated support", included: true },
      { key: "Dedicated onboarding", included: true, highlight: true },
    ]
  },
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [user, setUser] = useState<any>(null);

  // Check if user is logged in by checking localStorage token
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setUser({ loggedIn: true });
    }
  }, []);

  const { t } = useLanguage();
  const plans = PLANS;
  const userPlan = null;
  const refetchUserPlan = () => {};
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);



  const isCurrentPlan = (planId: number) => {
    return userPlan?.id === planId;
  };

  const handleSelectPlan = (plan: any) => {
    if (plan.id === 1) {
      toast.info(t("pricing.alreadyFree"));
      return;
    }

    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const getPrice = (plan: any) => {
    if (billingPeriod === "yearly") {
      return plan.yearlyPrice;
    }
    return plan.price;
  };

  const getDiscount = (plan: any) => {
    if (billingPeriod === "yearly") {
      return plan.yearlyDiscount;
    }
    return 0;
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
              Save 17%
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans?.map((plan: any) => {
            const price = getPrice(plan);
            const discount = getDiscount(plan);
            
            return (
              <Card
                key={plan.id}
                className={`p-8 border rounded-[15px] transition-all duration-300 flex flex-col ${
                  plan.popular
                    ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                    : isCurrentPlan(plan.id)
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-border/20 hover:border-accent/50"
                }`}
              >
                {/* Badge */}
                {isCurrentPlan(plan.id) && (
                  <div className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    {t("pricing.currentPlan")}
                  </div>
                )}
                {plan.popular && !isCurrentPlan(plan.id) && (
                  <div className="bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    Most Popular
                  </div>
                )}
                {plan.name === "Corporate" && !isCurrentPlan(plan.id) && !plan.popular && (
                  <div className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    For Small Businesses
                  </div>
                )}
                {plan.name === "Enterprise" && !isCurrentPlan(plan.id) && (
                  <div className="bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    For Large Businesses
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
                          {t("pricing.equivalentTo")} ${(price / 12).toFixed(2)}/{t("pricing.month")}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-accent' : 'text-green-500'}`} />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground/70 line-through'} ${feature.highlight ? 'font-semibold' : ''}`}>
                        {feature.key}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan(plan.id)}
                  className={`w-full ${
                    plan.popular
                      ? "bg-accent hover:bg-accent/90"
                      : isCurrentPlan(plan.id)
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : isCurrentPlan(plan.id) ? "outline" : "outline"}
                >
                  {isCurrentPlan(plan.id) ? (
                    t("pricing.currentPlan")
                  ) : plan.id === 1 ? (
                    t("pricing.getStarted")
                  ) : (
                    t("pricing.subscribeNow")
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Plan Contact Modal */}
        {showCheckout && selectedPlan && (
          <PlanContactModal
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            planName={selectedPlan.name}
            planPrice={billingPeriod === "yearly" 
              ? `$${selectedPlan.yearlyPrice}/year (Save ${selectedPlan.yearlyDiscount}%)`
              : `$${selectedPlan.price}/month`
            }
          />
        )}
      </main>
    </div>
  );
}
