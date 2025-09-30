import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Rocket, PlayCircle, ChevronRight, Trophy, Star, Users, BookOpen } from 'lucide-react';

const stats = [
  {
    number: "15,000+",
    label: "مشروع بحثي مكتمل",
    icon: <Trophy className="h-8 w-8" />,
    color: "text-blue-600"
  },
  {
    number: "98%",
    label: "معدل رضا العملاء",
    icon: <Star className="h-8 w-8" />,
    color: "text-orange-500"
  },
  {
    number: "500+",
    label: "باحث وأكاديمي متخصص",
    icon: <Users className="h-8 w-8" />,
    color: "text-green-600"
  },
  {
    number: "50+",
    label: "تخصص أكاديمي مغطى",
    icon: <BookOpen className="h-8 w-8" />,
    color: "text-purple-600"
  }
];

export const ResearchHeroSection = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-12 md:py-0">
      {/* Optimized Background - Hidden on mobile for performance */}
      <div className="absolute inset-0 hidden md:block">
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div
          className="absolute top-20 left-10 w-64 md:w-96 h-64 md:h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-64 md:w-80 h-64 md:h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Mobile gradient background */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-b from-blue-500/20 to-purple-500/20"></div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Main Logo/Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/30"
            whileHover={{ scale: 1.1 }}
          >
            <Brain className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              مركز ماستر للأبحاث
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              MasterEduPath Research Center
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-5xl mx-auto mb-8 md:mb-12 leading-relaxed text-blue-100/90 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            🎓 رواد التميز الأكاديمي في العالم العربي
            <br className="hidden sm:block" />
            <span className="hidden sm:inline"> - نحول أحلامكم البحثية إلى حقائق علمية مبهرة</span>
            <br />
            <span className="text-sm sm:text-base md:text-lg text-blue-200/80 block mt-2">
              ✨ 15,000+ مشروع | 🌟 98% رضا | 🏆 500+ خبير
            </span>
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 md:mb-16 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-full font-bold transition-all duration-300 border-0 w-full sm:w-auto"
            >
              <Rocket className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
              🚀 ابدأ مشروعك الآن
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/40 text-white hover:bg-white/20 backdrop-blur-md text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-full font-bold transition-all duration-300 w-full sm:w-auto"
            >
              <PlayCircle className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
              📹 شاهد قصص النجاح
            </Button>
          </motion.div>

          {/* Statistics */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
              >
                <div className={`${stat.color} mb-2 md:mb-3 flex justify-center`}>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                    {stat.icon}
                  </div>
                </div>
                <motion.div
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 1.6 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-xs sm:text-sm leading-tight text-blue-200/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};