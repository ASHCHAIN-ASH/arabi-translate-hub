import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  Award,
  Globe,
  Users,
  GraduationCap,
  BookOpen,
  Microscope,
  Languages,
  Star,
  ChevronDown
} from 'lucide-react';

const ProfessionalHeroSection: React.FC = () => {
  const coreServices = [
    {
      icon: Microscope,
      title: "البحث",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: BookOpen,
      title: "الكتابة الأكاديمية",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Languages,
      title: "الترجمة",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Users,
      title: "الاستشارات",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const achievements = [
    { value: "+50", label: "دولة", icon: Globe },
    { value: "99%", label: "نسبة النجاح", icon: Award },
    { value: "+10K", label: "طالب", icon: Users }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      
      {/* Academic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, hsl(220, 70%, 50%) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, hsl(270, 70%, 50%) 2px, transparent 2px),
              linear-gradient(45deg, transparent 49%, hsl(220, 70%, 50%) 49%, hsl(220, 70%, 50%) 51%, transparent 51%)
            `,
            backgroundSize: '60px 60px, 60px 60px, 30px 30px'
          }}
        />
      </div>

      {/* Floating Academic Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 backdrop-blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Academic Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          {/* Institutional Logo */}
          <motion.div
            className="inline-flex items-center justify-center w-32 h-32 mb-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-full shadow-2xl border-4 border-white/20"
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
            <GraduationCap className="h-16 w-16 text-white" />
          </motion.div>

          {/* Institution Names */}
          <div className="space-y-6">
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-800 dark:text-white leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                وكالة فكرة إيدو
              </span>
            </motion.h1>
            
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-700 dark:text-slate-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              FekrahEdu Agency
            </motion.h2>
            
            <motion.p 
              className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-medium max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              الحلول التعليمية المتقدمة | Advanced Educational Solutions
            </motion.p>
          </div>
        </motion.div>

        {/* Academic Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16"
        >
          {coreServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300"
              >
                <motion.div 
                  className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-arabic-formal font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Academic Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
        >
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center group"
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-200/50 dark:border-blue-700/50"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <div className="text-4xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {achievement.value}
                </div>
                <div className="text-lg font-arabic-formal font-semibold text-slate-800 dark:text-slate-200">
                  {achievement.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto mb-32"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-2xl px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-300 border-2 border-blue-200/30 hover:border-blue-200/50"
            >
              ابدأ رحلتك الأكاديمية
              <ArrowRight className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto group bg-white/80 dark:bg-slate-800/80 border-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-500 px-12 py-6 text-xl font-bold rounded-2xl backdrop-blur-lg transition-all duration-300 shadow-xl"
            >
              <BookOpen className="h-6 w-6 ml-3 group-hover:rotate-12 transition-transform" />
              استكشف خدماتنا التعليمية
            </Button>
          </motion.div>
        </motion.div>

      </div>

      {/* Academic Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-slate-600 dark:text-slate-400 cursor-pointer group"
        >
          <span className="text-sm mb-2 font-medium group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
            اكتشف المزيد
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center group-hover:border-slate-600 dark:group-hover:border-slate-300 transition-colors bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <ChevronDown className="h-4 w-4" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProfessionalHeroSection;