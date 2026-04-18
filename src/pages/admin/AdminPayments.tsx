import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  CreditCard, RefreshCw, ShieldCheck, AlertTriangle, Search,
  CheckCircle2, XCircle, Clock, PlayCircle, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type Intent = {
  id: string;
  internal_order_number: string;
  external_transaction_no: string | null;
  amount: number;
  currency: string;
  status: string;
  purpose: string;
  user_id: string;
  invoice_id: string | null;
  checkout_url: string | null;
  failure_reason: string | null;
  created_at: string;
  succeeded_at: string | null;
  failed_at: string | null;
};

type Webhook = {
  id: string;
  provider: string;
  event_type: string | null;
  external_transaction_no: string | null;
  internal_order_number: string | null;
  processed: boolean;
  signature_status: string;
  error_message: string | null;
  created_at: string;
};

type ReconRun = {
  id: string;
  run_type: string;
  status: string;
  total_checked: number;
  total_matched: number;
  total_mismatched: number;
  started_at: string;
  finished_at: string | null;
};

const statusBadge = (s: string) => {
  const map: Record<string, { color: string; label: string; icon: any }> = {
    succeeded: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'ناجحة', icon: CheckCircle2 },
    pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', label: 'معلّقة', icon: Clock },
    processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'قيد المعالجة', icon: Clock },
    created: { color: 'bg-slate-100 text-slate-800 border-slate-200', label: 'منشأة', icon: Clock },
    failed: { color: 'bg-rose-100 text-rose-800 border-rose-200', label: 'فاشلة', icon: XCircle },
    cancelled: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'ملغاة', icon: XCircle },
  };
  const v = map[s] || { color: 'bg-muted text-foreground', label: s, icon: Clock };
  const Icon = v.icon;
  return (
    <Badge variant="outline" className={`${v.color} gap-1 font-bold text-[10px]`}>
      <Icon className="w-3 h-3" /> {v.label}
    </Badge>
  );
};

const fmt = (n: number) => `${Number(n || 0).toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ر.س`;

