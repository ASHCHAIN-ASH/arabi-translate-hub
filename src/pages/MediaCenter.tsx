import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Newspaper, 
  TrendingUp, 
  Award, 
  Search,
  Calendar,
  Eye,
  ArrowLeft,
  Filter,
  Sparkles,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Import images
import successStoriesImg from "@/assets/blog-academic-conferences.jpg";
import newsImg from "@/assets/blog-journal-publication.jpg";
import articlesImg from "@/assets/blog-academic-writing.jpg";
import guidesImg from "@/assets/blog-research-methods.jpg";

const MediaCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "الكل", icon: Sparkles },
    { id: "news", name: "الأخبار", icon: Newspaper },
    { id: "success", name: "قصص النجاح", icon: Award },
    { id: "articles", name: "المقالات", icon: BookOpen },
    { id: "guides", name: "الأدلة التعليمية", icon: TrendingUp }
  ];

  const mediaPosts = [
    {
      id: 1,
      title: "نجاح باهر لطالب الدكتوراه في النشر بمجلة Nature",
      excerpt: "استطاع أحد عملائنا تحقيق إنجاز علمي كبير بنشر بحثه في إحدى أرقى المجلات العلمية عالمياً",
      category: "success",
      image: successStoriesImg,
      date: "2025-01-15",
      views: 2400,
      featured: true,
      author: "فريق MasterEduPath"
    },
    {
      id: 2,
      title: "إطلاق خدمة الترجمة الفورية بالذكاء الاصطناعي",
      excerpt: "نعلن عن إطلاق خدمة جديدة للترجمة الفورية باستخدام أحدث تقنيات الذكاء الاصطناعي",
      category: "news",
      image: newsImg,
      date: "2025-01-10",
      views: 3200,
      featured: true,
      author: "إدارة التطوير"
    },
    {
      id: 3,
      title: "دليل شامل للنشر في المجلات العلمية المحكّمة",
      excerpt: "خطوات عملية ونصائح مهمة للباحثين الراغبين في نشر أبحاثهم في مجلات علمية محكّمة",
      category: "guides",
      image: guidesImg,
      date: "2025-01-08",
      views: 1800,
      featured: false,
      author: "د. محمد الأحمد"
    },
    {
      id: 4,
      title: "أهمية الترجمة الأكاديمية في البحث العلمي",
      excerpt: "تعرف على الدور الحيوي الذي تلعبه الترجمة الأكاديمية في نشر المعرفة وتبادل الخبرات",
      category: "articles",
      image: articlesImg,
      date: "2025-01-05",
      views: 1500,
      featured: false,
      author: "أ. سارة الخالدي"
    },
    {
      id: 5,
      title: "تكريم 100 باحث متميز في حفل السنوي",
      excerpt: "احتفلنا بتكريم 100 باحث استطاعوا تحقيق إنجازات علمية مميزة خلال العام الماضي",
      category: "news",
      image: successStoriesImg,
      date: "2025-01-03",
      views: 2100,
      featured: false,
      author: "فريق العلاقات العامة"
    },
    {
      id: 6,
      title: "من الصفر إلى النشر: قصة نجاح باحثة سعودية",
      excerpt: "رحلة ملهمة لباحثة سعودية من بداية بحثها حتى نشره في مجلة دولية مرموقة",
      category: "success",
      image: articlesImg,
      date: "2024-12-28",
      views: 2800,
      featured: false,
      author: "فريق التحرير"
    }
  ];

  const filteredPosts = mediaPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <SEO 
        title="المركز الإعلامي | MasterEduPath"
        description="تابع آخر الأخبار والمقالات وقصص النجاح والأدلة التعليمية من MasterEduPath - شريكك في التميز الأكاديمي"
        keywords="أخبار أكاديمية، قصص نجاح، مقالات علمية، أدلة تعليمية، MasterEduPath"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb 
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "المركز الإعلامي" }
            ]}
          />

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 mt-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full mb-6">
              <Newspaper className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              المركز الإعلامي
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Media Center
            </p>
            <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto mt-4">
              تابع آخر الأخبار والمقالات وقصص النجاح الملهمة من عالم التعليم والبحث العلمي
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="ابحث في المركز الإعلامي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 pl-4 h-14 text-lg bg-card/50 backdrop-blur-sm border-2 focus:border-primary transition-all"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`flex items-center gap-2 whitespace-nowrap transition-all ${
                        selectedCategory === category.id 
                          ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg" 
                          : "hover:border-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <h2 className="text-2xl md:text-3xl font-bold">مميز</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Link to={`/media/${post.id}`}>
                      <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 hover:border-primary">
                        <div className="relative overflow-hidden h-64">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            مميز
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.date).toLocaleDateString('ar-SA')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views.toLocaleString()} مشاهدة
                            </span>
                          </div>
                          
                          <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {post.author}
                            </span>
                            <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                              اقرأ المزيد
                              <ArrowLeft className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">جميع المنشورات</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <Link to={`/media/${post.id}`}>
                      <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border hover:border-primary">
                        <div className="relative overflow-hidden h-48">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        
                        <div className="p-5">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.date).toLocaleDateString('ar-SA')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views.toLocaleString()}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                          
                          <span className="text-sm text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                            اقرأ المزيد
                            <ArrowLeft className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-muted rounded-full mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">لا توجد نتائج</h3>
              <p className="text-muted-foreground mb-6">
                لم نجد أي منشورات تطابق بحثك. جرب كلمات مختلفة أو اختر تصنيفاً آخر.
              </p>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                إعادة تعيين البحث
              </Button>
            </motion.div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default MediaCenter;