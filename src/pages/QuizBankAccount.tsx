import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionBankService } from '@/services/questionBankService';
import { Crown, Sparkles, History, ListChecks, CheckCircle2, XCircle, Clock, Play, BarChart3, Layers, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function QuizBankAccount() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [activeSub, setActiveSub] = useState<any>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const [s, h, a, p, sub] = await Promise.all([
        QuestionBankService.getStats().catch(() => null),
        QuestionBankService.listSessionHistory(20),
        QuestionBankService.listAttempts(30),
        QuestionBankService.listPlans(),
        QuestionBankService.getActiveSubscription(),
      ]);
      setStats(s); setHistory(h); setAttempts(a); setPlans(p); setActiveSub(sub);
    } catch (e: any) {
      toast.error(e.message || 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleSubscribe = async (planId: string, price: number) => {
    if (price > 0 && !confirm(`سيتم تسجيل اشتراكك (${price} ر.س). هل تريد المتابعة؟`)) return;
    setSubscribing(planId);
    try {
      await QuestionBankService.subscribeToPlan(planId);
      toast.success('🎉 تم تفعيل الاشتراك بنجاح');
      await refresh();
    } catch (e: any) {
      toast.error(e.message || 'فشل الاشتراك');
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <ClientLayout>
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-background to-accent/15 p-6 md:p-8">
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Badge variant="secondary" className="gap-1.5 mb-2"><Sparkles className="w-3.5 h-3.5" /> حسابي</Badge>
                <h1 className="text-2xl md:text-3xl font-bold">حسابي في بنك الأسئلة</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  جلساتك، سجل محاولاتك، وباقتك الحالية في مكان واحد.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild className="gap-2"><Link to="/quiz-bank"><Play className="w-4 h-4" /> ابدأ التدرّب</Link></Button>
                <Button asChild variant="outline" className="gap-2"><Link to="/quiz-bank/results"><BarChart3 className="w-4 h-4" /> النتائج</Link></Button>
                <Button asChild variant="outline" className="gap-2"><Link to="/quiz-bank/browse"><Layers className="w-4 h-4" /> التخصصات</Link></Button>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="نسبة النجاح" value={`${stats?.success_rate ?? 0}%`} icon={<Zap className="w-4 h-4" />} loading={loading} />
            <StatCard label="إجابات صحيحة" value={stats?.correct_count ?? 0} icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} loading={loading} />
            <StatCard label="إجمالي المحاولات" value={stats?.total_attempts ?? 0} icon={<ListChecks className="w-4 h-4" />} loading={loading} />
            <StatCard label="أسئلة فريدة" value={stats?.unique_questions ?? 0} icon={<History className="w-4 h-4" />} loading={loading} />
          </div>

          {/* Active subscription banner */}
          <Card className={activeSub ? 'border-primary/40 bg-gradient-to-l from-primary/5 to-transparent' : ''}>
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeSub ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">باقتك الحالية</div>
                  <div className="font-bold text-lg">{activeSub?.plan_name || 'الباقة المجانية'}</div>
                  {activeSub?.expires_at && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      تنتهي في: {new Date(activeSub.expires_at).toLocaleDateString('ar')}
                    </div>
                  )}
                </div>
              </div>
              {activeSub?.daily_question_limit ? (
                <Badge variant="outline">حد يومي: {activeSub.daily_question_limit}</Badge>
              ) : activeSub ? (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">غير محدود ✨</Badge>
              ) : null}
            </CardContent>
          </Card>

          <Tabs defaultValue="history" className="w-full">
            <TabsList className="w-full md:w-auto grid grid-cols-3">
              <TabsTrigger value="history">الجلسات</TabsTrigger>
              <TabsTrigger value="attempts">المحاولات</TabsTrigger>
              <TabsTrigger value="plans">الباقات</TabsTrigger>
            </TabsList>

            {/* Sessions history */}
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><History className="w-4 h-4 text-primary" /> سجل الجلسات المكتملة</CardTitle></CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-40 w-full" /> :
                    history.length === 0 ? <Empty text="لم تُكمل أي جلسة بعد." /> : (
                    <div className="space-y-2">
                      {history.map(h => {
                        const rate = h.total_questions ? Math.round((h.correct_count / h.total_questions) * 100) : 0;
                        return (
                          <div key={h.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                                rate >= 70 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' :
                                rate >= 40 ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' :
                                'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                              }`}>{rate}%</div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm">{h.correct_count}/{h.total_questions} إجابة صحيحة</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  {new Date(h.completed_at).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' })}
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="gap-1"><Sparkles className="w-3 h-3" /> +{h.xp_earned} XP</Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attempts log */}
            <TabsContent value="attempts" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><ListChecks className="w-4 h-4 text-primary" /> آخر المحاولات</CardTitle></CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-40 w-full" /> :
                    attempts.length === 0 ? <Empty text="لا توجد محاولات بعد." /> : (
                    <div className="divide-y border rounded-lg overflow-hidden">
                      {attempts.map(a => (
                        <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-2.5 bg-card">
                          <div className="flex items-center gap-2 min-w-0">
                            {a.is_correct
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                            <div className="text-xs text-muted-foreground">
                              {new Date(a.created_at).toLocaleString('ar', { dateStyle: 'short', timeStyle: 'short' })}
                              {a.difficulty && <span className="mx-2">•</span>}
                              {a.difficulty && <span>{a.difficulty}</span>}
                              {a.time_spent_seconds != null && <><span className="mx-2">•</span><span>{a.time_spent_seconds}ث</span></>}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">+{a.xp_awarded} XP</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Plans */}
            <TabsContent value="plans" className="mt-4">
              {loading ? <Skeleton className="h-64 w-full" /> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map(p => {
                    const isActive = activeSub?.plan_id === p.id;
                    const isPremium = p.slug.includes('premium');
                    return (
                      <Card key={p.id} className={`relative overflow-hidden ${isActive ? 'border-primary border-2 shadow-lg' : ''} ${isPremium ? 'bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}>
                        {isActive && (
                          <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-br-lg">
                            باقتك الحالية
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-1">
                            {isPremium && <Crown className="w-4 h-4 text-amber-500" />}
                            <CardTitle className="text-lg">{p.name_ar}</CardTitle>
                          </div>
                          {p.description_ar && <p className="text-xs text-muted-foreground">{p.description_ar}</p>}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="text-3xl font-bold">
                              {p.price_sar > 0 ? `${p.price_sar}` : 'مجاني'}
                              {p.price_sar > 0 && <span className="text-sm text-muted-foreground font-normal mr-1">ر.س</span>}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {p.price_sar > 0 ? `لمدة ${p.duration_days} يوم` : 'دائماً'}
                            </div>
                          </div>
                          <ul className="space-y-1.5 text-sm">
                            {(p.features as string[] || []).map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            className="w-full"
                            disabled={isActive || subscribing === p.id}
                            variant={isPremium && !isActive ? 'default' : 'outline'}
                            onClick={() => handleSubscribe(p.id, p.price_sar)}
                          >
                            {isActive ? 'مفعّلة' : subscribing === p.id ? '...' : (p.price_sar > 0 ? 'اشترك الآن' : 'تفعيل')}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ClientLayout>
  );
}

function StatCard({ label, value, icon, loading }: { label: string; value: any; icon: React.ReactNode; loading: boolean }) {
  if (loading) return <Skeleton className="h-20 w-full" />;
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
        <div>
          <div className="text-lg font-bold leading-none">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-center py-10 text-sm text-muted-foreground">{text}</div>;
}
