import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ResearchServiceForm } from '@/components/research/ResearchServiceForm';
import { Presentation, CheckCircle, Palette, Layout, Image, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PowerPointService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
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

      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none dark:prose-invert mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">ما نقدمه في العرض التقديمي</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <span>تصميم شرائح احترافية بهوية متسقة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <span>تلخيص المحتوى البحثي بطريقة مبسطة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <span>رسوم بيانية ملونة وجداول منسقة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <span>أيقونات توضيحية حديثة وجذابة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <span>انتقالات وحركات سلسة بين الشرائح</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <span>ملاحظات للمتحدث على كل شريحة</span>
                </li>
              </ul>
            </motion.div>

            <ResearchServiceForm 
              serviceTitle="إعداد عروض PowerPoint أكاديمية"
              serviceType="powerpoint"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
