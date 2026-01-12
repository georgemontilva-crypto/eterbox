import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface ContactSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactSuccessModal({ isOpen, onClose }: ContactSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border/20 rounded-[20px] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle2 className="w-10 h-10 text-green-500 animate-in zoom-in duration-700" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-4">
          Message Sent Successfully
        </h2>

        {/* Description */}
        <p className="text-center text-muted-foreground text-sm leading-relaxed">
          Thank you for contacting us! We've received your message and will get back to you shortly. 
          We usually respond within 24 hours.
        </p>
      </div>
    </div>
  );
}
