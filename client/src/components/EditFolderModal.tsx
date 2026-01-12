import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EditFolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: any;
}

export function EditFolderModal({ open, onOpenChange, folder }: EditFolderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Update form when folder changes
  useEffect(() => {
    if (folder) {
      setFormData({
        name: folder.name || "",
        description: folder.description || "",
      });
    }
  }, [folder]);

  const updateMutation = trpc.folders.update.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        id: folder.id,
        name: formData.name,
        description: formData.description,
      });
      toast.success("Folder updated successfully!");
      onOpenChange(false);
      utils.folders.list.invalidate();
    } catch (error) {
      toast.error("Failed to update folder");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Folder Name</label>
            <input
              type="text"
              placeholder="e.g., Work, Personal, Finance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              placeholder="Add a description for this folder..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent min-h-20"
            />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
