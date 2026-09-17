import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/data/legacy/client';
import { toast } from 'sonner';

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';
export type TargetArea = 'challenge_result_screen' | 'referral_page' | 'onboarding_flow' | 'share_cta';

export interface Experiment {
  id: string;
  experiment_key: string;
  name: string;
  description: string | null;
  hypothesis: string | null;
  status: ExperimentStatus;
  target_area: TargetArea;
  traffic_allocation_percentage: number;
  primary_metric: string;
  secondary_metrics: string[];
  start_at: string | null;
  end_at: string | null;
  winner_variant_id: string | null;
  min_sample_size: number;
  created_at: string;
  updated_at: string;
}

export interface Variant {
  id: string;
  experiment_id: string;
  variant_key: string;
  name: string;
  is_control: boolean;
  allocation_percentage: number;
  config_payload: Record<string, any>;
}

export function useAdminExperiments() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('فشل تحميل التجارب');
    setExperiments((data as any) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { experiments, loading, reload: load };
}

export function useExperimentDetail(id?: string) {
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [results, setResults] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [{ data: exp }, { data: vars }, { data: logs }] = await Promise.all([
      supabase.from('experiments').select('*').eq('id', id).maybeSingle(),
      supabase.from('experiment_variants').select('*').eq('experiment_id', id).order('is_control', { ascending: false }),
      supabase.from('experiment_audit_logs').select('*').eq('experiment_id', id).order('created_at', { ascending: false }).limit(50),
    ]);
    setExperiment((exp as any) ?? null);
    setVariants((vars as any) ?? []);
    setAuditLogs((logs as any) ?? []);

    const { data: res } = await supabase.rpc('compute_experiment_results', { p_experiment_id: id });
    setResults(res ?? null);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { experiment, variants, results, auditLogs, loading, reload: load };
}

export async function createExperiment(payload: {
  experiment_key: string;
  name: string;
  description?: string;
  hypothesis?: string;
  target_area: TargetArea;
  primary_metric: string;
  secondary_metrics?: string[];
  traffic_allocation_percentage?: number;
  variants: Array<{ variant_key: string; name: string; is_control: boolean; allocation_percentage: number; config_payload: Record<string, any> }>;
}) {
  // Validation
  if (!payload.experiment_key || !payload.name || !payload.primary_metric) {
    throw new Error('الحقول الأساسية مطلوبة');
  }
  if (payload.variants.length < 2) throw new Error('يجب إضافة نسختين على الأقل');
  const total = payload.variants.reduce((s, v) => s + Number(v.allocation_percentage || 0), 0);
  if (Math.round(total) !== 100) throw new Error(`مجموع نسب التوزيع يجب أن يكون 100% (الحالي ${total}%)`);
  if (!payload.variants.some((v) => v.is_control)) throw new Error('يجب تحديد نسخة Control واحدة');

  const { data: exp, error: e1 } = await supabase
    .from('experiments')
    .insert({
      experiment_key: payload.experiment_key,
      name: payload.name,
      description: payload.description ?? null,
      hypothesis: payload.hypothesis ?? null,
      target_area: payload.target_area,
      primary_metric: payload.primary_metric,
      secondary_metrics: payload.secondary_metrics ?? [],
      traffic_allocation_percentage: payload.traffic_allocation_percentage ?? 100,
    })
    .select()
    .single();
  if (e1 || !exp) throw new Error(e1?.message ?? 'فشل إنشاء التجربة');

  const { error: e2 } = await supabase.from('experiment_variants').insert(
    payload.variants.map((v) => ({ ...v, experiment_id: exp.id })),
  );
  if (e2) throw new Error(e2.message);

  await supabase.from('experiment_audit_logs').insert({
    experiment_id: exp.id,
    action_type: 'create_experiment',
    after_state: exp as any,
  });

  return exp;
}

export async function callLifecycle(action: 'launch' | 'pause' | 'complete' | 'archive', id: string, opts?: { winner_variant_id?: string; note?: string }) {
  if (action === 'launch') return supabase.rpc('launch_experiment', { p_experiment_id: id });
  if (action === 'pause') return supabase.rpc('pause_experiment', { p_experiment_id: id, p_note: opts?.note ?? null });
  if (action === 'complete') return supabase.rpc('complete_experiment', { p_experiment_id: id, p_winner_variant_id: opts?.winner_variant_id ?? null, p_note: opts?.note ?? null });
  if (action === 'archive') return supabase.rpc('archive_experiment', { p_experiment_id: id });
  throw new Error('unknown action');
}
