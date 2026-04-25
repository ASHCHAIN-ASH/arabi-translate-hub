import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flame, Trophy, Calendar, CheckCircle2, RotateCcw, Sparkles, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ChallengeState = {
  status: 'none' | 'in_progress' | 'completed' | 'failed';
  attempt_id?: string;
  current_day?: number;
  streak?: number;
  days_left?: number;
  required_days?: number;
  required_minutes?: number;
  last_check_in_on?: string | null;
  started_on?: string;
  today?: string;
  can_check_in?: boolean;
  message?: string;
};

interface Props {
  userId?: string;
}

export default function StudyChallengeCard({ userId }: Props) {
  const [state, setState] = useState<ChallengeState>({ status: 'none' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [pulse, setPulse] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await (supabase as any).rpc('get_study_challenge_state', { p_user_id: userId });
    if (!error && data) setState(data as ChallengeState);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  // realtime
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`study-challenge-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_challenge_attempts', filter: `user_id=eq.${userId}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_challenge_check_ins', filter: `user_id=eq.${userId}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, load]);

  const start = async () => {
    setSubmitting(true);
    const { data, error } = await (supabase as any).rpc('start_study_challenge');
    setSubmitting(false);
    if (error || !data?.success) {
      toast.error('تعذّر بدء التحدي');
      return;
    }
    toast.success('بدأ التحدي! 🔥');
    setPulse(true); setTimeout(() => setPulse(false), 1500);
    load();
  };

  const checkIn = async () => {
    setSubmitting(true);
    const { data, error } = await (supabase as any).rpc('check_in_study_challenge', { p_minutes: 30 });
    setSubmitting(false);
    if (error || !data?.success) {
      const code = data?.error || 'unknown';
      const map: Record<string, string> = {
        already_checked_in_today: 'سجّلت حضورك اليوم بالفعل',
        challenge_failed: 'انتهى التحدي… حاول مجددًا',
        no_active_attempt: 'لا يوجد تحدٍّ نشط',
        min_30_minutes_required: 'يلزم 30 دقيقة على الأقل',
      };
      toast.error(map[code] || 'تعذّر تسجيل الحضور');
      setShake(true); setTimeout(() => setShake(false), 600);
      load();
      return;
    }
    if (data.completed) {
      setConfetti(true);
      toast.success(`🏆 أكملت التحدي! +${data.xp_awarded} XP`);
      setTimeout(() => setConfetti(false), 4000);
    } else {
      toast.success(`اليوم ${data.current_day}/7 — استمر! 🔥`);
      setPulse(true); setTimeout(() => setPulse(false), 1500);
    }
    load();
  };

  if (loading) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
        </CardContent>
      </Card>
    );
  }

  const totalDays = state.required_days ?? 7;
  const currentDay = state.current_day ?? 0;
  const progress = totalDays ? (currentDay / totalDays) * 100 : 0;

  return (
    <motion.div animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden border-amber-200/60 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-sm">
        {/* glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-orange-300/20 blur-3xl" />

        <CardContent className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.div
                animate={pulse ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.8, repeat: pulse ? 2 : 0 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
              >
                <Flame className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">🔥 تحدي 7 أيام</h3>
                <p className="text-xs text-slate-600">ذاكر 30 دقيقة يوميًا… واربح Elite Student</p>
              </div>
            </div>

            {state.status === 'in_progress' && (
              <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                <Flame className="h-3.5 w-3.5" /> Streak {state.streak ?? 0}
              </div>
            )}
          </div>

          {/* States */}
          <AnimatePresence mode="wait">
            {state.status === 'none' && (
              <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5">
                <p className="text-sm text-slate-600">
                  ابدأ التحدي الآن — 7 أيام متتالية × 30 دقيقة. عند النجاح: <b className="text-orange-700">+700 XP</b> ·{' '}
                  <b className="text-amber-700">+350 نقطة</b> · شارة <b>🏆 Elite Student</b>.
                </p>
                <Button
                  onClick={start}
                  disabled={submitting}
                  className="mt-4 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 py-6 text-base font-extrabold text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600"
                >
                  <Sparkles className="ml-2 h-5 w-5" /> ابدأ التحدي الآن
                </Button>
              </motion.div>
            )}

            {state.status === 'in_progress' && (
              <motion.div key="prog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5">
                <div className="flex items-end justify-between text-sm">
                  <div>
                    <div className="text-xs text-slate-500">اليوم الحالي</div>
                    <div className="text-2xl font-black text-slate-900">{currentDay}<span className="text-base text-slate-400">/{totalDays}</span></div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">متبقّي</div>
                    <div className="text-2xl font-black text-orange-600">{state.days_left ?? totalDays - currentDay}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress value={progress} className="h-3 bg-orange-100" />
                </div>

                {/* days dots */}
                <div className="mt-4 flex items-center justify-between gap-1.5">
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const done = i < currentDay;
                    const isToday = i === currentDay && state.can_check_in;
                    return (
                      <motion.div
                        key={i}
                        animate={isToday ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ duration: 1.2, repeat: isToday ? Infinity : 0 }}
                        className={`flex h-9 flex-1 items-center justify-center rounded-lg text-[11px] font-bold ${
                          done
                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow'
                            : isToday
                              ? 'border-2 border-dashed border-orange-400 bg-white text-orange-600'
                              : 'bg-white/70 text-slate-400'
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : `D${i + 1}`}
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  onClick={checkIn}
                  disabled={submitting || !state.can_check_in}
                  className="mt-5 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 py-6 text-base font-extrabold text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
                >
                  <Calendar className="ml-2 h-5 w-5" />
                  {state.can_check_in ? 'سجّل حضور اليوم (30 دقيقة)' : 'تم تسجيل اليوم ✓ — عُد غدًا'}
                </Button>
              </motion.div>
            )}

            {state.status === 'completed' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-5 text-center"
              >
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg"
                >
                  <Trophy className="h-8 w-8 text-white" />
                </motion.div>
                <div className="mt-3 text-xl font-black text-slate-900">🏆 Elite Student</div>
                <div className="text-sm text-slate-700">أكملت 7 أيام متتالية! +700 XP · +350 نقطة</div>
                <Button
                  onClick={start}
                  variant="outline"
                  className="mt-4 rounded-full border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <RotateCcw className="ml-2 h-4 w-4" /> ابدأ تحديًا جديدًا
                </Button>

                {confetti && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute h-2 w-2 rounded-sm"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: '20%',
                          background: ['#f97316', '#f59e0b', '#fbbf24', '#fb923c'][i % 4],
                        }}
                        initial={{ y: 0, opacity: 1, rotate: 0 }}
                        animate={{ y: 300, opacity: 0, rotate: 360 }}
                        transition={{ duration: 2 + Math.random() * 1.5, delay: Math.random() * 0.5 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {state.status === 'failed' && (
              <motion.div
                key="fail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
                  <Lock className="h-7 w-7 text-rose-500" />
                </div>
                <div className="mt-3 text-lg font-bold text-slate-900">انتهى التحدي…</div>
                <div className="text-sm text-slate-600">{state.message || 'فاتك يوم. لا بأس، حاول مجددًا.'}</div>
                <Button
                  onClick={start}
                  className="mt-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 font-bold text-white"
                >
                  <RotateCcw className="ml-2 h-4 w-4" /> حاول مجددًا
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
