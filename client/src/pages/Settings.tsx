import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { Lock, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { NotificationSettings } from "@/components/NotificationSettings";

export default function Settings() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/20 bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EterBox Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold">EterBox</h1>
          </div>
          <Button onClick={() => setLocation("/dashboard")} variant="ghost">Dashboard</Button>
        </div>
      </header>

      <main className="container py-16 max-w-2xl">
        <h2 className="text-4xl font-bold mb-8">Settings</h2>

        <Card className="p-8 border border-border/20 mb-6">
          <h3 className="text-xl font-bold mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 border border-border/20 mb-6">
          <h3 className="text-xl font-bold mb-4">Security</h3>
          <Button variant="outline" className="mb-4">Enable Two-Factor Authentication</Button>
          <Button 
            variant="outline" 
            className="block w-full"
            onClick={() => setLocation("/change-password")}
          >
            Change Password
          </Button>
        </Card>

        <Card className="p-8 border border-border/20">
          <NotificationSettings />
        </Card>

        <div className="mt-8">
          <Button onClick={handleLogout} variant="destructive" className="w-full flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </main>
    </div>
  );
}
