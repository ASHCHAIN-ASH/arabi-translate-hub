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
  CheckCircle2, FileText, Send, Sparkles, ClipboardList, Paperclip, Eye,
  Calculator, Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { cn } from '@/lib/utils';
import DynamicServiceFields from '@/components/client/DynamicServiceFields';
import {
  getFieldsConfig, getFieldLabel, getOptionLabel, URGENCY_MULTIPLIER, resolveServiceFields,
} from '@/config/serviceFieldsConfig';

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
  { id: 0, title: 'الخدمة', icon: Sparkles },
  { id: 1, title: 'التفاصيل', icon: ClipboardList },
  { id: 2, title: 'المرفقات', icon: Paperclip },
  { id: 3, title: 'المراجعة', icon: Eye },
] as const;

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

  const fieldsConfig = useMemo(
    () => resolveServiceFields(service ?? undefined, service?.category_slug),
    [service]
  );

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
        .select('id, name, name_ar, description, price, unit, category_id, service_categories(slug, name_ar)')
        .eq('id', serviceId).single();
      if (error || !data) { toast.error('الخدمة غير موجودة'); navigate('/client-services'); return; }
      const cat = (data as any).service_categories;
      setService({
        id: data.id, name: data.name, name_ar: data.name_ar,
        description: data.description, price: data.price, unit: data.unit,
        category_id: data.category_id,
        category_slug: cat?.slug ?? null,
        category_name: cat?.name_ar ?? null,
      });
    } catch (e) { console.error(e); navigate('/client-services'); }
    finally { setLoadingData(false); }
  };

  // ---------- Price estimation ----------
  const estimatedPrice = useMemo(() => {
    if (!service?.price) return 0;
    const base = Number(service.price) * (Number(quantity) || 0);
    const urgency = dynamicValues.urgency as string | undefined;
    const mult = urgency ? (URGENCY_MULTIPLIER[urgency] ?? 1) : 1;
    return Math.round(base * mult * 100) / 100;
  }, [service?.price, quantity, dynamicValues.urgency]);

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

  const handleSubmit = async () => {
    if (!service) return;
    if (!user) return toast.error('يرجى تسجيل الدخول أولاً');

    setLoading(true);
    setUploadProgress(0);
    try {
      const language = dynamicValues.language || dynamicValues.target_language || null;
      const { data, error } = await supabase.from('service_orders').insert({
        user_id: user.id,
        service_id: service.id,
        service_name: service.name_ar || service.name,
        total_amount: 0,
        paid_amount: 0,
        estimated_amount: estimatedPrice || null,
        quantity: quantity || null,
        quantity_unit: fieldsConfig.quantityUnitLabel,
        preferred_language: language,
        metadata: {
          ...dynamicValues,
          category_slug: service.category_slug,
          base_unit_price: service.price,
        },
        current_status: 'pending', priority: 'normal',
        notes: notes || null,
      } as any).select('id, tracking_id').single();
      if (error) throw error;

      setTrackingId(data?.tracking_id || '');
      setSubmitted(true);
      toast.success('تم إنشاء الطلب بنجاح');

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
            <Card className="border-0 bg-gradient-to-br from-emerald-50 via-background to-primary/5 shadow-2xl overflow-hidden">
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                  className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
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
                {estimatedPrice > 0 && (
                  <div className="my-3 text-sm">
                    <span className="text-muted-foreground">السعر التقديري: </span>
                    <span className="font-bold text-primary">{estimatedPrice.toLocaleString()} ر.س</span>
                    <p className="text-xs text-muted-foreground mt-1">السعر النهائي سيُؤكَّد من الإدارة</p>
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

  return (
    <ClientLayout>
      <div className="p-4 sm:p-6 lg:p-8 relative" dir="rtl">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                طلب خدمة جديدة
              </h1>
              <p className="text-muted-foreground text-sm mt-1">أكمل الخطوات الأربع لإرسال طلبك</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/client-services')}>
              <ArrowRight className="w-4 h-4 me-1" /> رجوع
            </Button>
          </motion.div>

          {/* Stepper */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border bg-card/60 backdrop-blur-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = step === s.id;
                const done = step > s.id;
                return (
                  <React.Fragment key={s.id}>
                    <button type="button" onClick={() => done && setStep(s.id as Step)}
                      className={cn('flex flex-col items-center gap-2 flex-shrink-0 transition-all', done && 'cursor-pointer')}>
                      <div className={cn(
                        'relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300',
                        active && 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 scale-110',
                        done && 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
                        !active && !done && 'bg-muted text-muted-foreground',
                      )}>
                        {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        {active && (
                          <motion.div className="absolute inset-0 rounded-2xl border-2 border-primary"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }} />
                        )}
                      </div>
                      <div className="text-center hidden sm:block">
                        <div className={cn('text-sm font-semibold', active ? 'text-primary' : 'text-foreground')}>
                          {s.title}
                        </div>
                      </div>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-l from-primary to-accent"
                          initial={{ width: '0%' }}
                          animate={{ width: step > s.id ? '100%' : '0%' }}
                          transition={{ duration: 0.4 }} />
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
                <div className="h-1 bg-gradient-to-l from-primary via-accent to-primary" />
                <CardContent className="p-6 sm:p-8 space-y-6">

                  {/* STEP 0 — Service */}
                  {step === 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">الخدمة المختارة</h3>
                          <p className="text-xs text-muted-foreground">تأكد من تفاصيل الخدمة قبل المتابعة</p>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                            <FileText className="w-7 h-7" />
                          </div>
                          <div className="flex-1">
                            {service?.category_name && (
                              <Badge variant="secondary" className="text-xs mb-2">{service.category_name}</Badge>
                            )}
                            <h4 className="text-xl font-bold text-primary">{service?.name_ar || service?.name}</h4>
                            {service?.description && (
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{service.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-4 flex-wrap">
                              {service?.price ? (
                                <Badge className="text-xs bg-primary/10 text-primary border-primary/30">
                                  ابتداءً من {Number(service.price).toLocaleString()} ر.س / {fieldsConfig.quantityUnitLabel}
                                </Badge>
                              ) : (
                                <Badge className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/30">
                                  السعر بعد المراجعة
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 1 — Details + dynamic fields + quantity */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <ClipboardList className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">تفاصيل الطلب</h3>
                          <p className="text-xs text-muted-foreground">أدخل المعلومات اللازمة لتسعير دقيق</p>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">
                          الكمية ({fieldsConfig.quantityUnitLabel}) <span className="text-destructive">*</span>
                        </Label>
                        <Input type="number" min={1} value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                          className="rounded-xl bg-background/60 max-w-[200px]" />
                      </div>

                      {/* Dynamic fields per category */}
                      <DynamicServiceFields
                        config={fieldsConfig}
                        values={dynamicValues}
                        onChange={(k, v) => setDynamicValues(prev => ({ ...prev, [k]: v }))}
                      />

                      {/* Notes */}
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">
                          وصف وملاحظات إضافية <span className="text-destructive">*</span>
                        </Label>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                          placeholder="أي تفاصيل تخص الموضوع، مراجع، توقعات…"
                          rows={5}
                          className="resize-none rounded-xl bg-background/60" />
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>يفضّل ٥ أحرف على الأقل</span>
                          <span className={cn(notes.length >= 5 && 'text-emerald-600 font-medium')}>
                            {notes.length} حرف
                          </span>
                        </div>
                      </div>

                      {/* Live price estimate */}
                      {estimatedPrice > 0 && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl bg-gradient-to-l from-primary/10 to-accent/10 border border-primary/30 p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                            <Calculator className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">السعر التقديري</p>
                            <p className="text-xl font-bold text-primary">{estimatedPrice.toLocaleString()} ر.س</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">قابل للمراجعة</Badge>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* STEP 2 — Attachments with drag&drop + previews */}
                  {step === 2 && (
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Paperclip className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">المرفقات</h3>
                          <p className="text-xs text-muted-foreground">اسحب الملفات أو اضغط للرفع</p>
                        </div>
                      </div>

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
                            ? 'border-primary bg-primary/10 scale-[1.01]'
                            : 'border-border/60 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary',
                          files.length >= MAX_FILES && 'opacity-50 cursor-not-allowed pointer-events-none',
                        )}
                      >
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="w-7 h-7 text-primary" />
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
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Eye className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">المراجعة النهائية</h3>
                          <p className="text-xs text-muted-foreground">تأكد من البيانات قبل الإرسال</p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-5 space-y-3">
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

                      {/* Final price card */}
                      <div className="rounded-2xl bg-gradient-to-l from-primary to-accent text-primary-foreground p-5 shadow-xl shadow-primary/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs opacity-80">السعر التقديري</p>
                            <p className="text-3xl font-bold mt-1">{estimatedPrice.toLocaleString()} ر.س</p>
                          </div>
                          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Calculator className="w-7 h-7" />
                          </div>
                        </div>
                        <p className="text-xs opacity-80 mt-3">
                          * السعر تقديري وقابل للتعديل بعد مراجعة الإدارة وفحص المرفقات
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
                      <Button onClick={() => canNext() && setStep((s) => (s + 1) as Step)}
                        disabled={!canNext()}
                        className="gap-2 bg-gradient-to-l from-primary to-accent hover:opacity-90">
                        التالي <ArrowLeft className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} disabled={loading}
                        className="gap-2 bg-gradient-to-l from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20 min-w-[160px]" size="lg">
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
      </div>
    </ClientLayout>
  );
};

export default OrderNew;
