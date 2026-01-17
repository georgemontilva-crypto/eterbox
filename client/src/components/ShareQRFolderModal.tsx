import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { X, Users, Mail, Trash2, Shield, AlertCircle, Edit, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShareQRFolderModalProps {
  open: boolean;
  onClose: () => void;
  folderId: number;
  folderName: string;
  userPlan: string;
}

export function ShareQRFolderModal({ open, onClose, folderId, folderName, userPlan }: ShareQRFolderModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<'read' | 'edit'>('edit');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const utils = trpc.useUtils();
  const shareMutation = trpc.qrCodes.folders.share.useMutation();
  const unshareMutation = trpc.qrCodes.folders.unshare.useMutation();
  const { data: shares, isLoading } = trpc.qrCodes.folders.getShares.useQuery(
    { folderId },
    { enabled: open }
  );

  const canShare = userPlan === "Corporate" || userPlan === "Enterprise";

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter an email address");
      return;
    }

    try {
      await shareMutation.mutateAsync({
        folderId,
        userEmail: email.trim(),
        permission, // Use selected permission
      });

      setSuccess("QR folder shared successfully!");
      setEmail("");
      setPermission('edit');
      
      // Refresh shares list
      utils.qrCodes.folders.getShares.invalidate({ folderId });
      utils.qrCodes.folders.list.invalidate();
      utils.qrCodes.folders.getSharedWithMe.invalidate();
    } catch (err: any) {
      setError(err.message || "Failed to share QR folder");
    }
  };

  const handleUnshare = async (sharedWithUserId: number) => {
    setError("");
    setSuccess("");

    try {
      await unshareMutation.mutateAsync({
        folderId,
        sharedWithUserId,
      });

      setSuccess("Access removed successfully");
      
      // Refresh shares list
      utils.qrCodes.folders.getShares.invalidate({ folderId });
      utils.qrCodes.folders.list.invalidate();
      utils.qrCodes.folders.getSharedWithMe.invalidate();
    } catch (err: any) {
      setError(err.message || "Failed to remove access");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-[15px] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-accent" />
            <div>
              <h2 className="text-xl font-bold">Share QR Folder</h2>
              <p className="text-sm text-muted-foreground">{folderName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Plan restriction warning */}
          {!canShare && (
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-accent">Corporate or Enterprise Plan Required</p>
                <p className="text-sm text-muted-foreground mt-1">
                  QR folder sharing is only available for Corporate and Enterprise plans. Upgrade your plan to share folders with your team.
                </p>
              </div>
            </div>
          )}

          {/* Error/Success messages */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Share form */}
          {canShare && (
            <form onSubmit={handleShare} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Share with
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full h-12 pl-10 pr-4 bg-background border border-border/20 rounded-[15px] focus:border-accent focus:outline-none"
                      disabled={shareMutation.isPending}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={shareMutation.isPending || !email}
                    className="h-12 px-6"
                  >
                    {shareMutation.isPending ? "Sharing..." : "Share"}
                  </Button>
                </div>
              </div>
              
              {/* Permission selector */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Permission Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPermission('edit')}
                    disabled={shareMutation.isPending}
                    className={`h-12 px-4 rounded-[15px] border transition-all ${
                      permission === 'edit'
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'bg-background border-border/20 hover:border-accent/50'
                    }`}
                  >
                    <Edit className="w-4 h-4 inline mr-2" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermission('read')}
                    disabled={shareMutation.isPending}
                    className={`h-12 px-4 rounded-[15px] border transition-all ${
                      permission === 'read'
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'bg-background border-border/20 hover:border-accent/50'
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-2" />
                    View Only
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {permission === 'edit'
                    ? 'Can view, create, edit, and delete QR codes'
                    : 'Can only view and download QR codes'}
                </p>
              </div>
            </form>
          )}

          {/* Shared users list */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              Shared with ({shares?.length || 0})
            </h3>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : shares && shares.length > 0 ? (
              <div className="space-y-2">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-4 bg-background border border-border/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{share.sharedWithUser.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{share.sharedWithUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                        share.permission === 'edit'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-muted/50 text-muted-foreground'
                      }`}>
                        {share.permission === 'edit' ? (
                          <><Edit className="w-3 h-3" /> Can Edit</>
                        ) : (
                          <><Eye className="w-3 h-3" /> View Only</>
                        )}
                      </span>
                      <button
                        onClick={() => handleUnshare(share.sharedWithUserId)}
                        disabled={unshareMutation.isPending}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50"
                        title="Remove access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>This folder is not shared with anyone yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border/20">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
