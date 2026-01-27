import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Linkedin, Calendar, MessageSquare, Send, Phone, Video, Hash, Users, Globe, Camera, Music, Twitter } from "lucide-react";

// Messenger integrations
const messengers = [
  { name: "WhatsApp", icon: Phone, status: "available", color: "bg-green-500" },
  { name: "Telegram", icon: Send, status: "available", color: "bg-blue-500" },
  { name: "Facebook Messenger", icon: MessageSquare, status: "available", color: "bg-blue-600" },
  { name: "Discord", icon: Hash, status: "available", color: "bg-indigo-500" },
  { name: "Slack", icon: MessageSquare, status: "available", color: "bg-purple-500" },
  { name: "Viber", icon: Phone, status: "available", color: "bg-violet-500" },
  { name: "Signal", icon: MessageSquare, status: "available", color: "bg-blue-400" },
  { name: "iMessage", icon: MessageSquare, status: "coming_soon", color: "bg-green-400" },
  { name: "Snapchat", icon: Camera, status: "coming_soon", color: "bg-yellow-400" },
  { name: "Thread", icon: MessageSquare, status: "coming_soon", color: "bg-gray-500" },
  { name: "Wire", icon: MessageSquare, status: "coming_soon", color: "bg-gray-400" },
  { name: "eXpress", icon: MessageSquare, status: "coming_soon", color: "bg-orange-500" },
  { name: "CoWork", icon: Users, status: "coming_soon", color: "bg-teal-500" },
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
  { name: "Yahoo Mail", icon: Mail, status: "coming_soon", color: "bg-purple-500" },
];

// Productivity integrations  
const productivityIntegrations = [
  { name: "Google Calendar", icon: Calendar, status: "coming_soon", color: "bg-blue-500" },
  { name: "Zoom", icon: Video, status: "coming_soon", color: "bg-blue-600" },
  { name: "Google Meet", icon: Video, status: "coming_soon", color: "bg-green-500" },
];

function IntegrationCard({ name, icon: Icon, status, color }: { name: string; icon: any; status: string; color: string }) {
  const { t } = useTranslation();
  const isAvailable = status === "available";
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            {isAvailable ? t("common.available") : t("common.comingSoon")}
          </p>
        </div>
      </div>
      <Button 
        variant={isAvailable ? "outline" : "ghost"} 
        size="sm"
        disabled={!isAvailable}
      >
        {isAvailable ? t("common.connect") : t("common.comingSoon")}
      </Button>
    </div>
  );
}

function IntegrationSection({ title, integrations }: { title: string; integrations: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.name} {...integration} />
        ))}
      </div>
    </div>
  );
}

export default function Integrations() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-16 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-4">{t("integrations.title")}</h1>
        <p className="text-lg text-muted-foreground mb-12">
          {t("integrations.subtitle")}
        </p>

        <div className="space-y-12">
          <IntegrationSection title={t("integrations.messengers")} integrations={messengers} />
          <IntegrationSection title={t("integrations.socialNetworks")} integrations={socialNetworks} />
          <IntegrationSection title={t("integrations.email")} integrations={emailIntegrations} />
          <IntegrationSection title={t("integrations.productivity")} integrations={productivityIntegrations} />
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">{t("common.getStarted")}?</p>
          <Button asChild>
            <Link to="/auth">{t("common.signIn")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
