import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useLocation } from "wouter";
import { startAuthentication } from "@simplewebauthn/browser";
import { Verify2FALogin } from "@/components/Verify2FALogin";

export default function Login() {
  const [, setLocation] = useLocation();
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
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

      // Store token
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
      }
      
      // Redirect to dashboard
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const handleBack2FA = () => {
    setShow2FA(false);
    setPendingUserId(null);
    setTwoFACode("");
    setError("");
  };

  // Show 2FA verification screen if needed
  if (show2FA && pendingUserId) {
    return (
      <Verify2FALogin
        userId={pendingUserId}
        email={formData.email}
        onBack={handleBack2FA}
      />
    );
  }

  const handleBiometricLogin = async () => {
    setError("");

    if (!formData.email) {
      setError("Por favor ingresa tu email");
      return;
    }

    setLoading(true);

    try {
      // Generate authentication options
      const { options, userId } = await generateAuthOptions.mutateAsync({
        email: formData.email,
      });

      // Start WebAuthn authentication
      const authResp = await startAuthentication({ optionsJSON: options });

      // Verify authentication
      const result = await verifyAuthentication.mutateAsync({
        userId,
        response: authResp,
      });

      // Store token
      localStorage.setItem("auth_token", result.token);
      
      // Redirect to dashboard
      window.location.href = "/";
    } catch (err: any) {
      console.error("Biometric login error:", err);
      setError("No se pudo autenticar con biometría. Intenta con tu contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">EterBox</h1>
          <p className="text-slate-300">Accede a tu bóveda segura</p>
        </div>

        {/* Login method tabs */}
        <div className="flex gap-2 mb-6 bg-slate-700/30 p-1 rounded-lg">
          <button
            onClick={() => setLoginMethod("password")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              loginMethod === "password"
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Contraseña
          </button>
          <button
            onClick={() => setLoginMethod("biometric")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              loginMethod === "biometric"
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Biométrico
          </button>
        </div>

        {loginMethod === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu contraseña"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="email-bio" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email-bio"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                Usa Face ID, Touch ID o tu huella digital para acceder
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleBiometricLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Autenticando..." : "Autenticar con Biometría"}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
