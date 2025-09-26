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
    <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      
      {/* خلفية متحركة للقسم الرئيسي */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
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
              className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <GraduationCap className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                وكالة معتمدة للحلول التعليمية
              </span>
            </motion.div>

            {/* العنوان الرئيسي */}
            <motion.h1 
              className="text-2xl sm:text-3xl lg:text-4xl font-arabic-formal font-bold leading-tight mb-3"
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
              className="text-lg sm:text-xl font-tajawal font-medium text-slate-600 dark:text-slate-300 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              MasterEduPath Agency
            </motion.h2>
            
            {/* الوصف */}
            <motion.p 
              className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              شريكك الموثوق في التعليم العالي والبحث العلمي. نقدم حلولاً متطورة ومعتمدة للجامعات والمراكز البحثية والطلاب المتميزين حول العالم.
            </motion.p>

            {/* الأزرار */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8 lg:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ابدأ رحلتك التعليمية
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full sm:w-auto border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
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
            className="relative lg:block hidden"
          >
            {/* خلفية دائرية */}
            <div className="relative w-full max-w-md lg:max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
              
              {/* الشعار المركزي */}
              <motion.div
                className="relative w-48 h-48 mx-auto bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    "0 20px 40px -10px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px -10px rgba(99, 102, 241, 0.3)",
                    "0 20px 40px -10px rgba(139, 92, 246, 0.3)",
                    "0 20px 40px -10px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-center text-white">
                  <GraduationCap className="h-12 w-12 mx-auto mb-2" />
                  <div className="text-base font-bold mb-1">ماستر إيدو باث</div>
                  <div className="text-xs opacity-90">للتميز الأكاديمي</div>
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