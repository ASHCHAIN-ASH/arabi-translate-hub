import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Languages, CheckCircle, FileText, Search, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import { EditingServiceForm } from '@/components/editing/EditingServiceForm';

const LanguageProofreading = () => {
  const features = [
    { icon: <CheckCircle className="w-6 h-6" />, title: "تصحيح إملائي شامل", description: "مراجعة دقيقة لجميع الأخطاء الإملائية" },
    { icon: <FileText className="w-6 h-6" />, title: "مراجعة نحوية", description: "تدقيق القواعد النحوية والصرفية" },
    { icon: <Search className="w-6 h-6" />, title: "ضبط علامات الترقيم", description: "استخدام صحيح لعلامات الترقيم" },
    { icon: <Sparkles className="w-6 h-6" />, title: "تحسين الوضوح", description: "تعزيز وضوح النص وسلاسته" }
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

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-background"></div>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-6 py-3 rounded-full mb-6">
              <Languages className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-semibold">التدقيق اللغوي الاحترافي</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              تدقيق لغوي دقيق وشامل
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              نضمن لك نصاً خالياً من الأخطاء الإملائية والنحوية مع الحفاظ على أسلوبك الخاص
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">ما نقدمه لك</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">كيف نعمل معك؟</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-blue-500/20 mb-4">{step.number}</div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-6 h-0.5 bg-gradient-to-l from-blue-500 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">الأسئلة الشائعة</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">اطلب خدمة التدقيق اللغوي</h2>
            <p className="text-muted-foreground text-lg">املأ النموذج وسنبدأ فوراً</p>
          </div>
          <EditingServiceForm
            serviceTitle="التدقيق اللغوي"
            serviceType="language-proofreading"
          />
        </div>
      </section>
    </div>
  );
};

export default LanguageProofreading;
