import { motion } from "framer-motion";
import { BookOpen, CheckCircle, ArrowRight, Download, Play, FileText, Clock, Star, Users, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClientGuide = () => {
  const guideSteps = [
    {
      step: 1,
      title: "التخطيط والاستعداد",
      description: "تحديد احتياجاتك وإعداد المواد",
      icon: BookOpen,
      details: [
        "حدد نوع الخدمة المطلوبة (ترجمة، توطين، مراجعة)",
        "اختر اللغات المصدر والمستهدفة",
        "حدد الجمهور المستهدف والسياق الثقافي",
        "جمع جميع المواد والوثائق ذات الصلة",
        "تحديد المواعيد النهائية والأولويات"
      ],
      tips: [
        "كلما كانت المعلومات أكثر تفصيلاً، كانت النتيجة أفضل",
        "شارك أي مراجع أو مصطلحات خاصة بمجالك",
        "حدد ميزانيتك المتوقعة مسبقاً"
      ]
    },
    {
      step: 2,
      title: "طلب عرض السعر",
      description: "الحصول على تقدير دقيق للمشروع",
      icon: FileText,
      details: [
        "املأ نموذج طلب الخدمة بالتفاصيل الكاملة",
        "أرفق عينات من المواد المراد ترجمتها",
        "حدد مستوى الجودة المطلوب",
        "اختر الخدمات الإضافية (تدقيق، تنسيق، إلخ)",
        "انتظر العرض المفصل خلال 2-24 ساعة"
      ],
      tips: [
        "عينات أكبر تعطي تقديرات أكثر دقة",
        "اسأل عن الخصومات للمشاريع الكبيرة",
        "استفسر عن إمكانية التسليم المرحلي"
      ]
    },
    {
      step: 3,
      title: "بداية المشروع",
      description: "الموافقة والبدء في العمل",
      icon: Play,
      details: [
        "راجع العرض والشروط بعناية",
        "وقع العقد أو اتفاقية الخدمة",
        "أرسل جميع المواد النهائية",
        "قدم أي تعليمات أو متطلبات خاصة",
        "احصل على تأكيد بداية العمل"
      ],
      tips: [
        "تأكد من وضوح جميع المتطلبات",
        "اسأل عن جدول التسليم التفصيلي",
        "احتفظ بنسخ احتياطية من جميع الملفات"
      ]
    },
    {
      step: 4,
      title: "المتابعة والمراجعة",
      description: "ضمان الجودة والتواصل المستمر",
      icon: CheckCircle,
      details: [
        "تلقي تحديثات دورية عن تقدم العمل",
        "مراجعة النماذج الأولية (إن وجدت)",
        "تقديم ملاحظات واستفسارات",
        "الموافقة على المراحل المكتملة",
        "استلام النسخة النهائية"
      ],
      tips: [
        "لا تتردد في طرح الأسئلة",
        "راجع العمل بعناية قبل الموافقة النهائية",
        "اطلب توضيحات للمصطلحات المعقدة"
      ]
    },
    {
      step: 5,
      title: "التسليم والمتابعة",
      description: "استلام العمل النهائي والخدمات اللاحقة",
      icon: Download,
      details: [
        "استلام جميع الملفات بالتنسيقات المطلوبة",
        "مراجعة شاملة للعمل المنجز",
        "طلب تعديلات إضافية إن لزم الأمر",
        "تقييم الخدمة وتقديم الملاحظات",
        "الاستفادة من فترة الضمان"
      ],
      tips: [
        "احتفظ بنسخ من جميع الملفات",
        "استفد من فترة الضمان لأي تعديلات",
        "فكر في خدمات المتابعة المستقبلية"
      ]
    }
  ];

  const serviceTypes = [
    {
      title: "الترجمة التحريرية",
      description: "ترجمة النصوص والوثائق بأعلى معايير الجودة",
      icon: FileText,
      features: ["دقة 99.8%", "مراجعة مزدوجة", "تسليم سريع"],
      suitable: "المستندات الرسمية، المحتوى التسويقي، الوثائق التقنية"
    },
    {
      title: "التوطين الثقافي",
      description: "تكييف المحتوى ليناسب الثقافة المحلية",
      icon: Users,
      features: ["تكييف ثقافي", "اختبار المستخدم", "استشارة محلية"],
      suitable: "المواقع الإلكترونية، التطبيقات، المواد الإعلانية"
    },
    {
      title: "الترجمة الفورية",
      description: "خدمات ترجمة فورية للاجتماعات والمؤتمرات",
      icon: Zap,
      features: ["متوفرة 24/7", "مترجمون معتمدون", "جودة صوتية عالية"],
      suitable: "المؤتمرات، الاجتماعات، الفعاليات الرسمية"
    }
  ];

  const qualityFeatures = [
    {
      title: "ضمان الجودة",
      description: "مراجعة ثلاثية المستويات وضمان 30 يوماً",
      icon: Shield,
      color: "text-green-600"
    },
    {
      title: "فريق متخصص",
      description: "128 خبير ومترجم معتمد في مختلف المجالات",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "تسليم سريع",
      description: "التزام بالمواعيد مع إمكانية التسليم العاجل",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "تقييم ممتاز",
      description: "معدل رضا العملاء 98% وتقييمات إيجابية",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      {/* Header Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6"
            >
              <BookOpen className="h-10 w-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl font-bold mb-6 font-arabic-title">
              دليل العملاء الشامل
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              كل ما تحتاج معرفته للاستفادة القصوى من خدماتنا وضمان نجاح مشروعك
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="process" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="process">خطوات العمل</TabsTrigger>
              <TabsTrigger value="services">أنواع الخدمات</TabsTrigger>
              <TabsTrigger value="quality">ضمان الجودة</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="process">
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">خطوات العمل مع MasterEduPath</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  اتبع هذه الخطوات البسيطة لضمان الحصول على أفضل النتائج لمشروعك
                </p>
              </div>

              <div className="space-y-8">
                {guideSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2 flex items-center gap-3">
                              <step.icon className="h-6 w-6 text-primary" />
                              {step.title}
                            </CardTitle>
                            <p className="text-slate-600">{step.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="grid lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2">
                            <h4 className="font-semibold mb-3 text-slate-800">التفاصيل:</h4>
                            <ul className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3 text-slate-800">نصائح مهمة:</h4>
                            <div className="space-y-2">
                              {step.tips.map((tip, idx) => (
                                <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <p className="text-sm text-blue-800">{tip}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">أنواع خدماتنا</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  اختر النوع المناسب لاحتياجاتك من مجموعة متنوعة من الخدمات المتخصصة
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {serviceTypes.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardHeader>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <service.icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                          <p className="text-slate-600">{service.description}</p>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3">المميزات:</h4>
                            <div className="flex flex-wrap gap-2">
                              {service.features.map((feature, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">مناسب لـ:</h4>
                            <p className="text-sm text-slate-600">{service.suitable}</p>
                          </div>
                          
                          <Button className="w-full mt-4">
                            اطلب هذه الخدمة
                            <ArrowRight className="mr-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quality">
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">لماذا نضمن الجودة؟</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  نحن نؤمن بأن الجودة ليست مجرد وعد، بل التزام نحققه في كل مشروع
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {qualityFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6">
                        <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-slate-100 to-blue-50 border-none">
                <CardContent className="py-12">
                  <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-8">عملية ضمان الجودة المتقدمة</h3>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-green-600">1</span>
                        </div>
                        <h4 className="font-semibold mb-2">الترجمة الأولى</h4>
                        <p className="text-sm text-slate-600">مترجم متخصص معتمد يقوم بالترجمة الأولية وفقاً لأعلى المعايير</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-blue-600">2</span>
                        </div>
                        <h4 className="font-semibold mb-2">المراجعة اللغوية</h4>
                        <p className="text-sm text-slate-600">مراجع لغوي مستقل يدقق الترجمة ويحسن التعبير والأسلوب</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-purple-600">3</span>
                        </div>
                        <h4 className="font-semibold mb-2">التدقيق النهائي</h4>
                        <p className="text-sm text-slate-600">خبير جودة يراجع العمل نهائياً ويضمن مطابقته لجميع المتطلبات</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
                  <CardContent className="py-12">
                    <Shield className="h-16 w-16 mx-auto mb-6 opacity-80" />
                    <h3 className="text-3xl font-bold mb-4">ضمان شامل لراحة بالك</h3>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                      نضمن لك جودة استثنائية أو نعيد لك أموالك كاملة - هذا وعدنا لك
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" variant="secondary" className="text-primary">
                        ابدأ مشروعك الآن
                      </Button>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                        تحدث مع مستشار
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientGuide;