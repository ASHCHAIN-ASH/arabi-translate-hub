import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Percent, Award, FileText, BookOpen, Wallet, Users, Globe, Clock } from "lucide-react";
import enagoHeroBg from "@/assets/enago-hero-bg.jpg";

const ServicesShowcase = () => {
  const benefits = [
    {
      id: 1,
      title: "دقة 99%+ في الترجمة",
      description: "نضمن أعلى مستويات الدقة في جميع أعمال الترجمة مع مراجعة متعددة المراحل من خبراء متخصصين في جميع المجالات الأكاديمية",
      icon: Percent,
      logoText: "ضمان الدقة",
      position: "top-16 right-4",
      cardClass: "w-72"
    },
    {
      id: 2,
      title: "مترجمون متخصصون",
      description: "احفظ مترجميك المفضلين وسنقوم بإعطائهم الأولوية للعمل على مشاريعك المستقبلية لضمان الاستمرارية",
      icon: Award,
      logoText: "المترجمون المفضلون",
      logoClass: "bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold",
      position: "top-16 left-4",
      cardClass: "w-72"
    },
    {
      id: 3,
      title: "تتبع المشاريع",
      description: "تتبع حالة مشاريعك، تحميل الملفات المترجمة والفواتير، واطلب خدمات إضافية من لوحة التحكم الشخصية",
      icon: FileText,
      logoText: "لوحة التحكم",
      logoClass: "bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-bold",
      position: "bottom-32 right-4",
      cardClass: "w-72"
    },
    {
      id: 4,
      title: "المكتبة الأكاديمية",
      description: "اطلع على أكثر من 6000 مقال أكاديمي مترجم في 9 لغات وشارك في ورش العمل المتخصصة مجاناً",
      icon: BookOpen,
      logoText: "المكتبة الأكاديمية",
      logoClass: "bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-bold",
      position: "bottom-32 left-4",
      cardClass: "w-72"
    },
    {
      id: 5,
      title: "محفظة الترجمة",
      description: "احفظ رصيدك للمشاريع المستقبلية واكسب نقاط مكافآت وخصومات تصل إلى 50% على الطلبات القادمة",
      icon: Wallet,
      logoText: "محفظة الخصومات",
      logoClass: "bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-bold",
      position: "bottom-4 right-1/4 transform translate-x-1/2",
      cardClass: "w-80"
    },
    {
      id: 6,
      title: "برنامج الإحالة",
      description: "أحل صديقاً واكسب رصيد مجاني وكوبونات خصم تصل إلى 50% على طلبك التالي لكل عميل جديد تقوم بإحالته",
      icon: Users,
      logoText: "برنامج الإحالة",
      logoClass: "bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold",
      position: "bottom-4 left-1/4 transform -translate-x-1/2",
      cardClass: "w-80"
    }
  ];

  const floatingElements = [
    { icon: Globe, delay: 0, duration: 3, x: -100, y: -50 },
    { icon: Clock, delay: 1, duration: 4, x: 150, y: -80 },
    { icon: Award, delay: 2, duration: 3.5, x: -80, y: 100 },
    { icon: FileText, delay: 1.5, duration: 4.5, x: 120, y: 90 }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 overflow-hidden" dir="rtl">
      {/* عناصر متحركة في الخلفية */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element, index) => {
          const IconComponent = element.icon;
          return (
            <motion.div
              key={index}
              className="absolute opacity-10 dark:opacity-5"
              style={{
                left: `${50 + element.x}px`,
                top: `${50 + element.y}px`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: element.duration,
                delay: element.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <IconComponent className="h-16 w-16 text-blue-600" />
            </motion.div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 relative">
        {/* العنوان */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-arabic-title font-bold text-foreground mb-6"
            animate={{ 
              backgroundPosition: ["0%", "100%", "0%"] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity 
            }}
            style={{
              background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            مزايا مجتمع وكالة ماستر إيدو باث
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            اكتشف المميزات الحصرية التي تجعلنا الخيار الأول للترجمة الأكاديمية والمهنية
          </motion.p>
        </motion.div>

        {/* التصميم الدائري */}
        <div className="relative flex items-center justify-center min-h-[800px]">
          {/* الصورة المركزية مع تأثيرات متحركة */}
          <motion.div 
            className="relative z-10 w-80 h-80 rounded-full overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
                "0 25px 50px -12px rgba(6, 182, 212, 0.25)",
                "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
              ]
            }}
          >
            <img 
              src={enagoHeroBg} 
              alt="خدماتنا الاحترافية"
              className="w-full h-full object-cover"
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* البطاقات الموزعة مع انيميشن متقدم */}
          <div className="absolute inset-0">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                 <motion.div
                  key={benefit.id}
                  className={`absolute ${benefit.position}`}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.5, 
                    y: 50,
                    rotate: -10 
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    rotate: 0 
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.15,
                    type: "spring",
                    bounce: 0.4
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -10,
                    rotate: 2,
                    transition: { duration: 0.3 }
                  }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                >
                  <Card className={`${benefit.cardClass} bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border-0 group`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 text-right">
                        {/* الأيقونة أو الشعار */}
                        <div className="flex-shrink-0 order-2">
                          {benefit.logoClass ? (
                            <motion.div 
                              className={benefit.logoClass}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              animate={{ 
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                scale: { duration: 2, repeat: Infinity }
                              }}
                            >
                              {benefit.logoText}
                            </motion.div>
                          ) : (
                            <motion.div 
                              className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              >
                                <IconComponent className="h-7 w-7 text-blue-600" />
                              </motion.div>
                            </motion.div>
                          )}
                        </div>
                        
                        {/* المحتوى */}
                        <div className="flex-1 text-right order-1">
                          <motion.h3 
                            className="font-bold text-foreground mb-3 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300"
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                            viewport={{ once: true }}
                          >
                            {benefit.title}
                          </motion.h3>
                          <motion.p 
                            className="text-sm text-muted-foreground leading-relaxed"
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                            viewport={{ once: true }}
                          >
                            {benefit.description}
                          </motion.p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* إحصائيات متحركة */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { number: "15000+", label: "مشروع مكتمل", color: "text-blue-600" },
            { number: "500+", label: "مترجم محترف", color: "text-purple-600" },
            { number: "100+", label: "لغة متاحة", color: "text-emerald-600" },
            { number: "99%", label: "دقة في الترجمة", color: "text-orange-600" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="space-y-3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20"
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                transition: { duration: 0.3 }
              }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: { duration: 2 + index * 0.3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <motion.div 
                className={`text-4xl font-bold ${stat.color}`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;