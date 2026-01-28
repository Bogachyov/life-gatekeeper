import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'basic' | 'advanced' | 'premium';
  status: 'trialing' | 'active' | 'canceled' | 'expired';
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export function useSubscription(userId: string | undefined) {
  return useQuery({
    queryKey: ['subscription', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: !!userId,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, planType }: { userId: string; planType: string }) => {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7 day trial
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_type: planType,
          status: planType === 'basic' ? 'trialing' : 'active',
          trial_ends_at: planType === 'basic' ? trialEndsAt.toISOString() : null,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      planType, 
      status 
    }: { 
      userId: string; 
      planType?: string; 
      status?: string 
    }) => {
      const updates: Record<string, any> = {};
      if (planType) updates.plan_type = planType;
      if (status) updates.status = status;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
    },
  });
}

export function useUserRole(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-role', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data?.role as 'admin' | 'user' | null;
    },
    enabled: !!userId,
  });
}

export function isTrialExpired(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  if (subscription.status !== 'trialing') return false;
  if (!subscription.trial_ends_at) return false;
  return new Date(subscription.trial_ends_at) < new Date();
}

export function getTrialDaysRemaining(subscription: Subscription | null): number {
  if (!subscription?.trial_ends_at) return 0;
  const now = new Date();
  const trialEnd = new Date(subscription.trial_ends_at);
  const diff = trialEnd.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
