import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QRCode from "qrcode";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface CreateQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  folders: Array<{ id: number; name: string }>;
  defaultFolderId?: number | null;
}

export default function CreateQRCodeModal({
  isOpen,
  onClose,
  onSuccess,
  folders,
  defaultFolderId,
}: CreateQRCodeModalProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("url");
  const [folderId, setFolderId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isDynamic, setIsDynamic] = useState(true); // Dynamic by default
  const [qrPreview, setQrPreview] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const createQRMutation = trpc.qrCodes.create.useMutation();

  // Generate a random short code
  const generateShortCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  // Set default folder when modal opens
  useEffect(() => {
    if (isOpen && defaultFolderId !== undefined) {
      setFolderId(defaultFolderId ? String(defaultFolderId) : "");
    }
  }, [isOpen, defaultFolderId]);

  // Generate QR code preview when content or isDynamic changes
  useEffect(() => {
    if (content) {
      generateQRPreview();
    } else {
      setQrPreview("");
    }
  }, [content, isDynamic]);

  const generateQRPreview = async () => {
    try {
      setIsGenerating(true);
      
      // For dynamic QR, show preview with placeholder URL
      const qrContent = isDynamic 
        ? `${window.location.origin}/qr/PREVIEW` 
        : content;
      
      const qrDataUrl = await QRCode.toDataURL(qrContent, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      
      setQrPreview(qrDataUrl);
    } catch (error) {
      console.error("Failed to generate QR preview:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      let finalQrImage = qrPreview;
      let shortCode = null;
      
      // For dynamic QR codes, generate a short code and create QR with redirect URL
      if (isDynamic) {
        shortCode = generateShortCode();
        const redirectUrl = `${window.location.origin}/qr/${shortCode}`;
        finalQrImage = await QRCode.toDataURL(redirectUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
      }
      
      await createQRMutation.mutateAsync({
        name,
        content,
        type,
        qrImage: finalQrImage,
        folderId: folderId && folderId !== "none" ? parseInt(folderId) : undefined,
        description: description || undefined,
        isDynamic,
        shortCode: shortCode || undefined,
      });
      
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Failed to create QR code:", error);
      alert(error.message || "Failed to create QR code. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setName("");
    setContent("");
    setType("url");
    setFolderId("");
    setDescription("");
    setIsDynamic(true);
    setQrPreview("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:w-[900px] max-w-[900px] max-h-[95vh] overflow-hidden p-0">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
            <DialogTitle className="text-2xl font-semibold">Create New QR Code</DialogTitle>
          </DialogHeader>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-full">
              {/* Left Column - Form */}
              <div className="p-6 space-y-4 border-r border-border/30">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Website Link, Contact Info"
                    required
                    className="h-10"
                  />
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL / Link</SelectItem>
                      <SelectItem value="text">Plain Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Number</SelectItem>
                      <SelectItem value="wifi">WiFi</SelectItem>
                      <SelectItem value="vcard">Contact Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <Label htmlFor="content" className="text-sm font-medium">Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      type === "url"
                        ? "https://example.com"
                        : type === "email"
                        ? "email@example.com"
                        : type === "phone"
                        ? "+1234567890"
                        : "Enter content here"
                    }
                    rows={3}
                    required
                    className="resize-none"
                  />
                </div>

                {/* Folder */}
                <div className="space-y-1.5">
                  <Label htmlFor="folder" className="text-sm font-medium">Folder (Optional)</Label>
                  <Select value={folderId} onValueChange={setFolderId}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="No folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No folder</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any notes..."
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {/* Dynamic QR Toggle */}
                <div className="flex items-start space-x-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
                  <input
                    type="checkbox"
                    id="isDynamic"
                    checked={isDynamic}
                    onChange={(e) => setIsDynamic(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-accent bg-background border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <div className="flex-1">
                    <Label htmlFor="isDynamic" className="cursor-pointer font-medium text-sm">
                      🔄 Dynamic QR Code
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {isDynamic 
                        ? "You can edit the destination without changing the QR pattern" 
                        : "Static QR - Editing will regenerate the QR code"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - QR Preview */}
              <div className="flex flex-col items-center justify-center bg-muted/30 p-8 min-h-[400px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin w-8 h-8 text-accent" />
                    <span className="text-sm text-muted-foreground">Generating preview...</span>
                  </div>
                ) : qrPreview ? (
                  <div className="space-y-4 w-full max-w-[300px]">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <img
                        src={qrPreview}
                        alt="QR Code Preview"
                        className="w-full h-auto"
                      />
                    </div>
                    {isDynamic && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          🔄 Dynamic QR - Pattern stays the same
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-sm">Enter content to see preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border/50 bg-muted/20">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSaving}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!qrPreview || isSaving}
                className="min-w-[140px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create QR Code"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
