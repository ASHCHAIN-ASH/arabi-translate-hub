import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Clock, Shield, Award, Globe, Star, Headphones } from "lucide-react";
import enagoHeroBg from "@/assets/enago-hero-bg.jpg";

const ServicesShowcase = () => {
  const benefits = [
    {
      id: 1,
      title: "دقة 99%+ في الترجمة",
      description: "نضمن أعلى مستويات الدقة في جميع أعمال الترجمة مع مراجعة متعددة المراحل",
      icon: CheckCircle,
      position: { x: -350, y: -180 },
      delay: 0.2
    },
    {
      id: 2,
      title: "فريق مترجمين محترفين",
      description: "أكثر من 500 مترجم معتمد ومتخصص في جميع المجالات الأكاديمية والمهنية",
      icon: Users,
      position: { x: 350, y: -180 },
      delay: 0.3
    },
    {
      id: 3,
      title: "+100 لغة متاحة",
      description: "تغطية شاملة لجميع اللغات العالمية مع تخصص في اللغات الأكاديمية النادرة",
      icon: Globe,
      position: { x: 430, y: -50 },
      delay: 0.4
    },
    {
      id: 4,
      title: "دعم فني 24/7",
      description: "فريق خدمة عملاء متخصص متاح على مدار الساعة لتقديم الدعم الفوري",
      icon: Headphones,
      position: { x: -430, y: -50 },
      delay: 0.5
    },
    {
      id: 5,
      title: "شهادات معتمدة",
      description: "ترجمة رسمية معتمدة ومصدقة للمستندات الأكاديمية والقانونية والرسمية",
      icon: Award,
      position: { x: 350, y: 180 },
      delay: 0.6
    },
    {
      id: 6,
      title: "سرية وأمان تام",
      description: "حماية مطلقة للمعلومات الحساسة مع اتفاقيات سرية معتمدة دولياً",
      icon: Shield,
      position: { x: -350, y: 180 },
      delay: 0.7
    }
  ];

  const stats = [
    { number: "24/7", label: "دعم فني", color: "text-blue-600" },
    { number: "+100", label: "لغة متاحة", color: "text-purple-600" },
    { number: "+500", label: "مترجم محترف", color: "text-emerald-600" },
    { number: "+15000", label: "مشروع مكتمل", color: "text-orange-600" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold text-foreground mb-6">
            مزايا <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">مجتمع إناغو</span>
          </h2>
        </motion.div>

        {/* التصميم الدائري مع الصورة الجديدة */}
        <div className="relative flex items-center justify-center min-h-[700px] mb-20">
          {/* الصورة المركزية */}
          <motion.div 
            className="relative z-10 w-96 h-96 rounded-full overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img 
              src={enagoHeroBg} 
              alt="خدماتنا الاحترافية"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-600/30 to-transparent"></div>
            
            {/* النص المركزي */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white bg-blue-600/90 backdrop-blur-sm rounded-full px-8 py-4 shadow-xl">
                <div className="text-3xl font-bold">خدماتنا</div>
                <div className="text-lg font-medium">الاحترافية</div>
              </div>
            </div>
          </motion.div>

          {/* البطاقات الموزعة حول الصورة */}
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                className="absolute"
                style={{
                  transform: `translate(${benefit.position.x}px, ${benefit.position.y}px)`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: benefit.delay }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                        <IconComponent className="h-7 w-7 text-blue-600" />
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="font-bold text-foreground mb-3 text-lg leading-tight">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* الإحصائيات */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="space-y-3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`text-4xl font-bold ${stat.color}`}>{stat.number}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;