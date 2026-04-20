import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, Play, Trophy, RotateCcw, Sparkles, Timer, Target } from 'lucide-react';
import { DailyChallengeFull, AttemptHistoryRow } from '@/utils/dailyChallengeService';
import { cn } from '@/lib/utils';

interface Props {
  challenge: DailyChallengeFull;
  bestAttempt: AttemptHistoryRow | null;
  completedToday: boolean;
  attemptCount: number;
  onStart: () => void;
}

export const DailyChallengeCard: React.FC<Props> = ({
  challenge, bestAttempt, completedToday, attemptCount, onStart,
}) => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilTomorrow());

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeUntilTomorrow()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -left-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 p-6 sm:p-8 text-white">
          <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-5xl sm:text-6xl drop-shadow-2xl"
              >
                {challenge.cover_emoji || '⚡'}
              </motion.div>
              <div>
                <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white mb-1.5 gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                  تحدي اليوم
                </Badge>
                <h2 className="text-xl sm:text-2xl font-black leading-tight">{challenge.title}</h2>
                {challenge.description && (
                  <p className="text-sm text-white/85 mt-1 max-w-md">{challenge.description}</p>
                )}
              </div>
            </div>

            {completedToday && (
              <Badge className="bg-emerald-500 border-0 gap-1 text-sm py-1.5 px-3">
                <Trophy className="w-3.5 h-3.5" /> مكتمل
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
            <Stat icon={Target} label="الأسئلة" value={`${challenge.total_questions ?? 5}`} />
            <Stat icon={Clock} label="المدة" value={`${challenge.duration_minutes} دقيقة`} />
            <Stat icon={Zap} label="نقاط XP" value={`حتى ${maxXp(challenge)}`} />
          </div>

          {/* Best attempt summary */}
          {bestAttempt && (
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 mb-4 border border-white/20">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-bold">أفضل نتيجة لك</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-black">{bestAttempt.score}%</span>
                  <span className="text-white/80">
                    {bestAttempt.correct_count}/{bestAttempt.total_questions}
                  </span>
                  <Badge className="bg-yellow-400/30 border-yellow-300/50 text-white text-xs">
                    +{bestAttempt.xp_awarded} XP
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <Button
            onClick={onStart}
            size="lg"
            className="w-full h-14 text-base font-black bg-white text-purple-700 hover:bg-white/95 shadow-xl gap-2"
          >
            {completedToday ? (
              <><RotateCcw className="w-5 h-5" /> إعادة المحاولة (نقاط مخفّضة)</>
            ) : attemptCount > 0 ? (
              <><Play className="w-5 h-5" /> أكمل المحاولة</>
            ) : (
              <><Sparkles className="w-5 h-5" /> ابدأ التحدي الآن</>
            )}
          </Button>

          {/* Footer info */}
          <div className="flex items-center justify-between mt-4 text-xs text-white/80 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" />
              تحدي جديد خلال: <span className="font-black tabular-nums text-white">{timeLeft}</span>
            </div>
            {attemptCount > 0 && (
              <span>محاولات: {attemptCount}</span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const Stat: React.FC<{ icon: any; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 border border-white/20 text-center">
    <Icon className="w-4 h-4 mx-auto mb-1 text-white/90" />
    <p className="text-[10px] text-white/80 mb-0.5">{label}</p>
    <p className="text-sm font-black truncate">{value}</p>
  </div>
);

function maxXp(c: DailyChallengeFull): number {
  const total = c.total_questions ?? 5;
  return total * c.xp_per_correct + c.completion_bonus + c.perfect_bonus;
}

function getTimeUntilTomorrow(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  const diff = Math.max(0, tomorrow.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
