import { Wallet } from "@/types/wallet";
import { Wallet as WalletIcon, TrendingUp, Clock } from "lucide-react";

interface WalletOverviewProps {
  wallet: Wallet | null;
  isLoading: boolean;
}

export function WalletOverview({ wallet, isLoading }: WalletOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border/50 p-6 animate-pulse">
            <div className="h-4 w-24 bg-secondary rounded mb-2" />
            <div className="h-8 w-32 bg-secondary rounded" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Available Balance",
      value: `$${(wallet?.balance || 0).toFixed(2)}`,
      icon: WalletIcon,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Pending Balance",
      value: `$${(wallet?.pending_balance || 0).toFixed(2)}`,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Total Earnings",
      value: `$${((wallet?.balance || 0) + (wallet?.pending_balance || 0)).toFixed(2)}`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
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
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
