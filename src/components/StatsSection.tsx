import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
      title: "رسالة علمية",
      description: "ماجستير ودكتوراه",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      shadowColor: "shadow-blue-200"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      title: "لغة مترجمة",
      description: "بدقة عالمية",
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      shadowColor: "shadow-emerald-200"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      title: "بحث منشور",
      description: "في مجلات محكمة",
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      shadowColor: "shadow-amber-200"
    },
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      title: "معدل النجاح",
      description: "في القبولات",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      shadowColor: "shadow-purple-200"
    }
  ];

  const achievementStats = [
    { icon: Brain, number: 320, suffix: "+", label: "خبير أكاديمي", color: "text-indigo-600" },
    { icon: Trophy, number: 95, suffix: "%", label: "نجاح القبولات", color: "text-yellow-600" },
    { icon: PenTool, number: 8500, suffix: "+", label: "مقال علمي", color: "text-green-600" },
    { icon: FileCheck, number: 1200, suffix: "+", label: "بحث تطبيقي", color: "text-blue-600" },
    { icon: Target, number: 48, suffix: "ساعة", label: "متوسط التسليم", color: "text-red-600" },
    { icon: Globe, number: 92, suffix: "+", label: "جامعة شريكة", color: "text-teal-600" }
  ];

  const companyHighlights = [
    { 
      icon: Users, 
      number: 50000, 
      suffix: "+", 
      label: "عميل راضي",
      description: "يثقون بخدماتنا",
      iconBg: "bg-gradient-to-br from-pink-400 to-pink-500"
    },
    { 
      icon: Search, 
      number: 25000, 
      suffix: "+", 
      label: "مشروع منجز",
      description: "بنجاح تام",
      iconBg: "bg-gradient-to-br from-cyan-400 to-cyan-500"
    },
    { 
      icon: Lightbulb, 
      number: 15, 
      suffix: "سنة", 
      label: "خبرة متراكمة",
      description: "في المجال",
      iconBg: "bg-gradient-to-br from-orange-400 to-orange-500"
    },
    { 
      icon: BarChart3, 
      number: 200, 
      suffix: "%", 
      label: "نمو سنوي",
      description: "متزايد ومستمر",
      iconBg: "bg-gradient-to-br from-green-400 to-green-500"
    }
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-amber-200/10 to-orange-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.9 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            إحصائياتنا الرائعة
          </motion.h2>
          <motion.div 
            className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: "6rem" } : {}}
            transition={{ delay: 0.6, duration: 1 }}
          />
          <motion.p 
            className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            نقدم لكم نظرة شاملة على إنجازاتنا المتميزة في مجالات الأبحاث والتعليم والترجمة
          </motion.p>
        </motion.div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-28">
          {mainStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group perspective-1000"
              >
                <Card className={`h-full ${stat.bgColor} border-0 ${stat.shadowColor} shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden`}>
                  <CardContent className="p-0 h-full">
                    {/* رأس الكارت بالتدرج */}
                    <div className={`bg-gradient-to-r ${stat.gradient} p-8 text-white text-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-4xl font-extrabold mb-2">
                          <AnimatedCounter 
                            end={stat.number} 
                            duration={2.5} 
                            delay={index * 0.3}
                            suffix={stat.suffix}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* محتوى الكارت */}
                    <div className="p-8 text-center">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {stat.title}
                      </h3>
                      <p className="text-slate-600 font-medium">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* قسم الإنجازات بتصميم سداسي */}
        <motion.div
          className="mb-28"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              إنجازات استثنائية
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              مؤشرات أداء تعكس تفوقنا المستمر في تقديم الخدمات الأكاديمية
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {achievementStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                  animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center transform-gpu hover:-translate-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300">
                      <IconComponent className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    
                    <div className="text-3xl font-bold text-slate-800 mb-2">
                      <AnimatedCounter 
                        end={stat.number} 
                        duration={2} 
                        delay={1.2 + index * 0.1}
                        suffix={stat.suffix}
                      />
                    </div>
                    
                    <p className="text-sm text-slate-600 font-semibold">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* قسم أبرز الإنجازات */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 lg:p-16 shadow-2xl border border-white/20">
            <div className="text-center mb-16">
              <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-6">
                ثقه عملائنا
              </h3>
              <p className="text-xl text-slate-600">
                نحن فخورون بثقه عملائنا وشركائنا حول العالم
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyHighlights.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center group"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1.8 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative mb-6">
                      <div className={`w-24 h-24 mx-auto ${stat.iconBg} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <IconComponent className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="text-4xl font-bold text-slate-800 mb-2">
                      <AnimatedCounter 
                        end={stat.number} 
                        duration={2.5} 
                        delay={2 + index * 0.1}
                        suffix={stat.suffix}
                      />
                    </div>
                    
                    <h4 className="text-lg font-bold text-slate-800 mb-1">
                      {stat.label}
                    </h4>
                    
                    <p className="text-slate-600 font-medium">
                      {stat.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* شعار الثقه النهائي */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-12 py-8 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <Star className="h-10 w-10 text-yellow-300 animate-pulse" />
            <span className="text-2xl font-bold">
              الخيار الأول للأكاديميين في 92+ دولة
            </span>
            <Star className="h-10 w-10 text-yellow-300 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;