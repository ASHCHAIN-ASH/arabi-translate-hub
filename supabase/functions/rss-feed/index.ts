// RSS 2.0 feed generator for FekrahEdu blog
// Public endpoint — no auth required, returns application/rss+xml

const SITE_URL = "https://fekrahedu.com";
const SITE_TITLE = "FekrahEdu - مدونة الترجمة والبحث العلمي";
const SITE_DESCRIPTION =
  "أحدث المقالات والأخبار في الترجمة الأكاديمية والنشر العلمي والتحليل الإحصائي من FekrahEdu.";
const SITE_LANGUAGE = "ar-SA";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[] | null;
  author_name: string;
  published_at: string;
}

const xmlEscape = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cdata = (s: string): string =>
  `<![CDATA[${s.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;

const formatRfc822 = (iso: string): string =>
  new Date(iso).toUTCString();

async function fetchPosts(category?: string): Promise<BlogPost[]> {
  const params = new URLSearchParams({
    select:
      "id,slug,title,excerpt,content,cover_image,category,tags,author_name,published_at",
    status: "eq.published",
    published_at: `lte.${new Date().toISOString()}`,
    order: "published_at.desc",
    limit: "50",
  });
  if (category) params.append("category", `eq.${category}`);

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?${params.toString()}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  );
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
}

function buildRss(posts: BlogPost[], category?: string): string {
  const feedTitle = category
    ? `${SITE_TITLE} - ${category}`
    : SITE_TITLE;
  const feedUrl = category
    ? `${SITE_URL}/rss.xml?category=${category}`
    : `${SITE_URL}/rss.xml`;
  const lastBuildDate = posts.length
    ? formatRfc822(posts[0].published_at)
    : new Date().toUTCString();

  const items = posts
    .map((p) => {
      const link = `${SITE_URL}/blog/${p.slug}`;
      const desc = p.excerpt || p.content.replace(/<[^>]+>/g, "").slice(0, 280);
      const categoryTags = [p.category, ...(p.tags ?? [])]
        .map((t) => `    <category>${xmlEscape(t)}</category>`)
        .join("\n");
      const enclosure = p.cover_image
        ? `    <enclosure url="${xmlEscape(p.cover_image)}" type="image/jpeg" length="0"/>`
        : "";
      return `  <item>
    <title>${cdata(p.title)}</title>
    <link>${xmlEscape(link)}</link>
    <guid isPermaLink="true">${xmlEscape(link)}</guid>
    <pubDate>${formatRfc822(p.published_at)}</pubDate>
    <author>noreply@fekrahedu.com (${xmlEscape(p.author_name)})</author>
    <description>${cdata(desc)}</description>
    <content:encoded>${cdata(p.content)}</content:encoded>
${categoryTags}
${enclosure}
  </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>${cdata(feedTitle)}</title>
  <link>${SITE_URL}</link>
  <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml"/>
  <description>${cdata(SITE_DESCRIPTION)}</description>
  <language>${SITE_LANGUAGE}</language>
  <copyright>© ${new Date().getFullYear()} FekrahEdu</copyright>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <generator>FekrahEdu RSS Generator</generator>
  <ttl>60</ttl>
  <image>
    <url>${SITE_URL}/assets/national-day-logo-original.webp</url>
    <title>${cdata(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
  </image>
${items}
</channel>
</rss>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || undefined;
    const posts = await fetchPosts(category);
    const xml = buildRss(posts, category);

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=600, s-maxage=600",
      },
    });
  } catch (err) {
    console.error("RSS error:", err);
    return new Response(
      `<?xml version="1.0"?><error>${xmlEscape(String(err))}</error>`,
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/xml" },
      },
    );
  }
});
