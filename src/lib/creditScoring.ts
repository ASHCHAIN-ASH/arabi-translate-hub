// ============================================================
// Fekrah PayLater — Credit Scoring Engine (SIMAH-style 0–1000)
// نظام تقييم ائتماني محلي مستقل بمعايير شركات التمويل السعودية
// ------------------------------------------------------------
// • النطاق: 0–1000 (متوافق مع نموذج سمة السعودي)
// • 5 فئات للمتقدمين، كل فئة لها معادلة وأوزان مخصصة
// • القرار التلقائي للموافقة فقط — الحالات الأخرى تذهب للمراجعة البشرية
// ============================================================

export const CREDIT_SCORE_MIN = 300;
export const CREDIT_SCORE_MAX = 900;

// عتبة الموافقة التلقائية — أعلى من ذلك = موافقة فورية
export const AUTO_APPROVAL_THRESHOLD = 720;

// ============= فئات المتقدمين =============
export type ApplicantCategory =
  | 'gov_employee'      // موظف حكومي
  | 'private_employee'  // موظف قطاع خاص
  | 'self_employed'     // أعمال حرة / Freelancer
  | 'student'           // طالب
  | 'retired';          // متقاعد

export interface ApplicantCategoryMeta {
  value: ApplicantCategory;
  label: string;
  description: string;
  icon: string; // emoji للعرض السريع
  baseScore: number; // درجة البداية لكل فئة (تعكس مستوى الاستقرار)
  riskFactor: number; // معامل المخاطر (1 = منخفض، 1.5 = أعلى)
}

export const APPLICANT_CATEGORIES: ApplicantCategoryMeta[] = [
  {
    value: 'gov_employee',
    label: 'موظف حكومي',
    description: 'استقرار وظيفي مرتفع، راتب مضمون من الدولة',
    icon: '🏛️',
    baseScore: 580,
    riskFactor: 1.0,
  },
  {
    value: 'private_employee',
    label: 'موظف قطاع خاص',
    description: 'دخل منتظم، استقرار يعتمد على جهة العمل',
    icon: '🏢',
    baseScore: 520,
    riskFactor: 1.1,
  },
  {
    value: 'self_employed',
    label: 'أعمال حرة / مستقل',
    description: 'دخل متغيّر — يتطلب إثبات استمرارية الأعمال',
    icon: '💼',
    baseScore: 460,
    riskFactor: 1.3,
  },
  {
    value: 'student',
    label: 'طالب جامعي',
    description: 'دخل محدود — يُقيَّم وفق المنحة/المعدل/الكفيل',
    icon: '🎓',
    baseScore: 420,
    riskFactor: 1.4,
  },
  {
    value: 'retired',
    label: 'متقاعد',
    description: 'دخل ثابت من المعاش، عمر ائتماني طويل',
    icon: '👴',
    baseScore: 560,
    riskFactor: 1.05,
  },
];

export const getCategoryMeta = (cat: ApplicantCategory): ApplicantCategoryMeta =>
  APPLICANT_CATEGORIES.find((c) => c.value === cat) ?? APPLICANT_CATEGORIES[1];

// ============= مدخلات التقييم =============
export interface CreditScoringInput {
  category: ApplicantCategory;
  monthlyIncome: number;            // الدخل الشهري بالريال
  monthlyCommitments: number;       // الالتزامات الشهرية القائمة
  requestedAmount: number;          // مبلغ التمويل المطلوب
  durationMonths: number;           // مدة التمويل بالأشهر
  age?: number;                     // العمر (اختياري)
  employmentYears?: number;         // سنوات الخبرة الوظيفية (اختياري)
  hasGuarantor?: boolean;           // وجود كفيل (مهم للطلاب)
  sectorRisk?: 'low' | 'medium' | 'high'; // مخاطر القطاع
  previousLatePayments?: number;    // عدد التأخرات السابقة في المنصة
  completedFinancingsCount?: number; // عدد التمويلات المُسدّدة بنجاح
}

// ============= مخرجات التقييم =============
export type ScoreGrade = 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR' | 'POOR' | 'HIGH_RISK';
export type CreditDecision = 'AUTO_APPROVED' | 'MANUAL_REVIEW' | 'AUTO_REJECTED';

