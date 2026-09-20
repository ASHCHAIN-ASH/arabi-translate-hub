/**
 * يولّد public/sitemap.xml قبل التشغيل والبناء (predev / prebuild).
 * يشمل: كل الصفحات العامة + أقسام دليل المجلات + مقالات المدونة المنشورة.
 * لا يشمل: لوحات التحكم، الحسابات، الدفع، الصفحات الداخلية.
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://fekrahedu.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// ————— الصفحات العامة الثابتة —————
const core: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about-us", changefreq: "monthly", priority: "0.9" },
  { path: "/contact-us", changefreq: "monthly", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/services", changefreq: "weekly", priority: "0.95" },
  { path: "/research-services", changefreq: "weekly", priority: "0.95" },
  { path: "/translation-services", changefreq: "weekly", priority: "0.95" },
  { path: "/journals", changefreq: "weekly", priority: "0.95" },
  { path: "/blog", changefreq: "daily", priority: "0.9" },
  { path: "/pricing", changefreq: "weekly", priority: "0.9" },
  { path: "/order-now", changefreq: "weekly", priority: "0.9" },
  { path: "/order-tracking", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.8" },
  { path: "/universities", changefreq: "monthly", priority: "0.8" },
  { path: "/careers", changefreq: "monthly", priority: "0.6" },
  { path: "/client-guide", changefreq: "monthly", priority: "0.7" },
  { path: "/payment-methods", changefreq: "monthly", priority: "0.6" },
  { path: "/institutional-partnerships", changefreq: "monthly", priority: "0.7" },
  { path: "/license-request", changefreq: "monthly", priority: "0.6" },
  { path: "/academic-integrity", changefreq: "monthly", priority: "0.7" },
  { path: "/intellectual-property", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.4" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.4" },
  { path: "/spin-the-wheel", changefreq: "weekly", priority: "0.8" },
  { path: "/membership", changefreq: "monthly", priority: "0.8" },
  { path: "/fekrahedu-membership", changefreq: "monthly", priority: "0.8" },
  { path: "/fekrahedu-paylater", changefreq: "monthly", priority: "0.7" },
  { path: "/academic-competitions", changefreq: "weekly", priority: "0.8" },
  { path: "/study-to-earn", changefreq: "monthly", priority: "0.7" },
  { path: "/admission-services", changefreq: "monthly", priority: "0.85" },
];

const academic: SitemapEntry[] = [
  "/academic/expertise",
  "/academic/methodology",
  "/academic/quality",
  "/academic/security",
  "/academic/timeline",
  "/academic/translation",
  "/assessments",
].map((path) => ({ path, changefreq: "monthly", priority: "0.7" }));

const translation: SitemapEntry[] = [
  "/academic-translation",
  "/business-translation",
  "/instant-translation",
  "/legal-translation",
  "/literary-translation",
  "/media-translation",
  "/medical-translation",
  "/technical-translation",
  "/services/audio-translation",
  "/services/document-translation",
  "/services/text-translation",
  "/services/video-translation",
  "/services/website-translation",
  "/services/translation-services",
].map((path) => ({ path, changefreq: "monthly", priority: "0.85" }));

const servicesPages: SitemapEntry[] = [
  "/services/academic-writing",
  "/services/consultation-services",
  "/services/custom-services",
  "/services/editing-services",
  "/services/editing/academic-review",
  "/services/editing/developmental-editing",
  "/services/editing/final-proofreading",
  "/services/editing/language-proofreading",
  "/services/editing/style-review",
  "/services/editing/technical-editing",
  "/services/publishing-services",
  "/services/statistical-analysis",
].map((path) => ({ path, changefreq: "monthly", priority: "0.85" }));

const research: SitemapEntry[] = [
  "/research/academic",
  "/research/academic-consultation",
  "/research/academic-writing-service",
  "/research/admission-services",
  "/research/ai-methodology-review",
  "/research/annotated-publishing",
  "/research/assignment-execution",
  "/research/book-summarization",
  "/research/business",
  "/research/consultation-service",
  "/research/ebook-creation",
  "/research/formatting",
  "/research/global-peer-review",
  "/research/homework-assistance",
  "/research/journal-publication",
  "/research/journey",
  "/research/language-review",
  "/research/legal",
  "/research/medical",
  "/research/other-student-services",
  "/research/paper-review-service",
  "/research/plagiarism-check",
  "/research/powerpoint-service",
  "/research/proofreading-service",
  "/research/proposal-service",
  "/research/publication",
  "/research/references",
  "/research/references-provision",
  "/research/research-evaluation",
  "/research/research-plan",
  "/research/research-proposal",
  "/research/research-tools",
  "/research/scientific",
  "/research/services-hub",
  "/research/smart-editor",
  "/research/social",
  "/research/statistical-analysis",
  "/research/statistical-spss-service",
  "/research/theoretical-framework",
  "/research/thesis-titles",
  "/research/training-courses",
].map((path) => ({ path, changefreq: "monthly", priority: "0.85" }));

const journalCategories: SitemapEntry[] = [
  "medical-health",
  "engineering-technology",
  "education-humanities",
  "business-economics",
  "law-policy",
  "natural-sciences",
  "multidisciplinary",
].map((slug) => ({ path: `/journals/${slug}`, changefreq: "weekly", priority: "0.9" }));

async function fetchBlogPosts(): Promise<SitemapEntry[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=slug,published_at,updated_at&status=eq.published&order=published_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{ slug: string; published_at?: string; updated_at?: string }>;
    return rows
      .filter((r) => r.slug)
      .map((r) => ({
        path: `/blog/${r.slug}`,
        lastmod: (r.updated_at ?? r.published_at ?? "").slice(0, 10) || undefined,
        changefreq: "monthly" as const,
        priority: "0.8",
      }));
  } catch {
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `    <xhtml:link rel="alternate" hreflang="ar-SA" href="${BASE_URL}${e.path}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${e.path}" />`,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

const blog = await fetchBlogPosts();
const all = [...core, ...academic, ...translation, ...servicesPages, ...research, ...journalCategories, ...blog];
const seen = new Set<string>();
const entries = all.filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)));

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
