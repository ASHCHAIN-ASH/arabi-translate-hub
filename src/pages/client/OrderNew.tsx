import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight, ArrowLeft, ShoppingCart, RefreshCw, Upload, X, File,
  CheckCircle2, FileText, Send, Sparkles, ClipboardList, Paperclip, Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { cn } from '@/lib/utils';

interface ServiceItem {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  price: number | null;
  unit: string | null;
  category_id: string | null;
}

interface UploadedFile {
  file: File;
  id: string;
}

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
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const unitLabels: Record<string, string> = {
  page: 'صفحة', hour: 'ساعة', project: 'مشروع', word: 'كلمة',
};

type Step = 0 | 1 | 2;

const STEPS = [
  { id: 0, title: 'الخدمة', icon: Sparkles, desc: 'تأكيد الخدمة المختارة' },
  { id: 1, title: 'التفاصيل', icon: ClipboardList, desc: 'وصف الطلب' },
  { id: 2, title: 'المرفقات والمراجعة', icon: Eye, desc: 'مرفقات وإرسال' },
] as const;

const OrderNew = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(0);
  const [service, setService] = useState<ServiceItem | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState<string>('');

  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (!serviceId) { navigate('/client-services'); return; }
    loadService(serviceId);
  }, [searchParams]);

  const loadService = async (serviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, name_ar, description, price, unit, category_id')
        .eq('id', serviceId).single();
      if (error || !data) { toast.error('الخدمة غير موجودة'); navigate('/client-services'); return; }
      setService(data);
    } catch (e) {
      console.error(e); navigate('/client-services');
    } finally { setLoadingData(false); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      if (files.length + newFiles.length >= MAX_FILES) {
        toast.error(`الحد الأقصى ${MAX_FILES} ملفات`); break;
      }
      if (file.size > MAX_FILE_SIZE) { toast.error(`"${file.name}" أكبر من 20MB`); continue; }
      if (!ALLOWED_TYPES.includes(file.type)) { toast.error(`نوع "${file.name}" غير مدعوم`); continue; }
      newFiles.push({ file, id: crypto.randomUUID() });
    }
    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  // Parallel upload — much faster than sequential
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
      // 1) Create order — fast path
      const { data, error } = await supabase.from('service_orders').insert({
        user_id: user.id,
        service_id: service.id,
        service_name: service.name_ar || service.name,
        total_amount: 0, paid_amount: 0,
        current_status: 'pending', priority: 'normal',
        notes: notes || null,
      }).select('id, tracking_id').single();
      if (error) throw error;

      setTrackingId(data?.tracking_id || '');
      // 2) Show success immediately
      setSubmitted(true);
      toast.success('تم إنشاء الطلب بنجاح');

      // 3) Upload attachments in background (parallel) — don't block UI
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

  const canNext = () => {
    if (step === 1) return notes.trim().length >= 5;
    return true;
  };

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
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full"
          >
            <Card className="border-0 bg-gradient-to-br from-emerald-50 via-background to-primary/5 shadow-2xl overflow-hidden">
              <div className="relative p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
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
                {files.length > 0 && uploadProgress < 100 && (
                  <div className="my-4 space-y-2">
                    <p className="text-xs text-muted-foreground">جارٍ رفع المرفقات في الخلفية…</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-6">
                  سيتم مراجعة طلبك وإرسال عرض السعر قريباً
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
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
        {/* Decorative background */}
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
              <p className="text-muted-foreground text-sm mt-1">أكمل الخطوات التالية لإرسال طلبك</p>
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
                    <button
                      type="button"
                      onClick={() => done && setStep(s.id as Step)}
                      className={cn(
                        'flex flex-col items-center gap-2 flex-shrink-0 transition-all',
                        done && 'cursor-pointer',
                      )}
                    >
                      <div className={cn(
                        'relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300',
                        active && 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 scale-110',
                        done && 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
                        !active && !done && 'bg-muted text-muted-foreground',
                      )}>
                        {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        {active && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-primary"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
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
                        <motion.div
                          className="h-full bg-gradient-to-l from-primary to-accent"
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
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="border-0 shadow-xl bg-card/70 backdrop-blur-xl overflow-hidden">
                <div className="h-1 bg-gradient-to-l from-primary via-accent to-primary" />
                <CardContent className="p-6 sm:p-8 space-y-6">

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
                            <h4 className="text-xl font-bold text-primary">
                              {service?.name_ar || service?.name}
                            </h4>
                            {service?.description && (
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{service.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-4 flex-wrap">
                              {service?.unit && (
                                <Badge variant="secondary" className="text-xs">
                                  {unitLabels[service.unit] || service.unit}
                                </Badge>
                              )}
                              <Badge className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/15">
                                السعر بعد المراجعة
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <ClipboardList className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">تفاصيل الطلب</h3>
                          <p className="text-xs text-muted-foreground">صف ما تحتاجه بدقة لتسريع التسعير</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          وصف الطلب والملاحظات <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="مثال: عدد الصفحات، اللغة المطلوبة، الموعد المثالي للتسليم، أي تفاصيل تخص الموضوع…"
                          rows={7}
                          className="resize-none rounded-xl bg-background/60 border-border/60 focus-visible:ring-primary"
                        />
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>يفضّل ٥ كلمات على الأقل لإعطاء الإدارة صورة واضحة</span>
                          <span className={cn(notes.length >= 5 && 'text-emerald-600 font-medium')}>
                            {notes.length} حرف
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Paperclip className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">المرفقات والمراجعة</h3>
                            <p className="text-xs text-muted-foreground">أضف الملفات اللازمة وراجع طلبك</p>
                          </div>
                        </div>

                        <input
                          ref={fileInputRef} type="file" multiple
                          accept={ALLOWED_TYPES.join(',')}
                          onChange={handleFileSelect}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={files.length >= MAX_FILES}
                          className={cn(
                            'w-full rounded-2xl border-2 border-dashed p-6 transition-all duration-200',
                            'border-border/60 hover:border-primary hover:bg-primary/5',
                            'flex flex-col items-center gap-2 text-muted-foreground hover:text-primary',
                            files.length >= MAX_FILES && 'opacity-50 cursor-not-allowed',
                          )}
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-primary" />
                          </div>
                          <span className="font-semibold">اضغط لرفع الملفات</span>
                          <span className="text-xs">PDF, Word, Excel, PowerPoint, صور — حد ٢٠MB للملف</span>
                          <span className="text-xs font-mono mt-1">{files.length}/{MAX_FILES}</span>
                        </button>

                        <AnimatePresence>
                          {files.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                              {files.map((f) => (
                                <motion.div
                                  key={f.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  className="flex items-center gap-3 p-3 bg-muted/40 hover:bg-muted/60 rounded-xl border border-border/40 transition-colors"
                                >
                                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <File className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{f.file.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatFileSize(f.file.size)}</p>
                                  </div>
                                  <Button
                                    variant="ghost" size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeFile(f.id)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Summary */}
                      <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-5">
                        <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                          <Eye className="w-4 h-4" /> مراجعة الطلب
                        </h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between gap-2">
                            <dt className="text-muted-foreground">الخدمة</dt>
                            <dd className="font-semibold text-end">{service?.name_ar || service?.name}</dd>
                          </div>
                          <div className="flex justify-between gap-2">
                            <dt className="text-muted-foreground">المرفقات</dt>
                            <dd className="font-semibold">{files.length} ملف</dd>
                          </div>
                          <div className="flex justify-between gap-2">
                            <dt className="text-muted-foreground">الحالة</dt>
                            <dd><Badge variant="secondary">بانتظار التسعير</Badge></dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <Button
                      variant="outline"
                      disabled={step === 0 || loading}
                      onClick={() => setStep((s) => (s - 1) as Step)}
                      className="gap-2"
                    >
                      <ArrowRight className="w-4 h-4" /> السابق
                    </Button>

                    {step < 2 ? (
                      <Button
                        onClick={() => canNext() && setStep((s) => (s + 1) as Step)}
                        disabled={!canNext()}
                        className="gap-2 bg-gradient-to-l from-primary to-accent hover:opacity-90"
                      >
                        التالي <ArrowLeft className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="gap-2 bg-gradient-to-l from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20 min-w-[160px]"
                        size="lg"
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
      </div>
    </ClientLayout>
  );
};

export default OrderNew;
