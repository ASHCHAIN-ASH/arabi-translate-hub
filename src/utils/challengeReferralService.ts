/**
 * Challenge Academy — Referral Service (XP-only, separate from membership referrals)
 */
import { supabase } from '@/integrations/supabase/client';

const PENDING_KEY = 'mep_challenge_ref_code';
const PENDING_EXPIRY_KEY = 'mep_challenge_ref_expiry';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export interface ChallengeReferral {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'invalid';
  created_at: string;
  completed_at: string | null;
  referred_name?: string;
}

export interface ReferralReward {
  id: string;
  user_id: string;
  referral_id: string | null;
  reward_type: 'signup_bonus_referrer' | 'signup_bonus_referred' | 'challenge_bonus' | 'viral_share';
  xp_amount: number;
  created_at: string;
}

export interface ReferralStats {
  total: number;
  pending: number;
  completed: number;
  totalXp: number;
}

export const ChallengeReferralService = {
  // ── Pending code (?ref=) — 7-day localStorage ───────────────
  storePendingCode(code: string) {
    try {
      const clean = code.trim().toUpperCase();
      if (!clean) return;
      localStorage.setItem(PENDING_KEY, clean);
      localStorage.setItem(PENDING_EXPIRY_KEY, String(Date.now() + SEVEN_DAYS));
    } catch {}
  },
  readPendingCode(): string | null {
    try {
      const expiry = Number(localStorage.getItem(PENDING_EXPIRY_KEY) || 0);
      if (!expiry || Date.now() > expiry) {
        this.clearPendingCode();
        return null;
      }
      return localStorage.getItem(PENDING_KEY);
    } catch {
      return null;
    }
  },
  clearPendingCode() {
    try {
      localStorage.removeItem(PENDING_KEY);
      localStorage.removeItem(PENDING_EXPIRY_KEY);
    } catch {}
  },

  // ── Track click for analytics ───────────────────────────────
  async trackClick(refCode: string) {
    if (!refCode) return;
    try {
      await supabase.from('referral_events').insert({
        ref_code: refCode.trim().toUpperCase(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 255) : null,
      });
    } catch {/* fire-and-forget */}
  },

  // ── Get/create my referral code ─────────────────────────────
  async getOrCreateMyCode(userId: string): Promise<string | null> {
    if (!userId) return null;
    const { data } = await supabase
      .from('user_referral_codes')
      .select('code')
      .eq('user_id', userId)
      .maybeSingle();
    if (data?.code) return data.code;

    const { data: created, error } = await supabase.rpc('ensure_referral_code', { _user_id: userId });
    if (error) return null;
    return (created as unknown as string) || null;
  },

  // ── Claim a pending referral after signup/login ─────────────
  async claimPendingIfAny(): Promise<{ claimed: boolean; alreadyClaimed?: boolean; xp?: number }> {
    const code = this.readPendingCode();
    if (!code) return { claimed: false };
    const { data, error } = await supabase.rpc('claim_referral', { _ref_code: code });
    this.clearPendingCode();
    if (error) return { claimed: false };
    const res = data as any;
    if (res?.success) {
      return {
        claimed: true,
        alreadyClaimed: !!res.already_claimed,
        xp: res.referred_xp ?? 0,
      };
    }
    return { claimed: false };
  },

  // ── Reward viral share (server rate-limits to 1/day) ────────
  async rewardViralShare(): Promise<{ xp: number; alreadyToday: boolean }> {
    const { data, error } = await supabase.rpc('reward_viral_share');
    if (error) return { xp: 0, alreadyToday: false };
    const r = data as any;
    return { xp: r?.xp || 0, alreadyToday: !!r?.already_rewarded_today };
  },

  // ── Lists ───────────────────────────────────────────────────
  async listMyReferrals(userId: string): Promise<ChallengeReferral[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    const rows = (data || []) as ChallengeReferral[];

    // enrich names
    const ids = Array.from(new Set(rows.map((r) => r.referred_user_id)));
    if (ids.length) {
      const { data: cust } = await supabase
        .from('customers')
        .select('user_id, name')
        .in('user_id', ids);
      const map = new Map<string, string>(((cust as any[]) || []).map((c) => [c.user_id, c.name]));
      return rows.map((r) => ({ ...r, referred_name: map.get(r.referred_user_id) }));
    }
    return rows;
  },

  async getStats(userId: string): Promise<ReferralStats> {
    const list = await this.listMyReferrals(userId);
    const { data: rewards } = await supabase
      .from('referral_rewards')
      .select('xp_amount')
      .eq('user_id', userId);
    const totalXp = ((rewards as any[]) || []).reduce((s, r) => s + (r.xp_amount || 0), 0);
    return {
      total: list.length,
      pending: list.filter((r) => r.status === 'pending').length,
      completed: list.filter((r) => r.status === 'completed').length,
      totalXp,
    };
  },

  // ── URL builder ─────────────────────────────────────────────
  buildShareUrl(code: string): string {
    return `https://masteredupath.com/?ref=${code}`;
  },

  buildChallengeShareUrl(code: string): string {
    return `https://masteredupath.com/challenge-academy?ref=${code}`;
  },
};
