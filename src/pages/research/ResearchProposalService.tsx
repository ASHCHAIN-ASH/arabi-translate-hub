import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { ScrollText, CheckCircle, ArrowRight, Lightbulb, Target, BookOpen, Award, Users, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/data/legacy/client';

import Footer from '@/components/Footer';
import AuthCtaCard from "@/components/research/AuthCtaCard";
export default function ResearchProposalService() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    details: ''
  });

  const whatsappNumbers = [
    { number: '0593799355', label: 'واتساب' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-student-service-order', {
        body: {
          ...formData,
          serviceTitle: 'إعداد خطة بحث',
          serviceType: 'research-proposal'
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الطلب بنجاح",
        description: "سنتواصل معك قريباً",
      });

      setFormData({ fullName: '', email: '', phone: '', specialization: '', details: '' });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <FloatingWhatsAppButton />
      
      <div className="container px-4 mx-auto pt-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 hover:gap-3 transition-all">
          <ArrowRight className="w-4 h-4 rotate-180" />
          رجوع
        </Button>
      </div>
      
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-600/10"></div>
        
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg"
            >
              <ScrollText className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              إعداد خطة بحث
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              صياغة خطط بحثية متكاملة ومعتمدة وفق المعايير الأكاديمية العالمية
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">ما نقدمه في إعداد خطة البحث</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: Lightbulb, title: 'اختيار الموضوع', description: 'مساعدة في اختيار موضوع بحثي مناسب' },
                { icon: Target, title: 'أهداف واضحة', description: 'صياغة أهداف بحثية دقيقة وقابلة للقياس' },
                { icon: BookOpen, title: 'إطار نظري', description: 'بناء إطار نظري قوي ومتكامل' },
                { icon: Award, title: 'منهجية علمية', description: 'تصميم منهجية بحث احترافية' },
                { icon: Users, title: 'خبراء متخصصون', description: 'فريق من الأكاديميين المتميزين' },
                { icon: Clock, title: 'تسليم سريع', description: 'التزام تام بالمواعيد المحددة' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-4 md:p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm">
                    <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-orange-600 mb-3 md:mb-4" />
                    <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">كيف نساعدك في إعداد خطة البحث؟</h2>
            
            <div className="space-y-4 md:space-y-6">
              {[
                { step: '1', title: 'استشارة أولية', description: 'نتعرف على موضوعك وأهدافك البحثية' },
                { step: '2', title: 'تحديد الإطار', description: 'نحدد الإطار النظري والمنهجية المناسبة' },
                { step: '3', title: 'صياغة الخطة', description: 'نصيغ خطة بحث متكاملة وفق المعايير الأكاديمية' },
                { step: '4', title: 'المراجعة والتسليم', description: 'مراجعة نهائية وتسليم الخطة جاهزة للتقديم' }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="flex gap-3 md:gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{step.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 md:p-10 rounded-2xl md:rounded-3xl border-2 border-green-300 mb-8 md:mb-12 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.784 23.456l4.568-1.455A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.149 0-4.16-.68-5.805-1.837l-.416-.268-3.124.996.998-3.064-.294-.431A9.918 9.918 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#25D366"/>
                  </svg>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  للتواصل الفوري عبر واتساب
                </h3>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="hidden sm:block"
                >
                  <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.784 23.456l4.568-1.455A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.149 0-4.16-.68-5.805-1.837l-.416-.268-3.124.996.998-3.064-.294-.431A9.918 9.918 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#25D366"/>
                  </svg>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {whatsappNumbers.map((contact, index) => (
                  <motion.a
                    key={index}
                    href={`https://wa.me/966${contact.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                        animate={{
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm opacity-90 mb-1">{contact.label}</p>
                          <p className="text-xl md:text-2xl font-bold tracking-wider">
                            {contact.number}
                          </p>
                        </div>
                        
                        <motion.div
                          animate={{ 
                            x: [0, 5, 0],
                            rotate: [0, 10, 0]
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.784 23.456l4.568-1.455A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.149 0-4.16-.68-5.805-1.837l-.416-.268-3.124.996.998-3.064-.294-.431A9.918 9.918 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="white"/>
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
              
              <p className="text-center text-muted-foreground mt-4 md:mt-6 text-xs md:text-sm">
                اضغط على الرقم للتواصل المباشر عبر الواتساب
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card className="p-6 md:p-8 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">اطلب الخدمة الآن</h2>
                <p className="text-center text-muted-foreground mb-6 text-sm md:text-base">
                  املأ النموذج وسنتواصل معك عبر الواتساب لإرفاق الملفات
                </p>
                <AuthCtaCard serviceTitle="خطة البحث" />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

          <Footer />
    </div>
  );
}
