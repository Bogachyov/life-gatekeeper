import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Linkedin, Calendar, MessageSquare } from "lucide-react";

const integrations = [
  {
    name: "Gmail",
    description: "Connect your Gmail to automatically filter and prioritize incoming emails.",
    icon: Mail,
    status: "Available",
  },
  {
    name: "LinkedIn",
    description: "Manage connection requests and messages with AI-powered filtering.",
    icon: Linkedin,
    status: "Available",
  },
  {
    name: "Google Calendar",
    description: "Sync your calendar to help AI understand your availability and priorities.",
    icon: Calendar,
    status: "Coming Soon",
  },
  {
    name: "Slack",
    description: "Filter and prioritize Slack messages across workspaces.",
    icon: MessageSquare,
    status: "Coming Soon",
  },
];

export default function Integrations() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-16 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-4">Integrations</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Connect your favorite tools and let LifeOS intelligently manage your digital life.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="bg-card rounded-xl border border-border/50 p-6 hover:border-border transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <integration.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{integration.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        integration.status === "Available"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {integration.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Ready to get started?</p>
          <Button asChild>
            <Link to="/auth">Sign Up Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
