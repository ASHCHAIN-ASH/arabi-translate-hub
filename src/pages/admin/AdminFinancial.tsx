import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import {
  DollarSign, TrendingUp, CreditCard, FileText,
  RefreshCw, BarChart3, Receipt, PieChart, AlertCircle,
  CheckCircle2, Clock, Wallet, Activity, Radio
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import { motion } from 'framer-motion';
import { format, subDays, startOfDay } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string | null;
  customer_email: string | null;
  total_amount: number | null;
  paid_amount: number;
  status: string | null;
  issue_date: string;
  due_date: string | null;
  created_at: string;
  currency: string;
}

interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: string;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
}

interface Stats {
  totalRevenue: number;        // مدفوع فعلياً (paid_amount عبر الفواتير)
  outstanding: number;          // متبقي = total - paid للفواتير غير الملغية
  pendingInvoices: number;      // عدد الفواتير المعلقة/المرسلة
  overdueAmount: number;        // مبالغ الفواتير المتأخرة
  overdueCount: number;
  paidInvoicesCount: number;
  totalInvoices: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  paymentsCount: number;        // عدد عمليات الدفع المسجلة
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'مسودة',
  pending: 'معلقة',
  sent: 'مرسلة',
  partially_paid: 'مدفوعة جزئياً',
  paid: 'مدفوعة',
  overdue: 'متأخرة',
  cancelled: 'ملغاة',
};

const STATUS_BADGE: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-yellow-100 text-yellow-700',
  sent: 'bg-blue-100 text-blue-700',
  partially_paid: 'bg-orange-100 text-orange-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-muted text-muted-foreground line-through',
};

const PAY_METHOD_LABEL: Record<string, string> = {
  bank_transfer: 'تحويل بنكي',
  cash: 'نقدي',
  card: 'بطاقة',
  wallet: 'محفظة',
  online: 'دفع إلكتروني',
};

const formatCurrency = (amount: number, currency = 'SAR') =>
  new Intl.NumberFormat('ar-SA', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount || 0);

