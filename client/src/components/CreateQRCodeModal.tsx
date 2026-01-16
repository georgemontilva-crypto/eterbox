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
  const [qrPreview, setQrPreview] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate QR code preview when content changes
  useEffect(() => {
    if (content) {
      generateQRPreview();
    } else {
      setQrPreview("");
    }
  }, [content]);

  const generateQRPreview = async () => {
    try {
      setIsGenerating(true);
      const qrDataUrl = await QRCode.toDataURL(content, {
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
      // Generate final QR code
      const qrDataUrl = await QRCode.toDataURL(content, {
        width: 512,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      const response = await fetch("/api/qr-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          content,
          type,
          folderId: folderId ? parseInt(folderId) : null,
          description,
          qrImage: qrDataUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create QR code");
      }

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
    setQrPreview("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] sm:w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New QR Code</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Website Link, Contact Info"
                  required
                />
              </div>

              <div>
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

              <div>
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

              <div>
                <Label htmlFor="folder">Folder (Optional)</Label>
                <Select value={folderId} onValueChange={setFolderId}>
                  <SelectTrigger>
                    <SelectValue placeholder="No folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No folder</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id.toString()}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any notes..."
                  rows={2}
                />
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
