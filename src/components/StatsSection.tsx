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
  BarChart3
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
      description: "ماجستير ودكتوراه"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      title: "لغة مترجمة",
      description: "بدقة عالمية"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      title: "بحث منشور",
      description: "في مجلات محكمة"
    },
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      title: "معدل النجاح",
      description: "في القبولات"
    }
  ];

  const secondaryStats = [
    { icon: Brain, number: 320, suffix: "+", label: "خبير أكاديمي" },
    { icon: Trophy, number: 95, suffix: "%", label: "نجاح القبولات" },
    { icon: PenTool, number: 8500, suffix: "+", label: "مقال علمي" },
    { icon: FileCheck, number: 1200, suffix: "+", label: "بحث تطبيقي" },
    { icon: Target, number: 48, suffix: "ساعة", label: "متوسط التسليم" },
    { icon: Globe, number: 92, suffix: "+", label: "جامعة شريكة" }
  ];

  const companyStats = [
    { icon: Users, number: 50000, suffix: "+", label: "عميل راضي" },
    { icon: Search, number: 25000, suffix: "+", label: "مشروع منجز" },
    { icon: Lightbulb, number: 15, suffix: "سنة", label: "خبرة متراكمة" },
    { icon: BarChart3, number: 200, suffix: "%", label: "نمو سنوي" }
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            إحصائياتنا
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            أرقام حقيقية تعكس خبرتنا وتميزنا في مجال الأبحاث والتعليم والترجمة
          </p>
        </motion.div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {mainStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-2">
                  <CardContent className="p-8 text-center h-full flex flex-col">
                    {/* الأيقونة */}
                    <div className="mb-8">
                      <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                        <IconComponent className="h-10 w-10 text-primary" />
                      </div>
                    </div>

                    {/* الرقم */}
                    <div className="mb-6 flex-grow">
                      <div className="text-5xl font-bold text-foreground mb-4">
                        <AnimatedCounter 
                          end={stat.number} 
                          duration={2.5} 
                          delay={index * 0.2}
                          suffix={stat.suffix}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {stat.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* خط فاصل أنيق */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-20"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
        />

        {/* الإحصائيات الثانوية */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              إنجازات متميزة
            </h3>
            <p className="text-lg text-muted-foreground">
              مؤشرات الأداء التي تؤكد ريادتنا في الخدمات الأكاديمية
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {secondaryStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center border border-gray-100 hover:border-primary/20">
                    <div className="w-14 h-14 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    
                    <div className="text-2xl font-bold text-foreground mb-2">
                      <AnimatedCounter 
                        end={stat.number} 
                        duration={2} 
                        delay={1.2 + index * 0.1}
                        suffix={stat.suffix}
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* خط فاصل أنيق */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-20"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 1.8, duration: 1 }}
        />

        {/* إحصائيات الشركة */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                ثقة عملائنا
              </h3>
              <p className="text-lg text-muted-foreground">
                نفخر بثقة عملائنا وشركائنا حول العالم
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {companyStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="w-18 h-18 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                    
                    <div className="text-3xl font-bold text-foreground mb-2">
                      <AnimatedCounter 
                        end={stat.number} 
                        duration={2} 
                        delay={1.8 + index * 0.1}
                        suffix={stat.suffix}
                      />
                    </div>
                    
                    <p className="text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* شعار الثقة */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 bg-primary text-white px-10 py-6 rounded-full shadow-xl">
            <Star className="h-8 w-8 text-yellow-300" />
            <span className="text-xl font-semibold">
              الاختيار الأول للباحثين في 92+ دولة حول العالم
            </span>
            <Star className="h-8 w-8 text-yellow-300" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;