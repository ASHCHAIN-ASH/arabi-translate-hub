import { supabase } from '@/integrations/supabase/client';

export interface XpLevel {
  level: number;
  name_ar: string;
  required_xp_total: number;
  badge_color: string | null;
  icon: string | null;
  reward_type: string | null;
  reward_payload: any;
}

export interface XpSummary {
  total_xp: number;
  lifetime_xp: number;
  current_level: number;
  xp_to_next_level: number;
  current_level_info: XpLevel | null;
  next_level_info: XpLevel | null;
  progress_percent: number;
}

export interface XpTransaction {
  id: string;
  amount: number;
  source_type: string;
  source_id: string | null;
  description: string | null;
  balance_after: number;
  metadata: any;
  created_at: string;
}

export interface XpRewardClaim {
  id: string;
  level: number;
  reward_type: string | null;
  reward_payload: any;
  claimed_at: string;
}

const SOURCE_LABELS: Record<string, string> = {
  signup: 'تسجيل حساب',
  daily_challenge: 'تحدّي يومي',
  challenge_complete: 'إكمال تحدّي',
  challenge_perfect: 'تحدّي مثالي',
  assessment_complete: 'اختبار مستوى',
  assessment_share: 'مشاركة نتيجة',
  referral_signup: 'إحالة جديدة',
  referral_active: 'نشاط إحالة',
  share: 'مشاركة',
  manual_admin: 'تعديل إداري',
  achievement: 'إنجاز',
};

export class XpEconomyService {
  static labelSource(s: string): string {
    return SOURCE_LABELS[s] || s;
  }

  static async getSummary(userId?: string): Promise<XpSummary | null> {
    const { data, error } = await (supabase as any).rpc('get_user_xp_summary', {
      p_user_id: userId ?? null,
    });
    if (error) { console.error('xp summary error', error); return null; }
    if (!data || data.error) return null;
    return data as XpSummary;
  }

  static async getTransactions(userId: string, limit = 25): Promise<XpTransaction[]> {
    const { data, error } = await (supabase as any)
      .from('xp_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) { console.error('xp tx error', error); return []; }
    return (data || []) as XpTransaction[];
  }

  static async getLevels(): Promise<XpLevel[]> {
    const { data, error } = await (supabase as any)
      .from('xp_levels')
      .select('*')
      .order('level', { ascending: true });
    if (error) return [];
    return (data || []) as XpLevel[];
  }

  static async getMyClaims(userId: string): Promise<XpRewardClaim[]> {
    const { data } = await (supabase as any)
      .from('xp_rewards_claims')
      .select('*')
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false });
    return (data || []) as XpRewardClaim[];
  }

  static async claimReward(level: number) {
    const { data, error } = await (supabase as any).rpc('claim_xp_reward', { p_level: level });
    if (error) throw error;
    return data as { success: boolean; error?: string; level?: number; reward_type?: string; reward_payload?: any };
  }
}
