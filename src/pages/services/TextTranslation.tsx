import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdvancedTranslationForm from "@/components/AdvancedTranslationForm";
import { 
  FileText, 
  Languages, 
  Clock, 
  Shield, 
  CheckCircle, 
  Star,
  Users,
  Award,
  ArrowRight,
  Download,
  Upload
} from 'lucide-react';

const TextTranslation = () => {
  const features = [
    {
      icon: Languages,
      title: "أكثر من 100 لغة",
      description: "ترجمة فورية بين جميع اللغات الرئيسية والفرعية حول العالم"
    },
    {
      icon: Clock,
      title: "ترجمة فورية",
      description: "تسليم سريع خلال دقائق للنصوص القصيرة وساعات للنصوص الطويلة"
    },
    {
      icon: Shield,
      title: "سرية تامة",
      description: "حماية كاملة لنصوصكم مع ضمان عدم تسريب أي محتوى"
    },
    {
      icon: Award,
      title: "دقة 99%",
      description: "مراجعة احترافية من متخصصين لضمان أعلى مستوى من الدقة"
    }
  ];

  const plans = [
    {
      name: "الخطة الأساسية",
      price: "0.02",
      unit: "لكل كلمة",
      features: [
        "ترجمة فورية",
        "أكثر من 50 لغة",
        "مراجعة أساسية",
        "تسليم خلال ساعة"
      ],
      popular: false
    },
    {
      name: "الخطة المتقدمة",
      price: "0.05",
      unit: "لكل كلمة",
      features: [
        "ترجمة احترافية",
        "أكثر من 100 لغة",
        "مراجعة متخصصة",
        "تسليم خلال 30 دقيقة",
        "دعم 24/7"
      ],
      popular: true
    },
    {
      name: "الخطة المؤسسية",
      price: "مخصص",
      unit: "حسب الحجم",
      features: [
        "ترجمة مخصصة",
        "جميع اللغات",
        "مراجعة متعددة المستويات",
        "تسليم فوري",
        "مدير حساب مختص",
        "خصومات للكميات الكبيرة"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* القسم الرئيسي */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                خدمة ترجمة النصوص
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-arabic-formal font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-slate-800 dark:text-white">ترجمة </span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                النصوص الفورية
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              احصل على ترجمة فورية ودقيقة لجميع أنواع النصوص بأكثر من 100 لغة مع ضمان الجودة والسرية التامة
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Upload className="h-5 w-5 ml-2" />
                ابدأ الترجمة الآن
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600">
                <Download className="h-5 w-5 ml-2" />
                تجربة مجانية
              </Button>
            </motion.div>
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
              لماذا تختار خدمة ترجمة النصوص لدينا؟
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              تقنيات متطورة ومترجمون محترفون لضمان أفضل جودة ترجمة
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
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* الخطط والأسعار */}
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
              خطط الأسعار
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              اختر الخطة التي تناسب احتياجاتك وميزانيتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      الأكثر شعبية
                    </span>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : ''}`}>
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-blue-600">${plan.price}</span>
                        <span className="text-slate-600 dark:text-slate-300 mr-2">{plan.unit}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      اختر هذه الخطة
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, number: "+50,000", label: "عميل راضي" },
              { icon: Languages, number: "+100", label: "لغة مدعومة" },
              { icon: FileText, number: "+1M", label: "نص مترجم" },
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
                  <div className="text-blue-100">{stat.label}</div>
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
              ابدأ ترجمة نصوصك الآن
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              احصل على ترجمة احترافية وسريعة لنصوصك خلال دقائق
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              ابدأ الترجمة مجاناً
              <ArrowRight className="h-5 w-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* فورم طلب الخدمة */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AdvancedTranslationForm 
            translationType="text"
            title="احصل على ترجمة نصوص احترافية"
            description="ترجمة دقيقة وسريعة لجميع أنواع النصوص"
            gradientFrom="blue-600"
            gradientTo="indigo-600"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TextTranslation;