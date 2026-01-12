import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface InactivityWarningModalProps {
  isOpen: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
  remainingSeconds: number;
}

export function InactivityWarningModal({
  isOpen,
  onStayLoggedIn,
  onLogout,
  remainingSeconds: initialSeconds,
}: InactivityWarningModalProps) {
  const { t } = useLanguage();
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!isOpen) {
      setRemainingSeconds(initialSeconds);
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, initialSeconds, onLogout]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <DialogTitle>{t('inactivity.title')}</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            {t('inactivity.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-6xl font-bold text-accent">{remainingSeconds}</div>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('inactivity.secondsRemaining')}
          </p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full sm:w-auto"
          >
            {t('inactivity.logoutNow')}
          </Button>
          <Button
            onClick={onStayLoggedIn}
            className="w-full sm:w-auto"
          >
            {t('inactivity.stayLoggedIn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
