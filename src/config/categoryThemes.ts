/**
 * Visual + content theme per service category.
 * Drives the new immersive Order Wizard hero, guide card, and field hints.
 *
 * Each theme provides:
 *  - identity: color tokens + gradient + accent + bg pattern
 *  - hero: icon, headline, tagline, illustration emoji
 *  - "كيف نعمل" steps shown in the side guide card
 *  - field hints (per-field icon + smart helper text)
 *  - notes placeholder tailored to the category
 *  - example prompts the user can click to auto-fill the notes
 */

import {
  Languages, BookOpenCheck, FileSearch, BookMarked, BarChart3, GraduationCap,
  Palette, Users2, Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface CategoryStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface CategoryTheme {
  /** Tailwind gradient classes for the hero (`bg-gradient-to-br ...`). */
  gradient: string;
  /** Soft glow color hsl token used behind the hero. */
  glow: string;
  /** Solid accent color for icons & badges (hsl token). */
  accent: string;
  icon: LucideIcon;
  emoji: string;
  headline: string;
  tagline: string;
  /** Quick info chips shown below the hero. */
  highlights: { icon: LucideIcon; label: string }[];
  /** "كيف نعمل" — three short steps. */
  workflow: CategoryStep[];
  /** Tailored placeholder for the long notes field. */
  notesPlaceholder: string;
  /** Clickable example prompts (auto-fill notes). */
  examplePrompts: string[];
  /** Per-field smart hints: shown under the field. */
  fieldHints?: Record<string, string>;
  /** Per-field icon mapping (used in DynamicServiceFields). */
  fieldIcons?: Record<string, LucideIcon>;
}

const FALLBACK: CategoryTheme = {
  gradient: 'from-primary/20 via-accent/10 to-background',
  glow: 'primary',
  accent: 'primary',
  icon: Sparkles,
  emoji: '✨',
  headline: 'طلب خدمة جديدة',
  tagline: 'أكمل الخطوات لإرسال طلبك بسهولة',
  highlights: [
    { icon: Sparkles, label: 'متابعة لحظية' },
    { icon: Users2, label: 'فريق متخصص' },
  ],
  workflow: [
    { icon: Sparkles, title: 'نستلم طلبك', description: 'مراجعة فورية من فريق التشغيل' },
    { icon: BookOpenCheck, title: 'نُجهّز عرض السعر', description: 'تحديد المدة والتكلفة بدقة' },
    { icon: GraduationCap, title: 'نسلّمك العمل', description: 'بأعلى جودة وضمن الموعد' },
  ],
  notesPlaceholder: 'صف لنا ما تحتاجه باختصار…',
  examplePrompts: [],
};

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  translation: {
    gradient: 'from-blue-500/25 via-cyan-400/15 to-background',
    glow: 'primary',
    accent: 'primary',
    icon: Languages,
    emoji: '🌐',
    headline: 'ترجمة احترافية بأعلى جودة',
    tagline: 'مترجمون متخصصون في مجالك، تسليم دقيق ضمن الموعد',
    highlights: [
      { icon: Languages, label: '+15 لغة' },
      { icon: BookOpenCheck, label: 'مراجعة لغوية مزدوجة' },
      { icon: Sparkles, label: 'سرية تامة' },
    ],
    workflow: [
      { icon: FileSearch, title: 'نحلّل النص', description: 'نُحدّد المجال والمصطلحات الفنية' },
      { icon: Languages, title: 'يترجم متخصص', description: 'مترجم خبير في تخصصك بالضبط' },
      { icon: BookOpenCheck, title: 'مراجعة وتدقيق', description: 'مراجعة لغوية قبل التسليم' },
    ],
    notesPlaceholder: 'مثال: ترجمة فصل من رسالة ماجستير في الإدارة، مع الحفاظ على المصطلحات الأكاديمية وتنسيق الجداول كما هو…',
    examplePrompts: [
      'ترجمة ملخص بحث طبي من العربية للإنجليزية مع المصطلحات الدقيقة',
      'ترجمة عقد قانوني مع الالتزام بالصياغة الرسمية',
      'ترجمة فصل أكاديمي مع توحيد المصطلحات حسب قائمة مرفقة',
    ],
    fieldIcons: { source_language: Languages, target_language: Languages },
    fieldHints: {
      specialty: 'كلما حدّدت التخصص بدقة، حصلت على ترجمة أكثر احترافية',
    },
  },

  research: {
    gradient: 'from-violet-500/25 via-purple-400/15 to-background',
    glow: 'accent',
    accent: 'accent',
    icon: FileSearch,
    emoji: '📚',
    headline: 'أبحاث ورسائل بمعايير أكاديمية',
    tagline: 'باحثون من حملة الدكتوراه، توثيق APA/MLA، خالية من الانتحال',
    highlights: [
      { icon: BookMarked, label: 'توثيق احترافي' },
      { icon: FileSearch, label: 'تقرير Turnitin' },
      { icon: GraduationCap, label: 'باحثون متخصصون' },
    ],
    workflow: [
      { icon: FileSearch, title: 'تحديد الإطار', description: 'مع باحث متخصص في مجالك' },
      { icon: BookMarked, title: 'البحث والكتابة', description: 'مصادر موثّقة وتحليل عميق' },
      { icon: BookOpenCheck, title: 'مراجعة وتدقيق', description: 'تقرير اقتباس + تدقيق لغوي' },
    ],
    notesPlaceholder: 'مثال: مشروع تخرج بعنوان "أثر الذكاء الاصطناعي على ريادة الأعمال"، 60 صفحة، 5 فصول، بمراجع آخر 5 سنوات APA7…',
    examplePrompts: [
      'مقترح بحث ماجستير في الإدارة الاستراتيجية بمنهج كمي',
      'فصل أدبيات سابقة بـ 25 مرجع APA7 آخر 5 سنوات',
      'دراسة حالة تطبيقية في التسويق الرقمي مع تحليل SWOT',
    ],
    fieldIcons: { research_type: GraduationCap, field: BookMarked, language: Languages },
    fieldHints: {
      field: 'حدّد التخصص بدقة (مثل: تسويق رقمي بدلاً من إدارة)',
    },
  },

  editing: {
    gradient: 'from-emerald-500/25 via-teal-400/15 to-background',
    glow: 'primary',
    accent: 'primary',
    icon: BookOpenCheck,
    emoji: '✏️',
    headline: 'تدقيق ومراجعة احترافية',
    tagline: 'محرّرون لغويون يرفعون جودة نصّك بدون تغيير معناه',
    highlights: [
      { icon: BookOpenCheck, label: 'تدقيق نحوي وإملائي' },
      { icon: Sparkles, label: 'تحسين الأسلوب' },
      { icon: FileSearch, label: 'مراجعة شاملة' },
    ],
    workflow: [
      { icon: FileSearch, title: 'قراءة أولى', description: 'فهم السياق والأسلوب' },
      { icon: BookOpenCheck, title: 'تدقيق متعدّد المستويات', description: 'لغوي، أسلوبي، وإملائي' },
      { icon: Sparkles, title: 'مراجعة نهائية', description: 'بصيغتين: مع التتبّع وبدون' },
    ],
    notesPlaceholder: 'مثال: تدقيق فصل من 30 صفحة، مع الحفاظ على الأسلوب الأكاديمي وتوحيد علامات الترقيم…',
    examplePrompts: [
      'تدقيق لغوي ونحوي مع مراجعة الأسلوب',
      'تدقيق نهائي قبل الطباعة لرسالة ماجستير',
      'تحرير تنموي شامل مع اقتراحات بناء الفقرات',
    ],
    fieldIcons: { review_focus: BookOpenCheck, language: Languages },
  },

  publishing: {
    gradient: 'from-indigo-500/25 via-blue-400/15 to-background',
    glow: 'accent',
    accent: 'accent',
    icon: BookMarked,
    emoji: '🏆',
    headline: 'نشر في مجلات Scopus & ISI',
    tagline: 'نوصل ورقتك للنشر في المجلات المحكّمة المصنّفة',
    highlights: [
      { icon: BookMarked, label: 'Scopus / ISI' },
      { icon: BookOpenCheck, label: 'مراجعة قبل التقديم' },
      { icon: Sparkles, label: 'دعم حتى القبول' },
    ],
    workflow: [
      { icon: FileSearch, title: 'تقييم الورقة', description: 'مراجعة جاهزيتها للنشر' },
      { icon: BookMarked, title: 'اختيار المجلة', description: 'مطابقة التخصص والـ Scope' },
      { icon: BookOpenCheck, title: 'دعم التحكيم', description: 'الردّ على المراجعين حتى القبول' },
    ],
    notesPlaceholder: 'مثال: ورقة بحثية في Business Analytics، 8000 كلمة، تستهدف Q2 على الأقل، التخصص: تكنولوجيا المعلومات الإدارية…',
    examplePrompts: [
      'نشر في Scopus Q1 أو Q2 — تخصص الإدارة',
      'نشر في ISI/Web of Science — تخصص علوم الحاسب',
      'مراجعة وردّ على ملاحظات المحكّمين',
    ],
    fieldIcons: { journal_target: BookMarked, field: GraduationCap },
  },

  statistics: {
    gradient: 'from-orange-500/25 via-amber-400/15 to-background',
    glow: 'primary',
    accent: 'primary',
    icon: BarChart3,
    emoji: '📊',
    headline: 'تحليل إحصائي دقيق',
    tagline: 'SPSS, AMOS, R, Python — تفسير علمي قابل للنشر',
    highlights: [
      { icon: BarChart3, label: 'تحليل احترافي' },
      { icon: FileSearch, label: 'تفسير النتائج' },
      { icon: BookOpenCheck, label: 'جداول جاهزة للنشر' },
    ],
    workflow: [
      { icon: FileSearch, title: 'فحص البيانات', description: 'تنظيف وترميز العينة' },
      { icon: BarChart3, title: 'التحليل', description: 'بالبرنامج المناسب لفرضياتك' },
      { icon: BookOpenCheck, title: 'تقرير النتائج', description: 'تفسير + جداول + رسوم' },
    ],
    notesPlaceholder: 'مثال: عينة 250 مفردة، 5 فرضيات، مطلوب تحليل وصفي + اختبار T + انحدار متعدد بـ SPSS…',
    examplePrompts: [
      'تحليل وصفي + اختبار فرضيات بـ SPSS',
      'نمذجة معادلات هيكلية SEM بـ AMOS',
      'تحليل بيانات نوعية بـ NVivo مع الترميز',
    ],
    fieldIcons: { analysis_software: BarChart3, sample_size: Users2 },
    fieldHints: {
      sample_size: 'إن لم تكن تعرف العدد بعد، اكتب تقدير تقريبي',
      analysis_type: 'صف الفرضيات أو الأسئلة البحثية لاختيار الاختبار الأنسب',
    },
  },

  'student-services': {
    gradient: 'from-pink-500/25 via-rose-400/15 to-background',
    glow: 'accent',
    accent: 'accent',
    icon: GraduationCap,
    emoji: '🎓',
    headline: 'دعم متكامل للطلاب',
    tagline: 'واجبات، تقارير، ودراسات حالة بجودة عالية وفي وقتها',
    highlights: [
      { icon: GraduationCap, label: 'متخصصون في كل المواد' },
      { icon: Sparkles, label: 'تسليم سريع' },
      { icon: BookOpenCheck, label: 'بدون انتحال' },
    ],
    workflow: [
      { icon: FileSearch, title: 'فهم المتطلبات', description: 'قراءة rubric وملف الواجب' },
      { icon: BookOpenCheck, title: 'الإنجاز', description: 'بطريقة تناسب مستواك الدراسي' },
      { icon: GraduationCap, title: 'تسليم نهائي', description: 'صيغة جاهزة للرفع للمنصة' },
    ],
    notesPlaceholder: 'مثال: واجب في إدارة الموارد البشرية، 5 صفحات، يطلب دراسة حالة عن شركة سعودية مع مراجع APA…',
    examplePrompts: [
      'واجب جامعي مع مراجع APA',
      'تلخيص محاضرات في صيغة منظّمة قابلة للمراجعة',
      'تقرير تحليلي عن دراسة حالة',
    ],
    fieldIcons: { task_type: GraduationCap, subject: BookMarked },
  },

  'academic-design': {
    gradient: 'from-fuchsia-500/25 via-pink-400/15 to-background',
    glow: 'accent',
    accent: 'accent',
    icon: Palette,
    emoji: '🎨',
    headline: 'تصاميم أكاديمية احترافية',
    tagline: 'عروض، بوسترات، وإنفوجرافيك بهوية بصرية مميزة',
    highlights: [
      { icon: Palette, label: 'هوية بصرية' },
      { icon: Sparkles, label: 'تصميم تفاعلي' },
      { icon: BookOpenCheck, label: 'صالح للطباعة' },
    ],
    workflow: [
      { icon: FileSearch, title: 'فهم الفكرة', description: 'تحديد الجمهور والغاية' },
      { icon: Palette, title: 'التصميم', description: 'بهوية متناسقة وألوان احترافية' },
      { icon: Sparkles, title: 'مراجعتك', description: 'تعديلات حتى تكون راضياً' },
    ],
    notesPlaceholder: 'مثال: عرض مناقشة ماجستير، 25 شريحة، بهوية الجامعة (أزرق + أبيض)، مع رسوم تعبيرية للنتائج…',
    examplePrompts: [
      'عرض PowerPoint لمناقشة رسالة ماجستير',
      'بوستر علمي بمقاس A1 لمؤتمر',
      'إنفوجرافيك يلخّص نتائج بحث',
    ],
    fieldIcons: { design_type: Palette, slides_count: Sparkles },
  },

  'training-consulting': {
    gradient: 'from-cyan-500/25 via-sky-400/15 to-background',
    glow: 'primary',
    accent: 'primary',
    icon: Users2,
    emoji: '🤝',
    headline: 'تدريب واستشارات مخصّصة',
    tagline: 'جلسات فردية أو ورش — مع خبراء أكاديميين',
    highlights: [
      { icon: Users2, label: 'مدربون معتمدون' },
      { icon: Sparkles, label: 'محتوى مخصّص' },
      { icon: BookOpenCheck, label: 'متابعة بعد الجلسة' },
    ],
    workflow: [
      { icon: FileSearch, title: 'تحديد الاحتياج', description: 'لقاء قصير لتحديد الأهداف' },
      { icon: Users2, title: 'الجلسة', description: 'عبر Zoom/Meet أو حضوري' },
      { icon: BookOpenCheck, title: 'متابعة', description: 'موارد ودعم بعد الجلسة' },
    ],
    notesPlaceholder: 'مثال: جلستان عن SPSS مستوى متقدم، تحليل عاملي وانحدار، مع تطبيق على بياناتي…',
    examplePrompts: [
      'استشارة فردية لاختيار منهج البحث',
      'دورة تدريبية في SPSS مستوى متقدم',
      'ورشة كتابة الورقة العلمية للنشر',
    ],
    fieldIcons: { session_type: Users2, topic: BookMarked, channel: Sparkles },
  },
};

export const getCategoryTheme = (slug: string | null | undefined): CategoryTheme =>
  (slug && CATEGORY_THEMES[slug]) || FALLBACK;
