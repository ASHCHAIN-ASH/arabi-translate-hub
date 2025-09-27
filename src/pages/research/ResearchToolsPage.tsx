import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceInquiryForm from '@/components/ServiceInquiryForm';
import { 
  Search, 
  BookOpen, 
  BarChart3, 
  Users, 
  Target,
  TrendingUp,
  Database,
  Microscope,
  FileSearch,
  Lightbulb,
  Award,
  CheckCircle
} from 'lucide-react';

const ResearchToolsPage = () => {
  const tools = [
    {
      title: 'أدوات البحث النوعي',
      description: 'أدوات متخصصة للبحوث النوعية والاستكشافية',
      icon: <Search className="h-8 w-8 text-blue-600" />,
      features: ['المقابلات المتعمقة', 'تحليل المحتوى', 'الملاحظة المشاركة', 'دراسة الحالة'],
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'أدوات البحث الكمي',
      description: 'برامج التحليل الإحصائي والكمي المتقدمة',
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      features: ['SPSS', 'R Studio', 'Python Analytics', 'Excel المتقدم'],
      color: 'from-green-600 to-emerald-600'
    },
    {
      title: 'أدوات جمع البيانات',
      description: 'منصات وأدوات جمع البيانات الحديثة',
      icon: <Database className="h-8 w-8 text-purple-600" />,
      features: ['استبيانات ذكية', 'مقابلات رقمية', 'تحليل البيانات الضخمة', 'أدوات المسح'],
      color: 'from-purple-600 to-violet-600'
    },
    {
      title: 'أدوات التحليل المتقدم',
      description: 'تقنيات التحليل والنمذجة المتطورة',
      icon: <Microscope className="h-8 w-8 text-orange-600" />,
      features: ['التحليل متعدد المتغيرات', 'النمذجة الإحصائية', 'التنبؤ', 'التحليل الشبكي'],
      color: 'from-orange-600 to-red-600'
    }
  ];

  const services = [
    {
      title: 'استشارة اختيار الأداة المناسبة',
      description: 'نساعدك في اختيار الأدوات البحثية المناسبة لمشروعك',
      price: '300 ريال',
      duration: '1-2 أيام',
      icon: <Target className="h-6 w-6" />
    },
    {
      title: 'تدريب على الأدوات البحثية',
      description: 'دورات تدريبية متخصصة على استخدام الأدوات البحثية',
      price: '500 ريال',
      duration: '3-5 أيام',
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: 'تطبيق الأدوات وتحليل النتائج',
      description: 'تطبيق الأدوات البحثية وتحليل النتائج بشكل احترافي',
      price: '800 ريال',
      duration: '1-2 أسبوع',
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  const benefits = [
    { text: 'أحدث الأدوات البحثية المتاحة', icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
    { text: 'تدريب شامل ومتخصص', icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
    { text: 'دعم فني مستمر', icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
    { text: 'نتائج دقيقة وموثوقة', icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
    { text: 'توفير الوقت والجهد', icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
    { text: 'ضمان الجودة الأكاديمية', icon: <CheckCircle className="h-5 w-5 text-green-600" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4">
                <FileSearch className="h-16 w-16 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              أدوات البحث العلمي
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              اكتشف واستخدم أحدث الأدوات البحثية لإنجاز مشروعك بأعلى معايير الجودة والدقة
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-6 py-3">
                <Lightbulb className="h-5 w-5 ml-2" />
                أدوات متطورة
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-6 py-3">
                <Award className="h-5 w-5 ml-2" />
                نتائج موثوقة
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-6 py-3">
                <Users className="h-5 w-5 ml-2" />
                خبراء متخصصون
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              فئات الأدوات البحثية المتاحة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              مجموعة شاملة من الأدوات البحثية المتخصصة لجميع أنواع البحوث الأكاديمية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className={`bg-gradient-to-r ${tool.color} text-white rounded-t-lg`}>
                    <div className="flex items-center gap-4">
                      {tool.icon}
                      <CardTitle className="text-2xl">{tool.title}</CardTitle>
                    </div>
                    <p className="text-blue-100 mt-2">{tool.description}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              خدماتنا في أدوات البحث
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              خدمات متكاملة لمساعدتك في استخدام الأدوات البحثية بأقصى فعالية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-blue-600">{service.price}</span>
                      <p className="text-sm text-gray-600 mt-1">مدة التسليم: {service.duration}</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      اطلب الخدمة
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              لماذا تختار أدواتنا البحثية؟
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              مميزات حصرية تضمن لك الحصول على أفضل النتائج البحثية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300"
              >
                {benefit.icon}
                <span className="text-white font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ServiceInquiryForm
        serviceType="research_tools"
        serviceName="أدوات البحث العلمي"
        serviceIcon={<FileSearch className="h-8 w-8" />}
        showLanguageFields={false}
        showFileSizeField={true}
      />

      <Footer />
    </div>
  );
};

export default ResearchToolsPage;