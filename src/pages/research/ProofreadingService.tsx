import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { ProofreadingServiceForm } from '@/components/research/forms/ProofreadingServiceForm';
import { CheckCheck, CheckCircle, Edit, FileText, Search, Send, ArrowRight, Languages, Shield, Sparkles, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ProofreadingService() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10"></div>
        
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
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg"
            >
              <CheckCheck className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              التدقيق اللغوي والمراجعة
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              تدقيق لغوي ونحوي شامل لأبحاثك الأكاديمية لضمان خلوها من الأخطاء ورفع جودتها
            </p>
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
            <h2 className="text-3xl font-bold text-center mb-12">أنواع التدقيق التي نقدمها</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: 'التدقيق الإملائي',
                  description: 'مراجعة شاملة للأخطاء الإملائية والكتابية'
                },
                {
                  icon: Eye,
                  title: 'المراجعة النحوية',
                  description: 'فحص القواعد النحوية والصرفية بدقة'
                },
                {
                  icon: Sparkles,
                  title: 'تحسين الأسلوب',
                  description: 'رفع مستوى الصياغة الأكاديمية'
                },
                {
                  icon: Shield,
                  title: 'الانسيابية',
                  description: 'ضمان التناسق والترابط المنطقي'
                },
                {
                  icon: Languages,
                  title: 'دعم اللغتين',
                  description: 'تدقيق باللغة العربية والإنجليزية'
                },
                {
                  icon: Edit,
                  title: 'علامات الترقيم',
                  description: 'مراجعة دقيقة لعلامات الترقيم'
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
                    <feature.icon className="w-12 h-12 text-green-600 mb-4" />
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
              كيف نعمل على تدقيق بحثك؟
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: FileText, title: 'استلام الملف', desc: 'نستلم ملف بحثك للتدقيق', step: '01', color: 'from-green-500 to-emerald-500' },
                { icon: Search, title: 'الفحص الشامل', desc: 'فحص لغوي ونحوي دقيق', step: '02', color: 'from-emerald-500 to-teal-500' },
                { icon: Edit, title: 'التصحيح', desc: 'تصحيح الأخطاء وتحسين الأسلوب', step: '03', color: 'from-teal-500 to-cyan-500' },
                { icon: Send, title: 'التسليم', desc: 'تسليم البحث مع تقرير التدقيق', step: '04', color: 'from-cyan-500 to-blue-500' }
              ].map((item, index) => (
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
                        className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg mx-auto`}
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
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -translate-x-1/2" />
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
              <h2 className="text-3xl font-bold mb-8 text-center">خدمات التدقيق التي نقدمها</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'تدقيق إملائي شامل لجميع الأخطاء الإملائية والطباعية',
                  'مراجعة نحوية متقنة لضمان سلامة التراكيب اللغوية',
                  'تحسين الأسلوب الأكاديمي وجودة الصياغة العلمية',
                  'فحص الانسيابية والترابط المنطقي بين الفقرات',
                  'مراجعة علامات الترقيم واستخداماتها الصحيحة',
                  'تقرير مفصل بالتعديلات والملاحظات اللغوية'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-background rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
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
                    كم يستغرق تدقيق البحث؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    يعتمد على طول البحث، لكن عادة نحتاج من 2-5 أيام عمل للتدقيق الشامل.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    هل تدعمون اللغتين العربية والإنجليزية؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    نعم، نقدم خدمات التدقيق باللغتين العربية والإنجليزية بنفس الجودة العالية.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    ماذا لو احتجت مراجعة إضافية؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    نقدم جولة مراجعة إضافية مجانية لضمان رضاك الكامل عن جودة التدقيق.
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
              <ProofreadingServiceForm />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
