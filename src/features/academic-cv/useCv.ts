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
      // Hydrate missing fields gracefully
      setCv({ ...data, data: { ...EMPTY_CV, ...(data.data || {}) } } as AcademicCVRow);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { ensure(); }, [ensure]);

  const update = useCallback(async (patch: Partial<AcademicCVRow>) => {
    if (!cv) return;
    const next = { ...cv, ...patch } as AcademicCVRow;
    setCv(next);
    await sb.from('academic_cvs').update({
      title: next.title, language: next.language, template_key: next.template_key, data: next.data,
    }).eq('id', cv.id);
  }, [cv]);

  const updateData = useCallback((mut: (d: CVData) => CVData) => {
    if (!cv) return;
    const newData = mut(cv.data);
    update({ data: newData });
  }, [cv, update]);

  const setLanguage = (language: CVLanguage) => update({ language });
  const setTemplate = (template_key: CVTemplate) => update({ template_key });
  const setTitle = (title: string) => update({ title });

  const purchaseExport = useCallback(async () => {
    if (!cv) throw new Error('no_cv');
    const { data, error } = await sb.rpc('purchase_cv_export', { _cv_id: cv.id });
    if (error) throw error;
    await ensure();
    return data as { ok: boolean; was_free: boolean; charged: number };
  }, [cv, ensure]);

  return { cv, loading, refresh: ensure, update, updateData, setLanguage, setTemplate, setTitle, purchaseExport };
}
