import { supabase } from '@/integrations/supabase/client';

export type BQ1v1MatchStatus = 'active' | 'completed' | 'abandoned' | 'expired';

export interface BQ1v1Match {
  id: string;
  room_id: string;
  category: string;
  player_a_id: string;
  player_b_id: string;
  player_a_score: number;
  player_b_score: number;
  player_a_correct: number;
  player_b_correct: number;
  player_a_time_ms: number;
  player_b_time_ms: number;
  player_a_finished_at: string | null;
  player_b_finished_at: string | null;
  player_a_last_seen: string;
  player_b_last_seen: string;
  winner_id: string | null;
  status: BQ1v1MatchStatus;
  rating_delta: number;
  started_at: string;
  finalized_at: string | null;
}

export interface BQ1v1EnqueueResult {
  matched?: boolean;
  waiting?: boolean;
  match_id?: string;
  room_id?: string;
  opponent_id?: string;
  error?: string;
}

export interface BQ1v1LeaderboardRow {
  rank: number;
  user_id: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  matches_played: number;
  current_streak: number;
  best_streak: number;
  display_name: string;
  avatar_url: string | null;
}

export class BattleQuiz1v1Service {
  static async enqueue(category = 'general'): Promise<BQ1v1EnqueueResult> {
    const { data, error } = await (supabase as any).rpc('bq_1v1_enqueue', { p_category: category });
    if (error) { console.error('1v1 enqueue', error); return { error: error.message }; }
    return data as BQ1v1EnqueueResult;
  }

  static async cancelQueue(): Promise<void> {
    await (supabase as any).rpc('bq_1v1_cancel_queue');
  }

  static async submitScore(
    matchId: string,
    attemptId: string,
    score: number,
    correct: number,
    totalTimeMs: number,
  ): Promise<void> {
    await (supabase as any).rpc('bq_1v1_submit_score', {
      p_match_id: matchId,
      p_attempt_id: attemptId,
      p_score: score,
      p_correct: correct,
      p_total_time_ms: totalTimeMs,
    });
  }

  static async heartbeat(matchId: string): Promise<void> {
    await (supabase as any).rpc('bq_1v1_heartbeat', { p_match_id: matchId });
  }

  static async startAttempt(matchId: string): Promise<any> {
    const { data, error } = await (supabase as any).rpc('start_battle_quiz_1v1_attempt', { p_match_id: matchId });
    if (error) { console.error('startAttempt 1v1', error); return { error: error.message }; }
    return data;
  }

  static async finalize(matchId: string): Promise<any> {
    const { data } = await (supabase as any).rpc('bq_1v1_finalize', { p_match_id: matchId });
    return data;
  }

  static async getMatch(matchId: string): Promise<BQ1v1Match | null> {
    const { data, error } = await (supabase as any)
      .from('battle_quiz_1v1_matches').select('*').eq('id', matchId).maybeSingle();
    if (error) { console.error('getMatch', error); return null; }
    return data as BQ1v1Match | null;
  }

  static async getLeaderboard(limit = 50): Promise<BQ1v1LeaderboardRow[]> {
    const { data, error } = await (supabase as any).rpc('bq_1v1_get_leaderboard', { p_limit: limit });
    if (error) { console.error('1v1 leaderboard', error); return []; }
    return (data || []) as BQ1v1LeaderboardRow[];
  }

  static async getMyRating(userId: string): Promise<{ rating: number; wins: number; losses: number; draws: number; matches_played: number } | null> {
    const { data } = await (supabase as any)
      .from('battle_quiz_1v1_ratings').select('*').eq('user_id', userId).maybeSingle();
    return data;
  }

  /** Subscribe to my queue row to detect instant match. */
  static subscribeQueue(userId: string, onMatched: (matchId: string) => void) {
    const channel = supabase
      .channel(`bq1v1_queue_${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'battle_quiz_1v1_queue',
        filter: `user_id=eq.${userId}`,
      }, (payload: any) => {
        const row = payload.new;
        if (row?.status === 'matched' && row?.match_id) onMatched(row.match_id);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }

  /** Subscribe to a match to mirror opponent progress. */
  static subscribeMatch(matchId: string, onUpdate: (m: BQ1v1Match) => void) {
    const channel = supabase
      .channel(`bq1v1_match_${matchId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'battle_quiz_1v1_matches',
        filter: `id=eq.${matchId}`,
      }, (payload: any) => onUpdate(payload.new as BQ1v1Match))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }
}
