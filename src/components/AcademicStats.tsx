import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Globe, 
  Award, 
  BookOpen,
  GraduationCap,
  TrendingUp,
  Building2,
  CheckCircle
} from 'lucide-react';

const AcademicStats = () => {
  const stats = [
    {
      icon: Users,
      value: "+10,000",
      label: "طالب وباحث",
      sublabel: "Students & Researchers",
      description: "من جميع أنحاء العالم يثقون في خدماتنا",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: Globe,
      value: "+50",
      label: "دولة",
      sublabel: "Countries",
      description: "نقدم خدماتنا في أكثر من 50 دولة حول العالم",
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: Award,
      value: "100%",
      label: "نسبة النجاح",
      sublabel: "Success Rate",
      description: "معدل رضا استثنائي مع ضمان الجودة",
      color: "from-amber-600 to-orange-600"
    },
    {
      icon: BookOpen,
      value: "+5,000",
      label: "مشروع مكتمل",
      sublabel: "Completed Projects",
      description: "من الأبحاث والرسائل والترجمات المتخصصة",
      color: "from-purple-600 to-pink-600"
    }
  ];

  const achievements = [
    {
      icon: GraduationCap,
      title: "شراكات أكاديمية",
      description: "شريك معتمد لأكثر من 200 جامعة ومؤسسة تعليمية عالمية"
    },
    {
      icon: TrendingUp,
      title: "نمو مستمر",
      description: "نسبة نمو سنوية 150% في عدد المشاريع المكتملة بنجاح"
    },
    {
      icon: Building2,
      title: "اعتماد دولي",
      description: "معتمدون من المنظمات الدولية للتعليم والبحث العلمي"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950 relative overflow-hidden">
      
      {/* خلفية إحصائيات متحركة */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-16 right-16 w-72 h-72 bg-gradient-to-br from-amber-400/40 to-orange-400/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-16 left-16 w-96 h-96 bg-gradient-to-tl from-red-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 right-1/3 w-60 h-60 bg-gradient-to-r from-orange-400/25 to-amber-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* العنوان */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-arabic-formal font-bold mb-4 sm:mb-6 text-slate-800 dark:text-white">
            أرقام تتحدث عن <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">التميز</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            إنجازاتنا وأرقامنا تعكس الثقة التي يوليها لنا شركاؤنا الأكاديميون حول العالم
          </p>
        </motion.div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <Card className="relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 h-full text-center group">
                  
                  {/* خط علوي */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                  
                  <CardContent className="p-6 sm:p-8">
                    {/* الأيقونة */}
                    <motion.div 
                      className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                    </motion.div>
                    
                    {/* الرقم */}
                    <motion.div 
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.div>
                    
                    {/* التسمية العربية */}
                    <h3 className="text-base sm:text-lg lg:text-xl font-arabic-formal font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {stat.label}
                    </h3>
                    
                    {/* التسمية الإنجليزية */}
                    <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mb-3 sm:mb-4 font-medium">
                      {stat.sublabel}
                    </p>
                    
                    {/* الوصف */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* الإنجازات الإضافية */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg lg:text-xl font-arabic-formal font-bold text-slate-800 dark:text-white mb-2">
                      {achievement.title}
                    </h4>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                
                {/* مؤشر الصحة */}
                <div className="flex items-center justify-end mt-3 sm:mt-4">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">مؤكد</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AcademicStats;