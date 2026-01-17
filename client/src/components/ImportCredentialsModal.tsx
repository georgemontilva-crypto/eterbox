import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileJson, FileSpreadsheet, CheckCircle2, XCircle, FileUp } from "lucide-react";
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
            folderId: undefined, // Ignore folder for now
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
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) return [];

    // Parse CSV line respecting quoted fields
    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            current += '"';
            i++; // Skip next quote
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // Field separator
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(lines[0]);
    const credentials: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-4 border-b border-border/30 bg-gradient-to-br from-accent/5 to-transparent">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileUp className="w-5 h-5 text-accent" />
            Import Credentials
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload a JSON or CSV file to import your credentials.
          </DialogDescription>
        </DialogHeader>

        {!importResults ? (
          <div className="space-y-5 pt-2">
            {/* Drop Zone */}
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="relative border-2 border-dashed border-accent/30 rounded-xl p-10 text-center hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 bg-gradient-to-br from-muted/20 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200" />
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-accent" />
                  </div>
                  <p className="text-base font-semibold mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">JSON or CSV files only</p>
                </div>
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

            {/* Format Info */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileJson className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1">JSON Format</p>
                  <p className="text-xs text-muted-foreground">Array of objects with: platformName, username, email, password, notes</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1">CSV Format</p>
                  <p className="text-xs text-muted-foreground">Headers: Platform, Username, Email, Password, Notes</p>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {importing && (
              <div className="flex flex-col items-center justify-center py-6 px-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin mb-3"></div>
                <p className="text-sm font-medium text-accent">Importing credentials...</p>
                <p className="text-xs text-muted-foreground mt-1">Please wait</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Results */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-600 dark:text-green-500">
                    {importResults.success} credentials imported successfully
                  </p>
                </div>
              </div>
              
              {importResults.failed > 0 && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-500">
                      {importResults.failed} credentials failed to import
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Errors */}
            {importResults.errors.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-lg bg-destructive/10 border border-destructive/20 p-4 space-y-1">
                <p className="text-xs font-semibold text-destructive mb-2">Errors:</p>
                {importResults.errors.map((error, index) => (
                  <p key={index} className="text-xs text-muted-foreground pl-2 border-l-2 border-destructive/30">
                    {error}
                  </p>
                ))}
              </div>
            )}

            {/* Close Button */}
            <div className="pt-3 border-t border-border/30">
              <Button 
                onClick={handleClose} 
                className="w-full h-11 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