export interface ScoreFactor {
  label: string;
  impact: number;      // مساهمة بالنقاط (موجب / سالب)
  type: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface CreditScoringResult {
  score: number;                  // السكور النهائي (300–900)
  grade: ScoreGrade;              // التصنيف اللفظي
  gradeLabel: string;
  gradeColor: string;             // لون tailwind للعرض
  decision: CreditDecision;
  decisionLabel: string;
  dti: number;                    // نسبة الالتزامات/الدخل
  affordabilityRatio: number;     // قدرة السداد على القسط الجديد
  factors: ScoreFactor[];         // تفاصيل العوامل المؤثرة
  recommendation: string;         // توصية نصية للمراجع
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
}

// ============= التصنيفات اللفظية =============
const GRADE_TABLE: Array<{ min: number; grade: ScoreGrade; label: string; color: string }> = [
  { min: 800, grade: 'EXCELLENT',  label: 'ممتاز',           color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' },
  { min: 740, grade: 'VERY_GOOD',  label: 'جيد جدًا',         color: 'text-teal-600 bg-teal-500/10 border-teal-500/30' },
  { min: 670, grade: 'GOOD',       label: 'جيد',             color: 'text-sky-600 bg-sky-500/10 border-sky-500/30' },
  { min: 580, grade: 'FAIR',       label: 'مقبول',           color: 'text-amber-600 bg-amber-500/10 border-amber-500/30' },
  { min: 500, grade: 'POOR',       label: 'ضعيف',            color: 'text-orange-600 bg-orange-500/10 border-orange-500/30' },
  { min: 0,   grade: 'HIGH_RISK',  label: 'مخاطر مرتفعة',     color: 'text-rose-600 bg-rose-500/10 border-rose-500/30' },
];

const getGradeFor = (score: number) =>
  GRADE_TABLE.find((g) => score >= g.min) ?? GRADE_TABLE[GRADE_TABLE.length - 1];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// ============= المحرّك الرئيسي =============
export function calculateCreditScore(input: CreditScoringInput): CreditScoringResult {
  const meta = getCategoryMeta(input.category);
  const factors: ScoreFactor[] = [];

  // 1) درجة البداية حسب الفئة
  let score = meta.baseScore;
  factors.push({
    label: `الفئة الأساسية: ${meta.label}`,
    impact: meta.baseScore - 500,
    type: meta.baseScore >= 500 ? 'positive' : 'negative',
    description: meta.description,
  });

  // 2) نسبة الالتزامات إلى الدخل (DTI) — العامل الأهم (~30%)
  const income = Math.max(1, input.monthlyIncome);
  const dti = input.monthlyCommitments / income;
  let dtiImpact = 0;
  if (dti <= 0.2)      dtiImpact = 150;
  else if (dti <= 0.35) dtiImpact = 90;
  else if (dti <= 0.5)  dtiImpact = 20;
  else if (dti <= 0.65) dtiImpact = -60;
  else                  dtiImpact = -150;
  score += dtiImpact;
  factors.push({
    label: 'نسبة الالتزامات إلى الدخل (DTI)',
    impact: dtiImpact,
    type: dtiImpact >= 0 ? 'positive' : 'negative',
    description: `${(dti * 100).toFixed(1)}% — ${dti <= 0.35 ? 'صحية' : dti <= 0.5 ? 'مقبولة' : 'مرتفعة'}`,
  });

  // 3) قدرة السداد على القسط الجديد (~25%)
  const newMonthlyInstallment = input.durationMonths > 0
    ? (input.requestedAmount * 0.8) / input.durationMonths // بعد خصم 20% دفعة أولى
    : input.requestedAmount;
  const totalAfterNew = input.monthlyCommitments + newMonthlyInstallment;
  const affordabilityRatio = totalAfterNew / income;

  let affordImpact = 0;
  if (affordabilityRatio <= 0.3)       affordImpact = 130;
  else if (affordabilityRatio <= 0.45) affordImpact = 70;
  else if (affordabilityRatio <= 0.6)  affordImpact = 0;
  else if (affordabilityRatio <= 0.75) affordImpact = -90;
  else                                 affordImpact = -180;
  score += affordImpact;
  factors.push({
    label: 'قدرة السداد بعد القسط الجديد',
    impact: affordImpact,
    type: affordImpact >= 0 ? 'positive' : 'negative',
    description: `إجمالي الالتزامات سيصبح ${(affordabilityRatio * 100).toFixed(1)}% من الدخل`,
  });

  // 4) مستوى الدخل المطلق (~10%)
  let incomeImpact = 0;
  if (income >= 20000)      incomeImpact = 80;
  else if (income >= 10000) incomeImpact = 50;
  else if (income >= 6000)  incomeImpact = 20;
  else if (income >= 3000)  incomeImpact = 0;
  else                      incomeImpact = -40;
  score += incomeImpact;
  factors.push({
    label: 'مستوى الدخل الشهري',
    impact: incomeImpact,
    type: incomeImpact >= 0 ? 'positive' : 'negative',
    description: `${income.toLocaleString('ar-SA')} ر.س شهرياً`,
  });

  // 5) سنوات الخبرة الوظيفية (~8%)
  if (input.employmentYears !== undefined) {
    let expImpact = 0;
    if (input.employmentYears >= 10)      expImpact = 60;
    else if (input.employmentYears >= 5)  expImpact = 40;
    else if (input.employmentYears >= 2)  expImpact = 20;
    else if (input.employmentYears >= 1)  expImpact = 0;
    else                                  expImpact = -30;
    score += expImpact;
    factors.push({
      label: 'سنوات الخبرة الوظيفية',
      impact: expImpact,
      type: expImpact >= 0 ? 'positive' : 'negative',
      description: `${input.employmentYears} سنة`,
    });
  }

  // 6) العمر — الفئة الأمثل 28-55 (~5%)
  if (input.age !== undefined) {
    let ageImpact = 0;
    if (input.age >= 28 && input.age <= 55) ageImpact = 40;
    else if (input.age >= 22 && input.age < 28) ageImpact = 10;
    else if (input.age > 55 && input.age <= 65) ageImpact = 20;
    else if (input.age < 22) ageImpact = -20;
    else ageImpact = -40; // > 65
    score += ageImpact;
    factors.push({
      label: 'الفئة العمرية',
      impact: ageImpact,
      type: ageImpact >= 0 ? 'positive' : 'negative',
      description: `${input.age} سنة`,
    });
  }

  // 7) سجل الأداء داخل المنصة (~15%)
  if (input.completedFinancingsCount && input.completedFinancingsCount > 0) {
    const loyaltyImpact = Math.min(120, input.completedFinancingsCount * 30);
    score += loyaltyImpact;
    factors.push({
      label: 'تمويلات سابقة مُسدّدة بنجاح',
      impact: loyaltyImpact,
      type: 'positive',
      description: `${input.completedFinancingsCount} تمويل مكتمل — عميل موثوق`,
    });
  }
  if (input.previousLatePayments && input.previousLatePayments > 0) {
    const lateImpact = -Math.min(200, input.previousLatePayments * 50);
    score += lateImpact;
    factors.push({
      label: 'تأخرات سابقة في السداد',
      impact: lateImpact,
      type: 'negative',
      description: `${input.previousLatePayments} حالة تأخر مسجلة`,
    });
  }

  // 8) كفيل (مهم للطلاب والأعمال الحرة)
  if (input.hasGuarantor && (input.category === 'student' || input.category === 'self_employed')) {
    score += 80;
    factors.push({
      label: 'وجود كفيل غارم',
      impact: 80,
      type: 'positive',
      description: 'يعزز ضمانات السداد',
    });
  }

  // 9) مخاطر القطاع
  if (input.sectorRisk === 'low') {
    score += 30;
    factors.push({ label: 'قطاع منخفض المخاطر', impact: 30, type: 'positive', description: 'استقرار عالٍ' });
  } else if (input.sectorRisk === 'high') {
    score -= 50;
    factors.push({ label: 'قطاع مرتفع المخاطر', impact: -50, type: 'negative', description: 'تقلبات وظيفية محتملة' });
  }

  // 10) معامل المخاطر النهائي للفئة
  const finalScore = Math.round(clamp(score / meta.riskFactor + (meta.riskFactor > 1 ? 100 : 0), CREDIT_SCORE_MIN, CREDIT_SCORE_MAX));

  // ============= القرار =============
  const grade = getGradeFor(finalScore);
  let decision: CreditDecision;
  let decisionLabel: string;
  let recommendation: string;
  let riskLevel: CreditScoringResult['riskLevel'];

  if (finalScore >= AUTO_APPROVAL_THRESHOLD && affordabilityRatio <= 0.5 && dti <= 0.5) {
    decision = 'AUTO_APPROVED';
    decisionLabel = 'موافقة تلقائية فورية ✓';
    recommendation = 'العميل مؤهل تلقائياً وفق المعايير. يمكن إصدار العقد مباشرة.';
    riskLevel = finalScore >= 800 ? 'low' : 'medium';
  } else if (finalScore < 500 || affordabilityRatio > 0.75 || dti > 0.65) {
    decision = 'MANUAL_REVIEW';
    decisionLabel = 'مراجعة بشرية إلزامية';
    recommendation = 'مؤشرات مخاطر مرتفعة — يلزم مراجعة فريق الائتمان قبل أي قرار.';
    riskLevel = 'very_high';
  } else {
    decision = 'MANUAL_REVIEW';
    decisionLabel = 'مراجعة بشرية مطلوبة';
    recommendation = 'السكور لم يبلغ عتبة الموافقة التلقائية. يحتاج تقييم بشري.';
    riskLevel = finalScore >= 580 ? 'medium' : 'high';
  }

  return {
    score: finalScore,
    grade: grade.grade,
    gradeLabel: grade.label,
    gradeColor: grade.color,
    decision,
    decisionLabel,
    dti,
    affordabilityRatio,
    factors,
    recommendation,
    riskLevel,
  };
}

// ============= ربط القطاع المهني بمستوى المخاطر =============
export const SECTOR_RISK_MAP: Record<string, 'low' | 'medium' | 'high'> = {
  government: 'low',
  military: 'low',
  banking: 'low',
  oil_gas: 'low',
  healthcare: 'low',
  education: 'low',
  tech: 'medium',
  legal: 'medium',
  aviation: 'medium',
  retail: 'medium',
  hospitality: 'high',
  construction: 'high',
  self_employed: 'high',
  private: 'medium',
  unemployed: 'high',
};
