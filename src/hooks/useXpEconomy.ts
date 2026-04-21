import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { XpEconomyService, XpSummary, XpTransaction } from '@/utils/xpEconomyService';

export const useXpEconomy = (userId?: string) => {
  const [summary, setSummary] = useState<XpSummary | null>(null);
  const [transactions, setTransactions] = useState<XpTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      setError(null);
      const [s, t] = await Promise.all([
        XpEconomyService.getSummary(userId),
        XpEconomyService.getTransactions(userId, 15),
      ]);
      setSummary(s);
      setTransactions(t);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'تعذّر تحميل بيانات XP');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime: refresh on wallet/transactions changes
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`xp-${userId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_xp_wallet', filter: `user_id=eq.${userId}` },
        () => refresh())
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'xp_transactions', filter: `user_id=eq.${userId}` },
        () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, refresh]);

  return { summary, transactions, loading, error, refresh };
};
