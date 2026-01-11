import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  userInputs?: string[];
  onStrengthChange?: (isStrong: boolean, score: number) => void;
}

export function PasswordStrengthIndicator({
  password,
  userInputs = [],
  onStrengthChange,
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<{
    score: number;
    feedback: { warning: string; suggestions: string[] };
    isStrong: boolean;
  } | null>(null);

  useEffect(() => {
    if (!password) {
      setStrength(null);
      onStrengthChange?.(false, 0);
      return;
    }

    // Simple client-side strength check (basic heuristics)
    // For production, you should also validate on the server
    const score = calculatePasswordScore(password);
    const feedback = getPasswordFeedback(password, score);
    const isStrong = score >= 3;

    setStrength({ score, feedback, isStrong });
    onStrengthChange?.(isStrong, score);
  }, [password, userInputs, onStrengthChange]);

  if (!password || !strength) {
    return null;
  }

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-red-500';
    if (score === 1) return 'bg-orange-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Muy débil';
    if (score === 1) return 'Débil';
    if (score === 2) return 'Aceptable';
    if (score === 3) return 'Fuerte';
    return 'Muy fuerte';
  };

  const getStrengthIcon = (score: number) => {
    if (score < 3) return <AlertCircle className="w-4 h-4 text-orange-500" />;
    if (score === 3) return <Shield className="w-4 h-4 text-blue-500" />;
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStrengthIcon(strength.score)}
          <span className="text-sm font-medium">
            {getStrengthText(strength.score)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {strength.score}/4
        </span>
      </div>

      <Progress
        value={(strength.score / 4) * 100}
        className={`h-2 ${getStrengthColor(strength.score)}`}
      />

      {strength.feedback.warning && (
        <p className="text-xs text-orange-600 dark:text-orange-400">
          ⚠️ {strength.feedback.warning}
        </p>
      )}

      {strength.feedback.suggestions.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {strength.feedback.suggestions.map((suggestion, index) => (
            <li key={index}>• {suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Simple client-side password strength calculation
function calculatePasswordScore(password: string): number {
  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Common patterns penalty
  if (/^(password|123456|qwerty)/i.test(password)) score = Math.max(0, score - 2);
  if (/(.)\1{2,}/.test(password)) score = Math.max(0, score - 1); // Repeated characters

  return Math.min(4, score);
}

function getPasswordFeedback(password: string, score: number): {
  warning: string;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let warning = '';

  if (password.length < 8) {
    warning = 'La contraseña es muy corta';
    suggestions.push('Usa al menos 8 caracteres');
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    suggestions.push('Usa mayúsculas y minúsculas');
  }

  if (!/\d/.test(password)) {
    suggestions.push('Agrega números');
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push('Agrega símbolos especiales (!@#$%^&*)');
  }

  if (/^(password|123456|qwerty)/i.test(password)) {
    warning = 'Esta es una contraseña muy común';
    suggestions.push('Evita contraseñas comunes');
  }

  if (password.length < 12 && score < 3) {
    suggestions.push('Usa al menos 12 caracteres para mayor seguridad');
  }

  return { warning, suggestions };
}
