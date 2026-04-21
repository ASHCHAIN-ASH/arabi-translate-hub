import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock,
  Calendar,
  Zap,
  CheckCircle,
  AlertCircle,
  Timer,
  TrendingUp,
  Target,
  Users,
  Settings,
  Award,
  RefreshCw,
  ChevronRight,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';


import Footer from '@/components/Footer';
const TimelineCommitment = () => {
  const deliveryOptions = [
    {
      icon: Zap,
      title: "التسليم السريع",
      description: "خدمة التسليم المعجل للمشاريع العاجلة والطارئة",
      timeline: "24-48 ساعة",
      features: ["أولوية عالية", "فريق مخصص", "مراجعة سريعة", "دعم مستمر"],
      color: "from-red-600 to-rose-600",
      price: "+50%"
    },
    {
      icon: Timer,
      title: "التسليم القياسي",
      description: "الخيار الأمثل للمشاريع العادية مع ضمان الجودة",
      timeline: "3-7 أيام",
      features: ["توازن مثالي", "جودة عالية", "مراجعة شاملة", "سعر منافس"],
      color: "from-blue-600 to-indigo-600",
      price: "عادي"
    },
    {
      icon: Calendar,
      title: "التسليم المرن",
      description: "للمشاريع الكبيرة التي تحتاج وقت أطول للمراجعة",
      timeline: "7-14 يوم",
      features: ["مراجعة متأنية", "تعديلات مجانية", "خصم 15%", "جودة فائقة"],
      color: "from-emerald-600 to-teal-600",
      price: "-15%"
    },
    {
      icon: Settings,
      title: "التسليم المخصص",
      description: "جدولة مخصصة تناسب احتياجاتك الخاصة",
      timeline: "حسب الاتفاق",
      features: ["مرونة كاملة", "تواصل مباشر", "خطة مخصصة", "متابعة شخصية"],
      color: "from-purple-600 to-pink-600",
      price: "متغير"
    }
  ];

  const projectPhases = [
    {
      phase: "استلام المشروع",
      description: "تحليل المتطلبات وتقدير الوقت اللازم",
      duration: "30 دقيقة",
      activities: ["فحص المحتوى", "تحديد التخصص", "تقدير الوقت", "تعيين الفريق"]
    },
    {
      phase: "التنفيذ",
      description: "العمل على المشروع وفقاً للمعايير المحددة",
      duration: "60-80% من الوقت",
      activities: ["البحث والكتابة", "المراجعة الأولية", "التدقيق", "التنسيق"]
    },
    {
      phase: "المراجعة والتدقيق",
      description: "مراجعة شاملة من قبل خبراء متخصصين",
      duration: "15-25% من الوقت",
      activities: ["مراجعة المحتوى", "تدقيق لغوي", "فحص الجودة", "تطبيق المعايير"]
    },
    {
      phase: "التسليم النهائي",
      description: "تسليم المشروع المكتمل مع التوثيق",
      duration: "15 دقيقة",
      activities: ["تحضير النسخة النهائية", "إضافة التوثيق", "التسليم", "متابعة العميل"]
    }
  ];

  const qualityChecks = [
    {
      icon: CheckCircle,
      title: "فحص الجودة المستمر",
      description: "مراقبة جودة العمل في كل مرحلة من مراحل التنفيذ",
      percentage: "100%"
    },
    {
      icon: Users,
      title: "فريق متخصص",
      description: "تعيين أفضل الخبراء المتاحين لضمان الجودة والسرعة",
      percentage: "98%"
    },
    {
      icon: Target,
      title: "الالتزام بالمواعيد",
      description: "نظام متقدم لضمان التسليم في الوقت المحدد",
      percentage: "99%"
    },
    {
      icon: RefreshCw,
      title: "المراجعة السريعة",
      description: "إمكانية التعديل والمراجعة السريعة عند الحاجة",
      percentage: "24h"
    }
  ];

  const stats = [
    { number: "99.2%", label: "معدل التسليم في الموعد", icon: Clock },
    { number: "24/7", label: "دعم ومتابعة", icon: Timer },
    { number: "48h", label: "متوسط وقت المراجعة", icon: RefreshCw },
    { number: "95%", label: "رضا العملاء عن المواعيد", icon: Award }
  ];

  const urgencyLevels = [
    {
      level: "عاجل جداً",
      time: "24 ساعة",
      description: "للحالات الطارئة التي تتطلب تدخل فوري",
      color: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300",
      icon: AlertCircle
    },
    {
      level: "عاجل",
      time: "48 ساعة",
      description: "للمشاريع التي تحتاج تسليم سريع",
      color: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
      icon: Zap
    },
    {
      level: "عادي",
      time: "3-7 أيام",
      description: "الوقت المثالي لضمان أفضل جودة",
      color: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
      icon: Clock
    },
    {
      level: "مرن",
      time: "أسبوعين+",
      description: "للمشاريع الكبيرة التي تحتاج وقت إضافي",
      color: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
      icon: Calendar
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-red-50/20 dark:from-slate-950 dark:via-rose-950/30 dark:to-red-950/20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-rose-500/20 via-red-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tl from-red-500/15 via-pink-500/20 to-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600/10 to-red-600/10 border border-rose-200 dark:border-rose-700 rounded-full text-rose-700 dark:text-rose-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Clock className="h-4 w-4" />
              التزام بالمواعيد
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-arabic-formal font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                التزام تام
              </span>
              <br />
              بالمواعيد المحددة
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              نضمن تسليم مشروعك في الوقت المحدد مع مرونة في الخيارات
              <span className="text-rose-600 dark:text-rose-400 font-semibold"> حسب احتياجاتك</span>
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-medium">
                احجز موعد تسليم
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-rose-200 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950">
                خيارات التسليم
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
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-rose-600 dark:text-rose-400 mb-1">
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

      {/* Delivery Options */}
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
              خيارات التسليم
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الخيار الذي يناسب احتياجاتك الزمنية وميزانيتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deliveryOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${option.color}`}></div>
                    
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{option.title}</h3>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-full">
                              {option.price}
                            </span>
                          </div>
                          <div className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">
                            {option.timeline}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {option.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {option.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full mt-6" variant="outline">
                        اختر هذا الخيار
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Urgency Levels */}
      <section className="py-16 bg-gradient-to-br from-rose-50/50 to-red-50/50 dark:from-rose-950/20 dark:to-red-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              مستويات الأولوية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              حدد مستوى الأولوية المناسب لمشروعك للحصول على أفضل خدمة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {urgencyLevels.map((level, index) => {
              const IconComponent = level.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full text-center p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${level.color} flex items-center justify-center`}>
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {level.level}
                    </h3>
                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-3">
                      {level.time}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {level.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Phases */}
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
              مراحل تنفيذ المشروع
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              خطة زمنية واضحة ومحددة لكل مرحلة من مراحل العمل
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-rose-600 to-red-600 hidden md:block"></div>
            
            <div className="space-y-8">
              {projectPhases.map((phase, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg z-10">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-foreground">{phase.phase}</h3>
                      <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-sm font-semibold rounded-full">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{phase.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {phase.activities.map((activity, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-foreground">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Checks */}
      <section className="py-16 bg-gradient-to-br from-white to-rose-50/30 dark:from-slate-800 dark:to-rose-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              ضمانات الجودة والوقت
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              إجراءات صارمة لضمان التسليم في الموعد مع الحفاظ على أعلى جودة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityChecks.map((check, index) => {
              const IconComponent = check.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <IconComponent className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-2">
                    {check.percentage}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {check.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {check.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-6">
              مشروعك في الموعد المحدد مضمون
            </h2>
            <p className="text-xl text-rose-100 mb-8 max-w-2xl mx-auto">
              احصل على مشروعك بالجودة المطلوبة والوقت المناسب
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-rose-600 hover:bg-rose-50">
                احجز موعد تسليم
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                تحدث مع مدير المشروع
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      
          <Footer />
    </div>
  );
};

export default TimelineCommitment;