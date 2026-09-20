/**
 * Translation Analysis Engine
 * ----------------------------
 * Professional document analysis tailored for translation pricing.
 * Pipeline: extract → clean → detect language → classify domain (heuristic)
 *           → compute pages (RTL-aware) → estimate price → score confidence.
 *
 * Used by:
 *  - Browser-side analyzer (primary, fast)
 *  - Edge function `analyze-translation-file` (server fallback)
 */

export type Language = 'ar' | 'en' | 'mixed' | 'unknown';
export type Domain = 'general' | 'academic' | 'legal' | 'medical' | 'technical';
export type Confidence = 'high' | 'medium' | 'low';
export type AnalysisMethod = 'browser' | 'edge' | 'fallback';

export interface DomainScore {
  domain: Domain;
  confidence: number; // 0-100
}

export interface TranslationAnalysisResult {
  // File
  fileName: string;
  fileType: string;
  fileSizeBytes: number;

  // Counts
  wordCount: number;
  characterCount: number;
  estimatedPages: number;
  wordsPerPageStandard: number;

  // Language
  language: Language;
  arabicRatio: number;
  englishRatio: number;

  // Domain
  domain: Domain;
  domainSource: 'manual' | 'ai' | 'hybrid' | 'heuristic';
  domainConfidence: number;
  domainSuggestions: DomainScore[];

  // Pricing
  estimatedPriceSar: number;
  perWordRateSar: number;
  urgencyMultiplier: number;
  domainMultiplier: number;

  // Confidence & methodology
  confidenceLevel: Confidence;
  analysisMethod: AnalysisMethod;
  isFallback: boolean;
  analysisNotes: string[];

  // Sample
  textSample: string;
}

// ───────────────────────── Standards ─────────────────────────

const WORDS_PER_PAGE: Record<Language, number> = {
  ar: 220, // RTL — denser script
  en: 250, // Latin baseline (SDL/Lionbridge)
  mixed: 235,
  unknown: 250,
};
const CHARS_PER_PAGE = 1500; // ISO 1500-char standard page

// Per-word base rate (SAR) — pricing is per 1000 words for the "general" domain at 95 SAR.
// 95 SAR / 1000 words = 0.095 SAR per word. Domain multipliers scale this base.
// Target language no longer affects base price (kept uniform per business rule).
const BASE_RATES_SAR: Record<string, number> = {
  ar: 0.095, en: 0.095, fr: 0.095, es: 0.095, de: 0.095, tr: 0.095, other: 0.095,
};

// Domain pricing multipliers — calibrated so per-1000-words pricing matches:
// general 95 · academic 150 · legal 250 · medical 250 · technical 200
const DOMAIN_MULTIPLIER: Record<Domain, number> = {
  general: 1.0,        // 95 SAR / 1000 words
  academic: 1.5789,    // ≈ 150 SAR / 1000 words
  legal: 2.6316,       // ≈ 250 SAR / 1000 words
  medical: 2.6316,     // ≈ 250 SAR / 1000 words
  technical: 2.1053,   // ≈ 200 SAR / 1000 words
};

// ───────────────────────── Cleaning ─────────────────────────

/** Strip headers/footers (repeated lines), page numbers, broken lines. */
export const cleanExtractedText = (raw: string): string => {
  if (!raw) return '';
  let text = raw.replace(/[\u200B-\u200F\uFEFF]/g, ''); // zero-width

  // Split into lines, drop ultra-short lines that look like page numbers
  const lines = text.split(/\r?\n/).map((l) => l.trim());

  // Detect repeated header/footer lines (appear ≥ 3 times and are short)
  const freq = new Map<string, number>();
  for (const l of lines) {
    if (l.length > 0 && l.length < 80) freq.set(l, (freq.get(l) || 0) + 1);
  }
  const repeats = new Set<string>();
  for (const [l, n] of freq) if (n >= 3 && l.length < 80) repeats.add(l);

  const filtered = lines.filter((l) => {
    if (!l) return false;
    if (/^\s*\d{1,4}\s*$/.test(l)) return false; // pure page number
    if (/^[-_=•·\.]{3,}$/.test(l)) return false; // separator lines
    if (repeats.has(l)) return false;
    return true;
  });

  text = filtered.join(' ');
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
};

// ───────────────────────── Counting ─────────────────────────

