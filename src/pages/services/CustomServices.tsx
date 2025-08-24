import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Users, 
  Settings, 
  Briefcase, 
  Building2, 
  Headphones, 
  Clock, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';

const CustomServices = () => {
  const businessTypes = [
    { name: "الشركات الناشئة", icon: "🚀", description: "حلول مرنة للشركات الجديدة" },
    { name: "الشركات الكبرى", icon: "🏢", description: "خدمات مؤسسية متطورة" },
    { name: "المؤسسات الحكومية", icon: "🏛️", description: "حلول للقطاع العام" },
    { name: "الجامعات", icon: "🎓", description: "خدمات تعليمية متخصصة" },
    { name: "المستشفيات", icon: "🏥", description: "ترجمة طبية دقيقة" },
    { name: "شركات التقنية", icon: "💻", description: "ترجمة تقنية متخصصة" }
  ];

  const customSolutions = [
    {
      title: "API التكامل",
      description: "تكامل خدمات الترجمة مباشرة مع أنظمتك",
      features: ["REST API", "Real-time", "SDK متعددة", "وثائق شاملة"],
      icon: Settings
    },
    {
      title: "مدير حساب مختص",
      description: "مدير مختص لمتابعة جميع مشاريعك",
      features: ["متابعة شخصية", "دعم 24/7", "تقارير دورية", "استشارات"],
      icon: Users
    },
    {
      title: "حلول مخصصة",
      description: "تطوير حلول ترجمة مخصصة لاحتياجاتك",
      features: ["تصميم خاص", "تطوير مخصص", "تدريب الفريق", "صيانة مستمرة"],
      icon: Briefcase
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "SLA مضمون",
      description: "التزام بمواعيد التسليم مع ضمان مستوى الخدمة"
    },
    {
      icon: Shield,
      title: "أمان مؤسسي",
      description: "أعلى معايير الأمان وحماية البيانات"
    },
    {
      icon: Target,
      title: "قابلية التوسع",
      description: "حلول قابلة للتوسع مع نمو أعمالك"
    },
    {
      icon: Headphones,
      title: "دعم مخصص",
      description: "فريق دعم مختص متاح على مدار الساعة"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* القسم الرئيسي */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-slate-400/20 to-gray-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-zinc-400/20 to-slate-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Building2 className="h-6 w-6 text-slate-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                الخدمات المخصصة للمؤسسات
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-arabic-formal font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-slate-800 dark:text-white">حلول ترجمة </span>
              <span className="bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
                مخصصة للمؤسسات
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              حلول ترجمة متطورة ومخصصة للشركات والمؤسسات مع دعم فني متخصص وضمان أعلى معايير الجودة والأمان
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white">
                <Calendar className="h-5 w-5 ml-2" />
                احجز استشارة مجانية
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600">
                <Phone className="h-5 w-5 ml-2" />
                تواصل معنا
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* أنواع الأعمال */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-4">
              نخدم جميع أنواع المؤسسات
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              حلول مخصصة تناسب احتياجات كل قطاع ونوع عمل
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessTypes.map((business, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{business.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{business.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{business.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* الحلول المخصصة */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-4">
              حلولنا المخصصة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              تقنيات متطورة وخدمات مخصصة لتلبية احتياجاتك الفريدة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customSolutions.map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-center">{solution.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6 text-center">{solution.description}</p>
                      
                      <div className="space-y-3">
                        {solution.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
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

      {/* المميزات المؤسسية */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-6">
                لماذا تختارنا المؤسسات الكبرى؟
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                نقدم مستوى خدمة مؤسسي متميز يلبي احتياجات الشركات الكبرى والمؤسسات الحكومية
              </p>
              
              <div className="space-y-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-900/20 dark:to-gray-900/20 rounded-2xl p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 to-gray-600/5 rounded-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-8 text-center">عملاؤنا المؤسسيون</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold">200+ شركة</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">في القطاع الخاص</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold">50+ مؤسسة حكومية</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">في القطاع العام</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-bold">100+ جامعة</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">في القطاع التعليمي</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* عملية التعاون */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-4">
              كيف نبدأ العمل معاً؟
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              عملية واضحة ومنظمة للبدء في شراكة ناجحة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "الاستشارة", description: "استشارة مجانية لفهم احتياجاتك", icon: Phone },
              { step: "2", title: "التخطيط", description: "وضع خطة مخصصة لمتطلباتك", icon: Target },
              { step: "3", title: "التنفيذ", description: "بدء العمل وفق الخطة المتفق عليها", icon: Zap },
              { step: "4", title: "المتابعة", description: "متابعة مستمرة وتحسين الخدمة", icon: Headphones }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700"></div>
                  )}
                  
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-600 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 border-2 border-slate-600 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-gradient-to-r from-slate-600 to-gray-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-6">
              ابدأ شراكة استراتيجية معنا
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              احصل على استشارة مجانية لمناقشة احتياجاتك ووضع خطة مخصصة لمؤسستك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-slate-600 hover:bg-slate-50">
                احجز استشارة مجانية
                <Calendar className="h-5 w-5 mr-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10">
                تواصل عبر البريد
                <Mail className="h-5 w-5 mr-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomServices;