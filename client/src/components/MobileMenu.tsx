import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, Shield, Key, LogOut, CreditCard, Settings, Lock, ChevronRight, ArrowLeft, Home } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface MobileMenuProps {
  planName: string;
  onLogout: () => void;
}

type ActiveView = "menu" | "2fa" | "password" | "plan" | "settings" | null;

export function MobileMenu({ planName, onLogout }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [, setLocation] = useLocation();

  const menuItems = [
    {
      id: "2fa" as ActiveView,
      icon: Shield,
      label: "Two-Factor Auth",
      description: "Secure your account with 2FA",
    },
    {
      id: "password" as ActiveView,
      icon: Key,
      label: "Change Password",
      description: "Update your account password",
    },
    {
      id: "plan" as ActiveView,
      icon: CreditCard,
      label: "View Plan",
      description: `Current: ${planName}`,
    },
    {
      id: "settings" as ActiveView,
      icon: Settings,
      label: "Settings",
      description: "Account preferences",
    },
  ];

  const handleOpenMenu = () => {
    setActiveView(null);
    setOpen(true);
  };

  const handleSelectOption = (viewId: ActiveView) => {
    setActiveView(viewId);
  };

  const handleBack = () => {
    setActiveView(null);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveView(null);
  };

  const handleGoToDashboard = () => {
    setOpen(false);
    setActiveView(null);
    setLocation("/dashboard");
  };

  const handleGoToPricing = () => {
    setOpen(false);
    setActiveView(null);
    setLocation("/pricing");
  };

  // Render content based on active view
  const renderContent = () => {
    if (activeView === "2fa") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
          </div>
          <div className="space-y-4">
            <Button className="w-full h-14 rounded-[15px] bg-accent hover:bg-accent/90">
              Enable 2FA
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              You'll need an authenticator app like Google Authenticator or Authy
            </p>
          </div>
        </div>
      );
    }

    if (activeView === "password") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Key className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">Change Password</h2>
            <p className="text-sm text-muted-foreground">Update your account password</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Current Password</label>
              <input 
                type="password" 
                className="w-full h-12 px-4 mt-1 bg-card border border-border/20 rounded-[15px] focus:border-accent focus:outline-none"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">New Password</label>
              <input 
                type="password" 
                className="w-full h-12 px-4 mt-1 bg-card border border-border/20 rounded-[15px] focus:border-accent focus:outline-none"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full h-12 px-4 mt-1 bg-card border border-border/20 rounded-[15px] focus:border-accent focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>
            <Button className="w-full h-14 rounded-[15px] bg-accent hover:bg-accent/90 mt-4">
              Update Password
            </Button>
          </div>
        </div>
      );
    }

    if (activeView === "plan") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">Your Plan</h2>
            <p className="text-sm text-muted-foreground">Current subscription details</p>
          </div>
          <div className="bg-card border border-accent/30 rounded-[15px] p-6 text-center">
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-2xl font-bold text-accent mt-1">{planName}</p>
          </div>
          <Button 
            className="w-full h-14 rounded-[15px] bg-accent hover:bg-accent/90"
            onClick={handleGoToPricing}
          >
            Upgrade Plan
          </Button>
        </div>
      );
    }

    if (activeView === "settings") {
      return (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Settings className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="text-sm text-muted-foreground">Manage your account preferences</p>
          </div>
          <div className="space-y-3">
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("2fa")}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span>Security</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("password")}
            >
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground" />
                <span>Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              className="w-full flex items-center justify-between p-4 bg-card border border-border/20 rounded-[15px] hover:border-accent/50 transition-colors"
              onClick={() => setActiveView("plan")}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <span>Subscription</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      );
    }

    // Default menu view
    return (
      <div className="flex flex-col h-full">
        {/* Menu Header */}
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

        {/* Dashboard Link */}
        <div className="p-4 border-b border-border/20">
          <button
            onClick={handleGoToDashboard}
            className="w-full flex items-center gap-4 p-4 rounded-[15px] bg-accent/10 border border-accent/30 text-left"
          >
            <Home className="w-5 h-5 text-accent" />
            <span className="font-medium">Dashboard</span>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(item.id)}
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
              handleClose();
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
    );
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleOpenMenu}>
        <Menu className="w-6 h-6" />
      </Button>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent 
          side="left" 
          className="w-full sm:w-[400px] sm:max-w-[400px] bg-background border-r border-border/20 p-0"
        >
          <div className="flex flex-col h-full">
            {/* Persistent Header with Menu */}
            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/20">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {activeView ? (
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={handleOpenMenu}>
                      <Menu className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-accent" />
                  <span className="text-lg font-bold">EterBox</span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
