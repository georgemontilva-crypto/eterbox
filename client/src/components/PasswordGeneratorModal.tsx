import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";

interface PasswordGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordGeneratorModal({ open, onOpenChange }: PasswordGeneratorModalProps) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
      toast.error("Please select at least one character type");
      return;
    }

    let password = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }
    setGeneratedPassword(password);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) {
      toast.error("Generate a password first");
      return;
    }
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      toast.success("Password copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy password");
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { text: "", color: "" };
    if (password.length < 8) return { text: "Weak", color: "text-red-500" };
    if (password.length < 12) return { text: "Medium", color: "text-yellow-500" };
    if (password.length < 16) return { text: "Strong", color: "text-green-500" };
    return { text: "Very Strong", color: "text-emerald-500" };
  };

  const strength = getPasswordStrength(generatedPassword);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Password Generator</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Generated Password Display */}
          <div className="relative">
            <div className="w-full px-4 py-4 rounded-[15px] bg-accent/10 border-2 border-accent/30 font-mono text-lg break-all min-h-[60px] flex items-center justify-center">
              {generatedPassword || "Click generate to create password"}
            </div>
            {strength.text && (
              <div className={`text-sm font-medium mt-2 ${strength.color}`}>
                Strength: {strength.text}
              </div>
            )}
          </div>

          {/* Length Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Length</label>
              <span className="text-sm font-bold text-accent">{length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>8</span>
              <span>32</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-[15px] bg-card border border-border/20 cursor-pointer hover:bg-accent/5 transition-colors">
              <span className="text-sm font-medium">Uppercase (A-Z)</span>
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-5 h-5 rounded accent-accent cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-[15px] bg-card border border-border/20 cursor-pointer hover:bg-accent/5 transition-colors">
              <span className="text-sm font-medium">Lowercase (a-z)</span>
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-5 h-5 rounded accent-accent cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-[15px] bg-card border border-border/20 cursor-pointer hover:bg-accent/5 transition-colors">
              <span className="text-sm font-medium">Numbers (0-9)</span>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-5 h-5 rounded accent-accent cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-[15px] bg-card border border-border/20 cursor-pointer hover:bg-accent/5 transition-colors">
              <span className="text-sm font-medium">Symbols (!@#$%)</span>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-5 h-5 rounded accent-accent cursor-pointer"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={generatePassword}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate
            </Button>
            <Button
              type="button"
              onClick={copyToClipboard}
              className="flex-1"
              disabled={!generatedPassword}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
