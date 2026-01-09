import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Check, Lock, Loader2 } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: plans = [] } = trpc.plans.list.useQuery();
  const { data: userPlan } = trpc.plans.getUserPlan.useQuery(undefined, {
    enabled: !!user,
  });
  const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);
  
  const createOrderMutation = trpc.paypal.createOrder.useMutation({
    onSuccess: (data) => {
      if (data.approvalUrl) {
        // Open PayPal in the same window for better UX
        window.location.href = data.approvalUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create payment");
      setProcessingPlanId(null);
    },
  });

  const captureOrderMutation = trpc.paypal.captureOrder.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(t("pricing.paymentSuccess"));
        setLocation("/dashboard?upgraded=true");
      } else {
        toast.error("Payment was not completed");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to process payment");
    },
  });

  // Handle PayPal return
  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    const paymentStatus = params.get("payment");

    if (paymentStatus === "cancelled") {
      toast.info(t("pricing.paymentCancelled"));
    } else if (token && !captureOrderMutation.isPending) {
      // Capture the payment
      captureOrderMutation.mutate({ orderId: token });
    }
  }, [search]);

  const handleUpgrade = async (planId: number) => {
    if (!user) {
      setLocation("/");
      return;
    }

    setProcessingPlanId(planId);
    createOrderMutation.mutate({ planId });
  };

  const isCurrentPlan = (planId: number) => {
    return userPlan?.id === planId;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")} >
            <Lock className="w-8 h-8 text-accent" />
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
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t("pricing.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("pricing.subtitle")}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan: any) => (
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
              <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                {plan.price === "0" ? (
                  <p className="text-4xl font-bold">{t("pricing.free")}</p>
                ) : (
                  <>
                    <p className="text-4xl font-bold">${plan.price}</p>
                    <p className="text-sm text-muted-foreground">/{t("pricing.month")}</p>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{plan.maxKeys} {t("pricing.credentials")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{plan.maxFolders} {t("pricing.folders")}</span>
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
                    handleUpgrade(plan.id);
                  }
                }}
                disabled={processingPlanId === plan.id || captureOrderMutation.isPending}
              >
                {processingPlanId === plan.id || captureOrderMutation.isPending ? (
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
          ))}
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

        {/* FAQ Section */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">{t("pricing.faq")}</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">{t("pricing.faq1Title")}</h4>
              <p className="text-muted-foreground text-sm">{t("pricing.faq1Answer")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("pricing.faq2Title")}</h4>
              <p className="text-muted-foreground text-sm">{t("pricing.faq2Answer")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("pricing.faq3Title")}</h4>
              <p className="text-muted-foreground text-sm">{t("pricing.faq3Answer")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("pricing.faq4Title")}</h4>
              <p className="text-muted-foreground text-sm">{t("pricing.faq4Answer")}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
