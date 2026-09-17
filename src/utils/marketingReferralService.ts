import { supabase } from "@/integrations/supabase/client";
import { buildReferralLink } from "@/utils/referralLink";

const REF_KEY = "mep_marketing_ref";
const REF_CLICK_FIRED_KEY = "mep_marketing_ref_clicked";
const COOKIE_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  try {
    const exp = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
  } catch {}
}

function getCookie(name: string): string | null {
  try {
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

function delCookie(name: string) {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  } catch {}
}

export const MarketingReferralService = {
  // ---------- Storage ----------
  storeRef(code: string) {
    const c = code.trim().toUpperCase();
    if (!c) return;
    try { localStorage.setItem(REF_KEY, c); } catch {}
    setCookie(REF_KEY, c, COOKIE_DAYS);
  },

  readRef(): string | null {
    let v: string | null = null;
    try { v = localStorage.getItem(REF_KEY); } catch {}
    if (!v) v = getCookie(REF_KEY);
    return v ? v.toUpperCase() : null;
  },

  clearRef() {
    try { localStorage.removeItem(REF_KEY); } catch {}
    try { sessionStorage.removeItem(REF_CLICK_FIRED_KEY); } catch {}
    delCookie(REF_KEY);
  },

  // ---------- Click tracking ----------
  async trackClick(refCode: string): Promise<void> {
    const code = refCode.trim().toUpperCase();
    if (!code) return;
    // Fire only once per session per code
    const sessionKey = `${REF_CLICK_FIRED_KEY}:${code}`;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");
    } catch {}
    try {
      await supabase.functions.invoke("track-referral-click", {
        body: { ref_code: code },
      });
    } catch (e) {
      console.warn("[referral] trackClick failed:", e);
    }
  },

  // ---------- ref_code per user ----------
  /** Get my ref_code, creating the user_referrals row if missing. */
  async getOrCreateMyRefCode(userId: string): Promise<string | null> {
    const { data: existing, error: selErr } = await (supabase as any)
      .from("user_referrals")
      .select("ref_code")
      .eq("user_id", userId)
      .maybeSingle();

    if (!selErr && existing?.ref_code) return existing.ref_code as string;

    const { data: inserted, error: insErr } = await (supabase as any)
      .from("user_referrals")
      .insert({ user_id: userId })
      .select("ref_code")
      .single();

    if (insErr) {
      console.warn("[referral] create ref failed:", insErr.message);
      return null;
    }
    return (inserted?.ref_code as string) ?? null;
  },

  async getMyStats(userId: string) {
    const { data } = await supabase
      .from("user_referrals" as any)
      .select("ref_code, total_clicks, total_signups, total_orders, created_at")
      .eq("user_id", userId)
      .maybeSingle();
    return (data as any) || null;
  },

  buildShareUrl(refCode: string): string {
    // Always use the canonical public domain (e.g. fekrahedu.com),
    // never the preview/iframe origin like *.lovableproject.com.
    return buildReferralLink(refCode);
  },

  // ---------- Conversions ----------
  /**
   * Call AFTER the user signs up & is authenticated.
   * Records a `signup` conversion against any pending ref code.
   */
  async claimSignupReferral(newUserId: string): Promise<boolean> {
    const code = MarketingReferralService.readRef();
    if (!code) return false;
    try {
      const { error } = await supabase
        .from("referral_conversions" as any)
        .insert({
          ref_code: code,
          user_id: newUserId,
          type: "signup",
        } as any);

      if (error) {
        // Ignore unique-violation (already claimed); keep code for future order
        if (!/duplicate|unique/i.test(error.message)) {
          console.warn("[referral] signup conversion failed:", error.message);
        }
        return false;
      }
      return true;
    } catch (e) {
      console.warn("[referral] signup conversion threw:", e);
      return false;
    }
  },

  /**
   * Record an order conversion. Safe to call multiple times — DB unique
   * constraint on (ref_code, user_id, type='order') would dedupe per order
   * pair, but we still pass order_id so admins can audit. We do NOT clear
   * the stored ref after order — same referrer can drive repeat orders
   * within the cookie window.
   */
  async recordOrderReferral(userId: string, orderId?: string): Promise<boolean> {
    const code = MarketingReferralService.readRef();
    if (!code) return false;
    try {
      const { error } = await supabase
        .from("referral_conversions" as any)
        .insert({
          ref_code: code,
          user_id: userId,
          order_id: orderId ?? null,
          type: "order",
        } as any);
      if (error) {
        if (!/duplicate|unique/i.test(error.message)) {
          console.warn("[referral] order conversion failed:", error.message);
        }
        return false;
      }
      return true;
    } catch (e) {
      console.warn("[referral] order conversion threw:", e);
      return false;
    }
  },
};

export type MarketingReferralStats = {
  ref_code: string;
  total_clicks: number;
  total_signups: number;
  total_orders: number;
  created_at: string;
};
