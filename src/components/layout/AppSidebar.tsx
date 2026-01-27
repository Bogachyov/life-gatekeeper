import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Wallet,
  Filter,
  MessageSquare,
  Settings,
  LogOut,
  Link2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onSignOut: () => void;
}

export function AppSidebar({ onSignOut }: AppSidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { titleKey: "nav.dashboard", url: "/dashboard", icon: LayoutDashboard },
    { titleKey: "nav.wallet", url: "/wallet", icon: Wallet },
    { titleKey: "nav.filtered", url: "/filtered", icon: Filter },
    { titleKey: "nav.autoReplies", url: "/auto-replies", icon: MessageSquare },
    { titleKey: "nav.integrations", url: "/integrations", icon: Link2 },
    { titleKey: "nav.settings", url: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <span className="text-xl font-serif font-semibold">LifeOS</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={t(item.titleKey)}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut} tooltip={t("common.signOut")}>
              <LogOut className="h-4 w-4" />
              <span>{t("common.signOut")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
