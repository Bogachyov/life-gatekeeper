import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  ArrowDownUp,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useWallet,
  usePayoutMethods,
  useTransactions,
  useAddPayoutMethod,
  useDeletePayoutMethod,
  useCreateWithdrawal,
} from "@/hooks/useWallet";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { PayoutMethodsList } from "@/components/wallet/PayoutMethodsList";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { AddPayoutMethodDialog } from "@/components/wallet/AddPayoutMethodDialog";
import { WithdrawDialog } from "@/components/wallet/WithdrawDialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Wallet() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: wallet, isLoading: walletLoading } = useWallet(user?.id);
  const { data: payoutMethods = [], isLoading: methodsLoading } = usePayoutMethods(user?.id);
  const { data: transactions = [], isLoading: txLoading } = useTransactions(user?.id);

  const addPayoutMethod = useAddPayoutMethod();
  const deletePayoutMethod = useDeletePayoutMethod();
  const createWithdrawal = useCreateWithdrawal();

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

  const handleAddPayoutMethod = async (data: {
    methodType: string;
    details: Record<string, string>;
    displayName: string;
    isDefault: boolean;
  }) => {
    if (!user) return;
    await addPayoutMethod.mutateAsync({
      userId: user.id,
      methodType: data.methodType as any,
      details: data.details,
      displayName: data.displayName,
      isDefault: data.isDefault,
    });
  };

  const handleDeletePayoutMethod = async (id: string) => {
    if (!user) return;
    await deletePayoutMethod.mutateAsync({ id, userId: user.id });
    toast({
      title: "Removed",
      description: "Payout method has been removed.",
    });
  };

  const handleWithdraw = async (payoutMethodId: string, amount: number) => {
    if (!user) return;
    await createWithdrawal.mutateAsync({
      userId: user.id,
      payoutMethodId,
      amount,
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
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Balance Overview */}
        <WalletOverview wallet={wallet || null} isLoading={walletLoading} />

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => setShowWithdraw(true)} className="flex-1 md:flex-none">
            <ArrowDownUp className="w-4 h-4 mr-2" />
            Withdraw Funds
          </Button>
          <Button variant="outline" onClick={() => setShowAddMethod(true)} className="flex-1 md:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            Add Payout Method
          </Button>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payout Methods */}
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Payout Methods</h2>
            <PayoutMethodsList
              methods={payoutMethods}
              isLoading={methodsLoading}
              onAdd={() => setShowAddMethod(true)}
              onDelete={handleDeletePayoutMethod}
            />
          </div>

          {/* Transaction History */}
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <TransactionHistory transactions={transactions} isLoading={txLoading} />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddPayoutMethodDialog
        open={showAddMethod}
        onOpenChange={setShowAddMethod}
        onAdd={handleAddPayoutMethod}
      />

      <WithdrawDialog
        open={showWithdraw}
        onOpenChange={setShowWithdraw}
        wallet={wallet || null}
        payoutMethods={payoutMethods}
        onWithdraw={handleWithdraw}
        onAddPayoutMethod={() => {
          setShowWithdraw(false);
          setShowAddMethod(true);
        }}
      />
    </DashboardLayout>
  );
}
