import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Copy, RefreshCw, Check, Plus, Loader2, Key } from "lucide-react";
import { toast } from "sonner";

interface PasswordGeneratorProps {
  onUsePassword?: (password: string) => void;
  showAddAsCredential?: boolean;
}

export function PasswordGenerator({ onUsePassword, showAddAsCredential = true }: PasswordGeneratorProps) {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const { data: usage } = trpc.passwordGenerator.getUsage.useQuery();
  const generateMutation = trpc.passwordGenerator.generate.useMutation({
    onSuccess: (data) => {
      setPassword(data.password);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    });
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success(t("generator.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUsePassword = () => {
    if (password && onUsePassword) {
      onUsePassword(password);
    }
  };

  const canGenerate = usage?.unlimited || (usage?.used || 0) < (usage?.max || 0);
  const usageText = usage?.unlimited 
    ? t("generator.unlimited") 
    : `${usage?.used || 0}/${usage?.max || 0}`;

  return (
    <Card className="p-6 border border-border/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold">{t("generator.title")}</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {t("generator.usage")}: {usageText}
        </div>
      </div>

      {/* Generated Password Display */}
      {password && (
        <div className="mb-4 p-3 bg-card/50 border border-border/20 rounded-[15px]">
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono break-all select-all">{password}</code>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Length Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-muted-foreground">{t("generator.length")}</label>
          <span className="text-sm font-medium">{length}</span>
        </div>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-border/30 rounded-lg appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* Character Options */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
          <span className="text-sm">{t("generator.uppercase")} (A-Z)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
          <span className="text-sm">{t("generator.lowercase")} (a-z)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
          <span className="text-sm">{t("generator.numbers")} (0-9)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
          <span className="text-sm">{t("generator.symbols")} (!@#$)</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !canGenerate}
        >
          {generateMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {t("generator.generate")}
        </Button>
        
        {showAddAsCredential && password && onUsePassword && (
          <Button variant="outline" onClick={handleUsePassword}>
            <Plus className="w-4 h-4 mr-2" />
            {t("generator.addAsCredential")}
          </Button>
        )}
      </div>

      {!canGenerate && (
        <p className="mt-3 text-sm text-destructive text-center">
          {t("generator.limitReached")}
        </p>
      )}
    </Card>
  );
}
