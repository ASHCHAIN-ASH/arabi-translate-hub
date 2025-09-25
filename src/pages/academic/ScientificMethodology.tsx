import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen,
  Search,
  Target,
  BarChart3,
  FileText,
  CheckCircle,
  Settings,
  Brain,
  Microscope,
  PieChart,
  TrendingUp,
  ChevronRight,
  Award,
  Users,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';


const ScientificMethodology = () => {
  const methodologySteps = [
    {
      icon: Search,
      title: "تحديد المشكلة البحثية",
      description: "تحليل دقيق لمشكلة البحث وتحديد الأهداف والفرضيات",
      details: ["تحليل الأدبيات السابقة", "تحديد الفجوة البحثية", "صياغة الأسئلة البحثية"],
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: Target,
      title: "تصميم المنهجية",
      description: "اختيار المنهج البحثي المناسب وتصميم أدوات جمع البيانات",
      details: ["المنهج الكمي والكيفي", "تصميم الاستبيانات", "اختيار العينة"],
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: BarChart3,
      title: "جمع وتحليل البيانات",
      description: "تطبيق الأدوات وجمع البيانات وتحليلها إحصائياً",
      details: ["أدوات إحصائية متقدمة", "تحليل نوعي وكمي", "التحقق من صحة النتائج"],
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: FileText,
      title: "كتابة التقرير النهائي",
      description: "صياغة النتائج والتوصيات وفقاً للمعايير الأكاديمية",
      details: ["هيكلة البحث", "توثيق المراجع", "مراجعة وتدقيق"],
      color: "from-amber-600 to-orange-600"
    }
  ];

  const researchApproaches = [
    {
      icon: Microscope,
      title: "البحث التجريبي",
      description: "تصميم التجارب والدراسات المعملية",
      features: ["تحكم في المتغيرات", "قياس دقيق", "تحليل النتائج"]
    },
    {
      icon: PieChart,
      title: "البحث المسحي",
      description: "جمع البيانات من عينات كبيرة",
      features: ["استبيانات متقدمة", "تحليل إحصائي", "تمثيل العينة"]
    },
    {
      icon: Brain,
      title: "البحث النوعي",
      description: "فهم عميق للظواهر والسلوكيات",
      features: ["مقابلات متعمقة", "تحليل المحتوى", "دراسة الحالة"]
    },
    {
      icon: TrendingUp,
      title: "البحث التطبيقي",
      description: "حل المشكلات العملية والتطبيقية",
      features: ["حلول عملية", "تطبيق مباشر", "تقييم الأثر"]
    }
  ];

  const qualityAssurance = [
    {
      icon: CheckCircle,
      title: "مراجعة الأقران",
      description: "مراجعة من قبل خبراء في نفس المجال"
    },
    {
      icon: Settings,
      title: "معايير دولية",
      description: "الالتزام بالمعايير البحثية المعترف بها"
    },
    {
      icon: Award,
      title: "ضمان الجودة",
      description: "نظام شامل لضمان جودة البحث"
    },
    {
      icon: Users,
      title: "فريق متخصص",
      description: "خبراء في المنهجية والإحصاء"
    }
  ];

  const stats = [
    { number: "500+", label: "بحث مكتمل", icon: FileText },
    { number: "15+", label: "سنة خبرة", icon: Clock },
    { number: "98%", label: "معدل الرضا", icon: Award },
    { number: "50+", label: "منهجية متقدمة", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/20 dark:from-slate-950 dark:via-emerald-950/30 dark:to-blue-950/20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 border border-emerald-200 dark:border-emerald-700 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <BookOpen className="h-4 w-4" />
              منهجية علمية متطورة
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-arabic-formal font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                منهجية علمية
              </span>
              <br />
              موثوقة ومتطورة
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              نتبع أحدث المناهج العلمية والمعايير الأكاديمية المعترف بها دولياً
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold"> لضمان دقة وموثوقية البحث</span>
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium">
                اكتشف المنهجية
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                طلب استشارة
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
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
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

      {/* Methodology Steps */}
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
              مراحل المنهجية العلمية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              خطوات منهجية واضحة ومنظمة لضمان جودة البحث العلمي
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {methodologySteps.map((step, index) => {
              const IconComponent = step.icon;
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
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`}></div>
                    
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-muted-foreground mb-1">
                            المرحلة {index + 1}
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-foreground">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      
                      <div className="space-y-3">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm text-foreground">{detail}</span>
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

      {/* Research Approaches */}
      <section className="py-16 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 dark:from-emerald-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              أنواع المناهج البحثية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تنوع في المناهج البحثية لتناسب مختلف أنواع الدراسات والأبحاث
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchApproaches.map((approach, index) => {
              const IconComponent = approach.icon;
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
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      {approach.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {approach.description}
                    </p>
                    <div className="space-y-2">
                      {approach.features.map((feature, i) => (
                        <div key={i} className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">
                          {feature}
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

      {/* Quality Assurance */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-6">
                ضمان جودة المنهجية
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                نطبق نظاماً شاملاً لضمان جودة المنهجية العلمية وموثوقية النتائج
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {qualityAssurance.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <IconComponent className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl"></div>
                <div className="relative z-10">
                  <BookOpen className="h-12 w-12 mb-6" />
                  <h3 className="text-2xl font-bold mb-4">معايير أكاديمية عالمية</h3>
                  <p className="text-emerald-100 leading-relaxed mb-6">
                    نتبع أفضل الممارسات العالمية في البحث العلمي ونطبق المعايير الأكاديمية 
                    المعترف بها من أرقى الجامعات والمؤسسات البحثية.
                  </p>
                  <ul className="space-y-2 text-emerald-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      معايير ISO للبحث العلمي
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      أدوات إحصائية متقدمة
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      مراجعة دولية للنتائج
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-6">
              ابدأ بحثك بمنهجية علمية متطورة
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              احصل على بحث علمي موثوق ودقيق باستخدام أحدث المناهج البحثية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-emerald-50">
                بدء مشروع بحثي
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                تحدث مع خبير
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default ScientificMethodology;