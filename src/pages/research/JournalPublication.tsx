import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FileText, 
  BookOpen, 
  CheckCircle, 
  Star, 
  Globe, 
  Award,
  Users,
  Clock,
  TrendingUp,
  Search,
  Edit3,
  Send,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const JournalPublication = () => {
  const services = [
    {
      title: "إعداد وتحضير البحث للنشر",
      description: "مراجعة شاملة للبحث وتحضيره وفقاً لمعايير المجلات العلمية المحكمة",
      icon: Edit3,
      features: ["مراجعة المحتوى والهيكل", "تنسيق وفقاً لدليل المجلة", "مراجعة المراجع والاستشهادات"]
    },
    {
      title: "اختيار المجلة المناسبة",
      description: "تحديد أفضل المجلات العلمية المتخصصة والمناسبة لموضوع البحث",
      icon: Search,
      features: ["تحليل نطاق المجلة", "فحص معامل التأثير", "تقييم سرعة المراجعة"]
    },
    {
      title: "عملية التقديم والمتابعة",
      description: "إدارة عملية تقديم البحث ومتابعة مراحل المراجعة والنشر",
      icon: Send,
      features: ["تقديم البحث للمجلة", "متابعة عملية المراجعة", "الرد على ملاحظات المحكمين"]
    }
  ];

  const journals = [
    {
      name: "مجلات Scopus",
      description: "مجلات مفهرسة في قاعدة بيانات Scopus العالمية",
      impact: "عالي",
      fields: ["العلوم", "الهندسة", "الطب", "العلوم الاجتماعية"]
    },
    {
      name: "مجلات Web of Science",
      description: "مجلات مدرجة في قاعدة بيانات Web of Science",
      impact: "عالي جداً",
      fields: ["جميع التخصصات العلمية", "البحوث متعددة التخصصات"]
    },
    {
      name: "مجلات ISI",
      description: "مجلات معتمدة من معهد المعلومات العلمية",
      impact: "ممتاز",
      fields: ["العلوم الطبيعية", "العلوم التطبيقية", "العلوم الإنسانية"]
    },
    {
      name: "المجلات العربية المحكمة",
      description: "مجلات عربية محكمة ومعتمدة أكاديمياً",
      impact: "جيد",
      fields: ["الأدب العربي", "التاريخ الإسلامي", "اللغة العربية"]
    }
  ];

  const benefits = [
    {
      title: "زيادة الاقتباسات",
      description: "النشر في مجلات معتمدة يزيد من فرص الاقتباس والانتشار",
      icon: TrendingUp
    },
    {
      title: "الاعتراف الأكاديمي",
      description: "تعزيز المكانة العلمية والأكاديمية للباحث",
      icon: Award
    },
    {
      title: "التأثير العالمي",
      description: "وصول البحث لجمهور عالمي من الباحثين والأكاديميين",
      icon: Globe
    },
    {
      title: "التقدم المهني",
      description: "تحسين فرص الترقية الأكاديمية والوظيفية",
      icon: Users
    }
  ];

  const process = [
    {
      step: "01",
      title: "تحليل البحث",
      description: "مراجعة شاملة للبحث وتقييم جودته العلمية ومدى جاهزيته للنشر"
    },
    {
      step: "02", 
      title: "اختيار المجلة",
      description: "تحديد أفضل المجلات المناسبة للبحث بناءً على التخصص ومعامل التأثير"
    },
    {
      step: "03",
      title: "إعداد وتنسيق",
      description: "تحضير البحث وتنسيقه وفقاً لمتطلبات وإرشادات المجلة المختارة"
    },
    {
      step: "04",
      title: "التقديم والمتابعة",
      description: "تقديم البحث ومتابعة عملية المراجعة والرد على ملاحظات المحكمين"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 lg:py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl lg:text-6xl font-arabic-formal font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              النشر في المجلات المعتمدة
            </motion.h1>
            
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto"
            >
              نساعدك في نشر أبحاثك العلمية في أرقى المجلات العالمية المحكمة والمعتمدة دولياً مع ضمان الجودة والمتابعة الشاملة
            </motion.p>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8 py-4 rounded-xl" asChild>
                <Link to="/submit-order" className="flex items-center gap-2">
                  <span>اطلب الخدمة الآن</span>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="font-semibold px-8 py-4 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300" asChild>
                <Link to="/research-services">
                  تصفح كل الخدمات البحثية
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-arabic-formal font-bold text-gray-900 dark:text-white mb-4">
              خدماتنا في النشر العلمي
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              نقدم خدمات شاملة لضمان نشر أبحاثك في أفضل المجلات العلمية المحكمة
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl w-fit">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-arabic-formal font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journal Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-arabic-formal font-bold text-gray-900 dark:text-white mb-4">
              أنواع المجلات المعتمدة
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              نتعامل مع جميع أنواع المجلات العلمية المحكمة والمعتمدة دولياً
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journals.map((journal, index) => (
              <motion.div
                key={journal.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg font-arabic-formal font-bold text-gray-900 dark:text-white">
                        {journal.name}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {journal.impact}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {journal.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">التخصصات:</h4>
                      <div className="flex flex-wrap gap-1">
                        {journal.fields.map((field, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-arabic-formal font-bold text-gray-900 dark:text-white mb-4">
              فوائد النشر في المجلات المعتمدة
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              اكتشف المزايا العديدة للنشر في المجلات العلمية المحكمة والمعتمدة عالمياً
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl w-fit mx-auto">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-arabic-formal font-bold text-gray-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-arabic-formal font-bold text-gray-900 dark:text-white mb-4">
              مراحل عملية النشر
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              نتبع منهجية علمية مدروسة لضمان نجاح نشر بحثك في أفضل المجلات
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center gap-8 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-arabic-formal font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < process.length - 1 && (
                  <div className="absolute right-8 top-16 w-0.5 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 opacity-30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-arabic-formal font-bold mb-4">
              ابدأ رحلة النشر العلمي اليوم
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              انضم إلى آلاف الباحثين الذين نشروا أبحاثهم في أرقى المجلات العالمية بمساعدتنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl" asChild>
                <Link to="/submit-order" className="flex items-center gap-2">
                  <span>احصل على استشارة مجانية</span>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl" asChild>
                <Link to="/research-services">
                  استكشف خدماتنا البحثية
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JournalPublication;