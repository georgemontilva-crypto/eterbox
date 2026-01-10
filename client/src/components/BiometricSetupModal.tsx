import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fingerprint, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BiometricSetupModalProps {
  open: boolean;
  onClose: () => void;
  onEnable: () => void;
}

export function BiometricSetupModal({ open, onClose, onEnable }: BiometricSetupModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border border-border/20">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <Fingerprint className="w-10 h-10 text-accent" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            {t("biometric.setupTitle")}
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            {t("biometric.setupDescription")}
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
              <Fingerprint className="w-4 h-4 mr-2" />
              {t("biometric.enableNow")}
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
