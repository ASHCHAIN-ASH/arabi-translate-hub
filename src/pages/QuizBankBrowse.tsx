import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QuestionBankService, QCategory, QSubject, QQuestion, Difficulty } from '@/services/questionBankService';
import { BookOpen, Search, Layers, Sparkles, ChevronLeft, Play, GraduationCap, HelpCircle, ArrowLeft, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const diffColor: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  hard: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
};
const diffLabel: Record<Difficulty, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };

// Gradient palette per category index — banking-inspired premium look
const gradients = [
  'from-blue-500/20 via-indigo-500/15 to-violet-500/10',
  'from-emerald-500/20 via-teal-500/15 to-cyan-500/10',
  'from-amber-500/20 via-orange-500/15 to-rose-500/10',
  'from-fuchsia-500/20 via-pink-500/15 to-rose-500/10',
  'from-sky-500/20 via-blue-500/15 to-indigo-500/10',
  'from-lime-500/20 via-emerald-500/15 to-teal-500/10',
  'from-purple-500/20 via-violet-500/15 to-blue-500/10',
  'from-orange-500/20 via-amber-500/15 to-yellow-500/10',
];
const accents = [
  'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  'text-amber-600 dark:text-amber-400 bg-amber-500/10',
  'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/10',
  'text-sky-600 dark:text-sky-400 bg-sky-500/10',
  'text-lime-600 dark:text-lime-400 bg-lime-500/10',
  'text-purple-600 dark:text-purple-400 bg-purple-500/10',
  'text-orange-600 dark:text-orange-400 bg-orange-500/10',
];

