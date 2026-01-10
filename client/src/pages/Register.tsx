import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, Shield, Check } from "lucide-react";
import { useLocation } from "wouter";
import { startRegistration } from "@simplewebauthn/browser";
import { Welcome2FAModal } from "@/components/Welcome2FAModal";

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showBiometric, setShowBiometric] = useState(false);
  const [show2FAWelcome, setShow2FAWelcome] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const registerMutation = trpc.auth.register.useMutation();
  const webauthnRegisterMutation = trpc.webauthn.generateRegistrationOptions.useMutation();
  const webauthnVerifyMutation = trpc.webauthn.verifyRegistration.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Save JWT token to localStorage for immediate authentication
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
      }

      setUserId(result.userId);
      setShowBiometric(true);
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    }
  };

  const handleActivateBiometric = async () => {
    try {
      console.log("[Biometric] Starting registration...");
      
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        alert("Tu navegador no soporta autenticación biométrica. Usa Safari en iOS para Face ID.");
        setLocation("/login");
        return;
      }

      console.log("[Biometric] Generating options...");
      const options = await webauthnRegisterMutation.mutateAsync();
      console.log("[Biometric] Options received:", options);
      
      console.log("[Biometric] Starting registration with device...");
      const attResp = await startRegistration({ optionsJSON: options });
      console.log("[Biometric] Registration response received:", attResp);
      
      console.log("[Biometric] Verifying registration...");
      await webauthnVerifyMutation.mutateAsync({
        response: attResp,
      });
      console.log("[Biometric] Registration verified successfully!");

      alert("¡Face ID activado exitosamente!");
      setLocation("/login");
    } catch (err: any) {
      console.error("[Biometric] Registration failed:", err);
      alert(`Error al activar biometría: ${err.message || 'Error desconocido'}`);
      setLocation("/login");
    }
  };

  const handleSkipBiometric = () => {
    setShow2FAWelcome(true);
  };

  const handleActivate2FA = () => {
    setShow2FAWelcome(false);
    setLocation("/dashboard"); // User will see 2FA setup in mobile menu
  };

  const handleSkip2FA = () => {
    setShow2FAWelcome(false);
    setLocation("/dashboard");
  };

  if (showBiometric) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Registro Exitoso!</h1>
            <p className="text-muted-foreground">
              ¿Quieres activar la autenticación biométrica?
            </p>
          </div>

          <div className="p-6 rounded-[15px] bg-card border border-border/20 mb-6">
            <h3 className="font-semibold mb-4">Beneficios:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm">Acceso rápido con Face ID, Touch ID o huella digital</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm">Seguridad de grado militar</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm">No más contraseñas olvidadas</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleActivateBiometric}
              className="w-full h-12"
              disabled={webauthnRegisterMutation.isPending}
            >
              {webauthnRegisterMutation.isPending
                ? "Activando..."
                : "Activar Autenticación Biométrica"}
            </Button>
            <Button
              onClick={handleSkipBiometric}
              variant="ghost"
              className="w-full h-12"
            >
              Omitir por ahora
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Puedes activar la autenticación biométrica más tarde desde tu perfil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/20 bg-card/50 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">EterBox</span>
          </div>
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="container flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Crea tu cuenta <span className="text-accent">segura</span>
            </h1>
            <p className="text-muted-foreground">
              Protege tus credenciales con encriptación militar
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-[15px] bg-card border border-border/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none transition-colors"
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none transition-colors"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                >
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none transition-colors"
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-6"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => setLocation("/login")}
                className="text-accent hover:underline font-medium"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Welcome 2FA Modal */}
      <Welcome2FAModal
        open={show2FAWelcome}
        onClose={handleSkip2FA}
        onActivate={handleActivate2FA}
      />
    </div>
  );
}
