/**
 * Dynamic field schemas mapped by service category slug.
 * Each category exposes a tailored set of fields shown in the order wizard.
 * Answers are persisted to service_orders.metadata (jsonb).
 */

export type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'date' | 'multiselect';

export interface DynamicField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  helpText?: string;
}

export interface CategoryFieldsConfig {
  /** Quantity unit shown in the price estimator (e.g., "صفحة", "جلسة"). */
  quantityUnitLabel: string;
  /** Default quantity when the field renders. */
  defaultQuantity: number;
  /** The fields rendered in step 2 (تفاصيل الطلب). */
  fields: DynamicField[];
}

const LANGUAGES = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'الإنجليزية' },
  { value: 'fr', label: 'الفرنسية' },
  { value: 'es', label: 'الإسبانية' },
  { value: 'de', label: 'الألمانية' },
  { value: 'tr', label: 'التركية' },
  { value: 'other', label: 'أخرى' },
];

const URGENCY = [
  { value: 'standard', label: 'عادي' },
  { value: 'urgent', label: 'عاجل (خلال 48 ساعة) +30%' },
  { value: 'super_urgent', label: 'عاجل جداً (خلال 24 ساعة) +60%' },
];

export const URGENCY_MULTIPLIER: Record<string, number> = {
  standard: 1,
  urgent: 1.3,
  super_urgent: 1.6,
};

