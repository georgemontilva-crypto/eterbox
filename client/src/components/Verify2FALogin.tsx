import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface Verify2FALoginProps {
  userId: number;
  email: string;
  onBack: () => void;
}

export function Verify2FALogin({ userId, email, onBack }: Verify2FALoginProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

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
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid 2FA code");
      toast.error(err.message || "Invalid 2FA code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Header with Logo */}
      <header className="absolute top-0 left-0 right-0 border-b border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EterBox Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold">EterBox</span>
          </div>
        </div>
      </header>

      <div className="max-w-md w-full mt-16">
        <div className="bg-card border border-border/20 rounded-[20px] shadow-lg p-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to login</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Two-Factor Authentication</h1>
            <p className="text-muted-foreground text-sm">
              Enter the 6-digit code from your authenticator app
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Logging in as: <span className="text-accent">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-[15px] p-3 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                Authentication Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-3 bg-background border border-border rounded-[15px] text-center text-2xl tracking-widest focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Enter the 6-digit code or use a backup code
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full h-12 bg-accent hover:bg-accent/90 font-semibold rounded-[15px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-xs text-muted-foreground">
              Lost access to your authenticator?{" "}
              <button className="text-accent hover:underline">
                Use backup code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
