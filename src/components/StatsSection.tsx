import { useState, useEffect, useRef } from "react";
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
  Star
} from "lucide-react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mainStats = [
    { 
      icon: GraduationCap, 
      number: 2500, 
      suffix: "+",
      title: "رسالة علمية منجزة",
      description: "ماجستير ودكتوراه بمعايير عالمية",
      color: "text-blue-600"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      title: "لغة مترجمة بدقة",
      description: "تغطية شاملة لجميع اللغات العالمية",
      color: "text-emerald-600"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      title: "بحث علمي محكم",
      description: "منشور في مجلات دولية مرموقة",
      color: "text-amber-600"
    },
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      title: "معدل نجاح القبولات",
      description: "نتائج مضمونة ومؤكدة",
      color: "text-rose-600"
    }
  ];

  const achievementStats = [
    { icon: Brain, number: 320, suffix: "+", label: "خبير أكاديمي" },
    { icon: Trophy, number: 95, suffix: "%", label: "نجاح القبولات" },
    { icon: PenTool, number: 8500, suffix: "+", label: "مقال علمي منجز" },
    { icon: FileCheck, number: 1200, suffix: "+", label: "بحث تطبيقي" },
    { icon: Target, number: 48, suffix: " ساعة", label: "متوسط التسليم" },
    { icon: Globe, number: 92, suffix: "+", label: "جامعة شريكة" }
  ];

  const clientStats = [
    { icon: Users, number: 50000, suffix: "+", label: "عميل راضي" },
    { icon: Search, number: 25000, suffix: "+", label: "مشروع منجز" },
    { icon: Lightbulb, number: 15, suffix: " سنة", label: "خبرة في المجال" },
    { icon: TrendingUp, number: 200, suffix: "%", label: "نمو سنوي" }
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            إحصائياتنا المتميزة
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            أرقام حقيقية تعكس التزامنا بالتميز والجودة في خدمات الأبحاث والتعليم والترجمة
          </p>
        </motion.div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {mainStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="p-6 lg:p-8 text-center h-full flex flex-col justify-between">
                    {/* الأيقونة */}
                    <div className="mb-6">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                        <IconComponent className={`h-8 w-8 lg:h-10 lg:w-10 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                    </div>

                    {/* الرقم */}
                    <div className="mb-4">
                      <div className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                        <AnimatedCounter 
                          end={stat.number} 
                          duration={2.5} 
                          delay={index * 0.2}
                          suffix={stat.suffix}
                        />
                      </div>
                      <h3 className="text-lg lg:text-xl font-semibold text-foreground leading-tight">
                        {stat.title}
                      </h3>
                    </div>

                    {/* الوصف */}
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* إحصائيات الإنجازات */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              إنجازات متميزة
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              مؤشرات الأداء التي تؤكد ريادتنا وتميزنا في تقديم الخدمات الأكاديمية
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {achievementStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-4 lg:p-6 text-center">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors duration-300">
                        <IconComponent className="h-6 w-6 lg:h-7 lg:w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      
                      <div className="text-xl lg:text-2xl font-bold text-foreground mb-1">
                        <AnimatedCounter 
                          end={stat.number} 
                          duration={2} 
                          delay={1 + index * 0.1}
                          suffix={stat.suffix}
                        />
                      </div>
                      
                      <p className="text-xs lg:text-sm text-muted-foreground font-medium leading-tight">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* إحصائيات العملاء */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 via-card/50 to-secondary/5 backdrop-blur-sm border border-border/50">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-10">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  ثقة عملائنا
                </h3>
                <p className="text-muted-foreground">
                  نفخر بثقة عملائنا وشركائنا في جميع أنحاء العالم
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {clientStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      className="text-center group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                        <IconComponent className="h-8 w-8 lg:h-10 lg:w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      
                      <div className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                        <AnimatedCounter 
                          end={stat.number} 
                          duration={2} 
                          delay={1.6 + index * 0.1}
                          suffix={stat.suffix}
                        />
                      </div>
                      
                      <p className="text-sm lg:text-base text-muted-foreground font-medium">
                        {stat.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* شعار الثقة */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <Card className="inline-block bg-gradient-to-r from-primary to-secondary text-white shadow-2xl">
            <CardContent className="px-8 lg:px-12 py-6 lg:py-8">
              <div className="flex items-center gap-4">
                <Star className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-300 animate-pulse" />
                <span className="text-lg lg:text-xl font-bold">
                  الاختيار الأول للباحثين والأكاديميين في 92+ دولة حول العالم
                </span>
                <Star className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-300 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;