import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';

const ServiceSteps = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      id: 1,
      icon: MessageSquare,
      title: "التشاور والتقييم المتخصص",
      description: "استشارة أكاديمية مجانية لفهم احتياجاتكم البحثية وتحديد نطاق العمل بدقة عالية",
      details: ["تقييم شامل للمشروع", "تحديد المتطلبات الأكاديمية", "استشارة متخصصة"],
      duration: "30 دقيقة",
      color: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      id: 2,
      icon: FileText,
      title: "إعداد خطة العمل الأكاديمية",
      description: "وضع استراتيجية بحثية شاملة ومخطط زمني مفصل لتنفيذ الخدمة وفق المعايير العالمية",
      details: ["خطة تنفيذية مفصلة", "جدول زمني واضح", "توزيع مهام محترف"],
      duration: "1-2 أيام",
      color: "from-emerald-600 to-teal-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      id: 3,
      icon: Users,
      title: "التنفيذ الاحترافي",
      description: "بدء العمل من قبل فريق أكاديمي متخصص مع متابعة مستمرة للتقدم والجودة",
      details: ["فريق متخصص", "متابعة يومية", "تقارير دورية"],
      duration: "حسب المشروع",
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "المراجعة والتسليم المتميز",
      description: "مراجعة أكاديمية شاملة للجودة وتسليم العمل النهائي مع ضمان الرضا الكامل",
      details: ["مراجعة شاملة", "ضمان الجودة", "تسليم نهائي احترافي"],
      duration: "1-3 أيام",
      color: "from-amber-600 to-orange-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/20"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      
      {/* خلفية أكاديمية متطورة */}
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-400/15 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
        />
      </div>

      {/* شبكة نقاط */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200 dark:border-blue-700 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Target className="h-4 w-4" />
            منهجية عمل احترافية
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-white">
            مراحل تنفيذ{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              خدماتنا الأكاديمية
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            عملية منظمة ومدروسة تضمن تقديم أفضل الخدمات البحثية والأكاديمية بجودة عالمية
          </p>
        </motion.div>

        {/* المراحل */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                {/* رقم المرحلة */}
                <motion.div 
                  className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-20 border-2 border-white dark:border-slate-800"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.id}
                </motion.div>
                
                <Card className="relative overflow-hidden border-0 bg-white dark:bg-slate-800 hover:shadow-2xl transition-all duration-300 h-full">
                  {/* خط علوي متدرج */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${step.color}`} />
                  
                  {/* خلفية تفاعلية */}
                  <div className={`absolute inset-0 ${step.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardContent className="p-6 relative z-10">
                    {/* الأيقونة */}
                    <motion.div 
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        scale: 1.1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    {/* العنوان */}
                    <h3 className="text-xl font-bold text-center mb-3 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {step.title}
                    </h3>
                    
                    {/* المدة */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {step.duration}
                      </span>
                    </div>
                    
                    {/* الوصف */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 text-center">
                      {step.description}
                    </p>
                    
                    {/* التفاصيل */}
                    <div className="space-y-2">
                      {step.details.map((detail, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * i }}
                          viewport={{ once: true }}
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} flex-shrink-0`} />
                          <span className="text-slate-700 dark:text-slate-300">
                            {detail}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* خط الربط للمرحلة التالية */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-1/2 -left-3 w-6 h-0.5 bg-gradient-to-r from-slate-300 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
                    viewport={{ once: true }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8"
              onClick={() => navigate('/order-now')}
            >
              <Sparkles className="h-5 w-5 ml-2" />
              ابدأ مشروعك الآن
              <ArrowRight className="h-5 w-5 mr-2" />
            </Button>
          </motion.div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            انضم إلى آلاف الباحثين الذين وثقوا بخدماتنا الأكاديمية
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceSteps;