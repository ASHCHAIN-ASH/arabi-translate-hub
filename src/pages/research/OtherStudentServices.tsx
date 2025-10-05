import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { ResearchServiceForm } from '@/components/research/ResearchServiceForm';
import { 
  GraduationCap, 
  CheckCircle, 
  FileText, 
  Users, 
  Award, 
  BookOpen, 
  ArrowRight,
  Languages,
  FileType,
  UserCheck,
  BookMarked,
  ScrollText,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function OtherStudentServices() {
  const navigate = useNavigate();

  const availableServices = [
    {
      icon: Languages,
      title: 'الترجمة الأكاديمية',
      description: 'ترجمة احترافية للأبحاث والمستندات'
    },
    {
      icon: FileType,
      title: 'تنسيق الأبحاث',
      description: 'تنسيق وفق معايير الجامعات العالمية'
    },
    {
      icon: ScrollText,
      title: 'كتابة المراجع',
      description: 'إعداد قوائم المراجع وفق أنظمة التوثيق'
    },
    {
      icon: UserCheck,
      title: 'القبول الجامعي',
      description: 'إعداد ملفات القبول الجامعي'
    },
    {
      icon: BookMarked,
      title: 'الإطار النظري',
      description: 'إعداد الإطار النظري والدراسات السابقة'
    },
    {
      icon: GraduationCap,
      title: 'دورات تدريبية',
      description: 'دورات متخصصة في البحث العلمي'
    }
  ];

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
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        
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
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg"
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              خدمات الطلاب الأخرى
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              مجموعة متنوعة من الخدمات الأكاديمية الداعمة لرحلتك التعليمية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-3xl font-bold text-center">الخدمات المتاحة</h2>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm group">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-all"
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">ما نقدمه لك</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'خدمات أكاديمية متكاملة من خبراء متخصصين',
                  'دعم شامل في جميع مراحل رحلتك التعليمية',
                  'جودة عالية والتزام بالمعايير الأكاديمية',
                  'سرعة في التنفيذ والالتزام بالمواعيد',
                  'أسعار تنافسية وعروض خاصة للطلاب',
                  'دعم فني ومتابعة مستمرة على مدار الساعة'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">لماذا تختارنا؟</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Award, title: 'خبرة عالمية', desc: 'فريق من الخبراء الأكاديميين المعتمدين' },
                  { icon: Users, title: 'دعم مستمر', desc: 'متابعة دورية وتواصل مباشر مع الفريق' },
                  { icon: BookOpen, title: 'جودة مضمونة', desc: 'معايير أكاديمية عالمية وضمان الرضا' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="text-center p-6 bg-card rounded-2xl shadow-lg"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4"
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">الأسئلة الشائعة</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-card rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    كيف يمكنني طلب الخدمة؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    يمكنك طلب أي خدمة من خلال ملء النموذج أدناه، وسيتواصل معك فريقنا خلال 24 ساعة لمناقشة التفاصيل.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-card rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    ما هي المدة الزمنية لإنجاز الخدمات؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    تختلف المدة حسب نوع الخدمة وحجم العمل. نلتزم بتقديم جدول زمني واضح ونضمن التسليم في الموعد المحدد.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-card rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    هل توفرون ضمان للجودة؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    نعم، جميع خدماتنا مضمونة 100% ونقدم مراجعات مجانية حتى تحصل على النتيجة المطلوبة.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-card rounded-lg shadow-sm border-0 px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    هل الخدمات متاحة لجميع التخصصات؟
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    نعم، نغطي جميع التخصصات الأكاديمية من خلال فريق متنوع من الخبراء والمتخصصين في مختلف المجالات.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            {/* Service Request Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ResearchServiceForm 
                serviceTitle="خدمات الطلاب الأخرى"
                serviceType="other-services"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}