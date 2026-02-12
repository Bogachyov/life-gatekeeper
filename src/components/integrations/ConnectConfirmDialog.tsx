import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ExternalLink, Loader2 } from "lucide-react";

interface ConnectConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationName: string;
  integrationIcon: React.ReactNode;
  integrationColor: string;
  isDisconnecting: boolean;
  onConfirm: (username: string) => void;
  loading: boolean;
}

export function ConnectConfirmDialog({
  open,
  onOpenChange,
  integrationName,
  integrationIcon,
  integrationColor,
  isDisconnecting,
  onConfirm,
  loading,
}: ConnectConfirmDialogProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");

  const handleConfirm = () => {
    if (isDisconnecting) {
      onConfirm("");
      return;
    }
    if (!username.trim()) return;
    onConfirm(username.trim());
    setUsername("");
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) setUsername("");
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${integrationColor} flex items-center justify-center`}>
              {integrationIcon}
            </div>
            {isDisconnecting
              ? t("integrations.disconnectTitle", { name: integrationName })
              : t("integrations.connectTitle", { name: integrationName })}
          </DialogTitle>
          <DialogDescription>
            {isDisconnecting
              ? t("integrations.disconnectDesc", { name: integrationName })
              : t("integrations.connectDesc", { name: integrationName })}
          </DialogDescription>
        </DialogHeader>

        {!isDisconnecting && (
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                {t("integrations.permissionsInfo", { name: integrationName })}
              </div>
            </div>

            <div>
              <Label htmlFor="username">
                {t("integrations.accountLabel", { name: integrationName })}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("integrations.accountPlaceholder", { name: integrationName })}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("integrations.accountHelp")}
              </p>
            </div>

            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              {t("integrations.oauthNote")}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant={isDisconnecting ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={(!isDisconnecting && !username.trim()) || loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : null}
            {isDisconnecting
              ? t("integrations.confirmDisconnect")
              : t("integrations.confirmConnect")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
