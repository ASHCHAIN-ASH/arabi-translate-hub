import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Flame, CheckCircle2, XCircle, Zap, ShieldAlert, TimerIcon } from 'lucide-react';
import {
  BattleQuizService,
  type BattleQuizStartPayload,
  type BattleQuizQuestion,
} from '@/utils/battleQuizService';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useBattleQuizAntiCheat } from '@/hooks/useBattleQuizAntiCheat';
import { useBattleQuizTimer } from '@/hooks/useBattleQuizTimer';
import { useBattleQuizSuspicion } from '@/hooks/useBattleQuizSuspicion';
import { computeQuestionScore } from '@/utils/battleQuizScoring';
import { toast } from 'sonner';

interface FeedbackState {
  correct: boolean;
  pts: number;
  correctId: string | null;
  selectedId: string | null;
}

/** Big circular countdown — stays readable on mobile, animates color near zero. */
const CircularTimer: React.FC<{ progress: number; seconds: number; danger: boolean }> = React.memo(
  ({ progress, seconds, danger }) => {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress);
    return (
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} className="fill-none stroke-muted" strokeWidth="6" />
          <circle
            cx="40" cy="40" r={radius}
            className={`fill-none transition-all duration-200 ${danger ? 'stroke-destructive' : 'stroke-primary'}`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-black tabular-nums ${danger ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
            {seconds}
          </span>
        </div>
      </div>
    );
  },
);
CircularTimer.displayName = 'CircularTimer';

