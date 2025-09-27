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
        <p>تعتبر الترجمة الأكاديمية من أهم التحديات التي تواجه الباحثين والمترجمين المتخصصين في العصر الحديث. فمع تزايد الحاجة لتبادل المعرفة العلمية عبر الحدود اللغوية والثقافية، أصبح من الضروري وضع معايير دقيقة تضمان جودة الترجمة الأكاديمية وتحافظ على الدقة العلمية للمحتوى المترجم.</p>

        <h2>أهمية الترجمة الأكاديمية في العصر الحديث</h2>
        <p>في عالم يشهد تطوراً علمياً متسارعاً، تلعب الترجمة الأكاديمية دوراً محورياً في نشر البحوث العلمية وتسهيل التعاون البحثي بين الجامعات العالمية.</p>

        <h2>معايير الجودة في الترجمة الأكاديمية</h2>
        <p>لضمان تحقيق أعلى معايير الجودة في الترجمة الأكاديمية، يجب التركيز على الدقة المصطلحية والحفاظ على الأسلوب الأكاديمي.</p>

        <h2>الخلاصة</h2>
        <p>الترجمة الأكاديمية مهارة متخصصة تتطلب مزيجاً من الخبرة اللغوية والمعرفة العلمية.</p>
      `
    },
    {
      id: 2,
      title: "الترجمة الطبية المتخصصة: التحديات والحلول المبتكرة",
      excerpt: "استكشف عالم الترجمة الطبية وتعرف على أحدث التقنيات والممارسات المعتمدة عالمياً لضمان دقة ترجمة النصوص الطبية والصيدلانية.",
      author: "د. سارة الطبية",
      date: "2024-01-18",
      category: "ترجمة طبية",
      readTime: "10 دقائق",
      image: medicalTranslationImg,
      tags: ["طب", "ترجمة", "تخصص", "دقة"],
      views: 1920,
      likes: 156,
      content: `
        <p>تعد الترجمة الطبية من أكثر أنواع الترجمة تعقيداً ودقة، حيث تتطلب فهماً عميقاً للمصطلحات الطبية والعلمية المتخصصة.</p>

        <h2>أهمية الترجمة الطبية</h2>
        <p>في عالم الطب، الدقة هي مسألة حياة أو موت. لذلك تتطلب الترجمة الطبية مستوى عالياً من الدقة والتخصص.</p>

        <h2>التحديات الأساسية</h2>
        <p>تواجه الترجمة الطبية تحديات عديدة منها المصطلحات المعقدة والتطورات العلمية المستمرة.</p>
      `
    },
    {
      id: 3,
      title: "الترجمة القانونية: دليل المترجم المحترف",
      excerpt: "تعلم أصول الترجمة القانونية وأهم المبادئ والقواعد التي يجب اتباعها لضمان الدقة القانونية واللغوية في الوثائق الرسمية.",
      author: "أ. أحمد القانوني",
      date: "2024-01-15",
      category: "ترجمة قانونية",
      readTime: "15 دقيقة",
      image: legalTranslationImg,
      tags: ["قانون", "وثائق", "ترجمة", "رسمي"],
      views: 2100,
      likes: 189,
      content: `
        <p>الترجمة القانونية تتطلب دقة متناهية وفهماً عميقاً للأنظمة القانونية في كلا اللغتين المصدر والهدف.</p>

        <h2>خصائص الترجمة القانونية</h2>
        <p>تتميز الترجمة القانونية بطبيعتها الحساسة والحاجة إلى الدقة المطلقة في نقل المعاني القانونية.</p>
      `
    },
    {
      id: 4,
      title: "الترجمة التقنية: تقنيات حديثة ومهارات متقدمة",
      excerpt: "اكتشف أسرار الترجمة التقنية الناجحة وتعرف على أهم الأدوات والتقنيات المستخدمة في ترجمة النصوص التقنية والهندسية.",
      author: "م. خالد التقني",
      date: "2024-01-12",
      category: "ترجمة تقنية",
      readTime: "11 دقيقة",
      image: technicalTranslationImg,
      tags: ["تقنية", "هندسة", "أدوات", "تخصص"],
      views: 1750,
      likes: 134,
      content: `
        <p>الترجمة التقنية تتطلب فهماً عميقاً للمفاهيم التقنية والهندسية بالإضافة إلى المهارات اللغوية المتقدمة.</p>

        <h2>مجالات الترجمة التقنية</h2>
        <p>تشمل الترجمة التقنية مجالات متنوعة مثل الهندسة وتكنولوجيا المعلومات والطيران.</p>
      `
    },
    {
      id: 5,
      title: "منهجيات البحث العلمي الحديثة: دليل الباحث المتميز",
      excerpt: "تعرف على أحدث منهجيات البحث العلمي المعتمدة في الجامعات العالمية وكيفية تطبيقها لإنتاج بحوث علمية متميزة.",
      author: "د. فاطمة الباحثة",
      date: "2024-01-10",
      category: "بحث علمي",
      readTime: "18 دقيقة",
      image: researchMethodsImg,
      tags: ["بحث", "منهجية", "علمي", "جامعات"],
      views: 3200,
      likes: 287,
      content: `
        <p>منهجيات البحث العلمي هي الأساس الذي يقوم عليه أي بحث علمي جيد ومعتمد أكاديمياً.</p>

        <h2>أنواع مناهج البحث</h2>
        <p>تتنوع مناهج البحث العلمي بين الكمية والنوعية والمختلطة، ولكل منها مميزاتها وتطبيقاتها.</p>
      `
    },
    {
      id: 6,
      title: "الترجمة التجارية: استراتيجيات النجاح في الأسواق العالمية",
      excerpt: "اكتشف كيفية إتقان الترجمة التجارية وأهم الاستراتيجيات المطلوبة للنجاح في ترجمة المحتوى التجاري والتسويقي.",
      author: "أ. نور التجارية",
      date: "2024-01-08",
      category: "ترجمة تجارية",
      readTime: "9 دقائق",
      image: businessTranslationImg,
      tags: ["تجارة", "أعمال", "تسويق", "عالمي"],
      views: 1650,
      likes: 128,
      content: `
        <p>الترجمة التجارية تتطلب فهماً عميقاً للثقافة التجارية والممارسات التسويقية في الأسواق المختلفة.</p>

        <h2>خصائص الترجمة التجارية</h2>
        <p>تتميز الترجمة التجارية بالحاجة إلى مراعاة الجوانب الثقافية والتسويقية للجمهور المستهدف.</p>
      `
    },
    {
      id: 7,
      title: "فن الكتابة الأكاديمية: من الفكرة إلى النشر",
      excerpt: "تعلم أساسيات الكتابة الأكاديمية المتميزة وكيفية تطوير مهاراتك في كتابة البحوث والمقالات العلمية بمعايير عالمية.",
      author: "د. علي الكاتب",
      date: "2024-01-05",
      category: "كتابة أكاديمية",
      readTime: "14 دقيقة",
      image: academicWritingImg,
      tags: ["كتابة", "أكاديمي", "بحث", "نشر"],
      views: 2800,
      likes: 234,
      content: `
        <p>الكتابة الأكاديمية فن يتطلب مهارات خاصة في التعبير العلمي والأسلوب الأكاديمي المتميز.</p>

        <h2>عناصر الكتابة الأكاديمية</h2>
        <p>تشمل الكتابة الأكاديمية الوضوح والدقة والموضوعية والاستناد إلى المصادر الموثوقة.</p>
      `
    },
    {
      id: 8,
      title: "النشر في المجلات العلمية المحكمة: خطوات النجاح",
      excerpt: "دليل شامل للنشر في المجلات العلمية المحكمة مع نصائح عملية لزيادة فرص قبول بحثك وتجنب الأخطاء الشائعة.",
      author: "د. مريم الناشرة",
      date: "2024-01-03",
      category: "نشر علمي",
      readTime: "16 دقيقة",
      image: journalPublicationImg,
      tags: ["نشر", "مجلات", "علمي", "محكم"],
      views: 2950,
      likes: 278,
      content: `
        <p>النشر في المجلات العلمية المحكمة يتطلب إعداداً دقيقاً ومعرفة عميقة بمعايير النشر العالمية.</p>

        <h2>خطوات النشر العلمي</h2>
        <p>تبدأ عملية النشر العلمي باختيار المجلة المناسبة وتنتهي بمتابعة عملية التحكيم والنشر.</p>
      `
    },
    {
      id: 9,
      title: "التحليل الإحصائي للبحوث: أدوات وتقنيات متقدمة",
      excerpt: "تعرف على أهم أدوات وتقنيات التحليل الإحصائي المستخدمة في البحوث العلمية وكيفية تطبيقها بشكل صحيح.",
      author: "د. عبدالله الإحصائي",
      date: "2024-01-01",
      category: "تحليل إحصائي",
      readTime: "13 دقيقة",
      image: statisticalAnalysisImg,
      tags: ["إحصاء", "تحليل", "بيانات", "SPSS"],
      views: 2200,
      likes: 195,
      content: `
        <p>التحليل الإحصائي يشكل العمود الفقري للبحث العلمي الكمي ويتطلب فهماً عميقاً للطرق الإحصائية.</p>

        <h2>أدوات التحليل الإحصائي</h2>
        <p>تتنوع أدوات التحليل الإحصائي من البرامج البسيطة إلى الأنظمة المتقدمة مثل SPSS وR.</p>
      `
    },
    {
      id: 10,
      title: "مراجعة الأدبيات: دليل الباحث المحترف",
      excerpt: "تعلم كيفية إجراء مراجعة أدبيات شاملة ومنهجية للبحوث السابقة وتحديد الفجوات البحثية بطريقة علمية.",
      author: "د. هند المراجعة",
      date: "2023-12-28",
      category: "مراجعة أدبيات",
      readTime: "17 دقيقة",
      image: literatureReviewImg,
      tags: ["أدبيات", "مراجعة", "بحث", "منهجية"],
      views: 2650,
      likes: 221,
      content: `
        <p>مراجعة الأدبيات جزء أساسي من أي بحث علمي وتتطلب منهجية واضحة ودقة في التحليل.</p>

        <h2>خطوات مراجعة الأدبيات</h2>
        <p>تبدأ مراجعة الأدبيات بتحديد المصادر المناسبة وتنتهي بتحليل شامل للدراسات السابقة.</p>
      `
    },
    {
      id: 11,
      title: "الدفاع عن الرسالة: استراتيجيات النجاح والتميز",
      excerpt: "نصائح وإرشادات عملية لإعداد دفاع ناجح عن رسالة الماجستير أو الدكتوراه مع تقنيات العرض الفعال.",
      author: "د. يوسف المشرف",
      date: "2023-12-25",
      category: "دفاع رسالة",
      readTime: "12 دقيقة",
      image: thesisDefenseImg,
      tags: ["دفاع", "رسالة", "ماجستير", "دكتوراه"],
      views: 3100,
      likes: 298,
      content: `
        <p>الدفاع عن الرسالة محطة مهمة في المسيرة الأكاديمية وتتطلب إعداداً جيداً وثقة بالنفس.</p>

        <h2>التحضير للدفاع</h2>
        <p>يشمل التحضير للدفاع مراجعة شاملة للرسالة وإعداد العرض التقديمي والتدرب على الإجابة على الأسئلة.</p>
      `
    },
    {
      id: 12,
      title: "فحص الانتحال الأكاديمي: أدوات وتقنيات الكشف",
      excerpt: "تعرف على أهمية فحص الانتحال الأكاديمي وأحدث الأدوات والتقنيات المستخدمة لضمان الأصالة العلمية.",
      author: "د. ليلى النزاهة",
      date: "2023-12-22",
      category: "نزاهة أكاديمية",
      readTime: "8 دقائق",
      image: plagiarismCheckImg,
      tags: ["انتحال", "نزاهة", "فحص", "أصالة"],
      views: 1800,
      likes: 167,
      content: `
        <p>فحص الانتحال الأكاديمي ضرورة أساسية لضمان النزاهة العلمية والحفاظ على جودة البحث العلمي.</p>

        <h2>أدوات فحص الانتحال</h2>
        <p>تتنوع أدوات فحص الانتحال من البرامج المجانية إلى الأنظمة المتقدمة المستخدمة في الجامعات.</p>
      `
    },
    {
      id: 13,
      title: "التنسيق الأكاديمي: معايير APA وMLA وشيكاغو",
      excerpt: "دليل شامل لأهم أنظمة التنسيق الأكاديمي العالمية مع أمثلة عملية وقواعد التطبيق الصحيح.",
      author: "أ. رانيا المنسقة",
      date: "2023-12-20",
      category: "تنسيق أكاديمي",
      readTime: "11 دقيقة",
      image: academicFormattingImg,
      tags: ["تنسيق", "APA", "MLA", "أكاديمي"],
      views: 2400,
      likes: 201,
      content: `
        <p>التنسيق الأكاديمي جزء لا يتجزأ من البحث العلمي ويتطلب دقة في تطبيق القواعد والمعايير.</p>

        <h2>أنظمة التنسيق الأكاديمي</h2>
        <p>تختلف أنظمة التنسيق الأكاديمي حسب التخصص والمجال العلمي، وأشهرها APA وMLA وشيكاغو.</p>
      `
    },
    {
      id: 14,
      title: "المؤتمرات الأكاديمية: فرص التطوير والتشبيك المهني",
      excerpt: "اكتشف أهمية المشاركة في المؤتمرات الأكاديمية وكيفية الاستفادة القصوى من هذه الفرص للتطوير المهني.",
      author: "د. سامي المؤتمرات",
      date: "2023-12-18",
      category: "مؤتمرات أكاديمية",
      readTime: "10 دقائق",
      image: academicConferencesImg,
      tags: ["مؤتمرات", "تطوير", "تشبيك", "أكاديمي"],
      views: 1950,
      likes: 178,
      content: `
        <p>المؤتمرات الأكاديمية منصة مهمة لتبادل المعرفة والخبرات والتطوير المهني للباحثين والأكاديميين.</p>

        <h2>فوائد المشاركة في المؤتمرات</h2>
        <p>تشمل فوائد المشاركة في المؤتمرات التطوير المهني وبناء الشبكات العلمية وعرض البحوث.</p>
      `
    },
    {
      id: 15,
      title: "الذكاء الاصطناعي في الترجمة: المستقبل والتحديات",
      excerpt: "استكشف دور الذكاء الاصطناعي في مجال الترجمة والتطورات المستقبلية المتوقعة مع التحديات والفرص الجديدة.",
      author: "د. تامر التقنية",
      date: "2023-12-15",
      category: "ذكاء اصطناعي",
      readTime: "13 دقيقة",
      image: aiTranslationImg,
      tags: ["ذكاء اصطناعي", "ترجمة", "تقنية", "مستقبل"],
      views: 3500,
      likes: 342,
      content: `
        <p>الذكاء الاصطناعي يحدث ثورة في مجال الترجمة ويفتح آفاقاً جديدة للدقة والسرعة في الترجمة.</p>

        <h2>تطبيقات الذكاء الاصطناعي</h2>
        <p>تشمل تطبيقات الذكاء الاصطناعي في الترجمة الترجمة الآلية والمساعدة في الترجمة وتحليل النصوص.</p>
      `
    }
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