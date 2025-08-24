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
      title: "Research",
      titleAr: "البحث",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: BookOpen,
      title: "Academic Writing",
      titleAr: "الكتابة الأكاديمية",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Languages,
      title: "Translation",
      titleAr: "الترجمة",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Users,
      title: "Consultation",
      titleAr: "الاستشارات",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const achievements = [
    { value: "10K+", label: "Students", icon: Users },
    { value: "99%", label: "Success Rate", icon: Award },
    { value: "50+", label: "Countries", icon: Globe }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-blue-800/30"
          animate={{ 
            background: [
              "linear-gradient(to top, rgba(88, 28, 135, 0.3), transparent, rgba(30, 64, 175, 0.3))",
              "linear-gradient(to top, rgba(30, 64, 175, 0.3), transparent, rgba(88, 28, 135, 0.3))",
              "linear-gradient(to top, rgba(88, 28, 135, 0.3), transparent, rgba(30, 64, 175, 0.3))"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white space-y-16">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20"
              animate={{ 
                rotate: [0, 360],
                boxShadow: [
                  "0 20px 40px -10px rgba(59, 130, 246, 0.3)",
                  "0 20px 40px -10px rgba(139, 92, 246, 0.3)",
                  "0 20px 40px -10px rgba(16, 185, 129, 0.3)",
                  "0 20px 40px -10px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <GraduationCap className="h-12 w-12 lg:h-16 lg:w-16 text-white" />
            </motion.div>
          </motion.div>

          {/* Company Names */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-6"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              whileHover={{ scale: 1.02 }}
            >
              <span className="block bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
                وكالة ماستر إيدو باث
              </span>
            </motion.h1>

            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              MasterEduPath Agency
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white/70 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Advanced Educational Solutions | الحلول التعليمية المتقدمة
            </motion.p>
          </motion.div>

          {/* Core Services */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {coreServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <motion.div 
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-blue-200 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    {service.titleAr}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 text-center"
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center border border-white/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </motion.div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                    {achievement.value}
                  </div>
                  <div className="text-base text-white/70 group-hover:text-white/90 transition-colors font-medium">
                    {achievement.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                className="w-full sm:w-auto group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl px-10 py-5 text-xl font-bold rounded-2xl transition-all duration-300 border-2 border-white/30 hover:border-white/50"
              >
                ابدأ رحلتك معنا
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
                className="w-full sm:w-auto group bg-white/15 border-2 border-white/40 text-white hover:bg-white/25 hover:border-white/60 px-10 py-5 text-xl font-bold rounded-2xl backdrop-blur-sm transition-all duration-300 shadow-xl"
              >
                <BookOpen className="h-6 w-6 ml-3 group-hover:rotate-12 transition-transform" />
                استكشف خدماتنا
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.3 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/50 cursor-pointer group"
        >
          <span className="text-sm mb-2 font-medium group-hover:text-white/70 transition-colors">
            Discover More
          </span>
          <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors bg-white/5">
            <ChevronDown className="h-4 w-4" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProfessionalHeroSection;