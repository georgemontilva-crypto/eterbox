import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, Shield, Check } from "lucide-react";
import { useLocation } from "wouter";
import { startRegistration } from "@simplewebauthn/browser";
import { Welcome2FAModal } from "@/components/Welcome2FAModal";
import { BiometricSetupModal } from "@/components/BiometricSetupModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";

export default function Register() {
  const { t } = useLanguage();
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
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);

  const registerMutation = trpc.auth.register.useMutation();
  const webauthnRegisterMutation = trpc.webauthn.generateRegistrationOptions.useMutation();
  const webauthnVerifyMutation = trpc.webauthn.verifyRegistration.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("register.passwordMismatch"));
      return;
    }

    if (formData.password.length < 8) {
      setError(t("register.passwordLength"));
      return;
    }

    if (!isPasswordStrong) {
      setError("Por favor, usa una contraseña más fuerte (puntuación mínima: 3/4)");
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
      setError(err.message || t("register.error"));
    }
  };

  const handleActivateBiometric = async () => {
    try {
      console.log("[Biometric] Starting registration...");
      console.log("[Biometric] Current origin:", window.location.origin);
      console.log("[Biometric] Current hostname:", window.location.hostname);
      
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        console.error("[Biometric] WebAuthn not supported");
        alert(t("register.biometricNotSupported"));
        setShowBiometric(false);
        setShow2FAWelcome(true);
        return;
      }

      // Check if platform authenticator is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      console.log("[Biometric] Platform authenticator available:", available);
      
      if (!available) {
        alert(t("register.biometricNotAvailable"));
        setShowBiometric(false);
        setShow2FAWelcome(true);
        return;
      }

      console.log("[Biometric] Generating options...");
      const options = await webauthnRegisterMutation.mutateAsync();
      console.log("[Biometric] Options received:", JSON.stringify(options, null, 2));
      
      console.log("[Biometric] Starting registration with device...");
      const attResp = await startRegistration({ optionsJSON: options });
      console.log("[Biometric] Registration response received:", JSON.stringify(attResp, null, 2));
      
      console.log("[Biometric] Verifying registration...");
      await webauthnVerifyMutation.mutateAsync({
        response: attResp,
      });
      console.log("[Biometric] Registration verified successfully!");

      alert(t("register.biometricSuccess"));
      setShowBiometric(false);
      setShow2FAWelcome(true);
    } catch (err: any) {
      console.error("[Biometric] Registration failed:", err);
      console.error("[Biometric] Error details:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      
      let errorMessage = t("register.biometricError");
      if (err.name === 'NotAllowedError') {
        errorMessage = t("register.biometricDenied");
      } else if (err.name === 'InvalidStateError') {
        errorMessage = t("register.biometricAlreadyRegistered");
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }
      
      alert(errorMessage);
      setShowBiometric(false);
      setShow2FAWelcome(true);
    }
  };

  const handleSkipBiometric = () => {
    setShowBiometric(false);
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



  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/20 bg-card/50 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EterBox Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold">EterBox</span>
          </div>
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("register.back")}
          </Button>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="container flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {t("register.title")} <span className="text-accent">{t("register.titleAccent")}</span>
            </h1>
            <p className="text-muted-foreground">
              {t("register.subtitle")}
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
                  {t("register.name")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none transition-colors"
                  placeholder={t("register.namePlaceholder")}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t("register.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none transition-colors"
                  placeholder={t("register.emailPlaceholder")}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  {t("register.password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none transition-colors"
                  placeholder={t("register.passwordPlaceholder")}
                  required
                />
                <PasswordStrengthIndicator
                  password={formData.password}
                  userInputs={[formData.name, formData.email]}
                  onStrengthChange={(isStrong) => setIsPasswordStrong(isStrong)}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                >
                  {t("register.confirmPassword")}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:outline-none transition-colors"
                  placeholder={t("register.confirmPasswordPlaceholder")}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-6"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? t("register.creating") : t("register.createAccount")}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("register.hasAccount")}{" "}
              <button
                onClick={() => setLocation("/login")}
                className="text-accent hover:underline font-medium"
              >
                {t("register.signIn")}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Biometric Setup Modal */}
      <BiometricSetupModal
        open={showBiometric}
        onClose={handleSkipBiometric}
        onEnable={handleActivateBiometric}
      />
      
      {/* Welcome 2FA Modal */}
      <Welcome2FAModal
        open={show2FAWelcome}
        onClose={handleSkip2FA}
        onActivate={handleActivate2FA}
      />
    </div>
  );
}
