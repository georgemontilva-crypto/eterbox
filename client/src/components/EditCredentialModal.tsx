import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EditCredentialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credential: any;
  folders: any[];
}

export function EditCredentialModal({ open, onOpenChange, credential, folders }: EditCredentialModalProps) {
  const [formData, setFormData] = useState({
    platformName: "",
    username: "",
    email: "",
    password: "",
    notes: "",
    selectedFolderId: "",
  });

  // Update form when credential changes
  useEffect(() => {
    if (credential) {
      setFormData({
        platformName: credential.platformName || "",
        username: credential.username || "",
        email: credential.email || "",
        password: credential.encryptedPassword || "",
        notes: credential.notes || "",
        selectedFolderId: credential.folderId || "",
      });
    }
  }, [credential]);

  const updateMutation = trpc.credentials.update.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        id: credential.id,
        platformName: formData.platformName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        notes: formData.notes,
        folderId: formData.selectedFolderId ? Number(formData.selectedFolderId) : undefined,
      });
      toast.success("Credential updated successfully!");
      onOpenChange(false);
      utils.credentials.list.invalidate();
      utils.credentials.listByFolder.invalidate();
    } catch (error) {
      toast.error("Failed to update credential");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pb-safe">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <input
              type="text"
              placeholder="e.g., Gmail, GitHub, Shopify"
              value={formData.platformName}
              onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              placeholder="Your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2.5 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2.5 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Folder (Optional)</label>
            <select
              value={formData.selectedFolderId}
              onChange={(e) => setFormData({ ...formData, selectedFolderId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent text-base"
            >
              <option value="">No folder</option>
              {folders && folders.map((folder: any) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              placeholder="Add any notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2.5 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent min-h-20 text-base"
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
