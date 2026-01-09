import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, Key, LogOut, CreditCard, Settings, X, Lock, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface MobileMenuProps {
  planName: string;
  onLogout: () => void;
}

export function MobileMenu({ planName, onLogout }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  const menuItems = [
    {
      icon: Shield,
      label: "Two-Factor Auth",
      description: "Secure your account with 2FA",
      onClick: () => {
        setOpen(false);
        setLocation("/settings?tab=security");
      },
    },
    {
      icon: Key,
      label: "Change Password",
      description: "Update your account password",
      onClick: () => {
        setOpen(false);
        setLocation("/settings?tab=password");
      },
    },
    {
      icon: CreditCard,
      label: "View Plan",
      description: `Current: ${planName}`,
      onClick: () => {
        setOpen(false);
        setLocation("/pricing");
      },
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Account preferences",
      onClick: () => {
        setOpen(false);
        setLocation("/settings");
      },
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-background border-r border-border/20 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[15px] bg-accent/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold">EterBox</h2>
                <p className="text-xs text-muted-foreground">Security Vault</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 rounded-[15px] hover:bg-card/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-[12px] bg-card border border-border/20 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                  <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-border/20">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-14 rounded-[15px] border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
            >
              <LogOut className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Logout</p>
                <p className="text-xs opacity-70">Sign out of your account</p>
              </div>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
