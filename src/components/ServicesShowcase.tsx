import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Clock, Shield, Award, Globe, Star, Headphones } from "lucide-react";
import heroTranslation from "@/assets/hero-translation.jpg";

const ServicesShowcase = () => {
  const benefits = [
    {
      id: 1,
      title: "دقة 99%+ في الترجمة",
      description: "نضمن أعلى مستويات الدقة في جميع أعمال الترجمة",
      icon: CheckCircle,
      position: { x: -320, y: -150 },
      delay: 0.2
    },
    {
      id: 2,
      title: "فريق مترجمين محترفين",
      description: "أكثر من 500 مترجم معتمد في جميع التخصصات",
      icon: Users,
      position: { x: 320, y: -150 },
      delay: 0.3
    },
    {
      id: 3,
      title: "+100 لغة متاحة",
      description: "تغطية شاملة لجميع اللغات العالمية الرئيسية",
      icon: Globe,
      position: { x: 400, y: 0 },
      delay: 0.4
    },
    {
      id: 4,
      title: "دعم فني 24/7",
      description: "خدمة عملاء متاحة على مدار الساعة",
      icon: Headphones,
      position: { x: -400, y: 0 },
      delay: 0.5
    },
    {
      id: 5,
      title: "شهادات معتمدة",
      description: "ترجمة معتمدة ومصدقة للمستندات الرسمية",
      icon: Award,
      position: { x: 320, y: 150 },
      delay: 0.6
    },
    {
      id: 6,
      title: "سرية وأمان تام",
      description: "حماية كاملة لمعلوماتكم وبياناتكم الحساسة",
      icon: Shield,
      position: { x: -320, y: 150 },
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
            مزايا <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">خدماتنا</span>
          </h2>
        </motion.div>

        {/* التصميم الدائري */}
        <div className="relative flex items-center justify-center min-h-[600px] mb-20">
          {/* الصورة المركزية */}
          <motion.div 
            className="relative z-10 w-80 h-80 rounded-full overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img 
              src={heroTranslation} 
              alt="خدمات الترجمة الاحترافية"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
            
            {/* النص المركزي */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white bg-blue-600/80 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="text-2xl font-bold">خدماتنا</div>
                <div className="text-sm">الاحترافية</div>
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
                <Card className="w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="font-bold text-foreground mb-2 text-lg">
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
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
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