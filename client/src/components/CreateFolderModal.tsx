import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Folder, FileText, FolderPlus } from "lucide-react";

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
  const { data: folders = [] } = trpc.folders.list.useQuery();
  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has reached folder limit - count actual folders, not stored counter
    const maxFolders = userPlan?.maxFolders || 1;
    const currentFolders = folders.length;
    
    // Only check limit if maxFolders is not -1 (unlimited)
    if (maxFolders !== -1 && currentFolders >= maxFolders) {
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
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="pb-4 border-b border-border/30 bg-gradient-to-br from-accent/5 to-transparent">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FolderPlus className="w-5 h-5 text-accent" />
              Create New Folder
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* Folder Name */}
            <div className="space-y-2">
              <Label htmlFor="folderName" className="text-sm font-medium flex items-center gap-2">
                <Folder className="w-4 h-4 text-muted-foreground" />
                Folder Name *
              </Label>
              <Input
                id="folderName"
                type="text"
                placeholder="e.g., Work, Personal, Finance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 border-border/50 focus:border-accent"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Add a description for this folder..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="resize-none border-border/50 focus:border-accent min-h-[80px]"
              />
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-4 border-t border-border/30 bg-gradient-to-br from-muted/20 to-transparent -mx-6 px-6 -mb-6 pb-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="flex-1 h-11 border-border/50 hover:border-border"
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-11 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" 
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Create
                  </>
                )}
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
