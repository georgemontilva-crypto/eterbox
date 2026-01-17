import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateCredentialModal } from "@/components/CreateCredentialModal";
import { EditCredentialModal } from "@/components/EditCredentialModal";
import { CreateFolderModal } from "@/components/CreateFolderModal";
import { EditFolderModal } from "@/components/EditFolderModal";
import { MoveToFolderDialog } from "@/components/MoveToFolderDialog";
import { DeleteFolderDialog } from "@/components/DeleteFolderDialog";
import { BiometricSetupModal } from "@/components/BiometricSetupModal";
import { PasswordGeneratorModal } from "@/components/PasswordGeneratorModal";
import { ExportCredentialsModal } from "@/components/ExportCredentialsModal";
import { ImportCredentialsModal } from "@/components/ImportCredentialsModal";
import { ShareFolderModal } from "@/components/ShareFolderModal";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Lock, Plus, Eye, EyeOff, Copy, Trash2, Settings, LogOut, Folder, Search, ChevronRight, ChevronDown, ArrowLeft, FolderPlus, Shield, Edit, Users, Download, Upload, MoreVertical } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { RenewalBanner } from "@/components/RenewalBanner";
import { SubscriptionExpiredModal } from "@/components/SubscriptionExpiredModal";
import { useLocation } from "wouter";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { startRegistration } from "@simplewebauthn/browser";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { data: adminCheck } = trpc.admin.isAdmin.useQuery();
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
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [showDeleteFolderDialog, setShowDeleteFolderDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{ id: number; name: string; credentialCount: number } | null>(null);
  const [defaultPassword, setDefaultPassword] = useState<string | undefined>(undefined);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [expandedCredentials, setExpandedCredentials] = useState<Set<number>>(new Set());
  const [showEditCredentialModal, setShowEditCredentialModal] = useState(false);
  const [selectedCredentialForEdit, setSelectedCredentialForEdit] = useState<any>(null);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [selectedFolderForEdit, setSelectedFolderForEdit] = useState<any>(null);
  const [showShareFolderModal, setShowShareFolderModal] = useState(false);
  const [selectedFolderForShare, setSelectedFolderForShare] = useState<{ id: number; name: string } | null>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState<number>(0);

  const { data: userPlan } = trpc.plans.getUserPlan.useQuery();
  
  // Calculate days remaining
  const daysRemaining = userPlan?.subscriptionEndDate 
    ? Math.max(0, Math.ceil((new Date(userPlan.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;
  
  const isSubscriptionExpired = daysRemaining === 0;
  
  // Block credentials access if subscription is expired
  const { data: credentials = [] } = trpc.credentials.list.useQuery(undefined, {
    enabled: !isSubscriptionExpired
  });
  
  // Get credentials for active folder (including shared folders)
  const { data: folderCredentials = [] } = trpc.credentials.listByFolder.useQuery(
    { folderId: activeFolderView! },
    { enabled: activeFolderView !== null && !isSubscriptionExpired }
  );
  
  const { data: folders = [] } = trpc.folders.listWithShareCount.useQuery(undefined, {
    refetchInterval: 5000, // Refetch every 5 seconds to catch shared folders
  });
  const { data: sharedFolders = [] } = trpc.folders.getSharedWithMe.useQuery(undefined, {
    refetchInterval: 5000, // Refetch every 5 seconds to catch new shares
  });
  const deleteCredentialMutation = trpc.credentials.delete.useMutation();
  const deleteFolderMutation = trpc.folders.delete.useMutation();
  const updateCredentialMutation = trpc.credentials.update.useMutation();
  const utils = trpc.useUtils();
  const webauthnRegisterMutation = trpc.webauthn.generateRegistrationOptions.useMutation();
  const webauthnVerifyMutation = trpc.webauthn.verifyRegistration.useMutation();

  const togglePasswordVisibility = (id: number) => {
    const newSet = new Set(visiblePasswords);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setVisiblePasswords(newSet);
  };

  const toggleCredentialExpansion = (id: number) => {
    const newSet = new Set(expandedCredentials);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedCredentials(newSet);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("dashboard.copiedToClipboard"));
  };

  const handleDeleteCredential = async (id: number) => {
    try {
      await deleteCredentialMutation.mutateAsync({ id });
      toast.success(t("dashboard.credentialDeleted"));
      utils.credentials.list.invalidate();
      utils.credentials.listByFolder.invalidate();
      utils.folders.listWithShareCount.invalidate();
    } catch (error) {
      toast.error(t("dashboard.failedToDelete"));
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
      // Restore scroll position after deleting folder
      setTimeout(() => {
        window.scrollTo({ top: savedScrollPosition, behavior: 'instant' });
      }, 0);
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
      toast.success(t("dashboard.credentialAddedToFolder"));
      utils.credentials.list.invalidate();
      utils.credentials.getByFolder.invalidate({ folderId: activeFolderView });
      setShowAddExistingModal(false);
    } catch (error) {
      toast.error(t("dashboard.failedToAdd"));
    }
  };

  // Handle biometric setup from Settings menu
  useEffect(() => {
    const handleBiometricSetupEvent = () => {
      setShowBiometricSetup(true);
    };

    window.addEventListener("show-biometric-setup", handleBiometricSetupEvent);
    return () => {
      window.removeEventListener("show-biometric-setup", handleBiometricSetupEvent);
    };
  }, []);

  const handleActivateBiometric = async () => {
    try {
      console.log("[Biometric] Starting registration from Dashboard...");
      console.log("[Biometric] Current origin:", window.location.origin);
      console.log("[Biometric] Current hostname:", window.location.hostname);
      
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        console.error("[Biometric] WebAuthn not supported");
        toast.error("Tu navegador no soporta autenticación biométrica. Usa Safari en iOS para Face ID o Chrome/Edge en Android.");
        setShowBiometricSetup(false);
        return;
      }

      // Check if platform authenticator is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      console.log("[Biometric] Platform authenticator available:", available);
      
      if (!available) {
        toast.error("Tu dispositivo no tiene autenticación biométrica disponible (Face ID, Touch ID, o huella digital).");
        setShowBiometricSetup(false);
        return;
      }

      console.log("[Biometric] Generating options...");
      const options = await webauthnRegisterMutation.mutateAsync();
      console.log("[Biometric] Options received:", JSON.stringify(options, null, 2));
      
      console.log("[Biometric] Starting registration with device...");
      const attResp = await startRegistration({ optionsJSON: options });
      console.log("[Biometric] Registration response received:", JSON.stringify(attResp, null, 2));
      
      console.log("[Biometric] Verifying registration...");
      await webauthnVerifyMutation.mutateAsync({
        response: attResp,
      });
      console.log("[Biometric] Registration verified successfully!");

      toast.success(t("dashboard.biometricActivated"));
      setShowBiometricSetup(false);
      utils.webauthn.checkBiometricStatus.invalidate();
    } catch (err: any) {
      console.error("[Biometric] Registration failed:", err);
      console.error("[Biometric] Error details:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      
      let errorMessage = t("dashboard.biometricError");
      if (err.name === 'NotAllowedError') {
        errorMessage = t("dashboard.permissionDenied");
      } else if (err.name === 'InvalidStateError') {
        errorMessage = t("dashboard.credentialExists");
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }
      
      toast.error(errorMessage);
      setShowBiometricSetup(false);
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
  const isSharedFolder = activeFolderView ? sharedFolders.some((sf: any) => sf.folderId === activeFolderView) : false;
  const activeFolder = activeFolderView 
    ? (folders.find((f: any) => f.id === activeFolderView) || 
       sharedFolders.find((sf: any) => sf.folderId === activeFolderView)?.folder)
    : null;
  const activeFolderCredentials = activeFolderView ? folderCredentials : [];
  
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
    // Save current scroll position before opening folder
    setSavedScrollPosition(window.scrollY);
    setActiveFolderView(folderId);
    setSearchQuery("");
    setFolderSearchQuery("");
  };

  const renderCredentialCard = (cred: any, showMoveOption: boolean = true) => {
    const isExpanded = expandedCredentials.has(cred.id);
    
    return (
      <Card key={cred.id} className="p-3 md:p-4 border border-border/20 hover:border-accent/50 transition-all duration-300 ease-[cubic-bezier(0.4,0.0,0.2,1)] hover:shadow-lg">
        <div className="flex flex-col gap-2">
          {/* Header Row: Title + Buttons */}
          <div className="flex items-start justify-between gap-2">
            <div 
              className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer" 
              onClick={() => toggleCredentialExpansion(cred.id)}
            >
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.4,0.0,0.2,1)] flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              <p className="font-semibold text-sm md:text-base truncate">{cred.platformName}</p>
              {(cred.username || cred.email) && (
                <span className="text-xs text-muted-foreground truncate">• {cred.username || cred.email}</span>
              )}
            </div>
            
            {!isSharedFolder && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setSelectedCredentialForEdit(cred); setShowEditCredentialModal(true); }}>
                  <Edit className="w-4 h-4" />
                </Button>
                {showMoveOption && (
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setSelectedCredentialForMove(cred); setShowMoveDialog(true); }}>
                    <Folder className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDeleteCredential(cred.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
            
          {/* Expanded Content: Full Width */}
          {isExpanded && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                {/* Username with copy button */}
                {cred.username && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground min-w-[60px] md:min-w-[70px]">{t("dashboard.username")}</span>
                    <code className="text-xs bg-card/50 px-1.5 py-0.5 rounded border border-border/20 flex-1 truncate">{cred.username}</code>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={() => copyToClipboard(cred.username)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                
                {/* Email with copy button */}
                {cred.email && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground min-w-[60px] md:min-w-[70px]">{t("dashboard.email")}</span>
                    <code className="text-xs bg-card/50 px-1.5 py-0.5 rounded border border-border/20 flex-1 truncate">{cred.email}</code>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={() => copyToClipboard(cred.email)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                
                {/* Password with eye and copy buttons */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground min-w-[60px] md:min-w-[70px]">{t("dashboard.password")}</span>
                  <code className="text-xs bg-card/50 px-1.5 py-0.5 rounded border border-border/20 flex-1 truncate">
                    {visiblePasswords.has(cred.id) ? cred.encryptedPassword : "••••••••••••"}
                  </code>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={() => togglePasswordVisibility(cred.id)}>
                    {visiblePasswords.has(cred.id) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={() => copyToClipboard(cred.encryptedPassword)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Notes */}
                {cred.notes && (
                  <div className="mt-2 pt-2 border-t border-border/20">
                    <p className="text-xs text-muted-foreground mb-0.5">{t("dashboard.notes")}</p>
                    <p className="text-xs md:text-sm text-foreground/80 break-words">{cred.notes}</p>
                  </div>
                )}
            </div>
          )}
        </div>
      </Card>
    );
  };

  // Folder Detail View
  if (activeFolderView && activeFolder) {
    return (
      <AppLayout currentPath="/dashboard">
        <div className="container py-6">
          <Button variant="ghost" className="mb-6" onClick={() => {
            setActiveFolderView(null);
            // Restore scroll position after React re-renders
            setTimeout(() => {
              window.scrollTo({ top: savedScrollPosition, behavior: 'instant' });
            }, 0);
          }}>
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Folder className="w-6 h-6 md:w-8 md:h-8 text-accent flex-shrink-0" />
              <div>
                <h1 className="text-lg md:text-2xl font-bold">{activeFolder.name}</h1>
                <p className="text-xs md:text-sm text-muted-foreground">{activeFolderCredentials.length} credential{activeFolderCredentials.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            {!isSharedFolder && (
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                <Button className="h-9 md:h-10 text-sm" onClick={() => { setSelectedFolderId(activeFolderView); setShowCredentialModal(true); }}>
                  <Plus className="w-4 h-4 mr-2" />Add New Credential
                </Button>
                <Button variant="outline" className="h-9 md:h-10 text-sm" onClick={() => setShowAddExistingModal(true)}>
                  <FolderPlus className="w-4 h-4 mr-2" />Add Existing
                </Button>
              </div>
            )}
            {isSharedFolder && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <Lock className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500 font-medium">Read Only</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredActiveFolderCredentials.map((cred: any) => renderCredentialCard(cred, false))}
            </div>
          ) : folderSearchQuery ? (
            <Card className="p-12 border border-border/20 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No credentials match your filter</p>
            </Card>
          ) : (
            <Card className="p-8 text-center border-dashed border-2 border-border/30">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isSharedFolder ? "This shared folder is empty" : "No credentials in this folder yet"}
              </p>
            </Card>       )}

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
        
        <EditCredentialModal
          open={showEditCredentialModal}
          onOpenChange={setShowEditCredentialModal}
          credential={selectedCredentialForEdit}
          folders={folders}
        />
        </div>
      </AppLayout>
    );
  }

  // Main Dashboard View
  return (
    <AppLayout currentPath="/dashboard">
      <div className="container py-6">
        {/* Renewal Banner */}
        {userPlan?.subscriptionEndDate && userPlan?.name !== "Free" && (
          <RenewalBanner 
            subscriptionEndDate={userPlan.subscriptionEndDate} 
            planName={userPlan.name} 
          />
        )}

        {/* Subscription Expired Modal */}
        {daysRemaining !== null && (
          <SubscriptionExpiredModal 
            open={daysRemaining <= 3}
            daysRemaining={daysRemaining}
            planName={userPlan?.name || "Premium"}
          />
        )}

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-sm text-muted-foreground">Manage your passwords and credentials securely</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
          <Card 
            className="p-3 md:p-4 border border-border/20 cursor-pointer hover:border-accent/50 transition-colors" 
            onClick={() => setLocation('/pricing')}
          >
            <div className="flex flex-col items-start">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Current Plan</p>
              <p className="text-base md:text-xl font-bold text-accent">{planName}</p>
              <p className="text-xs text-muted-foreground mt-1">Click to upgrade</p>
            </div>
          </Card>
          <Card className="p-3 md:p-4 border border-border/20">
            <div className="grid grid-cols-2 gap-3 md:gap-4 h-full">
              <div className="flex flex-col items-start justify-center">
                <p className="text-xs text-muted-foreground mb-1">Credentials</p>
                <p className="text-base md:text-lg font-bold">{credentials.length}/{(maxKeys === -1 || maxKeys >= 999999) ? "∞" : maxKeys}</p>
              </div>
              <div className="flex flex-col items-start justify-center border-l border-border/20 pl-3 md:pl-4">
                <p className="text-xs text-muted-foreground mb-1">Folders</p>
                <p className="text-base md:text-lg font-bold">{folders.length}/{(maxFolders === -1 || maxFolders >= 999999) ? "∞" : maxFolders}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 md:p-4 border border-border/20">
            <div className="flex flex-col items-start">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Subscription</p>
              {userPlan?.subscriptionEndDate ? (
                <>
                  <p className="text-base md:text-xl font-bold">
                    {(() => {
                      const daysRemaining = Math.max(0, Math.ceil((new Date(userPlan.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                      if (daysRemaining === 0) return <span className="text-red-500">Expired</span>;
                      if (daysRemaining <= 3) return <span className="text-red-500">{daysRemaining} days</span>;
                      if (daysRemaining <= 7) return <span className="text-orange-500">{daysRemaining} days</span>;
                      return <span className="text-green-500">{daysRemaining} days</span>;
                    })()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Days remaining</p>
                </>
              ) : (
                <>
                  <p className="text-base md:text-xl font-bold text-green-500">∞</p>
                  <p className="text-xs text-muted-foreground mt-1">No expiration</p>
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="mb-6">
          {/* Primary Actions */}
          {/* Mobile: Single Dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="w-full h-12">
                  <Plus className="w-4 h-4 mr-2" />Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[calc(100vw-2rem)]">
                <DropdownMenuItem onClick={() => { setSelectedFolderId(undefined); setShowCredentialModal(true); }} disabled={isSubscriptionExpired}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credential
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowFolderModal(true)} disabled={isSubscriptionExpired}>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create Folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPasswordGenerator(true)}>
                  <Lock className="w-4 h-4 mr-2" />
                  Generate Password
                </DropdownMenuItem>
                {userPlan && userPlan.name !== "Free" && (
                  <>
                    <DropdownMenuItem onClick={() => setShowImportModal(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Credentials
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Credentials
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop: Grid of Buttons */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button size="lg" className="w-full h-12" onClick={() => { setSelectedFolderId(undefined); setShowCredentialModal(true); }} disabled={isSubscriptionExpired}>
              <Plus className="w-4 h-4 mr-2" />Add Credential
            </Button>
            <Button size="lg" variant="outline" className="w-full h-12" onClick={() => setShowFolderModal(true)} disabled={isSubscriptionExpired}>
              <FolderPlus className="w-4 h-4 mr-2" />Create Folder
            </Button>
            <Button size="lg" variant="outline" className="w-full h-12" onClick={() => setShowPasswordGenerator(true)}>
              <Lock className="w-4 h-4 mr-2" />Generate Password
            </Button>
            {userPlan && userPlan.name !== "Free" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="lg" variant="outline" className="w-full h-12">
                    <MoreVertical className="w-4 h-4 mr-2" />More Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                  <DropdownMenuItem onClick={() => setShowImportModal(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Credentials
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Credentials
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
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
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">Search Results</h3>
            <div className="space-y-4">
              {filteredFolders.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Folders</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...filteredFolders].reverse().map((folder: any) => (
                      <Card key={`folder-${folder.id}`} className="group relative p-4 border border-border/20 hover:border-accent/50 hover:shadow-lg cursor-pointer transition-all" onClick={() => openFolderView(folder.id)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                            <Folder className="w-5 h-5 text-accent" />
                          </div>
                          {folder.isShared && (
                            <div className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
                              Shared
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm mb-1 truncate">{folder.name}</h4>
                        <p className="text-xs text-muted-foreground">{credentialsByFolder[folder.id]?.length || 0} credentials</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {filteredCredentials.length > 0 && !isSubscriptionExpired && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Credentials</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCredentials.map((cred: any) => renderCredentialCard(cred))}
                  </div>
                </div>
              )}
              
              {isSubscriptionExpired && (
                <div className="p-6 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-center">
                  <Lock className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Subscription Expired</p>
                  <p className="text-sm text-red-600 dark:text-red-500 mb-4">Renew your subscription to access your credentials</p>
                  <Button onClick={() => setLocation('/pricing')}>Renew Now</Button>
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

        {searchQuery.length === 0 && planName !== "Corporate" && planName !== "Enterprise" && (
          <div className="mb-8 p-4 rounded-[15px] bg-accent/10 border border-accent/30">
            <div className="flex items-center justify-between gap-4">
              <div className="pr-4 md:pr-8">
                <p className="font-semibold">Upgrade Your Plan</p>
                <p className="text-sm text-muted-foreground">Get more credentials and folders</p>
              </div>
              <Button onClick={() => setLocation("/pricing")} className="shrink-0">Upgrade Now</Button>
            </div>
          </div>
        )}

        {searchQuery.length === 0 && folders && folders.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Your Folders</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...folders].reverse().map((folder: any) => {
                const folderCreds = credentialsByFolder[folder.id] || [];
                return (
                  <Card 
                    key={folder.id} 
                    className="group relative p-4 border border-border/20 hover:border-accent/50 cursor-pointer transition-colors"
                    onClick={() => openFolderView(folder.id)}
                  >
                    <div className="flex flex-col gap-3">
                      {/* Header with Icon and Share Badge */}
                      <div className="flex items-center justify-between">
                        <Folder className="w-6 h-6 text-accent" />
                        <div className="flex items-center gap-1">
                          {folder.shareCount > 0 && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-accent/10 border border-accent/20 rounded-full">
                              <Users className="w-3 h-3 text-accent" />
                              <span className="text-xs text-accent font-medium">{folder.shareCount}</span>
                            </div>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:border hover:border-accent/50 h-7 w-7 p-0"
                            onClick={(e) => { e.stopPropagation(); setSelectedFolderId(folder.id); setShowCredentialModal(true); }}
                            title="Add credential"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:border hover:border-accent/50 h-7 w-7 p-0"
                            onClick={(e) => { e.stopPropagation(); setSelectedFolderForEdit(folder); setShowEditFolderModal(true); }}
                            title="Edit folder"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:border hover:border-accent/50 h-7 w-7 p-0"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setSelectedFolderForShare({ id: folder.id, name: folder.name }); 
                              setShowShareFolderModal(true); 
                            }}
                            title="Share folder"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:border hover:border-destructive/50 h-7 w-7 p-0"
                            onClick={(e) => { e.stopPropagation(); openDeleteFolderDialog(folder); }}
                            title="Delete folder"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {/* Folder Info */}
                      <div>
                        <p className="font-semibold truncate">{folder.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {folderCreds.length} credential{folderCreds.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {searchQuery.length === 0 && sharedFolders && sharedFolders.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Shared with Me</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sharedFolders.map((sharedFolder: any) => {
                const credCount = sharedFolder.credentialCount || 0;
                return (
                  <Card 
                    key={sharedFolder.id} 
                    className="group relative p-4 border border-border/20 hover:border-green-500/50 cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => openFolderView(sharedFolder.folderId)}
                  >
                    <div className="flex flex-col gap-3">
                      {/* Header with Icon and Share Badge */}
                      <div className="flex items-center justify-between">
                        <Folder className="w-6 h-6 text-green-500" />
                        <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          Shared
                        </div>
                      </div>

                      {/* Folder Name and Credentials Count */}
                      <div>
                        <p className="font-semibold truncate">{sharedFolder.folder.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {credCount} credential{credCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {searchQuery.length === 0 && credentialsWithoutFolder && credentialsWithoutFolder.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Your Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {credentialsWithoutFolder.map((cred: any) => renderCredentialCard(cred))}
            </div>
          </div>
        )}
        
        {searchQuery.length === 0 && credentials && credentials.length === 0 && (
          <Card className="p-12 border border-border/20 text-center">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No credentials yet. Create your first one!</p>
          </Card>
        )}
      </div>

      {/* Modals */}
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
      <PasswordGeneratorModal open={showPasswordGenerator} onOpenChange={setShowPasswordGenerator} />
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
      <BiometricSetupModal
        open={showBiometricSetup}
        onClose={() => setShowBiometricSetup(false)}
        onEnable={handleActivateBiometric}
      />
      <ExportCredentialsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        credentials={credentials}
      />
      <ImportCredentialsModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
      />
      <EditCredentialModal
        open={showEditCredentialModal}
        onOpenChange={setShowEditCredentialModal}
        credential={selectedCredentialForEdit}
        folders={folders}
      />
      <EditFolderModal
        open={showEditFolderModal}
        onOpenChange={setShowEditFolderModal}
        folder={selectedFolderForEdit}
      />
      {selectedFolderForShare && (
        <ShareFolderModal
          open={showShareFolderModal}
          onClose={() => {
            setShowShareFolderModal(false);
            setSelectedFolderForShare(null);
          }}
          folderId={selectedFolderForShare.id}
          folderName={selectedFolderForShare.name}
          userPlan={userPlan?.name || "Free"}
        />
      )}
    </AppLayout>
  );
}
