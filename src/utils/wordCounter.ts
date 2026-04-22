/**
 * Professional word counter for translation pricing.
 * Supports PDF, DOCX, TXT, and image (basic). Uses the same technique
 * adopted by global translation companies: extract raw text → normalize →
 * tokenize by Unicode word boundaries → count.
 */

import mammoth from 'mammoth';

export interface WordCountResult {
  words: number;
  characters: number;
  pages: number; // estimated (250 words/page is industry standard)
  language: 'ar' | 'en' | 'mixed' | 'unknown';
  extractedSample: string; // first 200 chars for verification
}

const WORDS_PER_PAGE = 250; // industry standard

/** Tokenize text into words using Unicode-aware regex. Handles Arabic + Latin. */
export const countWordsInText = (text: string): number => {
  if (!text || !text.trim()) return 0;
  const cleaned = text
    .replace(/[\u200B-\u200F\uFEFF]/g, '') // zero-width chars
    .replace(/\s+/g, ' ')
    .trim();
  // Split on whitespace, keep tokens with at least one letter/digit
  const tokens = cleaned.split(/\s+/).filter((t) =>
    /[\u0600-\u06FFa-zA-Z0-9\u00C0-\u017F]/.test(t)
  );
  return tokens.length;
};

/** Detect dominant script. */
const detectLanguage = (text: string): WordCountResult['language'] => {
  const arabic = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latin = (text.match(/[a-zA-Z]/g) || []).length;
  if (arabic === 0 && latin === 0) return 'unknown';
  if (arabic > latin * 3) return 'ar';
  if (latin > arabic * 3) return 'en';
  return 'mixed';
};

/** Extract text from a PDF using pdfjs-dist. */
const extractPdfText = async (file: File): Promise<string> => {
  const pdfjs = await import('pdfjs-dist');
  // Use bundled worker via Vite ?url import
  // @ts-ignore
  const workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it: any) => ('str' in it ? it.str : ''))
      .join(' ');
    text += pageText + '\n';
  }
  return text;
};

/** Extract text from a DOCX using mammoth. */
const extractDocxText = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value || '';
};

/** Extract text from a plain text file. */
const extractTxt = async (file: File): Promise<string> => file.text();

/** Main entry: count words in any supported file. */
export const countWordsInFile = async (file: File): Promise<WordCountResult> => {
  const name = file.name.toLowerCase();
  const ext = name.split('.').pop() || '';

  let text = '';
  try {
    if (ext === 'pdf' || file.type === 'application/pdf') {
      text = await extractPdfText(file);
    } else if (
      ext === 'docx' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractDocxText(file);
    } else if (ext === 'txt' || file.type === 'text/plain') {
      text = await extractTxt(file);
    } else if (ext === 'doc') {
      // Legacy .doc not supported in browser
      throw new Error('legacy_doc');
    } else {
      throw new Error('unsupported');
    }
  } catch (err: any) {
    if (err?.message === 'legacy_doc') {
      throw new Error('صيغة .doc القديمة غير مدعومة. حوّل الملف إلى .docx أو PDF.');
    }
    if (err?.message === 'unsupported') {
      throw new Error('نوع الملف غير مدعوم لحساب الكلمات. الصيغ المدعومة: PDF, DOCX, TXT.');
    }
    throw new Error('تعذّر قراءة الملف. تأكد من أنه غير محمي بكلمة مرور.');
  }

  const words = countWordsInText(text);
  const characters = text.replace(/\s/g, '').length;
  const pages = Math.max(1, Math.ceil(words / WORDS_PER_PAGE));
  const language = detectLanguage(text);

  return {
    words,
    characters,
    pages,
    language,
    extractedSample: text.trim().slice(0, 200),
  };
};

/** Sum results from multiple files. */
export const aggregateResults = (results: WordCountResult[]): WordCountResult => {
  if (results.length === 0) {
    return { words: 0, characters: 0, pages: 0, language: 'unknown', extractedSample: '' };
  }
  const words = results.reduce((s, r) => s + r.words, 0);
  const characters = results.reduce((s, r) => s + r.characters, 0);
  const pages = Math.max(1, Math.ceil(words / WORDS_PER_PAGE));
  // Pick majority language
  const langCounts: Record<string, number> = {};
  results.forEach((r) => { langCounts[r.language] = (langCounts[r.language] || 0) + r.words; });
  const language = (Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown') as WordCountResult['language'];
  return { words, characters, pages, language, extractedSample: results[0].extractedSample };
};

/** Estimate price (indicative only — final price is set by admin). */
export interface PriceEstimate {
  perWordSar: number;
  totalSar: number;
  urgencyMultiplier: number;
  certifiedSurcharge: number;
}

export const estimatePrice = (
  words: number,
  opts: { urgency?: string; certified?: string; targetLanguage?: string } = {}
): PriceEstimate => {
  // Base rates per word (SAR) — internal indicative reference
  const baseRates: Record<string, number> = {
    en: 0.18, ar: 0.18, fr: 0.22, es: 0.22, de: 0.25, tr: 0.20, other: 0.25,
  };
  const perWordSar = baseRates[opts.targetLanguage || 'en'] ?? 0.20;

  let urgencyMultiplier = 1;
  if (opts.urgency === 'urgent') urgencyMultiplier = 1.4;
  if (opts.urgency === 'super_urgent') urgencyMultiplier = 1.8;

  const certifiedSurcharge = opts.certified === 'yes' ? 25 : 0;

  const totalSar = Math.round(words * perWordSar * urgencyMultiplier + certifiedSurcharge);

  return { perWordSar, totalSar, urgencyMultiplier, certifiedSurcharge };
};
