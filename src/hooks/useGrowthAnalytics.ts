import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GrowthOverview {
  period_days: number;
  new_users: number;
  active_users: number;
  challenges_completed: number;
  shares_count: number;
  referrals_count: number;
  referrals_completed: number;
  conversion_rate: number;
}

export interface DailyMetric {
  date: string;
  new_users: number;
  active_users: number;
  challenges_completed: number;
  shares_count: number;
  referrals_count: number;
  referrals_completed: number;
  retention_rate: number;
}

export interface FunnelStage { stage: string; label: string; value: number; }
export interface RetentionData { cohort_size: number; day1: number; day3: number; day7: number; }
export interface SourceRow { source: string; users: number; percentage: number; }
export interface LeaderRow {
  referrer_user_id: string;
  referrer_name: string;
  total_invites: number;
  completed_invites: number;
  conversion_rate: number;
}
export interface TopChallenge {
  challenge_id: string;
  title: string;
  attempts: number;
  perfect: number;
  shares: number;
}

export function useGrowthAnalytics(days: number = 30) {
  const [overview, setOverview] = useState<GrowthOverview | null>(null);
  const [series, setSeries] = useState<DailyMetric[]>([]);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [retention, setRetention] = useState<RetentionData | null>(null);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderRow[]>([]);
  const [topChallenges, setTopChallenges] = useState<TopChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [ov, sr, fn, rt, sc, lb, tc] = await Promise.all([
        supabase.rpc('get_growth_overview', { p_days: days }),
        supabase.rpc('get_growth_daily_series', { p_days: days }),
        supabase.rpc('get_growth_funnel', { p_days: days }),
        supabase.rpc('get_retention_cohort', { p_days: days }),
        supabase.rpc('get_growth_sources', { p_days: days }),
        supabase.rpc('get_referral_leaderboard', { p_limit: 10 }),
        supabase.rpc('get_top_challenges', { p_days: days, p_limit: 5 }),
      ]);

      if (ov.error) throw ov.error;
      setOverview(ov.data as unknown as GrowthOverview);
      setSeries((sr.data as any) || []);
      setFunnel((fn.data as any) || []);
      setRetention((rt.data as unknown as RetentionData) || null);
      setSources((sc.data as any) || []);
      setLeaderboard((lb.data as any) || []);
      setTopChallenges((tc.data as any) || []);
    } catch (e: any) {
      console.error('Growth analytics load failed:', e);
      setError(e?.message || 'فشل تحميل تحليلات النمو');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
    const ch = supabase
      .channel('growth-events-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'growth_events' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  return { overview, series, funnel, retention, sources, leaderboard, topChallenges, loading, error, refresh: load };
}
