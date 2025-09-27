import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Eye, Heart, Share2, Tag, Clock, ArrowLeft, Home, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import { useParams, Link } from "react-router-dom";

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

const BlogPost = () => {
  const { id } = useParams();

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
      content: `
        <p>تعتبر الترجمة الأكاديمية من أهم التحديات التي تواجه الباحثين والمترجمين المتخصصين في العصر الحديث. فمع تزايد الحاجة لتبادل المعرفة العلمية عبر الحدود اللغوية والثقافية، أصبح من الضروري وضع معايير دقيقة تضمن جودة الترجمة الأكاديمية وتحافظ على الدقة العلمية للمحتوى المترجم.</p>

        <h2>أهمية الترجمة الأكاديمية في العصر الحديث</h2>
        <p>في عالم يشهد تطوراً علمياً متسارعاً، تلعب الترجمة الأكاديمية دوراً محورياً في:</p>
        <ul>
          <li>نشر البحوث العلمية على نطاق دولي أوسع</li>
          <li>تسهيل التعاون البحثي بين الجامعات العالمية</li>
          <li>إتاحة المعرفة المتخصصة للباحثين من خلفيات لغوية مختلفة</li>
          <li>رفع مستوى جودة البحث العلمي عبر التبادل المعرفي</li>
        </ul>

        <h2>معايير الجودة في الترجمة الأكاديمية</h2>
        <p>لضمان تحقيق أعلى معايير الجودة في الترجمة الأكاديمية، يجب التركيز على العناصر التالية:</p>

        <h3>1. الدقة المصطلحية</h3>
        <p>تتطلب الترجمة الأكاديمية فهماً عميقاً للمصطلحات المتخصصة في كل مجال علمي. يجب على المترجم:</p>
        <ul>
          <li>إتقان المصطلحات الأساسية في التخصص</li>
          <li>استخدام المراجع المعتمدة للمصطلحات</li>
          <li>التأكد من التناسق في استخدام المصطلحات</li>
        </ul>

        <h3>2. الحفاظ على الأسلوب الأكاديمي</h3>
        <p>الأسلوب الأكاديمي له خصائص مميزة يجب المحافظة عليها في الترجمة:</p>
        <ul>
          <li>الموضوعية والحيادية في العرض</li>
          <li>استخدام الأدلة والبراهين العلمية</li>
          <li>الدقة في الاقتباس والإحالات</li>
        </ul>

        <h2>التحديات الشائعة في الترجمة الأكاديمية</h2>
        <p>يواجه المترجمون الأكاديميون تحديات عديدة، منها:</p>

        <h3>التحديات اللغوية</h3>
        <ul>
          <li>التعامل مع المصطلحات المستحدثة</li>
          <li>ترجمة التعبيرات الاصطلاحية المتخصصة</li>
          <li>المحافظة على دقة المعنى العلمي</li>
        </ul>

        <h3>التحديات الثقافية</h3>
        <ul>
          <li>فهم السياق الثقافي للبحث</li>
          <li>التعامل مع المفاهيم الخاصة بثقافة معينة</li>
          <li>مراعاة الاختلافات في أنظمة التعليم</li>
        </ul>

        <h2>أفضل الممارسات للمترجمين الأكاديميين</h2>
        <p>لتحقيق التميز في الترجمة الأكاديمية، ننصح باتباع هذه الممارسات:</p>

        <h3>1. التحضير المسبق</h3>
        <ul>
          <li>دراسة موضوع البحث بتعمق</li>
          <li>إعداد معجم للمصطلحات المتخصصة</li>
          <li>مراجعة البحوث ذات الصلة في اللغة الهدف</li>
        </ul>

        <h3>2. استخدام الأدوات المساعدة</h3>
        <ul>
          <li>قواعد البيانات المصطلحية المتخصصة</li>
          <li>برامج إدارة الترجمة (CAT Tools)</li>
          <li>المراجع العلمية المعتمدة</li>
        </ul>

        <h3>3. المراجعة والتدقيق</h3>
        <ul>
          <li>مراجعة المحتوى من قبل خبراء في التخصص</li>
          <li>التدقيق اللغوي والإملائي</li>
          <li>التأكد من سلامة الإحالات والمراجع</li>
        </ul>

        <h2>الخلاصة</h2>
        <p>الترجمة الأكاديمية مهارة متخصصة تتطلب مزيجاً من الخبرة اللغوية والمعرفة العلمية. باتباع المعايير والممارسات المذكورة، يمكن للمترجمين تحقيق أعلى مستويات الجودة وضمان وصول المعرفة العلمية إلى جمهور أوسع بدقة وأمانة.</p>
      `
    },
    // يمكن إضافة المزيد من المقالات هنا
  ];

  const post = blogPosts.find(p => p.id === parseInt(id || "1")) || blogPosts[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      
      {/* Working Hours Banner */}
      <WorkingHoursBannerRTL />
      
      {/* Header */}
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-primary transition-colors">المدونة</Link>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                {post.category}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(post.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-primary font-medium">{post.readTime}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-5 w-5" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-5 w-5" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mb-12">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div 
                      className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
                      style={{ direction: 'rtl' }}
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    <Separator className="my-8" />
                    
                    {/* Tags */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-slate-700 mb-4">الكلمات المفتاحية:</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="hover:bg-primary hover:text-white transition-colors cursor-pointer">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Share Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 font-medium">شارك المقال:</span>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 ml-2" />
                          تويتر
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 ml-2" />
                          لينكدإن
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 ml-2" />
                          واتساب
                        </Button>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4 ml-2" />
                        أعجبني ({post.likes})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Author Info */}
                <Card className="shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                      {post.author.split(' ')[1]?.charAt(0) || 'د'}
                    </div>
                    <h4 className="font-bold text-lg mb-2">{post.author}</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      خبير في مجال {post.category} مع خبرة تزيد عن 15 عاماً في التعليم الأكاديمي والترجمة المتخصصة.
                    </p>
                    <Button variant="outline" className="w-full">
                      عرض المزيد من المقالات
                    </Button>
                  </CardContent>
                </Card>

                {/* Table of Contents */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary" />
                      محتويات المقال
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#intro" className="text-slate-600 hover:text-primary transition-colors">مقدمة</a></li>
                      <li><a href="#importance" className="text-slate-600 hover:text-primary transition-colors">أهمية الترجمة الأكاديمية</a></li>
                      <li><a href="#standards" className="text-slate-600 hover:text-primary transition-colors">معايير الجودة</a></li>
                      <li><a href="#challenges" className="text-slate-600 hover:text-primary transition-colors">التحديات الشائعة</a></li>
                      <li><a href="#best-practices" className="text-slate-600 hover:text-primary transition-colors">أفضل الممارسات</a></li>
                      <li><a href="#conclusion" className="text-slate-600 hover:text-primary transition-colors">الخلاصة</a></li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      مقالات ذات صلة
                    </h4>
                    <div className="space-y-3">
                      <a href="/blog/2" className="block p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <h5 className="font-medium text-sm line-clamp-2">الترجمة الطبية المتخصصة: التحديات والحلول</h5>
                        <p className="text-xs text-slate-500 mt-1">8 دقائق للقراءة</p>
                      </a>
                      <a href="/blog/3" className="block p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <h5 className="font-medium text-sm line-clamp-2">منهجيات البحث العلمي الحديثة</h5>
                        <p className="text-xs text-slate-500 mt-1">15 دقيقة للقراءة</p>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="ml-2 h-4 w-4" />
                العودة للمدونة
              </Link>
            </Button>
            
            <Button asChild>
              <Link to="/blog/2">
                المقال التالي
                <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;