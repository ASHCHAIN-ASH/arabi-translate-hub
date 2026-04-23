import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  CheckCircle2, XCircle, FileText, Search, RefreshCw, User,
  Phone, Mail, Building2, Wallet, Calendar, AlertCircle,
  Receipt, TrendingUp, Clock, Sparkles, ShieldCheck, Banknote,
} from 'lucide-react';
import {
  FINANCING_STATUS_LABELS_AR,
  FINANCING_DOC_LABELS_AR,
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

const STATUS_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'الكل' },
  { key: 'submitted', label: 'جديدة' },
  { key: 'documents_pending', label: 'مستندات' },
  { key: 'under_review', label: 'قيد المراجعة' },
  { key: 'waiting_down_payment', label: 'بانتظار الدفعة' },
  { key: 'contract_pending_signature', label: 'بانتظار التوقيع' },
  { key: 'approved', label: 'موافقة' },
  { key: 'active', label: 'نشطة' },
  { key: 'rejected', label: 'مرفوضة' },
];

const ACTION_STATUSES = [
  'documents_pending',
  'under_review',
  'waiting_down_payment',
  'contract_pending_signature',
  'approved',
  'rejected',
  'cancelled',
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
  const [adminNote, setAdminNote] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [working, setWorking] = useState(false);

  const fetchApps = async () => {
    const { data, error } = await supabase
      .from('financing_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('تعذر تحميل الطلبات');
      console.error(error);
    } else {
      setApps((data || []) as Application[]);
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
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const selected = useMemo(
    () => apps.find((a) => a.id === selectedId) || null,
    [apps, selectedId],
  );

  const loadDetails = async (id: string) => {
    const [{ data: dd }, { data: rr }] = await Promise.all([
      supabase.from('financing_documents').select('*').eq('application_id', id).order('created_at', { ascending: false }),
      supabase.from('financing_payment_receipts').select('*').eq('application_id', id).order('created_at', { ascending: false }),
    ]);
    setDocs((dd || []) as FinancingDocument[]);
    setReceipts((rr || []) as PaymentReceipt[]);
  };

  useEffect(() => {
    if (!selectedId) { setDocs([]); setReceipts([]); return; }
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
    return { active, pending, totalFunded, pendingReceipts };
  }, [apps]);

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

  const openFile = async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);
    if (error || !data?.signedUrl) { toast.error('تعذر فتح الملف'); return; }
    window.open(data.signedUrl, '_blank');
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in" dir="rtl">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="relative flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
                <Banknote className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  Master PayLater
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </h1>
                <p className="text-sm text-muted-foreground">لوحة فريق التمويل والائتمان والمتابعة — تحديث لحظي</p>
              </div>
            </div>
            <Button variant="outline" onClick={fetchApps} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard icon={<TrendingUp className="w-4 h-4" />} label="نشطة" value={String(stats.active)} accent="from-emerald-500/20 to-emerald-500/5" />
          <KpiCard icon={<Clock className="w-4 h-4" />} label="قيد المعالجة" value={String(stats.pending)} accent="from-amber-500/20 to-amber-500/5" />
          <KpiCard icon={<Receipt className="w-4 h-4" />} label="بانتظار الدفعة" value={String(stats.pendingReceipts)} accent="from-sky-500/20 to-sky-500/5" />
          <KpiCard icon={<Wallet className="w-4 h-4" />} label="إجمالي المُموَّل" value={`${fmt(stats.totalFunded)} ر.س`} accent="from-primary/20 to-primary/5" />
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex flex-wrap h-auto justify-start bg-muted/50 backdrop-blur">
            {STATUS_FILTERS.map((f) => (
              <TabsTrigger key={f.key} value={f.key} className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                {f.label}
                {counts[f.key] ? (<Badge variant="secondary" className="h-5 px-1.5">{counts[f.key]}</Badge>) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: list */}
          <Card className="lg:col-span-5 xl:col-span-4 border-border/60 backdrop-blur bg-card/80">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم، الهوية، الجوال..."
                  className="pr-9 bg-background/60"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-380px)] min-h-[400px]">
                {loading ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">جاري التحميل...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">لا توجد طلبات</div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {filtered.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelectedId(a.id)}
                        className={`w-full text-right p-3 hover:bg-accent/50 transition-all duration-200 ${
                          selectedId === a.id ? 'bg-accent/70 border-r-2 border-primary' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="font-medium truncate">{a.applicant_full_name}</div>
                          <Badge variant={statusVariant(a.status) as any} className="text-xs shrink-0">
                            {FINANCING_STATUS_LABELS_AR[a.status] || a.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                          <span dir="ltr">{a.applicant_phone}</span>
                          <span>•</span>
                          <span dir="ltr">{fmt(a.total_amount)} ر.س</span>
                          <span>•</span>
                          <span dir="ltr">{format(new Date(a.created_at), 'yyyy-MM-dd')}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right: details */}
          <Card className="lg:col-span-7 xl:col-span-8 border-border/60 backdrop-blur bg-card/80">
            {!selected ? (
              <CardContent className="p-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                اختر طلباً من القائمة لعرض التفاصيل
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {selected.applicant_full_name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 font-mono" dir="ltr">
                        #{selected.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <Badge variant={statusVariant(selected.status) as any}>
                      {FINANCING_STATUS_LABELS_AR[selected.status] || selected.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <Separator />

                  {/* Payment Receipts */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
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
                          <div key={r.id} className="p-3 border rounded-lg bg-gradient-to-br from-background to-muted/30 space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 text-sm">
                                {r.payment_method === 'wallet' ? <Wallet className="w-4 h-4 text-primary" /> : <Banknote className="w-4 h-4 text-emerald-600" />}
                                <span className="font-medium">{r.payment_method === 'wallet' ? 'محفظة رقمية' : 'تحويل بنكي'}</span>
                                <span className="text-muted-foreground" dir="ltr">{fmt(r.amount)} ر.س</span>
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
                              <div className="flex items-center gap-1 pt-1">
                                {r.receipt_file_url && (
                                  <Button size="sm" variant="ghost" onClick={() => openFile('payment-receipts', r.receipt_file_url!)}>
                                    عرض الإيصال
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
                              <div className="text-xs text-muted-foreground border-t pt-1">📝 {r.reviewer_note}</div>
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
                      <FileText className="w-4 h-4" />
                      المستندات ({docs.length})
                    </h3>
                    {docs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">لا توجد مستندات مرفوعة</p>
                    ) : (
                      <div className="space-y-2">
                        {docs.map((d) => (
                          <div key={d.id} className="flex items-center justify-between gap-2 p-2 border rounded-md flex-wrap">
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
                      إجراءات الإدارة — تنبيه واتساب لحظي
                    </h3>
                    {selected.notes && (
                      <div className="mb-2 p-2 bg-muted rounded text-xs whitespace-pre-wrap max-h-32 overflow-auto">
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <AlertCircle className="w-3 h-3" /> ملاحظات سابقة
                        </div>
                        {selected.notes}
                      </div>
                    )}
                    <Textarea
                      placeholder="ملاحظة للسجل (اختياري) — ستُضاف إلى ملاحظات الطلب"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={2}
                      className="mb-2"
                    />
                    <div className="flex flex-wrap gap-2 items-center">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={working} onClick={() => updateStatus('approved')}>
                        <CheckCircle2 className="w-4 h-4 ml-1" /> موافقة
                      </Button>
                      <Button size="sm" variant="destructive" disabled={working} onClick={() => updateStatus('rejected')}>
                        <XCircle className="w-4 h-4 ml-1" /> رفض
                      </Button>
                      <Button size="sm" variant="outline" disabled={working} onClick={() => updateStatus('documents_pending')}>طلب مستندات</Button>
                      <Button size="sm" variant="outline" disabled={working} onClick={() => updateStatus('under_review')}>تحت المراجعة</Button>
                      <Button size="sm" variant="outline" disabled={working} onClick={() => updateStatus('waiting_down_payment')}>طلب الدفعة</Button>
                      <div className="flex items-center gap-2 ms-auto">
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="حالة أخرى..." />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTION_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>{FINANCING_STATUS_LABELS_AR[s] || s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="sm" disabled={!newStatus || working} onClick={() => newStatus && updateStatus(newStatus)}>تطبيق</Button>
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

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string; accent: string }> = ({ icon, label, value, accent }) => (
  <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${accent} backdrop-blur p-4 transition-all hover:scale-[1.02] hover:shadow-lg`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="w-7 h-7 rounded-lg bg-background/60 flex items-center justify-center">{icon}</div>
    </div>
    <div className="text-xl md:text-2xl font-bold" dir="ltr">{value}</div>
  </div>
);

const InfoRow: React.FC<{ icon?: React.ReactNode; label: string; value: string; ltr?: boolean }> = ({ icon, label, value, ltr }) => (
  <div>
    <div className="text-xs text-muted-foreground flex items-center gap-1">{icon} {label}</div>
    <div className="text-sm font-medium truncate" dir={ltr ? 'ltr' : undefined}>{value}</div>
  </div>
);

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-3 rounded-lg border bg-gradient-to-br from-card to-muted/30">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-sm font-bold mt-0.5" dir="ltr">{value}</div>
  </div>
);

export default FinancingAdmin;
