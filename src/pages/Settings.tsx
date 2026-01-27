import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useToast } from "@/hooks/use-toast";
import { Camera, X } from "lucide-react";

export default function Settings() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [escalateUrgent, setEscalateUrgent] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        navigate("/auth");
      } else {
        // Fetch profile
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (data) {
      setNickname(data.full_name || "");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Update or insert profile
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: nickname,
          email: user.email,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: t("settings.profileUpdated"),
        description: t("settings.profileUpdatedDesc"),
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: t("common.error"),
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const initials = nickname ? nickname.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold mb-2">{t("settings.title")}</h1>
          <p className="text-muted-foreground">
            {t("settings.subtitle")}
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-card rounded-xl border border-border/50 p-6">
            <h2 className="text-lg font-semibold mb-4">{t("settings.profile")}</h2>
            <div className="space-y-6">
              {/* Profile Photo */}
              <div>
                <Label>{t("settings.profilePhoto")}</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="relative group">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback className="text-2xl bg-secondary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={handleAvatarClick}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleAvatarClick}>
                      {t("settings.uploadPhoto")}
                    </Button>
                    {avatarUrl && (
                      <Button variant="ghost" size="sm" onClick={handleRemoveAvatar}>
                        <X className="w-4 h-4 mr-1" />
                        {t("settings.removePhoto")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Nickname */}
              <div>
                <Label htmlFor="nickname">{t("settings.nickname")}</Label>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t("settings.nicknamePlaceholder")}
                  className="mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">{t("settings.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t("settings.emailHelp")}
                </p>
              </div>
            </div>
          </section>

          {/* Language Preference Section */}
          <section className="bg-card rounded-xl border border-border/50 p-6">
            <h2 className="text-lg font-semibold mb-4">{t("settings.languagePreference")}</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("language.select")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.languagePreferenceDesc")}
                </p>
              </div>
              <LanguageSelector />
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-card rounded-xl border border-border/50 p-6">
            <h2 className="text-lg font-semibold mb-4">{t("settings.notifications")}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.emailNotifications")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.emailNotificationsDesc")}
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.escalateUrgent")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.escalateUrgentDesc")}
                  </p>
                </div>
                <Switch
                  checked={escalateUrgent}
                  onCheckedChange={setEscalateUrgent}
                />
              </div>
            </div>
          </section>

          {/* AI Preferences Section */}
          <section className="bg-card rounded-xl border border-border/50 p-6">
            <h2 className="text-lg font-semibold mb-4">{t("settings.aiPreferences")}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.autoReply")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.autoReplyDesc")}
                  </p>
                </div>
                <Switch
                  checked={autoReplyEnabled}
                  onCheckedChange={setAutoReplyEnabled}
                />
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-card rounded-xl border border-destructive/50 p-6">
            <h2 className="text-lg font-semibold text-destructive mb-4">{t("settings.dangerZone")}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.deleteAccount")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.deleteAccountDesc")}
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  {t("common.delete")}
                </Button>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t("common.loading") : t("settings.saveChanges")}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