const BattleQuizPlay: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<BattleQuizStartPayload | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentQ: BattleQuizQuestion | null = payload?.questions[qIndex] ?? null;

  const { reportPostAnswer } = useBattleQuizAntiCheat(
    payload?.attempt_id ?? null,
    !!payload && !feedback,
    currentQ
      ? {
          questionId: currentQ.id,
          antiCheatType: currentQ.anti_cheat_type as any,
          timeLimitSeconds: currentQ.time_limit_seconds,
        }
      : null,
  );

  const suspicion = useBattleQuizSuspicion(!!payload && !feedback);

  // Start attempt
  useEffect(() => {
    if (!user || !roomId) return;
    let mounted = true;
    setLoading(true);
    BattleQuizService.startAttempt(roomId).then((res) => {
      if (!mounted) return;
      if ('error' in res) {
        setError(
          res.error === 'daily_limit_reached' ? 'لقد أكملت تحدي اليوم بالفعل — عُد غداً!' :
          res.error === 'no_questions' ? 'لا توجد أسئلة متاحة في هذه الغرفة.' :
          res.error === 'room_not_open' ? 'هذه الغرفة غير متاحة حالياً.' :
          'تعذّر بدء التحدي.',
        );
        setLoading(false);
        return;
      }
      setPayload(res);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [user, roomId]);

  const handleAnswer = useCallback(
    async (choiceId: string | null) => {
      if (!payload || !currentQ || feedback || submitting) return;
      setSubmitting(true);
      const responseMs = timer.getElapsedMs();
      const res = await BattleQuizService.submitAnswer(
        payload.attempt_id, currentQ.id, choiceId, responseMs,
      );
      setSubmitting(false);
      reportPostAnswer(responseMs);
      suspicion.recordAnswerTiming(responseMs);

      if ('error' in res) {
        toast.error('تعذّر إرسال الإجابة');
        return;
      }

      // Optimistic local breakdown for animation polish (server is source of truth for total)
      const nextStreak = res.is_correct ? streak + 1 : 0;
      const breakdown = computeQuestionScore({
        isCorrect: res.is_correct,
        responseMs,
        timeLimitSeconds: currentQ.time_limit_seconds,
        streakAfter: nextStreak,
      });

      setFeedback({
        correct: res.is_correct,
        pts: res.awarded_points || breakdown.total,
        correctId: res.correct_choice_id,
        selectedId: choiceId,
      });
      if (res.is_correct) {
        setScore((s) => s + (res.awarded_points || breakdown.total));
        setStreak(nextStreak);
        setBestStreak((b) => Math.max(b, nextStreak));
      } else {
        setStreak(0);
      }

      window.setTimeout(async () => {
        setFeedback(null);
        const next = qIndex + 1;
        if (next >= payload.questions.length) {
          const final = await BattleQuizService.completeAttempt(payload.attempt_id);
          if ('error' in final) {
            toast.error('تعذّر إنهاء التحدي');
            return;
          }
          sessionStorage.setItem(
            `bq_result_${payload.attempt_id}`,
            JSON.stringify({ ...final, room_title: payload.room.title }),
          );
          navigate(`/battle-quiz/${roomId}/result?attempt=${payload.attempt_id}`);
        } else {
          setQIndex(next);
        }
      }, 1100);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payload, currentQ, feedback, submitting, qIndex, streak],
  );

  // Timer (auto-submits null on expire)
  const onExpire = useCallback(() => { handleAnswer(null); }, [handleAnswer]);
  const timer = useBattleQuizTimer(
    currentQ?.time_limit_seconds ?? 20,
    currentQ?.id ?? null,
    onExpire,
    !!currentQ && !feedback,
  );

  const total = payload?.questions.length ?? 0;
  const progressPct = total ? (qIndex / total) * 100 : 0;
  const dangerTime = timer.remainingSeconds <= 5;

  if (!user) {
    return <ClientLayout><div className="p-6 text-center" dir="rtl">يرجى تسجيل الدخول</div></ClientLayout>;
  }
  if (loading) {
    return (
      <ClientLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-3" dir="rtl">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">جاري تجهيز التحدي…</p>
        </div>
      </ClientLayout>
    );
  }
  if (error) {
    return (
      <ClientLayout>
        <div className="p-6 max-w-lg mx-auto" dir="rtl">
          <Card className="p-6 text-center space-y-4">
            <XCircle className="w-12 h-12 mx-auto text-destructive" />
            <p className="font-bold">{error}</p>
            <Button onClick={() => navigate('/battle-quiz')}>العودة</Button>
          </Card>
        </div>
      </ClientLayout>
    );
  }
  if (!payload || !currentQ) return null;

  return (
    <ClientLayout>
      <div
        className="p-3 sm:p-4 lg:p-6 max-w-3xl mx-auto select-none"
        dir="rtl"
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* ======= Top HUD ======= */}
        <div className="flex items-center gap-3 mb-3">
          <CircularTimer
            progress={timer.progress}
            seconds={timer.remainingSeconds}
            danger={dangerTime}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="secondary" className="text-xs">
                سؤال {qIndex + 1} / {total}
              </Badge>
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {streak >= 2 && (
                    <motion.div
                      key="streak"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-600 font-bold text-xs"
                    >
                      <Flame className="w-3.5 h-3.5 animate-pulse" />
                      {streak}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  key={score}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-bold text-xs tabular-nums"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {score}
                </motion.div>
              </div>
            </div>
            <Progress value={progressPct} className="h-1.5" />
            {suspicion.flagged && (
              <div className="mt-2 flex items-center gap-1 text-[11px] text-destructive">
                <ShieldAlert className="w-3 h-3" />
                تم رصد سلوك مشبوه — قد تُراجَع محاولتك
              </div>
            )}
          </div>
        </div>

        {/* ======= Question + choices ======= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Card className="p-5 sm:p-6 mb-4 bg-gradient-to-br from-card to-card/60 border-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-[10px]">
                  {currentQ.difficulty === 'easy' ? 'سهل' : currentQ.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                </Badge>
                <Badge variant="outline" className="text-[10px] flex items-center gap-1">
                  <TimerIcon className="w-3 h-3" />
                  {currentQ.time_limit_seconds}s
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold leading-relaxed">
                {currentQ.question_text}
              </h2>
            </Card>

            <div className="space-y-2.5">
              {currentQ.choices.map((c, i) => {
                const isCorrect = !!feedback && c.id === feedback.correctId;
                const isPickedWrong =
                  !!feedback && !feedback.correct && c.id === feedback.selectedId;

                let cls = 'border-2 border-border hover:border-primary hover:bg-primary/5';
                if (feedback) {
                  if (isCorrect) cls = 'border-2 border-green-500 bg-green-500/10';
                  else if (isPickedWrong) cls = 'border-2 border-destructive bg-destructive/10';
                  else cls = 'border-2 border-border opacity-50';
                }

                return (
                  <motion.button
                    key={c.id}
                    whileHover={!feedback ? { scale: 1.01 } : undefined}
                    whileTap={!feedback ? { scale: 0.985 } : undefined}
                    onClick={() => handleAnswer(c.id)}
                    disabled={!!feedback || submitting}
                    className={`w-full text-right p-4 rounded-xl bg-card transition-all flex items-center gap-3 ${cls}`}
                  >
                    <span className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center font-black text-sm shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 font-medium">{c.choice_text}</span>
                    {feedback && isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </motion.span>
                    )}
                    {feedback && isPickedWrong && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                      >
                        <XCircle className="w-5 h-5 text-destructive" />
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ======= Floating feedback ======= */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              key="fb"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-1/2 sm:translate-x-1/2 z-50 max-w-sm mx-auto"
            >
              <div
                className={`rounded-2xl px-5 py-4 shadow-2xl text-center font-bold backdrop-blur-md border-2 ${
                  feedback.correct
                    ? 'bg-green-500/95 text-white border-green-300'
                    : 'bg-destructive/95 text-destructive-foreground border-destructive/50'
                }`}
              >
                {feedback.correct ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>إجابة صحيحة!</span>
                    <span className="tabular-nums">+{feedback.pts}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-5 h-5" />
                    <span>إجابة غير صحيحة</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClientLayout>
  );
};

export default BattleQuizPlay;
