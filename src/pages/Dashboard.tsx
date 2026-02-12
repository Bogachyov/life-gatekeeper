import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Filter, MessageSquare, ChevronRight, Sparkles, TrendingUp, Check, X, Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import { ProfileMenu } from "@/components/profile/ProfileMenu";

const initialOpportunities = [
  {
    id: 1, type: "escalated", title: "Series A Investment Offer", source: "Email",
    sender: "partner@sequoia.com", summary: "Interest in leading a $5M round based on your traction.",
    aiReason: "Matches long-term funding goals. High-credibility sender.", urgency: "high", time: "2h ago",
  },
  {
    id: 2, type: "review", title: "Speaking at Web Summit", source: "LinkedIn",
    sender: "events@websummit.com", summary: "Keynote invitation for November conference in Lisbon.",
    aiReason: "Visibility opportunity but requires time commitment.", urgency: "medium", time: "5h ago",
  },
  {
    id: 3, type: "review", title: "Podcast Guest Invitation", source: "Email",
    sender: "host@techpodcast.fm", summary: "30-min interview about your startup journey.",
    aiReason: "Good reach but lower priority than current goals.", urgency: "low", time: "1d ago",
  },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const navigate = useNavigate();

  const stats = [
    { label: t("dashboard.filteredToday"), value: "47", icon: Filter, change: "+12%" },
    { label: t("dashboard.escalated"), value: "3", icon: TrendingUp, change: t("dashboard.highPriority") },
    { label: t("dashboard.autoReplied"), value: "28", icon: MessageSquare, change: t("dashboard.savedTime", { hours: "2" }) },
  ];

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleAccept = (id: number) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
    const opp = opportunities.find(o => o.id === id);
    toast({ title: t("dashboard.acceptOpportunity"), description: opp?.title || "" });
  };

  const handleDecline = (id: number) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
    const opp = opportunities.find(o => o.id === id);
    toast({ title: t("dashboard.declineOpportunity"), description: opp?.title || "" });
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
      <div className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold">{t("dashboard.greeting")}</h1>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationsPanel />
          <ProfileMenu user={user} onSignOut={handleSignOut} />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border/50 p-6 hover:border-border transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* AI Report */}
        <div className="bg-gradient-to-br from-card to-secondary/30 rounded-2xl border border-border/50 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">{t("dashboard.aiReport")}</h2>
              <p className="text-muted-foreground">
                {t("dashboard.aiReportContent", { messages: 47, opportunities: 3, declined: 28 })}
              </p>
            </div>
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("dashboard.priorityOpportunities")}</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/filtered")}>
              {t("dashboard.viewAll")}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {opportunities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">{t("dashboard.noOpportunities")}</div>
            )}
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-card rounded-xl border border-border/50 p-6 hover:border-border transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        opp.type === "escalated" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                      }`}>
                        {opp.type === "escalated" ? t("dashboard.escalated") : t("dashboard.forReview")}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{opp.time}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{opp.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{opp.source} • {opp.sender}</p>
                    <p className="text-sm mb-3">{opp.summary}</p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
                      <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">{t("dashboard.aiReasoning")}: </span>
                        {opp.aiReason}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="default" size="sm" onClick={() => handleAccept(opp.id)} title={t("dashboard.acceptOpportunity")}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDecline(opp.id)} title={t("dashboard.declineOpportunity")}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration status */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">{t("dashboard.connectedIntegrations")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[{ name: "Gmail", emoji: "📧" }, { name: "LinkedIn", emoji: "💼" }].map(item => (
              <div key={item.name} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                    <span className="text-lg">{item.emoji}</span>
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{t("common.notConnected")}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/integrations")}>
                  {t("common.connect")}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
