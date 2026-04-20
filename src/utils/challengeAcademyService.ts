import { supabase } from '@/integrations/supabase/client';

export interface ChallengeLevel {
  id: string;
  slug: string;
  name_ar: string;
  required_xp: number;
  badge_color: string | null;
  badge_label: string | null;
  icon: string | null;
  perks_json: any;
  sort_order: number;
}

export interface ChallengeUserXp {
  user_id: string;
  total_xp: number;
  lifetime_xp: number;
  weekly_xp: number;
  monthly_xp: number;
  current_level_id: string | null;
}

export interface DailyChallenge {
  id: string;
  challenge_date: string;
  type: 'quiz' | 'task';
  category: string | null;
  title_ar: string;
  description_ar: string | null;
  question_ar: string | null;
  options: string[];
  correct_answer: string | null;
  explanation_ar: string | null;
  action_type: string | null;
  action_target: string | null;
  xp_reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string | null;
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  answer: string | null;
  is_correct: boolean | null;
  xp_awarded: number;
  submitted_at: string;
}

export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_active_days: number;
}

export interface Achievement {
  id: string;
  slug: string;
  name_ar: string;
  description_ar: string | null;
  icon: string | null;
  badge_color: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria_type: string;
  criteria_value: number;
  xp_bonus: number;
}

export interface UserAchievement {
  id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  full_name: string;
  avatar_url: string | null;
  total_xp: number;
  weekly_xp: number;
  monthly_xp: number;
  level_name: string | null;
  level_color: string | null;
  level_icon: string | null;
  rank: number;
}

export interface UserSummary {
  total_xp: number;
  lifetime_xp: number;
  weekly_xp: number;
  monthly_xp: number;
  current_level: ChallengeLevel | null;
  next_level: ChallengeLevel | null;
  progress_percent: number;
  xp_to_next: number;
}

export class ChallengeAcademyService {
  static async getLevels(): Promise<ChallengeLevel[]> {
    const { data, error } = await (supabase as any)
      .from('challenge_levels')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return (data || []) as ChallengeLevel[];
  }

  static async getUserSummary(userId: string): Promise<UserSummary> {
    const [{ data: xp }, levels] = await Promise.all([
      (supabase as any).from('challenge_user_xp').select('*').eq('user_id', userId).maybeSingle(),
      this.getLevels(),
    ]);

    const total = xp?.total_xp ?? 0;
    let current: ChallengeLevel | null = null;
    let next: ChallengeLevel | null = null;
    for (const lvl of levels) {
      if (lvl.required_xp <= total) current = lvl;
      else { next = lvl; break; }
    }
    const base = current?.required_xp ?? 0;
    const target = next?.required_xp ?? base;
    const span = Math.max(1, target - base);
    const within = Math.max(0, total - base);
    const progress = next ? Math.min(100, Math.round((within / span) * 100)) : 100;

    return {
      total_xp: total,
      lifetime_xp: xp?.lifetime_xp ?? 0,
      weekly_xp: xp?.weekly_xp ?? 0,
      monthly_xp: xp?.monthly_xp ?? 0,
      current_level: current,
      next_level: next,
      progress_percent: progress,
      xp_to_next: next ? Math.max(0, target - total) : 0,
    };
  }

  static async getStreak(userId: string): Promise<StreakInfo> {
    const { data } = await (supabase as any)
      .from('challenge_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    return {
      current_streak: data?.current_streak ?? 0,
      longest_streak: data?.longest_streak ?? 0,
      last_activity_date: data?.last_activity_date ?? null,
      total_active_days: data?.total_active_days ?? 0,
    };
  }

  static async getTodayChallenges(): Promise<DailyChallenge[]> {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await (supabase as any)
      .from('challenge_daily_challenges')
      .select('*')
      .eq('challenge_date', today)
      .eq('is_active', true)
      .order('created_at');
    if (error) throw error;
    return (data || []) as DailyChallenge[];
  }

