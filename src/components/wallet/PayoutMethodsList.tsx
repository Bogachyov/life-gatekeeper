import { PayoutMethod, PAYOUT_METHOD_ICONS, PAYOUT_METHOD_LABELS } from "@/types/wallet";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Star, Check } from "lucide-react";
import { useState } from "react";

interface PayoutMethodsListProps {
  methods: PayoutMethod[];
  isLoading: boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onSelect?: (method: PayoutMethod) => void;
  selectedMethodId?: string;
  selectable?: boolean;
}

export function PayoutMethodsList({
  methods,
  isLoading,
  onAdd,
  onDelete,
  onSelect,
  selectedMethodId,
  selectable = false,
}: PayoutMethodsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const getMethodDescription = (method: PayoutMethod) => {
    const details = method.details;
    switch (method.method_type) {
      case "bank_transfer":
        return `****${details.account_number?.slice(-4) || "****"}`;
      case "paypal":
        return details.email || "PayPal Account";
      case "crypto":
        return `${details.network || "USDT"} - ${details.wallet_address?.slice(0, 8)}...`;
      case "mobile_money":
        return `${details.provider || "Mobile"} - ${details.phone_number || "****"}`;
      case "card":
        return `****${details.card_number?.slice(-4) || "****"}`;
      default:
        return method.display_name || "Payment Method";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-secondary/50 rounded-lg p-4 animate-pulse">
            <div className="h-5 w-32 bg-secondary rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {methods.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-4">No payout methods added yet</p>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payout Method
          </Button>
        </div>
      ) : (
        <>
          {methods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-lg bg-secondary/50 transition-all ${
                selectable ? "cursor-pointer hover:bg-secondary" : ""
              } ${selectedMethodId === method.id ? "ring-2 ring-primary bg-secondary" : ""}`}
              onClick={() => selectable && onSelect?.(method)}
            >
              <div className="flex items-center gap-3">
                {selectable && (
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethodId === method.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedMethodId === method.id && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                )}
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <span className="text-lg">{PAYOUT_METHOD_ICONS[method.method_type]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{PAYOUT_METHOD_LABELS[method.method_type]}</p>
                    {method.is_default && (
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    )}
                    {method.is_verified && (
                      <span className="text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{getMethodDescription(method)}</p>
                </div>
              </div>
              {!selectable && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(method.id)}
                  disabled={deletingId === method.id}
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </div>
          ))}
          {!selectable && (
            <Button variant="outline" className="w-full" onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payout Method
            </Button>
          )}
        </>
      )}
    </div>
  );
}
