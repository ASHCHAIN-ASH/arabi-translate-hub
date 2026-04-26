import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import {
  CheckCircle2, XCircle, FileText, Search, RefreshCw, User,
  Phone, Mail, Building2, Wallet, Calendar, AlertCircle,
  Receipt, TrendingUp, Clock, Sparkles, ShieldCheck, Banknote,
  CalendarClock, AlertTriangle, ExternalLink, Activity, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  FINANCING_STATUS_LABELS_AR,
  FINANCING_DOC_LABELS_AR,
  validateFinancingStatusTransition,
} from '@/lib/financing';

type Application = {
  id: string;
  user_id: string;
  order_id: string | null;
  total_amount: number;
  down_payment: number;
  remaining_amount: number;
  monthly_installment: number;
  duration_months: number;
  status: string;
  score: number | null;
  risk_level: string | null;
  ai_risk_score: number | null;
  applicant_full_name: string;
  applicant_id_number: string;
  applicant_phone: string;
  applicant_email: string | null;
  employer_name: string | null;
  monthly_income: number | null;
  monthly_commitments: number | null;
  city: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

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

type Installment = {
  id: string;
  application_id: string;
  month_number: number;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  paid_at: string | null;
  paid_amount: number | null;
};

// التسلسل الرسمي لمراحل التمويل (من الاستلام إلى الإغلاق)
// 1) submitted → 2) documents_pending → 3) under_review → 4) contract_pending_signature
// → 5) waiting_down_payment → 6) approved → 7) execution_deed → 8) active → 9) completed
// مسارات استثنائية: rejected | cancelled | overdue
const STATUS_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'الكل' },
  // — مرحلة الاستقبال —
  { key: 'submitted', label: '1. استلام الطلب' },
  { key: 'documents_pending', label: '2. توثيق المستندات' },
  { key: 'under_review', label: '3. التقييم الائتماني' },
  // — مرحلة التعاقد والدفع —
  { key: 'contract_pending_signature', label: '4. توقيع العقد' },
  { key: 'waiting_down_payment', label: '5. الدفعة الأولى' },
  { key: 'approved', label: '6. الموافقة النهائية' },
  // — مرحلة التفعيل —
  { key: 'execution_deed', label: '7. السند التنفيذي' },
  { key: 'active', label: '8. تفعيل الرصيد' },
  { key: 'completed', label: '9. مُسدَّدة بالكامل' },
  // — مسارات استثنائية —
  { key: 'overdue', label: 'متعثّرة' },
  { key: 'rejected', label: 'مرفوضة' },
  { key: 'cancelled', label: 'ملغاة' },
];

// مجموعات الحالات للقائمة المنسدلة "حالة أخرى" — مرتبة بالتسلسل المنطقي للرحلة
const STATUS_GROUPS: Array<{ label: string; statuses: string[] }> = [
  {
    label: '— مرحلة الاستقبال والتقييم —',
    statuses: ['submitted', 'documents_pending', 'under_review'],
  },
  {
    label: '— مرحلة التعاقد والدفع —',
    statuses: ['contract_pending_signature', 'waiting_down_payment', 'approved'],
  },
  {
    label: '— مرحلة التفعيل —',
    statuses: ['execution_deed', 'active'],
  },
  {
    label: '— مرحلة الإغلاق —',
    statuses: ['completed'],
  },
  {
    label: '— مسارات استثنائية —',
    statuses: ['overdue', 'rejected', 'cancelled'],
  },
];

const statusVariant = (s: string) => {
  if (['approved', 'active', 'completed'].includes(s)) return 'default';
  if (['rejected', 'cancelled', 'overdue'].includes(s)) return 'destructive';
  return 'secondary';
};

const fmt = (n: number) => Number(n || 0).toLocaleString('en-US');

const FinancingAdmin: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [docs, setDocs] = useState<FinancingDocument[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [adminNote, setAdminNote] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [working, setWorking] = useState(false);
  const [installmentsByApp, setInstallmentsByApp] = useState<Record<string, Installment[]>>({});

  const fetchApps = async () => {
    const { data, error } = await supabase
      .from('financing_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('تعذر تحميل الطلبات');
      console.error(error);
    } else {
      const list = (data || []) as Application[];
      setApps(list);
      // Fetch installments summary for active applications (for sidebar progress bars)
      const activeIds = list.filter((a) => ['active', 'approved'].includes(a.status)).map((a) => a.id);
      if (activeIds.length > 0) {
        const { data: ins } = await supabase
          .from('financing_installments')
          .select('*')
          .in('application_id', activeIds);
        const grouped: Record<string, Installment[]> = {};
        (ins || []).forEach((i: any) => {
          (grouped[i.application_id] ??= []).push(i as Installment);
        });
        setInstallmentsByApp(grouped);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
    const channel = supabase
      .channel('financing-admin-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_applications' }, () => fetchApps())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_payment_receipts' }, () => {
        if (selectedId) loadDetails(selectedId);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_documents' }, () => {
        if (selectedId) loadDetails(selectedId);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_installments' }, () => {
        if (selectedId) loadDetails(selectedId);
        fetchApps();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const selected = useMemo(
    () => apps.find((a) => a.id === selectedId) || null,
    [apps, selectedId],
  );

  const loadDetails = async (id: string) => {
    const [{ data: dd }, { data: rr }, { data: ii }] = await Promise.all([
      supabase.from('financing_documents').select('*').eq('application_id', id).order('created_at', { ascending: false }),
      supabase.from('financing_payment_receipts').select('*').eq('application_id', id).order('created_at', { ascending: false }),
      supabase.from('financing_installments').select('*').eq('application_id', id).order('month_number', { ascending: true }),
    ]);
    setDocs((dd || []) as FinancingDocument[]);
    setReceipts((rr || []) as PaymentReceipt[]);
    setInstallments((ii || []) as Installment[]);
  };

  useEffect(() => {
    if (!selectedId) { setDocs([]); setReceipts([]); setInstallments([]); return; }
    setAdminNote(''); setNewStatus('');
    loadDetails(selectedId);
  }, [selectedId]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (!s) return true;
      return (
        a.applicant_full_name?.toLowerCase().includes(s) ||
        a.applicant_phone?.toLowerCase().includes(s) ||
        a.applicant_id_number?.toLowerCase().includes(s) ||
        a.id.toLowerCase().includes(s)
      );
    });
  }, [apps, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: apps.length };
    apps.forEach((a) => { c[a.status] = (c[a.status] || 0) + 1; });
    return c;
  }, [apps]);

  const stats = useMemo(() => {
    const active = apps.filter(a => a.status === 'active').length;
    const pending = apps.filter(a => ['submitted','under_review','documents_pending','waiting_down_payment','contract_pending_signature'].includes(a.status)).length;
    const totalFunded = apps.filter(a => ['active','completed'].includes(a.status)).reduce((s,a) => s + Number(a.total_amount||0), 0);
    const pendingReceipts = apps.filter(a => a.status === 'waiting_down_payment').length;
    // Overdue installments across all active apps
    let overdueCount = 0;
    let overdueAmount = 0;
    Object.values(installmentsByApp).forEach((list) => {
      list.forEach((i) => {
        const isOverdue = i.status === 'overdue' || (i.status === 'pending' && new Date(i.due_date) < new Date());
        if (isOverdue) {
          overdueCount += 1;
          overdueAmount += Number(i.amount || 0);
        }
      });
    });
    return { active, pending, totalFunded, pendingReceipts, overdueCount, overdueAmount };
  }, [apps, installmentsByApp]);

  const updateStatus = async (status: string) => {
    if (!selected) return;
    setWorking(true);
    const { error } = await supabase
      .from('financing_applications')
      .update({
        status: status as any,
        notes: adminNote
          ? `${selected.notes ? selected.notes + '\n---\n' : ''}[${format(new Date(), 'yyyy-MM-dd HH:mm')}] ${adminNote}`
          : selected.notes,
      } as any)
      .eq('id', selected.id);
    setWorking(false);
    if (error) { toast.error('تعذر تحديث الحالة: ' + error.message); return; }
    toast.success(`تم التحديث إلى: ${FINANCING_STATUS_LABELS_AR[status] || status}`);
    setAdminNote(''); setNewStatus('');
  };

  const reviewDoc = async (doc: FinancingDocument, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('financing_documents')
      .update({ status: status as any, review_note: status === 'rejected' ? 'مرفوض من الإدارة' : null } as any)
      .eq('id', doc.id);
    if (error) { toast.error('تعذر تحديث المستند'); return; }
    toast.success('تم تحديث المستند');
  };

  const reviewReceipt = async (rec: PaymentReceipt, status: 'approved' | 'rejected', note?: string) => {
    const { error } = await supabase
      .from('financing_payment_receipts')
      .update({ status, reviewer_note: note ?? null, reviewed_at: new Date().toISOString() } as any)
      .eq('id', rec.id);
    if (error) { toast.error('تعذر تحديث الإيصال: ' + error.message); return; }
    toast.success(status === 'approved' ? '✅ تم قبول الإيصال — جاري تفعيل التمويل' : 'تم رفض الإيصال');
  };

  const markInstallmentPaid = async (ins: Installment) => {
    const { error } = await supabase
      .from('financing_installments')
      .update({
        status: 'paid' as any,
        paid_at: new Date().toISOString(),
        paid_amount: ins.amount,
      } as any)
      .eq('id', ins.id);
    if (error) { toast.error('تعذر تعليم القسط: ' + error.message); return; }
    toast.success(`✅ تم تعليم القسط #${ins.month_number} كمدفوع — تحديث فوري للعميل`);
  };

  const markInstallmentOverdue = async (ins: Installment) => {
    const { error } = await supabase
      .from('financing_installments')
      .update({ status: 'overdue' as any } as any)
      .eq('id', ins.id);
    if (error) { toast.error('تعذر التحديث: ' + error.message); return; }
    toast.success(`⚠️ تم تعليم القسط #${ins.month_number} كمتأخر`);
  };

  const openFile = async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);
    if (error || !data?.signedUrl) { toast.error('تعذر فتح الملف'); return; }
    window.open(data.signedUrl, '_blank');
  };

  // Calculate progress for selected app installments
  const selectedProgress = useMemo(() => {
    if (!installments.length) return { paid: 0, total: 0, pct: 0, paidAmount: 0, totalAmount: 0, overdue: 0 };
    const paid = installments.filter((i) => i.status === 'paid');
    const overdue = installments.filter((i) => i.status === 'overdue' || (i.status === 'pending' && new Date(i.due_date) < new Date())).length;
    const paidAmount = paid.reduce((s, i) => s + Number(i.paid_amount || i.amount || 0), 0);
    const totalAmount = installments.reduce((s, i) => s + Number(i.amount || 0), 0);
    return {
      paid: paid.length,
      total: installments.length,
      pct: installments.length ? Math.round((paid.length / installments.length) * 100) : 0,
      paidAmount,
      totalAmount,
      overdue,
    };
  }, [installments]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in" dir="rtl">
        {/* Hero — Banking-style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-primary/15 via-background to-accent/10 p-6 md:p-8 backdrop-blur-2xl shadow-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,hsl(var(--primary)/0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,hsl(var(--accent)/0.2),transparent_55%)]" />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center shadow-2xl shadow-primary/40 ring-4 ring-primary/10">
                <Banknote className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2 tracking-tight">
                  Master PayLater
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  لوحة التمويل والائتمان والمتابعة • مزامنة لحظية مع لوحة العميل
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Realtime مفعّل
                  </span>
                  <span className="text-xs text-muted-foreground">آخر تحديث: {format(new Date(), 'HH:mm:ss')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link to="/adminmaster/financing/audit">
                  <Activity className="w-4 h-4" /> سجل التدقيق
                </Link>
              </Button>
              <Button variant="default" onClick={fetchApps} disabled={loading} className="gap-2 shadow-lg shadow-primary/20">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPI cards — banking grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiCard icon={<TrendingUp className="w-4 h-4" />} label="نشطة" value={String(stats.active)} accent="from-emerald-500/20 to-emerald-500/5" tone="text-emerald-600" />
          <KpiCard icon={<Clock className="w-4 h-4" />} label="قيد المعالجة" value={String(stats.pending)} accent="from-amber-500/20 to-amber-500/5" tone="text-amber-600" />
          <KpiCard icon={<Receipt className="w-4 h-4" />} label="بانتظار الدفعة" value={String(stats.pendingReceipts)} accent="from-sky-500/20 to-sky-500/5" tone="text-sky-600" />
          <KpiCard icon={<AlertTriangle className="w-4 h-4" />} label="أقساط متأخرة" value={String(stats.overdueCount)} accent="from-rose-500/20 to-rose-500/5" tone="text-rose-600" sub={stats.overdueAmount ? `${fmt(stats.overdueAmount)} ر.س` : undefined} />
          <KpiCard icon={<Wallet className="w-4 h-4" />} label="إجمالي المُموَّل" value={`${fmt(stats.totalFunded)} ر.س`} accent="from-primary/20 to-primary/5" tone="text-primary" />
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex flex-wrap h-auto justify-start bg-muted/40 backdrop-blur-xl border border-border/40 p-1 rounded-xl">
            {STATUS_FILTERS.map((f) => (
              <TabsTrigger key={f.key} value={f.key} className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
                {f.label}
                {counts[f.key] ? (<Badge variant="secondary" className="h-5 px-1.5 tabular-nums">{counts[f.key]}</Badge>) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: list */}
          <Card className="lg:col-span-5 xl:col-span-4 border-border/50 backdrop-blur-xl bg-card/80 shadow-lg">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم، الهوية، الجوال..."
                  className="pr-9 bg-background/60 border-border/40"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-420px)] min-h-[450px]">
                {loading ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">جاري التحميل...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">لا توجد طلبات</div>
                ) : (
                  <div className="divide-y divide-border/40">
                    <AnimatePresence initial={false}>
                      {filtered.map((a) => {
                        const ins = installmentsByApp[a.id] || [];
                        const paidCount = ins.filter((i) => i.status === 'paid').length;
                        const overdue = ins.filter((i) => i.status === 'overdue' || (i.status === 'pending' && new Date(i.due_date) < new Date())).length;
                        const pct = ins.length ? Math.round((paidCount / ins.length) * 100) : 0;
                        return (
                          <motion.button
                            key={a.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setSelectedId(a.id)}
                            className={`w-full text-right p-3 hover:bg-accent/40 transition-all duration-200 ${
                              selectedId === a.id ? 'bg-gradient-to-l from-primary/15 to-transparent border-r-4 border-primary' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="font-semibold truncate">{a.applicant_full_name}</div>
                              <Badge variant={statusVariant(a.status) as any} className="text-xs shrink-0">
                                {FINANCING_STATUS_LABELS_AR[a.status] || a.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap mb-1.5">
                              <span dir="ltr">{a.applicant_phone}</span>
                              <span>•</span>
                              <span dir="ltr" className="font-medium text-foreground/80">{fmt(a.total_amount)} ر.س</span>
                              <span>•</span>
                              <span dir="ltr">{format(new Date(a.created_at), 'yyyy-MM-dd')}</span>
                            </div>
                            {ins.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <Progress value={pct} className="h-1.5 flex-1" />
                                <span className="text-[10px] tabular-nums text-muted-foreground shrink-0">
                                  {paidCount}/{ins.length}
                                </span>
                                {overdue > 0 && (
                                  <Badge variant="destructive" className="h-4 px-1 text-[9px] gap-0.5">
                                    <AlertTriangle className="w-2.5 h-2.5" />{overdue}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right: details */}
          <Card className="lg:col-span-7 xl:col-span-8 border-border/50 backdrop-blur-xl bg-card/80 shadow-lg">
            {!selected ? (
              <CardContent className="p-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                اختر طلباً من القائمة لعرض التفاصيل والإجراءات
              </CardContent>
            ) : (
              <>
                <CardHeader className="border-b border-border/40">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {selected.applicant_full_name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                          #{selected.id.slice(0, 8).toUpperCase()}
                        </p>
                        <Button asChild variant="ghost" size="sm" className="h-6 px-2 gap-1 text-xs">
                          <Link to={`/adminmaster/financing/${selected.id}`}>
                            <ExternalLink className="w-3 h-3" /> عرض كامل
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selected.ai_risk_score != null && (
                        <Badge variant="outline" className="gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          AI: {selected.ai_risk_score}/100
                        </Badge>
                      )}
                      <Badge variant={statusVariant(selected.status) as any}>
                        {FINANCING_STATUS_LABELS_AR[selected.status] || selected.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-5">
                  {/* Applicant info */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label="الجوال" value={selected.applicant_phone} ltr />
                    <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="البريد" value={selected.applicant_email || '—'} ltr />
                    <InfoRow icon={<User className="w-3.5 h-3.5" />} label="الهوية" value={selected.applicant_id_number} ltr />
                    <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="جهة العمل" value={selected.employer_name || '—'} />
                    <InfoRow label="الدخل الشهري" value={selected.monthly_income ? `${fmt(selected.monthly_income)} ر.س` : '—'} />
                    <InfoRow label="الالتزامات" value={selected.monthly_commitments ? `${fmt(selected.monthly_commitments)} ر.س` : '—'} />
                    <InfoRow label="المدينة" value={selected.city || '—'} />
                    <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="تاريخ الطلب" value={format(new Date(selected.created_at), 'yyyy-MM-dd HH:mm')} />
                    <InfoRow label="درجة المخاطر" value={selected.risk_level || '—'} />
                  </div>

                  <Separator />

                  {/* Financial summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Stat label="إجمالي" value={`${fmt(selected.total_amount)} ر.س`} />
                    <Stat label="الدفعة الأولى" value={`${fmt(selected.down_payment)} ر.س`} />
                    <Stat label="المتبقي" value={`${fmt(selected.remaining_amount)} ر.س`} />
                    <Stat label={`القسط × ${selected.duration_months}`} value={`${fmt(selected.monthly_installment)} ر.س`} />
                  </div>

                  {/* Installments tracker */}
                  {installments.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <CalendarClock className="w-4 h-4 text-primary" />
                            جدول الأقساط ({selectedProgress.paid}/{selectedProgress.total})
                            {selectedProgress.overdue > 0 && (
                              <Badge variant="destructive" className="text-[10px] gap-1 animate-pulse">
                                <AlertTriangle className="w-3 h-3" /> {selectedProgress.overdue} متأخر
                              </Badge>
                            )}
                          </h3>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {fmt(selectedProgress.paidAmount)} / {fmt(selectedProgress.totalAmount)} ر.س
                          </span>
                        </div>
                        <Progress value={selectedProgress.pct} className="h-2" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-auto pr-1">
                          {installments.map((ins) => {
                            const isOverdue = ins.status === 'overdue' || (ins.status === 'pending' && new Date(ins.due_date) < new Date());
                            const daysToOrPast = differenceInDays(new Date(ins.due_date), new Date());
                            const tone =
                              ins.status === 'paid' ? 'border-emerald-500/30 bg-emerald-500/5' :
                              isOverdue ? 'border-rose-500/30 bg-rose-500/5' :
                              'border-border/50 bg-background';
                            return (
                              <div key={ins.id} className={`flex items-center justify-between gap-2 p-2.5 border rounded-lg ${tone}`}>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold flex items-center gap-1.5">
                                    قسط #{ins.month_number}
                                    {ins.status === 'paid' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                    {isOverdue && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground mt-0.5" dir="ltr">
                                    {format(new Date(ins.due_date), 'yyyy-MM-dd')}
                                    {ins.status !== 'paid' && (
                                      <span className={isOverdue ? 'text-rose-600 mr-1' : 'mr-1'}>
                                        ({daysToOrPast >= 0 ? `بعد ${daysToOrPast} يوم` : `متأخر ${Math.abs(daysToOrPast)} يوم`})
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs font-bold mt-0.5 tabular-nums" dir="ltr">{fmt(ins.amount)} ر.س</div>
                                </div>
                                {ins.status !== 'paid' && (
                                  <div className="flex flex-col gap-1 shrink-0">
                                    <Button size="sm" className="h-7 px-2 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1" onClick={() => markInstallmentPaid(ins)}>
                                      <Zap className="w-3 h-3" /> دفع
                                    </Button>
                                    {!isOverdue && (
                                      <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] text-rose-600" onClick={() => markInstallmentOverdue(ins)}>
                                        تأخير
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Payment Receipts */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-primary" />
                      إيصالات الدفع ({receipts.length})
                      {receipts.some(r => r.status === 'pending') && (
                        <Badge variant="destructive" className="text-[10px] animate-pulse">بانتظار المراجعة</Badge>
                      )}
                    </h3>
                    {receipts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">لا توجد إيصالات دفع</p>
                    ) : (
                      <div className="space-y-2">
                        {receipts.map((r) => (
                          <div key={r.id} className="p-3 border border-border/50 rounded-xl bg-gradient-to-br from-background to-muted/20 space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 text-sm">
                                {r.payment_method === 'wallet' ? <Wallet className="w-4 h-4 text-primary" /> : <Banknote className="w-4 h-4 text-emerald-600" />}
                                <span className="font-medium">{r.payment_method === 'wallet' ? 'محفظة رقمية' : 'تحويل بنكي'}</span>
                                <span className="text-muted-foreground tabular-nums" dir="ltr">{fmt(r.amount)} ر.س</span>
                              </div>
                              <Badge variant={r.status === 'approved' ? 'default' : r.status === 'rejected' ? 'destructive' : 'secondary'}>
                                {r.status === 'approved' ? 'مقبول' : r.status === 'rejected' ? 'مرفوض' : 'بانتظار'}
                              </Badge>
                            </div>
                            {r.payment_method === 'bank_transfer' && (
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                {r.bank_name && <div>البنك: <span className="text-foreground">{r.bank_name}</span></div>}
                                {r.reference_number && <div>المرجع: <span className="text-foreground" dir="ltr">{r.reference_number}</span></div>}
                                {r.transfer_date && <div>التاريخ: <span className="text-foreground" dir="ltr">{r.transfer_date}</span></div>}
                              </div>
                            )}
                            {r.status === 'pending' && (
                              <div className="flex items-center gap-1 pt-1 flex-wrap">
                                {r.receipt_file_url && (
                                  <Button size="sm" variant="ghost" onClick={() => openFile('payment-receipts', r.receipt_file_url!)}>
                                    <ExternalLink className="w-3.5 h-3.5 ml-1" /> عرض الإيصال
                                  </Button>
                                )}
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => reviewReceipt(r, 'approved')}>
                                  <CheckCircle2 className="w-4 h-4 ml-1" /> قبول وتفعيل
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => reviewReceipt(r, 'rejected', 'إيصال غير صالح')}>
                                  <XCircle className="w-4 h-4 ml-1" /> رفض
                                </Button>
                              </div>
                            )}
                            {r.reviewer_note && (
                              <div className="text-xs text-muted-foreground border-t border-border/40 pt-1">📝 {r.reviewer_note}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Documents */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      المستندات ({docs.length})
                    </h3>
                    {docs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">لا توجد مستندات مرفوعة</p>
                    ) : (
                      <div className="space-y-2">
                        {docs.map((d) => (
                          <div key={d.id} className="flex items-center justify-between gap-2 p-2.5 border border-border/50 rounded-lg flex-wrap bg-background/40">
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium truncate">
                                {FINANCING_DOC_LABELS_AR[d.document_type] || d.document_type}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {d.file_name || d.file_url.split('/').pop()}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Badge variant={d.status === 'approved' ? 'default' : d.status === 'rejected' ? 'destructive' : 'secondary'} className="text-xs">
                                {d.status === 'approved' ? 'موافق' : d.status === 'rejected' ? 'مرفوض' : 'بانتظار'}
                              </Badge>
                              <Button size="sm" variant="ghost" onClick={() => openFile('financing-documents', d.file_url)}>عرض</Button>
                              <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => reviewDoc(d, 'approved')}>
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => reviewDoc(d, 'rejected')}>
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Admin actions */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      إجراءات الإدارة — تنبيه واتساب لحظي للعميل
                    </h3>
                    {selected.notes && (
                      <div className="mb-2 p-2.5 bg-muted/60 rounded-lg text-xs whitespace-pre-wrap max-h-32 overflow-auto border border-border/40">
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <AlertCircle className="w-3 h-3" /> ملاحظات سابقة
                        </div>
                        {selected.notes}
                      </div>
                    )}
                    <Textarea
                      placeholder="ملاحظة للسجل (اختياري) — ستُضاف إلى ملاحظات الطلب وتظهر للعميل"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={2}
                      className="mb-2 bg-background/60"
                    />
                    {/* أزرار سريعة مرتّبة حسب تسلسل الرحلة */}
                    <div className="space-y-2.5">
                      {/* سطر 1 — مسار الموافقة بالتسلسل */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] text-muted-foreground font-semibold ml-1">مسار التقدّم:</span>
                        <Button size="sm" variant="outline" disabled={working} onClick={() => updateStatus('documents_pending')}>
                          <span className="text-[10px] opacity-60 ml-1">2</span> طلب مستندات
                        </Button>
                        <Button size="sm" variant="outline" disabled={working} onClick={() => updateStatus('under_review')}>
                          <span className="text-[10px] opacity-60 ml-1">3</span> قيد التقييم
                        </Button>
                        <Button size="sm" variant="outline" disabled={working} onClick={() => updateStatus('waiting_down_payment')}>
                          <span className="text-[10px] opacity-60 ml-1">4</span> طلب الدفعة
                        </Button>
                        <Button size="sm" variant="outline" disabled={working} onClick={() => updateStatus('contract_pending_signature')}>
                          <span className="text-[10px] opacity-60 ml-1">5</span> توقيع العقد
                        </Button>
                      </div>
                      {/* سطر 2 — قرارات نهائية */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] text-muted-foreground font-semibold ml-1">القرار:</span>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow shadow-emerald-500/20" disabled={working} onClick={() => updateStatus('approved')}>
                          <CheckCircle2 className="w-4 h-4 ml-1" /> موافقة
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={working} onClick={() => updateStatus('active')}>
                          <Zap className="w-4 h-4 ml-1" /> تفعيل التمويل
                        </Button>
                        <Button size="sm" variant="destructive" disabled={working} onClick={() => updateStatus('rejected')}>
                          <XCircle className="w-4 h-4 ml-1" /> رفض
                        </Button>
                        <Button size="sm" variant="outline" disabled={working} onClick={() => updateStatus('cancelled')}>إلغاء</Button>
                        <div className="flex items-center gap-2 ms-auto">
                          <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger className="w-[220px] h-9 bg-background/60">
                              <SelectValue placeholder="حالة أخرى..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[400px]">
                              {STATUS_GROUPS.map((group) => (
                                <React.Fragment key={group.label}>
                                  <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground bg-muted/40 sticky top-0">
                                    {group.label}
                                  </div>
                                  {group.statuses.map((s) => (
                                    <SelectItem key={s} value={s} className="text-xs">
                                      {FINANCING_STATUS_LABELS_AR[s] || s}
                                    </SelectItem>
                                  ))}
                                </React.Fragment>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" disabled={!newStatus || working} onClick={() => newStatus && updateStatus(newStatus)}>تطبيق</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string; accent: string; tone?: string; sub?: string }> = ({ icon, label, value, accent, tone, sub }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br ${accent} backdrop-blur-xl p-4 transition-all hover:shadow-xl`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <div className={`w-8 h-8 rounded-xl bg-background/70 flex items-center justify-center shadow-sm ${tone || ''}`}>{icon}</div>
    </div>
    <div className={`text-xl md:text-2xl font-extrabold tabular-nums ${tone || ''}`} dir="ltr">{value}</div>
    {sub && <div className="text-[10px] text-muted-foreground mt-0.5" dir="ltr">{sub}</div>}
  </motion.div>
);

const InfoRow: React.FC<{ icon?: React.ReactNode; label: string; value: string; ltr?: boolean }> = ({ icon, label, value, ltr }) => (
  <div className="p-2 rounded-lg bg-muted/30 border border-border/30">
    <div className="text-xs text-muted-foreground flex items-center gap-1">{icon} {label}</div>
    <div className="text-sm font-semibold truncate mt-0.5" dir={ltr ? 'ltr' : undefined}>{value}</div>
  </div>
);

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-3 rounded-xl border border-border/40 bg-gradient-to-br from-card via-card to-muted/30 shadow-sm">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-sm font-extrabold mt-1 tabular-nums" dir="ltr">{value}</div>
  </div>
);

export default FinancingAdmin;
