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
    <motion.div 
      className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      {/* العنوان */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <Badge className="bg-white/15 text-white border-white/30 backdrop-blur-md px-4 py-2 text-sm font-bold mb-2">
          ✨ إحصائياتنا المذهلة
        </Badge>
      </motion.div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center mb-6">
        {mainStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.7 + index * 0.15 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="cursor-pointer group"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center hover:bg-white/15 transition-all duration-500 group overflow-hidden relative w-36 sm:w-40 lg:w-48 h-40 sm:h-44 lg:h-52">
                <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-center items-center relative z-10">
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
                    <IconComponent className="h-7 w-7 sm:h-8 lg:h-10 text-white drop-shadow-lg relative z-10" />
                    
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
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 font-arabic-title"
                    whileHover={{ scale: 1.1 }}
                  >
                    <AnimatedCounter 
                      end={stat.number} 
                      duration={2} 
                      delay={2 + index * 0.3}
                      suffix={stat.suffix}
                    />
                  </motion.div>

                  {/* النص الوصفي */}
                  <div className="text-white/90 text-sm sm:text-base font-medium leading-tight text-center mb-1">
                    {stat.label}
                  </div>
                  
                  <div className="text-white/70 text-xs leading-tight text-center">
                    {stat.description}
                  </div>
                </CardContent>

                {/* تأثيرات إضافية */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 1,
                    ease: "linear"
                  }}
                />
                
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-all duration-500`}
                />
                
                <div className="absolute inset-0 rounded-lg border border-white/10 group-hover:border-white/30 transition-all duration-300" />
                
                {/* نقاط متحركة */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + i * 20}%`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
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
        className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 opacity-80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        {additionalStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              className="text-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 + index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 p-2 sm:p-3">
                <CardContent className="p-1 sm:p-2">
                  <IconComponent className="h-4 w-4 sm:h-5 w-5 text-white/80 mx-auto mb-1" />
                  <div className="text-xs sm:text-sm font-bold text-white">
                    <AnimatedCounter 
                      end={stat.number} 
                      duration={1.5} 
                      delay={3 + index * 0.1}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-xs text-white/70 leading-tight">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* مؤشر التمرير */}
      <motion.div
        className="flex justify-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
      >
        <motion.div
          className="w-6 h-1 bg-white/30 rounded-full"
          animate={{ scaleX: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
};

export default StatsSection;