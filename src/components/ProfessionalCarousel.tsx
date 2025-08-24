import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Award, 
  Globe, 
  Shield, 
  Users,
  Star,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Languages,
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';

const ProfessionalHeroSection: React.FC = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "البحث الأكاديمي",
      description: "خدمات بحثية متخصصة",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: BookOpen,
      title: "الاستشارات التعليمية",
      description: "توجيه أكاديمي متقدم",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Target,
      title: "التطوير المهني",
      description: "برامج تدريبية متطورة",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Languages,
      title: "الخدمات اللغوية",
      description: "ترجمة ومراجعة لغوية",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const stats = [
    { value: "5000+", label: "طالب استفاد", icon: Users },
    { value: "99.5%", label: "معدل النجاح", icon: Award },
    { value: "50+", label: "تخصص علمي", icon: Globe },
    { value: "24/7", label: "دعم مستمر", icon: Clock }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)`
          }} />
        </div>

        {/* Geometric Shapes */}
        <motion.div
          className="absolute top-20 right-10 lg:right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 lg:left-20 w-24 h-24 bg-blue-400/10 rounded-lg blur-lg"
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white space-y-8 lg:space-y-12">
          
          {/* Company Logo and Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-sm"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <GraduationCap className="h-12 w-12 lg:h-16 lg:w-16 text-white drop-shadow-lg" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-emerald-400 rounded-3xl blur-xl opacity-50"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            <Badge className="bg-white/15 text-white border-white/30 backdrop-blur-md px-6 py-3 text-lg font-bold shadow-xl">
              <Star className="h-5 w-5 ml-2 text-yellow-400" />
              الحلول التعليمية المتقدمة
              <Sparkles className="h-5 w-5 mr-2 text-blue-300" />
            </Badge>
          </motion.div>

          {/* Company Name - Arabic & English */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Arabic Name */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                وكالة ماستر إيدو باث
              </motion.span>
            </motion.h1>

            {/* English Name */}
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white/95 tracking-wide"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              MasterEduPath Agency
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/85 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Advanced Educational Solutions
            </motion.p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed">
              المؤسسة التعليمية الرائدة عالمياً في تقديم الحلول التعليمية والأكاديمية المتكاملة
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
              نُمكّن الطلاب والباحثين والمؤسسات الأكاديمية من تحقيق أهدافهم التعليمية والبحثية بأعلى معايير الجودة العالمية
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-200 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.9 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="group bg-white text-slate-900 hover:bg-blue-50 shadow-2xl px-8 py-6 text-xl font-bold rounded-2xl border-2 border-transparent transition-all duration-300"
              >
                <Zap className="h-6 w-6 ml-3 group-hover:text-blue-600 transition-colors duration-300" />
                ابدأ رحلتك التعليمية
                <ArrowLeft className="h-6 w-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="group bg-white/10 border-2 border-white/50 text-white hover:bg-white/20 hover:border-white/70 px-8 py-6 text-xl font-semibold rounded-2xl backdrop-blur-md transition-all duration-300"
              >
                <BookOpen className="h-6 w-6 ml-3 group-hover:rotate-12 transition-transform duration-300" />
                استكشف خدماتنا
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Access Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            {[
              { text: "البحث الأكاديمي", href: "#research" },
              { text: "الاستشارات", href: "#consulting" }, 
              { text: "التدريب", href: "#training" },
              { text: "الخدمات اللغوية", href: "#language" }
            ].map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/5 hover:bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <span className="text-white/80 group-hover:text-white text-sm font-medium transition-colors duration-300">
                  {link.text}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/60"
        >
          <span className="text-sm mb-2 font-medium">اكتشف المزيد</span>
          <motion.div
            animate={{ rotate: 180 }}
            className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center hover:border-white/50 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 rotate-90" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProfessionalHeroSection;