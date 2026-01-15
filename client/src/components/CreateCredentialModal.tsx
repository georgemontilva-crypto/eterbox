import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import * as React from "react";
import { toast } from "sonner";

interface CreateCredentialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: number | null;
  folders: any[];
  defaultFolderId?: number;
  defaultPassword?: string;
}

export function CreateCredentialModal({ open, onOpenChange, folderId, folders, defaultFolderId, defaultPassword }: CreateCredentialModalProps) {
  const [formData, setFormData] = useState({
    platformName: "",
    username: "",
    email: "",
    password: defaultPassword || "",
    notes: "",
    selectedFolderId: defaultFolderId || folderId || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update password when defaultPassword changes
  React.useEffect(() => {
    if (defaultPassword) {
      setFormData(prev => ({ ...prev, password: defaultPassword }));
    }
  }, [defaultPassword]);

  const createMutation = trpc.credentials.create.useMutation();
  const utils = trpc.useUtils();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.platformName.trim()) {
      newErrors.platformName = "Platform name is required";
    }

    if (!formData.username.trim() && !formData.email.trim()) {
      newErrors.username = "Either username or email is required";
      newErrors.email = "Either username or email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await createMutation.mutateAsync({
        platformName: formData.platformName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        notes: formData.notes,
        folderId: formData.selectedFolderId ? Number(formData.selectedFolderId) : undefined,
      });
      toast.success("Credential created successfully!");
      setFormData({ platformName: "", username: "", email: "", password: "", notes: "", selectedFolderId: folderId || "" });
      setErrors({});
      onOpenChange(false);
      utils.credentials.list.invalidate();
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create credential";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Credential</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pb-safe">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <input
              type="text"
              placeholder="e.g., Gmail, GitHub, Shopify"
              value={formData.platformName}
              onChange={(e) => {
                setFormData({ ...formData, platformName: e.target.value });
                if (errors.platformName) setErrors({ ...errors, platformName: "" });
              }}
              className={`w-full px-3 py-2.5 rounded-[15px] bg-input border focus:outline-none focus:ring-2 text-base ${
                errors.platformName ? "border-red-500 focus:ring-red-500" : "border-border/30 focus:ring-accent"
              }`}
              required
            />
            {errors.platformName && (
              <p className="text-red-500 text-sm mt-1">{errors.platformName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              placeholder="Your username"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                if (errors.username) setErrors({ ...errors, username: "" });
              }}
              className={`w-full px-3 py-2.5 rounded-[15px] bg-input border focus:outline-none focus:ring-2 text-base ${
                errors.username ? "border-red-500 focus:ring-red-500" : "border-border/30 focus:ring-accent"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`w-full px-3 py-2.5 rounded-[15px] bg-input border focus:outline-none focus:ring-2 text-base ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-border/30 focus:ring-accent"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              className={`w-full px-3 py-2.5 rounded-[15px] bg-input border focus:outline-none focus:ring-2 text-base ${
                errors.password ? "border-red-500 focus:ring-red-500" : "border-border/30 focus:ring-accent"
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
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
            <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
