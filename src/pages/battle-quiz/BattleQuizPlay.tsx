import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Flame, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { BattleQuizService, type BattleQuizStartPayload, type BattleQuizQuestion } from '@/utils/battleQuizService';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useBattleQuizAntiCheat } from '@/hooks/useBattleQuizAntiCheat';
import { toast } from 'sonner';

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
  const [feedback, setFeedback] = useState<{ correct: boolean; pts: number; correctId: string | null } | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [submitting, setSubmitting] = useState(false);

  const startedAtRef = useRef<number>(Date.now());

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
          'تعذّر بدء التحدي.'
        );
        setLoading(false);
        return;
      }
      setPayload(res);
      setLoading(false);
      startedAtRef.current = Date.now();
      setTimeLeft(res.questions[0]?.time_limit_seconds ?? res.room.time_limit_per_question);
    });
    return () => { mounted = false; };
  }, [user, roomId]);

  // currentQ already declared above (needed by the anti-cheat hook).

  // Countdown
  useEffect(() => {
    if (!currentQ || feedback) return;
    setTimeLeft(currentQ.time_limit_seconds);
    startedAtRef.current = Date.now();
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleAnswer(null); // timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, currentQ?.id]);

  const handleAnswer = async (choiceId: string | null) => {
    if (!payload || !currentQ || feedback || submitting) return;
    setSubmitting(true);
    const responseMs = Date.now() - startedAtRef.current;
    const res = await BattleQuizService.submitAnswer(payload.attempt_id, currentQ.id, choiceId, responseMs);
    setSubmitting(false);
    // Per-type post-answer heuristics (too-fast-to-read, mechanical pattern, …)
    reportPostAnswer(responseMs);
    if ('error' in res) {
      toast.error('تعذّر إرسال الإجابة');
      return;
    }
    setFeedback({ correct: res.is_correct, pts: res.awarded_points, correctId: res.correct_choice_id });
    if (res.is_correct) {
      setScore((s) => s + res.awarded_points);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setTimeout(async () => {
      setFeedback(null);
      const next = qIndex + 1;
      if (next >= payload.questions.length) {
        // complete
        const final = await BattleQuizService.completeAttempt(payload.attempt_id);
        if ('error' in final) {
          toast.error('تعذّر إنهاء التحدي');
          return;
        }
        sessionStorage.setItem(`bq_result_${payload.attempt_id}`, JSON.stringify({
          ...final, room_title: payload.room.title,
        }));
        navigate(`/battle-quiz/${roomId}/result?attempt=${payload.attempt_id}`);
      } else {
        setQIndex(next);
      }
    }, 1200);
  };

  if (!user) {
    return <ClientLayout><div className="p-6 text-center" dir="rtl">يرجى تسجيل الدخول</div></ClientLayout>;
  }
  if (loading) {
    return <ClientLayout><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></ClientLayout>;
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

  const total = payload.questions.length;
  const progress = ((qIndex) / total) * 100;
  const timePct = (timeLeft / currentQ.time_limit_seconds) * 100;

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 max-w-3xl mx-auto" dir="rtl" onCopy={(e) => e.preventDefault()}>
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="text-sm">
            سؤال {qIndex + 1} / {total}
          </Badge>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-bold text-amber-600">
              <Zap className="w-4 h-4" /> {score}
            </span>
            {streak > 1 && (
              <span className="flex items-center gap-1 font-bold text-orange-600">
                <Flame className="w-4 h-4" /> {streak}
              </span>
            )}
          </div>
        </div>

        <Progress value={progress} className="mb-2 h-1.5" />

        {/* Timer */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
          <Progress
            value={timePct}
            className={`h-2 flex-1 ${timeLeft <= 5 ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`}
          />
          <span className={`text-xs font-bold tabular-nums w-8 text-left ${timeLeft <= 5 ? 'text-destructive' : ''}`}>
            {timeLeft}s
          </span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-5 sm:p-6 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-[10px]">
                  {currentQ.difficulty === 'easy' ? 'سهل' : currentQ.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold leading-relaxed">{currentQ.question_text}</h2>
            </Card>

            <div className="space-y-2.5">
              {currentQ.choices.map((c, i) => {
                const isSelected = feedback && c.id === feedback.correctId && feedback.correct;
                const isCorrect = feedback && c.id === feedback.correctId;
                const isWrong = feedback && !feedback.correct && c.id === feedback.correctId;
                let cls = 'border-2 hover:border-primary hover:bg-primary/5';
                if (feedback) {
                  if (isCorrect) cls = 'border-2 border-green-500 bg-green-500/10';
                  else cls = 'border-2 opacity-50';
                }
                return (
                  <motion.button
                    key={c.id}
                    whileHover={!feedback ? { scale: 1.01 } : undefined}
                    whileTap={!feedback ? { scale: 0.99 } : undefined}
                    onClick={() => handleAnswer(c.id)}
                    disabled={!!feedback || submitting}
                    className={`w-full text-right p-4 rounded-xl bg-card transition-all ${cls} flex items-center gap-3`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-sm shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 font-medium">{c.choice_text}</span>
                    {feedback && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  </motion.button>
                );
              })}
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-xl text-center font-bold ${
                  feedback.correct ? 'bg-green-500/10 text-green-700' : 'bg-destructive/10 text-destructive'
                }`}
              >
                {feedback.correct ? `✅ صحيح! +${feedback.pts} نقطة` : '❌ إجابة غير صحيحة'}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </ClientLayout>
  );
};

export default BattleQuizPlay;
