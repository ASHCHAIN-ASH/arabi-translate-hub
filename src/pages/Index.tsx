import { Suspense, lazy, memo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import AnimatedCounter from "@/components/AnimatedCounter";
import { 
  Bot, Bell, GraduationCap, BookOpen, Users, Award, 
  ArrowRight, PlayCircle, Building2, Globe, CheckCircle,
  Star, TrendingUp, Shield, Clock, Languages, Target,
  Sparkles, ChevronRight, Zap, Heart, Brain, MessageCircle, Quote
} from "lucide-react";
import { UNIFIED_STATS, STATS_LABELS } from "@/constants/academicStats";
import { InstitutionalPartnershipBanner } from "@/components/InstitutionalPartnershipBanner";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import Footer from "@/components/Footer";

// Import academic service images
import academicTranslationImg from "@/assets/academic-service-translation.jpg";
import academicResearchImg from "@/assets/academic-service-research.jpg";
import academicEditingImg from "@/assets/academic-service-editing.jpg";
import academicPublishingImg from "@/assets/academic-service-publishing.jpg";

// Lazy loading للمكونات الثقيلة لتحسين الأداء
const ServicesShowcase = lazy(() => import("@/components/ServicesShowcase"));
const MasterMembershipBanner = lazy(() => import("@/components/MasterMembershipBanner"));
const ServiceSteps = lazy(() => import("@/components/ServiceSteps"));
const ModernStatsSection = lazy(() => import("@/components/ModernStatsSection"));
const HomeFinancingSection = lazy(() => import("@/components/home/HomeFinancingSection"));


// مكون Loading محسّن
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center py-8 sm:py-12">
    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

const Index = () => {
  const navigate = useNavigate();
  
  // إحصائيات أكاديمية موحدة
  const academicStats = [
    { icon: Users, number: UNIFIED_STATS.studentsServed, suffix: "+", title: STATS_LABELS.studentsServed, color: "from-blue-500 to-indigo-600" },
    { icon: BookOpen, number: UNIFIED_STATS.researchCompleted, suffix: "+", title: STATS_LABELS.researchCompleted, color: "from-emerald-500 to-teal-600" },
    { icon: Globe, number: UNIFIED_STATS.countriesServed, suffix: "+", title: STATS_LABELS.countriesServed, color: "from-purple-500 to-pink-600" },
    { icon: Award, number: UNIFIED_STATS.satisfactionRate, suffix: "%", title: STATS_LABELS.satisfactionRate, color: "from-amber-500 to-orange-600" }
  ];

  // شركاء أكاديميون عالميون
  const academicPartners = [
    { name: "جامعة الملك سعود", nameEn: "King Saud University", icon: GraduationCap, color: "from-blue-600 to-indigo-600" },
    { name: "جامعة الملك عبدالعزيز", nameEn: "King Abdulaziz University", icon: BookOpen, color: "from-emerald-600 to-teal-600" },
    { name: "جامعة هارفارد", nameEn: "Harvard University", icon: Award, color: "from-red-600 to-rose-600" },
    { name: "جامعة أكسفورد", nameEn: "Oxford University", icon: Building2, color: "from-blue-700 to-indigo-700" },
    { name: "معهد MIT", nameEn: "Massachusetts Institute of Technology", icon: Brain, color: "from-purple-600 to-pink-600" },
    { name: "جامعة ستانفورد", nameEn: "Stanford University", icon: Star, color: "from-amber-600 to-orange-600" },
    { name: "جامعة الإمام", nameEn: "Imam University", icon: Users, color: "from-cyan-600 to-blue-600" },
    { name: "جامعة الملك فهد", nameEn: "KFUPM", icon: Zap, color: "from-violet-600 to-purple-600" },
    { name: "جامعة كامبريدج", nameEn: "Cambridge University", icon: CheckCircle, color: "from-green-600 to-emerald-600" },
    { name: "جامعة طوكيو", nameEn: "University of Tokyo", icon: Globe, color: "from-pink-600 to-rose-600" },
    { name: "جامعة سوربون", nameEn: "Sorbonne University", icon: Heart, color: "from-indigo-600 to-blue-600" },
    { name: "جامعة كولومبيا", nameEn: "Columbia University", icon: Target, color: "from-teal-600 to-cyan-600" }
  ];

  // خدمات أكاديمية مع صور حقيقية
  const academicServices = [
    {
      icon: Languages,
      title: "الترجمة الأكاديمية",
      description: "ترجمة احترافية للأبحاث والرسائل العلمية بدقة عالية",
      link: "/translation-services",
      color: "from-blue-600 to-indigo-600",
      image: academicTranslationImg
    },
    {
      icon: Brain,
      title: "خدمات البحث العلمي",
      description: "دعم شامل للباحثين في جميع مراحل البحث العلمي",
      link: "/research-services",
      color: "from-purple-600 to-pink-600",
      image: academicResearchImg
    },
    {
      icon: CheckCircle,
      title: "المراجعة والتدقيق",
      description: "مراجعة لغوية ومنهجية متخصصة للأبحاث العلمية",
      link: "/services/editing-services",
      color: "from-emerald-600 to-teal-600",
      image: academicEditingImg
    },
    {
      icon: Target,
      title: "النشر الأكاديمي",
      description: "مساعدة في نشر الأبحاث في المجلات العلمية المحكمة",
      link: "/research/journal-publication",
      color: "from-amber-600 to-orange-600",
      image: academicPublishingImg
    }
  ];

  // مميزات الجودة
  const qualityFeatures = [
    { icon: Shield, title: "سرية تامة", description: "حماية كاملة لأبحاثك ومعلوماتك" },
    { icon: Clock, title: "التزام بالمواعيد", description: "تسليم دقيق في الوقت المحدد" },
    { icon: Award, title: "جودة مضمونة", description: "معايير أكاديمية عالمية" },
    { icon: Users, title: "فريق متخصص", description: "خبراء أكاديميون في جميع المجالات" }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO 
        title="MasterEduPath - خدمات بحثية وأكاديمية متقدمة | ترجمة ونشر علمي"
        description="وكالة MasterEduPath للحلول التعليمية المتقدمة - خدمات ترجمة أكاديمية، نشر علمي، تحليل إحصائي SPSS، تدقيق لغوي، وخدمات بحثية شاملة للطلاب والباحثين"
        keywords="MasterEduPath, خدمات بحثية, ترجمة أكاديمية, نشر علمي, تدقيق لغوي, تحليل إحصائي SPSS, خدمات أكاديمية, جامعات سعودية, بحث علمي, رسائل ماجستير, رسائل دكتوراه"
        url="https://masteredupath.com/"
        schema={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "MasterEduPath Agency",
          "description": "وكالة متخصصة في تقديم الخدمات الأكاديمية والبحثية للطلاب والباحثين",
          "url": "https://masteredupath.com",
          "logo": "https://masteredupath.com/assets/national-day-logo-original.webp",
          "serviceType": ["Academic Translation", "Research Services", "Statistical Analysis", "Publication Support"],
          "areaServed": "Saudi Arabia",
          "availableLanguage": ["Arabic", "English"]
        }}
      />
      <WorkingHoursBannerRTL />
      
      {/* Alert Banner - AI Service */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-l from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-3 sm:px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/90 to-purple-600/90" />
        <div className="container mx-auto relative">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
            </motion.div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm md:text-base font-semibold mb-0.5">
                🤖 خدمة جديدة: المراجعة المنهجية بالذكاء الاصطناعي
              </p>
              <p className="text-xs sm:text-sm opacity-90 hidden sm:block">
                قم برفع بحثك واحصل على مراجعة شاملة فورية
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
              onClick={() => navigate('/research/ai-methodology-review')}
            >
              <Bot className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              جرب الآن
            </Button>
          </div>
        </div>
      </motion.div>
      
      <Header />
      
      {/* Hero Section - القسم البطل الأكاديمي */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        {/* خلفية متحركة مبسطة */}
        <div className="absolute inset-0 overflow-hidden hidden lg:block pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        {/* شبكة أكاديمية في الخلفية */}
        <div className="absolute inset-0 opacity-5 hidden sm:block">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 49%, hsl(var(--primary)) 49%, hsl(var(--primary)) 51%, transparent 51%),
                linear-gradient(transparent 49%, hsl(var(--primary)) 49%, hsl(var(--primary)) 51%, transparent 51%)
              `,
              backgroundSize: '80px 80px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* المحتوى النصي */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-right"
            >
              {/* شعار الاعتماد */}
              <motion.div
                className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  وكالة معتمدة للحلول الأكاديمية العالمية
                </span>
              </motion.div>

              {/* العنوان الرئيسي */}
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="text-slate-800 dark:text-white">أبحاثك تستحق </span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  الأفضل
                </span>
              </motion.h1>
              
              <motion.h2 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-slate-600 dark:text-slate-300 mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                ترجمة • بحث علمي • نشر أكاديمي • تدقيق لغوي
              </motion.h2>
              
              {/* الوصف */}
              <motion.p 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                أكثر من {UNIFIED_STATS.studentsServed.toLocaleString()} باحث وطالب وثقوا بنا في {UNIFIED_STATS.countriesServed}+ دولة.
                احصل على خدمة احترافية خلال 24 ساعة.
              </motion.p>

              {/* الأزرار */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8 px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-sm sm:text-base px-8"
                  onClick={() => navigate('/order-now')}
                >
                  اطلب خدمتك الآن — مجاناً للاستشارة
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 w-full sm:w-auto text-sm sm:text-base"
                  onClick={() => window.open('https://wa.me/966559600824?text=' + encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم'), '_blank')}
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  تواصل واتساب
                </Button>
              </motion.div>

              {/* مؤشرات الثقة */}
              <motion.div
                className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start px-4 sm:px-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">معتمد دولياً</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">سرية تامة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">جودة مضمونة</span>
                </div>
              </motion.div>
            </motion.div>

            {/* الجانب البصري */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative flex justify-center mt-8 lg:mt-0"
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
                
                {/* الشعار المركزي */}
                <motion.div
                  className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 mx-auto bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      "0 20px 40px -10px rgba(59, 130, 246, 0.4)",
                      "0 20px 40px -10px rgba(99, 102, 241, 0.4)",
                      "0 20px 40px -10px rgba(139, 92, 246, 0.4)",
                      "0 20px 40px -10px rgba(59, 130, 246, 0.4)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="text-center text-white p-4 sm:p-6">
                    <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4" />
                    <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">ماستر إيدو باث</div>
                    <div className="text-sm sm:text-lg opacity-90">للتميز الأكاديمي</div>
                  </div>
                </motion.div>

                {/* عناصر متحركة */}
                {[
                  { icon: BookOpen, position: 'top-2 right-2 sm:top-4 sm:right-4', delay: 0.5, color: 'from-blue-500 to-indigo-500' },
                  { icon: Users, position: 'bottom-2 right-2 sm:bottom-4 sm:right-4', delay: 1, color: 'from-emerald-500 to-teal-500' },
                  { icon: Award, position: 'bottom-2 left-2 sm:bottom-4 sm:left-4', delay: 1.5, color: 'from-amber-500 to-orange-500' },
                  { icon: Building2, position: 'top-2 left-2 sm:top-4 sm:left-4', delay: 2, color: 'from-purple-500 to-pink-500' }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={index}
                      className={`absolute ${item.position} w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${item.color} rounded-xl shadow-lg flex items-center justify-center`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: item.delay }}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* قسم الإحصائيات - مكون محسّن */}
      <Suspense fallback={<LoadingSpinner />}>
        <ModernStatsSection />
      </Suspense>


      {/* قسم الخدمات الأكاديمية */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/30 dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-950 relative overflow-hidden" dir="rtl">
        {/* شبكة الخلفية المتحركة */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0)_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(0,0,0,0)_50%)]"></div>
          <motion.div
            className="absolute top-20 right-[10%] w-64 h-64 sm:w-80 sm:h-80 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-[10%] w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -30, 0],
              y: [0, 20, 0],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-indigo-500/5 dark:bg-indigo-400/3 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* رأس القسم */}
          <motion.div
            className="text-center mb-8 sm:mb-10 lg:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* الشارة */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-l from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-400/10 dark:via-indigo-400/10 dark:to-purple-400/10 rounded-full mb-4 sm:mb-5 border border-blue-200/60 dark:border-blue-800/40 shadow-md backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "backOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                خدماتنا الأكاديمية المتميزة
              </span>
            </motion.div>

            {/* العنوان الرئيسي */}
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-slate-900 dark:text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              حلول أكاديمية{" "}
              <motion.span 
                className="inline-block bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                متكاملة
              </motion.span>
            </motion.h2>

            {/* الوصف */}
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              نقدم مجموعة شاملة من الخدمات الأكاديمية المتخصصة لدعم رحلتك التعليمية والبحثية بأعلى معايير الجودة العالمية
            </motion.p>
          </motion.div>

          {/* شبكة البطاقات المحسّنة والموحدة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mx-auto">
            {academicServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 40, scale: 0.96 }}
                   whileInView={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ 
                     duration: 0.5, 
                     delay: index * 0.08,
                     ease: [0.25, 0.46, 0.45, 0.94]
                   }}
                   viewport={{ once: true, margin: "-50px" }}
                   className="group h-full"
                 >
                   <motion.div
                     whileHover={{ y: -8, scale: 1.01 }}
                     whileTap={{ scale: 0.99 }}
                     transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                     className="h-full"
                   >
                     <Card 
                       className="h-full flex flex-col relative overflow-hidden border-2 border-border/40 hover:border-primary/50 bg-card dark:bg-card/98 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-400 cursor-pointer"
                       onClick={() => navigate(service.link)}
                     >
                       {/* صورة الخدمة - ارتفاع موحد */}
                       <div className="relative h-40 overflow-hidden flex-shrink-0">
                         <img 
                           src={service.image} 
                           alt={service.title}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                         />
                         {/* تدرج فوق الصورة */}
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/95 dark:to-card/98"></div>
                         
                         {/* الأيقونة فوق الصورة - حجم موحد */}
                         <motion.div 
                           className="absolute top-3 right-3"
                           whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                           transition={{ duration: 0.4 }}
                         >
                           <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center shadow-lg border-2 border-white/30 dark:border-white/20`}>
                             <IconComponent className="h-7 w-7 text-white" strokeWidth={2.2} />
                           </div>
                         </motion.div>
                       </div>
                       
                       <CardContent className="p-5 text-right relative z-10 flex flex-col flex-grow">
                         {/* العنوان - حجم موحد */}
                         <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 leading-tight min-h-[3.5rem] flex items-center">
                           {service.title}
                         </h3>
                         
                         {/* الوصف - حجم موحد */}
                         <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3 flex-grow min-h-[4.5rem]">
                           {service.description}
                         </p>
                         
                         {/* زر الإجراء - حجم موحد */}
                         <motion.div
                           whileHover={{ x: -6 }}
                           transition={{ duration: 0.3, ease: "easeOut" }}
                           className="inline-flex mt-auto"
                         >
                           <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl font-semibold text-sm text-primary transition-all duration-300 border border-primary/30 hover:border-primary shadow-sm hover:shadow-md">
                             <span>عرض الخدمات</span>
                             <motion.div
                               animate={{ x: [0, -4, 0] }}
                               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                             >
                               <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                             </motion.div>
                           </div>
                         </motion.div>
                       </CardContent>
                     </Card>
                   </motion.div>
                 </motion.div>
              );
            })}
          </div>

          {/* عبارة تشجيعية */}
          <motion.div
            className="text-center mt-12 sm:mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6">
              اختر الخدمة المناسبة لك وابدأ رحلتك الأكاديمية معنا
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate('/contact-us')}
              >
                <span>تواصل معنا الآن</span>
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* قسم مميزات الجودة */}
      <section className="py-16 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              لماذا نحن الخيار الأمثل؟
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              نلتزم بأعلى معايير الجودة الأكاديمية العالمية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
                        <IconComponent className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-white/80 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* قسم الشركاء الأكاديميين */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-200 dark:border-amber-700 rounded-full text-amber-700 dark:text-amber-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Building2 className="h-4 w-4" />
              شركاؤنا حول العالم
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-800 dark:text-white">
              شراكات أكاديمية{" "}
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                عالمية
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              نفخر بشراكتنا مع أرقى الجامعات والمؤسسات الأكاديمية حول العالم
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {academicPartners.map((partner, index) => {
              const IconComponent = partner.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.08, y: -8 }}
                  className="group"
                >
                  <Card className="h-full bg-white dark:bg-slate-800 hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden cursor-pointer">
                    {/* خلفية تفاعلية */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <CardContent className="p-6 text-center relative">
                      {/* الأيقونة */}
                      <motion.div 
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${partner.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </motion.div>
                      
                      {/* الاسم */}
                      <h3 className="text-sm font-bold mb-1 text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {partner.name}
                      </h3>
                      
                      {/* الاسم الإنجليزي */}
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {partner.nameEn}
                      </p>

                      {/* علامة التحقق */}
                      <motion.div 
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* إحصائية الشراكات */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full text-white shadow-lg">
              <Building2 className="h-5 w-5" />
              <span className="font-bold text-lg">200+ جامعة ومؤسسة شريكة حول العالم</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Institutional Partnership Banner */}
      <InstitutionalPartnershipBanner />

      {/* قسم آراء العملاء - Social Proof */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30" dir="rtl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-current" />
              تقييم 4.9/5 من عملائنا
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-3">
              ماذا يقول عملاؤنا؟
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">آراء حقيقية من باحثين وطلاب استفادوا من خدماتنا</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "د. أحمد المنصور", role: "باحث دكتوراه - جامعة الملك سعود", text: "خدمة التحليل الإحصائي كانت ممتازة. الفريق تعامل مع بياناتي بدقة عالية وسلموني النتائج قبل الموعد المحدد.", rating: 5 },
              { name: "سارة العتيبي", role: "طالبة ماجستير - جامعة الملك عبدالعزيز", text: "ترجمة بحثي تمت بجودة أكاديمية رائعة. المترجم كان متخصصاً في مجالي وفهم المصطلحات العلمية بشكل دقيق.", rating: 5 },
              { name: "م. خالد الحربي", role: "باحث - مركز الأبحاث الوطني", text: "نشرت بحثي في مجلة Scopus بفضل مساعدتهم في التدقيق والتنسيق. خدمة احترافية من البداية للنهاية.", rating: 5 }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all bg-white dark:bg-slate-800">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-blue-200 mb-2" />
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                      {testimonial.text}
                    </p>
                    <div className="border-t pt-3">
                      <p className="font-bold text-sm text-slate-800 dark:text-white">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Inquiry Form - Lead Capture */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">احصل على استشارة مجانية</h2>
              <p className="text-lg text-white/90 mb-8">أخبرنا عن مشروعك وسنتواصل معك خلال ساعة واحدة</p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <input
                type="text"
                placeholder="الاسم"
                className="px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <input
                type="tel"
                placeholder="رقم الجوال"
                className="px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                dir="ltr"
              />
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 font-bold shadow-xl"
                onClick={() => navigate('/contact-us')}
              >
                أرسل طلبك
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </motion.div>
            <p className="text-xs text-white/60 mt-4">
              <Shield className="h-3 w-3 inline ml-1" />
              معلوماتك محمية بالكامل ولن يتم مشاركتها
            </p>
          </div>
        </div>
      </section>

      {/* Suspense Sections مع Lazy Loading */}
      <Suspense fallback={<LoadingSpinner />}>
        <MasterMembershipBanner />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ServiceSteps />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ServicesShowcase />
      </Suspense>

      {/* قسم Master PayLater — تمويل أكاديمي تفاعلي */}
      <Suspense fallback={<LoadingSpinner />}>
        <HomeFinancingSection />
      </Suspense>

      {/* Call to Action النهائي */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-indigo-600/50 to-purple-600/50"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 15, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              هل أنت مستعد للبدء؟
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف الباحثين والطلاب الذين اختاروا التميز الأكاديمي معنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-slate-100 shadow-xl text-lg px-8"
                onClick={() => navigate('/order-now')}
              >
                اطلب خدمتك الآن
                <ArrowRight className="h-5 w-5 mr-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8"
                onClick={() => navigate('/contact-us')}
              >
                تواصل معنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default Index;