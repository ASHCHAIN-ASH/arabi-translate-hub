import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type InsightStatus = 'active' | 'dismissed' | 'resolved';

export interface AutomationInsight {
  id: string;
  insight_type: string;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  metric_key: string;
  metric_value: number | null;
  comparison_value: number | null;
  delta_percentage: number | null;
  context_data: Record<string, any>;
  status: InsightStatus;
  dedupe_key: string;
  detected_at: string;
  resolved_at: string | null;
  dismissed_at: string | null;
  last_seen_at: string;
}

export interface AutomationRule {
  id: string;
  rule_key: string;
  rule_name: string;
  rule_group: string;
  threshold_value: number;
  comparison_operator: string;
  lookback_days: number;
  is_active: boolean;
  recommendation_template: string;
  description: string | null;
}

export interface ActionLogEntry {
  id: string;
  insight_id: string | null;
  action_type: string;
  note: string | null;
  status: string;
  created_at: string;
  action_payload: Record<string, any>;
}

export function useGrowthAutomation() {
  const [insights, setInsights] = useState<AutomationInsight[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [ins, rl] = await Promise.all([
        supabase
          .from('automation_insights' as any)
          .select('*')
          .order('detected_at', { ascending: false })
          .limit(200),
        supabase
          .from('automation_rules' as any)
          .select('*')
          .order('rule_group'),
      ]);
      if (ins.error) throw ins.error;
      if (rl.error) throw rl.error;
      setInsights((ins.data as any) || []);
      setRules((rl.data as any) || []);
    } catch (e: any) {
      console.error('Automation load failed:', e);
      setError(e?.message || 'فشل تحميل بيانات الأتمتة');
    } finally {
      setLoading(false);
    }
  }, []);

  const runAnalysis = useCallback(async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.rpc('analyze_growth_insights' as any);
      if (error) throw error;
      await load();
      return data as any;
    } finally {
      setRunning(false);
    }
  }, [load]);

  const dismissInsight = useCallback(
    async (id: string, note?: string) => {
      const { data, error } = await supabase.rpc('dismiss_automation_insight' as any, {
        _id: id,
        _note: note ?? null,
      });
      if (error) throw error;
      const result = data as any;
      if (!result?.success) throw new Error(result?.error || 'فشل التجاهل');
      await load();
      return result;
    },
    [load]
  );

  const resolveInsight = useCallback(
    async (id: string, note?: string) => {
      const { data, error } = await supabase.rpc('resolve_automation_insight' as any, {
        _id: id,
        _note: note ?? null,
      });
      if (error) throw error;
      const result = data as any;
      if (!result?.success) throw new Error(result?.error || 'فشل الحل');
      await load();
      return result;
    },
    [load]
  );

  const updateRule = useCallback(
    async (id: string, patch: Partial<Pick<AutomationRule, 'threshold_value' | 'lookback_days' | 'is_active' | 'recommendation_template'>>) => {
      const { error } = await supabase
        .from('automation_rules' as any)
        .update(patch as any)
        .eq('id', id);
      if (error) throw error;
      await load();
    },
    [load]
  );

  useEffect(() => {
    load();
    const ch = supabase
      .channel('automation-insights-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'automation_insights' },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  return {
    insights,
    rules,
    loading,
    running,
    error,
    refresh: load,
    runAnalysis,
    dismissInsight,
    resolveInsight,
    updateRule,
  };
}
