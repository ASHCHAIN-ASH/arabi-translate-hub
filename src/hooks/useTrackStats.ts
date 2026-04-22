import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrackStat {
  track_id: string;
  tools_count: number;
  free_count: number;
  premium_count: number;
}

export interface TrackUsageStat {
  track_id: string;
  uses_count: number;
}

/**
 * Aggregate counts of tools per track (active only).
 */
export function useTrackStats() {
  const [stats, setStats] = useState<Record<string, TrackStat>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from('track_tools')
        .select('track_id, is_premium')
        .eq('is_active', true);
      const map: Record<string, TrackStat> = {};
      (data || []).forEach((row: any) => {
        const s = map[row.track_id] || {
          track_id: row.track_id,
          tools_count: 0,
          free_count: 0,
          premium_count: 0,
        };
        s.tools_count += 1;
        if (row.is_premium) s.premium_count += 1;
        else s.free_count += 1;
        map[row.track_id] = s;
      });
      setStats(map);
      setLoading(false);
    })();
  }, []);

  return { stats, loading };
}

/**
 * Returns the user's most-used tracks (last 60 days) for the "recommended" section.
 */
export function useUserTrackUsage(userId?: string) {
  const [usage, setUsage] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await (supabase as any)
        .from('track_tool_usage_logs')
        .select('track_id')
        .eq('user_id', userId)
        .gte('created_at', since);
      const map: Record<string, number> = {};
      (data || []).forEach((row: any) => {
        map[row.track_id] = (map[row.track_id] || 0) + 1;
      });
      setUsage(map);
    })();
  }, [userId]);

  return { usage };
}
