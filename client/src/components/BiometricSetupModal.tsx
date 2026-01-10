import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fingerprint, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { detectPlatform, getBiometricTypeName, type Platform } from "@/lib/platform";
import { useState } from "react";

interface BiometricSetupModalProps {
  open: boolean;
  onClose: () => void;
  onEnable: () => void;
}

export function BiometricSetupModal({ open, onClose, onEnable }: BiometricSetupModalProps) {
  const { t } = useLanguage();
  const [platform] = useState<Platform>(detectPlatform());
  const biometricName = getBiometricTypeName(platform);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border border-border/20">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              {platform === 'ios' ? (
                <svg className="w-10 h-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                </svg>
              ) : (
                <Fingerprint className="w-10 h-10 text-accent" />
              )}
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Enable {biometricName}
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Secure your account with {biometricName} for quick and easy access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-accent">{t("biometric.benefits")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>{t("biometric.benefit1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>{t("biometric.benefit2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>{t("biometric.benefit3")}</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              {t("biometric.maybeLater")}
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onEnable();
                onClose();
              }}
            >
              {platform === 'ios' ? (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="10" r="2" />
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <Fingerprint className="w-4 h-4 mr-2" />
              )}
              Enable {biometricName}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            {t("biometric.canEnableLater")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
