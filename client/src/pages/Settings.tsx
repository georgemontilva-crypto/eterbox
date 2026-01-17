import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { Lock, LogOut, Shield, Loader2, User, Mail, Bell, CheckCircle2, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotificationSettings } from "@/components/NotificationSettings";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
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
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

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
      <main className="container px-4 py-6 md:py-12 max-w-6xl overflow-x-hidden">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{t("menu.settings")}</h2>

        {/* Grid Layout - 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Account Information */}
          <Card className="p-6 border border-border/20 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold">{t("settings.accountInfo")}</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/10">
                <p className="text-xs text-muted-foreground mb-1">{t("settings.name")}</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/10">
                <p className="text-xs text-muted-foreground mb-1">{t("common.email")}</p>
                <p className="font-medium break-all">{user?.email}</p>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6 border border-border/20 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold">{t("menu.security")}</h3>
            </div>
            
            {/* 2FA Status */}
            <div className="mb-4 p-4 rounded-lg bg-muted/30 border border-border/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-sm">Two-Factor Authentication</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {twoFactorStatus?.enabled ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        <p className="text-xs text-green-500">Enabled</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Disabled</p>
                      </>
                    )}
                  </div>
                </div>
                {twoFactorStatus?.enabled ? (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDisable2FA}
                    disabled={disable2FA.isPending}
                  >
                    {disable2FA.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {t("twoFactor.disable")}
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleSetup2FA}
                    disabled={setup2FA.isPending}
                  >
                    {setup2FA.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {t("twoFactor.enable")}
                  </Button>
                )}
              </div>
            </div>

            {/* Change Password */}
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowChangePasswordModal(true)}
            >
              <Lock className="w-4 h-4" />
              {t("settings.changePassword")}
            </Button>
          </Card>
        </div>

        {/* 2FA Setup Modal */}
        {show2FASetup && qrCode && (
          <Card className="p-6 border border-accent/30 mb-6 bg-gradient-to-br from-accent/5 to-card">
            <h4 className="font-bold text-lg mb-4">Setup Two-Factor Authentication</h4>
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 border-2 border-border rounded-lg" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Or enter this code manually:</p>
                <code className="block p-3 bg-muted rounded text-sm font-mono break-all">{secret}</code>
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
              <div className="flex gap-3">
                <Button 
                  onClick={handleVerify2FA}
                  disabled={verify2FA.isPending || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {verify2FA.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Verify and Enable
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShow2FASetup(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Backup Codes Display */}
        {showBackupCodes && backupCodes.length > 0 && (
          <Card className="p-6 border border-accent/50 mb-6 bg-gradient-to-br from-accent/10 to-card">
            <h4 className="font-bold text-lg mb-2 text-accent">⚠️ Save Your Backup Codes</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Store these codes in a safe place. You can use them to access your account if you lose your authenticator device.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {backupCodes.map((code, index) => (
                <code key={index} className="block p-2 bg-muted rounded text-sm font-mono text-center">
                  {code}
                </code>
              ))}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  const text = backupCodes.join("\n");
                  navigator.clipboard.writeText(text);
                  toast.success("Backup codes copied to clipboard");
                }}
                className="flex-1"
              >
                Copy All Codes
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowBackupCodes(false)}
                className="flex-1"
              >
                I've Saved My Codes
              </Button>
            </div>
          </Card>
        )}

        {/* Notifications - Full Width */}
        <Card className="p-6 border border-border/20 mb-6 bg-gradient-to-br from-card to-card/50">
          <NotificationSettings />
        </Card>

        {/* Logout Button - Red Style */}
        <div className="mt-8">
          <Button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 bg-black border-2 border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-600 hover:text-red-600 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {t("menu.logout")}
          </Button>
        </div>
      </main>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        open={showChangePasswordModal} 
        onOpenChange={setShowChangePasswordModal} 
      />
    </AppLayout>
  );
}
