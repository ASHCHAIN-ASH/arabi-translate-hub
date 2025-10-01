import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ResearchServiceForm } from '@/components/research/ResearchServiceForm';
import { BookOpenCheck, CheckCircle, Clock, Shield, Users, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AcademicWritingService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
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
              مساعدة في كتابة الأبحاث الجامعية
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              نقدم لك خدمة احترافية في كتابة الأبحاث الجامعية بجودة عالية تتوافق مع المعايير الأكاديمية العالمية
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
            <h2 className="text-3xl font-bold text-center mb-12">لماذا تختار خدمتنا؟</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: 'جودة مضمونة',
                  description: 'نضمن لك بحثاً علمياً موثقاً بأعلى معايير الجودة'
                },
                {
                  icon: Clock,
                  title: 'تسليم في الموعد',
                  description: 'نلتزم بالمواعيد المحددة دون تأخير'
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

      {/* Service Details */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none dark:prose-invert mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">ما نقدمه لك</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <span>كتابة بحث علمي متكامل (المقدمة، الإطار النظري، المنهجية، التحليل، النتائج)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <span>استخدام مراجع علمية موثوقة ومحدثة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <span>توثيق المراجع وفقاً للنظام المطلوب</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <span>فحص الانتحال العلمي (Plagiarism Check)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <span>تنسيق أكاديمي احترافي</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <span>مراجعات مجانية حتى رضاك التام</span>
                </li>
              </ul>
            </motion.div>

            {/* Form Section */}
            <ResearchServiceForm 
              serviceTitle="مساعدة في كتابة الأبحاث الجامعية"
              serviceType="academic-writing"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
