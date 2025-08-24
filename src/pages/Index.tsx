import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";

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
  Monitor,
  Scale,
  Stethoscope,
  Cog,
  GraduationCap,
  Newspaper,
  Radio
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const Index = () => {

  const features = [
    {
      icon: GraduationCap,
      title: "خبرة أكاديمية متخصصة",
      description: "فريق من الأكاديميين وحملة الدكتوراه المتخصصين في جميع المجالات العلمية والبحثية",
      gradient: "from-emerald-500 to-emerald-600",
      shadowColor: "shadow-emerald-200",
      bgPattern: "academic"
    },
    {
      icon: BookOpen,
      title: "منهجية علمية متطورة",
      description: "نتبع أحدث المعايير الدولية في البحث العلمي والكتابة الأكاديمية وفقاً لأفضل الممارسات العالمية",
      gradient: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-200",
      bgPattern: "research"
    },
    {
      icon: Languages,
      title: "ترجمة أكاديمية متعددة اللغات",
      description: "ترجمة متخصصة للأوراق البحثية والرسائل الجامعية في أكثر من 180 لغة بدقة علمية عالية",
      gradient: "from-purple-500 to-purple-600",
      shadowColor: "shadow-purple-200",
      bgPattern: "translation"
    },
    {
      icon: Award,
      title: "ضمان الجودة والتميز",
      description: "معدل رضا 99.8% مع ضمان النجاح وإعادة التعديل مجاناً حتى تحقيق أعلى معايير الجودة المطلوبة",
      gradient: "from-amber-500 to-amber-600",
      shadowColor: "shadow-amber-200",
      bgPattern: "quality"
    },
    {
      icon: Shield,
      title: "سرية وأمان مطلق",
      description: "حماية كاملة للمعلومات الشخصية والبحثية مع التزام صارم بمعايير الخصوصية الأكاديمية",
      gradient: "from-teal-500 to-teal-600",
      shadowColor: "shadow-teal-200",
      bgPattern: "security"
    },
    {
      icon: Clock,
      title: "التزام بالمواعيد النهائية",
      description: "تسليم دقيق في الوقت المحدد مع إمكانية التسليم العاجل خلال 24-48 ساعة حسب الحاجة",
      gradient: "from-rose-500 to-rose-600",
      shadowColor: "shadow-rose-200",
      bgPattern: "timing"
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
        
        {/* طبقة التدرج المحسنة */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/80 to-accent/70" />
        
        {/* شبكة ديناميكية خلفية */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            animation: 'move 20s linear infinite'
          }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div 
            className="max-w-7xl mx-auto space-y-8 lg:space-y-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* شارة العلامة التجارية */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-4 mb-8"
            >
              <motion.div
                className="relative mb-4"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="relative">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <GraduationCap className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-secondary/30 rounded-full blur-xl"
                    animate={{ 
                      scale: [1, 1.5, 1], 
                      opacity: [0.5, 0.8, 0.5] 
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <Badge className="bg-white/15 text-white border-white/30 backdrop-blur-md px-6 py-3 text-lg font-bold shadow-lg">
                  <Sparkles className="h-5 w-5 ml-2 text-secondary animate-pulse" />
                  وكالة الحلول التعليمية الرائدة
                  <Award className="h-5 w-5 mr-2 text-yellow-300 animate-pulse" />
                </Badge>
              </motion.div>
            </motion.div>
            
            {/* العنوان الرئيسي */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-arabic-title font-bold leading-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  className="inline-block bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  وكالة ماستر إيدو باث
                </motion.span>
              </motion.h1>
              
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white/95"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                للحلول التعليمية المتقدمة
              </motion.h2>
              
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white/85">
                  MasterEduPath Agency
                </h3>
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/75">
                  Advanced Educational Solutions
                </h4>
              </motion.div>
            </motion.div>
            
            {/* الوصف */}
            <motion.div 
              className="max-w-5xl mx-auto space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 font-light leading-relaxed">
                المؤسسة التعليمية الرائدة عالمياً في تقديم الحلول التعليمية المتكاملة
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/85 leading-relaxed">
                نُمكّن الطلاب والجامعيين والمهنيين من تحقيق أهدافهم التعليمية والمهنية بأعلى معايير الجودة العالمية
              </p>
              
              {/* مميزات سريعة */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                {[
                  { icon: Award, text: "برامج معتمدة دولياً", color: "text-yellow-300" },
                  { icon: Users, text: "دعم مستمر 24/7", color: "text-green-300" },
                  { icon: Globe, text: "خدمات عالمية", color: "text-blue-300" },
                  { icon: Shield, text: "ضمان الجودة", color: "text-purple-300" }
                ].map(({ icon: Icon, text, color }, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="text-white/90 text-sm font-medium">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* الأزرار المحسنة */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  className="group w-full sm:w-auto bg-white text-primary hover:bg-white/95 shadow-2xl px-8 py-6 text-xl font-bold rounded-2xl border-2 border-transparent hover:border-white/20 transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-3"
                  >
                    <Rocket className="h-6 w-6" />
                  </motion.div>
                  ابدأ رحلتك التعليمية الآن
                  <ArrowLeft className="h-6 w-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group w-full sm:w-auto bg-white/20 border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-xl backdrop-blur-md rounded-2xl shadow-2xl font-bold transition-all duration-300"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-3"
                  >
                    <PlayCircle className="h-6 w-6" />
                  </motion.div>
                  استكشف خدماتنا
                  <Monitor className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </motion.div>
            </motion.div>

            {/* أزرار إضافية للخدمات السريعة */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              {[
                { icon: BookOpen, text: "البرامج الأكاديمية", href: "#academic" },
                { icon: Briefcase, text: "التطوير المهني", href: "#professional" },
                { icon: MessageSquare, text: "الاستشارات", href: "#consulting" }
              ].map(({ icon: Icon, text, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-2 bg-white/5 hover:bg-white/15 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <Icon className="h-5 w-5 text-white/80 group-hover:text-white transition-colors duration-300" />
                  <span className="text-white/80 group-hover:text-white text-sm font-medium transition-colors duration-300">{text}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* مؤشر التمرير */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/60"
          >
            <span className="text-sm mb-2">اكتشف المزيد</span>
            <motion.div
              animate={{ rotate: 180 }}
              className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 rotate-90" />
            </motion.div>
          </motion.div>
        </motion.div>
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
              لماذا تختارنا <span className="text-gradient-secondary">المؤسسات الأكاديمية الرائدة؟</span>
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              حلول تعليمية وبحثية متطورة مخصصة للجامعات والمراكز البحثية والطلاب المتميزين حول العالم
            </motion.p>

            {/* إضافة عناصر تصميمية أكاديمية */}
            <motion.div
              className="flex items-center justify-center gap-8 mt-8 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                { icon: GraduationCap, text: "تعليم عالي", color: "text-emerald-500" },
                { icon: BookOpen, text: "بحث علمي", color: "text-blue-500" },
                { icon: Languages, text: "ترجمة أكاديمية", color: "text-purple-500" },
                { icon: Award, text: "جودة مضمونة", color: "text-amber-500" }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center gap-2 group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${item.color.split('-')[1]}-100/50 to-${item.color.split('-')[1]}-200/50 border-2 border-${item.color.split('-')[1]}-200/30 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <IconComponent className={`h-8 w-8 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
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
                   <Card className={`relative overflow-hidden border-2 border-transparent ${feature.shadowColor} bg-gradient-to-br from-white via-white to-muted/20 hover:shadow-2xl hover:border-primary/10 transition-all duration-500 h-full group-hover:bg-gradient-to-br group-hover:from-white group-hover:via-background/50 group-hover:to-muted/30`}>
                     {/* نمط خلفية أكاديمي متحرك */}
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                       {feature.bgPattern === 'academic' && (
                         <div className="w-full h-full" style={{
                           backgroundImage: `radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)`
                         }} />
                       )}
                       {feature.bgPattern === 'research' && (
                         <div className="w-full h-full" style={{
                           backgroundImage: `linear-gradient(45deg, rgba(59, 130, 246, 0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(59, 130, 246, 0.05) 25%, transparent 25%)`
                         }} />
                       )}
                       {feature.bgPattern === 'translation' && (
                         <div className="w-full h-full" style={{
                           backgroundImage: `radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.1) 1px, transparent 0)`
                         }} />
                       )}
                       {feature.bgPattern === 'quality' && (
                         <div className="w-full h-full" style={{
                           backgroundImage: `conic-gradient(from 45deg, rgba(245, 158, 11, 0.05), transparent, rgba(245, 158, 11, 0.05))`
                         }} />
                       )}
                       {feature.bgPattern === 'security' && (
                         <div className="w-full h-full" style={{
                           backgroundImage: `repeating-linear-gradient(45deg, rgba(20, 184, 166, 0.03) 0px, rgba(20, 184, 166, 0.03) 2px, transparent 2px, transparent 10px)`
                         }} />
                       )}
                       {feature.bgPattern === 'timing' && (
                         <div className="w-full h-full" style={{
                           backgroundImage: `radial-gradient(ellipse at center, rgba(244, 63, 94, 0.08) 0%, transparent 70%)`
                         }} />
                       )}
                     </div>
                     
                     {/* خط علوي ملون */}
                     <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                     
                     <CardContent className="p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 relative z-10">
                       <motion.div 
                         className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6"
                         whileHover={{ scale: 1.02 }}
                         transition={{ duration: 0.2 }}
                       >
                         <motion.div 
                           className={`w-20 h-20 sm:w-24 lg:w-28 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl flex-shrink-0 border-4 border-white group-hover:border-background transition-colors duration-300`}
                           whileHover={{ 
                             rotate: [0, -3, 3, -3, 0],
                             scale: 1.05
                           }}
                           transition={{ duration: 0.6 }}
                         >
                           <IconComponent className="h-10 w-10 sm:h-12 lg:h-14 text-white drop-shadow-lg" />
                         </motion.div>
                         <div className="flex-1">
                           <h3 className="text-xl sm:text-2xl lg:text-3xl font-arabic-title font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight mb-2">
                             {feature.title}
                           </h3>
                           <motion.div
                             className={`w-16 h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-50 group-hover:opacity-100 group-hover:w-24 transition-all duration-300`}
                             initial={{ width: 64 }}
                             whileInView={{ width: 96 }}
                             transition={{ duration: 0.4, delay: index * 0.1 }}
                           />
                         </div>
                       </motion.div>
                       
                       <div className="space-y-4">
                         <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                           {feature.description}
                         </p>
                         
                         {/* إضافة مميزات فرعية */}
                         <div className="flex flex-wrap gap-2 pt-2">
                           {feature.bgPattern === 'academic' && ['PhD خبراء', 'اعتماد دولي', 'مراجعة دقيقة'].map((tag, i) => (
                             <span key={i} className="px-3 py-1 bg-emerald-100/80 text-emerald-700 rounded-full text-xs font-medium">
                               {tag}
                             </span>
                           ))}
                           {feature.bgPattern === 'research' && ['منهجية علمية', 'معايير دولية', 'تحديث مستمر'].map((tag, i) => (
                             <span key={i} className="px-3 py-1 bg-blue-100/80 text-blue-700 rounded-full text-xs font-medium">
                               {tag}
                             </span>
                           ))}
                           {feature.bgPattern === 'translation' && ['180+ لغة', 'دقة علمية', 'متخصصون'].map((tag, i) => (
                             <span key={i} className="px-3 py-1 bg-purple-100/80 text-purple-700 rounded-full text-xs font-medium">
                               {tag}
                             </span>
                           ))}
                           {feature.bgPattern === 'quality' && ['ضمان 99.8%', 'مراجعة مجانية', 'معايير عالية'].map((tag, i) => (
                             <span key={i} className="px-3 py-1 bg-amber-100/80 text-amber-700 rounded-full text-xs font-medium">
                               {tag}
                             </span>
                           ))}
                           {feature.bgPattern === 'security' && ['حماية مطلقة', 'سرية تامة', 'أمان متقدم'].map((tag, i) => (
                             <span key={i} className="px-3 py-1 bg-teal-100/80 text-teal-700 rounded-full text-xs font-medium">
                               {tag}
                             </span>
                           ))}
                           {feature.bgPattern === 'timing' && ['تسليم دقيق', '24-48 ساعة', 'مواعيد محددة'].map((tag, i) => (
                             <span key={i} className="px-3 py-1 bg-rose-100/80 text-rose-700 rounded-full text-xs font-medium">
                               {tag}
                             </span>
                           ))}
                         </div>
                       </div>
                       
                       {/* مؤشر التفاعل المحسن */}
                       <motion.div
                         className="flex items-center justify-between pt-4 border-t border-muted/20 group-hover:border-primary/20 transition-colors duration-300"
                         initial={{ x: -10, opacity: 0 }}
                         whileInView={{ x: 0, opacity: 1 }}
                         transition={{ duration: 0.3, delay: index * 0.1 }}
                       >
                         <motion.div
                           className="flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                           whileHover={{ x: 5 }}
                         >
                           <span className="text-sm sm:text-base">اعرف المزيد</span>
                           <ArrowLeft className="h-4 w-4 sm:h-5 lg:h-6" />
                         </motion.div>
                         <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.gradient} opacity-10 group-hover:opacity-20 flex items-center justify-center transition-opacity duration-300`}>
                           <CheckCircle className="h-6 w-6 text-white" />
                         </div>
                       </motion.div>
                     </CardContent>
                     
                     {/* تأثير الإضاءة المتحركة المحسن */}
                     <motion.div
                       className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-30`}
                       animate={{ 
                         background: [
                           `linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)`,
                           `linear-gradient(90deg, transparent, hsl(var(--accent)), transparent)`,
                           `linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)`
                         ]
                       }}
                       transition={{ duration: 3, repeat: Infinity }}
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