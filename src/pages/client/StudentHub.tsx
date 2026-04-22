import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/SimpleAuthProvider';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useGamification } from '@/hooks/useGamification';
import { useUserMembership } from '@/hooks/useMembership';
import { useDailyTasks, useStudentResources, useUpcomingOrders } from '@/hooks/useStudentHub';
import { useChallengeAcademy } from '@/hooks/useChallengeAcademy';
import { useSmartSuggestions } from '@/hooks/useSmartSuggestions';
import { StudentXpWidget } from '@/components/student/StudentXpWidget';
import { SmartSuggestionsCard } from '@/components/student/SmartSuggestionsCard';
import {
  Sparkles, CheckCircle2, Circle, Crown, Lock, FileText,
  Wand2, BookOpen, Calendar, BarChart3, ExternalLink, Loader2, Target,
  ArrowLeft, Copy, Check, Zap, Brain, Compass,
  Wallet as WalletIcon, GraduationCap, ChevronLeft,
} from 'lucide-react';

type ToolKey = 'summarize' | 'rephrase' | 'analyze';

const TOOL_META: Record<ToolKey, { label: string; desc: string; icon: any; premium: boolean }> = {
  summarize: { label: 'تلخيص', desc: 'لخّص نصاً طويلاً في نقاط واضحة', icon: FileText, premium: false },
  rephrase:  { label: 'إعادة صياغة', desc: 'صياغة احترافية مع الحفاظ على المعنى', icon: Wand2, premium: false },
  analyze:   { label: 'تحليل نص', desc: 'تحليل أكاديمي عميق', icon: BarChart3, premium: true },
};

const STATUS_AR: Record<string, string> = {
  draft: 'مسودة', pending_quote: 'بانتظار العرض', quote_sent: 'تم إرسال العرض',
  quote_accepted: 'تم قبول العرض', awaiting_payment: 'بانتظار الدفع',
  payment_completed: 'تم الدفع', paid: 'مدفوع', in_progress: 'قيد التنفيذ',
  execution: 'قيد التنفيذ', delivered: 'تم التسليم', completed: 'مكتمل',
  contract_pending: 'بانتظار التوقيع', contract_signed: 'تم التوقيع',
  new: 'جديد',
};

const RESOURCE_TYPE_AR: Record<string, string> = {
  pdf: 'ملف PDF', link: 'رابط', template: 'قالب', video: 'فيديو',
  doc: 'مستند', article: 'مقال', course: 'دورة',
};

const translateTracking = (id: string) => id?.startsWith('ORD-') ? id.replace('ORD-', 'طلب-') : id;

