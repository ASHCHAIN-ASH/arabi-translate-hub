import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/data/legacy/client';
import { useAuth } from '@/components/SimpleAuthProvider';

const ANON_KEY = 'mep_anon_id';

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    id = (crypto as any).randomUUID?.() ?? `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

export interface VariantAssignment {
  variant_id: string;
  variant_key: string;
  config_payload: Record<string, any>;
  is_control: boolean;
}

/**
 * Assigns the current viewer to a variant of an experiment, deterministically.
 * Returns null if the experiment is not running or the user is excluded by traffic allocation.
 */
export function useExperiment<T = Record<string, any>>(
  experimentKey: string,
  fallbackConfig?: T,
) {
  const { user } = useAuth();
  const [variant, setVariant] = useState<VariantAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const viewedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('assign_experiment_variant', {
          p_experiment_key: experimentKey,
          p_user_id: user?.id ?? null,
          p_anonymous_id: user?.id ? null : getAnonymousId(),
          p_context: { path: window.location.pathname },
        });
        if (cancelled) return;
        const row = Array.isArray(data) && data.length > 0 ? data[0] as any : null;
        setVariant(row);
      } catch {
        if (!cancelled) setVariant(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (experimentKey) run();
    return () => { cancelled = true; };
  }, [experimentKey, user?.id]);

  const track = useCallback(
    async (eventType: string, metricValue?: number, metadata?: Record<string, any>) => {
      try {
        await supabase.rpc('track_experiment_event', {
          p_experiment_key: experimentKey,
          p_event_type: eventType,
          p_user_id: user?.id ?? null,
          p_anonymous_id: user?.id ? null : getAnonymousId(),
          p_metric_value: metricValue ?? null,
          p_metadata: metadata ?? {},
        });
      } catch { /* silent */ }
    },
    [experimentKey, user?.id],
  );

  // Auto-track first view
  useEffect(() => {
    if (variant && !viewedRef.current) {
      viewedRef.current = true;
      track('experiment_viewed');
    }
  }, [variant, track]);

  const config = (variant?.config_payload ?? fallbackConfig ?? {}) as T;

  return { variant, config, loading, track, isInExperiment: !!variant };
}
