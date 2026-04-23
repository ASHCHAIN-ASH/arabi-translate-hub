import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/components/SimpleAuthProvider";
import {
  MarketingReferralService,
  MarketingReferralStats,
} from "@/utils/marketingReferralService";

/**
 * Mount once at the app root. Captures `?ref=xxx`, persists it,
 * and fires a click event (deduped per session).
 */
export function useReferralTracker() {
  const location = useLocation();

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const ref = params.get("ref");
      if (!ref) return;
      const code = ref.trim().toUpperCase();
      if (code.length < 4 || code.length > 16) return;
      MarketingReferralService.storeRef(code);
      // Fire a click event (deduped via sessionStorage inside the service)
      MarketingReferralService.trackClick(code);
    } catch {
      /* no-op */
    }
  }, [location.search]);
}

/**
 * Returns the current user's ref_code (creating it if missing) and stats.
 */
export function useMyMarketingReferral() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MarketingReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Ensure row exists
      await MarketingReferralService.getOrCreateMyRefCode(user.id);
      const s = await MarketingReferralService.getMyStats(user.id);
      setStats(s);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const shareUrl = stats?.ref_code
    ? MarketingReferralService.buildShareUrl(stats.ref_code)
    : "";

  return {
    code: stats?.ref_code ?? null,
    shareUrl,
    stats,
    loading,
    refresh,
  };
}

/**
 * Convenience hook: call `claim()` after a successful signup
 * once the user's session is active.
 */
export function useClaimSignupReferral() {
  return useCallback(async (userId: string) => {
    return MarketingReferralService.claimSignupReferral(userId);
  }, []);
}

/**
 * Convenience hook: call `record(orderId?)` after a successful order.
 */
export function useRecordOrderReferral() {
  const { user } = useAuth();
  return useCallback(
    async (orderId?: string) => {
      if (!user) return false;
      return MarketingReferralService.recordOrderReferral(user.id, orderId);
    },
    [user],
  );
}
