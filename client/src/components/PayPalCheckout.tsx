import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { X, CreditCard, Loader2, Check, Lock, Calendar, Key, Folder, Shield } from "lucide-react";

interface PayPalCheckoutProps {
  planId: number;
  planName: string;
  price: string;
  period: "monthly" | "yearly";
  discount?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PlanDetails {
  maxKeys: number;
  maxFolders: number;
  maxGeneratedKeys: number;
}

export function PayPalCheckout({ 
  planId, 
  planName, 
  price, 
  period, 
  discount,
  onSuccess, 
  onCancel 
}: PayPalCheckoutProps) {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);

  const createOrderMutation = trpc.paypal.createOrder.useMutation();
  const captureOrderMutation = trpc.paypal.captureOrder.useMutation();
  const { data: plans } = trpc.plans.list.useQuery();

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";
  
  // Debug log
  console.log("PayPal Client ID:", paypalClientId ? "Configured" : "Missing");
  console.log("Environment:", import.meta.env.MODE);

  const createOrder = async () => {
    try {
      const result = await createOrderMutation.mutateAsync({ 
        planId, 
        period 
      });
      return result.orderId;
    } catch (error) {
      toast.error(t("checkout.errorCreatingOrder"));
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    setIsProcessing(true);
    try {
      const result = await captureOrderMutation.mutateAsync({ 
        orderId: data.orderID 
      });
      
      if (result.success) {
        // Get plan details for the thank you screen
        const plan = plans?.find((p: any) => p.id === planId);
        if (plan) {
          setPlanDetails({
            maxKeys: plan.maxKeys,
            maxFolders: plan.maxFolders,
            maxGeneratedKeys: plan.maxGeneratedKeys,
          });
        }
        setPaymentComplete(true);
        toast.success(t("checkout.paymentSuccess"));
      } else {
        toast.error(t("checkout.paymentFailed"));
      }
    } catch (error) {
      toast.error(t("checkout.paymentFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err: any) => {
    console.error("PayPal error:", err);
    toast.error(t("checkout.paymentError"));
    setIsProcessing(false);
  };

  // Calculate renewal date
  const getRenewalDate = () => {
    const date = new Date();
    if (period === "yearly") {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date.toLocaleDateString();
  };

  // Thank you screen after successful payment
  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <Card className="w-full max-w-lg p-8 border border-accent/30 bg-card my-8">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2">{t("checkout.thankYou")}</h2>
            <p className="text-muted-foreground">{t("checkout.paymentConfirmed")}</p>
          </div>

          {/* Plan Details */}
          <div className="bg-accent/10 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center">{t("checkout.yourPlan")}</h3>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/20">
              <span className="text-2xl font-bold text-accent">{planName} Plan</span>
              <div className="text-right">
                <span className="text-2xl font-bold">${price}</span>
                <span className="text-sm text-muted-foreground">/{period === "yearly" ? t("pricing.year") : t("pricing.month")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-accent" />
                <span>
                  {planDetails?.maxKeys === -1 ? t("plan.unlimited") : planDetails?.maxKeys} {t("checkout.credentials")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Folder className="w-5 h-5 text-accent" />
                <span>
                  {planDetails?.maxFolders === -1 ? t("plan.unlimited") : planDetails?.maxFolders} {t("checkout.folders")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent" />
                <span>
                  {planDetails?.maxGeneratedKeys === -1 ? t("plan.unlimited") : planDetails?.maxGeneratedKeys} {t("checkout.generatedKeys")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-accent" />
                <span>{t("checkout.renewalDate")}: {getRenewalDate()}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onSuccess} 
            className="w-full h-12 text-lg"
          >
            {t("checkout.goToDashboard")}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {t("checkout.emailConfirmation")}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-md border border-border/20 bg-card my-8 max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="p-6 border-b border-border/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-bold">{t("checkout.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("checkout.secure")}</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Order Summary */}
          <div className="p-6 border-b border-border/20 bg-card/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{t("checkout.orderSummary")}</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{planName} Plan</span>
              <div className="text-right">
                <span className="font-bold text-lg">${price}</span>
                {discount && discount > 0 && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {period === "yearly" ? t("checkout.billedYearly") : t("checkout.billedMonthly")}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">{t("checkout.paymentMethod")}</h3>
            
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
                <p className="text-sm text-muted-foreground">{t("checkout.processing")}</p>
              </div>
            ) : !paypalClientId ? (
              <div className="text-center py-8">
                <p className="text-sm text-destructive mb-2">{t("checkout.paypalNotConfigured")}</p>
                <p className="text-xs text-muted-foreground">Please configure VITE_PAYPAL_CLIENT_ID environment variable</p>
              </div>
            ) : (
              <PayPalScriptProvider 
                options={{ 
                  clientId: paypalClientId,
                  currency: "USD",
                  intent: "capture",
                }}
                deferLoading={false}
              >
                <div className="space-y-3">
                  {/* PayPal Button */}
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      shape: "rect",
                      height: 50,
                    }}
                    fundingSource={FUNDING.PAYPAL}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={() => toast.info(t("checkout.cancelled"))}
                  />
                  
                  {/* Card Button */}
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      color: "black",
                      shape: "rect",
                      height: 50,
                    }}
                    fundingSource={FUNDING.CARD}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={() => toast.info(t("checkout.cancelled"))}
                  />
                </div>
              </PayPalScriptProvider>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border/20">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{t("checkout.securePayment")}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
