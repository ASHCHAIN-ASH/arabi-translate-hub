import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, XCircle, FileText, RefreshCw, User, Phone, Mail,
  Building2, Wallet, Calendar, AlertCircle, Receipt, Clock, ShieldCheck,
  Banknote, Hash, MapPin, CreditCard, Eye, Download, Loader2, Sparkles,
} from 'lucide-react';
import {
  FINANCING_STATUS_LABELS_AR,
  FINANCING_DOC_LABELS_AR,
} from '@/lib/financing';
import { FINANCING_TEAMS } from '@/lib/financing-bank';
import { sendWhatsApp } from '@/lib/whatsapp';
import { MessageCircle, Send } from 'lucide-react';

// ── WhatsApp helper: notify customer about admin actions ──
const notifyCustomer = async (
  app: any,
  message: string,
  entityId?: string,
) => {
  const phone = app?.applicant_phone;
  if (!phone) return;
  try {
    await sendWhatsApp({
      to: phone,
      message: `مرحباً ${app.applicant_full_name || ''} 👋\n\n${message}\n\nرقم الطلب: #${String(app.id).slice(0, 8).toUpperCase()}\n\nفريق ماستر للتمويل 💼`,
      related_entity_type: 'financing_application',
      related_entity_id: entityId || app.id,
      user_id: app.user_id || undefined,
    });
  } catch (e) {
    console.warn('whatsapp notify failed', e);
  }
};

type Application = any;
type FinancingDocument = {
  id: string;
  application_id: string;
  document_type: string;
  file_url: string;
  file_name: string | null;
  status: string;
  review_note: string | null;
  created_at: string;
};
type PaymentReceipt = {
  id: string;
  application_id: string;
  user_id: string;
  payment_method: 'wallet' | 'bank_transfer';
  amount: number;
  bank_name: string | null;
  reference_number: string | null;
  transfer_date: string | null;
  receipt_file_url: string | null;
  receipt_file_name: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewer_note: string | null;
  created_at: string;
};
type StatusLog = {
  id: string;
  application_id: string;
  from_status: string | null;
  to_status: string;
  note: string | null;
  changed_by: string | null;
  created_at: string;
};

const TIMELINE_STEPS = [
  { key: 'submitted', label: 'تم الإرسال', icon: FileText },
  { key: 'documents_pending', label: 'المستندات', icon: ShieldCheck },
  { key: 'under_review', label: 'مراجعة الائتمان', icon: Sparkles },
  { key: 'contract_pending_signature', label: 'توقيع العقد', icon: CheckCircle2 },
  { key: 'waiting_down_payment', label: 'الدفعة الأولى', icon: Banknote },
  { key: 'active', label: 'نشط', icon: Wallet },
];

const statusVariant = (s: string) => {
  if (['approved', 'active', 'completed'].includes(s)) return 'default';
  if (['rejected', 'cancelled', 'overdue'].includes(s)) return 'destructive';
  return 'secondary';
};

const fmt = (n: number) => Number(n || 0).toLocaleString('en-US');

const STATUS_OPTIONS = [
  'documents_pending',
  'under_review',
  'contract_pending_signature',
  'waiting_down_payment',
  'approved',
  'rejected',
  'cancelled',
];

const FinancingAdminDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState<Application | null>(null);
  const [docs, setDocs] = useState<FinancingDocument[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [logs, setLogs] = useState<StatusLog[]>([]);
  const [adminNote, setAdminNote] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [working, setWorking] = useState(false);

  const reload = async () => {
    if (!id) return;
    const [a, d, r, l] = await Promise.all([
      supabase.from('financing_applications').select('*').eq('id', id).maybeSingle(),
      supabase.from('financing_documents' as any).select('*').eq('application_id', id).order('created_at', { ascending: false }),
      supabase.from('financing_payment_receipts' as any).select('*').eq('application_id', id).order('created_at', { ascending: false }),
      supabase.from('financing_status_logs' as any).select('*').eq('application_id', id).order('created_at', { ascending: true }),
    ]);
    if (a.error || !a.data) {
      toast.error('تعذر تحميل الطلب');
      setLoading(false);
      return;
    }
    setApp(a.data);
    setDocs((d.data as any) || []);
    setReceipts((r.data as any) || []);
    setLogs((l.data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
    if (!id) return;
    const ch = supabase
      .channel(`financing-admin-detail-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_applications', filter: `id=eq.${id}` }, () => reload())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_documents', filter: `application_id=eq.${id}` }, () => reload())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_payment_receipts', filter: `application_id=eq.${id}` }, () => reload())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_status_logs', filter: `application_id=eq.${id}` }, () => reload())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const currentStepIndex = useMemo(() => {
    if (!app) return 0;
    const idx = TIMELINE_STEPS.findIndex(s => s.key === app.status);
    if (app.status === 'approved') return TIMELINE_STEPS.findIndex(s => s.key === 'waiting_down_payment');
    return idx >= 0 ? idx : 0;
  }, [app]);

  const updateStatus = async (toStatus: string) => {
    if (!app) return;
    setWorking(true);
    try {
      const { error } = await supabase
        .from('financing_applications')
        .update({
          status: toStatus as any,
          notes: adminNote
            ? `${app.notes ? app.notes + '\n---\n' : ''}[${format(new Date(), 'yyyy-MM-dd HH:mm')}] ${adminNote}`
            : app.notes,
        })
        .eq('id', app.id);
      if (error) throw error;
      toast.success('تم تحديث الحالة');
      // 📲 Notify customer via WhatsApp
      const statusLabel = FINANCING_STATUS_LABELS_AR[toStatus] || toStatus;
      const noteSuffix = adminNote ? `\n📝 ملاحظة: ${adminNote}` : '';
      await notifyCustomer(
        app,
        `تم تحديث حالة طلب التمويل الخاص بك إلى: *${statusLabel}* ✅${noteSuffix}`,
      );
      setAdminNote('');
      setNewStatus('');
    } catch (e: any) {
      toast.error(e.message || 'فشل التحديث');
    } finally {
      setWorking(false);
    }
  };

  const reviewDoc = async (docId: string, status: 'approved' | 'rejected', note?: string) => {
    const doc = docs.find(d => d.id === docId);
    const { error } = await supabase
      .from('financing_documents' as any)
      .update({ status, review_note: note ?? null, reviewed_at: new Date().toISOString() } as any)
      .eq('id', docId);
    if (error) {
      toast.error('فشل تحديث المستند');
      return;
    }
    toast.success(status === 'approved' ? 'تمت الموافقة على المستند' : 'تم رفض المستند');
    // 📲 Notify customer
    const docLabel = doc ? (FINANCING_DOC_LABELS_AR[doc.document_type] || doc.document_type) : 'وثيقة';
    if (status === 'approved') {
      await notifyCustomer(app, `✅ تم قبول وثيقة *${docLabel}* الخاصة بطلب التمويل.`, docId);
    } else {
      await notifyCustomer(
        app,
        `❌ تم رفض وثيقة *${docLabel}*.${note ? `\nالسبب: ${note}` : ''}\n\nيرجى إعادة رفعها من حسابك.`,
        docId,
      );
    }
  };

  const reviewReceipt = async (rid: string, status: 'approved' | 'rejected') => {
    const receipt = receipts.find(r => r.id === rid);
    const { error } = await supabase
      .from('financing_payment_receipts' as any)
      .update({ status, reviewer_note: adminNote || null } as any)
      .eq('id', rid);
    if (error) {
      toast.error('فشل تحديث الإيصال');
      return;
    }
    toast.success(status === 'approved' ? 'تم اعتماد الإيصال' : 'تم رفض الإيصال');
    // 📲 Notify customer
    const amt = receipt ? `${fmt(receipt.amount)} ر.س` : '';
    if (status === 'approved') {
      await notifyCustomer(
        app,
        `✅ تم اعتماد إيصال الدفع بمبلغ *${amt}* بنجاح.\nسيتم تفعيل خطة التمويل قريباً.`,
        rid,
      );
    } else {
      await notifyCustomer(
        app,
        `❌ تم رفض إيصال الدفع بمبلغ *${amt}*.${adminNote ? `\nالسبب: ${adminNote}` : ''}\n\nيرجى رفع إيصال صحيح من حسابك.`,
        rid,
      );
    }
  };

  // 📲 Send admin note as WhatsApp message directly
  const sendNoteToCustomer = async () => {
    if (!adminNote.trim()) {
      toast.error('اكتب الملاحظة أولاً');
      return;
    }
    setWorking(true);
    await notifyCustomer(app, `📌 رسالة من فريق التمويل:\n\n${adminNote}`);
    toast.success('تم إرسال الملاحظة عبر واتساب');
    setAdminNote('');
    setWorking(false);
  };

  const openFile = async (path: string) => {
    if (!path) return;
    const bucket = path.startsWith('payment-receipts/') ? 'payment-receipts' : 'financing-documents';
    const cleanPath = path.replace(`${bucket}/`, '');
    const { data } = await supabase.storage.from(bucket).createSignedUrl(cleanPath, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
    else toast.error('تعذر فتح الملف');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!app) {
    return (
      <AdminLayout>
        <div className="text-center py-32">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لم يتم العثور على الطلب</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/adminmaster/financing">العودة للقائمة</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        className="space-y-6"
        dir="rtl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/adminmaster/financing')}>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
                <CreditCard className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">طلب تمويل #{app.id.slice(0, 8)}</h1>
                <p className="text-sm text-muted-foreground">
                  {app.applicant_full_name} · {format(new Date(app.created_at), 'yyyy-MM-dd HH:mm')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant(app.status)} className="text-sm px-3 py-1">
                {FINANCING_STATUS_LABELS_AR[app.status] || app.status}
              </Badge>
              <Button size="sm" variant="outline" onClick={reload}>
                <RefreshCw className="w-4 h-4 ml-1" /> تحديث
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <Card className="bg-gradient-to-br from-card to-muted/30 backdrop-blur border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> مسار الطلب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex items-start justify-between gap-2 overflow-x-auto pb-2">
              {TIMELINE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const reached = idx <= currentStepIndex;
                const current = idx === currentStepIndex;
                return (
                  <React.Fragment key={step.key}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      className="flex flex-col items-center gap-2 min-w-[80px] flex-1"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          reached
                            ? 'bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/30'
                            : 'bg-muted text-muted-foreground'
                        } ${current ? 'ring-4 ring-primary/30 scale-110' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs text-center font-medium ${reached ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </motion.div>
                    {idx < TIMELINE_STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 mt-6 min-w-[20px]">
                        <div className={`h-full rounded ${idx < currentStepIndex ? 'bg-gradient-to-l from-primary to-primary/50' : 'bg-muted'}`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> بيانات مقدّم الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow icon={User} label="الاسم الكامل" value={app.applicant_full_name} />
                <InfoRow icon={Hash} label="رقم الهوية" value={app.applicant_id_number} />
                <InfoRow icon={Phone} label="الجوال" value={app.applicant_phone} />
                <InfoRow icon={Mail} label="البريد" value={app.applicant_email || '—'} />
                <InfoRow icon={Building2} label="جهة العمل" value={app.employer_name || '—'} />
                <InfoRow icon={MapPin} label="المدينة" value={app.city || '—'} />
                <InfoRow icon={Wallet} label="الدخل الشهري" value={`${fmt(app.monthly_income || 0)} ر.س`} />
                <InfoRow icon={AlertCircle} label="الالتزامات" value={`${fmt(app.monthly_commitments || 0)} ر.س`} />
              </CardContent>
            </Card>

            {/* Financing */}
            <Card className="bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-primary" /> تفاصيل التمويل
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="المبلغ الكلي" value={`${fmt(app.total_amount)} ر.س`} accent="from-primary/20 to-primary/5" />
                <Stat label="الدفعة الأولى" value={`${fmt(app.down_payment)} ر.س`} accent="from-amber-500/20 to-amber-500/5" />
                <Stat label="المتبقي" value={`${fmt(app.remaining_amount)} ر.س`} accent="from-emerald-500/20 to-emerald-500/5" />
                <Stat label="القسط الشهري" value={`${fmt(app.monthly_installment)} × ${app.duration_months}`} accent="from-blue-500/20 to-blue-500/5" />
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> الوثائق ({docs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {docs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">لا توجد وثائق مرفوعة بعد</p>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {docs.map(d => (
                        <motion.div
                          key={d.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-gradient-to-br from-background to-muted/30"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {FINANCING_DOC_LABELS_AR[d.document_type] || d.document_type}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{d.file_name || '—'}</p>
                            </div>
                          </div>
                          <Badge variant={d.status === 'approved' ? 'default' : d.status === 'rejected' ? 'destructive' : 'secondary'} className="shrink-0">
                            {d.status === 'approved' ? 'موافق' : d.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                          </Badge>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button size="icon" variant="ghost" onClick={() => openFile(d.file_url)} title="عرض">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-emerald-600" onClick={() => reviewDoc(d.id, 'approved')} title="موافقة">
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => reviewDoc(d.id, 'rejected', adminNote)} title="رفض">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Receipts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary" /> إيصالات الدفع ({receipts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {receipts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">لا توجد إيصالات</p>
                ) : (
                  <div className="space-y-3">
                    {receipts.map(r => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-xl bg-gradient-to-br from-background to-muted/30 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                              {r.payment_method === 'wallet' ? <Wallet className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                              {r.payment_method === 'wallet' ? 'محفظة' : 'تحويل بنكي'}
                            </Badge>
                            <span className="font-bold">{fmt(r.amount)} ر.س</span>
                          </div>
                          <Badge variant={r.status === 'approved' ? 'default' : r.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {r.status === 'approved' ? 'مُعتمد' : r.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                          </Badge>
                        </div>
                        {r.payment_method === 'bank_transfer' && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div>البنك: <span className="text-foreground">{r.bank_name || '—'}</span></div>
                            <div>المرجع: <span className="text-foreground">{r.reference_number || '—'}</span></div>
                            <div>التاريخ: <span className="text-foreground">{r.transfer_date || '—'}</span></div>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          {r.receipt_file_url ? (
                            <Button size="sm" variant="outline" onClick={() => openFile(r.receipt_file_url!)}>
                              <Download className="w-4 h-4 ml-1" /> عرض الإيصال
                            </Button>
                          ) : <span className="text-xs text-muted-foreground">لا يوجد ملف مرفق</span>}
                          {r.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => reviewReceipt(r.id, 'approved')}>
                                <CheckCircle2 className="w-4 h-4 ml-1" /> اعتماد
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => reviewReceipt(r.id, 'rejected')}>
                                <XCircle className="w-4 h-4 ml-1" /> رفض
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> إجراءات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">تغيير الحالة</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger><SelectValue placeholder="اختر حالة جديدة" /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(s => (
                        <SelectItem key={s} value={s}>{FINANCING_STATUS_LABELS_AR[s] || s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">ملاحظة (اختياري)</label>
                  <Textarea rows={3} value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="ملاحظة تُسجَّل وتُرسل للعميل…" />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/80"
                  disabled={!newStatus || working}
                  onClick={() => updateStatus(newStatus)}
                >
                  {working ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <CheckCircle2 className="w-4 h-4 ml-1" />}
                  تطبيق التغيير
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                  disabled={!adminNote.trim() || working}
                  onClick={sendNoteToCustomer}
                >
                  <MessageCircle className="w-4 h-4 ml-1" />
                  إرسال الملاحظة للعميل عبر واتساب
                </Button>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700" disabled={working} onClick={() => updateStatus('approved')}>
                    <CheckCircle2 className="w-4 h-4 ml-1" /> موافقة
                  </Button>
                  <Button variant="destructive" disabled={working} onClick={() => updateStatus('rejected')}>
                    <XCircle className="w-4 h-4 ml-1" /> رفض
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground text-center pt-1">
                  {FINANCING_TEAMS.unified} · {FINANCING_TEAMS.contact}
                </p>
              </CardContent>
            </Card>

            {/* Activity log */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> سجل النشاط
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px] pr-2">
                  {logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">لا يوجد نشاط بعد</p>
                  ) : (
                    <div className="space-y-3">
                      {logs.slice().reverse().map(l => (
                        <motion.div
                          key={l.id}
                          initial={{ opacity: 0, x: 5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative pr-6 pb-3 border-r-2 border-primary/30"
                        >
                          <div className="absolute right-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(l.created_at), 'yyyy-MM-dd HH:mm')}
                          </p>
                          <p className="text-sm font-medium">
                            {l.from_status ? `${FINANCING_STATUS_LABELS_AR[l.from_status] || l.from_status} → ` : ''}
                            <span className="text-primary">{FINANCING_STATUS_LABELS_AR[l.to_status] || l.to_status}</span>
                          </p>
                          {l.note && <p className="text-xs text-muted-foreground mt-1">{l.note}</p>}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

const InfoRow: React.FC<{ icon: any; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 border rounded-lg bg-gradient-to-br from-background to-muted/20">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  </div>
);

const Stat: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div className={`p-3 rounded-xl border bg-gradient-to-br ${accent} backdrop-blur`}>
    <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
    <p className="text-sm font-bold">{value}</p>
  </div>
);

export default FinancingAdminDetails;
