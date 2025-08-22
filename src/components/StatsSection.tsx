import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedCounter from "./AnimatedCounter";
import { 
  Building2, 
  Languages, 
  FileText, 
  Award,
  Globe,
  Users,
  Clock,
  Shield,
  Star,
  TrendingUp
} from "lucide-react";

const StatsSection = () => {
  const mainStats = [
    { 
      icon: Building2, 
      number: 500, 
      suffix: "+",
      label: "شركة عالمية", 
      gradient: "from-primary to-primary-dark",
      description: "تثق بخدماتنا"
    },
    { 
      icon: Languages, 
      number: 150, 
      suffix: "+",
      label: "لغة احترافية", 
      gradient: "from-secondary to-secondary-light",
      description: "نغطيها بدقة"
    },
    { 
      icon: FileText, 
      number: 10, 
      suffix: "M+",
      label: "وثيقة مترجمة", 
      gradient: "from-accent to-accent-light",
      description: "تم إنجازها بنجاح"
    },
    { 
      icon: Award, 
      number: 99.9, 
      suffix: "%",
      label: "دقة مضمونة", 
      gradient: "from-secondary to-accent",
      description: "معدل الرضا"
    }
  ];

  const additionalStats = [
    { icon: Users, number: 50000, suffix: "+", label: "عميل راضي" },
    { icon: Clock, number: 24, suffix: "/7", label: "دعم مستمر" },
    { icon: Shield, number: 100, suffix: "%", label: "أمان البيانات" },
    { icon: Star, number: 4.9, suffix: "/5", label: "تقييم العملاء" },
    { icon: TrendingUp, number: 200, suffix: "%", label: "نمو سنوي" },
    { icon: Globe, number: 85, suffix: "+", label: "دولة نخدمها" }
  ];

  return (
    <div className="w-full">
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 justify-items-center mb-12">
        {mainStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="cursor-pointer group"
            >
              <Card className="bg-gradient-card shadow-medium border border-white/10 text-center hover:shadow-strong transition-all duration-500 group overflow-hidden relative w-48 sm:w-52 lg:w-60 h-48 sm:h-52 lg:h-60 hover:border-primary/30">
                <CardContent className="p-6 sm:p-7 lg:p-8 h-full flex flex-col justify-center items-center relative z-10">
                  {/* أيقونة مع تأثيرات متقدمة */}
                  <motion.div
                    className="relative mb-3 flex justify-center"
                    animate={{ 
                      rotate: index % 2 === 0 ? [0, 360] : [0, -360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <IconComponent className="h-8 w-8 sm:h-10 lg:h-12 text-primary drop-shadow-lg relative z-10" />
                    
                    {/* هالة متوهجة */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-30 rounded-full blur-md scale-150`}
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1.5, 2, 1.5]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* حلقات متحركة */}
                    <motion.div
                      className="absolute inset-0 border-2 border-white/20 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    />
                  </motion.div>

                  {/* العداد المتحرك */}
                  <motion.div 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-arabic-title"
                    whileHover={{ scale: 1.1 }}
                  >
                    <AnimatedCounter 
                      end={stat.number} 
                      duration={2} 
                      delay={index * 0.3}
                      suffix={stat.suffix}
                    />
                  </motion.div>

                  {/* النص الوصفي */}
                  <div className="text-muted-foreground text-base sm:text-lg font-medium leading-tight text-center mb-2">
                    {stat.label}
                  </div>
                  
                  <div className="text-muted-foreground/80 text-sm leading-tight text-center">
                    {stat.description}
                  </div>
                </CardContent>

                {/* تأثيرات إضافية */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 2,
                    ease: "linear"
                  }}
                />
                
                
                <div className="absolute inset-0 rounded-lg border border-border group-hover:border-primary/30 transition-all duration-300" />
                
                {/* نقاط متحركة */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/40 rounded-full"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${15 + i * 25}%`,
                    }}
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* الإحصائيات الإضافية المصغرة */}
      <motion.div
        className="grid grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {additionalStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              className="text-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Card className="bg-gradient-card shadow-soft border border-border hover:shadow-medium hover:border-primary/20 transition-all duration-300 p-3 sm:p-4">
                <CardContent className="p-2 sm:p-3">
                  <IconComponent className="h-5 w-5 sm:h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm sm:text-base font-bold text-foreground">
                    <AnimatedCounter 
                      end={stat.number} 
                      duration={1.5} 
                      delay={1 + index * 0.1}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground leading-tight">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
};

export default StatsSection;