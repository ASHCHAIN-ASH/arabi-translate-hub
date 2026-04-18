import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type MindMapLang = 'ar' | 'en';

export interface MindMapNodeData {
  title: string;
  children?: MindMapNodeData[];
}

export interface MindMapData {
  title: string;
  central_topic: string;
  language: MindMapLang;
  branches: MindMapNodeData[];
}

export interface SavedMindMap {
  id: string;
  title: string;
  language: MindMapLang;
  source_text: string;
  map_data: MindMapData;
  created_at: string;
}

export function useMindMapGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MindMapData | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const generate = useCallback(async (text: string, language: MindMapLang) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res, error: fnErr } = await supabase.functions.invoke('mind-map-generator', {
        body: { text, language },
      });
      if (fnErr) {
        const msg = (fnErr as any)?.message || 'تعذر توليد الخريطة';
        setError(msg);
        return null;
      }
      if ((res as any)?.error) {
        setError((res as any).error);
        return null;
      }
      const map: MindMapData = (res as any).map;
      setData(map);
      setRemaining((res as any).remaining ?? null);
      setLimit((res as any).limit ?? null);
      setIsPremium(!!(res as any).is_premium);
      return map;
    } catch (e: any) {
      setError(e?.message || 'حدث خطأ');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { generate, reset, loading, error, data, remaining, limit, isPremium, setData };
}

export function useSavedMindMaps(userId?: string) {
  const [maps, setMaps] = useState<SavedMindMap[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data } = await (supabase as any)
      .from('mind_maps')
      .select('id, title, language, source_text, map_data, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    setMaps((data || []) as SavedMindMap[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const save = useCallback(async (payload: {
    title: string; language: MindMapLang; source_text: string; map_data: MindMapData;
  }) => {
    if (!userId) return { error: new Error('not authenticated') };
    const { error } = await (supabase as any).from('mind_maps').insert({
      user_id: userId,
      title: payload.title,
      language: payload.language,
      source_text: payload.source_text,
      map_data: payload.map_data,
    });
    if (!error) await refresh();
    return { error };
  }, [userId, refresh]);

  const remove = useCallback(async (id: string) => {
    const { error } = await (supabase as any).from('mind_maps').delete().eq('id', id);
    if (!error) await refresh();
    return { error };
  }, [refresh]);

  return { maps, loading, refresh, save, remove };
}
