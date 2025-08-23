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
  Library
} from "lucide-react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const allStats = [
    { 
      icon: GraduationCap, 
      number: 2500, 
      suffix: "+",
      title: "طالب تخرج",
      subtitle: "ماجستير ودكتوراه",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      title: "بحث منجز",
      subtitle: "للطلاب والباحثين",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      title: "لغة مترجمة",
      subtitle: "خدمات ترجمة متخصصة",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      title: "معدل الرضا",
      subtitle: "من عملائنا الكرام",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    { 
      icon: Brain, 
      number: 320, 
      suffix: "+",
      title: "خبير متخصص",
      subtitle: "في فريق العمل",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    { 
      icon: Users, 
      number: 50000, 
      suffix: "+",
      title: "عميل راضي",
      subtitle: "حول العالم",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200"
    },
    { 
      icon: Globe, 
      number: 92, 
      suffix: "+",
      title: "دولة نخدمها",
      subtitle: "في جميع القارات",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    },
    { 
      icon: Trophy, 
      number: 95, 
      suffix: "%",
      title: "نسبة النجاح",
      subtitle: "في المشاريع",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    { 
      icon: Target, 
      number: 48, 
      suffix: " ساعة",
      title: "وقت التسليم",
      subtitle: "المتوسط للمشاريع",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    { 
      icon: BookMarked, 
      number: 8500, 
      suffix: "+",
      title: "مقال علمي",
      subtitle: "تم إنجازه بتميز",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    { 
      icon: Calculator, 
      number: 950, 
      suffix: "+",
      title: "تحليل إحصائي",
      subtitle: "دقيق ومتخصص",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      icon: TrendingUp, 
      number: 15, 
      suffix: " سنة",
      title: "خبرة متراكمة",
      subtitle: "في الخدمات الأكاديمية",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-gray-100 relative">
      {/* خلفية رسمية ثابتة */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-gray-300 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-blue-300 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border border-gray-200 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-blue-200 rounded-full"></div>
        
        {/* خطوط هندسية ثابتة */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gray-200"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gray-200"></div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gray-200"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gray-200"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="outline" className="text-lg font-semibold px-6 py-3 bg-white border-gray-300 mb-8">
            إحصائياتنا الرائعة
          </Badge>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            أرقامنا تتحدث عن تميزنا
          </h2>
          
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            بيانات موثقة تعكس جودة خدماتنا وثقه عملائنا في جميع أنحاء العالم
          </p>
        </motion.div>

        {/* شبكة الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {allStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <Card className={`
                  h-64 ${stat.bgColor} border-2 ${stat.borderColor} 
                  hover:border-gray-300 transition-all duration-300 
                  hover:shadow-xl hover:shadow-gray-200/50
                  rounded-2xl overflow-hidden
                `}>
                  <CardContent className="p-6 h-full flex flex-col justify-between text-center">
                    {/* الأيقونة */}
                    <div className="mb-4">
                      <motion.div
                        className="w-16 h-16 mx-auto bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent className={`h-8 w-8 ${stat.color}`} />
                      </motion.div>
                    </div>

                    {/* الرقم */}
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-gray-800 mb-2">
                        <AnimatedCounter 
                          end={stat.number} 
                          duration={2.5} 
                          delay={index * 0.1}
                          suffix={stat.suffix}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
                        {stat.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.subtitle}
                      </p>
                    </div>

                    {/* خط سفلي */}
                    <motion.div
                      className={`w-full h-1 ${stat.color.replace('text-', 'bg-')} rounded-full opacity-0 group-hover:opacity-100`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* شعار الثقه */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Card className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl border-0 rounded-2xl">
            <CardContent className="px-12 py-8">
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="h-10 w-10 text-yellow-300" />
                </motion.div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    وكالة الخدمات الأكاديمية الرائدة
                  </div>
                  <div className="text-lg opacity-90">
                    نخدم الطلاب والباحثين في 92+ دولة حول العالم
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="h-10 w-10 text-yellow-300" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;