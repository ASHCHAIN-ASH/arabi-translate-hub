import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Settings, Code, FileCheck, Zap, Sparkles, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { EditingServiceForm } from '@/components/editing/EditingServiceForm';
import { useNavigate } from 'react-router-dom';

const TechnicalEditing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Settings className="w-6 h-6" />, title: "دقة تقنية", description: "مراجعة دقيقة للمصطلحات التقنية", color: "from-cyan-500 to-blue-500" },
    { icon: <Code className="w-6 h-6" />, title: "توحيد المعايير", description: "ضمان الالتزام بالمعايير الفنية", color: "from-purple-500 to-indigo-500" },
    { icon: <FileCheck className="w-6 h-6" />, title: "توثيق محترف", description: "تنسيق وتوثيق احترافي", color: "from-green-500 to-emerald-500" },
    { icon: <Zap className="w-6 h-6" />, title: "سرعة وجودة", description: "تسليم سريع بجودة عالية", color: "from-orange-500 to-yellow-500" }
  ];

  const processSteps = [
    { number: "01", title: "التحليل الفني", description: "فحص المحتوى التقني", color: "from-cyan-500 to-blue-500" },
    { number: "02", title: "التدقيق", description: "مراجعة المصطلحات", color: "from-purple-500 to-indigo-500" },
    { number: "03", title: "التنسيق", description: "توحيد المعايير", color: "from-green-500 to-emerald-500" },
    { number: "04", title: "المراجعة النهائية", description: "ضمان الجودة", color: "from-orange-500 to-yellow-500" }
  ];

  const faqs = [
    {
      question: "ما المجالات التقنية التي تغطونها؟",
      answer: "نغطي مجالات متنوعة: البرمجة، الهندسة، الطب، العلوم، التكنولوجيا، والصناعة."
    },
    {
      question: "هل لديكم محررون متخصصون؟",
      answer: "نعم، لدينا محررون متخصصون في مختلف المجالات التقنية والعلمية."
    },
    {
      question: "هل تشمل الخدمة مراجعة الرسوم والجداول؟",
      answer: "نعم، نراجع جميع العناصر الفنية بما في ذلك الرسوم والجداول والمخططات."
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <Breadcrumb items={[
        { label: 'خدمات التحرير', href: '/services/editing-services' },
        { label: 'التحرير الفني' }
      ]} />

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-background" />
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-cyan-500/20"
            >
              <Settings className="w-5 h-5 text-cyan-600" />
              <span className="text-cyan-600 font-semibold">تحرير متخصص للمحتوى التقني</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
            >
              تحرير تقني احترافي
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              مراجعة دقيقة للمستندات التقنية مع ضمان الالتزام بالمعايير المهنية
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
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              ما نقدمه لك
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              خدمات تحرير متخصصة للمحتوى التقني والعلمي
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              كيف نعمل معك؟
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              منهجية دقيقة لضمان جودة المحتوى التقني
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              اطلب خدمة التحرير التقني
            </h2>
            <p className="text-muted-foreground text-lg">املأ النموذج وسنبدأ فوراً</p>
          </motion.div>
          <EditingServiceForm
            serviceTitle="التحرير التقني"
            serviceType="technical-editing"
            specializations={['هندسة', 'طب', 'علوم الحاسوب', 'فيزياء', 'كيمياء', 'رياضيات']}
            documentTypes={['بحث علمي', 'تقرير تقني', 'دليل استخدام', 'وثيقة فنية', 'دراسة تقنية']}
          />
        </div>
      </section>
    </div>
  );
};

export default TechnicalEditing;
