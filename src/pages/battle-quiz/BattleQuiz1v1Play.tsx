import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Flame, CheckCircle2, XCircle, Zap, Swords, Trophy } from 'lucide-react';
import {
  BattleQuizService,
  type BattleQuizStartPayload,
  type BattleQuizQuestion,
} from '@/utils/battleQuizService';
import { BattleQuiz1v1Service, type BQ1v1Match } from '@/utils/battleQuiz1v1Service';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';

const BattleQuiz1v1Play: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<BQ1v1Match | null>(null);
  const [payload, setPayload] = useState<BattleQuizStartPayload | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; pts: number; correctId: string | null } | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [submittedFinal, setSubmittedFinal] = useState(false);

  const startedAtRef = useRef<number>(Date.now());
  const matchStartRef = useRef<number>(Date.now());

  const currentQ: BattleQuizQuestion | null = payload?.questions[qIndex] ?? null;

  const isPlayerA = match && user ? match.player_a_id === user.id : false;
  const myFinishedAt = match ? (isPlayerA ? match.player_a_finished_at : match.player_b_finished_at) : null;
  const oppFinishedAt = match ? (isPlayerA ? match.player_b_finished_at : match.player_a_finished_at) : null;
  const oppScore = match ? (isPlayerA ? match.player_b_score : match.player_a_score) : 0;
  const oppCorrect = match ? (isPlayerA ? match.player_b_correct : match.player_a_correct) : 0;

  // Load match + start attempt for this player
  useEffect(() => {
    if (!user || !matchId) return;
    let mounted = true;
    (async () => {
      const m = await BattleQuiz1v1Service.getMatch(matchId);
      if (!mounted) return;
      if (!m) { setError('لم يتم العثور على المباراة'); setLoading(false); return; }
      if (![m.player_a_id, m.player_b_id].includes(user.id)) {
        setError('لست لاعباً في هذه المباراة'); setLoading(false); return;
      }
      setMatch(m);

      if (m.status !== 'active') {
        navigate(`/battle-quiz/1v1/${matchId}/result`);
        return;
      }

      const res = await BattleQuiz1v1Service.startAttempt(matchId);
      if (!mounted) return;
      if (!res || res.error) {
        console.error('start 1v1 attempt error', res?.error);
        setError('تعذّر بدء المباراة'); setLoading(false); return;
      }
      setPayload(res);
      setLoading(false);
      startedAtRef.current = Date.now();
      matchStartRef.current = Date.now();
      setTimeLeft(res.questions[0]?.time_limit_seconds ?? res.room.time_limit_per_question);
    })();
    return () => { mounted = false; };
  }, [user, matchId, navigate]);

  // Realtime opponent updates
  useEffect(() => {
    if (!matchId) return;
    const cleanup = BattleQuiz1v1Service.subscribeMatch(matchId, (m) => {
      setMatch(m);
      if (m.status !== 'active') {
        navigate(`/battle-quiz/1v1/${matchId}/result`);
      }
    });
    return cleanup;
  }, [matchId, navigate]);

  // Heartbeat every 10s
  useEffect(() => {
    if (!matchId) return;
    const i = window.setInterval(() => { BattleQuiz1v1Service.heartbeat(matchId); }, 10000);
    return () => window.clearInterval(i);
  }, [matchId]);

  // Countdown
  useEffect(() => {
    if (!currentQ || feedback || myFinishedAt) return;
    setTimeLeft(currentQ.time_limit_seconds);
    startedAtRef.current = Date.now();
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(t); handleAnswer(null); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, currentQ?.id]);

  const submitFinal = async (finalScore: number, finalCorrect: number) => {
    if (!matchId || !payload || submittedFinal) return;
    setSubmittedFinal(true);
    const totalMs = Date.now() - matchStartRef.current;
    await BattleQuizService.completeAttempt(payload.attempt_id);
    await BattleQuiz1v1Service.submitScore(matchId, payload.attempt_id, finalScore, finalCorrect, totalMs);
  };

  const handleAnswer = async (choiceId: string | null) => {
    if (!payload || !currentQ || feedback || submitting || myFinishedAt) return;
    setSubmitting(true);
    const responseMs = Date.now() - startedAtRef.current;
    const res = await BattleQuizService.submitAnswer(payload.attempt_id, currentQ.id, choiceId, responseMs);
    setSubmitting(false);
    if ('error' in res) { toast.error('تعذّر إرسال الإجابة'); return; }

    setFeedback({ correct: res.is_correct, pts: res.awarded_points, correctId: res.correct_choice_id });
    let newScore = score;
    let newCorrect = correct;
    if (res.is_correct) {
      newScore = score + res.awarded_points;
      newCorrect = correct + 1;
      setScore(newScore);
      setCorrect(newCorrect);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(async () => {
      setFeedback(null);
      const next = qIndex + 1;
      if (next >= payload.questions.length) {
        await submitFinal(newScore, newCorrect);
        // Result page will be reached via realtime when finalize happens, or after a short fallback:
        setTimeout(() => navigate(`/battle-quiz/1v1/${matchId}/result`), 1500);
      } else {
        setQIndex(next);
      }
    }, 1100);
  };

  if (!user) return <ClientLayout><div className="p-6 text-center" dir="rtl">يرجى تسجيل الدخول</div></ClientLayout>;
  if (loading) return <ClientLayout><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></ClientLayout>;
  if (error) {
    return (
      <ClientLayout>
        <div className="p-6 max-w-lg mx-auto" dir="rtl">
          <Card className="p-6 text-center space-y-4">
            <XCircle className="w-12 h-12 mx-auto text-destructive" />
            <p className="font-bold">{error}</p>
            <Button onClick={() => navigate('/battle-quiz/1v1')}>العودة</Button>
          </Card>
        </div>
      </ClientLayout>
    );
  }
  if (!payload || !currentQ) {
    // Waiting for opponent
    return (
      <ClientLayout>
        <div className="p-6 max-w-lg mx-auto" dir="rtl">
          <Card className="p-6 text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <p className="font-bold">في انتظار انتهاء الخصم…</p>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  const total = payload.questions.length;
  const progress = (qIndex / total) * 100;
  const timePct = (timeLeft / currentQ.time_limit_seconds) * 100;

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 max-w-3xl mx-auto" dir="rtl" onCopy={(e) => e.preventDefault()}>
        {/* VS bar */}
        <Card className="p-3 mb-4 bg-gradient-to-r from-primary/10 to-fuchsia-500/10">
          <div className="grid grid-cols-3 items-center text-center">
            <div>
              <div className="text-[10px] text-muted-foreground">أنت</div>
              <div className="font-extrabold text-lg flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-amber-600" /> {score}
              </div>
              <div className="text-[10px] text-muted-foreground">{correct} صحيح</div>
            </div>
            <div className="text-center">
              <Swords className="w-6 h-6 mx-auto text-primary" />
              <div className="text-[10px] font-bold mt-0.5">VS</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">الخصم</div>
              <div className="font-extrabold text-lg flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 text-fuchsia-600" /> {oppScore}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {oppCorrect} صحيح {oppFinishedAt ? '✓' : ''}
              </div>
            </div>
          </div>
        </Card>

        {myFinishedAt ? (
          <Card className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
            <p className="font-bold">انتهيت! بانتظار الخصم…</p>
            <Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-xs">سؤال {qIndex + 1} / {total}</Badge>
              {streak > 1 && (
                <span className="flex items-center gap-1 text-orange-600 text-sm font-bold">
                  <Flame className="w-4 h-4" /> {streak}
                </span>
              )}
            </div>
            <Progress value={progress} className="mb-2 h-1.5" />
            <div className="flex items-center gap-2 mb-4">
              <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
              <Progress value={timePct} className={`h-2 flex-1 ${timeLeft <= 5 ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`} />
              <span className={`text-xs font-bold tabular-nums w-8 text-left ${timeLeft <= 5 ? 'text-destructive' : ''}`}>{timeLeft}s</span>
            </div>

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
                    const isCorrect = feedback && c.id === feedback.correctId;
                    let cls = 'border-2 hover:border-primary hover:bg-primary/5';
                    if (feedback) cls = isCorrect ? 'border-2 border-green-500 bg-green-500/10' : 'border-2 opacity-50';
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
                    {feedback.correct ? `✅ صحيح! +${feedback.pts}` : '❌ غير صحيح'}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </ClientLayout>
  );
};

export default BattleQuiz1v1Play;
