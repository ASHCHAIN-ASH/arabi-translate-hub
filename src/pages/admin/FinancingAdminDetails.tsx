import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, XCircle, FileText, RefreshCw, User, Phone, Mail,
  Building2, Wallet, AlertCircle, Receipt, Clock, ShieldCheck,
  Banknote, Hash, MapPin, CreditCard, Eye, Download, Loader2, Sparkles,
  MessageCircle, LayoutGrid, FileCheck2, History, Activity, Gavel,
} from 'lucide-react';
import {
  FINANCING_STATUS_LABELS_AR,
  FINANCING_DOC_LABELS_AR,
  FINANCING_ACK_TITLES_AR,
  type FinancingAcknowledgmentType,
} from '@/lib/financing';
import { FINANCING_TEAMS } from '@/lib/financing-bank';
import { sendWhatsApp } from '@/lib/whatsapp';
import { downloadAcknowledgmentPdf } from '@/lib/financingAckPdf';
import { cn } from '@/lib/utils';

// ── WhatsApp helper ──
const notifyCustomer = async (app: any, message: string, entityId?: string) => {
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
  } catch (e) { console.warn('whatsapp notify failed', e); }
};

type FinancingDocument = {
  id: string; application_id: string; document_type: string; file_url: string;
  file_name: string | null; status: string; review_note: string | null; created_at: string;
};
type PaymentReceipt = {
  id: string; application_id: string; user_id: string;
  payment_method: 'wallet' | 'bank_transfer'; amount: number;
  bank_name: string | null; reference_number: string | null; transfer_date: string | null;
  receipt_file_url: string | null; receipt_file_name: string | null;
  status: 'pending' | 'approved' | 'rejected'; reviewer_note: string | null; created_at: string;
};
type StatusLog = {
  id: string; application_id: string; from_status: string | null; to_status: string;
  note: string | null; changed_by: string | null; created_at: string;
};
type AckRow = {
  id: string; application_id: string; user_id: string;
  ack_type: FinancingAcknowledgmentType; ack_title: string;
  signer_name: string; signed_at: string; evidence_sha256: string;
  accepted_clauses: string[] | null;
};

const TIMELINE_STEPS = [
  { key: 'submitted', label: 'تم الإرسال', icon: FileText, color: 'from-sky-500 to-cyan-500' },
  { key: 'documents_pending', label: 'المستندات', icon: ShieldCheck, color: 'from-indigo-500 to-blue-500' },
  { key: 'under_review', label: 'مراجعة الائتمان', icon: Sparkles, color: 'from-violet-500 to-purple-500' },
  { key: 'contract_pending_signature', label: 'توقيع العقد', icon: CheckCircle2, color: 'from-amber-500 to-orange-500' },
  { key: 'waiting_down_payment', label: 'الدفعة الأولى', icon: Banknote, color: 'from-rose-500 to-pink-500' },
  { key: 'active', label: 'نشط', icon: Wallet, color: 'from-emerald-500 to-teal-500' },
];

const STATUS_OPTIONS = [
  'documents_pending', 'under_review', 'contract_pending_signature',
  'waiting_down_payment', 'approved', 'rejected', 'cancelled',
];

const statusVariant = (s: string) => {
  if (['approved', 'active', 'completed'].includes(s)) return 'default';
  if (['rejected', 'cancelled', 'overdue'].includes(s)) return 'destructive';
  return 'secondary';
};

const fmt = (n: number) => Number(n || 0).toLocaleString('en-US');

const FinancingAdminDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState<any>(null);
  const [docs, setDocs] = useState<FinancingDocument[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [logs, setLogs] = useState<StatusLog[]>([]);
  const [acks, setAcks] = useState<AckRow[]>([]);
  const [adminNote, setAdminNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [working, setWorking] = useState(false);
  const [tab, setTab] = useState('overview');

  const reload = async () => {
    if (!id) return;
    const [a, d, r, l, k] = await Promise.all([
      supabase.from('financing_applications').select('*').eq('id', id).maybeSingle(),
      supabase.from('financing_documents' as any).select('*').eq('application_id', id).order('created_at', { ascending: false }),
      supabase.from('financing_payment_receipts' as any).select('*').eq('application_id', id).order('created_at', { ascending: false }),
      supabase.from('financing_status_logs' as any).select('*').eq('application_id', id).order('created_at', { ascending: true }),
      supabase.from('financing_acknowledgments' as any).select('*').eq('application_id', id).order('signed_at', { ascending: true }),
    ]);
    if (a.error || !a.data) { toast.error('تعذر تحميل الطلب'); setLoading(false); return; }
    setApp(a.data);
    setDocs((d.data as any) || []);
    setReceipts((r.data as any) || []);
    setLogs((l.data as any) || []);
    setAcks((k.data as any) || []);
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
      const { error } = await supabase.from('financing_applications').update({
        status: toStatus as any,
        notes: adminNote ? `${app.notes ? app.notes + '\n---\n' : ''}[${format(new Date(), 'yyyy-MM-dd HH:mm')}] ${adminNote}` : app.notes,
      }).eq('id', app.id);
      if (error) throw error;
      toast.success('تم تحديث الحالة');
      const statusLabel = FINANCING_STATUS_LABELS_AR[toStatus] || toStatus;
      const noteSuffix = adminNote ? `\n📝 ملاحظة: ${adminNote}` : '';
      await notifyCustomer(app, `تم تحديث حالة طلب التمويل الخاص بك إلى: *${statusLabel}* ✅${noteSuffix}`);
      setAdminNote(''); setNewStatus('');
    } catch (e: any) { toast.error(e.message || 'فشل التحديث'); }
    finally { setWorking(false); }
  };

  const reviewDoc = async (docId: string, status: 'approved' | 'rejected', note?: string) => {
    const doc = docs.find(d => d.id === docId);
    const { error } = await supabase.from('financing_documents' as any)
      .update({ status, review_note: note ?? null, reviewed_at: new Date().toISOString() } as any).eq('id', docId);
    if (error) { toast.error('فشل تحديث المستند'); return; }
    toast.success(status === 'approved' ? 'تمت الموافقة على المستند' : 'تم رفض المستند');
    const docLabel = doc ? (FINANCING_DOC_LABELS_AR[doc.document_type] || doc.document_type) : 'وثيقة';
    if (status === 'approved') await notifyCustomer(app, `✅ تم قبول وثيقة *${docLabel}* الخاصة بطلب التمويل.`, docId);
    else await notifyCustomer(app, `❌ تم رفض وثيقة *${docLabel}*.${note ? `\nالسبب: ${note}` : ''}\n\nيرجى إعادة رفعها من حسابك.`, docId);
  };

  const reviewReceipt = async (rid: string, status: 'approved' | 'rejected') => {
    const receipt = receipts.find(r => r.id === rid);
    const { error } = await supabase.from('financing_payment_receipts' as any)
      .update({ status, reviewer_note: adminNote || null } as any).eq('id', rid);
    if (error) { toast.error('فشل تحديث الإيصال'); return; }
    toast.success(status === 'approved' ? 'تم اعتماد الإيصال' : 'تم رفض الإيصال');
    const amt = receipt ? `${fmt(receipt.amount)} ر.س` : '';
    if (status === 'approved') await notifyCustomer(app, `✅ تم اعتماد إيصال الدفع بمبلغ *${amt}* بنجاح.\nسيتم تفعيل خطة التمويل قريباً.`, rid);
    else await notifyCustomer(app, `❌ تم رفض إيصال الدفع بمبلغ *${amt}*.${adminNote ? `\nالسبب: ${adminNote}` : ''}\n\nيرجى رفع إيصال صحيح من حسابك.`, rid);
  };

  const sendNoteToCustomer = async () => {
    if (!adminNote.trim()) { toast.error('اكتب الملاحظة أولاً'); return; }
    setWorking(true);
    await notifyCustomer(app, `📌 رسالة من فريق التمويل:\n\n${adminNote}`);
    toast.success('تم إرسال الملاحظة عبر واتساب');
    setAdminNote(''); setWorking(false);
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
          <p className="text-muted-foreground font-arabic">لم يتم العثور على الطلب</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/adminmaster/financing">العودة للقائمة</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const TABS = [
    { key: 'overview', label: 'نظرة عامة', icon: LayoutGrid },
    { key: 'documents', label: 'الوثائق', icon: FileCheck2, count: docs.length },
    { key: 'receipts', label: 'الإيصالات', icon: Receipt, count: receipts.length },
    { key: 'timeline', label: 'سجل النشاط', icon: History, count: logs.length },
  ];

  return (
    <AdminLayout>
      <motion.div
        className="space-y-6 font-arabic"
        dir="rtl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: '"IBM Plex Sans Arabic", "Tajawal", system-ui, sans-serif' }}
      >
        {/* ─── Premium Header ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.4),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.4),transparent_50%)]" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" onClick={() => navigate('/adminmaster/financing')}>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <motion.div
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/40"
              >
                <CreditCard className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold tracking-tight">{app.applicant_full_name || 'عميل'}</h1>
                  <Badge variant={statusVariant(app.status)} className="text-xs">
                    {FINANCING_STATUS_LABELS_AR[app.status] || app.status}
                  </Badge>
                </div>
                <p className="text-sm text-white/70 flex items-center gap-3 flex-wrap">
                  <span className="font-mono">#{String(app.id).slice(0, 8).toUpperCase()}</span>
                  <span>•</span>
                  <span>{format(new Date(app.created_at), 'yyyy-MM-dd HH:mm')}</span>
                  {app.applicant_phone && <><span>•</span><span dir="ltr">{app.applicant_phone}</span></>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 gap-2" onClick={reload}>
                <RefreshCw className="w-4 h-4" /> تحديث
              </Button>
              {app.applicant_phone && (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" asChild>
                  <a href={`https://wa.me/${String(app.applicant_phone).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> واتساب
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <HeaderStat label="إجمالي التمويل" value={`${fmt(app.total_amount)} ر.س`} />
            <HeaderStat label="الدفعة الأولى" value={`${fmt(app.down_payment)} ر.س`} accent="amber" />
            <HeaderStat label="المتبقي" value={`${fmt(app.remaining_amount)} ر.س`} accent="emerald" />
            <HeaderStat label="القسط الشهري" value={`${fmt(app.monthly_installment)} × ${app.duration_months}`} accent="blue" />
          </div>
        </motion.div>

        {/* ─── Lifecycle Timeline ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-primary/10 bg-gradient-to-br from-card to-muted/30 backdrop-blur shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> مسار الطلب
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
                        transition={{ delay: 0.2 + idx * 0.07 }}
                        className="flex flex-col items-center gap-2 min-w-[80px] flex-1"
                      >
                        <div className={cn(
                          'relative w-12 h-12 rounded-full flex items-center justify-center transition-all ring-4 ring-background',
                          reached
                            ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                            : 'bg-muted text-muted-foreground',
                          current && 'scale-110',
                        )}>
                          {current && (
                            <motion.div
                              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={cn('absolute inset-0 rounded-full bg-gradient-to-br', step.color)}
                            />
                          )}
                          <Icon className="w-5 h-5 relative z-10" />
                        </div>
                        <span className={cn('text-xs text-center font-semibold', reached ? 'text-foreground' : 'text-muted-foreground')}>
                          {step.label}
                        </span>
                      </motion.div>
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <div className="flex-1 h-0.5 mt-6 min-w-[20px]">
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: idx < currentStepIndex ? 1 : 0 }}
                            transition={{ delay: 0.3 + idx * 0.07, duration: 0.4 }}
                            style={{ transformOrigin: 'right' }}
                            className={cn('h-full rounded', idx < currentStepIndex ? 'bg-gradient-to-l from-primary to-primary/50' : 'bg-muted')}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Main Grid: Tabs + Actions ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tabbed content */}
          <div className="lg:col-span-2">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="relative w-full h-auto p-1.5 bg-muted/50 backdrop-blur border border-border/50 rounded-2xl grid grid-cols-4 gap-1">
                {TABS.map(t => {
                  const Icon = t.icon;
                  const active = tab === t.key;
                  return (
                    <TabsTrigger
                      key={t.key}
                      value={t.key}
                      className="relative data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none rounded-xl py-2.5 px-2 text-xs sm:text-sm font-bold transition-colors gap-1.5"
                    >
                      {active && (
                        <motion.div
                          layoutId="adminFinancingTab"
                          className="absolute inset-0 rounded-xl shadow-lg bg-gradient-to-br from-primary to-primary/70"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{t.label}</span>
                        {typeof t.count === 'number' && (
                          <span className={cn(
                            'text-[10px] rounded-full px-1.5 py-0.5 font-mono',
                            active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary',
                          )}>
                            {t.count}
                          </span>
                        )}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4"
                >
                  {/* OVERVIEW */}
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" /> بيانات مقدّم الطلب
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InfoRow icon={User} label="الاسم الكامل" value={app.applicant_full_name} />
                        <InfoRow icon={Hash} label="رقم الهوية" value={app.applicant_id_number} mono />
                        <InfoRow icon={Phone} label="الجوال" value={app.applicant_phone} mono />
                        <InfoRow icon={Mail} label="البريد" value={app.applicant_email || '—'} />
                        <InfoRow icon={Building2} label="جهة العمل" value={app.employer_name || '—'} />
                        <InfoRow icon={MapPin} label="المدينة" value={app.city || '—'} />
                        <InfoRow icon={Wallet} label="الدخل الشهري" value={`${fmt(app.monthly_income || 0)} ر.س`} />
                        <InfoRow icon={AlertCircle} label="الالتزامات" value={`${fmt(app.monthly_commitments || 0)} ر.س`} />
                      </CardContent>
                    </Card>

                    {app.notes && (
                      <Card className="bg-amber-500/5 border-amber-500/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                            <AlertCircle className="w-4 h-4" /> الملاحظات الإدارية
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs whitespace-pre-wrap font-sans text-foreground/80 leading-relaxed">
                            {app.notes}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* DOCUMENTS */}
                  <TabsContent value="documents" className="mt-0">
                    <Card>
                      <CardContent className="pt-6">
                        {docs.length === 0 ? (
                          <EmptyState icon={FileText} text="لا توجد وثائق مرفوعة بعد" />
                        ) : (
                          <div className="space-y-2">
                            <AnimatePresence>
                              {docs.map((d, i) => (
                                <motion.div
                                  key={d.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ delay: i * 0.04 }}
                                  className="flex items-center justify-between gap-3 p-3 border rounded-xl bg-gradient-to-br from-background to-muted/30 hover:shadow-md hover:border-primary/30 transition-all"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                                      <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-sm truncate">
                                        {FINANCING_DOC_LABELS_AR[d.document_type] || d.document_type}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate">{d.file_name || '—'}</p>
                                    </div>
                                  </div>
                                  <Badge variant={d.status === 'approved' ? 'default' : d.status === 'rejected' ? 'destructive' : 'secondary'} className="shrink-0 text-[10px]">
                                    {d.status === 'approved' ? '✓ موافق' : d.status === 'rejected' ? '✗ مرفوض' : 'قيد المراجعة'}
                                  </Badge>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Button size="icon" variant="ghost" onClick={() => openFile(d.file_url)} title="عرض">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-emerald-600 hover:bg-emerald-500/10" onClick={() => reviewDoc(d.id, 'approved')} title="موافقة">
                                      <CheckCircle2 className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => reviewDoc(d.id, 'rejected', adminNote)} title="رفض">
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
                  </TabsContent>

                  {/* RECEIPTS */}
                  <TabsContent value="receipts" className="mt-0">
                    <Card>
                      <CardContent className="pt-6">
                        {receipts.length === 0 ? (
                          <EmptyState icon={Receipt} text="لا توجد إيصالات دفع" />
                        ) : (
                          <div className="space-y-3">
                            {receipts.map((r, i) => (
                              <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-4 border rounded-xl bg-gradient-to-br from-background to-muted/30 space-y-3 hover:shadow-md transition-all"
                              >
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="gap-1">
                                      {r.payment_method === 'wallet' ? <Wallet className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                                      {r.payment_method === 'wallet' ? 'محفظة رقمية' : 'تحويل بنكي'}
                                    </Badge>
                                    <span className="font-bold text-base">{fmt(r.amount)} ر.س</span>
                                  </div>
                                  <Badge variant={r.status === 'approved' ? 'default' : r.status === 'rejected' ? 'destructive' : 'secondary'}>
                                    {r.status === 'approved' ? 'مُعتمد' : r.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                                  </Badge>
                                </div>
                                {r.payment_method === 'bank_transfer' && (
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                    <KV label="البنك" value={r.bank_name || '—'} />
                                    <KV label="المرجع" value={r.reference_number || '—'} mono />
                                    <KV label="التاريخ" value={r.transfer_date || '—'} />
                                  </div>
                                )}
                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                                  {r.receipt_file_url ? (
                                    <Button size="sm" variant="outline" onClick={() => openFile(r.receipt_file_url!)}>
                                      <Download className="w-4 h-4 ml-1" /> عرض الإيصال
                                    </Button>
                                  ) : <span className="text-xs text-muted-foreground">لا يوجد ملف مرفق</span>}
                                  {r.status === 'pending' && (
                                    <div className="flex gap-2">
                                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => reviewReceipt(r.id, 'approved')}>
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
                  </TabsContent>

                  {/* TIMELINE */}
                  <TabsContent value="timeline" className="mt-0">
                    <Card>
                      <CardContent className="pt-6">
                        <ScrollArea className="h-[500px] pl-2">
                          {logs.length === 0 ? (
                            <EmptyState icon={Clock} text="لا يوجد نشاط بعد" />
                          ) : (
                            <div className="space-y-4 pr-2">
                              {logs.slice().reverse().map((l, i) => (
                                <motion.div
                                  key={l.id}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.03 }}
                                  className="relative pr-6 pb-4 border-r-2 border-primary/30 last:border-r-transparent"
                                >
                                  <div className="absolute right-[-7px] top-1 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-primary to-primary/60 ring-4 ring-background shadow-md" />
                                  <p className="text-[11px] text-muted-foreground font-mono">
                                    {format(new Date(l.created_at), 'yyyy-MM-dd HH:mm')}
                                  </p>
                                  <p className="text-sm font-bold mt-1">
                                    {l.from_status ? `${FINANCING_STATUS_LABELS_AR[l.from_status] || l.from_status} ← ` : ''}
                                    <span className="text-primary">{FINANCING_STATUS_LABELS_AR[l.to_status] || l.to_status}</span>
                                  </p>
                                  {l.note && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{l.note}</p>}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>

          {/* Right: Actions sidebar (sticky) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="border-primary/20 sticky top-4 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> إجراءات إدارية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">تغيير الحالة</label>
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
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">ملاحظة</label>
                  <Textarea
                    rows={3}
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    placeholder="ملاحظة تُسجَّل وتُرسل للعميل…"
                    className="resize-none"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/80 shadow-md"
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
                  إرسال للعميل عبر واتساب
                </Button>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={working} onClick={() => updateStatus('approved')}>
                    <CheckCircle2 className="w-4 h-4 ml-1" /> موافقة
                  </Button>
                  <Button variant="destructive" disabled={working} onClick={() => updateStatus('rejected')}>
                    <XCircle className="w-4 h-4 ml-1" /> رفض
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center pt-1 leading-relaxed">
                  {FINANCING_TEAMS.unified}<br />
                  <span dir="ltr" className="font-mono">{FINANCING_TEAMS.contact}</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

// ── Subcomponents ──
const HeaderStat: React.FC<{ label: string; value: string; accent?: 'amber' | 'emerald' | 'blue' }> = ({ label, value, accent }) => {
  const ringColor = accent === 'amber' ? 'from-amber-400/30 to-amber-500/10'
    : accent === 'emerald' ? 'from-emerald-400/30 to-emerald-500/10'
    : accent === 'blue' ? 'from-blue-400/30 to-blue-500/10'
    : 'from-white/20 to-white/5';
  return (
    <div className={cn('rounded-2xl border border-white/10 backdrop-blur-md p-3 bg-gradient-to-br', ringColor)}>
      <p className="text-[10px] text-white/70 mb-1 font-medium">{label}</p>
      <p className="text-base font-bold text-white tracking-tight">{value}</p>
    </div>
  );
};

const InfoRow: React.FC<{ icon: any; label: string; value: string; mono?: boolean }> = ({ icon: Icon, label, value, mono }) => (
  <div className="flex items-center gap-3 p-3 border rounded-xl bg-gradient-to-br from-background to-muted/20 hover:border-primary/30 transition-colors">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
      <p className={cn('text-sm font-bold truncate', mono && 'font-mono')} dir={mono ? 'ltr' : undefined}>{value}</p>
    </div>
  </div>
);

const KV: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="bg-muted/40 rounded-lg px-2.5 py-1.5">
    <span className="text-muted-foreground text-[10px] block">{label}</span>
    <span className={cn('text-foreground font-semibold text-xs', mono && 'font-mono')} dir={mono ? 'ltr' : undefined}>{value}</span>
  </div>
);

const EmptyState: React.FC<{ icon: any; text: string }> = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6 text-muted-foreground" />
    </div>
    <p className="text-sm text-muted-foreground font-medium">{text}</p>
  </div>
);

export default FinancingAdminDetails;
