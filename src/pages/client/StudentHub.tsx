import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { useDailyTasks, useStudentResources } from '@/hooks/useStudentHub';
import {
  Sparkles, Trophy, Flame, CheckCircle2, Circle, Crown, Lock, FileText,
  Wand2, BookOpen, Calendar, BarChart3, ExternalLink, Loader2, GraduationCap, Target,
} from 'lucide-react';

type ToolKey = 'summarize' | 'rephrase' | 'analyze';

const TOOL_META: Record<ToolKey, { label: string; desc: string; icon: any; premium: boolean }> = {
  summarize: { label: 'تلخيص', desc: 'لخّص نصاً طويلاً في نقاط واضحة', icon: FileText, premium: false },
  rephrase: { label: 'إعادة صياغة', desc: 'صياغة احترافية مع الحفاظ على المعنى', icon: Wand2, premium: false },
  analyze: { label: 'تحليل نص', desc: 'تحليل أكاديمي عميق (Premium)', icon: BarChart3, premium: true },
};

const StudentHub: React.FC = () => {
  const { user } = useAuth();
  const { summary, loading: gLoading } = useGamification(user?.id);
  const { membership } = useUserMembership();
  const { tasks, loading: tasksLoading, completeTask, refresh: refreshTasks } = useDailyTasks(user?.id);
  const { resources, loading: resLoading } = useStudentResources();

  const [tool, setTool] = useState<ToolKey>('summarize');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

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
      toast.success('تم — اكتسبت نقاطاً للمهمة اليومية');
      refreshTasks();
    } catch (e: any) {
      toast.error(e?.message || 'خطأ غير متوقع');
    } finally {
      setRunning(false);
    }
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
      <div className="space-y-6">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-secondary/10 to-primary/5 p-6 md:p-8"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                <span className="text-sm text-muted-foreground">قسم الطالب</span>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                    <Crown className="w-3 h-3 ml-1" /> Premium
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">أهلاً، {displayName} 👋</h1>
              <p className="text-muted-foreground">مساعدك الأكاديمي اليومي — أدوات ذكية، نقاط، ومكافآت.</p>
            </div>

            {!gLoading && summary && (
              <div className="bg-background/70 backdrop-blur rounded-xl p-4 min-w-[260px] border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold">{summary.total_points} نقطة</span>
                  </div>
                  <Badge variant="secondary">
                    {summary.current_level?.name_ar || 'مبتدئ'}
                  </Badge>
                </div>
                {summary.next_level && (
                  <>
                    <Progress value={summary.progress_percent} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {summary.points_to_next} نقطة للوصول إلى {summary.next_level.name_ar}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Flame, label: 'مهام اليوم', value: `${completedCount}/${tasks.length}`, color: 'text-orange-500' },
            { icon: Trophy, label: 'نقاطك', value: summary?.total_points ?? 0, color: 'text-amber-500' },
            { icon: Crown, label: 'حالتك', value: isPremium ? 'Premium' : 'مجاني', color: 'text-purple-500' },
            { icon: BookOpen, label: 'موارد المكتبة', value: resources.length, color: 'text-blue-500' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
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

        {/* TABS */}
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="ai" className="gap-2"><Sparkles className="w-4 h-4" />أدوات AI</TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2"><Target className="w-4 h-4" />المهام اليومية</TabsTrigger>
            <TabsTrigger value="library" className="gap-2"><BookOpen className="w-4 h-4" />المكتبة</TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2"><Calendar className="w-4 h-4" />جدولي</TabsTrigger>
          </TabsList>

          {/* AI TOOLS */}
          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  أدوات الذكاء الاصطناعي
                </CardTitle>
                <CardDescription>
                  المجاني: 3 استخدامات يومياً لكل أداة. Premium: 50 يومياً + أداة التحليل.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(Object.keys(TOOL_META) as ToolKey[]).map((k) => {
                    const T = TOOL_META[k];
                    const locked = T.premium && !isPremium;
                    const active = tool === k;
                    return (
                      <button
                        key={k}
                        onClick={() => !locked && setTool(k)}
                        disabled={locked}
                        className={`relative text-right p-4 rounded-xl border transition-all ${
                          active
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-muted/40'
                        } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <T.icon className="w-5 h-5 text-primary" />
                          {locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                          {T.premium && !locked && <Crown className="w-4 h-4 text-amber-500" />}
                        </div>
                        <p className="font-semibold mb-1">{T.label}</p>
                        <p className="text-xs text-muted-foreground">{T.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ألصق نصك هنا (20 حرف على الأقل)..."
                  rows={6}
                  className="resize-y"
                />
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <p className="text-xs text-muted-foreground">{input.length} / 8000 حرف</p>
                  <Button onClick={runAI} disabled={running || input.trim().length < 20}>
                    {running ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جارٍ التنفيذ</> : <><Sparkles className="w-4 h-4 ml-2" />تنفيذ</>}
                  </Button>
                </div>

                {output && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-muted rounded-lg border border-border"
                  >
                    <p className="text-sm font-semibold mb-2">النتيجة:</p>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{output}</p>
                  </motion.div>
                )}

                {!isPremium && (
                  <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-500" />
                      <p className="text-sm">فعّل العضوية للحصول على 50 استخدام يومياً + أداة التحليل</p>
                    </div>
                    <Button asChild size="sm" variant="default">
                      <Link to="/membership">ترقية</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DAILY TASKS */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  مهامك اليومية
                </CardTitle>
                <CardDescription>
                  أنجز المهام اليومية واكسب نقاطاً تترجم إلى مكافآت ومستويات.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Progress value={(completedCount / totalTasks) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    أنجزت {completedCount} من {tasks.length} مهام اليوم
                  </p>
                </div>

                {tasksLoading ? (
                  <div className="space-y-2">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((t) => (
                      <motion.div
                        key={t.id}
                        whileHover={{ scale: 1.005 }}
                        className={`p-4 rounded-lg border flex items-center justify-between gap-3 ${
                          t.is_completed ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-card border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {t.is_completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
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
                          <Badge variant="secondary">+{t.points_reward}</Badge>
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
          </TabsContent>

          {/* LIBRARY */}
          <TabsContent value="library" className="space-y-4">
            <Card>
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
                    {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full" />)}
                  </div>
                ) : resources.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد موارد منشورة بعد</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resources.map((r) => {
                      const locked = r.is_premium && !isPremium;
                      return (
                        <motion.a
                          key={r.id}
                          href={locked ? '/membership' : r.url}
                          target={locked ? '_self' : '_blank'}
                          rel="noopener noreferrer"
                          whileHover={{ y: -2 }}
                          className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="uppercase text-xs">{r.resource_type}</Badge>
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
          </TabsContent>

          {/* SCHEDULE */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  جدولي
                </CardTitle>
                <CardDescription>طلباتك القادمة والمواعيد النهائية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-4">راجع طلباتك والمواعيد المرتبطة بها</p>
                  <Button asChild>
                    <Link to="/orders">عرض طلباتي</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default StudentHub;
