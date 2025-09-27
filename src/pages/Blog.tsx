import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Eye, Heart, Share2, Tag, Search, Crown, CheckCircle, BookOpen, Clock, Star, Filter, TrendingUp, Scale, Settings, PenTool, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import { useState } from "react";

// Import blog images
import academicTranslationImg from "@/assets/blog-academic-translation.jpg";
import medicalTranslationImg from "@/assets/blog-medical-translation.jpg";
import legalTranslationImg from "@/assets/blog-legal-translation.jpg";
import technicalTranslationImg from "@/assets/blog-technical-translation.jpg";
import researchMethodsImg from "@/assets/blog-research-methods.jpg";
import businessTranslationImg from "@/assets/blog-business-translation.jpg";
import academicWritingImg from "@/assets/blog-academic-writing.jpg";
import journalPublicationImg from "@/assets/blog-journal-publication.jpg";
import statisticalAnalysisImg from "@/assets/blog-statistical-analysis.jpg";
import literatureReviewImg from "@/assets/blog-literature-review.jpg";
import thesisDefenseImg from "@/assets/blog-thesis-defense.jpg";
import plagiarismCheckImg from "@/assets/blog-plagiarism-check.jpg";
import academicFormattingImg from "@/assets/blog-academic-formatting.jpg";
import academicConferencesImg from "@/assets/blog-academic-conferences.jpg";
import aiTranslationImg from "@/assets/blog-ai-translation.jpg";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortBy, setSortBy] = useState("newest");

  const blogPosts = [
    {
      id: 1,
      title: "دليل شامل للترجمة الأكاديمية: معايير الجودة العالمية والممارسات المهنية",
      excerpt: "تعرف على أحدث معايير الترجمة الأكاديمية المتبعة في الجامعات العالمية وكيفية ضمان الدقة العلمية والمصطلحية في النصوص الأكاديمية المتخصصة.",
      author: "د. محمد الأكاديمي",
      date: "2024-01-20",
      category: "ترجمة أكاديمية",
      readTime: "12 دقيقة",
      image: academicTranslationImg,
      tags: ["ترجمة", "أكاديمي", "جودة", "معايير"],
      views: 2850,
      likes: 187,
      featured: true,
      difficulty: "متقدم"
    },
    {
      id: 2,
      title: "الترجمة الطبية المتخصصة: التحديات والحلول في عصر الطب الحديث",
      excerpt: "استكشاف أهم التحديات في ترجمة النصوص الطبية المعاصرة وكيفية التعامل مع المصطلحات الطبية الحديثة والبروتوكولات العلاجية المتطورة.",
      author: "د. سارة الطبيب",
      date: "2024-01-18",
      category: "ترجمة طبية",
      readTime: "10 دقائق",
      image: medicalTranslationImg,
      tags: ["طبي", "تخصصي", "مصطلحات", "رعاية صحية"],
      views: 1940,
      likes: 156,
      featured: false,
      difficulty: "متقدم"
    },
    {
      id: 3,
      title: "الترجمة القانونية في العصر الرقمي: بين التقنيات الحديثة والخبرة البشرية",
      excerpt: "كيف غيرت التقنيات الحديثة من مشهد الترجمة القانونية؟ نظرة شاملة على التوازن بين الذكاء الاصطناعي والخبرة القانونية التقليدية.",
      author: "المستشار أحمد القانوني",
      date: "2024-01-16",
      category: "ترجمة قانونية",
      readTime: "15 دقيقة",
      image: legalTranslationImg,
      tags: ["قانوني", "تقنية", "ذكاء اصطناعي", "عدالة"],
      views: 3200,
      likes: 234,
      featured: true,
      difficulty: "خبير"
    },
    {
      id: 4,
      title: "الترجمة التقنية والهندسية: دقة المصطلحات في عالم متطور",
      excerpt: "أهمية الدقة في ترجمة المستندات التقنية والهندسية، وكيفية ضمان النقل الصحيح للمفاهيم المعقدة عبر اللغات المختلفة.",
      author: "م. خالد التقني",
      date: "2024-01-14",
      category: "ترجمة تقنية",
      readTime: "8 دقائق",
      image: technicalTranslationImg,
      tags: ["هندسة", "تقني", "مواصفات", "دقة"],
      views: 1650,
      likes: 98,
      featured: false,
      difficulty: "متوسط"
    },
    {
      id: 5,
      title: "منهجيات البحث العلمي الحديثة: من الفكرة إلى النشر الدولي",
      excerpt: "دليل شامل لأحدث منهجيات البحث العلمي المتبعة في الجامعات العالمية، مع التركيز على المعايير الدولية للنشر الأكاديمي.",
      author: "د. فاطمة الباحثة",
      date: "2024-01-12",
      category: "بحث علمي",
      readTime: "20 دقيقة",
      image: researchMethodsImg,
      tags: ["بحث", "منهجية", "نشر", "أكاديمي"],
      views: 4100,
      likes: 312,
      featured: true,
      difficulty: "متقدم"
    },
    {
      id: 6,
      title: "الترجمة التجارية والاقتصادية في السوق العالمي",
      excerpt: "تحليل شامل لمتطلبات الترجمة في البيئة التجارية الدولية وأهمية الدقة المصطلحية في النجاح التجاري عبر الحدود.",
      author: "د. عبدالله الاقتصادي",
      date: "2024-01-10",
      category: "ترجمة تجارية",
      readTime: "11 دقيقة",
      image: businessTranslationImg,
      tags: ["تجارة", "اقتصاد", "أعمال", "دولي"],
      views: 2300,
      likes: 145,
      featured: false,
      difficulty: "متوسط"
    },
    {
      id: 7,
      title: "أساسيات الكتابة الأكاديمية العلمية: من البحث إلى النشر",
      excerpt: "المهارات الأساسية للكتابة الأكاديمية المتميزة، بما في ذلك هيكل البحث العلمي والأسلوب الأكاديمي المناسب للنشر الدولي.",
      author: "د. نورا الكاتبة",
      date: "2024-01-08",
      category: "كتابة أكاديمية",
      readTime: "14 دقيقة",
      image: academicWritingImg,
      tags: ["كتابة", "أسلوب", "بحث", "مهارات"],
      views: 3700,
      likes: 267,
      featured: false,
      difficulty: "متوسط"
    },
    {
      id: 8,
      title: "دليل النشر في المجلات العلمية المحكمة: استراتيجيات النجاح",
      excerpt: "خطوات عملية لضمان قبول البحوث في أفضل المجلات العلمية المحكمة، من اختيار المجلة المناسبة حتى الرد على ملاحظات المحكمين.",
      author: "د. يوسف الناشر",
      date: "2024-01-06",
      category: "نشر علمي",
      readTime: "16 دقيقة",
      image: journalPublicationImg,
      tags: ["نشر", "مجلات", "تحكيم", "استراتيجية"],
      views: 5200,
      likes: 398,
      featured: true,
      difficulty: "متقدم"
    },
    {
      id: 9,
      title: "التحليل الإحصائي المتقدم في البحوث الأكاديمية باستخدام SPSS و R",
      excerpt: "دليل شامل لاستخدام أدوات التحليل الإحصائي الحديثة في البحث العلمي، مع أمثلة عملية وتفسير النتائج الإحصائية.",
      author: "د. أمل الإحصائية",
      date: "2024-01-04",
      category: "تحليل إحصائي",
      readTime: "18 دقيقة",
      image: statisticalAnalysisImg,
      tags: ["إحصاء", "SPSS", "R", "تحليل"],
      views: 2800,
      likes: 201,
      featured: false,
      difficulty: "خبير"
    },
    {
      id: 10,
      title: "منهجية مراجعة الأدبيات المنهجية في البحث العلمي",
      excerpt: "كيفية إجراء مراجعة أدبيات علمية شاملة ومنهجية تلبي المعايير الدولية للبحث الأكاديمي المتميز.",
      author: "د. سعد الأكاديمي",
      date: "2024-01-02",
      category: "مراجعة أدبيات",
      readTime: "13 دقيقة",
      image: literatureReviewImg,
      tags: ["أدبيات", "مراجعة", "منهجية", "بحث"],
      views: 1900,
      likes: 134,
      featured: false,
      difficulty: "متقدم"
    },
    {
      id: 11,
      title: "استراتيجيات النجاح في مناقشة الرسائل الجامعية",
      excerpt: "نصائح عملية للتحضير لمناقشة الرسائل الجامعية، من إعداد العرض التقديمي حتى التعامل مع أسئلة لجنة المناقشة.",
      author: "د. هند الجامعية",
      date: "2023-12-30",
      category: "رسائل جامعية",
      readTime: "9 دقائق",
      image: thesisDefenseImg,
      tags: ["مناقشة", "رسالة", "عرض", "نجاح"],
      views: 4500,
      likes: 356,
      featured: false,
      difficulty: "متوسط"
    },
    {
      id: 12,
      title: "أدوات كشف الانتحال الحديثة: ضمان الأصالة الأكاديمية",
      excerpt: "مراجعة شاملة لأحدث أدوات كشف الانتحال والسرقة الأدبية، مع نصائح لضمان الأصالة في البحوث الأكاديمية.",
      author: "د. علي الأمانة",
      date: "2023-12-28",
      category: "أمانة علمية",
      readTime: "7 دقائق",
      image: plagiarismCheckImg,
      tags: ["انتحال", "أصالة", "أمانة", "أدوات"],
      views: 3300,
      likes: 243,
      featured: false,
      difficulty: "مبتدئ"
    },
    {
      id: 13,
      title: "معايير التنسيق الأكاديمي: APA, MLA, وشيكاغو",
      excerpt: "دليل مفصل لأهم معايير التنسيق الأكاديمي المستخدمة عالمياً، مع أمثلة عملية لكل نمط وكيفية تطبيقه بشكل صحيح.",
      author: "د. لينا المنسقة",
      date: "2023-12-26",
      category: "تنسيق أكاديمي",
      readTime: "12 دقيقة",
      image: academicFormattingImg,
      tags: ["تنسيق", "APA", "MLA", "شيكاغو"],
      views: 2100,
      likes: 167,
      featured: false,
      difficulty: "متوسط"
    },
    {
      id: 14,
      title: "المؤتمرات الأكاديمية الدولية: فرص التواصل والتطوير المهني",
      excerpt: "أهمية المشاركة في المؤتمرات الأكاديمية الدولية للباحثين والأكاديميين، مع نصائح لاختيار المؤتمرات المناسبة.",
      author: "د. راشد المؤتمرات",
      date: "2023-12-24",
      category: "مؤتمرات أكاديمية",
      readTime: "10 دقائق",
      image: academicConferencesImg,
      tags: ["مؤتمرات", "تواصل", "تطوير", "دولي"],
      views: 1750,
      likes: 92,
      featured: false,
      difficulty: "مبتدئ"
    },
    {
      id: 15,
      title: "مستقبل الترجمة: الذكاء الاصطناعي والترجمة الآلية العصبية",
      excerpt: "نظرة على مستقبل صناعة الترجمة مع تطور تقنيات الذكاء الاصطناعي والترجمة الآلية العصبية وتأثيرها على المترجمين.",
      author: "د. تقني المستقبل",
      date: "2023-12-22",
      category: "تقنيات حديثة",
      readTime: "15 دقيقة",
      image: aiTranslationImg,
      tags: ["ذكاء اصطناعي", "مستقبل", "تقنية", "ترجمة آلية"],
      views: 6100,
      likes: 487,
      featured: true,
      difficulty: "متقدم"
    }
  ];

  const categories = [
    { name: "الكل", count: 15, icon: BookOpen },
    { name: "ترجمة أكاديمية", count: 3, icon: BookOpen },
    { name: "ترجمة طبية", count: 2, icon: Heart },
    { name: "ترجمة قانونية", count: 2, icon: Scale },
    { name: "ترجمة تقنية", count: 2, icon: Settings },
    { name: "بحث علمي", count: 3, icon: Search },
    { name: "كتابة أكاديمية", count: 2, icon: PenTool },
    { name: "تحليل إحصائي", count: 1, icon: BarChart3 }
  ];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const filteredPosts = selectedCategory === "الكل" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === "popular") return b.views - a.views;
    if (sortBy === "liked") return b.likes - a.likes;
    return 0;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "مبتدئ": return "bg-green-100 text-green-800 border-green-200";
      case "متوسط": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "متقدم": return "bg-orange-100 text-orange-800 border-orange-200";
      case "خبير": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      
      {/* Working Hours Banner */}
      <WorkingHoursBannerRTL />
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-blue-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="h-12 w-12 text-yellow-300" />
              <h1 className="text-6xl font-bold font-arabic-title">
                مدونة MasterEduPath
              </h1>
            </div>
            
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              مرحباً بكم في مركز المعرفة الأكاديمية - اكتشفوا أحدث الاتجاهات والنصائح المهنية 
              في عالم الترجمة المتخصصة والحلول التعليمية المتقدمة
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Badge className="bg-yellow-500 text-black px-4 py-2 text-lg font-bold">
                ✨ +15 مقال متخصص
              </Badge>
              <Badge className="bg-green-500 text-white px-4 py-2 text-lg font-bold">
                🎓 محتوى أكاديمي معتمد
              </Badge>
              <Badge className="bg-purple-500 text-white px-4 py-2 text-lg font-bold">
                🌟 خبراء متخصصون
              </Badge>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input 
                  placeholder="ابحث في مقالاتنا المتخصصة..." 
                  className="pr-12 pl-4 py-4 bg-white/10 border-white/20 text-white placeholder:text-white/60 text-lg rounded-full"
                />
                <Button className="absolute left-2 top-2 bottom-2 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6">
                  بحث
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">15+</div>
                <div className="text-sm opacity-80">مقال متخصص</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300">50K+</div>
                <div className="text-sm opacity-80">قارئ شهرياً</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">8</div>
                <div className="text-sm opacity-80">تخصصات مختلفة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300">100+</div>
                <div className="text-sm opacity-80">ساعة محتوى</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="h-6 w-6 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-800">المقالات المميزة</h2>
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                أهم وأحدث المقالات في مجال الترجمة والتعليم الأكاديمي
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full border-2 border-yellow-200">
                    <div className="relative">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge className="bg-yellow-500 text-black font-bold">
                          ⭐ مميز
                        </Badge>
                        <Badge className={`${getDifficultyColor(post.difficulty)} border font-medium`}>
                          {post.difficulty}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-primary/90 text-white">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-600 mb-4 leading-relaxed text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Button className="group" asChild>
                          <a href={`/blog/${post.id}`}>
                            قراءة المقال
                            <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </Button>
                        
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 space-y-8"
          >
            {/* Master Membership CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
              </div>
              
              <div className="relative text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <Crown className="h-8 w-8 text-yellow-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">عضوية ماستر الذهبية</h3>
                <p className="text-sm opacity-90 mb-4">
                  انضم لمجتمع النخبة الأكاديمية واحصل على محتوى حصري متقدم
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>محتوى حصري ومتقدم</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>ورش عمل مباشرة أسبوعية</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>استشارات شخصية مجانية</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>شهادات معتمدة دولياً</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg py-3 rounded-xl shadow-lg"
                  asChild
                >
                  <a href="/master-membership">🚀 ابدأ رحلتك الآن</a>
                </Button>
              </div>
            </motion.div>

            {/* Categories */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  التصنيفات المتخصصة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button 
                        variant={selectedCategory === category.name ? "default" : "ghost"} 
                        className="w-full justify-between group hover:bg-primary/10"
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {category.name}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`group-hover:bg-primary group-hover:text-white transition-colors ${
                            selectedCategory === category.name ? 'bg-white text-primary' : ''
                          }`}
                        >
                          {category.count}
                        </Badge>
                      </Button>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 border-green-200">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  النشرة الأكاديمية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    📧
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    احصل على أحدث المقالات والنصائح المهنية مباشرة في بريدك الإلكتروني
                  </p>
                </div>
                <Input placeholder="البريد الإلكتروني" className="text-center" />
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  📬 اشتراك مجاني
                </Button>
                <p className="text-xs text-center text-slate-500">
                  أكثر من 10,000 مشترك يثقون بنا
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters and Sorting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-700">
                  {filteredPosts.length} مقال في "{selectedCategory}"
                </span>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث أولاً</SelectItem>
                  <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                  <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
                  <SelectItem value="liked">الأكثر إعجاباً</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Articles Grid */}
            <div className="grid gap-8">
              {sortedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/30">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="relative overflow-hidden h-48 md:h-full">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <Badge className="bg-primary/90 text-white">
                              {post.category}
                            </Badge>
                            <Badge className={`${getDifficultyColor(post.difficulty)} border font-medium`}>
                              {post.difficulty}
                            </Badge>
                            {post.featured && (
                              <Badge className="bg-yellow-500 text-black font-bold">
                                ⭐ مميز
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="md:w-2/3 p-6">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString('ar-SA')}
                          </div>
                          <div className="flex items-center gap-1 text-primary font-medium">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-600 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs hover:bg-primary hover:text-white transition-colors cursor-pointer">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button className="group bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary" asChild>
                            <a href={`/blog/${post.id}`}>
                              قراءة المقال كاملاً
                              <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                          </Button>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                              <Eye className="h-4 w-4" />
                              {post.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </div>
                            <Button variant="ghost" size="sm" className="hover:text-blue-500">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center mt-12"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary px-8 py-4 rounded-full shadow-lg"
              >
                تحميل المزيد من المقالات
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;