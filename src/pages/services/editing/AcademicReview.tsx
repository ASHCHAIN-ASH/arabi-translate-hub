import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileCheck, BookOpen, Award, Target, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { AuthCtaCard } from '@/components/research/AuthCtaCard';

const AcademicReview = () => {
  const features = [
    { icon: <BookOpen className="w-6 h-6" />, title: "مراجعة منهجية", description: "فحص المنهجية العلمية والبحثية" },
    { icon: <Target className="w-6 h-6" />, title: "تحسين البنية", description: "تحسين تنظيم وترتيب الأبحاث" },
    { icon: <FileCheck className="w-6 h-6" />, title: "ضبط المراجع", description: "مراجعة وتوثيق المراجع بدقة" },
    { icon: <Award className="w-6 h-6" />, title: "تقييم علمي", description: "تقييم شامل للمحتوى الأكاديمي" }
  ];

  const processSteps = [
    { number: "01", title: "تحليل البحث", description: "دراسة شاملة للبحث ومنهجيته" },
    { number: "02", title: "المراجعة العلمية", description: "مراجعة المحتوى والاستنتاجات" },
    { number: "03", title: "تحسين البنية", description: "تطوير تنظيم وترتيب الأقسام" },
    { number: "04", title: "التقرير النهائي", description: "تسليم البحث مع تقرير تفصيلي" }
  ];

  const faqs = [
    {
      question: "من يقوم بالمراجعة الأكاديمية؟",
      answer: "محررون أكاديميون متخصصون حاصلون على درجات علمية عليا في مجالات متنوعة."
    },
    {
      question: "هل تشمل المراجعة التوثيق والمراجع؟",
      answer: "نعم، نراجع جميع المراجع ونتأكد من صحة التوثيق حسب النمط المطلوب (APA, MLA, Chicago)."
    },
    {
      question: "كم تستغرق المراجعة الأكاديمية؟",
      answer: "تعتمد على حجم البحث، لكن عادة 7-10 أيام للرسائل الأكاديمية الكبيرة."
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <Breadcrumb items={[
        { label: 'خدمات التحرير', href: '/services/editing-services' },
        { label: 'المراجعة الأكاديمية' }
      ]} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-background"></div>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 px-6 py-3 rounded-full mb-6">
              <FileCheck className="w-5 h-5 text-purple-600" />
              <span className="text-purple-600 font-semibold">المراجعة الأكاديمية المتخصصة</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              مراجعة أكاديمية شاملة ومتخصصة
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              نراجع أبحاثكم الأكاديمية بدقة عالية لضمان جودة المحتوى والمنهجية العلمية
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
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-4">
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
                    <div className="text-4xl font-bold text-purple-500/20 mb-4">{step.number}</div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-6 h-0.5 bg-gradient-to-l from-purple-500 to-transparent"></div>
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
            <h2 className="text-4xl font-bold mb-4">اطلب خدمة المراجعة الأكاديمية</h2>
            <p className="text-muted-foreground text-lg">املأ النموذج وسنبدأ فوراً</p>
          </div>
          <AuthCtaCard serviceTitle="المراجعة الأكاديمية" />
        </div>
      </section>
    </div>
  );
};

export default AcademicReview;
