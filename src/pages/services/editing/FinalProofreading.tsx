import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CheckCheck, Shield, Eye, Target, Sparkles, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { EditingServiceForm } from '@/components/editing/EditingServiceForm';
import { useNavigate } from 'react-router-dom';

const FinalProofreading = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <CheckCheck className="w-6 h-6" />, title: "فحص شامل", description: "مراجعة نهائية لجميع جوانب النص", color: "from-emerald-500 to-teal-500" },
    { icon: <Shield className="w-6 h-6" />, title: "ضمان الجودة", description: "التأكد من خلو النص من الأخطاء", color: "from-blue-500 to-cyan-500" },
    { icon: <Eye className="w-6 h-6" />, title: "دقة عالية", description: "فحص دقيق لأدق التفاصيل", color: "from-purple-500 to-pink-500" },
    { icon: <Target className="w-6 h-6" />, title: "جاهز للنشر", description: "نص جاهز تماماً للنشر أو التسليم", color: "from-orange-500 to-red-500" }
  ];

  const processSteps = [
    { number: "01", title: "المراجعة الأولية", description: "قراءة شاملة للنص", color: "from-emerald-500 to-teal-500" },
    { number: "02", title: "الفحص التفصيلي", description: "فحص دقيق لكل عنصر", color: "from-blue-500 to-cyan-500" },
    { number: "03", title: "التدقيق النهائي", description: "مراجعة أخيرة شاملة", color: "from-purple-500 to-pink-500" },
    { number: "04", title: "شهادة الجودة", description: "تسليم مع شهادة ضمان الجودة", color: "from-orange-500 to-red-500" }
  ];

  const faqs = [
    {
      question: "متى أحتاج للتدقيق النهائي؟",
      answer: "قبل النشر النهائي أو التسليم الرسمي لأي نص مهم أو وثيقة رسمية."
    },
    {
      question: "هل التدقيق النهائي يغني عن التحرير؟",
      answer: "لا، التدقيق النهائي يأتي بعد التحرير كمرحلة أخيرة للتأكد من الجودة."
    },
    {
      question: "كم تستغرق عملية التدقيق النهائي؟",
      answer: "عادة 2-4 أيام عمل حسب طول النص."
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <Breadcrumb items={[
        { label: 'خدمات التحرير', href: '/services/editing-services' },
        { label: 'التدقيق النهائي' }
      ]} />

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-background" />
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-emerald-500/20"
            >
              <CheckCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">التدقيق النهائي قبل النشر</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight"
            >
              مراجعة نهائية شاملة ودقيقة
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              آخر خطوة قبل النشر - نضمن لك نصاً خالياً من الأخطاء وجاهزاً بنسبة 100%
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="w-5 h-5 ml-2" />
                اطلب الخدمة الآن
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/services/editing-services')}
                className="text-lg px-8 py-6 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                خدمات التحرير الأخرى
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ما نقدمه لك
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نضمن لك أعلى جودة في التدقيق النهائي
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 group overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <CardContent className="p-8 relative">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              كيف نعمل معك؟
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              عملية منظمة لضمان أفضل النتائج
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-8 relative">
                    <motion.div
                      className={`text-6xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent mb-4 opacity-20 group-hover:opacity-40 transition-opacity`}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.number}
                    </motion.div>
                    <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <motion.div
                    className={`hidden lg:block absolute top-1/2 left-full w-6 h-0.5 bg-gradient-to-l ${step.color}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              الأسئلة الشائعة
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem value={`item-${index}`} className="border-2 rounded-lg px-6 hover:border-primary/50 transition-colors">
                    <AccordionTrigger className="text-right hover:no-underline py-6 text-lg font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section id="form-section" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              اطلب خدمة التدقيق النهائي
            </h2>
            <p className="text-muted-foreground text-lg">املأ النموذج وسنبدأ فوراً</p>
          </motion.div>
          <EditingServiceForm
            serviceTitle="التدقيق النهائي"
            serviceType="final-proofreading"
            documentTypes={['كتاب للنشر', 'أطروحة نهائية', 'مقال للنشر', 'تقرير رسمي', 'وثيقة قانونية']}
          />
        </div>
      </section>
    </div>
  );
};

export default FinalProofreading;
