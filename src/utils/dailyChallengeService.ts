import { supabase } from '@/integrations/supabase/client';

export interface DailyChallengeFull {
  id: string;
  title: string;
  description: string | null;
  challenge_date: string;
  duration_minutes: number;
  xp_per_correct: number;
  completion_bonus: number;
  perfect_bonus: number;
  cover_emoji: string | null;
  is_active: boolean;
  total_questions?: number;
}

export interface SanitizedQuestion {
  id: string;
  question: string;
  options: string[];
  sort_order: number;
}

export interface AttemptStartResult {
  success: boolean;
  error?: string;
  attempt_id?: string;
  attempt_number?: number;
  duration_minutes?: number;
  questions?: SanitizedQuestion[];
  total_questions?: number;
  is_retry?: boolean;
}

export interface QuestionResult {
  question_id: string;
  user_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
  explanation: string | null;
}

export interface AttemptSubmitResult {
  success: boolean;
  error?: string;
  score?: number;
  correct_count?: number;
  total_questions?: number;
  is_perfect?: boolean;
  xp_awarded?: number;
  total_xp?: number;
  current_streak?: number;
  attempt_number?: number;
  is_retry?: boolean;
  results?: QuestionResult[];
}

export interface AttemptHistoryRow {
  id: string;
  challenge_id: string;
  attempt_number: number;
  score: number;
  correct_count: number;
  total_questions: number;
  xp_awarded: number;
  is_perfect: boolean;
  time_taken_seconds: number | null;
  completed_at: string | null;
  status: string;
}

export class DailyChallengeService {
  static async getTodayChallenge(): Promise<DailyChallengeFull | null> {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await (supabase as any)
      .from('daily_challenges')
      .select('*')
      .eq('challenge_date', today)
      .eq('is_active', true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const { count } = await (supabase as any)
      .from('challenge_questions')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', data.id);
    return { ...data, total_questions: count ?? 0 } as DailyChallengeFull;
  }

  static async getUserAttempts(userId: string, challengeId: string): Promise<AttemptHistoryRow[]> {
    const { data, error } = await (supabase as any)
      .from('challenge_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .order('attempt_number', { ascending: false });
    if (error) throw error;
    return (data || []) as AttemptHistoryRow[];
  }

  static async startAttempt(userId: string, challengeId: string): Promise<AttemptStartResult> {
    const { data, error } = await (supabase as any).rpc('start_daily_challenge_attempt', {
      p_user_id: userId,
      p_challenge_id: challengeId,
    });
    if (error) throw error;
    return data as AttemptStartResult;
  }

  static async submitAttempt(
    userId: string,
    attemptId: string,
    answers: Record<string, string>,
    timeTakenSeconds: number,
  ): Promise<AttemptSubmitResult> {
    const { data, error } = await (supabase as any).rpc('submit_daily_challenge_attempt', {
      p_user_id: userId,
      p_attempt_id: attemptId,
      p_answers: answers,
      p_time_taken_seconds: timeTakenSeconds,
    });
    if (error) throw error;
    return data as AttemptSubmitResult;
  }
}
