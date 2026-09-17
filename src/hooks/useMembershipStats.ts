import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/data/legacy/client';
import { useAuth } from '@/components/SimpleAuthProvider';

export interface MembershipStats {
  walletBalance: number;
  totalCashback: number;       // جميع إيداعات الكاش باك للعضويات
  totalSavings: number;        // مجموع الخصومات المطبقة على الطلبات
  totalReferralEarnings: number;
  referralsCount: number;
  rewardedReferralsCount: number;
  ordersCount: number;
  daysRemaining: number | null;
  membershipProgress: number; // 0-100 نسبة المتبقي من العضوية
}

const ZERO: MembershipStats = {
  walletBalance: 0,
  totalCashback: 0,
  totalSavings: 0,
  totalReferralEarnings: 0,
  referralsCount: 0,
  rewardedReferralsCount: 0,
  ordersCount: 0,
  daysRemaining: null,
  membershipProgress: 0,
};

/**
 * Live, realtime stats for the membership dashboard.
 * Subscribes to wallet_transactions + member_referrals + service_orders.
 */
export function useMembershipStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MembershipStats>(ZERO);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setStats(ZERO); setLoading(false); return; }

    const [
      walletRes,
      cashbackRes,
      referralEarningsRes,
      referralsRes,
      ordersRes,
      membershipRes,
    ] = await Promise.all([
      supabase.from('wallets').select('balance').eq('user_id', user.id).maybeSingle(),
      supabase
        .from('wallet_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('reference_type', 'membership_cashback'),
      supabase
        .from('wallet_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('reference_type', 'referral_commission'),
      supabase
        .from('member_referrals' as any)
        .select('id, status')
        .eq('referrer_user_id', user.id),
      supabase
        .from('service_orders')
        .select('id, total_amount, discount_amount')
        .eq('user_id', user.id),
      supabase
        .from('user_memberships' as any)
        .select('starts_at, expires_at, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const balance = Number((walletRes.data as any)?.balance ?? 0);
    const totalCashback = (cashbackRes.data || []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0);
    const totalReferralEarnings = (referralEarningsRes.data || []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0);
    const refs = (referralsRes.data as any[]) || [];
    const orders = (ordersRes.data as any[]) || [];
    const totalSavings = orders.reduce((s, o) => s + Number(o.discount_amount || 0), 0);

    // Membership window
    const m = membershipRes.data as any;
    let daysRemaining: number | null = null;
    let progress = 0;
    if (m?.expires_at) {
      const now = Date.now();
      const exp = new Date(m.expires_at).getTime();
      const start = m.starts_at ? new Date(m.starts_at).getTime() : now;
      const total = Math.max(1, exp - start);
      const elapsed = Math.max(0, Math.min(total, now - start));
      progress = Math.round((elapsed / total) * 100);
      daysRemaining = Math.max(0, Math.ceil((exp - now) / (1000 * 60 * 60 * 24)));
    }

    setStats({
      walletBalance: balance,
      totalCashback,
      totalSavings,
      totalReferralEarnings,
      referralsCount: refs.length,
      rewardedReferralsCount: refs.filter((r) => r.status === 'rewarded').length,
      ordersCount: orders.length,
      daysRemaining,
      membershipProgress: progress,
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime subscriptions — instantly refresh on any related change
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`membership-stats-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_transactions', filter: `user_id=eq.${user.id}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'member_referrals', filter: `referrer_user_id=eq.${user.id}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_memberships', filter: `user_id=eq.${user.id}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_orders', filter: `user_id=eq.${user.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, load]);

  return { stats, loading, reload: load };
}
