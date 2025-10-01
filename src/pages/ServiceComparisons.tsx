import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Globe, 
  Search, 
  Crown, 
  Calculator,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ServiceComparisons = () => {
  const navigate = useNavigate();

  const translationServices = [
    {
      name: "الترجمة الفورية",
      speed: "فوري",
      accuracy: "85%",
      price: "منخفض",
      features: ["ترجمة سريعة", "متاح 24/7", "أكثر من 100 لغة"],
      missingFeatures: ["مراجعة بشرية", "تخصص أكاديمي"],
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "الترجمة القانونية",
      speed: "3-5 أيام",
      accuracy: "99%",
      price: "متوسط",
      features: ["مترجمون متخصصون", "مراجعة قانونية", "توثيق رسمي", "سرية تامة"],
      missingFeatures: ["ترجمة فورية"],
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "الترجمة الأكاديمية",
      speed: "5-7 أيام",
      accuracy: "99.5%",
      price: "متوسط-مرتفع",
      features: ["خبراء أكاديميون", "مراجعة علمية", "توثيق المراجع", "فحص الانتحال"],
      missingFeatures: [],
      color: "from-green-500 to-green-600"
    },
    {
      name: "الترجمة التقنية",
      speed: "4-6 أيام",
      accuracy: "98%",
      price: "متوسط",
      features: ["مترجمون تقنيون", "دقة المصطلحات", "توثيق فني", "مراجعة متخصصة"],
      missingFeatures: [],
      color: "from-orange-500 to-orange-600"
    }
  ];

  const researchServices = [
    {
      name: "البحث الأكاديمي",
      duration: "2-4 أسابيع",
      quality: "متقدم",
      price: "مرتفع",
      features: ["بحث شامل", "منهجية علمية", "مراجعة الأقران", "نشر في مجلات"],
      missingFeatures: [],
      color: "from-indigo-500 to-indigo-600"
    },
    {
      name: "التحليل الإحصائي",
      duration: "3-7 أيام",
      quality: "عالي",
      price: "متوسط",
      features: ["تحليل SPSS", "رسوم بيانية", "تقرير مفصل", "استشارة مباشرة"],
      missingFeatures: ["كتابة البحث الكامل"],
      color: "from-red-500 to-red-600"
    },
    {
      name: "المراجعة اللغوية",
      duration: "2-4 أيام",
      quality: "ممتاز",
      price: "منخفض-متوسط",
      features: ["تدقيق لغوي", "تحسين الأسلوب", "توحيد المصطلحات", "تقرير التعديلات"],
      missingFeatures: ["تحليل إحصائي", "إعداد منهجية"],
      color: "from-teal-500 to-teal-600"
    },
    {
      name: "النشر في المجلات",
      duration: "1-3 أشهر",
      quality: "احترافي",
      price: "مرتفع",
      features: ["اختيار المجلة المناسبة", "تنسيق حسب متطلبات المجلة", "متابعة عملية النشر", "الرد على المحكمين"],
      missingFeatures: [],
      color: "from-pink-500 to-pink-600"
    }
  ];

  const membershipPlans = [
    {
      name: "العضوية المجانية",
      price: "0 ريال",
      period: "دائمة",
      features: [
        "خصم 5% على جميع الخدمات",
        "دعم فني أساسي",
        "إشعارات العروض"
      ],
      missingFeatures: [
        "أولوية في التنفيذ",
        "مستشار مخصص",
        "خدمات مجانية"
      ],
      color: "from-slate-500 to-slate-600",
      recommended: false
    },
    {
      name: "عضوية بلاتينيوم",
      price: "999 ريال",
      period: "سنوياً",
      features: [
        "خصم 15% على جميع الخدمات",
        "أولوية في التنفيذ",
        "دعم فني متقدم",
        "استشارة مجانية شهرية",
        "تقارير دورية"
      ],
      missingFeatures: [
        "خدمة ترجمة مجانية شهرية",
        "مستشار أكاديمي مخصص"
      ],
      color: "from-blue-500 to-blue-600",
      recommended: false
    },
    {
      name: "عضوية ماستر VIP",
      price: "2,499 ريال",
      period: "سنوياً",
      features: [
        "خصم 25% على جميع الخدمات",
        "أولوية قصوى في التنفيذ",
        "دعم فني VIP على مدار الساعة",
        "مستشار أكاديمي مخصص",
        "خدمة ترجمة مجانية شهرياً",
        "تدقيق لغوي مجاني",
        "وصول مبكر للخدمات الجديدة",
        "ورش عمل حصرية"
      ],
      missingFeatures: [],
      color: "from-yellow-500 to-yellow-600",
      recommended: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">قارن واختر الأفضل</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              مقارنات الخدمات
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              قارن بين خدماتنا المختلفة واختر الأنسب لاحتياجاتك الأكاديمية والبحثية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison Tabs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="translation" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto gap-2">
              <TabsTrigger value="translation" className="flex items-center gap-2 py-3">
                <Globe className="h-4 w-4" />
                <span>خدمات الترجمة</span>
              </TabsTrigger>
              <TabsTrigger value="research" className="flex items-center gap-2 py-3">
                <Search className="h-4 w-4" />
                <span>الخدمات البحثية</span>
              </TabsTrigger>
              <TabsTrigger value="membership" className="flex items-center gap-2 py-3">
                <Crown className="h-4 w-4" />
                <span>خطط العضوية</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2 py-3">
                <Calculator className="h-4 w-4" />
                <span>الأسعار</span>
              </TabsTrigger>
            </TabsList>

            {/* Translation Services Comparison */}
            <TabsContent value="translation" id="translation">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {translationServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4`}>
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl mb-4">{service.name}</CardTitle>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">السرعة:</span>
                            <span className="font-semibold">{service.speed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الدقة:</span>
                            <span className="font-semibold">{service.accuracy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">السعر:</span>
                            <span className="font-semibold">{service.price}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">المميزات:</h4>
                            <ul className="space-y-2">
                              {service.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {service.missingFeatures.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 text-sm text-muted-foreground">غير متوفر:</h4>
                              <ul className="space-y-2">
                                {service.missingFeatures.map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Research Services Comparison */}
            <TabsContent value="research" id="research">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {researchServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4`}>
                          <Search className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl mb-4">{service.name}</CardTitle>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">المدة:</span>
                            <span className="font-semibold">{service.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الجودة:</span>
                            <span className="font-semibold">{service.quality}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">السعر:</span>
                            <span className="font-semibold">{service.price}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">المميزات:</h4>
                            <ul className="space-y-2">
                              {service.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {service.missingFeatures.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 text-sm text-muted-foreground">غير متوفر:</h4>
                              <ul className="space-y-2">
                                {service.missingFeatures.map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Membership Plans Comparison */}
            <TabsContent value="membership" id="membership">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {membershipPlans.map((plan, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {plan.recommended && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-l from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>الأكثر شعبية</span>
                        </div>
                      </div>
                    )}
                    <Card className={`h-full border-2 hover:shadow-xl transition-all duration-300 ${plan.recommended ? 'border-yellow-500 shadow-lg' : 'hover:border-primary/50'}`}>
                      <CardHeader>
                        <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                        <div className="mb-4">
                          <span className="text-3xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground text-sm mr-2">/ {plan.period}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3 text-sm">المميزات المتاحة:</h4>
                            <ul className="space-y-2">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {plan.missingFeatures.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3 text-sm text-muted-foreground">غير متوفر:</h4>
                              <ul className="space-y-2">
                                {plan.missingFeatures.map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <Button 
                            className={`w-full mt-4 ${plan.recommended ? 'bg-gradient-to-l from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' : ''}`}
                            onClick={() => navigate('/master-membership')}
                          >
                            اشترك الآن
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Pricing Comparison */}
            <TabsContent value="pricing" id="pricing">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-primary" />
                    مقارنة الأسعار والباقات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2">
                          <th className="text-right py-4 px-4 font-bold">الخدمة</th>
                          <th className="text-center py-4 px-4 font-bold">السعر الأساسي</th>
                          <th className="text-center py-4 px-4 font-bold">مع بلاتينيوم (خصم 15%)</th>
                          <th className="text-center py-4 px-4 font-bold">مع ماستر VIP (خصم 25%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "ترجمة 1000 كلمة", base: "200 ريال", platinum: "170 ريال", vip: "150 ريال" },
                          { name: "التحليل الإحصائي", base: "500 ريال", platinum: "425 ريال", vip: "375 ريال" },
                          { name: "المراجعة اللغوية", base: "300 ريال", platinum: "255 ريال", vip: "225 ريال" },
                          { name: "نشر في مجلة علمية", base: "2000 ريال", platinum: "1700 ريال", vip: "1500 ريال" }
                        ].map((row, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-4 px-4 font-semibold">{row.name}</td>
                            <td className="text-center py-4 px-4">{row.base}</td>
                            <td className="text-center py-4 px-4 text-blue-600 font-semibold">{row.platinum}</td>
                            <td className="text-center py-4 px-4 text-yellow-600 font-semibold">{row.vip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Shield className="inline h-4 w-4 ml-1" />
                      جميع الأسعار تشمل ضريبة القيمة المضافة. الأسعار قابلة للتغيير حسب تعقيد المشروع ومتطلباته الخاصة.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Target className="h-16 w-16 mx-auto mb-6 text-white/90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              اختر الخدمة المناسبة لك
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              لم تجد ما تبحث عنه؟ تواصل معنا وسنساعدك في اختيار الخدمة الأنسب لاحتياجاتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-xl"
                onClick={() => navigate('/contact-us')}
              >
                تواصل معنا
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold rounded-xl"
                onClick={() => navigate('/pricing')}
              >
                احسب التكلفة
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceComparisons;
