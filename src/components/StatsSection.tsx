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
  PenTool,
  Search,
  Trophy,
  Brain,
  Target,
  FileCheck,
  Lightbulb,
  Star,
  BarChart3,
  BookMarked,
  Microscope,
  Calculator,
  Library,
  Sparkles,
  Zap,
  Rocket
} from "lucide-react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const academicStats = [
    { 
      icon: GraduationCap, 
      number: 2500, 
      suffix: "+",
      title: "طالب ساعدناه بالتخرج",
      subtitle: "ماجستير ودكتوراه",
      category: "خدمات الرسائل العلمية",
      color: "from-blue-500 to-cyan-500",
      bgPattern: "bg-blue-50"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      title: "بحث أكاديمي أنجزناه",
      subtitle: "للطلاب والباحثين",
      category: "خدمات البحث العلمي",
      color: "from-emerald-500 to-teal-500",
      bgPattern: "bg-emerald-50"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      title: "لغة نترجم إليها",
      subtitle: "خدمات ترجمة متخصصة",
      category: "الترجمة الأكاديمية",
      color: "from-amber-500 to-orange-500",
      bgPattern: "bg-amber-50"
    },
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      title: "معدل رضا عملائنا",
      subtitle: "من الطلاب والأكاديميين",
      category: "جودة الخدمة",
      color: "from-purple-500 to-pink-500",
      bgPattern: "bg-purple-50"
    }
  ];

  const serviceMetrics = [
    { icon: Brain, number: 320, suffix: "+", label: "خبير متخصص", field: "فريق العمل", color: "text-indigo-600" },
    { icon: Rocket, number: 1200, suffix: "+", label: "مشروع منجز", field: "الإبداع", color: "text-blue-600" },
    { icon: Zap, number: 8500, suffix: "+", label: "خدمة سريعة", field: "الكفاءة", color: "text-yellow-600" },
    { icon: Calculator, number: 950, suffix: "+", label: "تحليل دقيق", field: "التحليل", color: "text-green-600" },
    { icon: Sparkles, number: 92, suffix: "+", label: "دولة نخدمها", field: "التميز", color: "text-purple-600" },
    { icon: Target, number: 48, suffix: " ساعة", label: "وقت التسليم", field: "السرعة", color: "text-red-600" }
  ];

  const globalReach = [
    { 
      icon: Users, 
      number: 50000, 
      suffix: "+", 
      title: "عميل سعيد",
      description: "يثق بخدماتنا المتميزة",
      gradient: "from-pink-400 to-rose-500"
    },
    { 
      icon: Globe, 
      number: 92, 
      suffix: "+", 
      title: "دولة حول العالم",
      description: "نقدم لها خدماتنا",
      gradient: "from-blue-400 to-indigo-500"
    },
    { 
      icon: TrendingUp, 
      number: 15, 
      suffix: " سنة", 
      title: "خبرة متراكمة",
      description: "في الخدمات الأكاديمية",
      gradient: "from-green-400 to-emerald-500"
    },
    { 
      icon: Trophy, 
      number: 95, 
      suffix: "%", 
      title: "معدل الرضا",
      description: "من جميع عملائنا",
      gradient: "from-amber-400 to-yellow-500"
    }
  ];

  const iconAnimation = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 0.6 }
    },
    tap: { scale: 0.95 }
  };

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1]
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/40 relative overflow-hidden">
      {/* خلفية ديناميكية */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* عناصر هندسية متحركة */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-6 h-6 bg-purple-400/30 rounded-full"
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.7, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان المتحرك */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-10 w-10 text-blue-500" />
            </motion.div>
            <Badge variant="outline" className="text-base font-bold px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              إحصائيات مذهلة
            </Badge>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-10 w-10 text-purple-500" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            className="text-6xl lg:text-8xl font-extrabold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8"
            initial={{ scale: 0.8 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            نجاحاتنا الرائعة
          </motion.h2>
          
          <motion.div 
            className="w-32 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: "8rem" } : {}}
            transition={{ delay: 0.8, duration: 1.2 }}
          />
          
          <motion.p 
            className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 1 }}
          >
            أرقام حقيقية تحكي قصة نجاح متواصلة في خدمة الطلاب والباحثين حول العالم
          </motion.p>
        </motion.div>

        {/* الإحصائيات الرئيسية - تصميم جديد */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-32 max-w-7xl mx-auto">
          {academicStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, rotateY: -15 }}
                animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.03, y: -10 }}
                className="group perspective-1000"
              >
                <Card className={`relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl transform-gpu ${stat.bgPattern}`}>
                  <CardContent className="p-0 h-80">
                    {/* رأس الكارت مع تدرج متحرك */}
                    <div className={`relative h-32 bg-gradient-to-r ${stat.color} overflow-hidden`}>
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{
                          background: [
                            "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))",
                            "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
                            "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))"
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      
                      <div className="absolute inset-0 flex items-center justify-between px-8">
                        <motion.div
                          className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                          variants={iconAnimation}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          animate={{
                            y: [-10, 10, -10],
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <IconComponent className="h-10 w-10 text-white" />
                        </motion.div>
                        
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          {stat.category}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* محتوى الكارت */}
                    <div className="p-8 bg-white/90 backdrop-blur-sm h-48 flex flex-col justify-center">
                      <motion.div 
                        className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: index * 0.3 + 0.5, duration: 0.6, type: "spring" }}
                      >
                        <AnimatedCounter 
                          end={stat.number} 
                          duration={3} 
                          delay={index * 0.4}
                          suffix={stat.suffix}
                        />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
                        {stat.title}
                      </h3>
                      
                      <p className="text-lg text-slate-600 font-semibold">
                        {stat.subtitle}
                      </p>
                    </div>

                    {/* تأثير ضوئي متحرك */}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                      animate={{
                        x: ["-100%", "100%"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.5
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* مقاييس الخدمات - تصميم دائري */}
        <motion.div
          className="mb-32"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="text-center mb-20">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Zap className="h-12 w-12 text-yellow-500" />
            </motion.div>
            <h3 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-6">
              خدماتنا المتميزة
            </h3>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
              مؤشرات توضح جودة وتنوع الخدمات التي نقدمها
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {serviceMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.8, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="group"
                >
                  <div className="relative">
                    <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden">
                      <CardContent className="p-8 text-center">
                        <motion.div
                          className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-6 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300"
                          variants={iconAnimation}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <IconComponent className={`h-10 w-10 ${metric.color} group-hover:scale-125 transition-transform duration-300`} />
                        </motion.div>
                        
                        <div className="text-4xl font-bold text-slate-800 mb-3">
                          <AnimatedCounter 
                            end={metric.number} 
                            duration={2.5} 
                            delay={1.4 + index * 0.1}
                            suffix={metric.suffix}
                          />
                        </div>
                        
                        <p className="text-sm font-bold text-slate-800 mb-2">
                          {metric.label}
                        </p>
                        
                        <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                          {metric.field}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* حلقة ضوئية */}
                    <motion.div
                      className="absolute -inset-2 rounded-full border-2 border-blue-200/0 group-hover:border-blue-200/50"
                      animate={{
                        rotate: 360,
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, delay: index * 0.2 }
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* الانتشار العالمي - تصميم هكساغون */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <Card className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl border-2 border-white/50 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-16">
              <div className="text-center mb-16">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <Globe className="h-16 w-16 text-blue-500" />
                </motion.div>
                <h3 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-6">
                  انتشارنا العالمي
                </h3>
                <p className="text-2xl text-slate-600">
                  نحن فخورون بوصول خدماتنا لجميع أنحاء العالم
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {globalReach.map((data, index) => {
                  const IconComponent = data.icon;
                  return (
                    <motion.div
                      key={index}
                      className="text-center group"
                      initial={{ opacity: 0, y: 50 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 2 + index * 0.15, duration: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className={`w-28 h-28 mx-auto bg-gradient-to-br ${data.gradient} rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        <IconComponent className="h-14 w-14 text-white" />
                      </motion.div>
                      
                      <div className="text-5xl font-bold text-slate-800 mb-3">
                        <AnimatedCounter 
                          end={data.number} 
                          duration={3} 
                          delay={2.2 + index * 0.15}
                          suffix={data.suffix}
                        />
                      </div>
                      
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">
                        {data.title}
                      </h4>
                      
                      <p className="text-lg text-slate-600">
                        {data.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* الشعار النهائي */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.8, duration: 1 }}
        >
          <motion.div
            className="inline-block relative"
            whileHover={{ scale: 1.05 }}
          >
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl border-0 rounded-full overflow-hidden">
              <CardContent className="px-16 py-10">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10"
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <div className="flex items-center gap-8 relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="h-12 w-12 text-yellow-300" />
                  </motion.div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      وكالة الخدمات الأكاديمية الرائدة
                    </div>
                    <div className="text-xl opacity-90">
                      نخدم الطلاب والباحثين في 92+ دولة حول العالم
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: [360, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="h-12 w-12 text-yellow-300" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* دوائر متحركة حول الشعار */}
            <motion.div
              className="absolute -inset-4 border-4 border-white/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -inset-8 border-4 border-white/10 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;