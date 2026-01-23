import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Filter,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data for demo
const opportunities = [
  {
    id: 1,
    type: "escalated",
    title: "Series A Investment Offer",
    source: "Email",
    sender: "partner@sequoia.com",
    summary: "Interest in leading a $5M round based on your traction.",
    aiReason: "Matches long-term funding goals. High-credibility sender.",
    urgency: "high",
    time: "2h ago",
  },
  {
    id: 2,
    type: "review",
    title: "Speaking at Web Summit",
    source: "LinkedIn",
    sender: "events@websummit.com",
    summary: "Keynote invitation for November conference in Lisbon.",
    aiReason: "Visibility opportunity but requires time commitment.",
    urgency: "medium",
    time: "5h ago",
  },
  {
    id: 3,
    type: "review",
    title: "Podcast Guest Invitation",
    source: "Email",
    sender: "host@techpodcast.fm",
    summary: "30-min interview about your startup journey.",
    aiReason: "Good reach but lower priority than current goals.",
    urgency: "low",
    time: "1d ago",
  },
];

const stats = [
  { label: "Filtered Today", value: "47", icon: Filter, change: "+12%" },
  { label: "Escalated", value: "3", icon: TrendingUp, change: "High priority" },
  { label: "Auto-Replied", value: "28", icon: MessageSquare, change: "Saved 2h" },
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border/50 flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-serif font-semibold">LifeOS</span>
          </Link>
        </div>

        <nav className="flex-1 px-3">
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start gap-3">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
              <Filter className="w-4 h-4" />
              Filtered
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              Auto-Replies
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-border/50">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">Good morning</h1>
            <p className="text-muted-foreground">Here's what matters today</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-xl border border-border/50 p-6 hover:border-border transition-colors"
              >
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
                <h2 className="text-lg font-semibold mb-2">Today's AI Report</h2>
                <p className="text-muted-foreground">
                  Processed <span className="text-foreground font-medium">47 messages</span> across 
                  Gmail and LinkedIn. <span className="text-foreground font-medium">3 high-priority opportunities</span> 
                  {" "}match your decision profile. 28 low-value requests were auto-declined with polite responses.
                </p>
              </div>
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Priority Opportunities</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-card rounded-xl border border-border/50 p-6 hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            opp.type === "escalated"
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {opp.type === "escalated" ? "Escalated" : "For Review"}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {opp.time}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1">{opp.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {opp.source} • {opp.sender}
                      </p>
                      <p className="text-sm mb-3">{opp.summary}</p>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
                        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          <span className="text-foreground font-medium">AI Reasoning: </span>
                          {opp.aiReason}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="default" size="sm">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
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
            <h2 className="text-lg font-semibold mb-4">Connected Integrations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                    <span className="text-lg">📧</span>
                  </div>
                  <div>
                    <p className="font-medium">Gmail</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                    <span className="text-lg">💼</span>
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
