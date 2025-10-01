import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { ResearchServiceForm } from '@/components/research/ResearchServiceForm';
import { MessageSquareMore, CheckCircle, Lightbulb, Users, HeartHandshake, TrendingUp, ArrowRight, Phone, Video, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ConsultationService() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10"></div>
        
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
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl shadow-lg"
            >
              <MessageSquareMore className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              الاستشارات الأكاديمية
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              استشارات متخصصة من خبراء أكاديميين في جميع مراحل البحث العلمي
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
            <h2 className="text-3xl font-bold text-center mb-12">مجالات الاستشارات</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Lightbulb,
                  title: 'اختيار الموضوع',
                  description: 'مساعدتك في اختيار موضوع بحثي مناسب'
                },
                {
                  icon: Users,
                  title: 'توجيه علمي',
                  description: 'إرشاد أكاديمي طوال مسيرتك البحثية'
                },
                {
                  icon: TrendingUp,
                  title: 'تطوير المنهجية',
                  description: 'تصميم منهجية بحث قوية ومناسبة'
                },
                {
                  icon: CheckCircle,
                  title: 'حلول عملية',
                  description: 'حلول فورية للتحديات البحثية'
                },
                {
                  icon: HeartHandshake,
                  title: 'دعم مستمر',
                  description: 'متابعة دورية ودعم على مدار البحث'
                },
                {
                  icon: MessageSquareMore,
                  title: 'استشارات مخصصة',
                  description: 'جلسات استشارية حسب احتياجاتك'
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
                    <feature.icon className="w-12 h-12 text-amber-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consultation Methods */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              طرق التواصل للاستشارات
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Video, title: 'جلسات فيديو', desc: 'جلسات مباشرة عبر الفيديو لمناقشة تفصيلية' },
                { icon: Phone, title: 'مكالمات هاتفية', desc: 'استشارات سريعة عبر المكالمات الصوتية' },
                { icon: MessageCircle, title: 'محادثات نصية', desc: 'تواصل مستمر عبر الرسائل النصية' }
              ].reverse().map((item, index) => (
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
                    className="w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-6"
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
              <h2 className="text-3xl font-bold mb-8 text-center">ما نقدمه في الاستشارات</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'جلسات استشارية مباشرة مع خبراء أكاديميين متخصصين',
                  'مساعدة في اختيار الموضوع البحثي والمنهجية المناسبة',
                  'توجيه علمي في تصميم أدوات البحث وجمع البيانات',
                  'حلول عملية وفورية للتحديات والمشاكل البحثية',
                  'نصائح مهنية لتحسين جودة البحث وزيادة فرص النجاح',
                  'متابعة دورية ودعم مستمر طوال مسيرتك البحثية'
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
                    <CheckCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
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
                    كم تستغرق الجلسة الاستشارية؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    عادة تستغرق الجلسة من 30-60 دقيقة حسب الموضوع والاحتياجات. يمكنك حجز جلسات إضافية عند الحاجة.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    هل يمكن حجز أكثر من جلسة؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    بالتأكيد! نوفر باقات استشارية متعددة، ويمكنك حجز جلسات دورية طوال فترة بحثك.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-background rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    من هم المستشارون الأكاديميون؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    فريقنا من أساتذة جامعيين وحاملي درجات الدكتوراه المتخصصين في مختلف المجالات الأكاديمية.
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
                serviceTitle="الاستشارات الأكاديمية"
                serviceType="consultation"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
