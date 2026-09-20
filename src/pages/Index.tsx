import { Suspense, lazy, memo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import { 
  GraduationCap, BookOpen, Users, Award, 
  ArrowRight, PlayCircle, Building2, Globe, CheckCircle,
  Star, TrendingUp, Shield, Clock, Languages, Target,
  Sparkles, ChevronRight, Zap, Heart, Brain, MessageCircle, Quote
} from "lucide-react";
import { InstitutionalPartnershipBanner } from "@/components/InstitutionalPartnershipBanner";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import Footer from "@/components/Footer";
import { InteractiveAcademicSystems } from "@/components/home/InteractiveAcademicSystems";
import { TwinklingStars } from "@/components/home/TwinklingStars";
import { JournalPublishingBanner } from "@/components/home/JournalPublishingBanner";

// Import academic service images
import academicTranslationImg from "@/assets/academic-service-translation.jpg";
import academicResearchImg from "@/assets/academic-service-research.jpg";
import academicEditingImg from "@/assets/academic-service-editing.jpg";
import academicPublishingImg from "@/assets/academic-service-publishing.jpg";
import ServicesShowcase from "@/components/ServicesShowcase";

// Real photography for supporting sections and testimonials
import heroCollabImg from "@/assets/home-students-collaboration.jpg";
import testimonialProfessorImg from "@/assets/home-testimonial-professor.jpg";
import testimonialStudentFemaleImg from "@/assets/home-testimonial-student-female.jpg";
import testimonialResearcherMaleImg from "@/assets/home-testimonial-researcher-male.jpg";
import partnershipHandshakeImg from "@/assets/home-partnership-handshake.jpg";
import qualityResearcherImg from "@/assets/home-quality-researcher.jpg";
import qualityResearchDetailImg from "@/assets/home-quality-research-detail.jpg";
import inquiryTeamImg from "@/assets/home-inquiry-team.jpg";

// Lazy loading للمكونات الثقيلة لتحسين الأداء
// const ServicesShowcase = lazy(() => import("@/components/ServicesShowcase")); // القسم محذوف مؤقتًا — الكود محفوظ
const FekrahEduMembershipBanner = lazy(() => import("@/components/FekrahEduMembershipBanner"));
const ServiceSteps = lazy(() => import("@/components/ServiceSteps"));



// مكون Loading محسّن
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center py-8 sm:py-12">
    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

const Index = () => {
  const navigate = useNavigate();
  

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
        title="FekrahEdu | خدمات بحثية وأكاديمية متقدمة — ترجمة، نشر علمي، تحليل SPSS"
        description="وكالة FekrahEdu الأكاديمية: ترجمة بحثية احترافية، نشر علمي في مجلات Scopus وISI، تحليل إحصائي SPSS، تدقيق لغوي، ودعم رسائل الماجستير والدكتوراه. استشارة مجانية خلال ساعة."
        keywords="FekrahEdu, FekrahEdu, خدمات بحثية, ترجمة أكاديمية, نشر علمي, Scopus, ISI, تدقيق لغوي, تحليل إحصائي, SPSS, AMOS, جامعات سعودية, بحث علمي, رسائل ماجستير, رسائل دكتوراه, خدمات أكاديمية السعودية"
        url="https://fekrahedu.com/"
        image="https://fekrahedu.com/fekrahedu-share.jpg?v=1"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FekrahEdu",
            "alternateName": "FekrahEdu",
            "url": "https://fekrahedu.com/",
            "inLanguage": "ar-SA",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://fekrahedu.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "FekrahEdu Agency",
            "alternateName": "FekrahEdu",
            "description": "وكالة متخصصة في تقديم الخدمات الأكاديمية والبحثية للطلاب والباحثين",
            "url": "https://fekrahedu.com/",
            "logo": "https://fekrahedu.com/fekrah-logo.jpg",
            "image": "https://fekrahedu.com/fekrahedu-share.jpg?v=1",
            "telephone": "+966593799355",
            "email": "info@fekrahedu.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "جدة",
              "addressRegion": "مكة المكرمة",
              "addressCountry": "SA"
            },
            "areaServed": ["SA", "AE", "KW", "QA", "BH", "OM", "EG", "JO"],
            "availableLanguage": ["Arabic", "English"],
            "serviceType": [
              "Academic Translation",
              "Research Services",
              "Statistical Analysis",
              "Publication Support",
              "Proofreading",
              "Thesis Support"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "12800",
              "bestRating": "5",
              "worstRating": "1"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "خدمات FekrahEdu الأكاديمية",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "الترجمة الأكاديمية",
                "url": "https://fekrahedu.com/translation-services"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "خدمات البحث العلمي",
                "url": "https://fekrahedu.com/research-services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "المراجعة والتدقيق اللغوي",
                "url": "https://fekrahedu.com/services/editing-services"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "النشر الأكاديمي",
                "url": "https://fekrahedu.com/research/journal-publication"
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "الرئيسية",
                "item": "https://fekrahedu.com/"
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "ما هي الخدمات التي تقدمها وكالة FekrahEdu؟",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "نقدم ترجمة أكاديمية احترافية، نشر علمي في مجلات Scopus وISI، تحليل إحصائي SPSS وAMOS، تدقيق لغوي، وخدمات شاملة لرسائل الماجستير والدكتوراه."
                }
              },
              {
                "@type": "Question",
                "name": "كم تستغرق الخدمات لدى FekrahEdu؟",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "نلتزم بأسرع تسليم في السوق — ابتداءً من 24 ساعة لمعظم الخدمات حسب حجم العمل ومتطلباته."
                }
              },
              {
                "@type": "Question",
                "name": "هل خدماتكم سرية وآمنة؟",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "نعم، نلتزم بسرية تامة وحماية كاملة لجميع أبحاثك ومعلوماتك الشخصية وفق معايير دولية معتمدة."
                }
              },
              {
                "@type": "Question",
                "name": "هل يوجد ضمان جودة على الخدمات؟",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "نعم، جميع خدماتنا تخضع لمعايير أكاديمية عالمية ISO 9001:2015 مع ضمان مراجعات مجانية حتى الرضا التام."
                }
              },
              {
                "@type": "Question",
                "name": "كيف أحصل على استشارة مجانية؟",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "تواصل معنا عبر الواتساب على +966593799355 أو املأ نموذج الاستشارة في الموقع وسيرد عليك أحد خبرائنا خلال 60 دقيقة."
                }
              }
            ]
          }
        ]}
      />
      <WorkingHoursBannerRTL />
      
      {/* Alert Banner - عجلة الجوائز */}
      <motion.div
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
          className="bg-deep-violet-dark text-deep-violet-foreground py-2 sm:py-3 px-3 sm:px-4 relative overflow-hidden border-b border-deep-violet-glow/40"
          style={{
            background:
              "radial-gradient(120% 180% at 50% -70%, hsl(var(--deep-violet-glow)) 0%, hsl(var(--deep-violet)) 45%, hsl(var(--deep-violet-dark)) 100%)",
          }}
       >
         <div className="absolute inset-0 bg-gradient-to-l from-deep-violet-dark/60 via-transparent to-deep-violet-dark/60" />
         <div className="container mx-auto relative">
           <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
             <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
               <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-deep-violet-foreground" />
             </motion.div>
             <div className="flex-1">
                <p className="text-xs sm:text-sm md:text-base font-semibold mb-0.5 text-deep-violet-foreground">
                  <TwinklingStars />
                  بمناسبة تطوير الموقع وانطلاقته التجريبية — هدية مجانية عبر عجلة الجوائز
                </p>
               <p className="text-xs sm:text-sm text-deep-violet-foreground/80 hidden sm:block">
                 مزايا وخدمات تدعم رحلتك الأكاديمية — جرّب حظك الآن واكتشف جائزتك!
               </p>
             </div>
             <Button 
               variant="secondary" 
               size="sm"
               className="bg-deep-violet-foreground hover:bg-deep-violet-foreground/90 text-deep-violet border border-deep-violet-foreground/30 font-bold text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
               onClick={() => navigate('/spin-the-wheel')}
             >
               <Sparkles className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 text-deep-violet" />
              جرّب حظك الآن
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
                نلتزم بأعلى معايير الجودة الأكاديمية ونضع نجاحك في صدارة أولوياتنا.
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
                  onClick={() => window.open('https://wa.me/966593799355?text=' + encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم'), '_blank')}
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

            {/* الجانب البصري — منظومة أكاديمية تفاعلية */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="group relative flex justify-center mt-8 lg:mt-0"
            >
              <div className="relative w-[min(88vw,360px)] sm:w-full sm:max-w-[430px] lg:max-w-[520px] aspect-[4/5] lg:aspect-[5/6]">
                {/* وهج خلفي */}
                <div className="absolute -inset-6 bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-purple-400/30 dark:from-blue-500/20 dark:via-indigo-500/15 dark:to-purple-500/20 rounded-[2rem] blur-3xl" />

                <InteractiveAcademicSystems />

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <JournalPublishingBanner />
      <ServicesShowcase />

      {/* قسم مميزات الجودة - مخفي مؤقتًا */}
      {false && (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white relative overflow-hidden">
        {/* خلفية صورة بـ Parallax */}
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img
            src={qualityResearchDetailImg}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/95 via-purple-950/85 to-slate-900/95" />
        </motion.div>

        {/* عناصر زخرفية */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], x: [0, -40, 0] }}
            transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* الصورة الجانبية الحقيقية */}
            <motion.div
              className="lg:col-span-5 order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <div className="aspect-[4/5]">
                  <motion.img
                    src={qualityResearcherImg}
                    alt="باحثة سعودية تحمل شهادة التخرج بفخر"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-900/70 via-transparent to-transparent" />

                  {/* بطاقة شهادة عائمة */}
                  <motion.div
                    className="absolute bottom-5 right-5 left-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">شهادة جودة معتمدة</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">ISO 9001:2015</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* المحتوى والمميزات */}
            <motion.div
              className="lg:col-span-7 order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-5"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span className="text-xs sm:text-sm font-semibold text-white/90">الخيار الأمثل للأكاديميين</span>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
                لماذا يثق بنا{" "}
                <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">
                  15,000+ باحث؟
                </span>
              </h2>
              <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
                نلتزم بأعلى معايير الجودة الأكاديمية العالمية ونضع نجاحك في صدارة أولوياتنا
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {qualityFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="group relative p-4 sm:p-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-amber-300/40 rounded-2xl transition-all duration-300 cursor-default"
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/50"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent className="h-6 w-6 text-white" strokeWidth={2.2} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold mb-1 text-white group-hover:text-amber-200 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* قسم الشركاء الأكاديميين - مخفي مؤقتًا */}
      {false && (
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

          {/* بانر صورة شراكة حقيقية */}
          <motion.div
            className="mt-12 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <div className="aspect-[16/7] sm:aspect-[16/6] relative">
                <motion.img
                  src={partnershipHandshakeImg}
                  alt="شراكة بين FekrahEdu ومؤسسات أكاديمية - مصافحة نجاح"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/50 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="px-6 sm:px-10 lg:px-14 max-w-xl">
                    <motion.div
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 backdrop-blur-md border border-amber-300/40 rounded-full text-amber-200 text-xs sm:text-sm font-medium mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      شراكات استراتيجية
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                      200+ جامعة ومؤسسة <span className="text-amber-300">يثقون بنا</span>
                    </h3>
                    <p className="text-sm sm:text-base text-blue-100/90 mb-4">
                      نعمل يداً بيد مع كبرى المؤسسات الأكاديمية لتقديم أفضل الحلول
                    </p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span>اعتماد دولي • شفافية كاملة • التزام بالمواعيد</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* Institutional Partnership Banner */}
      <InstitutionalPartnershipBanner />

      {/* قسم آراء العملاء - Social Proof - مخفي مؤقتًا */}
      {false && (
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
              { name: "د. أحمد المنصور", role: "باحث دكتوراه - جامعة الملك سعود", text: "خدمة التحليل الإحصائي كانت ممتازة. الفريق تعامل مع بياناتي بدقة عالية وسلموني النتائج قبل الموعد المحدد.", rating: 5, image: testimonialProfessorImg, accent: "from-blue-500 to-indigo-600" },
              { name: "سارة العتيبي", role: "طالبة ماجستير - جامعة الملك عبدالعزيز", text: "ترجمة بحثي تمت بجودة أكاديمية رائعة. المترجم كان متخصصاً في مجالي وفهم المصطلحات العلمية بشكل دقيق.", rating: 5, image: testimonialStudentFemaleImg, accent: "from-rose-500 to-pink-600" },
              { name: "م. خالد الحربي", role: "باحث - مركز الأبحاث الوطني", text: "نشرت بحثي في مجلة Scopus بفضل مساعدتهم في التدقيق والتنسيق. خدمة احترافية من البداية للنهاية.", rating: 5, image: testimonialResearcherMaleImg, accent: "from-emerald-500 to-teal-600" }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800 overflow-hidden">
                  {/* صورة العميل - بانر علوي */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent`} />
                    {/* النجوم على الصورة */}
                    <div className="absolute top-3 right-3 flex gap-0.5 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {/* الاسم على الصورة */}
                    <div className="absolute bottom-3 right-3 left-3 text-white">
                      <p className="font-bold text-base drop-shadow-lg">{testimonial.name}</p>
                      <p className="text-xs opacity-90 drop-shadow">{testimonial.role}</p>
                    </div>
                  </div>

                  <CardContent className="p-5 relative">
                    <Quote className={`absolute top-2 left-2 h-8 w-8 text-transparent bg-gradient-to-br ${testimonial.accent} bg-clip-text opacity-30`} />
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pt-2">
                      "{testimonial.text}"
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">عميل موثّق</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}


      {/* Quick Inquiry Form - Lead Capture بصورة فريق حقيقية - مخفي مؤقتًا */}
      {false && (
      <section className="py-16 sm:py-20 relative overflow-hidden text-white" dir="rtl">
        {/* خلفية صورة فريق حقيقي مع Parallax */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img
            src={inquiryTeamImg}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-indigo-950/95 via-blue-900/85 to-cyan-900/80" />
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            {/* النص الترويجي */}
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/20 backdrop-blur-md border border-amber-300/40 rounded-full text-amber-200 text-sm font-semibold mb-5"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Zap className="h-4 w-4" />
                استشارة مجانية خلال ساعة
              </motion.div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                فريقنا الأكاديمي{" "}
                <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">
                  بانتظارك
                </span>
              </h2>
              <p className="text-base sm:text-lg text-white/85 mb-6 leading-relaxed">
                أخبرنا عن مشروعك وسيتواصل معك خبير متخصص لتقديم الحل المناسب — بدون أي التزام
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>ردّ خلال 60 دقيقة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span>سرية تامة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <span>بدون التزام</span>
                </div>
              </div>
            </motion.div>

            {/* بطاقة النموذج */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      placeholder="اكتب اسمك"
                      className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">رقم الجوال</label>
                    <input
                      type="tel"
                      placeholder="05xxxxxxxx"
                      className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
                      dir="ltr"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold shadow-xl text-base py-6"
                      onClick={() => navigate('/contact-us')}
                    >
                      احجز استشارتك المجانية الآن
                      <ArrowRight className="h-5 w-5 mr-2" />
                    </Button>
                  </motion.div>
                  <p className="text-xs text-white/60 text-center">
                    <Shield className="h-3 w-3 inline ml-1" />
                    معلوماتك محمية بالكامل ولن يتم مشاركتها
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Suspense Sections مع Lazy Loading */}
      <Suspense fallback={<LoadingSpinner />}>
        <FekrahEduMembershipBanner />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ServiceSteps />
      </Suspense>

      {/* قسم الخدمات — محذوف بناءً على طلب العميل */}

      {/* كاروسيل قصص النجاح — مخفي مؤقتًا */}

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default Index;