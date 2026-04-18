// Statistical Analysis Engine - Deno
// Adapter pattern: easily swappable with Python service later via STAT_ENGINE_URL secret
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============ STATISTICAL CORE ============

const erf = (x: number): number => {
  // Abramowitz & Stegun approximation
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
};

const normalCDF = (z: number) => 0.5 * (1 + erf(z / Math.sqrt(2)));

// Log gamma (Lanczos)
const logGamma = (x: number): number => {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let sum = 1.000000000190015;
  let y = x;
  for (let j = 0; j < 6; j++) sum += c[j] / ++y;
  return -(x + 5.5) + (x + 0.5) * Math.log(x + 5.5) + Math.log(2.5066282746310005 * sum / x);
};

// Regularized incomplete beta — for t/F p-values
const betacf = (a: number, b: number, x: number): number => {
  const MAXIT = 200, EPS = 3e-7, FPMIN = 1e-30;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
};

const incBeta = (a: number, b: number, x: number): number => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  if (x < (a + 1) / (a + b + 2)) return bt * betacf(a, b, x) / a;
  return 1 - bt * betacf(b, a, 1 - x) / b;
};

// Two-tailed p-value for t-distribution
const tDistTwoTailedPValue = (t: number, df: number): number => {
  const x = df / (df + t * t);
  return incBeta(df / 2, 0.5, x);
};

// Chi-square p-value (1 - CDF) using regularized incomplete gamma
const gammaInc = (a: number, x: number): number => {
  if (x < 0 || a <= 0) return 0;
  if (x === 0) return 0;
  if (x < a + 1) {
    // Series
    let ap = a, sum = 1 / a, del = sum;
    for (let n = 1; n <= 200; n++) {
      ap++;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 3e-7) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  } else {
    // Continued fraction (complement)
    let b = x + 1 - a, c = 1e30, d = 1 / b, h = d;
    for (let i = 1; i <= 200; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 3e-7) break;
    }
    const Q = h * Math.exp(-x + a * Math.log(x) - logGamma(a));
    return 1 - Q;
  }
};

const chi2PValue = (x: number, df: number): number => 1 - gammaInc(df / 2, x / 2);

// F distribution p-value
const fPValue = (f: number, df1: number, df2: number): number => {
  if (f <= 0) return 1;
  return incBeta(df2 / 2, df1 / 2, df2 / (df2 + df1 * f));
};

