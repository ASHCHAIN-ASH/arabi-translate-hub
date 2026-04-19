import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EMPTY_CV, type AcademicCVRow, type CVData, type CVLanguage, type CVTemplate } from './types';

const sb = supabase as any;

export function useMyCV(userId?: string) {
  const [cv, setCv] = useState<AcademicCVRow | null>(null);
  const [loading, setLoading] = useState(true);

  const ensure = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await sb
      .from('academic_cvs')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) { console.error(error); setLoading(false); return; }

    if (!data) {
      const { data: created } = await sb.from('academic_cvs').insert({
        user_id: userId, title: 'سيرتي الذاتية', language: 'ar',
        template_key: 'minimal', data: EMPTY_CV, status: 'draft',
      }).select('*').single();
      setCv(created as AcademicCVRow);
    } else {
      setCv({ ...data, data: { ...EMPTY_CV, ...(data.data || {}) } } as AcademicCVRow);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { ensure(); }, [ensure]);

  // ----- Helpers -----
  const isLocked = !!cv && cv.status === 'paid';
  const canSwapTemplate = !!cv
    && cv.status === 'paid'
    && !cv.template_swap_used
    && !!cv.template_swap_deadline
    && new Date(cv.template_swap_deadline).getTime() > Date.now();

  // Generic update for *non-locked* fields. After payment, template_key is
  // controlled by the server — the trigger will reject any direct change.
  const update = useCallback(async (patch: Partial<AcademicCVRow>) => {
    if (!cv) return;
    // Strip server-managed fields the client must never write directly
    const safe: any = { ...patch };
    delete safe.status;
    delete safe.locked_template_key;
    delete safe.paid_at;
    delete safe.paid_amount;
    delete safe.template_swap_used;
    delete safe.template_swap_deadline;
    delete safe.purchase_id;
    delete safe.exports_count;
    delete safe.last_exported_at;

    const next = { ...cv, ...patch } as AcademicCVRow;
    setCv(next);

    const { error } = await sb.from('academic_cvs').update({
      title: next.title,
      language: next.language,
      template_key: next.template_key,
      data: next.data,
    }).eq('id', cv.id);

    if (error) {
      // Roll back optimistic state on guard rejection
      console.error('CV update rejected:', error);
      await ensure();
      throw error;
    }
  }, [cv, ensure]);

  const updateData = useCallback((mut: (d: CVData) => CVData) => {
    if (!cv) return;
    const newData = mut(cv.data);
    update({ data: newData });
  }, [cv, update]);

  const setLanguage = (language: CVLanguage) => update({ language });
  const setTitle = (title: string) => update({ title });

  // Template change is special:
  //  - Before payment → free, just update template_key
  //  - After payment  → must use swap_cv_template RPC (one-time, 24h)
  const setTemplate = useCallback(async (template_key: CVTemplate) => {
    if (!cv) return;
    if (cv.status !== 'paid') {
      return update({ template_key });
    }
    // Locked CV → must call swap RPC
    if (template_key === cv.locked_template_key) return;
    const { data, error } = await sb.rpc('swap_cv_template', {
      _cv_id: cv.id, _new_template_key: template_key,
    });
    if (error) throw error;
    await ensure();
    return data as { ok: boolean; new_template_key: string; swap_used: boolean };
  }, [cv, update, ensure]);

  // Purchase: locks the chosen template and creates cv_purchases row
  const purchaseCv = useCallback(async (template_key?: CVTemplate) => {
    if (!cv) throw new Error('no_cv');
    const tpl = template_key || cv.template_key;
    const { data, error } = await sb.rpc('purchase_cv', {
      _cv_id: cv.id, _template_key: tpl,
    });
    if (error) throw error;
    await ensure();
    return data as {
      ok: boolean; was_free: boolean; charged: number;
      locked_template_key: string; swap_deadline: string;
      already_purchased?: boolean;
    };
  }, [cv, ensure]);

  // Server-side export gate (validates payment) — call before generating PDF
  const recordExport = useCallback(async () => {
    if (!cv) throw new Error('no_cv');
    const { data, error } = await sb.rpc('record_cv_export', { _cv_id: cv.id });
    if (error) throw error;
    return data as { ok: boolean; exports_count: number };
  }, [cv]);

  // Backwards-compat alias used elsewhere
  const purchaseExport = purchaseCv;

  return {
    cv, loading, refresh: ensure,
    update, updateData, setLanguage, setTemplate, setTitle,
    purchaseCv, purchaseExport, recordExport,
    isLocked, canSwapTemplate,
  };
}
