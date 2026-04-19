import React, { useState } from 'react';
import { Lightbulb, ChevronDown, Sparkles, X } from 'lucide-react';
import type { CVLanguage } from './types';
import { cn } from '@/lib/utils';

type SectionKey = 'personal' | 'education' | 'experience' | 'projects' | 'skills' | 'courses' | 'activities';

const TIPS: Record<SectionKey, { ar: { title: string; tips: string[]; example: string }; en: { title: string; tips: string[]; example: string } }> = {
  personal: {
    ar: {
      title: 'نصائح كتابة النبذة الشخصية',
      tips: [
        'ابدأ بهويتك المهنية: "طالب هندسة برمجيات سنة رابعة..."',
        'اذكر أبرز إنجاز أو مهارة بأرقام إن أمكن',
        'اختم بهدفك المهني القادم في جملة واحدة',
        'الطول المثالي: 3-5 أسطر، 60-100 كلمة',
      ],
      example: 'طالب ماجستير في علوم البيانات بمعدل 3.8/4، شغوف بتطوير نماذج التعلم الآلي. شاركت في 3 مشاريع بحثية منشورة وقدت فريقاً من 5 طلاب في مسابقة كاجل. أبحث عن فرصة تدريب في فريق ML لتطبيق مهاراتي على مشاكل واقعية.',
    },
    en: {
      title: 'Profile summary tips',
      tips: [
        'Start with your professional identity',
        'Mention a top achievement with numbers',
        'End with your next career goal',
        'Ideal length: 3-5 lines, 60-100 words',
      ],
      example: 'Master’s student in Data Science (GPA 3.8/4) passionate about ML. Co-authored 3 research papers and led a 5-person Kaggle team. Seeking an ML internship to apply my skills to real-world problems.',
    },
  },
  education: {
    ar: {
      title: 'نصائح قسم التعليم',
      tips: [
        'رتّب من الأحدث إلى الأقدم',
        'اذكر المعدل فقط إذا كان 3.0/4 أو أعلى',
        'أضف المواد الأساسية المتعلقة بالوظيفة',
        'اذكر الجوائز والشهادات الشرفية',
      ],
      example: 'بكالوريوس علوم الحاسب — جامعة الملك سعود · 2020–2024 · المعدل: 3.85/4 · مرتبة الشرف الأولى',
    },
    en: {
      title: 'Education section tips',
      tips: [
        'List newest first',
        'Show GPA only if 3.0/4 or higher',
        'Add relevant coursework',
        'Mention honors and awards',
      ],
      example: 'B.Sc. Computer Science — King Saud University · 2020–2024 · GPA 3.85/4 · First-class Honours',
    },
  },
  experience: {
    ar: {
      title: 'نصائح كتابة الخبرات',
      tips: [
        'استخدم أفعال قوية: قُدتُ، طوّرتُ، حسّنتُ',
        'كمّم النتائج بأرقام (٪، عدد، مبلغ)',
        '٢-٤ نقاط لكل وظيفة، نقطة واحدة = إنجاز واحد',
        'لا تذكر مهامك بل تأثيرك',
      ],
      example: 'طوّرت لوحة بيانات تفاعلية باستخدام React قلّلت وقت تحليل المبيعات من 4 ساعات إلى 20 دقيقة، واستخدمها 30+ موظف يومياً.',
    },
    en: {
      title: 'Experience writing tips',
      tips: [
        'Use strong verbs: Led, Built, Improved',
        'Quantify results with numbers (%, count, $)',
        '2-4 bullets per role; one bullet = one achievement',
        'Show impact, not duties',
      ],
      example: 'Built a React dashboard that reduced sales analysis time from 4h to 20min, used by 30+ employees daily.',
    },
  },
  projects: {
    ar: {
      title: 'نصائح المشاريع والأبحاث',
      tips: [
        'صف المشكلة، الحل، التقنيات، النتيجة',
        'أضف رابط GitHub أو رابط حي إن أمكن',
        'اذكر دورك بالضبط لو كان جماعياً',
        'ركّز على المشاريع المتعلقة بالوظيفة',
      ],
      example: 'نظام توصية كتب — Python, Scikit-learn · بنيت نموذجاً يقترح كتباً بدقة 87% بناءً على 50 ألف مراجعة. متاح على GitHub.',
    },
    en: {
      title: 'Project & research tips',
      tips: [
        'Describe: problem, solution, tech, result',
        'Add GitHub or live link if available',
        'State your exact role on team projects',
        'Prioritize projects relevant to the job',
      ],
      example: 'Book Recommender — Python, Scikit-learn · Built a model with 87% accuracy on 50K reviews. Available on GitHub.',
    },
  },
  skills: {
    ar: {
      title: 'نصائح اختيار المهارات',
      tips: [
        'تقنية: لغات، أدوات، أطر عمل (Python, Git, React)',
        'شخصية: ٣-٥ مهارات حقيقية لا قائمة طويلة',
        'لغات: اذكر المستوى (لغة أم، متقدم، متوسط)',
        'لا تكتب مهارة لا تستطيع إثباتها',
      ],
      example: 'تقنية: Python · TensorFlow · SQL · Git · Docker | شخصية: قيادة الفريق · حل المشكلات · العرض التقديمي',
    },
    en: {
      title: 'Skills selection tips',
      tips: [
        'Technical: languages, tools, frameworks',
        'Soft: 3-5 real skills, not a long list',
        'Languages: state level (Native, Advanced, Intermediate)',
        'Never list a skill you can’t prove',
      ],
      example: 'Tech: Python · TensorFlow · SQL · Git · Docker | Soft: Team leadership · Problem-solving · Presentation',
    },
  },
  courses: {
    ar: {
      title: 'نصائح الدورات والشهادات',
      tips: [
        'الأولوية للشهادات المعتمدة (Coursera, AWS, Google)',
        'اذكر تاريخ الإصدار',
        'تجاهل الدورات القصيرة جداً (<5 ساعات)',
        'لا تذكر أكثر من 5-7 دورات',
      ],
      example: 'Google Data Analytics Professional Certificate — Coursera · 2024',
    },
    en: {
      title: 'Courses & certificates tips',
      tips: [
        'Prioritize accredited certs (Coursera, AWS, Google)',
        'Include issue date',
        'Skip very short courses (<5 hours)',
        'No more than 5-7 courses',
      ],
      example: 'Google Data Analytics Professional Certificate — Coursera · 2024',
    },
  },
  activities: {
    ar: {
      title: 'نصائح الأنشطة والتطوع',
      tips: [
        'اذكر دورك القيادي إن وجد',
        'كمّم التأثير: عدد المتطوعين، الفعاليات',
        'الأنشطة المرتبطة بالتخصص أقوى',
        'الانخراط المجتمعي يُظهر شخصيتك',
      ],
      example: 'منسّق نادي البرمجة — جامعة الملك فهد · نظّمت 8 ورش حضرها 200+ طالب خلال عام 2023.',
    },
    en: {
      title: 'Activities & volunteering tips',
      tips: [
        'Highlight leadership roles',
        'Quantify impact: people reached, events run',
        'Field-related activities are stronger',
        'Community work shows personality',
      ],
      example: 'Coding Club Coordinator — KFUPM · Organized 8 workshops attended by 200+ students in 2023.',
    },
  },
};

interface Props { section: SectionKey; lang: CVLanguage; }

export const SectionTips: React.FC<Props> = ({ section, lang }) => {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const t = TIPS[section][lang];
  if (dismissed) return null;

  return (
    <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 mb-3 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 p-2.5 text-start hover:bg-amber-500/5 transition-colors"
      >
        <div className="w-7 h-7 rounded-md bg-amber-500/15 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-foreground">{t.title}</div>
          <div className="text-[10px] text-muted-foreground">
            {lang === 'ar' ? `${t.tips.length} نصائح + مثال احترافي` : `${t.tips.length} tips + a pro example`}
          </div>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
          className="w-5 h-5 rounded hover:bg-muted flex items-center justify-center"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2.5 border-t border-amber-500/20 pt-2.5">
          <ul className="space-y-1.5">
            {t.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-[11.5px] text-foreground/85 leading-relaxed">
                <span className="text-amber-600 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-md bg-background/70 border border-border/50 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              {lang === 'ar' ? 'مثال احترافي' : 'Pro example'}
            </div>
            <div className="text-[11px] text-foreground/80 leading-relaxed italic" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              "{t.example}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
