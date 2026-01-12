import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Lock, ArrowLeft, Loader2, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ResetPassword() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Get token from URL query params
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');

    if (!tokenParam) {
      setError('Invalid reset link');
      setVerifying(false);
      return;
    }

    setToken(tokenParam);
    verifyToken(tokenParam);
  }, []);

  const verifyToken = async (resetToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: resetToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid or expired reset token');
      }

      setEmail(data.email);
      setTwoFactorEnabled(data.twoFactorEnabled);
      setVerifying(false);
    } catch (err: any) {
      setError(err.message || 'Failed to verify reset token');
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setValidationError(t('resetPassword.passwordMismatch'));
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setValidationError(t('resetPassword.passwordTooShort'));
      return;
    }

    // Validate 2FA code if enabled
    if (twoFactorEnabled && !twoFactorCode) {
      setValidationError(t('resetPassword.twoFactorRequired'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
          twoFactorCode: twoFactorEnabled ? twoFactorCode : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md p-8 border border-border/20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
            <p className="text-muted-foreground">{t('resetPassword.verifying')}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md p-8 border border-border/20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-destructive" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{t('resetPassword.invalidLink')}</h1>
            <p className="text-muted-foreground mb-8">{error}</p>

            <div className="space-y-3">
              <Link href="/forgot-password">
                <Button className="w-full">
                  {t('resetPassword.requestNewLink')}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('forgotPassword.backToLogin')}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md p-8 border border-border/20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{t('resetPassword.success')}</h1>
            <p className="text-muted-foreground mb-8">
              {t('resetPassword.successMessage')}
            </p>

            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full">
                  {t('forgotPassword.backToLogin')}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-8 border border-border/20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{t('resetPassword.title')}</h1>
          <p className="text-muted-foreground">
            {t('resetPassword.description')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || validationError) && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error || validationError}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              {t('resetPassword.newPassword')}
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder={t('resetPassword.newPasswordPlaceholder')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {t('resetPassword.confirmPassword')}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('resetPassword.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          {twoFactorEnabled && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-accent" />
                <label htmlFor="twoFactorCode" className="text-sm font-medium">
                  {t('resetPassword.twoFactorCode')}
                </label>
              </div>
              <Input
                id="twoFactorCode"
                type="text"
                placeholder={t('resetPassword.twoFactorPlaceholder')}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
                disabled={loading}
                className="w-full text-center text-2xl tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                {t('resetPassword.twoFactorHelp')}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('resetPassword.resetting')}
              </>
            ) : (
              t('resetPassword.resetPassword')
            )}
          </Button>

          <div className="text-center">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('forgotPassword.backToLogin')}
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
