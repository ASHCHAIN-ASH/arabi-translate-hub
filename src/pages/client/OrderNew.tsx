import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight, ArrowLeft, ShoppingCart, RefreshCw, Upload, X, File,
  CheckCircle2, Send, Sparkles, ClipboardList, Paperclip, Eye,
  Image as ImageIcon, Clock, Hash, AlertCircle, HelpCircle, PlayCircle,
  Info, FileText, Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { cn } from '@/lib/utils';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import DynamicServiceFields from '@/components/client/DynamicServiceFields';
import TranslationAnalysisEngine, { type AnalysisSummary } from '@/components/client/TranslationAnalysisEngine';
import CategoryHero from '@/components/client/order-new/CategoryHero';
import CategoryGuideCard from '@/components/client/order-new/CategoryGuideCard';
import ExamplePrompts from '@/components/client/order-new/ExamplePrompts';
import OnboardingTour, { type TourStep } from '@/components/client/order-new/OnboardingTour';
import { getCategoryTheme } from '@/config/categoryThemes';
import {
  getFieldLabel, getOptionLabel, resolveServiceFields,
} from '@/config/serviceFieldsConfig';
import { getServiceTemplate, flattenTemplateFields } from '@/config/serviceFormTemplates';

interface ServiceItem {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  price: number | null;
  unit: string | null;
  category_id: string | null;
  category_slug?: string | null;
  category_name?: string | null;
  dynamic_fields?: any[];
  quantity_unit_label?: string | null;
  default_quantity?: number | null;
}

interface UploadedFile { file: File; id: string; preview?: string }

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg', 'image/png', 'image/webp',
  'text/plain',
];

const formatFileSize = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

type Step = 0 | 1 | 2 | 3;
const STEPS = [
  { id: 0, title: 'الخدمة', shortTitle: 'الخدمة', icon: Sparkles, hint: 'تأكيد الخدمة المختارة من القائمة' },
  { id: 1, title: 'التفاصيل', shortTitle: 'التفاصيل', icon: ClipboardList, hint: 'الكمية وملاحظاتك التفصيلية للفريق' },
  { id: 2, title: 'المرفقات', shortTitle: 'الملفات', icon: Paperclip, hint: 'ارفع الملفات (اختياري — يُسرّع التسعير)' },
  { id: 3, title: 'المراجعة', shortTitle: 'المراجعة', icon: Eye, hint: 'مراجعة نهائية قبل الإرسال' },
] as const;

const TOUR_STEPS: TourStep[] = [
  {
    icon: Compass,
    title: 'مرحباً بك في إنشاء الطلب 👋',
    description: 'سنرشدك خطوة بخطوة في 4 خطوات بسيطة: تأكيد الخدمة، إدخال التفاصيل، رفع المرفقات، ثم المراجعة والإرسال.',
  },
  {
    icon: ClipboardList,
    title: 'كلما زادت التفاصيل، تحسّن السعر',
    description: 'كلما كان وصفك أدق وأشمل، استطاع الفريق إعداد عرض سعر أكثر دقة وتسليم أسرع. استعن بالأمثلة الجاهزة كنقطة بداية.',
  },
  {
    icon: Paperclip,
    title: 'رفع الملفات يُسرّع التسعير',
    description: 'لطلبات الترجمة، يقوم محرك التحليل تلقائياً بقراءة ملفك وحساب الكلمات والصفحات وتقدير السعر فوراً.',
  },
  {
    icon: CheckCircle2,
    title: 'مراجعة قبل الإرسال',
    description: 'في الخطوة الأخيرة ستجد ملخصاً كاملاً لطلبك. راجعه ثم اضغط "إرسال" — وستصلك حالة طلبك عبر الإشعارات.',
  },
];

