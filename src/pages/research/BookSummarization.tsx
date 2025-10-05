import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { BookOpen, CheckCircle, ArrowRight, FileText, Users, Award, Clock, MessageSquare, Target, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function BookSummarization() {
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
    { number: '0500776343', label: 'واتساب 1' },
    { number: '0559600824', label: 'واتساب 2' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-student-service-order', {
        body: {
          ...formData,
          serviceTitle: 'تلخيص الكتب والمراجع',
          serviceType: 'book-summarization'
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
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/30 dark:via-blue-950/10 to-background">
      <Header />
      <FloatingWhatsAppButton />
      
      <div className="container px-4 mx-auto pt-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 hover:gap-3 transition-all group">
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:scale-110 transition-transform" />
            <span>رجوع</span>
          </Button>
        </motion.div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10"></div>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-flex items-center justify-center w-24 h-24 mb-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-2xl"
            >
              <BookOpen className="w-14 h-14 text-white" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent"
            >
              تلخيص الكتب والمراجع
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
            >
              خدمة تلخيص احترافية ودقيقة للكتب والمراجع العلمية توفر عليك الوقت والجهد
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6"
            >
              {[
                { icon: Sparkles, text: 'تلخيص دقيق' },
                { icon: Award, text: 'جودة مضمونة' },
                { icon: Clock, text: 'تسليم سريع' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-white/80 dark:bg-card/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg border border-blue-200 dark:border-blue-800"
                >
                  <item.icon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-sm">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">ما نقدمه في خدمة التلخيص</h2>
              <p className="text-xl text-muted-foreground">مميزات تجعلنا الخيار الأمثل لتلخيص مراجعك الأكاديمية</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: FileText, 
                  title: 'تلخيص شامل ومتكامل', 
                  description: 'نغطي جميع النقاط الرئيسية والأفكار المحورية بدقة عالية',
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  icon: Users, 
                  title: 'خبراء متخصصون', 
                  description: 'فريق من الأكاديميين المؤهلين في مختلف التخصصات العلمية',
                  color: 'from-purple-500 to-pink-500'
                },
                { 
                  icon: Award, 
                  title: 'جودة أكاديمية عالية', 
                  description: 'تلخيص احترافي يلتزم بالمعايير والأساليب الأكاديمية المعتمدة',
                  color: 'from-green-500 to-emerald-500'
                },
                { 
                  icon: Clock, 
                  title: 'التزام بالمواعيد', 
                  description: 'نحرص على تسليم العمل في الموعد المحدد دون تأخير',
                  color: 'from-orange-500 to-red-500'
                },
                { 
                  icon: CheckCircle, 
                  title: 'مراجعة شاملة', 
                  description: 'مراجعة دقيقة للتلخيص قبل التسليم لضمان الجودة',
                  color: 'from-teal-500 to-cyan-500'
                },
                { 
                  icon: MessageSquare, 
                  title: 'دعم متواصل', 
                  description: 'متابعة ودعم فني على مدار الساعة للإجابة على استفساراتك',
                  color: 'from-indigo-500 to-purple-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="p-8 h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm relative overflow-hidden">
                    <motion.div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${feature.color} transition-opacity duration-500`}
                    />
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="container px-4 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <span className="text-7xl">📚</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                كيف نساعدك في تلخيص الكتب؟
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                نتبع منهجية علمية مدروسة لتقديم تلخيص احترافي يوفر عليك الوقت والجهد
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-16">
              {[
                {
                  icon: '🔍',
                  title: 'قراءة تحليلية متعمقة',
                  description: 'نقرأ المرجع بدقة ونحلل محتواه لفهم النقاط الرئيسية والأفكار الأساسية بشكل شامل',
                  number: '01'
                },
                {
                  icon: '✏️',
                  title: 'استخلاص النقاط الهامة',
                  description: 'نحدد المعلومات الأساسية والنقاط الحرجة التي يجب تضمينها في التلخيص النهائي',
                  number: '02'
                },
                {
                  icon: '📝',
                  title: 'صياغة احترافية',
                  description: 'نعيد صياغة المحتوى بأسلوب أكاديمي واضح مع الحفاظ على المعنى والسياق الأصلي',
                  number: '03'
                },
                {
                  icon: '✅',
                  title: 'مراجعة ومطابقة',
                  description: 'نراجع التلخيص بدقة ونتأكد من مطابقته للمصدر الأصلي والمعايير الأكاديمية',
                  number: '04'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="relative"
                >
                  <Card className="p-8 h-full bg-white dark:bg-card backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-6xl font-bold text-blue-100 dark:text-blue-900/30">{step.number}</div>
                    <div className="flex items-start gap-6 relative z-10">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                        className="text-6xl flex-shrink-0"
                      >
                        {step.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                  {index < 3 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.4 }}
                      className="hidden md:block absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-4xl z-20"
                    >
                      ⬇️
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                    'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
                    'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <motion.span 
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="text-5xl"
                  >
                    🎯
                  </motion.span>
                  <h3 className="text-3xl md:text-4xl font-bold">أنواع المراجع التي نلخصها</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  {[
                    'كتب أكاديمية', 
                    'أبحاث علمية', 
                    'مقالات محكمة', 
                    'دراسات سابقة', 
                    'رسائل ماجستير ودكتوراه', 
                    'تقارير فنية'
                  ].map((type, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl text-center font-bold border-2 border-white/30 shadow-lg cursor-default"
                    >
                      {type}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-12 rounded-3xl border-2 border-green-300 dark:border-green-700 mb-16 shadow-2xl relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                style={{
                  backgroundImage: 'linear-gradient(60deg, #25D366 0%, #128C7E 100%)',
                  backgroundSize: '200% 200%',
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-8">
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
                    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.784 23.456l4.568-1.455A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.149 0-4.16-.68-5.805-1.837l-.416-.268-3.124.996.998-3.064-.294-.431A9.918 9.918 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#25D366"/>
                    </svg>
                  </motion.div>
                  <h3 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
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
                  >
                    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.784 23.456l4.568-1.455A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.149 0-4.16-.68-5.805-1.837l-.416-.268-3.124.996.998-3.064-.294-.431A9.918 9.918 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#25D366"/>
                    </svg>
                  </motion.div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
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
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
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
                            <p className="text-sm opacity-90 mb-2">{contact.label}</p>
                            <p className="text-3xl font-bold tracking-wider">
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
                            <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/>
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.784 23.456l4.568-1.455A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.149 0-4.16-.68-5.805-1.837l-.416-.268-3.124.996.998-3.064-.294-.431A9.918 9.918 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="white"/>
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-muted-foreground mt-6 text-base"
                >
                  اضغط على الرقم للتواصل المباشر عبر الواتساب
                </motion.p>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-10 shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="inline-block mb-4"
                  >
                    <Target className="w-16 h-16 text-primary" />
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    اطلب الخدمة الآن
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    املأ النموذج وسنتواصل معك عبر الواتساب لإرفاق الملفات
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="fullName" className="text-base">الاسم الكامل *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="mt-2 h-12"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="email" className="text-base">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-2 h-12"
                        placeholder="example@email.com"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="phone" className="text-base">رقم الجوال *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="mt-2 h-12"
                        placeholder="05xxxxxxxx"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="specialization" className="text-base">التخصص أو المادة</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="mt-2 h-12"
                      placeholder="مثال: إدارة أعمال، علم نفس، ..."
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="details" className="text-base">تفاصيل الكتاب أو المرجع المطلوب تلخيصه *</Label>
                    <Textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      required
                      rows={6}
                      className="mt-2"
                      placeholder="يرجى ذكر اسم الكتاب، المؤلف، عدد الصفحات المطلوب تلخيصها، الموعد النهائي، وأي تفاصيل أخرى مهمة..."
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-3 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl"
                    >
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                        <strong>ملاحظة هامة:</strong> إرفاق الملفات والمستندات سيتم عبر الواتساب بعد إرسال الطلب
                      </p>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-7 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          جاري الإرسال...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          إرسال الطلب
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}