import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Folder } from "lucide-react";

interface MoveToFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentialId: number;
  currentFolderId?: number | null;
  folders: any[];
}

export function MoveToFolderDialog({
  open,
  onOpenChange,
  credentialId,
  currentFolderId,
  folders,
}: MoveToFolderDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(currentFolderId || null);
  const updateMutation = trpc.credentials.update.useMutation();
  const utils = trpc.useUtils();

  const handleMove = async () => {
    try {
      await updateMutation.mutateAsync({
        id: credentialId,
        folderId: selectedFolderId || undefined,
      });
      toast.success("Credential moved successfully!");
      onOpenChange(false);
      utils.credentials.list.invalidate();
    } catch (error) {
      toast.error("Failed to move credential");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move to Folder</DialogTitle>
          <DialogDescription>
            Select a folder to move this credential to
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div
            onClick={() => setSelectedFolderId(null)}
            className={`p-3 rounded-[15px] border-2 cursor-pointer transition-colors ${
              selectedFolderId === null
                ? "border-accent bg-accent/10"
                : "border-border/30 hover:border-accent/50"
            }`}
          >
            <p className="font-semibold">No Folder</p>
            <p className="text-sm text-muted-foreground">Keep credential without a folder</p>
          </div>
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setSelectedFolderId(folder.id)}
              className={`p-3 rounded-[15px] border-2 cursor-pointer transition-colors ${
                selectedFolderId === folder.id
                  ? "border-accent bg-accent/10"
                  : "border-border/30 hover:border-accent/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-accent" />
                <p className="font-semibold">{folder.name}</p>
              </div>
              {folder.description && (
                <p className="text-sm text-muted-foreground mt-1">{folder.description}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleMove} disabled={updateMutation.isPending} className="flex-1">
            {updateMutation.isPending ? "Moving..." : "Move"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
