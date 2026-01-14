import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Users, Folder, ArrowLeft, Eye, EyeOff, Copy, Lock, Mail, User } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Shared() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

  const { data: sharedFolders = [], isLoading } = trpc.folders.getSharedWithMe.useQuery();
  const { data: credentials = [] } = trpc.credentials.list.useQuery();

  const selectedFolder = sharedFolders.find(sf => sf.folderId === selectedFolderId);
  const folderCredentials = selectedFolderId 
    ? credentials.filter(c => c.folderId === selectedFolderId)
    : [];

  const togglePasswordVisibility = (id: number) => {
    const newSet = new Set(visiblePasswords);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setVisiblePasswords(newSet);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("common.copied"));
  };

  if (selectedFolderId && selectedFolder) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/20 bg-card/50 backdrop-blur-md sticky top-0 z-10">
          <div className="container py-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFolderId(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("common.back")}
                </Button>
                <div className="h-6 w-px bg-border/20" />
                <Folder className="w-5 h-5 text-accent" />
                <div>
                  <h1 className="text-lg font-bold">{selectedFolder.folder.name}</h1>
                  <p className="text-xs text-muted-foreground">
                    {t("shared.sharedBy")} {selectedFolder.owner.name || selectedFolder.owner.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                <Lock className="w-3 h-3 text-accent" />
                <span className="text-xs text-accent font-medium">{t("shared.readOnly")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="container py-8 px-4">
          {folderCredentials.length > 0 ? (
            <div className="space-y-3">
              {folderCredentials.map((cred: any) => (
                <Card key={cred.id} className="p-4 border border-border/20">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{cred.platformName}</h3>
                        <p className="text-sm text-muted-foreground">{cred.category}</p>
                      </div>
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {cred.username && (
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">{t("common.username")}</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-3 py-2 bg-background border border-border/20 rounded-lg text-sm">
                            {cred.username}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(cred.username)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {cred.email && (
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">{t("common.email")}</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-3 py-2 bg-background border border-border/20 rounded-lg text-sm">
                            {cred.email}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(cred.email)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">{t("common.password")}</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-background border border-border/20 rounded-lg text-sm font-mono">
                          {visiblePasswords.has(cred.id) ? cred.encryptedPassword : "••••••••••••"}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(cred.id)}
                        >
                          {visiblePasswords.has(cred.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(cred.encryptedPassword)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {cred.url && (
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">{t("common.url")}</label>
                        <div className="flex items-center gap-2">
                          <a
                            href={cred.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-3 py-2 bg-background border border-border/20 rounded-lg text-sm text-accent hover:underline truncate"
                          >
                            {cred.url}
                          </a>
                        </div>
                      </div>
                    )}

                    {cred.notes && (
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">{t("common.notes")}</label>
                        <div className="px-3 py-2 bg-background border border-border/20 rounded-lg text-sm">
                          {cred.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">{t("shared.noCredentials")}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("common.back")}
              </Button>
              <div className="h-6 w-px bg-border/20" />
              <Users className="w-6 h-6 text-accent" />
              <h1 className="text-2xl font-bold">{t("shared.title")}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 px-4">
        <p className="text-muted-foreground mb-6">
          {t("shared.description")}
        </p>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground mt-4">{t("common.loading")}</p>
          </div>
        ) : sharedFolders.length > 0 ? (
          <div className="space-y-4">
            {sharedFolders.map((sharedFolder) => {
              const credCount = credentials.filter(c => c.folderId === sharedFolder.folderId).length;
              return (
                <Card
                  key={sharedFolder.id}
                  className="p-4 border border-border/20 hover:border-accent/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedFolderId(sharedFolder.folderId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: sharedFolder.folder.color + "20" }}
                      >
                        <Folder
                          className="w-5 h-5"
                          style={{ color: sharedFolder.folder.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{sharedFolder.folder.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>{sharedFolder.owner.name || sharedFolder.owner.email}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {credCount} {t("shared.credentials")}
                          </span>
                        </div>
                        {sharedFolder.folder.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {sharedFolder.folder.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 border border-accent/20 rounded-full">
                        <Lock className="w-3 h-3 text-accent" />
                        <span className="text-xs text-accent font-medium">{t("shared.readOnly")}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("shared.noFolders")}</h3>
            <p className="text-muted-foreground">{t("shared.noFoldersDesc")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
