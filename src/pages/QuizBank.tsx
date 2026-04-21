import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, XCircle, Sparkles, BookOpen, BarChart3, Trophy, Target, Flame, RotateCcw, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import ClientLayout from '@/components/client/ClientLayout';
import { QuestionBankService, type QCategory, type QSubject, type QQuestion, type Difficulty } from '@/services/questionBankService';
import { cn } from '@/lib/utils';

const DIFFICULTY_LABELS: Record<Difficulty | 'all', string> = {
  all: 'كل المستويات', easy: 'سهل', medium: 'متوسط', hard: 'صعب',
};
const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  hard: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
};

export default function QuizBank() {
  const [categories, setCategories] = useState<QCategory[]>([]);
  const [subjects, setSubjects] = useState<QSubject[]>([]);
  const [questions, setQuestions] = useState<QQuestion[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [categoryId, setCategoryId] = useState<string>('all');
  const [subjectId, setSubjectId] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');

  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [result, setResult] = useState<{ is_correct: boolean; correct_choice_id?: string; explanation?: string; xp_awarded?: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [sessionXp, setSessionXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [resumed, setResumed] = useState(false);

  // Initial load + session restore
  useEffect(() => {
    (async () => {
      try {
        const [cats, subs, stat, session] = await Promise.all([
          QuestionBankService.listCategories(),
          QuestionBankService.listSubjects(),
          QuestionBankService.getStats().catch(() => null),
          QuestionBankService.loadSession().catch(() => null),
        ]);
        setCategories(cats);
        setSubjects(subs);
        setStats(stat);

        if (session && session.question_ids.length > 0) {
          setCategoryId(session.filter_category_id || 'all');
          setSubjectId(session.filter_subject_id || 'all');
          setDifficulty((session.filter_difficulty as any) || 'all');
          setSessionXp(session.session_xp || 0);
          setStreak(session.streak || 0);
          setAnsweredIds(session.answered_question_ids || []);
          const qs = await QuestionBankService.listQuestions({
            subjectId: session.filter_subject_id || undefined,
            difficulty: (session.filter_difficulty as any) || undefined,
            limit: 100,
          });
          const map = new Map(qs.map((q) => [q.id, q]));
          const ordered = session.question_ids.map((id) => map.get(id)).filter(Boolean) as QQuestion[];
          if (ordered.length > 0) {
            setQuestions(ordered);
            const idx = Math.min(session.current_index, ordered.length - 1);
            setCurrentIdx(idx);
            setResumed(true);
            toast.success(`📌 تم استئناف جلستك من السؤال ${idx + 1}`);
          }
        }
      } catch {
        toast.error('تعذّر تحميل البيانات');
      } finally {
        setHydrated(true);
        setLoading(false);
      }
    })();
  }, []);

  // Reload questions when filters change (after hydration, skip first restore)
  useEffect(() => {
    if (!hydrated) return;
    if (resumed) { setResumed(false); return; }
    (async () => {
      setLoading(true);
      try {
        const qs = await QuestionBankService.listQuestions({
          subjectId: subjectId !== 'all' ? subjectId : undefined,
          difficulty: difficulty !== 'all' ? difficulty : undefined,
          limit: 50,
        });
        setQuestions(qs);
        setCurrentIdx(0); setSelectedChoice(null); setResult(null);
        setAnsweredIds([]); setSessionXp(0); setStreak(0);
        setStartedAt(Date.now());
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId, difficulty, hydrated]);

  // Auto-save session (debounced)
  useEffect(() => {
    if (!hydrated || questions.length === 0) return;
    const t = setTimeout(() => {
      QuestionBankService.saveSession({
        filter_category_id: categoryId === 'all' ? null : categoryId,
        filter_subject_id: subjectId === 'all' ? null : subjectId,
        filter_difficulty: difficulty === 'all' ? null : difficulty,
        question_ids: questions.map((q) => q.id),
        current_index: currentIdx,
        answered_question_ids: answeredIds,
        session_xp: sessionXp,
        streak,
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [hydrated, questions, currentIdx, answeredIds, sessionXp, streak, categoryId, subjectId, difficulty]);

  const filteredSubjects = useMemo(() => {
    if (categoryId === 'all') return subjects;
    return subjects.filter((s) => s.category_id === categoryId);
  }, [subjects, categoryId]);

  const current = questions[currentIdx];
  const progress = questions.length > 0 ? ((currentIdx + (result ? 1 : 0)) / questions.length) * 100 : 0;

  const handleSubmit = async () => {
    if (!current || !selectedChoice) return;
    setSubmitting(true);
    try {
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      const r = await QuestionBankService.submitAnswer(current.id, selectedChoice, elapsed);
      if (!r.success) { toast.error('تعذّر تسجيل الإجابة'); return; }
      setResult({ is_correct: !!r.is_correct, correct_choice_id: r.correct_choice_id, explanation: r.explanation, xp_awarded: r.xp_awarded });
      setAnsweredIds((prev) => prev.includes(current.id) ? prev : [...prev, current.id]);
      if (r.is_correct) {
        toast.success(`✨ إجابة صحيحة! +${r.xp_awarded || 5} XP`);
        setSessionXp((x) => x + (r.xp_awarded || 5));
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }
      QuestionBankService.getStats().then(setStats).catch(() => {});
    } catch (e: any) {
      toast.error(e?.message || 'خطأ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedChoice(null); setResult(null); setStartedAt(Date.now());
    } else {
      toast.success('🎉 أتممت جميع الأسئلة! انتقل لصفحة النتائج…');
      setTimeout(() => navigate('/quiz-bank/results'), 800);
    }
  };

  const handleResetSession = async () => {
    if (!confirm('هل تريد بدء جلسة جديدة؟ سيُمسح التقدّم المحفوظ.')) return;
    try {
      await QuestionBankService.resetSession();
      setCurrentIdx(0); setSelectedChoice(null); setResult(null);
      setAnsweredIds([]); setSessionXp(0); setStreak(0);
      const qs = await QuestionBankService.listQuestions({
        subjectId: subjectId !== 'all' ? subjectId : undefined,
        difficulty: difficulty !== 'all' ? difficulty : undefined,
        limit: 50,
      });
      setQuestions(qs);
      toast.success('🔄 تم بدء جلسة جديدة');
    } catch {
      toast.error('تعذّر إعادة الجلسة');
    }
  };

  return (
    <ClientLayout>
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl space-y-6" dir="rtl">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/30 rounded-full blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black">بنك الأسئلة</h1>
              </div>
              <p className="text-sm sm:text-base text-white/85">حلّ أسئلة في تخصصك واكسب XP — تعلّم. تحدّى. تفوّق.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/20 hover:bg-white/25 text-white border-white/30 px-3 py-1.5 text-sm gap-1.5 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> +{sessionXp} XP الجلسة
              </Badge>
              {streak > 1 && (
                <Badge className="bg-amber-400/30 hover:bg-amber-400/40 text-white border-amber-300/40 px-3 py-1.5 text-sm gap-1.5 backdrop-blur-sm">
                  <Flame className="w-3.5 h-3.5" /> {streak} متتالية
                </Badge>
              )}
              {answeredIds.length > 0 && (
                <Button
                  size="sm" variant="ghost" onClick={handleResetSession}
                  className="text-white hover:bg-white/15 hover:text-white gap-1.5 backdrop-blur-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> جلسة جديدة
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="border-2 border-primary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.success_rate}%</p>
                  <p className="text-[11px] text-muted-foreground">نسبة النجاح</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-emerald-500/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.correct_count}</p>
                  <p className="text-[11px] text-muted-foreground">إجابات صحيحة</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-amber-500/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.total_attempts}</p>
                  <p className="text-[11px] text-muted-foreground">إجمالي المحاولات</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-secondary/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.unique_questions}</p>
                  <p className="text-[11px] text-muted-foreground">أسئلة فريدة</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> اختر الفلاتر
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">التخصص</label>
              <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setSubjectId('all'); }}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل التخصصات</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.icon ? `${c.icon} ` : ''}{c.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">المادة</label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المواد</SelectItem>
                  {filteredSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.icon ? `${s.icon} ` : ''}{s.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">الصعوبة</label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                    <SelectItem key={d} value={d}>{DIFFICULTY_LABELS[d]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {questions.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">التقدّم</span>
              <span className="text-primary">{currentIdx + (result ? 1 : 0)} / {questions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Question Area */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !current ? (
          <Card className="border-2 border-dashed">
            <CardContent className="p-12 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold">لا توجد أسئلة بهذه الفلاتر</p>
              <p className="text-sm text-muted-foreground">جرّب اختيار تخصص آخر أو غيّر الصعوبة لتظهر الأسئلة المتاحة.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 shadow-lg overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="font-mono">سؤال {currentIdx + 1}</Badge>
                <Badge className={cn('border', DIFFICULTY_COLORS[current.difficulty])}>
                  {DIFFICULTY_LABELS[current.difficulty]}
                </Badge>
              </div>
              <CardTitle className="text-lg sm:text-xl leading-relaxed font-bold">
                {current.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {current.choices.map((c, idx) => {
                const isSelected = selectedChoice === c.id;
                const isCorrect = result?.correct_choice_id === c.id;
                const isWrongPick = result && isSelected && !result.is_correct;
                const letter = ['أ', 'ب', 'ج', 'د', 'هـ'][idx] || (idx + 1);
                return (
                  <button
                    key={c.id}
                    disabled={!!result || submitting}
                    onClick={() => setSelectedChoice(c.id)}
                    className={cn(
                      'w-full text-right p-4 rounded-xl border-2 transition-all flex items-center gap-3 group',
                      isCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
                      isWrongPick && 'border-destructive bg-destructive/10',
                      !result && isSelected && 'border-primary bg-primary/5 shadow-sm',
                      !result && !isSelected && 'border-border hover:border-primary/50 hover:bg-muted/50',
                    )}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 transition',
                      isCorrect ? 'bg-emerald-500 text-white' :
                      isWrongPick ? 'bg-destructive text-white' :
                      isSelected ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    )}>
                      {letter}
                    </div>
                    <span className="text-sm sm:text-base font-medium flex-1">{c.choice_text}</span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {isWrongPick && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                  </button>
                );
              })}

              {result && (
                <div className={cn(
                  'p-4 rounded-xl border-2 animate-in fade-in slide-in-from-bottom-2',
                  result.is_correct
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30'
                    : 'bg-destructive/5 border-destructive/30'
                )}>
                  <div className="font-bold mb-2 flex items-center gap-2">
                    {result.is_correct ? (
                      <><CheckCircle2 className="w-5 h-5 text-emerald-600" /> إجابة صحيحة! +{result.xp_awarded || 0} XP</>
                    ) : (
                      <><XCircle className="w-5 h-5 text-destructive" /> إجابة خاطئة</>
                    )}
                  </div>
                  {result.explanation && (
                    <div className="text-sm leading-relaxed text-foreground/80">
                      <span className="font-semibold">📘 الشرح: </span>{result.explanation}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                {!result ? (
                  <Button onClick={handleSubmit} disabled={!selectedChoice || submitting} size="lg" className="gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    تأكيد الإجابة
                  </Button>
                ) : (
                  <Button onClick={handleNext} size="lg" className="gap-2">
                    السؤال التالي ←
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
}
