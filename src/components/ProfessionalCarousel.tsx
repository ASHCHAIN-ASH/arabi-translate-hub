import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  Award,
  Globe,
  Users,
  Star,
  GraduationCap,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle,
  Microscope,
  PenTool,
  Languages,
  Library,
  ChevronDown
} from 'lucide-react';

const ProfessionalHeroSection: React.FC = () => {
  const academicServices = [
    {
      icon: Microscope,
      title: "Academic Research",
      subtitle: "البحث الأكاديمي",
      description: "Advanced research methodologies and scientific studies",
      descriptionAr: "منهجيات بحثية متقدمة ودراسات علمية",
      color: "from-blue-600 to-blue-700",
      gradient: "bg-gradient-to-br from-blue-500/20 to-blue-600/20"
    },
    {
      icon: PenTool,
      title: "Academic Writing",
      subtitle: "الكتابة الأكاديمية",
      description: "Professional thesis and dissertation support",
      descriptionAr: "دعم احترافي للرسائل والأطروحات",
      color: "from-emerald-600 to-emerald-700",
      gradient: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/20"
    },
    {
      icon: Library,
      title: "Educational Consultancy",
      subtitle: "الاستشارات التعليمية",
      description: "Strategic academic planning and guidance",
      descriptionAr: "التخطيط الأكاديمي الاستراتيجي والتوجيه",
      color: "from-purple-600 to-purple-700",
      gradient: "bg-gradient-to-br from-purple-500/20 to-purple-600/20"
    },
    {
      icon: Languages,
      title: "Language Services",
      subtitle: "الخدمات اللغوية",
      description: "Translation and linguistic excellence",
      descriptionAr: "ترجمة وتميز لغوي",
      color: "from-orange-600 to-orange-700",
      gradient: "bg-gradient-to-br from-orange-500/20 to-orange-600/20"
    }
  ];

  const globalStats = [
    { 
      value: "10,000+", 
      label: "Students Served", 
      labelAr: "طالب تم خدمتهم", 
      icon: Users,
      description: "Across 50+ countries"
    },
    { 
      value: "99.8%", 
      label: "Success Rate", 
      labelAr: "معدل النجاح", 
      icon: Award,
      description: "Academic excellence"
    },
    { 
      value: "150+", 
      label: "Academic Fields", 
      labelAr: "تخصص أكاديمي", 
      icon: Globe,
      description: "Comprehensive coverage"
    },
    { 
      value: "24/7", 
      label: "Global Support", 
      labelAr: "دعم عالمي", 
      icon: Clock,
      description: "Always available"
    }
  ];

  const floatingIcons = [
    { icon: BookOpen, delay: 0, position: "top-20 left-20" },
    { icon: Lightbulb, delay: 2, position: "top-40 right-32" },
    { icon: TrendingUp, delay: 4, position: "bottom-32 left-40" },
    { icon: Star, delay: 6, position: "bottom-20 right-20" }
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

      {/* Floating Animated Icons */}
      {floatingIcons.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            className={`absolute ${item.position} hidden lg:block`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <IconComponent className="h-8 w-8 text-white/70" />
            </div>
          </motion.div>
        );
      })}

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white space-y-12">
          
          {/* Logo and Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Animated Logo */}
            <div className="relative">
              <motion.div
                className="w-28 h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/30 backdrop-blur-sm"
                animate={{ 
                  rotate: [0, 360],
                  boxShadow: [
                    "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                    "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
                    "0 25px 50px -12px rgba(16, 185, 129, 0.25)",
                    "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                  ]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <GraduationCap className="h-16 w-16 lg:h-20 lg:w-20 text-white drop-shadow-lg" />
              </motion.div>
              
              {/* Animated Rings */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-white/20"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 rounded-3xl border border-white/10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
            </div>

            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Badge className="bg-gradient-to-r from-white/20 to-white/10 text-white border-white/30 backdrop-blur-md px-8 py-4 text-lg font-bold shadow-xl rounded-full">
                <Star className="h-5 w-5 ml-2 text-yellow-400" />
                Premium Educational Solutions
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
              </Badge>
            </motion.div>
          </motion.div>

          {/* Company Names */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-8"
          >
            {/* Arabic Name */}
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="block bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent drop-shadow-2xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                وكالة ماستر إيدو باث
              </motion.span>
            </motion.h1>

            {/* English Name */}
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white/95 tracking-wide"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              MasterEduPath Agency
            </motion.h2>

            {/* Tagline */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 font-light">
                Advanced Educational Solutions
              </p>
              <p className="text-lg sm:text-xl md:text-2xl text-white/80">
                الحلول التعليمية المتقدمة
              </p>
            </motion.div>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="max-w-5xl mx-auto space-y-6"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 leading-relaxed font-medium">
              Empowering Global Academic Excellence
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-white/85 leading-relaxed">
              نمكّن التميز الأكاديمي العالمي من خلال حلول تعليمية مبتكرة ومتطورة
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white/75 leading-relaxed max-w-4xl mx-auto">
              We deliver world-class educational services to students, researchers, and academic institutions worldwide, 
              ensuring excellence in every academic journey.
            </p>
          </motion.div>

          {/* Academic Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          >
            {academicServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`group ${service.gradient} backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl`}
                >
                  <motion.div 
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-200 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <h4 className="text-lg font-semibold mb-3 text-white/80">
                    {service.subtitle}
                  </h4>
                  <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300 mb-2">
                    {service.description}
                  </p>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                    {service.descriptionAr}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Global Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.9 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {globalStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 2.1 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300 border border-white/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </motion.div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-white/90 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-white/70 mb-2">
                    {stat.labelAr}
                  </div>
                  <div className="text-xs text-white/60">
                    {stat.description}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-300 w-full sm:w-auto min-w-[320px] border border-white/20"
              >
                <Zap className="h-6 w-6 ml-3 group-hover:text-yellow-300 transition-colors duration-300" />
                Start Your Academic Journey
                <ArrowRight className="h-6 w-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button 
                variant="outline" 
                size="lg"
                className="group bg-white/10 border-2 border-white/50 text-white hover:bg-white/20 hover:border-white/70 px-12 py-6 text-xl font-semibold rounded-2xl backdrop-blur-md transition-all duration-300 w-full sm:w-auto min-w-[320px]"
              >
                <BookOpen className="h-6 w-6 ml-3 group-hover:rotate-12 transition-transform duration-300" />
                Explore Our Services
              </Button>
            </motion.div>
          </motion.div>

          {/* Professional Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12"
          >
            {[
              { text: "Research Excellence", textAr: "التميز البحثي" },
              { text: "Academic Writing", textAr: "الكتابة الأكاديمية" }, 
              { text: "Global Consultancy", textAr: "الاستشارات العالمية" },
              { text: "Language Services", textAr: "الخدمات اللغوية" }
            ].map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/5 hover:bg-white/15 backdrop-blur-sm px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
              >
                <div className="text-center">
                  <span className="block text-white/90 group-hover:text-white text-sm font-medium transition-colors duration-300">
                    {link.text}
                  </span>
                  <span className="block text-white/70 group-hover:text-white/90 text-xs transition-colors duration-300">
                    {link.textAr}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.7 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/60 cursor-pointer group"
        >
          <span className="text-sm mb-3 font-medium group-hover:text-white/80 transition-colors duration-300">
            Discover More
          </span>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors duration-300 bg-white/5 backdrop-blur-sm"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProfessionalHeroSection;