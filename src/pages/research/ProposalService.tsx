import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ResearchServiceForm } from '@/components/research/ResearchServiceForm';
import { FileText, CheckCircle, Target, Lightbulb, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProposalService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-rose-500/10"></div>
        
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
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg"
            >
              <FileText className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              إعداد خطط البحث (Proposal)
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              نساعدك في إعداد مقترح بحثي متكامل واحترافي يضمن قبول فكرتك البحثية
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
            <h2 className="text-3xl font-bold text-center mb-12">مكونات خطة البحث</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: 'المشكلة والأهداف',
                  description: 'صياغة واضحة لمشكلة البحث وأهدافه'
                },
                {
                  icon: BookOpen,
                  title: 'الإطار النظري',
                  description: 'مراجعة أدبية شاملة للدراسات السابقة'
                },
                {
                  icon: Lightbulb,
                  title: 'المنهجية العلمية',
                  description: 'منهج بحث مناسب وأدوات جمع البيانات'
                },
                {
                  icon: Calendar,
                  title: 'الجدول الزمني',
                  description: 'خطة زمنية واقعية لإنجاز البحث'
                },
                {
                  icon: CheckCircle,
                  title: 'الأهمية والمساهمة',
                  description: 'توضيح أهمية البحث ومساهمته العلمية'
                },
                {
                  icon: FileText,
                  title: 'المراجع',
                  description: 'قائمة مراجع حديثة وموثوقة'
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
                    <feature.icon className="w-12 h-12 text-orange-600 mb-4" />
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
              <h2 className="text-3xl font-bold mb-6">ماذا تشمل خطة البحث؟</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <span>عنوان بحثي واضح ومحدد</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <span>صياغة مشكلة البحث وأسئلته وفرضياته</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <span>مراجعة أدبية شاملة للدراسات السابقة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <span>منهجية البحث وتصميمه التفصيلي</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <span>خطة زمنية واقعية لمراحل البحث</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <span>قائمة مراجع أولية حديثة</span>
                </li>
              </ul>
            </motion.div>

            <ResearchServiceForm 
              serviceTitle="إعداد خطط البحث (Proposal)"
              serviceType="proposal-writing"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
