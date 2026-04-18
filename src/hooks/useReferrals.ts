import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { ReferralService, MemberReferral } from '@/utils/referralService';

export function useMyReferralCode() {
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let alive = true;
    ReferralService.getMyReferralCode(user.id)
      .then((c) => { if (alive) setCode(c); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user]);

  return { code, loading, shareUrl: code ? ReferralService.buildShareUrl(code) : '' };
}

export function useMyReferrals() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<MemberReferral[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, rewarded: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const list = await ReferralService.listMyReferrals(user.id);
      setReferrals(list);
      setStats({
        total: list.length,
        pending: list.filter((r) => r.status === 'pending').length,
        rewarded: list.filter((r) => r.status === 'rewarded').length,
        totalEarned: list
          .filter((r) => r.status === 'rewarded')
          .reduce((s, r) => s + Number(r.commission_amount || 0), 0),
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { reload(); }, [reload]);

  return { referrals, stats, loading, reload };
}
