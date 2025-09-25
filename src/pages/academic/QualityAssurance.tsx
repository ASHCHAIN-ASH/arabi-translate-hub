import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Award,
  CheckCircle,
  Shield,
  Target,
  Users,
  Settings,
  Star,
  TrendingUp,
  FileCheck,
  Eye,
  RefreshCw,
  ChevronRight,
  Clock,
  Zap,
  Heart,
  ThumbsUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';


const QualityAssurance = () => {
  const qualityStandards = [
    {
      icon: CheckCircle,
      title: "مراجعة متعددة المستويات",
      description: "نظام مراجعة شامل يمر بعدة مراحل لضمان أعلى معايير الجودة",
      steps: ["مراجعة المحتوى", "مراجعة لغوية", "مراجعة تقنية", "مراجعة نهائية"],
      color: "from-blue-600 to-indigo-600",
      percentage: "100%"
    },
    {
      icon: Target,
      title: "معايير أكاديمية دولية",
      description: "الالتزام بالمعايير الأكاديمية المعترف بها عالمياً",
      steps: ["معايير APA", "معايير ISO", "معايير الجامعات", "معايير النشر"],
      color: "from-emerald-600 to-teal-600",
      percentage: "98%"
    },
    {
      icon: Users,
      title: "فريق خبراء متخصص",
      description: "مراجعة من قبل خبراء ومتخصصين في المجال ذاته",
      steps: ["خبراء المحتوى", "مراجعون لغويون", "محررون تقنيون", "مدققون نهائيون"],
      color: "from-purple-600 to-pink-600",
      percentage: "95%"
    },
    {
      icon: RefreshCw,
      title: "ضمان التعديل المجاني",
      description: "إمكانية التعديل والمراجعة حتى تحقيق الرضا التام",
      steps: ["تقييم الملاحظات", "تطبيق التعديلات", "مراجعة إضافية", "تأكيد الجودة"],
      color: "from-amber-600 to-orange-600",
      percentage: "99%"
    }
  ];

  const qualityTools = [
    {
      icon: FileCheck,
      title: "أدوات فحص الجودة",
      description: "استخدام أحدث الأدوات التقنية لفحص وضمان جودة المحتوى",
      tools: ["فحص الانتحال", "فحص القواعد", "فحص التنسيق", "فحص المراجع"]
    },
    {
      icon: Eye,
      title: "مراقبة مستمرة",
      description: "متابعة دقيقة لجميع مراحل العمل لضمان الجودة",
      tools: ["تتبع التقدم", "تقييم الأداء", "مراجعة دورية", "تحسين مستمر"]
    },
    {
      icon: Settings,
      title: "عمليات محسنة",
      description: "تطوير وتحسين العمليات باستمرار لرفع مستوى الجودة",
      tools: ["تحليل الأداء", "تطوير الأساليب", "تدريب الفريق", "تحديث الأدوات"]
    },
    {
      icon: Star,
      title: "تقييم الجودة",
      description: "نظام تقييم شامل لقياس وضمان جودة الخدمات المقدمة",
      tools: ["استطلاعات الرضا", "تقييم الخبراء", "مؤشرات الأداء", "تحليل النتائج"]
    }
  ];

  const certifications = [
    {
      title: "ISO 9001:2015",
      description: "شهادة إدارة الجودة الدولية",
      icon: Award,
      color: "text-blue-600"
    },
    {
      title: "أكاديمي معتمد",
      description: "اعتماد من المؤسسات الأكاديمية",
      icon: Shield,
      color: "text-emerald-600"
    },
    {
      title: "مترجم محترف",
      description: "عضوية الجمعيات المهنية للترجمة",
      icon: Star,
      color: "text-purple-600"
    },
    {
      title: "ضمان الجودة",
      description: "شهادة ضمان الجودة الشاملة",
      icon: CheckCircle,
      color: "text-amber-600"
    }
  ];

  const stats = [
    { number: "99.8%", label: "معدل الدقة", icon: Target },
    { number: "100%", label: "ضمان الجودة", icon: CheckCircle },
    { number: "24/7", label: "دعم مستمر", icon: Clock },
    { number: "48h", label: "وقت المراجعة", icon: Zap }
  ];

  const clientTestimonials = [
    {
      name: "د. أحمد محمد",
      role: "أستاذ جامعي",
      comment: "جودة استثنائية في المراجعة والتدقيق، فريق محترف جداً",
      rating: 5,
      project: "مراجعة أطروحة دكتوراه"
    },
    {
      name: "سارة أحمد",
      role: "باحثة",
      comment: "الالتزام بالمواعيد والجودة العالية جعلني أثق بهم تماماً",
      rating: 5,
      project: "مراجعة ورقة بحثية"
    },
    {
      name: "د. خالد العلي",
      role: "أستاذ مساعد",
      comment: "خدمة متميزة وفريق يهتم بأدق التفاصيل",
      rating: 5,
      project: "مراجعة كتاب أكاديمي"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 dark:from-slate-950 dark:via-amber-950/30 dark:to-orange-950/20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tl from-orange-500/15 via-red-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-200 dark:border-amber-700 rounded-full text-amber-700 dark:text-amber-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Award className="h-4 w-4" />
              ضمان الجودة الشامل
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-arabic-formal font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                ضمان الجودة
              </span>
              <br />
              معيار التميز
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              نظام شامل لضمان الجودة يضمن لك الحصول على أفضل الخدمات الأكاديمية
              <span className="text-amber-600 dark:text-amber-400 font-semibold"> بمعايير عالمية</span>
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium">
                تعرف على المعايير
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950">
                طلب خدمة
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
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
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

      {/* Quality Standards */}
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
              معايير ضمان الجودة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نظام متكامل لضمان جودة الخدمات المقدمة وفقاً لأعلى المعايير المهنية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {qualityStandards.map((standard, index) => {
              const IconComponent = standard.icon;
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
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${standard.color}`}></div>
                    
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${standard.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{standard.title}</h3>
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold rounded-full">
                              {standard.percentage}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {standard.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {standard.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm text-foreground">{step}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Tools */}
      <section className="py-16 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              أدوات ضمان الجودة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نستخدم أحدث الأدوات والتقنيات لضمان أعلى مستويات الجودة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityTools.map((tool, index) => {
              const IconComponent = tool.icon;
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
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tool.description}
                    </p>
                    <div className="space-y-2">
                      {tool.tools.map((item, i) => (
                        <div key={i} className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full">
                          {item}
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
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
              الشهادات والاعتمادات
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              حاصلون على شهادات واعتمادات دولية تؤكد جودة خدماتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;
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
                  <IconComponent className={`h-12 w-12 ${cert.color} mx-auto mb-4`} />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cert.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-800 dark:to-amber-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              آراء العملاء
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تقييمات حقيقية من عملائنا الذين جربوا خدماتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clientTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {testimonial.project}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-6">
              جودة مضمونة 100%
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              احصل على خدمة أكاديمية بأعلى معايير الجودة مع ضمان التعديل المجاني
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-amber-50">
                طلب خدمة مضمونة
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                تعرف على المعايير
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default QualityAssurance;