import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Track {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string | null;
  description_ar: string | null;
  icon: string;
  color: string;
  cover_image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface TrackTool {
  id: string;
  track_id: string;
  slug: string;
  name_ar: string;
  name_en: string | null;
  description_ar: string | null;
  icon: string;
  badge: string | null;
  tool_type: 'ai' | 'external' | 'internal';
  action_link: string | null;
  price: number;
  free_daily_quota: number;
  is_active: boolean;
  is_premium: boolean;
  sort_order: number;
  metadata: any;
}

export interface ToolUsageLog {
  id: string;
  user_id: string;
  tool_id: string;
  track_id: string;
  cost: number;
  was_free: boolean;
  created_at: string;
}

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from('tracks')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      setTracks((data || []) as Track[]);
      setLoading(false);
    })();
  }, []);

  return { tracks, loading };
}

export function useTrack(slug?: string) {
  const [track, setTrack] = useState<Track | null>(null);
  const [tools, setTools] = useState<TrackTool[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    const { data: t } = await (supabase as any)
      .from('tracks').select('*').eq('slug', slug).maybeSingle();
    if (t) {
      setTrack(t as Track);
      const { data: tls } = await (supabase as any)
        .from('track_tools').select('*')
        .eq('track_id', (t as any).id).eq('is_active', true)
        .order('sort_order');
      setTools((tls || []) as TrackTool[]);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => { refresh(); }, [refresh]);

  return { track, tools, loading, refresh };
}

export function useToolUsageToday(userId?: string) {
  const [usageMap, setUsageMap] = useState<Record<string, number>>({});

  const refresh = useCallback(async () => {
    if (!userId) return;
    const { data } = await (supabase as any)
      .from('track_tool_usage_logs')
      .select('tool_id, was_free, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
    const map: Record<string, number> = {};
    (data || []).forEach((r: any) => {
      if (r.was_free) map[r.tool_id] = (map[r.tool_id] || 0) + 1;
    });
    setUsageMap(map);
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  // realtime subscription for new usage rows
  useEffect(() => {
    if (!userId) return;
    const ch = (supabase as any)
      .channel(`usage-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'track_tool_usage_logs',
        filter: `user_id=eq.${userId}`,
      }, () => refresh())
      .subscribe();
    return () => { (supabase as any).removeChannel(ch); };
  }, [userId, refresh]);

  return { usageMap, refresh };
}

export async function useTrackTool(toolId: string): Promise<{
  ok: boolean; was_free: boolean; charged: number; action_link: string | null; error?: string;
}> {
  const { data, error } = await (supabase as any).rpc('use_track_tool', { _tool_id: toolId });
  if (error) return { ok: false, was_free: false, charged: 0, action_link: null, error: error.message };
  return data as any;
}
