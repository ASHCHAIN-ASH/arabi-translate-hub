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

  const academicStats = [
    { 
      icon: GraduationCap, 
      number: 2500, 
      suffix: "+",
      title: "رسالة علمية منجزة",
      subtitle: "ماجستير ودكتوراه",
      category: "الأطروحات العلمية"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      title: "بحث علمي محكم",
      subtitle: "منشور في مجلات عالمية",
      category: "الأبحاث المنشورة"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      title: "لغة أكاديمية",
      subtitle: "مترجمة بدقة علمية",
      category: "الترجمة الأكاديمية"
    },
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      title: "معدل القبول",
      subtitle: "في الجامعات المرموقة",
      category: "نسبة النجاح"
    }
  ];

  const researchMetrics = [
    { icon: Brain, number: 320, suffix: "+", label: "أستاذ وخبير أكاديمي", field: "هيئة التدريس" },
    { icon: Microscope, number: 1200, suffix: "+", label: "بحث تطبيقي متقدم", field: "البحث العلمي" },
    { icon: BookMarked, number: 8500, suffix: "+", label: "مقال علمي معتمد", field: "المنشورات" },
    { icon: Calculator, number: 950, suffix: "+", label: "تحليل إحصائي", field: "التحليل" },
    { icon: Library, number: 92, suffix: "+", label: "مكتبة جامعية شريكة", field: "الشراكات" },
    { icon: Target, number: 48, suffix: " ساعة", label: "متوسط التسليم", field: "الكفاءة" }
  ];

  const institutionalData = [
    { 
      icon: Users, 
      number: 50000, 
      suffix: "+", 
      title: "طالب وباحث",
      description: "استفادوا من خدماتنا الأكاديمية"
    },
    { 
      icon: Globe, 
      number: 92, 
      suffix: "+", 
      title: "جامعة ومؤسسة",
      description: "تتعاون معنا حول العالم"
    },
    { 
      icon: TrendingUp, 
      number: 15, 
      suffix: " سنة", 
      title: "خبرة أكاديمية",
      description: "في مجال البحث والتعليم"
    },
    { 
      icon: Trophy, 
      number: 95, 
      suffix: "%", 
      title: "رضا الباحثين",
      description: "عن جودة خدماتنا العلمية"
    }
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* خلفية أكاديمية */}
      <div className="absolute inset-0">
        {/* شبكة أكاديمية */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-l border-slate-300"></div>
            ))}
          </div>
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="border-b border-slate-300 h-16"></div>
            ))}
          </div>
        </div>
        
        {/* عناصر زخرفية أكاديمية */}
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-slate-200/30 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-blue-200/30 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-40 h-40 border-2 border-slate-200/20 rounded-full"></div>
        <div className="absolute bottom-40 right-20 w-28 h-28 border-2 border-blue-200/20 rounded-full"></div>
        
        {/* خطوط أكاديمية */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-200/30 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-200/30 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان الأكاديمي */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-8"
            initial={{ scale: 0.9 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Badge variant="outline" className="text-sm font-semibold px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
              تقرير إحصائي شامل
            </Badge>
          </motion.div>
          
          <h2 className="text-5xl lg:text-7xl font-bold text-slate-800 mb-6 leading-tight">
            إحصائياتنا الأكاديمية
          </h2>
          
          <div className="w-32 h-0.5 bg-blue-600 mx-auto mb-8"></div>
          
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            بيانات موثقة ومعتمدة تعكس إنجازاتنا المتميزة في مجال البحث العلمي والتعليم الأكاديمي والترجمة المتخصصة
          </p>
        </motion.div>

        {/* الإحصائيات الأكاديمية الرئيسية */}
        <div className="mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {academicStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="h-72 bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-200 hover:border-blue-200">
                    <CardContent className="p-8 h-full">
                      <div className="flex items-start gap-6 h-full">
                        {/* الأيقونة */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300">
                            <IconComponent className="h-10 w-10 text-blue-600" />
                          </div>
                        </div>
                        
                        {/* المحتوى */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Badge variant="secondary" className="text-xs mb-4 bg-slate-100 text-slate-600">
                              {stat.category}
                            </Badge>
                            
                            <div className="text-5xl font-bold text-slate-800 mb-4">
                              <AnimatedCounter 
                                end={stat.number} 
                                duration={2.5} 
                                delay={index * 0.3}
                                suffix={stat.suffix}
                              />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
                              {stat.title}
                            </h3>
                            
                            <p className="text-lg text-slate-600 font-medium">
                              {stat.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* مقاييس البحث العلمي */}
        <motion.div
          className="mb-28"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="text-center mb-20">
            <Badge variant="outline" className="text-sm font-semibold px-4 py-2 bg-slate-50 text-slate-700 border-slate-300 mb-6">
              مؤشرات الأداء البحثي
            </Badge>
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              معايير التميز الأكاديمي
            </h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              مقاييس دقيقة تُظهر مستوى الجودة والتميز في خدماتنا البحثية والأكاديمية
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {researchMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="group"
                >
                  <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-slate-200">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-100 transition-colors duration-300">
                        <IconComponent className="h-8 w-8 text-slate-600 group-hover:text-slate-700" />
                      </div>
                      
                      <div className="text-3xl font-bold text-slate-800 mb-2">
                        <AnimatedCounter 
                          end={metric.number} 
                          duration={2} 
                          delay={1.2 + index * 0.1}
                          suffix={metric.suffix}
                        />
                      </div>
                      
                      <h4 className="text-sm font-semibold text-slate-800 mb-2 leading-tight">
                        {metric.label}
                      </h4>
                      
                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                        {metric.field}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* البيانات المؤسسية */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 shadow-xl">
            <CardContent className="p-12 lg:p-16">
              <div className="text-center mb-16">
                <Badge variant="outline" className="text-sm font-semibold px-4 py-2 bg-blue-100 text-blue-700 border-blue-300 mb-6">
                  التأثير الأكاديمي العالمي
                </Badge>
                <h3 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
                  شراكاتنا الأكاديمية
                </h3>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  نفخر بشراكاتنا الاستراتيجية مع المؤسسات الأكاديمية والبحثية الرائدة عالمياً
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {institutionalData.map((data, index) => {
                  const IconComponent = data.icon;
                  return (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.8 + index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md hover:shadow-lg transition-all duration-300">
                        <IconComponent className="h-12 w-12 text-blue-600" />
                      </div>
                      
                      <div className="text-4xl font-bold text-slate-800 mb-3">
                        <AnimatedCounter 
                          end={data.number} 
                          duration={2.5} 
                          delay={2 + index * 0.1}
                          suffix={data.suffix}
                        />
                      </div>
                      
                      <h4 className="text-xl font-bold text-slate-800 mb-2">
                        {data.title}
                      </h4>
                      
                      <p className="text-slate-600 leading-relaxed">
                        {data.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* شهادة الاعتماد الأكاديمي */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <Card className="inline-block bg-gradient-to-r from-blue-600 to-slate-700 text-white shadow-2xl border-0">
            <CardContent className="px-12 py-8">
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  <Star className="h-8 w-8 text-yellow-300" />
                  <Star className="h-8 w-8 text-yellow-300" />
                  <Star className="h-8 w-8 text-yellow-300" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    الشريك الأكاديمي المعتمد
                  </div>
                  <div className="text-lg opacity-90">
                    للجامعات والمؤسسات البحثية في 92+ دولة حول العالم
                  </div>
                </div>
                <div className="flex gap-2">
                  <Star className="h-8 w-8 text-yellow-300" />
                  <Star className="h-8 w-8 text-yellow-300" />
                  <Star className="h-8 w-8 text-yellow-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;