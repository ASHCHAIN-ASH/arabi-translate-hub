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
    <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 mobile-section">
      
      {/* خلفية متحركة للقسم الرئيسي */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 w-60 h-60 sm:w-96 sm:h-96 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
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

      <div className="mobile-container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* المحتوى النصي */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right order-2 lg:order-1"
          >
            {/* شعار الجامعة */}
            <motion.div
              className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <GraduationCap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                وكالة معتمدة للحلول التعليمية
              </span>
            </motion.div>

            {/* العنوان الرئيسي */}
            <motion.h1 
              className="mobile-title mb-3 sm:mb-4"
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
              className="mobile-subheading-responsive font-tajawal font-medium text-slate-600 dark:text-slate-300 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              MasterEduPath Agency
            </motion.h2>
            
            {/* الوصف */}
            <motion.p 
              className="mobile-body text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0"
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
                className="mobile-button-responsive bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl touch-target"
              >
                ابدأ رحلتك التعليمية
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
              
              <Button 
                variant="outline"
                className="mobile-button-responsive border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 rounded-lg sm:rounded-xl touch-target"
              >
                <PlayCircle className="h-4 w-4 ml-2" />
                شاهد عرضنا التقديمي
              </Button>
            </motion.div>
          </motion.div>

          {/* الجانب البصري */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-1 lg:order-2 mb-6 lg:mb-0 flex justify-center"
          >
            {/* خلفية دائرية */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
              
              {/* الشعار المركزي */}
              <motion.div
                className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    "0 15px 30px -8px rgba(59, 130, 246, 0.3)",
                    "0 15px 30px -8px rgba(99, 102, 241, 0.3)",
                    "0 15px 30px -8px rgba(139, 92, 246, 0.3)",
                    "0 15px 30px -8px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-center text-white">
                  <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-1 sm:mb-2" />
                  <div className="text-sm sm:text-base lg:text-lg font-bold mb-0.5 sm:mb-1">ماستر إيدو باث</div>
                  <div className="text-xs sm:text-sm lg:text-base opacity-90">للتميز الأكاديمي</div>
                </div>
              </motion.div>

              {/* عناصر متحركة حول الشعار */}
              {[
                { icon: BookOpen, position: 'top-2 right-2', delay: 0.5 },
                { icon: Users, position: 'bottom-2 right-2', delay: 1 },
                { icon: Award, position: 'bottom-2 left-2', delay: 1.5 },
                { icon: Building2, position: 'top-2 left-2', delay: 2 }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    className={`absolute ${item.position} w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center border border-slate-200 dark:border-slate-700`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: item.delay }}
                    whileHover={{ scale: 1.1, y: -4 }}
                  >
                    <IconComponent className="h-4 w-4 text-slate-600 dark:text-slate-300" />
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