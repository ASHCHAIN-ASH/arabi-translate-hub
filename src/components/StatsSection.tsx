import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedCounter from "./AnimatedCounter";
import { 
  GraduationCap, 
  Languages, 
  FileText, 
  Award,
  Globe,
  Users,
  Clock,
  Shield,
  Star,
  TrendingUp,
  BookOpen,
  PenTool,
  Search,
  Trophy,
  Brain,
  Target
} from "lucide-react";

const StatsSection = () => {
  const mainStats = [
    { 
      icon: GraduationCap, 
      number: 2500, 
      suffix: "+",
      label: "رسالة علمية منجزة", 
      gradient: "from-primary to-primary-dark",
      description: "ماجستير ودكتوراه"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      label: "لغة مُترجَمة", 
      gradient: "from-secondary to-secondary-light",
      description: "بدقة مهنية عالية"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      label: "بحث علمي مُحكَّم", 
      gradient: "from-accent to-accent-light",
      description: "منشور في مجلات دولية"
    },
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      label: "نسبة النجاح", 
      gradient: "from-secondary to-accent",
      description: "في قبول الأبحاث"
    }
  ];

  const additionalStats = [
    { icon: PenTool, number: 8500, suffix: "+", label: "مقال علمي منجز" },
    { icon: Brain, number: 320, suffix: "+", label: "خبير أكاديمي" },
    { icon: Trophy, number: 95, suffix: "%", label: "نجاح القبولات" },
    { icon: Target, number: 48, suffix: " ساعة", label: "متوسط التسليم" },
    { icon: Search, number: 1200, suffix: "+", label: "مرجع محكم" },
    { icon: Globe, number: 92, suffix: "+", label: "جامعة شريكة" }
  ];

  return (
    <div className="w-full">
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10 justify-items-center mb-16">
        {mainStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="cursor-pointer group w-full max-w-sm"
            >
              <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 shadow-2xl border border-border/50 text-center hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:border-primary/30 transition-all duration-700 group overflow-hidden relative h-64 lg:h-72 backdrop-blur-lg rounded-2xl">
                <CardContent className="p-8 lg:p-10 h-full flex flex-col justify-center items-center relative z-10">
                  {/* أيقونة احترافية */}
                  <motion.div
                    className="relative mb-6 flex justify-center"
                    animate={{ 
                      rotate: index % 2 === 0 ? [0, 5, -5, 0] : [0, -5, 5, 0],
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="relative">
                      <IconComponent className="h-12 w-12 lg:h-16 lg:w-16 text-primary drop-shadow-sm relative z-10" />
                      
                      {/* دائرة خلفية أنيقة */}
                      <motion.div 
                        className="absolute inset-0 bg-primary/10 rounded-full scale-150 blur-sm"
                        animate={{ 
                          scale: [1.5, 1.8, 1.5],
                          opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* حلقة خارجية */}
                      <motion.div
                        className="absolute inset-0 border-2 border-primary/20 rounded-full scale-150"
                        animate={{ 
                          scale: [1.5, 2, 1.5],
                          opacity: [0.2, 0, 0.2]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* العداد المتحرك */}
                  <motion.div 
                    className="text-4xl lg:text-5xl font-bold text-foreground mb-3 font-arabic-title"
                    whileHover={{ scale: 1.05 }}
                  >
                    <AnimatedCounter 
                      end={stat.number} 
                      duration={2.5} 
                      delay={index * 0.4}
                      suffix={stat.suffix}
                    />
                  </motion.div>

                  {/* النص الوصفي */}
                  <div className="text-muted-foreground text-lg lg:text-xl font-semibold leading-tight text-center mb-2">
                    {stat.label}
                  </div>
                  
                  <div className="text-muted-foreground/70 text-sm lg:text-base leading-tight text-center">
                    {stat.description}
                  </div>
                </CardContent>

                {/* تأثيرات احترافية */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.7 }}
                />
                
                {/* حدود متوهجة مع تأثير ضوئي */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/40 transition-all duration-700"
                  style={{
                    background: 'linear-gradient(135deg, transparent, rgba(var(--primary), 0.1), transparent)',
                    backgroundClip: 'padding-box',
                  }}
                />
                
                {/* شعاع ضوئي متحرك */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* تأثيرات الزوايا */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary/30 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* الإحصائيات الإضافية بتصميم شريطي احترافي */}
      <motion.div
        className="bg-gradient-to-br from-card/80 via-card/90 to-card/95 backdrop-blur-xl rounded-3xl border-2 border-border/40 shadow-2xl p-8 lg:p-12 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        {/* تأثير خلفية ضوئية */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
        <div className="text-center mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground font-arabic-title mb-2">
            إنجازات إضافية
          </h3>
          <p className="text-muted-foreground">مؤشرات أداء شاملة لخدماتنا</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {additionalStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              >
                <div className="bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-md rounded-2xl border-2 border-border/30 hover:shadow-2xl hover:border-primary/40 hover:shadow-primary/10 transition-all duration-500 p-4 lg:p-6 relative overflow-hidden group">
                  {/* تأثير ضوئي خلفي */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  {/* حدود ضوئية متحركة */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border border-primary/20 opacity-0 group-hover:opacity-100"
                    animate={{
                      background: [
                        'linear-gradient(0deg, transparent, rgba(var(--primary), 0.1), transparent)',
                        'linear-gradient(90deg, transparent, rgba(var(--primary), 0.1), transparent)',
                        'linear-gradient(180deg, transparent, rgba(var(--primary), 0.1), transparent)',
                        'linear-gradient(270deg, transparent, rgba(var(--primary), 0.1), transparent)',
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <div className="flex flex-col items-center space-y-3 relative z-10">
                    <div className="relative">
                      <motion.div
                        className="p-3 rounded-xl bg-primary/10 border border-primary/20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <IconComponent className="h-8 w-8 lg:h-10 lg:w-10 text-primary mx-auto" />
                      </motion.div>
                      
                      {/* دوائر ضوئية متحركة */}
                      <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-full scale-150 opacity-0 group-hover:opacity-100"
                        animate={{ 
                          scale: [1.5, 2, 1.5],
                          opacity: [0, 0.3, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2
                        }}
                      />
                    </div>
                    
                    <div className="text-xl lg:text-2xl font-bold text-foreground">
                      <AnimatedCounter 
                        end={stat.number} 
                        duration={2} 
                        delay={1.2 + index * 0.1}
                        suffix={stat.suffix}
                      />
                    </div>
                    
                    <div className="text-sm lg:text-base text-muted-foreground font-medium leading-tight">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* مؤشر الثقة */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="inline-flex items-center space-x-4 space-x-reverse bg-gradient-primary text-white px-8 py-4 rounded-full shadow-lg">
          <Star className="h-6 w-6 text-yellow-300 animate-pulse" />
          <span className="text-lg font-bold">الخيار الأول للباحثين والأكاديميين في 92+ دولة حول العالم</span>
          <Star className="h-6 w-6 text-yellow-300 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
};

export default StatsSection;