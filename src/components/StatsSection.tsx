import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
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
  Clock,
  Shield,
  Star,
  TrendingUp,
  PenTool,
  Search,
  Trophy,
  Brain,
  Target,
  Microscope,
  FileCheck,
  Lightbulb,
  Zap,
  Sparkles,
  Orbit
} from "lucide-react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeCard, setActiveCard] = useState(0);

  const mainStats = [
    { 
      icon: GraduationCap, 
      number: 2500, 
      suffix: "+",
      title: "رسالة علمية",
      subtitle: "منجزة بتميز",
      description: "ماجستير ودكتوراه",
      color: "hsl(var(--primary))",
      bgGradient: "from-blue-500/20 via-purple-500/10 to-blue-600/20"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      title: "لغة عالمية",
      subtitle: "مُترجَمة بدقة",
      description: "تغطية شاملة ومهنية",
      color: "hsl(var(--secondary))",
      bgGradient: "from-emerald-500/20 via-teal-500/10 to-green-600/20"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      title: "بحث علمي",
      subtitle: "محكم ومنشور",
      description: "في مجلات دولية مرموقة",
      color: "hsl(var(--accent))",
      bgGradient: "from-amber-500/20 via-orange-500/10 to-yellow-600/20"
    },
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      title: "معدل النجاح",
      subtitle: "في القبولات",
      description: "نتائج مضمونة ومؤكدة",
      color: "hsl(var(--destructive))",
      bgGradient: "from-rose-500/20 via-pink-500/10 to-red-600/20"
    }
  ];

  const achievementStats = [
    { icon: Brain, number: 320, suffix: "+", label: "خبير أكاديمي", category: "فريق العمل" },
    { icon: Trophy, number: 95, suffix: "%", label: "نجاح القبولات", category: "الإنجازات" },
    { icon: PenTool, number: 8500, suffix: "+", label: "مقال علمي", category: "المنشورات" },
    { icon: Microscope, number: 1200, suffix: "+", label: "بحث تطبيقي", category: "التطبيق" },
    { icon: Target, number: 48, suffix: "ساعة", label: "متوسط التسليم", category: "السرعة" },
    { icon: Globe, number: 92, suffix: "+", label: "جامعة شريكة", category: "الشراكات" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % mainStats.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="w-full py-20 bg-gradient-to-br from-background via-card/30 to-background relative overflow-hidden">
      {/* تأثيرات الخلفية */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        
        {/* شبكة نقاط متحركة */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
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
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              إحصائياتنا المذهلة
            </h2>
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </motion.div>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            أرقام حقيقية تعكس التزامنا بالتميز في خدمات الأبحاث والتعليم والترجمة
          </motion.p>
        </motion.div>

        {/* الإحصائيات الرئيسية - تصميم هرمي مبتكر */}
        <div className="relative mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {mainStats.map((stat, index) => {
              const IconComponent = stat.icon;
              const isActive = activeCard === index;
              
              return (
                <motion.div
                  key={index}
                  className={`relative group cursor-pointer ${
                    index === 0 || index === 3 ? 'lg:col-span-1' : 'lg:col-span-1'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setActiveCard(index)}
                >
                  <Card className={`
                    relative overflow-hidden h-64 border-2 transition-all duration-700
                    ${isActive 
                      ? 'border-primary/50 shadow-2xl shadow-primary/20 scale-105' 
                      : 'border-border/30 hover:border-primary/30'
                    }
                    bg-gradient-to-br from-card/90 via-card/95 to-card
                    backdrop-blur-xl rounded-3xl
                  `}>
                    {/* خلفية متحركة */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100`}
                      transition={{ duration: 0.7 }}
                    />
                    
                    {/* تأثير الضوء المتحرك */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                      animate={{
                        x: isActive ? ['-200%', '200%'] : '-200%',
                      }}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
                    />

                    <CardContent className="p-8 h-full flex items-center relative z-10">
                      <div className="flex items-center gap-6 w-full">
                        {/* الأيقونة */}
                        <motion.div
                          className="relative"
                          animate={isActive ? { 
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                        >
                          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                            <IconComponent 
                              className="h-12 w-12 text-primary relative z-10" 
                              style={{ color: stat.color }}
                            />
                            
                            {/* دوائر متحركة */}
                            <motion.div
                              className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                              animate={isActive ? {
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0, 0.5]
                              } : {}}
                              transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                            />
                          </div>
                        </motion.div>

                        {/* المحتوى */}
                        <div className="flex-1">
                          <motion.div 
                            className="text-4xl font-bold text-foreground mb-2"
                            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                          >
                            <AnimatedCounter 
                              end={stat.number} 
                              duration={2.5} 
                              delay={index * 0.3}
                              suffix={stat.suffix}
                            />
                          </motion.div>
                          
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-foreground">
                              {stat.title}
                            </h3>
                            <p className="text-lg text-primary font-semibold">
                              {stat.subtitle}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {stat.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {/* مؤشر النشاط */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: isActive ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* مؤشرات التبديل */}
          <div className="flex justify-center mt-12 gap-3">
            {mainStats.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeCard === index 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-primary/50'
                }`}
                onClick={() => setActiveCard(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* الإحصائيات الثانوية - تصميم دائري مبتكر */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              إنجازات متميزة
            </h3>
            <p className="text-muted-foreground">
              مؤشرات الأداء التي تؤكد ريادتنا في المجال
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* الدائرة المركزية */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-10">
              <motion.div
                className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Orbit className="h-12 w-12 text-white" />
              </motion.div>
            </div>

            {/* الإحصائيات في دائرة */}
            <div className="relative">
              {achievementStats.map((stat, index) => {
                const IconComponent = stat.icon;
                const angle = (index * 60) - 90; // توزيع 6 عناصر في دائرة
                const radius = 280;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;

                return (
                  <motion.div
                    key={index}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.1, zIndex: 20 }}
                  >
                    <Card className="w-48 h-40 bg-gradient-to-br from-card/90 to-card border-2 border-border/30 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden group">
                      <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center relative">
                        {/* تأثير خلفي */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        <motion.div
                          className="p-3 rounded-xl bg-primary/10 border border-primary/20 mb-3"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.8 }}
                        >
                          <IconComponent className="h-8 w-8 text-primary" />
                        </motion.div>
                        
                        <div className="text-2xl font-bold text-foreground mb-1 relative z-10">
                          <AnimatedCounter 
                            end={stat.number} 
                            duration={2} 
                            delay={1.4 + index * 0.1}
                            suffix={stat.suffix}
                          />
                        </div>
                        
                        <div className="text-sm font-semibold text-primary mb-1 relative z-10">
                          {stat.label}
                        </div>
                        
                        <Badge variant="secondary" className="text-xs relative z-10">
                          {stat.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* شعار الثقة المحدث */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="relative inline-block">
            <motion.div
              className="bg-gradient-to-r from-primary via-secondary to-primary text-white px-12 py-6 rounded-full shadow-2xl relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                backgroundPosition: { duration: 3, repeat: Infinity },
              }}
            >
              {/* تأثير الضوء */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="flex items-center gap-4 relative z-10">
                <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
                <span className="text-xl font-bold">
                  الاختيار الأول للباحثين والأكاديميين في 92+ دولة حول العالم
                </span>
                <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
              </div>
            </motion.div>

            {/* دوائر خلفية متحركة */}
            <motion.div
              className="absolute inset-0 border-4 border-primary/20 rounded-full scale-110"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-secondary/20 rounded-full scale-125"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsSection;