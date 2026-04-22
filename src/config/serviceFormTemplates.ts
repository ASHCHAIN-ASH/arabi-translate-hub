/**
 * Per-service form templates.
 *
 * For each service we define **sections** containing dedicated fields tailored
 * to that specific service's content. This is more granular than category-level
 * fields. Resolution order in OrderNew:
 *   1) Service-specific template (this file) — matched by service slug/name keyword
 *   2) Admin-defined service.dynamic_fields
 *   3) Category default fields (serviceFieldsConfig.ts)
 *
 * All answers are saved to service_orders.metadata (jsonb), so the existing
 * `whatsapp_on_order_created` DB trigger keeps working without changes.
 */

import { DynamicField } from './serviceFieldsConfig';

export interface FormSection {
  /** Section title shown to the client. */
  title: string;
  /** Short helper line under the title. */
  description?: string;
  /** Lucide icon name (resolved in the renderer). */
  icon?: 'languages' | 'file' | 'graduation' | 'edit' | 'send' | 'chart' | 'design' | 'calendar' | 'info';
  fields: DynamicField[];
}

export interface ServiceFormTemplate {
  /** Quantity unit shown in the UI (e.g., "صفحة"). */
  quantityUnitLabel: string;
  defaultQuantity: number;
  sections: FormSection[];
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
  { value: 'urgent', label: 'عاجل (خلال 48 ساعة)' },
  { value: 'super_urgent', label: 'عاجل جداً (خلال 24 ساعة)' },
];

// ---------------------------- TRANSLATION ----------------------------

