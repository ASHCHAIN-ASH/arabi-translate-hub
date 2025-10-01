import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ResearchServiceForm } from '@/components/research/ResearchServiceForm';
import { ShieldCheck, CheckCircle, Eye, Award, FileSearch, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PaperReviewService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-purple-500/10"></div>
        
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
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl shadow-lg"
            >
              <ShieldCheck className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              مراجعات أكاديمية للأوراق قبل النشر
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              مراجعة شاملة واحترافية لأوراقك العلمية لضمان جاهزيتها للنشر في المجلات المحكمة
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
            <h2 className="text-3xl font-bold text-center mb-12">ما نراجعه في الورقة العلمية</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: FileSearch,
                  title: 'البنية والتنظيم',
                  description: 'مراجعة هيكل الورقة وتسلسل الأفكار'
                },
                {
                  icon: Eye,
                  title: 'الجودة العلمية',
                  description: 'تقييم المنهجية والنتائج والاستنتاجات'
                },
                {
                  icon: Target,
                  title: 'توافق المعايير',
                  description: 'التأكد من مطابقة شروط المجلة المستهدفة'
                },
                {
                  icon: CheckCircle,
                  title: 'اللغة والأسلوب',
                  description: 'مراجعة لغوية وتحسين الصياغة الأكاديمية'
                },
                {
                  icon: Award,
                  title: 'المراجع والاقتباسات',
                  description: 'فحص التوثيق ودقة المراجع'
                },
                {
                  icon: ShieldCheck,
                  title: 'الأصالة',
                  description: 'فحص الانتحال وضمان الأصالة العلمية'
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
                    <feature.icon className="w-12 h-12 text-rose-600 mb-4" />
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
              <h2 className="text-3xl font-bold mb-6">خدمة المراجعة تشمل</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-rose-600 mt-1 flex-shrink-0" />
                  <span>تقييم شامل لجودة الورقة العلمية</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-rose-600 mt-1 flex-shrink-0" />
                  <span>مراجعة المنهجية وأدوات البحث</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-rose-600 mt-1 flex-shrink-0" />
                  <span>فحص التوثيق ودقة الاقتباسات</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-rose-600 mt-1 flex-shrink-0" />
                  <span>تدقيق لغوي وأسلوبي متقدم</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-rose-600 mt-1 flex-shrink-0" />
                  <span>اقتراحات لتحسين الجودة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-rose-600 mt-1 flex-shrink-0" />
                  <span>تقرير مفصل بالملاحظات والتوصيات</span>
                </li>
              </ul>
            </motion.div>

            <ResearchServiceForm 
              serviceTitle="مراجعات أكاديمية للأوراق قبل النشر"
              serviceType="paper-review"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
