import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { 
  Mic, 
  Volume2, 
  FileAudio, 
  Languages, 
  Clock, 
  Shield, 
  CheckCircle, 
  Upload,
  Headphones,
  ArrowRight,
  Play,
  Download
} from 'lucide-react';

const AudioTranslation = () => {
  const audioFormats = [
    { name: "MP3", description: "الأكثر شيوعاً", icon: "🎵" },
    { name: "WAV", description: "جودة عالية", icon: "🎧" },
    { name: "M4A", description: "آبل القياسي", icon: "🍎" },
    { name: "MP4", description: "فيديو وصوت", icon: "🎬" },
    { name: "AAC", description: "ضغط متقدم", icon: "💾" },
    { name: "FLAC", description: "جودة خالية من الفقدان", icon: "💿" }
  ];

  const features = [
    {
      icon: Volume2,
      title: "تقنية AI متطورة",
      description: "ذكاء اصطناعي متقدم لتحويل الكلام إلى نص بدقة عالية"
    },
    {
      icon: Languages,
      title: "أكثر من 80 لغة",
      description: "دعم شامل للغات والاكسنت واللهجات المختلفة"
    },
    {
      icon: Clock,
      title: "معالجة سريعة",
      description: "ترجمة فورية للملفات الصوتية خلال دقائق معدودة"
    },
    {
      icon: Volume2,
      title: "تحسين الصوت",
      description: "تقنيات تنظيف وتحسين جودة الصوت للحصول على أفضل النتائج"
    }
  ];

  const services = [
    {
      title: "تحويل الكلام إلى نص",
      description: "تحويل دقيق للمحتوى الصوتي إلى نص قابل للتحرير",
      icon: FileAudio,
      price: "0.10$ لكل دقيقة"
    },
    {
      title: "ترجمة المحتوى الصوتي",
      description: "ترجمة فورية للمحتوى الصوتي إلى أي لغة مطلوبة",
      icon: Languages,
      price: "0.15$ لكل دقيقة"
    },
    {
      title: "إنتاج صوتي مترجم",
      description: "تحويل الترجمة إلى ملف صوتي بأصوات طبيعية",
      icon: Headphones,
      price: "0.25$ لكل دقيقة"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* القسم الرئيسي */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-rose-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Mic className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                خدمة الترجمة الصوتية
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-arabic-formal font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-slate-800 dark:text-white">الترجمة </span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                الصوتية الذكية
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              تحويل وترجمة المحتوى الصوتي بتقنية الذكاء الاصطناعي المتطورة مع دعم أكثر من 80 لغة ولهجة
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Upload className="h-5 w-5 ml-2" />
                ارفع ملفك الصوتي
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600">
                <Play className="h-5 w-5 ml-2" />
                شاهد عرض تجريبي
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
              التنسيقات الصوتية المدعومة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              نتعامل مع جميع أنواع الملفات الصوتية الشائعة
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {audioFormats.map((format, index) => (
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

      {/* الخدمات */}
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
              خدماتنا الصوتية
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              مجموعة شاملة من خدمات الترجمة والتحويل الصوتي
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
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6">{service.description}</p>
                      
                      <div className="text-2xl font-bold text-purple-600 mb-6">
                        {service.price}
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        اطلب الخدمة
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
              مميزات خدمة الترجمة الصوتية
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              تقنيات متطورة لضمان أفضل جودة في تحويل وترجمة المحتوى الصوتي
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
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* كيف يعمل */}
      <section className="py-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-4">
              كيف تعمل الخدمة؟
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              عملية بسيطة وسريعة في 4 خطوات فقط
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "ارفع الملف", description: "ارفع ملفك الصوتي بأي تنسيق", icon: Upload },
              { step: "2", title: "تحويل تلقائي", description: "تحويل الكلام إلى نص بالذكاء الاصطناعي", icon: Volume2 },
              { step: "3", title: "ترجمة احترافية", description: "ترجمة النص إلى اللغة المطلوبة", icon: Languages },
              { step: "4", title: "تسليم النتائج", description: "استلم النص والصوت المترجم", icon: Download }
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
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 border-2 border-purple-600 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
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
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-6">
              ابدأ ترجمة ملفاتك الصوتية الآن
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              استفد من تقنية الذكاء الاصطناعي المتطورة لترجمة محتواك الصوتي
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
              ارفع ملفك الصوتي
              <Mic className="h-5 w-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default AudioTranslation;