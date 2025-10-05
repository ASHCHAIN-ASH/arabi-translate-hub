import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { useNavigate } from 'react-router-dom';
import { 
  FileEdit, CheckCheck, BarChart3, FileText, Presentation, 
  ShieldCheck, MessageSquareMore, ArrowRight, Sparkles, Star, Eye,
  Languages, FileType, UserCheck, BookMarked, GraduationCap, ScrollText
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const researchServices = [
  {
    icon: FileEdit,
    title: 'مساعدة في كتابة الأبحاث الجامعية',
    description: 'مساعدة شاملة في كتابة البحوث الجامعية للماجستير والدكتوراه',
    gradient: 'from-blue-500 to-cyan-500',
    href: '/research/academic-writing-service',
    features: ['كتابة أكاديمية', 'منهجية علمية', 'مصادر موثوقة', 'مراجعة شاملة']
  },
  {
    icon: CheckCheck,
    title: 'التدقيق اللغوي والمراجعة',
    description: 'تدقيق لغوي ومراجعة أكاديمية احترافية لأبحاثك',
    gradient: 'from-green-500 to-emerald-500',
    href: '/research/proofreading-service',
    features: ['تدقيق لغوي', 'مراجعة أكاديمية', 'تحسين الأسلوب', 'ضمان الجودة']
  },
  {
    icon: BarChart3,
    title: 'التحليل الإحصائي و SPSS',
    description: 'تحليل إحصائي متقدم باستخدام SPSS والبرامج الإحصائية',
    gradient: 'from-purple-500 to-pink-500',
    href: '/research/statistical-spss-service',
    features: ['SPSS & R', 'تحليل البيانات', 'رسوم بيانية', 'تفسير النتائج']
  },
  {
    icon: FileText,
    title: 'إعداد خطط البحث (Proposal)',
    description: 'إعداد احترافي لخطط البحث والمقترحات البحثية',
    gradient: 'from-orange-500 to-red-500',
    href: '/research/proposal-service',
    features: ['خطة متكاملة', 'منهجية واضحة', 'إطار نظري', 'جدول زمني']
  },
  {
    icon: Presentation,
    title: 'إعداد عروض PowerPoint أكاديمية',
    description: 'تصميم عروض تقديمية احترافية للأبحاث والمناقشات',
    gradient: 'from-teal-500 to-cyan-500',
    href: '/research/powerpoint-service',
    features: ['تصميم احترافي', 'محتوى منظم', 'رسوم توضيحية', 'قوالب أكاديمية']
  },
  {
    icon: ShieldCheck,
    title: 'مراجعات أكاديمية للأوراق قبل النشر',
    description: 'مراجعة شاملة لأوراقك البحثية قبل تقديمها للنشر',
    gradient: 'from-rose-500 to-pink-500',
    href: '/research/paper-review-service',
    features: ['مراجعة شاملة', 'تقييم الجودة', 'توصيات', 'ضمان القبول']
  },
  {
    icon: MessageSquareMore,
    title: 'الاستشارات الأكاديمية',
    description: 'استشارات أكاديمية متخصصة في جميع مراحل البحث',
    gradient: 'from-amber-500 to-yellow-500',
    href: '/research/consultation-service',
    features: ['استشارة متخصصة', 'توجيه علمي', 'حلول عملية', 'دعم مستمر']
  }
];

const otherStudentServices = [
  {
    icon: Languages,
    title: 'الترجمة الأكاديمية',
    description: 'ترجمة احترافية للأبحاث والمستندات الأكاديمية',
    gradient: 'from-indigo-500 to-blue-500',
    href: '/translation-services',
    features: ['ترجمة دقيقة', 'لغات متعددة', 'مراجعة لغوية', 'تسليم سريع']
  },
  {
    icon: FileType,
    title: 'تنسيق الأبحاث والرسائل',
    description: 'تنسيق احترافي وفق معايير الجامعات العالمية',
    gradient: 'from-violet-500 to-purple-500',
    href: '/research/formatting',
    features: ['تنسيق APA & MLA', 'فهرسة آلية', 'جداول ورسوم', 'مراجعة نهائية']
  },
  {
    icon: ScrollText,
    title: 'كتابة المراجع والتوثيق',
    description: 'إعداد قوائم المراجع وفق أنظمة التوثيق المختلفة',
    gradient: 'from-sky-500 to-cyan-500',
    href: '/research/references',
    features: ['APA & MLA & Harvard', 'توثيق دقيق', 'مراجع متنوعة', 'Mendeley & Zotero']
  },
  {
    icon: UserCheck,
    title: 'التقديم للقبول الجامعي',
    description: 'مساعدة شاملة في إعداد ملفات القبول الجامعي',
    gradient: 'from-emerald-500 to-green-500',
    href: '/admission-services',
    features: ['السيرة الذاتية', 'خطاب التحفيز', 'خطابات التوصية', 'استشارات']
  },
  {
    icon: BookMarked,
    title: 'الإطار النظري والدراسات السابقة',
    description: 'إعداد الإطار النظري ومراجعة الأدبيات البحثية',
    gradient: 'from-pink-500 to-rose-500',
    href: '/research/theoretical-framework',
    features: ['مراجعة أدبيات', 'إطار نظري', 'دراسات سابقة', 'تحليل نقدي']
  },
  {
    icon: GraduationCap,
    title: 'دورات تدريبية أكاديمية',
    description: 'دورات متخصصة في مهارات البحث العلمي والكتابة',
    gradient: 'from-amber-500 to-orange-500',
    href: '/research/training-courses',
    features: ['منهجية البحث', 'SPSS', 'كتابة أكاديمية', 'شهادات معتمدة']
  }
];

export default function ResearchServices() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Header />
      <FloatingWhatsAppButton />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
        
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
              className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-2xl"
            >
              <Sparkles className="w-14 h-14 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              خدمات البحث العلمي
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              خدمات بحثية احترافية متكاملة تساعدك في جميع مراحل بحثك الأكاديمي
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xl font-bold text-muted-foreground mr-2">تقييم 5/5</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {researchServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="cursor-pointer"
                  onClick={() => navigate(service.href)}
                >
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-card/80 backdrop-blur-sm">
                    <div className={`bg-gradient-to-r ${service.gradient} p-6 text-white relative overflow-hidden`}>
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 -translate-x-16"></div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative z-10 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm"
                      >
                        <service.icon className="w-10 h-10" />
                      </motion.div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="space-y-2 mb-6">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        عرض الخدمات
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Student Services Section */}
      <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-4 border border-primary/20"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">خدمات إضافية</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              خدمات الطلاب الأخرى
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مجموعة متنوعة من الخدمات الأكاديمية الداعمة لرحلتك التعليمية
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherStudentServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer group"
                  onClick={() => navigate(service.href)}
                >
                  <Card className="h-full border-2 border-muted hover:border-primary/50 transition-all shadow-lg hover:shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div className={`bg-gradient-to-r ${service.gradient} p-5 text-white relative`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative z-10 w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm"
                      >
                        <service.icon className="w-8 h-8" />
                      </motion.div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="space-y-1.5 mb-4">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 rounded-full bg-primary"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                        <span>اكتشف المزيد</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              هل لديك استفسار عن خدماتنا؟
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              فريقنا الأكاديمي جاهز لمساعدتك في اختيار الخدمة المناسبة لبحثك
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact-us')}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all"
            >
              تواصل معنا الآن
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
