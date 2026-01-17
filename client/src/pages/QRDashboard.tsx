import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateQRCodeModal from "@/components/CreateQRCodeModal";
import EditQRCodeModal from "@/components/EditQRCodeModal";
import QRExportModal from "@/components/QRExportModal";
import { ShareQRFolderModal } from "@/components/ShareQRFolderModal";
import { CreateQRFolderModal } from "@/components/CreateQRFolderModal";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Folder, QrCode, Download, Trash2, Eye, FolderPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppLayout } from "@/components/AppLayout";

export default function QRDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
  const [selectedQRCode, setSelectedQRCode] = useState<any>(null);
  const [showQRDetail, setShowQRDetail] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);

  const { data: qrCodes = [], refetch: refetchQRCodes } = trpc.qrCodes.list.useQuery();
  const { data: folders = [], refetch: refetchFolders } = trpc.qrCodes.folders.list.useQuery();
  const deleteQRMutation = trpc.qrCodes.delete.useMutation();
  const deleteFolderMutation = trpc.qrCodes.folders.delete.useMutation();
  const utils = trpc.useUtils();

  // Filter QR codes
  const qrCodesByFolder = qrCodes.reduce((acc: any, qr: any) => {
    const folderId = qr.folderId || 0;
    if (!acc[folderId]) acc[folderId] = [];
    acc[folderId].push(qr);
    return acc;
  }, {});

  const filteredQRCodes = (qrCodesByFolder[0] || []).filter((qr: any) =>
    qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteQR = async (id: number) => {
    if (!confirm("Are you sure you want to delete this QR code?")) return;
    try {
      await deleteQRMutation.mutateAsync({ id });
      await refetchQRCodes();
      toast.success("QR code deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete QR code");
    }
  };

  const handleDeleteFolder = async (id: number) => {
    if (!confirm("Are you sure you want to delete this folder? All QR codes inside will be moved to 'No Folder'.")) return;
    try {
      await deleteFolderMutation.mutateAsync({ id });
      await refetchFolders();
      await refetchQRCodes();
      toast.success("Folder deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete folder");
    }
  };

  const handleDownloadQR = (qrCode: any) => {
    setSelectedQRCode(qrCode);
    setShowExportModal(true);
  };

  const handleViewQR = (qrCode: any) => {
    setSelectedQRCode(qrCode);
    setShowQRDetail(true);
  };

  const handleEditQR = (qrCode: any) => {
    setSelectedQRCode(qrCode);
    setShowEditModal(true);
  };

  const openFolderView = (folderId: number) => {
    setActiveFolderId(folderId);
  };

  const handleShareFolder = (folder: any) => {
    setSelectedFolder(folder);
    setShowShareModal(true);
  };

  // Folder View
  if (activeFolderId !== null) {
    const currentFolder = folders.find(f => f.id === activeFolderId);
    const folderQRCodes = qrCodesByFolder[activeFolderId] || [];

    return (
      <AppLayout currentPath="/qr-codes">
        <div className="container py-8">
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
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEditQR(qrCode)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
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
          defaultFolderId={activeFolderId}
        />

        <EditQRCodeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            refetchQRCodes();
            toast.success("QR code updated successfully");
          }}
          qrCode={selectedQRCode}
          folders={folders}
        />

        <QRExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          qrCode={selectedQRCode}
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
      </AppLayout>
    );
  }

  // Main Dashboard View
  return (
    <AppLayout currentPath="/qr-codes">
      <div className="container py-8">
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
          <div className="relative max-w-md">
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
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareFolder(folder);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:border hover:border-accent/50 h-7 w-7 p-0"
                            title="Share folder"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                          </Button>
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
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEditQR(qrCode)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
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
        </div>
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
        defaultFolderId={activeFolderId}
      />

      <EditQRCodeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          refetchQRCodes();
          toast.success("QR code updated successfully");
        }}
        qrCode={selectedQRCode}
        folders={folders}
      />

      <QRExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        qrCode={selectedQRCode}
      />

      <CreateQRFolderModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSuccess={() => {
          refetchFolders();
          toast.success("Folder created successfully");
        }}
      />

      <ShareQRFolderModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        folderId={selectedFolder?.id || 0}
        folderName={selectedFolder?.name || ""}
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
    </AppLayout>
  );
}