// ============ DESCRIPTIVES ============
const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const variance = (a: number[], sample = true) => {
  const m = mean(a);
  const sq = a.reduce((s, x) => s + (x - m) ** 2, 0);
  return sq / (a.length - (sample ? 1 : 0));
};
const stddev = (a: number[], sample = true) => Math.sqrt(variance(a, sample));
const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const quantile = (a: number[], q: number) => {
  const s = [...a].sort((x, y) => x - y);
  const pos = (s.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return s[base + 1] !== undefined ? s[base] + rest * (s[base + 1] - s[base]) : s[base];
};
const mode = (a: number[]) => {
  const counts = new Map<number, number>();
  a.forEach(x => counts.set(x, (counts.get(x) || 0) + 1));
  let best = a[0], bestC = 0;
  counts.forEach((c, v) => { if (c > bestC) { bestC = c; best = v; } });
  return best;
};
const skewness = (a: number[]) => {
  const m = mean(a), s = stddev(a);
  if (s === 0) return 0;
  return a.reduce((sum, x) => sum + ((x - m) / s) ** 3, 0) / a.length;
};
const kurtosis = (a: number[]) => {
  const m = mean(a), s = stddev(a);
  if (s === 0) return 0;
  return a.reduce((sum, x) => sum + ((x - m) / s) ** 4, 0) / a.length - 3;
};

const descriptives = (data: number[]) => {
  if (!data.length) return null;
  const m = mean(data), sd = stddev(data);
  const se = sd / Math.sqrt(data.length);
  return {
    n: data.length,
    mean: m,
    median: median(data),
    mode: mode(data),
    std: sd,
    variance: variance(data),
    se,
    min: Math.min(...data),
    max: Math.max(...data),
    range: Math.max(...data) - Math.min(...data),
    q1: quantile(data, 0.25),
    q3: quantile(data, 0.75),
    iqr: quantile(data, 0.75) - quantile(data, 0.25),
    skewness: skewness(data),
    kurtosis: kurtosis(data),
    ci95_lower: m - 1.96 * se,
    ci95_upper: m + 1.96 * se,
  };
};

// ============ ASSUMPTION TESTS ============

// Shapiro-Wilk approximation (Royston 1992) - good for n=3..5000
const shapiroWilk = (data: number[]) => {
  const n = data.length;
  if (n < 3) return { W: null, p: null, normal: false, note: 'العينة صغيرة جدًا (<3)' };
  const sorted = [...data].sort((a, b) => a - b);
  const m = mean(sorted);
  const s2 = sorted.reduce((s, x) => s + (x - m) ** 2, 0);
  // Approximate weights using Royston's normal approximation
  const ai: number[] = [];
  for (let i = 1; i <= n; i++) {
    const u = (i - 0.375) / (n + 0.25);
    ai.push(invNormCDF(u));
  }
  const aiNorm = Math.sqrt(ai.reduce((s, x) => s + x * x, 0));
  const w = ai.map(x => x / aiNorm);
  const num = sorted.reduce((s, x, i) => s + w[i] * x, 0) ** 2;
  const W = num / s2;
  // Approximate p-value via Royston's transformation (rough)
  let p: number;
  if (n <= 11) {
    const g = -2.273 + 0.459 * n;
    const mu = 0.5440 - 0.39978 * n + 0.025054 * n * n - 0.0006714 * n ** 3;
    const sigma = Math.exp(1.3822 - 0.77857 * n + 0.062767 * n * n - 0.0020322 * n ** 3);
    const z = (-Math.log(g - Math.log(1 - W)) - mu) / sigma;
    p = 1 - normalCDF(z);
  } else {
    const u = Math.log(n);
    const mu = 0.0038915 * u ** 3 - 0.083751 * u ** 2 - 0.31082 * u - 1.5861;
    const sigma = Math.exp(0.0030302 * u ** 2 - 0.082676 * u - 0.4803);
    const z = (Math.log(1 - W) - mu) / sigma;
    p = 1 - normalCDF(z);
  }
  p = Math.max(0, Math.min(1, p));
  return { W, p, normal: p > 0.05, note: p > 0.05 ? 'البيانات تتبع التوزيع الطبيعي' : 'البيانات لا تتبع التوزيع الطبيعي' };
};

// Inverse normal CDF (Beasley-Springer-Moro)
const invNormCDF = (p: number): number => {
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-7.78489400243029e-03, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [7.78469570904146e-03, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const pLow = 0.02425, pHigh = 1 - pLow;
  let q: number, r: number;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= pHigh) {
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
           (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
          ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
};

// Levene's test for homogeneity of variance
const leveneTest = (groups: number[][]) => {
  const k = groups.length;
  const N = groups.reduce((s, g) => s + g.length, 0);
  const medians = groups.map(g => median(g));
  const Z = groups.map((g, i) => g.map(x => Math.abs(x - medians[i])));
  const Zbar = Z.map(z => mean(z));
  const Zgrand = Z.flat().reduce((s, x) => s + x, 0) / N;
  const num = groups.reduce((s, g, i) => s + g.length * (Zbar[i] - Zgrand) ** 2, 0) * (N - k);
  const den = Z.reduce((s, z, i) => s + z.reduce((ss, x) => ss + (x - Zbar[i]) ** 2, 0), 0) * (k - 1);
  const W = num / den;
  const p = fPValue(W, k - 1, N - k);
  return { W, p, df1: k - 1, df2: N - k, equal_variance: p > 0.05 };
};

// ============ TESTS ============

// Independent samples t-test (Welch's by default; pooled if equal_var)
const independentTTest = (a: number[], b: number[], equal_var = false) => {
  const m1 = mean(a), m2 = mean(b);
  const v1 = variance(a), v2 = variance(b);
  const n1 = a.length, n2 = b.length;
  let t: number, df: number;
  if (equal_var) {
    const pooled = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2);
    const se = Math.sqrt(pooled * (1 / n1 + 1 / n2));
    t = (m1 - m2) / se;
    df = n1 + n2 - 2;
  } else {
    const se = Math.sqrt(v1 / n1 + v2 / n2);
    t = (m1 - m2) / se;
    df = (v1 / n1 + v2 / n2) ** 2 / ((v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1));
  }
  const p = tDistTwoTailedPValue(t, df);
  // Cohen's d
  const sPooled = Math.sqrt(((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2));
  const d = (m1 - m2) / sPooled;
  return { t, df, p, mean_diff: m1 - m2, group1: { n: n1, mean: m1, std: Math.sqrt(v1) }, group2: { n: n2, mean: m2, std: Math.sqrt(v2) }, cohens_d: d, equal_var };
};

// Paired samples t-test
const pairedTTest = (a: number[], b: number[]) => {
  if (a.length !== b.length) throw new Error('العينات المزدوجة يجب أن تكون بنفس الحجم');
  const diffs = a.map((x, i) => x - b[i]);
  const md = mean(diffs);
  const sd = stddev(diffs);
  const n = diffs.length;
  const se = sd / Math.sqrt(n);
  const t = md / se;
  const df = n - 1;
  const p = tDistTwoTailedPValue(t, df);
  const d = md / sd; // Cohen's d for paired
  return { t, df, p, mean_diff: md, std_diff: sd, n, before: { mean: mean(a), std: stddev(a) }, after: { mean: mean(b), std: stddev(b) }, cohens_d: d };
};

// Pearson correlation
const pearsonCorr = (x: number[], y: number[]) => {
  if (x.length !== y.length) throw new Error('المتغيران يجب أن يكونا بنفس الحجم');
  const n = x.length;
  const mx = mean(x), my = mean(y);
  const sx = stddev(x), sy = stddev(y);
  const cov = x.reduce((s, xi, i) => s + (xi - mx) * (y[i] - my), 0) / (n - 1);
  const r = cov / (sx * sy);
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const p = tDistTwoTailedPValue(t, n - 2);
  return { r, p, n, df: n - 2, t };
};

// Spearman rank correlation
const rank = (a: number[]): number[] => {
  const sorted = a.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = new Array(a.length);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1].v === sorted[i].v) j++;
    const avgRank = (i + j + 2) / 2;
    for (let k = i; k <= j; k++) ranks[sorted[k].i] = avgRank;
    i = j + 1;
  }
  return ranks;
};

