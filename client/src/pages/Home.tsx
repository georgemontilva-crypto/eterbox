import { Button } from "@/components/ui/button";
import { Lock, Shield, Zap, ArrowRight, Check, Globe, Menu, Sun, Moon, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

export default function Home() {
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setLocation('/dashboard');
    }
  }, [setLocation]);
  
  const subscribeNewsletter = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Successfully subscribed to newsletter!");
      setNewsletterEmail("");
      setIsSubscribing(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe");
      setIsSubscribing(false);
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }
    setIsSubscribing(true);
    subscribeNewsletter.mutate({ email: newsletterEmail });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-border/20 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <img 
              src={theme === "dark" ? "/logo-light.png" : "/logo-dark.png"} 
              alt="EterBox Logo" 
              className="h-10 sm:h-12 w-auto flex-shrink-0" 
            />
            <span className="text-2xl sm:text-3xl font-bold">EterBox</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
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
            <Button variant="ghost" onClick={() => setLocation("/security-compliance")}>{t("home.nav.security")}</Button>
            <Button variant="ghost" onClick={() => setLocation("/support")}>{t("home.nav.support")}</Button>
            <Button variant="ghost" onClick={() => setLocation('/login')}>{t("home.nav.login")}</Button>
            <Button onClick={() => setLocation('/register')}>{t("home.nav.signIn")}</Button>
          </div>

          {/* Mobile Navigation */}
          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 flex flex-col" hideClose={true}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/20">
                  <div className="flex items-center gap-3">
                    <img 
                      src={theme === "dark" ? "/logo-light.png" : "/logo-dark.png"} 
                      alt="EterBox Logo" 
                      className="h-10 w-auto" 
                    />
                    <span className="text-2xl font-bold">EterBox</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-9 w-9 rounded-lg bg-background border border-primary/20 hover:bg-accent"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 p-6">
                  <div className="bg-card/50 backdrop-blur-sm rounded-[20px] border border-border/20 p-2 space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base h-12 rounded-[15px]"
                      onClick={() => {
                        setLocation("/");
                        setMobileMenuOpen(false);
                      }}
                    >
                      {t("home.nav.home") || "Home"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base h-12 rounded-[15px]"
                      onClick={() => {
                        setLocation("/pricing");
                        setMobileMenuOpen(false);
                      }}
                    >
                      {t("home.nav.pricing")}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base h-12 rounded-[15px]"
                      onClick={() => {
                        setLocation("/security-compliance");
                        setMobileMenuOpen(false);
                      }}
                    >
                      {t("home.nav.security")}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base h-12 rounded-[15px]"
                      onClick={() => {
                        setLocation("/support");
                        setMobileMenuOpen(false);
                      }}
                    >
                      {t("home.nav.support")}
                    </Button>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="p-6 space-y-4 border-t border-border/20">
                  {/* Theme Toggle */}
                  <div className="bg-card/50 backdrop-blur-sm rounded-[20px] border border-border/20 p-4 flex items-center justify-between">
                    <span className="text-base font-medium">{t("settings.theme") || "Theme"}</span>
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-muted-foreground" />
                      <Switch 
                        checked={theme === "dark"} 
                        onCheckedChange={toggleTheme}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Moon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="bg-card/50 backdrop-blur-sm rounded-[20px] border border-border/20 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-medium">{t("settings.language") || "Language"}</span>
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={language === "en" ? "default" : "outline"}
                        size="sm"
                        className="flex-1 rounded-[12px]"
                        onClick={() => setLanguage("en")}
                      >
                        🇺🇸 EN
                      </Button>
                      <Button
                        variant={language === "es" ? "default" : "outline"}
                        size="sm"
                        className="flex-1 rounded-[12px]"
                        onClick={() => setLanguage("es")}
                      >
                        🇪🇸 ES
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full h-12 rounded-[15px] text-base"
                      onClick={() => {
                        setLocation("/register");
                        setMobileMenuOpen(false);
                      }}
                    >
                      {t("home.nav.signIn")}
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full h-12 rounded-[15px] text-base"
                      onClick={() => {
                        setLocation("/login");
                        setMobileMenuOpen(false);
                      }}
                    >
                      {t("home.nav.login")}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
            <Button size="lg" onClick={() => setLocation('/register')} className="h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto">
              {t("home.hero.getStarted")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setLocation("/pricing")} 
              className="h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto"
            >
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

      {/* Why Choose EterBox Section */}
      <section className="container py-12 sm:py-20 border-t border-border/20 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-16">{t("home.why.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-[15px] bg-card border border-border/20">
            <h3 className="text-lg sm:text-xl font-bold mb-3">{t("home.why.zeroKnowledge.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{t("home.why.zeroKnowledge.desc")}</p>
          </div>
          <div className="p-6 sm:p-8 rounded-[15px] bg-card border border-border/20">
            <h3 className="text-lg sm:text-xl font-bold mb-3">{t("home.why.crossPlatform.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{t("home.why.crossPlatform.desc")}</p>
          </div>
          <div className="p-6 sm:p-8 rounded-[15px] bg-card border border-border/20">
            <h3 className="text-lg sm:text-xl font-bold mb-3">{t("home.why.biometric.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{t("home.why.biometric.desc")}</p>
          </div>
          <div className="p-6 sm:p-8 rounded-[15px] bg-card border border-border/20">
            <h3 className="text-lg sm:text-xl font-bold mb-3">{t("home.why.autoBackup.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{t("home.why.autoBackup.desc")}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 sm:py-20 border-t border-border/20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{t("home.cta.title")}</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">{t("home.cta.subtitle")}</p>
          <Button size="lg" onClick={() => setLocation('/register')} className="h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto">
            {t("home.cta.button")}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-card/50 py-8 sm:py-12 mt-12 sm:mt-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={theme === "dark" ? "/logo-light.png" : "/logo-dark.png"} 
                  alt="EterBox Logo" 
                  className="h-8 w-auto" 
                />
                <span className="text-xl font-bold">EterBox</span>
              </div>
              <p className="text-sm text-muted-foreground">{t("home.footer.tagline")}</p>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-semibold mb-3">{t("home.footer.product")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => setLocation("/pricing")} className="hover:text-accent transition-colors">{t("home.footer.pricing")}</button></li>
                <li><button onClick={() => setLocation("/register")} className="hover:text-accent transition-colors">{t("home.footer.signUp")}</button></li>
                <li><button onClick={() => setLocation("/login")} className="hover:text-accent transition-colors">{t("home.footer.login")}</button></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold mb-3">{t("home.footer.support")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => setLocation("/support")} className="hover:text-accent transition-colors">{t("home.footer.helpCenter")}</button></li>
                <li><button onClick={() => setLocation("/terms")} className="hover:text-accent transition-colors">{t("home.footer.terms")}</button></li>
                <li><button onClick={() => setLocation("/privacy")} className="hover:text-accent transition-colors">{t("home.footer.privacy")}</button></li>
                <li><button onClick={() => setLocation("/cookies")} className="hover:text-accent transition-colors">{t("home.footer.cookies")}</button></li>
                <li><button onClick={() => setLocation("/refund-policy")} className="hover:text-accent transition-colors">{t("home.footer.refund")}</button></li>
                <li><button onClick={() => setLocation("/security-compliance")} className="hover:text-accent transition-colors">{t("home.footer.security")}</button></li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-3">{t("home.footer.newsletter")}</h4>
              <p className="text-sm text-muted-foreground mb-3">{t("home.footer.newsletterDesc")}</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t("home.footer.emailPlaceholder")} 
                  className="flex-1 px-3 py-2 text-sm rounded-[8px] bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={isSubscribing}
                />
                <Button size="sm" type="submit" disabled={isSubscribing}>
                  {isSubscribing ? "..." : t("home.footer.subscribe")}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-border/20 pt-6 text-center text-muted-foreground text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} EterBox®. {t("home.footer.rights")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
