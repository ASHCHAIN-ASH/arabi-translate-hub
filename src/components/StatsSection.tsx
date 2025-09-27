import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedCounter from "./AnimatedCounter";
import { 
  GraduationCap, 
  Languages, 
  BookOpen, 
  Award,
  Globe,
  Users,
  TrendingUp,
  Target,
  BookMarked,
  Calculator,
  Microscope,
  Library,
  FileText,
  Star,
  Trophy,
  Brain,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mainStats = [
    { 
      icon: GraduationCap, 
      number: 2500, 
      suffix: "+",
      title: "طالب تخرج",
      subtitle: "ماجستير ودكتوراه",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      title: "بحث منجز",
      subtitle: "للطلاب والباحثين",
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      title: "لغة مترجمة",
      subtitle: "خدمات ترجمة متخصصة",
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    { 
      icon: Users, 
      number: 50000, 
      suffix: "+",
      title: "عميل راضي",
      subtitle: "حول العالم",
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  const achievementStats = [
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      title: "معدل الرضا",
      subtitle: "من عملائنا الكرام"
    },
    { 
      icon: Brain, 
      number: 320, 
      suffix: "+",
      title: "خبير متخصص",
      subtitle: "في فريق العمل"
    },
    { 
      icon: Globe, 
      number: 92, 
      suffix: "+",
      title: "دولة نخدمها",
      subtitle: "في جميع القارات"
    },
    { 
      icon: Trophy, 
      number: 95, 
      suffix: "%",
      title: "نسبة النجاح",
      subtitle: "في المشاريع"
    },
    { 
      icon: Target, 
      number: 48, 
      suffix: " ساعة",
      title: "وقت التسليم",
      subtitle: "المتوسط للمشاريع"
    },
    { 
      icon: BookMarked, 
      number: 8500, 
      suffix: "+",
      title: "مقال علمي",
      subtitle: "تم إنجازه بتميز"
    },
    { 
      icon: Calculator, 
      number: 950, 
      suffix: "+",
      title: "تحليل إحصائي",
      subtitle: "دقيق ومتخصص"
    },
    { 
      icon: TrendingUp, 
      number: 15, 
      suffix: " سنة",
      title: "خبرة متراكمة",
      subtitle: "في الخدمات الأكاديمية"
    }
  ];

  const specialtyIcons = [
    { icon: Microscope, label: "البحث العلمي" },
    { icon: Library, label: "المراجع الأكاديمية" },
    { icon: FileText, label: "الكتابة الأكاديمية" },
    { icon: Shield, label: "الجودة والدقة" }
  ];

  return (
    <section ref={ref} className="relative py-20 lg:py-32 overflow-hidden">
      {/* خلفية متدرجة احترافية */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        
        {/* شبكة هندسية خفيفة */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0),
                linear-gradient(45deg, transparent 40%, hsl(var(--accent) / 0.05) 50%, transparent 60%)
              `,
              backgroundSize: '40px 40px, 80px 80px'
            }}
          />
        </div>

        {/* عناصر زخرفية متحركة */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="bg-gradient-primary text-white border-0 px-8 py-3 text-lg font-bold shadow-primary rounded-full mb-6">
              <Star className="h-5 w-5 ml-2 text-yellow-300" />
              إحصائياتنا المذهلة
              <Trophy className="h-5 w-5 mr-2 text-yellow-300" />
            </Badge>
          </motion.div>
          
          <motion.h2 
            className="text-5xl lg:text-6xl font-arabic-title font-bold mb-6 text-gradient"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            أرقام تتحدث عن تميزنا
          </motion.h2>
          
          <motion.div
            className="w-32 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: 128 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            إنجازات حقيقية ونتائج ملموسة حققناها مع عملائنا الكرام في جميع أنحاء العالم
          </motion.p>
        </motion.div>

        {/* الإحصائيات الرئيسية */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {mainStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <Card className="h-80 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 rounded-2xl overflow-hidden">
                  <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center relative">
                    {/* تأثير التدرج العلوي */}
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${stat.gradient} rounded-t-2xl`} />
                    
                    {/* الأيقونة */}
                    <motion.div 
                      className="mb-6"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300`}>
                        <IconComponent className={`h-10 w-10 ${stat.iconColor}`} />
                      </div>
                    </motion.div>

                    {/* الرقم */}
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-foreground mb-2">
                        <AnimatedCounter 
                          end={stat.number} 
                          duration={2.5} 
                          delay={1.5 + index * 0.1}
                          suffix={stat.suffix}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
                        {stat.title}
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        {stat.subtitle}
                      </p>
                    </div>

                    {/* مؤشر تفاعلي */}
                    <motion.div
                      className={`w-12 h-1 bg-gradient-to-r ${stat.gradient} rounded-full mt-auto opacity-0 group-hover:opacity-100`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* عنوان الإنجازات */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <h3 className="text-3xl lg:text-4xl font-arabic-title font-bold mb-4 text-gradient-secondary">
            إنجازاتنا الإضافية
          </h3>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto rounded-full" />
        </motion.div>

        {/* الإنجازات الإضافية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievementStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 2.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  y: -5, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <Card className="h-48 bg-card border border-border hover:border-primary/30 transition-all duration-300 rounded-xl shadow-soft hover:shadow-medium">
                  <CardContent className="p-6 h-full flex flex-col justify-between text-center">
                    {/* الأيقونة */}
                    <div className="mb-3">
                      <div className="w-12 h-12 mx-auto bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                        <IconComponent className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      </div>
                    </div>

                    {/* الرقم */}
                    <div className="mb-3">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        <AnimatedCounter 
                          end={stat.number} 
                          duration={2} 
                          delay={2.5 + index * 0.1}
                          suffix={stat.suffix}
                        />
                      </div>
                      <h4 className="text-sm font-bold text-foreground mb-1 leading-tight">
                        {stat.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {stat.subtitle}
                      </p>
                    </div>

                    {/* مؤشر سفلي */}
                    <div className="w-full h-0.5 bg-border rounded-full group-hover:bg-primary transition-colors duration-300" />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* أيقونات التخصصات */}
        <motion.div
          className="flex justify-center items-center gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 3 }}
        >
          {specialtyIcons.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center group cursor-pointer"
                whileHover={{ y: -3, scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-gradient-card border border-border rounded-xl flex items-center justify-center mb-2 group-hover:border-primary/30 group-hover:shadow-md transition-all duration-300">
                  <IconComponent className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* بطاقة الشهادة النهائية */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 3.5 }}
        >
          <Card className="inline-block bg-gradient-hero text-white shadow-strong border-0 rounded-3xl max-w-2xl">
            <CardContent className="px-12 py-10">
              <motion.div 
                className="flex items-center justify-center gap-8 flex-wrap"
                initial={{ scale: 0.9 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 4 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <CheckCircle className="h-12 w-12 text-white" />
                </motion.div>
                
                <div className="text-center">
                  <div className="text-3xl font-arabic-title font-bold mb-2">
                    وكالة الخدمات الأكاديمية الرائدة
                  </div>
                  <div className="text-lg opacity-90">
                    نخدم الطلاب والباحثين في 92+ دولة حول العالم
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 4.2 + i * 0.1, duration: 0.3 }}
                      >
                        <Star className="h-6 w-6 text-yellow-300 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 2, repeat: Infinity, repeatDelay: 3, delay: 1 }}
                >
                  <Clock className="h-12 w-12 text-white" />
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;