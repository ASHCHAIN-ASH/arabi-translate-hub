import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ResearchServiceForm } from '@/components/research/ResearchServiceForm';
import { MessageSquareMore, CheckCircle, Lightbulb, Users, HeartHandshake, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ConsultationService() {
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

      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none dark:prose-invert mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">ما نقدمه في الاستشارات</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>جلسات استشارية مباشرة مع خبراء متخصصين</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>مساعدة في اختيار الموضوع والمنهجية</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>توجيه في تصميم أدوات البحث</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>حلول للتحديات والمشاكل البحثية</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>نصائح لتحسين جودة البحث</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>متابعة دورية ودعم مستمر</span>
                </li>
              </ul>
            </motion.div>

            <ResearchServiceForm 
              serviceTitle="الاستشارات الأكاديمية"
              serviceType="consultation"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
