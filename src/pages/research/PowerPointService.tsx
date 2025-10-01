import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { ResearchServiceForm } from '@/components/research/ResearchServiceForm';
import { Presentation, CheckCircle, Palette, Layout, Image, Sparkles, ArrowRight, Wand2, Monitor, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PowerPointService() {
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

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10"></div>
        
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
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl shadow-lg"
            >
              <Presentation className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              إعداد عروض PowerPoint أكاديمية
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              تصميم عروض تقديمية احترافية ومميزة لأبحاثك الأكاديمية ومناقشاتك
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">مميزات عروضنا التقديمية</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Palette,
                  title: 'تصميم احترافي',
                  description: 'تصاميم عصرية وجذابة تناسب المجال الأكاديمي'
                },
                {
                  icon: Layout,
                  title: 'محتوى منظم',
                  description: 'ترتيب منطقي للأفكار والمعلومات'
                },
                {
                  icon: Image,
                  title: 'رسوم توضيحية',
                  description: 'أيقونات ورسوم بيانية احترافية'
                },
                {
                  icon: Sparkles,
                  title: 'انتقالات سلسة',
                  description: 'حركات وانتقالات أنيقة بين الشرائح'
                },
                {
                  icon: CheckCircle,
                  title: 'جاهز للعرض',
                  description: 'ملف كامل جاهز للتقديم والمناقشة'
                },
                {
                  icon: Presentation,
                  title: 'متوافق مع جميع الأجهزة',
                  description: 'يعمل على كل برامج العرض'
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
                    <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              خطوات إعداد العرض التقديمي
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Wand2, title: 'التصميم الأولي', desc: 'نصمم مخطط أولي للعرض بناءً على محتوى بحثك' },
                { icon: Palette, title: 'التنسيق والألوان', desc: 'نضيف تصميم احترافي متناسق مع هوية بحثك' },
                { icon: Monitor, title: 'المراجعة والتسليم', desc: 'مراجعة نهائية وتسليم العرض جاهزاً للتقديم' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-6"
                  >
                    <item.icon className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">محتويات العرض التقديمي</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'تصميم شرائح احترافية بهوية بصرية متسقة',
                  'تلخيص المحتوى البحثي بطريقة مبسطة ومفهومة',
                  'رسوم بيانية ملونة وجداول منسقة بشكل احترافي',
                  'أيقونات توضيحية حديثة تدعم الفهم البصري',
                  'انتقالات وحركات سلسة وأنيقة بين الشرائح',
                  'ملاحظات للمتحدث على كل شريحة لتسهيل العرض'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start gap-3 p-4 bg-background rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <CheckCircle className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" />
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
                    كم عدد الشرائح المتوقع في العرض؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    يعتمد عدد الشرائح على حجم ومحتوى بحثك، لكن عادة يتراوح بين 15-30 شريحة للبحث الجامعي.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    هل يمكنني التعديل على التصميم؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    بالتأكيد! نقدم لك الملف القابل للتعديل، ونوفر جولة تعديلات مجانية لضمان رضاك.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    ما الصيغة النهائية للعرض؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    نسلمك العرض بصيغة PowerPoint (.pptx) القابلة للتعديل، وأيضاً بصيغة PDF للعرض النهائي.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ResearchServiceForm 
                serviceTitle="إعداد عروض PowerPoint أكاديمية"
                serviceType="powerpoint"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
