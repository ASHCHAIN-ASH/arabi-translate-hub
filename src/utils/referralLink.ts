/**
 * Marketing referral link utilities.
 * Centralizes building share URLs and rendering caption templates
 * with the user's referral code.
 */

import { buildPublicUrl } from "@/lib/publicUrl";

/** Build a canonical share URL for the user's ref_code. */
export function buildReferralLink(refCode: string | null | undefined): string {
  if (!refCode) return buildPublicUrl("/");
  return buildPublicUrl(`/?ref=${encodeURIComponent(refCode.trim().toUpperCase())}`);
}

/**
 * Render a caption template, replacing referral-link placeholders with
 * the actual share URL. Supports the following placeholders:
 *   {ref_link}   {{ref_link}}
 *   {ref_url}    {{ref_url}}
 * If the template has no placeholder, the link is appended on a new line.
 * If the template is empty, the link itself is returned.
 */
export function renderCaption(
  template: string | null | undefined,
  shareUrl: string,
): string {
  const base = (template ?? "").trim();
  if (!base) return shareUrl;

  const placeholders = ["{{ref_link}}", "{ref_link}", "{{ref_url}}", "{ref_url}"];
  let out = base;
  let replaced = false;
  for (const p of placeholders) {
    if (out.includes(p)) {
      out = out.split(p).join(shareUrl);
      replaced = true;
    }
  }
  return replaced ? out : `${out}\n\n${shareUrl}`;
}

/**
 * Copy text to clipboard with a graceful fallback for older browsers
 * and insecure contexts. Returns true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
