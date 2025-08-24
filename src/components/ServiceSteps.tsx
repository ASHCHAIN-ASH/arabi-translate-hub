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
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
      {/* خلفية هندسية متقدمة */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsl(220, 70%, 50%) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, hsl(270, 70%, 50%) 2px, transparent 2px),
            linear-gradient(45deg, transparent 49%, hsl(220, 70%, 50%) 49%, hsl(220, 70%, 50%) 51%, transparent 51%)
          `,
          backgroundSize: '80px 80px, 80px 80px, 40px 40px'
        }} />
      </div>

      {/* عناصر متحركة في الخلفية */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-primary via-secondary to-accent rounded-full shadow-2xl"
            animate={{ 
              boxShadow: [
                "0 25px 50px -12px rgba(59, 130, 246, 0.4)",
                "0 25px 50px -12px rgba(139, 92, 246, 0.4)",
                "0 25px 50px -12px rgba(79, 70, 229, 0.4)",
                "0 25px 50px -12px rgba(59, 130, 246, 0.4)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="h-10 w-10 text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-arabic-formal font-bold text-foreground mb-6">
            مراحل تنفيذ الخدمة
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            عملية منظمة ومدروسة لضمان تقديم أفضل الخدمات التعليمية والبحثية بأعلى معايير الجودة
          </p>
        </motion.div>

        {/* المراحل */}
        <div className="relative">
          {/* خط الربط بين المراحل */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-secondary/30 to-accent/20 transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group cursor-pointer"
                >
                  {/* رقم المرحلة */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl z-20 border-4 border-white dark:border-slate-800"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {step.id}
                  </motion.div>

                  {/* سهم الانتقال (للشاشات الكبيرة) */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute top-1/2 -left-8 w-16 h-16 transform -translate-y-1/2 z-10"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <ArrowRight className="h-8 w-8 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                      </div>
                    </motion.div>
                  )}

                  <Card className={`relative overflow-hidden border-2 border-transparent bg-gradient-to-br ${step.bgGradient} dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 h-full group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-background/50`}>
                    {/* تأثير الإضاءة */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* خط علوي ملون */}
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${step.color}`} />
                    
                    <CardContent className="p-8 relative z-10">
                      {/* الأيقونة والعنوان */}
                      <motion.div 
                        className="mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div 
                          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl mb-4 mx-auto group-hover:shadow-2xl transition-shadow duration-300`}
                          whileHover={{ 
                            rotate: [0, -5, 5, -5, 0],
                            scale: 1.1
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          <IconComponent className="h-10 w-10 text-white" />
                        </motion.div>
                        
                        <h3 className="text-xl font-arabic-formal font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-center mb-2">
                          {step.title}
                        </h3>
                        
                        {/* مدة التنفيذ */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            {step.duration}
                          </span>
                        </div>
                      </motion.div>
                      
                      {/* الوصف */}
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 text-center group-hover:text-foreground/80 transition-colors duration-300">
                        {step.description}
                      </p>
                      
                      {/* التفاصيل */}
                      <div className="space-y-2">
                        {step.details.map((detail, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center gap-3 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + i * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} flex-shrink-0`} />
                            <span className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                              {detail}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* مؤشر الأمان والجودة */}
                      <motion.div
                        className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-muted/20 group-hover:border-primary/20 transition-colors duration-300"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Shield className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                        <span className="text-xs text-primary/60 group-hover:text-primary font-medium transition-colors duration-300">
                          مضمون الجودة
                        </span>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* دعوة للعمل */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-primary/25 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>ابدأ مشروعك الآن</span>
            <ArrowRight className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceSteps;