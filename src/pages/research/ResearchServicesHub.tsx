import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import {
  BookOpenCheck, FileCheck, BarChart3, FileText, 
  Presentation, ShieldCheck, MessageSquareMore, 
  ArrowLeft, Sparkles, GraduationCap, Eye
} from 'lucide-react';

const services = [
  {
    id: 'academic-writing',
    title: 'مساعدة في كتابة الأبحاث الجامعية',
    description: 'نساعدك في كتابة أبحاثك الجامعية بجودة عالية واحترافية وفقاً للمعايير الأكاديمية',
    icon: BookOpenCheck,
    gradient: 'from-blue-500 to-cyan-500',
    href: '/research/academic-writing-service',
    features: ['بحث علمي موثق', 'مراجع محدثة', 'توثيق أكاديمي', 'جودة مضمونة']
  },
  {
    id: 'proofreading',
    title: 'التدقيق اللغوي والمراجعة',
    description: 'تدقيق لغوي شامل ومراجعة أكاديمية لضمان خلو البحث من الأخطاء',
    icon: FileCheck,
    gradient: 'from-emerald-500 to-teal-500',
    href: '/research/proofreading-service',
    features: ['تدقيق إملائي', 'مراجعة نحوية', 'تحسين الأسلوب', 'فحص الانسيابية']
  },
  {
    id: 'statistical-analysis',
    title: 'التحليل الإحصائي و SPSS',
    description: 'تحليل بياناتك باستخدام SPSS والبرامج الإحصائية المتقدمة',
    icon: BarChart3,
    gradient: 'from-purple-500 to-pink-500',
    href: '/research/statistical-spss-service',
    features: ['تحليل متقدم', 'SPSS & R', 'رسوم بيانية', 'تفسير النتائج']
  },
  {
    id: 'proposal-writing',
    title: 'إعداد خطط البحث (Proposal)',
    description: 'إعداد مقترح بحثي متكامل يشمل المنهجية والإطار النظري',
    icon: FileText,
    gradient: 'from-orange-500 to-red-500',
    href: '/research/proposal-service',
    features: ['منهجية علمية', 'خطة متكاملة', 'أهداف واضحة', 'جدول زمني']
  },
  {
    id: 'powerpoint',
    title: 'إعداد عروض PowerPoint أكاديمية',
    description: 'تصميم عروض تقديمية احترافية لأبحاثك الأكاديمية',
    icon: Presentation,
    gradient: 'from-indigo-500 to-blue-500',
    href: '/research/powerpoint-service',
    features: ['تصميم احترافي', 'محتوى منظم', 'رسوم توضيحية', 'جاهز للعرض']
  },
  {
    id: 'paper-review',
    title: 'مراجعات أكاديمية للأوراق قبل النشر',
    description: 'مراجعة شاملة لأوراقك العلمية قبل تقديمها للنشر',
    icon: ShieldCheck,
    gradient: 'from-rose-500 to-pink-500',
    href: '/research/paper-review-service',
    features: ['مراجعة شاملة', 'تحسين الجودة', 'توافق المعايير', 'ضمان القبول']
  },
  {
    id: 'consultation',
    title: 'الاستشارات الأكاديمية',
    description: 'استشارات متخصصة في جميع مراحل البحث العلمي',
    icon: MessageSquareMore,
    gradient: 'from-amber-500 to-yellow-500',
    href: '/research/consultation-service',
    features: ['استشارة متخصصة', 'توجيه علمي', 'حلول عملية', 'دعم مستمر']
  }
];

export default function ResearchServicesHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Header />
      <FloatingWhatsAppButton />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5"></div>
        
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full"
            >
              <GraduationCap className="w-6 h-6 text-primary" />
              <span className="font-bold text-primary">خدمات البحث العلمي</span>
              <Sparkles className="w-5 h-5 text-accent" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
              خدمات البحث العلمي الاحترافية
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              نقدم لك مجموعة متكاملة من الخدمات البحثية بأعلى معايير الجودة الأكاديمية
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 rounded-full shadow-soft">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>فريق أكاديمي متخصص</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 rounded-full shadow-soft">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>جودة مضمونة 100%</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 rounded-full shadow-soft">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>تسليم في الموعد</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-card/80 backdrop-blur-sm">
                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-br ${service.gradient} p-8 relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 -translate-x-16"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 translate-x-12"></div>
                    
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="relative z-10 w-16 h-16 mx-auto bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center"
                    >
                      <service.icon className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 pt-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link to={service.href}>
                      <Button 
                        className={`w-full mt-4 bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white font-bold py-6 group/btn`}
                      >
                        <span>عرض الخدمات</span>
                        <Eye className="mr-2 w-5 h-5 transition-transform group-hover/btn:scale-110" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              هل لديك استفسار أو تحتاج مساعدة؟
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              فريقنا جاهز لمساعدتك في اختيار الخدمة المناسبة لاحتياجاتك البحثية
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                <MessageSquareMore className="ml-2 w-5 h-5" />
                تواصل معنا الآن
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
