import { useReferralTracker } from "@/hooks/useMarketingReferral";

/**
 * Invisible component — mount once inside <BrowserRouter> to capture
 * `?ref=xxx` from any URL and record a click.
 */
export default function ReferralTracker() {
  useReferralTracker();
  return null;
}
