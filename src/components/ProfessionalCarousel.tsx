import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Globe, 
  Shield, 
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  ArrowLeft,
  Building2,
  GraduationCap,
  BookOpen,
  Languages,
  Target
} from 'lucide-react';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: { value: string; label: string }[];
  ctaText: string;
  ctaSecondary: string;
  backgroundGradient: string;
  icon: React.ElementType;
  imagePattern: string;
}

const slidesData: SlideData[] = [
  {
    id: 1,
    title: "الحلول الأكاديمية المتقدمة",
    subtitle: "Advanced Academic Solutions",
    description: "نقدم حلول تعليمية شاملة للطلاب والباحثين والمؤسسات الأكاديمية، من كتابة الأبحاث إلى التحليل الإحصائي والاستشارات التعليمية",
    features: [
      "كتابة وتطوير الأبحاث العلمية والرسائل الجامعية",
      "التحليل الإحصائي والمراجعة الأكاديمية",
      "الاستشارات التعليمية المتخصصة",
      "برامج التدريب والتطوير الأكاديمي"
    ],
    stats: [
      { value: "99.5%", label: "معدل النجاح" },
      { value: "5000+", label: "طالب مساعد" },
      { value: "24/7", label: "دعم مستمر" }
    ],
    ctaText: "ابدأ مشروعك الأكاديمي",
    ctaSecondary: "استشارة مجانية",
    backgroundGradient: "from-blue-600 via-blue-700 to-indigo-800",
    icon: GraduationCap,
    imagePattern: "academic"
  },
  {
    id: 2,
    title: "خدمات البحث العلمي والتطوير",
    subtitle: "Research & Development Services",
    description: "فريق من الخبراء والباحثين المتخصصين لمساعدتك في إنجاز بحثك العلمي بأعلى معايير الجودة الأكاديمية والمنهجية العلمية",
    features: [
      "تطوير خطط البحث والإطار النظري",
      "جمع وتحليل البيانات الأكاديمية",
      "المراجعة العلمية وفحص الانتحال",
      "النشر في المجلات العلمية المحكمة"
    ],
    stats: [
      { value: "500+", label: "بحث منجز" },
      { value: "50+", label: "تخصص علمي" },
      { value: "15", label: "سنة خبرة" }
    ],
    ctaText: "طلب خدمة البحث",
    ctaSecondary: "تواصل مع الخبراء",
    backgroundGradient: "from-emerald-600 via-emerald-700 to-teal-800",
    icon: BookOpen,
    imagePattern: "research"
  },
  {
    id: 3,
    title: "الاستشارات التعليمية والمهنية",
    subtitle: "Educational & Professional Consulting",
    description: "استشارات شاملة للطلاب والمهنيين في التخطيط الأكاديمي والمهني، بناء السيرة الذاتية، والتحضير للقبول الجامعي والمنح الدراسية",
    features: [
      "التخطيط الأكاديمي والمهني المتقدم",
      "إعداد طلبات القبول والمنح الدراسية",
      "تطوير المهارات الأكاديمية والبحثية",
      "التوجيه المهني وبناء الشبكات العلمية"
    ],
    stats: [
      { value: "85%", label: "معدل القبول" },
      { value: "300+", label: "منحة دراسية" },
      { value: "20", label: "جامعة عالمية" }
    ],
    ctaText: "احجز استشارتك",
    ctaSecondary: "خطة مجانية",
    backgroundGradient: "from-purple-600 via-purple-700 to-violet-800",
    icon: Users,
    imagePattern: "consulting"
  },
  {
    id: 4,
    title: "منصة التعلم الذكية والتدريب",
    subtitle: "Smart Learning & Training Platform",
    description: "منصة تعليمية متطورة تجمع بين التكنولوجيا الحديثة والخبرة الأكاديمية لتقديم برامج تدريبية وتعليمية مخصصة للطلاب والباحثين",
    features: [
      "دورات تدريبية متخصصة في البحث العلمي",
      "ورش عمل في المهارات الأكاديمية",
      "برامج التطوير المهني المستمر",
      "شهادات معتمدة من جهات تعليمية عالمية"
    ],
    stats: [
      { value: "50+", label: "برنامج تدريبي" },
      { value: "2000+", label: "متدرب" },
      { value: "95%", label: "رضا المتدربين" }
    ],
    ctaText: "تصفح البرامج",
    ctaSecondary: "جرب مجاناً",
    backgroundGradient: "from-orange-600 via-red-600 to-pink-700",
    icon: Target,
    imagePattern: "technology"
  }
];

const ProfessionalCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const currentSlideData = slidesData[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <section className="relative min-h-[80vh] lg:min-h-[90vh] overflow-hidden">
      {/* Background with animated gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.backgroundGradient} transition-all duration-1000`}>
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          {currentSlideData.imagePattern === 'academic' && (
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%), 
                               radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)`
            }} />
          )}
          {currentSlideData.imagePattern === 'research' && (
            <div className="w-full h-full" style={{
              backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                               linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%)`,
              backgroundSize: '60px 60px'
            }} />
          )}
          {currentSlideData.imagePattern === 'consulting' && (
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, 
                               rgba(255,255,255,0.05) 2px, transparent 2px, transparent 40px)`
            }} />
          )}
          {currentSlideData.imagePattern === 'technology' && (
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }} />
          )}
        </div>
        
        {/* Animated geometric shapes */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-lg"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 45, 0] 
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.6 }}
              className="text-white space-y-6 lg:space-y-8"
            >
              {/* Icon and Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <IconComponent className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <Badge className="bg-white/15 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                  <Star className="h-4 w-4 mr-2 text-yellow-300" />
                  حلول احترافية
                </Badge>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4">
                  {currentSlideData.title}
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-6">
                  {currentSlideData.subtitle}
                </h2>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl"
              >
                {currentSlideData.description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-6 py-6"
              >
                {currentSlideData.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm lg:text-base text-white/80">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-xl px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  {currentSlideData.ctaText}
                  <ArrowLeft className="h-5 w-5 mr-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  {currentSlideData.ctaSecondary}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Features Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`features-${currentSlide}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                المميزات الرئيسية
              </h3>
              {currentSlideData.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                  <span className="text-white text-lg">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
        {/* Dots Indicator */}
        <div className="flex gap-2">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all duration-300 group"
      >
        <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all duration-300 group"
      >
        <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / slidesData.length) * 100}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </section>
  );
};

export default ProfessionalCarousel;