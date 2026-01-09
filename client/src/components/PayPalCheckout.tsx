import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { X, CreditCard, Loader2, Check, Lock } from "lucide-react";

interface PayPalCheckoutProps {
  planId: number;
  planName: string;
  price: string;
  period: "monthly" | "yearly";
  discount?: number;
  onSuccess: () => void;
  onCancel: () => void;
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
  const [sdkReady, setSdkReady] = useState(false);

  const createOrderMutation = trpc.paypal.createOrder.useMutation();
  const captureOrderMutation = trpc.paypal.captureOrder.useMutation();

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

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
        setPaymentComplete(true);
        toast.success(t("checkout.paymentSuccess"));
        setTimeout(() => {
          onSuccess();
        }, 1500);
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

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 border border-accent/30 bg-card text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t("checkout.success")}</h2>
          <p className="text-muted-foreground mb-4">{t("checkout.successDesc")}</p>
          <p className="text-sm text-accent">{t("checkout.redirecting")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-border/20 bg-card overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/20 flex items-center justify-between">
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
              <p className="text-sm text-destructive">{t("checkout.paypalNotConfigured")}</p>
            </div>
          ) : (
            <PayPalScriptProvider 
              options={{ 
                clientId: paypalClientId,
                currency: "USD",
                intent: "capture",
              }}
            >
              <div className="space-y-3">
                {/* Combined PayPal Buttons - shows PayPal and Card options */}
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
                
                {/* Card Button - separate for debit/credit cards */}
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
      </Card>
    </div>
  );
}
