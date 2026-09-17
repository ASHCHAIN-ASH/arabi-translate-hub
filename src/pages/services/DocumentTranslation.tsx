import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/data/legacy/client';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { AuthCtaCard } from '@/components/research/AuthCtaCard';

import { 
  FileText, 
  Upload, 
  Download, 
  Shield, 
  CheckCircle, 
  Clock,
  Award,
  Users,
  Star,
  FileCheck,
  ArrowRight,
  Layout,
  Send,
  Loader2,
  Phone,
  Mail
} from 'lucide-react';

const DocumentTranslation = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    documentType: '',
    sourceLanguage: '',
    targetLanguage: '',
    documentSize: '',
    urgency: '',
    additionalNotes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-document-translation-inquiry', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الطلب بنجاح! ✅",
        description: "سنتواصل معك خلال 24 ساعة لمناقشة التفاصيل",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceType: '',
        documentType: '',
        sourceLanguage: '',
        targetLanguage: '',
        documentSize: '',
        urgency: '',
        additionalNotes: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "حدث خطأ في الإرسال ❌",
        description: "يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const supportedFormats = [
    { name: "Word Documents", ext: ".docx, .doc", icon: "📄" },
    { name: "PDF Files", ext: ".pdf", icon: "📋" },
    { name: "PowerPoint", ext: ".pptx, .ppt", icon: "📊" },
    { name: "Excel Sheets", ext: ".xlsx, .xls", icon: "📈" },
    { name: "Text Files", ext: ".txt, .rtf", icon: "📝" },
    { name: "OpenOffice", ext: ".odt, .odp", icon: "📰" }
  ];

  const features = [
    {
      icon: Layout,
      title: "الحفاظ على التنسيق",
      description: "نضمن الحفاظ على التنسيق الأصلي للمستند بكامل تفاصيله"
    },
    {
      icon: Shield,
      title: "أمان عالي",
      description: "تشفير متقدم لحماية مستنداتكم الحساسة والسرية"
    },
    {
      icon: Clock,
      title: "تسليم سريع",
      description: "تسليم المستندات المترجمة خلال 24-48 ساعة"
    },
    {
      icon: Award,
      title: "جودة احترافية",
      description: "مراجعة متعددة المستويات من مترجمين متخصصين"
    }
  ];

  const process = [
    {
      step: 1,
      title: "ارفع المستند",
      description: "ارفع ملفك بأي تنسيق مدعوم",
      icon: Upload
    },
    {
      step: 2,
      title: "اختر اللغات",
      description: "حدد لغة المصدر ولغة الوجهة",
      icon: FileText
    },
    {
      step: 3,
      title: "المراجعة والترجمة",
      description: "فريقنا يترجم ويراجع المستند",
      icon: FileCheck
    },
    {
      step: 4,
      title: "التسليم",
      description: "استلم مستندك مترجماً بنفس التنسيق",
      icon: Download
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <Breadcrumb items={[
        { label: 'خدمات الترجمة', href: '/services/translation-services' },
        { label: 'ترجمة المستندات' }
      ]} />
      
      {/* القسم الرئيسي */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full border border-slate-200/50 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FileText className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                خدمة ترجمة المستندات
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-arabic-formal font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-slate-800 dark:text-white">ترجمة </span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                المستندات الاحترافية
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              ترجمة احترافية لجميع أنواع المستندات مع الحفاظ على التنسيق الأصلي والجودة العالية
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                <Upload className="h-5 w-5 ml-2" />
                ارفع مستندك الآن
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600">
                تجربة مجانية
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
              التنسيقات المدعومة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              نتعامل مع جميع أنواع المستندات والملفات الشائعة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportedFormats.map((format, index) => (
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
                    <div className="text-4xl mb-4">{format.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{format.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{format.ext}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* عملية الترجمة */}
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
              كيف تتم عملية الترجمة؟
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              عملية بسيطة ومنظمة لضمان أفضل النتائج
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800"></div>
                  )}
                  
                  <Card className="text-center h-full hover:shadow-lg transition-all duration-300 relative">
                    <CardContent className="p-6">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {step.step}
                      </div>
                      
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-6">
                لماذا نحن الأفضل في ترجمة المستندات؟
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                نقدم خدمة ترجمة مستندات متميزة تجمع بين التقنية المتطورة والخبرة البشرية
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
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
              <div className="relative bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 rounded-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 text-center">ضمان الجودة</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                      <div className="text-3xl font-bold text-emerald-600">99.5%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">دقة الترجمة</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                      <div className="text-3xl font-bold text-emerald-600">24-48</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">ساعة تسليم</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                      <div className="text-3xl font-bold text-emerald-600">100%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">حفظ التنسيق</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                      <div className="text-3xl font-bold text-emerald-600">24/7</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">دعم فني</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-formal font-bold mb-6">
              ابدأ ترجمة مستنداتك الآن
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              احصل على ترجمة احترافية لمستنداتك مع الحفاظ على التنسيق الأصلي
            </p>
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              ارفع مستندك الآن
              <Upload className="h-5 w-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>


      {/* Auth CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <AuthCtaCard serviceTitle="ترجمة المستندات" />
        </div>
      </section>


    </div>
  );
};

export default DocumentTranslation;