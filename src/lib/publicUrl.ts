/**
 * Returns the canonical public origin for shareable links.
 * Priority:
 *   1. VITE_PUBLIC_SITE_URL env var (set in production / .env.local)
 *   2. Current window.origin if it's a real production host
 *   3. Hardcoded production fallback (custom domain)
 *
 * This guarantees share links never leak preview/iframe domains
 * like *.lovableproject.com or *.lovable.app.
 */
const PRODUCTION_FALLBACK = 'https://masteredupath.com';

const PREVIEW_HOST_PATTERNS = [
  /lovableproject\.com$/i,
  /lovable\.app$/i,
  /^localhost$/i,
  /^127\.0\.0\.1$/,
  /^0\.0\.0\.0$/,
];

const isPreviewHost = (host: string): boolean =>
  PREVIEW_HOST_PATTERNS.some((re) => re.test(host));

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

export function getPublicOrigin(): string {
  // 1. Env var wins (build-time configurable)
  const envUrl = (import.meta as any)?.env?.VITE_PUBLIC_SITE_URL as string | undefined;
  if (envUrl && /^https?:\/\//i.test(envUrl)) {
    return stripTrailingSlash(envUrl);
  }

  // 2. Current origin if it's a real production host
  if (typeof window !== 'undefined' && window.location?.origin) {
    const host = window.location.hostname;
    if (host && !isPreviewHost(host)) {
      return stripTrailingSlash(window.location.origin);
    }
  }

  // 3. Fallback
  return PRODUCTION_FALLBACK;
}

export function buildPublicUrl(path: string): string {
  const origin = getPublicOrigin();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${p}`;
}
