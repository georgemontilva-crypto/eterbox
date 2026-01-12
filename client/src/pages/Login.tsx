import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Fingerprint, Key } from "lucide-react";
import { useLocation } from "wouter";
import { startAuthentication } from "@simplewebauthn/browser";
import { Verify2FALogin } from "@/components/Verify2FALogin";
import { useLanguage } from "@/contexts/LanguageContext";
import { detectPlatform, getBiometricTypeName, getBiometricDescription, type Platform } from "@/lib/platform";

export default function Login() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [platform] = useState<Platform>(detectPlatform());
  const [loginMethod, setLoginMethod] = useState<"password" | "biometric">("password");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const loginMutation = trpc.auth.login.useMutation();
  const generateAuthOptions = trpc.webauthn.generateAuthenticationOptions.useMutation();
  const verifyAuthentication = trpc.webauthn.verifyAuthentication.useMutation();
  const generateUsernamelessOptions = trpc.webauthn.generateUsernamelessAuthOptions.useMutation();
  const verifyUsernamelessAuth = trpc.webauthn.verifyUsernamelessAuth.useMutation();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError(t("login.completeFields"));
      return;
    }

    setLoading(true);

    try {
      const result = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      // Check if 2FA is required
      if (result.requires2FA && result.userId) {
        setPendingUserId(result.userId);
        setShow2FA(true);
        setLoading(false);
        return;
      }

      // If no 2FA required, store token and redirect
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || t("login.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setError("");
    setLoading(true);

    try {
      console.log("[Biometric] Starting usernameless authentication...");
      
      // Get authentication options (no email required)
      const options = await generateUsernamelessOptions.mutateAsync();
      console.log("[Biometric] Options generated", options);

      // Start WebAuthn authentication with discoverable credentials
      const authResp = await startAuthentication({ optionsJSON: options });
      console.log("[Biometric] Authentication response received");

      // Verify authentication (backend will identify user from credential)
      const result = await verifyUsernamelessAuth.mutateAsync({
        response: authResp,
      });
      console.log("[Biometric] Verification successful", result);

      // Store token
      localStorage.setItem("auth_token", result.token);
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("[Biometric] Login error:", err);
      
      // Handle specific errors
      if (err.message && err.message.includes("Credential not found")) {
        setError(`${t("login.your")} ${getBiometricTypeName(platform)} ${t("login.credentialNotFound")}`);
      } else if (err.message && err.message.includes("not found or expired")) {
        setError(t("login.sessionExpired"));
      } else {
        setError(err.message || `${t("login.biometricFailed")}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (show2FA && pendingUserId) {
    return (
      <Verify2FALogin
        userId={pendingUserId}
        email={formData.email}
        onBack={() => {
          setShow2FA(false);
          setPendingUserId(null);
        }}
      />
    );
  }

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
            {t("common.back")}
          </Button>
        </div>
      </nav>

      {/* Login Form */}
      <div className="container flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {t("home.nav.login")} <span className="text-accent">{t("common.secure")}</span>
            </h1>
            <p className="text-muted-foreground">
              {t("login.subtitle")}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-[15px] bg-card border border-border/20">
            {/* Login method tabs */}
            <div className="flex gap-2 mb-6 bg-muted/30 p-1 rounded-lg">
              <button
                onClick={() => setLoginMethod("password")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                  loginMethod === "password"
                    ? "bg-accent text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Key className="w-4 h-4" />
                {t("login.password")}
              </button>
              <button
                onClick={() => setLoginMethod("biometric")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                  loginMethod === "biometric"
                    ? "bg-accent text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Fingerprint className="w-4 h-4" />
                {t("login.biometric")}
              </button>
            </div>

            {loginMethod === "password" ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                    {t("common.email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 px-4 bg-background border border-border/20 rounded-[15px] focus:border-accent focus:outline-none"
                    placeholder={t("common.emailPlaceholder")}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
                    {t("common.password")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-12 px-4 bg-background border border-border/20 rounded-[15px] focus:border-accent focus:outline-none"
                    placeholder={t("common.passwordPlaceholder")}
                    disabled={loading}
                  />
                </div>

                <div className="text-right mb-4">
                  <button
                    type="button"
                    onClick={() => setLocation("/forgot-password")}
                    className="text-sm text-accent hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-[15px] bg-accent hover:bg-accent/90"
                >
                  {loading ? t("login.loggingIn") : t("login.loginButton")}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="text-center p-8 bg-accent/5 border border-accent/20 rounded-[15px]">
                  {platform === 'ios' ? (
                    <svg className="w-16 h-16 text-accent mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="10" r="3" />
                      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                    </svg>
                  ) : (
                    <Fingerprint className="w-16 h-16 text-accent mx-auto mb-4" />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{getBiometricTypeName(platform)}</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {getBiometricDescription(platform)}
                  </p>
                  <Button
                    onClick={handleBiometricLogin}
                    disabled={loading}
                    className="w-full h-12 rounded-[15px] bg-accent hover:bg-accent/90"
                  >
                    {loading ? t("login.authenticating") : `Authenticate with ${getBiometricTypeName(platform)}`}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("login.noAccount")}{" "}
                <button
                  onClick={() => setLocation("/register")}
                  className="text-accent hover:underline font-medium"
                >
                  {t("login.signUp")}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
