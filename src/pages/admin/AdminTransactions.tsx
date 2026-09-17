import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Wallet, TrendingUp, TrendingDown, Clock, CheckCircle2,
  Search, Download, RefreshCw, CreditCard, Banknote, Building2,
  Smartphone, ArrowUpRight, Activity, Calendar, Undo2, AlertTriangle,
  FileText, User, Mail, Phone, Hash, Receipt, ExternalLink, StickyNote
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  created_by: string | null;
  invoice?: {
    invoice_number: string;
    customer_name: string | null;
    customer_email: string | null;
    total_amount: number | null;
    status: string | null;
    user_id: string | null;
  } | null;
}

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'تحويل بنكي',
  cash: 'نقداً',
  card: 'بطاقة ائتمان',
  online: 'دفع إلكتروني',
  wallet: 'محفظة',
  check: 'شيك',
  other: 'أخرى',
};

const METHOD_ICONS: Record<string, any> = {
  bank_transfer: Building2,
  cash: Banknote,
  card: CreditCard,
  online: Smartphone,
  wallet: Wallet,
  check: CreditCard,
  other: CreditCard,
};

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  completed: { label: 'مكتملة', variant: 'default' },
  pending: { label: 'قيد المعالجة', variant: 'secondary' },
  failed: { label: 'فاشلة', variant: 'destructive' },
  refunded: { label: 'مستردة', variant: 'outline' },
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const formatSAR = (n: number) =>
  new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n || 0);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });

const formatDateTime = (d: string) =>
  new Date(d).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' });

