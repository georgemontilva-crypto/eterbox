import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus('success');
      setMessage('Your email has been verified successfully! You can now log in to your account.');
    },
    onError: (error) => {
      setStatus('error');
      setMessage(error.message || 'Invalid or expired verification token. Please try again or contact support.');
    },
  });

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check your email for the verification link.');
      return;
    }

    // Verify the token
    verifyMutation.mutate({ token });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="EterBox" className="w-16 h-16" />
          </div>

          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === 'loading' && (
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-4 text-white">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          {/* Message */}
          <p className="text-slate-400 text-center mb-8">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === 'success' && (
              <Button
                onClick={() => setLocation('/login')}
                className="w-full h-12 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:opacity-90 text-white font-semibold rounded-xl"
              >
                Go to Login
              </Button>
            )}
            {status === 'error' && (
              <>
                <Button
                  onClick={() => setLocation('/register')}
                  className="w-full h-12 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:opacity-90 text-white font-semibold rounded-xl"
                >
                  Create New Account
                </Button>
                <Button
                  onClick={() => setLocation('/login')}
                  variant="outline"
                  className="w-full h-12 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
                >
                  Back to Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
