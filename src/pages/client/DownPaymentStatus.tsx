import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock3,
  XCircle,
  Wallet as WalletIcon,
  Building2,
  CreditCard,
  Receipt,
  Loader2,
  ArrowRight,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { cn } from '@/lib/utils';

type ReceiptStatus = 'pending' | 'verified' | 'rejected' | string;

interface ReceiptRow {
  id: string;
  application_id: string;
  amount: number;
  payment_method: string;
  bank_name: string | null;
  reference_number: string | null;
  transfer_date: string | null;
  receipt_file_url: string | null;
  receipt_file_name: string | null;
  status: ReceiptStatus;
  reviewer_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AppRow {
  id: string;
  total_amount: number;
  down_payment: number;
  status: string;
  created_at: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('ar-SA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
};

const methodMeta = (m: string) => {
  if (m === 'wallet') return { label: 'المحفظة', icon: WalletIcon, color: 'text-violet-600' };
  if (m === 'bank_transfer') return { label: 'تحويل بنكي', icon: Building2, color: 'text-slate-600' };
  if (m === 'mada' || m === 'visa' || m === 'card')
    return { label: 'بطاقة', icon: CreditCard, color: 'text-sky-600' };
  if (m === 'paypal') return { label: 'PayPal', icon: CreditCard, color: 'text-indigo-600' };
  return { label: m || 'غير محدد', icon: Receipt, color: 'text-muted-foreground' };
};

const statusMeta = (s: ReceiptStatus) => {
  if (s === 'verified' || s === 'approved' || s === 'completed')
    return {
      label: 'مكتمل ومُحقَّق',
      icon: CheckCircle2,
      tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
      dot: 'bg-emerald-500',
    };
  if (s === 'rejected' || s === 'failed')
    return {
      label: 'مرفوض',
      icon: XCircle,
      tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20',
      dot: 'bg-rose-500',
    };
  return {
    label: 'بانتظار التحقق',
    icon: Clock3,
    tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
    dot: 'bg-amber-500',
  };
};

interface TimelineEvent {
  key: string;
  at: string;
  title: string;
  description?: string;
  tone: 'pending' | 'success' | 'rejected' | 'info';
}

const buildTimeline = (r: ReceiptRow): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  events.push({
    key: 'submitted',
    at: r.created_at,
    title: 'تم إرسال الدفعة',
    description: `${methodMeta(r.payment_method).label} · ${fmt(r.amount)} ر.س`,
    tone: 'info',
  });
  if (r.transfer_date && r.payment_method === 'bank_transfer') {
    events.push({
      key: 'transferred',
      at: r.transfer_date,
      title: 'تاريخ التحويل المُسجّل',
      description: r.bank_name ? `البنك: ${r.bank_name}` : undefined,
      tone: 'info',
    });
  }
  if (r.status === 'pending') {
    events.push({
      key: 'review',
      at: r.updated_at,
      title: 'قيد مراجعة الفريق المالي',
      description: 'سيتم التحقق خلال 24 ساعة عمل.',
      tone: 'pending',
    });
  }
  if (r.reviewed_at && (r.status === 'verified' || r.status === 'approved')) {
    events.push({
      key: 'verified',
      at: r.reviewed_at,
      title: 'تم التحقق وتأكيد الدفعة',
      description: r.reviewer_note || undefined,
      tone: 'success',
    });
  }
  if (r.reviewed_at && r.status === 'rejected') {
    events.push({
      key: 'rejected',
      at: r.reviewed_at,
      title: 'تم رفض الدفعة',
      description: r.reviewer_note || 'يرجى مراجعة الفريق وإعادة الإرسال.',
      tone: 'rejected',
    });
  }
  return events;
};

const toneStyles = {
  success: { dot: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
  rejected: { dot: 'bg-rose-500', ring: 'ring-rose-500/30' },
  pending: { dot: 'bg-amber-500', ring: 'ring-amber-500/30' },
  info: { dot: 'bg-sky-500', ring: 'ring-sky-500/30' },
};

const DownPaymentStatus: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [apps, setApps] = useState<Record<string, AppRow>>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: r, error } = await supabase
        .from('financing_payment_receipts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error(error);
        setReceipts([]);
      } else {
        setReceipts((r || []) as ReceiptRow[]);
        const appIds = Array.from(new Set((r || []).map((x) => x.application_id)));
        if (appIds.length) {
          const { data: a } = await supabase
            .from('financing_applications')
            .select('id,total_amount,down_payment,status,created_at')
            .in('id', appIds);
          if (!cancelled && a) {
            const map: Record<string, AppRow> = {};
            for (const row of a) map[row.id] = row as AppRow;
            setApps(map);
          }
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const filtered = useMemo(() => {
    if (filter === 'all') return receipts;
    if (filter === 'verified')
      return receipts.filter((r) => ['verified', 'approved', 'completed'].includes(r.status));
    if (filter === 'rejected')
      return receipts.filter((r) => ['rejected', 'failed'].includes(r.status));
    return receipts.filter((r) => r.status === 'pending' || !['verified', 'approved', 'completed', 'rejected', 'failed'].includes(r.status));
  }, [receipts, filter]);

  const counts = useMemo(() => {
    const c = { all: receipts.length, pending: 0, verified: 0, rejected: 0 };
    for (const r of receipts) {
      if (['verified', 'approved', 'completed'].includes(r.status)) c.verified++;
      else if (['rejected', 'failed'].includes(r.status)) c.rejected++;
      else c.pending++;
    }
    return c;
  }, [receipts]);

  return (
    <ClientLayout>
      <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" />
              حالة الدفعة الأولى
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              تابع حالة جميع دفعاتك الأولى المرسلة لطلبات التمويل، حسب وسيلة الدفع.
            </p>
          </div>
          <Link to="/financing">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowRight className="h-4 w-4" />
              طلبات التمويل
            </Button>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'all', label: 'الكل', value: counts.all, tone: 'bg-muted text-foreground' },
            { key: 'pending', label: 'بانتظار التحقق', value: counts.pending, tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
            { key: 'verified', label: 'مكتمل', value: counts.verified, tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
            { key: 'rejected', label: 'مرفوض', value: counts.rejected, tone: 'bg-rose-500/10 text-rose-700 dark:text-rose-400' },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key as typeof filter)}
              className={cn(
                'rounded-xl p-3 text-right ring-1 ring-border transition-all',
                s.tone,
                filter === s.key && 'ring-2 ring-primary shadow-md scale-[1.02]',
              )}
            >
              <div className="text-2xl font-extrabold">{s.value}</div>
              <div className="text-xs font-bold mt-1">{s.label}</div>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <Receipt className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <div className="font-bold mb-1">لا توجد دفعات تطابق الفلتر</div>
            <p className="text-sm text-muted-foreground mb-4">
              ابدأ طلب تمويل جديد ليتم عرض حالة دفعتك الأولى هنا.
            </p>
            <Link to="/financing/new">
              <Button>طلب تمويل جديد</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((r, idx) => {
              const m = methodMeta(r.payment_method);
              const s = statusMeta(r.status);
              const Icon = m.icon;
              const StatusIcon = s.icon;
              const events = buildTimeline(r);
              const app = apps[r.application_id];
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                >
                  <Card className="overflow-hidden">
                    {/* Top row */}
                    <div className="p-4 flex items-start justify-between gap-3 flex-wrap border-b border-border">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn('h-11 w-11 rounded-xl bg-muted ring-1 ring-border flex items-center justify-center shrink-0', m.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm flex items-center gap-2">
                            دفعة أولى — {m.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(r.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn('gap-1 ring-1', s.tone)}>
                          <StatusIcon className="h-3 w-3" />
                          {s.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 grid sm:grid-cols-2 gap-4">
                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">المبلغ</span>
                          <span className="font-bold">{fmt(r.amount)} ر.س</span>
                        </div>
                        {app && (
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">إجمالي التمويل</span>
                            <span className="font-medium">{fmt(app.total_amount)} ر.س</span>
                          </div>
                        )}
                        {r.bank_name && (
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">البنك</span>
                            <span className="font-medium">{r.bank_name}</span>
                          </div>
                        )}
                        {r.reference_number && (
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">المرجع</span>
                            <span className="font-mono text-xs">{r.reference_number}</span>
                          </div>
                        )}
                        {r.transfer_date && (
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">تاريخ التحويل</span>
                            <span className="font-medium">{formatDate(r.transfer_date)}</span>
                          </div>
                        )}

                        {r.status === 'rejected' && r.reviewer_note && (
                          <div className="mt-2 rounded-lg bg-rose-500/5 ring-1 ring-rose-500/20 p-3 flex gap-2">
                            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <div className="font-bold text-rose-700 dark:text-rose-400 mb-0.5">سبب الرفض</div>
                              <div className="text-rose-700/80 dark:text-rose-300/80">{r.reviewer_note}</div>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex items-center gap-2 flex-wrap">
                          <Link to={`/financing/${r.application_id}`}>
                            <Button size="sm" variant="outline" className="gap-1 h-8">
                              <FileText className="h-3.5 w-3.5" />
                              عرض الطلب
                            </Button>
                          </Link>
                          {r.receipt_file_url && (
                            <a href={r.receipt_file_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="ghost" className="gap-1 h-8">
                                <Eye className="h-3.5 w-3.5" />
                                عرض الإيصال
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="rounded-xl bg-muted/30 ring-1 ring-border p-3">
                        <div className="text-xs font-bold mb-3 text-muted-foreground">السجل الزمني</div>
                        <ol className="relative space-y-3">
                          <span className="absolute top-1 bottom-1 right-[7px] w-px bg-border" aria-hidden />
                          {events.map((e) => {
                            const t = toneStyles[e.tone];
                            return (
                              <li key={e.key} className="relative pr-6">
                                <span
                                  className={cn(
                                    'absolute right-0 top-1 h-3.5 w-3.5 rounded-full ring-2 ring-background',
                                    t.dot,
                                  )}
                                />
                                <div className="text-xs font-bold">{e.title}</div>
                                {e.description && (
                                  <div className="text-[11px] text-muted-foreground mt-0.5">{e.description}</div>
                                )}
                                <div className="text-[10px] text-muted-foreground mt-0.5">{formatDate(e.at)}</div>
                              </li>
                            );
                          })}
                          {events.length === 0 && (
                            <li className="text-xs text-muted-foreground flex items-center gap-2">
                              <Loader2 className="h-3 w-3 animate-spin" /> جاري تحديث السجل...
                            </li>
                          )}
                        </ol>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default DownPaymentStatus;
