import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Patterns of routes that should NEVER be indexed by search engines.
 * These mirror the X-Robots-Tag rules in public/_headers so even if
 * the host doesn't honor _headers, crawlers still see a noindex meta tag.
 */
const NOINDEX_PATTERNS: RegExp[] = [
  /^\/admin(\/|$)/i,
  /^\/adminmaster(\/|$)/i,
  /^\/client(\/|$)/i,
  /^\/client-services(\/|$)/i,
  /^\/platform(\/|$)/i,
  /^\/workspace(\/|$)/i,
  /^\/dashboard(\/|$)/i,
  /^\/auth(\/|$)/i,
  /^\/login$/i,
  /^\/register$/i,
  /^\/unauthorized$/i,
  /^\/orders(\/|$)/i,
  /^\/invoices(\/|$)/i,
  /^\/payment\/return$/i,
  /^\/verify(\/|$)/i,
  /^\/contract-management$/i,
  /^\/theme-preview$/i,
  /^\/color-showcase$/i,
  /^\/unsubscribe$/i,
  /^\/submit-order$/i,
];

const META_ID = "robots-noindex-runtime";
const GOOGLEBOT_ID = "googlebot-noindex-runtime";

const ensureMeta = (id: string, name: string, content: string) => {
  let tag = document.querySelector<HTMLMetaElement>(`meta#${id}`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.id = id;
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const removeMeta = (id: string) => {
  const tag = document.querySelector(`meta#${id}`);
  if (tag) tag.remove();
};

/**
 * RouteIndexingGuard
 * - Adds <meta name="robots" content="noindex, nofollow"> on protected routes
 * - Removes them on public routes so SEO meta from <SEO /> stays authoritative
 * - Complements server-side X-Robots-Tag headers in public/_headers
 */
const RouteIndexingGuard = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldNoIndex = NOINDEX_PATTERNS.some((re) => re.test(pathname));

    if (shouldNoIndex) {
      ensureMeta(META_ID, "robots", "noindex, nofollow, noarchive, nosnippet");
      ensureMeta(GOOGLEBOT_ID, "googlebot", "noindex, nofollow, noarchive, nosnippet");
    } else {
      removeMeta(META_ID);
      removeMeta(GOOGLEBOT_ID);
    }
  }, [pathname]);

  return null;
};

export default RouteIndexingGuard;
