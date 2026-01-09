import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface CreateFolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFolderModal({ open, onOpenChange }: CreateFolderModalProps) {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [showLimitAlert, setShowLimitAlert] = useState(false);

  const createMutation = trpc.folders.create.useMutation();
  const { data: userPlan } = trpc.plans.getUserPlan.useQuery();
  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has reached folder limit
    const maxFolders = userPlan?.maxFolders || 1;
    const currentFolders = userPlan?.foldersUsed || 0;
    
    if (currentFolders >= maxFolders) {
      setShowLimitAlert(true);
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
      });
      toast.success("Folder created successfully!");
      setFormData({ name: "", description: "" });
      onOpenChange(false);
      utils.folders.list.invalidate();
      utils.plans.getUserPlan.invalidate();
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
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
              <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Folder Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You've reached the maximum number of folders ({userPlan?.maxFolders}) for your current plan. Upgrade to create more folders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowLimitAlert(false);
              onOpenChange(false);
              setLocation("/pricing");
            }}>
              View Plans
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
