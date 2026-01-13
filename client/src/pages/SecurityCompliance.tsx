import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Eye, Server, FileCheck, Users, AlertTriangle, CheckCircle2, Code, Key } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SecurityCompliance() {
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
            {t("security.backToHome")}
          </Button>
          <h1 className="text-lg font-semibold">{t("security.title")}</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-4xl font-bold mb-4">{t("security.pageTitle")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("security.pageSubtitle")}
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-4 text-center">
            <Lock className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">AES-256</div>
            <div className="text-xs text-muted-foreground">{t("security.encryption")}</div>
          </Card>
          <Card className="p-4 text-center">
            <Key className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">2FA/MFA</div>
            <div className="text-xs text-muted-foreground">{t("security.twoFactor")}</div>
          </Card>
          <Card className="p-4 text-center">
            <Server className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">HTTPS</div>
            <div className="text-xs text-muted-foreground">{t("security.secureConnection")}</div>
          </Card>
          <Card className="p-4 text-center">
            <FileCheck className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">GDPR</div>
            <div className="text-xs text-muted-foreground">{t("security.compliant")}</div>
          </Card>
        </div>

        {/* Security Features */}
        <div className="space-y-8 mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">{t("security.featuresTitle")}</h3>

          {/* End-to-End Encryption */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-3">{t("security.feature1Title")}</h4>
                <p className="text-muted-foreground mb-4">{t("security.feature1Desc1")}</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature1Point1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature1Point2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature1Point3")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature1Point4")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Key className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-3">{t("security.feature2Title")}</h4>
                <p className="text-muted-foreground mb-4">{t("security.feature2Desc1")}</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature2Point1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature2Point2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature2Point3")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Security Monitoring */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-3">{t("security.feature3Title")}</h4>
                <p className="text-muted-foreground mb-4">{t("security.feature3Desc1")}</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature3Point1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature3Point2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature3Point3")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature3Point4")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Infrastructure Security */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Server className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-3">{t("security.feature4Title")}</h4>
                <p className="text-muted-foreground mb-4">{t("security.feature4Desc1")}</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature4Point1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature4Point2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{t("security.feature4Point3")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Compliance Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">{t("security.complianceTitle")}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <FileCheck className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold mb-2">GDPR</h4>
                  <p className="text-sm text-muted-foreground">{t("security.gdprDesc")}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <FileCheck className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold mb-2">CCPA</h4>
                  <p className="text-sm text-muted-foreground">{t("security.ccpaDesc")}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Security FAQ */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">{t("security.faqTitle")}</h3>
          <div className="space-y-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-2">{t("security.faq1Question")}</h4>
              <p className="text-sm text-muted-foreground">{t("security.faq1Answer")}</p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">{t("security.faq2Question")}</h4>
              <p className="text-sm text-muted-foreground">{t("security.faq2Answer")}</p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">{t("security.faq3Question")}</h4>
              <p className="text-sm text-muted-foreground">{t("security.faq3Answer")}</p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">{t("security.faq4Question")}</h4>
              <p className="text-sm text-muted-foreground">{t("security.faq4Answer")}</p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">{t("security.faq5Question")}</h4>
              <p className="text-sm text-muted-foreground">{t("security.faq5Answer")}</p>
            </Card>
          </div>
        </div>

        {/* Responsible Disclosure */}
        <Card className="p-6 border-accent/50 bg-accent/5 mb-12">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-accent flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-3">{t("security.responsibleDisclosureTitle")}</h3>
              <p className="text-muted-foreground mb-4">{t("security.responsibleDisclosureDesc")}</p>
              <Button onClick={() => window.location.href = "mailto:security@eterbox.com"}>
                {t("security.reportVulnerability")}
              </Button>
            </div>
          </div>
        </Card>

        {/* Contact Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">{t("security.contactTitle")}</h3>
          <p className="text-muted-foreground mb-6">{t("security.contactDesc")}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setLocation("/support")}>
              {t("security.contactSupport")}
            </Button>
            <Button variant="outline" onClick={() => setLocation("/privacy")}>
              {t("security.viewPrivacyPolicy")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
