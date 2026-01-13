import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

interface SubscriptionExpiredModalProps {
  open: boolean;
  daysRemaining: number;
  planName: string;
}

export function SubscriptionExpiredModal({ open, daysRemaining, planName }: SubscriptionExpiredModalProps) {
  const [, setLocation] = useLocation();

  const isExpired = daysRemaining === 0;
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 3;

  if (!isExpired && !isExpiringSoon) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose={isExpired}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-6 h-6 ${isExpired ? 'text-red-500' : 'text-orange-500'}`} />
            <DialogTitle className={isExpired ? 'text-red-500' : 'text-orange-500'}>
              {isExpired ? 'Subscription Expired' : 'Subscription Expiring Soon'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3">
            {isExpired ? (
              <>
                <p className="font-semibold">Your {planName} plan has expired.</p>
                <p>To continue using EterBox and access your credentials, please renew your subscription.</p>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    <strong>Access Restricted:</strong> You cannot view or manage credentials until you renew your plan.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold">Your {planName} plan expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}.</p>
                <p>Renew now to avoid losing access to your credentials and features.</p>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          <Button 
            onClick={() => setLocation('/pricing')}
            className="w-full"
          >
            {isExpired ? 'Renew Subscription' : 'Renew Now'}
          </Button>
          {!isExpired && (
            <Button 
              variant="outline"
              onClick={() => {}}
              className="w-full"
            >
              Remind Me Later
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
