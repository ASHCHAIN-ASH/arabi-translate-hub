import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  ChallengeAcademyService,
  DailyChallenge,
  ChallengeSubmission,
  StreakInfo,
  UserSummary,
  Achievement,
  UserAchievement,
  LeaderboardEntry,
} from '@/utils/challengeAcademyService';

export const useChallengeAcademy = (userId?: string) => {
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const ch = await ChallengeAcademyService.getTodayChallenges();
      const ids = ch.map(c => c.id);
      const [s, st, sub, ach, uach] = await Promise.all([
        ChallengeAcademyService.getUserSummary(userId),
        ChallengeAcademyService.getStreak(userId),
        ChallengeAcademyService.getUserSubmissions(userId, ids),
        ChallengeAcademyService.getAchievements(),
        ChallengeAcademyService.getUserAchievements(userId),
      ]);
      setSummary(s); setStreak(st); setChallenges(ch);
      setSubmissions(sub); setAchievements(ach); setUserAchievements(uach);
    } catch (e) {
      console.error('challenge academy refresh', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`challenge-${userId}-${Math.random().toString(36).slice(2, 9)}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'challenge_user_xp', filter: `user_id=eq.${userId}` },
        () => refresh())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'challenge_streaks', filter: `user_id=eq.${userId}` },
        () => refresh())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'challenge_user_achievements', filter: `user_id=eq.${userId}` },
        () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, refresh]);

  return {
    summary, streak, challenges, submissions,
    achievements, userAchievements, loading, refresh,
  };
};

export const useLeaderboard = (period: 'weekly' | 'monthly' | 'all') => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await ChallengeAcademyService.getLeaderboard(period);
      setEntries(data);
    } finally { setLoading(false); }
  }, [period]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const ch = supabase
      .channel(`leaderboard-${period}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenge_user_xp' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [period, refresh]);

  return { entries, loading, refresh };
};