const spearmanCorr = (x: number[], y: number[]) => {
  const rx = rank(x), ry = rank(y);
  return pearsonCorr(rx, ry);
};

// Chi-square test of independence (contingency table)
const chiSquareIndependence = (table: number[][]) => {
  const rows = table.length, cols = table[0].length;
  const rowTotals = table.map(r => r.reduce((s, v) => s + v, 0));
  const colTotals = Array(cols).fill(0).map((_, j) => table.reduce((s, r) => s + r[j], 0));
  const total = rowTotals.reduce((s, v) => s + v, 0);
  let chi2 = 0;
  const expected: number[][] = [];
  for (let i = 0; i < rows; i++) {
    expected.push([]);
    for (let j = 0; j < cols; j++) {
      const e = (rowTotals[i] * colTotals[j]) / total;
      expected[i].push(e);
      if (e > 0) chi2 += ((table[i][j] - e) ** 2) / e;
    }
  }
  const df = (rows - 1) * (cols - 1);
  const p = chi2PValue(chi2, df);
  // Cramer's V
  const cramersV = Math.sqrt(chi2 / (total * Math.min(rows - 1, cols - 1)));
  return { chi2, df, p, cramers_v: cramersV, n: total, expected, observed: table };
};

// One-way ANOVA
const oneWayAnova = (groups: number[][]) => {
  const k = groups.length;
  const N = groups.reduce((s, g) => s + g.length, 0);
  const grandMean = groups.flat().reduce((s, x) => s + x, 0) / N;
  const ssBetween = groups.reduce((s, g) => s + g.length * (mean(g) - grandMean) ** 2, 0);
  const ssWithin = groups.reduce((s, g) => { const m = mean(g); return s + g.reduce((ss, x) => ss + (x - m) ** 2, 0); }, 0);
  const dfB = k - 1, dfW = N - k;
  const msB = ssBetween / dfB, msW = ssWithin / dfW;
  const F = msB / msW;
  const p = fPValue(F, dfB, dfW);
  const etaSq = ssBetween / (ssBetween + ssWithin);
  return { F, df1: dfB, df2: dfW, p, ss_between: ssBetween, ss_within: ssWithin, ms_between: msB, ms_within: msW, eta_squared: etaSq, group_stats: groups.map((g, i) => ({ group: i + 1, n: g.length, mean: mean(g), std: stddev(g) })) };
};