const documentTranslation: ServiceFormTemplate = {
  quantityUnitLabel: 'صفحة',
  defaultQuantity: 1,
  sections: [
    {
      title: 'لغة الترجمة',
      description: 'حدّد اللغة الأصلية واللغة المطلوب الترجمة إليها',
      icon: 'languages',
      fields: [
        { key: 'source_language', label: 'اللغة المصدر', type: 'select', options: LANGUAGES, required: true },
        { key: 'target_language', label: 'اللغة الهدف', type: 'select', options: LANGUAGES, required: true },
      ],
    },
    {
      title: 'تفاصيل المستند',
      icon: 'file',
      fields: [
        { key: 'document_type', label: 'نوع المستند', type: 'select', required: true, options: [
          { value: 'official', label: 'مستند رسمي / حكومي' },
          { value: 'academic', label: 'مستند أكاديمي' },
          { value: 'business', label: 'مستند تجاري / عقد' },
          { value: 'personal', label: 'مستند شخصي' },
          { value: 'other', label: 'أخرى' },
        ]},
        { key: 'specialty', label: 'المجال (اختياري)', type: 'text', placeholder: 'مثال: قانوني، طبي، هندسي' },
        { key: 'certified', label: 'هل تحتاج ترجمة معتمدة؟', type: 'select', options: [
          { value: 'yes', label: 'نعم، أحتاج ختم اعتماد' },
          { value: 'no', label: 'لا، ترجمة عادية' },
        ]},
      ],
    },
    {
      title: 'موعد التسليم',
      icon: 'calendar',
      fields: [
        { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
      ],
    },
  ],
};

const academicTranslation: ServiceFormTemplate = {
  quantityUnitLabel: 'صفحة',
  defaultQuantity: 5,
  sections: [
    {
      title: 'لغة الترجمة الأكاديمية',
      icon: 'languages',
      fields: [
        { key: 'source_language', label: 'لغة النص الأصلي', type: 'select', options: LANGUAGES, required: true },
        { key: 'target_language', label: 'اللغة المستهدفة', type: 'select', options: LANGUAGES, required: true },
      ],
    },
    {
      title: 'طبيعة العمل البحثي',
      icon: 'graduation',
      fields: [
        { key: 'research_type', label: 'نوع العمل', type: 'select', required: true, options: [
          { value: 'thesis', label: 'رسالة ماجستير / دكتوراه' },
          { value: 'paper', label: 'ورقة بحثية / مقال علمي' },
          { value: 'abstract', label: 'ملخص بحث (Abstract)' },
          { value: 'book_chapter', label: 'فصل كتاب' },
          { value: 'proposal', label: 'خطة بحث' },
        ]},
        { key: 'specialty', label: 'التخصص الدقيق', type: 'text', required: true, placeholder: 'مثال: علم نفس تربوي' },
        { key: 'glossary_required', label: 'هل تحتاج مسرد مصطلحات؟', type: 'select', options: [
          { value: 'yes', label: 'نعم، أرسل مسرد المصطلحات' },
          { value: 'no', label: 'لا حاجة' },
        ]},
      ],
    },
    {
      title: 'مستوى الاستعجال',
      icon: 'calendar',
      fields: [
        { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
      ],
    },
  ],
};

const legalTranslation: ServiceFormTemplate = {
  quantityUnitLabel: 'صفحة',
  defaultQuantity: 1,
  sections: [
    {
      title: 'لغات الترجمة القانونية',
      icon: 'languages',
      fields: [
        { key: 'source_language', label: 'اللغة المصدر', type: 'select', options: LANGUAGES, required: true },
        { key: 'target_language', label: 'اللغة الهدف', type: 'select', options: LANGUAGES, required: true },
      ],
    },
    {
      title: 'نوع الوثيقة القانونية',
      icon: 'file',
      fields: [
        { key: 'doc_type', label: 'نوع الوثيقة', type: 'select', required: true, options: [
          { value: 'contract', label: 'عقد' },
          { value: 'court', label: 'وثيقة محكمة / حكم' },
          { value: 'power_of_attorney', label: 'وكالة' },
          { value: 'civil_status', label: 'وثيقة أحوال مدنية' },
          { value: 'company', label: 'وثائق شركة / تأسيس' },
          { value: 'other', label: 'أخرى' },
        ]},
        { key: 'certified', label: 'الترجمة المعتمدة', type: 'select', required: true, options: [
          { value: 'certified', label: 'معتمدة بختم رسمي' },
          { value: 'standard', label: 'ترجمة قانونية بدون ختم' },
        ]},
        { key: 'destination', label: 'الجهة المستهدفة (اختياري)', type: 'text', placeholder: 'مثال: سفارة كندا' },
      ],
    },
    {
      title: 'الاستعجال',
      icon: 'calendar',
      fields: [
        { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
      ],
    },
  ],
};

const medicalTranslation: ServiceFormTemplate = {
  quantityUnitLabel: 'صفحة',
  defaultQuantity: 1,
  sections: [
    { title: 'لغات الترجمة الطبية', icon: 'languages', fields: [
      { key: 'source_language', label: 'اللغة المصدر', type: 'select', options: LANGUAGES, required: true },
      { key: 'target_language', label: 'اللغة الهدف', type: 'select', options: LANGUAGES, required: true },
    ]},
    { title: 'تفاصيل النص الطبي', icon: 'file', fields: [
      { key: 'medical_type', label: 'نوع النص', type: 'select', required: true, options: [
        { value: 'report', label: 'تقرير طبي / تشخيص' },
        { value: 'prescription', label: 'وصفة / روشتة' },
        { value: 'research', label: 'بحث طبي' },
        { value: 'leaflet', label: 'نشرة دواء' },
        { value: 'manual', label: 'دليل جهاز طبي' },
      ]},
      { key: 'specialty', label: 'التخصص الطبي', type: 'text', placeholder: 'مثال: قلب وأوعية' },
    ]},
    { title: 'الاستعجال', icon: 'calendar', fields: [
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ]},
  ],
};

const videoTranslation: ServiceFormTemplate = {
  quantityUnitLabel: 'دقيقة',
  defaultQuantity: 5,
  sections: [
    { title: 'لغات الترجمة', icon: 'languages', fields: [
      { key: 'source_language', label: 'لغة الفيديو', type: 'select', options: LANGUAGES, required: true },
      { key: 'target_language', label: 'اللغة الهدف', type: 'select', options: LANGUAGES, required: true },
    ]},
    { title: 'صيغة الإخراج', icon: 'file', fields: [
      { key: 'output_format', label: 'الصيغة المطلوبة', type: 'select', required: true, options: [
        { value: 'subtitles', label: 'ترجمة مرئية (Subtitles)' },
        { value: 'srt', label: 'ملف SRT منفصل' },
        { value: 'transcript', label: 'تفريغ نصي + ترجمة' },
        { value: 'dubbing', label: 'دوبلاج صوتي' },
      ]},
      { key: 'video_link', label: 'رابط الفيديو (اختياري)', type: 'text', placeholder: 'YouTube / Drive / Vimeo' },
    ]},
    { title: 'الاستعجال', icon: 'calendar', fields: [
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ]},
  ],
};

// ---------------------------- RESEARCH ----------------------------

const researchAssistance: ServiceFormTemplate = {
  quantityUnitLabel: 'صفحة',
  defaultQuantity: 20,
  sections: [
    { title: 'نوع البحث', icon: 'graduation', fields: [
      { key: 'research_type', label: 'نوع العمل البحثي', type: 'select', required: true, options: [
        { value: 'graduation', label: 'مشروع تخرج' },
        { value: 'master', label: 'رسالة ماجستير' },
        { value: 'phd', label: 'رسالة دكتوراه' },
        { value: 'paper', label: 'ورقة بحثية للنشر' },
      ]},
      { key: 'field', label: 'التخصص العلمي', type: 'text', required: true, placeholder: 'مثال: إدارة موارد بشرية' },
      { key: 'language', label: 'لغة البحث', type: 'select', options: LANGUAGES, required: true },
    ]},
    { title: 'مرحلة البحث الحالية', icon: 'edit', fields: [
      { key: 'current_stage', label: 'أين أنت الآن؟', type: 'select', required: true, options: [
        { value: 'idea', label: 'لدي فكرة فقط' },
        { value: 'proposal', label: 'انتهيت من الخطة' },
        { value: 'in_progress', label: 'في منتصف الكتابة' },
        { value: 'finalizing', label: 'مرحلة المراجعة النهائية' },
      ]},
      { key: 'help_needed', label: 'ما الذي تحتاجه؟', type: 'textarea', required: true, placeholder: 'مثال: صياغة الإطار النظري + تحليل النتائج' },
    ]},
    { title: 'الموعد النهائي', icon: 'calendar', fields: [
      { key: 'deadline', label: 'موعد التسليم المطلوب', type: 'date' },
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ]},
  ],
};

const researchProposal: ServiceFormTemplate = {
  quantityUnitLabel: 'خطة',
  defaultQuantity: 1,
  sections: [
    { title: 'تفاصيل خطة البحث', icon: 'graduation', fields: [
      { key: 'degree', label: 'المرحلة الدراسية', type: 'select', required: true, options: [
        { value: 'master', label: 'ماجستير' },
        { value: 'phd', label: 'دكتوراه' },
        { value: 'graduation', label: 'بكالوريوس / تخرج' },
      ]},
      { key: 'field', label: 'التخصص الدقيق', type: 'text', required: true },
      { key: 'language', label: 'لغة الخطة', type: 'select', options: LANGUAGES, required: true },
      { key: 'topic', label: 'الموضوع المقترح (إن وجد)', type: 'textarea', placeholder: 'إن لم يكن لديك موضوع نقترح لك مواضيع' },
    ]},
    { title: 'متطلبات الجامعة', icon: 'info', fields: [
      { key: 'university', label: 'الجامعة (اختياري)', type: 'text' },
      { key: 'word_count', label: 'العدد المطلوب من الكلمات', type: 'number', min: 1000, placeholder: '5000' },
      { key: 'methodology_pref', label: 'المنهج المفضّل', type: 'select', options: [
        { value: 'quantitative', label: 'كمي' },
        { value: 'qualitative', label: 'نوعي' },
        { value: 'mixed', label: 'مختلط' },
        { value: 'unknown', label: 'لا أعرف' },
      ]},
    ]},
    { title: 'الاستعجال', icon: 'calendar', fields: [
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ]},
  ],
};

// ---------------------------- STATISTICS ----------------------------

const spssAnalysis: ServiceFormTemplate = {
  quantityUnitLabel: 'تحليل',
  defaultQuantity: 1,
  sections: [
    { title: 'بيانات الدراسة', icon: 'chart', fields: [
      { key: 'sample_size', label: 'حجم العينة', type: 'number', min: 1, required: true, placeholder: 'مثال: 250' },
      { key: 'variables_count', label: 'عدد المتغيرات تقريباً', type: 'number', min: 1, placeholder: '15' },
      { key: 'data_format', label: 'صيغة البيانات الحالية', type: 'select', required: true, options: [
        { value: 'spss', label: 'ملف SPSS جاهز (.sav)' },
        { value: 'excel', label: 'Excel (.xlsx)' },
        { value: 'csv', label: 'CSV' },
        { value: 'paper', label: 'ورقية / لم تُدخل بعد' },
      ]},
    ]},
    { title: 'التحليل المطلوب', icon: 'edit', fields: [
      { key: 'analysis_type', label: 'نوع التحليل', type: 'select', required: true, options: [
        { value: 'descriptive', label: 'إحصاء وصفي' },
        { value: 'inferential', label: 'إحصاء استدلالي' },
        { value: 'regression', label: 'تحليل انحدار' },
        { value: 'factor', label: 'تحليل عاملي' },
        { value: 'reliability', label: 'صدق وثبات' },
        { value: 'full', label: 'تحليل شامل لرسالة كاملة' },
      ]},
      { key: 'tests_needed', label: 'الاختبارات المحددة (إن وجدت)', type: 'textarea', placeholder: 'مثال: T-Test، ANOVA، Pearson' },
      { key: 'output_language', label: 'لغة التقرير', type: 'select', options: LANGUAGES, required: true },
    ]},
    { title: 'الاستعجال', icon: 'calendar', fields: [
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ]},
  ],
};

// ---------------------------- PUBLISHING ----------------------------

const journalPublication: ServiceFormTemplate = {
  quantityUnitLabel: 'ورقة',
  defaultQuantity: 1,
  sections: [
    { title: 'تفاصيل الورقة', icon: 'graduation', fields: [
      { key: 'paper_status', label: 'حالة الورقة الحالية', type: 'select', required: true, options: [
        { value: 'draft', label: 'مسودة أولية' },
        { value: 'ready', label: 'جاهزة للنشر' },
        { value: 'rejected', label: 'مرفوضة من مجلة سابقة' },
      ]},
      { key: 'field', label: 'التخصص العلمي', type: 'text', required: true },
      { key: 'language', label: 'لغة الورقة', type: 'select', options: LANGUAGES, required: true },
      { key: 'word_count', label: 'عدد الكلمات تقريباً', type: 'number', min: 100 },
    ]},
    { title: 'المجلة المستهدفة', icon: 'send', fields: [
      { key: 'journal_target', label: 'قاعدة البيانات المستهدفة', type: 'select', required: true, options: [
        { value: 'scopus_q1', label: 'Scopus Q1' },
        { value: 'scopus_q2', label: 'Scopus Q2' },
        { value: 'scopus_q3_q4', label: 'Scopus Q3/Q4' },
        { value: 'isi', label: 'ISI / Web of Science' },
        { value: 'arcif', label: 'معامل أرسيف' },
        { value: 'open', label: 'مفتوح / اقترحوا لي' },
      ]},
      { key: 'specific_journal', label: 'مجلة محددة (اختياري)', type: 'text', placeholder: 'اسم المجلة إن كنت تعرفها' },
    ]},
  ],
};

// ---------------------------- EDITING ----------------------------

const proofreading: ServiceFormTemplate = {
  quantityUnitLabel: 'صفحة',
  defaultQuantity: 5,
  sections: [
    { title: 'النص المراد تدقيقه', icon: 'edit', fields: [
      { key: 'language', label: 'لغة النص', type: 'select', options: LANGUAGES, required: true },
      { key: 'document_type', label: 'نوع الوثيقة', type: 'select', required: true, options: [
        { value: 'thesis', label: 'رسالة علمية' },
        { value: 'paper', label: 'بحث / ورقة' },
        { value: 'book', label: 'كتاب' },
        { value: 'article', label: 'مقال' },
        { value: 'cv', label: 'سيرة ذاتية' },
      ]},
    ]},
    { title: 'مستوى المراجعة', icon: 'info', fields: [
      { key: 'review_level', label: 'العمق المطلوب', type: 'select', required: true, options: [
        { value: 'basic', label: 'تدقيق إملائي ونحوي فقط' },
        { value: 'standard', label: 'تدقيق + تحسين الأسلوب' },
        { value: 'deep', label: 'مراجعة شاملة + إعادة صياغة' },
        { value: 'final', label: 'تدقيق نهائي قبل الطباعة' },
      ]},
      { key: 'track_changes', label: 'هل تريد إظهار التعديلات؟', type: 'select', options: [
        { value: 'yes', label: 'نعم، Track Changes' },
        { value: 'no', label: 'لا، نص نهائي فقط' },
      ]},
    ]},
    { title: 'الاستعجال', icon: 'calendar', fields: [
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ]},
  ],
};

// ---------------------------- STUDENT SERVICES ----------------------------

const assignmentHelp: ServiceFormTemplate = {
  quantityUnitLabel: 'واجب',
  defaultQuantity: 1,
  sections: [
    { title: 'تفاصيل الواجب', icon: 'graduation', fields: [
      { key: 'subject', label: 'المادة الدراسية', type: 'text', required: true, placeholder: 'مثال: مبادئ الإدارة' },
      { key: 'level', label: 'المرحلة الدراسية', type: 'select', required: true, options: [
        { value: 'school', label: 'مدرسة' },
        { value: 'diploma', label: 'دبلوم' },
        { value: 'bachelor', label: 'بكالوريوس' },
        { value: 'master', label: 'ماجستير' },
      ]},
      { key: 'language', label: 'اللغة', type: 'select', options: LANGUAGES, required: true },
      { key: 'word_count', label: 'عدد الكلمات أو الصفحات', type: 'text', placeholder: 'مثال: 1500 كلمة' },
    ]},
    { title: 'متطلبات إضافية', icon: 'info', fields: [
      { key: 'references_required', label: 'هل تريد مراجع علمية؟', type: 'select', options: [
        { value: 'apa', label: 'نعم — بصيغة APA' },
        { value: 'mla', label: 'نعم — بصيغة MLA' },
        { value: 'harvard', label: 'نعم — Harvard' },
        { value: 'no', label: 'لا حاجة' },
      ]},
      { key: 'plagiarism_check', label: 'فحص الانتحال', type: 'select', options: [
        { value: 'yes', label: 'نعم، أرفقوا تقرير Turnitin' },
        { value: 'no', label: 'لا داعي' },
      ]},
    ]},
    { title: 'موعد التسليم', icon: 'calendar', fields: [
      { key: 'deadline', label: 'موعد تسليم الواجب', type: 'date', required: true },
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ]},
  ],
};

// ---------------------------- DESIGN ----------------------------

const powerpointDesign: ServiceFormTemplate = {
  quantityUnitLabel: 'شريحة',
  defaultQuantity: 15,
  sections: [
    { title: 'محتوى العرض', icon: 'design', fields: [
      { key: 'presentation_purpose', label: 'الهدف من العرض', type: 'select', required: true, options: [
        { value: 'defense', label: 'مناقشة رسالة' },
        { value: 'lecture', label: 'محاضرة / تدريس' },
        { value: 'conference', label: 'مؤتمر' },
        { value: 'project', label: 'عرض مشروع تخرج' },
        { value: 'business', label: 'عرض أعمال' },
      ]},
      { key: 'language', label: 'لغة العرض', type: 'select', options: LANGUAGES, required: true },
      { key: 'content_ready', label: 'هل المحتوى جاهز؟', type: 'select', required: true, options: [
        { value: 'ready', label: 'نعم، عندي كل النصوص' },
        { value: 'partial', label: 'جزء منه جاهز' },
        { value: 'no', label: 'لا، أحتاجكم تكتبون المحتوى' },
      ]},
    ]},
    { title: 'الهوية البصرية', icon: 'info', fields: [
      { key: 'color_palette', label: 'الألوان المفضلة', type: 'text', placeholder: 'مثال: أزرق وأبيض / هوية الجامعة' },
      { key: 'animation_level', label: 'مستوى الأنيميشن', type: 'select', options: [
        { value: 'minimal', label: 'بسيط / احترافي' },
        { value: 'medium', label: 'متوسط' },
        { value: 'rich', label: 'غني بالحركات' },
      ]},
      { key: 'logo_required', label: 'هل تريد إدراج شعار؟', type: 'select', options: [
        { value: 'yes', label: 'نعم، سأرفقه' },
        { value: 'no', label: 'لا' },
      ]},
    ]},
    { title: 'الاستعجال', icon: 'calendar', fields: [
      { key: 'urgency', label: 'مستوى الاستعجال', type: 'select', options: URGENCY, required: true },
    ]},
  ],
};

// ---------------------------- TRAINING ----------------------------

const trainingConsulting: ServiceFormTemplate = {
  quantityUnitLabel: 'جلسة',
  defaultQuantity: 1,
  sections: [
    { title: 'نوع الجلسة', icon: 'graduation', fields: [
      { key: 'session_type', label: 'النوع', type: 'select', required: true, options: [
        { value: 'consultation', label: 'استشارة فردية' },
        { value: 'training', label: 'دورة تدريبية' },
        { value: 'workshop', label: 'ورشة عمل' },
        { value: 'mentoring', label: 'إرشاد مستمر (عدة جلسات)' },
      ]},
      { key: 'topic', label: 'الموضوع المطلوب', type: 'text', required: true, placeholder: 'مثال: SPSS مستوى متقدم' },
      { key: 'level', label: 'مستواك الحالي', type: 'select', options: [
        { value: 'beginner', label: 'مبتدئ' },
        { value: 'intermediate', label: 'متوسط' },
        { value: 'advanced', label: 'متقدم' },
      ]},
    ]},
    { title: 'الموعد والوسيلة', icon: 'calendar', fields: [
      { key: 'preferred_date', label: 'الموعد المقترح', type: 'date' },
      { key: 'preferred_time', label: 'الوقت المفضل', type: 'select', options: [
        { value: 'morning', label: 'صباحاً' },
        { value: 'afternoon', label: 'بعد الظهر' },
        { value: 'evening', label: 'مساءً' },
      ]},
      { key: 'channel', label: 'وسيلة التواصل', type: 'select', required: true, options: [
        { value: 'zoom', label: 'Zoom' },
        { value: 'google_meet', label: 'Google Meet' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'in_person', label: 'حضوري' },
      ]},
    ]},
  ],
};

/**
 * Map service identifier (slug or fragments of name) → template.
 * We match by service id first, then by name keyword.
 */
const TEMPLATES_BY_ID: Record<string, ServiceFormTemplate> = {
  // Translation
  '6c5ea74b-abd8-4bba-8ccf-a0926789ecdb': documentTranslation,        // ترجمة المستندات
  '14a30e6b-bf47-49a4-9e3a-2336d31e3e68': academicTranslation,         // الترجمة الأكاديمية
  '82860f9c-4cfd-4743-ab17-f8b06af26c8e': legalTranslation,            // القانونية
  '6332d8b5-e1b6-427b-8ca8-dfbbb3d507db': medicalTranslation,          // الطبية
  'fffeef54-3f2f-47fb-a351-8c0d2c1c3bc7': videoTranslation,            // فيديو
  // Research
  '8d64bd7c-8bbd-4de5-99e2-1a3b36c91779': researchAssistance,
  'a9f052b6-023a-4b96-9072-2ee729854750': researchProposal,
  // Statistics / SPSS
  '54959b59-8909-49f1-8062-9eaf73a96c1e': spssAnalysis,
  '33a3aafb-8322-449e-9b5c-6f08db84a669': spssAnalysis,
  // Publishing
  '434aa240-643a-4b36-8962-003ee26c3089': journalPublication,
  // Editing
  '45cf0fbe-3e81-48cb-ac16-685f14a412bb': proofreading,
  '3dab73d3-74cb-4624-bd81-9d836ee51a61': proofreading,
  '341b7763-9a27-43dc-a357-5df1cd3411c3': proofreading,
  // Student services
  '9bf8e21e-42e4-4df1-8baa-266924bd97c9': assignmentHelp,
  // Design
  'a5e8b1c8-b67e-47c8-b2c5-d3b1fa2fa5ca': powerpointDesign,
  '4a3aaaa6-975e-421f-9ee4-b8d677788468': powerpointDesign,
  '1d4d8a7a-eb9c-47c3-bb0b-927729806904': powerpointDesign,
  // Training
  'b7f619fb-f34c-43ed-86ff-ec996c3667b0': trainingConsulting,
  '79aa4555-34ed-46db-99d3-0575d268443f': trainingConsulting,
  'caa93d9e-8f18-48de-b5f1-d575641d610e': trainingConsulting,
  '94a305ee-8f6a-49db-9dee-fc8ded8ff04a': trainingConsulting,
};

/** Loose keyword fallback for services not mapped explicitly. */
const KEYWORD_RULES: { test: (n: string) => boolean; tpl: ServiceFormTemplate }[] = [
  { test: (n) => /قانون/i.test(n), tpl: legalTranslation },
  { test: (n) => /طب/i.test(n), tpl: medicalTranslation },
  { test: (n) => /فيديو|صوت/i.test(n), tpl: videoTranslation },
  { test: (n) => /أكاديم.*ترجم|ترجم.*أكاديم/i.test(n), tpl: academicTranslation },
  { test: (n) => /ترجم/i.test(n), tpl: documentTranslation },
  { test: (n) => /spss|amos|إحصائ/i.test(n), tpl: spssAnalysis },
  { test: (n) => /خطة|proposal/i.test(n), tpl: researchProposal },
  { test: (n) => /نشر|journal/i.test(n), tpl: journalPublication },
  { test: (n) => /تدقيق|تحرير|مراجع/i.test(n), tpl: proofreading },
  { test: (n) => /واجب|تلخيص|تقرير|دراسة حالة/i.test(n), tpl: assignmentHelp },
  { test: (n) => /powerpoint|بوستر|إنفوجراف|تصميم|عرض/i.test(n), tpl: powerpointDesign },
  { test: (n) => /استشار|تدريب|ورش|إرشاد|mentor/i.test(n), tpl: trainingConsulting },
  { test: (n) => /بحث|research/i.test(n), tpl: researchAssistance },
];

export const getServiceTemplate = (
  serviceId: string | null | undefined,
  serviceName: string | null | undefined,
): ServiceFormTemplate | null => {
  if (serviceId && TEMPLATES_BY_ID[serviceId]) return TEMPLATES_BY_ID[serviceId];
  const name = (serviceName || '').toLowerCase();
  if (!name) return null;
  for (const rule of KEYWORD_RULES) if (rule.test(name)) return rule.tpl;
  return null;
};

/** Flatten template sections to a simple field list — for review screens / labels. */
export const flattenTemplateFields = (tpl: ServiceFormTemplate): DynamicField[] =>
  tpl.sections.flatMap((s) => s.fields);
