import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Clock, Shield, Award, Globe, Star, Headphones } from "lucide-react";

const ServicesShowcase = () => {
  const benefits = [
    {
      id: 1,
      title: "دقة 99%+ في الترجمة",
      description: "نضمن أعلى مستويات الدقة في جميع أعمال الترجمة مع مراجعة مزدوجة من خبراء متخصصين",
      icon: CheckCircle,
      delay: 0.1
    },
    {
      id: 2,
      title: "فريق مترجمين محترفين",
      description: "أكثر من 500 مترجم معتمد ومتخصص في مختلف المجالات الأكاديمية والمهنية",
      icon: Users,
      delay: 0.2
    },
    {
      id: 3,
      title: "تسليم في الوقت المحدد",
      description: "التزام صارم بمواعيد التسليم المتفق عليها مع إمكانية التسليم المستعجل",
      icon: Clock,
      delay: 0.3
    },
    {
      id: 4,
      title: "سرية وأمان تام",
      description: "حماية مطلقة للمعلومات والبيانات الحساسة مع اتفاقيات سرية معتمدة",
      icon: Shield,
      delay: 0.4
    },
    {
      id: 5,
      title: "شهادات معتمدة",
      description: "ترجمة رسمية معتمدة ومصدقة للمستندات الأكاديمية والقانونية",
      icon: Award,
      delay: 0.5
    },
    {
      id: 6,
      title: "+100 لغة متاحة",
      description: "تغطية شاملة لجميع اللغات العالمية مع تخصص في اللغات الأكاديمية",
      icon: Globe,
      delay: 0.6
    },
    {
      id: 7,
      title: "تقييم 5 نجوم",
      description: "تقييمات متميزة من العملاء مع معدل رضا يتجاوز 98% في جميع الخدمات",
      icon: Star,
      delay: 0.7
    },
    {
      id: 8,
      title: "دعم فني 24/7",
      description: "فريق خدمة عملاء متاح على مدار الساعة لتقديم المساعدة والإرشاد اللازم",
      icon: Headphones,
      delay: 0.8
    }
  ];

  const stats = [
    { number: "15000+", label: "مشروع مكتمل", color: "text-blue-600" },
    { number: "500+", label: "مترجم محترف", color: "text-emerald-600" },
    { number: "100+", label: "لغة متاحة", color: "text-purple-600" },
    { number: "99%", label: "دقة في الترجمة", color: "text-orange-600" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold text-foreground mb-6">
            مزايا <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">خدماتنا الأكاديمية</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اكتشف لماذا يثق بنا آلاف الطلاب والباحثين والمؤسسات الأكاديمية حول العالم
          </p>
        </motion.div>

        {/* الإحصائيات */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* بطاقات المزايا */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: benefit.delay }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -8 }}
              >
                <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl mb-4 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                      <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    <h3 className="font-bold text-foreground mb-3 text-lg text-right leading-tight group-hover:text-blue-600 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed text-right flex-1">
                      {benefit.description}
                    </p>

                    <div className="mt-4 w-full h-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full group-hover:from-blue-500/40 group-hover:to-purple-500/40 transition-all duration-300"></div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* دعوة للعمل */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">هل أنت مستعد للبدء؟</h3>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                انضم إلى آلاف العملاء الذين اختاروا التميز الأكاديمي معنا
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ابدأ مشروعك الآن
                </motion.button>
                <motion.button 
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-bold hover:bg-white/10 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  تواصل معنا
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;