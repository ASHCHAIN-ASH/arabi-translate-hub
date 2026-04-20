import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import {
  DailyChallengeService,
  SanitizedQuestion,
  AttemptStartResult,
  AttemptSubmitResult,
} from '@/utils/dailyChallengeService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  userId: string;
  onComplete: (result: AttemptSubmitResult) => void;
}

export const ChallengeRunner: React.FC<Props> = ({
  open, onOpenChange, challengeId, userId, onComplete,
}) => {
  const [starting, setStarting] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attempt, setAttempt] = useState<AttemptStartResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const startedAtRef = useRef<number>(Date.now());
  const submittedRef = useRef(false);
  const { toast } = useToast();

  // Start attempt when opened
  useEffect(() => {
    if (!open) return;
    submittedRef.current = false;
    setAnswers({});
    setCurrentIdx(0);
    setStarting(true);
    setAttempt(null);

    DailyChallengeService.startAttempt(userId, challengeId)
      .then(res => {
        if (!res.success) {
          toast({ title: 'تعذر بدء التحدي', description: res.error, variant: 'destructive' });
          onOpenChange(false);
          return;
        }
        setAttempt(res);
        setSecondsLeft((res.duration_minutes || 10) * 60);
        startedAtRef.current = Date.now();
      })
      .catch(e => {
        toast({ title: 'خطأ', description: e?.message, variant: 'destructive' });
        onOpenChange(false);
      })
      .finally(() => setStarting(false));
  }, [open, challengeId, userId, onOpenChange, toast]);

  // Timer
  useEffect(() => {
    if (!attempt || submittedRef.current) return;
    if (secondsLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, attempt]);

  const questions: SanitizedQuestion[] = attempt?.questions || [];
  const total = questions.length;
  const current = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total && total > 0;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const lowTime = secondsLeft <= 60;

  const select = (qid: string, opt: string) => {
    setAnswers(prev => ({ ...prev, [qid]: opt }));
  };

  const handleSubmit = async (isTimeout = false) => {
    if (submittedRef.current || !attempt?.attempt_id) return;
    submittedRef.current = true;
    setSubmitting(true);
    const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
    try {
      const res = await DailyChallengeService.submitAttempt(
        userId, attempt.attempt_id, answers, elapsed,
      );
      if (!res.success) {
        toast({ title: 'تعذر التسليم', description: res.error, variant: 'destructive' });
        return;
      }
      if (isTimeout) {
        toast({ title: '⏰ انتهى الوقت!', description: 'تم تسليم إجاباتك تلقائياً.' });
      }
      onComplete(res);
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'خطأ', description: e?.message, variant: 'destructive' });
      submittedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && attempt && !submittedRef.current) {
          // confirm exit
          if (!window.confirm('هل تريد الخروج؟ سيتم تسليم إجاباتك الحالية.')) return;
          handleSubmit(false);
          return;
        }
        onOpenChange(o);
      }}
    >
      <DialogContent
        dir="rtl"
        className="max-w-2xl p-0 overflow-hidden gap-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {starting ? (
          <div className="p-12 text-center">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary mb-3" />
            <p className="font-bold">جارٍ تجهيز التحدي...</p>
          </div>
        ) : !attempt || total === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3" />
            <p>لا توجد أسئلة في هذا التحدي.</p>
          </div>
        ) : (
          <>
            {/* Header with timer */}
            <div className={cn(
              'p-4 border-b transition-colors',
              lowTime ? 'bg-rose-50 border-rose-200' : 'bg-gradient-to-r from-violet-50 to-purple-50 border-purple-200'
            )}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-0.5">سؤال</p>
                  <p className="font-black text-lg">{currentIdx + 1} / {total}</p>
                </div>
                <motion.div
                  animate={lowTime ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-black tabular-nums shadow-md',
                    lowTime ? 'bg-rose-600 text-white' : 'bg-white text-purple-700 border border-purple-200'
                  )}
                >
                  <Clock className="w-4 h-4" />
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </motion.div>
              </div>
              <Progress value={((currentIdx + 1) / total) * 100} className="h-2" />
              <div className="flex items-center gap-1 mt-2">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(i)}
                    className={cn(
                      'w-7 h-7 rounded-lg text-xs font-bold transition-all',
                      i === currentIdx && 'bg-purple-600 text-white scale-110 shadow',
                      i !== currentIdx && answers[q.id] && 'bg-emerald-100 text-emerald-700 border border-emerald-300',
                      i !== currentIdx && !answers[q.id] && 'bg-muted text-muted-foreground hover:bg-muted/70',
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-bold mb-5 leading-relaxed">
                  {current.question}
                </h3>
                <div className="space-y-2.5">
                  {(current.options || []).map((opt, i) => {
                    const isSelected = answers[current.id] === opt;
                    return (
                      <button
                        key={i}
                        onClick={() => select(current.id, opt)}
                        className={cn(
                          'w-full text-right p-4 rounded-xl border-2 font-semibold text-sm transition-all',
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-md scale-[1.01]'
                            : 'border-border hover:border-purple-300 hover:bg-purple-50/30'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0',
                            isSelected ? 'bg-purple-600 text-white' : 'bg-muted text-muted-foreground'
                          )}>
                            {String.fromCharCode(0x0623 + i)}
                          </div>
                          <span className="flex-1">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer nav */}
            <div className="p-4 border-t bg-muted/30 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className="gap-1"
              >
                <ChevronRight className="w-4 h-4" /> السابق
              </Button>

              <p className="text-xs text-muted-foreground font-semibold">
                {answeredCount}/{total} مُجاب
              </p>

              {currentIdx < total - 1 ? (
                <Button
                  onClick={() => setCurrentIdx(i => Math.min(total - 1, i + 1))}
                  className="gap-1 bg-purple-600 hover:bg-purple-700"
                >
                  التالي <ChevronLeft className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting || !allAnswered}
                  className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '🏁'}
                  تسليم
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
