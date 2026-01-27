import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Check, TrendingUp, MessageSquare, Wallet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "opportunity" | "auto_reply" | "withdrawal";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Demo notifications
const demoNotifications: Notification[] = [
  {
    id: "1",
    type: "opportunity",
    title: "notifications.newOpportunity",
    message: "Series A Investment Offer from Sequoia",
    time: "2h ago",
    read: false,
  },
  {
    id: "2",
    type: "auto_reply",
    title: "notifications.autoReplySent",
    message: "Polite decline sent to newsletter@marketing.com",
    time: "3h ago",
    read: false,
  },
  {
    id: "3",
    type: "withdrawal",
    title: "notifications.withdrawalComplete",
    message: "$150.00 transferred to PayPal",
    time: "1d ago",
    read: true,
  },
];

const iconMap = {
  opportunity: TrendingUp,
  auto_reply: MessageSquare,
  withdrawal: Wallet,
};

export function NotificationsPanel() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(demoNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-semibold">{t("notifications.title")}</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={markAllRead}
            >
              <Check className="w-3 h-3 mr-1" />
              {t("notifications.markAllRead")}
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {t("notifications.noNotifications")}
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => {
                const Icon = iconMap[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={`p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          notification.type === "opportunity"
                            ? "bg-primary/20 text-primary"
                            : notification.type === "withdrawal"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-secondary"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {t(notification.title)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
