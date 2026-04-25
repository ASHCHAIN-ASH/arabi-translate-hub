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
  RefreshCw,
  WifiOff,
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
import FinancingHero from '@/components/financing/FinancingHero';
import FinancingFeatures from '@/components/financing/FinancingFeatures';
import FinancingTerms from '@/components/financing/FinancingTerms';
import FinancingFAQ from '@/components/financing/FinancingFAQ';

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

// نسبة تقدم الطلب حسب المرحلة (6 مراحل رئيسية)
const STATUS_PROGRESS: Record<string, { pct: number; label: string; tone: 'sky' | 'amber' | 'violet' | 'emerald' | 'rose' }> = {
  draft: { pct: 5, label: 'مسودة', tone: 'sky' },
  submitted: { pct: 15, label: 'تم الإرسال', tone: 'sky' },
  documents_pending: { pct: 25, label: 'بانتظار المستندات', tone: 'amber' },
  under_review: { pct: 40, label: 'قيد التقييم الائتماني', tone: 'violet' },
  contract_pending_signature: { pct: 60, label: 'بانتظار توقيع العقد', tone: 'violet' },
  waiting_down_payment: { pct: 80, label: 'بانتظار الدفعة الأولى', tone: 'amber' },
  approved: { pct: 90, label: 'تمت الموافقة', tone: 'emerald' },
  active: { pct: 95, label: 'نشط — جاري السداد', tone: 'emerald' },
  completed: { pct: 100, label: 'مكتمل', tone: 'emerald' },
  overdue: { pct: 95, label: 'قسط متأخر', tone: 'rose' },
  rejected: { pct: 100, label: 'مرفوض', tone: 'rose' },
  cancelled: { pct: 100, label: 'ملغي', tone: 'rose' },
};

const PROGRESS_BAR_CLASS: Record<'sky' | 'amber' | 'violet' | 'emerald' | 'rose', string> = {
  sky: 'bg-gradient-to-l from-sky-500 to-blue-500',
  amber: 'bg-gradient-to-l from-amber-500 to-orange-500',
  violet: 'bg-gradient-to-l from-violet-500 to-fuchsia-500',
  emerald: 'bg-gradient-to-l from-emerald-500 to-teal-500',
  rose: 'bg-gradient-to-l from-rose-500 to-red-500',
};

