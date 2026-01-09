import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Folder, Trash2, FolderMinus, AlertTriangle } from "lucide-react";

interface DeleteFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: number;
  folderName: string;
  credentialCount: number;
  onDeleted?: () => void;
}

export function DeleteFolderDialog({
  open,
  onOpenChange,
  folderId,
  folderName,
  credentialCount,
  onDeleted,
}: DeleteFolderDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMutation = trpc.folders.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async (deleteCredentials: boolean) => {
    setIsDeleting(true);
    try {
      const result = await deleteMutation.mutateAsync({ 
        id: folderId, 
        deleteCredentials 
      });
      
      if (deleteCredentials) {
        toast.success(`Folder "${folderName}" and all credentials deleted`);
      } else {
        toast.success(`Folder "${folderName}" deleted. ${result.movedCredentials} credential(s) moved to "Your Credentials"`);
      }
      
      utils.folders.list.invalidate();
      utils.credentials.list.invalidate();
      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      toast.error("Failed to delete folder");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Delete Folder
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{folderName}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {credentialCount > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                This folder contains <span className="font-semibold text-foreground">{credentialCount} credential{credentialCount !== 1 ? 's' : ''}</span>. 
                Choose what to do with them:
              </p>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => handleDelete(false)}
                  disabled={isDeleting}
                >
                  <FolderMinus className="w-5 h-5 mr-3 text-accent" />
                  <div className="text-left">
                    <p className="font-medium">Delete folder only</p>
                    <p className="text-xs text-muted-foreground">
                      Credentials will be moved to "Your Credentials"
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4 border-destructive/50 hover:bg-destructive/10"
                  onClick={() => handleDelete(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-5 h-5 mr-3 text-destructive" />
                  <div className="text-left">
                    <p className="font-medium text-destructive">Delete folder and all credentials</p>
                    <p className="text-xs text-muted-foreground">
                      This action cannot be undone
                    </p>
                  </div>
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                This folder is empty. Are you sure you want to delete it?
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(false)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>

        {credentialCount > 0 && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
