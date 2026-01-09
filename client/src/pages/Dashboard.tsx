import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateCredentialModal } from "@/components/CreateCredentialModal";
import { CreateFolderModal } from "@/components/CreateFolderModal";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Lock, Plus, Eye, EyeOff, Copy, Trash2, Settings, LogOut, Folder } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

  const { data: userPlan } = trpc.plans.getUserPlan.useQuery();
  const { data: credentials = [] } = trpc.credentials.list.useQuery();
  const { data: folders = [] } = trpc.folders.list.useQuery();
  const deleteCredentialMutation = trpc.credentials.delete.useMutation();
  const deleteFolderMutation = trpc.folders.delete.useMutation();
  const utils = trpc.useUtils();

  const togglePasswordVisibility = (id: number) => {
    const newSet = new Set(visiblePasswords);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setVisiblePasswords(newSet);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDeleteCredential = async (id: number) => {
    if (!confirm("Are you sure you want to delete this credential?")) return;
    try {
      await deleteCredentialMutation.mutateAsync({ id });
      toast.success("Credential deleted!");
      utils.credentials.list.invalidate();
    } catch (error) {
      toast.error("Failed to delete credential");
    }
  };

  const handleDeleteFolder = async (id: number) => {
    if (!confirm("Are you sure you want to delete this folder?")) return;
    try {
      await deleteFolderMutation.mutateAsync({ id });
      toast.success("Folder deleted!");
      utils.folders.list.invalidate();
    } catch (error) {
      toast.error("Failed to delete folder");
    }
  };

  const planName = userPlan?.name || "Free";
  const maxKeys = userPlan?.maxKeys || 3;
  const maxFolders = userPlan?.maxFolders || 1;

  // Group credentials by folder
  const credentialsByFolder: { [key: number]: any[] } = {};
  const credentialsWithoutFolder: any[] = [];

  credentials.forEach((cred: any) => {
    if (cred.folderId) {
      if (!credentialsByFolder[cred.folderId]) {
        credentialsByFolder[cred.folderId] = [];
      }
      credentialsByFolder[cred.folderId].push(cred);
    } else {
      credentialsWithoutFolder.push(cred);
    }
  });

  const renderCredentialCard = (cred: any) => (
    <Card key={cred.id} className="p-4 border border-border/20 hover:border-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-semibold">{cred.platformName}</p>
          <p className="text-sm text-muted-foreground">
            {cred.username && `Username: ${cred.username}`}
            {cred.email && cred.username && " • "}
            {cred.email && `Email: ${cred.email}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePasswordVisibility(cred.id)}
          >
            {visiblePasswords.has(cred.id) ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(cred.encryptedPassword || "")}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteCredential(cred.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
      {visiblePasswords.has(cred.id) && (
        <div className="mt-3 pt-3 border-t border-border/20">
          <p className="text-sm">Password: <span className="font-mono text-accent">{cred.encryptedPassword}</span></p>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold">EterBox</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={async () => { await logout(); setLocation("/"); }}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">Manage your passwords and credentials securely</p>
        </div>

        {/* Plan Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border border-border/20">
            <p className="text-sm text-muted-foreground mb-2">Current Plan</p>
            <p className="text-2xl font-bold text-accent">{planName}</p>
          </Card>
          <Card className="p-6 border border-border/20">
            <p className="text-sm text-muted-foreground mb-2">Credentials Used</p>
            <p className="text-2xl font-bold">{credentials.length || 0}/{maxKeys}</p>
          </Card>
          <Card className="p-6 border border-border/20">
            <p className="text-sm text-muted-foreground mb-2">Folders Used</p>
            <p className="text-2xl font-bold">{folders.length || 0}/{maxFolders}</p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button onClick={() => setShowCredentialModal(true)} className="h-12 text-base">
            <Plus className="w-4 h-4 mr-2" />
            Add New Credential
          </Button>
          <Button onClick={() => setShowFolderModal(true)} variant="outline" className="h-12 text-base">
            <Plus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
        </div>

        {/* Upgrade Plan Button */}
        {planName !== "Corporate" && (
          <div className="mb-8 p-4 rounded-[15px] bg-accent/10 border border-accent/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Upgrade Your Plan</p>
                <p className="text-sm text-muted-foreground">Get more credentials and folders with a paid plan</p>
              </div>
              <Button onClick={() => setLocation("/pricing")}>Upgrade Now</Button>
            </div>
          </div>
        )}

        {/* Folders Section with Credentials */}
        {folders && folders.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Your Folders</h3>
            <div className="space-y-6">
              {folders.map((folder: any) => {
                const folderCreds = credentialsByFolder[folder.id] || [];
                return (
                  <div key={folder.id}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Folder className="w-5 h-5 text-accent" />
                        <div>
                          <p className="font-semibold">{folder.name}</p>
                          <p className="text-sm text-muted-foreground">{folderCreds.length} credential{folderCreds.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    {folderCreds.length > 0 ? (
                      <div className="space-y-3 ml-8">
                        {folderCreds.map(renderCredentialCard)}
                      </div>
                    ) : (
                      <div className="ml-8 p-4 rounded-[15px] bg-card/50 border border-border/20 text-center">
                        <p className="text-sm text-muted-foreground">No credentials in this folder</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Credentials Without Folder */}
        <div>
          <h3 className="text-xl font-bold mb-4">Your Credentials</h3>
          {credentialsWithoutFolder && credentialsWithoutFolder.length > 0 ? (
            <div className="space-y-3">
              {credentialsWithoutFolder.map(renderCredentialCard)}
            </div>
          ) : credentials && credentials.length === 0 ? (
            <Card className="p-12 border border-border/20 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No credentials yet. Create your first one!</p>
            </Card>
          ) : null}
        </div>
      </main>

      {/* Modals */}
      <CreateCredentialModal open={showCredentialModal} onOpenChange={setShowCredentialModal} folders={folders || []} />
      <CreateFolderModal open={showFolderModal} onOpenChange={setShowFolderModal} />
    </div>
  );
}
