import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Shield, Lock, KeyRound, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Verify2FA() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  
  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isBackupCode, setIsBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setLocation("/");
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`/api/oauth/check-2fa-token?token=${token}`);
        const data = await response.json();
        
        if (data.valid) {
          setTokenValid(true);
          setUserName(data.userName || "");
        } else {
          setError(t("verify2fa.tokenExpired"));
          setTimeout(() => setLocation("/"), 3000);
        }
      } catch (err) {
        setError(t("verify2fa.tokenError"));
        setTimeout(() => setLocation("/"), 3000);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, setLocation, t]);

  // Focus first input when ready
  useEffect(() => {
    if (tokenValid && !isBackupCode && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [tokenValid, isBackupCode]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (value && index === 5 && newCode.every(d => d !== "")) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      const newCode = pastedData.split("");
      setCode(newCode);
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (codeToSubmit?: string) => {
    const finalCode = isBackupCode ? backupCode : (codeToSubmit || code.join(""));
    
    if (!isBackupCode && finalCode.length !== 6) {
      setError(t("verify2fa.enterCode"));
      return;
    }

    if (isBackupCode && !backupCode.trim()) {
      setError(t("verify2fa.enterBackupCode"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/oauth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pendingToken: token,
          code: finalCode,
          isBackupCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        setError(data.error || t("verify2fa.invalidCode"));
        if (!isBackupCode) {
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      }
    } catch (err) {
      setError(t("verify2fa.verificationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t("verify2fa.validating")}</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <p className="text-gray-500 mt-2">{t("verify2fa.redirecting")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {t("verify2fa.title")}
          </h1>
          {userName && (
            <p className="text-gray-400 mb-2">
              {t("verify2fa.welcomeBack")}, {userName}
            </p>
          )}
          <p className="text-gray-500 text-sm">
            {isBackupCode ? t("verify2fa.enterBackupCodeDesc") : t("verify2fa.enterCodeDesc")}
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          {!isBackupCode ? (
            <>
              {/* TOTP Code Input */}
              <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handleSubmit()}
                disabled={isLoading || code.some(d => d === "")}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("verify2fa.verifying")}
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {t("verify2fa.verify")}
                  </>
                )}
              </button>

              {/* Switch to Backup Code */}
              <button
                onClick={() => setIsBackupCode(true)}
                className="w-full mt-4 py-2 text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                {t("verify2fa.useBackupCode")}
              </button>
            </>
          ) : (
            <>
              {/* Backup Code Input */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  {t("verify2fa.backupCodeLabel")}
                </label>
                <input
                  type="text"
                  value={backupCode}
                  onChange={(e) => {
                    setBackupCode(e.target.value);
                    setError("");
                  }}
                  placeholder="xxxxxxxx"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono text-center text-lg tracking-wider"
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handleSubmit()}
                disabled={isLoading || !backupCode.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("verify2fa.verifying")}
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    {t("verify2fa.verifyBackup")}
                  </>
                )}
              </button>

              {/* Switch to TOTP */}
              <button
                onClick={() => {
                  setIsBackupCode(false);
                  setBackupCode("");
                  setError("");
                }}
                className="w-full mt-4 py-2 text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("verify2fa.useTOTP")}
              </button>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          {t("verify2fa.securityNote")}
        </p>
      </div>
    </div>
  );
}
