import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  GamificationService,
  GamificationReward,
  PointTransaction,
  UserPointsSummary,
  UserReward,
} from '@/utils/gamificationService';

export const useGamification = (userId?: string) => {
  const [summary, setSummary] = useState<UserPointsSummary | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [rewards, setRewards] = useState<GamificationReward[]>([]);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      setError(null);
      const [s, t, r, ur] = await Promise.all([
        GamificationService.getUserSummary(userId),
        GamificationService.getTransactions(userId),
        GamificationService.getRewards(),
        GamificationService.getUserRewards(userId),
      ]);
      setSummary(s); setTransactions(t); setRewards(r); setUserRewards(ur);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'تعذر تحميل بيانات المكافآت');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime: refresh when point_transactions for this user change
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`gamification-${userId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'point_transactions', filter: `user_id=eq.${userId}` },
        () => { refresh(); })
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_points', filter: `user_id=eq.${userId}` },
        () => { refresh(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, refresh]);

  return { summary, transactions, rewards, userRewards, loading, error, refresh };
};
