import { useCallback, useEffect, useState } from 'react';
import {
  DailyChallengeService,
  DailyChallengeFull,
  AttemptHistoryRow,
} from '@/utils/dailyChallengeService';

export const useDailyChallenge = (userId?: string) => {
  const [challenge, setChallenge] = useState<DailyChallengeFull | null>(null);
  const [attempts, setAttempts] = useState<AttemptHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const ch = await DailyChallengeService.getTodayChallenge();
      setChallenge(ch);
      if (ch && userId) {
        const att = await DailyChallengeService.getUserAttempts(userId, ch.id);
        setAttempts(att);
      } else {
        setAttempts([]);
      }
    } catch (e) {
      console.error('useDailyChallenge', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const bestAttempt = attempts.find(a => a.status === 'completed') ?? null;
  const completedToday = attempts.some(a => a.status === 'completed');

  return { challenge, attempts, bestAttempt, completedToday, loading, refresh };
};
