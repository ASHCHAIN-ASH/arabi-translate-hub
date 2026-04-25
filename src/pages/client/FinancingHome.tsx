import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FileText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  AlertCircle,
  LayoutGrid,
  Activity,
  Hourglass,
  Archive,
  Receipt,
  CreditCard,
  Gavel,
  Loader2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import {
  FINANCING_DISCLAIMER_AR,
  FINANCING_STATUS_LABELS_AR,
  FINANCING_MIN_AMOUNT,
} from '@/lib/financing';

interface FinancingApp {
  id: string;
  total_amount: number;
  down_payment: number;
  monthly_installment: number;
  duration_months: number;
  status: string;
  created_at: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);

const statusTone = (status: string) => {
  if (['approved', 'active', 'completed'].includes(status))
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/20', icon: CheckCircle2 };
  if (['rejected', 'cancelled', 'overdue'].includes(status))
    return { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-500/20', icon: AlertCircle };
  if (['waiting_down_payment', 'contract_pending_signature'].includes(status))
    return { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/20', icon: Clock3 };
  return { bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-500/20', icon: Clock3 };
};

const FinancingHome: React.FC = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<FinancingApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'closed'>('all');
  const [tabSwitching, setTabSwitching] = useState(false);

  const handleTabChange = (key: typeof activeTab) => {
    if (key === activeTab) return;
    setTabSwitching(true);
    setActiveTab(key);
    window.setTimeout(() => setTabSwitching(false), 280);
  };

  useEffect(() => {
    document.title = 'Master PayLater — التمويل | منصة ماستر';
  }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('financing_applications')
      .select('id,total_amount,down_payment,monthly_installment,duration_months,status,created_at')
      .order('created_at', { ascending: false });
    if (data) setApps(data as FinancingApp[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    load();
    const channel = supabase
      .channel(`financing-home-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'financing_applications', filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const stats = useMemo(() => {
    const active = apps.filter((a) => ['active', 'approved'].includes(a.status));
    const pending = apps.filter((a) => !['active', 'approved', 'rejected', 'cancelled', 'completed'].includes(a.status));
    const totalCredit = active.reduce((s, a) => s + Number(a.total_amount - a.down_payment), 0);
    return { active: active.length, pending: pending.length, totalCredit };
  }, [apps]);

  return (
    <ClientLayout>
      <div dir="rtl" className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Hero — Glassmorphism + gradient */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, hsl(217 91% 18%) 0%, hsl(217 91% 28%) 35%, hsl(199 89% 38%) 100%)',
              }}
            />
            {/* Animated orbs */}
            <motion.div
              className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-gradient-to-tr from-violet-500/30 to-fuchsia-400/20 blur-3xl"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 backdrop-blur-[2px] bg-white/[0.02]" />

            <div className="relative p-4 sm:p-6 md:p-10 text-white">
              <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <motion.div
                    initial={{ rotate: -12, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center ring-1 ring-white/30 shadow-xl shrink-0"
                  >
                    <Wallet className="h-6 w-6 sm:h-8 sm:w-8" />
                  </motion.div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-white/70 mb-1">
                      <Sparkles className="h-3 w-3" />
                      Master PayLater
                    </div>
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-bold leading-tight">تمويل ماستر الذكي</h1>
                  </div>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-white text-slate-900 hover:bg-white/90 font-bold shadow-lg shadow-black/20 hover-scale w-full sm:w-auto sm:size-lg sm:h-11 sm:px-6 sm:text-base"
                >
                  <Link to="/financing/new">
                    <Plus className="ml-2 h-4 w-4" />
                    طلب تمويل جديد
                  </Link>
                </Button>
              </div>

              <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed mt-4 sm:mt-6 mb-4 sm:mb-5">
                قسّط طلباتك التي تتجاوز {fmt(FINANCING_MIN_AMOUNT)} ر.س على 12 شهرًا بأقساط متساوية،
                ادفع الدفعة الأولى فقط — وبعد الموافقة يُضاف الرصيد إلى محفظتك داخل المنصة فورًا.
              </p>

              <div className="flex items-start gap-2 rounded-xl bg-white/10 backdrop-blur-xl p-3 sm:p-4 ring-1 ring-white/20 max-w-3xl">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 shrink-0 text-cyan-200" />
                <p className="text-[11px] sm:text-xs leading-relaxed text-white/95">{FINANCING_DISCLAIMER_AR}</p>
              </div>

              {/* Live stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
                {[
                  { label: 'تمويلات نشطة', value: stats.active, icon: TrendingUp },
                  { label: 'قيد المعالجة', value: stats.pending, icon: Clock3 },
                  { label: 'إجمالي الرصيد', value: `${fmt(stats.totalCredit)} ر.س`, icon: Wallet },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="rounded-xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-2.5 sm:p-3 min-w-0"
                  >
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-white/70 mb-1">
                      <s.icon className="h-3 w-3 shrink-0" />
                      <span className="truncate">{s.label}</span>
                    </div>
                    <div className="text-sm sm:text-base md:text-lg font-bold tabular-nums truncate">{s.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Steps — 6 professional fintech stages */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              مراحل طلبك التمويلي
            </h3>
            <Badge variant="outline" className="text-[10px]">نظام مستقل · آمن · موثّق</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-3">
            {[
              { i: 1, t: 'إرسال الطلب', d: 'وثّق هويتك وبياناتك', icon: Receipt, color: 'from-sky-500 to-blue-600' },
              { i: 2, t: 'التقييم الائتماني', d: 'فحص الأهلية والملاءة', icon: ShieldCheck, color: 'from-indigo-500 to-violet-600' },
              { i: 3, t: 'توقيع العقد', d: 'توقيع رقمي مُلزِم', icon: FileText, color: 'from-violet-500 to-purple-600' },
              { i: 4, t: 'الدفعة الأولى', d: '20% من المبلغ', icon: CreditCard, color: 'from-fuchsia-500 to-pink-600' },
              { i: 5, t: 'تفعيل الرصيد', d: 'يُضاف لمحفظتك فورًا', icon: Sparkles, color: 'from-emerald-500 to-teal-600' },
              { i: 6, t: 'السند التنفيذي', d: 'عند التأخر +24 ساعة', icon: Gavel, color: 'from-rose-500 to-red-600' },
            ].map((s, idx) => (
              <motion.div
                key={s.i}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08, type: 'spring', stiffness: 120 }}
                whileHover={{ y: -4, scale: 1.03 }}
              >
                <Card className="relative overflow-hidden p-3 border-border/60 hover:border-primary/60 hover:shadow-xl transition-all h-full group cursor-default">
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative flex items-center gap-2 mb-2">
                    <motion.div
                      whileHover={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <s.icon className="h-4 w-4" />
                    </motion.div>
                    <div className="h-6 w-6 rounded-md bg-muted text-foreground/70 flex items-center justify-center font-bold text-[11px] ring-1 ring-border">
                      {s.i}
                    </div>
                  </div>
                  <div className="relative font-bold mb-0.5 text-[13px] leading-tight">{s.t}</div>
                  <p className="relative text-[10.5px] text-muted-foreground leading-snug">{s.d}</p>
                  {idx < 5 && (
                    <motion.div
                      className="absolute top-1/2 -left-1 h-px w-2 bg-gradient-to-r from-primary/40 to-transparent hidden lg:block"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                    />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Applications list with stunning RTL tabs */}
        <div>
          <div className="sticky top-14 sm:static z-30 -mx-3 sm:mx-0 px-3 sm:px-0 pt-2 sm:pt-0 pb-2 sm:pb-0 mb-3 sm:mb-0 bg-background/85 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-0 border-b border-border/40 sm:border-0">
            <div className="flex items-center justify-between mb-3 sm:mb-5 flex-wrap gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                طلباتي التمويلية
                {(loading || tabSwitching) && (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" aria-label="جاري التحميل" />
                )}
              </h2>
              <Button asChild variant="outline" size="sm" className="hover-scale h-8 sm:h-9 text-xs sm:text-sm">
                <Link to="/financing/new">
                  <Plus className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" /> طلب جديد
                </Link>
              </Button>
            </div>
          </div>

          {/* ✨ Premium animated tabs */}
          {(() => {
            const tabs = [
              { key: 'all', label: 'الكل', icon: LayoutGrid, count: apps.length },
              {
                key: 'active',
                label: 'نشطة',
                icon: Activity,
                count: apps.filter((a) => ['active', 'approved'].includes(a.status)).length,
              },
              {
                key: 'pending',
                label: 'قيد المعالجة',
                icon: Hourglass,
                count: apps.filter(
                  (a) => !['active', 'approved', 'rejected', 'cancelled', 'completed'].includes(a.status),
                ).length,
              },
              {
                key: 'closed',
                label: 'منتهية',
                icon: Archive,
                count: apps.filter((a) => ['completed', 'rejected', 'cancelled'].includes(a.status)).length,
              },
            ] as const;

            const filtered = apps.filter((a) => {
              if (activeTab === 'all') return true;
              if (activeTab === 'active') return ['active', 'approved'].includes(a.status);
              if (activeTab === 'pending')
                return !['active', 'approved', 'rejected', 'cancelled', 'completed'].includes(a.status);
              return ['completed', 'rejected', 'cancelled'].includes(a.status);
            });

            return (
              <>
                <div
                  dir="rtl"
                  className="sticky top-[108px] sm:static z-20 -mx-3 sm:mx-0 px-3 sm:px-0 py-2 sm:py-0 mb-3 sm:mb-6 bg-background/85 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-0 border-b border-border/40 sm:border-0"
                >
                  <div className="relative rounded-2xl p-1 sm:p-1.5 bg-gradient-to-l from-primary/5 via-muted/40 to-primary/5 ring-1 ring-border/60 backdrop-blur-xl overflow-x-auto shadow-inner scrollbar-none">
                    <div className="flex gap-1 sm:gap-1.5 min-w-max">
                      {tabs.map((t) => {
                        const isActive = activeTab === t.key;
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.key}
                            onClick={() => handleTabChange(t.key as typeof activeTab)}
                            className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap group ${
                              isActive
                                ? 'text-white'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeFinancingTab"
                                className="absolute inset-0 rounded-xl shadow-lg"
                                style={{
                                  background:
                                    'linear-gradient(135deg, hsl(217 91% 32%) 0%, hsl(199 89% 48%) 100%)',
                                  boxShadow:
                                    '0 8px 24px -8px hsl(217 91% 32% / 0.5), inset 0 1px 0 0 hsl(0 0% 100% / 0.2)',
                                }}
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}
                            <span className="relative flex items-center gap-1.5 sm:gap-2">
                              <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                              <span>{t.label}</span>
                              <span
                                className={`min-w-[20px] sm:min-w-[22px] h-4 sm:h-5 px-1 sm:px-1.5 inline-flex items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold tabular-nums transition-all ${
                                  isActive
                                    ? 'bg-white/25 text-white ring-1 ring-white/30'
                                    : 'bg-muted text-muted-foreground ring-1 ring-border/60'
                                }`}
                              >
                                {t.count}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {loading || tabSwitching ? (
                  <div
                    aria-busy="true"
                    aria-live="polite"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                  >
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i} className="p-4 sm:p-5 border-border/60">
                        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                          <div className="space-y-2 flex-1 min-w-0">
                            <Skeleton className="h-2.5 w-16" />
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-7 sm:h-8 w-32" />
                          </div>
                          <Skeleton className="h-6 w-20 rounded-full shrink-0" />
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          {Array.from({ length: 3 }).map((__, j) => (
                            <div key={j} className="rounded-lg bg-muted/40 p-2 sm:p-2.5 space-y-1.5">
                              <Skeleton className="h-2 w-12 mx-auto" />
                              <Skeleton className="h-3 w-10 mx-auto" />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border/40">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </Card>
                    ))}
                    <span className="sr-only">جاري تحميل الطلبات…</span>
                  </div>
                ) : filtered.length === 0 ? (
                  <Card className="p-10 text-center border-dashed">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
                    <h3 className="font-semibold mb-1">
                      {apps.length === 0 ? 'لا توجد طلبات تمويل بعد' : 'لا توجد طلبات في هذا التصنيف'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {apps.length === 0
                        ? 'ابدأ أول طلب تمويل لك عبر Master PayLater'
                        : 'جرّب تبويبًا آخر أو أنشئ طلبًا جديدًا'}
                    </p>
                    <Button asChild>
                      <Link to="/financing/new">إنشاء طلب جديد</Link>
                    </Button>
                  </Card>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                    >
                      {filtered.map((a, idx) => {
                        const tone = statusTone(a.status);
                        const StatusIcon = tone.icon;
                        return (
                          <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Link to={`/financing/${a.id}`} className="block">
                              <Card className="p-4 sm:p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all border-border/60 hover:border-primary/40 group h-full">
                                <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                                  <div className="min-w-0">
                                    <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                      رقم الطلب
                                    </div>
                                    <div className="font-mono text-[11px] sm:text-xs font-semibold mb-1.5 sm:mb-2 truncate">
                                      #{a.id.slice(0, 8).toUpperCase()}
                                    </div>
                                    <div className="text-xl sm:text-2xl font-extrabold tabular-nums">
                                      {fmt(a.total_amount)}
                                      <span className="text-xs sm:text-sm font-normal text-muted-foreground mr-1">ر.س</span>
                                    </div>
                                  </div>
                                  <Badge
                                    className={`${tone.bg} ${tone.text} ring-1 ${tone.ring} border-0 gap-1 px-2 sm:px-2.5 text-[10px] sm:text-xs shrink-0`}
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {FINANCING_STATUS_LABELS_AR[a.status] ?? a.status}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs mb-3 sm:mb-4">
                                  <div className="rounded-lg bg-muted/50 p-2 sm:p-2.5">
                                    <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5 sm:mb-1">الدفعة الأولى</div>
                                    <div className="text-[11px] sm:text-xs font-bold tabular-nums">{fmt(a.down_payment)}</div>
                                  </div>
                                  <div className="rounded-lg bg-muted/50 p-2 sm:p-2.5">
                                    <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5 sm:mb-1">القسط</div>
                                    <div className="text-[11px] sm:text-xs font-bold tabular-nums">{fmt(a.monthly_installment)}</div>
                                  </div>
                                  <div className="rounded-lg bg-muted/50 p-2 sm:p-2.5">
                                    <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5 sm:mb-1">المدة</div>
                                    <div className="text-[11px] sm:text-xs font-bold tabular-nums">{a.duration_months} ش</div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground pt-2.5 sm:pt-3 border-t border-border/40">
                                  <span>{new Date(a.created_at).toLocaleDateString('en-GB')}</span>
                                  <span className="flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
                                    عرض التفاصيل
                                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  </span>
                                </div>
                              </Card>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </ClientLayout>
  );
};

export default FinancingHome;
