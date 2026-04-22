/**
 * Translation word counter widget.
 * Shown in the order form (Step 2 / Attachments) for translation services.
 * - Auto-counts words in uploaded PDF/DOCX/TXT files
 * - Provides an indicative price (clearly marked as non-final)
 * - All final pricing is confirmed by admin after manual review
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Loader2, CheckCircle2, AlertCircle,
  Calculator, Languages, Hash, FileSearch, Info, Sparkles, X,
  RefreshCw, Quote, RotateCw, FileType2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  countWordsInFile, aggregateResults, estimatePrice,
  type WordCountResult,
} from '@/utils/wordCounter';

interface FileEntry {
  id: string;
  file: File;
  result?: WordCountResult;
  error?: string;
  loading: boolean;
}

interface Props {
  /** Selected source/target language values (from dynamic form). */
  sourceLanguage?: string;
  targetLanguage?: string;
  urgency?: string;
  certified?: string;
  /** Notify parent of total word count for storage in metadata. */
  onCountChange?: (data: { totalWords: number; totalPages: number; estimatedPriceSar: number; files: { name: string; words: number }[] }) => void;
}

const ACCEPTED = '.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';
const MAX_SIZE = 20 * 1024 * 1024;

const LANG_LABEL: Record<string, string> = {
  ar: 'العربية', en: 'الإنجليزية', mixed: 'مختلطة', unknown: 'غير محدّدة',
};

