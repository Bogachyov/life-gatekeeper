import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PayoutMethodType, PAYOUT_METHOD_ICONS, PAYOUT_METHOD_LABELS } from "@/types/wallet";
import { useToast } from "@/hooks/use-toast";

interface AddPayoutMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: {
    methodType: PayoutMethodType;
    details: Record<string, string>;
    displayName: string;
    isDefault: boolean;
  }) => Promise<void>;
}

const methodTypes: PayoutMethodType[] = [
  "bank_transfer",
  "paypal",
  "crypto",
  "mobile_money",
  "card",
];

export function AddPayoutMethodDialog({ open, onOpenChange, onAdd }: AddPayoutMethodDialogProps) {
  const [step, setStep] = useState<"select" | "details">("select");
  const [selectedType, setSelectedType] = useState<PayoutMethodType | null>(null);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [displayName, setDisplayName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectType = (type: PayoutMethodType) => {
    setSelectedType(type);
    setDetails({});
    setDisplayName(PAYOUT_METHOD_LABELS[type]);
    setStep("details");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedType(null);
    setDetails({});
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    
    setIsLoading(true);
    try {
      await onAdd({
        methodType: selectedType,
        details,
        displayName,
        isDefault,
      });
      toast({
        title: "Payout method added",
        description: "Your payout method has been added successfully.",
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payout method. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep("select");
    setSelectedType(null);
    setDetails({});
    setDisplayName("");
    setIsDefault(false);
  };

  const renderDetailsForm = () => {
    switch (selectedType) {
      case "bank_transfer":
        return (
          <>
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input
                placeholder="Enter bank name"
                value={details.bank_name || ""}
                onChange={(e) => setDetails({ ...details, bank_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Account Holder Name</Label>
              <Input
                placeholder="Enter account holder name"
                value={details.account_holder || ""}
                onChange={(e) => setDetails({ ...details, account_holder: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Account Number / IBAN</Label>
              <Input
                placeholder="Enter account number"
                value={details.account_number || ""}
                onChange={(e) => setDetails({ ...details, account_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Routing Number / SWIFT / BIC</Label>
              <Input
                placeholder="Enter routing number"
                value={details.routing_number || ""}
                onChange={(e) => setDetails({ ...details, routing_number: e.target.value })}
              />
            </div>
          </>
        );

      case "paypal":
        return (
          <div className="space-y-2">
            <Label>PayPal Email</Label>
            <Input
              type="email"
              placeholder="Enter PayPal email"
              value={details.email || ""}
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
            />
          </div>
        );

      case "crypto":
        return (
          <>
            <div className="space-y-2">
              <Label>Network</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={details.network || ""}
                onChange={(e) => setDetails({ ...details, network: e.target.value })}
              >
                <option value="">Select network</option>
                <option value="USDT (TRC20)">USDT (TRC20)</option>
                <option value="USDT (ERC20)">USDT (ERC20)</option>
                <option value="USDC (ERC20)">USDC (ERC20)</option>
                <option value="USDC (SOL)">USDC (Solana)</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <Input
                placeholder="Enter wallet address"
                value={details.wallet_address || ""}
                onChange={(e) => setDetails({ ...details, wallet_address: e.target.value })}
              />
            </div>
          </>
        );

      case "mobile_money":
        return (
          <>
            <div className="space-y-2">
              <Label>Provider</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={details.provider || ""}
                onChange={(e) => setDetails({ ...details, provider: e.target.value })}
              >
                <option value="">Select provider</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="MTN Mobile Money">MTN Mobile Money</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Tigo Pesa">Tigo Pesa</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={details.phone_number || ""}
                onChange={(e) => setDetails({ ...details, phone_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input
                placeholder="Enter account name"
                value={details.account_name || ""}
                onChange={(e) => setDetails({ ...details, account_name: e.target.value })}
              />
            </div>
          </>
        );

      case "card":
        return (
          <>
            <div className="space-y-2">
              <Label>Cardholder Name</Label>
              <Input
                placeholder="Enter cardholder name"
                value={details.cardholder_name || ""}
                onChange={(e) => setDetails({ ...details, cardholder_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input
                placeholder="Enter card number"
                value={details.card_number || ""}
                onChange={(e) => setDetails({ ...details, card_number: e.target.value })}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  placeholder="MM/YY"
                  value={details.expiry || ""}
                  onChange={(e) => setDetails({ ...details, expiry: e.target.value })}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Card Type</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={details.card_type || ""}
                  onChange={(e) => setDetails({ ...details, card_type: e.target.value })}
                >
                  <option value="">Select type</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Verve">Verve</option>
                </select>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetForm(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "select" ? "Add Payout Method" : `Add ${PAYOUT_METHOD_LABELS[selectedType!]}`}
          </DialogTitle>
        </DialogHeader>

        {step === "select" ? (
          <div className="grid gap-3">
            {methodTypes.map((type) => (
              <button
                key={type}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
                onClick={() => handleSelectType(type)}
              >
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <span className="text-2xl">{PAYOUT_METHOD_ICONS[type]}</span>
                </div>
                <div>
                  <p className="font-medium">{PAYOUT_METHOD_LABELS[type]}</p>
                  <p className="text-sm text-muted-foreground">
                    {type === "bank_transfer" && "Receive funds to your bank account"}
                    {type === "paypal" && "Withdraw to your PayPal account"}
                    {type === "crypto" && "Receive USDT, USDC, or other crypto"}
                    {type === "mobile_money" && "M-Pesa, MTN, Airtel, and more"}
                    {type === "card" && "Receive funds to your debit or credit card"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {renderDetailsForm()}

            <div className="space-y-2">
              <Label>Display Name (optional)</Label>
              <Input
                placeholder="e.g., My Main Account"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="default-toggle">Set as default payout method</Label>
              <Switch
                id="default-toggle"
                checked={isDefault}
                onCheckedChange={setIsDefault}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
                {isLoading ? "Adding..." : "Add Method"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
