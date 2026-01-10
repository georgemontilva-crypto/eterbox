import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Lock, Shield, Zap, ArrowRight, Check, Globe, Menu } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-border/20 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-accent flex-shrink-0" />
            <span className="text-xl sm:text-2xl font-bold">EterBox</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent/20" : ""}>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("es")} className={language === "es" ? "bg-accent/20" : ""}>
                  🇪🇸 Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" onClick={() => setLocation("/pricing")}>{t("home.nav.pricing")}</Button>
            <Button variant="ghost" onClick={() => setLocation("/support")}>{t("home.nav.support")}</Button>
            <Button onClick={() => window.location.href = getLoginUrl()}>{t("home.nav.signIn")}</Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent/20" : ""}>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("es")} className={language === "es" ? "bg-accent/20" : ""}>
                  🇪🇸 Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setLocation("/pricing")}>
                  {t("home.nav.pricing")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/support")}>
                  {t("home.nav.support")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = getLoginUrl()}>
                  {t("home.nav.signIn")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-12 sm:py-20 md:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            {t("home.hero.title1")}
            <span className="text-accent"> {t("home.hero.title2")}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-4">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button size="lg" onClick={() => window.location.href = getLoginUrl()} className="h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto">
              {t("home.hero.getStarted")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/pricing")} className="h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto">
              {t("home.hero.viewPricing")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 sm:py-20 border-t border-border/20 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-16">{t("home.features.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-8 rounded-[15px] bg-card border border-border/20 hover:border-accent/50 transition-colors">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-accent mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{t("home.features.encryption.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{t("home.features.encryption.desc")}</p>
          </div>
          <div className="p-6 sm:p-8 rounded-[15px] bg-card border border-border/20 hover:border-accent/50 transition-colors">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-accent mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{t("home.features.fast.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{t("home.features.fast.desc")}</p>
          </div>
          <div className="p-6 sm:p-8 rounded-[15px] bg-card border border-border/20 hover:border-accent/50 transition-colors">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-accent mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{t("home.features.2fa.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{t("home.features.2fa.desc")}</p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="container py-12 sm:py-20 border-t border-border/20 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-16">{t("home.plans.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="p-6 sm:p-8 rounded-[15px] border border-border/20 bg-card hover:border-accent/50 transition-all">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Free</h3>
            <div className="mb-4 sm:mb-6">
              <p className="text-3xl sm:text-4xl font-bold">{t("pricing.free")}</p>
            </div>
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm">3 {t("home.plans.credentials")}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm">1 {t("home.plans.folder")}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm">{t("home.plans.encryption")}</span>
              </div>
            </div>
            <Button className="w-full text-sm sm:text-base" variant="outline" onClick={() => window.location.href = getLoginUrl()}>{t("home.plans.getStarted")}</Button>
          </div>

          <div className="p-6 sm:p-8 rounded-[15px] border-accent bg-accent/5 border md:scale-105">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Basic</h3>
            <div className="mb-4 sm:mb-6">
              <p className="text-3xl sm:text-4xl font-bold">$15</p>
              <p className="text-xs sm:text-sm text-muted-foreground">/{t("pricing.month")}</p>
            </div>
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm">25 {t("home.plans.credentials")}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm">5 {t("home.plans.folders")}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm">{t("home.plans.encryption")}</span>
              </div>
            </div>
            <Button className="w-full text-sm sm:text-base" onClick={() => setLocation("/pricing")}>{t("home.plans.subscribeNow")}</Button>
          </div>

          <div className="p-6 sm:p-8 rounded-[15px] border border-border/20 bg-card hover:border-accent/50 transition-all">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Corporate</h3>
            <div className="mb-4 sm:mb-6">
              <p className="text-3xl sm:text-4xl font-bold">$25</p>
              <p className="text-xs sm:text-sm text-muted-foreground">/{t("pricing.month")}</p>
            </div>
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm">2500 {t("home.plans.credentials")}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm">1500 {t("home.plans.folders")}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm">{t("home.plans.encryption")}</span>
              </div>
            </div>
            <Button className="w-full text-sm sm:text-base" variant="outline" onClick={() => setLocation("/pricing")}>{t("home.plans.subscribeNow")}</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 sm:py-20 border-t border-border/20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{t("home.cta.title")}</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">{t("home.cta.subtitle")}</p>
          <Button size="lg" onClick={() => window.location.href = getLoginUrl()} className="h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto">
            {t("home.cta.button")}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-card/50 py-6 sm:py-8 mt-12 sm:mt-20">
        <div className="container text-center text-muted-foreground text-xs sm:text-sm px-4">
          <p>&copy; 2024 EterBox. {t("home.footer.rights")}</p>
        </div>
      </footer>
    </div>
  );
}
