import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { Lock, LogOut, Shield, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotificationSettings } from "@/components/NotificationSettings";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/AppLayout";

export default function Settings() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const { data: twoFactorStatus } = trpc.twoFactor.status.useQuery();
  const setup2FA = trpc.twoFactor.setup.useMutation({
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setShow2FASetup(true);
      toast.success("Scan the QR code with your authenticator app");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to setup 2FA");
    }
  });

  const verify2FA = trpc.twoFactor.verify.useMutation({
    onSuccess: (data) => {
      setBackupCodes(data.backupCodes);
      setShowBackupCodes(true);
      setShow2FASetup(false);
      toast.success("2FA enabled successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid verification code");
    }
  });

  const disable2FA = trpc.twoFactor.disable.useMutation({
    onSuccess: () => {
      toast.success("2FA disabled successfully");
      setShow2FASetup(false);
      setShowBackupCodes(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to disable 2FA");
    }
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleSetup2FA = () => {
    setup2FA.mutate();
  };

  const handleVerify2FA = () => {
    if (!secret || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    verify2FA.mutate({ secret, token: verificationCode, backupCodes: [] });
  };

  const handleDisable2FA = () => {
    if (confirm("Are you sure you want to disable 2FA?")) {
      disable2FA.mutate();
    }
  };

  return (
    <AppLayout currentPath="/settings">
      <main className="container px-4 py-6 md:py-16 max-w-2xl overflow-x-hidden">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">{t("menu.settings")}</h2>

        <Card className="p-4 md:p-8 border border-border/20 mb-6 overflow-hidden max-w-full">
          <h3 className="text-lg md:text-xl font-bold mb-4">{t("settings.accountInfo")}</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("settings.name")}</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("common.email")}</p>
              <p className="font-medium break-all">{user?.email}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-8 border border-border/20 mb-6 overflow-hidden max-w-full">
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t("menu.security")}
          </h3>
          
          {/* 2FA Status */}
          <div className="mb-6 p-3 md:p-4 rounded-lg bg-muted/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorStatus?.enabled ? "✅ Enabled" : "❌ Disabled"}
                </p>
              </div>
              {twoFactorStatus?.enabled ? (
                <Button 
                  variant="destructive" 
                  onClick={handleDisable2FA}
                  disabled={disable2FA.isPending}
                  className="w-full sm:w-auto"
                >
                  {disable2FA.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t("twoFactor.disable")}
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleSetup2FA}
                  disabled={setup2FA.isPending}
                  className="w-full sm:w-auto"
                >
                  {setup2FA.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t("twoFactor.enable")}
                </Button>
              )}
            </div>
          </div>

          {/* 2FA Setup Modal */}
          {show2FASetup && qrCode && (
            <div className="mb-6 p-4 md:p-6 border border-border/20 rounded-lg bg-card">
              <h4 className="font-bold mb-4">Setup Two-Factor Authentication</h4>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img src={qrCode} alt="2FA QR Code" className="w-40 h-40 md:w-48 md:h-48 border-2 border-border rounded-lg" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Or enter this code manually:</p>
                  <code className="block p-2 md:p-3 bg-muted rounded text-xs md:text-sm font-mono break-all">{secret}</code>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Enter verification code:</label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <Button 
                  onClick={handleVerify2FA}
                  disabled={verify2FA.isPending || verificationCode.length !== 6}
                  className="w-full"
                >
                  {verify2FA.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Verify and Enable 2FA
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShow2FASetup(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Backup Codes Display */}
          {showBackupCodes && backupCodes.length > 0 && (
            <div className="mb-6 p-4 md:p-6 border border-accent/50 rounded-lg bg-accent/5">
              <h4 className="font-bold mb-2 text-accent">⚠️ Save Your Backup Codes</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Store these codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {backupCodes.map((code, index) => (
                  <code key={index} className="block p-2 bg-muted rounded text-sm font-mono text-center">
                    {code}
                  </code>
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  const text = backupCodes.join("\n");
                  navigator.clipboard.writeText(text);
                  toast.success("Backup codes copied to clipboard");
                }}
                className="w-full"
              >
                Copy All Codes
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowBackupCodes(false)}
                className="w-full mt-2"
              >
                I've Saved My Codes
              </Button>
            </div>
          )}

          {/* Change Password */}
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={() => setLocation("/change-password")}
          >
            <Lock className="w-4 h-4" />
            {t("menu.changePassword")}
          </Button>
        </Card>

        <Card className="p-4 md:p-8 border border-border/20 overflow-hidden max-w-full">
          <NotificationSettings />
        </Card>

        <div className="mt-8">
          <Button onClick={handleLogout} variant="destructive" className="w-full flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            {t("menu.logout")}
          </Button>
        </div>
      </main>
    </AppLayout>
  );
}
