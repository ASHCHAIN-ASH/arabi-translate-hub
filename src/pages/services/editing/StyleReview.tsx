import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Feather, Eye, Sparkles, ArrowLeft, Zap } from 'lucide-react';
import Header from '@/components/Header';
import { EditingServiceForm } from '@/components/editing/EditingServiceForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StyleReview = () => {
  const navigate = useNavigate();
  
  const features = [
    { icon: Feather, title: "تحسين التدفق", description: "تحسين انسيابية النص وسلاسته", color: "from-indigo-500 to-purple-500" },
    { icon: BookOpen, title: "توحيد الأسلوب", description: "اتساق الأسلوب في جميع الأقسام", color: "from-purple-500 to-pink-500" },
    { icon: Eye, title: "تعزيز الوضوح", description: "جعل النص أكثر وضوحاً وفهماً", color: "from-pink-500 to-rose-500" },
    { icon: Sparkles, title: "صقل اللغة", description: "تحسين جودة اللغة والتعبير", color: "from-violet-500 to-indigo-500" }
  ];

  const processSteps = [
    { number: "01", title: "قراءة شاملة", description: "قراءة كاملة للنص وتحديد نقاط التحسين" },
    { number: "02", title: "تحليل الأسلوب", description: "تقييم الأسلوب الكتابي العام" },
    { number: "03", title: "التحسين", description: "تطبيق التحسينات الأسلوبية" },
    { number: "04", title: "المراجعة النهائية", description: "مراجعة نهائية للتأكد من الاتساق" }
  ];

  const faqs = [
    {
      question: "هل يتغير أسلوبي الكتابي؟",
      answer: "نحافظ على صوتك الكتابي الخاص ونحسّنه فقط لجعله أكثر وضوحاً وفعالية."
    },
    {
      question: "ما الفرق بين مراجعة الأسلوب والتحرير التنموي؟",
      answer: "مراجعة الأسلوب تركز على التعبير اللغوي، بينما التحرير التنموي يشمل البنية والأفكار أيضاً."
    },
    {
      question: "كم تستغرق مراجعة الأسلوب؟",
      answer: "عادة 5-7 أيام عمل حسب طول النص ومستوى التحسين المطلوب."
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-background"></div>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 px-6 py-3 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 font-semibold">مراجعة الأسلوب الاحترافية</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              أسلوب كتابي متميز وجذاب
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              نحسّن أسلوبكم الكتابي لجعل نصوصكم أكثر وضوحاً، جاذبية، وتأثيراً
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">ما نقدمه لك</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
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
                    <div className="text-4xl font-bold text-indigo-500/20 mb-4">{step.number}</div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-6 h-0.5 bg-gradient-to-l from-indigo-500 to-transparent"></div>
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
            <h2 className="text-4xl font-bold mb-4">اطلب خدمة مراجعة الأسلوب</h2>
            <p className="text-muted-foreground text-lg">املأ النموذج وسنبدأ فوراً</p>
          </div>
          <EditingServiceForm
            serviceTitle="مراجعة الأسلوب"
            serviceType="style-review"
            documentTypes={['مقال', 'كتاب', 'رواية', 'محتوى تسويقي', 'بحث', 'تقرير']}
          />
        </div>
      </section>
    </div>
  );
};

export default StyleReview;
