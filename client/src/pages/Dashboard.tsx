import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Plus, Lock, Folder, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: userPlan } = trpc.plans.getUserPlan.useQuery();
  const { data: folders } = trpc.folders.list.useQuery();
  const { data: credentials } = trpc.credentials.list.useQuery();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold">EterBox</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-[15px] hover:bg-muted transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"}!</h2>
          <p className="text-muted-foreground">Manage your passwords and credentials securely</p>
        </div>

        {/* Plan Info */}
        {userPlan && (
          <Card className="mb-8 p-6 border border-border/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                <p className="text-2xl font-bold text-accent">{userPlan.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credentials Used</p>
                <p className="text-2xl font-bold">{userPlan.keysUsed}/{userPlan.maxKeys}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Folders Used</p>
                <p className="text-2xl font-bold">{userPlan.foldersUsed}/{userPlan.maxFolders}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button className="flex items-center gap-2 h-12 text-base">
            <Plus className="w-5 h-5" />
            Add New Credential
          </Button>
          <Button variant="outline" className="flex items-center gap-2 h-12 text-base">
            <Folder className="w-5 h-5" />
            Create Folder
          </Button>
        </div>

        {/* Credentials List */}
        <div>
          <h3 className="text-xl font-bold mb-4">Your Credentials</h3>
          {credentials && credentials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentials.map((cred) => (
                <Card key={cred.id} className="p-4 border border-border/20 hover:border-accent/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-accent">{cred.platformName}</p>
                      <p className="text-sm text-muted-foreground mt-1">{cred.username}</p>
                      {cred.email && <p className="text-xs text-muted-foreground mt-1">{cred.email}</p>}
                    </div>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border border-border/20">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No credentials yet. Create your first one!</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
