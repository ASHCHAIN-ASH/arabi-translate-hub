import React, { useMemo } from 'react';
import { TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import type { CVData, CVLanguage } from './types';
import { cn } from '@/lib/utils';

interface Props { data: CVData; lang: CVLanguage; }

interface Check {
  ok: boolean;
  weight: number;
  labelAr: string;
  labelEn: string;
}

export const computeCvQuality = (d: CVData): { score: number; checks: Check[] } => {
  const checks: Check[] = [
    { ok: !!d.personal.fullName?.trim(), weight: 8, labelAr: 'الاسم الكامل', labelEn: 'Full name' },
    { ok: !!d.personal.jobTitle?.trim(), weight: 6, labelAr: 'المسمى الوظيفي', labelEn: 'Job title' },
    { ok: !!d.personal.email?.trim() && /\S+@\S+/.test(d.personal.email), weight: 8, labelAr: 'بريد إلكتروني صالح', labelEn: 'Valid email' },
    { ok: !!d.personal.phone?.trim(), weight: 6, labelAr: 'رقم الجوال', labelEn: 'Phone number' },
    { ok: !!(d.personal.city || d.personal.country), weight: 4, labelAr: 'الموقع', labelEn: 'Location' },
    { ok: (d.personal.summary?.trim().length || 0) >= 80, weight: 14, labelAr: 'نبذة قوية (80+ حرف)', labelEn: 'Strong summary (80+ chars)' },
    { ok: d.education.length >= 1, weight: 12, labelAr: 'مؤهل تعليمي واحد على الأقل', labelEn: 'At least one education entry' },
    { ok: d.experience.length >= 1 || d.projects.length >= 1, weight: 12, labelAr: 'خبرة أو مشروع واحد', labelEn: 'One experience or project' },
    { ok: d.skills.technical.length >= 4, weight: 10, labelAr: '٤+ مهارات تقنية', labelEn: '4+ technical skills' },
    { ok: d.skills.soft.length >= 3, weight: 6, labelAr: '٣+ مهارات شخصية', labelEn: '3+ soft skills' },
    { ok: d.skills.languages.length >= 1, weight: 6, labelAr: 'لغة واحدة على الأقل', labelEn: 'At least one language' },
    { ok: d.courses.length >= 1, weight: 4, labelAr: 'دورة أو شهادة', labelEn: 'A course or certificate' },
    { ok: !!(d.personal.linkedin || d.personal.website), weight: 4, labelAr: 'رابط مهني (LinkedIn/موقع)', labelEn: 'Professional link' },
  ];
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0);
  return { score: Math.round((got / total) * 100), checks };
};

export const QualityMeter: React.FC<Props> = ({ data, lang }) => {
  const { score, checks } = useMemo(() => computeCvQuality(data), [data]);
  const failing = checks.filter(c => !c.ok).slice(0, 3);

  const ringColor = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500';
  const bgGrad = score >= 80
    ? 'from-emerald-500/10 to-teal-500/5'
    : score >= 50 ? 'from-amber-500/10 to-orange-500/5' : 'from-rose-500/10 to-pink-500/5';

  const labelAr = score >= 80 ? 'ممتاز — جاهز للإرسال' : score >= 50 ? 'جيد — يحتاج تحسينات' : 'ضعيف — أكمل البيانات';
  const labelEn = score >= 80 ? 'Excellent — ready' : score >= 50 ? 'Good — needs polish' : 'Weak — fill more';

  return (
    <div className={cn('rounded-xl border border-border/60 p-3 bg-gradient-to-br', bgGrad)}>
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-border/40" />
            <circle
              cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3"
              strokeDasharray={`${(score / 100) * 97.4} 97.4`} strokeLinecap="round"
              className={cn('transition-all duration-500', ringColor)}
            />
          </svg>
          <div className={cn('absolute inset-0 flex items-center justify-center text-sm font-bold', ringColor)}>
            {score}%
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold mb-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'جودة السيرة الذاتية' : 'CV Quality Score'}
          </div>
          <div className="text-[11px] text-muted-foreground">{lang === 'ar' ? labelAr : labelEn}</div>
        </div>
      </div>

      {failing.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-border/40 space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {lang === 'ar' ? 'لتحسين سيرتك:' : 'To improve:'}
          </div>
          {failing.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-foreground/80">
              <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
              {lang === 'ar' ? c.labelAr : c.labelEn}
            </div>
          ))}
        </div>
      )}

      {failing.length === 0 && (
        <div className="mt-2 pt-2 border-t border-border/40 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {lang === 'ar' ? 'جميع الأقسام مكتملة!' : 'All sections complete!'}
        </div>
      )}
    </div>
  );
};
