import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/SimpleAuthProvider';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useGamification } from '@/hooks/useGamification';
import { useUserMembership } from '@/hooks/useMembership';
import { useDailyTasks, useStudentResources, useUpcomingOrders } from '@/hooks/useStudentHub';
import { BentoCard } from '@/components/student/BentoCard';
import { StatTile } from '@/components/student/StatTile';
import { FeatureTile } from '@/components/student/FeatureTile';
import {
  Sparkles, Trophy, Flame, CheckCircle2, Circle, Crown, Lock, FileText,
  Wand2, BookOpen, Calendar, BarChart3, ExternalLink, Loader2, GraduationCap, Target,
  Clock, ArrowLeft, Copy, Check, Zap, Brain, Rocket, TrendingUp, Award, Flag,
  Compass, Library, MessageSquare,
} from 'lucide-react';

type ToolKey = 'summarize' | 'rephrase' | 'analyze';

const TOOL_META: Record<ToolKey, { label: string; desc: string; icon: any; premium: boolean; gradient: string }> = {
  summarize: { label: 'تلخيص', desc: 'لخّص نصاً طويلاً في نقاط واضحة', icon: FileText, premium: false, gradient: 'from-primary/20 to-accent/20' },
  rephrase: { label: 'إعادة صياغة', desc: 'صياغة احترافية مع الحفاظ على المعنى', icon: Wand2, premium: false, gradient: 'from-secondary/20 to-primary/20' },
  analyze: { label: 'تحليل نص', desc: 'تحليل أكاديمي عميق', icon: BarChart3, premium: true, gradient: 'from-warning/20 to-secondary/20' },
};

