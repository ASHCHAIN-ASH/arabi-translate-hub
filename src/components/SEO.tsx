import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  schema?: object | object[];
  noIndex?: boolean;
}

const SEO = ({
  title,
  description,
  keywords = "MasterEduPath, خدمات بحثية, ترجمة أكاديمية, نشر علمي, تدقيق لغوي, تحليل إحصائي, SPSS, جامعات سعودية, بحث علمي",
  image = "https://masteredupath.com/assets/national-day-logo-original.webp",
  url = "https://masteredupath.com",
  type = "website",
  author = "MasterEduPath Agency",
  publishedTime,
  schema,
  noIndex = false
}: SEOProps) => {
  const siteName = "MasterEduPath - وكالة الحلول التعليمية المتقدمة";
  const twitterHandle = "@MasterEduPath";

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MasterEduPath Agency",
    "alternateName": "وكالة ماستر إيدو باث",
    "url": "https://masteredupath.com",
    "logo": "https://masteredupath.com/assets/national-day-logo-original.webp",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966559600824",
      "contactType": "customer service",
      "email": "info@masteredupath.com",
      "areaServed": "SA",
      "availableLanguage": ["ar", "en"]
    },
    "sameAs": [
      "https://www.facebook.com/MasterEduPath",
      "https://twitter.com/MasterEduPath",
      "https://www.linkedin.com/company/masteredupath",
      "https://www.instagram.com/masteredupath"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "جدة",
      "addressCountry": "SA"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* hreflang for Arabic/English/default */}
      <link rel="alternate" hrefLang="ar-SA" href={url} />
      <link rel="alternate" hrefLang="ar" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Viewport & Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="format-detection" content="telephone=yes" />

      {/* Language & RTL */}
      <meta httpEquiv="content-language" content="ar-SA" />
      <html lang="ar" dir="rtl" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ar_SA" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      
      {/* Additional SEO Meta Tags */}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}
      />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="bingbot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />

      {/* Schema.org structured data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Custom Schema(s) if provided — supports single object or array */}
      {schema && (Array.isArray(schema) ? schema : [schema]).map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEO;
