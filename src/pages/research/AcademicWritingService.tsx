import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { AuthCtaCard } from '@/components/research/AuthCtaCard';
import { BookOpenCheck, CheckCircle, Clock, Shield, Users, Award, ArrowRight, FileText, Search, Edit, Send, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AcademicAssistanceDisclaimer } from '@/components/AcademicAssistanceDisclaimer';

export default function AcademicWritingService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <FloatingWhatsAppButton />
      
      {/* Back Button */}
      <div className="container px-4 mx-auto pt-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2 hover:gap-3 transition-all"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          رجوع
        </Button>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10"></div>
        
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg"
            >
              <BookOpenCheck className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              المساعدة الأكاديمية في إعداد الأبحاث الجامعية
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              نقدم لك دعماً أكاديمياً احترافياً وإرشاداً علمياً متخصصاً لإعداد بحثك الجامعي بجودة عالية وفق المعايير الأكاديمية العالمية
            </p>

            <div className="max-w-3xl mx-auto">
              <AcademicAssistanceDisclaimer />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">لماذا تختار خدمتنا؟</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: 'جودة مضمونة',
                  description: 'دعم بحثي بأعلى معايير الجودة الأكاديمية'
                },
                {
                  icon: Clock,
                  title: 'التزام بالمواعيد',
                  description: 'نسلّم المخرجات في المواعيد المتفق عليها'
                },
                {
                  icon: Shield,
                  title: 'أصالة وخصوصية',
                  description: 'محتوى أصلي 100% وسرية تامة للمعلومات'
                },
                {
                  icon: Users,
                  title: 'فريق متخصص',
                  description: 'خبراء أكاديميون في مختلف التخصصات'
                },
                {
                  icon: Award,
                  title: 'مراجع محدثة',
                  description: 'استخدام أحدث المراجع العلمية والدراسات'
                },
                {
                  icon: BookOpenCheck,
                  title: 'توثيق احترافي',
                  description: 'توثيق وفقاً لأنظمة APA, MLA, Harvard'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm">
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              كيف نعمل معك؟
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: FileText, title: 'استلام الطلب', desc: 'نستلم تفاصيل بحثك ومتطلباتك', step: '01' },
                { icon: Search, title: 'البحث والجمع', desc: 'جمع المصادر والمراجع العلمية', step: '02' },
                { icon: Edit, title: 'الإعداد والمراجعة', desc: 'إعداد المحتوى ومراجعته أكاديمياً', step: '03' },
                { icon: Send, title: 'التسليم والإرشاد', desc: 'تسليم المخرجات مع توجيه إرشادي', step: '04' }
              ].reverse().map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg mx-auto"
                      >
                        <item.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 right-full w-full h-0.5 bg-gradient-to-l from-primary to-transparent translate-x-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">ما نقدمه لك</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'دعم في إعداد بحث علمي متكامل (المقدمة، الإطار النظري، المنهجية، التحليل، النتائج)',
                  'تزويدك بمراجع علمية موثوقة ومحدثة',
                  'إرشاد لتوثيق المراجع وفقاً للنظام المطلوب (APA, MLA, Harvard)',
                  'فحص الانتحال العلمي (Plagiarism Check)',
                  'تنسيق أكاديمي احترافي',
                  'مراجعات مجانية حتى رضاك التام'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-background rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">الأسئلة الشائعة</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    ما هي المدة المتوقعة لإنجاز البحث؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    تعتمد المدة على حجم البحث وتعقيده، لكن عادة تتراوح بين 7-14 يوم عمل. نلتزم بتسليم بحثك في الموعد المتفق عليه.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    هل تقدمون مراجعات مجانية؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    نعم، نقدم مراجعات مجانية حتى رضاك التام. نحن ملتزمون بجودة العمل ورضا عملائنا.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    ما أنظمة التوثيق التي تدعمونها؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    ندعم جميع أنظمة التوثيق الأكاديمية مثل APA, MLA, Harvard, Chicago وغيرها حسب متطلبات جامعتك.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    هل تضمنون أصالة المحتوى؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    بالتأكيد، جميع أبحاثنا أصلية 100% ونقدم تقرير فحص الانتحال (Turnitin) مع كل بحث.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <AcademicAssistanceDisclaimer className="mb-6" />
              <AuthCtaCard serviceTitle="المساعدة الأكاديمية في إعداد الأبحاث الجامعية" />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
