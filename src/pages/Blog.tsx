import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Eye, Heart, Share2, Tag, Search, Crown, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "دليل شامل للترجمة القانونية: أفضل الممارسات والنصائح المهنية",
      excerpt: "تعرف على أهم الاعتبارات والتحديات في مجال الترجمة القانونية، وكيفية ضمان الدقة والاحترافية",
      author: "د. أحمد المترجم",
      date: "2024-01-15",
      category: "ترجمة قانونية",
      readTime: "8 دقائق",
      image: "/api/placeholder/800/400",
      tags: ["قانوني", "ترجمة", "احترافية"],
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: "كيفية ترجمة المستندات الطبية بدقة عالية",
      excerpt: "الترجمة الطبية تتطلب دقة استثنائية ومعرفة عميقة بالمصطلحات، إليك أهم النصائح",
      author: "د. سارة الطبيب",
      date: "2024-01-12",
      category: "ترجمة طبية",
      readTime: "6 دقائق",
      image: "/api/placeholder/800/400",
      tags: ["طبي", "مستندات", "دقة"],
      views: 980,
      likes: 67
    },
    {
      id: 3,
      title: "أحدث التقنيات في الترجمة التقنية والبرمجيات",
      excerpt: "استكشف كيف تساعد التقنيات الحديثة في تحسين جودة الترجمة التقنية وسرعة الإنجاز",
      author: "م. خالد التقني",
      date: "2024-01-10",
      category: "ترجمة تقنية",
      readTime: "10 دقائق",
      image: "/api/placeholder/800/400",
      tags: ["تقني", "تكنولوجيا", "برمجة"],
      views: 1456,
      likes: 102
    },
    {
      id: 4,
      title: "مسابقة الترجمة الأكاديمية الكبرى - جوائز قيمة بانتظاركم",
      excerpt: "شارك في مسابقتنا الأكاديمية واحصل على جوائز نقدية وشهادات معتمدة في مجال الترجمة التخصصية",
      author: "إدارة المسابقات",
      date: "2024-01-08",
      category: "مسابقات أكاديمية",
      readTime: "5 دقائق",
      image: "/api/placeholder/800/400",
      tags: ["مسابقة", "جوائز", "أكاديمي"],
      views: 789,
      likes: 45
    },
    {
      id: 5,
      title: "دليل اختيار مترجم محترف لمشروعك",
      excerpt: "نصائح عملية لاختيار المترجم المناسب لمشروعك وضمان الحصول على أفضل النتائج",
      author: "إدارة الجودة",
      date: "2024-01-05",
      category: "دليل العملاء",
      readTime: "7 دقائق",
      image: "/api/placeholder/800/400",
      tags: ["دليل", "اختيار", "جودة"],
      views: 1123,
      likes: 78
    },
    {
      id: 6,
      title: "اتجاهات صناعة الترجمة في 2024",
      excerpt: "استطلاع شامل لأحدث التطورات والتوجهات المستقبلية في صناعة الترجمة والتوطين",
      author: "قسم الأبحاث",
      date: "2024-01-03",
      category: "أخبار الصناعة",
      readTime: "12 دقائق",
      image: "/api/placeholder/800/400",
      tags: ["اتجاهات", "مستقبل", "صناعة"],
      views: 2100,
      likes: 156
    }
  ];

  const categories = [
    { name: "الكل", count: 24 },
    { name: "ترجمة قانونية", count: 8 },
    { name: "ترجمة طبية", count: 6 },
    { name: "ترجمة تقنية", count: 5 },
    { name: "مسابقات أكاديمية", count: 3 },
    { name: "أخبار الصناعة", count: 2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      
      {/* Working Hours Banner */}
      <WorkingHoursBannerRTL />
      
      {/* Header */}
      <Header />
      
      {/* Header Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl font-bold mb-6 font-arabic-title">
              مدونة MasterEduPath
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              اكتشف أحدث الاتجاهات والنصائح المهنية في عالم الترجمة والحلول التعليمية
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input 
                  placeholder="ابحث في المقالات..." 
                  className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            {/* Master Membership CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-xl mb-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-yellow-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">عضوية ماستر</h3>
                <p className="text-sm opacity-90 mb-4">
                  انضم لمجتمع النخبة واحصل على محتوى حصري وموارد متقدمة
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>محتوى حصري متقدم</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>ورش عمل مباشرة</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span>استشارات شخصية</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                  asChild
                >
                  <a href="/master-membership">اعرف المزيد</a>
                </Button>
              </div>
            </motion.div>

            <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  التصنيفات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button 
                      variant={index === 0 ? "default" : "ghost"} 
                      className="w-full justify-between group"
                    >
                      {category.name}
                      <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-white transition-colors">
                        {category.count}
                      </Badge>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Subscription */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">اشترك في النشرة الإخبارية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 text-center">
                  احصل على أحدث المقالات والنصائح المهنية مباشرة في بريدك
                </p>
                <Input placeholder="البريد الإلكتروني" />
                <Button className="w-full">اشتراك</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="relative overflow-hidden h-48 md:h-full">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-primary/90 text-white">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="md:w-2/3 p-6">
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString('ar-SA')}
                          </div>
                          <div className="text-primary font-medium">
                            {post.readTime}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-600 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button className="group">
                            قراءة المزيد
                            <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </div>
                            <Button variant="ghost" size="sm">
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

            {/* Pagination */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center mt-12"
            >
              <div className="flex gap-2">
                <Button variant="outline">السابق</Button>
                <Button>1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">التالي</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;