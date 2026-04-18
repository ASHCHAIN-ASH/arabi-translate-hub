import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { 
  Check, 
  Star, 
  ArrowRight,
  Sparkles,
  FileText,
  Globe,
  Video,
  Mic,
  GraduationCap,
  Scale,
  Stethoscope,
  Wrench,
  Briefcase,
  BookOpen,
  Languages,
  Clock,
  Shield,
  Award,
  Zap,
  TrendingUp,
  CheckCircle,
  Info,
  DollarSign
} from "lucide-react";

const Pricing = () => {
  const [selectedCategory, setSelectedCategory] = useState("translation");

  // خدمات الترجمة
  const translationServices = [
    {
      icon: FileText,
      title: "ترجمة النصوص والوثائق",
      description: "ترجمة احترافية للمستندات والنصوص بجميع أنواعها",
      priceNote: "يحدد السعر حسب عدد الكلمات ونوع المحتوى",
      features: [
        "ترجمة دقيقة ومعتمدة",
        "مراجعة لغوية شاملة",
        "تسليم سريع",
        "دعم جميع اللغات"
      ],
      badge: "الأكثر طلباً",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "ترجمة المواقع الإلكترونية",
      description: "ترجمة كاملة للمواقع والتطبيقات الإلكترونية",
      priceNote: "يحدد السعر حسب حجم الموقع وعدد الصفحات",
      features: [
        "ترجمة واجهة المستخدم",
        "ترجمة المحتوى الديناميكي",
        "تكامل مع CMS",
        "اختبار شامل للترجمة"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Video,
      title: "ترجمة الفيديو والسبتايتل",
      description: "إضافة ترجمات احترافية للفيديوهات والمحتوى المرئي",
      priceNote: "يحدد السعر حسب مدة الفيديو ونوع الترجمة",
      features: [
        "تفريغ صوتي دقيق",
        "ترجمة احترافية",
        "توقيت مضبوط",
        "صيغ متعددة (SRT, VTT)"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Mic,
      title: "الترجمة الصوتية",
      description: "تحويل المحتوى الصوتي إلى نص مترجم",
      priceNote: "يحدد السعر حسب مدة التسجيل وجودة الصوت",
      features: [
        "تفريغ صوتي احترافي",
        "ترجمة فورية",
        "جودة عالية",
        "دعم لغات متعددة"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  // الترجمة المتخصصة
  const specializedTranslation = [
    {
      icon: Scale,
      title: "الترجمة القانونية",
      description: "ترجمة معتمدة للعقود والمستندات القانونية",
      priceNote: "يحدد السعر حسب نوع المستند ومدى تعقيده",
      features: [
        "ترجمة معتمدة من مترجمين قانونيين",
        "دقة قانونية عالية",
        "سرية تامة",
        "معتمدة رسمياً"
      ],
      badge: "معتمدة",
      color: "from-amber-500 to-yellow-500"
    },
    {
      icon: Stethoscope,
      title: "الترجمة الطبية",
      description: "ترجمة متخصصة للتقارير والأبحاث الطبية",
      priceNote: "يحدد السعر حسب التخصص الطبي وحجم المحتوى",
      features: [
        "مترجمون طبيون متخصصون",
        "دقة في المصطلحات الطبية",
        "مراجعة من خبراء",
        "سرية المعلومات"
      ],
      color: "from-red-500 to-rose-500"
    },
    {
      icon: Wrench,
      title: "الترجمة التقنية",
      description: "ترجمة الأدلة التقنية والمواصفات الفنية",
      priceNote: "يحدد السعر حسب المجال التقني ومدى التخصص",
      features: [
        "خبرة في المجال التقني",
        "دقة في المصطلحات",
        "ترجمة الرسوم التوضيحية",
        "مراجعة فنية"
      ],
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Briefcase,
      title: "الترجمة التجارية",
      description: "ترجمة المستندات التجارية والعقود",
      priceNote: "يحدد السعر حسب نوع المستند التجاري والحجم",
      features: [
        "ترجمة تجارية احترافية",
        "فهم للسياق التجاري",
        "سرعة في التسليم",
        "مراجعة شاملة"
      ],
      color: "from-teal-500 to-cyan-500"
    }
  ];

  // الخدمات الأكاديمية
  const academicServices = [
    {
      icon: GraduationCap,
      title: "الترجمة الأكاديمية",
      description: "ترجمة الأبحاث والرسائل العلمية",
      priceNote: "يحدد السعر حسب التخصص العلمي وعدد الصفحات",
      features: [
        "مترجمون أكاديميون متخصصون",
        "دقة في المصطلحات العلمية",
        "مراجعة أكاديمية",
        "تنسيق حسب المعايير"
      ],
      badge: "جودة عالية",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: BookOpen,
      title: "الدعم الأكاديمي للأبحاث",
      description: "إرشاد ومساعدة في إعداد الأبحاث العلمية",
      priceNote: "يحدد السعر حسب نوع الدعم والمستوى الأكاديمي",
      features: [
        "دعم أكاديمي احترافي",
        "مراجعة علمية دقيقة",
        "مصادر موثوقة",
        "تنسيق جامعي"
      ],
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: FileText,
      title: "التدقيق اللغوي",
      description: "مراجعة وتدقيق النصوص الأكاديمية",
      priceNote: "يحدد السعر حسب طول النص ونوع التدقيق المطلوب",
      features: [
        "تدقيق لغوي شامل",
        "تحسين الأسلوب",
        "مراجعة القواعد",
        "ضمان الجودة"
      ],
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Languages,
      title: "المراجعة اللغوية",
      description: "مراجعة النصوص وتحسين الصياغة",
      priceNote: "يحدد السعر حسب مستوى المراجعة المطلوبة",
      features: [
        "تحسين الصياغة",
        "دقة لغوية عالية",
        "مراجعة أسلوبية",
        "تسليم سريع"
      ],
      color: "from-pink-500 to-rose-500"
    }
  ];

  // مميزات الخدمة
  const serviceFeatures = [
    {
      icon: Clock,
      title: "تسليم سريع",
      description: "نلتزم بالمواعيد المحددة"
    },
    {
      icon: Shield,
      title: "سرية تامة",
      description: "حماية كاملة لبياناتك"
    },
    {
      icon: Award,
      title: "جودة مضمونة",
      description: "مراجعة متعددة المراحل"
    },
    {
      icon: CheckCircle,
      title: "دعم مستمر",
      description: "فريق دعم على مدار الساعة"
    }
  ];

  const renderServiceCard = (service: any) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full border-2 hover:border-primary/50 bg-gradient-to-br from-card to-muted/5 shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {service.badge && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg">
              <Star className="h-3 w-3 ml-1" />
              {service.badge}
            </Badge>
          </div>
        )}

        <CardHeader className="relative z-10">
          <motion.div
            className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <service.icon className="h-8 w-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl text-center">{service.title}</CardTitle>
          <CardDescription className="text-center text-base">
            {service.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          {/* Price Section */}
          <div className="mb-6 p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-muted/50 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <DollarSign className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">تسعير مخصص</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {service.priceNote}
            </p>
          </div>

          {/* Features List */}
          <ul className="space-y-3 mb-6">
            {service.features.map((feature: string, index: number) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link to="/order-now">
            <Button 
              className="w-full group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg"
            >
              اطلب الخدمة الآن
              <ArrowRight className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
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
              <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 px-6 py-2 text-base font-bold shadow-lg">
                <DollarSign className="h-5 w-5 ml-2" />
                الأسعار والخدمات
                <Sparkles className="h-5 w-5 mr-2" />
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                أسعار شفافة
              </span>
              <br />
              <span className="text-foreground text-4xl sm:text-5xl">
                وخدمات متنوعة
              </span>
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-muted-foreground mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              اختر الخدمة المناسبة لك من مجموعة واسعة من الحلول الاحترافية بأسعار تنافسية
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Features */}
      <section className="py-16 bg-gradient-to-br from-muted/20 via-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-muted/5 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="translation" className="w-full" dir="rtl">
            <div className="flex justify-center mb-16">
              <TabsList className="grid grid-cols-3 w-full max-w-3xl h-auto p-2 bg-muted/50 rounded-2xl">
                <TabsTrigger 
                  value="translation" 
                  className="text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground"
                >
                  <Languages className="h-5 w-5 ml-2" />
                  خدمات الترجمة
                </TabsTrigger>
                <TabsTrigger 
                  value="specialized" 
                  className="text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground"
                >
                  <Award className="h-5 w-5 ml-2" />
                  الترجمة المتخصصة
                </TabsTrigger>
                <TabsTrigger 
                  value="academic" 
                  className="text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground"
                >
                  <GraduationCap className="h-5 w-5 ml-2" />
                  الخدمات الأكاديمية
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="translation" className="mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold mb-4">
                  خدمات <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">الترجمة</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  خدمات ترجمة شاملة لجميع أنواع المحتوى
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {translationServices.map((service, index) => (
                  <div key={index}>
                    {renderServiceCard(service)}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specialized" className="mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold mb-4">
                  الترجمة <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">المتخصصة</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  ترجمة متخصصة في المجالات القانونية والطبية والتقنية
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {specializedTranslation.map((service, index) => (
                  <div key={index}>
                    {renderServiceCard(service)}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="academic" className="mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold mb-4">
                  الخدمات <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">الأكاديمية</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  خدمات متخصصة للباحثين والطلاب الأكاديميين
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {academicServices.map((service, index) => (
                  <div key={index}>
                    {renderServiceCard(service)}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-card to-muted/5 shadow-xl">
              <CardContent className="p-0">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">ملاحظات هامة</h3>
                    <p className="text-muted-foreground">
                      معلومات مهمة عن الأسعار والخدمات
                    </p>
                  </div>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      لكل خدمة سعر خاص يحدد حسب حجم المشروع ونوع المحتوى ومدى التعقيد
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      نقدم عروض أسعار مخصصة ومنافسة لكل مشروع بناءً على متطلباته الفريدة
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      نوفر خصومات خاصة للمشاريع الكبيرة والعملاء المستمرين
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      احصل على عرض سعر فوري ومجاني من خلال التواصل معنا أو تقديم طلب
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      جميع خدماتنا تشمل مراجعة لغوية شاملة ودعم فني مجاني
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              جاهز <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">للبدء؟</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              احصل على عرض سعر مخصص لمشروعك واستمتع بأفضل الخدمات بأسعار تنافسية
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
                  اطلب الآن
                </Button>
              </Link>
              <Link to="/contact-us">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-12 py-7 text-xl rounded-full border-2 hover:scale-105 transition-all duration-300"
                >
                  تواصل معنا
                  <ArrowRight className="h-6 w-6 mr-3" />
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

export default Pricing;