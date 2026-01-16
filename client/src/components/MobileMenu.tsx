import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Menu, Shield, Key, LogOut, CreditCard, Settings, Lock, ChevronRight, ArrowLeft, Home, Globe, Check, Copy, Loader2, Wand2, RefreshCw, Plus, Receipt, UserCog, Bell, Users, Moon, Sun, QrCode, Barcode } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { detectPlatform, getBiometricTypeName, type Platform } from "@/lib/platform";
import { NotificationSettings } from "./NotificationSettings";

// Inline Payment History Component
function PaymentHistoryInline() {
  const { t } = useLanguage();
  const { data: payments, isLoading } = trpc.payments.getHistory.useQuery({ limit: 50 });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <span className="w-4 h-4 text-red-500">✗</span>;
      case "refunded":
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <Loader2 className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{t("payments.noPayments")}</h3>
        <p className="text-sm text-muted-foreground">{t("payments.noPaymentsDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment: any) => (
        <div 
          key={payment.id}
          className="p-4 border border-border/20 rounded-[15px] bg-card/50"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{payment.planName} Plan</span>
            <span className="font-bold">${payment.amount}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatDate(payment.createdAt)}</span>
            <div className="flex items-center gap-1">
              {getStatusIcon(payment.status)}
              <span className={
                payment.status === "completed" ? "text-green-500" :
                payment.status === "pending" ? "text-yellow-500" :
                payment.status === "failed" ? "text-red-500" :
                "text-blue-500"
              }>
                {payment.status === "completed" ? t("payments.completed") :
                 payment.status === "pending" ? t("payments.pending") :
                 payment.status === "failed" ? t("payments.failed") :
                 t("payments.refunded")}
              </span>
            </div>
          </div>
          {payment.paypalTransactionId && (
            <div className="mt-2 pt-2 border-t border-border/20">
              <p className="text-xs text-muted-foreground truncate">
                ID: {payment.paypalTransactionId}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Inline Password Generator Component
interface PasswordGeneratorInlineProps {
  onAddCredential?: (password: string) => void;
}

function PasswordGeneratorInline({ onAddCredential }: PasswordGeneratorInlineProps) {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const { data: usage } = trpc.passwordGenerator.getUsage.useQuery();
  const generateMutation = trpc.passwordGenerator.generate.useMutation({
    onSuccess: (data) => setPassword(data.password),
    onError: (error) => toast.error(error.message),
  });

  const handleGenerate = () => {
    generateMutation.mutate({ length, includeUppercase, includeLowercase, includeNumbers, includeSymbols });
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success(t("generator.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCredential = () => {
    if (password && onAddCredential) {
      onAddCredential(password);
    }
  };

  const canGenerate = usage?.unlimited || (usage?.used || 0) < (usage?.max || 0);
  const usageText = usage?.unlimited ? t("generator.unlimited") : `${usage?.used || 0}/${usage?.max || 0}`;

  return (
    <div className="space-y-4">
      <div className="text-sm text-center text-muted-foreground">
        {t("generator.usage")}: {usageText}
      </div>

      {password && (
        <div className="p-3 bg-card/50 border border-border/20 rounded-[15px]">
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono break-all select-all">{password}</code>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-muted-foreground">{t("generator.length")}</label>
          <span className="text-sm font-medium">{length}</span>
        </div>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-border/30 rounded-lg appearance-none cursor-pointer accent-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className="w-4 h-4 accent-accent" />
          <span className="text-sm">{t("generator.uppercase")}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeLowercase} onChange={(e) => setIncludeLowercase(e.target.checked)} className="w-4 h-4 accent-accent" />
          <span className="text-sm">{t("generator.lowercase")}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="w-4 h-4 accent-accent" />
          <span className="text-sm">{t("generator.numbers")}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="w-4 h-4 accent-accent" />
          <span className="text-sm">{t("generator.symbols")}</span>
        </label>
      </div>

      <Button className="w-full h-14 rounded-[15px]" onClick={handleGenerate} disabled={generateMutation.isPending || !canGenerate}>
        {generateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
        {t("generator.generate")}
      </Button>

      {password && onAddCredential && (
        <Button 
          variant="outline" 
          className="w-full h-12 rounded-[15px] border-accent/50 text-accent hover:bg-accent/10" 
          onClick={handleAddCredential}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("generator.addAsCredential")}
        </Button>
      )}

      {!canGenerate && (
        <p className="text-sm text-destructive text-center">{t("generator.limitReached")}</p>
      )}
    </div>
  );
}

interface MobileMenuProps {
  planName: string;
  onLogout: () => void;
  twoFactorEnabled?: boolean;
  onAddCredentialWithPassword?: (password: string) => void;
  userEmail?: string;
}

type ActiveView = "menu" | "2fa" | "biometric" | "password" | "plan" | "settings" | "notifications" | "language" | "theme" | "generator" | "payments" | "security" | "documentation" | null;

export function MobileMenu({ planName, onLogout, twoFactorEnabled = false, onAddCredentialWithPassword, userEmail }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [viewHistory, setViewHistory] = useState<ActiveView[]>([]);
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [platform] = useState<Platform>(detectPlatform());
  const biometricName = getBiometricTypeName(platform);
  
  // Check if user is admin
  const { data: adminCheck } = trpc.admin.isAdmin.useQuery();
  
  // 2FA states
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [setupBackupCodes, setSetupBackupCodes] = useState<string[] | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(twoFactorEnabled);
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password change mutation
  const changePasswordMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast.success(t("password.success") || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveView(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // tRPC mutations
  const setup2FA = trpc.twoFactor.setup.useMutation({
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setSetupBackupCodes(data.backupCodes);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verify2FA = trpc.twoFactor.verify.useMutation({
    onSuccess: () => {
      setBackupCodes(setupBackupCodes);
      setIs2FAEnabled(true);
      toast.success(t("twoFactor.enabled"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const disable2FA = trpc.twoFactor.disable.useMutation({
    onSuccess: () => {
      setIs2FAEnabled(false);
      setQrCode(null);
      setSecret(null);
      setBackupCodes(null);
      setSetupBackupCodes(null);
      toast.success(t("twoFactor.disabled"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Biometric hooks (must be called unconditionally)
  const utils = trpc.useUtils();
  const { data: biometricStatus } = trpc.webauthn.checkBiometricStatus.useQuery();
  const disableBiometric = trpc.webauthn.disableBiometric.useMutation({
    onSuccess: () => {
      toast.success(t("biometric.disabled") || "Biometric authentication disabled");
      utils.webauthn.checkBiometricStatus.invalidate();
      setActiveView(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to disable biometric");
    },
  });

  const menuItems = [
    {
      id: "settings" as ActiveView,
      icon: Settings,
      label: t("menu.settings"),
      description: t("menu.settingsDesc"),
    },
    {
      id: "documentation" as ActiveView,
      icon: Shield,
      label: t("menu.documentation"),
      description: t("menu.documentationDesc"),
    },
  ];

  const handleOpenMenu = () => {
    setActiveView(null);
    setOpen(true);
  };

  const handleSelectOption = (viewId: ActiveView) => {
    // Add current view to history before changing
    if (activeView !== null) {
      setViewHistory(prev => [...prev, activeView]);
    }
    setActiveView(viewId);
  };

  const handleBack = () => {
    // If there's history, go back to previous view
    if (viewHistory.length > 0) {
      const previousView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setActiveView(previousView);
    } else {
      // No history, go back to main menu
      setActiveView(null);
    }
    
    // Reset 2FA states when going back to main menu
    if (viewHistory.length === 0 && !is2FAEnabled) {
      setQrCode(null);
      setSecret(null);
      setVerificationCode("");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setActiveView(null);
    setViewHistory([]);
  };

  const handleGoToDashboard = () => {
    setOpen(false);
    setActiveView(null);
    setLocation("/dashboard");
  };

  const handleGoToPricing = () => {
    setOpen(false);
    setActiveView(null);
    setLocation("/pricing");
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t("password.fillAll") || "Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error(t("password.minLength") || "New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("password.noMatch") || "New passwords do not match");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  const handleSetup2FA = () => {
    setup2FA.mutate();
  };

  const handleVerify2FA = () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    if (!secret || !setupBackupCodes) {
      toast.error("Please setup 2FA first");
      return;
    }
    verify2FA.mutate({ secret, token: verificationCode, backupCodes: setupBackupCodes });
  };

  const handleDisable2FA = () => {
    disable2FA.mutate();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Render content based on active view
  const renderContent = () => {
    if (activeView === "language") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">{t("common.language")}</h2>
            <p className="text-sm text-muted-foreground">Select your preferred language</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setLanguage("en")}
              className={`w-full flex items-center justify-between p-4 rounded-[15px] border transition-colors ${
                language === "en" 
                  ? "bg-accent/20 border-accent" 
                  : "bg-card border-border/20 hover:border-accent/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇺🇸</span>
                <span className="font-medium">English</span>
              </div>
              {language === "en" && <Check className="w-5 h-5 text-accent" />}
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`w-full flex items-center justify-between p-4 rounded-[15px] border transition-colors ${
                language === "es" 
                  ? "bg-accent/20 border-accent" 
                  : "bg-card border-border/20 hover:border-accent/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇪🇸</span>
                <span className="font-medium">Español</span>
              </div>
              {language === "es" && <Check className="w-5 h-5 text-accent" />}
            </button>
          </div>
        </div>
      );
    }

    if (activeView === "security") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">{t("menu.security")}</h2>
            <p className="text-sm text-muted-foreground">Manage your security settings</p>
          </div>
          <div className="space-y-3">
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("2fa")}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span>{t("menu.twoFactor")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("biometric")}
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span>{t("biometric.title")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      );
    }

    if (activeView === "2fa") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">{t("twoFactor.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("twoFactor.subtitle")}</p>
          </div>

          {is2FAEnabled && backupCodes ? (
            // Show backup codes after enabling
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-[15px] p-4 text-center">
                <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-green-400">{t("twoFactor.enabled")}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("twoFactor.backupCodes")}</p>
                <p className="text-xs text-muted-foreground">{t("twoFactor.backupCodesDesc")}</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {backupCodes.map((code, i) => (
                    <div key={i} className="bg-card border border-border/20 rounded-lg p-2 text-center font-mono text-sm">
                      {code}
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => copyToClipboard(backupCodes.join("\n"))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Codes
                </Button>
              </div>
            </div>
          ) : is2FAEnabled ? (
            // 2FA is enabled, show disable option
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-[15px] p-4 text-center">
                <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-green-400">{t("twoFactor.enabled")}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">{t("twoFactor.enterCode")}</label>
                <input 
                  type="text" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full h-12 px-4 mt-1 bg-card border border-border/20 rounded-[15px] focus:border-accent focus:outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <Button 
                className="w-full h-14 rounded-[15px] bg-red-500 hover:bg-red-600"
                onClick={handleDisable2FA}
                disabled={disable2FA.isPending}
              >
                {disable2FA.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {t("twoFactor.disable")}
              </Button>
            </div>
          ) : qrCode ? (
            // Show QR code and verification
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-[15px] mx-auto w-fit">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-center text-muted-foreground">{t("twoFactor.scanQR")}</p>
              {secret && (
                <div className="bg-card border border-border/20 rounded-[15px] p-3 overflow-hidden">
                  <p className="text-xs text-muted-foreground mb-1">Manual entry code:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono break-all flex-1 select-all">{secret}</code>
                    <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => copyToClipboard(secret)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground">{t("twoFactor.enterCode")}</label>
                <input 
                  type="text" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full h-12 px-4 mt-1 bg-card border border-border/20 rounded-[15px] focus:border-accent focus:outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <Button 
                className="w-full h-14 rounded-[15px] bg-accent hover:bg-accent/90"
                onClick={handleVerify2FA}
                disabled={verify2FA.isPending || verificationCode.length !== 6}
              >
                {verify2FA.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {t("twoFactor.verify")}
              </Button>
            </div>
          ) : (
            // Initial state - show enable button
            <div className="space-y-4">
              <Button 
                className="w-full h-14 rounded-[15px] bg-accent hover:bg-accent/90"
                onClick={handleSetup2FA}
                disabled={setup2FA.isPending}
              >
                {setup2FA.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {t("twoFactor.enable")}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {t("twoFactor.appHint")}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (activeView === "biometric") {
      const webauthnEnabled = biometricStatus?.enabled || false;

      const handleDisableBiometric = () => {
        if (window.confirm("Are you sure you want to disable biometric authentication?")) {
          disableBiometric.mutate();
        }
      };

      const handleEnableBiometric = () => {
        setActiveView(null);
        setLocation("/dashboard");
        // Trigger biometric setup modal
        setTimeout(() => {
          const event = new CustomEvent("show-biometric-setup");
          window.dispatchEvent(event);
        }, 500);
      };

      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">{biometricName} Authentication</h2>
            <p className="text-sm text-muted-foreground">Secure your account with {biometricName}</p>
          </div>

          {webauthnEnabled ? (
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-[15px] p-4 text-center">
                <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-green-400">{t("biometric.enabled")}</p>
              </div>
              <div className="space-y-2 bg-card border border-border/20 rounded-[15px] p-4">
                <p className="text-sm font-medium">{t("biometric.benefits")}</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• {t("biometric.benefit1")}</li>
                  <li>• {t("biometric.benefit2")}</li>
                  <li>• {t("biometric.benefit3")}</li>
                </ul>
              </div>
              <Button 
                className="w-full h-14 rounded-[15px] bg-red-500 hover:bg-red-600"
                onClick={handleDisableBiometric}
                disabled={disableBiometric.isPending}
              >
                {disableBiometric.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {t("biometric.disable")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-[15px] p-4 text-center">
                <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-medium text-yellow-400">{t("biometric.disabled")}</p>
              </div>
              <div className="space-y-2 bg-card border border-border/20 rounded-[15px] p-4">
                <p className="text-sm font-medium">{t("biometric.benefits")}</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• {t("biometric.benefit1")}</li>
                  <li>• {t("biometric.benefit2")}</li>
                  <li>• {t("biometric.benefit3")}</li>
                </ul>
              </div>
              <Button 
                className="w-full h-14 rounded-[15px] bg-accent hover:bg-accent/90"
                onClick={handleEnableBiometric}
              >
                Enable {biometricName}
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (activeView === "password") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Key className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">{t("password.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("password.subtitle")}</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">{t("password.current")}</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-12 px-4 mt-1 bg-card border border-border/20 rounded-[15px] focus:border-accent focus:outline-none"
                placeholder={t("password.current")}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">{t("password.new")}</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 px-4 mt-1 bg-card border border-border/20 rounded-[15px] focus:border-accent focus:outline-none"
                placeholder={t("password.new")}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">{t("password.confirm")}</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 px-4 mt-1 bg-card border border-border/20 rounded-[15px] focus:border-accent focus:outline-none"
                placeholder={t("password.confirm")}
              />
            </div>
            <Button 
              className="w-full h-14 rounded-[15px] bg-accent hover:bg-accent/90 mt-4"
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t("password.update")}
            </Button>
          </div>
        </div>
      );
    }

    if (activeView === "plan") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">{t("plan.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("plan.subtitle")}</p>
          </div>
          <div className="bg-card border border-accent/30 rounded-[15px] p-6 text-center">
            <p className="text-sm text-muted-foreground">{t("plan.current")}</p>
            <p className="text-2xl font-bold text-accent mt-1">{planName}</p>
          </div>
          <Button 
            className="w-full h-14 rounded-[15px] bg-accent hover:bg-accent/90"
            onClick={handleGoToPricing}
          >
            {t("plan.upgrade")}
          </Button>
        </div>
      );
    }

    if (activeView === "settings") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Settings className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">{t("menu.settings")}</h2>
            <p className="text-sm text-muted-foreground">{t("menu.settingsDesc")}</p>
          </div>
          <div className="space-y-3">
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("security")}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span>{t("menu.security")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("password")}
            >
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground" />
                <span>{t("menu.password")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("notifications")}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>{t("menu.alerts")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("language")}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <span>{t("common.language")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground uppercase">{language}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("plan")}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <span>{t("menu.subscription")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      );
    }

    if (activeView === "generator") {
      const handleAddCredential = (password: string) => {
        if (onAddCredentialWithPassword) {
          setOpen(false);
          setActiveView(null);
          onAddCredentialWithPassword(password);
        }
      };

      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Wand2 className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">{t("generator.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("generator.secureKeys")}</p>
          </div>
          <PasswordGeneratorInline onAddCredential={handleAddCredential} />
        </div>
      );
    }

    if (activeView === "payments") {
      return (
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border/20">
            <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">{t("common.back")}</span>
            </button>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Receipt className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-xl font-bold">{t("payments.history")}</h2>
              <p className="text-sm text-muted-foreground">{t("payments.historyDesc")}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <PaymentHistoryInline />
          </div>
        </div>
      );
    }

    if (activeView === "notifications") {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <NotificationSettings />
          </div>
        </div>
      );
    }

    if (activeView === "theme") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              {theme === "dark" ? <Sun className="w-8 h-8 text-accent" /> : <Moon className="w-8 h-8 text-accent" />}
            </div>
            <h2 className="text-xl font-bold">{t("menu.theme")}</h2>
            <p className="text-sm text-muted-foreground">Current: {theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                toggleTheme();
                toast.success(`Switched to ${theme === "dark" ? "Light" : "Dark"} Mode`);
                handleBack();
              }}
              className="w-full flex items-center justify-between p-4 rounded-[15px] bg-card/50 border border-border/20 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-accent" />}
                <span className="font-medium">Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      );
    }

    if (activeView === "documentation") {
      return (
        <div className="flex flex-col h-full">
          <div className="p-6 space-y-6">
            <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">{t("common.back")}</span>
            </button>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-xl font-bold">{t("menu.documentation")}</h2>
              <p className="text-sm text-muted-foreground">{t("menu.documentationDesc")}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Security & Compliance */}
            <button
              onClick={() => {
                setOpen(false);
                setLocation("/security-compliance");
              }}
              className="w-full flex items-center gap-4 p-4 rounded-[15px] hover:bg-card/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-[12px] bg-card border border-border/20 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                <Shield className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("menu.securityCompliance")}</p>
                <p className="text-xs text-muted-foreground">{t("menu.securityComplianceDesc")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>

            {/* Privacy Policy */}
            <button
              onClick={() => {
                setOpen(false);
                setLocation("/privacy");
              }}
              className="w-full flex items-center gap-4 p-4 rounded-[15px] hover:bg-card/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-[12px] bg-card border border-border/20 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                <Lock className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("menu.privacyPolicy")}</p>
                <p className="text-xs text-muted-foreground">{t("menu.privacyPolicyDesc")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>

            {/* Cookie Policy */}
            <button
              onClick={() => {
                setOpen(false);
                setLocation("/cookies");
              }}
              className="w-full flex items-center gap-4 p-4 rounded-[15px] hover:bg-card/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-[12px] bg-card border border-border/20 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                <Globe className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("menu.cookiePolicy")}</p>
                <p className="text-xs text-muted-foreground">{t("menu.cookiePolicyDesc")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>

            {/* Terms of Service */}
            <button
              onClick={() => {
                setOpen(false);
                setLocation("/terms");
              }}
              className="w-full flex items-center gap-4 p-4 rounded-[15px] hover:bg-card/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-[12px] bg-card border border-border/20 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                <Key className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("menu.termsOfService")}</p>
                <p className="text-xs text-muted-foreground">{t("menu.termsOfServiceDesc")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>

            {/* Refund Policy */}
            <button
              onClick={() => {
                setOpen(false);
                setLocation("/refund-policy");
              }}
              className="w-full flex items-center gap-4 p-4 rounded-[15px] hover:bg-card/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-[12px] bg-card border border-border/20 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                <CreditCard className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("menu.refundPolicy")}</p>
                <p className="text-xs text-muted-foreground">{t("menu.refundPolicyDesc")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>
          </div>
        </div>
      );
    }

    // Default menu view
    return (
      <div className="flex flex-col h-full">
        {/* Dashboard Link */}
        <div className="p-4 border-b border-border/20 space-y-2">
          <button
            onClick={handleGoToDashboard}
            className="w-full flex items-center gap-4 p-4 rounded-[15px] bg-accent/10 border border-accent/30 text-left"
          >
            <Home className="w-5 h-5 text-accent" />
            <span className="font-medium">{t("menu.dashboard")}</span>
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setLocation("/shared");
            }}
            className="w-full flex items-center gap-4 p-4 rounded-[15px] bg-card border border-border/20 hover:border-accent/50 transition-colors text-left"
          >
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{t("menu.shared")}</span>
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setLocation("/qr-codes");
            }}
            className="w-full flex items-center gap-4 p-4 rounded-[15px] bg-card border border-border/20 hover:border-accent/50 transition-colors text-left"
          >
            <QrCode className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{t("qr.title") || "QR Codes"}</span>
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setLocation("/bar-codes");
            }}
            className="w-full flex items-center gap-4 p-4 rounded-[15px] bg-card border border-border/20 hover:border-accent/50 transition-colors text-left"
          >
            <Barcode className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{t("barcode.title") || "Bar Codes"}</span>
          </button>
          {adminCheck?.isAdmin && (
            <button
              onClick={() => {
                setOpen(false);
                setLocation("/admin");
              }}
              className="w-full flex items-center gap-4 p-4 rounded-[15px] bg-purple-500/10 border border-purple-500/30 text-left"
            >
              <UserCog className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-purple-400">{t("menu.administration") || "Administration"}</span>
            </button>
          )}
        </div>
        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(item.id)}
              className="w-full flex items-center gap-4 p-4 rounded-[15px] hover:bg-card/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-[12px] bg-card border border-border/20 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border/20">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-14 rounded-[15px] border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
            onClick={() => {
              handleClose();
              onLogout();
            }}
          >
            <LogOut className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium">{t("menu.logout")}</p>
              <p className="text-xs opacity-70">{t("menu.logoutDesc")}</p>
            </div>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Button variant="ghost" className="hover:bg-accent/10 flex items-center gap-2 px-2" onClick={handleOpenMenu}>
        <Menu className="w-5 h-5" />
        <img src="/logo.png" alt="EterBox" className="w-8 h-8" />
        <span className="text-sm font-bold hidden sm:inline">EterBox</span>
      </Button>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent 
          side="left" 
          className="w-full sm:w-[400px] sm:max-w-[400px] bg-background border-r border-border/20 p-0"
        >
          <VisuallyHidden.Root>
            <SheetTitle>EterBox Menu</SheetTitle>
          </VisuallyHidden.Root>
          <div className="flex flex-col h-full">
            {/* Persistent Header with Menu */}
            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/20 safe-area-top safe-area-x">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {activeView ? (
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  ) : (
                    <span className="text-lg font-bold">EterBox</span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setOpen(false)}
                  className="hover:bg-accent/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
