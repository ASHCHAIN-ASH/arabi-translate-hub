import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, RotateCw, ChevronRight, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Flashcard { q: string; a: string; }

interface Props {
  text: string;
  setText: (v: string) => void;
}

export default function StudyPanel({ text, setText }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (text.trim().length < 100) return toast.error('النص قصير لتوليد بطاقات (100 حرف على الأقل)');
    setLoading(true);
    // توليد محلي بسيط: نقسم على نقاط ونحوّل إلى بطاقات (placeholder للمرحلة 2 — سنربط AI لاحقاً)
    try {
      const sentences = text
        .split(/[.\n؟!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20)
        .slice(0, 10);
      const generated: Flashcard[] = sentences.map((s, i) => ({
        q: `سؤال ${i + 1}: ما الفكرة الأساسية في:\n"${s.slice(0, 80)}${s.length > 80 ? '...' : ''}"`,
        a: s,
      }));
      if (generated.length === 0) {
        toast.error('لم نتمكن من توليد بطاقات من هذا النص');
        return;
      }
      setCards(generated);
      setIdx(0);
      setFlipped(false);
      toast.success(`تم توليد ${generated.length} بطاقة`);
    } finally {
      setLoading(false);
    }
  };

  const card = cards[idx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="font-bold flex items-center gap-2 mb-3">
          <Brain className="h-4 w-4 text-primary" /> المصدر
        </h3>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="الصق ملاحظاتك أو نصاً لتوليد بطاقات تعليمية..."
          className="min-h-[280px] resize-none text-base leading-relaxed"
        />
        <Button onClick={generate} disabled={loading || text.trim().length < 100} className="w-full mt-3 bg-gradient-to-l from-primary to-secondary">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> جاري...</> : <><Sparkles className="h-4 w-4" /> توليد بطاقات</>}
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          💡 وضع تجريبي — قريباً: توليد ذكي بـ AI + اختبارات MCQ
        </p>
      </Card>

      <Card className="p-4 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> بطاقات الدراسة</h3>
          {cards.length > 0 && <Badge variant="outline">{idx + 1} / {cards.length}</Badge>}
        </div>
        {card ? (
          <div className="space-y-3">
            <div
              onClick={() => setFlipped(!flipped)}
              className="min-h-[260px] p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer flex items-center justify-center text-center transition-all hover:border-primary/40"
            >
              <div>
                <div className="text-xs text-muted-foreground mb-2">{flipped ? 'الإجابة' : 'السؤال'} (انقر للقلب)</div>
                <div className="text-base leading-relaxed whitespace-pre-wrap">{flipped ? card.a : card.q}</div>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <Button size="sm" variant="outline" onClick={() => { setIdx((i) => Math.max(0, i - 1)); setFlipped(false); }} disabled={idx === 0}>
                <ChevronRight className="h-4 w-4" /> السابق
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setFlipped(!flipped); }}>
                <RotateCw className="h-4 w-4" /> قلب
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setIdx((i) => Math.min(cards.length - 1, i + 1)); setFlipped(false); }} disabled={idx === cards.length - 1}>
                التالي <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="min-h-[260px] flex flex-col items-center justify-center text-muted-foreground text-sm">
            <Brain className="h-12 w-12 mb-3 opacity-30" />
            <p>ستظهر بطاقاتك هنا</p>
          </div>
        )}
      </Card>
    </div>
  );
}
