import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  QrCode, 
  Barcode, 
  Users, 
  Settings, 
  Shield, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

interface AppSidebarProps {
  currentPath?: string;
}

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { logout, user } = useAuth();
  const { data: adminCheck } = trpc.admin.isAdmin.useQuery();
  const { data: userPlan } = trpc.plans.getUserPlan.useQuery();

  const planName = userPlan?.name || "Free";

  const menuItems = [
    { icon: Lock, label: "Passwords", path: "/dashboard", color: "text-blue-500" },
    { icon: QrCode, label: "QR Codes", path: "/qr-codes", color: "text-purple-500" },
    { icon: Barcode, label: "Bar Codes", path: "/barcode-dashboard", color: "text-green-500" },
    { icon: Users, label: "Shared", path: "/shared", color: "text-orange-500" },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: "Settings", path: "/settings", color: "text-gray-500" },
    ...(adminCheck?.isAdmin ? [{ icon: Shield, label: "Admin", path: "/admin", color: "text-red-500" }] : []),
  ];

  const handleNavigation = (path: string) => {
    setLocation(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location === path || currentPath === path;
  };

  return (
    <>
      {/* Mobile Header Bar - Estilo Binance */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black border-b border-white/10 z-50 flex items-center px-4 gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex-shrink-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        
        <img 
          src="/logo-light.png" 
          alt="EterBox Logo" 
          className="h-7 w-auto flex-shrink-0" 
        />
        
        <span className="text-base font-semibold tracking-tight text-white">
          EterBox
        </span>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-lg z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Altura completa */}
      <aside
        className={`
          fixed top-14 md:top-0 left-0 h-[calc(100vh-3.5rem)] md:h-screen bg-card border-r border-border/20 z-40 shadow-2xl
          transition-transform duration-400 ease-[cubic-bezier(0.4,0.0,0.2,1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:fixed
          w-64 flex flex-col
          overflow-hidden
        `}
      >
        {/* Main Navigation - Scrollable */}
        <nav className="flex-1 p-4 pt-6 space-y-2 overflow-y-auto min-h-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${active 
                    ? 'bg-accent/10 text-accent border border-accent/20' 
                    : 'hover:bg-accent/5 text-foreground'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-accent' : item.color}`} />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}
        </nav>

        {/* Bottom Section - Fixed */}
        <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-border/20 space-y-2 flex-shrink-0">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${active 
                    ? 'bg-accent/10 text-accent border border-accent/20' 
                    : 'hover:bg-accent/5 text-foreground'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-accent' : item.color}`} />
                <span className="flex-1 text-left font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* User Info & Logout */}
          <div className="pt-4 border-t border-border/20">
            {/* Plan Badge - Destacado */}
            <div className="px-4 py-3 mb-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-xs text-muted-foreground mb-1">Current Plan</p>
              <p className="text-sm font-bold text-accent">{planName} Plan</p>
            </div>
            {/* User Email */}
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                hover:bg-destructive/10 text-destructive transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
