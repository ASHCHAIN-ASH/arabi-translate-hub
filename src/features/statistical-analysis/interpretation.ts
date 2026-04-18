// Academic interpretation generator - based on actual statistical results
import type { AnalysisType } from './types';

const fmt = (n: number, d = 3) => {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(2);
  return n.toFixed(d);
};

const pStr = (p: number) => p < 0.001 ? '< 0.001' : p.toFixed(3);
const sig = (p: number) => p < 0.05;

export function generateInterpretation(type: AnalysisType, data: any, params: any): { academic: string; simple: string; recommendation: string } {
  const r = data.results;
  const a = data.assumptions || {};

  switch (type) {
    case 'descriptives': {
      return {
        academic: `أظهرت نتائج التحليل الوصفي للمتغير "${params.variable}" أن المتوسط الحسابي بلغ (M = ${fmt(r.mean, 2)})، والانحراف المعياري (SD = ${fmt(r.std, 2)})، والوسيط (Mdn = ${fmt(r.median, 2)})، بحجم عينة (N = ${r.n}). تراوحت القيم بين ${fmt(r.min, 2)} و ${fmt(r.max, 2)}، مع مدى ربيعي IQR = ${fmt(r.iqr, 2)}. بلغ معامل الالتواء ${fmt(r.skewness, 2)} ومعامل التفلطح ${fmt(r.kurtosis, 2)}، مما يشير إلى ${Math.abs(r.skewness) < 1 ? 'توزيع متماثل تقريبًا' : 'توزيع ملتو'}.`,
        simple: `متوسط القيم ${fmt(r.mean, 2)} مع تذبذب قدره ${fmt(r.std, 2)}. أصغر قيمة ${fmt(r.min, 2)} وأكبر قيمة ${fmt(r.max, 2)}.`,
        recommendation: a?.note || ''
      };
    }
    case 'ttest_independent': {
      const decision = sig(r.p) ? 'وجود فرق ذي دلالة إحصائية' : 'عدم وجود فرق ذي دلالة إحصائية';
      const effSize = Math.abs(r.cohens_d);
      const effLabel = effSize < 0.2 ? 'ضعيف' : effSize < 0.5 ? 'صغير' : effSize < 0.8 ? 'متوسط' : 'كبير';
      return {
        academic: `أُجري اختبار T للعينات المستقلة لمقارنة متوسطات المجموعتين في المتغير "${params.dv}". أظهرت النتائج ${decision} بين متوسط المجموعة الأولى (M = ${fmt(r.group1.mean, 2)}, SD = ${fmt(r.group1.std, 2)}, n = ${r.group1.n}) ومتوسط المجموعة الثانية (M = ${fmt(r.group2.mean, 2)}, SD = ${fmt(r.group2.std, 2)}, n = ${r.group2.n})، حيث t(${fmt(r.df, 2)}) = ${fmt(r.t, 3)}, p = ${pStr(r.p)}. بلغ حجم الأثر (Cohen's d = ${fmt(r.cohens_d, 2)})، وهو حجم أثر ${effLabel}. ${sig(r.p) ? 'وعليه، تُرفض الفرضية الصفرية.' : 'وعليه، تُقبل الفرضية الصفرية.'}`,
        simple: sig(r.p) ? `يوجد فرق واضح بين المجموعتين، وهذا الفرق ليس عشوائيًا (احتمال أقل من 5%).` : `لا يوجد فرق واضح بين المجموعتين، والاختلاف الملحوظ قد يكون صدفة.`,
        recommendation: a.recommendation || ''
      };
    }
    case 'ttest_paired': {
      const decision = sig(r.p) ? 'وجود فرق ذي دلالة إحصائية' : 'عدم وجود فرق ذي دلالة إحصائية';
      return {
        academic: `أُجري اختبار T للعينات المرتبطة لمقارنة قياسي ("${params.before}" قبل / "${params.after}" بعد). أظهرت النتائج ${decision}، حيث متوسط القياس الأول (M = ${fmt(r.before.mean, 2)}, SD = ${fmt(r.before.std, 2)}) ومتوسط القياس الثاني (M = ${fmt(r.after.mean, 2)}, SD = ${fmt(r.after.std, 2)})، ومتوسط الفروقات (Md = ${fmt(r.mean_diff, 2)}, SD = ${fmt(r.std_diff, 2)})، t(${r.df}) = ${fmt(r.t, 3)}, p = ${pStr(r.p)}, Cohen's d = ${fmt(r.cohens_d, 2)}.`,
        simple: sig(r.p) ? `هناك تغير حقيقي بين القياسين، والفرق ليس صدفة.` : `لا يوجد تغير ملموس بين القياسين.`,
        recommendation: a.recommendation || ''
      };
    }
    case 'correlation_pearson':
    case 'correlation_spearman': {
      const method = type === 'correlation_pearson' ? 'بيرسون' : 'سبيرمان';
      const sym = type === 'correlation_pearson' ? 'r' : 'rs';
      const strength = Math.abs(r.r) < 0.1 ? 'ضعيفة جدًا' : Math.abs(r.r) < 0.3 ? 'ضعيفة' : Math.abs(r.r) < 0.5 ? 'متوسطة' : Math.abs(r.r) < 0.7 ? 'قوية' : 'قوية جدًا';
      const dir = r.r > 0 ? 'طردية' : 'عكسية';
      return {
        academic: `أُجري حساب معامل ارتباط ${method} لفحص العلاقة بين "${params.x}" و "${params.y}". أظهرت النتائج وجود علاقة ${strength} ${dir} ${sig(r.p) ? 'ودالة إحصائيًا' : 'وغير دالة إحصائيًا'}، حيث ${sym}(${r.df}) = ${fmt(r.r, 3)}, p = ${pStr(r.p)}, n = ${r.n}.`,
        simple: sig(r.p) ? `العلاقة بين المتغيرين ${strength} و${dir}.` : `لا توجد علاقة واضحة بين المتغيرين.`,
        recommendation: a.recommendation || ''
      };
    }
    case 'chi_square': {
      const v = r.cramers_v;
      const vLabel = v < 0.1 ? 'ضعيفة' : v < 0.3 ? 'متوسطة' : 'قوية';
      return {
        academic: `أُجري اختبار كاي² للاستقلالية لفحص العلاقة بين "${params.x}" و "${params.y}". أظهرت النتائج ${sig(r.p) ? 'وجود علاقة ذات دلالة إحصائية' : 'عدم وجود علاقة ذات دلالة إحصائية'} بين المتغيرين، حيث χ²(${r.df}, N = ${r.n}) = ${fmt(r.chi2, 3)}, p = ${pStr(r.p)}, Cramer's V = ${fmt(v, 3)} (دلالة ${vLabel}).`,
        simple: sig(r.p) ? `يوجد ارتباط بين المتغيرين، والعلاقة ليست عشوائية.` : `لا يوجد ارتباط واضح بين المتغيرين.`,
        recommendation: a.recommendation || ''
      };
    }
    case 'anova': {
      const eta = r.eta_squared;
      const etaLabel = eta < 0.01 ? 'ضعيف' : eta < 0.06 ? 'صغير' : eta < 0.14 ? 'متوسط' : 'كبير';
      return {
        academic: `أُجري تحليل التباين الأحادي ANOVA لمقارنة متوسطات ${r.group_stats.length} مجموعات في المتغير "${params.dv}". أظهرت النتائج ${sig(r.p) ? 'وجود فروق ذات دلالة إحصائية' : 'عدم وجود فروق ذات دلالة إحصائية'}، حيث F(${r.df1}, ${r.df2}) = ${fmt(r.F, 3)}, p = ${pStr(r.p)}, η² = ${fmt(eta, 3)} (حجم أثر ${etaLabel}).`,
        simple: sig(r.p) ? `هناك اختلاف فعلي بين بعض المجموعات على الأقل.` : `لا توجد فروق واضحة بين المجموعات.`,
        recommendation: a.recommendation || ''
      };
    }
    case 'regression': {
      return {
        academic: `أُجري تحليل الانحدار الخطي البسيط لتقدير تأثير "${params.x}" على "${params.y}". أظهرت النتائج أن النموذج ${sig(r.p_F) ? 'دالٌّ إحصائيًا' : 'غير دالٍّ إحصائيًا'}، حيث F(1, ${r.df_residual}) = ${fmt(r.F, 3)}, p = ${pStr(r.p_F)}, R² = ${fmt(r.r_squared, 3)} (يفسر ${(r.r_squared * 100).toFixed(1)}% من التباين). معادلة الانحدار: Y = ${fmt(r.intercept, 3)} + ${fmt(r.slope, 3)} × X، وميل الانحدار (β = ${fmt(r.slope, 3)}, t = ${fmt(r.t_slope, 3)}, p = ${pStr(r.p_slope)}).`,
        simple: sig(r.p_F) ? `يوجد تأثير حقيقي للمتغير المستقل على التابع، ويفسر ${(r.r_squared * 100).toFixed(0)}% من تذبذبه.` : `لا يوجد تأثير واضح بين المتغيرين.`,
        recommendation: a.recommendation || ''
      };
    }
  }
  return { academic: '', simple: '', recommendation: '' };
}
