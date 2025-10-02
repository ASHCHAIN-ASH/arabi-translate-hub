import { motion } from "framer-motion";
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
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";

const InstitutionalPartnerships = () => {
  const navigate = useNavigate();

  const packages = [
    {
      id: "starter",
      name: "الباقة الأساسية",
      icon: Building2,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/50",
      iconBg: "from-blue-500/20 to-cyan-500/20",
      price: "5,000",
      originalPrice: "10,000",
      discount: "50%",
      period: "شهرياً",
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
      price: "12,000",
      originalPrice: "24,000",
      discount: "50%",
      period: "شهرياً",
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
      icon: Users,
      title: "فريق متخصص",
      description: "فريق من المترجمين والمراجعين المتخصصين في المجال الأكاديمي"
    },
    {
      icon: Zap,
      title: "سرعة في التنفيذ",
      description: "أولوية قصوى في معالجة طلباتكم مع ضمان الجودة"
    },
    {
      icon: Award,
      title: "ضمان الجودة",
      description: "مراجعة متعددة المستويات لضمان أعلى معايير الجودة"
    },
    {
      icon: MessageSquare,
      title: "تواصل مباشر",
      description: "قناة تواصل مباشرة مع فريق العمل والإدارة"
    }
  ];

  const stats = [
    { number: "200+", label: "مؤسسة شريكة" },
    { number: "50,000+", label: "مشروع منجز" },
    { number: "98%", label: "نسبة رضا العملاء" },
    { number: "24/7", label: "دعم متواصل" }
  ];

  return (
    <>
      <SEO
        title="الشراكات المؤسسية | حلول مخصصة للمكاتب التعليمية والشركات"
        description="انضم إلى أكثر من 200 مؤسسة شريكة واستفد من باقاتنا المخصصة للمكاتب التعليمية والشركات. خصومات حصرية تصل إلى 45% وحلول مرنة."
        keywords="شراكات مؤسسية، باقات للمكاتب التعليمية، خدمات ترجمة للشركات، خصومات مؤسسية"
      />
      
      <Breadcrumb
        items={[
          { label: "الشراكات المؤسسية" }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full mb-6"
              >
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  أكثر من 200 مؤسسة شريكة
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight"
              >
                حلول شاملة للمكاتب التعليمية والشركات
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed px-4"
              >
                نوفر باقات مخصصة تناسب احتياجات مؤسستكم مع خصومات حصرية تصل إلى 50%
                <br className="hidden sm:block" />
                <span className="block sm:inline"> وخدمات متميزة مع فريق دعم مخصص (لا تشمل النشر بالمجلات)</span>
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 px-4"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4">
                اختر الباقة المناسبة لمؤسستك
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                باقات مرنة ومخصصة تلبي جميع احتياجاتكم مع خصومات استثنائية
              </p>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto mb-12 md:mb-16"
            >
              <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border-2 border-amber-500/30">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3">
                        💡 كيف يعمل نظام الاشتراك؟
                      </h3>
                      <div className="space-y-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        <p className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong className="text-foreground">الأسعار المعروضة:</strong> رسوم الاشتراك السنوي في الباقة فقط</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong className="text-foreground">الخدمات:</strong> يتم احتساب كل خدمة بشكل منفصل حسب نوعها وحجمها</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong className="text-foreground">الخصم:</strong> بعد الاشتراك، تحصلون على خصم 50% على جميع الخدمات طوال فترة الاشتراك</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong className="text-foreground">استثناء:</strong> خدمات النشر بالمجلات غير مشمولة في الاشتراك أو الخصم</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative w-full"
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 sm:-top-4 left-0 right-0 flex justify-center z-10">
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-3 sm:px-4 py-1 text-xs sm:text-sm shadow-lg">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 inline" />
                        الأكثر شعبية
                      </Badge>
                    </div>
                  )}

                  <Card className={`h-full border-2 ${pkg.borderColor} bg-gradient-to-br ${pkg.color} backdrop-blur-sm hover:shadow-2xl transition-all duration-500 ${pkg.popular ? 'sm:scale-105' : ''}`}>
                    <CardHeader className="text-center pb-6 sm:pb-8 pt-6 sm:pt-8">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br ${pkg.iconBg} flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                        <pkg.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                      </div>
                      
                      <CardTitle className="text-xl sm:text-2xl font-bold mb-2 px-2">
                        {pkg.name}
                      </CardTitle>
                      
                      <CardDescription className="text-sm sm:text-base px-2">
                        {pkg.description}
                      </CardDescription>

                      <div className="mt-4 sm:mt-6">
                        {pkg.originalPrice && (
                          <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">
                              {pkg.originalPrice} ريال
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              خصم {pkg.discount}
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                            {pkg.price}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-lg sm:text-xl text-muted-foreground">
                              ريال
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                          {pkg.period}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 sm:px-6">
                      <ul className="space-y-3 sm:space-y-4">
                        {pkg.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.05 * idx, duration: 0.4 }}
                            className="flex items-start gap-2 sm:gap-3"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm leading-relaxed text-foreground">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-4 sm:pt-6 px-4 sm:px-6">
                      <Button
                        onClick={() => navigate('/contact-us')}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
                        size="lg"
                      >
                        <span className="text-sm sm:text-base">ابدأ الآن</span>
                        <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4">
                لماذا الشراكة معنا؟
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                نقدم أكثر من مجرد خدمات ترجمة، نحن شريككم في النجاح
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20">
                <CardContent className="p-6 sm:p-8 md:p-12 text-center">
                  <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-primary" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                    هل أنتم مستعدون للبدء؟
                  </h2>
                  <p className="text-sm sm:text-base md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                    تواصلوا معنا اليوم للحصول على استشارة مجانية وعرض سعر مخصص لمؤسستكم
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
                    <Button
                      onClick={() => navigate('/contact-us')}
                      size="lg"
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                    >
                      <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">تواصل معنا</span>
                    </Button>
                    <Button
                      onClick={() => navigate('/contact-us')}
                      size="lg"
                      variant="outline"
                      className="transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                    >
                      <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">احصل على عرض سعر</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InstitutionalPartnerships;