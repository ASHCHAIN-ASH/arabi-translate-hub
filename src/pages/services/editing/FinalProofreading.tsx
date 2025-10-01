import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCheck, Shield, Eye, Target } from 'lucide-react';
import Header from '@/components/Header';
import { EditingServiceForm } from '@/components/editing/EditingServiceForm';

const FinalProofreading = () => {
  const features = [
    { icon: <CheckCheck className="w-6 h-6" />, title: "فحص شامل", description: "مراجعة نهائية لجميع جوانب النص" },
    { icon: <Shield className="w-6 h-6" />, title: "ضمان الجودة", description: "التأكد من خلو النص من الأخطاء" },
    { icon: <Eye className="w-6 h-6" />, title: "دقة عالية", description: "فحص دقيق لأدق التفاصيل" },
    { icon: <Target className="w-6 h-6" />, title: "جاهز للنشر", description: "نص جاهز تماماً للنشر أو التسليم" }
  ];

  const processSteps = [
    { number: "01", title: "المراجعة الأولية", description: "قراءة شاملة للنص" },
    { number: "02", title: "الفحص التفصيلي", description: "فحص دقيق لكل عنصر" },
    { number: "03", title: "التدقيق النهائي", description: "مراجعة أخيرة شاملة" },
    { number: "04", title: "شهادة الجودة", description: "تسليم مع شهادة ضمان الجودة" }
  ];

  const faqs = [
    {
      question: "متى أحتاج للتدقيق النهائي؟",
      answer: "قبل النشر النهائي أو التسليم الرسمي لأي نص مهم أو وثيقة رسمية."
    },
    {
      question: "هل التدقيق النهائي يغني عن التحرير؟",
      answer: "لا، التدقيق النهائي يأتي بعد التحرير كمرحلة أخيرة للتأكد من الجودة."
    },
    {
      question: "كم تستغرق عملية التدقيق النهائي؟",
      answer: "عادة 2-4 أيام عمل حسب طول النص."
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-background"></div>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-teal-500/10 px-6 py-3 rounded-full mb-6">
              <CheckCheck className="w-5 h-5 text-teal-600" />
              <span className="text-teal-600 font-semibold">التدقيق النهائي قبل النشر</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              مراجعة نهائية شاملة ودقيقة
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              آخر خطوة قبل النشر - نضمن لك نصاً خالياً من الأخطاء وجاهزاً بنسبة 100%
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
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-4">
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
                    <div className="text-4xl font-bold text-teal-500/20 mb-4">{step.number}</div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-6 h-0.5 bg-gradient-to-l from-teal-500 to-transparent"></div>
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
            <h2 className="text-4xl font-bold mb-4">اطلب خدمة التدقيق النهائي</h2>
            <p className="text-muted-foreground text-lg">املأ النموذج وسنبدأ فوراً</p>
          </div>
          <EditingServiceForm
            serviceTitle="التدقيق النهائي"
            serviceType="final-proofreading"
            documentTypes={['كتاب للنشر', 'أطروحة نهائية', 'مقال للنشر', 'تقرير رسمي', 'وثيقة قانونية']}
          />
        </div>
      </section>
    </div>
  );
};

export default FinalProofreading;
