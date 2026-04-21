import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { QuestionBankService, QSubject, QCategory, QQuestion, Difficulty } from '@/services/questionBankService';
import {
  ArrowLeft, Play, BookOpen, HelpCircle, Sparkles, CalendarDays, CheckCircle2,
  Target, Clock, Trophy, Brain, Zap, ListChecks, Flame, GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';

const diffColor: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  hard: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
};
const diffLabel: Record<Difficulty, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };

export default function QuizBankSubject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<QSubject | null>(null);
  const [category, setCategory] = useState<QCategory | null>(null);
  const [questions, setQuestions] = useState<QQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const [subs, cats, qs] = await Promise.all([
          QuestionBankService.listSubjects(),
          QuestionBankService.listCategories(),
          QuestionBankService.listQuestions({ subjectId: id, limit: 100 }),
        ]);
        const subj = subs.find((s) => s.id === id) || null;
        setSubject(subj);
        setCategory(subj ? cats.find((c) => c.id === subj.category_id) || null : null);
        setQuestions(qs);
      } catch (e: any) {
        toast.error(e.message || 'تعذّر تحميل تفاصيل المادة');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const stats = useMemo(() => {
    const easy = questions.filter((q) => q.difficulty === 'easy').length;
    const medium = questions.filter((q) => q.difficulty === 'medium').length;
    const hard = questions.filter((q) => q.difficulty === 'hard').length;
    const total = questions.length;
    return { easy, medium, hard, total };
  }, [questions]);

  // Suggested study plan (5 days), distributed across difficulties
  const studyPlan = useMemo(() => {
    if (stats.total === 0) return [];
    return [
      {
        day: 1, title: 'الأساسيات والإحماء', icon: Sparkles,
        target: Math.min(stats.easy, 5) || 5, difficulty: 'easy' as Difficulty,
        goal: 'بناء أرضية قوية بالمفاهيم البسيطة',
      },
      {
        day: 2, title: 'تعميق الفهم', icon: Brain,
        target: Math.min(Math.ceil(stats.easy / 2) + Math.ceil(stats.medium / 3), 8) || 6,
        difficulty: 'easy' as Difficulty,
        goal: 'مراجعة الأساسيات والانتقال لمتوسطات',
      },
      {
        day: 3, title: 'التحدي المتوسط', icon: Target,
        target: Math.min(stats.medium, 8) || 6, difficulty: 'medium' as Difficulty,
        goal: 'التركيز على الأسئلة متوسطة الصعوبة',
      },
      {
        day: 4, title: 'مستوى متقدم', icon: Flame,
        target: Math.min(stats.hard, 6) || 5, difficulty: 'hard' as Difficulty,
        goal: 'مواجهة الأسئلة الصعبة وكسر الحواجز',
      },
      {
        day: 5, title: 'مراجعة شاملة', icon: Trophy,
        target: Math.min(stats.total, 10) || 10, difficulty: null,
        goal: 'اختبار شامل لقياس الجاهزية',
      },
    ];
  }, [stats]);

  const startSessionUrl = (difficulty?: Difficulty) =>
    `/quiz-bank?subject=${id}${difficulty ? `&difficulty=${difficulty}` : ''}`;

  if (loading) {
    return (
      <ClientLayout>
        <div dir="rtl" className="container max-w-6xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-48 w-full rounded-3xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </ClientLayout>
    );
  }

  if (!subject) {
    return (
      <ClientLayout>
        <div dir="rtl" className="container max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-xl font-bold">المادة غير موجودة</h1>
          <p className="text-muted-foreground">قد تكون المادة محذوفة أو الرابط غير صحيح.</p>
          <Button asChild><Link to="/quiz-bank/browse">العودة للتصفح</Link></Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/quiz-bank/browse" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> التخصصات
            </Link>
            <span className="text-muted-foreground">/</span>
            {category && <span className="text-muted-foreground">{category.name_ar}</span>}
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{subject.name_ar}</span>
          </div>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-background to-accent/15 p-6 md:p-10">
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/15 text-primary flex items-center justify-center text-4xl shadow-lg shrink-0">
                  {subject.icon || '📖'}
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary" className="gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> مادة دراسية</Badge>
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tight">{subject.name_ar}</h1>
                  {subject.name_en && <p className="text-sm text-muted-foreground">{subject.name_en}</p>}
                  {subject.description && (
                    <p className="text-muted-foreground max-w-2xl leading-relaxed">{subject.description}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20" disabled={stats.total === 0}>
                  <Link to={startSessionUrl()}><Play className="w-4 h-4" /> ابدأ جلسة الآن</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 backdrop-blur bg-background/60">
                  <Link to="/quiz-bank/account"><Trophy className="w-4 h-4" /> تقدّمي</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={<HelpCircle className="w-5 h-5" />} label="إجمالي الأسئلة" value={stats.total} accent="text-primary bg-primary/10" />
            <StatCard icon={<Zap className="w-5 h-5" />} label="سهل" value={stats.easy} accent="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" />
            <StatCard icon={<Target className="w-5 h-5" />} label="متوسط" value={stats.medium} accent="text-amber-600 dark:text-amber-400 bg-amber-500/10" />
            <StatCard icon={<Flame className="w-5 h-5" />} label="صعب" value={stats.hard} accent="text-rose-600 dark:text-rose-400 bg-rose-500/10" />
          </div>

          {/* Difficulty distribution */}
          {stats.total > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-primary" /> توزيع الأسئلة حسب الصعوبة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <DiffBar label="سهل" count={stats.easy} total={stats.total} color="bg-emerald-500" />
                <DiffBar label="متوسط" count={stats.medium} total={stats.total} color="bg-amber-500" />
                <DiffBar label="صعب" count={stats.hard} total={stats.total} color="bg-rose-500" />
              </CardContent>
            </Card>
          )}

          {/* Quick start by difficulty */}
          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" /> ابدأ مباشرة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <QuickStartCard
                title="جلسة كاملة" subtitle={`${stats.total} سؤال`} icon={<Sparkles className="w-5 h-5" />}
                disabled={stats.total === 0} to={startSessionUrl()}
                gradient="from-primary/20 to-accent/15"
              />
              <QuickStartCard
                title="مستوى سهل" subtitle={`${stats.easy} سؤال`} icon={<Zap className="w-5 h-5" />}
                disabled={stats.easy === 0} to={startSessionUrl('easy')}
                gradient="from-emerald-500/20 to-teal-500/10"
              />
              <QuickStartCard
                title="مستوى متوسط" subtitle={`${stats.medium} سؤال`} icon={<Target className="w-5 h-5" />}
                disabled={stats.medium === 0} to={startSessionUrl('medium')}
                gradient="from-amber-500/20 to-orange-500/10"
              />
              <QuickStartCard
                title="مستوى صعب" subtitle={`${stats.hard} سؤال`} icon={<Flame className="w-5 h-5" />}
                disabled={stats.hard === 0} to={startSessionUrl('hard')}
                gradient="from-rose-500/20 to-pink-500/10"
              />
            </div>
          </div>

          {/* Study plan */}
          {studyPlan.length > 0 && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-l from-primary/10 to-transparent border-b">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary" /> خطة مذاكرة مقترحة (5 أيام)
                  </CardTitle>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="w-3 h-3" /> ~15 دقيقة يومياً
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="relative space-y-4">
                  {/* Vertical line */}
                  <div className="absolute right-5 top-2 bottom-2 w-0.5 bg-border hidden sm:block" />
                  {studyPlan.map((day) => {
                    const Icon = day.icon;
                    return (
                      <div key={day.day} className="relative flex gap-4 items-start group">
                        <div className="relative z-10 w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold border-4 border-background shrink-0">
                          {day.day}
                        </div>
                        <div className="flex-1 p-4 rounded-xl border bg-card hover:shadow-md hover:border-primary/40 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold">اليوم {day.day}: {day.title}</h3>
                                  {day.difficulty && (
                                    <Badge variant="outline" className={`text-[11px] ${diffColor[day.difficulty]}`}>
                                      {diffLabel[day.difficulty]}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{day.goal}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> الهدف: {day.target} سؤال</span>
                                </div>
                              </div>
                            </div>
                            <Button asChild size="sm" variant="outline" className="gap-1.5 shrink-0">
                              <Link to={startSessionUrl(day.difficulty || undefined)}>
                                <Play className="w-3.5 h-3.5" /> ابدأ
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sample questions */}
          {questions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" /> عيّنة من الأسئلة
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">عرض {Math.min(5, questions.length)} من {questions.length}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {questions.slice(0, 5).map((q, i) => (
                  <div key={q.id} className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className="shrink-0 w-6 h-6 rounded-md bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed line-clamp-2">{q.question_text}</p>
                      </div>
                      <Badge variant="outline" className={`shrink-0 text-[11px] ${diffColor[q.difficulty]}`}>
                        {diffLabel[q.difficulty]}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full gap-1.5 mt-2">
                  <Link to={startSessionUrl()}>
                    <Play className="w-3.5 h-3.5" /> ابدأ الجلسة الآن
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {stats.total === 0 && (
            <Card>
              <CardContent className="py-12 text-center space-y-2">
                <HelpCircle className="w-10 h-10 mx-auto text-muted-foreground" />
                <p className="font-medium">لا توجد أسئلة بعد لهذه المادة</p>
                <p className="text-sm text-muted-foreground">سيتم إضافة الأسئلة قريباً.</p>
                <Button variant="outline" onClick={() => navigate('/quiz-bank/browse')} className="mt-2">
                  استكشف مواد أخرى
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border bg-card hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1.5">{label}</div>
      </div>
    </div>
  );
}

function DiffBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{count} ({pct}%)</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function QuickStartCard({
  title, subtitle, icon, to, disabled, gradient,
}: { title: string; subtitle: string; icon: React.ReactNode; to: string; disabled?: boolean; gradient: string }) {
  if (disabled) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${gradient} p-4 opacity-50 cursor-not-allowed`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-background/60 flex items-center justify-center">{icon}</div>
          <div>
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-xs text-muted-foreground">غير متاح</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${gradient} p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all`}
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-background/70 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
    </Link>
  );
}
