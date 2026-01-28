import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  ArrowLeft, 
  Mail, 
  Linkedin, 
  Calendar, 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  Hash, 
  Users, 
  Globe, 
  Camera, 
  Music, 
  Twitter,
  Check,
  Loader2
} from "lucide-react";

// Messenger integrations
const messengers = [
  { name: "WhatsApp", icon: Phone, status: "available", color: "bg-green-500" },
  { name: "Telegram", icon: Send, status: "available", color: "bg-blue-500" },
  { name: "Facebook Messenger", icon: MessageSquare, status: "available", color: "bg-blue-600" },
  { name: "Discord", icon: Hash, status: "available", color: "bg-indigo-500" },
  { name: "Slack", icon: MessageSquare, status: "available", color: "bg-purple-500" },
  { name: "Viber", icon: Phone, status: "available", color: "bg-violet-500" },
  { name: "Signal", icon: MessageSquare, status: "available", color: "bg-blue-400" },
  { name: "iMessage", icon: MessageSquare, status: "available", color: "bg-green-400" },
  { name: "Snapchat", icon: Camera, status: "available", color: "bg-yellow-400" },
  { name: "Thread", icon: MessageSquare, status: "available", color: "bg-gray-500" },
  { name: "Wire", icon: MessageSquare, status: "available", color: "bg-gray-400" },
  { name: "eXpress", icon: MessageSquare, status: "available", color: "bg-orange-500" },
  { name: "CoWork", icon: Users, status: "available", color: "bg-teal-500" },
];

// Social network integrations
const socialNetworks = [
  { name: "Instagram", icon: Camera, status: "available", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { name: "Twitter/X", icon: Twitter, status: "available", color: "bg-black" },
  { name: "LinkedIn", icon: Linkedin, status: "available", color: "bg-blue-700" },
  { name: "TikTok", icon: Music, status: "available", color: "bg-black" },
  { name: "VK", icon: Globe, status: "available", color: "bg-blue-600" },
  { name: "Facebook", icon: Users, status: "available", color: "bg-blue-600" },
];

// Email integrations
const emailIntegrations = [
  { name: "Gmail", icon: Mail, status: "available", color: "bg-red-500" },
  { name: "Outlook", icon: Mail, status: "available", color: "bg-blue-500" },
  { name: "Yahoo Mail", icon: Mail, status: "available", color: "bg-purple-500" },
];

// Productivity integrations  
const productivityIntegrations = [
  { name: "Google Calendar", icon: Calendar, status: "available", color: "bg-blue-500" },
  { name: "Zoom", icon: Video, status: "available", color: "bg-blue-600" },
  { name: "Google Meet", icon: Video, status: "available", color: "bg-green-500" },
];

function IntegrationCard({ 
  name, 
  icon: Icon, 
  status, 
  color,
  connected,
  onConnect,
  connecting
}: { 
  name: string; 
  icon: any; 
  status: string; 
  color: string;
  connected: boolean;
  onConnect: () => void;
  connecting: boolean;
}) {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            {connected ? t("common.connected") : t("common.available")}
          </p>
        </div>
      </div>
      <Button 
        variant={connected ? "secondary" : "outline"} 
        size="sm"
        onClick={onConnect}
        disabled={connecting}
      >
        {connecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : connected ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            {t("common.connected")}
          </>
        ) : (
          t("common.connect")
        )}
      </Button>
    </div>
  );
}

function IntegrationSection({ 
  title, 
  integrations,
  connectedIntegrations,
  onConnect,
  connectingIntegration
}: { 
  title: string; 
  integrations: any[];
  connectedIntegrations: Set<string>;
  onConnect: (name: string) => void;
  connectingIntegration: string | null;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {integrations.map((integration) => (
          <IntegrationCard 
            key={integration.name} 
            {...integration} 
            connected={connectedIntegrations.has(integration.name)}
            onConnect={() => onConnect(integration.name)}
            connecting={connectingIntegration === integration.name}
          />
        ))}
      </div>
    </div>
  );
}

export default function Integrations() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set());
  const [connectingIntegration, setConnectingIntegration] = useState<string | null>(null);

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

  const handleConnect = async (integrationName: string) => {
    setConnectingIntegration(integrationName);
    
    // Simulate API connection (replace with real API calls)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setConnectedIntegrations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(integrationName)) {
        newSet.delete(integrationName);
      } else {
        newSet.add(integrationName);
      }
      return newSet;
    });
    
    setConnectingIntegration(null);
    
    toast({
      title: connectedIntegrations.has(integrationName) 
        ? "Integration disconnected" 
        : t("integrations.connectSuccess"),
      description: `${integrationName} has been ${connectedIntegrations.has(integrationName) ? 'disconnected' : 'connected'} successfully.`,
    });
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
      <div className="p-6 max-w-4xl">
        <h1 className="text-2xl font-serif font-bold mb-2">{t("integrations.title")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("integrations.subtitle")}
        </p>

        <div className="space-y-12">
          <IntegrationSection 
            title={t("integrations.messengers")} 
            integrations={messengers}
            connectedIntegrations={connectedIntegrations}
            onConnect={handleConnect}
            connectingIntegration={connectingIntegration}
          />
          <IntegrationSection 
            title={t("integrations.socialNetworks")} 
            integrations={socialNetworks}
            connectedIntegrations={connectedIntegrations}
            onConnect={handleConnect}
            connectingIntegration={connectingIntegration}
          />
          <IntegrationSection 
            title={t("integrations.email")} 
            integrations={emailIntegrations}
            connectedIntegrations={connectedIntegrations}
            onConnect={handleConnect}
            connectingIntegration={connectingIntegration}
          />
          <IntegrationSection 
            title={t("integrations.productivity")} 
            integrations={productivityIntegrations}
            connectedIntegrations={connectedIntegrations}
            onConnect={handleConnect}
            connectingIntegration={connectingIntegration}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
