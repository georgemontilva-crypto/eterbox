import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateQRCodeModal from "@/components/CreateQRCodeModal";
import { CreateQRFolderModal } from "@/components/CreateQRFolderModal";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Folder, QrCode, Download, Trash2, Eye, FolderPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";

export default function QRDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border safe-area-top">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">QR Codes</h1>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowFolderModal(true)} variant="outline" size="sm">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </Button>
                <Button onClick={() => setShowCreateModal(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create QR Code
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search QR codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Folders */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Folders
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveFolderId(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeFolderId === null
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    All QR Codes ({qrCodes.length})
                  </button>
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        activeFolderId === folder.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <button
                        onClick={() => setActiveFolderId(folder.id)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4" />
                          <span>{folder.name}</span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="p-1 hover:bg-destructive/20 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content - QR Codes Grid */}
            <div className="lg:col-span-3">
              {activeFolderId !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFolderId(null)}
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All QR Codes
                </Button>
              )}

              {filteredQRCodes.length === 0 ? (
                <Card className="p-12 text-center">
                  <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No QR codes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first QR code to get started
                  </p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create QR Code
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredQRCodes.map((qrCode) => (
                    <Card key={qrCode.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col items-center">
                        <img
                          src={qrCode.qrImage}
                          alt={qrCode.name}
                          className="w-full max-w-[200px] rounded-lg border-2 border-border mb-3"
                        />
                        <h3 className="font-semibold text-center mb-1">{qrCode.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{qrCode.type}</p>
                        {qrCode.scans > 0 && (
                          <p className="text-xs text-muted-foreground mb-3">
                            Scans: {qrCode.scans}
                          </p>
                        )}
                        <div className="flex gap-2 w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewQR(qrCode)}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadQR(qrCode)}
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQR(qrCode.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
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
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
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
    </DashboardLayout>
  );
}
