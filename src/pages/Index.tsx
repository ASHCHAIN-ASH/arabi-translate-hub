import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import TranslationStudio from "@/components/TranslationStudio";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Users, 
  Globe, 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowLeft,
  PlayCircle,
  Award,
  Sparkles,
  Rocket,
  Building2,
  TrendingUp,
  Briefcase,
  Settings,
  Target,
  Languages,
  FileText,
  MessageSquare,
  Headphones,
  BookOpen,
  Mic,
  Monitor
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const Index = () => {

  const features = [
    {
      icon: Languages,
      title: "ترجمة متعددة اللغات",
      description: "نغطي أكثر من 150 لغة عالمية بدقة احترافية وجودة عالية",
      gradient: "from-primary to-primary-light",
      shadowColor: "shadow-primary"
    },
    {
      icon: Shield,
      title: "أمان وخصوصية",
      description: "معايير الأمان العالمية مع حماية كاملة للبيانات الحساسة",
      gradient: "from-accent to-accent-light",
      shadowColor: "shadow-success"
    },
    {
      icon: Zap,
      title: "سرعة فائقة",
      description: "تقنيات ذكاء اصطناعي متطورة لترجمة سريعة ودقيقة",
      gradient: "from-secondary to-secondary-light",
      shadowColor: "shadow-secondary"
    },
    {
      icon: Award,
      title: "جودة مضمونة",
      description: "ضمان دقة 99.9% مع مراجعة بشرية من خبراء لغويين معتمدين",
      gradient: "from-primary-dark to-accent",
      shadowColor: "shadow-medium"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مدير شركة",
      rating: 5,
      text: "خدمة ممتازة وسريعة، ترجمة دقيقة وفي الوقت المحدد. أنصح بها بشدة.",
      avatar: "👨‍💼"
    },
    {
      name: "فاطمة علي",
      role: "محامية",
      rating: 5,
      text: "استخدمت الموقع لترجمة وثائق قانونية، النتيجة كانت احترافية جداً.",
      avatar: "👩‍💼"
    },
    {
      name: "محمد العتيبي",
      role: "أكاديمي",
      rating: 5,
      text: "أفضل منصة ترجمة استخدمتها، سهولة في الاستخدام ودقة في النتائج.",
      avatar: "👨‍🎓"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* قسم Hero */}
      <section className="relative min-h-screen lg:min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* الخلفية المتحركة والديناميكية */}
        <AnimatedBackground />
        
        {/* طبقة إضافية للتحكم في الشفافية */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-dark/70 to-accent/60" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div 
            className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Languages className="h-8 w-8 sm:h-10 lg:h-12 w-10 lg:w-12 text-white/90" />
                <motion.div
                  className="absolute inset-0 bg-secondary/30 rounded-full blur-xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <Badge className="bg-white/15 text-white border-white/30 backdrop-blur-md px-3 py-2 sm:px-4 lg:px-6 text-sm sm:text-base lg:text-lg font-bold">
                <Sparkles className="h-4 w-4 sm:h-5 lg:h-6 ml-2 text-secondary" />
                منصة الترجمة الاحترافية
              </Badge>
              
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Globe className="h-8 w-8 sm:h-10 lg:h-12 w-10 lg:w-12 text-white/90" />
                <motion.div
                  className="absolute inset-0 bg-accent/30 rounded-full blur-xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-arabic-title font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
                transition={{ duration: 0.2 }}
              >
                مركز الخبراء
              </motion.span>
              <br />
              <motion.span
                className="text-white/90 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl block mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                للحلول التقنية المتقدمة
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 font-light leading-relaxed max-w-5xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              منصة الترجمة الاحترافية الرائدة عالمياً. نوفر خدمات ترجمة متطورة 
              بتقنيات الذكاء الاصطناعي وفريق من المترجمين المحترفين المعتمدين.
              <br className="hidden sm:block" />
              <span className="text-white/80 text-sm sm:text-base lg:text-lg block sm:inline mt-2 sm:mt-0">
                أكثر من 150 لغة • خدمة 24/7 • ضمان الجودة المطلقة
              </span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 lg:mt-12 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/95 shadow-2xl px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl font-bold rounded-xl lg:rounded-2xl"
                >
                  <Rocket className="h-5 w-5 sm:h-6 lg:h-7 mr-2 sm:mr-3" />
                  ابدأ مشروعك الآن
                  <ArrowLeft className="h-5 w-5 sm:h-6 lg:h-7 mr-2 sm:mr-3" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-2 border-white/60 text-white hover:bg-white/15 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl backdrop-blur-md rounded-xl lg:rounded-2xl"
                >
                  <PlayCircle className="h-5 w-5 sm:h-6 lg:h-7 ml-2 sm:ml-3" />
                  جولة تفاعلية
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* قسم الإحصائيات التفاعلي */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-muted/20 via-background to-muted/30 relative overflow-hidden">
        {/* خلفية تفاعلية */}
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_70%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-primary text-white border-0 px-6 py-2 text-lg font-bold mb-4 shadow-primary">
              ✨ إحصائياتنا المذهلة
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-arabic-title font-bold mb-4">
              أرقام تتحدث عن <span className="text-gradient">نجاحنا</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              إنجازات حقيقية ونتائج ملموسة حققناها مع عملائنا حول العالم
            </p>
          </motion.div>

          <StatsSection />
        </div>
      </section>

      {/* أنواع الترجمات */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-arabic-title font-bold mb-4">
              أنواع <span className="text-gradient">الترجمات</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              نقدم جميع أنواع خدمات الترجمة المتخصصة لتلبية احتياجاتكم المختلفة
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                title: "الترجمة القانونية", 
                desc: "ترجمة العقود والوثائق القانونية", 
                icon: "⚖️",
                route: "/legal-translation",
                color: "from-blue-500 to-blue-600"
              },
              { 
                title: "الترجمة الطبية", 
                desc: "ترجمة التقارير والأبحاث الطبية", 
                icon: "🏥",
                route: "/medical-translation",
                color: "from-green-500 to-green-600"
              },
              { 
                title: "الترجمة التقنية", 
                desc: "ترجمة المستندات التقنية والهندسية", 
                icon: "⚙️",
                route: "/technical-translation",
                color: "from-purple-500 to-purple-600"
              },
              { 
                title: "الترجمة التجارية", 
                desc: "ترجمة المراسلات والتقارير التجارية", 
                icon: "💼",
                route: "/business-translation",
                color: "from-orange-500 to-orange-600"
              },
              { 
                title: "الترجمة الأكاديمية", 
                desc: "ترجمة الأبحاث والرسائل العلمية", 
                icon: "🎓",
                route: "/academic-translation",
                color: "from-indigo-500 to-indigo-600"
              },
              { 
                title: "الترجمة الأدبية", 
                desc: "ترجمة الكتب والنصوص الأدبية", 
                icon: "📚",
                route: "/literary-translation",
                color: "from-pink-500 to-pink-600"
              },
              { 
                title: "الترجمة الإعلامية", 
                desc: "ترجمة المقالات والأخبار", 
                icon: "📰",
                route: "/media-translation",
                color: "from-red-500 to-red-600"
              },
              { 
                title: "الترجمة الفورية", 
                desc: "ترجمة فورية للمؤتمرات والاجتماعات", 
                icon: "🎤",
                route: "/live-translation",
                color: "from-teal-500 to-teal-600"
              }
            ].map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer"
              >
                <Card className="group text-center hover-lift bg-gradient-card shadow-soft border-0 overflow-hidden relative h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-15 transition-all duration-500`} />
                  <CardContent className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 lg:space-y-6 relative z-10 h-full flex flex-col justify-between">
                    <div className="relative">
                      <motion.div 
                        className="mb-3 sm:mb-4 flex justify-center"
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: [0, -5, 5, -5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <div className="text-4xl sm:text-5xl lg:text-6xl">
                          {type.icon}
                        </div>
                      </motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="w-16 h-16 sm:w-20 lg:w-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0, 0.6, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold group-hover:text-primary transition-colors duration-300 leading-tight">
                        {type.title}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                        {type.desc}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs sm:text-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 hover:shadow-lg transform group-hover:scale-105"
                      onClick={() => window.location.href = type.route}
                    >
                      <span className="flex items-center gap-2">
                        المزيد
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowLeft className="h-3 w-3 sm:h-4 lg:h-5" />
                        </motion.div>
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* المزايا الرئيسية للشركات */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
        {/* خلفية هندسية متحركة */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
             backgroundImage: `
               linear-gradient(45deg, hsl(var(--primary)) 1px, transparent 1px),
               linear-gradient(-45deg, hsl(var(--accent)) 1px, transparent 1px)
             `,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-arabic-title font-bold mb-4 sm:mb-6 px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              لماذا تثق بنا <span className="text-gradient-secondary">الشركات الرائدة؟</span>
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              حلول متطورة ومخصصة للمؤسسات الكبرى والشركات متعددة الجنسيات
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="cursor-pointer group"
                >
                  <Card className={`relative overflow-hidden border-0 ${feature.shadowColor} bg-gradient-to-br from-white to-muted/30 hover:shadow-2xl transition-all duration-500 h-full`}>
                    {/* تأثير التدرج المتحرك */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <CardContent className="p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 relative z-10">
                      <motion.div 
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div 
                          className={`w-16 h-16 sm:w-20 lg:w-24 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                          whileHover={{ 
                            rotate: [0, -5, 5, -5, 0],
                            scale: 1.1
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent className="h-8 w-8 sm:h-10 lg:h-12 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-arabic-title font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                            {feature.title}
                          </h3>
                        </div>
                      </motion.div>
                      
                      <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
                        {feature.description}
                      </p>
                      
                      {/* مؤشر التفاعل */}
                      <motion.div
                        className="flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2 sm:pt-4"
                        initial={{ x: -10 }}
                        whileInView={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm sm:text-base">اعرف المزيد</span>
                        <ArrowLeft className="h-4 w-4 sm:h-5 lg:h-6" />
                      </motion.div>
                    </CardContent>
                    
                    {/* تأثير الإضاءة المتحركة */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* قسم الخدمات */}
      <ServicesSection />

      {/* استوديو الترجمة التفاعلي */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background via-primary/5 to-accent/5 relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 lg:w-24 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/2 right-10 sm:right-20 w-24 h-24 sm:w-32 lg:w-40 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute bottom-10 sm:bottom-20 left-1/3 w-20 h-20 sm:w-24 lg:w-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse delay-500" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="order-2 sm:order-1"
              >
                <Sparkles className="h-6 w-6 sm:h-8 lg:h-10 text-primary" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-arabic-title font-bold order-1 sm:order-2 text-center px-4">
                استوديو <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">الترجمة</span> التفاعلي
              </h2>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="order-3"
              >
                <Rocket className="h-6 w-6 sm:h-8 lg:h-10 text-accent" />
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-5xl mx-auto leading-relaxed px-4"
            >
              تجربة ترجمة ثورية مع تحليل ذكي للملفات، حساب دقيق للتكاليف، ومعاينة فورية للنتائج.
              <br className="hidden sm:block" />
              <span className="text-primary font-medium block sm:inline mt-2 sm:mt-0">اسحب، أفلت، وشاهد السحر يحدث!</span>
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
              <TranslationStudio />
            </div>
          </motion.div>
        </div>
      </section>

      {/* آراء العملاء */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-arabic-title font-bold mb-4 px-4">
              ماذا يقول <span className="text-gradient">عملاؤنا</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 shadow-soft animate-fade-in-up h-full"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 lg:space-y-6 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-2xl sm:text-3xl lg:text-4xl">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base lg:text-lg">{testimonial.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 sm:h-4 lg:h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base flex-1">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* دعوة للعمل النهائية */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-arabic-title font-bold px-4">
              هل أنت مستعد للبدء؟
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 leading-relaxed px-4 max-w-3xl mx-auto">
              انضم إلى آلاف العملاء الذين يثقون في خدماتنا. احصل على ترجمة احترافية الآن!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-strong px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl font-bold"
              >
                احصل على عرض سعر
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/10 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl"
              >
                تواصل مع فريق المبيعات
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;