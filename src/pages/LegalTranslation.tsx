import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Scale, 
  FileText, 
  Shield, 
  Award, 
  CheckCircle, 
  Clock,
  Users,
  Globe,
  BookOpen,
  Building2,
  ArrowRight,
  Upload,
  Download
} from 'lucide-react';

const LegalTranslation = () => {
  const legalDocuments = [
    { name: "العقود التجارية", icon: "📄", description: "عقود الشراكة والتوريد" },
    { name: "المستندات القانونية", icon: "⚖️", description: "وثائق المحاكم والقضايا" },
    { name: "براءات الاختراع", icon: "💡", description: "طلبات وثائق الملكية الفكرية" },
    { name: "اللوائح والقوانين", icon: "📋", description: "نصوص قانونية وتشريعية" },
    { name: "شهادات رسمية", icon: "🏆", description: "شهادات حكومية ومؤسسية" },
    { name: "اتفاقيات دولية", icon: "🌍", description: "معاهدات ومذكرات تفاهم" }
  ];

  const expertise = [
    {
      icon: Scale,
      title: "خبرة قانونية متخصصة",
      description: "فريق من المترجمين المتخصصين في القانون والحاصلين على مؤهلات قانونية",
      features: ["مترجمون حقوقيون", "خبرة 10+ سنوات", "معتمدون دولياً"]
    },
    {
      icon: Shield,
      title: "سرية وأمان مطلق",
      description: "التزام تام بسرية المعلومات مع بروتوكولات أمان متقدمة",
      features: ["اتفاقيات سرية", "تشفير متقدم", "حماية شاملة"]
    },
    {
      icon: Award,
      title: "اعتماد رسمي",
      description: "ترجمة معتمدة من الجهات الرسمية والسفارات والمحاكم",
      features: ["اعتماد حكومي", "ختم رسمي", "قبول دولي"]
    },
    {
      icon: Clock,
      title: "التزام بالمواعيد",
      description: "تسليم دقيق في المواعيد المحددة مع إمكانية التسليم العاجل",
      features: ["مواعيد محددة", "تسليم عاجل", "متابعة مستمرة"]
    }
  ];

  const legalSystems = [
    { name: "القانون المدني", countries: "فرنسا، ألمانيا، مصر", icon: "🏛️" },
    { name: "القانون العام", countries: "بريطانيا، أمريكا، كندا", icon: "🇬🇧" },
    { name: "الشريعة الإسلامية", countries: "السعودية، الإمارات، قطر", icon: "🕌" },
    { name: "القانون الدولي", countries: "المحاكم الدولية", icon: "🌍" }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* القسم الرئيسي */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950 dark:via-indigo-950 dark:to-blue-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Scale className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                خدمة الترجمة القانونية المعتمدة
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-arabic-formal font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-slate-800 dark:text-white">الترجمة </span>
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                القانونية المعتمدة
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              ترجمة قانونية دقيقة ومعتمدة لجميع المستندات القانونية من قبل مترجمين متخصصين في القانون
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                <Upload className="h-5 w-5 ml-2" />
                ارفع مستندك القانوني
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600">
                استشارة قانونية مجانية
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* أنواع المستندات القانونية */}
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
              أنواع المستندات القانونية
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              نغطي جميع أنواع الوثائق والمستندات القانونية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalDocuments.map((doc, index) => (
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
                    <div className="text-4xl mb-4">{doc.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{doc.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{doc.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* خبراتنا المتخصصة */}
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
              خبراتنا المتخصصة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              فريق متخصص من المترجمين القانونيين ذوي الخبرة العملية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {expertise.map((item, index) => {
              const IconComponent = item.icon;
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
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                          <p className="text-slate-600 dark:text-slate-300 mb-6">{item.description}</p>
                          
                          <div className="space-y-2">
                            {item.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* الأنظمة القانونية */}
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
              خبرة في جميع الأنظمة القانونية
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              نتعامل مع مختلف الأنظمة القانونية العالمية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {legalSystems.map((system, index) => (
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
                    <div className="text-4xl mb-4">{system.icon}</div>
                    <h3 className="text-lg font-bold mb-3">{system.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{system.countries}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* العملية والأسعار */}
      <section className="py-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-6">
                عملية الترجمة القانونية
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                عملية منظمة ودقيقة لضمان أعلى معايير الجودة القانونية
              </p>
              
              <div className="space-y-6">
                {[
                  { step: "1", title: "تحليل المستند", description: "دراسة المستند وتحديد التخصص القانوني" },
                  { step: "2", title: "ترجمة متخصصة", description: "ترجمة من قبل مترجم قانوني متخصص" },
                  { step: "3", title: "مراجعة قانونية", description: "مراجعة من محامي أو خبير قانوني" },
                  { step: "4", title: "اعتماد رسمي", description: "ختم وتوثيق رسمي للوثيقة المترجمة" }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white dark:bg-slate-800 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">أسعار الترجمة القانونية</h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="font-medium">العقود والاتفاقيات</span>
                      <span className="font-bold text-purple-600">$0.15/كلمة</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="font-medium">الوثائق الحكومية</span>
                      <span className="font-bold text-purple-600">$0.18/كلمة</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="font-medium">براءات الاختراع</span>
                      <span className="font-bold text-purple-600">$0.25/كلمة</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="font-medium">المستندات القضائية</span>
                      <span className="font-bold text-purple-600">$0.20/كلمة</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="font-bold">شامل الاعتماد الرسمي</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      جميع الأسعار تشمل الاعتماد والختم الرسمي
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: FileText, number: "+15,000", label: "مستند قانوني مترجم" },
              { icon: Building2, number: "+500", label: "مكتب محاماة" },
              { icon: Globe, number: "+30", label: "نظام قانوني" },
              { icon: Users, number: "100%", label: "نسبة القبول الرسمي" }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <IconComponent className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-purple-100">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-6">
              احصل على ترجمة قانونية معتمدة الآن
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              فريق متخصص من المترجمين القانونيين جاهز لخدمتك بأعلى معايير الجودة
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              ابدأ مشروعك القانوني
              <ArrowRight className="h-5 w-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalTranslation;