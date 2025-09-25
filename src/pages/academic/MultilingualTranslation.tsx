import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Languages,
  Globe,
  BookOpen,
  Users,
  Award,
  CheckCircle,
  FileText,
  Zap,
  Target,
  TrendingUp,
  ChevronRight,
  Clock,
  Star,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';


const MultilingualTranslation = () => {
  const languages = [
    {
      name: "الإنجليزية",
      flag: "🇺🇸",
      specialty: "الأوراق العلمية والأطروحات",
      experts: 15,
      projects: 200,
      color: "from-blue-600 to-indigo-600"
    },
    {
      name: "الفرنسية",
      flag: "🇫🇷",
      specialty: "الأدب والعلوم الإنسانية",
      experts: 8,
      projects: 120,
      color: "from-purple-600 to-pink-600"
    },
    {
      name: "الألمانية",
      flag: "🇩🇪",
      specialty: "العلوم التطبيقية والهندسة",
      experts: 6,
      projects: 90,
      color: "from-emerald-600 to-teal-600"
    },
    {
      name: "الإسبانية",
      flag: "🇪🇸",
      specialty: "العلوم الاجتماعية",
      experts: 7,
      projects: 110,
      color: "from-amber-600 to-orange-600"
    },
    {
      name: "الإيطالية",
      flag: "🇮🇹",
      specialty: "الفنون والتصميم",
      experts: 5,
      projects: 75,
      color: "from-red-600 to-rose-600"
    },
    {
      name: "الروسية",
      flag: "🇷🇺",
      specialty: "العلوم والرياضيات",
      experts: 4,
      projects: 60,
      color: "from-cyan-600 to-blue-600"
    }
  ];

  const translationTypes = [
    {
      icon: BookOpen,
      title: "الأطروحات الجامعية",
      description: "ترجمة رسائل الماجستير والدكتوراه بدقة أكاديمية عالية",
      features: ["مراجعة متخصصة", "دقة مصطلحية", "تنسيق أكاديمي"],
      stats: "150+ أطروحة"
    },
    {
      icon: FileText,
      title: "الأوراق البحثية",
      description: "ترجمة البحوث العلمية للنشر في المجلات المحكمة",
      features: ["معايير النشر", "مراجعة لغوية", "تدقيق علمي"],
      stats: "300+ ورقة بحثية"
    },
    {
      icon: Globe,
      title: "المؤتمرات العلمية",
      description: "ترجمة ملخصات وأوراق المؤتمرات الأكاديمية",
      features: ["ترجمة سريعة", "دقة عالية", "تسليم منتظم"],
      stats: "200+ مؤتمر"
    },
    {
      icon: Award,
      title: "الشهادات الأكاديمية",
      description: "ترجمة معتمدة للشهادات والوثائق الأكاديمية",
      features: ["ترجمة معتمدة", "ختم رسمي", "قبول دولي"],
      stats: "500+ شهادة"
    }
  ];

  const qualityFeatures = [
    {
      icon: Users,
      title: "مترجمون متخصصون",
      description: "فريق من المترجمين الأكاديميين المتخصصين في مختلف المجالات العلمية",
      color: "text-blue-600"
    },
    {
      icon: Target,
      title: "دقة مصطلحية",
      description: "استخدام المصطلحات العلمية الدقيقة والمقبولة أكاديمياً",
      color: "text-emerald-600"
    },
    {
      icon: Shield,
      title: "مراجعة متعددة",
      description: "نظام مراجعة متدرج من قبل خبراء في التخصص واللغة",
      color: "text-purple-600"
    },
    {
      icon: Clock,
      title: "التزام بالمواعيد",
      description: "تسليم الترجمات في المواعيد المحددة مع إمكانية التعجيل",
      color: "text-amber-600"
    }
  ];

  const stats = [
    { number: "25+", label: "لغة متاحة", icon: Languages },
    { number: "1200+", label: "مشروع ترجمة", icon: FileText },
    { number: "45", label: "مترجم متخصص", icon: Users },
    { number: "99%", label: "معدل الدقة", icon: Award }
  ];

  const processSteps = [
    {
      number: "01",
      title: "تحليل المحتوى",
      description: "فحص النص وتحديد التخصص والمصطلحات المطلوبة"
    },
    {
      number: "02", 
      title: "اختيار المترجم",
      description: "تعيين مترجم متخصص في نفس المجال الأكاديمي"
    },
    {
      number: "03",
      title: "الترجمة المتخصصة",
      description: "ترجمة دقيقة مع مراعاة السياق الأكاديمي"
    },
    {
      number: "04",
      title: "المراجعة والتدقيق",
      description: "مراجعة شاملة من قبل خبير آخر في التخصص"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 dark:from-slate-950 dark:via-purple-950/30 dark:to-pink-950/20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tl from-blue-500/15 via-indigo-500/20 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-200 dark:border-purple-700 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Languages className="h-4 w-4" />
              ترجمة أكاديمية متعددة اللغات
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-arabic-formal font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                ترجمة أكاديمية
              </span>
              <br />
              دقيقة ومتخصصة
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              خدمات ترجمة أكاديمية احترافية بأكثر من 25 لغة عالمية
              <span className="text-purple-600 dark:text-purple-400 font-semibold"> مع ضمان الدقة العلمية</span>
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium">
                طلب ترجمة
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950">
                عرض اللغات
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/60 dark:bg-slate-800/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Languages Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              اللغات المتاحة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نقدم خدمات الترجمة الأكاديمية بلغات متعددة مع تخصص في كل مجال
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((language, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${language.color}`}></div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{language.flag}</div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{language.name}</h3>
                        <p className="text-sm text-muted-foreground">{language.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {language.experts} مترجم متخصص
                      </span>
                      <span className="text-emerald-600 font-medium">
                        {language.projects} مشروع
                      </span>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      طلب ترجمة
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Translation Types */}
      <section className="py-16 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              أنواع الترجمة الأكاديمية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              خدمات ترجمة متخصصة لجميع أنواع المحتوى الأكاديمي والبحثي
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {translationTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full p-8 hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">
                          {type.title}
                        </h3>
                        <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                          {type.stats}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {type.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {type.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              مميزات الجودة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ما يضمن لك الحصول على ترجمة أكاديمية بأعلى مستويات الجودة والدقة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {qualityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              خطوات العمل
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              عملية منظمة ومدروسة لضمان أفضل النتائج في الترجمة الأكاديمية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                    <span className="text-2xl font-bold">{step.number}</span>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-white/30 -translate-x-2"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-purple-100 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950 dark:to-purple-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-6 text-foreground">
              احصل على ترجمة أكاديمية احترافية
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              ترجمة دقيقة ومتخصصة لجميع أنواع المحتوى الأكاديمي والبحثي
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                طلب عرض سعر
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950">
                تحدث مع مترجم
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default MultilingualTranslation;