  static async getUserSubmissions(userId: string, challengeIds: string[]): Promise<ChallengeSubmission[]> {
    if (!challengeIds.length) return [];
    const { data, error } = await (supabase as any)
      .from('challenge_submissions')
      .select('*')
      .eq('user_id', userId)
      .in('challenge_id', challengeIds);
    if (error) throw error;
    return (data || []) as ChallengeSubmission[];
  }

  static async submitChallenge(userId: string, challengeId: string, answer: string) {
    const { data, error } = await (supabase as any).rpc('challenge_submit', {
      p_user_id: userId,
      p_challenge_id: challengeId,
      p_answer: answer,
    });
    if (error) throw error;
    return data as {
      success: boolean;
      error?: string;
      is_correct?: boolean;
      xp_awarded?: number;
      total_xp?: number;
      current_streak?: number;
      explanation?: string;
      correct_answer?: string;
    };
  }

  static async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await (supabase as any)
      .from('challenge_achievements')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return (data || []) as Achievement[];
  }

  static async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await (supabase as any)
      .from('challenge_user_achievements')
      .select('*, achievement:challenge_achievements(*)')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });
    if (error) throw error;
    return (data || []) as UserAchievement[];
  }

  static async getLeaderboard(period: 'weekly' | 'monthly' | 'all', limit = 50): Promise<LeaderboardEntry[]> {
    const orderCol = period === 'weekly' ? 'weekly_xp' : period === 'monthly' ? 'monthly_xp' : 'total_xp';
    const { data, error } = await (supabase as any)
      .from('challenge_user_xp')
      .select('user_id, total_xp, weekly_xp, monthly_xp, current_level_id, level:challenge_levels(name_ar, badge_color)')
      .order(orderCol, { ascending: false })
      .limit(limit);
    if (error) throw error;

    const userIds = (data || []).map((r: any) => r.user_id);
    const profiles: Record<string, string> = {};
    if (userIds.length) {
      const { data: profs } = await (supabase as any)
        .from('profiles').select('user_id, full_name').in('user_id', userIds);
      (profs || []).forEach((p: any) => { profiles[p.user_id] = p.full_name; });
    }

    return (data || []).map((row: any, idx: number) => {
      const fullName = profiles[row.user_id] || 'طالب';
      const parts = fullName.split(' ');
      const masked = parts.length > 1
        ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}***`
        : `${fullName.slice(0, 3)}***`;
      return {
        user_id: row.user_id,
        display_name: masked,
        total_xp: row.total_xp,
        weekly_xp: row.weekly_xp,
        monthly_xp: row.monthly_xp,
        level_name: row.level?.name_ar || null,
        level_color: row.level?.badge_color || null,
        rank: idx + 1,
      } as LeaderboardEntry;
    });
  }

  static async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    const [achievements, summary, streak, subs, userAch] = await Promise.all([
      this.getAchievements(),
      this.getUserSummary(userId),
      this.getStreak(userId),
      (supabase as any).from('challenge_submissions').select('is_correct').eq('user_id', userId),
      this.getUserAchievements(userId),
    ]);

    const ownedIds = new Set(userAch.map(u => u.achievement_id));
    const correctCount = (subs.data || []).filter((s: any) => s.is_correct).length;
    const totalSubs = (subs.data || []).length;
    const newly: Achievement[] = [];

    for (const ach of achievements) {
      if (ownedIds.has(ach.id)) continue;
      let val = 0;
      switch (ach.criteria_type) {
        case 'submissions': val = totalSubs; break;
        case 'correct_answers': val = correctCount; break;
        case 'streak': val = streak.current_streak; break;
        case 'lifetime_xp': val = summary.lifetime_xp; break;
      }
      if (val >= ach.criteria_value) {
        const { error } = await (supabase as any)
          .from('challenge_user_achievements')
          .insert({ user_id: userId, achievement_id: ach.id, progress: val });
        if (!error) {
          newly.push(ach);
          if (ach.xp_bonus > 0) {
            await (supabase as any).rpc('challenge_award_xp', {
              p_user_id: userId, p_xp: ach.xp_bonus,
              p_source: 'achievement', p_source_id: ach.id,
              p_description: `إنجاز: ${ach.name_ar}`,
            });
          }
        }
      }
    }
    return newly;
  }
}
