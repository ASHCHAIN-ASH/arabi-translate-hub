import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Zap,
  Shield
} from 'lucide-react';

const ServiceSteps = () => {
  const steps = [
    {
      id: 1,
      icon: MessageSquare,
      title: "التشاور والتقييم",
      description: "استشارة مجانية لفهم احتياجاتكم وتحديد نطاق العمل بدقة",
      details: ["تقييم شامل للمشروع", "تحديد المتطلبات", "استشارة متخصصة"],
      duration: "30 دقيقة",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      id: 2,
      icon: FileText,
      title: "إعداد خطة العمل",
      description: "وضع استراتيجية شاملة ومخطط زمني مفصل لتنفيذ الخدمة",
      details: ["خطة مفصلة", "جدول زمني واضح", "توزيع المهام"],
      duration: "1-2 أيام",
      color: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      id: 3,
      icon: Users,
      title: "تنفيذ الخدمة",
      description: "بدء العمل من قبل فريق متخصص مع متابعة مستمرة للتقدم",
      details: ["فريق متخصص", "متابعة يومية", "تقارير دورية"],
      duration: "حسب المشروع",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "المراجعة والتسليم",
      description: "مراجعة شاملة للجودة وتسليم العمل النهائي مع ضمان الرضا",
      details: ["مراجعة شاملة", "ضمان الجودة", "تسليم نهائي"],
      duration: "1-3 أيام",
      color: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950 relative overflow-hidden">
      
      {/* خلفية للمراحل */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-24 right-24 w-72 h-72 bg-gradient-to-br from-slate-400/20 to-gray-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-24 left-24 w-80 h-80 bg-gradient-to-tl from-zinc-400/20 to-slate-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 right-1/2 w-56 h-56 bg-gradient-to-r from-gray-400/15 to-zinc-400/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-arabic-formal font-bold text-foreground mb-4">
            مراحل تنفيذ الخدمة
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            عملية منظمة ومدروسة لضمان تقديم أفضل الخدمات التعليمية والبحثية
          </p>
        </motion.div>

        {/* المراحل */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">{steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="relative group cursor-pointer"
                >
                  {/* رقم المرحلة */}
                  <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-md z-20">
                    {step.id}
                  </div>
                  
                  <Card className="relative overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300 h-full">
                    {/* خط علوي بسيط */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`} />
                    
                    <CardContent className="p-4 sm:p-6 relative z-10">
                      {/* الأيقونة والعنوان */}
                      <div className="mb-4 sm:mb-6">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shadow-sm mb-3 mx-auto`}>
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        
                        <h3 className="text-base sm:text-lg lg:text-xl font-arabic-formal font-semibold text-foreground text-center mb-2">
                          {step.title}
                        </h3>
                        
                        {/* مدة التنفيذ */}
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3">{/* <Clock className="h-3 w-3 text-muted-foreground" /> */}
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {step.duration}
                          </span>
                        </div>
                      </div>
                      
                      {/* الوصف */}
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 text-center">
                        {step.description}
                      </p>
                      
                      {/* التفاصيل */}
                      <div className="space-y-1.5 sm:space-y-2">{step.details.map((detail, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs sm:text-sm"
                          >
                            <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r ${step.color} flex-shrink-0`} />
                            <span className="text-muted-foreground">
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* دعوة بسيطة للعمل */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            هل تريد البدء في مشروعك؟
          </p>
          <motion.button
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm sm:text-base hover:bg-primary/90 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>ابدأ الآن</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceSteps;