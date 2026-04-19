import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, ChevronRight, ChevronLeft, Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Flashcard { q: string; a: string; }
interface MCQ { question: string; options: string[]; answer: number; explanation?: string; }

interface Props {
  text: string;
  setText: (v: string) => void;
}

export default function StudyPanel({ text, setText }: Props) {
  const [mode, setMode] = useState<'flashcards' | 'mcq'>('flashcards');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<MCQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (text.trim().length < 80) return toast.error('النص قصير (80 حرف على الأقل)');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('workspace-study-generator', {
        body: { text, mode, count: 8 },
      });
      if (error || data?.error) {
        toast.error(data?.error || 'فشل التوليد');
        return;
      }
      const items = data?.items || [];
      if (items.length === 0) { toast.error('لم يتم توليد عناصر'); return; }
      if (mode === 'flashcards') setCards(items);
      else setQuiz(items);
      setIdx(0); setFlipped(false); setPicked(null); setScore(0);
      toast.success(`تم توليد ${items.length} ${mode === 'mcq' ? 'سؤال' : 'بطاقة'}`);
    } catch (e: any) {
      toast.error(e?.message || 'خطأ');
    } finally {
      setLoading(false);
    }
  };

  const list = mode === 'flashcards' ? cards : quiz;
  const card = mode === 'flashcards' ? cards[idx] : null;
  const q = mode === 'mcq' ? quiz[idx] : null;

  const next = () => {
    if (idx < list.length - 1) {
      setIdx(idx + 1);
      setFlipped(false);
      setPicked(null);
    }
  };
  const prev = () => {
    if (idx > 0) { setIdx(idx - 1); setFlipped(false); setPicked(null); }
  };

  const pick = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => { setMode(v as any); setIdx(0); setPicked(null); }}>
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="flashcards">📚 بطاقات</TabsTrigger>
          <TabsTrigger value="mcq">❓ اختبار MCQ</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-bold flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-primary" /> النص المصدر
          </h3>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="الصق ملاحظاتك أو نصاً لتوليد مواد دراسية بالذكاء الاصطناعي..."
            className="min-h-[280px] resize-none text-base leading-relaxed"
          />
          <Button onClick={generate} disabled={loading || text.trim().length < 80} className="w-full mt-3 bg-gradient-to-l from-primary to-secondary">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري التوليد...</> : <><Sparkles className="h-4 w-4 ml-2" /> توليد بالذكاء الاصطناعي</>}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💎 مدعوم بـ Gemini — مجاناً ضمن خطتك
          </p>
        </Card>

        <Card className="p-4 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold flex items-center gap-2"><Brain className="h-4 w-4 text-primary" />
              {mode === 'flashcards' ? 'بطاقات الدراسة' : 'اختبار MCQ'}
            </h3>
            {list.length > 0 && (
              <div className="flex items-center gap-2">
                {mode === 'mcq' && <Badge variant="secondary">النتيجة: {score}/{quiz.length}</Badge>}
                <Badge variant="outline">{idx + 1} / {list.length}</Badge>
              </div>
            )}
          </div>

          {mode === 'flashcards' && card && (
            <div className="space-y-3">
              <div
                onClick={() => setFlipped(!flipped)}
                className="min-h-[260px] p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer flex items-center justify-center text-center transition-all hover:border-primary/40"
              >
                <div>
                  <Badge variant="outline" className="mb-3">{flipped ? '✅ الإجابة' : '❓ السؤال'}</Badge>
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {flipped ? card.a : card.q}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button variant="outline" size="sm" onClick={prev} disabled={idx === 0}><ChevronRight className="h-4 w-4" /> سابق</Button>
                <Button variant="outline" size="sm" onClick={() => setFlipped(!flipped)}>اقلب</Button>
                <Button variant="outline" size="sm" onClick={next} disabled={idx === list.length - 1}>التالي <ChevronLeft className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {mode === 'mcq' && q && (
            <div className="space-y-3">
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="font-medium leading-relaxed">{q.question}</p>
              </div>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isCorrect = picked !== null && i === q.answer;
                  const isWrong = picked === i && i !== q.answer;
                  return (
                    <button
                      key={i}
                      onClick={() => pick(i)}
                      disabled={picked !== null}
                      className={`w-full text-right p-3 rounded-lg border transition-all ${
                        isCorrect ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400' :
                        isWrong ? 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400' :
                        'hover:bg-muted/50 border-border'
                      } disabled:cursor-not-allowed`}
                    >
                      <span className="flex items-center gap-2">
                        {isCorrect && <CheckCircle2 className="h-4 w-4" />}
                        {isWrong && <XCircle className="h-4 w-4" />}
                        <span>{opt}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {picked !== null && q.explanation && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                  💡 {q.explanation}
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <Button variant="outline" size="sm" onClick={prev} disabled={idx === 0}><ChevronRight className="h-4 w-4" /> سابق</Button>
                <Button variant="outline" size="sm" onClick={next} disabled={idx === list.length - 1}>التالي <ChevronLeft className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {list.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[260px] text-muted-foreground text-center">
              <Sparkles className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">الصق نصاً واضغط توليد لتظهر النتائج هنا</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