const OrderNew = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(0);
  const [service, setService] = useState<ServiceItem | null>(null);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState<string>('');
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);
  // Legacy shape used by guards & DB write — derived from analysisSummary
  const wordCountData = useMemo(() => {
    if (!analysisSummary) return null;
    return {
      totalWords: analysisSummary.totalWords,
      totalPages: analysisSummary.totalPages,
      estimatedPriceSar: analysisSummary.estimatedPriceSar,
      files: analysisSummary.files.map((f) => ({ name: f.fileName, words: f.wordCount })),
      pendingCount: analysisSummary.pendingCount,
      errorCount: analysisSummary.errorCount,
      totalFiles: analysisSummary.totalFiles,
    };
  }, [analysisSummary]);

  // Detect translation services so we render the word counter widget.
  const isTranslationService = useMemo(() => {
    const name = (service?.name_ar || service?.name || '').toLowerCase();
    const cat = (service?.category_slug || service?.category_name || '').toLowerCase();
    return /ترجم|translat/i.test(name) || /ترجم|translat/i.test(cat);
  }, [service]);

  // Service-specific template (per-service sections + fields). When present, takes priority.
  const template = useMemo(
    () => getServiceTemplate(service?.id, service?.name_ar || service?.name),
    [service?.id, service?.name_ar, service?.name]
  );

  const fieldsConfig = useMemo(() => {
    const base = resolveServiceFields(service ?? undefined, service?.category_slug);
    if (!template) return base;
    // Override with template's flattened fields so validation + review still work.
    return {
      quantityUnitLabel: template.quantityUnitLabel,
      defaultQuantity: template.defaultQuantity,
      fields: flattenTemplateFields(template),
    };
  }, [service, template]);

  // Theme drives the entire visual identity of the wizard for this category.
  const theme = useMemo(() => getCategoryTheme(service?.category_slug), [service?.category_slug]);

  // Pre-fill defaults when service loads
  useEffect(() => {
    if (service) setQuantity(fieldsConfig.defaultQuantity);
  }, [service, fieldsConfig.defaultQuantity]);

  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (!serviceId) { navigate('/client-services'); return; }
    loadService(serviceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadService = async (serviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, name_ar, description, price, unit, category_id, dynamic_fields, quantity_unit_label, default_quantity')
        .eq('id', serviceId)
        .maybeSingle();
      if (error) { console.error('loadService error:', error); }
      if (!data) {
        toast.error('الخدمة غير موجودة');
        navigate('/client-services');
        return;
      }

      // Fetch category info separately (non-blocking)
      let categorySlug: string | null = null;
      let categoryName: string | null = null;
      if (data.category_id) {
        const { data: cat } = await supabase
          .from('service_categories')
          .select('slug, name_ar')
          .eq('id', data.category_id)
          .maybeSingle();
        categorySlug = cat?.slug ?? null;
        categoryName = cat?.name_ar ?? null;
      }

      setService({
        id: data.id, name: data.name, name_ar: data.name_ar,
        description: data.description, price: data.price, unit: data.unit,
        category_id: data.category_id,
        category_slug: categorySlug,
        category_name: categoryName,
        dynamic_fields: Array.isArray((data as any).dynamic_fields) ? (data as any).dynamic_fields : [],
        quantity_unit_label: (data as any).quantity_unit_label ?? null,
        default_quantity: (data as any).default_quantity ?? null,
      });
    } catch (e) {
      console.error('loadService exception:', e);
      toast.error('حدث خطأ أثناء تحميل الخدمة');
      navigate('/client-services');
    }
    finally { setLoadingData(false); }
  };

  // ---------- Files ----------
  const acceptFiles = useCallback((selected: FileList | File[]) => {
    const newFiles: UploadedFile[] = [];
    const arr = Array.from(selected);
    for (const file of arr) {
      if (files.length + newFiles.length >= MAX_FILES) {
        toast.error(`الحد الأقصى ${MAX_FILES} ملفات`); break;
      }
      if (file.size > MAX_FILE_SIZE) { toast.error(`"${file.name}" أكبر من 20MB`); continue; }
      if (!ALLOWED_TYPES.includes(file.type)) { toast.error(`نوع "${file.name}" غير مدعوم`); continue; }
      const item: UploadedFile = { file, id: crypto.randomUUID() };
      if (file.type.startsWith('image/')) item.preview = URL.createObjectURL(file);
      newFiles.push(item);
    }
    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) acceptFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => setFiles(prev => {
    const f = prev.find(x => x.id === id);
    if (f?.preview) URL.revokeObjectURL(f.preview);
    return prev.filter(x => x.id !== id);
  });

  // Cleanup previews
  useEffect(() => () => { files.forEach(f => f.preview && URL.revokeObjectURL(f.preview)); }, []); // eslint-disable-line

  // ---------- Submit ----------
  const uploadFilesParallel = async (orderId: string, userId: string) => {
    if (files.length === 0) return;
    let done = 0;
    const total = files.length;
    const results = await Promise.all(files.map(async ({ file }) => {
      const ext = file.name.split('.').pop();
      const path = `${userId}/${orderId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from('order-attachments').upload(path, file);
      done++;
      setUploadProgress(Math.round((done / total) * 100));
      if (error) { console.error(error); return null; }
      return {
        order_id: orderId, user_id: userId, file_name: file.name,
        file_size: file.size, file_type: file.type, storage_path: path,
      };
    }));
    const attachments = results.filter(Boolean);
    if (attachments.length > 0) {
      await supabase.from('order_attachments' as any).insert(attachments as any);
    }
  };

  /**
   * Validates the translation word-count step before submission.
   * Returns null on success, or a user-facing reason string blocking submit.
   */
  const translationGuardReason = useMemo<string | null>(() => {
    if (!isTranslationService) return null;
    if (!wordCountData || wordCountData.totalFiles === 0) {
      return 'لإكمال طلب الترجمة، يجب رفع الملف وحساب عدد كلماته أولاً.';
    }
    if (wordCountData.pendingCount > 0) {
      return `لا يزال هناك ${wordCountData.pendingCount} ملف قيد التحليل — انتظر اكتمال الحساب قبل الإرسال.`;
    }
    if (wordCountData.errorCount > 0) {
      return `تعذّر تحليل ${wordCountData.errorCount} ملف. يرجى إعادة الحساب أو إزالة الملفات التالفة قبل الإرسال.`;
    }
    if (wordCountData.totalWords <= 0) {
      return 'لم يتم استخراج أي كلمات من الملفات المرفوعة. تأكد أن الملف نصي وليس صورة ممسوحة.';
    }
    return null;
  }, [isTranslationService, wordCountData]);

  const handleSubmit = async () => {
    if (!service) return;
    if (!user) return toast.error('يرجى تسجيل الدخول أولاً');

    // Block translation orders that don't have a completed word count
    if (translationGuardReason) {
      toast.error(translationGuardReason);
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    try {
      const language = dynamicValues.language || dynamicValues.target_language || null;
      const hasWordAnalysis = !!wordCountData && wordCountData.totalWords > 0;
      const { data, error } = await supabase.from('service_orders').insert({
        user_id: user.id,
        service_id: service.id,
        service_name: service.name_ar || service.name,
        total_amount: 0,
        paid_amount: 0,
        // estimated_amount intentionally omitted — pricing handled by admin after review
        quantity: quantity || null,
        quantity_unit: fieldsConfig.quantityUnitLabel,
        preferred_language: language,
        // Price approval workflow — auto-trigger when client uploaded files & got an estimate
        price_approval_status: hasWordAnalysis ? 'pending' : 'not_requested',
        client_estimated_price: hasWordAnalysis ? wordCountData!.estimatedPriceSar : null,
        price_approval_requested_at: hasWordAnalysis ? new Date().toISOString() : null,
        metadata: {
          ...dynamicValues,
          category_slug: service.category_slug,
          base_unit_price: service.price,
          ...(wordCountData ? {
            word_count_analysis: {
              total_words: wordCountData.totalWords,
              total_pages: wordCountData.totalPages,
              estimated_price_sar: wordCountData.estimatedPriceSar,
              files: wordCountData.files,
              note: 'سعر تقديري مبدئي - السعر النهائي يحدد بعد مراجعة الإدارة',
              calculated_at: new Date().toISOString(),
            },
          } : {}),
        },
        current_status: 'pending', priority: 'normal',
        notes: notes || null,
      } as any).select('id, tracking_id').single();
      if (error) throw error;


      setTrackingId(data?.tracking_id || '');
      setSubmitted(true);
      toast.success('تم إنشاء الطلب بنجاح');

      // Persist per-file translation analyses (non-blocking)
      if (analysisSummary && analysisSummary.files.length > 0 && data?.id) {
        const rows = analysisSummary.files.map((f) => ({
          service_order_id: data.id,
          user_id: user.id,
          file_name: f.fileName,
          file_type: f.fileType,
          file_size_bytes: f.fileSizeBytes,
          word_count: f.wordCount,
          character_count: f.characterCount,
          estimated_pages: f.estimatedPages,
          words_per_page_standard: f.wordsPerPageStandard,
          detected_language: f.language,
          arabic_ratio: f.arabicRatio,
          english_ratio: f.englishRatio,
          domain: f.domain,
          domain_source: f.domainSource === 'heuristic' ? 'manual' : f.domainSource,
          domain_confidence: f.domainConfidence,
          estimated_price_sar: f.estimatedPriceSar,
          per_word_rate_sar: f.perWordRateSar,
          urgency_multiplier: f.urgencyMultiplier,
          domain_multiplier: f.domainMultiplier,
          confidence_level: f.confidenceLevel,
          analysis_method: f.analysisMethod,
          is_fallback: f.isFallback,
          analysis_notes: f.analysisNotes.join(' • '),
          text_sample: f.textSample,
        }));
        supabase.from('translation_file_analyses' as any).insert(rows as any)
          .then(({ error: e }) => { if (e) console.error('Failed to save analyses:', e); });
      }

      if (files.length > 0 && data?.id) {
        uploadFilesParallel(data.id, user.id)
          .then(() => toast.success('تم رفع جميع المرفقات'))
          .catch((err) => { console.error(err); toast.error('فشل رفع بعض المرفقات'); });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'خطأ في إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Validation ----------
  const canNext = () => {
    if (step === 1) {
      if (notes.trim().length < 5) return false;
      if (!quantity || quantity < 1) return false;
      const missing = fieldsConfig.fields
        .filter(f => f.required)
        .some(f => !dynamicValues[f.key]);
      return !missing;
    }
    return true;
  };

  // ---------- UI ----------
  if (loadingData) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  if (submitted) {
    return (
      <ClientLayout>
        <div className="p-4 sm:p-6 lg:p-8 min-h-[80vh] flex items-center justify-center" dir="rtl">
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full">
            <Card className={cn(
              'border-0 shadow-2xl overflow-hidden bg-gradient-to-br',
              theme.gradient,
            )}>
              <div className="p-8 text-center bg-card/50 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                  className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">تم إرسال طلبك بنجاح! 🎉</h2>
                <p className="text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">{service?.name_ar || service?.name}</span>
                </p>
                {trackingId && (
                  <div className="my-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs text-muted-foreground">رقم التتبع</span>
                    <span className="font-mono font-bold text-primary">{trackingId}</span>
                  </div>
                )}
                {wordCountData && wordCountData.totalWords > 0 ? (
                  <div className="my-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 p-4 text-sm text-right space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span>طلبك الآن "بانتظار اعتماد السعر"</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      تم إرسال السعر التقديري ({wordCountData.estimatedPriceSar.toLocaleString()} ر.س لـ {wordCountData.totalWords.toLocaleString()} كلمة) للإدارة.
                      ستصلك حالة <strong>"السعر معتمد"</strong> فور المراجعة، وعندها يمكنك الدفع لبدء التنفيذ.
                    </p>
                  </div>
                ) : (
                  <div className="my-4 rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-sm">
                    <Clock className="w-4 h-4 inline-block ms-1 text-amber-600" />
                    <span className="font-medium">سيتم التواصل معك خلال ساعات قليلة لتأكيد عرض السعر النهائي</span>
                  </div>
                )}
                {files.length > 0 && uploadProgress < 100 && (
                  <div className="my-4 space-y-2">
                    <p className="text-xs text-muted-foreground">جارٍ رفع المرفقات في الخلفية…</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                <div className="flex gap-3 justify-center flex-wrap mt-6">
                  <Button onClick={() => navigate('/orders')} className="gap-2">
                    <ShoppingCart className="w-4 h-4" /> سجل الطلبات
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/client-services')}>
                    طلب خدمة أخرى
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </ClientLayout>
    );
  }

  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <ClientLayout>
      <TooltipProvider delayDuration={150}>
        {/* Onboarding tour — auto-shows once per service category */}
        <OnboardingTour
          storageKey={`tour-order-new-${service?.category_slug || 'default'}`}
          steps={TOUR_STEPS}
          accentVar={theme.accent}
          forceOpen={tourOpen}
          onClose={() => setTourOpen(false)}
        />

        <div className="px-3 py-3 sm:p-6 lg:p-8 relative" dir="rtl">
          {/* Ambient background */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 right-1/4 w-[60vw] max-w-md h-[60vw] max-h-md rounded-full blur-3xl opacity-40 sm:opacity-50"
              style={{ background: `hsl(var(--${theme.glow}) / 0.3)` }}
            />
            <div
              className="absolute bottom-0 left-1/4 w-[60vw] max-w-md h-[60vw] max-h-md rounded-full blur-3xl opacity-30 sm:opacity-40"
              style={{ background: `hsl(var(--${theme.accent}) / 0.2)` }}
            />
          </div>

          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/client-services')}
                className="gap-1 -ms-2 sm:ms-0"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="hidden xs:inline">رجوع للخدمات</span>
                <span className="xs:hidden">رجوع</span>
              </Button>

              <div className="flex items-center gap-1.5">
                {/* Step indicator (desktop) */}
                <div className="text-xs text-muted-foreground hidden sm:block me-2">
                  الخطوة <span className="font-bold text-foreground">{step + 1}</span> من {STEPS.length}
                </div>

                {/* Mobile guide trigger */}
                <Sheet open={mobileGuideOpen} onOpenChange={setMobileGuideOpen}>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="lg:hidden h-9 gap-1.5 rounded-full"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="text-xs">دليل</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto" dir="rtl">
                    <SheetHeader className="text-right mb-3">
                      <SheetTitle className="flex items-center gap-2">
                        <Compass className="w-5 h-5" style={{ color: `hsl(var(--${theme.accent}))` }} />
                        دليل الطلب
                      </SheetTitle>
                    </SheetHeader>
                    <CategoryGuideCard theme={theme} />
                  </SheetContent>
                </Sheet>

                {/* Tour trigger */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTourOpen(true)}
                      className="h-9 gap-1.5 rounded-full"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span className="text-xs hidden xs:inline">جولة</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>إعادة تشغيل الجولة التعريفية</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Category-specific Hero */}
            {service && (
              <CategoryHero
                theme={theme}
                serviceName={service.name_ar || service.name}
                serviceDescription={service.description}
                categoryLabel={service.category_name}
              />
            )}

            {/* Two-column layout: wizard + side guide */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
              {/* MAIN — wizard */}
              <div className="space-y-4 sm:space-y-6 min-w-0">
                {/* Stepper — compact mobile, full desktop */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border/40 bg-card/70 backdrop-blur-xl p-3 sm:p-5 shadow-sm">

                  {/* Mobile: clean linear progress + active step pill */}
                  <div className="sm:hidden space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: `hsl(var(--${theme.accent}))`,
                            boxShadow: `0 6px 16px hsl(var(--${theme.accent}) / 0.35)`,
                          }}
                        >
                          {React.createElement(STEPS[step].icon, { className: 'w-4 h-4 text-white' })}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] text-muted-foreground leading-tight">الخطوة {step + 1}/{STEPS.length}</div>
                          <div className="text-sm font-bold truncate leading-tight">{STEPS[step].title}</div>
                        </div>
                      </div>
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: `hsl(var(--${theme.accent}))` }}
                      >
                        {progressPct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, hsl(var(--${theme.accent})), hsl(var(--${theme.glow})))`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    {/* Tappable mini-dots for completed steps */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        const active = step === s.id;
                        const done = step > s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => done && setStep(s.id as Step)}
                            className={cn(
                              'flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-colors',
                              done && 'cursor-pointer hover:bg-muted/50',
                              !done && !active && 'opacity-50',
                            )}
                          >
                            <div
                              className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center text-xs',
                                active && 'text-white',
                                done && 'bg-emerald-500 text-white',
                                !active && !done && 'bg-muted text-muted-foreground',
                              )}
                              style={active ? { background: `hsl(var(--${theme.accent}))` } : undefined}
                            >
                              {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                            </div>
                            <span className={cn(
                              'text-[10px] leading-none font-medium',
                              active ? 'text-foreground' : 'text-muted-foreground',
                            )}>
                              {s.shortTitle}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desktop: full horizontal stepper */}
                  <div className="hidden sm:flex items-center justify-between gap-3 lg:gap-4">
                    {STEPS.map((s, i) => {
                      const Icon = s.icon;
                      const active = step === s.id;
                      const done = step > s.id;
                      return (
                        <React.Fragment key={s.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => done && setStep(s.id as Step)}
                                className={cn(
                                  'flex flex-col items-center gap-2 flex-shrink-0 transition-all rounded-xl p-1',
                                  done && 'cursor-pointer hover:bg-muted/40',
                                )}
                              >
                                <div
                                  className={cn(
                                    'relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300',
                                    !active && !done && 'bg-muted text-muted-foreground',
                                    done && 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
                                  )}
                                  style={active ? {
                                    background: `hsl(var(--${theme.accent}))`,
                                    color: 'white',
                                    boxShadow: `0 8px 24px hsl(var(--${theme.accent}) / 0.4)`,
                                    transform: 'scale(1.08)',
                                  } : undefined}
                                >
                                  {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                  {active && (
                                    <motion.div
                                      className="absolute inset-0 rounded-2xl border-2"
                                      style={{ borderColor: `hsl(var(--${theme.accent}))` }}
                                      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    />
                                  )}
                                </div>
                                <div className="text-center">
                                  <div className={cn('text-sm font-semibold', active ? 'text-foreground' : 'text-muted-foreground')}>
                                    {s.title}
                                  </div>
                                </div>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>{s.hint}</TooltipContent>
                          </Tooltip>
                          {i < STEPS.length - 1 && (
                            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                              <motion.div
                                className="h-full"
                                style={{ background: `hsl(var(--${theme.accent}))` }}
                                initial={{ width: '0%' }}
                                animate={{ width: step > s.id ? '100%' : '0%' }}
                                transition={{ duration: 0.4 }}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </motion.div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                  <Card className="border-0 shadow-xl bg-card/70 backdrop-blur-xl overflow-hidden">
                    <div
                      className="h-1"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--${theme.accent})), hsl(var(--${theme.glow})), hsl(var(--${theme.accent})))`,
                      }}
                    />
                    <CardContent className="p-6 sm:p-8 space-y-6">

                      {/* STEP 0 — Confirm service */}
                      {step === 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `hsl(var(--${theme.accent}) / 0.12)` }}
                            >
                              <Sparkles className="w-5 h-5" style={{ color: `hsl(var(--${theme.accent}))` }} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">تأكيد الخدمة المختارة</h3>
                              <p className="text-xs text-muted-foreground">راجع المعلومات أدناه ثم انتقل للتفاصيل</p>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-border/40 bg-muted/30 p-5">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground mb-1">الخدمة</p>
                                <p className="font-bold text-base">{service?.name_ar || service?.name}</p>
                              </div>
                              {service?.category_name && (
                                <Badge variant="secondary" className="text-xs">{service.category_name}</Badge>
                              )}
                            </div>
                          </div>

                          {/* Pricing message — replaces approximate price */}
                          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">سيتم تحديد السعر بعد المراجعة</p>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                نراجع طلبك ومرفقاتك بعناية، ثم نُرسل لك عرض سعر دقيق ومدّة تنفيذ مناسبة — عادةً خلال ساعات قليلة.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STEP 1 — Details + dynamic fields + quantity */}
                      {step === 1 && (
                        <div className="space-y-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `hsl(var(--${theme.accent}) / 0.12)` }}
                            >
                              <ClipboardList className="w-5 h-5" style={{ color: `hsl(var(--${theme.accent}))` }} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">تفاصيل الطلب</h3>
                              <p className="text-xs text-muted-foreground">كلما زادت دقّة المعلومات، كان عرض السعر أدق</p>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div>
                            <Label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                              <Hash className="w-3.5 h-3.5" style={{ color: `hsl(var(--${theme.accent}))` }} />
                              <span>الكمية ({fieldsConfig.quantityUnitLabel})</span>
                              <span className="text-destructive">*</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[240px] text-xs">
                                  حدّد العدد المطلوب بوحدة <span className="font-bold">{fieldsConfig.quantityUnitLabel}</span>. يساعدنا هذا في تقدير الجهد والمدة بدقة.
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <Input type="number" min={1} value={quantity}
                              onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                              className="rounded-xl bg-background/60 max-w-[200px]" />
                          </div>

                          {/* Dynamic fields per service — themed, sectioned when template available */}
                          <DynamicServiceFields
                            config={fieldsConfig}
                            values={dynamicValues}
                            onChange={(k, v) => setDynamicValues(prev => ({ ...prev, [k]: v }))}
                            theme={theme}
                            sections={template?.sections}
                          />

                          {/* Notes with category-tailored placeholder */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                              <ClipboardList className="w-3.5 h-3.5" style={{ color: `hsl(var(--${theme.accent}))` }} />
                              <span>وصف الطلب وملاحظات إضافية</span>
                              <span className="text-destructive">*</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[260px] text-xs leading-relaxed">
                                  اشرح ما تحتاجه بالتفصيل: الهدف، الجمهور المستهدف، أي متطلبات خاصة، ولغة التسليم. كلما زادت التفاصيل، حصلت على عرض سعر ودقّة أعلى.
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                              placeholder={theme.notesPlaceholder}
                              rows={5}
                              className="resize-none rounded-xl bg-background/60" />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>كلّما كان الوصف مفصّلاً، حصلت على نتيجة أفضل</span>
                              <span className={cn(notes.length >= 5 && 'text-emerald-600 font-medium')}>
                                {notes.length} حرف
                              </span>
                            </div>

                            {/* Example prompts (clickable) */}
                            <ExamplePrompts theme={theme} onPick={(t) => setNotes(t)} />
                          </div>
                        </div>
                      )}

                      {/* STEP 2 — Attachments */}
                      {step === 2 && (
                        <div>
                          <div className="flex items-center gap-3 mb-5">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `hsl(var(--${theme.accent}) / 0.12)` }}
                            >
                              <Paperclip className="w-5 h-5" style={{ color: `hsl(var(--${theme.accent}))` }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold flex items-center gap-1.5">
                                المرفقات
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                                      <HelpCircle className="w-3.5 h-3.5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                                    PDF, Word, Excel, PowerPoint, صور — حد ٢٠MB لكل ملف، حتى {MAX_FILES} ملفات. {isTranslationService ? 'سيتم تحليل ملفاتك تلقائياً وحساب الكلمات والصفحات.' : ''}
                                  </TooltipContent>
                                </Tooltip>
                              </h3>
                              <p className="text-xs text-muted-foreground">اسحب الملفات أو اضغط للرفع — اختياري لكن يُسرّع التسعير</p>
                            </div>
                          </div>

                          {/* Translation Analysis Engine — professional per-file analysis */}
                          {isTranslationService && (
                            <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/30 to-teal-50/20 dark:from-emerald-950/10 dark:to-teal-950/5 p-4">
                              <TranslationAnalysisEngine
                                sourceLanguage={dynamicValues.source_language}
                                targetLanguage={dynamicValues.target_language || dynamicValues.language}
                                urgency={dynamicValues.urgency}
                                certified={dynamicValues.certified}
                                onChange={setAnalysisSummary}
                              />
                            </div>
                          )}

                          <input ref={fileInputRef} type="file" multiple
                            accept={ALLOWED_TYPES.join(',')}
                            onChange={handleFileSelect}
                            className="hidden" />

                          <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                              e.preventDefault(); setDragOver(false);
                              if (e.dataTransfer.files.length > 0) acceptFiles(e.dataTransfer.files);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                              'w-full rounded-2xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer',
                              'flex flex-col items-center gap-3',
                              dragOver
                                ? 'scale-[1.01]'
                                : 'border-border/60 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary',
                              files.length >= MAX_FILES && 'opacity-50 cursor-not-allowed pointer-events-none',
                            )}
                            style={dragOver ? {
                              borderColor: `hsl(var(--${theme.accent}))`,
                              background: `hsl(var(--${theme.accent}) / 0.08)`,
                            } : undefined}
                          >
                            <div
                              className="w-14 h-14 rounded-full flex items-center justify-center"
                              style={{ background: `hsl(var(--${theme.accent}) / 0.12)` }}
                            >
                              <Upload className="w-7 h-7" style={{ color: `hsl(var(--${theme.accent}))` }} />
                            </div>
                            <span className="font-semibold">اسحب الملفات هنا أو اضغط للاختيار</span>
                            <span className="text-xs">PDF, Word, Excel, PowerPoint, صور — حد ٢٠MB للملف</span>
                            <span className="text-xs font-mono">{files.length}/{MAX_FILES}</span>
                          </div>

                          <AnimatePresence>
                            {files.length > 0 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {files.map((f) => (
                                  <motion.div key={f.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center gap-3 p-3 bg-muted/40 hover:bg-muted/60 rounded-xl border border-border/40 transition-colors group"
                                  >
                                    {f.preview ? (
                                      <img src={f.preview} alt={f.file.name}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                    ) : (
                                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        {f.file.type.startsWith('image/')
                                          ? <ImageIcon className="w-5 h-5 text-primary" />
                                          : <File className="w-5 h-5 text-primary" />}
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{f.file.name}</p>
                                      <p className="text-xs text-muted-foreground">{formatFileSize(f.file.size)}</p>
                                    </div>
                                    <Button variant="ghost" size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-70 group-hover:opacity-100"
                                      onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* STEP 3 — Review */}
                      {step === 3 && (
                        <div className="space-y-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `hsl(var(--${theme.accent}) / 0.12)` }}
                            >
                              <Eye className="w-5 h-5" style={{ color: `hsl(var(--${theme.accent}))` }} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">المراجعة النهائية</h3>
                              <p className="text-xs text-muted-foreground">تأكد من البيانات قبل الإرسال</p>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-border/40 bg-muted/30 p-5 space-y-3">
                            <div className="flex justify-between gap-2 text-sm">
                              <span className="text-muted-foreground">الخدمة</span>
                              <span className="font-semibold text-end">{service?.name_ar || service?.name}</span>
                            </div>
                            <div className="flex justify-between gap-2 text-sm">
                              <span className="text-muted-foreground">الكمية</span>
                              <span className="font-semibold">{quantity} {fieldsConfig.quantityUnitLabel}</span>
                            </div>

                            {fieldsConfig.fields.map((f) => {
                              const v = dynamicValues[f.key];
                              if (!v) return null;
                              const display = f.type === 'select'
                                ? getOptionLabel(service?.category_slug, f.key, v)
                                : String(v);
                              return (
                                <div key={f.key} className="flex justify-between gap-2 text-sm">
                                  <span className="text-muted-foreground">{getFieldLabel(service?.category_slug, f.key)}</span>
                                  <span className="font-semibold text-end">{display}</span>
                                </div>
                              );
                            })}

                            <div className="flex justify-between gap-2 text-sm">
                              <span className="text-muted-foreground">المرفقات</span>
                              <span className="font-semibold">{files.length} ملف</span>
                            </div>
                          </div>

                          {/* Replaces "approximate price" card */}
                          <div
                            className="rounded-2xl p-5 shadow-xl text-white relative overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, hsl(var(--${theme.accent})), hsl(var(--${theme.glow})))`,
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-7 h-7" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs opacity-90">عرض السعر</p>
                                <p className="text-lg font-bold leading-tight mt-0.5">سيتم تحديده بعد المراجعة</p>
                                <p className="text-xs opacity-90 mt-1.5 leading-relaxed">
                                  ستصلك قيمة السعر النهائية والمدّة المتوقّعة عبر الإشعارات والبريد خلال ساعات.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Submission guard message — only on final step */}
                      {step === 3 && translationGuardReason && (
                        <div
                          role="alert"
                          className="mt-4 rounded-xl border-2 border-destructive/40 bg-destructive/5 p-3 flex items-start gap-3"
                        >
                          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-destructive">
                              لا يمكن إرسال الطلب بعد
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {translationGuardReason}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/40">
                        <Button variant="outline" disabled={step === 0 || loading}
                          onClick={() => setStep((s) => (s - 1) as Step)} className="gap-2">
                          <ArrowRight className="w-4 h-4" /> السابق
                        </Button>

                        {step < 3 ? (
                          <Button
                            onClick={() => canNext() && setStep((s) => (s + 1) as Step)}
                            disabled={!canNext()}
                            className="gap-2 text-white hover:opacity-90"
                            style={{
                              background: `linear-gradient(135deg, hsl(var(--${theme.accent})), hsl(var(--${theme.glow})))`,
                            }}
                          >
                            التالي <ArrowLeft className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            disabled={loading || !!translationGuardReason}
                            size="lg"
                            title={translationGuardReason || undefined}
                            className="gap-2 text-white hover:opacity-90 min-w-[160px] shadow-lg disabled:opacity-50"
                            style={{
                              background: `linear-gradient(135deg, hsl(var(--${theme.accent})), hsl(var(--${theme.glow})))`,
                              boxShadow: `0 8px 24px hsl(var(--${theme.accent}) / 0.4)`,
                            }}
                          >
                            {loading ? (
                              <><RefreshCw className="w-4 h-4 animate-spin" /> جارٍ الإرسال…</>
                            ) : (
                              <><Send className="w-4 h-4" /> إرسال الطلب</>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* SIDE — guide card (sticky on desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-6">
                <CategoryGuideCard theme={theme} />
              </div>
            </aside>
          </div>
        </div>
        </div>
      </TooltipProvider>
    </ClientLayout>
  );
};

export default OrderNew;
