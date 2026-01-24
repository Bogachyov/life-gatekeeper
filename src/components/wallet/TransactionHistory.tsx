import { Transaction } from "@/types/wallet";
import { ArrowDownLeft, ArrowUpRight, RefreshCcw, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const typeConfig = {
  deposit: {
    icon: ArrowDownLeft,
    label: "Deposit",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  withdrawal: {
    icon: ArrowUpRight,
    label: "Withdrawal",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  subscription_payment: {
    icon: CreditCard,
    label: "Subscription",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  refund: {
    icon: RefreshCcw,
    label: "Refund",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
};

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-500/20 text-yellow-500" },
  processing: { label: "Processing", className: "bg-blue-500/20 text-blue-500" },
  completed: { label: "Completed", className: "bg-green-500/20 text-green-500" },
  failed: { label: "Failed", className: "bg-red-500/20 text-red-500" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
};

export function TransactionHistory({ transactions, isLoading }: TransactionHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary" />
              <div>
                <div className="h-4 w-24 bg-secondary rounded mb-1" />
                <div className="h-3 w-16 bg-secondary rounded" />
              </div>
            </div>
            <div className="h-5 w-16 bg-secondary rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const config = typeConfig[tx.type];
        const status = statusConfig[tx.status];
        const Icon = config.icon;
        const isPositive = tx.amount > 0;

        return (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <p className="font-medium">{tx.description || config.label}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(tx.created_at), "MMM d, yyyy • h:mm a")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${isPositive ? "text-green-500" : "text-foreground"}`}>
                {isPositive ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}>
                {status.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