export const countWords = (text: string): number => {
  if (!text) return 0;
  const tokens = text.split(/\s+/).filter((t) =>
    /[\u0600-\u06FFa-zA-Z0-9\u00C0-\u017F]/.test(t)
  );
  return tokens.length;
};

export const countChars = (text: string): number =>
  (text || '').replace(/\s/g, '').length;

// ───────────────────────── Language detection ─────────────────────────

export const detectLanguage = (text: string): { language: Language; arabicRatio: number; englishRatio: number } => {
  const arabic = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latin = (text.match(/[a-zA-Z]/g) || []).length;
  const total = arabic + latin;
  if (total === 0) return { language: 'unknown', arabicRatio: 0, englishRatio: 0 };

  const ar = Math.round((arabic / total) * 100);
  const en = Math.round((latin / total) * 100);

  let language: Language;
  if (ar >= 80) language = 'ar';
  else if (en >= 80) language = 'en';
  else language = 'mixed';

  return { language, arabicRatio: ar, englishRatio: en };
};

// ───────────────────────── Domain heuristic classification ─────────────────────────

const DOMAIN_KEYWORDS: Record<Domain, RegExp[]> = {
  legal: [
    /\b(contract|agreement|plaintiff|defendant|jurisdiction|whereas|hereby|liability|clause|breach|tort|statute)\b/gi,
    /(عقد|اتفاقية|المدعي|المدعى\s*عليه|البند|المادة|حيثيات|الطرف\s*الأول|قانون|قضية|محكمة|اختصاص|التزام)/g,
  ],
  medical: [
    /\b(patient|diagnosis|treatment|symptoms|dosage|prescription|clinical|surgery|pathology|therapeutic|mg|ml)\b/gi,
    /(المريض|التشخيص|العلاج|الأعراض|جرعة|وصفة|سريري|جراحة|دواء|مستشفى|طبي)/g,
  ],
  academic: [
    /\b(abstract|methodology|hypothesis|literature\s*review|references|bibliography|et\s*al\.|figure\s*\d|table\s*\d)\b/gi,
    /(المستخلص|المنهجية|الفرضية|المراجع|الإطار\s*النظري|الدراسات\s*السابقة|البحث|الأطروحة|الجامعة|الكلية)/g,
  ],
  technical: [
    /\b(api|software|hardware|configuration|deployment|server|database|protocol|architecture|kernel|algorithm)\b/gi,
    /(برمجة|نظام|تقني|قاعدة\s*بيانات|خوارزمية|تشفير|شبكة|بروتوكول|واجهة|تطبيق|سيرفر)/g,
  ],
  general: [],
};

export const classifyDomain = (text: string): { domain: Domain; confidence: number; suggestions: DomainScore[] } => {
  const sample = text.slice(0, 50_000); // first ~50k chars
  const scores: DomainScore[] = [];
  for (const d of ['legal', 'medical', 'academic', 'technical'] as Domain[]) {
    let count = 0;
    for (const re of DOMAIN_KEYWORDS[d]) {
      const m = sample.match(re);
      if (m) count += m.length;
    }
    scores.push({ domain: d, confidence: count });
  }
  scores.sort((a, b) => b.confidence - a.confidence);
  const top = scores[0];
  if (!top || top.confidence < 3) {
    return { domain: 'general', confidence: 50, suggestions: [{ domain: 'general', confidence: 50 }, ...scores] };
  }
  // Normalize to 0-100 (cap)
  const conf = Math.min(95, 40 + top.confidence * 5);
  return {
    domain: top.domain,
    confidence: conf,
    suggestions: scores.map((s) => ({ domain: s.domain, confidence: Math.min(95, 40 + s.confidence * 5) })),
  };
};

// ───────────────────────── Pages ─────────────────────────

export const computePages = (words: number, chars: number, lang: Language) => {
  const wpp = WORDS_PER_PAGE[lang] ?? 250;
  const byWords = words > 0 ? Math.max(1, Math.ceil(words / wpp)) : 0;
  const byChars = chars > 0 ? Math.max(1, Math.ceil(chars / CHARS_PER_PAGE)) : 0;
  return { pages: Math.max(byWords, byChars), wpp, byWords, byChars };
};

// ───────────────────────── Pricing ─────────────────────────

