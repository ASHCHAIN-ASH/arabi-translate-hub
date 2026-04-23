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
} from 'lucide-react';
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
      <div dir="rtl" className="space-y-6 animate-fade-in">
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

            <div className="relative p-6 md:p-10 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ rotate: -12, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center ring-1 ring-white/30 shadow-xl"
                  >
                    <Wallet className="h-8 w-8" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-1">
                      <Sparkles className="h-3 w-3" />
                      Master PayLater
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">تمويل ماستر الذكي</h1>
                  </div>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-white/90 font-bold shadow-lg shadow-black/20 hover-scale"
                >
                  <Link to="/financing/new">
                    <Plus className="ml-2 h-4 w-4" />
                    طلب تمويل جديد
                  </Link>
                </Button>
              </div>

              <p className="text-sm md:text-base text-white/90 max-w-2xl leading-relaxed mt-6 mb-5">
                قسّط طلباتك التي تتجاوز {fmt(FINANCING_MIN_AMOUNT)} ر.س على 12 شهرًا بأقساط متساوية،
                ادفع الدفعة الأولى فقط — وبعد الموافقة يُضاف الرصيد إلى محفظتك داخل المنصة فورًا.
              </p>

              <div className="flex items-start gap-2 rounded-xl bg-white/10 backdrop-blur-xl p-4 ring-1 ring-white/20 max-w-3xl">
                <ShieldCheck className="h-5 w-5 mt-0.5 shrink-0 text-cyan-200" />
                <p className="text-xs leading-relaxed text-white/95">{FINANCING_DISCLAIMER_AR}</p>
              </div>

              {/* Live stats */}
              <div className="grid grid-cols-3 gap-3 mt-6">
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
                    className="rounded-xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-3"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/70 mb-1">
                      <s.icon className="h-3 w-3" />
                      {s.label}
                    </div>
                    <div className="text-base md:text-lg font-bold">{s.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { i: 1, t: 'إرسال الطلب', d: 'املأ بياناتك ووثّق هويتك', emoji: '📝' },
            { i: 2, t: 'مراجعة الإدارة', d: 'تقييم الأهلية والموافقة', emoji: '🔎' },
            { i: 3, t: 'العقد + الدفعة', d: 'وقّع إلكترونيًا وادفع 20%', emoji: '✍️' },
            { i: 4, t: 'تفعيل الرصيد', d: 'يُضاف لمحفظتك فورًا', emoji: '⚡' },
          ].map((s, idx) => (
            <motion.div
              key={s.i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.07 }}
            >
              <Card className="p-3 md:p-4 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all hover-scale h-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xl md:text-2xl">{s.emoji}</div>
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-xs">
                    {s.i}
                  </div>
                </div>
                <div className="font-semibold mb-0.5 text-sm">{s.t}</div>
                <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{s.d}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Applications list with stunning RTL tabs */}
        <div>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              طلباتي التمويلية
            </h2>
            <Button asChild variant="outline" size="sm" className="hover-scale">
              <Link to="/financing/new">
                <Plus className="ml-1 h-4 w-4" /> طلب جديد
              </Link>
            </Button>
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
                  className="relative mb-6 rounded-2xl p-1.5 bg-gradient-to-l from-primary/5 via-muted/40 to-primary/5 ring-1 ring-border/60 backdrop-blur-xl overflow-x-auto shadow-inner"
                >
                  <div className="flex gap-1.5 min-w-max">
                    {tabs.map((t) => {
                      const isActive = activeTab === t.key;
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.key}
                          onClick={() => setActiveTab(t.key as typeof activeTab)}
                          className={`relative flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap group ${
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
                          <span className="relative flex items-center gap-2">
                            <Icon className={`h-4 w-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span>{t.label}</span>
                            <span
                              className={`min-w-[22px] h-5 px-1.5 inline-flex items-center justify-center rounded-full text-[10px] font-bold tabular-nums transition-all ${
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

                {loading ? (
                  <Card className="p-8 text-center text-muted-foreground animate-pulse">جاري التحميل…</Card>
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
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                              <Card className="p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all border-border/60 hover:border-primary/40 group h-full">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                      رقم الطلب
                                    </div>
                                    <div className="font-mono text-xs font-semibold mb-2">
                                      #{a.id.slice(0, 8).toUpperCase()}
                                    </div>
                                    <div className="text-2xl font-extrabold tabular-nums">
                                      {fmt(a.total_amount)}
                                      <span className="text-sm font-normal text-muted-foreground mr-1">ر.س</span>
                                    </div>
                                  </div>
                                  <Badge
                                    className={`${tone.bg} ${tone.text} ring-1 ${tone.ring} border-0 gap-1 px-2.5`}
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {FINANCING_STATUS_LABELS_AR[a.status] ?? a.status}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                                  <div className="rounded-lg bg-muted/50 p-2.5">
                                    <div className="text-[10px] text-muted-foreground mb-1">الدفعة الأولى</div>
                                    <div className="font-bold tabular-nums">{fmt(a.down_payment)}</div>
                                  </div>
                                  <div className="rounded-lg bg-muted/50 p-2.5">
                                    <div className="text-[10px] text-muted-foreground mb-1">القسط</div>
                                    <div className="font-bold tabular-nums">{fmt(a.monthly_installment)}</div>
                                  </div>
                                  <div className="rounded-lg bg-muted/50 p-2.5">
                                    <div className="text-[10px] text-muted-foreground mb-1">المدة</div>
                                    <div className="font-bold tabular-nums">{a.duration_months} ش</div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
                                  <span>{new Date(a.created_at).toLocaleDateString('en-GB')}</span>
                                  <span className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                                    عرض التفاصيل
                                    <ArrowUpRight className="h-3.5 w-3.5" />
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
