import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Archive, Trash2, Eye } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const filteredMessages = [
  {
    id: 1,
    source: "email",
    sender: "newsletter@techweekly.com",
    subject: "Weekly Tech Roundup #234",
    reason: "Promotional newsletter - not matching priority criteria",
    time: "2h ago",
  },
  {
    id: 2,
    source: "linkedin",
    sender: "John Recruiter",
    subject: "Exciting opportunity at XYZ Corp",
    reason: "Generic recruitment message - no personalization detected",
    time: "4h ago",
  },
  {
    id: 3,
    source: "email",
    sender: "sales@saasproduct.io",
    subject: "Limited time offer - 50% off",
    reason: "Sales pitch - filtered based on your preferences",
    time: "6h ago",
  },
  {
    id: 4,
    source: "linkedin",
    sender: "Connection Request",
    subject: "Let's connect!",
    reason: "No mutual connections, generic message template",
    time: "1d ago",
  },
];

export default function Filtered() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
          <h1 className="text-2xl font-serif font-bold mb-2">{t("nav.filtered")}</h1>
          <p className="text-muted-foreground">
            {t("dashboard.aiReportContent", { messages: 47, opportunities: 3, declined: 28 }).split(".")[0]}.
          </p>
        </div>

        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className="bg-card rounded-xl border border-border/50 p-4 hover:border-border transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {message.source === "email" ? (
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Linkedin className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm mb-2 truncate">{message.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary">Why filtered:</span> {message.reason}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="View"
                    onClick={() => console.log("View message:", message.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Archive"
                    onClick={() => console.log("Archive message:", message.id)}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Delete"
                    onClick={() => console.log("Delete message:", message.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No filtered messages yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
