import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, XCircle, Calendar, CreditCard, AlertTriangle, FileText, Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RefundPolicy() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("refund.backToHome")}
          </Button>
          <h1 className="text-lg font-semibold">{t("refund.title")}</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-4xl font-bold mb-4">{t("refund.pageTitle")}</h2>
          <p className="text-xl text-muted-foreground">
            {t("refund.lastUpdated")}: {t("refund.updateDate")}
          </p>
        </div>

        {/* Important Notice */}
        <Card className="p-6 mb-8 border-red-500/50 bg-red-500/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-500">{t("refund.importantNotice")}</h3>
              <p className="text-muted-foreground mb-2">{t("refund.noRefundPolicy")}</p>
              <p className="text-sm text-muted-foreground">{t("refund.noRefundExplanation")}</p>
            </div>
          </div>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-8">
          {/* Section 1: No Refund Policy */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <XCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3">{t("refund.section1Title")}</h3>
                <p className="text-muted-foreground mb-4">{t("refund.section1Content1")}</p>
                <p className="text-muted-foreground mb-4">{t("refund.section1Content2")}</p>
                <p className="text-muted-foreground">{t("refund.section1Content3")}</p>
              </div>
            </div>
          </Card>

          {/* Section 2: Subscription Service */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Calendar className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3">{t("refund.section2Title")}</h3>
                <p className="text-muted-foreground mb-4">{t("refund.section2Content1")}</p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="list-disc">{t("refund.section2Point1")}</li>
                  <li className="list-disc">{t("refund.section2Point2")}</li>
                  <li className="list-disc">{t("refund.section2Point3")}</li>
                  <li className="list-disc">{t("refund.section2Point4")}</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 3: Billing and Charges */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <CreditCard className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3">{t("refund.section3Title")}</h3>
                <p className="text-muted-foreground mb-4">{t("refund.section3Content1")}</p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="list-disc">{t("refund.section3Point1")}</li>
                  <li className="list-disc">{t("refund.section3Point2")}</li>
                  <li className="list-disc">{t("refund.section3Point3")}</li>
                  <li className="list-disc">{t("refund.section3Point4")}</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 4: Cancellation Policy */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <FileText className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3">{t("refund.section4Title")}</h3>
                <p className="text-muted-foreground mb-4">{t("refund.section4Content1")}</p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="list-disc">{t("refund.section4Point1")}</li>
                  <li className="list-disc">{t("refund.section4Point2")}</li>
                  <li className="list-disc">{t("refund.section4Point3")}</li>
                  <li className="list-disc">{t("refund.section4Point4")}</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 5: Exceptions */}
          <Card className="p-6 border-green-500/50 bg-green-500/5">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3 text-green-500">{t("refund.section5Title")}</h3>
                <p className="text-muted-foreground mb-4">{t("refund.section5Content1")}</p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="list-disc">{t("refund.section5Point1")}</li>
                  <li className="list-disc">{t("refund.section5Point2")}</li>
                  <li className="list-disc">{t("refund.section5Point3")}</li>
                </ul>
                <p className="text-muted-foreground mt-4">{t("refund.section5Content2")}</p>
              </div>
            </div>
          </Card>

          {/* Section 6: Free Plan */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3">{t("refund.section6Title")}</h3>
                <p className="text-muted-foreground mb-4">{t("refund.section6Content1")}</p>
                <p className="text-muted-foreground">{t("refund.section6Content2")}</p>
              </div>
            </div>
          </Card>

          {/* Section 7: Chargebacks */}
          <Card className="p-6 border-red-500/50 bg-red-500/5">
            <div className="flex items-start gap-4 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3 text-red-500">{t("refund.section7Title")}</h3>
                <p className="text-muted-foreground mb-4">{t("refund.section7Content1")}</p>
                <p className="text-muted-foreground mb-4">{t("refund.section7Content2")}</p>
                <ul className="space-y-2 text-muted-foreground ml-6">
                  <li className="list-disc">{t("refund.section7Point1")}</li>
                  <li className="list-disc">{t("refund.section7Point2")}</li>
                  <li className="list-disc">{t("refund.section7Point3")}</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 8: Contact Us */}
          <Card className="p-6 border-accent/50 bg-accent/5">
            <h3 className="text-xl font-semibold mb-3">{t("refund.section8Title")}</h3>
            <p className="text-muted-foreground mb-4">{t("refund.section8Content")}</p>
            <Button onClick={() => setLocation("/support")} className="gap-2">
              {t("refund.contactSupport")}
            </Button>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>{t("refund.footerNote")}</p>
        </div>
      </main>
    </div>
  );
}