// Simple linear regression
const linearRegression = (x: number[], y: number[]) => {
  const n = x.length;
  const mx = mean(x), my = mean(y);
  const sxx = x.reduce((s, xi) => s + (xi - mx) ** 2, 0);
  const sxy = x.reduce((s, xi, i) => s + (xi - mx) * (y[i] - my), 0);
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const yhat = x.map(xi => intercept + slope * xi);
  const ssRes = y.reduce((s, yi, i) => s + (yi - yhat[i]) ** 2, 0);
  const ssTot = y.reduce((s, yi) => s + (yi - my) ** 2, 0);
  const r2 = 1 - ssRes / ssTot;
  const adjR2 = 1 - (1 - r2) * (n - 1) / (n - 2);
  const seSlope = Math.sqrt(ssRes / (n - 2) / sxx);
  const tSlope = slope / seSlope;
  const pSlope = tDistTwoTailedPValue(tSlope, n - 2);
  const F = (r2 / 1) / ((1 - r2) / (n - 2));
  const pF = fPValue(F, 1, n - 2);
  return { slope, intercept, r_squared: r2, adj_r_squared: adjR2, se_slope: seSlope, t_slope: tSlope, p_slope: pSlope, F, p_F: pF, n, df_residual: n - 2 };
};

// ============ DATA UTILITIES ============
const cleanNumeric = (col: any[]): number[] =>
  col.map(v => {
    if (v === null || v === undefined || v === '') return NaN;
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''));
    return isNaN(n) ? NaN : n;
  }).filter(n => !isNaN(n));

const detectColumnType = (col: any[]): 'numeric' | 'categorical' | 'binary' => {
  const nonEmpty = col.filter(v => v !== null && v !== undefined && v !== '');
  if (!nonEmpty.length) return 'categorical';
  const numeric = nonEmpty.filter(v => !isNaN(parseFloat(String(v).replace(/,/g, ''))));
  const ratio = numeric.length / nonEmpty.length;
  if (ratio > 0.85) return 'numeric';
  const unique = new Set(nonEmpty.map(String));
  if (unique.size === 2) return 'binary';
  return 'categorical';
};

