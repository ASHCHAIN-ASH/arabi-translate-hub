import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  GraduationCap,
  BookOpen,
  Languages,
  Award,
  Shield,
  Clock,
  Users,
  Target,
  CheckCircle,
  Globe,
  Star,
  TrendingUp,
  Building2,
  Zap,
  Heart,
  Brain,
  Sparkles,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';

const AcademicFeatures = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "خبرة أكاديمية متخصصة",
      description: "فريق من الأكاديميين والمختصين المتمرسين في مختلف المجالات العلمية والبحثية، مع التزام بأعلى معايير الجودة الأكاديمية",
      tags: ["خبراء متخصصون", "مراجعة دقيقة", "جودة عالية"],
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: BookOpen,
      title: "منهجية علمية متطورة",
      description: "نتبع المعايير الأكاديمية المعتمدة في البحث العلمي والكتابة الأكاديمية وفقاً لأفضل الممارسات المهنية",
      tags: ["منهجية علمية", "معايير أكاديمية", "ممارسات مهنية"],
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: Languages,
      title: "ترجمة أكاديمية متعددة اللغات",
      description: "خدمات ترجمة متخصصة للأوراق البحثية والرسائل الجامعية في لغات متعددة مع مراعاة الدقة العلمية والمصطلحات التخصصية",
      tags: ["ترجمة متخصصة", "دقة مصطلحية", "لغات متعددة"],
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: Award,
      title: "ضمان الجودة",
      description: "التزام بمعايير الجودة العالية مع مراجعة شاملة لجميع الأعمال وإمكانية التعديل حسب المتطلبات المحددة",
      tags: ["ضمان الجودة", "مراجعة شاملة", "تعديل مجاني"],
      color: "from-amber-600 to-orange-600"
    },
    {
      icon: Shield,
      title: "سرية وأمان",
      description: "حماية المعلومات الشخصية والبحثية مع التزام صارم بمعايير الخصوصية والسرية المهنية",
      tags: ["حماية البيانات", "سرية مهنية", "أمان متقدم"],
      color: "from-teal-600 to-cyan-600"
    },
    {
      icon: Clock,
      title: "التزام بالمواعيد",
      description: "احترام المواعيد النهائية المتفق عليها مع إمكانية التسليم السريع حسب الحاجة والتعقيد المطلوب",
      tags: ["تسليم منتظم", "مواعيد محددة", "مرونة في التوقيت"],
      color: "from-rose-600 to-red-600"
    }
  ];

  const trustIndicators = [
    { icon: Users, text: "خبرة متنوعة", subtext: "في مختلف التخصصات", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950" },
    { icon: Award, text: "جودة عالية", subtext: "معايير أكاديمية", color: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-950" },
    { icon: Globe, text: "خدمة شاملة", subtext: "لغات متعددة", color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950" },
    { icon: Target, text: "التزام مهني", subtext: "بالمواعيد والجودة", color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950" }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20 relative overflow-hidden">
      
      {/* خلفية متطورة وديناميكية */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-40">
          {/* الطبقة الأولى - دوائر متحركة */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tl from-emerald-500/15 via-teal-500/20 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* الطبقة الثانية - أشكال هندسية */}
          <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-gradient-to-r from-violet-500/10 via-purple-500/15 to-pink-500/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
          
          {/* خطوط متدرجة للحركة */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent transform rotate-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* شبكة النقاط */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-blue-400"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* العنوان المحسن بشكل احترافي */}
        <motion.div 
          className="text-center mb-16 sm:mb-20 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* شارة التميز */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200 dark:border-blue-700 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-4 w-4" />
            الرائد في الحلول الأكاديمية المتطورة
          </motion.div>

          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-arabic-formal font-bold mb-6 sm:mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            لماذا تختار{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                خدماتنا الأكاديمية؟
              </span>
              {/* خط تحتي متحرك */}
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
              />
            </span>
          </motion.h2>
          
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            نقدم خدمات أكاديمية وبحثية متخصصة مع التزام بأعلى معايير الجودة المهنية 
            <span className="text-blue-600 dark:text-blue-400 font-semibold">والدقة العلمية</span>
          </motion.p>

          {/* مؤشرات الثقة المحسنة */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
          >
            {trustIndicators.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  className={`${item.bgColor} rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-center">
                    <IconComponent className={`h-8 w-8 ${item.color} mx-auto mb-3`} />
                    <div className={`text-2xl sm:text-3xl font-bold ${item.color} mb-1`}>
                      {item.text}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {item.subtext}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* قسم المزايا التنافسية */}
        <motion.div
          className="mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-arabic-formal font-bold mb-4 text-slate-800 dark:text-white">
              مزايانا التنافسية
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ما يميز خدماتنا الأكاديمية عن غيرها في السوق
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: "مراجعة دقيقة", description: "فحص شامل لجميع الأعمال قبل التسليم" },
              { icon: Clock, title: "مرونة في التوقيت", description: "تكيف مع احتياجاتك الزمنية المختلفة" },
              { icon: Users, title: "فريق متخصص", description: "خبراء في مختلف المجالات الأكاديمية" },
              { icon: Shield, title: "سرية تامة", description: "حماية كاملة لمعلوماتك البحثية" }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        
        {/* شبكة المميزات المحسنة */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.8, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-full"
              >
                <Card className="relative overflow-hidden bg-white dark:bg-slate-800 hover:shadow-2xl transition-all duration-700 h-full group border-0">
                  
                  {/* طبقة الخلفية المتدرجة */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-500`} />
                  
                  {/* الخط العلوي المتطور */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30">
                    <div className={`h-full bg-gradient-to-r ${feature.color} transition-all duration-500 group-hover:opacity-100`} />
                  </div>
                  
                  {/* شارة الجودة */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      خدمة متميزة
                    </span>
                  </div>
                  
                  <CardContent className="p-6 sm:p-8 lg:p-10 h-full flex flex-col relative z-10">
                    
                    {/* رأس البطاقة */}
                    <div className="flex items-start gap-5 mb-6">
                      <motion.div 
                        className={`relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                        }}
                        transition={{ duration: 0.6, type: "tween", ease: "easeInOut" }}
                      >
                        {/* طبقة الإضاءة */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
                        <IconComponent className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-white relative z-10" />
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl lg:text-2xl font-arabic-formal font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-500 leading-tight mb-3">
                          {feature.title}
                        </h3>
                        
                        {/* مؤشر الخدمة */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-600">
                          <CheckCircle className="h-3 w-3" />
                          خدمة مضمونة
                        </div>
                      </div>
                    </div>
                    
                    {/* الوصف */}
                    <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-6 flex-grow">
                      {feature.description}
                    </p>
                    
                    {/* العلامات المحسنة */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {feature.tags.map((tag, i) => (
                        <motion.span 
                          key={i} 
                          className={`px-3 py-1.5 bg-gradient-to-r ${feature.color} bg-opacity-10 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors duration-300`}
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * i }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                    
                    {/* القسم السفلي المحسن */}
                    <motion.div
                      className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          مضمون 100%
                        </span>
                      </div>
                      
                      <Link 
                        to={`/academic/${
                          index === 0 ? 'expertise' : 
                          index === 1 ? 'methodology' : 
                          index === 2 ? 'translation' : 
                          index === 3 ? 'quality' : 
                          index === 4 ? 'security' : 
                          'timeline'
                        }`}
                        className="group"
                      >
                        <motion.button
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>تفاصيل أكثر</span>
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AcademicFeatures;