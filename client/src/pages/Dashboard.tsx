import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateCredentialModal } from "@/components/CreateCredentialModal";
import { CreateFolderModal } from "@/components/CreateFolderModal";
import { MoveToFolderDialog } from "@/components/MoveToFolderDialog";
import { DeleteFolderDialog } from "@/components/DeleteFolderDialog";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Lock, Plus, Eye, EyeOff, Copy, Trash2, Settings, LogOut, Folder, Search, ChevronRight, ArrowLeft, FolderPlus } from "lucide-react";
import { MobileMenu } from "@/components/MobileMenu";
import { RenewalBanner } from "@/components/RenewalBanner";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>(undefined);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedCredentialForMove, setSelectedCredentialForMove] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolderView, setActiveFolderView] = useState<number | null>(null);
  const [folderSearchQuery, setFolderSearchQuery] = useState("");
  const [showAddExistingModal, setShowAddExistingModal] = useState(false);
  const [showDeleteFolderDialog, setShowDeleteFolderDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{ id: number; name: string; credentialCount: number } | null>(null);
  const [defaultPassword, setDefaultPassword] = useState<string | undefined>(undefined);

  const { data: userPlan } = trpc.plans.getUserPlan.useQuery();
  const { data: credentials = [] } = trpc.credentials.list.useQuery();
  const { data: folders = [] } = trpc.folders.list.useQuery();
  const deleteCredentialMutation = trpc.credentials.delete.useMutation();
  const deleteFolderMutation = trpc.folders.delete.useMutation();
  const updateCredentialMutation = trpc.credentials.update.useMutation();
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

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDeleteCredential = async (id: number) => {
    try {
      await deleteCredentialMutation.mutateAsync({ id });
      toast.success("Credential deleted");
      utils.credentials.list.invalidate();
    } catch (error) {
      toast.error("Failed to delete credential");
    }
  };

  const openDeleteFolderDialog = (folder: any) => {
    const credCount = credentialsByFolder[folder.id]?.length || 0;
    setFolderToDelete({ id: folder.id, name: folder.name, credentialCount: credCount });
    setShowDeleteFolderDialog(true);
  };

  const handleFolderDeleted = () => {
    if (folderToDelete && activeFolderView === folderToDelete.id) {
      setActiveFolderView(null);
    }
    setFolderToDelete(null);
  };

  const handleAddExistingToFolder = async (credentialId: number) => {
    if (!activeFolderView) return;
    try {
      await updateCredentialMutation.mutateAsync({ 
        id: credentialId, 
        folderId: activeFolderView 
      });
      toast.success("Credential added to folder");
      utils.credentials.list.invalidate();
      setShowAddExistingModal(false);
    } catch (error) {
      toast.error("Failed to add credential to folder");
    }
  };

  const planName = userPlan?.name || "Free";
  const maxKeys = userPlan?.maxKeys || 3;
  const maxFolders = userPlan?.maxFolders || 1;

  // Filter credentials and folders based on search query
  const filteredCredentials = credentials.filter((cred: any) => {
    const query = searchQuery.toLowerCase();
    return (
      cred.platformName?.toLowerCase().includes(query) ||
      cred.username?.toLowerCase().includes(query) ||
      cred.email?.toLowerCase().includes(query)
    );
  });

  const filteredFolders = folders.filter((folder: any) => {
    const query = searchQuery.toLowerCase();
    return folder.name?.toLowerCase().includes(query);
  });

  // Group ALL credentials by folder for accurate counts
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

  // Get active folder data
  const activeFolder = activeFolderView ? folders.find((f: any) => f.id === activeFolderView) : null;
  const activeFolderCredentials = activeFolderView ? (credentialsByFolder[activeFolderView] || []) : [];
  
  // Filter credentials within active folder
  const filteredActiveFolderCredentials = useMemo(() => {
    if (!folderSearchQuery) return activeFolderCredentials;
    const query = folderSearchQuery.toLowerCase();
    return activeFolderCredentials.filter((cred: any) => 
      cred.platformName?.toLowerCase().includes(query) ||
      cred.username?.toLowerCase().includes(query) ||
      cred.email?.toLowerCase().includes(query)
    );
  }, [activeFolderCredentials, folderSearchQuery]);

  // Credentials not in this folder (for adding existing)
  const availableCredentials = credentials.filter((cred: any) => cred.folderId !== activeFolderView);

  const openFolderView = (folderId: number) => {
    setActiveFolderView(folderId);
    setSearchQuery("");
    setFolderSearchQuery("");
  };

  const renderCredentialCard = (cred: any, showMoveOption: boolean = true) => (
    <Card key={cred.id} className="p-4 border border-border/20 hover:border-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-semibold">{cred.platformName}</p>
          <p className="text-sm text-muted-foreground">
            {cred.username && `Username: ${cred.username}`}
            {cred.email && cred.username && " • "}
            {cred.email && `Email: ${cred.email}`}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <code className="text-xs bg-card/50 px-2 py-1 rounded border border-border/20">
              {visiblePasswords.has(cred.id) ? cred.encryptedPassword : "••••••••••••"}
            </code>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(cred.id)}>
            {visiblePasswords.has(cred.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(cred.encryptedPassword)}>
            <Copy className="w-4 h-4" />
          </Button>
          {showMoveOption && (
            <Button variant="ghost" size="sm" onClick={() => { setSelectedCredentialForMove(cred); setShowMoveDialog(true); }}>
              <Folder className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleDeleteCredential(cred.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );

  // Folder Detail View
  if (activeFolderView && activeFolder) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-accent" />
                <span className="text-xl font-bold">EterBox</span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setLocation("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />Settings
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container py-8">
          <Button variant="ghost" className="mb-6" onClick={() => setActiveFolderView(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Folder className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-bold">{activeFolder.name}</h1>
                <p className="text-sm text-muted-foreground">{activeFolderCredentials.length} credential{activeFolderCredentials.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => { setSelectedFolderId(activeFolderView); setShowCredentialModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />Add New Credential
              </Button>
              <Button variant="outline" onClick={() => setShowAddExistingModal(true)}>
                <FolderPlus className="w-4 h-4 mr-2" />Add Existing
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter credentials by title, username, or email..."
                value={folderSearchQuery}
                onChange={(e) => setFolderSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-[15px] border border-border/30 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
              />
            </div>
          </div>

          {filteredActiveFolderCredentials.length > 0 ? (
            <div className="space-y-3">
              {filteredActiveFolderCredentials.map((cred: any) => renderCredentialCard(cred, false))}
            </div>
          ) : folderSearchQuery ? (
            <Card className="p-12 border border-border/20 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No credentials match your filter</p>
            </Card>
          ) : (
            <Card className="p-12 border border-border/20 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No credentials in this folder yet</p>
              <Button className="mt-4" onClick={() => { setSelectedFolderId(activeFolderView); setShowCredentialModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />Add First Credential
              </Button>
            </Card>
          )}
        </main>

        {showAddExistingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg p-6 m-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Add Existing Credentials</h2>
              <p className="text-sm text-muted-foreground mb-4">Select credentials to add to "{activeFolder.name}"</p>
              {availableCredentials.length > 0 ? (
                <div className="space-y-2">
                  {availableCredentials.map((cred: any) => (
                    <div key={cred.id} className="p-3 rounded-[15px] border border-border/20 hover:border-accent/50 cursor-pointer transition-colors flex items-center justify-between" onClick={() => handleAddExistingToFolder(cred.id)}>
                      <div>
                        <p className="font-medium">{cred.platformName}</p>
                        <p className="text-xs text-muted-foreground">{cred.username || cred.email}</p>
                      </div>
                      <Plus className="w-4 h-4 text-accent" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No available credentials to add</p>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => setShowAddExistingModal(false)}>Close</Button>
            </Card>
          </div>
        )}

        <CreateCredentialModal 
          open={showCredentialModal} 
          onOpenChange={(open) => {
            setShowCredentialModal(open);
            if (!open) setDefaultPassword(undefined);
          }} 
          folders={folders} 
          defaultFolderId={selectedFolderId}
          defaultPassword={defaultPassword}
        />
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            {/* Menu hamburguesa - visible en todas las pantallas */}
            <div>
              <MobileMenu 
                planName={planName} 
                onLogout={logout} 
                onAddCredentialWithPassword={(password) => {
                  setDefaultPassword(password);
                  setSelectedFolderId(undefined);
                  setShowCredentialModal(true);
                }}
              />
            </div>
            
            {/* Logo - siempre a la derecha */}
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              <span className="text-lg md:text-xl font-bold">EterBox</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Renewal Banner */}
        {userPlan?.subscriptionEndDate && userPlan?.name !== "Free" && (
          <RenewalBanner 
            subscriptionEndDate={userPlan.subscriptionEndDate} 
            planName={userPlan.name} 
          />
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">Manage your passwords and credentials securely</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border border-border/20">
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-2xl font-bold text-accent">{planName}</p>
          </Card>
          <Card className="p-6 border border-border/20">
            <p className="text-sm text-muted-foreground">Credentials Used</p>
            <p className="text-2xl font-bold">{credentials.length}/{maxKeys === -1 ? "∞" : maxKeys}</p>
          </Card>
          <Card className="p-6 border border-border/20">
            <p className="text-sm text-muted-foreground">Folders Used</p>
            <p className="text-2xl font-bold">{folders.length}/{maxFolders === -1 ? "∞" : maxFolders}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button size="lg" className="w-full" onClick={() => { setSelectedFolderId(undefined); setShowCredentialModal(true); }}>
            <Plus className="w-4 h-4 mr-2" />Add New Credential
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={() => setShowFolderModal(true)}>
            <Plus className="w-4 h-4 mr-2" />Create Folder
          </Button>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search folders, platforms, users, or emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-[15px] border border-border/30 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
            />
          </div>
        </div>

        {searchQuery.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Search Results</h3>
            <div className="space-y-4">
              {filteredFolders.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Folders</p>
                  <div className="space-y-2">
                    {filteredFolders.map((folder: any) => (
                      <Card key={`folder-${folder.id}`} className="p-4 border border-border/20 hover:border-accent/50 cursor-pointer transition-colors" onClick={() => openFolderView(folder.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Folder className="w-5 h-5 text-accent" />
                            <div>
                              <p className="font-medium">{folder.name}</p>
                              <p className="text-xs text-muted-foreground">{credentialsByFolder[folder.id]?.length || 0} credentials</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {filteredCredentials.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Credentials</p>
                  <div className="space-y-2">{filteredCredentials.map((cred: any) => renderCredentialCard(cred))}</div>
                </div>
              )}

              {filteredFolders.length === 0 && filteredCredentials.length === 0 && (
                <div className="p-4 rounded-[15px] bg-card/50 border border-border/20 text-center">
                  <p className="text-sm text-muted-foreground">No folders or credentials found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {searchQuery.length === 0 && planName !== "Corporate" && (
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

        {searchQuery.length === 0 && folders && folders.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Your Folders</h3>
            <div className="space-y-4">
              {folders.map((folder: any) => {
                const folderCreds = credentialsByFolder[folder.id] || [];
                return (
                  <Card key={folder.id} className="p-4 border border-border/20 hover:border-accent/50 cursor-pointer transition-colors" onClick={() => openFolderView(folder.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Folder className="w-5 h-5 text-accent" />
                        <div>
                          <p className="font-semibold">{folder.name}</p>
                          <p className="text-sm text-muted-foreground">{folderCreds.length} credential{folderCreds.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFolderId(folder.id); setShowCredentialModal(true); }}>
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openDeleteFolderDialog(folder); }}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {searchQuery.length === 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Your Credentials</h3>
            {credentialsWithoutFolder && credentialsWithoutFolder.length > 0 ? (
              <div className="space-y-3">{credentialsWithoutFolder.map((cred: any) => renderCredentialCard(cred))}</div>
            ) : credentials && credentials.length === 0 ? (
              <Card className="p-12 border border-border/20 text-center">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No credentials yet. Create your first one!</p>
              </Card>
            ) : null}
          </div>
        )}
      </main>

      <CreateCredentialModal 
          open={showCredentialModal} 
          onOpenChange={(open) => {
            setShowCredentialModal(open);
            if (!open) setDefaultPassword(undefined);
          }} 
          folders={folders} 
          defaultFolderId={selectedFolderId}
          defaultPassword={defaultPassword}
        />
      <CreateFolderModal open={showFolderModal} onOpenChange={setShowFolderModal} />
      <MoveToFolderDialog open={showMoveDialog} onOpenChange={setShowMoveDialog} credentialId={selectedCredentialForMove?.id || 0} currentFolderId={selectedCredentialForMove?.folderId} folders={folders} />
      {folderToDelete && (
        <DeleteFolderDialog
          open={showDeleteFolderDialog}
          onOpenChange={setShowDeleteFolderDialog}
          folderId={folderToDelete.id}
          folderName={folderToDelete.name}
          credentialCount={folderToDelete.credentialCount}
          onDeleted={handleFolderDeleted}
        />
      )}
    </div>
  );
}
