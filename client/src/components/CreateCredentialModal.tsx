import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

interface CreateCredentialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: number | null;
}

export function CreateCredentialModal({ open, onOpenChange, folderId }: CreateCredentialModalProps) {
  const [formData, setFormData] = useState({
    platformName: "",
    username: "",
    email: "",
    password: "",
    notes: "",
  });

  const createMutation = trpc.credentials.create.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        platformName: formData.platformName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        notes: formData.notes,
        folderId: folderId || undefined,
      });
      toast.success("Credential created successfully!");
      setFormData({ platformName: "", username: "", email: "", password: "", notes: "" });
      onOpenChange(false);
      utils.credentials.list.invalidate();
    } catch (error) {
      toast.error("Failed to create credential");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Credential</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <input
              type="text"
              placeholder="e.g., Gmail, GitHub, Shopify"
              value={formData.platformName}
              onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
              className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
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
              className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 rounded-[15px] bg-input border border-border/30 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              placeholder="Add any notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
  );
}
