import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, PayoutMethod, Transaction, WithdrawalRequest, PayoutMethodType } from "@/types/wallet";

export function useWallet(userId: string | undefined) {
  return useQuery({
    queryKey: ["wallet", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error) throw error;
      
      // Create wallet if it doesn't exist
      if (!data) {
        const { data: newWallet, error: createError } = await supabase
          .from("wallets")
          .insert({ user_id: userId })
          .select()
          .single();
        
        if (createError) throw createError;
        return newWallet as Wallet;
      }
      
      return data as Wallet;
    },
    enabled: !!userId,
  });
}

export function usePayoutMethods(userId: string | undefined) {
  return useQuery({
    queryKey: ["payout-methods", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("payout_methods")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as PayoutMethod[];
    },
    enabled: !!userId,
  });
}

export function useTransactions(userId: string | undefined) {
  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!userId,
  });
}

export function useWithdrawalRequests(userId: string | undefined) {
  return useQuery({
    queryKey: ["withdrawal-requests", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as WithdrawalRequest[];
    },
    enabled: !!userId,
  });
}

export function useAddPayoutMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      methodType,
      details,
      displayName,
      isDefault,
    }: {
      userId: string;
      methodType: PayoutMethodType;
      details: Record<string, string>;
      displayName: string;
      isDefault?: boolean;
    }) => {
      // If setting as default, unset other defaults first
      if (isDefault) {
        await supabase
          .from("payout_methods")
          .update({ is_default: false })
          .eq("user_id", userId);
      }
      
      const { data, error } = await supabase
        .from("payout_methods")
        .insert({
          user_id: userId,
          method_type: methodType,
          details,
          display_name: displayName,
          is_default: isDefault || false,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payout-methods", variables.userId] });
    },
  });
}

export function useDeletePayoutMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase
        .from("payout_methods")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payout-methods", variables.userId] });
    },
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      payoutMethodId,
      amount,
      currency = "USD",
    }: {
      userId: string;
      payoutMethodId: string;
      amount: number;
      currency?: string;
    }) => {
      // Create withdrawal request
      const { data: withdrawal, error: withdrawalError } = await supabase
        .from("withdrawal_requests")
        .insert({
          user_id: userId,
          payout_method_id: payoutMethodId,
          amount,
          currency,
        })
        .select()
        .single();
      
      if (withdrawalError) throw withdrawalError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          type: "withdrawal",
          amount: -amount,
          currency,
          status: "pending",
          payout_method_id: payoutMethodId,
          description: "Withdrawal request",
        });
      
      if (transactionError) throw transactionError;
      
      return withdrawal;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wallet", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["transactions", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests", variables.userId] });
    },
  });
}
