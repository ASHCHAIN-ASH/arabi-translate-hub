import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdvancedTranslationForm from "@/components/AdvancedTranslationForm";
import { 
  Globe, 
  Layout, 
  Search, 
  Smartphone, 
  Code, 
  Target, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Zap
} from 'lucide-react';

const WebsiteTranslation = () => {
  const platforms = [
    { name: "WordPress", icon: "🔷", description: "المنصة الأكثر شعبية" },
    { name: "Shopify", icon: "🛒", description: "متاجر إلكترونية" },
    { name: "Magento", icon: "🏪", description: "تجارة إلكترونية متقدمة" },
    { name: "Drupal", icon: "🔧", description: "مواقع مؤسسية" },
    { name: "Joomla", icon: "📊", description: "إدارة المحتوى" },
    { name: "HTML/CSS", icon: "💻", description: "مواقع مخصصة" },
    { name: "React/Vue", icon: "⚛️", description: "تطبيقات حديثة" },
    { name: "Laravel", icon: "🚀", description: "تطوير متقدم" }
  ];

  const features = [
    {
      icon: Layout,
      title: "الحفاظ على التصميم",
      description: "نضمن الحفاظ على تصميم موقعك وتخطيطه الأصلي بعد الترجمة"
    },
    {
      icon: Search,
      title: "SEO محسن",
      description: "ترجمة محسنة لمحركات البحث مع الكلمات المفتاحية المناسبة"
    },
    {
      icon: Smartphone,
      title: "متوافق مع الجوال",
      description: "تصميم متجاوب يعمل بسلاسة على جميع الأجهزة"
    },
    {
      icon: Zap,
      title: "تحديث تلقائي",
      description: "تحديث تلقائي للمحتوى المترجم عند إضافة محتوى جديد"
    }
  ];

  const services = [
    {
      title: "ترجمة مواقع شخصية",
      description: "ترجمة كاملة للمواقع الشخصية والمدونات",
      price: "من $299",
      pages: "حتى 10 صفحات",
      delivery: "3-5 أيام"
    },
    {
      title: "ترجمة مواقع تجارية",
      description: "ترجمة احترافية للمواقع التجارية والمتاجر الإلكترونية",
      price: "من $799",
      pages: "حتى 50 صفحة",
      delivery: "7-10 أيام",
      popular: true
    },
    {
      title: "ترجمة مواقع مؤسسية",
      description: "ترجمة شاملة للمواقع المؤسسية والحكومية",
      price: "مخصص",
      pages: "غير محدود",
      delivery: "حسب المشروع"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* القسم الرئيسي */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Globe className="h-6 w-6 text-cyan-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                خدمة ترجمة المواقع
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-arabic-formal font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-slate-800 dark:text-white">ترجمة </span>
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                المواقع الإلكترونية
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              وصل إلى جمهور عالمي أوسع مع ترجمة احترافية لموقعك الإلكتروني مع الحفاظ على التصميم والوظائف
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white">
                احصل على عرض مجاني
                <Globe className="h-5 w-5 mr-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600">
                شاهد أمثلة
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* المنصات المدعومة */}
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
              المنصات والتقنيات المدعومة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              نتعامل مع جميع أنواع المواقع والمنصات الحديثة
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
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
                    <div className="text-3xl mb-3">{platform.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{platform.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{platform.description}</p>
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
              باقات ترجمة المواقع
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              اختر الباقة التي تناسب حجم موقعك واحتياجاتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
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
                    <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      الأكثر طلباً
                    </span>
                  </div>
                )}
                
                <Card className={`h-full ${service.popular ? 'border-2 border-cyan-500 shadow-xl' : ''}`}>
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6">{service.description}</p>
                      
                      <div className="text-3xl font-bold text-cyan-600 mb-2">{service.price}</div>
                      <div className="text-sm text-slate-500 mb-4">{service.pages}</div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>ترجمة احترافية</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>حفظ التصميم</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>SEO محسن</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>دعم فني</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{`تسليم: ${service.delivery}`}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${service.popular ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700' : ''}`}
                      variant={service.popular ? 'default' : 'outline'}
                    >
                      اطلب الباقة
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* المميزات */}
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
                لماذا تختار خدمة ترجمة المواقع لدينا؟
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                نقدم حلول ترجمة متكاملة للمواقع الإلكترونية مع الحفاظ على الجودة والأداء
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
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
              <div className="relative bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-8 text-center">إحصائيات نجاحنا</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-8 w-8 text-cyan-600" />
                      </div>
                      <div className="text-3xl font-bold text-cyan-600">300%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">زيادة في الزوار</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="h-8 w-8 text-cyan-600" />
                      </div>
                      <div className="text-3xl font-bold text-cyan-600">+500</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">موقع مترجم</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="h-8 w-8 text-cyan-600" />
                      </div>
                      <div className="text-3xl font-bold text-cyan-600">98%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">دقة الترجمة</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Shield className="h-8 w-8 text-cyan-600" />
                      </div>
                      <div className="text-3xl font-bold text-cyan-600">100%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">أمان البيانات</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-6">
              استعد للوصول إلى جمهور عالمي
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              احصل على عرض مجاني لترجمة موقعك وابدأ في توسيع نطاق عملك عالمياً
            </p>
            <Button size="lg" className="bg-white text-cyan-600 hover:bg-cyan-50">
              احصل على عرض مجاني
              <Globe className="h-5 w-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* فورم طلب الخدمة */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AdvancedTranslationForm 
            translationType="website"
            title="احصل على ترجمة مواقع احترافية"
            description="ترجمة شاملة للمواقع الإلكترونية مع الحفاظ على التصميم والوظائف"
            gradientFrom="teal-600"
            gradientTo="blue-600"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WebsiteTranslation;