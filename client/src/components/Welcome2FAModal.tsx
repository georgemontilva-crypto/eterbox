import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Welcome2FAModalProps {
  open: boolean;
  onClose: () => void;
  onActivate: () => void;
}

export function Welcome2FAModal({ open, onClose, onActivate }: Welcome2FAModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-[#00f0ff]/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#00f0ff]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#00f0ff]" />
              </div>
              {t("welcome2fa.title") || "¡Bienvenido a EterBox!"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-300 text-base mt-4">
            {t("welcome2fa.description") || "Tu cuenta ha sido creada exitosamente. Para mayor seguridad, te recomendamos activar la Autenticación de Dos Factores (2FA)."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-slate-800/50 border border-[#00f0ff]/20 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-400 text-lg">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{t("welcome2fa.benefit1Title") || "Protección Extra"}</h4>
                <p className="text-sm text-slate-400">{t("welcome2fa.benefit1") || "Añade una capa adicional de seguridad a tu cuenta"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-400 text-lg">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{t("welcome2fa.benefit2Title") || "Previene Accesos No Autorizados"}</h4>
                <p className="text-sm text-slate-400">{t("welcome2fa.benefit2") || "Incluso si alguien obtiene tu contraseña, no podrá acceder sin el código 2FA"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-400 text-lg">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{t("welcome2fa.benefit3Title") || "Fácil de Configurar"}</h4>
                <p className="text-sm text-slate-400">{t("welcome2fa.benefit3") || "Solo toma 2 minutos configurarlo con tu app de autenticación favorita"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onActivate}
              className="flex-1 h-12 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-slate-900 font-semibold rounded-xl"
            >
              <Shield className="w-4 h-4 mr-2" />
              {t("welcome2fa.activateNow") || "Activar Ahora"}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl"
            >
              {t("welcome2fa.later") || "Más Tarde"}
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            {t("welcome2fa.reminder") || "Puedes activar 2FA en cualquier momento desde tu configuración"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
