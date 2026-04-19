import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CVLanguage } from './types';

export type AISection =
  | 'summary'
  | 'experience_desc'
  | 'project_desc'
  | 'education_desc'
  | 'activity_desc'
  | 'skills_tech'
  | 'skills_soft'
  | 'skills_langs'
  | 'course_suggest';

export async function aiAssist(opts: {
  section: AISection;
  lang: CVLanguage;
  context?: Record<string, any>;
  current?: string;
}): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('cv-ai-assist', { body: opts });
    if (error) {
      const msg = (error as any)?.message || '';
      if (msg.includes('429')) toast.error(opts.lang === 'ar' ? 'تجاوزت الحد، حاول لاحقاً' : 'Rate limited, try later');
      else if (msg.includes('402')) toast.error(opts.lang === 'ar' ? 'يلزم شحن رصيد الذكاء الاصطناعي' : 'AI credits required');
      else toast.error(opts.lang === 'ar' ? 'تعذّر توليد المحتوى' : 'Failed to generate');
      return null;
    }
    const text = (data as any)?.text;
    if (!text) {
      toast.error(opts.lang === 'ar' ? 'لم يتم توليد محتوى' : 'No content generated');
      return null;
    }
    return text;
  } catch (e) {
    console.error(e);
    toast.error(opts.lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
    return null;
  }
}