export const computePrice = (
  words: number,
  language: Language,
  domain: Domain,
  opts: { urgency?: string; certified?: string; targetLanguage?: string } = {}
) => {
  const perWord = BASE_RATES_SAR[opts.targetLanguage || 'en'] ?? 0.20;
  let urgencyMul = 1;
  if (opts.urgency === 'urgent') urgencyMul = 1.4;
  if (opts.urgency === 'super_urgent') urgencyMul = 1.8;
  const domainMul = DOMAIN_MULTIPLIER[domain] ?? 1;
  const certifiedAdd = opts.certified === 'yes' ? 25 : 0;
  const total = Math.round(words * perWord * urgencyMul * domainMul + certifiedAdd);
  return { total, perWord, urgencyMul, domainMul };
};

// ───────────────────────── Confidence ─────────────────────────

export const scoreConfidence = (params: {
  textLength: number;
  isFallback: boolean;
  pageCount: number;
  language: Language;
  hadCleaning: boolean;
}): { level: Confidence; notes: string[] } => {
  const notes: string[] = [];
  let score = 70; // baseline

  if (params.isFallback) { score -= 35; notes.push('اعتمد التحليل على عدد الصفحات التقديري بدلاً من النص الفعلي.'); }
  if (params.textLength < 200) { score -= 25; notes.push('النص المستخرج قصير جداً، الدقة منخفضة.'); }
  else if (params.textLength > 5000) { score += 15; notes.push('عينة نصية كبيرة — دقة جيدة.'); }
  if (params.language === 'unknown') { score -= 20; notes.push('تعذّر تحديد اللغة بدقة.'); }
  if (params.language === 'mixed') { notes.push('الملف يحتوي على لغتين — تم استخدام معيار 235 كلمة/صفحة.'); }
  if (params.hadCleaning) notes.push('تم تنظيف الترويسات والتذييلات وأرقام الصفحات قبل العد.');

  let level: Confidence = 'medium';
  if (score >= 80) level = 'high';
  else if (score < 50) level = 'low';
  return { level, notes };
};

// ───────────────────────── Extraction ─────────────────────────

// Cache pdf.js module + worker so we only pay the load cost once per session.
let _pdfjsPromise: Promise<any> | null = null;
const loadPdfJs = () => {
  if (!_pdfjsPromise) {
    _pdfjsPromise = (async () => {
      const pdfjs = await import('pdfjs-dist');
      // @ts-ignore
      const workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      return pdfjs;
    })();
  }
  return _pdfjsPromise;
};

const extractPdfText = async (file: File, onProgress?: (p: number) => void): Promise<string> => {
  onProgress?.(3);
  const pdfjs = await loadPdfJs();
  onProgress?.(10);
  const buffer = await file.arrayBuffer();
  onProgress?.(18);
  const pdf = await pdfjs.getDocument({ data: buffer, disableAutoFetch: true, disableStream: true }).promise;
  const total = pdf.numPages;

  // Process pages in parallel batches for big speed-up on multi-page PDFs.
  const BATCH = 6;
  const pageTexts: string[] = new Array(total);
  let done = 0;

  for (let start = 0; start < total; start += BATCH) {
    const end = Math.min(start + BATCH, total);
    await Promise.all(
      Array.from({ length: end - start }, (_, k) => start + k + 1).map(async (pageNum) => {
        try {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          pageTexts[pageNum - 1] = content.items
            .map((it: any) => ('str' in it ? it.str : ''))
            .join(' ');
        } catch {
          pageTexts[pageNum - 1] = '';
        } finally {
          done++;
          onProgress?.(18 + Math.round((done / total) * 78));
        }
      })
    );
  }

  return pageTexts.join('\n');
};

const extractDocxText = async (file: File, onProgress?: (p: number) => void): Promise<string> => {
  onProgress?.(20);
  const buffer = await file.arrayBuffer();
  onProgress?.(60);
  const { default: mammoth } = await import('mammoth');
  const r = await mammoth.extractRawText({ arrayBuffer: buffer });
  onProgress?.(95);
  return r.value || '';
};

const extractTxt = async (file: File, onProgress?: (p: number) => void): Promise<string> => {
  onProgress?.(40);
  const t = await file.text();
  onProgress?.(95);
  return t;
};

// ───────────────────────── Main entry ─────────────────────────

