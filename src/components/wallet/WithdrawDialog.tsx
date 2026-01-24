import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayoutMethod, Wallet } from "@/types/wallet";
import { PayoutMethodsList } from "./PayoutMethodsList";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: Wallet | null;
  payoutMethods: PayoutMethod[];
  onWithdraw: (payoutMethodId: string, amount: number) => Promise<void>;
  onAddPayoutMethod: () => void;
}

export function WithdrawDialog({
  open,
  onOpenChange,
  wallet,
  payoutMethods,
  onWithdraw,
  onAddPayoutMethod,
}: WithdrawDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod | null>(
    payoutMethods.find((m) => m.is_default) || payoutMethods[0] || null
  );
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const availableBalance = wallet?.balance || 0;
  const amountNum = parseFloat(amount) || 0;
  const isValidAmount = amountNum > 0 && amountNum <= availableBalance;

  const handleWithdraw = async () => {
    if (!selectedMethod || !isValidAmount) return;

    setIsLoading(true);
    try {
      await onWithdraw(selectedMethod.id, amountNum);
      toast({
        title: "Withdrawal requested",
        description: `Your withdrawal of $${amountNum.toFixed(2)} has been submitted.`,
      });
      onOpenChange(false);
      setAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawAll = () => {
    setAmount(availableBalance.toFixed(2));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Amount</Label>
              <span className="text-sm text-muted-foreground">
                Available: <span className="font-medium text-foreground">${availableBalance.toFixed(2)}</span>
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder="0.00"
                className="pl-7 pr-20"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={0}
                max={availableBalance}
                step={0.01}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-xs"
                onClick={handleWithdrawAll}
              >
                Withdraw All
              </Button>
            </div>
            {amountNum > availableBalance && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Insufficient balance
              </p>
            )}
          </div>

          {/* Payout method selection */}
          <div className="space-y-2">
            <Label>Payout Method</Label>
            {payoutMethods.length === 0 ? (
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Add a payout method to withdraw funds
                </p>
                <Button variant="outline" size="sm" onClick={onAddPayoutMethod}>
                  Add Payout Method
                </Button>
              </div>
            ) : (
              <PayoutMethodsList
                methods={payoutMethods}
                isLoading={false}
                onAdd={onAddPayoutMethod}
                onDelete={() => {}}
                onSelect={setSelectedMethod}
                selectedMethodId={selectedMethod?.id}
                selectable
              />
            )}
          </div>

          {/* Submit button */}
          <Button
            className="w-full"
            onClick={handleWithdraw}
            disabled={!selectedMethod || !isValidAmount || isLoading}
          >
            {isLoading ? "Processing..." : `Withdraw $${amountNum.toFixed(2)}`}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Withdrawals are typically processed within 1-3 business days.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