const daysUntil = (iso: string | null): number | null => {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

/* ============================================================
 * Quick action tile — banking-style
 * ============================================================ */
const QuickTile: React.FC<{
  to: string; icon: any; label: string; sub?: string;
}> = ({ to, icon: Icon, label, sub }) => (
  <Link
    to={to}
    className="group flex flex-col items-start gap-2 p-3 rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
  >
    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
      <Icon className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium leading-tight truncate">{label}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{sub}</p>}
    </div>
  </Link>
);

/* ============================================================
 * Mini stat (banking-style numeric tile)
 * ============================================================ */
const MiniStat: React.FC<{
  label: string; value: React.ReactNode; sub?: string; icon: any; tone?: 'default' | 'warning' | 'success';
}> = ({ label, value, sub, icon: Icon, tone = 'default' }) => {
  const toneCls = tone === 'warning' ? 'text-warning bg-warning/10'
                 : tone === 'success' ? 'text-success bg-success/10'
                 : 'text-foreground bg-muted';
  return (
    <div className="rounded-2xl border bg-card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${toneCls}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tabular-nums leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
};

/* ============================================================
 * Page
 * ============================================================ */
const StudentHub: React.FC = () => {
  const { user } = useAuth();
  const { summary, loading: gLoading } = useGamification(user?.id);
  const { membership } = useUserMembership();
  const { tasks, loading: tasksLoading, completeTask, refresh: refreshTasks } = useDailyTasks(user?.id);
  const { resources, loading: resLoading } = useStudentResources();
  const { orders: upcoming, loading: ordersLoading } = useUpcomingOrders(user?.id);
  const { streak } = useChallengeAcademy(user?.id);

  const [tool, setTool] = useState<ToolKey>('summarize');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPremium = !!membership;
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'طالب';
  const completedCount = useMemo(() => tasks.filter(t => t.is_completed).length, [tasks]);
  const totalTasks = tasks.length || 1;
  const dailyProgressPct = Math.round((completedCount / totalTasks) * 100);

  const suggestions = useSmartSuggestions({
    tasks, upcoming, summary, isPremium,
  });

  const runAI = async () => {
    if (input.trim().length < 20) { toast.error('أدخل نصاً لا يقل عن 20 حرفاً'); return; }
    setRunning(true); setOutput('');
    try {
      const { data, error } = await supabase.functions.invoke('student-ai-tools', {
        body: { tool, text: input },
      });
      if (error) {
        const ctx: any = (error as any).context;
        let msg = error.message || 'تعذر تنفيذ الطلب';
        try { const j = ctx?.body ? JSON.parse(ctx.body) : null; if (j?.error) msg = j.error; } catch {}
        toast.error(msg); return;
      }
      if ((data as any)?.error) { toast.error((data as any).error); return; }
      setOutput((data as any)?.output || '');
      toast.success('تم التنفيذ بنجاح — اكتسبت نقاطاً 🎉');
      refreshTasks();
    } catch (e: any) {
      toast.error(e?.message || 'خطأ غير متوقع');
    } finally { setRunning(false); }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true); toast.success('تم النسخ');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTaskAction = async (code: string, link: string | null) => {
    if (code === 'daily_login') {
      const { error } = await completeTask(code);
      if (!error) toast.success('+5 نقاط على دخولك اليومي 🎉');
    } else if (link) { window.location.href = link; }
  };

  return (
    <ClientLayout>
      <div dir="rtl" className="space-y-6">

        {/* ===== Header — banking style ===== */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> قسم الطالب
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              أهلاً، {displayName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              مركز قيادتك الأكاديمي — كل ما تحتاجه في مكان واحد.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/student/tracks">
                <Compass className="w-4 h-4" /> المسارات
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link to="/services">
                ابدأ طلب جديد <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </header>

        {/* ===== Top row: XP widget + Smart Suggestions ===== */}
        <div className="grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <StudentXpWidget
              summary={summary}
              loading={gLoading}
              streak={streak?.current_streak ?? 0}
              isPremium={isPremium}
            />
          </div>
          <div className="lg:col-span-7">
            <SmartSuggestionsCard suggestions={suggestions} max={4} />
          </div>
        </div>

        {/* ===== Mini stats row ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MiniStat
            label="مهام اليوم"
            value={`${completedCount}/${tasks.length || 0}`}
            sub={`${dailyProgressPct}% مكتمل`}
            icon={Target}
            tone={dailyProgressPct === 100 ? 'success' : 'default'}
          />
          <MiniStat
            label="طلباتي النشطة"
            value={upcoming.length}
            sub={upcoming.length > 0 ? 'انقر "جدولي" للتفاصيل' : 'لا طلبات نشطة'}
            icon={Calendar}
          />
          <MiniStat
            label="موارد المكتبة"
            value={resources.length}
            sub="قوالب وأدلة جاهزة"
            icon={BookOpen}
          />
          <MiniStat
            label="حالتك"
            value={isPremium ? 'بريميوم' : 'مجاني'}
            sub={isPremium ? 'مفعّل' : 'ترقية متاحة'}
            icon={isPremium ? Crown : WalletIcon}
            tone={isPremium ? 'warning' : 'default'}
          />
        </div>

        {/* ===== Quick access — frequently used tools ===== */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">وصول سريع</h2>
            <Link to="/services" className="text-xs text-primary hover:underline flex items-center gap-1">
              كل الأدوات <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <QuickTile to="/student/tracks"               icon={Compass}    label="المسارات"        sub="حسب التخصص" />
            <QuickTile to="/student/academic-cv"          icon={FileText}   label="CV الأكاديمي"    sub="6 قوالب" />
            <QuickTile to="/student/mind-map"             icon={Brain}      label="خريطة ذهنية"     sub="تفاعلية" />
            <QuickTile to="/student/statistical-analysis" icon={BarChart3}  label="تحليل إحصائي"    sub="T/ANOVA/χ²" />
            <QuickTile to="/research/smart-editor"        icon={Wand2}      label="المحرر الذكي"    sub="تصحيح وصياغة" />
            <QuickTile to="/student/library"              icon={BookOpen}   label="المكتبة"          sub="موارد منتقاة" />
          </div>
        </section>

        {/* ===== Tabs (kept from original — features preserved) ===== */}
        <Tabs defaultValue="ai" className="w-full" dir="rtl" id="daily-tasks">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="ai"       className="gap-2 rounded-lg"><Sparkles className="w-4 h-4" />أدوات AI</TabsTrigger>
            <TabsTrigger value="tasks"    className="gap-2 rounded-lg"><Target className="w-4 h-4" />مهام اليوم</TabsTrigger>
            <TabsTrigger value="library"  className="gap-2 rounded-lg"><BookOpen className="w-4 h-4" />المكتبة</TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2 rounded-lg"><Calendar className="w-4 h-4" />جدولي</TabsTrigger>
          </TabsList>

          {/* AI Tools */}
          <TabsContent value="ai" className="mt-4">
            <Card className="p-5 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold">أدوات الذكاء الاصطناعي</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                المجاني: 3 استخدامات يومياً لكل أداة. للمشتركين: 50 يومياً + أداة التحليل.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
                {(Object.keys(TOOL_META) as ToolKey[]).map((k) => {
                  const T = TOOL_META[k];
                  const locked = T.premium && !isPremium;
                  const active = tool === k;
                  return (
                    <button
                      key={k}
                      onClick={() => !locked && setTool(k)}
                      disabled={locked}
                      className={`relative text-right p-3 rounded-xl border transition-all ${
                        active ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border bg-card hover:border-primary/40'
                      } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <T.icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                        {locked && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                        {T.premium && !locked && <Crown className="w-3.5 h-3.5 text-warning" />}
                      </div>
                      <p className="font-semibold text-sm">{T.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{T.desc}</p>
                    </button>
                  );
                })}
              </div>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ألصق نصك هنا (20 حرف على الأقل)..."
                rows={6} dir="rtl" maxLength={8000}
                className="resize-y text-right rounded-xl"
              />
              <div className="flex flex-wrap items-center gap-2 justify-between mt-3">
                <p className="text-xs text-muted-foreground tabular-nums">{input.length} / 8000</p>
                <Button onClick={runAI} disabled={running || input.trim().length < 20} className="gap-2 rounded-xl">
                  {running ? (<><Loader2 className="w-4 h-4 animate-spin" />جارٍ التنفيذ</>)
                           : (<><Zap className="w-4 h-4" />تنفيذ</>)}
                </Button>
              </div>

              <AnimatePresence>
                {output && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 p-4 bg-muted/40 rounded-xl border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" /> النتيجة
                      </p>
                      <Button size="sm" variant="ghost" onClick={copyOutput} className="gap-1.5 h-8">
                        {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'تم النسخ' : 'نسخ'}
                      </Button>
                    </div>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{output}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isPremium && (
                <div className="mt-4 p-3 rounded-xl border border-warning/30 bg-warning/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-warning" />
                    <p className="text-xs">فعّل العضوية لـ 50 استخدام يومياً + أداة التحليل</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/membership" className="gap-1.5">ترقية <ArrowLeft className="w-3.5 h-3.5" /></Link>
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Daily Tasks */}
          <TabsContent value="tasks" className="mt-4">
            <Card className="p-5 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold">مهامك اليومية</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">أنجز المهام واكسب نقاطاً تترجم إلى مكافآت ومستويات.</p>

              <div className="mb-4 p-3 rounded-xl bg-muted/40 border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">
                    أنجزت <span className="font-bold text-foreground tabular-nums">{completedCount}</span> من {tasks.length} مهام اليوم
                  </p>
                  <p className="text-sm font-bold text-primary tabular-nums">{dailyProgressPct}%</p>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${dailyProgressPct}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-l from-primary to-secondary rounded-full"
                  />
                </div>
              </div>

              {tasksLoading ? (
                <div className="space-y-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        t.is_completed ? 'bg-success/5 border-success/30' : 'bg-card border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {t.is_completed
                          ? <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                          : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{t.title_ar}</p>
                          {t.description_ar && <p className="text-[11px] text-muted-foreground truncate">{t.description_ar}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="font-bold tabular-nums">+{t.points_reward}</Badge>
                        {!t.is_completed && (
                          <Button size="sm" variant="outline" onClick={() => handleTaskAction(t.code, t.action_link)}>
                            {t.code === 'daily_login' ? 'تنفيذ' : 'فتح'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Library */}
          <TabsContent value="library" className="mt-4">
            <Card className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold">مكتبة الطالب</h3>
                </div>
                <Button asChild size="sm" variant="ghost" className="gap-1 h-8">
                  <Link to="/student/library">عرض الكل <ChevronLeft className="w-3 h-3" /></Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">موارد وقوالب أكاديمية مختارة بعناية</p>
              {resLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
              ) : resources.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">لا توجد موارد منشورة بعد</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resources.slice(0, 6).map((r) => {
                    const locked = r.is_premium && !isPremium;
                    return (
                      <a
                        key={r.id}
                        href={locked ? '/membership' : r.url}
                        target={locked ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="block p-3 rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">{RESOURCE_TYPE_AR[r.resource_type] || r.resource_type}</Badge>
                            {r.is_premium && <Crown className="w-3.5 h-3.5 text-warning" />}
                          </div>
                          {locked ? <Lock className="w-3.5 h-3.5 text-muted-foreground" /> : <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />}
                        </div>
                        <p className="font-semibold text-sm">{r.title}</p>
                        {r.description && <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{r.description}</p>}
                      </a>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule" className="mt-4">
            <Card className="p-5 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold">جدولي والمواعيد النهائية</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">طلباتك النشطة مرتبة حسب الموعد النهائي</p>
              {ordersLoading ? (
                <div className="space-y-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
              ) : upcoming.length === 0 ? (
                <div className="text-center py-10">
                  <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground mb-4">لا توجد طلبات نشطة حالياً</p>
                  <Button asChild size="sm">
                    <Link to="/services" className="gap-2">تصفح الخدمات <ArrowLeft className="w-4 h-4" /></Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {upcoming.map((o) => {
                    const days = daysUntil(o.deadline);
                    const urgent = days !== null && days <= 3 && days >= 0;
                    const overdue = days !== null && days < 0;
                    return (
                      <Link
                        key={o.id}
                        to={`/orders/${o.id}`}
                        className={`block p-3 rounded-xl border transition-all hover:shadow-sm ${
                          overdue ? 'border-destructive/40 bg-destructive/5' :
                          urgent ? 'border-warning/40 bg-warning/5' :
                          'border-border bg-card hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="font-semibold text-sm truncate">{o.service_name || 'طلب'}</p>
                              <Badge variant="outline" className="text-[10px]">{translateTracking(o.tracking_id)}</Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {STATUS_AR[o.lifecycle_status] || o.lifecycle_status}
                              {o.deadline && days !== null && (
                                <> · {overdue ? `متأخر ${Math.abs(days)} يوم` : days === 0 ? 'اليوم' : `${days} يوم متبقٍ`}</>
                              )}
                            </p>
                          </div>
                          <span className="text-xs font-bold tabular-nums text-primary shrink-0">{o.progress_percentage}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${overdue ? 'bg-destructive' : urgent ? 'bg-warning' : 'bg-primary'}`}
                            style={{ width: `${o.progress_percentage}%` }}
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </ClientLayout>
  );
};

export default StudentHub;
