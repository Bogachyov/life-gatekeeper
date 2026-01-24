export type PayoutMethodType = 'bank_transfer' | 'paypal' | 'crypto' | 'mobile_money' | 'card';

export interface PayoutMethod {
  id: string;
  user_id: string;
  method_type: PayoutMethodType;
  is_default: boolean;
  details: Record<string, string>;
  display_name: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  pending_balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'subscription_payment' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payout_method_id: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  completed_at: string | null;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  payout_method_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  rejection_reason: string | null;
  processed_at: string | null;
  created_at: string;
}

export const PAYOUT_METHOD_ICONS: Record<PayoutMethodType, string> = {
  bank_transfer: '🏦',
  paypal: '💳',
  crypto: '₿',
  mobile_money: '📱',
  card: '💳',
};

export const PAYOUT_METHOD_LABELS: Record<PayoutMethodType, string> = {
  bank_transfer: 'Bank Transfer',
  paypal: 'PayPal',
  crypto: 'Crypto (USDT/USDC)',
  mobile_money: 'Mobile Money',
  card: 'Debit/Credit Card',
};