// ============ HANDLER ============

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const body = await req.json();
    const { action, payload } = body;

    // EXTERNAL PYTHON HOOK (for future): if STAT_ENGINE_URL is set, proxy to it
    const pyUrl = Deno.env.get('STAT_ENGINE_URL');
    if (pyUrl && action !== 'profile') {
      const r = await fetch(`${pyUrl}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': Deno.env.get('STAT_ENGINE_KEY') || '' },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ===== ACTIONS =====
    if (action === 'profile') {
      const { columns, rows } = payload as { columns: string[]; rows: any[][] };
      const meta = columns.map((name, i) => {
        const col = rows.map(r => r[i]);
        const type = detectColumnType(col);
        const missing = col.filter(v => v === null || v === undefined || v === '').length;
        const unique = new Set(col.filter(v => v !== null && v !== undefined && v !== '').map(String));
        const out: any = { name, type, missing, missing_pct: (missing / col.length) * 100, unique: unique.size };
        if (type === 'numeric') {
          const nums = cleanNumeric(col);
          if (nums.length) {
            out.mean = mean(nums);
            out.std = stddev(nums);
            out.min = Math.min(...nums);
            out.max = Math.max(...nums);
          }
        } else {
          out.top_values = Array.from(unique).slice(0, 10);
        }
        return out;
      });
      return new Response(JSON.stringify({ ok: true, columns_meta: meta, n_rows: rows.length, n_cols: columns.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'descriptives') {
      const { values } = payload as { values: number[] };
      const data = cleanNumeric(values);
      if (data.length < 2) throw new Error('عدد القيم غير كافٍ');
      const desc = descriptives(data);
      const sw = data.length <= 5000 ? shapiroWilk(data) : null;
      return new Response(JSON.stringify({ ok: true, results: desc, normality: sw }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'ttest_independent') {
      const { group1, group2 } = payload as { group1: number[]; group2: number[] };
      const a = cleanNumeric(group1), b = cleanNumeric(group2);
      if (a.length < 2 || b.length < 2) throw new Error('كل مجموعة تحتاج عينتين على الأقل');
      const sw1 = shapiroWilk(a), sw2 = shapiroWilk(b);
      const lev = leveneTest([a, b]);
      const result = independentTTest(a, b, lev.equal_variance);
      return new Response(JSON.stringify({
        ok: true,
        results: result,
        assumptions: {
          normality_group1: sw1,
          normality_group2: sw2,
          levene: lev,
          recommendation: !sw1.normal || !sw2.normal ? 'البيانات لا تتبع التوزيع الطبيعي — يُنصح بـ Mann-Whitney U كبديل لا معلمي.' : (lev.equal_variance ? 'الافتراضات محققة (Student\'s t-test)' : 'تباينات غير متساوية — تم استخدام Welch\'s t-test تلقائيًا')
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'ttest_paired') {
      const { before, after } = payload as { before: number[]; after: number[] };
      const a = before.map(Number), b = after.map(Number);
      const validPairs = a.map((x, i) => [x, b[i]]).filter(([x, y]) => !isNaN(x) && !isNaN(y));
      const ca = validPairs.map(p => p[0]), cb = validPairs.map(p => p[1]);
      if (ca.length < 2) throw new Error('عدد الأزواج غير كافٍ');
      const diffs = ca.map((x, i) => x - cb[i]);
      const sw = shapiroWilk(diffs);
      const result = pairedTTest(ca, cb);
      return new Response(JSON.stringify({
        ok: true,
        results: result,
        assumptions: {
          normality_of_differences: sw,
          recommendation: sw.normal ? 'الافتراضات محققة' : 'فروقات لا تتبع التوزيع الطبيعي — يُنصح بـ Wilcoxon Signed-Rank كبديل.'
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'correlation') {
      const { x, y, method } = payload as { x: number[]; y: number[]; method: 'pearson' | 'spearman' };
      const xs: number[] = [], ys: number[] = [];
      for (let i = 0; i < x.length; i++) {
        const xn = parseFloat(String(x[i])), yn = parseFloat(String(y[i]));
        if (!isNaN(xn) && !isNaN(yn)) { xs.push(xn); ys.push(yn); }
      }
      if (xs.length < 3) throw new Error('عدد الأزواج غير كافٍ (يجب 3 على الأقل)');
      const swx = shapiroWilk(xs), swy = shapiroWilk(ys);
      const result = method === 'spearman' ? spearmanCorr(xs, ys) : pearsonCorr(xs, ys);
      return new Response(JSON.stringify({
        ok: true,
        results: { ...result, method },
        assumptions: {
          normality_x: swx, normality_y: swy,
          recommendation: method === 'pearson' && (!swx.normal || !swy.normal) ? 'متغير واحد على الأقل لا يتبع التوزيع الطبيعي — يُنصح باستخدام Spearman بدلاً من Pearson.' : 'الافتراضات محققة'
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'chi_square') {
      const { table } = payload as { table: number[][] };
      if (!table.length || !table[0].length) throw new Error('جدول التكرار فارغ');
      const result = chiSquareIndependence(table);
      const lowCells = result.expected.flat().filter(e => e < 5).length;
      return new Response(JSON.stringify({
        ok: true,
        results: result,
        assumptions: {
          expected_below_5: lowCells,
          total_cells: result.expected.flat().length,
          recommendation: lowCells > result.expected.flat().length * 0.2 ? `تحذير: ${lowCells} خلية ذات تكرار متوقع أقل من 5 (أكثر من 20%) — قد تكون نتائج Chi² غير دقيقة. يُنصح بـ Fisher\'s Exact للجداول الصغيرة.` : 'الافتراضات محققة'
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'anova') {
      const { groups } = payload as { groups: number[][] };
      const cleaned = groups.map(g => cleanNumeric(g)).filter(g => g.length > 1);
      if (cleaned.length < 2) throw new Error('يجب توفر مجموعتين على الأقل');
      const swResults = cleaned.map(g => shapiroWilk(g));
      const lev = leveneTest(cleaned);
      const result = oneWayAnova(cleaned);
      const allNormal = swResults.every(s => s.normal);
      return new Response(JSON.stringify({
        ok: true,
        results: result,
        assumptions: {
          normality: swResults,
          levene: lev,
          recommendation: !allNormal ? 'مجموعة واحدة أو أكثر لا تتبع التوزيع الطبيعي — يُنصح بـ Kruskal-Wallis كبديل لا معلمي.' : (!lev.equal_variance ? 'تباينات غير متساوية — يُنصح بـ Welch\'s ANOVA.' : 'الافتراضات محققة')
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'regression') {
      const { x, y } = payload as { x: number[]; y: number[] };
      const xs: number[] = [], ys: number[] = [];
      for (let i = 0; i < x.length; i++) {
        const xn = parseFloat(String(x[i])), yn = parseFloat(String(y[i]));
        if (!isNaN(xn) && !isNaN(yn)) { xs.push(xn); ys.push(yn); }
      }
      if (xs.length < 3) throw new Error('عدد النقاط غير كافٍ');
      const result = linearRegression(xs, ys);
      // Residual normality
      const yhat = xs.map(xi => result.intercept + result.slope * xi);
      const residuals = ys.map((yi, i) => yi - yhat[i]);
      const sw = shapiroWilk(residuals);
      return new Response(JSON.stringify({
        ok: true,
        results: result,
        assumptions: {
          residuals_normality: sw,
          recommendation: sw.normal ? 'الافتراضات محققة' : 'البواقي لا تتبع التوزيع الطبيعي — قد تكون النتائج غير دقيقة.'
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
