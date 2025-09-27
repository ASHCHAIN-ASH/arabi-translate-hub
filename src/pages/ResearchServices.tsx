import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, FileText, BarChart3, Search, CheckCircle, Layout, Shield, GraduationCap, 
  Database, Cog, Scale, Globe, Users, Award, Brain, Lightbulb, Target, TrendingUp, 
  Star, Zap, Rocket, Trophy, ArrowRight, Clock, CheckCheck, Sparkles, Medal,
  BookMarked, PenTool, FlaskConical, Microscope, Calculator, Eye, FileCheck,
  University, UserCheck, Library, Settings, Crown, Gem, Phone, PlayCircle,
  ChevronRight, Download, MessageCircle, HeartHandshake, Compass, Map
} from "lucide-react";

const ResearchServices = () => {
  const services = [
    {
      id: "thesis-titles",
      title: "اقتراح عناوين رسائل ماجستير ودكتوراه",
      description: "ابتكار عناوين مميزة وقابلة للتطبيق مع خطة بحثية مبدئية شاملة تضمن النجاح الأكاديمي وتواكب أحدث الاتجاهات البحثية العالمية",
      icon: <GraduationCap className="h-8 w-8" />,
      color: "primary",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
      href: "/research/thesis-titles",
      stats: "2000+ عنوان مقترح",
      features: ["عناوين مبتكرة", "خطة أولية", "مراجعة متخصصة", "توجيه أكاديمي"],
      duration: "3-5 أيام"
    },
    {
      id: "research-plan",
      title: "المساعدة في كتابة خطة البحث",
      description: "إعداد خطط بحثية متكاملة تشمل المنهجية العلمية وتصميم البحث بأعلى المعايير الأكاديمية مع الالتزام بمتطلبات الجامعات العالمية",
      icon: <FileText className="h-8 w-8" />,
      color: "secondary",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
      href: "/research/research-plan",
      stats: "1500+ خطة بحثية",
      features: ["منهجية علمية", "تصميم متكامل", "مراجعة أكاديمية", "ضمان الجودة"],
      duration: "7-10 أيام"
    },
    {
      id: "theoretical-framework",
      title: "كتابة الإطار النظري والأدبيات",
      description: "بناء إطار نظري قوي ومتماسك يربط النظريات بمشكلة البحث مع مراجعة شاملة للأدبيات السابقة وتحليل نقدي معمق",
      icon: <BookOpen className="h-8 w-8" />,
      color: "success",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
      href: "/research/theoretical-framework",
      stats: "800+ إطار نظري",
      features: ["مراجعة أدبية", "ربط نظري", "تحليل شامل", "مصادر حديثة"],
      duration: "10-14 يوم"
    },
    {
      id: "statistical-analysis",
      title: "التحليل الإحصائي ومناقشة النتائج",
      description: "تحليل إحصائي متقدم للبيانات باستخدام أحدث البرامج الإحصائية مع كتابة مناقشة علمية عميقة وتفسير احترافي للنتائج",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "primary",
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
      href: "/research/statistical-analysis",
      stats: "1200+ تحليل إحصائي",
      features: ["SPSS & R", "تحليل متقدم", "مناقشة علمية", "رسوم بيانية"],
      duration: "5-8 أيام"
    },
    {
      id: "language-review",
      title: "التدقيق اللغوي والمراجعة الأكاديمية",
      description: "مراجعة لغوية شاملة على يد خبراء متخصصين تشمل التدقيق النحوي والأسلوبي مع تحسين الوضوح والتماسك النصي الأكاديمي",
      icon: <CheckCircle className="h-8 w-8" />,
      color: "secondary",
      gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
      href: "/research/language-review",
      stats: "3000+ مراجعة لغوية",
      features: ["تدقيق شامل", "تحسين أسلوبي", "مراجعة نهائية", "ضمان الجودة"],
      duration: "3-5 أيام"
    },
    {
      id: "formatting",
      title: "تنسيق الرسائل العلمية الاحترافي",
      description: "تنسيق احترافي متكامل للرسائل العلمية وفقاً للمعايير الدولية مع تصميم بصري أنيق يراعي معايير الجامعات العالمية",
      icon: <Layout className="h-8 w-8" />,
      color: "success",
      gradient: "bg-gradient-to-br from-rose-500 to-pink-600",
      href: "/research/formatting",
      stats: "2500+ رسالة منسقة",
      features: ["معايير دولية", "تصميم أنيق", "تنسيق شامل", "جاهز للطباعة"],
      duration: "2-4 أيام"
    }
  ];

  const premiumServices = [
    {
      id: "plagiarism-check",
      title: "فحص السرقة الأدبية المتقدم",
      description: "فحص دقيق ومتقدم للتأكد من الأصالة العلمية باستخدام أحدث الأدوات والتقنيات المتخصصة عالمياً",
      icon: <Shield className="h-8 w-8" />,
      gradient: "bg-gradient-to-br from-amber-500 to-yellow-600",
      href: "/research/plagiarism-check",
      stats: "5000+ فحص أصالة",
      features: ["Turnitin Premium", "تقرير مفصل", "ضمان الأصالة", "استشارة تصحيح"],
      isPremium: true
    },
    {
      id: "admission-services",
      title: "خدمات القبول الجامعي الدولي",
      description: "مساعدة شاملة للحصول على قبولات جامعية ودورات لغة في أفضل المؤسسات التعليمية العالمية المرموقة",
      icon: <Globe className="h-8 w-8" />,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      href: "/research/admission-services",
      stats: "1000+ قبول جامعي",
      features: ["جامعات عالمية", "دورات لغة", "إرشاد شامل", "متابعة كاملة"],
      isPremium: true
    },
    {
      id: "publication",
      title: "نشر الأبحاث في المجلات العلمية",
      description: "مساعدة متكاملة في نشر البحوث في المجلات العلمية المحكمة مع إرشاد متخصص في اختيار المجلة المناسبة",
      icon: <Award className="h-8 w-8" />,
      gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
      href: "/research/publication",
      stats: "400+ بحث منشور",
      features: ["مجلات محكمة", "اختيار مناسب", "متابعة كاملة", "ضمان النشر"],
      isPremium: true
    }
  ];

  const stats = [
    {
      number: "15,000+",
      label: "مشروع بحثي مكتمل",
      icon: <Trophy className="h-8 w-8" />,
      color: "text-blue-600"
    },
    {
      number: "98%",
      label: "معدl رضا العملاء",
      icon: <Star className="h-8 w-8" />,
      color: "text-orange-500"
    },
    {
      number: "500+",
      label: "باحث وأكاديمي متخصص",
      icon: <Users className="h-8 w-8" />,
      color: "text-green-600"
    },
    {
      number: "50+",
      label: "تخصص أكاديمي مغطى",
      icon: <BookOpen className="h-8 w-8" />,
      color: "text-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "د. محمد العلي",
      role: "دكتوراه في إدارة الأعمال - جامعة الملك سعود",
      text: "الخدمة كانت استثنائية بكل المقاييس. ساعدوني في إنجاز رسالة الدكتوراه بجودة عالية وفي الوقت المحدد. فريق محترف ومتعاون.",
      rating: 5,
      avatar: "👨‍🎓"
    },
    {
      name: "أ. فاطمة أحمد",
      role: "ماجستير في التربية - الجامعة الأمريكية",
      text: "فريق محترف جداً ومتفهم لاحتياجات الباحثين. الإطار النظري الذي أعدوه كان شاملاً ومتميزاً وساهم في نجاح رسالتي.",
      rating: 5,
      avatar: "👩‍🎓"
    },
    {
      name: "د. عبدالله السالم",
      role: "دكتوراه في الطب - جامعة هارفارد",
      text: "التحليل الإحصائي كان دقيقاً ومفصلاً بشكل رائع. ساهم بشكل كبير في نجاح بحثي ونشره في مجلة علمية مرموقة.",
      rating: 5,
      avatar: "🩺"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "استشارة مجانية متخصصة",
      description: "جلسة استشارة شاملة مع خبراء أكاديميين لفهم احتياجاتك البحثية وتحديد الخطة المثلى",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      step: "02",
      title: "وضع خطة العمل التفصيلية",
      description: "إعداد خطة عمل مفصلة مع جدول زمني واضح وتحديد المراحل والمسؤوليات",
      icon: <Target className="h-6 w-6" />,
      color: "bg-orange-500"
    },
    {
      step: "03",
      title: "التنفيذ المتقن والمتابعة",
      description: "فريق متخصص من الخبراء ينفذ العمل بأعلى معايير الجودة الأكاديمية مع متابعة مستمرة",
      icon: <Rocket className="h-6 w-6" />,
      color: "bg-green-500"
    },
    {
      step: "04",
      title: "المراجعة والتسليم النهائي",
      description: "مراجعة شاملة متعددة المستويات وتسليم العمل مع ضمان الجودة والدعم المستمر",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "bg-purple-500"
    }
  ];

  const certifications = [
    { name: "ISO 9001:2015", desc: "إدارة الجودة" },
    { name: "Academic Standards", desc: "المعايير الأكاديمية" },
    { name: "Research Ethics", desc: "أخلاقيات البحث" },
    { name: "Quality Assurance", desc: "ضمان الجودة" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Main Logo/Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(147, 51, 234, 0.4)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{
                boxShadow: { duration: 3, repeat: Infinity },
                scale: { duration: 0.3 },
                rotate: { duration: 0.3 }
              }}
            >
              <Brain className="h-16 w-16 text-white" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.span
                className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 100%"
                }}
              >
                مركز ماستر للأبحاث
              </motion.span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                MasterEduPath Research Center
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl max-w-5xl mx-auto mb-12 leading-relaxed text-blue-100/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              🎓 رواد التميز الأكاديمي في العالم العربي - نحول أحلامكم البحثية إلى حقائق علمية مبهرة
              <br />
              <span className="text-lg text-blue-200/80">
                ✨ أكثر من 15,000 مشروع بحثي ناجح | 🌟 98% معدل رضا العملاء | 🏆 500+ خبير متخصص
              </span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl text-xl px-10 py-6 rounded-full font-bold transition-all duration-300 border-0">
                  <Rocket className="h-6 w-6 ml-2" />
                  🚀 ابدأ مشروعك الآن
                  <ChevronRight className="h-5 w-5 mr-2" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/20 backdrop-blur-md text-xl px-10 py-6 rounded-full font-bold transition-all duration-300">
                  <PlayCircle className="h-6 w-6 ml-2" />
                  📹 شاهد قصص النجاح
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Statistics */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 1.7 + index * 0.1,
                    scale: { duration: 0.3 },
                    y: { duration: 0.3 }
                  }}
                >
                  <motion.div 
                    className={`${stat.color} mb-4 flex justify-center`}
                    whileHover={{ rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div 
                    className="text-4xl font-bold mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-blue-200/90 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-32 relative bg-gradient-to-b from-slate-50 via-blue-50/30 to-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Crown className="h-5 w-5" />
              ✨ خدماتنا المتخصصة عالمياً
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-slate-800 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                حلول أكاديمية متكاملة
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              🎯 نقدم مجموعة شاملة من الخدمات الأكاديمية والبحثية المتطورة 
              <br />
              📊 تواكب أحدث المعايير العالمية وتضمن تحقيق أهدافكم العلمية بتميز واحترافية
            </motion.p>
          </motion.div>

          {/* Interactive Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="group h-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  {/* Card Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Floating Badge for Popular Services */}
                  {index < 2 && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-20 shadow-lg"
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      🔥 الأكثر طلباً
                    </motion.div>
                  )}
                  
                  <CardHeader className="text-center relative z-10 pb-4">
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 rounded-3xl ${service.gradient} flex items-center justify-center text-white shadow-xl`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {service.icon}
                    </motion.div>
                    
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-4 leading-snug">
                      {service.title}
                    </CardTitle>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4 bg-slate-50/80 rounded-xl px-4 py-2">
                      <span className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        {service.stats}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        {service.duration}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="text-center relative z-10 pt-0 px-6">
                    <CardDescription className="text-slate-600 mb-6 leading-relaxed text-sm">
                      {service.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {service.features.map((feature, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-slate-700 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-blue-100"
                        >
                          ✓ {feature}
                        </Badge>
                      ))}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        asChild 
                        className={`w-full ${service.gradient} text-white border-0 hover:opacity-90 shadow-lg rounded-full font-bold transition-all duration-300 py-3`}
                      >
                        <a href={service.href} className="flex items-center justify-center gap-2">
                          <Compass className="h-4 w-4" />
                          استكشف الخدمة
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Premium Services Section */}
          <motion.div 
            className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-8 md:p-12 mb-20 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Premium Background Effect */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-200/30 to-red-200/30 rounded-full blur-3xl"
                animate={{ 
                  x: [0, 50, 0],
                  y: [0, -30, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg border border-amber-200"
                  whileHover={{ scale: 1.05 }}
                >
                  <Gem className="h-5 w-5" />
                  👑 خدمات النخبة المميزة
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    خدمات الأكاديميين المتميزين
                  </span>
                </h3>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  🌟 للباحثين الطموحين الذين يسعون للتميز الأكاديمي والنشر الدولي
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {premiumServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2 
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card className="group h-full border-2 border-amber-200/60 hover:border-amber-300 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      {/* Premium Indicator */}
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
                        ⭐ PREMIUM
                      </div>
                      
                      <CardHeader className="text-center pb-4 pt-8">
                        <motion.div 
                          className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${service.gradient} flex items-center justify-center text-white shadow-xl`}
                          whileHover={{ 
                            scale: 1.1,
                            rotate: 10,
                            transition: { duration: 0.3 }
                          }}
                        >
                          {service.icon}
                        </motion.div>
                        <CardTitle className="text-lg font-bold text-slate-800 mb-3 leading-snug">
                          {service.title}
                        </CardTitle>
                        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                          🏆 {service.stats}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="text-center pt-0 px-6">
                        <CardDescription className="text-slate-600 mb-6 text-sm leading-relaxed">
                          {service.description}
                        </CardDescription>
                        
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                          {service.features.map((feature, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="text-xs border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                            >
                              ✓ {feature}
                            </Badge>
                          ))}
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            asChild 
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-bold shadow-lg transition-all duration-300 py-3"
                          >
                            <a href={service.href} className="flex items-center justify-center gap-2">
                              <Medal className="h-4 w-4" />
                              🚀 اطلب الآن
                              <ChevronRight className="h-4 w-4" />
                            </a>
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Process Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/15 rounded-full blur-3xl"
            animate={{ 
              x: [-100, 100, -100],
              y: [-50, 50, -50]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="container relative mx-auto px-4 z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 bg-clip-text text-transparent">
                🎯 رحلتك الأكاديمية معنا
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              📋 نتبع منهجية علمية مدروسة ومثبتة لضمان تحقيق أفضل النتائج الأكاديمية
              <br />
              ⚡ مع أحدث التقنيات والأساليب البحثية المتطورة
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div 
                  className={`w-20 h-20 mx-auto mb-6 ${step.color} rounded-3xl flex items-center justify-center text-white shadow-2xl relative`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                  animate={{
                    boxShadow: [
                      `0 10px 30px ${step.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : 
                                   step.color.includes('orange') ? 'rgba(249, 115, 22, 0.3)' :
                                   step.color.includes('green') ? 'rgba(34, 197, 94, 0.3)' :
                                   'rgba(147, 51, 234, 0.3)'}`,
                      `0 15px 40px ${step.color.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : 
                                   step.color.includes('orange') ? 'rgba(249, 115, 22, 0.4)' :
                                   step.color.includes('green') ? 'rgba(34, 197, 94, 0.4)' :
                                   'rgba(147, 51, 234, 0.4)'}`,
                      `0 10px 30px ${step.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : 
                                   step.color.includes('orange') ? 'rgba(249, 115, 22, 0.3)' :
                                   step.color.includes('green') ? 'rgba(34, 197, 94, 0.3)' :
                                   'rgba(147, 51, 234, 0.3)'}`
                    ]
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  {step.icon}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {step.step}
                </motion.div>
                
                <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
                
                {/* Connection Line for Desktop */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-8 h-0.5 bg-gradient-to-r from-white/40 to-transparent transform translate-x-4"></div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl text-xl px-10 py-6 rounded-full font-bold">
                <Map className="h-6 w-6 ml-2" />
                🗺️ ابدأ رحلتك الأكاديمية الآن
                <ChevronRight className="h-5 w-5 mr-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-slate-800 mb-8">
              شهادات عملائنا المتميزين
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              آراء الباحثين والأكاديميين الذين حققوا النجاح معنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                      <p className="text-sm text-slate-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-arabic-body">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Trust */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-arabic-title font-bold text-slate-800 mb-4">
              شهادات الجودة والاعتماد
            </h3>
            <p className="text-slate-600">نلتزم بأعلى معايير الجودة الأكاديمية العالمية</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{cert.name}</h4>
                <p className="text-sm text-slate-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Animated particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -200, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-bold mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                🚀 ابدأ رحلتك الأكاديمية اليوم
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              🎓 انضم إلى آلاف الباحثين الذين حققوا النجاح الأكاديمي مع خبرائنا المتميزين
              <br />
              <span className="text-lg text-blue-200">
                ✨ نضمن لك التميز الأكاديمي والوصول لأعلى المراتب العلمية
              </span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-8 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-blue-50 shadow-2xl text-xl px-12 py-6 rounded-full font-bold transition-all duration-300"
                >
                  <Sparkles className="h-6 w-6 ml-2" />
                  🎯 احجز استشارة مجانية
                  <ChevronRight className="h-5 w-5 mr-2" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/50 text-white hover:bg-white/20 backdrop-blur-md text-xl px-12 py-6 rounded-full font-bold transition-all duration-300"
                >
                  <MessageCircle className="h-6 w-6 ml-2" />
                  💬 تواصل معنا الآن
                </Button>
              </motion.div>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <Phone className="h-8 w-8 mx-auto mb-4 text-blue-300" />
                <h3 className="font-bold mb-2">📞 اتصل بنا</h3>
                <p className="text-blue-200">متاح 24/7 لخدمتكم</p>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <Download className="h-8 w-8 mx-auto mb-4 text-green-300" />
                <h3 className="font-bold mb-2">📄 احصل على عرض سعر</h3>
                <p className="text-blue-200">مجاني وفوري</p>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <HeartHandshake className="h-8 w-8 mx-auto mb-4 text-purple-300" />
                <h3 className="font-bold mb-2">🤝 ضمان الجودة</h3>
                <p className="text-blue-200">نضمن رضاكم 100%</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default ResearchServices;