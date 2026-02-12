import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Linkedin, Eye, RotateCcw } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const initialReplies = [
  { id: 1, source: "email", sender: "recruiter@bigtech.com", originalSubject: "Senior Developer Position", replySummary: "Politely declined, mentioned not actively looking", time: "1h ago", status: "sent" },
  { id: 2, source: "linkedin", sender: "Sales Rep", originalSubject: "Quick demo of our product?", replySummary: "Requested more information via email instead", time: "3h ago", status: "sent" },
  { id: 3, source: "email", sender: "conference@events.com", originalSubject: "Speaking opportunity at DevCon", replySummary: "Acknowledged interest, requested more details", time: "5h ago", status: "sent" },
  { id: 4, source: "email", sender: "newsletter@startup.io", originalSubject: "Partnership proposal", replySummary: "Forwarded to review queue for manual assessment", time: "1d ago", status: "pending_review" },
];

export default function AutoReplies() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState(initialReplies);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session) navigate("/auth");
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleView = (id: number) => {
    const reply = replies.find(r => r.id === id);
    toast({ title: t("autoReplies.viewing"), description: reply?.originalSubject || "" });
  };

  const handleUndo = (id: number) => {
    const reply = replies.find(r => r.id === id);
    setReplies(prev => prev.filter(r => r.id !== id));
    toast({ title: t("autoReplies.undone"), description: reply?.originalSubject || "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold mb-2">{t("nav.autoReplies")}</h1>
          <p className="text-muted-foreground">{t("settings.autoReplyDesc")}</p>
        </div>

        <div className="grid gap-4">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-card rounded-xl border border-border/50 p-4 hover:border-border transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {reply.source === "email" ? (
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Linkedin className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{reply.sender}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      reply.status === "sent" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                    }`}>
                      {reply.status === "sent" ? t("autoReplies.sent") : t("autoReplies.pendingReview")}
                    </span>
                    <span className="text-xs text-muted-foreground">{reply.time}</span>
                  </div>
                  <p className="text-sm mb-1 truncate">{reply.originalSubject}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary">{t("autoReplies.response")}:</span> {reply.replySummary}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" title={t("autoReplies.viewFull")} onClick={() => handleView(reply.id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title={t("autoReplies.undo")} onClick={() => handleUndo(reply.id)}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {replies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("autoReplies.noReplies")}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
