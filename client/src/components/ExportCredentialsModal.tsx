import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface ExportCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: any[];
}

export function ExportCredentialsModal({ open, onOpenChange, credentials }: ExportCredentialsModalProps) {
  
  const exportAsJSON = () => {
    try {
      const dataStr = JSON.stringify(credentials, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `eterbox-credentials-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Credentials exported as JSON successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to export credentials");
    }
  };

  const exportAsCSV = () => {
    try {
      // CSV headers
      const headers = ["Platform", "Username", "Email", "Password", "Notes", "Folder"];
      
      // CSV rows
      const rows = credentials.map(cred => [
        cred.platformName || "",
        cred.username || "",
        cred.email || "",
        cred.encryptedPassword || "",
        cred.notes || "",
        cred.folderName || "No folder"
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
      ].join("\\n");

      const dataBlob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `eterbox-credentials-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Credentials exported as CSV successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to export credentials");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Credentials
          </DialogTitle>
          <DialogDescription>
            Choose a format to export your credentials. All passwords will be included in plain text.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Button
            onClick={exportAsJSON}
            className="w-full justify-start gap-3 h-auto py-4"
            variant="outline"
          >
            <FileJson className="w-6 h-6 text-blue-500" />
            <div className="text-left">
              <p className="font-semibold">Export as JSON</p>
              <p className="text-xs text-muted-foreground">Structured format, easy to import back</p>
            </div>
          </Button>

          <Button
            onClick={exportAsCSV}
            className="w-full justify-start gap-3 h-auto py-4"
            variant="outline"
          >
            <FileSpreadsheet className="w-6 h-6 text-green-500" />
            <div className="text-left">
              <p className="font-semibold">Export as CSV</p>
              <p className="text-xs text-muted-foreground">Compatible with Excel and Google Sheets</p>
            </div>
          </Button>
        </div>

        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-xs text-destructive font-medium">⚠️ Security Warning</p>
          <p className="text-xs text-muted-foreground mt-1">
            Exported files contain passwords in plain text. Store them securely and delete after use.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
