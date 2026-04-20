import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Flame, Trophy, ChevronLeft, X, AlertTriangle, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { ChallengeAcademyService } from '@/utils/challengeAcademyService';
import { supabase } from '@/integrations/supabase/client';

const DISMISS_KEY = 'dashboard_challenge_notice_dismissed';

export const DashboardChallengeNotice: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<{
    completedToday: boolean;
    streak: number;
    longest: number;
    atRisk: boolean;
    xp: number;
    levelName: string;
    levelIcon: string;
    challengeTitle: string | null;
  } | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    // Don't show if dismissed today
    const dismissedDate = localStorage.getItem(DISMISS_KEY);
    const today = new Date().toISOString().slice(0, 10);
    if (dismissedDate === today) return;

    (async () => {
      try {
        const [summary, streak, todayChallenges] = await Promise.all([
          ChallengeAcademyService.getUserSummary(user.id),
          ChallengeAcademyService.getStreak(user.id),
          ChallengeAcademyService.getTodayChallenges(),
        ]);

        // Check if user submitted any challenge today
        const ids = todayChallenges.map(c => c.id);
        const subs = ids.length
          ? await ChallengeAcademyService.getUserSubmissions(user.id, ids)
          : [];
        const completedToday = subs.length > 0;

        // Streak at risk: had a streak, last activity was yesterday, none today
        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        const yestKey = yest.toISOString().slice(0, 10);
        const atRisk =
          streak.current_streak > 0 &&
          streak.last_activity_date === yestKey &&
          !completedToday;

        setData({
          completedToday,
          streak: streak.current_streak,
          longest: streak.longest_streak,
          atRisk,
          xp: summary.total_xp,
          levelName: summary.current_level?.name_ar ?? 'مبتدئ',
          levelIcon: summary.current_level?.icon ?? '⭐',
          challengeTitle: todayChallenges[0]?.title_ar ?? null,
        });
        setVisible(true);
      } catch {
        /* silent */
      }
    })();
  }, [user?.id]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString().slice(0, 10));
    setVisible(false);
  };

  if (!visible || !data) return null;

  // Variant: at-risk (URGENT) > pending challenge > completed (celebrate)
  const variant = data.atRisk
    ? 'risk'
    : data.completedToday
    ? 'done'
    : 'pending';

  const config = {
    risk: {
      gradient: 'from-amber-500 via-orange-600 to-red-600',
      icon: AlertTriangle,
      title: '⚠️ سلسلتك في خطر!',
      desc: `أكمل تحدي اليوم قبل منتصف الليل للحفاظ على ${data.streak} يوم متتالي 🔥`,
      cta: 'أنقذ سلسلتك الآن',
      pulse: true,
    },
    pending: {
      gradient: 'from-indigo-600 via-purple-600 to-fuchsia-600',
      icon: Zap,
      title: data.challengeTitle ? `🎯 ${data.challengeTitle}` : '🎯 تحدي اليوم بانتظارك!',
      desc: `اكسب نقاط XP وارتقِ بمستواك — لديك ${data.streak > 0 ? `سلسلة ${data.streak} يوم 🔥` : 'فرصة لبدء سلسلة جديدة'}`,
      cta: 'ابدأ التحدي',
      pulse: false,
    },
    done: {
      gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      icon: Sparkles,
      title: '🎉 أحسنت! أكملت تحدي اليوم',
      desc: `سلسلة ${data.streak} يوم • ${data.xp.toLocaleString('ar-SA')} XP • تابع للمستوى التالي`,
      cta: 'عرض إنجازاتك',
      pulse: false,
    },
  }[variant];

  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        key={variant}
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="relative overflow-hidden rounded-2xl text-white shadow-2xl"
        dir="rtl"
      >
        {/* Animated gradient bg */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

        {/* Pulsing glow for at-risk */}
        {config.pulse && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-red-500/40"
          />
        )}

        {/* Floating orbs */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-white/15 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
        />

        {/* Diagonal shimmer */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(45deg, transparent 25%, white 25%, white 26%, transparent 26%, transparent 75%, white 75%, white 76%, transparent 76%)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="إغلاق"
          className="absolute top-2.5 left-2.5 z-20 w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="relative z-10 p-4 sm:p-5">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Icon */}
            <motion.div
              animate={
                config.pulse
                  ? { scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }
                  : { rotate: [0, 5, -5, 0] }
              }
              transition={{ duration: config.pulse ? 1.2 : 4, repeat: Infinity }}
              className="shrink-0 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md ring-2 ring-white/30 flex items-center justify-center shadow-xl"
            >
              <Icon className="w-7 h-7" />
            </motion.div>

            {/* Text + stats */}
            <div className="flex-1 min-w-[220px]">
              <h3 className="font-black text-base sm:text-lg leading-tight">{config.title}</h3>
              <p className="text-white/90 text-xs sm:text-sm mt-1 font-medium">{config.desc}</p>

              {/* Mini stats */}
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white gap-1 text-[11px]">
                  <Zap className="w-3 h-3" /> {data.xp.toLocaleString('ar-SA')} XP
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white gap-1 text-[11px]">
                  <Trophy className="w-3 h-3" /> {data.levelIcon} {data.levelName}
                </Badge>
                {data.streak > 0 && (
                  <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white gap-1 text-[11px]">
                    <Flame className="w-3 h-3" /> {data.streak} يوم
                  </Badge>
                )}
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={() => navigate('/challenge-academy')}
              className="bg-white text-purple-700 hover:bg-white/95 font-black gap-1.5 shadow-xl rounded-xl px-4"
            >
              {config.cta}
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
