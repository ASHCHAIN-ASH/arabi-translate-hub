import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { ProofreadingServiceForm } from '@/components/research/forms/ProofreadingServiceForm';
import { CheckCheck, CheckCircle, FileCheck, Globe, Clock, Shield, ArrowRight, Sparkles, Eye, Languages } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)',
              backgroundSize: '100% 100%',
            }}
          />
        </div>
        
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.8 
              }}
              className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
              />
              <CheckCheck className="w-12 h-12 md:w-14 md:h-14 text-white relative z-10" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent"
            >
              التدقيق اللغوي والمراجعة الأكاديمية
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
            >
              تدقيق لغوي شامل ومراجعة أكاديمية دقيقة لضمان خلو بحثك من الأخطاء
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {[
                { icon: Sparkles, text: 'دقة عالية' },
                { icon: Clock, text: 'سريع' },
                { icon: Shield, text: 'موثوق' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                >
                  <item.icon className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
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
            <h2 className="text-3xl font-bold text-center mb-12">ماذا يشمل التدقيق؟</h2>
            
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
                  description: 'تطوير الصياغة والأسلوب الأكاديمي'
                },
                {
                  icon: Languages,
                  title: 'الاتساق اللغوي',
                  description: 'ضمان اتساق المصطلحات والأسلوب'
                },
                {
                  icon: FileCheck,
                  title: 'فحص الانسيابية',
                  description: 'تحسين تدفق الأفكار والربط بين الفقرات'
                },
                {
                  icon: Globe,
                  title: 'مراجعة الاقتباسات',
                  description: 'التأكد من صحة الاقتباسات والتوثيق'
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
                    <feature.icon className="w-12 h-12 text-emerald-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none dark:prose-invert mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">خدماتنا في التدقيق</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>تدقيق لغوي شامل لجميع أجزاء البحث</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>مراجعة القواعد النحوية والصرفية</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>تحسين الصياغة والأسلوب الأكاديمي</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>ضمان الاتساق اللغوي والمصطلحات</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>مراجعة علامات الترقيم والتنسيق</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>تقرير مفصل بالملاحظات والتعديلات</span>
                </li>
              </ul>
            </motion.div>

            <ProofreadingServiceForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