const AdminTransactions = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('30');
  const [refundTarget, setRefundTarget] = useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);
  const [detailsTarget, setDetailsTarget] = useState<Payment | null>(null);

  const handleRefund = async () => {
    if (!refundTarget) return;
    setRefunding(true);
    try {
      const newNotes = [refundTarget.notes, `[استرداد] ${refundReason || 'بدون سبب محدد'}`]
        .filter(Boolean).join(' | ');
      const { error } = await supabase
        .from('invoice_payments')
        .update({ status: 'refunded', notes: newNotes })
        .eq('id', refundTarget.id);
      if (error) throw error;

      // Log to invoice timeline (trigger doesn't auto-log refunds)
      await supabase.from('invoice_timeline').insert({
        invoice_id: refundTarget.invoice_id,
        action_type: 'payment_refunded',
        action_label: 'استرداد دفعة',
        action_description: `تم استرداد دفعة بمبلغ ${formatSAR(Number(refundTarget.amount))}${refundReason ? ' - السبب: ' + refundReason : ''}`,
        metadata: { amount: refundTarget.amount, payment_id: refundTarget.id, reason: refundReason },
      });

      toast.success(`تم استرداد ${formatSAR(Number(refundTarget.amount))} وتحديث الفاتورة تلقائياً`);
      setRefundTarget(null);
      setRefundReason('');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'تعذر استرداد الدفعة');
    } finally {
      setRefunding(false);
    }
  };

  const loadPayments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('invoice_payments')
        .select(`
          *,
          invoice:invoices(invoice_number, customer_name, customer_email, total_amount, status, user_id)
        `)
        .order('payment_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      setPayments((data as any) || []);
    } catch (e: any) {
      console.error(e);
      toast.error('تعذر تحميل المدفوعات');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
    const channel = supabase
      .channel('admin-transactions-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoice_payments' }, (payload) => {
        loadPayments(true);
        if (payload.eventType === 'INSERT') {
          const amt = (payload.new as any)?.amount;
          toast.success(`💰 دفعة جديدة: ${formatSAR(Number(amt) || 0)}`);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => loadPayments(true))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadPayments]);

  // Filter by period
  const periodFiltered = useMemo(() => {
    if (periodFilter === 'all') return payments;
    const days = parseInt(periodFilter, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return payments.filter(p => new Date(p.payment_date) >= cutoff);
  }, [payments, periodFilter]);

  // Search + method + status filters
  const filtered = useMemo(() => {
    return periodFiltered.filter(p => {
      if (methodFilter !== 'all' && p.payment_method !== methodFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.invoice?.invoice_number?.toLowerCase().includes(q) ||
          p.invoice?.customer_name?.toLowerCase().includes(q) ||
          p.invoice?.customer_email?.toLowerCase().includes(q) ||
          p.reference_number?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [periodFiltered, search, methodFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const completed = periodFiltered.filter(p => p.status === 'completed');
    const pending = periodFiltered.filter(p => p.status === 'pending');
    const failed = periodFiltered.filter(p => p.status === 'failed');
    const totalRevenue = completed.reduce((s, p) => s + Number(p.amount || 0), 0);
    const pendingAmount = pending.reduce((s, p) => s + Number(p.amount || 0), 0);
    const today = new Date().toISOString().split('T')[0];
    const todayCount = periodFiltered.filter(p => p.payment_date === today).length;
    const todayAmount = periodFiltered
      .filter(p => p.payment_date === today && p.status === 'completed')
      .reduce((s, p) => s + Number(p.amount || 0), 0);

    return {
      totalRevenue,
      pendingAmount,
      completedCount: completed.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      todayCount,
      todayAmount,
      avgPayment: completed.length ? totalRevenue / completed.length : 0,
    };
  }, [periodFiltered]);

  // Daily revenue chart
  const dailyData = useMemo(() => {
    const days = periodFilter === 'all' ? 30 : Math.min(parseInt(periodFilter, 10), 60);
    const map = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map.set(key, 0);
    }
    periodFiltered
      .filter(p => p.status === 'completed')
      .forEach(p => {
        const key = p.payment_date;
        if (map.has(key)) map.set(key, (map.get(key) || 0) + Number(p.amount || 0));
      });
    return Array.from(map.entries()).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
      amount,
    }));
  }, [periodFiltered, periodFilter]);

  // Method distribution
  const methodData = useMemo(() => {
    const map = new Map<string, number>();
    periodFiltered
      .filter(p => p.status === 'completed')
      .forEach(p => {
        map.set(p.payment_method, (map.get(p.payment_method) || 0) + Number(p.amount || 0));
      });
    return Array.from(map.entries()).map(([method, amount]) => ({
      name: METHOD_LABELS[method] || method,
      value: amount,
    }));
  }, [periodFiltered]);

  const exportCSV = () => {
    const headers = ['التاريخ', 'رقم الفاتورة', 'العميل', 'المبلغ', 'طريقة الدفع', 'المرجع', 'الحالة'];
    const rows = filtered.map(p => [
      formatDate(p.payment_date),
      p.invoice?.invoice_number || '',
      p.invoice?.customer_name || '',
      String(p.amount),
      METHOD_LABELS[p.payment_method] || p.payment_method,
      p.reference_number || '',
      STATUS_LABELS[p.status]?.label || p.status,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير المدفوعات');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-arabic-formal font-bold flex items-center gap-3">
              <Wallet className="h-8 w-8 text-primary" />
              إدارة المدفوعات
              {refreshing && (
                <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3 animate-pulse text-green-500" />
                  مباشر
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              متابعة لحظية لجميع المدفوعات والمعاملات المالية
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={periodFilter} onValueChange={setPeriodFilter}>
              <TabsList>
                <TabsTrigger value="7">7 أيام</TabsTrigger>
                <TabsTrigger value="30">30 يوم</TabsTrigger>
                <TabsTrigger value="90">90 يوم</TabsTrigger>
                <TabsTrigger value="all">الكل</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon" onClick={() => loadPayments()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 ml-2" />
              تصدير CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-r-4 border-r-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">إجمالي المحصّل</p>
                  <p className="text-2xl font-bold text-green-600">{formatSAR(stats.totalRevenue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.completedCount} عملية مكتملة</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-r-4 border-r-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">قيد المعالجة</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatSAR(stats.pendingAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.pendingCount} عملية</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-r-4 border-r-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">مدفوعات اليوم</p>
                  <p className="text-2xl font-bold text-primary">{formatSAR(stats.todayAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.todayCount} عملية اليوم</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-r-4 border-r-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">متوسط الدفعة</p>
                  <p className="text-2xl font-bold">{formatSAR(stats.avgPayment)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.failedCount > 0 && (
                      <span className="text-destructive flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        {stats.failedCount} فاشلة
                      </span>
                    )}
                    {stats.failedCount === 0 && 'لا توجد عمليات فاشلة'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <ArrowUpRight className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>المدفوعات اليومية</CardTitle>
              <CardDescription>تطور الإيرادات المحصّلة عبر الفترة</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    formatter={(v: any) => formatSAR(Number(v))}
                  />
                  <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>طرق الدفع</CardTitle>
              <CardDescription>توزيع المبالغ حسب الطريقة</CardDescription>
            </CardHeader>
            <CardContent>
              {methodData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  لا توجد بيانات
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={methodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      dataKey="value"
                      label={(entry: any) => entry.name}
                    >
                      {methodData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatSAR(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle>سجل المدفوعات</CardTitle>
                <CardDescription>{filtered.length} من أصل {periodFiltered.length} عملية</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث برقم الفاتورة، العميل، المرجع..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-10 w-full md:w-72"
                  />
                </div>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-full md:w-44">
                    <SelectValue placeholder="طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الطرق</SelectItem>
                    {Object.entries(METHOD_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الحالات</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>لا توجد مدفوعات مطابقة</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الفاتورة</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الطريقة</TableHead>
                      <TableHead>المرجع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-left">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => {
                      const Icon = METHOD_ICONS[p.payment_method] || CreditCard;
                      const status = STATUS_LABELS[p.status] || { label: p.status, variant: 'outline' as const };
                      return (
                        <TableRow key={p.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => setDetailsTarget(p)}>
                          <TableCell className="whitespace-nowrap text-sm">
                            <div>{formatDate(p.payment_date)}</div>
                            <div className="text-xs text-muted-foreground">{formatDateTime(p.created_at)}</div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {p.invoice?.invoice_number || '—'}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{p.invoice?.customer_name || '—'}</div>
                            <div className="text-xs text-muted-foreground">{p.invoice?.customer_email || ''}</div>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            {formatSAR(Number(p.amount))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{METHOD_LABELS[p.payment_method] || p.payment_method}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-mono">{p.reference_number || '—'}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              {p.status === 'completed' && <CheckCircle2 className="h-3 w-3 ml-1" />}
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left" onClick={(e) => e.stopPropagation()}>
                            {p.status === 'completed' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRefundTarget(p)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Undo2 className="h-4 w-4 ml-1" />
                                استرداد
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Refund Confirmation Dialog */}
        <AlertDialog open={!!refundTarget} onOpenChange={(open) => !open && setRefundTarget(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                تأكيد استرداد الدفعة
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3 pt-2">
                  <div className="text-sm">
                    سيتم تغيير حالة الدفعة إلى <span className="font-bold text-destructive">مستردة</span> وتحديث الفاتورة تلقائياً (إعادة احتساب المبلغ المدفوع وحالتها).
                  </div>
                  {refundTarget && (
                    <div className="rounded-lg border bg-muted/30 p-3 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المبلغ:</span>
                        <span className="font-bold">{formatSAR(Number(refundTarget.amount))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الفاتورة:</span>
                        <span className="font-mono">{refundTarget.invoice?.invoice_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">العميل:</span>
                        <span>{refundTarget.invoice?.customer_name || '—'}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium block mb-1.5">سبب الاسترداد (اختياري)</label>
                    <Textarea
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="مثال: طلب العميل، خطأ في الفاتورة..."
                      rows={3}
                    />
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={refunding}>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => { e.preventDefault(); handleRefund(); }}
                disabled={refunding}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {refunding ? <RefreshCw className="h-4 w-4 ml-2 animate-spin" /> : <Undo2 className="h-4 w-4 ml-2" />}
                تأكيد الاسترداد
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Payment Details Dialog */}
        <Dialog open={!!detailsTarget} onOpenChange={(open) => !open && setDetailsTarget(null)}>
          <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                تفاصيل الدفعة
              </DialogTitle>
              <DialogDescription>
                عرض شامل لبيانات الدفعة والفاتورة والعميل
              </DialogDescription>
            </DialogHeader>

            {detailsTarget && (() => {
              const Icon = METHOD_ICONS[detailsTarget.payment_method] || CreditCard;
              const status = STATUS_LABELS[detailsTarget.status] || { label: detailsTarget.status, variant: 'outline' as const };
              const inv = detailsTarget.invoice;
              const total = Number(inv?.total_amount || 0);
              return (
                <div className="space-y-5">
                  {/* Hero amount */}
                  <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-accent/5 p-5 text-center">
                    <p className="text-xs text-muted-foreground mb-1">المبلغ المدفوع</p>
                    <p className="text-4xl font-bold text-primary">{formatSAR(Number(detailsTarget.amount))}</p>
                    <Badge variant={status.variant} className="mt-2">
                      {detailsTarget.status === 'completed' && <CheckCircle2 className="h-3 w-3 ml-1" />}
                      {status.label}
                    </Badge>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      بيانات الدفعة
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">طريقة الدفع</div>
                          <div className="font-medium">{METHOD_LABELS[detailsTarget.payment_method] || detailsTarget.payment_method}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">تاريخ الدفع</div>
                          <div className="font-medium">{formatDate(detailsTarget.payment_date)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">رقم المرجع</div>
                          <div className="font-mono text-xs">{detailsTarget.reference_number || '—'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">سُجّلت في</div>
                          <div className="font-medium text-xs">{formatDateTime(detailsTarget.created_at)}</div>
                        </div>
                      </div>
                    </div>
                    {detailsTarget.notes && (
                      <div className="mt-2 p-3 rounded-lg bg-muted/30 text-sm">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                          <StickyNote className="h-3.5 w-3.5" />
                          ملاحظات
                        </div>
                        <div className="whitespace-pre-wrap">{detailsTarget.notes}</div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Invoice Info */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      بيانات الفاتورة
                    </h4>
                    {inv ? (
                      <div className="rounded-lg border p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">رقم الفاتورة</span>
                          <span className="font-mono font-bold">{inv.invoice_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">إجمالي الفاتورة</span>
                          <span className="font-bold">{formatSAR(total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">المتبقي بعد هذه الدفعة</span>
                          <span className="font-bold text-orange-600">
                            {formatSAR(Math.max(0, total - Number(detailsTarget.amount)))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">حالة الفاتورة</span>
                          <Badge variant="outline">{inv.status || '—'}</Badge>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">لا توجد بيانات فاتورة مرتبطة</p>
                    )}
                  </div>

                  <Separator />

                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-muted-foreground" />
                      بيانات العميل
                    </h4>
                    <div className="rounded-lg border p-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{inv?.customer_name || '—'}</span>
                      </div>
                      {inv?.customer_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${inv.customer_email}`} className="text-primary hover:underline">
                            {inv.customer_email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => setDetailsTarget(null)}>إغلاق</Button>
              {detailsTarget?.invoice_id && (
                <Button asChild>
                  <Link to={`/adminfekrah/invoices/${detailsTarget.invoice_id}`}>
                    <ExternalLink className="h-4 w-4 ml-2" />
                    فتح صفحة الفاتورة
                  </Link>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