export interface AnalyzeOptions {
  urgency?: string;
  certified?: string;
  targetLanguage?: string;
  /** Estimated page count to use as fallback if text extraction fails. */
  fallbackPages?: number;
  onProgress?: (pct: number) => void;
}

export const analyzeTranslationFile = async (
  file: File,
  opts: AnalyzeOptions = {}
): Promise<TranslationAnalysisResult> => {
  const name = file.name.toLowerCase();
  const ext = name.split('.').pop() || '';
  let rawText = '';
  let isFallback = false;
  let method: AnalysisMethod = 'browser';

  try {
    if (ext === 'pdf' || file.type === 'application/pdf') {
      rawText = await extractPdfText(file, opts.onProgress);
    } else if (ext === 'docx' || file.type.includes('wordprocessingml')) {
      rawText = await extractDocxText(file, opts.onProgress);
    } else if (ext === 'txt' || file.type === 'text/plain') {
      rawText = await extractTxt(file, opts.onProgress);
    } else if (ext === 'doc') {
      throw new Error('legacy_doc');
    } else {
      throw new Error('unsupported');
    }
    if (!rawText || rawText.trim().length < 20) {
      throw new Error('empty_extraction');
    }
  } catch (err: any) {
    isFallback = true;
    method = 'fallback';
    rawText = '';
  }

  const cleaned = cleanExtractedText(rawText);
  const words = isFallback
    ? Math.max(0, (opts.fallbackPages ?? Math.ceil(file.size / 3000)) * 250)
    : countWords(cleaned);
  const chars = countChars(cleaned);
  const langInfo = detectLanguage(cleaned);
  const domainInfo = classifyDomain(cleaned);
  const pageInfo = computePages(words, chars, langInfo.language);
  const price = computePrice(words, langInfo.language, domainInfo.domain, opts);
  const conf = scoreConfidence({
    textLength: cleaned.length,
    isFallback,
    pageCount: pageInfo.pages,
    language: langInfo.language,
    hadCleaning: !isFallback,
  });

  opts.onProgress?.(100);

  return {
    fileName: file.name,
    fileType: ext.toUpperCase() || file.type,
    fileSizeBytes: file.size,
    wordCount: words,
    characterCount: chars,
    estimatedPages: pageInfo.pages,
    wordsPerPageStandard: pageInfo.wpp,
    language: langInfo.language,
    arabicRatio: langInfo.arabicRatio,
    englishRatio: langInfo.englishRatio,
    domain: domainInfo.domain,
    domainSource: 'heuristic',
    domainConfidence: domainInfo.confidence,
    domainSuggestions: domainInfo.suggestions,
    estimatedPriceSar: price.total,
    perWordRateSar: price.perWord,
    urgencyMultiplier: price.urgencyMul,
    domainMultiplier: price.domainMul,
    confidenceLevel: conf.level,
    analysisMethod: method,
    isFallback,
    analysisNotes: conf.notes,
    textSample: cleaned.slice(0, 300),
  };
};

/** Recompute pricing only (e.g. when user changes domain/urgency). */
export const recomputePricing = (
  result: TranslationAnalysisResult,
  opts: AnalyzeOptions & { domain?: Domain }
): TranslationAnalysisResult => {
  const domain = opts.domain ?? result.domain;
  const price = computePrice(result.wordCount, result.language, domain, opts);
  return {
    ...result,
    domain,
    domainSource: opts.domain && opts.domain !== result.domain ? 'manual' : result.domainSource,
    estimatedPriceSar: price.total,
    perWordRateSar: price.perWord,
    urgencyMultiplier: price.urgencyMul,
    domainMultiplier: price.domainMul,
  };
};

export const DOMAIN_LABELS_AR: Record<Domain, string> = {
  general: 'عام',
  academic: 'أكاديمي',
  legal: 'قانوني',
  medical: 'طبي',
  technical: 'تقني',
};

export const LANGUAGE_LABELS_AR: Record<Language, string> = {
  ar: 'العربية',
  en: 'الإنجليزية',
  mixed: 'مختلط (عربي/إنجليزي)',
  unknown: 'غير محدد',
};

export const CONFIDENCE_LABELS_AR: Record<Confidence, string> = {
  high: 'مرتفع',
  medium: 'متوسط',
  low: 'منخفض',
};
