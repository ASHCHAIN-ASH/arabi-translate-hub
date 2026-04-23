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
} from 'lucide-react';
import {
  FINANCING_STATUS_LABELS_AR,
  FINANCING_DOC_LABELS_AR,
  computeFinancingPreview,
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

const STATUS_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'الكل' },
  { key: 'submitted', label: 'جديدة' },
  { key: 'documents_pending', label: 'بانتظار مستندات' },
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

const FinancingAdmin: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [docs, setDocs] = useState<FinancingDocument[]>([]);
  const [adminNote, setAdminNote] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [working, setWorking] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
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
      .channel('financing-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'financing_applications' },
        () => fetchApps(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const selected = useMemo(
    () => apps.find((a) => a.id === selectedId) || null,
    [apps, selectedId],
  );

  useEffect(() => {
    if (!selectedId) {
      setDocs([]);
      return;
    }
    setAdminNote('');
    setNewStatus('');
    (async () => {
      const { data } = await supabase
        .from('financing_documents')
        .select('*')
        .eq('application_id', selectedId)
        .order('created_at', { ascending: false });
      setDocs((data || []) as FinancingDocument[]);
    })();
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
    apps.forEach((a) => {
      c[a.status] = (c[a.status] || 0) + 1;
    });
    return c;
  }, [apps]);

  const updateStatus = async (status: string) => {
    if (!selected) return;
    setWorking(true);
    const { error } = await supabase
      .from('financing_applications')
      .update({
        status: status as any,
        notes: adminNote
          ? `${selected.notes ? selected.notes + '\n---\n' : ''}[${format(
              new Date(),
              'yyyy-MM-dd HH:mm',
            )}] ${adminNote}`
          : selected.notes,
      } as any)
      .eq('id', selected.id);
    setWorking(false);
    if (error) {
      toast.error('تعذر تحديث الحالة: ' + error.message);
      return;
    }
    toast.success(`تم التحديث إلى: ${FINANCING_STATUS_LABELS_AR[status] || status}`);
    setAdminNote('');
    setNewStatus('');
    fetchApps();
  };

  const reviewDoc = async (doc: FinancingDocument, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('financing_documents')
      .update({ status: status as any, review_note: status === 'rejected' ? 'مرفوض من الإدارة' : null } as any)
      .eq('id', doc.id);
    if (error) {
      toast.error('تعذر تحديث المستند');
      return;
    }
    toast.success('تم تحديث المستند');
    if (selectedId) {
      const { data } = await supabase
        .from('financing_documents')
        .select('*')
        .eq('application_id', selectedId)
        .order('created_at', { ascending: false });
      setDocs((data || []) as FinancingDocument[]);
    }
  };

  const openDoc = async (doc: FinancingDocument) => {
    const { data, error } = await supabase.storage
      .from('financing-documents')
      .createSignedUrl(doc.file_url, 60 * 10);
    if (error || !data?.signedUrl) {
      toast.error('تعذر فتح المستند');
      return;
    }
    window.open(data.signedUrl, '_blank');
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-4" dir="rtl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6" />
              Master PayLater — إدارة التمويل
            </h1>
            <p className="text-sm text-muted-foreground">
              مراجعة طلبات التمويل، التحقق من المستندات، والموافقة/الرفض
            </p>
          </div>
          <Button variant="outline" onClick={fetchApps} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex flex-wrap h-auto justify-start">
            {STATUS_FILTERS.map((f) => (
              <TabsTrigger key={f.key} value={f.key} className="gap-2">
                {f.label}
                {counts[f.key] ? (
                  <Badge variant="secondary" className="h-5 px-1.5">
                    {counts[f.key]}
                  </Badge>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: list */}
          <Card className="lg:col-span-5 xl:col-span-4">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم، الهوية، الجوال..."
                  className="pr-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                {loading ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    جاري التحميل...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    لا توجد طلبات
                  </div>
                ) : (
                  <div className="divide-y">
                    {filtered.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelectedId(a.id)}
                        className={`w-full text-right p-3 hover:bg-accent transition ${
                          selectedId === a.id ? 'bg-accent' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="font-medium truncate">
                            {a.applicant_full_name}
                          </div>
                          <Badge variant={statusVariant(a.status) as any} className="text-xs shrink-0">
                            {FINANCING_STATUS_LABELS_AR[a.status] || a.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                          <span>{a.applicant_phone}</span>
                          <span>•</span>
                          <span>{Number(a.total_amount).toLocaleString('ar-SA')} ر.س</span>
                          <span>•</span>
                          <span>{format(new Date(a.created_at), 'yyyy-MM-dd')}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right: details */}
          <Card className="lg:col-span-7 xl:col-span-8">
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
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        #{selected.id.slice(0, 8)}
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
                    <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label="الجوال" value={selected.applicant_phone} />
                    <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="البريد" value={selected.applicant_email || '—'} />
                    <InfoRow icon={<User className="w-3.5 h-3.5" />} label="الهوية" value={selected.applicant_id_number} />
                    <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="جهة العمل" value={selected.employer_name || '—'} />
                    <InfoRow label="الدخل الشهري" value={selected.monthly_income ? `${Number(selected.monthly_income).toLocaleString('ar-SA')} ر.س` : '—'} />
                    <InfoRow label="الالتزامات" value={selected.monthly_commitments ? `${Number(selected.monthly_commitments).toLocaleString('ar-SA')} ر.س` : '—'} />
                    <InfoRow label="المدينة" value={selected.city || '—'} />
                    <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="تاريخ الطلب" value={format(new Date(selected.created_at), 'yyyy-MM-dd HH:mm')} />
                    <InfoRow label="درجة المخاطر" value={selected.risk_level || '—'} />
                  </div>

                  <Separator />

                  {/* Financial summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Stat label="إجمالي" value={`${Number(selected.total_amount).toLocaleString('ar-SA')} ر.س`} />
                    <Stat label="الدفعة الأولى" value={`${Number(selected.down_payment).toLocaleString('ar-SA')} ر.س`} />
                    <Stat label="المتبقي" value={`${Number(selected.remaining_amount).toLocaleString('ar-SA')} ر.س`} />
                    <Stat label={`القسط × ${selected.duration_months}`} value={`${Number(selected.monthly_installment).toLocaleString('ar-SA')} ر.س`} />
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
                          <div
                            key={d.id}
                            className="flex items-center justify-between gap-2 p-2 border rounded-md"
                          >
                            <div className="min-w-0">
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
                              <Button size="sm" variant="ghost" onClick={() => openDoc(d)}>
                                عرض
                              </Button>
                              <Button size="sm" variant="ghost" className="text-green-600" onClick={() => reviewDoc(d, 'approved')}>
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
                    <h3 className="font-semibold mb-2">إجراءات الإدارة</h3>
                    {selected.notes && (
                      <div className="mb-2 p-2 bg-muted rounded text-xs whitespace-pre-wrap">
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
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={working}
                        onClick={() => updateStatus('approved')}
                      >
                        <CheckCircle2 className="w-4 h-4 ml-1" /> موافقة
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={working}
                        onClick={() => updateStatus('rejected')}
                      >
                        <XCircle className="w-4 h-4 ml-1" /> رفض
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={working}
                        onClick={() => updateStatus('documents_pending')}
                      >
                        طلب مستندات
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={working}
                        onClick={() => updateStatus('under_review')}
                      >
                        تحت المراجعة
                      </Button>
                      <div className="flex items-center gap-2 ms-auto">
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="حالة أخرى..." />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTION_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {FINANCING_STATUS_LABELS_AR[s] || s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          disabled={!newStatus || working}
                          onClick={() => newStatus && updateStatus(newStatus)}
                        >
                          تطبيق
                        </Button>
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

const InfoRow: React.FC<{ icon?: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div>
    <div className="text-xs text-muted-foreground flex items-center gap-1">
      {icon} {label}
    </div>
    <div className="text-sm font-medium truncate">{value}</div>
  </div>
);

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-3 rounded-lg border bg-card">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-sm font-bold mt-0.5">{value}</div>
  </div>
);

export default FinancingAdmin;
