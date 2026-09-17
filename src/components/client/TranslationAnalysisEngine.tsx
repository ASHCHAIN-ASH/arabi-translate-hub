/**
 * TranslationAnalysisEngine
 * --------------------------
 * Professional translation file analyzer (replaces the older TranslationWordCounter).
 * Each uploaded file gets its own analysis card showing language, words, pages,
 * domain (editable), estimated price, confidence and notes.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Loader2, CheckCircle2, AlertCircle, Languages,
  Hash, FileSearch, Info, X, RefreshCw, FileType2, Brain, ShieldCheck,
  Gauge, Tag, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/data/legacy/client';
import {
  analyzeTranslationFile, recomputePricing, DOMAIN_LABELS_AR,
  LANGUAGE_LABELS_AR, CONFIDENCE_LABELS_AR,
  type TranslationAnalysisResult, type Domain,
} from '@/utils/translationAnalysis';

interface FileEntry {
  id: string;
  file: File;
  result?: TranslationAnalysisResult;
  loading: boolean;
  progress: number;
  error?: string;
}

export interface AnalysisSummary {
  totalWords: number;
  totalPages: number;
  totalCharacters: number;
  estimatedPriceSar: number;
  pendingCount: number;
  errorCount: number;
  totalFiles: number;
  files: TranslationAnalysisResult[];
}

interface Props {
  sourceLanguage?: string;
  targetLanguage?: string;
  urgency?: string;
  certified?: string;
  onChange?: (summary: AnalysisSummary) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_EXTS = ['pdf', 'docx', 'txt'];

const TranslationAnalysisEngine: React.FC<Props> = ({
  sourceLanguage, targetLanguage, urgency, certified, onChange,
}) => {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const entriesRef = useRef<FileEntry[]>([]);
  entriesRef.current = entries;

  // ───────── notify parent ─────────
  useEffect(() => {
    const completed = entries.filter((e) => e.result);
    const summary: AnalysisSummary = {
      totalWords: completed.reduce((s, e) => s + (e.result?.wordCount ?? 0), 0),
      totalPages: completed.reduce((s, e) => s + (e.result?.estimatedPages ?? 0), 0),
      totalCharacters: completed.reduce((s, e) => s + (e.result?.characterCount ?? 0), 0),
      estimatedPriceSar: completed.reduce((s, e) => s + (e.result?.estimatedPriceSar ?? 0), 0),
      pendingCount: entries.filter((e) => e.loading).length,
      errorCount: entries.filter((e) => e.error).length,
      totalFiles: entries.length,
      files: completed.map((e) => e.result!),
    };
    onChange?.(summary);
  }, [entries, onChange]);

  // ───────── analyze single file ─────────
  const processFile = useCallback(
    async (entryOrId: Pick<FileEntry, 'id' | 'file'> | string) => {
      const entry = typeof entryOrId === 'string'
        ? entriesRef.current.find((e) => e.id === entryOrId)
        : entryOrId;
      if (!entry) return;
      const { id, file } = entry;

      const updateEntry = (patch: Partial<FileEntry>) => {
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
      };

      updateEntry({ loading: true, progress: 0, error: undefined });

      try {
        const result = await analyzeTranslationFile(file, {
          urgency, certified, targetLanguage,
          onProgress: (p) => updateEntry({ progress: p }),
        });

        // Show heuristic result IMMEDIATELY — don't wait for AI.
        updateEntry({ result, loading: false, progress: 100 });

        // Fire-and-forget AI classification with a 4s timeout, refine if better.
        if (result.textSample && result.textSample.length > 50) {
          (async () => {
            try {
              const aiPromise = supabase.functions.invoke('analyze-translation-file', {
                body: {
                  textSample: result.textSample,
                  fileName: result.fileName,
                  fileType: result.fileType,
                },
              });
              const timeout = new Promise<{ data: null; error: any }>((resolve) =>
                setTimeout(() => resolve({ data: null, error: new Error('timeout') }), 4000)
              );
              const { data, error } = (await Promise.race([aiPromise, timeout])) as any;
              if (error || !data?.domain) return;
              const aiDomain = data.domain as Domain;
              const aiConf = Number(data.confidence) || 50;
              if (aiConf > result.domainConfidence) {
                const repriced = recomputePricing(result, {
                  urgency, certified, targetLanguage, domain: aiDomain,
                });
                repriced.domainSource = 'ai';
                repriced.domainConfidence = aiConf;
                updateEntry({ result: repriced });
              }
            } catch {
              /* ignore — heuristic stays */
            }
          })();
        }
        return;
      } catch (err: any) {
        updateEntry({
          loading: false,
          progress: 0,
          error: err?.message || 'تعذّر تحليل الملف',
        });
      }
    },
    [urgency, certified, targetLanguage]
  );

  // ───────── recompute when language/urgency changes ─────────
  useEffect(() => {
    setEntries((prev) =>
      prev.map((e) => {
        if (!e.result) return e;
        return { ...e, result: recomputePricing(e.result, { urgency, certified, targetLanguage }) };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urgency, certified, targetLanguage]);

  // ───────── add files (sequential queue) ─────────
  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      const accepted: FileEntry[] = [];

      for (const file of incoming) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (!ALLOWED_EXTS.includes(ext)) {
          toast.error(`نوع الملف غير مدعوم: ${file.name} — المدعوم PDF / DOCX / TXT`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} يتجاوز 50 ميجابايت`);
          continue;
        }
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file, loading: true, progress: 0,
        });
      }
      if (!accepted.length) return;

      setEntries((prev) => [...prev, ...accepted]);
      // Process up to 2 files in parallel — fast without overloading the browser.
      const CONCURRENCY = 2;
      for (let i = 0; i < accepted.length; i += CONCURRENCY) {
        await Promise.all(
          accepted.slice(i, i + CONCURRENCY).map((entry) => processFile(entry))
        );
      }
    },
    [processFile]
  );

  const removeEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const reanalyze = (id: string) => {
    const entry = entriesRef.current.find((e) => e.id === id);
    if (entry) processFile({ id: entry.id, file: entry.file });
  };
  const changeDomain = (id: string, domain: Domain) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id && e.result
          ? { ...e, result: recomputePricing(e.result, { urgency, certified, targetLanguage, domain }) }
          : e
      )
    );
  };

  // ───────── totals ─────────
  const completed = entries.filter((e) => e.result);
  const totalWords = completed.reduce((s, e) => s + (e.result?.wordCount ?? 0), 0);
  const totalPages = completed.reduce((s, e) => s + (e.result?.estimatedPages ?? 0), 0);
  const totalPrice = completed.reduce((s, e) => s + (e.result?.estimatedPriceSar ?? 0), 0);

  // ───────── render ─────────
  return (
    <div className="space-y-4" dir="rtl">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-3">
            <FileSearch className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium">ارفع ملفات الترجمة لتحليلها بدقة</p>
          <p className="text-xs text-muted-foreground">PDF / DOCX / TXT — حتى 50 ميجابايت لكل ملف</p>
        </div>
      </div>

      {/* Summary bar */}
      {completed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2 rounded-xl border bg-muted/30 p-3"
        >
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">إجمالي الكلمات</p>
            <p className="text-base font-bold text-primary">{totalWords.toLocaleString('ar-SA')}</p>
          </div>
          <div className="text-center border-x">
            <p className="text-[10px] text-muted-foreground">الصفحات التقديرية</p>
            <p className="text-base font-bold">{totalPages}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">السعر التقديري</p>
            <p className="text-base font-bold text-primary">{totalPrice.toLocaleString('ar-SA')} ر.س</p>
          </div>
        </motion.div>
      )}

      {/* Pending guard */}
      {completed.length > 0 && (
        <Alert className="border-amber-500/30 bg-amber-500/5">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-xs">
            هذا السعر <strong>تقديري</strong> ولا يُعتمد إلا بعد مراجعة الإدارة.
          </AlertDescription>
        </Alert>
      )}

      {/* File cards */}
      <AnimatePresence>
        {entries.map((entry) => (
          <FileAnalysisCard
            key={entry.id}
            entry={entry}
            onRemove={() => removeEntry(entry.id)}
            onReanalyze={() => reanalyze(entry.id)}
            onDomainChange={(d) => changeDomain(entry.id, d)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────

const confidenceColor = (c: 'high' | 'medium' | 'low') =>
  c === 'high' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30'
    : c === 'medium' ? 'text-amber-600 bg-amber-500/10 border-amber-500/30'
    : 'text-rose-600 bg-rose-500/10 border-rose-500/30';

const FileAnalysisCard: React.FC<{
  entry: FileEntry;
  onRemove: () => void;
  onReanalyze: () => void;
  onDomainChange: (d: Domain) => void;
}> = ({ entry, onRemove, onReanalyze, onDomainChange }) => {
  const r = entry.result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border bg-card p-3 sm:p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <FileType2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{entry.file.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {(entry.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {r && !entry.loading && (
            <Button size="icon" variant="ghost" onClick={onReanalyze} className="h-7 w-7" title="إعادة التحليل">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={onRemove} className="h-7 w-7" title="إزالة">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {entry.loading && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              {entry.progress < 15 ? 'تحضير...' : entry.progress < 95 ? 'استخراج النص وتحليله...' : 'الإنهاء...'}
            </span>
            <span className="text-muted-foreground">{entry.progress}%</span>
          </div>
          <Progress value={entry.progress} className="h-1.5" />
        </div>
      )}

      {entry.error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{entry.error}</AlertDescription>
        </Alert>
      )}

      {r && !entry.loading && (
        <div className="space-y-3">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            <Stat icon={Hash} label="الكلمات" value={r.wordCount.toLocaleString('ar-SA')} highlight />
            <Stat icon={FileText} label="الصفحات" value={`${r.estimatedPages} (${r.wordsPerPageStandard}/ص)`} />
            <Stat icon={Languages} label="اللغة" value={LANGUAGE_LABELS_AR[r.language]} />
            <Stat icon={Brain} label="الأحرف" value={r.characterCount.toLocaleString('ar-SA')} />
          </div>

          {/* Domain selector */}
          <div className="rounded-lg border bg-muted/30 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <Tag className="h-3.5 w-3.5 text-primary" />
                مجال الترجمة
              </span>
              <Badge variant="outline" className="text-[10px] gap-1">
                {r.domainSource === 'ai' ? <><Sparkles className="h-2.5 w-2.5" /> اقتراح AI</>
                  : r.domainSource === 'manual' ? 'يدوي'
                  : 'تلقائي'}
                {' · '}{Math.round(r.domainConfidence)}%
              </Badge>
            </div>
            <Select value={r.domain} onValueChange={(v) => onDomainChange(v as Domain)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(DOMAIN_LABELS_AR) as Domain[]).map((d) => (
                  <SelectItem key={d} value={d} className="text-xs">{DOMAIN_LABELS_AR[d]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">السعر التقديري للترجمة</span>
              <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 text-[10px]">
                بانتظار الاعتماد
              </Badge>
            </div>
            <p className="text-2xl font-extrabold text-primary mt-1">
              {r.estimatedPriceSar.toLocaleString('ar-SA')} <span className="text-sm font-normal">ر.س</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {r.perWordRateSar} ر.س/كلمة × معامل المجال {r.domainMultiplier}× × استعجال {r.urgencyMultiplier}×
            </p>
          </div>

          {/* Confidence */}
          <div className={`flex items-center gap-2 rounded-lg border p-2 ${confidenceColor(r.confidenceLevel)}`}>
            <Gauge className="h-4 w-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">
                مستوى ثقة التحليل: {CONFIDENCE_LABELS_AR[r.confidenceLevel]}
                {r.isFallback && ' · (تقديري — تعذّر استخراج النص)'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {r.analysisNotes.length > 0 && (
            <details className="rounded-lg border bg-muted/20 p-2 text-xs">
              <summary className="cursor-pointer font-medium flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> ملاحظات التحليل ({r.analysisNotes.length})
              </summary>
              <ul className="mt-2 space-y-1 pr-4 list-disc text-muted-foreground">
                {r.analysisNotes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </details>
          )}

          {/* Sample */}
          {r.textSample && (
            <details className="rounded-lg border bg-muted/20 p-2 text-xs">
              <summary className="cursor-pointer font-medium flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> عينة من النص المستخرج
              </summary>
              <p className="mt-2 text-muted-foreground leading-relaxed line-clamp-4">{r.textSample}</p>
            </details>
          )}
        </div>
      )}
    </motion.div>
  );
};

const Stat: React.FC<{ icon: any; label: string; value: string; highlight?: boolean }> = ({
  icon: Icon, label, value, highlight,
}) => (
  <div className={`rounded-lg border p-2 ${highlight ? 'bg-primary/5 border-primary/30' : 'bg-muted/20'}`}>
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
    <p className={`text-sm font-bold mt-0.5 ${highlight ? 'text-primary' : ''}`}>{value}</p>
  </div>
);

export default TranslationAnalysisEngine;
