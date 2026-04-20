import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Zap, Trophy, TrendingUp, Sparkles } from 'lucide-react';
import { UserSummary, StreakInfo } from '@/utils/challengeAcademyService';
import { cn } from '@/lib/utils';

interface Props {
  summary: UserSummary | null;
  streak: StreakInfo | null;
}

export const StatsHeader: React.FC<Props> = ({ summary, streak }) => {
  const total = summary?.total_xp ?? 0;
  const lvl = summary?.current_level;
  const next = summary?.next_level;
  const progress = summary?.progress_percent ?? 0;
  const cur = streak?.current_streak ?? 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-1">
      <div className="rounded-[14px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-5 sm:p-7 text-white relative">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30"
              >
                <Trophy className="w-7 h-7" />
              </motion.div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black">أكاديمية التحدي</h2>
                <p className="text-xs sm:text-sm text-white/80">تحدَّ نفسك يومياً واصعد القمة 🚀</p>
              </div>
            </div>

            <Badge className="bg-emerald-500/90 text-white border-0 shadow-lg gap-1.5 py-1.5 px-3">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              مباشر
            </Badge>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            <StatChip icon={Zap} label="نقاط XP" value={total.toLocaleString('ar-SA')} accent="from-yellow-400 to-orange-400" />
            <StatChip icon={Sparkles} label="المستوى" value={lvl?.name_ar || 'مبتدئ'} accent="from-cyan-400 to-blue-400" />
            <StatChip icon={Flame} label="السلسلة" value={`${cur} يوم`} accent="from-red-400 to-pink-400" pulse={cur > 0} />
            <StatChip icon={TrendingUp} label="الترتيب" value={lvl?.badge_label || 'طالب'} accent="from-emerald-400 to-teal-400" />
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold">
                {lvl?.name_ar || 'مبتدئ'} {next && `← ${next.name_ar}`}
              </span>
              <span className="text-white/90 font-semibold">
                {next ? `${summary?.xp_to_next} XP للترقية` : 'وصلت لأعلى مستوى! 👑'}
              </span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-yellow-300 via-pink-300 to-white shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatChip: React.FC<{ icon: any; label: string; value: string; accent: string; pulse?: boolean }> =
  ({ icon: Icon, label, value, accent, pulse }) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.02 }}
    className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20"
  >
    <div className="flex items-center gap-2">
      <div className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', accent, pulse && 'animate-pulse')}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-white/80 font-semibold">{label}</p>
        <p className="text-sm font-black truncate">{value}</p>
      </div>
    </div>
  </motion.div>
);
