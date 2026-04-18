import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useStatEngine() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(async (action: string, payload: any) => {
    setLoading(true); setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('statistical-engine', {
        body: { action, payload }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    } catch (e: any) {
      setError(e.message || 'فشل التحليل');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { call, loading, error };
}
