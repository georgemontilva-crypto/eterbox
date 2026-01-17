import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Copy, RefreshCw, Check, Key, Lock } from "lucide-react";
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border/30 bg-gradient-to-br from-accent/5 to-transparent">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Key className="w-5 h-5 text-accent" />
            Password Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 pt-2">
          {/* Generated Password Display */}
          <div className="space-y-3">
            <div className="relative p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 min-h-[80px] flex items-center justify-center">
              <div className="font-mono text-base break-all text-center">
                {generatedPassword || "Click generate to create password"}
              </div>
            </div>
            {strength.text && (
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-muted-foreground">Strength:</span>
                <span className={`text-sm font-semibold ${strength.color}`}>
                  {strength.text}
                </span>
              </div>
            )}
          </div>

          {/* Length Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Length</Label>
              <span className="text-base font-bold text-accent px-3 py-1 bg-accent/10 rounded-md">
                {length}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent/30"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>8</span>
              <span>32</span>
            </div>
          </div>

          {/* Options with Circular Checkboxes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              Character Types
            </Label>
            
            <div className="space-y-2">
              {/* Uppercase */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30 hover:border-border/50 transition-colors">
                <Label htmlFor="uppercase" className="text-sm font-medium cursor-pointer flex-1">
                  Uppercase (A-Z)
                </Label>
                <Checkbox
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                  className="rounded-full data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
              </div>

              {/* Lowercase */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30 hover:border-border/50 transition-colors">
                <Label htmlFor="lowercase" className="text-sm font-medium cursor-pointer flex-1">
                  Lowercase (a-z)
                </Label>
                <Checkbox
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                  className="rounded-full data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
              </div>

              {/* Numbers */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30 hover:border-border/50 transition-colors">
                <Label htmlFor="numbers" className="text-sm font-medium cursor-pointer flex-1">
                  Numbers (0-9)
                </Label>
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                  className="rounded-full data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
              </div>

              {/* Symbols */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30 hover:border-border/50 transition-colors">
                <Label htmlFor="symbols" className="text-sm font-medium cursor-pointer flex-1">
                  Symbols (!@#$%)
                </Label>
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                  className="rounded-full data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={generatePassword}
              className="flex-1 h-11 border-border/50 hover:border-border"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate
            </Button>
            <Button
              type="button"
              onClick={copyToClipboard}
              className="flex-1 h-11 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
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

          {/* Close Button */}
          <div className="pt-3 border-t border-border/30">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full h-10"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
