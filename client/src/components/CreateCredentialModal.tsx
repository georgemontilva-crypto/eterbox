import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, User, Mail, Lock, Folder, FileText, Key } from "lucide-react";

interface CreateCredentialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: number | null;
  folders: any[];
  defaultFolderId?: number;
  defaultPassword?: string;
}

export function CreateCredentialModal({ 
  open, 
  onOpenChange, 
  folderId, 
  folders, 
  defaultFolderId, 
  defaultPassword 
}: CreateCredentialModalProps) {
  const [formData, setFormData] = useState({
    platformName: "",
    username: "",
    email: "",
    password: defaultPassword || "",
    notes: "",
    selectedFolderId: defaultFolderId?.toString() || folderId?.toString() || "none",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-scroll to focused input when keyboard opens
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Wait for keyboard to open
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };

    const form = formRef.current;
    if (form) {
      form.addEventListener('focusin', handleFocus as EventListener);
    }

    return () => {
      if (form) {
        form.removeEventListener('focusin', handleFocus as EventListener);
      }
    };
  }, []);

  // Update password when defaultPassword changes
  React.useEffect(() => {
    if (defaultPassword) {
      setFormData(prev => ({ ...prev, password: defaultPassword }));
    }
  }, [defaultPassword]);

  // Update selectedFolderId when defaultFolderId changes
  React.useEffect(() => {
    if (defaultFolderId !== undefined) {
      setFormData(prev => ({ ...prev, selectedFolderId: defaultFolderId.toString() }));
    }
  }, [defaultFolderId]);

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
    
    setErrors({});
    
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
        folderId: formData.selectedFolderId && formData.selectedFolderId !== "none" ? Number(formData.selectedFolderId) : null,
      });

      await utils.credentials.list.invalidate();
      await utils.credentials.listByFolder.invalidate();
      await utils.folders.list.invalidate();
      await utils.folders.listWithShareCount.invalidate();

      toast.success("Credential created successfully!");
      onOpenChange(false);
      
      setFormData({
        platformName: "",
        username: "",
        email: "",
        password: "",
        notes: "",
        selectedFolderId: "none",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create credential");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border/30 bg-gradient-to-br from-accent/5 to-transparent">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Key className="w-5 h-5 text-accent" />
            Add New Credential
          </DialogTitle>
        </DialogHeader>
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 pt-2 pb-32">
          {/* Platform */}
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Platform *
            </Label>
            <Input
              id="platform"
              type="text"
              placeholder="e.g., Gmail, GitHub, Shopify"
              value={formData.platformName}
              onChange={(e) => {
                setFormData({ ...formData, platformName: e.target.value });
                if (errors.platformName) setErrors({ ...errors, platformName: "" });
              }}
              className={`h-11 border-border/50 focus:border-accent ${
                errors.platformName ? "border-red-500" : ""
              }`}
              required
            />
            {errors.platformName && (
              <p className="text-red-500 text-xs mt-1">{errors.platformName}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                if (errors.username) setErrors({ ...errors, username: "" });
              }}
              className={`h-11 border-border/50 focus:border-accent ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`h-11 border-border/50 focus:border-accent ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              className={`h-11 border-border/50 focus:border-accent ${
                errors.password ? "border-red-500" : ""
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Folder */}
          <div className="space-y-2">
            <Label htmlFor="folder" className="text-sm font-medium flex items-center gap-2">
              <Folder className="w-4 h-4 text-muted-foreground" />
              Folder (Optional)
            </Label>
            <Select 
              value={formData.selectedFolderId.toString()} 
              onValueChange={(value) => setFormData({ ...formData, selectedFolderId: value })}
            >
              <SelectTrigger className="h-11 border-border/50 focus:border-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border/50">
                <SelectItem value="none">No folder</SelectItem>
                {folders && folders.map((folder: any) => (
                  <SelectItem key={folder.id} value={folder.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-muted-foreground" />
                      {folder.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  <Key className="w-4 h-4 mr-2" />
                  Create
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
