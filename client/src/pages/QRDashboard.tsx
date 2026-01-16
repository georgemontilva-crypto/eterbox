import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateQRCodeModal from "@/components/CreateQRCodeModal";
import { CreateQRFolderModal } from "@/components/CreateQRFolderModal";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Folder, QrCode, Download, Trash2, Eye, FolderPlus, ArrowLeft, Edit, Shield } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { MobileMenu } from "@/components/MobileMenu";
import { useLocation } from "wouter";

export default function QRDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { data: userPlan } = trpc.plans.getUserPlan.useQuery();
  const { data: adminCheck } = trpc.admin.isAdmin.useQuery();
  
  const planName = userPlan?.name || "Free";
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
  const [selectedQRCode, setSelectedQRCode] = useState<any>(null);
  const [showQRDetail, setShowQRDetail] = useState(false);

  const { data: qrCodes = [], refetch: refetchQRCodes } = trpc.qrCodes.list.useQuery();
  const { data: folders = [], refetch: refetchFolders } = trpc.qrCodes.folders.list.useQuery();
  const deleteQRMutation = trpc.qrCodes.delete.useMutation();
  const deleteFolderMutation = trpc.qrCodes.folders.delete.useMutation();
  const utils = trpc.useUtils();

  // Filter QR codes
  const filteredQRCodes = useMemo(() => {
    let filtered = qrCodes;

    // Filter by folder
    if (activeFolderId !== null) {
      filtered = filtered.filter(qr => qr.folderId === activeFolderId);
    } else {
      // Show only QR codes without folder
      filtered = filtered.filter(qr => !qr.folderId);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(qr =>
        qr.name.toLowerCase().includes(query) ||
        qr.content.toLowerCase().includes(query) ||
        qr.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [qrCodes, activeFolderId, searchQuery]);

  // Get QR codes by folder
  const qrCodesByFolder = useMemo(() => {
    const result: Record<number, any[]> = {};
    qrCodes.forEach(qr => {
      if (qr.folderId) {
        if (!result[qr.folderId]) {
          result[qr.folderId] = [];
        }
        result[qr.folderId].push(qr);
      }
    });
    return result;
  }, [qrCodes]);

  const handleDeleteQR = async (id: number) => {
    if (!confirm("Are you sure you want to delete this QR code?")) return;

    try {
      await deleteQRMutation.mutateAsync({ id });
      toast.success("QR code deleted successfully");
      refetchQRCodes();
    } catch (error) {
      toast.error("Failed to delete QR code");
    }
  };

  const handleDeleteFolder = async (id: number) => {
    if (!confirm("Are you sure you want to delete this folder? QR codes inside will not be deleted.")) return;

    try {
      await deleteFolderMutation.mutateAsync({ id });
      toast.success("Folder deleted successfully");
      refetchFolders();
      if (activeFolderId === id) {
        setActiveFolderId(null);
      }
    } catch (error) {
      toast.error("Failed to delete folder");
    }
  };

  const handleDownloadQR = (qrCode: any) => {
    const link = document.createElement("a");
    link.href = qrCode.qrImage;
    link.download = `${qrCode.name}.png`;
    link.click();
  };

  const handleViewQR = (qrCode: any) => {
    setSelectedQRCode(qrCode);
    setShowQRDetail(true);
  };

  const openFolderView = (folderId: number) => {
    setActiveFolderId(folderId);
  };

  // Folder View
  if (activeFolderId !== null) {
    const currentFolder = folders.find(f => f.id === activeFolderId);
    const folderQRCodes = qrCodesByFolder[activeFolderId] || [];

    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50 safe-area-top safe-area-x">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div>
                <MobileMenu 
                  planName={planName} 
                  onLogout={logout}
                  userEmail={user?.email}
                />
              </div>
              <div className="flex items-center gap-3">
                {adminCheck?.isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation("/admin")}
                    className="hidden md:flex items-center gap-2 text-accent hover:text-accent/80"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container py-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveFolderId(null)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Folders
            </Button>

            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{currentFolder?.name}</h1>
              {currentFolder?.description && (
                <p className="text-muted-foreground">{currentFolder.description}</p>
              )}
            </div>

            <div className="mb-6">
              <Button onClick={() => setShowCreateModal(true)} size="lg" className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add QR Code to Folder
              </Button>
            </div>

            {folderQRCodes.length === 0 ? (
              <Card className="p-12 border border-border/20 text-center">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No QR codes in this folder</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first QR code to this folder
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {folderQRCodes.map((qrCode) => (
                  <Card key={qrCode.id} className="p-4 border border-border/20 hover:border-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={qrCode.qrImage}
                          alt={qrCode.name}
                          className="w-16 h-16 rounded border border-border/20"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{qrCode.name}</h3>
                          <p className="text-sm text-muted-foreground">{qrCode.type}</p>
                          {qrCode.scans > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Scans: {qrCode.scans}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleViewQR(qrCode)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDownloadQR(qrCode)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDeleteQR(qrCode.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
        </main>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50 safe-area-top safe-area-x">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              {/* Menu hamburguesa - visible en todas las pantallas */}
              <div>
                <MobileMenu 
                  planName={planName} 
                  onLogout={logout}
                  userEmail={user?.email}
                />
              </div>
              
              {/* Admin Button - only on desktop */}
              <div className="flex items-center gap-3">
                {adminCheck?.isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation("/admin")}
                    className="hidden md:flex items-center gap-2 text-accent hover:text-accent/80"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">QR Codes</h1>
            <p className="text-muted-foreground">Manage your QR codes and organize them in folders</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button size="lg" className="w-full" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create QR Code
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={() => setShowFolderModal(true)}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search QR codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-[15px] border border-border/30 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
              />
            </div>
          </div>

          {/* Folders Section */}
          {folders.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Your Folders</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {folders.map((folder) => {
                  const folderQRs = qrCodesByFolder[folder.id] || [];
                  return (
                    <Card
                      key={folder.id}
                      className="p-4 border border-border/20 hover:border-accent/50 cursor-pointer transition-colors group"
                      onClick={() => openFolderView(folder.id)}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <Folder className="w-6 h-6 text-accent" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFolder(folder.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:border hover:border-destructive/50 h-7 w-7 p-0"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </div>
                        <div>
                          <p className="font-semibold truncate">{folder.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {folderQRs.length} QR code{folderQRs.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* QR Codes without folder */}
          <div>
            <h3 className="text-xl font-bold mb-4">Your QR Codes</h3>
            {filteredQRCodes.length === 0 ? (
              <Card className="p-12 border border-border/20 text-center">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No QR codes yet</h3>
                <p className="text-muted-foreground">
                  Create your first QR code to get started
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredQRCodes.map((qrCode) => (
                  <Card key={qrCode.id} className="p-4 border border-border/20 hover:border-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={qrCode.qrImage}
                          alt={qrCode.name}
                          className="w-16 h-16 rounded border border-border/20"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{qrCode.name}</h3>
                          <p className="text-sm text-muted-foreground">{qrCode.type}</p>
                          {qrCode.scans > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Scans: {qrCode.scans}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleViewQR(qrCode)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDownloadQR(qrCode)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDeleteQR(qrCode.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
        </main>
      </div>

      {/* Modals */}
      <CreateQRCodeModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            refetchQRCodes();
            toast.success("QR code created successfully");
          }}
          folders={folders}
      />

      <CreateQRFolderModal
          isOpen={showFolderModal}
          onClose={() => setShowFolderModal(false)}
          onSuccess={() => {
            refetchFolders();
            toast.success("Folder created successfully");
          }}
      />

      {/* QR Detail Modal */}
      {showQRDetail && selectedQRCode && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowQRDetail(false)}
          >
            <Card
              className="max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">{selectedQRCode.name}</h2>
              <img
                src={selectedQRCode.qrImage}
                alt={selectedQRCode.name}
                className="w-full rounded-lg border-2 border-border mb-4"
              />
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Type:</span> {selectedQRCode.type}
                </div>
                <div>
                  <span className="font-semibold">Content:</span>{" "}
                  <span className="break-all">{selectedQRCode.content}</span>
                </div>
                {selectedQRCode.description && (
                  <div>
                    <span className="font-semibold">Description:</span>{" "}
                    {selectedQRCode.description}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Scans:</span> {selectedQRCode.scans}
                </div>
                <div>
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(selectedQRCode.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => handleDownloadQR(selectedQRCode)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowQRDetail(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
      )}
    </div>
  );
}
