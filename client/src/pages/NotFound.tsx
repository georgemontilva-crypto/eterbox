import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-lg mx-4">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-accent" />
              <span className="text-3xl font-bold text-foreground">EterBox</span>
            </div>
          </div>

          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse" />
              <AlertCircle className="relative h-20 w-20 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            
            <h2 className="text-2xl font-semibold text-foreground">
              {t("notFound.title") || "Page Not Found"}
            </h2>

            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              {t("notFound.description") || "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted."}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              onClick={handleGoHome}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg rounded-[15px] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              {t("notFound.goHome") || "Go Home"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
