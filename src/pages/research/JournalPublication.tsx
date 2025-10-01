import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, TrendingUp, Shield, Sparkles, ArrowLeft, CheckCircle, FileText, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { PublicationServiceForm } from '@/components/publication/PublicationServiceForm';
import { useNavigate } from 'react-router-dom';

const JournalPublication = () => {
  const navigate = useNavigate();

  const features = [
    { 
      icon: <BookOpen className="w-6 h-6" />, 
      title: "نشر في أفضل المجلات", 
      description: "نساعدك في النشر بمجلات مصنفة ومعتمدة عالمياً",
      color: "from-blue-500 to-indigo-500"
    },
    { 
      icon: <Award className="w-6 h-6" />, 
      title: "معامل تأثير عالي", 
      description: "نستهدف المجلات ذات معامل التأثير المرتفع",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: <TrendingUp className="w-6 h-6" />, 
      title: "زيادة الاستشهادات", 
      description: "استراتيجيات لزيادة الاستشهادات ببحثك",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      title: "ضمان القبول", 
      description: "نضمن قبول البحث أو إعادة المبلغ بالكامل",
      color: "from-orange-500 to-red-500"
    }
  ];

  const services = [
    {
      title: "اختيار المجلة المناسبة",
      description: "نساعدك في اختيار أفضل مجلة تناسب بحثك",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: "مراجعة البحث",
      description: "مراجعة شاملة للبحث قبل التقديم",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      title: "تحسين جودة البحث",
      description: "تحسين المحتوى والمنهجية والنتائج",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: "التواصل مع المجلة",
      description: "متابعة عملية المراجعة والنشر",
      icon: <Award className="w-5 h-5" />
    }
  ];

  const processSteps = [
    { 
      number: "01", 
      title: "تقييم البحث", 
      description: "مراجعة شاملة للبحث وتحديد المجلات المناسبة",
      color: "from-blue-500 to-indigo-500"
    },
    { 
      number: "02", 
      title: "التحسين والتطوير", 
      description: "تحسين جودة البحث والمنهجية",
      color: "from-purple-500 to-pink-500"
    },
    { 
      number: "03", 
      title: "التقديم والمتابعة", 
      description: "تقديم البحث ومتابعة المراجعين",
      color: "from-green-500 to-emerald-500"
    },
    { 
      number: "04", 
      title: "النشر النهائي", 
      description: "نشر البحث في المجلة المستهدفة",
      color: "from-orange-500 to-red-500"
    }
  ];

  const faqs = [
    {
      question: "ما هي مدة عملية النشر؟",
      answer: "تختلف المدة حسب المجلة والمجال، لكن عادة تتراوح بين 3-12 شهراً من التقديم حتى النشر النهائي."
    },
    {
      question: "هل تضمنون القبول في المجلات؟",
      answer: "نعم، نضمن قبول البحث في مجلة علمية محكمة معتمدة، وإلا نعيد المبلغ بالكامل."
    },
    {
      question: "ما هي المجلات التي تتعاملون معها؟",
      answer: "نتعامل مع مجلات Scopus و ISI و PubMed وغيرها من قواعد البيانات العالمية المعتمدة."
    },
    {
      question: "هل تقدمون خدمة الترجمة؟",
      answer: "نعم، نقدم خدمات ترجمة أكاديمية متخصصة للأبحاث العلمية."
    }
  ];

  const stats = [
    { number: "500+", label: "بحث منشور", color: "from-blue-500 to-indigo-500" },
    { number: "95%", label: "نسبة القبول", color: "from-purple-500 to-pink-500" },
    { number: "50+", label: "مجلة معتمدة", color: "from-green-500 to-emerald-500" },
    { number: "15+", label: "سنة خبرة", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <Breadcrumb items={[
        { label: 'الخدمات البحثية', href: '/research-services' },
        { label: 'النشر في المجلات العلمية' }
      ]} />

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-background" />
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-blue-500/20"
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-semibold">النشر في المجلات العلمية</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight"
            >
              نشر أبحاثك في المجلات العالمية المحكمة
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              نساعدك في نشر أبحاثك العلمية في مجلات محكمة معتمدة عالمياً مع ضمان القبول والجودة
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="w-5 h-5 ml-2" />
                ابدأ النشر الآن
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/research-services')}
                className="text-lg px-8 py-6 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                الخدمات البحثية
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              لماذا تختار خدماتنا؟
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نقدم حلولاً متكاملة لنشر أبحاثك في أرقى المجلات العالمية
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white mb-4">
                      {service.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              كيف نعمل معك؟
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              عملية منظمة لضمان نشر بحثك بنجاح
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
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 group">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              اطلب خدمة النشر في المجلات العلمية
            </h2>
            <p className="text-muted-foreground text-lg">املأ النموذج وسنتواصل معك خلال 24 ساعة</p>
          </motion.div>
          <PublicationServiceForm
            serviceTitle="النشر في المجلات العلمية"
            serviceType="journal-publication"
          />
        </div>
      </section>
    </div>
  );
};

export default JournalPublication;