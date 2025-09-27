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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Optimized Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
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
          className="absolute top-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
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

      <div className="container relative mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Main Logo/Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/30"
            whileHover={{ scale: 1.1 }}
          >
            <Brain className="h-16 w-16 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              مركز ماستر للأبحاث
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl">
              MasterEduPath Research Center
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl max-w-5xl mx-auto mb-12 leading-relaxed text-blue-100/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            🎓 رواد التميز الأكاديمي في العالم العربي - نحول أحلامكم البحثية إلى حقائق علمية مبهرة
            <br />
            <span className="text-lg text-blue-200/80">
              ✨ أكثر من 15,000 مشروع بحثي ناجح | 🌟 98% معدل رضا العملاء | 🏆 500+ خبير متخصص
            </span>
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl text-xl px-10 py-6 rounded-full font-bold transition-all duration-300 border-0">
              <Rocket className="h-6 w-6 ml-2" />
              🚀 ابدأ مشروعك الآن
              <ChevronRight className="h-5 w-5 mr-2" />
            </Button>
            
            <Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/20 backdrop-blur-md text-xl px-10 py-6 rounded-full font-bold transition-all duration-300">
              <PlayCircle className="h-6 w-6 ml-2" />
              📹 شاهد قصص النجاح
            </Button>
          </motion.div>

          {/* Statistics */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.1 }}
              >
                <div className={`${stat.color} mb-3 flex justify-center`}>
                  {stat.icon}
                </div>
                <motion.div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 2 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm text-blue-200/80 leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};