const AdminFinancial = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [liveActive, setLiveActive] = useState(false);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [invRes, payRes] = await Promise.all([
        supabase
          .from('invoices')
          .select('id, invoice_number, customer_name, customer_email, total_amount, paid_amount, status, issue_date, due_date, created_at, currency')
          .order('created_at', { ascending: false }),
        supabase
          .from('invoice_payments')
          .select('id, invoice_id, amount, payment_method, payment_date, status, reference_number, notes, created_at')
          .order('created_at', { ascending: false }),
      ]);

      if (invRes.error) throw invRes.error;
      if (payRes.error) throw payRes.error;

      setInvoices((invRes.data || []) as Invoice[]);
      setPayments((payRes.data || []) as Payment[]);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error loading financial data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ===== Realtime subscription =====
  useEffect(() => {
    const channel = supabase
      .channel('admin-financial-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => {
        loadData(true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoice_payments' }, () => {
        loadData(true);
      })
      .subscribe((status) => {
        setLiveActive(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  // ===== Derived stats =====
  const stats: Stats = useMemo(() => {
    const today = startOfDay(new Date());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = monthStart;

    let totalRevenue = 0;
    let outstanding = 0;
    let overdueAmount = 0;
    let overdueCount = 0;
    let pendingInvoices = 0;
    let paidInvoicesCount = 0;

    for (const inv of invoices) {
      const total = Number(inv.total_amount || 0);
      const paid = Number(inv.paid_amount || 0);
      const status = inv.status || 'draft';

      if (status !== 'cancelled') {
        totalRevenue += paid;
        outstanding += Math.max(0, total - paid);
      }

      if (status === 'paid') paidInvoicesCount++;
      if (['pending', 'sent', 'partially_paid'].includes(status)) pendingInvoices++;

      const isOverdue =
        status === 'overdue' ||
        (inv.due_date && new Date(inv.due_date) < today && !['paid', 'cancelled'].includes(status));
      if (isOverdue) {
        overdueCount++;
        overdueAmount += Math.max(0, total - paid);
      }
    }

    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;
    for (const p of payments) {
      if (p.status !== 'completed') continue;
      const d = new Date(p.payment_date || p.created_at);
      if (d >= monthStart) thisMonthRevenue += Number(p.amount || 0);
      else if (d >= lastMonthStart && d < lastMonthEnd) lastMonthRevenue += Number(p.amount || 0);
    }

    return {
      totalRevenue,
      outstanding,
      pendingInvoices,
      overdueAmount,
      overdueCount,
      paidInvoicesCount,
      totalInvoices: invoices.length,
      thisMonthRevenue,
      lastMonthRevenue,
      paymentsCount: payments.filter(p => p.status === 'completed').length,
    };
  }, [invoices, payments]);

  const monthChange = useMemo(() => {
    if (stats.lastMonthRevenue === 0) return stats.thisMonthRevenue > 0 ? 100 : 0;
    return ((stats.thisMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100;
  }, [stats]);

  // ===== Chart: revenue last 30 days =====
  const dailyRevenue = useMemo(() => {
    const days: { name: string; date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = startOfDay(subDays(new Date(), i));
      days.push({
        name: format(d, 'd MMM', { locale: ar }),
        date: format(d, 'yyyy-MM-dd'),
        revenue: 0,
      });
    }
    const map = new Map(days.map(d => [d.date, d]));
    for (const p of payments) {
      if (p.status !== 'completed') continue;
      const key = format(new Date(p.payment_date || p.created_at), 'yyyy-MM-dd');
      const slot = map.get(key);
      if (slot) slot.revenue += Number(p.amount || 0);
    }
    return days;
  }, [payments]);

  // ===== Chart: invoice status distribution =====
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const inv of invoices) {
      const s = inv.status || 'draft';
      counts[s] = (counts[s] || 0) + 1;
    }
    const palette: Record<string, string> = {
      paid: 'hsl(142 76% 45%)',
      partially_paid: 'hsl(25 95% 55%)',
      sent: 'hsl(217 91% 60%)',
      pending: 'hsl(48 96% 53%)',
      overdue: 'hsl(0 84% 60%)',
      draft: 'hsl(215 20% 65%)',
      cancelled: 'hsl(215 14% 45%)',
    };
    return Object.entries(counts).map(([k, v]) => ({
      name: STATUS_LABELS[k] || k,
      value: v,
      color: palette[k] || 'hsl(217 91% 60%)',
    }));
  }, [invoices]);

  // ===== Chart: payment methods =====
  const paymentMethods = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of payments) {
      if (p.status !== 'completed') continue;
      const k = p.payment_method || 'other';
      map[k] = (map[k] || 0) + Number(p.amount || 0);
    }
    return Object.entries(map).map(([method, total]) => ({
      method: PAY_METHOD_LABEL[method] || method,
      total,
    }));
  }, [payments]);

  const recentPayments = useMemo(() => payments.slice(0, 12), [payments]);
  const recentInvoices = useMemo(() => invoices.slice(0, 12), [invoices]);
  const invoiceById = useMemo(() => new Map(invoices.map(i => [i.id, i])), [invoices]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <Wallet className="w-7 h-7 text-primary" />
              اللوحة المالية
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              نظرة لحظية على الإيرادات والفواتير والمدفوعات
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Radio className={`w-3.5 h-3.5 ${liveActive ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
              {liveActive ? 'تحديث لحظي مفعّل' : 'الاتصال اللحظي معطّل'}
              <span className="hidden sm:inline">· آخر تحديث {format(lastUpdate, 'HH:mm:ss')}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => loadData(false)} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الإيرادات المُحصّلة</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.paymentsCount} دفعة مكتملة
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">المستحقات غير المُحصّلة</p>
                    <p className="text-2xl font-bold text-yellow-700 mt-1">{formatCurrency(stats.outstanding)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.pendingInvoices} فاتورة بانتظار الدفع
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">فواتير متأخرة</p>
                    <p className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(stats.overdueAmount)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.overdueCount} فاتورة تجاوزت موعد الاستحقاق
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إيرادات الشهر الحالي</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(stats.thisMonthRevenue)}</p>
                    <p className={`text-xs mt-1 flex items-center gap-1 ${monthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`w-3 h-3 ${monthChange < 0 ? 'rotate-180' : ''}`} />
                      {monthChange >= 0 ? '+' : ''}{monthChange.toFixed(1)}% مقارنة بالشهر الماضي
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-5 h-5 text-primary" />
                الإيرادات اليومية — آخر 30 يوماً
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dailyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'الإيرادات']}
                    contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(217 91% 60%)" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="w-5 h-5 text-primary" />
                توزيع حالات الفواتير
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statusDistribution.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                  لا توجد فواتير بعد
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <RechartsPie>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={45}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {statusDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment methods chart */}
        {paymentMethods.length > 0 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="w-5 h-5 text-primary" />
                الإيرادات حسب طريقة الدفع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={paymentMethods} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="method" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="total" fill="hsl(217 91% 60%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Tabs: Recent payments + Recent invoices */}
        <Tabs defaultValue="payments" className="w-full">
          <TabsList>
            <TabsTrigger value="payments" className="gap-2">
              <Receipt className="w-4 h-4" /> أحدث المدفوعات
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2">
              <FileText className="w-4 h-4" /> أحدث الفواتير
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الفاتورة</TableHead>
                        <TableHead className="text-right">العميل</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                        <TableHead className="text-right">طريقة الدفع</TableHead>
                        <TableHead className="text-right">المرجع</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                            لم تُسجَّل أي دفعات بعد
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentPayments.map((p) => {
                          const inv = invoiceById.get(p.invoice_id);
                          return (
                            <TableRow key={p.id}>
                              <TableCell className="font-mono text-xs">{inv?.invoice_number || '—'}</TableCell>
                              <TableCell className="font-medium">{inv?.customer_name || '—'}</TableCell>
                              <TableCell className="font-bold text-green-700">{formatCurrency(p.amount, inv?.currency || 'SAR')}</TableCell>
                              <TableCell>{PAY_METHOD_LABEL[p.payment_method] || p.payment_method}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{p.reference_number || '—'}</TableCell>
                              <TableCell>
                                <Badge className={p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                  {p.status === 'completed' ? (
                                    <><CheckCircle2 className="w-3 h-3 ml-1" /> مكتملة</>
                                  ) : p.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs">
                                {format(new Date(p.payment_date || p.created_at), 'd MMM yyyy', { locale: ar })}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الفاتورة</TableHead>
                        <TableHead className="text-right">العميل</TableHead>
                        <TableHead className="text-right">الإجمالي</TableHead>
                        <TableHead className="text-right">المدفوع</TableHead>
                        <TableHead className="text-right">المتبقي</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الاستحقاق</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                            لا توجد فواتير
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentInvoices.map((inv) => {
                          const total = Number(inv.total_amount || 0);
                          const paid = Number(inv.paid_amount || 0);
                          const status = inv.status || 'draft';
                          return (
                            <TableRow key={inv.id}>
                              <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                              <TableCell className="font-medium">{inv.customer_name || '—'}</TableCell>
                              <TableCell className="font-bold">{formatCurrency(total, inv.currency)}</TableCell>
                              <TableCell className="text-green-700">{formatCurrency(paid, inv.currency)}</TableCell>
                              <TableCell className={total - paid > 0 ? 'text-orange-700 font-medium' : 'text-muted-foreground'}>
                                {formatCurrency(Math.max(0, total - paid), inv.currency)}
                              </TableCell>
                              <TableCell>
                                <Badge className={STATUS_BADGE[status] || 'bg-muted text-muted-foreground'}>
                                  {STATUS_LABELS[status] || status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs">
                                {inv.due_date ? format(new Date(inv.due_date), 'd MMM yyyy', { locale: ar }) : '—'}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminFinancial;
