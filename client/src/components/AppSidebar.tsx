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
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Plus,
  List
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

interface AppSidebarProps {
  currentPath?: string;
}

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [location, setLocation] = useLocation();
  const { logout, user } = useAuth();
  const { data: adminCheck } = trpc.admin.isAdmin.useQuery();
  const { data: userPlan } = trpc.plans.getUserPlan.useQuery();

  const planName = userPlan?.name || "Free";

  const menuItems = [
    { 
      icon: Lock, 
      label: "Passwords", 
      path: "/dashboard", 
      color: "text-blue-500",
      subItems: [
        { label: "All Passwords", path: "/dashboard" },
        { label: "Folders", path: "/dashboard?view=folders" },
        { label: "Add New", path: "/dashboard?action=new" }
      ]
    },
    { 
      icon: QrCode, 
      label: "QR Codes", 
      path: "/qr-codes", 
      color: "text-purple-500",
      subItems: [
        { label: "All QR Codes", path: "/qr-codes" },
        { label: "Folders", path: "/qr-codes?view=folders" },
        { label: "Create New", path: "/qr-codes?action=new" }
      ]
    },
    { 
      icon: Barcode, 
      label: "Bar Codes", 
      path: "/barcode-dashboard", 
      color: "text-green-500",
      subItems: [
        { label: "All Bar Codes", path: "/barcode-dashboard" },
        { label: "Create New", path: "/barcode-dashboard?action=new" }
      ]
    },
    { 
      icon: Users, 
      label: "Shared", 
      path: "/shared", 
      color: "text-orange-500"
    },
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
    return location === path || currentPath === path || location.startsWith(path + "?");
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 h-10 w-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Altura completa */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-card border-r border-border/20 z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
          w-64 flex flex-col
          overflow-hidden
        `}
      >
        {/* Header con Logo */}
        <div className="p-6 border-b border-border/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo SVG */}
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <rect width="40" height="40" rx="8" fill="url(#gradient)" />
              <path 
                d="M20 10L12 16V24L20 30L28 24V16L20 10Z" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M20 20C21.6569 20 23 18.6569 23 17C23 15.3431 21.6569 14 20 14C18.3431 14 17 15.3431 17 17C17 18.6569 18.3431 20 20 20Z" 
                fill="white"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate">EterBox</h1>
              <p className="text-xs text-muted-foreground truncate">{planName} Plan</p>
            </div>
          </div>
        </div>

        {/* Main Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isExpanded = expandedMenus.includes(item.label);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            
            return (
              <div key={item.path}>
                {/* Main Menu Item */}
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleMenu(item.label);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
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
                  {hasSubItems && (
                    isExpanded 
                      ? <ChevronDown className="w-4 h-4" />
                      : <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Submenu Items */}
                {hasSubItems && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-accent/20 pl-2">
                    {item.subItems!.map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() => handleNavigation(subItem.path)}
                        className={`
                          w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                          transition-all duration-200
                          ${location === subItem.path
                            ? 'bg-accent/10 text-accent font-medium'
                            : 'hover:bg-accent/5 text-muted-foreground'
                          }
                        `}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span className="flex-1 text-left">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section - Fixed */}
        <div className="p-4 border-t border-border/20 space-y-2 flex-shrink-0">
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
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">{planName} Plan</p>
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