export const SERVICE_FIELDS: Record<string, CategoryFieldsConfig> = {
  translation: {
    quantityUnitLabel: 'صفحة',
    defaultQuantity: 1,
    fields: [
      { key: 'source_language', label: 'اللغة المصدر', type: 'select', options: LANGUAGES, required: true },
      { key: 'target_language', label: 'اللغة الهدف', type: 'select', options: LANGUAGES, required: true },
      { key: 'specialty', label: 'مجال التخصص (اختياري)', type: 'text', placeholder: 'مثال: طبي / قانوني / تقني' },
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ],
  },

  research: {
    quantityUnitLabel: 'صفحة',
    defaultQuantity: 10,
    fields: [
      { key: 'research_type', label: 'نوع البحث', type: 'select', required: true, options: [
        { value: 'graduation', label: 'مشروع تخرج' },
        { value: 'master', label: 'رسالة ماجستير' },
        { value: 'phd', label: 'رسالة دكتوراه' },
        { value: 'paper', label: 'ورقة بحثية' },
        { value: 'proposal', label: 'خطة بحث' },
        { value: 'other', label: 'أخرى' },
      ]},
      { key: 'field', label: 'التخصص العلمي', type: 'text', placeholder: 'مثال: إدارة أعمال', required: true },
      { key: 'language', label: 'لغة البحث', type: 'select', options: LANGUAGES, required: true },
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ],
  },

  editing: {
    quantityUnitLabel: 'صفحة',
    defaultQuantity: 5,
    fields: [
      { key: 'review_focus', label: 'محور المراجعة', type: 'select', required: true, options: [
        { value: 'language', label: 'تدقيق لغوي ونحوي' },
        { value: 'style', label: 'مراجعة الأسلوب' },
        { value: 'developmental', label: 'تحرير تنموي شامل' },
        { value: 'final', label: 'تدقيق نهائي قبل الطباعة' },
      ]},
      { key: 'language', label: 'لغة النص', type: 'select', options: LANGUAGES, required: true },
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ],
  },

  publishing: {
    quantityUnitLabel: 'ورقة',
    defaultQuantity: 1,
    fields: [
      { key: 'journal_target', label: 'المجلة/قاعدة البيانات المستهدفة', type: 'select', required: true, options: [
        { value: 'scopus', label: 'Scopus' },
        { value: 'isi', label: 'ISI / Web of Science' },
        { value: 'arcif', label: 'معامل أرسيف' },
        { value: 'open', label: 'مفتوح / لم يتم التحديد' },
      ]},
      { key: 'field', label: 'التخصص العلمي', type: 'text', required: true },
      { key: 'language', label: 'لغة الورقة', type: 'select', options: LANGUAGES, required: true },
    ],
  },

  statistics: {
    quantityUnitLabel: 'تحليل',
    defaultQuantity: 1,
    fields: [
      { key: 'analysis_software', label: 'البرنامج المستخدم', type: 'select', required: true, options: [
        { value: 'spss', label: 'SPSS' },
        { value: 'amos', label: 'AMOS (SEM)' },
        { value: 'r', label: 'R' },
        { value: 'python', label: 'Python' },
        { value: 'nvivo', label: 'NVivo' },
        { value: 'other', label: 'أخرى' },
      ]},
      { key: 'sample_size', label: 'حجم العينة', type: 'number', placeholder: 'مثال: 250', min: 1 },
      { key: 'analysis_type', label: 'نوع التحليل المطلوب', type: 'textarea', placeholder: 'مثال: وصفي، استدلالي، انحدار، اختبار T...', required: true },
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ],
  },

  'student-services': {
    quantityUnitLabel: 'مهمة',
    defaultQuantity: 1,
    fields: [
      { key: 'task_type', label: 'نوع المهمة', type: 'select', required: true, options: [
        { value: 'assignment', label: 'واجب جامعي' },
        { value: 'summary', label: 'تلخيص محاضرات/كتاب' },
        { value: 'report', label: 'تقرير' },
        { value: 'case_study', label: 'دراسة حالة' },
      ]},
      { key: 'subject', label: 'المادة / الموضوع', type: 'text', required: true },
      { key: 'language', label: 'اللغة', type: 'select', options: LANGUAGES, required: true },
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ],
  },

  'academic-design': {
    quantityUnitLabel: 'تصميم',
    defaultQuantity: 1,
    fields: [
      { key: 'design_type', label: 'نوع التصميم', type: 'select', required: true, options: [
        { value: 'powerpoint', label: 'عرض PowerPoint' },
        { value: 'poster', label: 'بوستر علمي' },
        { value: 'infographic', label: 'إنفوجرافيك' },
        { value: 'defense', label: 'عرض المناقشة' },
      ]},
      { key: 'slides_count', label: 'عدد الشرائح/الصفحات (إن وجد)', type: 'number', min: 1 },
      { key: 'color_palette', label: 'الهوية اللونية المفضلة', type: 'text', placeholder: 'مثال: أزرق وأبيض / هوية الجامعة' },
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ],
  },

  'training-consulting': {
    quantityUnitLabel: 'جلسة',
    defaultQuantity: 1,
    fields: [
      { key: 'session_type', label: 'نوع الجلسة', type: 'select', required: true, options: [
        { value: 'consultation', label: 'استشارة فردية' },
        { value: 'training', label: 'دورة تدريبية' },
        { value: 'workshop', label: 'ورشة عمل' },
        { value: 'mentoring', label: 'إرشاد مستمر' },
      ]},
      { key: 'topic', label: 'الموضوع المطلوب', type: 'text', required: true, placeholder: 'مثال: SPSS مستوى متقدم' },
      { key: 'preferred_date', label: 'الموعد المقترح', type: 'date' },
      { key: 'channel', label: 'وسيلة التواصل المفضلة', type: 'select', options: [
        { value: 'zoom', label: 'Zoom' },
        { value: 'google_meet', label: 'Google Meet' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'in_person', label: 'حضوري' },
      ]},
    ],
  },
};

/** Default config when category is unknown. */
export const DEFAULT_FIELDS_CONFIG: CategoryFieldsConfig = {
  quantityUnitLabel: 'وحدة',
  defaultQuantity: 1,
  fields: [
    { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
  ],
};

export const getFieldsConfig = (categorySlug: string | null | undefined): CategoryFieldsConfig => {
  if (!categorySlug) return DEFAULT_FIELDS_CONFIG;
  return SERVICE_FIELDS[categorySlug] ?? DEFAULT_FIELDS_CONFIG;
};

/** Friendly label for a stored answer (used in admin & review screens). */
export const getFieldLabel = (categorySlug: string | null | undefined, key: string): string => {
  const cfg = getFieldsConfig(categorySlug);
  return cfg.fields.find((f) => f.key === key)?.label ?? key;
};

/** Friendly label for a stored option value. */
export const getOptionLabel = (categorySlug: string | null | undefined, key: string, value: string): string => {
  const cfg = getFieldsConfig(categorySlug);
  const f = cfg.fields.find((x) => x.key === key);
  return f?.options?.find((o) => o.value === value)?.label ?? value;
};
