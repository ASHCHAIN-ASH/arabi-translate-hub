import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Languages, CheckCircle, FileText, Search, Sparkles, ArrowLeft, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { EditingServiceForm } from '@/components/editing/EditingServiceForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LanguageProofreading = () => {
  const navigate = useNavigate();
  
  const features = [
    { icon: CheckCircle, title: "تصحيح إملائي شامل", description: "مراجعة دقيقة لجميع الأخطاء الإملائية", color: "from-blue-500 to-cyan-500" },
    { icon: FileText, title: "مراجعة نحوية", description: "تدقيق القواعد النحوية والصرفية", color: "from-purple-500 to-pink-500" },
    { icon: Search, title: "ضبط علامات الترقيم", description: "استخدام صحيح لعلامات الترقيم", color: "from-green-500 to-emerald-500" },
    { icon: Sparkles, title: "تحسين الوضوح", description: "تعزيز وضوح النص وسلاسته", color: "from-orange-500 to-red-500" }
  ];

  const processSteps = [
    { number: "01", title: "استلام النص", description: "نستلم النص ونراجع متطلباتك" },
    { number: "02", title: "التدقيق الأولي", description: "فحص شامل للأخطاء الإملائية والنحوية" },
    { number: "03", title: "المراجعة الدقيقة", description: "تدقيق متأنٍ لكل جملة وفقرة" },
    { number: "04", title: "التسليم النهائي", description: "تسليم النص المُدقق مع تقرير مفصل" }
  ];

  const faqs = [
    {
      question: "ما الفرق بين التدقيق اللغوي والمراجعة؟",
      answer: "التدقيق اللغوي يركز على الأخطاء الإملائية والنحوية، بينما المراجعة تشمل تحسين الأسلوب والبنية."
    },
    {
      question: "كم يستغرق تدقيق النص؟",
      answer: "يعتمد على طول النص، لكن عادة ما نسلم خلال 3-5 أيام عمل للنصوص القصيرة والمتوسطة."
    },
    {
      question: "هل تقدمون ضماناً للجودة؟",
      answer: "نعم، نقدم ضماناً كاملاً للجودة مع إمكانية إجراء تعديلات مجانية إذا لزم الأمر."
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <Breadcrumb items={[
        { label: 'خدمات التحرير', href: '/services/editing-services' },
        { label: 'التدقيق اللغوي' }
      ]} />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-background dark:from-blue-950/20 dark:via-cyan-950/10 dark:to-background" />
          <motion.div 
            className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 sm:mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/services/editing-services')}
              className="gap-2 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة لخدمات التحرير
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Languages className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                التدقيق اللغوي الاحترافي
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                تدقيق لغوي دقيق وشامل
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              نضمن لك نصاً خالياً من الأخطاء الإملائية والنحوية مع الحفاظ على أسلوبك الخاص
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="w-5 h-5 ml-2" />
                اطلب الخدمة الآن
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                تعرف على المزايا
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">ما نقدمه لك</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              خدمات تدقيق لغوي شاملة تضمن جودة نصوصك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-background to-muted/20">
                    <CardContent className="p-4 sm:p-6">
                      <motion.div 
                        className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                        whileHover={{ rotate: 5 }}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      </motion.div>
                      <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">كيف نعمل معك؟</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              عملية واضحة وسلسة لضمان أفضل النتائج
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-4 sm:p-6 relative">
                      <motion.div 
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-blue-500/20 to-cyan-500/20 bg-clip-text text-transparent mb-3 sm:mb-4"
                        initial={{ opacity: 0.3 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        {step.number}
                      </motion.div>
                      <h3 className="font-bold text-base sm:text-lg lg:text-xl mb-2">{step.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {index < processSteps.length - 1 && (
                  <motion.div 
                    className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">الأسئلة الشائعة</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              إجابات سريعة على أكثر الأسئلة شيوعاً
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem 
                    value={`item-${index}`}
                    className="border-2 rounded-lg px-4 sm:px-6 hover:border-primary/50 transition-all bg-background"
                  >
                    <AccordionTrigger className="text-right text-sm sm:text-base font-semibold hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs sm:text-sm leading-relaxed pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section id="order-form" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-background dark:from-blue-950/20 dark:via-cyan-950/10 dark:to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                اطلب خدمة التدقيق اللغوي
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                املأ النموذج وسنتواصل معك في أقرب وقت لبدء العمل على مشروعك
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <EditingServiceForm
              serviceTitle="التدقيق اللغوي"
              serviceType="language-proofreading"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LanguageProofreading;
