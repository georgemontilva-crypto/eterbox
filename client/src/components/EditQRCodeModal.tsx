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

interface EditQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  qrCode: any;
  folders: Array<{ id: number; name: string }>;
}

export default function EditQRCodeModal({
  isOpen,
  onClose,
  onSuccess,
  qrCode,
  folders,
}: EditQRCodeModalProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("url");
  const [folderId, setFolderId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [qrPreview, setQrPreview] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const updateQRMutation = trpc.qrCodes.update.useMutation();

  // Initialize form with existing QR code data
  useEffect(() => {
    if (qrCode && isOpen) {
      setName(qrCode.name || "");
      setContent(qrCode.content || "");
      setType(qrCode.type || "url");
      setFolderId(qrCode.folderId ? qrCode.folderId.toString() : "");
      setDescription(qrCode.description || "");
      setQrPreview(qrCode.qrImage || "");
    }
  }, [qrCode, isOpen]);

  // Generate QR code preview when content changes (only for static QR)
  useEffect(() => {
    if (content && content !== qrCode?.content && !qrCode?.isDynamic) {
      generateQRPreview();
    }
  }, [content, qrCode?.isDynamic]);

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
    
    if (!name || !content || !qrCode) {
      return;
    }

    setIsSaving(true);

    try {
      // Prepare update data
      const updateData: any = {
        id: qrCode.id,
        name,
        content,
        type,
        folderId: folderId && folderId !== "none" ? parseInt(folderId) : null,
        description,
      };

      // For dynamic QR, DO NOT send qrImage (keep the original that points to /qr/:shortCode)
      // For static QR, regenerate qrImage if content changed
      if (!qrCode.isDynamic) {
        if (content !== qrCode.content) {
          // Regenerate QR for static codes when content changes
          updateData.qrImage = await QRCode.toDataURL(content, {
            width: 512,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
        } else {
          // Keep the same image if content didn't change
          updateData.qrImage = qrCode.qrImage;
        }
      }
      // For dynamic QR, qrImage is intentionally omitted from updateData

      await updateQRMutation.mutateAsync(updateData);

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating QR code:", error);
      alert("Failed to update QR code. Please try again.");
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

  if (!qrCode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] sm:w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit QR Code</DialogTitle>
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
                <p className="text-xs text-muted-foreground">
                  💡 Changing the content will make this a dynamic QR code
                </p>
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
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {content !== qrCode.content ? "Updated Preview" : "Current QR Code"}
                    </p>
                    {qrCode.isDynamic && (
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <p className="text-xs text-accent font-medium">
                          🔄 Dynamic QR
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          The QR pattern stays the same, only the destination changes
                        </p>
                      </div>
                    )}
                  </div>
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
                  Updating...
                </>
              ) : (
                "Update QR Code"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
