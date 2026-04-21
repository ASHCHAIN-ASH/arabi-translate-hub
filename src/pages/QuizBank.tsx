import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Sparkles, BookOpen, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { QuestionBankService, type QCategory, type QSubject, type QQuestion, type Difficulty } from '@/services/questionBankService';

const DIFFICULTY_LABELS: Record<Difficulty | 'all', string> = {
  all: 'كل المستويات', easy: 'سهل', medium: 'متوسط', hard: 'صعب',
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

  // التحميل الأولي
  useEffect(() => {
    (async () => {
      try {
        const [cats, subs, stat] = await Promise.all([
          QuestionBankService.listCategories(),
          QuestionBankService.listSubjects(),
          QuestionBankService.getStats().catch(() => null),
        ]);
        setCategories(cats);
        setSubjects(subs);
        setStats(stat);
      } catch (e: any) {
        toast.error('تعذّر تحميل البيانات');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // تحميل الأسئلة عند تغيير الفلاتر
  useEffect(() => {
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
        setStartedAt(Date.now());
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId, difficulty]);

  const filteredSubjects = useMemo(() => {
    if (categoryId === 'all') return subjects;
    return subjects.filter((s) => s.category_id === categoryId);
  }, [subjects, categoryId]);

  const current = questions[currentIdx];

  const handleSubmit = async () => {
    if (!current || !selectedChoice) return;
    setSubmitting(true);
    try {
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      const r = await QuestionBankService.submitAnswer(current.id, selectedChoice, elapsed);
      if (!r.success) { toast.error('تعذّر تسجيل الإجابة'); return; }
      setResult({ is_correct: !!r.is_correct, correct_choice_id: r.correct_choice_id, explanation: r.explanation, xp_awarded: r.xp_awarded });
      if (r.is_correct) toast.success(`✨ إجابة صحيحة! +${r.xp_awarded || 5} XP`);
      // حدّث الإحصاءات بصمت
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
      toast.info('انتهت الأسئلة المتاحة بهذه الفلاتر');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-5xl space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" /> بنك الأسئلة
          </h1>
          <p className="text-sm text-muted-foreground mt-1">حلّ أسئلة في تخصصك واكسب XP</p>
        </div>
        {stats && (
          <Card className="w-full sm:w-auto">
            <CardContent className="p-3 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-primary" /><span className="font-medium">{stats.success_rate}%</span><span className="text-muted-foreground">نجاح</span></div>
              <div className="text-muted-foreground">{stats.correct_count}/{stats.total_attempts}</div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">الفلاتر</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">التخصص</label>
            <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setSubjectId('all'); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل التخصصات</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name_ar}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">المادة</label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المواد</SelectItem>
                {filteredSubjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name_ar}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">الصعوبة</label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(['all', 'easy', 'medium', 'hard'] as const).map((d) => <SelectItem key={d} value={d}>{DIFFICULTY_LABELS[d]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : !current ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">
          لا توجد أسئلة بعد لهذه الفلاتر — جرب تغيير المادة أو الصعوبة.
        </CardContent></Card>
      ) : (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{currentIdx + 1} / {questions.length}</Badge>
              <Badge>{DIFFICULTY_LABELS[current.difficulty]}</Badge>
            </div>
            <CardTitle className="text-lg sm:text-xl leading-relaxed pt-2">{current.question_text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {current.choices.map((c) => {
              const isSelected = selectedChoice === c.id;
              const isCorrect = result?.correct_choice_id === c.id;
              const isWrongPick = result && isSelected && !result.is_correct;
              return (
                <button
                  key={c.id}
                  disabled={!!result || submitting}
                  onClick={() => setSelectedChoice(c.id)}
                  className={`w-full text-right p-3 rounded-lg border-2 transition flex items-center justify-between gap-3 ${
                    isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950'
                    : isWrongPick ? 'border-destructive bg-destructive/10'
                    : isSelected ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <span className="text-sm sm:text-base">{c.choice_text}</span>
                  {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />}
                  {isWrongPick && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                </button>
              );
            })}

            {result && (
              <div className={`p-4 rounded-lg ${result.is_correct ? 'bg-green-50 dark:bg-green-950 border border-green-200' : 'bg-destructive/10 border border-destructive/20'}`}>
                <div className="font-semibold mb-2 flex items-center gap-2">
                  {result.is_correct ? <><CheckCircle2 className="w-5 h-5 text-green-600" /> إجابة صحيحة! +{result.xp_awarded || 0} XP</>
                                      : <><XCircle className="w-5 h-5 text-destructive" /> إجابة خاطئة</>}
                </div>
                {result.explanation && (
                  <div className="text-sm leading-relaxed">
                    <span className="font-medium">📘 الشرح: </span>{result.explanation}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              {!result ? (
                <Button onClick={handleSubmit} disabled={!selectedChoice || submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 ml-2" />}
                  تأكيد الإجابة
                </Button>
              ) : (
                <Button onClick={handleNext}>السؤال التالي ←</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
