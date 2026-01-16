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
}

export default function CreateQRCodeModal({
  isOpen,
  onClose,
  onSuccess,
  folders,
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
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

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
      console.error("Error generating QR preview:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !content) {
      return;
    }

    setIsSaving(true);

    try {
      // Generate shortCode for dynamic QR
      const shortCode = isDynamic ? generateShortCode() : undefined;
      
      // For dynamic QR, the QR image points to /qr/:shortCode
      // For static QR, it points directly to the content
      const qrContent = isDynamic 
        ? `${window.location.origin}/qr/${shortCode}` 
        : content;
      
      // Generate final QR code
      const qrDataUrl = await QRCode.toDataURL(qrContent, {
        width: 512,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      await createQRMutation.mutateAsync({
        name,
        content,
        type,
        folderId: folderId && folderId !== "none" ? parseInt(folderId) : null,
        description,
        qrImage: qrDataUrl,
        shortCode,
        isDynamic,
      });

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error creating QR code:", error);
      alert("Failed to create QR code. Please try again.");
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
      <DialogContent className="w-[90vw] sm:w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New QR Code</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Website Link, Contact Info"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
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
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="folder">Folder (Optional)</Label>
                <Select value={folderId} onValueChange={setFolderId}>
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any notes..."
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2 p-3 bg-accent/5 rounded-lg border border-accent/20">
                <input
                  type="checkbox"
                  id="isDynamic"
                  checked={isDynamic}
                  onChange={(e) => setIsDynamic(e.target.checked)}
                  className="w-4 h-4 text-accent bg-background border-border rounded focus:ring-accent focus:ring-2"
                />
                <div className="flex-1">
                  <Label htmlFor="isDynamic" className="cursor-pointer font-medium">
                    🔄 Dynamic QR Code
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isDynamic 
                      ? "✅ You can edit the destination without changing the QR pattern" 
                      : "⚠️ Static QR - Editing will regenerate the QR code"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - QR Preview */}
            <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-6">
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-6 h-6" />
                  <span>Generating...</span>
                </div>
              ) : qrPreview ? (
                <div className="space-y-4">
                  <img
                    src={qrPreview}
                    alt="QR Code Preview"
                    className="w-full max-w-[300px] rounded-lg border-2 border-border"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Preview
                  </p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Enter content to see preview</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !name || !content}>
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Creating...
                </>
              ) : (
                "Create QR Code"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