export default function QuizBankBrowse() {
  const [categories, setCategories] = useState<QCategory[]>([]);
  const [subjects, setSubjects] = useState<QSubject[]>([]);
  const [qCounts, setQCounts] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [questionsBySubject, setQuestionsBySubject] = useState<Record<string, QQuestion[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [cats, subs, counts] = await Promise.all([
          QuestionBankService.listCategories(),
          QuestionBankService.listSubjects(),
          QuestionBankService.getQuestionCountsBySubject(),
        ]);
        setCategories(cats);
        setSubjects(subs);
        setQCounts(counts);
      } catch (e: any) {
        toast.error(e.message || 'فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const s = search.trim().toLowerCase();
    return categories.filter(c =>
      c.name_ar.toLowerCase().includes(s) || (c.name_en?.toLowerCase().includes(s) ?? false)
    );
  }, [categories, search]);

  const subjectsByCategory = useMemo(() => {
    const map: Record<string, QSubject[]> = {};
    subjects.forEach(s => {
      (map[s.category_id] ||= []).push(s);
    });
    return map;
  }, [subjects]);

  const totalQuestions = useMemo(
    () => Object.values(qCounts).reduce((a, b) => a + b, 0),
    [qCounts]
  );

  const loadQuestionsFor = async (subjectId: string) => {
    if (questionsBySubject[subjectId]) return;
    try {
      const qs = await QuestionBankService.listQuestions({ subjectId, limit: 50 });
      setQuestionsBySubject(prev => ({ ...prev, [subjectId]: qs }));
    } catch (e: any) {
      toast.error(e.message || 'فشل تحميل الأسئلة');
    }
  };

  const activeCategoryObj = categories.find(c => c.id === activeCategory);
  const subjectsForActive = activeCategory ? (subjectsByCategory[activeCategory] || []) : [];
  const activeIdx = activeCategory ? categories.findIndex(c => c.id === activeCategory) : 0;

  // ===== View 1: Browse all categories (cards grid) =====
  if (!activeCategory) {
    return (
      <ClientLayout>
        <div dir="rtl" className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
          <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-12">
              <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
              <div className="relative space-y-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                      <Sparkles className="w-3.5 h-3.5" /> تصفح بنك الأسئلة
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-l from-primary via-primary to-accent bg-clip-text text-transparent">
                      استكشف التخصصات
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
                      اختر تخصصاً لاستكشاف المواد والأسئلة المتاحة، وابدأ رحلتك التعليمية بأسلوب مرتب واحترافي.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20">
                      <Link to="/quiz-bank"><Play className="w-4 h-4" /> ابدأ المحاولة</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2 backdrop-blur bg-background/60">
                      <Link to="/quiz-bank/results"><GraduationCap className="w-4 h-4" /> نتائجي</Link>
                    </Button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative max-w-xl">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث عن تخصص بالاسم العربي أو الإنجليزي..."
                    className="pr-9 h-12 bg-background/80 backdrop-blur border-border/50"
                  />
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatPill icon={<Layers className="w-5 h-5" />} label="التخصصات" value={categories.length} />
              <StatPill icon={<BookOpen className="w-5 h-5" />} label="المواد" value={subjects.length} />
              <StatPill icon={<HelpCircle className="w-5 h-5" />} label="إجمالي الأسئلة" value={totalQuestions} />
              <StatPill icon={<TrendingUp className="w-5 h-5" />} label="مستويات صعوبة" value={3} />
            </div>

            {/* Categories grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> جميع التخصصات
                </h2>
                <span className="text-sm text-muted-foreground">{filteredCategories.length} تخصص</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-2xl" />)}
                </div>
              ) : filteredCategories.length === 0 ? (
                <Card><CardContent className="py-16 text-center text-muted-foreground">لا توجد نتائج للبحث.</CardContent></Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCategories.map((c, idx) => {
                    const subs = subjectsByCategory[c.id] || [];
                    const qCount = subs.reduce((sum, s) => sum + (qCounts[s.id] || 0), 0);
                    const grad = gradients[idx % gradients.length];
                    const accent = accents[idx % accents.length];
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveCategory(c.id)}
                        className={`group relative text-right overflow-hidden rounded-2xl border bg-gradient-to-br ${grad} p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/40`}
                      >
                        <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white/30 dark:bg-white/5 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative space-y-4">
                          <div className="flex items-start justify-between">
                            <div className={`w-14 h-14 rounded-2xl ${accent} flex items-center justify-center text-2xl shadow-sm`}>
                              {c.icon || '📚'}
                            </div>
                            <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold leading-tight">{c.name_ar}</h3>
                            {c.name_en && (
                              <p className="text-xs text-muted-foreground mt-0.5">{c.name_en}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <BookOpen className="w-3 h-3" /> {subs.length} مادة
                            </Badge>
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <HelpCircle className="w-3 h-3" /> {qCount} سؤال
                            </Badge>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  // ===== View 2: Selected category — show its subjects & questions =====
  return (
    <ClientLayout>
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Breadcrumb / back */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setActiveCategory(null)}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> كل التخصصات
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{activeCategoryObj?.name_ar}</span>
          </div>

          {/* Category header */}
          <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${gradients[activeIdx % gradients.length]} p-6 md:p-8`}>
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/20 dark:bg-white/5 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${accents[activeIdx % accents.length]} flex items-center justify-center text-3xl shadow-md`}>
                  {activeCategoryObj?.icon || '📚'}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{activeCategoryObj?.name_ar}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen className="w-3 h-3" /> {subjectsForActive.length} مادة
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <HelpCircle className="w-3 h-3" />
                      {subjectsForActive.reduce((s, x) => s + (qCounts[x.id] || 0), 0)} سؤال متاح
                    </Badge>
                  </div>
                </div>
              </div>
              <Button asChild size="lg" className="gap-2 shadow-lg">
                <Link to="/quiz-bank"><Play className="w-4 h-4" /> ابدأ التدرّب</Link>
              </Button>
            </div>
          </div>

          {/* Subjects */}
          {subjectsForActive.length === 0 ? (
            <Card><CardContent className="py-16 text-center text-muted-foreground">لا توجد مواد ضمن هذا التخصص بعد.</CardContent></Card>
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {subjectsForActive.map((s, idx) => {
                const qs = questionsBySubject[s.id];
                const totalQ = qCounts[s.id] || 0;
                return (
                  <AccordionItem
                    key={s.id}
                    value={s.id}
                    className="border rounded-2xl bg-card overflow-hidden data-[state=open]:shadow-lg data-[state=open]:border-primary/40 transition-all"
                  >
                    <AccordionTrigger
                      onClick={() => loadQuestionsFor(s.id)}
                      className="px-4 py-4 hover:no-underline group"
                    >
                      <div className="flex-1 flex items-center justify-between gap-3 pl-3">
                        <div className="flex items-center gap-3 text-right">
                          <div className={`w-12 h-12 rounded-xl ${accents[idx % accents.length]} flex items-center justify-center text-xl shadow-sm`}>
                            {s.icon || '📖'}
                          </div>
                          <div>
                            <div className="font-semibold text-base">{s.name_ar}</div>
                            {s.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{s.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={totalQ > 0 ? 'default' : 'outline'} className="text-xs gap-1">
                            <HelpCircle className="w-3 h-3" /> {totalQ} سؤال
                          </Badge>
                          <Link
                            to={`/quiz-bank/subject/${s.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2.5 py-1 rounded-md border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                          >
                            التفاصيل
                          </Link>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {!qs ? (
                        <div className="space-y-2">
                          <Skeleton className="h-14 w-full" />
                          <Skeleton className="h-14 w-full" />
                        </div>
                      ) : qs.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">لا توجد أسئلة بعد لهذه المادة.</p>
                      ) : (
                        <div className="space-y-2">
                          {qs.map((q, i) => (
                            <div
                              key={q.id}
                              className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors"
                            >
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
                          <Button asChild variant="outline" size="sm" className="w-full mt-2 gap-1.5">
                            <Link to="/quiz-bank">
                              <Play className="w-3.5 h-3.5" /> ابدأ الحل في هذه المادة
                            </Link>
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border bg-card hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-2xl font-bold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1.5">{label}</div>
      </div>
    </div>
  );
}
