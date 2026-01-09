import { Button } from "@/components/ui/button";
import { AlertTriangle, X, CreditCard } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

interface RenewalBannerProps {
  subscriptionEndDate: Date | string | null;
  planName: string;
}

export function RenewalBanner({ subscriptionEndDate, planName }: RenewalBannerProps) {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [dismissed, setDismissed] = useState(false);

  if (!subscriptionEndDate || dismissed) return null;

  const endDate = new Date(subscriptionEndDate);
  const now = new Date();
  const daysUntilRenewal = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Show banner if renewal is within 7 days or already expired
  if (daysUntilRenewal > 7) return null;

  const isExpired = daysUntilRenewal <= 0;
  const isUrgent = daysUntilRenewal <= 3;

  return (
    <div className={`relative p-4 rounded-[15px] mb-6 ${
      isExpired 
        ? "bg-red-500/10 border border-red-500/30" 
        : isUrgent 
        ? "bg-yellow-500/10 border border-yellow-500/30"
        : "bg-accent/10 border border-accent/30"
    }`}>
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isExpired 
            ? "bg-red-500/20" 
            : isUrgent 
            ? "bg-yellow-500/20"
            : "bg-accent/20"
        }`}>
          <AlertTriangle className={`w-5 h-5 ${
            isExpired 
              ? "text-red-500" 
              : isUrgent 
              ? "text-yellow-500"
              : "text-accent"
          }`} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            {isExpired 
              ? t("renewal.expired") 
              : t("renewal.upcoming")}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {isExpired 
              ? t("renewal.expiredDesc").replace("{plan}", planName)
              : t("renewal.upcomingDesc")
                  .replace("{days}", daysUntilRenewal.toString())
                  .replace("{plan}", planName)
                  .replace("{date}", endDate.toLocaleDateString())}
          </p>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => setLocation("/pricing")}
              className={isExpired || isUrgent ? "bg-accent hover:bg-accent/90" : ""}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {t("renewal.renewNow")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
