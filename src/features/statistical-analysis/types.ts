// Statistical Analysis types
export interface ColumnMeta {
  name: string;
  type: 'numeric' | 'categorical' | 'binary';
  missing: number;
  missing_pct: number;
  unique: number;
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
  top_values?: string[];
}

export interface DataProfile {
  columns_meta: ColumnMeta[];
  n_rows: number;
  n_cols: number;
}

export type AnalysisType =
  | 'descriptives'
  | 'ttest_independent'
  | 'ttest_paired'
  | 'correlation_pearson'
  | 'correlation_spearman'
  | 'chi_square'
  | 'anova'
  | 'regression';

export interface AnalysisMeta {
  key: AnalysisType;
  name_ar: string;
  name_en: string;
  description_ar: string;
  goal: 'describe' | 'compare_2' | 'compare_n' | 'relate' | 'predict' | 'associate';
  required_vars: { type: 'numeric' | 'categorical' | 'group'; count: number; label: string }[];
}

export const ANALYSES: AnalysisMeta[] = [
  {
    key: 'descriptives',
    name_ar: 'الإحصاء الوصفي',
    name_en: 'Descriptive Statistics',
    description_ar: 'متوسط، وسيط، انحراف معياري، تشتت، وأرباع المتغير العددي',
    goal: 'describe',
    required_vars: [{ type: 'numeric', count: 1, label: 'متغير عددي' }],
  },
  {
    key: 'ttest_independent',
    name_ar: 'اختبار T للعينات المستقلة',
    name_en: 'Independent Samples T-Test',
    description_ar: 'يقارن متوسطي مجموعتين مستقلتين (مثل: ذكور/إناث في درجة الاختبار)',
    goal: 'compare_2',
    required_vars: [
      { type: 'numeric', count: 1, label: 'متغير عددي (الدرجة)' },
      { type: 'categorical', count: 1, label: 'متغير المجموعة (مجموعتان فقط)' },
    ],
  },
  {
    key: 'ttest_paired',
    name_ar: 'اختبار T للعينات المرتبطة',
    name_en: 'Paired Samples T-Test',
    description_ar: 'يقارن قياسين لنفس الأفراد (قبل/بعد)',
    goal: 'compare_2',
    required_vars: [
      { type: 'numeric', count: 1, label: 'القياس الأول (قبل)' },
      { type: 'numeric', count: 1, label: 'القياس الثاني (بعد)' },
    ],
  },
  {
    key: 'anova',
    name_ar: 'تحليل التباين الأحادي ANOVA',
    name_en: 'One-Way ANOVA',
    description_ar: 'يقارن متوسطات 3 مجموعات أو أكثر',
    goal: 'compare_n',
    required_vars: [
      { type: 'numeric', count: 1, label: 'متغير عددي' },
      { type: 'categorical', count: 1, label: 'متغير المجموعة (3+)' },
    ],
  },
  {
    key: 'correlation_pearson',
    name_ar: 'معامل ارتباط بيرسون',
    name_en: 'Pearson Correlation',
    description_ar: 'قوة واتجاه العلاقة الخطية بين متغيرين عدديين',
    goal: 'relate',
    required_vars: [
      { type: 'numeric', count: 1, label: 'المتغير X' },
      { type: 'numeric', count: 1, label: 'المتغير Y' },
    ],
  },
  {
    key: 'correlation_spearman',
    name_ar: 'معامل ارتباط سبيرمان',
    name_en: 'Spearman Correlation',
    description_ar: 'علاقة رتبية بين متغيرين (لا يشترط التوزيع الطبيعي)',
    goal: 'relate',
    required_vars: [
      { type: 'numeric', count: 1, label: 'المتغير X' },
      { type: 'numeric', count: 1, label: 'المتغير Y' },
    ],
  },
  {
    key: 'chi_square',
    name_ar: 'اختبار كاي² للاستقلالية',
    name_en: 'Chi-Square Test of Independence',
    description_ar: 'يفحص العلاقة بين متغيرين فئويين',
    goal: 'associate',
    required_vars: [
      { type: 'categorical', count: 1, label: 'متغير فئوي 1' },
      { type: 'categorical', count: 1, label: 'متغير فئوي 2' },
    ],
  },
  {
    key: 'regression',
    name_ar: 'الانحدار الخطي البسيط',
    name_en: 'Simple Linear Regression',
    description_ar: 'تأثير متغير مستقل على متغير تابع',
    goal: 'predict',
    required_vars: [
      { type: 'numeric', count: 1, label: 'المتغير المستقل (X)' },
      { type: 'numeric', count: 1, label: 'المتغير التابع (Y)' },
    ],
  },
];
