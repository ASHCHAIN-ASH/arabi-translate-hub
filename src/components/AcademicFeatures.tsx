import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  GraduationCap,
  BookOpen,
  Languages,
  Award,
  Shield,
  Clock,
  Users,
  Target,
  CheckCircle
} from 'lucide-react';

const AcademicFeatures = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "خبرة أكاديمية متخصصة",
      description: "فريق من الأكاديميين وحملة الدكتوراه المتخصصين في جميع المجالات العلمية والبحثية",
      tags: ["PhD خبراء", "اعتماد دولي", "مراجعة دقيقة"],
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: BookOpen,
      title: "منهجية علمية متطورة",
      description: "نتبع أحدث المعايير الدولية في البحث العلمي والكتابة الأكاديمية وفقاً لأفضل الممارسات العالمية",
      tags: ["منهجية علمية", "معايير دولية", "تحديث مستمر"],
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: Languages,
      title: "ترجمة أكاديمية متعددة اللغات",
      description: "ترجمة متخصصة للأوراق البحثية والرسائل الجامعية في أكثر من 180 لغة بدقة علمية عالية",
      tags: ["180+ لغة", "دقة علمية", "متخصصون"],
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: Award,
      title: "ضمان الجودة والتميز",
      description: "معدل رضا 99.8% مع ضمان النجاح وإعادة التعديل مجاناً حتى تحقيق أعلى معايير الجودة المطلوبة",
      tags: ["ضمان 99.8%", "مراجعة مجانية", "معايير عالية"],
      color: "from-amber-600 to-orange-600"
    },
    {
      icon: Shield,
      title: "سرية وأمان مطلق",
      description: "حماية كاملة للمعلومات الشخصية والبحثية مع التزام صارم بمعايير الخصوصية الأكاديمية",
      tags: ["حماية مطلقة", "سرية تامة", "أمان متقدم"],
      color: "from-teal-600 to-cyan-600"
    },
    {
      icon: Clock,
      title: "التزام بالمواعيد النهائية",
      description: "تسليم دقيق في الوقت المحدد مع إمكانية التسليم العاجل خلال 24-48 ساعة حسب الحاجة",
      tags: ["تسليم دقيق", "24-48 ساعة", "مواعيد محددة"],
      color: "from-rose-600 to-red-600"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background to-slate-50/50 dark:to-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* العنوان المحدث */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-arabic-formal font-bold mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            لماذا تثق بنا <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">المؤسسات التعليمية الرائدة؟</span>
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            حلول تعليمية وبحثية متطورة مخصصة للجامعات والمراكز البحثية والطلاب المتميزين حول العالم
          </motion.p>

          {/* مؤشرات الثقة */}
          <motion.div
            className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Users, text: "200+ مؤسسة", color: "text-blue-600" },
              { icon: Target, text: "99.8% نجاح", color: "text-emerald-600" },
              { icon: Award, text: "اعتماد دولي", color: "text-amber-600" }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-800 px-3 sm:px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
                  <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.text}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
        
        {/* شبكة المميزات */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8">{features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="h-full"
              >
                <Card className="relative overflow-hidden border-2 border-transparent bg-white dark:bg-slate-800 hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-500 h-full group">
                  
                  {/* خط علوي ملون */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`} />
                  
                  <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                    
                    {/* الأيقونة والعنوان */}
                    <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <motion.div 
                        className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                        whileHover={{ 
                          rotate: [0, -3, 3, 0],
                          scale: 1.05
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-arabic-formal font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight mb-2 sm:mb-3">
                          {feature.title}
                        </h3>
                        <motion.div
                          className={`w-12 h-0.5 bg-gradient-to-r ${feature.color} rounded-full group-hover:w-20 transition-all duration-300`}
                          initial={{ width: 48 }}
                          whileInView={{ width: 80 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                    
                    {/* الوصف */}
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 flex-grow">
                      {feature.description}
                    </p>
                    
                    {/* العلامات */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">{feature.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2 sm:px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* مؤشر الجودة */}
                    <motion.div
                      className="flex items-center justify-between pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200 dark:border-slate-700"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-medium">معتمد ومضمون</span>
                      </div>
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${feature.color} opacity-20 flex items-center justify-center`}>
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AcademicFeatures;