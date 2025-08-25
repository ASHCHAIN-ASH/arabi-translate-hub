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
      position: "top-10 left-10",
      delay: 0.2
    },
    {
      id: 2,
      title: "فريق مترجمين محترفين",
      description: "أكثر من 500 مترجم معتمد في جميع التخصصات",
      icon: Users,
      position: "top-10 right-10",
      delay: 0.3
    },
    {
      id: 3,
      title: "تسليم في الوقت المحدد",
      description: "التزام كامل بمواعيد التسليم المتفق عليها",
      icon: Clock,
      position: "top-1/2 left-5 -translate-y-1/2",
      delay: 0.4
    },
    {
      id: 4,
      title: "سرية وأمان تام",
      description: "حماية كاملة لمعلوماتكم وبياناتكم الحساسة",
      icon: Shield,
      position: "top-1/2 right-5 -translate-y-1/2",
      delay: 0.5
    },
    {
      id: 5,
      title: "شهادات معتمدة",
      description: "ترجمة معتمدة ومصدقة للمستندات الرسمية",
      icon: Award,
      position: "bottom-20 left-10",
      delay: 0.6
    },
    {
      id: 6,
      title: "+100 لغة متاحة",
      description: "تغطية شاملة لجميع اللغات العالمية الرئيسية",
      icon: Globe,
      position: "bottom-20 right-10",
      delay: 0.7
    },
    {
      id: 7,
      title: "تقييم 5 نجوم",
      description: "رضا العملاء هو أولويتنا القصوى",
      icon: Star,
      position: "bottom-5 left-1/4",
      delay: 0.8
    },
    {
      id: 8,
      title: "دعم فني 24/7",
      description: "خدمة عملاء متاحة على مدار الساعة",
      icon: Headphones,
      position: "bottom-5 right-1/4",
      delay: 0.9
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

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
            مزايا <span className="text-gradient">خدماتنا</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اكتشف لماذا يثق بنا آلاف العملاء حول العالم لجميع احتياجاتهم من الترجمة
          </p>
        </motion.div>

        {/* التصميم الرئيسي */}
        <div className="relative max-w-6xl mx-auto">
          {/* الصورة المركزية */}
          <motion.div 
            className="relative z-10 w-80 h-80 mx-auto rounded-full overflow-hidden shadow-2xl"
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
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
          </motion.div>

          {/* بطاقات المزايا */}
          <div className="absolute inset-0 w-full h-full">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.id}
                  className={`absolute ${benefit.position} w-72 md:w-80`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: benefit.delay }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary" />
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
        </div>

        {/* إحصائيات سريعة */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">15000+</div>
            <div className="text-sm text-muted-foreground">مشروع مكتمل</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">مترجم محترف</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">100+</div>
            <div className="text-sm text-muted-foreground">لغة متاحة</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">دعم فني</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;