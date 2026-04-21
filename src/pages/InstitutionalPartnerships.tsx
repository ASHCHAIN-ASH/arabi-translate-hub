import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  GraduationCap, 
  CheckCircle, 
  Star, 
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  Crown,
  Zap,
  Award,
  Shield,
  Target,
  TrendingUp,
  BookOpen,
  Globe,
  Clock,
  HeadphonesIcon,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InstitutionalPartnershipForm from "@/components/InstitutionalPartnershipForm";

const InstitutionalPartnerships = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const packages = [
    {
      id: "starter",
      name: "الباقة الأساسية",
      icon: Building2,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/50",
      iconBg: "from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/20",
      price: "5,000",
      originalPrice: "10,000",
      discount: "50%",
      period: "سنوياً",
      description: "مثالية للمكاتب الصغيرة والناشئة",
      features: [
        "خدمات ترجمة أكاديمية وعامة",
        "ترجمة وثائق رسمية ومستندات",
        "تدقيق لغوي وأكاديمي مجاني",
        "مساعدة في إعداد الأبحاث والرسائل",
        "مراجعة المراجع والببليوغرافيا",
        "خصم 50% على جميع الخدمات",
        "دعم فني عبر البريد الإلكتروني",
        "تسليم خلال 5 أيام عمل",
        "حساب مدير مخصص",
        "⚠️ لا يشمل خدمات النشر بالمجلات"
      ],
      popular: false
    },
    {
      id: "professional",
      name: "الباقة الاحترافية",
      icon: Award,
      color: "from-primary/30 to-secondary/30",
      borderColor: "border-primary",
      iconBg: "from-primary/30 to-secondary/30",
      glowColor: "shadow-primary/30",
      price: "12,000",
      originalPrice: "24,000",
      discount: "50%",
      period: "سنوياً",
      description: "الأكثر شعبية للمكاتب المتوسطة",
      features: [
        "خدمات ترجمة أكاديمية ومتخصصة",
        "ترجمة قانونية وطبية وتقنية",
        "تدقيق لغوي وأكاديمي شامل مجاناً",
        "إعداد ومراجعة الأبحاث العلمية",
        "تحليل إحصائي باستخدام SPSS",
        "مراجعة المنهجية البحثية",
        "صياغة وتحسين الأبحاث الأكاديمية",
        "خصم 50% على جميع الخدمات",
        "دعم فني على مدار الساعة",
        "تسليم خلال 3 أيام عمل",
        "مدير حساب مخصص مع اجتماعات شهرية",
        "أولوية في المشاريع العاجلة",
        "تقارير شهرية مفصلة",
        "⚠️ لا يشمل خدمات النشر بالمجلات"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "باقة المؤسسات",
      icon: Crown,
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/50",
      iconBg: "from-amber-500/20 to-orange-500/20",
      glowColor: "shadow-amber-500/20",
      price: "حسب الطلب",
      originalPrice: null,
      discount: "50%",
      period: "حلول مخصصة",
      description: "للمؤسسات الكبيرة والجامعات",
      features: [
        "خدمات ترجمة شاملة لجميع أنواع المستندات",
        "ترجمة متخصصة (قانونية، طبية، تقنية، أكاديمية)",
        "تدقيق لغوي وأكاديمي شامل مجاناً",
        "إعداد الأبحاث والرسائل العلمية الكاملة",
        "تحليل إحصائي متقدم (SPSS, R, Python)",
        "مراجعة المنهجية والإطار النظري",
        "كتابة وتحرير الأبحاث الأكاديمية",
        "استشارات بحثية متخصصة",
        "مراجعة الأقران (Peer Review)",
        "خصم 50% على جميع الخدمات",
        "فريق دعم مخصص 24/7",
        "تسليم فوري للمشاريع العاجلة",
        "مدير حساب تنفيذي مخصص",
        "API مخصص للتكامل مع أنظمتكم",
        "تدريب مجاني للموظفين",
        "عقود مرنة طويلة الأجل",
        "⚠️ لا يشمل خدمات النشر بالمجلات"
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: "خبرة أكاديمية متخصصة",
      description: "فريق من الأكاديميين والباحثين المتخصصين في مختلف المجالات العلمية"
    },
    {
      icon: Shield,
      title: "ضمان الجودة والسرية",
      description: "التزام تام بمعايير الجودة الأكاديمية مع حماية كاملة لخصوصية البيانات"
    },
    {
      icon: MessageSquare,
      title: "دعم واتساب 24/7",
      description: "خدمة دعم فني عبر الواتساب متوفرة على مدار الساعة للرد الفوري على استفساراتكم"
    },
    {
      icon: Clock,
      title: "التزام بالمواعيد",
      description: "نضمن تسليم جميع المشاريع في المواعيد المحددة دون تأخير"
    },
    {
      icon: Target,
      title: "حلول مخصصة",
      description: "نقدم حلولاً مصممة خصيصاً لتلبية احتياجات كل مؤسسة على حدة"
    },
    {
      icon: TrendingUp,
      title: "تطوير مستمر",
      description: "نواكب أحدث المعايير الأكاديمية والتقنيات الحديثة في مجالنا"
    }
  ];

  const stats = [
    { 
      number: "200+", 
      label: "مؤسسة شريكة",
      icon: Building2
    },
    { 
      number: "50,000+", 
      label: "مشروع منجز",
      icon: BarChart3
    },
    { 
      number: "98%", 
      label: "نسبة رضا العملاء",
      icon: Star
    },
    { 
      number: "24/7", 
      label: "دعم متواصل",
      icon: HeadphonesIcon
    }
  ];

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const rotateAnimation = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  return (
    <>
      <SEO
        title="الشراكات المؤسسية | حلول مخصصة للمكاتب التعليمية والشركات"
        description="انضم إلى أكثر من 200 مؤسسة شريكة واستفد من باقاتنا المخصصة للمكاتب التعليمية والشركات. خصومات حصرية تصل إلى 50% وحلول مرنة."
        keywords="شراكات مؤسسية، باقات للمكاتب التعليمية، خدمات ترجمة للشركات، خصومات مؤسسية"
      />
      
      <Header />
      
      <Breadcrumb
        items={[
          { label: "الشراكات المؤسسية" }
        ]}
      />

      <InstitutionalPartnershipForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        selectedPackage={selectedPackage}
      />

      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-20 right-20 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-80 h-80 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[600px] md:h-[600px] bg-accent/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            />
          </div>

          <motion.div 
            style={{ opacity, scale }}
            className="container mx-auto px-4 relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full mb-6 sm:mb-8 backdrop-blur-sm border border-primary/20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </motion.div>
                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  أكثر من 200 مؤسسة شريكة معتمدة
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
              >
                <span className="block mb-2 sm:mb-4">شراكات استراتيجية</span>
                <span className="bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent">
                  لمستقبل أكاديمي متميز
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4"
              >
                نوفر باقات مخصصة تناسب احتياجات مؤسستكم مع{" "}
                <span className="text-primary font-bold">خصومات حصرية 50%</span>
                <br className="hidden sm:block" />
                <span className="block sm:inline mt-2 sm:mt-0"> وخدمات متميزة مع فريق دعم أكاديمي متخصص</span>
              </motion.p>

              {/* Animated Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 px-4 max-w-5xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-card/70 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl">
                      <motion.div
                        className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </motion.div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
                        {stat.number}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Packages Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 md:mb-12"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block mb-4 sm:mb-6"
              >
                <Badge className="px-4 sm:px-6 py-2 text-xs sm:text-sm bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  باقات الشراكة الأكاديمية
                </Badge>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4">
                اختر الباقة المناسبة لمؤسستك
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
                باقات مرنة ومخصصة تلبي جميع احتياجاتكم الأكاديمية مع خصومات استثنائية
              </p>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-5xl mx-auto mb-12 md:mb-16"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border-2 border-amber-500/30 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl" />
                <CardContent className="p-4 sm:p-6 md:p-8 relative">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <motion.div 
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                    <div className="flex-1 text-right">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                        كيف يعمل نظام الاشتراك السنوي؟
                      </h3>
                      <div className="space-y-3 text-sm sm:text-base">
                        <motion.p 
                          className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm"
                          whileHover={{ x: -5 }}
                        >
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            <strong className="text-foreground">الأسعار المعروضة:</strong> رسوم الاشتراك السنوي في الباقة فقط
                          </span>
                        </motion.p>
                        <motion.p 
                          className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm"
                          whileHover={{ x: -5 }}
                        >
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            <strong className="text-foreground">الخدمات:</strong> يتم احتساب كل خدمة بشكل منفصل حسب نوعها وحجمها
                          </span>
                        </motion.p>
                        <motion.p 
                          className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm"
                          whileHover={{ x: -5 }}
                        >
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            <strong className="text-foreground">الخصم 50%:</strong> يُطبق على جميع الخدمات المطلوبة طوال فترة الاشتراك
                          </span>
                        </motion.p>
                        <motion.p 
                          className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-amber-500/10 backdrop-blur-sm border border-amber-500/20"
                          whileHover={{ x: -5 }}
                        >
                          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            <strong className="text-amber-600 dark:text-amber-400">استثناء مهم:</strong> خدمات النشر بالمجلات غير مشمولة في الاشتراك أو الخصم
                          </span>
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Packages Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.03,
                    transition: { duration: 0.4 }
                  }}
                  className="relative w-full"
                >
                  {pkg.popular && (
                    <motion.div 
                      className="absolute -top-4 left-0 right-0 flex justify-center z-10"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    >
                      <Badge className="bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground px-4 sm:px-6 py-2 text-xs sm:text-sm shadow-2xl border-0">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline fill-current" />
                        </motion.div>
                        الأكثر شعبية
                      </Badge>
                    </motion.div>
                  )}

                  <Card className={`h-full border-2 ${pkg.borderColor} bg-gradient-to-br ${pkg.color} backdrop-blur-md hover:${pkg.glowColor} hover:shadow-2xl transition-all duration-500 ${pkg.popular ? 'sm:scale-105 shadow-xl' : ''} relative overflow-hidden group`}>
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardHeader className="text-center pb-6 sm:pb-8 pt-8 sm:pt-10 relative">
                      <motion.div 
                        className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-3xl bg-gradient-to-br ${pkg.iconBg} flex items-center justify-center relative overflow-hidden group-hover:shadow-2xl transition-shadow duration-500`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.6 }
                        }}
                      >
                        <motion.div
                          {...rotateAnimation}
                          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50"
                        />
                        <pkg.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary relative z-10" />
                      </motion.div>
                      
                      <CardTitle className="text-xl sm:text-2xl font-bold mb-3 px-2 bg-gradient-to-l from-primary via-foreground to-primary bg-clip-text text-transparent">
                        {pkg.name}
                      </CardTitle>
                      
                      <CardDescription className="text-sm sm:text-base px-2 text-muted-foreground font-medium">
                        {pkg.description}
                      </CardDescription>

                      <div className="mt-6 sm:mt-8">
                        {pkg.originalPrice && (
                          <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                            <span className="text-sm sm:text-base text-muted-foreground line-through">
                              {pkg.originalPrice} ريال
                            </span>
                            <Badge variant="destructive" className="text-xs sm:text-sm font-bold animate-pulse">
                              وفّر {pkg.discount}
                            </Badge>
                          </div>
                        )}
                        <motion.div 
                          className="flex items-baseline justify-center gap-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent">
                            {pkg.price}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-lg sm:text-xl text-muted-foreground font-semibold">
                              ريال
                            </span>
                          )}
                        </motion.div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">
                          {pkg.period}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 sm:px-6 relative">
                      <ul className="space-y-3 sm:space-y-4">
                        {pkg.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ 
                              delay: 0.05 * idx, 
                              duration: 0.4,
                              type: "spring"
                            }}
                            whileHover={{ x: 5 }}
                            className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors duration-300"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                delay: idx * 0.1
                              }}
                            >
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            </motion.div>
                            <span className="text-xs sm:text-sm leading-relaxed text-foreground font-medium">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-6 sm:pt-8 px-4 sm:px-6 pb-6 sm:pb-8 relative">
                      <Button
                        onClick={() => {
                          setSelectedPackage(pkg.id);
                          setIsFormOpen(true);
                        }}
                        className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-primary-foreground transition-all duration-500 hover:scale-105 hover:shadow-2xl group relative overflow-hidden"
                        size="lg"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: [-200, 200] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-sm sm:text-base font-bold relative z-10">ابدأ الشراكة الآن</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="relative z-10"
                        >
                          <ArrowLeft className="mr-2 h-5 w-5" />
                        </motion.div>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-muted/50 via-background to-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 md:mb-16"
            >
              <motion.div
                {...floatingAnimation}
                className="inline-block mb-4 sm:mb-6"
              >
                <Badge className="px-4 sm:px-6 py-2 text-xs sm:text-sm bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border-secondary/20">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  مميزات الشراكة معنا
                </Badge>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4">
                لماذا نحن الخيار الأمثل؟
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
                نقدم أكثر من مجرد خدمات، نحن شريككم الاستراتيجي في التميز الأكاديمي
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring"
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  <div className="relative bg-card/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl h-full">
                    <motion.div
                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center relative overflow-hidden"
                      whileHover={{ 
                        rotate: [0, 360],
                        scale: 1.1,
                        transition: { duration: 0.8 }
                      }}
                    >
                      <motion.div
                        {...rotateAnimation}
                        className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"
                      />
                      <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary relative z-10" />
                    </motion.div>
                    
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center bg-gradient-to-l from-primary via-foreground to-primary bg-clip-text text-transparent">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-2 border-primary/30 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
                
                <CardContent className="p-6 sm:p-10 md:p-16 text-center relative">
                  <motion.div
                    {...floatingAnimation}
                    className="inline-block mb-6 sm:mb-8"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shadow-2xl">
                      <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                  </motion.div>
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2 bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent">
                    هل أنتم مستعدون للانضمام إلينا؟
                  </h2>
                  
                  <p className="text-sm sm:text-base md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto px-2 leading-relaxed">
                    تواصلوا معنا اليوم للحصول على استشارة مجانية وعرض سعر مخصص يناسب احتياجات مؤسستكم الأكاديمية
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-2 max-w-2xl mx-auto">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1"
                    >
                      <Button
                        onClick={() => {
                          setSelectedPackage("");
                          setIsFormOpen(true);
                        }}
                        size="lg"
                        className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-primary-foreground transition-all duration-500 hover:shadow-2xl group relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: [-200, 200] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <Phone className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                        <span className="text-sm sm:text-base font-bold relative z-10">ابدأ الشراكة الآن</span>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1"
                    >
                      <Button
                        onClick={() => navigate('/contact-us')}
                        size="lg"
                        variant="outline"
                        className="w-full border-2 border-primary/50 hover:bg-primary/10 transition-all duration-500 hover:shadow-xl group"
                      >
                        <Mail className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                        <span className="text-sm sm:text-base font-bold">تواصل معنا مباشرة</span>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default InstitutionalPartnerships;