const FinancingHome: React.FC = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<FinancingApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from('financing_applications')
        .select('id,total_amount,down_payment,monthly_installment,duration_months,status,created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApps((data ?? []) as FinancingApp[]);
    } catch (err: any) {
      console.error('[FinancingHome] load failed:', err);
      setLoadError(err?.message || 'تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت.');
    } finally {
      setLoading(false);
    }
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
      <div dir="rtl" className="space-y-6 sm:space-y-10 animate-fade-in">
        {/* Hero — Premium banking experience */}
        <FinancingHero
          active={stats.active}
          pending={stats.pending}
          totalCredit={stats.totalCredit}
        />

        {/* Features + How it works (with AI imagery) */}
        <FinancingFeatures />

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
                  <div
                    role="tablist"
                    aria-label="تصنيفات طلبات التمويل"
                    aria-orientation="horizontal"
                    className="relative rounded-2xl p-1 sm:p-1.5 bg-gradient-to-l from-primary/5 via-muted/40 to-primary/5 ring-1 ring-border/60 backdrop-blur-xl overflow-x-auto shadow-inner scrollbar-none"
                  >
                    <div className="flex gap-1 sm:gap-1.5 min-w-max">
                      {tabs.map((t, tabIdx) => {
                        const isActive = activeTab === t.key;
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.key}
                            type="button"
                            role="tab"
                            id={`financing-tab-${t.key}`}
                            aria-selected={isActive}
                            aria-controls="financing-tabpanel"
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => handleTabChange(t.key as typeof activeTab)}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
                                e.preventDefault();
                                let nextIdx = tabIdx;
                                // RTL: ArrowRight => previous, ArrowLeft => next
                                if (e.key === 'ArrowRight') nextIdx = tabIdx === 0 ? tabs.length - 1 : tabIdx - 1;
                                else if (e.key === 'ArrowLeft') nextIdx = tabIdx === tabs.length - 1 ? 0 : tabIdx + 1;
                                else if (e.key === 'Home') nextIdx = 0;
                                else if (e.key === 'End') nextIdx = tabs.length - 1;
                                const next = tabs[nextIdx];
                                handleTabChange(next.key as typeof activeTab);
                                requestAnimationFrame(() => {
                                  document.getElementById(`financing-tab-${next.key}`)?.focus();
                                });
                              }
                            }}
                            aria-label={`${t.label} — ${t.count} طلب`}
                            className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
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
                    role="tabpanel"
                    id="financing-tabpanel"
                    aria-labelledby={`financing-tab-${activeTab}`}
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
                ) : loadError ? (
                  <Card
                    role="tabpanel"
                    id="financing-tabpanel"
                    aria-labelledby={`financing-tab-${activeTab}`}
                    aria-live="assertive"
                    className="p-6 sm:p-10 text-center border-destructive/30 bg-destructive/5"
                  >
                    <div className="mx-auto mb-3 sm:mb-4 h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-destructive/10 ring-1 ring-destructive/20 flex items-center justify-center">
                      <WifiOff className="h-7 w-7 sm:h-8 sm:w-8 text-destructive" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1.5 text-foreground">
                      تعذّر جلب الطلبات
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-sm mx-auto leading-relaxed">
                      {loadError}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center">
                      <Button
                        onClick={load}
                        size="lg"
                        className="w-full sm:w-auto h-12 sm:h-11 text-base sm:text-sm font-semibold gap-2"
                        disabled={loading}
                        aria-label="إعادة محاولة جلب الطلبات"
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                        {loading ? 'جاري المحاولة…' : 'إعادة المحاولة'}
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto h-12 sm:h-11 text-base sm:text-sm"
                      >
                        <Link to="/financing/new">إنشاء طلب جديد</Link>
                      </Button>
                    </div>
                  </Card>
                ) : filtered.length === 0 ? (
                  <Card
                    role="tabpanel"
                    id="financing-tabpanel"
                    aria-labelledby={`financing-tab-${activeTab}`}
                    className="p-10 text-center border-dashed"
                  >
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" aria-hidden="true" />
                    <h3 className="font-semibold mb-1">
                      {apps.length === 0 ? 'لا توجد طلبات تمويل بعد' : 'لا توجد طلبات في هذا التصنيف'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {apps.length === 0
                        ? 'ابدأ أول طلب تمويل لك عبر Master PayLater'
                        : 'جرّب تبويبًا آخر أو أنشئ طلبًا جديدًا'}
                    </p>
                    <Button asChild>
                      <Link to="/financing/new" aria-label="إنشاء طلب تمويل جديد">إنشاء طلب جديد</Link>
                    </Button>
                  </Card>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      role="tabpanel"
                      id="financing-tabpanel"
                      aria-labelledby={`financing-tab-${activeTab}`}
                      aria-label={`قائمة الطلبات — ${filtered.length} طلب`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                    >
                      {filtered.map((a, idx) => {
                        const tone = statusTone(a.status);
                        const StatusIcon = tone.icon;
                        const progress = STATUS_PROGRESS[a.status] ?? { pct: 10, label: a.status, tone: 'sky' as const };
                        const barClass = PROGRESS_BAR_CLASS[progress.tone];
                        const isTerminal = ['completed', 'rejected', 'cancelled'].includes(a.status);
                        const statusLabel = FINANCING_STATUS_LABELS_AR[a.status] ?? a.status;
                        const cardAriaLabel = `طلب تمويل رقم ${a.id.slice(0, 8).toUpperCase()} — المبلغ ${fmt(a.total_amount)} ريال — الحالة: ${statusLabel} — نسبة الإنجاز ${progress.pct}٪ — اضغط لعرض التفاصيل`;
                        return (
                          <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Link
                              to={`/financing/${a.id}`}
                              className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              aria-label={cardAriaLabel}
                            >
                              <Card className="p-3 sm:p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all border-border/60 hover:border-primary/40 group h-full">
                                {/* Header — رقم الطلب + المبلغ + شارة الحالة */}
                                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                                  <div
                                    className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl ${tone.bg} ring-1 ${tone.ring} flex items-center justify-center shrink-0`}
                                    aria-hidden
                                  >
                                    <StatusIcon className={`h-5 w-5 ${tone.text}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                      <span className="font-mono text-[10px] sm:text-xs font-semibold text-muted-foreground truncate">
                                        #{a.id.slice(0, 8).toUpperCase()}
                                      </span>
                                      <Badge
                                        className={`${tone.bg} ${tone.text} ring-1 ${tone.ring} border-0 px-1.5 sm:px-2 h-5 text-[9px] sm:text-[10px] font-semibold shrink-0`}
                                      >
                                        {FINANCING_STATUS_LABELS_AR[a.status] ?? a.status}
                                      </Badge>
                                    </div>
                                    <div className="text-lg sm:text-2xl font-extrabold tabular-nums leading-tight">
                                      {fmt(a.total_amount)}
                                      <span className="text-[11px] sm:text-sm font-normal text-muted-foreground mr-1">ر.س</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs mb-3 sm:mb-4">
                                  <div className="rounded-lg bg-muted/50 p-1.5 sm:p-2.5">
                                    <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">الدفعة الأولى</div>
                                    <div className="text-[11px] sm:text-xs font-bold tabular-nums">{fmt(a.down_payment)}</div>
                                  </div>
                                  <div className="rounded-lg bg-muted/50 p-1.5 sm:p-2.5">
                                    <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">القسط</div>
                                    <div className="text-[11px] sm:text-xs font-bold tabular-nums">{fmt(a.monthly_installment)}</div>
                                  </div>
                                  <div className="rounded-lg bg-muted/50 p-1.5 sm:p-2.5">
                                    <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">المدة</div>
                                    <div className="text-[11px] sm:text-xs font-bold tabular-nums">{a.duration_months} ش</div>
                                  </div>
                                </div>

                                {/* شريط تقدم المرحلة */}
                                <div className="mb-3 sm:mb-3.5" aria-label={`نسبة التقدم: ${progress.pct}%`}>
                                  <div className="flex items-center justify-between mb-1.5 text-[10px] sm:text-[11px]">
                                    <span className="font-semibold text-foreground/80 truncate">{progress.label}</span>
                                    <span className="font-bold tabular-nums text-foreground/70 shrink-0 mr-2">{progress.pct}%</span>
                                  </div>
                                  <div
                                    role="progressbar"
                                    aria-valuenow={progress.pct}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    className="relative h-1.5 sm:h-2 w-full rounded-full bg-muted overflow-hidden ring-1 ring-border/40"
                                  >
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progress.pct}%` }}
                                      transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 + 0.1 }}
                                      className={`absolute inset-y-0 right-0 ${barClass} rounded-full shadow-sm`}
                                    />
                                    {!isTerminal && (
                                      <motion.div
                                        className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/40 to-transparent rounded-full"
                                        animate={{ x: ['-100%', '300%'] }}
                                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                        style={{ width: `${Math.min(progress.pct, 30)}%` }}
                                      />
                                    )}
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

        {/* Terms & conditions */}
        <FinancingTerms />

        {/* FAQ */}
        <FinancingFAQ />
      </div>
    </ClientLayout>
  );
};

export default FinancingHome;