const AdminPayments: React.FC = () => {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [runs, setRuns] = useState<ReconRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    try {
      const [a, b, c] = await Promise.all([
        supabase.from('payment_intents').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('gateway_webhooks').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('payment_reconciliation_runs').select('*').order('started_at', { ascending: false }).limit(20),
      ]);
      setIntents((a.data as any) || []);
      setWebhooks((b.data as any) || []);
      setRuns((c.data as any) || []);
    } catch (e: any) {
      toast.error('فشل التحميل', { description: e.message });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('admin-payments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_intents' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gateway_webhooks' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const stats = useMemo(() => {
    const total = intents.reduce((s, i) => s + Number(i.amount || 0), 0);
    const succeeded = intents.filter(i => i.status === 'succeeded');
    const succeededAmt = succeeded.reduce((s, i) => s + Number(i.amount || 0), 0);
    return {
      count: intents.length,
      total,
      succeeded: succeeded.length,
      succeededAmt,
      pending: intents.filter(i => ['pending', 'processing', 'created'].includes(i.status)).length,
      failed: intents.filter(i => ['failed', 'cancelled'].includes(i.status)).length,
    };
  }, [intents]);

  const filtered = useMemo(() => {
    return intents.filter(i => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (q) {
        const t = q.toLowerCase();
        return i.internal_order_number.toLowerCase().includes(t)
          || (i.external_transaction_no || '').toLowerCase().includes(t)
          || i.purpose.toLowerCase().includes(t);
      }
      return true;
    });
  }, [intents, q, statusFilter]);

  const runReconciliation = async () => {
    setReconciling(true);
    try {
      const { data, error } = await supabase.functions.invoke('reconcile-payments', {
        body: { run_type: 'manual', lookback_hours: 168 },
      });
      if (error) throw error;
      toast.success('اكتملت المطابقة', {
        description: `فُحص ${data?.checked} • متطابق ${data?.matched} • مختلف ${data?.mismatched}`,
      });
      load();
    } catch (e: any) {
      toast.error('فشلت المطابقة', { description: e.message });
    } finally { setReconciling(false); }
  };

  const reverify = async (orderNumber: string) => {
    setVerifying(orderNumber);
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { internal_order_number: orderNumber },
      });
      if (error) throw error;
      toast.success(`الحالة الفعلية: ${data?.status || 'غير معروف'}`);
      load();
    } catch (e: any) {
      toast.error('فشل التحقق', { description: e.message });
    } finally { setVerifying(null); }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">بوابة المدفوعات</h1>
              <p className="text-sm text-muted-foreground">نظام دفع داخلي + مطابقة + إشعارات</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={load} className="gap-2">
              <RefreshCw className="w-4 h-4" /> تحديث
            </Button>
            <Button onClick={runReconciliation} disabled={reconciling}
              className="bg-gradient-to-l from-violet-600 to-fuchsia-600 text-white gap-2">
              {reconciling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              تشغيل المطابقة الآن
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'إجمالي المعاملات', value: stats.count, icon: CreditCard, color: 'violet' },
            { label: 'ناجحة', value: stats.succeeded, sub: fmt(stats.succeededAmt), icon: CheckCircle2, color: 'emerald' },
            { label: 'معلّقة', value: stats.pending, icon: Clock, color: 'amber' },
            { label: 'فاشلة', value: stats.failed, icon: XCircle, color: 'rose' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border border-border/60 hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground">{s.label}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${s.color}-100 text-${s.color}-600`}>
                      <s.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black">{s.value}</div>
                  {s.sub && <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="intents" dir="rtl">
          <TabsList className="grid grid-cols-3 w-full sm:w-[480px]">
            <TabsTrigger value="intents">نوايا الدفع ({intents.length})</TabsTrigger>
            <TabsTrigger value="webhooks">إشعارات البوابة ({webhooks.length})</TabsTrigger>
            <TabsTrigger value="recon">سجل المطابقة ({runs.length})</TabsTrigger>
          </TabsList>

          {/* INTENTS */}
          <TabsContent value="intents" className="mt-4 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث برقم الطلب أو رقم العملية" className="pr-9" />
              </div>
              <div className="flex gap-1">
                {['all', 'succeeded', 'pending', 'failed', 'cancelled'].map(s => (
                  <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(s)} className="text-xs">
                    {s === 'all' ? 'الكل' : s === 'succeeded' ? 'ناجحة' : s === 'pending' ? 'معلّقة' : s === 'failed' ? 'فاشلة' : 'ملغاة'}
                  </Button>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب الداخلي</TableHead>
                      <TableHead className="text-right">الغرض</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">رقم العملية الخارجي</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-10">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
                      </TableCell></TableRow>
                    ) : filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        لا توجد معاملات
                      </TableCell></TableRow>
                    ) : filtered.map(i => (
                      <TableRow key={i.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-xs">{i.internal_order_number}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {i.purpose === 'wallet_topup' ? 'شحن محفظة' : i.purpose === 'invoice_payment' ? 'دفع فاتورة' : 'دفع طلب'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">{fmt(i.amount)}</TableCell>
                        <TableCell>{statusBadge(i.status)}</TableCell>
                        <TableCell className="font-mono text-[10px] text-muted-foreground">{i.external_transaction_no || '—'}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(i.created_at).toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline"
                              disabled={verifying === i.internal_order_number}
                              onClick={() => reverify(i.internal_order_number)} className="text-xs gap-1">
                              {verifying === i.internal_order_number
                                ? <RefreshCw className="w-3 h-3 animate-spin" />
                                : <PlayCircle className="w-3 h-3" />}
                              تحقق
                            </Button>
                            {i.checkout_url && (
                              <Button size="sm" variant="ghost" asChild>
                                <a href={i.checkout_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WEBHOOKS */}
          <TabsContent value="webhooks" className="mt-4">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المزود</TableHead>
                      <TableHead className="text-right">نوع الحدث</TableHead>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">رقم العملية</TableHead>
                      <TableHead className="text-right">معالج</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        لم يصل أي webhook بعد
                      </TableCell></TableRow>
                    ) : webhooks.map(w => (
                      <TableRow key={w.id}>
                        <TableCell><Badge variant="outline">{w.provider}</Badge></TableCell>
                        <TableCell className="text-xs">{w.event_type || '—'}</TableCell>
                        <TableCell className="font-mono text-xs">{w.internal_order_number || '—'}</TableCell>
                        <TableCell className="font-mono text-[10px]">{w.external_transaction_no || '—'}</TableCell>
                        <TableCell>
                          {w.processed
                            ? <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]"><CheckCircle2 className="w-3 h-3 ml-1" /> نعم</Badge>
                            : <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]"><Clock className="w-3 h-3 ml-1" /> لا</Badge>}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(w.created_at).toLocaleString('ar-SA')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RECON */}
          <TabsContent value="recon" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-600" /> سجل عمليات المطابقة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">فُحص</TableHead>
                      <TableHead className="text-right">متطابق</TableHead>
                      <TableHead className="text-right">مختلف</TableHead>
                      <TableHead className="text-right">البداية</TableHead>
                      <TableHead className="text-right">الانتهاء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runs.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        لم تُشغّل أي مطابقة بعد — اضغط "تشغيل المطابقة الآن"
                      </TableCell></TableRow>
                    ) : runs.map(r => (
                      <TableRow key={r.id}>
                        <TableCell><Badge variant="outline" className="text-[10px]">{r.run_type === 'manual' ? 'يدوي' : 'مجدول'}</Badge></TableCell>
                        <TableCell>
                          {r.status === 'completed'
                            ? <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">مكتمل</Badge>
                            : <Badge className="bg-amber-100 text-amber-800 text-[10px]">{r.status}</Badge>}
                        </TableCell>
                        <TableCell className="font-bold">{r.total_checked}</TableCell>
                        <TableCell className="text-emerald-700 font-bold">{r.total_matched}</TableCell>
                        <TableCell className={r.total_mismatched > 0 ? 'text-rose-700 font-bold' : ''}>
                          {r.total_mismatched > 0 && <AlertTriangle className="inline w-3 h-3 ml-1" />}
                          {r.total_mismatched}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(r.started_at).toLocaleString('ar-SA')}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {r.finished_at ? new Date(r.finished_at).toLocaleString('ar-SA') : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
