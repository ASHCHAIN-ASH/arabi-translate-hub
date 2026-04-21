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
import { BookOpen, Search, Layers, Sparkles, ChevronLeft, Play, GraduationCap, Filter } from 'lucide-react';
import { toast } from 'sonner';

const diffColor: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  hard: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
};
const diffLabel: Record<Difficulty, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };

export default function QuizBankBrowse() {
  const [categories, setCategories] = useState<QCategory[]>([]);
  const [subjects, setSubjects] = useState<QSubject[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [questionsBySubject, setQuestionsBySubject] = useState<Record<string, QQuestion[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [cats, subs] = await Promise.all([
          QuestionBankService.listCategories(),
          QuestionBankService.listSubjects(),
        ]);
        setCategories(cats);
        setSubjects(subs);
        if (cats.length) setActiveCategory(cats[0].id);
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

  const subjectsForActive = useMemo(
    () => subjects.filter(s => s.category_id === activeCategory),
    [subjects, activeCategory]
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

  return (
    <ClientLayout>
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-10">
            <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> تصفح بنك الأسئلة
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  استكشف التخصصات والمواد
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  تصفّح التخصصات، استعرض المواد التابعة لها، واطّلع على الأسئلة قبل بدء المحاولة.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/quiz-bank"><Play className="w-4 h-4" /> ابدأ المحاولة</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/quiz-bank/results"><GraduationCap className="w-4 h-4" /> نتائجي</Link>
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-6 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن تخصص..."
                className="pr-9 bg-background/80 backdrop-blur"
              />
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatPill icon={<Layers className="w-4 h-4" />} label="التخصصات" value={categories.length} />
            <StatPill icon={<BookOpen className="w-4 h-4" />} label="المواد" value={subjects.length} />
            <StatPill icon={<Filter className="w-4 h-4" />} label="مستويات" value={3} />
            <StatPill icon={<Sparkles className="w-4 h-4" />} label="نشطة الآن" value={activeCategoryObj ? 1 : 0} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Categories sidebar */}
            <Card className="h-fit lg:sticky lg:top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> التخصصات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
                ) : filteredCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">لا توجد نتائج</p>
                ) : (
                  filteredCategories.map((c) => {
                    const count = subjects.filter(s => s.category_id === c.id).length;
                    const active = c.id === activeCategory;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveCategory(c.id)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-right transition-all ${
                          active
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-card hover:bg-muted border-border'
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <span className="text-lg">{c.icon || '📚'}</span>
                          {c.name_ar}
                        </span>
                        <Badge
                          variant={active ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {count}
                        </Badge>
                      </button>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Subjects + questions */}
            <div className="space-y-4">
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : !activeCategoryObj ? (
                <EmptyState />
              ) : subjectsForActive.length === 0 ? (
                <Card><CardContent className="py-12 text-center text-muted-foreground">لا توجد مواد ضمن هذا التخصص بعد.</CardContent></Card>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">{activeCategoryObj.icon || '📚'}</span>
                        {activeCategoryObj.name_ar}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {subjectsForActive.length} مادة متاحة
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link to="/quiz-bank">
                        ابدأ التدرّب <ChevronLeft className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>

                  <Accordion type="multiple" className="space-y-3">
                    {subjectsForActive.map((s) => {
                      const qs = questionsBySubject[s.id];
                      return (
                        <AccordionItem
                          key={s.id}
                          value={s.id}
                          className="border rounded-xl bg-card overflow-hidden data-[state=open]:shadow-md data-[state=open]:border-primary/40 transition-all"
                        >
                          <AccordionTrigger
                            onClick={() => loadQuestionsFor(s.id)}
                            className="px-4 py-3 hover:no-underline group"
                          >
                            <div className="flex-1 flex items-center justify-between gap-3 pl-3">
                              <div className="flex items-center gap-3 text-right">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg">
                                  {s.icon || '📖'}
                                </div>
                                <div>
                                  <div className="font-semibold">{s.name_ar}</div>
                                  {s.description && (
                                    <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{s.description}</div>
                                  )}
                                </div>
                              </div>
                              {qs && <Badge variant="outline" className="text-xs">{qs.length} سؤال</Badge>}
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
                                {qs.map((q, idx) => (
                                  <div
                                    key={q.id}
                                    className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-2 flex-1 min-w-0">
                                        <span className="shrink-0 w-6 h-6 rounded-md bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                                          {idx + 1}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border bg-card">
      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-lg font-bold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="py-16 text-center space-y-2">
        <BookOpen className="w-10 h-10 mx-auto text-muted-foreground" />
        <p className="font-medium">اختر تخصصاً لعرض المواد</p>
        <p className="text-sm text-muted-foreground">سيتم عرض المواد والأسئلة المتوفرة هنا.</p>
      </CardContent>
    </Card>
  );
}
