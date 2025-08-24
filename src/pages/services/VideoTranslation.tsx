import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { 
  Video, 
  Play, 
  Clock, 
  Languages, 
  Shield, 
  CheckCircle, 
  Upload,
  Download,
  Subtitles,
  Volume2,
  Edit,
  ArrowRight,
  Star,
  Users
} from 'lucide-react';

const VideoTranslation = () => {
  const videoFormats = [
    { name: "MP4", description: "الأكثر شيوعاً", icon: "🎬" },
    { name: "AVI", description: "جودة عالية", icon: "🎥" },
    { name: "MOV", description: "آبل القياسي", icon: "🍎" },
    { name: "MKV", description: "متعدد الوسائط", icon: "📹" },
    { name: "WMV", description: "ويندوز ميديا", icon: "🖥️" },
    { name: "FLV", description: "فلاش فيديو", icon: "⚡" }
  ];

  const services = [
    {
      title: "ترجمة الفيديو بالنصوص",
      description: "إضافة ترجمة نصية احترافية لفيديوهاتك",
      features: ["ترجمة دقيقة", "توقيت مثالي", "تنسيق جميل", "عدة لغات"],
      price: "من $5 لكل دقيقة",
      icon: Subtitles
    },
    {
      title: "الدبلجة الصوتية",
      description: "استبدال الصوت الأصلي بترجمة صوتية احترافية",
      features: ["أصوات طبيعية", "تزامن مثالي", "جودة عالية", "اختيار الصوت"],
      price: "من $15 لكل دقيقة",
      icon: Volume2,
      popular: true
    },
    {
      title: "خدمة شاملة",
      description: "ترجمة نصية ودبلجة صوتية في حزمة واحدة",
      features: ["ترجمة + دبلجة", "خصم خاص", "جودة احترافية", "تسليم سريع"],
      price: "من $18 لكل دقيقة",
      icon: Edit
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "توقيت مثالي",
      description: "ضبط دقيق لتوقيت الترجمة مع الحوار الأصلي"
    },
    {
      icon: Languages,
      title: "+50 لغة",
      description: "دعم أكثر من 50 لغة للترجمة والدبلجة"
    },
    {
      icon: Shield,
      title: "سرية تامة",
      description: "حماية كاملة لمحتوى الفيديو والمعلومات"
    },
    {
      icon: Star,
      title: "جودة HD",
      description: "الحفاظ على جودة الفيديو الأصلية"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* القسم الرئيسي */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-yellow-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Video className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                خدمة ترجمة الفيديو
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-arabic-formal font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-slate-800 dark:text-white">ترجمة </span>
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                الفيديو الاحترافية
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              اجعل محتواك المرئي يصل لجمهور عالمي مع خدمات الترجمة والدبلجة الاحترافية للفيديوهات
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white">
                <Upload className="h-5 w-5 ml-2" />
                ارفع فيديوك الآن
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600">
                <Play className="h-5 w-5 ml-2" />
                شاهد أمثلة
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* التنسيقات المدعومة */}
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
              تنسيقات الفيديو المدعومة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              نتعامل مع جميع تنسيقات الفيديو الشائعة
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {videoFormats.map((format, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="text-3xl mb-3">{format.icon}</div>
                    <h3 className="text-lg font-bold mb-1">{format.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">{format.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* الخدمات والأسعار */}
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
              خدمات ترجمة الفيديو
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              اختر نوع الخدمة التي تناسب احتياجاتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        الأكثر طلباً
                      </span>
                    </div>
                  )}
                  
                  <Card className={`h-full ${service.popular ? 'border-2 border-red-500 shadow-xl' : ''}`}>
                    <CardContent className="p-8">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">{service.description}</p>
                        
                        <div className="text-2xl font-bold text-red-600 mb-6">{service.price}</div>
                      </div>
                      
                      <div className="space-y-3 mb-8">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full ${service.popular ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' : ''}`}
                        variant={service.popular ? 'default' : 'outline'}
                      >
                        اطلب الخدمة
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* المميزات */}
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
              مميزات خدمة ترجمة الفيديو
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              تقنيات متطورة ومعايير عالية لترجمة الفيديوهات
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
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
                      <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* عملية العمل */}
      <section className="py-16 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-4">
              كيف نعمل؟
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              عملية واضحة ومنظمة لضمان أفضل النتائج
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "ارفع الفيديو", description: "ارفع فيديوك بأي تنسيق مدعوم", icon: Upload },
              { step: "2", title: "اختر الخدمة", description: "حدد نوع الترجمة المطلوبة", icon: Edit },
              { step: "3", title: "المعالجة", description: "فريقنا يعمل على ترجمة المحتوى", icon: Video },
              { step: "4", title: "التسليم", description: "استلم فيديوك مترجماً", icon: Download }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 border-2 border-red-600 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
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

      {/* الإحصائيات */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Video, number: "+10,000", label: "فيديو مترجم" },
              { icon: Languages, number: "+50", label: "لغة مدعومة" },
              { icon: Users, number: "+5,000", label: "عميل راضي" },
              { icon: Star, number: "4.9/5", label: "تقييم العملاء" }
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
                  <div className="text-red-100">{stat.label}</div>
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
              اجعل فيديوهاتك تصل للعالم
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              ابدأ في ترجمة فيديوهاتك وإيصال رسالتك لجمهور عالمي أوسع
            </p>
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white">
              ابدأ مشروعك الآن
              <Video className="h-5 w-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default VideoTranslation;