const formatDate = (iso: string | null) => {
  if (!iso) return null;
  try { return new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return null; }
};
const daysUntil = (iso: string | null): number | null => {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

const STATUS_AR: Record<string, string> = {
  draft: 'مسودة', pending_quote: 'بانتظار العرض', quote_sent: 'تم إرسال العرض',
  quote_accepted: 'تم قبول العرض', quote_rejected: 'تم رفض العرض',
  awaiting_payment: 'بانتظار الدفع', payment_pending: 'بانتظار الدفع',
  payment_completed: 'تم الدفع', paid: 'مدفوع', in_progress: 'قيد التنفيذ',
  execution: 'قيد التنفيذ', execution_started: 'بدأ التنفيذ',
  delivered: 'تم التسليم', completed: 'مكتمل', cancelled: 'ملغي',
  contract_pending: 'بانتظار التوقيع', contract_signed: 'تم التوقيع',
  client_confirmed: 'تم التأكيد', new: 'جديد', received: 'تم الاستلام',
};

const translateTracking = (id: string) => id?.startsWith('ORD-') ? id.replace('ORD-', 'طلب-') : id;

const RESOURCE_TYPE_AR: Record<string, string> = {
  pdf: 'ملف PDF', link: 'رابط', template: 'قالب', video: 'فيديو',
  doc: 'مستند', article: 'مقال', course: 'دورة',
};

const StudentHub: React.FC = () => {
  const { user } = useAuth();
  const { summary, loading: gLoading } = useGamification(user?.id);
  const { membership } = useUserMembership();
  const { tasks, loading: tasksLoading, completeTask, refresh: refreshTasks } = useDailyTasks(user?.id);
  const { resources, loading: resLoading } = useStudentResources();
  const { orders: upcoming, loading: ordersLoading } = useUpcomingOrders(user?.id);

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
      <div dir="rtl" className="space-y-8">
        {/* ============================== HERO 3D ============================== */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-border/60"
        >
          {/* Layered gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--background)/0.15),transparent_60%)]" />
          <div className="absolute inset-0 bento-grid-pattern opacity-15" />

          {/* Floating orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-10 -right-20 w-72 h-72 rounded-full bg-white/15 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-warning/30 blur-3xl"
          />

          {/* Orbiting decorative icons */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
            {[Brain, Rocket, Award, Compass].map((I, i) => (
              <motion.div
                key={i}
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 20 + i * 4, repeat: Infinity, ease: 'linear' }}
                style={{ width: 200 + i * 40, height: 200 + i * 40, left: -100 - i * 20, top: -100 - i * 20 }}
              >
                <I className="w-5 h-5 text-white/40 absolute top-0 left-1/2 -translate-x-1/2" />
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 p-6 md:p-10 grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 text-white">
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-4"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-medium">قسم الطالب الذكي</span>
                {isPremium && (
                  <Badge className="bg-warning text-warning-foreground border-0 text-[10px] mr-1">
                    <Crown className="w-3 h-3 ml-1" /> بريميوم
                  </Badge>
                )}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight leading-tight"
              >
                أهلاً، {displayName}{' '}
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block"
                >👋</motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-white/85 text-base md:text-lg max-w-xl mb-6"
              >
                منصتك الأكاديمية المتكاملة — أدوات AI، تحليل إحصائي، CV احترافي، خرائط ذهنية، ومسارات تخصصية.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 shadow-xl">
                  <Link to="/student/tracks">
                    <Compass className="w-5 h-5" /> ابدأ مسارك
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 gap-2">
                  <Link to="/services">
                    تصفح الخدمات <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Stats card */}
            {!gLoading && summary && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5"
              >
                <div className="relative p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/25 shadow-2xl">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-white">
                        <div className="w-10 h-10 rounded-xl bg-warning/90 flex items-center justify-center shadow-lg">
                          <Trophy className="w-5 h-5 text-warning-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-white/70">رصيد النقاط</p>
                          <p className="text-2xl font-bold">{summary.total_points}</p>
                        </div>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {summary.current_level?.name_ar || 'مبتدئ'}
                      </Badge>
                    </div>
                    {summary.next_level && (
                      <>
                        <div className="flex items-center justify-between text-xs text-white/85 mb-1.5">
                          <span>المستوى التالي: {summary.next_level.name_ar}</span>
                          <span className="font-bold">{summary.progress_percent}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${summary.progress_percent}%` }}
                            transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-warning via-white to-warning rounded-full"
                          />
                        </div>
                        <p className="text-[11px] text-white/70 mt-2">
                          {summary.points_to_next} نقطة للوصول إلى {summary.next_level.name_ar}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* ============================== STATS ============================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatTile
            icon={Flame}
            label="مهام اليوم"
            value={`${completedCount}/${tasks.length}`}
            tone="warning"
            delay={0.05}
            trend={{ value: `${dailyProgressPct}% مكتمل`, up: dailyProgressPct > 0 }}
          />
          <StatTile
            icon={Trophy}
            label="نقاطك"
            value={summary?.total_points ?? 0}
            tone="warning"
            delay={0.1}
            trend={{ value: summary?.current_level?.name_ar || 'مبتدئ', up: true }}
          />
          <StatTile
            icon={isPremium ? Crown : Award}
            label="حالتك"
            value={isPremium ? 'بريميوم' : 'مجاني'}
            tone={isPremium ? 'secondary' : 'primary'}
            delay={0.15}
          />
          <Link to="/student/library" className="block">
            <StatTile
              icon={BookOpen}
              label="موارد المكتبة"
              value={resources.length}
              tone="accent"
              delay={0.2}
            />
          </Link>
        </div>

        {/* ============================== BENTO FEATURE GRID ============================== */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="flex items-end justify-between mb-4"
          >
            <div>
              <p className="text-xs text-muted-foreground mb-1">الأدوات الذكية</p>
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="text-shimmer">منصتك الأكاديمية</span>
              </h2>
            </div>
            <Badge variant="outline" className="hidden md:inline-flex">
              <Sparkles className="w-3 h-3 ml-1 text-primary" /> {6} أدوات
            </Badge>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5" style={{ perspective: 1200 }}>
            <FeatureTile
              to="/student/tracks"
              icon={Compass}
              title="المسارات التخصصية"
              description="أدوات AI وخدمات احترافية لكل تخصص — طبي، تقني، أعمال، قانون والمزيد"
              gradient="from-primary to-secondary"
              glow="primary"
              badge="جديد"
              cta="استكشف المسارات"
              delay={0.05}
              decorIcons={[Flag, Brain]}
              pills={['طبي', 'تقني', 'أعمال', 'قانون', '+8 مسارات']}
            />
            <FeatureTile
              to="/student/academic-cv"
              icon={FileText}
              title="CV الأكاديمي الذكي"
              description="6 قوالب احترافية • عربي/إنجليزي • تحميل وطباعة بدون علامة تجارية"
              gradient="from-secondary to-primary"
              glow="secondary"
              badge="جديد"
              cta="أنشئ سيرتك"
              delay={0.1}
              decorIcons={[Award]}
              pills={['6 قوالب', 'PDF', 'مجاني للأعضاء']}
            />
            <FeatureTile
              to="/student/statistical-analysis"
              icon={BarChart3}
              title="التحليل الإحصائي"
              description="ارفع CSV/Excel • T-Test, ANOVA, Correlation, Chi² • تفسير أكاديمي + تقرير PDF"
              gradient="from-accent to-primary"
              glow="accent"
              badge="جديد"
              cta="ابدأ التحليل"
              delay={0.15}
              decorIcons={[TrendingUp]}
              pills={['T-Test', 'ANOVA', 'Correlation', 'Chi²']}
            />
            <FeatureTile
              to="/research/smart-editor"
              icon={Wand2}
              title="المحرر الذكي"
              description="تصحيح، إعادة صياغة، رفع الأسلوب الأكاديمي، اختصار، وتوسيع نصوصك"
              gradient="from-success to-accent"
              glow="accent"
              cta="ابدأ الكتابة"
              delay={0.2}
              decorIcons={[Sparkles]}
              pills={['Standard مجاني', 'Pro متقدم']}
            />
            <FeatureTile
              to="/student/mind-map"
              icon={Brain}
              title="الخريطة الذهنية"
              description="حوّل أي نص إلى خريطة ذهنية تفاعلية قابلة للتصدير PDF/PNG"
              gradient="from-warning to-secondary"
              glow="secondary"
              cta="أنشئ خريطة"
              delay={0.25}
              decorIcons={[Library]}
              pills={['تفاعلي', 'PDF', 'PNG']}
            />
            <FeatureTile
              to="/services"
              icon={Rocket}
              title="كل الخدمات"
              description="استعرض كل الخدمات الأكاديمية — ترجمة، أبحاث، رسائل، عروض، تدقيق وأكثر"
              gradient="from-primary to-accent"
              glow="primary"
              cta="تصفح الكل"
              delay={0.3}
              pills={['+25 خدمة']}
            />
          </div>
        </div>

        {/* ============================== TABS ============================== */}
        <Tabs defaultValue="ai" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1.5 bg-muted/50 rounded-2xl">
            <TabsTrigger value="ai" className="gap-2 data-[state=active]:shadow-md rounded-xl">
              <Sparkles className="w-4 h-4" />أدوات AI
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 data-[state=active]:shadow-md rounded-xl">
              <Target className="w-4 h-4" />مهام اليوم
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2 data-[state=active]:shadow-md rounded-xl">
              <BookOpen className="w-4 h-4" />المكتبة
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2 data-[state=active]:shadow-md rounded-xl">
              <Calendar className="w-4 h-4" />جدولي
            </TabsTrigger>
          </TabsList>

          {/* AI TOOLS */}
          <TabsContent value="ai" className="space-y-4 mt-5">
            <BentoCard delay={0.05} glow="primary" pattern>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">أدوات الذكاء الاصطناعي</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  المجاني: 3 استخدامات يومياً لكل أداة. للمشتركين: 50 يومياً + أداة التحليل.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {(Object.keys(TOOL_META) as ToolKey[]).map((k, i) => {
                    const T = TOOL_META[k];
                    const locked = T.premium && !isPremium;
                    const active = tool === k;
                    return (
                      <motion.button
                        key={k}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={!locked ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!locked ? { scale: 0.98 } : {}}
                        onClick={() => !locked && setTool(k)}
                        disabled={locked}
                        className={`relative text-right p-4 rounded-xl border transition-all overflow-hidden ${
                          active
                            ? 'border-primary bg-gradient-to-bl ' + T.gradient + ' shadow-md'
                            : 'border-border hover:border-primary/50 bg-card'
                        } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {active && (
                          <motion.div
                            layoutId="activeTool"
                            className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                          />
                        )}
                        <div className="flex items-center justify-between mb-2 relative z-10">
                          <T.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                          {locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                          {T.premium && !locked && <Crown className="w-4 h-4 text-warning" />}
                        </div>
                        <p className="font-semibold mb-1 relative z-10">{T.label}</p>
                        <p className="text-xs text-muted-foreground relative z-10">{T.desc}</p>
                      </motion.button>
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
                  <p className="text-xs text-muted-foreground">{input.length} / 8000 حرف</p>
                  <Button onClick={runAI} disabled={running || input.trim().length < 20} className="gap-2 rounded-xl">
                    {running ? (<><Loader2 className="w-4 h-4 animate-spin" />جارٍ التنفيذ</>)
                             : (<><Zap className="w-4 h-4" />تنفيذ</>)}
                  </Button>
                </div>

                <AnimatePresence>
                  {output && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-gradient-to-bl from-primary/5 to-secondary/5 rounded-xl border border-primary/20"
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
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-4 p-4 rounded-xl border border-warning/30 bg-gradient-to-l from-warning/10 to-warning/5 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-warning" />
                      <p className="text-sm">فعّل العضوية لـ 50 استخدام يومياً + أداة التحليل</p>
                    </div>
                    <Button asChild size="sm" className="bg-gradient-to-l from-warning to-secondary hover:opacity-90 text-warning-foreground border-0">
                      <Link to="/membership" className="gap-1.5">ترقية <ArrowLeft className="w-3.5 h-3.5" /></Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </BentoCard>
          </TabsContent>

          {/* DAILY TASKS */}
          <TabsContent value="tasks" className="space-y-4 mt-5">
            <BentoCard delay={0.05} glow="warning">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">مهامك اليومية</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">أنجز المهام واكسب نقاطاً تترجم إلى مكافآت ومستويات.</p>

                <div className="mb-5 p-4 rounded-xl bg-gradient-to-l from-primary/5 to-secondary/5 border border-primary/15">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">
                      أنجزت <span className="font-bold text-foreground">{completedCount}</span> من {tasks.length} مهام اليوم
                    </p>
                    <p className="text-sm font-bold text-primary">{dailyProgressPct}%</p>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${dailyProgressPct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                    />
                  </div>
                </div>

                {tasksLoading ? (
                  <div className="space-y-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((t, i) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.005 }}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                          t.is_completed ? 'bg-success/5 border-success/30' : 'bg-card border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {t.is_completed ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                            </motion.div>
                          ) : (<Circle className="w-5 h-5 text-muted-foreground shrink-0" />)}
                          <div className="min-w-0">
                            <p className="font-medium truncate">{t.title_ar}</p>
                            {t.description_ar && (<p className="text-xs text-muted-foreground truncate">{t.description_ar}</p>)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className="font-bold">+{t.points_reward}</Badge>
                          {!t.is_completed && (
                            <Button size="sm" variant="outline" onClick={() => handleTaskAction(t.code, t.action_link)}>
                              {t.code === 'daily_login' ? 'تنفيذ' : 'فتح'}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </BentoCard>
          </TabsContent>

          {/* LIBRARY */}
          <TabsContent value="library" className="space-y-4 mt-5">
            <BentoCard delay={0.05} glow="accent">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">مكتبة الطالب</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">موارد وقوالب أكاديمية مختارة بعناية</p>
                {resLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}</div>
                ) : resources.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد موارد منشورة بعد</p>
                    <p className="text-xs mt-1">سيتم إضافة موارد قريباً من قبل الفريق</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resources.map((r, i) => {
                      const locked = r.is_premium && !isPremium;
                      return (
                        <motion.a
                          key={r.id}
                          href={locked ? '/membership' : r.url}
                          target={locked ? '_self' : '_blank'}
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }}
                          className="block p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{RESOURCE_TYPE_AR[r.resource_type] || r.resource_type}</Badge>
                              {r.is_premium && <Crown className="w-4 h-4 text-warning" />}
                            </div>
                            {locked ? (<Lock className="w-4 h-4 text-muted-foreground" />)
                                    : (<ExternalLink className="w-4 h-4 text-muted-foreground" />)}
                          </div>
                          <p className="font-semibold mb-1">{r.title}</p>
                          {r.description && (<p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>)}
                        </motion.a>
                      );
                    })}
                  </div>
                )}
              </div>
            </BentoCard>
          </TabsContent>

          {/* SCHEDULE */}
          <TabsContent value="schedule" className="space-y-4 mt-5">
            <BentoCard delay={0.05} glow="secondary">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">جدولي والمواعيد النهائية</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">طلباتك النشطة مرتبة حسب الموعد النهائي</p>
                {ordersLoading ? (
                  <div className="space-y-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
                ) : upcoming.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-4">لا توجد طلبات نشطة حالياً</p>
                    <Button asChild>
                      <Link to="/services" className="gap-2">تصفح الخدمات <ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((o, i) => {
                      const days = daysUntil(o.deadline);
                      const urgent = days !== null && days <= 3 && days >= 0;
                      const overdue = days !== null && days < 0;
                      return (
                        <motion.div
                          key={o.id}
                          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.005 }}
                        >
                          <Link
                            to={`/orders/${o.id}`}
                            className={`block p-4 rounded-xl border transition-all hover:shadow-md ${
                              overdue ? 'border-destructive/40 bg-destructive/5' :
                              urgent ? 'border-warning/40 bg-warning/5' :
                              'border-border bg-card hover:border-primary/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <p className="font-semibold truncate">{o.service_name || 'طلب'}</p>
                                  <Badge variant="outline" className="text-xs">{translateTracking(o.tracking_id)}</Badge>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {STATUS_AR[o.lifecycle_status] || o.lifecycle_status}
                                </Badge>
                              </div>
                              {o.deadline && (
                                <div className={`text-left shrink-0 ${overdue ? 'text-destructive' : urgent ? 'text-warning' : 'text-muted-foreground'}`}>
                                  <div className="flex items-center gap-1 text-xs justify-end">
                                    <Clock className="w-3.5 h-3.5" />
                                    {overdue ? `متأخر ${Math.abs(days!)}ي` :
                                     days === 0 ? 'اليوم' :
                                     days === 1 ? 'غداً' :
                                     `بعد ${days} أيام`}
                                  </div>
                                  <p className="text-[10px] mt-0.5">{formatDate(o.deadline)}</p>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">التقدم</span>
                                <span className="font-semibold">{o.progress_percentage}%</span>
                              </div>
                              <Progress value={o.progress_percentage} className="h-1.5" />
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                    <Button asChild variant="outline" className="w-full mt-2">
                      <Link to="/orders" className="gap-2">عرض كل الطلبات <ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                  </div>
                )}
              </div>
            </BentoCard>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default StudentHub;
