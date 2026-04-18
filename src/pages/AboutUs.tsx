import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Link } from "react-router-dom";

import { 
  Target, 
  BookOpen, 
  Lightbulb,
  Heart,
  TrendingUp,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Building,
  Zap,
  Crown,
  GraduationCap,
  Brain,
  Rocket,
  Monitor,
  PenTool,
  FileText,
  Search,
  BarChart3,
  Languages,
  Award,
  Users,
  Globe,
  Clock,
  Sparkles,
  Quote,
  Phone
} from "lucide-react";

const AboutUs = () => {

  const values = [
    {
      icon: Brain,
      title: "الابتكار التعليمي",
      description: "نطور حلول تعليمية مبتكرة تواكب أحدث التطورات التكنولوجية والذكاء الاصطناعي"
    },
    {
      icon: GraduationCap,
      title: "التميز الأكاديمي",
      description: "نسعى لتحقيق أعلى معايير الجودة في التعليم والبحث العلمي وفق المعايير الدولية"
    },
    {
      icon: Shield,
      title: "الجودة والثقة",
      description: "نلتزم بأعلى معايير الجودة والمصداقية في جميع خدماتنا التعليمية والبحثية"
    },
    {
      icon: Lightbulb,
      title: "الإبداع والحلول",
      description: "نقدم حلولاً إبداعية مخصصة تلبي احتياجات كل طالب ومؤسسة بطريقة فريدة"
    },
    {
      icon: Rocket,
      title: "التطوير المستمر",
      description: "نستخدم أحدث التقنيات ونطور خدماتنا باستمرار لتقديم أفضل تجربة تعليمية"
    },
    {
      icon: Heart,
      title: "الدعم المتواصل",
      description: "نوفر دعماً فنياً وأكاديمياً متواصلاً على مدار الساعة لضمان نجاح عملائنا"
    }
  ];

  const stats = [
    {
      icon: Users,
      number: 15000,
      suffix: "+",
      title: "طالب وباحث",
      description: "استفادوا من خدماتنا"
    },
    {
      icon: Award,
      number: 98,
      suffix: "%",
      title: "معدل الرضا",
      description: "من عملائنا"
    },
    {
      icon: FileText,
      number: 5000,
      suffix: "+",
      title: "بحث علمي",
      description: "تم إنجازه بنجاح"
    },
    {
      icon: Globe,
      number: 50,
      suffix: "+",
      title: "دولة",
      description: "نخدم فيها"
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "خدمة على مدار الساعة",
      description: "دعم فني وأكاديمي متواصل 24/7"
    },
    {
      icon: CheckCircle,
      title: "ضمان الجودة",
      description: "مراجعة دقيقة وضمان الجودة لكل عمل"
    },
    {
      icon: TrendingUp,
      title: "تطوير مستمر",
      description: "تحديث مستمر لخدماتنا وأدواتنا"
    },
    {
      icon: Shield,
      title: "سرية تامة",
      description: "حماية كاملة لبياناتك وأبحاثك"
    }
  ];

  const services = [
    {
      icon: Monitor,
      title: "التعلم الإلكتروني",
      description: "منصات تعليمية تفاعلية ومحتوى رقمي متطور"
    },
    {
      icon: PenTool,
      title: "الدعم البحثي",
      description: "دعم وإرشاد شامل في إعداد البحوث العلمية"
    },
    {
      icon: FileText,
      title: "التدقيق اللغوي",
      description: "مراجعة وتحرير النصوص الأكاديمية والعلمية"
    },
    {
      icon: Search,
      title: "البحث العلمي",
      description: "أدوات وتقنيات متقدمة للبحث والتحليل"
    },
    {
      icon: BarChart3,
      title: "التحليل الإحصائي",
      description: "تحليل البيانات والإحصائيات بأحدث الطرق"
    },
    {
      icon: Languages,
      title: "الترجمة المتخصصة",
      description: "ترجمة دقيقة للنصوص الأكاديمية والعلمية"
    }
  ];

  const testimonials = [
    {
      name: "د. محمد العتيبي",
      role: "أستاذ جامعي - جامعة الملك سعود",
      content: "خدمة متميزة ومحترفة ساعدتني في نشر أبحاثي في مجلات علمية مرموقة. فريق عمل متعاون وذو خبرة عالية.",
      rating: 5
    },
    {
      name: "سارة المالكي",
      role: "طالبة دكتوراه - جامعة الإمام",
      content: "الدعم الذي حصلت عليه في كتابة رسالتي كان استثنائياً. التزام بالمواعيد وجودة عالية جداً.",
      rating: 5
    },
    {
      name: "أ. خالد الشمري",
      role: "باحث - مدينة الملك عبدالعزيز للعلوم والتقنية",
      content: "أفضل منصة للخدمات البحثية في المنطقة. احترافية عالية وأسعار منافسة ونتائج ممتازة.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO 
        title="من نحن - MasterEduPath | وكالة الحلول التعليمية المتقدمة"
        description="تعرف على MasterEduPath - وكالة رائدة في تقديم الخدمات الأكاديمية والبحثية للطلاب والباحثين في السعودية والوطن العربي. خبرة أكثر من 10 سنوات في خدمة 50,000+ طالب وباحث"
        keywords="من نحن MasterEduPath, وكالة تعليمية, خدمات أكاديمية, خبرة أكاديمية, شركاء جامعات, خدمات بحثية احترافية"
        url="https://ac43130c-4bba-404a-ade5-b9d62d1f8904.lovableproject.com/about-us"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "من نحن - MasterEduPath",
          "description": "صفحة تعريفية بوكالة MasterEduPath للحلول التعليمية",
          "mainEntity": {
            "@type": "Organization",
            "name": "MasterEduPath Agency",
            "foundingDate": "2014",
            "numberOfEmployees": "50+",
            "slogan": "شريكك الموثوق للحلول التعليمية المتقدمة"
          }
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Building className="h-8 w-8 text-primary" />
              </motion.div>
              <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 px-6 py-2 text-base font-bold shadow-lg">
                من نحن
              </Badge>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Crown className="h-8 w-8 text-secondary" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                ماستر إيدو باث
              </span>
              <br />
              <span className="text-foreground text-4xl sm:text-5xl lg:text-6xl">
                رائدون في الحلول التعليمية المتقدمة
              </span>
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              نقود التحول الرقمي في التعليم والبحث العلمي من خلال حلول مبتكرة تجمع بين الخبرة الأكاديمية والتكنولوجيا المتطورة
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link to="/services">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    اكتشف خدماتنا
                    <ArrowRight className="h-5 w-5 group-hover:-translate-x-2 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/contact-us">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-10 py-6 text-lg rounded-full border-2 hover:scale-105 transition-all duration-300"
                >
                  <Phone className="h-5 w-5 ml-2" />
                  تواصل معنا
                </Button>
              </Link>
            </motion.div>

            {/* Floating Icons */}
            <div className="mt-16 flex justify-center gap-8 flex-wrap">
              {[Sparkles, Star, Zap, Rocket].map((Icon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    <Icon className="h-8 w-8 text-primary/60" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-muted/20 via-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              إنجازاتنا <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">بالأرقام</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              أرقام تعكس ثقة عملائنا ونجاح شراكاتنا
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="relative p-8 text-center border-2 hover:border-primary/50 bg-gradient-to-br from-card to-muted/5 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="p-0 relative z-10">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <stat.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    
                    <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      <AnimatedCounter end={stat.number} duration={2500} />
                      {stat.suffix}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-foreground">{stat.title}</h3>
                    <p className="text-muted-foreground text-sm">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-10 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Target className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-3xl font-bold mr-4">رؤيتنا</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    أن نكون الرائدين في تطوير الحلول التعليمية المتقدمة في المنطقة العربية، ونحدث تحولاً جذرياً في مجال التعليم والبحث العلمي من خلال تقنيات الذكاء الاصطناعي والتعلم التفاعلي لإعداد جيل واعد قادر على مواجهة تحديات المستقبل.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-10 border-2 hover:border-secondary/50 bg-gradient-to-br from-card to-secondary/5 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <BookOpen className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-3xl font-bold mr-4">رسالتنا</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    تمكين الطلاب والباحثين والمؤسسات التعليمية من خلال حلول تعليمية مبتكرة ومتطورة، ودعم رحلة التعلم والبحث بأدوات وخدمات ذكية تحقق أفضل النتائج الأكاديمية وتواكب تطورات العصر الرقمي بأعلى معايير الجودة والاحترافية.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              قيمنا <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">الأساسية</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              المبادئ التي نؤمن بها ونسعى لتحقيقها في كل خدمة نقدمها
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full border-2 hover:border-primary/50 bg-gradient-to-br from-card to-muted/5 shadow-lg hover:shadow-2xl transition-all duration-500 group">
                  <CardContent className="p-0 text-center">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <value.icon className="h-10 w-10 text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              لماذا <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">نحن؟</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              مزايا تجعلنا الخيار الأمثل لاحتياجاتك التعليمية والبحثية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full text-center border-2 hover:border-primary/50 bg-gradient-to-br from-card to-muted/5 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    >
                      <feature.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-muted/20 via-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              خدماتنا <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">المتميزة</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              مجموعة شاملة من الحلول التعليمية والبحثية المتقدمة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full border-2 hover:border-primary/50 bg-gradient-to-br from-card to-muted/5 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer">
                  <CardContent className="p-0">
                    <motion.div
                      className="w-16 h-16 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <service.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              آراء <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">عملائنا</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              شهادات حقيقية من عملاء استفادوا من خدماتنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full border-2 hover:border-primary/50 bg-gradient-to-br from-card to-muted/5 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-4 right-4 opacity-10">
                    <Quote className="h-16 w-16 text-primary" />
                  </div>
                  
                  <CardContent className="p-0 relative z-10">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              جاهزون <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">لخدمتكم</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              انضموا إلى آلاف العملاء الذين وثقوا بخبرتنا وحققوا أهدافهم الأكاديمية والمهنية معنا. نحن هنا لمساعدتكم في كل خطوة من رحلتكم التعليمية والبحثية
            </p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link to="/order-now">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-12 py-7 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  <Zap className="h-6 w-6 ml-3 group-hover:rotate-12 transition-transform" />
                  ابدأ مشروعك الآن
                </Button>
              </Link>
              <Link to="/contact-us">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-12 py-7 text-xl rounded-full border-2 hover:scale-105 transition-all duration-300"
                >
                  <Phone className="h-6 w-6 ml-3" />
                  استشارة مجانية
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;