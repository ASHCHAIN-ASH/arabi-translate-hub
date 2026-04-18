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
import {
  Sparkles, Trophy, Flame, CheckCircle2, Circle, Crown, Lock, FileText,
  Wand2, BookOpen, Calendar, BarChart3, ExternalLink, Loader2, GraduationCap, Target,
  Clock, ArrowLeft, Copy, Check, Zap,
} from 'lucide-react';

type ToolKey = 'summarize' | 'rephrase' | 'analyze';

const TOOL_META: Record<ToolKey, { label: string; desc: string; icon: any; premium: boolean; gradient: string }> = {
  summarize: { label: 'تلخيص', desc: 'لخّص نصاً طويلاً في نقاط واضحة', icon: FileText, premium: false, gradient: 'from-blue-500/20 to-cyan-500/20' },
  rephrase: { label: 'إعادة صياغة', desc: 'صياغة احترافية مع الحفاظ على المعنى', icon: Wand2, premium: false, gradient: 'from-violet-500/20 to-fuchsia-500/20' },
  analyze: { label: 'تحليل نص', desc: 'تحليل أكاديمي عميق', icon: BarChart3, premium: true, gradient: 'from-amber-500/20 to-orange-500/20' },
};

const formatDate = (iso: string | null) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return null; }
};

