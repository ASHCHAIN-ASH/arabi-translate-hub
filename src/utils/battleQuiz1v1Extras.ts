import { supabase } from '@/integrations/supabase/client';

export type BQ1v1Mode = 'classic' | 'blitz';

export interface BQFriendInvite {
  invite_id: string;
  invite_code: string;
  expires_at: string;
}

export interface BQDailyMission {
  user_mission_id: string;
  mission_id: string;
  slug: string;
  title_ar: string;
  description_ar: string | null;
  icon: string;
  mission_type: string;
  scope: string;
  target_value: number;
  xp_reward: number;
  progress: number;
  is_completed: boolean;
  is_claimed: boolean;
}

export class BattleQuiz1v1Extras {
  // ---------- Friend invites ----------
  static async createFriendInvite(category = 'general', mode: BQ1v1Mode = 'classic'): Promise<BQFriendInvite | { error: string }> {
    const { data, error } = await (supabase as any).rpc('bq_1v1_create_friend_invite', {
      p_category: category, p_mode: mode,
    });
    if (error) { console.error('createFriendInvite', error); return { error: error.message }; }
    if ((data as any)?.error) return { error: (data as any).error };
    return data as BQFriendInvite;
  }

  static async acceptFriendInvite(code: string): Promise<{ match_id?: string; room_id?: string; opponent_id?: string; mode?: string; error?: string }> {
    const { data, error } = await (supabase as any).rpc('bq_1v1_accept_friend_invite', { p_invite_code: code });
    if (error) { console.error('acceptFriendInvite', error); return { error: error.message }; }
    return data || { error: 'unknown' };
  }

  // ---------- Rematch ----------
  static async requestRematch(matchId: string): Promise<{ match_id?: string; waiting?: boolean; already_requested?: boolean; already_exists?: boolean; created?: boolean; error?: string }> {
    const { data, error } = await (supabase as any).rpc('bq_1v1_request_rematch', { p_match_id: matchId });
    if (error) { console.error('requestRematch', error); return { error: error.message }; }
    return data || { error: 'unknown' };
  }

  /** Subscribe to a match for rematch creation by either side. */
  static subscribeRematchTrigger(matchId: string, onNewMatch: (newMatchId: string) => void) {
    const channel = supabase
      .channel(`bq1v1_rematch_${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'battle_quiz_1v1_matches',
        filter: `rematch_of_match_id=eq.${matchId}`,
      }, (payload: any) => {
        const row = payload.new;
        if (row?.id) onNewMatch(row.id);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }

  // ---------- Daily missions ----------
  static async getDailyMissions(): Promise<BQDailyMission[]> {
    const { data, error } = await (supabase as any).rpc('bq_get_daily_missions');
    if (error) { console.error('getDailyMissions', error); return []; }
    return (data || []) as BQDailyMission[];
  }

  static async claimMission(userMissionId: string): Promise<{ success?: boolean; xp_awarded?: number; error?: string }> {
    const { data, error } = await (supabase as any).rpc('bq_claim_daily_mission', { p_user_mission_id: userMissionId });
    if (error) { console.error('claimMission', error); return { error: error.message }; }
    return data || { error: 'unknown' };
  }
}

export const buildInviteUrl = (code: string) =>
  `${window.location.origin}/battle-quiz/1v1/invite/${code}`;
