import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Languages, PenTool, BookOpen, Users, MessageSquare, GraduationCap,
  FileText, Search, Award, Clock, Globe, Star, Target, Shield,
  CheckCircle, HeartHandshake, Brain, Microscope, ArrowLeft
} from "lucide-react";

const ServicesShowcase = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      id: 1,
      title: "خدمات الترجمة",
      description: "ترجمة احترافية لجميع أنواع المستندات والمحتوى الأكاديمي والمهني بدقة عالية",
      icon: Languages,
      gradient: "from-blue-500 to-blue-700",
      delay: 0.1,
      route: "/services/translation-services"
    },
    {
      id: 2,
      title: "التحرير والمراجعة",
      description: "تحرير ومراجعة النصوص الأكاديمية والمهنية لضمان الجودة والوضوح",
      icon: PenTool,
      gradient: "from-purple-500 to-purple-700",
      delay: 0.2,
      route: "/services/editing-services"
    },
    {
      id: 3,
      title: "الكتابة الأكاديمية",
      description: "كتابة الأبحاث والرسائل والمقالات الأكاديمية بمعايير عالمية",
      icon: BookOpen,
      gradient: "from-emerald-500 to-emerald-700",
      delay: 0.3,
      route: "/services/academic-writing"
    },
    {
      id: 4,
      title: "الاستشارات التعليمية",
      description: "استشارات أكاديمية متخصصة لطلاب الدراسات العليا والباحثين",
      icon: GraduationCap,
      gradient: "from-orange-500 to-orange-700",
      delay: 0.4,
      route: "/services/consultation-services"
    },
    {
      id: 5,
      title: "التحليل الإحصائي",
      description: "تحليل البيانات الإحصائية وإعداد التقارير العلمية والبحثية",
      icon: Microscope,
      gradient: "from-rose-500 to-rose-700",
      delay: 0.5,
      route: "/services/statistical-analysis"
    },
    {
      id: 6,
      title: "خدمات النشر",
      description: "مساعدة في نشر الأبحاث في المجلات العلمية المحكمة",
      icon: FileText,
      gradient: "from-indigo-500 to-indigo-700",
      delay: 0.6,
      route: "/services/publishing-services"
    }
  ];

  const features = [
    { icon: Shield, text: "أمان مضمون" },
    { icon: Clock, text: "تسليم سريع" },
    { icon: Award, text: "جودة عالية" },
    { icon: Star, text: "خدمة متميزة" }
  ];

  return (
    <section 
      className="py-16 relative overflow-hidden" 
      dir="rtl"
      style={{
        background: "linear-gradient(135deg, hsl(280 100% 15%) 0%, hsl(290 90% 10%) 50%, hsl(260 95% 12%) 100%)",
        '--services-primary': '280 100% 70%',
        '--services-secondary': '320 85% 65%',
        '--services-accent': '240 90% 75%'
      } as React.CSSProperties & { [key: string]: string }}
    >
      {/* خلفية تفاعلية متطورة */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 opacity-50"
          style={{
            background: "radial-gradient(circle at 20% 50%, hsl(280 100% 70% / 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(320 85% 65% / 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, hsl(240 90% 75% / 0.1) 0%, transparent 50%)"
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* نقاط متحركة للزينة */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      {/* العناصر المتحركة في الخلفية */}
      <div className="absolute inset-0 pointer-events-none">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={index}
              className="absolute opacity-5 dark:opacity-3"
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + (index % 2) * 40}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 8 + index * 2,
                delay: index * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <IconComponent className="h-20 w-20 text-primary/30" />
            </motion.div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 relative">
        {/* العنوان المتطور */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="text-5xl lg:text-7xl font-bold mb-4 leading-tight"
              style={{
                background: "linear-gradient(135deg, hsl(280 100% 70%), hsl(320 85% 65%) 30%, hsl(240 90% 75%) 70%, hsl(300 95% 80%))",
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              خدماتنا الاحترافية المتكاملة
            </motion.h2>
          </motion.div>
          
          <motion.p 
            className="text-xl max-w-4xl mx-auto leading-relaxed"
            style={{ color: "hsl(280 30% 85%)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            نقدم مجموعة شاملة من الخدمات الأكاديمية والمهنية من الترجمة والتحرير إلى البحث والنشر العلمي
          </motion.p>

          {/* شريط المزايا السريعة */}
          <motion.div 
            className="flex justify-center gap-8 mt-8 flex-wrap"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ backgroundColor: "hsl(280 100% 70% / 0.15)" }}
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "hsl(280 100% 70% / 0.25)",
                    transition: { duration: 0.2 }
                  }}
                  animate={{
                    y: [0, -2, 0]
                  }}
                  transition={{
                    y: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                  }}
                >
                  <IconComponent className="h-5 w-5" style={{ color: "hsl(280 100% 70%)" }} />
                  <span className="text-sm font-medium" style={{ color: "hsl(280 30% 90%)" }}>{feature.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* شبكة الخدمات المتطورة */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ 
                  opacity: 0, 
                  y: 50,
                  scale: 0.9
                }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: service.delay,
                  type: "spring",
                  bounce: 0.3
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Card className="h-full bg-card/80 backdrop-blur-sm border-2 border-border/30 hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative rounded-full aspect-square w-full max-w-[280px] mx-auto">
                  {/* التدرج الخلفي */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-full`}
                    whileHover={{ opacity: 0.15 }}
                  />
                  
                  {/* حافة متحركة */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-transparent"
                    style={{
                      background: `linear-gradient(45deg, ${service.gradient.replace('from-', '').replace(' to-', ', ')}) border-box`,
                      WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "subtract"
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    whileHover={{ opacity: 0.3 }}
                  />
                  
                  <CardContent className="p-4 md:p-6 lg:p-8 relative z-10 h-full flex flex-col items-center justify-center text-center">
                    {/* الأيقونة التفاعلية */}
                    <motion.div 
                      className="mb-3 md:mb-4"
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 bg-gradient-to-br ${service.gradient} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border-2 border-white/20`}>
                        <motion.div
                          animate={{ 
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <IconComponent className="h-6 w-6 md:h-8 md:w-8 lg:h-9 lg:w-9 text-white" />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* المحتوى */}
                    <motion.h3 
                      className="text-sm md:text-base lg:text-lg font-bold text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300 leading-tight"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: service.delay + 0.1 }}
                      viewport={{ once: true }}
                    >
                      {service.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-xs md:text-sm text-muted-foreground leading-relaxed px-2 mb-4"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: service.delay + 0.2 }}
                      viewport={{ once: true }}
                    >
                      {service.description}
                    </motion.p>

                    {/* زر المزيد */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: service.delay + 0.3 }}
                      viewport={{ once: true }}
                      className="mt-auto"
                    >
                      <Button
                        size="sm"
                        variant="default"
                        className="text-xs px-4 py-2 h-8 bg-white text-gray-900 hover:bg-gray-100 border-none font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        onClick={() => navigate(service.route)}
                      >
                        المزيد
                        <ArrowLeft className="w-3 h-3 mr-1" />
                      </Button>
                    </motion.div>

                    {/* علامة التحقق */}
                    <motion.div 
                      className="absolute top-2 md:top-4 left-2 md:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: service.delay + 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* الإحصائيات المتطورة */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            { number: "15000+", label: "مشروع مكتمل", icon: CheckCircle, color: "text-blue-500" },
            { number: "500+", label: "خبير متخصص", icon: Award, color: "text-purple-500" },
            { number: "50+", label: "تخصص أكاديمي", icon: Globe, color: "text-emerald-500" },
            { number: "99%", label: "رضا العملاء", icon: Target, color: "text-orange-500" }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
               <motion.div 
                key={index}
                className="text-center p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group"
                style={{ 
                  backgroundColor: "hsl(280 20% 25% / 0.6)",
                  backdropFilter: "blur(10px)"
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  y: { 
                    duration: 3 + index * 0.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.2
                  }
                }}
              >
                <motion.div 
                  className="flex justify-center mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </motion.div>
                
                <motion.div 
                  className={`text-3xl font-bold ${stat.color} mb-2`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: index * 0.3,
                    ease: "easeInOut"
                  }}
                >
                  {stat.number}
                </motion.div>
                
                <div className="text-sm font-medium group-hover:text-foreground transition-colors duration-300" style={{ color: "hsl(280 30% 85%)" }}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;