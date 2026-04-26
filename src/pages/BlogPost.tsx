import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

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
  reading_minutes: number | null;
  meta_description: string | null;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .maybeSingle();
      setPost(data as BlogPost | null);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">المقال غير موجود</p>
        <Link to="/blog" className="text-primary hover:underline">العودة للمدونة</Link>
      </div>
    );
  }

  const url = `https://masteredupath.com/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.cover_image,
    datePublished: post.published_at,
    author: { "@type": "Organization", name: post.author_name },
    publisher: {
      "@type": "Organization",
      name: "MasterEduPath",
      logo: {
        "@type": "ImageObject",
        url: "https://masteredupath.com/assets/national-day-logo-original.webp",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO
        title={`${post.title} | MasterEduPath`}
        description={post.meta_description || post.excerpt || post.title}
        url={url}
        type="article"
        image={post.cover_image || undefined}
        publishedTime={post.published_at}
        author={post.author_name}
        keywords={(post.tags ?? []).join(", ")}
        schema={articleSchema}
      />

      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> العودة للمدونة
        </Link>

        <Badge variant="secondary" className="mb-4">{post.category}</Badge>
        <h1 className="text-4xl font-bold mb-4 leading-tight">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1"><User className="h-4 w-4" /> {post.author_name}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.published_at).toLocaleDateString("ar-SA")}
          </span>
          {post.reading_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {post.reading_minutes} دقائق
            </span>
          )}
        </div>

        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full rounded-lg mb-8 aspect-video object-cover"
          />
        )}

        <div
          className="prose prose-lg max-w-none rtl:prose-headings:text-right"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t} variant="outline">#{t}</Badge>
            ))}
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPostPage;
