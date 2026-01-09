import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { 
  Receipt, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";

interface PaymentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentHistory({ isOpen, onClose }: PaymentHistoryProps) {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const { data: payments, isLoading } = trpc.payments.getHistory.useQuery(
    { limit: 50 },
    { enabled: isOpen }
  );

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "refunded":
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t("payments.completed");
      case "pending":
        return t("payments.pending");
      case "failed":
        return t("payments.failed");
      case "refunded":
        return t("payments.refunded");
      default:
        return status;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl border border-border/20 bg-card my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{t("payments.history")}</h2>
              <p className="text-sm text-muted-foreground">{t("payments.historyDesc")}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : !payments || payments.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("payments.noPayments")}</h3>
              <p className="text-muted-foreground">{t("payments.noPaymentsDesc")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment: any) => (
                <div 
                  key={payment.id}
                  className="border border-border/20 rounded-xl overflow-hidden bg-card/50"
                >
                  {/* Payment Summary */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => setExpandedId(expandedId === payment.id ? null : payment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-medium">{payment.planName} Plan</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(payment.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg">${payment.amount}</div>
                          <div className="flex items-center gap-1 text-sm">
                            {getStatusIcon(payment.status)}
                            <span className={
                              payment.status === "completed" ? "text-green-500" :
                              payment.status === "pending" ? "text-yellow-500" :
                              payment.status === "failed" ? "text-red-500" :
                              "text-blue-500"
                            }>
                              {getStatusText(payment.status)}
                            </span>
                          </div>
                        </div>
                        {expandedId === payment.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === payment.id && (
                    <div className="px-4 pb-4 border-t border-border/20 pt-4 bg-accent/5">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">{t("payments.transactionId")}</span>
                          <p className="font-mono text-xs mt-1 break-all">
                            {payment.paypalTransactionId || payment.paypalOrderId || "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t("payments.paymentMethod")}</span>
                          <p className="mt-1 capitalize">{payment.paymentMethod}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t("payments.period")}</span>
                          <p className="mt-1">
                            {payment.period === "yearly" ? t("pricing.yearly") : t("pricing.monthly")}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t("payments.currency")}</span>
                          <p className="mt-1">{payment.currency}</p>
                        </div>
                        {payment.payerEmail && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">{t("payments.payerEmail")}</span>
                            <p className="mt-1">{payment.payerEmail}</p>
                          </div>
                        )}
                        {payment.description && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">{t("payments.description")}</span>
                            <p className="mt-1">{payment.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/20 flex-shrink-0">
          <Button onClick={onClose} variant="outline" className="w-full">
            {t("common.close")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
