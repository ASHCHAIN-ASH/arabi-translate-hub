import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/data/legacy/client";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rss, Calendar, Clock, ArrowLeft } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  tags: string[] | null;
  author_name: string;
  published_at: string;
  reading_minutes: number | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select(
          "id,slug,title,excerpt,cover_image,category,tags,author_name,published_at,reading_minutes",
        )
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(50);
      setPosts((data ?? []) as BlogPost[]);
      setLoading(false);
    };
    load();
  }, []);

  const rssUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/rss-feed`;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "مدونة FekrahEdu",
    "description": "أحدث المقالات في الترجمة الأكاديمية والبحث العلمي والنشر الدولي",
    "url": "https://fekrahedu.com/blog",
    "inLanguage": "ar-SA",
    "publisher": {
      "@type": "Organization",
      "name": "FekrahEdu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fekrahedu.com/assets/national-day-logo-original.webp"
      }
    },
    "blogPost": posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      "headline": p.title,
      "description": p.excerpt,
      "image": p.cover_image,
      "datePublished": p.published_at,
      "url": `https://fekrahedu.com/blog/${p.slug}`,
      "author": { "@type": "Organization", "name": p.author_name }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://fekrahedu.com/" },
      { "@type": "ListItem", "position": 2, "name": "المدونة", "item": "https://fekrahedu.com/blog" }
    ]
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO
        title="مدونة FekrahEdu - الترجمة والبحث العلمي"
        description="مقالات وأخبار متخصصة في الترجمة الأكاديمية والنشر العلمي والتحليل الإحصائي."
        url="https://fekrahedu.com/blog"
        keywords="مدونة, مقالات ترجمة, نشر علمي, SPSS, Scopus, أبحاث"
        schema={[blogSchema, breadcrumbSchema]}
      />

      {/* RSS auto-discovery */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title="FekrahEdu RSS Feed"
        href={rssUrl}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="h-4 w-4" /> العودة للرئيسية
            </Link>
            <h1 className="text-4xl font-bold">المدونة والأخبار</h1>
            <p className="text-muted-foreground mt-2">
              أحدث المقالات في الترجمة الأكاديمية والبحث العلمي
            </p>
          </div>
          <Button asChild variant="outline">
            <a href={rssUrl} target="_blank" rel="noopener noreferrer">
              <Rss className="h-4 w-4 ml-2" />
              اشترك بـ RSS
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">جاري التحميل...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">لا توجد مقالات منشورة بعد.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  {p.cover_image && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <Badge variant="secondary" className="mb-3">{p.category}</Badge>
                    <h2 className="text-lg font-bold mb-2 line-clamp-2">{p.title}</h2>
                    {p.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {p.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(p.published_at).toLocaleDateString("ar-SA")}
                      </span>
                      {p.reading_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {p.reading_minutes} دقائق
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
