import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  ChallengeReferralService,
  ChallengeReferral,
  ReferralStats,
} from '@/utils/challengeReferralService';

export function useChallengeReferral(userId: string | undefined) {
  const [code, setCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<ChallengeReferral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({ total: 0, pending: 0, completed: 0, totalXp: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [c, list, s] = await Promise.all([
      ChallengeReferralService.getOrCreateMyCode(userId),
      ChallengeReferralService.listMyReferrals(userId),
      ChallengeReferralService.getStats(userId),
    ]);
    setCode(c);
    setReferrals(list);
    setStats(s);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) refresh();
  }, [userId, refresh]);

  // Realtime updates on new referrals/rewards for this user
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`referrals-${userId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'referrals', filter: `referrer_user_id=eq.${userId}` },
        () => refresh()
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'referral_rewards', filter: `user_id=eq.${userId}` },
        () => refresh()
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, refresh]);

  const shareUrl = code ? ChallengeReferralService.buildShareUrl(code) : '';
  const challengeShareUrl = code ? ChallengeReferralService.buildChallengeShareUrl(code) : '';

  return { code, shareUrl, challengeShareUrl, referrals, stats, loading, refresh };
}
