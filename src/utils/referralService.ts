import { supabase } from '@/data/legacy/client';
import { buildPublicUrl } from '@/lib/publicUrl';

export interface MemberReferral {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  referral_code: string;
  membership_id: string | null;
  plan_id: string | null;
  status: 'pending' | 'rewarded' | 'cancelled';
  commission_amount: number;
  commission_paid_at: string | null;
  created_at: string;
  // joined
  referred_name?: string;
  referred_email?: string;
  plan_name?: string;
}

const REFERRAL_STORAGE_KEY = 'mep_pending_referral_code';

export const ReferralService = {
  // ===== Storage helpers (for capturing ?ref= before signup) =====
  storePendingCode(code: string) {
    try {
      localStorage.setItem(REFERRAL_STORAGE_KEY, code.toUpperCase());
    } catch {}
  },
  readPendingCode(): string | null {
    try {
      return localStorage.getItem(REFERRAL_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  clearPendingCode() {
    try {
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
    } catch {}
  },

  // ===== Lookup =====
  async getMyReferralCode(userId: string): Promise<string | null> {
    const { data } = await supabase
      .from('customers')
      .select('referral_code')
      .eq('user_id', userId)
      .maybeSingle();
    return (data as any)?.referral_code || null;
  },

  async resolveReferrer(code: string): Promise<{ user_id: string; name: string } | null> {
    if (!code) return null;
    const { data, error } = await supabase.rpc('get_referrer_by_code' as any, {
      _code: code.trim().toUpperCase(),
    });
    if (error || !data || (Array.isArray(data) && data.length === 0)) return null;
    const row: any = Array.isArray(data) ? data[0] : data;
    return { user_id: row.user_id, name: row.name };
  },

  // ===== Referrals list =====
  async listMyReferrals(userId: string): Promise<MemberReferral[]> {
    const { data, error } = await supabase
      .from('member_referrals' as any)
      .select('*')
      .eq('referrer_user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const rows = ((data as any) || []) as MemberReferral[];

    // enrich with referred customer name + plan name
    const userIds = Array.from(new Set(rows.map((r) => r.referred_user_id)));
    const planIds = Array.from(new Set(rows.map((r) => r.plan_id).filter(Boolean) as string[]));

    const [{ data: customers }, { data: plans }] = await Promise.all([
      userIds.length
        ? supabase.from('customers').select('user_id, name, email').in('user_id', userIds)
        : Promise.resolve({ data: [] as any[] } as any),
      planIds.length
        ? supabase.from('membership_plans' as any).select('id, name_ar').in('id', planIds)
        : Promise.resolve({ data: [] as any[] } as any),
    ]);

    const cMap = new Map<string, any>(((customers as any[]) || []).map((c: any) => [c.user_id, c]));
    const pMap = new Map<string, string>(((plans as any[]) || []).map((p: any) => [p.id, p.name_ar as string]));

    return rows.map((r) => ({
      ...r,
      referred_name: cMap.get(r.referred_user_id)?.name as string | undefined,
      referred_email: cMap.get(r.referred_user_id)?.email as string | undefined,
      plan_name: r.plan_id ? pMap.get(r.plan_id) : undefined,
    }));
  },

  async getStats(userId: string) {
    const list = await ReferralService.listMyReferrals(userId);
    const totalEarned = list
      .filter((r) => r.status === 'rewarded')
      .reduce((sum, r) => sum + Number(r.commission_amount || 0), 0);
    const pendingCount = list.filter((r) => r.status === 'pending').length;
    const rewardedCount = list.filter((r) => r.status === 'rewarded').length;
    return {
      total: list.length,
      pending: pendingCount,
      rewarded: rewardedCount,
      totalEarned,
    };
  },

  // ===== Admin =====
  async listAllReferrals(): Promise<MemberReferral[]> {
    const { data, error } = await supabase
      .from('member_referrals' as any)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ((data as any) || []) as MemberReferral[];
  },

  buildShareUrl(code: string): string {
    // Always use canonical public origin — never preview/iframe domains
    return buildPublicUrl(`/register?ref=${code}`);
  },

  /**
   * Consume any pending referral code captured before signup.
   * Must be called AFTER the user is fully authenticated (session active),
   * so that the SECURITY DEFINER `claim_referral` RPC can attach the new
   * user as the referred party of the referrer's pending referral row.
   */
  async claimPendingReferralIfAny(): Promise<void> {
    const code = ReferralService.readPendingCode();
    if (!code) return;
    try {
      const { data, error } = await supabase.rpc('claim_referral' as any, {
        _ref_code: code,
      });
      if (error) {
        // Keep the code so a later retry can succeed (e.g., session not ready)
        console.warn('[referral] claim_referral failed:', error.message);
        return;
      }
      const ok = (data as any)?.success !== false;
      if (ok) {
        ReferralService.clearPendingCode();
      }
    } catch (e) {
      console.warn('[referral] claim_referral threw:', e);
    }
  },
};
