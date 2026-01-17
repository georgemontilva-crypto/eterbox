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
import { Loader2, Link2, Type, Mail, Phone, Wifi, User, Folder, FileText, Zap, QrCode as QrCodeIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface CreateQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  folders: Array<{ id: number; name: string }>;
  defaultFolderId?: number | null;
}

const QR_TYPES = [
  { value: "url", label: "URL / Link", icon: Link2 },
  { value: "text", label: "Plain Text", icon: Type },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone Number", icon: Phone },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "vcard", label: "Contact Card", icon: User },
];

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

  const selectedTypeIcon = QR_TYPES.find(t => t.value === type)?.icon || Link2;
  const TypeIcon = selectedTypeIcon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:w-[900px] max-w-[900px] max-h-[90vh] overflow-hidden p-0 flex flex-col border-border/50 shadow-2xl">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30 bg-gradient-to-b from-accent/5 to-transparent">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <QrCodeIcon className="w-6 h-6 text-accent" />
              Create New QR Code
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-full">
              {/* Left Column - Form */}
              <div className="p-6 space-y-5 border-r border-border/20">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Website Link, Contact Info"
                    required
                    className="h-11 border-border/50 focus:border-accent transition-colors"
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium flex items-center gap-2">
                    <TypeIcon className="w-4 h-4 text-muted-foreground" />
                    Type
                  </Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-11 border-border/50 focus:border-accent transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border/50">
                      {QR_TYPES.map((qrType) => {
                        const Icon = qrType.icon;
                        return (
                          <SelectItem 
                            key={qrType.value} 
                            value={qrType.value}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              {qrType.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium flex items-center gap-2">
                    <Type className="w-4 h-4 text-muted-foreground" />
                    Content *
                  </Label>
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
                    className="resize-none border-border/50 focus:border-accent transition-colors"
                  />
                </div>

                {/* Folder */}
                <div className="space-y-2">
                  <Label htmlFor="folder" className="text-sm font-medium flex items-center gap-2">
                    <Folder className="w-4 h-4 text-muted-foreground" />
                    Folder (Optional)
                  </Label>
                  <Select value={folderId} onValueChange={setFolderId}>
                    <SelectTrigger className="h-11 border-border/50 focus:border-accent transition-all duration-200">
                      <SelectValue placeholder="No folder" />
                    </SelectTrigger>
                    <SelectContent className="border-border/50">
                      <SelectItem value="none">No folder</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-accent" />
                            {folder.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any notes..."
                    rows={2}
                    className="resize-none border-border/50 focus:border-accent transition-colors"
                  />
                </div>

                {/* Dynamic QR Toggle */}
                <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/30 hover:border-accent/50 transition-all duration-200">
                  <input
                    type="checkbox"
                    id="isDynamic"
                    checked={isDynamic}
                    onChange={(e) => setIsDynamic(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-accent bg-background border-border rounded focus:ring-accent focus:ring-2 cursor-pointer"
                  />
                  <div className="flex-1">
                    <Label htmlFor="isDynamic" className="cursor-pointer font-medium text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      Dynamic QR Code
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {isDynamic 
                        ? "You can edit the destination without changing the QR pattern" 
                        : "Static QR - Editing will regenerate the QR code"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - QR Preview */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 p-8 min-h-[400px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Loader2 className="animate-spin w-10 h-10 text-accent" />
                      <div className="absolute inset-0 animate-ping">
                        <Loader2 className="w-10 h-10 text-accent/30" />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">Generating preview...</span>
                  </div>
                ) : qrPreview ? (
                  <div className="space-y-4 w-full max-w-[300px]">
                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-border/20 hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src={qrPreview}
                        alt="QR Code Preview"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    {isDynamic && (
                      <div className="text-center bg-accent/10 rounded-lg p-3 border border-accent/20">
                        <div className="flex items-center justify-center gap-2 text-accent">
                          <Zap className="w-4 h-4" />
                          <p className="text-xs font-medium">
                            Dynamic QR - Pattern stays the same
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/50 border border-border/30 flex items-center justify-center">
                      <QrCodeIcon className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium">Enter content to see preview</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Your QR code will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Sticky at bottom */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border/30 bg-gradient-to-t from-muted/20 to-transparent sticky bottom-0 mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSaving}
                className="min-w-[100px] border-border/50 hover:border-border transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!qrPreview || isSaving}
                className="min-w-[140px] bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all duration-200"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <QrCodeIcon className="w-4 h-4 mr-2" />
                    Create QR Code
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
