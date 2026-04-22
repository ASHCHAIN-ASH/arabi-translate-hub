import { supabase } from '@/integrations/supabase/client';

export type BattleQuizMode = 'daily' | 'sprint' | 'ranked' | 'practice';
export type BattleQuizDifficulty = 'easy' | 'medium' | 'hard';

export interface BattleQuizRoom {
  id: string;
  title: string;
  description: string | null;
  mode: BattleQuizMode;
  category: string;
  status: string;
  cover_emoji: string | null;
  question_count: number;
  time_limit_per_question: number;
  xp_per_correct: number;
  xp_completion_bonus: number;
  is_reward_eligible: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

export interface BattleQuizChoice {
  id: string;
  choice_text: string;
}

export interface BattleQuizQuestion {
  id: string;
  question_text: string;
  difficulty: BattleQuizDifficulty;
  anti_cheat_type: string;
  time_limit_seconds: number;
  ord: number;
  choices: BattleQuizChoice[];
}

export interface BattleQuizStartPayload {
  attempt_id: string;
  room: {
    id: string;
    title: string;
    mode: BattleQuizMode;
    time_limit_per_question: number;
    question_count: number;
  };
  questions: BattleQuizQuestion[];
}

export interface BattleQuizSubmitResult {
  is_correct: boolean;
  awarded_points: number;
  correct_choice_id: string | null;
}

export interface BattleQuizCompleteResult {
  status: 'completed' | 'flagged';
  score: number;
  correct_count: number;
  total_questions: number;
  total_time_ms: number;
  xp_earned: number;
  rank: number;
  is_perfect: boolean;
}

export interface BattleQuizLeaderboardRow {
  rank: number;
  user_id: string;
  total_score: number;
  total_correct: number;
  total_time_ms: number;
  display_name: string;
  avatar_url: string | null;
}

export class BattleQuizService {
  /** List active rooms (visible by RLS). */
  static async listRooms(): Promise<BattleQuizRoom[]> {
    const { data, error } = await (supabase as any)
      .from('battle_quiz_rooms')
      .select('*')
      .in('status', ['active', 'scheduled'])
      .order('created_at', { ascending: false });
    if (error) { console.error('listRooms', error); return []; }
    return (data || []) as BattleQuizRoom[];
  }

  static async getRoom(id: string): Promise<BattleQuizRoom | null> {
    const { data, error } = await (supabase as any)
      .from('battle_quiz_rooms').select('*').eq('id', id).maybeSingle();
    if (error) { console.error('getRoom', error); return null; }
    return data as BattleQuizRoom | null;
  }

  static async startAttempt(roomId: string): Promise<BattleQuizStartPayload | { error: string; attempt_id?: string }> {
    const { data, error } = await (supabase as any).rpc('start_battle_quiz_attempt', { p_room_id: roomId });
    if (error) { console.error('startAttempt', error); return { error: error.message }; }
    return data as any;
  }

  static async submitAnswer(
    attemptId: string, questionId: string, choiceId: string | null, responseTimeMs: number
  ): Promise<BattleQuizSubmitResult | { error: string }> {
    const { data, error } = await (supabase as any).rpc('submit_battle_quiz_answer', {
      p_attempt_id: attemptId,
      p_question_id: questionId,
      p_choice_id: choiceId,
      p_response_time_ms: Math.max(0, Math.round(responseTimeMs)),
    });
    if (error) { console.error('submitAnswer', error); return { error: error.message }; }
    return data as BattleQuizSubmitResult;
  }

  static async completeAttempt(attemptId: string): Promise<BattleQuizCompleteResult | { error: string }> {
    const { data, error } = await (supabase as any).rpc('complete_battle_quiz_attempt', { p_attempt_id: attemptId });
    if (error) { console.error('completeAttempt', error); return { error: error.message }; }
    return data as BattleQuizCompleteResult;
  }

  static async flagEvent(
    attemptId: string, flagType: string, riskScore: number, metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await (supabase as any).rpc('flag_battle_quiz_event', {
        p_attempt_id: attemptId,
        p_flag_type: flagType,
        p_risk_score: riskScore,
        p_metadata: metadata,
      });
    } catch (e) {
      console.warn('flagEvent failed (non-blocking)', e);
    }
  }

  static async getLeaderboard(roomId: string, limit = 50): Promise<BattleQuizLeaderboardRow[]> {
    const { data, error } = await (supabase as any).rpc('get_battle_quiz_leaderboard', {
      p_room_id: roomId, p_limit: limit,
    });
    if (error) { console.error('getLeaderboard', error); return []; }
    return (data || []) as BattleQuizLeaderboardRow[];
  }
}
