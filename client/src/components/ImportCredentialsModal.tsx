import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileJson, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface ImportCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportCredentialsModal({ open, onOpenChange }: ImportCredentialsModalProps) {
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  
  const createMutation = trpc.credentials.create.useMutation();
  const utils = trpc.useUtils();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResults(null);

    try {
      const text = await file.text();
      let credentials: any[] = [];

      // Parse JSON or CSV
      if (file.name.endsWith('.json')) {
        credentials = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        credentials = parseCSV(text);
      } else {
        toast.error("Unsupported file format. Please use JSON or CSV.");
        setImporting(false);
        return;
      }

      // Import credentials
      const results = { success: 0, failed: 0, errors: [] as string[] };
      
      for (const cred of credentials) {
        try {
          await createMutation.mutateAsync({
            platformName: cred.platformName || cred.Platform || "",
            username: cred.username || cred.Username || "",
            email: cred.email || cred.Email || "",
            password: cred.encryptedPassword || cred.password || cred.Password || "",
            notes: cred.notes || cred.Notes || "",
            folderId: undefined,
          });
          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`${cred.platformName || cred.Platform || "Unknown"}: ${error.message}`);
        }
      }

      setImportResults(results);
      
      if (results.success > 0) {
        await utils.credentials.list.invalidate();
        toast.success(`Successfully imported ${results.success} credential(s)!`);
      }
      
      if (results.failed > 0) {
        toast.error(`Failed to import ${results.failed} credential(s)`);
      }

    } catch (error: any) {
      toast.error(`Failed to parse file: ${error.message}`);
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const credentials: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const cred: any = {};
      
      headers.forEach((header, index) => {
        cred[header] = values[index] || "";
      });
      
      credentials.push(cred);
    }

    return credentials;
  };

  const handleClose = () => {
    setImportResults(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Credentials
          </DialogTitle>
          <DialogDescription>
            Upload a JSON or CSV file to import your credentials.
          </DialogDescription>
        </DialogHeader>

        {!importResults ? (
          <div className="space-y-4 mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-accent/50 transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">JSON or CSV files only</p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".json,.csv"
                onChange={handleFileUpload}
                disabled={importing}
                className="hidden"
              />
            </label>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <FileJson className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">JSON Format</p>
                  <p className="text-muted-foreground">Array of objects with: platformName, username, email, password, notes</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <FileSpreadsheet className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">CSV Format</p>
                  <p className="text-muted-foreground">Headers: Platform, Username, Email, Password, Notes</p>
                </div>
              </div>
            </div>

            {importing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Importing credentials...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">{importResults.success} credentials imported successfully</span>
              </div>
              
              {importResults.failed > 0 && (
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">{importResults.failed} credentials failed to import</span>
                </div>
              )}
            </div>

            {importResults.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-xs font-medium text-destructive mb-2">Errors:</p>
                {importResults.errors.map((error, index) => (
                  <p key={index} className="text-xs text-muted-foreground">{error}</p>
                ))}
              </div>
            )}

            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
