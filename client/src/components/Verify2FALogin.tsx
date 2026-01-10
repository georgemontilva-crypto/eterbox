import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Verify2FALoginProps {
  userId: number;
  email: string;
  onBack: () => void;
}

export function Verify2FALogin({ userId, email, onBack }: Verify2FALoginProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verify2FAMutation = trpc.twoFactor.verifyLogin.useMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length < 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const result = await verify2FAMutation.mutateAsync({
        userId,
        token: code,
      });

      // Store token
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
      }

      toast.success("Login successful!");
      
      // Redirect to dashboard
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Invalid 2FA code");
      toast.error(err.message || "Invalid 2FA code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#00f0ff]/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#00f0ff]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h1>
          <p className="text-slate-400 text-sm">
            Enter the 6-digit code from your authenticator app
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Logging in as: <span className="text-[#00f0ff]">{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">
              Authentication Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white text-center text-2xl tracking-widest focus:border-[#00f0ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/20 transition-all"
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
              required
            />
            <p className="text-xs text-slate-500 mt-2 text-center">
              Enter the 6-digit code or use a backup code
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full h-12 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-slate-900 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Verify & Login
              </>
            )}
          </Button>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Lost access to your authenticator?{" "}
            <button className="text-[#00f0ff] hover:underline">
              Use backup code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
