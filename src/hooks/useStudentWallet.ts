import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StudentWallet {
  id: string;
  user_id: string;
  points_balance: number;
  pending_points: number;
  redeemed_points: number;
  cash_balance: number;
  lifetime_earned_points: number;
  status: 'active' | 'suspended' | 'locked';
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  wallet_id: string;
  transaction_type: 'earn' | 'redeem' | 'adjust' | 'reverse';
  source_type: string;
  source_id: string | null;
  points_amount: number;
  cash_amount: number;
  status: 'pending' | 'completed' | 'rejected' | 'reversed';
  description: string | null;
  metadata: any;
  created_at: string;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  wallet_id: string;
  redemption_type: 'coupon' | 'cash' | 'gift' | 'service_credit';
  points_spent: number;
  cash_value: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requested_at: string;
  reviewed_at: string | null;
  notes: string | null;
}

export const useStudentWallet = (userId?: string) => {
  const [wallet, setWallet] = useState<StudentWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ensureWallet = useCallback(async () => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase.functions.invoke('ensure_student_wallet', { body: {} });
      if (error) throw error;
      return data?.wallet as StudentWallet | null;
    } catch (e: any) {
      console.error('ensure_student_wallet failed', e);
      return null;
    }
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      setError(null);
      // Ensure wallet exists
      let w: StudentWallet | null = null;
      const { data: existing } = await (supabase as any)
        .from('student_wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      w = existing as StudentWallet | null;
      if (!w) w = await ensureWallet();

      const [txRes, redRes] = await Promise.all([
        (supabase as any)
          .from('student_wallet_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(15),
        (supabase as any)
          .from('reward_redemptions')
          .select('*')
          .eq('user_id', userId)
          .order('requested_at', { ascending: false })
          .limit(10),
      ]);

      setWallet(w);
      setTransactions((txRes.data as WalletTransaction[]) || []);
      setRedemptions((redRes.data as RewardRedemption[]) || []);
    } catch (e: any) {
      console.error('wallet refresh failed', e);
      setError(e?.message || 'تعذّر تحميل المحفظة');
    } finally {
      setLoading(false);
    }
  }, [userId, ensureWallet]);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`student-wallet:${userId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'student_wallets', filter: `user_id=eq.${userId}` },
        () => refresh())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'student_wallet_transactions', filter: `user_id=eq.${userId}` },
        () => refresh())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'reward_redemptions', filter: `user_id=eq.${userId}` },
        () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, refresh]);

  const requestRedemption = useCallback(async (
    redemption_type: RewardRedemption['redemption_type'],
    points_spent: number,
    notes?: string,
  ) => {
    const { data, error } = await supabase.functions.invoke('request_reward_redemption', {
      body: { redemption_type, points_spent, notes },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    await refresh();
    return data;
  }, [refresh]);

  return { wallet, transactions, redemptions, loading, error, refresh, requestRedemption };
};
