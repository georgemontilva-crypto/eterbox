import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QRExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: any;
}

export default function QRExportModal({
  isOpen,
  onClose,
  qrCode,
}: QRExportModalProps) {
  const [format, setFormat] = useState<string>("png");
  const [quality, setQuality] = useState<string>("high");
  const [isExporting, setIsExporting] = useState(false);

  const qualitySettings = {
    low: 256,
    medium: 512,
    high: 1024,
    ultra: 2048,
  };

  const handleExport = async () => {
    if (!qrCode) return;

    setIsExporting(true);

    try {
      const size = qualitySettings[quality as keyof typeof qualitySettings];

      switch (format) {
        case "png":
          await exportPNG(size);
          break;
        case "jpg":
          await exportJPG(size);
          break;
        case "svg":
          await exportSVG();
          break;
        case "pdf":
          await exportPDF(size);
          break;
      }

      toast.success(`QR code exported as ${format.toUpperCase()}`);
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export QR code");
    } finally {
      setIsExporting(false);
    }
  };

  const exportPNG = async (size: number) => {
    const dataUrl = await QRCode.toDataURL(qrCode.content, {
      width: size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    downloadFile(dataUrl, `${qrCode.name}.png`);
  };

  const exportJPG = async (size: number) => {
    const dataUrl = await QRCode.toDataURL(qrCode.content, {
      width: size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Convert PNG to JPG
    const img = new Image();
    img.src = dataUrl;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      // Fill white background for JPG
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0);
      
      const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.95);
      downloadFile(jpgDataUrl, `${qrCode.name}.jpg`);
    }
  };

  const exportSVG = async () => {
    const svgString = await QRCode.toString(qrCode.content, {
      type: "svg",
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    downloadFile(url, `${qrCode.name}.svg`);
    URL.revokeObjectURL(url);
  };

  const exportPDF = async (size: number) => {
    const dataUrl = await QRCode.toDataURL(qrCode.content, {
      width: size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Create PDF with QR code centered
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions to center QR code
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const qrSize = 100; // 100mm
    const x = (pageWidth - qrSize) / 2;
    const y = (pageHeight - qrSize) / 2;

    // Add title
    pdf.setFontSize(16);
    pdf.text(qrCode.name, pageWidth / 2, 20, { align: "center" });

    // Add QR code
    pdf.addImage(dataUrl, "PNG", x, y, qrSize, qrSize);

    // Add description if exists
    if (qrCode.description) {
      pdf.setFontSize(10);
      pdf.text(qrCode.description, pageWidth / 2, y + qrSize + 15, {
        align: "center",
        maxWidth: pageWidth - 40,
      });
    }

    // Add content info
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text(`Type: ${qrCode.type}`, pageWidth / 2, y + qrSize + 25, {
      align: "center",
    });
    pdf.text(`Content: ${qrCode.content}`, pageWidth / 2, y + qrSize + 30, {
      align: "center",
      maxWidth: pageWidth - 40,
    });

    pdf.save(`${qrCode.name}.pdf`);
  };

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!qrCode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export QR Code</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Preview */}
          <div className="flex justify-center p-4 bg-muted rounded-lg">
            <img
              src={qrCode.qrImage}
              alt={qrCode.name}
              className="w-48 h-48 rounded-lg border-2 border-border"
            />
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (Recommended)</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="svg">SVG (Vector)</SelectItem>
                <SelectItem value="pdf">PDF (Document)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {format === "svg" && "✨ Vector format - scales perfectly at any size"}
              {format === "pdf" && "📄 Includes QR code, title, and description"}
              {format === "png" && "🖼️ Best for web and digital use"}
              {format === "jpg" && "📸 Smaller file size, good for printing"}
            </p>
          </div>

          {/* Quality Selection (not for SVG) */}
          {format !== "svg" && (
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger id="quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (256x256)</SelectItem>
                  <SelectItem value="medium">Medium (512x512)</SelectItem>
                  <SelectItem value="high">High (1024x1024)</SelectItem>
                  <SelectItem value="ultra">Ultra (2048x2048)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Higher quality = larger file size
              </p>
            </div>
          )}

          {/* Export Info */}
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-sm">
            <p className="font-medium mb-1">Export Details:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Name: {qrCode.name}</li>
              <li>• Type: {qrCode.type}</li>
              <li>• Format: {format.toUpperCase()}</li>
              {format !== "svg" && (
                <li>• Size: {qualitySettings[quality as keyof typeof qualitySettings]}x{qualitySettings[quality as keyof typeof qualitySettings]}px</li>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export {format.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
