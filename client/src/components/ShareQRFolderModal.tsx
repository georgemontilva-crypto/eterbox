import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Share2, UserPlus, Mail, Shield } from "lucide-react";
import { trpc } from "../lib/trpc";
import { toast } from "sonner";

interface ShareQRFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId: number;
  folderName: string;
}

export function ShareQRFolderModal({ isOpen, onClose, folderId, folderName }: ShareQRFolderModalProps) {
  const [userEmail, setUserEmail] = useState("");
  const [permission, setPermission] = useState<'read' | 'edit'>('edit');
  const [isSharing, setIsSharing] = useState(false);

  const utils = trpc.useUtils();

  // Get current shares
  const { data: shares = [], refetch: refetchShares } = trpc.qrCodes.folders.getShares.useQuery(
    { folderId },
    { enabled: isOpen }
  );

  // Share mutation
  const shareMutation = trpc.qrCodes.folders.share.useMutation({
    onSuccess: () => {
      toast.success("QR folder shared successfully!");
      setUserEmail("");
      setPermission('edit');
      refetchShares();
      utils.qrCodes.folders.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to share QR folder");
    },
    onSettled: () => {
      setIsSharing(false);
    },
  });

  // Unshare mutation
  const unshareMutation = trpc.qrCodes.folders.unshare.useMutation({
    onSuccess: () => {
      toast.success("Access removed successfully");
      refetchShares();
      utils.qrCodes.folders.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove access");
    },
  });

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsSharing(true);
    shareMutation.mutate({
      folderId,
      userEmail: userEmail.trim(),
      permission,
    });
  };

  const handleUnshare = (sharedWithUserId: number) => {
    if (confirm("Are you sure you want to remove access for this user?")) {
      unshareMutation.mutate({
        folderId,
        sharedWithUserId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share QR Folder
          </DialogTitle>
          <DialogDescription>
            Share "{folderName}" with other users. They will be able to view and edit QR codes in this folder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Form */}
          <form onSubmit={handleShare} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                User Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                disabled={isSharing}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Permission Level
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={permission === 'edit' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setPermission('edit')}
                  disabled={isSharing}
                >
                  <span className="text-sm">✏️ Edit</span>
                </Button>
                <Button
                  type="button"
                  variant={permission === 'read' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setPermission('read')}
                  disabled={isSharing}
                >
                  <span className="text-sm">👁️ View Only</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {permission === 'edit' 
                  ? 'Can view, create, edit, and delete QR codes' 
                  : 'Can only view QR codes'}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSharing || !userEmail.trim()}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {isSharing ? "Sharing..." : "Share Folder"}
            </Button>
          </form>

          {/* Current Shares */}
          {shares.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Shared With</Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{share.sharedWithUser.email}</p>
                      {share.sharedWithUser.name && (
                        <p className="text-xs text-muted-foreground">{share.sharedWithUser.name}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {share.permission === 'edit' ? '✏️ Can edit' : '👁️ View only'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnshare(share.sharedWithUserId)}
                      disabled={unshareMutation.isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plan Notice */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> QR folder sharing is available for Corporate and Enterprise plans.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
