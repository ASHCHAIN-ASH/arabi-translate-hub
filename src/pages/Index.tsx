import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import AnimatedCounter from "@/components/AnimatedCounter";
import { 
  Bot, Bell, GraduationCap, BookOpen, Users, Award, 
  ArrowRight, PlayCircle, Building2, Globe, CheckCircle,
  Star, TrendingUp, Shield, Clock, Languages, Target,
  Sparkles, ChevronRight, Zap, Heart, Brain
} from "lucide-react";

// Lazy loading للمكونات الثقيلة لتحسين الأداء
const ServicesShowcase = lazy(() => import("@/components/ServicesShowcase"));
const MasterMembershipBanner = lazy(() => import("@/components/MasterMembershipBanner"));
const ServiceSteps = lazy(() => import("@/components/ServiceSteps"));

// مكون Loading بسيط
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  
  // إحصائيات أكاديمية موحدة
  const academicStats = [
    { icon: Users, number: 50000, suffix: "+", title: "طالب وباحث", color: "from-blue-500 to-indigo-600" },
    { icon: BookOpen, number: 25000, suffix: "+", title: "بحث علمي مكتمل", color: "from-emerald-500 to-teal-600" },
    { icon: Globe, number: 120, suffix: "+", title: "دولة حول العالم", color: "from-purple-500 to-pink-600" },
    { icon: Award, number: 98, suffix: "%", title: "نسبة الرضا", color: "from-amber-500 to-orange-600" }
  ];

  // شركاء أكاديميون
  const academicPartners = [
    { name: "جامعة الملك سعود", logo: "/assets/universities/ksu-logo.png" },
    { name: "جامعة الملك عبدالعزيز", logo: "/assets/universities/kau-logo.png" },
    { name: "جامعة الإمام", logo: "/assets/universities/imamu-logo.png" },
    { name: "جامعة الملك فهد", logo: "/assets/universities/kfupm-logo.png" },
    { name: "جامعة الفيصل", logo: "/assets/universities/alfaisal-logo.png" },
    { name: "جامعة عفت", logo: "/assets/universities/effat-logo.png" }
  ];

  // خدمات أكاديمية
  const academicServices = [
    {
      icon: Languages,
      title: "الترجمة الأكاديمية",
      description: "ترجمة احترافية للأبحاث والرسائل العلمية بدقة عالية",
      link: "/translation-services",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: Brain,
      title: "خدمات البحث العلمي",
      description: "دعم شامل للباحثين في جميع مراحل البحث العلمي",
      link: "/research-services",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: CheckCircle,
      title: "المراجعة والتدقيق",
      description: "مراجعة لغوية ومنهجية متخصصة للأبحاث العلمية",
      link: "/services/academic-writing",
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: Target,
      title: "النشر الأكاديمي",
      description: "مساعدة في نشر الأبحاث في المجلات العلمية المحكمة",
      link: "/research/journal-publication",
      color: "from-amber-600 to-orange-600"
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
      <WorkingHoursBannerRTL />
      
      {/* Alert Banner - AI Service */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-l from-blue-600 to-purple-600 text-white py-3 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/90 to-purple-600/90" />
        <div className="container mx-auto relative">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300" />
            </motion.div>
            <div className="flex-1">
              <p className="text-base sm:text-lg font-semibold mb-1">
                🤖 خدمة جديدة: المراجعة المنهجية بالذكاء الاصطناعي
              </p>
              <p className="text-xs sm:text-sm opacity-90">
                قم برفع بحثك واحصل على مراجعة شاملة فورية
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => navigate('/research/ai-methodology-review')}
            >
              <Bot className="ml-2 h-4 w-4" />
              جرب الآن
            </Button>
          </div>
        </div>
      </motion.div>
      
      <Header />
      
      {/* Hero Section - القسم البطل الأكاديمي */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          />
        </div>

        {/* شبكة أكاديمية في الخلفية */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 49%, hsl(var(--primary)) 49%, hsl(var(--primary)) 51%, transparent 51%),
                linear-gradient(transparent 49%, hsl(var(--primary)) 49%, hsl(var(--primary)) 51%, transparent 51%)
              `,
              backgroundSize: '100px 100px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* المحتوى النصي */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-right"
            >
              {/* شعار الاعتماد */}
              <motion.div
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  وكالة معتمدة للحلول الأكاديمية العالمية
                </span>
              </motion.div>

              {/* العنوان الرئيسي */}
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="text-slate-800 dark:text-white">وكالة </span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ماستر إيدو باث
                </span>
              </motion.h1>
              
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-medium text-slate-600 dark:text-slate-300 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                MasterEduPath Agency
              </motion.h2>
              
              {/* الوصف */}
              <motion.p 
                className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                شريكك الموثوق في التعليم العالي والبحث العلمي. نقدم حلولاً أكاديمية متطورة ومعتمدة للجامعات والمراكز البحثية والطلاب المتميزين في أكثر من 120 دولة حول العالم.
              </motion.p>

              {/* الأزرار */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/order-now')}
                >
                  ابدأ رحلتك التعليمية
                  <ArrowRight className="h-5 w-5 mr-2" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <PlayCircle className="h-5 w-5 ml-2" />
                  شاهد عرضنا التقديمي
                </Button>
              </motion.div>

              {/* مؤشرات الثقة */}
              <motion.div
                className="flex flex-wrap gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">معتمد دولياً</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">سرية تامة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-600" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">جودة مضمونة</span>
                </div>
              </motion.div>
            </motion.div>

            {/* الجانب البصري */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex justify-center"
            >
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
                
                {/* الشعار المركزي */}
                <motion.div
                  className="relative w-64 h-64 lg:w-72 lg:h-72 mx-auto bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center"
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
                  <div className="text-center text-white p-6">
                    <GraduationCap className="h-16 w-16 mx-auto mb-4" />
                    <div className="text-2xl font-bold mb-2">ماستر إيدو باث</div>
                    <div className="text-lg opacity-90">للتميز الأكاديمي</div>
                  </div>
                </motion.div>

                {/* عناصر متحركة */}
                {[
                  { icon: BookOpen, position: 'top-4 right-4', delay: 0.5, color: 'from-blue-500 to-indigo-500' },
                  { icon: Users, position: 'bottom-4 right-4', delay: 1, color: 'from-emerald-500 to-teal-500' },
                  { icon: Award, position: 'bottom-4 left-4', delay: 1.5, color: 'from-amber-500 to-orange-500' },
                  { icon: Building2, position: 'top-4 left-4', delay: 2, color: 'from-purple-500 to-pink-500' }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={index}
                      className={`absolute ${item.position} w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl shadow-lg flex items-center justify-center`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: item.delay }}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* قسم الإحصائيات الأكاديمية */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {academicStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">
                        <AnimatedCounter end={stat.number} suffix={stat.suffix} duration={2.5} />
                      </div>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                        {stat.title}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* قسم الخدمات الأكاديمية */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-teal-950 dark:to-cyan-950 relative overflow-hidden">
        {/* خلفية زخرفية */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* العنوان */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200 dark:border-blue-700 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-4 w-4" />
              خدماتنا الأكاديمية المتميزة
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-white">
              حلول أكاديمية{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                متكاملة
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات الأكاديمية المتخصصة لدعم رحلتك التعليمية والبحثية
            </p>
          </motion.div>

          {/* شبكة الخدمات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 cursor-pointer"
                    onClick={() => navigate(service.link)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 mb-4 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                        اعرف المزيد
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-800 dark:text-white">
              شركاؤنا الأكاديميون
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              نفخر بشراكتنا مع أفضل الجامعات والمؤسسات الأكاديمية
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {academicPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/university-placeholder.png';
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Suspense Sections */}
      <Suspense fallback={<LoadingSpinner />}>
        <MasterMembershipBanner />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ServiceSteps />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ServicesShowcase />
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
    </div>
  );
};

export default Index;