const daysUntil = (iso: string | null): number | null => {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
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

  const runAI = async () => {
    if (input.trim().length < 20) {
      toast.error('أدخل نصاً لا يقل عن 20 حرفاً');
      return;
    }
    setRunning(true);
    setOutput('');
    try {
      const { data, error } = await supabase.functions.invoke('student-ai-tools', {
        body: { tool, text: input },
      });
      if (error) {
        const ctx: any = (error as any).context;
        let msg = error.message || 'تعذر تنفيذ الطلب';
        try {
          const j = ctx?.body ? JSON.parse(ctx.body) : null;
          if (j?.error) msg = j.error;
        } catch {}
        toast.error(msg);
        return;
      }
      if ((data as any)?.error) {
        toast.error((data as any).error);
        return;
      }
      setOutput((data as any)?.output || '');
      toast.success('تم التنفيذ بنجاح — اكتسبت نقاطاً 🎉');
      refreshTasks();
    } catch (e: any) {
      toast.error(e?.message || 'خطأ غير متوقع');
    } finally {
      setRunning(false);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success('تم النسخ');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTaskAction = async (code: string, link: string | null) => {
    if (code === 'daily_login') {
      const { error } = await completeTask(code);
      if (!error) toast.success('+5 نقاط على دخولك اليومي 🎉');
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <ClientLayout>
      <div dir="rtl" className="space-y-6">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-bl from-primary/15 via-secondary/10 to-primary/5 p-6 md:p-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                <span className="text-sm text-muted-foreground">قسم الطالب</span>
                {isPremium && (
                  <Badge className="bg-gradient-to-l from-amber-500 to-orange-600 text-white border-0">
                    <Crown className="w-3 h-3 ml-1" /> بريميوم
                  </Badge>
                )}
              </div>
              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl md:text-3xl font-bold mb-2"
              >
                أهلاً، {displayName} <motion.span animate={{ rotate: [0, 14, -8, 14, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }} className="inline-block">👋</motion.span>
              </motion.h1>
              <p className="text-muted-foreground">مساعدك الأكاديمي اليومي — أدوات ذكية، نقاط، ومكافآت.</p>
            </div>

            {!gLoading && summary && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-background/80 backdrop-blur-md rounded-xl p-4 min-w-[260px] border border-border shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold">{summary.total_points} نقطة</span>
                  </div>
                  <Badge variant="secondary">{summary.current_level?.name_ar || 'مبتدئ'}</Badge>
                </div>
                {summary.next_level && (
                  <>
                    <Progress value={summary.progress_percent} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {summary.points_to_next} نقطة للوصول إلى {summary.next_level.name_ar}
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Flame, label: 'مهام اليوم', value: `${completedCount}/${tasks.length}`, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { icon: Trophy, label: 'نقاطك', value: summary?.total_points ?? 0, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { icon: Crown, label: 'حالتك', value: isPremium ? 'بريميوم' : 'مجاني', color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { icon: BookOpen, label: 'موارد المكتبة', value: resources.length, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <Card className="hover:shadow-lg transition-shadow border-border/60">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-bold">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* مسارات تخصصية CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/student/tracks" className="block group">
            <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-2xl bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
              <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-primary/20 blur-3xl group-hover:scale-110 transition-transform duration-500" />
              <CardContent className="relative p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Sparkles className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg md:text-xl font-bold">المسارات التخصصية</h3>
                      <Badge className="bg-amber-500 text-white border-0">جديد</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      أدوات AI وخدمات احترافية لكل تخصص — طبي، تقني، أعمال، قانون والمزيد
                    </p>
                  </div>
                </div>
                <Button variant="default" size="lg" className="shrink-0 gap-2 group-hover:gap-3 transition-all hidden sm:inline-flex">
                  استكشف
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* TABS */}
        <Tabs defaultValue="ai" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted/60">
            <TabsTrigger value="ai" className="gap-2 data-[state=active]:shadow-md">
              <Sparkles className="w-4 h-4" />أدوات AI
            </TabsTrigger>
            <TabsTrigger value="mindmap" className="gap-2 data-[state=active]:shadow-md" asChild>
              <Link to="/student/mind-map">
                <Wand2 className="w-4 h-4" />الخريطة الذهنية
              </Link>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 data-[state=active]:shadow-md">
              <Target className="w-4 h-4" />المهام اليومية
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2 data-[state=active]:shadow-md">
              <BookOpen className="w-4 h-4" />المكتبة
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2 data-[state=active]:shadow-md">
              <Calendar className="w-4 h-4" />جدولي
            </TabsTrigger>
          </TabsList>

          {/* AI TOOLS */}
          <TabsContent value="ai" className="space-y-4 mt-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    أدوات الذكاء الاصطناعي
                  </CardTitle>
                  <CardDescription>
                    المجاني: 3 استخدامات يومياً لكل أداة. للمشتركين: 50 يومياً + أداة التحليل.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                            {T.premium && !locked && <Crown className="w-4 h-4 text-amber-500" />}
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
                    rows={6}
                    dir="rtl"
                    maxLength={8000}
                    className="resize-y text-right"
                  />
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <p className="text-xs text-muted-foreground">{input.length} / 8000 حرف</p>
                    <Button onClick={runAI} disabled={running || input.trim().length < 20} className="gap-2">
                      {running ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />جارٍ التنفيذ</>
                      ) : (
                        <><Zap className="w-4 h-4" />تنفيذ</>
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {output && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-gradient-to-bl from-primary/5 to-secondary/5 rounded-lg border border-primary/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            النتيجة
                          </p>
                          <Button size="sm" variant="ghost" onClick={copyOutput} className="gap-1.5 h-8">
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'تم النسخ' : 'نسخ'}
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{output}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isPremium && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-lg border border-amber-500/30 bg-gradient-to-l from-amber-500/10 to-orange-500/5 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-500" />
                        <p className="text-sm">فعّل العضوية لـ 50 استخدام يومياً + أداة التحليل</p>
                      </div>
                      <Button asChild size="sm" className="bg-gradient-to-l from-amber-500 to-orange-600 hover:opacity-90 text-white border-0">
                        <Link to="/membership" className="gap-1.5">
                          ترقية <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* DAILY TASKS */}
          <TabsContent value="tasks" className="space-y-4 mt-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    مهامك اليومية
                  </CardTitle>
                  <CardDescription>أنجز المهام واكسب نقاطاً تترجم إلى مكافآت ومستويات.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">
                        أنجزت {completedCount} من {tasks.length} مهام اليوم
                      </p>
                      <p className="text-xs font-semibold text-primary">
                        {Math.round((completedCount / totalTasks) * 100)}%
                      </p>
                    </div>
                    <Progress value={(completedCount / totalTasks) * 100} className="h-2" />
                  </div>

                  {tasksLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tasks.map((t, i) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.005, x: -2 }}
                          className={`p-4 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                            t.is_completed
                              ? 'bg-emerald-500/5 border-emerald-500/30'
                              : 'bg-card border-border hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {t.is_completed ? (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                              </motion.div>
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium truncate">{t.title_ar}</p>
                              {t.description_ar && (
                                <p className="text-xs text-muted-foreground truncate">{t.description_ar}</p>
                              )}
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
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* LIBRARY */}
          <TabsContent value="library" className="space-y-4 mt-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    مكتبة الطالب
                  </CardTitle>
                  <CardDescription>موارد وقوالب أكاديمية مختارة بعناية</CardDescription>
                </CardHeader>
                <CardContent>
                  {resLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full" />)}
                    </div>
                  ) : resources.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>لا توجد موارد منشورة بعد</p>
                      <p className="text-xs mt-1">سيتم إضافة موارد قريباً من قبل الفريق</p>
                    </motion.div>
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -3 }}
                            className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{RESOURCE_TYPE_AR[r.resource_type] || r.resource_type}</Badge>
                                {r.is_premium && <Crown className="w-4 h-4 text-amber-500" />}
                              </div>
                              {locked ? (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <p className="font-semibold mb-1">{r.title}</p>
                            {r.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                            )}
                          </motion.a>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* SCHEDULE */}
          <TabsContent value="schedule" className="space-y-4 mt-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    جدولي والمواعيد النهائية
                  </CardTitle>
                  <CardDescription>طلباتك النشطة مرتبة حسب الموعد النهائي</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                    </div>
                  ) : upcoming.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-10"
                    >
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground mb-4">لا توجد طلبات نشطة حالياً</p>
                      <Button asChild>
                        <Link to="/services" className="gap-2">
                          تصفح الخدمات <ArrowLeft className="w-4 h-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {upcoming.map((o, i) => {
                        const days = daysUntil(o.deadline);
                        const urgent = days !== null && days <= 3 && days >= 0;
                        const overdue = days !== null && days < 0;
                        return (
                          <motion.div
                            key={o.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.005 }}
                          >
                            <Link
                              to={`/orders/${o.id}`}
                              className={`block p-4 rounded-lg border transition-all hover:shadow-md ${
                                overdue ? 'border-destructive/40 bg-destructive/5' :
                                urgent ? 'border-amber-500/40 bg-amber-500/5' :
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
                                  <div className={`text-left shrink-0 ${overdue ? 'text-destructive' : urgent ? 'text-amber-600' : 'text-muted-foreground'}`}>
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
                        <Link to="/orders" className="gap-2">
                          عرض كل الطلبات <ArrowLeft className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default StudentHub;
