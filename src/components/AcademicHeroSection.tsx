import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award,
  ArrowRight,
  PlayCircle,
  Building2
} from 'lucide-react';

const AcademicHeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/20">
      
      {/* خلفية أكاديمية بسيطة */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 49%, hsl(var(--primary)) 49%, hsl(var(--primary)) 51%, transparent 51%),
              linear-gradient(transparent 49%, hsl(var(--primary)) 49%, hsl(var(--primary)) 51%, transparent 51%)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* المحتوى النصي */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            {/* شعار الجامعة */}
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-3 sm:px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                وكالة معتمدة للحلول التعليمية
              </span>
            </motion.div>

            {/* العنوان الرئيسي */}
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-arabic-formal font-bold leading-tight mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="text-slate-800 dark:text-white">وكالة </span>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ماستر إيدو باث
              </span>
            </motion.h1>
            
            <motion.h2 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-tajawal font-medium text-slate-600 dark:text-slate-300 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              MasterEduPath Agency
            </motion.h2>
            
            {/* الوصف */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              شريكك الموثوق في التعليم العالي والبحث العلمي. نقدم حلولاً متطورة ومعتمدة للجامعات والمراكز البحثية والطلاب المتميزين حول العالم.
            </motion.p>

            {/* الأزرار */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 lg:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ابدأ رحلتك التعليمية
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg transition-all duration-300"
              >
                <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                شاهد عرضنا التقديمي
              </Button>
            </motion.div>
          </motion.div>

          {/* الجانب البصري */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative lg:block hidden"
          >
            {/* خلفية دائرية */}
            <div className="relative w-full max-w-md lg:max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
              
              {/* الشعار المركزي */}
              <motion.div
                className="relative w-64 h-64 lg:w-80 lg:h-80 mx-auto bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    "0 25px 50px -12px rgba(59, 130, 246, 0.4)",
                    "0 25px 50px -12px rgba(99, 102, 241, 0.4)",
                    "0 25px 50px -12px rgba(139, 92, 246, 0.4)",
                    "0 25px 50px -12px rgba(59, 130, 246, 0.4)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-center text-white">
                  <GraduationCap className="h-16 w-16 lg:h-20 lg:w-20 mx-auto mb-3 lg:mb-4" />
                  <div className="text-lg lg:text-2xl font-bold mb-1 lg:mb-2">ماستر إيدو باث</div>
                  <div className="text-xs lg:text-sm opacity-90">للتميز الأكاديمي</div>
                </div>
              </motion.div>

              {/* عناصر متحركة حول الشعار */}
              {[
                { icon: BookOpen, position: 'top-2 right-2 lg:top-4 lg:right-4', delay: 0.5 },
                { icon: Users, position: 'bottom-2 right-2 lg:bottom-4 lg:right-4', delay: 1 },
                { icon: Award, position: 'bottom-2 left-2 lg:bottom-4 lg:left-4', delay: 1.5 },
                { icon: GraduationCap, position: 'top-2 left-2 lg:top-4 lg:left-4', delay: 2 }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    className={`absolute ${item.position} w-12 h-12 lg:w-16 lg:h-16 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center border border-slate-200 dark:border-slate-700`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: item.delay }}
                    whileHover={{ scale: 1.1, y: -4 }}
                  >
                    <IconComponent className="h-6 w-6 lg:h-8 lg:w-8 text-slate-600 dark:text-slate-300" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AcademicHeroSection;