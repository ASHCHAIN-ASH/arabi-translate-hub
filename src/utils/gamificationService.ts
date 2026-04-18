import { supabase } from '@/integrations/supabase/client';

export interface GamificationLevel {
  id: string;
  slug: string;
  name_ar: string;
  required_points: number;
  badge_color: string | null;
  badge_label: string | null;
  icon: string | null;
  perks_json: any;
  sort_order: number;
}

export interface UserPointsSummary {
  user_id: string;
  total_points: number;
  lifetime_earned: number;
  lifetime_spent: number;
  current_level: GamificationLevel | null;
  next_level: GamificationLevel | null;
  points_to_next: number;
  progress_percent: number;
}

export interface PointTransaction {
  id: string;
  points: number;
  type: string;
  source_type: string;
  description: string | null;
  multiplier: number;
  base_points: number | null;
  balance_after: number | null;
  created_at: string;
}

export interface GamificationReward {
  id: string;
  title_ar: string;
  description_ar: string | null;
  type: string;
  cost_points: number;
  value: number;
  icon: string | null;
  badge_color: string | null;
  level_required_id: string | null;
  is_active: boolean;
  total_stock: number | null;
  total_redeemed: number;
}

export interface UserReward {
  id: string;
  reward_id: string;
  status: string;
  awarded_at: string;
  used_at: string | null;
  expires_at: string | null;
  reward?: GamificationReward;
}

export class GamificationService {
  static async getLevels(): Promise<GamificationLevel[]> {
    const { data, error } = await (supabase as any)
      .from('gamification_levels')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data || []) as GamificationLevel[];
  }

  static async getUserSummary(userId: string): Promise<UserPointsSummary> {
    // Ensure row exists
    const { data: pts } = await (supabase as any)
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const total = pts?.total_points ?? 0;
    const levels = await this.getLevels();

    let current: GamificationLevel | null = null;
    let next: GamificationLevel | null = null;
    for (const lvl of levels) {
      if (lvl.required_points <= total) current = lvl;
      else { next = lvl; break; }
    }

    const base = current?.required_points ?? 0;
    const target = next?.required_points ?? base;
    const span = Math.max(1, target - base);
    const within = Math.max(0, total - base);
    const progress = next ? Math.min(100, Math.round((within / span) * 100)) : 100;
    const pointsToNext = next ? Math.max(0, target - total) : 0;

    return {
      user_id: userId,
      total_points: total,
      lifetime_earned: pts?.lifetime_earned ?? 0,
      lifetime_spent: pts?.lifetime_spent ?? 0,
      current_level: current,
      next_level: next,
      points_to_next: pointsToNext,
      progress_percent: progress,
    };
  }

  static async getTransactions(userId: string, limit = 25): Promise<PointTransaction[]> {
    const { data, error } = await (supabase as any)
      .from('point_transactions')
      .select('id, points, type, source_type, description, multiplier, base_points, balance_after, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as PointTransaction[];
  }

  static async getRewards(): Promise<GamificationReward[]> {
    const { data, error } = await (supabase as any)
      .from('gamification_rewards')
      .select('*')
      .eq('is_active', true)
      .order('cost_points', { ascending: true });
    if (error) throw error;
    return (data || []) as GamificationReward[];
  }

  static async getUserRewards(userId: string): Promise<UserReward[]> {
    const { data, error } = await (supabase as any)
      .from('user_rewards')
      .select('*, reward:gamification_rewards(*)')
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false });
    if (error) throw error;
    return (data || []) as UserReward[];
  }

  static translateSource(src: string): string {
    const map: Record<string, string> = {
      signup: 'تسجيل حساب',
      first_order: 'أول طلب',
      order_completed: 'إكمال طلب',
      invoice_payment: 'دفع فاتورة',
      referral: 'إحالة ناجحة',
      membership_activated: 'تفعيل عضوية',
      manual_admin: 'تعديل إداري',
      reward_redeemed: 'استبدال مكافأة',
    };
    return map[src] || src;
  }
}