const TranslationWordCounter: React.FC<Props> = ({
  sourceLanguage, targetLanguage, urgency, certified, onCountChange,
}) => {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Track previous pricing inputs so we can flag a "recalculation needed" hint
  const prevPricingRef = useRef({ urgency, certified, targetLanguage });
  const [pricingChangedAt, setPricingChangedAt] = useState<number | null>(null);

  const notify = useCallback((list: FileEntry[]) => {
    const completed = list.filter((e) => e.result);
    const agg = aggregateResults(completed.map((e) => e.result!));
    const estimate = estimatePrice(agg.words, { urgency, certified, targetLanguage });
    onCountChange?.({
      totalWords: agg.words,
      totalPages: agg.pages,
      estimatedPriceSar: estimate.totalSar,
      files: completed.map((e) => ({ name: e.file.name, words: e.result!.words })),
    });
  }, [onCountChange, urgency, certified, targetLanguage]);

  // When the user changes urgency / certified / targetLanguage we don't need
  // to re-extract text — we just re-estimate the price and re-emit the totals.
  useEffect(() => {
    const prev = prevPricingRef.current;
    const changed = prev.urgency !== urgency || prev.certified !== certified || prev.targetLanguage !== targetLanguage;
    if (!changed) return;
    prevPricingRef.current = { urgency, certified, targetLanguage };
    if (entries.some((e) => e.result)) {
      setPricingChangedAt(Date.now());
      notify(entries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urgency, certified, targetLanguage]);

  const processFile = useCallback(async (entry: FileEntry, all: FileEntry[]) => {
    try {
      const result = await countWordsInFile(entry.file);
      const next = all.map((e) =>
        e.id === entry.id ? { ...e, result, error: undefined, loading: false } : e
      );
      setEntries(next);
      notify(next);
      toast.success(`تم حساب ${result.words.toLocaleString()} كلمة في "${entry.file.name}"`);
    } catch (err: any) {
      const msg = err?.message || 'تعذّر تحليل الملف';
      const next = all.map((e) =>
        e.id === entry.id ? { ...e, error: msg, loading: false } : e
      );
      setEntries(next);
      toast.error(msg);
    }
  }, [notify]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).slice(0, 5 - entries.length);
    const newEntries: FileEntry[] = arr
      .filter((f) => {
        if (f.size > MAX_SIZE) {
          toast.error(`"${f.name}" أكبر من 20MB`);
          return false;
        }
        return true;
      })
      .map((f) => ({ id: crypto.randomUUID(), file: f, loading: true }));

    if (newEntries.length === 0) return;
    const merged = [...entries, ...newEntries];
    setEntries(merged);
    newEntries.forEach((e) => processFile(e, merged));
  }, [entries, processFile]);

  const removeEntry = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    if (expandedId === id) setExpandedId(null);
    notify(next);
  };

  const recalcEntry = useCallback((id: string) => {
    const target = entries.find((e) => e.id === id);
    if (!target) return;
    const next = entries.map((e) =>
      e.id === id ? { ...e, loading: true, error: undefined, result: undefined } : e
    );
    setEntries(next);
    processFile({ ...target, loading: true, error: undefined, result: undefined }, next);
  }, [entries, processFile]);

  const recalcAll = useCallback(() => {
    if (entries.length === 0) return;
    const next = entries.map((e) => ({ ...e, loading: true, error: undefined, result: undefined }));
    setEntries(next);
    setPricingChangedAt(null);
    next.forEach((e) => processFile(e, next));
    toast.info('جارٍ إعادة حساب جميع الملفات…');
  }, [entries, processFile]);

  const completed = entries.filter((e) => e.result);
  const aggregate = aggregateResults(completed.map((e) => e.result!));
  const estimate = estimatePrice(aggregate.words, { urgency, certified, targetLanguage });
  const anyLoading = entries.some((e) => e.loading);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-base flex items-center gap-2">
            حاسبة الكلمات الفورية
            <Badge variant="secondary" className="text-[10px] gap-1">
              <Sparkles className="w-3 h-3" /> دقيق
            </Badge>
          </h4>
          <p className="text-xs text-muted-foreground">
            ارفع ملفك ليتم حساب عدد الكلمات تلقائياً (كما في شركات الترجمة العالمية)
          </p>
        </div>
      </div>

      {/* Drop zone */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-2xl border-2 border-dashed border-emerald-300/50 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10 hover:border-emerald-500 hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-950/40 dark:hover:to-teal-950/30 transition-all p-6 flex flex-col items-center gap-3 group"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-all group-hover:scale-110">
          <FileSearch className="w-7 h-7 text-emerald-600" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-sm">ارفع ملفك للحساب التلقائي</p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF، Word (.docx)، نص — حتى 20MB
          </p>
        </div>
      </button>

      {/* Files list */}
      <AnimatePresence>
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {entries.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{e.file.name}</p>
                  {e.loading && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Loader2 className="w-3 h-3 animate-spin" /> جارٍ التحليل…
                    </p>
                  )}
                  {e.result && (
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Hash className="w-3 h-3" /> {e.result.words.toLocaleString()} كلمة
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ~{e.result.pages} صفحة
                      </span>
                      <Badge variant="outline" className="text-[10px] h-5">
                        <Languages className="w-2.5 h-2.5 ml-1" />
                        {LANG_LABEL[e.result.language] || e.result.language}
                      </Badge>
                    </div>
                  )}
                  {e.error && (
                    <p className="text-xs text-destructive flex items-center gap-1.5 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> {e.error}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost" size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeEntry(e.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aggregate result */}
      <AnimatePresence>
        {completed.length > 0 && !anyLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-emerald-500/10 p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h5 className="font-bold">نتيجة التحليل</h5>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-background/60">
                <div className="text-2xl font-bold text-emerald-600">
                  {aggregate.words.toLocaleString()}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">كلمة</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-background/60">
                <div className="text-2xl font-bold text-teal-600">
                  {aggregate.pages.toLocaleString()}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">صفحة (تقديري)</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-background/60">
                <div className="text-2xl font-bold text-cyan-600">
                  {completed.length}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">ملف</div>
              </div>
            </div>

            {/* Indicative price */}
            <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">السعر التقديري المبدئي</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-700 dark:text-amber-400">
                      {estimate.totalSar.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">ر.س</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    معدّل {estimate.perWordSar.toFixed(2)} ر.س/كلمة
                    {estimate.urgencyMultiplier > 1 && ` × ${estimate.urgencyMultiplier} (استعجال)`}
                    {estimate.certifiedSurcharge > 0 && ` + ${estimate.certifiedSurcharge} ر.س (اعتماد)`}
                  </p>
                </div>
              </div>
            </div>

            {/* Final price disclaimer */}
            <Alert className="border-primary/30 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs leading-relaxed">
                <strong className="font-bold">ملاحظة هامة:</strong> هذا السعر تقديري مبدئي يعتمد على عدد الكلمات فقط.
                <br />
                <span className="text-muted-foreground">
                  السعر النهائي يُحدَّد بعد <strong>مراجعة الإدارة</strong> للمحتوى والمجال والتعقيد، ويُرسَل لك للموافقة قبل بدء العمل.
                </span>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TranslationWordCounter;
