import { motion } from "framer-motion";
import { BookOpen, CheckCircle, ArrowLeft, Download, Play, FileText, Clock, Star, Users, Shield, Zap, Target, MessageSquare, Award, TrendingUp, Phone, Mail, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";

const ClientGuide = () => {
  const guideSteps = [
    {
      step: 1,
      title: "التخطيط والاستعداد",
      description: "تحديد احتياجاتك وإعداد المواد للحصول على أفضل النتائج",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      details: [
        "حدد نوع الخدمة المطلوبة (ترجمة، توطين، مراجعة)",
        "اختر اللغات المصدر والمستهدفة بدقة",
        "حدد الجمهور المستهدف والسياق الثقافي المناسب",
        "اجمع جميع المواد والوثائق ذات الصلة",
        "حدد المواعيد النهائية والأولويات الزمنية"
      ],
      tips: [
        "كلما كانت المعلومات أكثر تفصيلاً، كانت النتيجة أفضل وأدق",
        "شارك أي مراجع أو مصطلحات خاصة بمجال عملك",
        "حدد ميزانيتك المتوقعة مسبقاً لتجنب المفاجآت"
      ]
    },
    {
      step: 2,
      title: "طلب عرض السعر",
      description: "الحصول على تقدير دقيق ومفصل للمشروع",
      icon: FileText,
      color: "from-green-500 to-green-600",
      details: [
        "املأ نموذج طلب الخدمة بالتفاصيل الكاملة والدقيقة",
        "أرفق عينات واضحة من المواد المراد ترجمتها",
        "حدد مستوى الجودة المطلوب والمعايير الخاصة",
        "اختر الخدمات الإضافية (تدقيق، تنسيق، شهادات)",
        "انتظر العرض المفصل والمدروس خلال 2-24 ساعة"
      ],
      tips: [
        "عينات أكبر وأوضح تعطي تقديرات أكثر دقة وشمولية",
        "اسأل عن الخصومات المتاحة للمشاريع الكبيرة أو المتكررة",
        "استفسر عن إمكانية التسليم المرحلي للمشاريع الضخمة"
      ]
    },
    {
      step: 3,
      title: "بداية المشروع",
      description: "الموافقة على العرض والبدء الفعلي في العمل",
      icon: Play,
      color: "from-purple-500 to-purple-600",
      details: [
        "راجع العرض والشروط والاتفاقية بعناية فائقة",
        "وقع العقد أو اتفاقية الخدمة بعد فهم جميع البنود",
        "أرسل جميع المواد النهائية بالتنسيقات المطلوبة",
        "قدم أي تعليمات أو متطلبات خاصة إضافية",
        "احصل على تأكيد رسمي ببداية العمل والجدول الزمني"
      ],
      tips: [
        "تأكد من وضوح جميع المتطلبات والتوقعات من الطرفين",
        "اسأل عن جدول التسليم التفصيلي والمراحل الوسطية",
        "احتفظ بنسخ احتياطية آمنة من جميع الملفات المرسلة"
      ]
    },
    {
      step: 4,
      title: "المتابعة والمراجعة",
      description: "ضمان الجودة والتواصل المستمر طوال فترة العمل",
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      details: [
        "تلقي تحديثات دورية ومنتظمة عن تقدم العمل",
        "مراجعة النماذج الأولية والعينات (عند الاقتضاء)",
        "تقديم ملاحظات واستفسارات بناءة وواضحة",
        "الموافقة على المراحل المكتملة بعد المراجعة الدقيقة",
        "التواصل المستمر مع فريق العمل لضمان أفضل النتائج"
      ],
      tips: [
        "لا تتردد في طرح الأسئلة أو طلب التوضيحات في أي وقت",
        "راجع العمل بعناية وتمعن قبل الموافقة النهائية عليه",
        "اطلب توضيحات مفصلة للمصطلحات المعقدة أو المتخصصة"
      ]
    },
    {
      step: 5,
      title: "التسليم والمتابعة",
      description: "استلام العمل النهائي والاستفادة من الخدمات اللاحقة",
      icon: Download,
      color: "from-red-500 to-red-600",
      details: [
        "استلام جميع الملفات النهائية بالتنسيقات المطلوبة",
        "إجراء مراجعة شاملة ونهائية للعمل المنجز",
        "طلب تعديلات أو تحسينات إضافية إن لزم الأمر",
        "تقييم الخدمة المقدمة وتقديم ملاحظات بناءة",
        "الاستفادة الكاملة من فترة الضمان والدعم الفني"
      ],
      tips: [
        "احتفظ بنسخ منظمة ومؤرشفة من جميع الملفات المستلمة",
        "استفد بشكل كامل من فترة الضمان لأي تعديلات مطلوبة",
        "فكر مسبقاً في خدمات المتابعة والتطوير المستقبلية"
      ]
    }
  ];

  const serviceTypes = [
    {
      title: "الترجمة التحريرية المتخصصة",
      description: "ترجمة النصوص والوثائق الرسمية بأعلى معايير الجودة والدقة المهنية",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      features: ["دقة تصل إلى 99.8%", "مراجعة ثلاثية المستويات", "تسليم سريع ومضمون"],
      suitable: "المستندات الحكومية، العقود القانونية، المحتوى التسويقي، الوثائق التقنية المتخصصة",
      price: "يبدأ من 15 ريال/صفحة"
    },
    {
      title: "التوطين الثقافي المتقدم",
      description: "تكييف المحتوى بعناية فائقة ليناسب الثقافة والعادات المحلية للجمهور المستهدف",
      icon: Globe,
      color: "from-green-500 to-green-600",
      features: ["تكييف ثقافي شامل", "اختبار تجربة المستخدم", "استشارات محلية متخصصة"],
      suitable: "المواقع الإلكترونية التجارية، التطبيقات الذكية، الحملات الإعلانية، المنتجات الرقمية",
      price: "حسب المشروع"
    },
    {
      title: "الترجمة الفورية الاحترافية",
      description: "خدمات ترجمة فورية عالية الجودة للمؤتمرات والاجتماعات والفعاليات الرسمية",
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      features: ["متوفرة على مدار الساعة", "مترجمون معتمدون دولياً", "تقنيات صوتية متطورة"],
      suitable: "المؤتمرات الدولية، الاجتماعات التنفيذية، الفعاليات الحكومية، المناسبات الرسمية",
      price: "250 ريال/ساعة"
    }
  ];

  const qualityFeatures = [
    {
      title: "ضمان الجودة المطلقة",
      description: "مراجعة ثلاثية المستويات مع ضمان شامل لمدة 30 يوماً كاملة",
      icon: Shield,
      color: "text-green-600",
      stats: "99.8% معدل الدقة"
    },
    {
      title: "فريق النخبة المتخصص",
      description: "أكثر من 128 خبير ومترجم معتمد دولياً في جميع التخصصات",
      icon: Users,
      color: "text-blue-600",
      stats: "+128 خبير معتمد"
    },
    {
      title: "التسليم السريع والمضمون",
      description: "التزام صارم بالمواعيد النهائية مع إمكانية التسليم العاجل عند الطلب",
      icon: Clock,
      color: "text-purple-600",
      stats: "تسليم في الوقت المحدد 100%"
    },
    {
      title: "تقييمات وثقة العملاء",
      description: "معدل رضا استثنائي يصل إلى 98% مع آلاف التقييمات الإيجابية",
      icon: Star,
      color: "text-yellow-600",
      stats: "98% معدل رضا العملاء"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "الترجمة الأولية المتخصصة",
      description: "مترجم خبير معتمد يقوم بالترجمة الأولية وفقاً لأعلى المعايير الدولية والاحترافية",
      color: "bg-green-100 text-green-600"
    },
    {
      number: "02", 
      title: "المراجعة اللغوية الدقيقة",
      description: "مراجع لغوي مستقل ومتخصص يدقق الترجمة ويحسن التعبير والأسلوب اللغوي",
      color: "bg-blue-100 text-blue-600"
    },
    {
      number: "03",
      title: "التدقيق النهائي والمراجعة الشاملة", 
      description: "فحص نهائي شامل للتأكد من دقة المعنى والسلامة اللغوية والتنسيق المثالي",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6"
            >
              <BookOpen className="h-10 w-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-arabic-title">
              دليل العملاء الشامل
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
              رحلتك المتكاملة للحصول على أفضل الخدمات اللغوية والترجمة الاحترافية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                ابدأ مشروعك الآن
                <ArrowLeft className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                تحدث مع خبير
                <Phone className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="process" className="w-full" dir="rtl">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 h-12">
              <TabsTrigger value="process" className="text-sm font-semibold">
                <Play className="ml-2 h-4 w-4" />
                خطوات العمل
              </TabsTrigger>
              <TabsTrigger value="services" className="text-sm font-semibold">
                <Globe className="ml-2 h-4 w-4" />
                أنواع الخدمات
              </TabsTrigger>
              <TabsTrigger value="quality" className="text-sm font-semibold">
                <Award className="ml-2 h-4 w-4" />
                ضمان الجودة
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Process Tab */}
          <TabsContent value="process" className="space-y-12">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-4 font-arabic-title">رحلة العمل مع MasterEduPath</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  اتبع هذه الخطوات المدروسة بعناية لضمان الحصول على أفضل النتائج وأعلى مستويات الجودة لمشروعك
                </p>
              </motion.div>
            </div>

            <div className="space-y-8">
              {guideSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${step.color}`}></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-6">
                        <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-3 flex items-center gap-3">
                            <step.icon className="h-7 w-7 text-primary" />
                            {step.title}
                          </CardTitle>
                          <p className="text-slate-600 text-lg leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-4">
                      <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                          <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            التفاصيل والمتطلبات:
                          </h4>
                          <ul className="space-y-3">
                            {step.details.map((detail, idx) => (
                              <motion.li 
                                key={idx} 
                                className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                whileHover={{ x: 5 }}
                              >
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700 leading-relaxed">{detail}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            نصائح الخبراء:
                          </h4>
                          <div className="space-y-3">
                            {step.tips.map((tip, idx) => (
                              <motion.div 
                                key={idx} 
                                className="bg-gradient-to-r from-blue-50 to-purple-50 border-r-4 border-primary rounded-lg p-4 hover:shadow-md transition-all"
                                whileHover={{ scale: 1.02 }}
                              >
                                <p className="text-sm text-blue-800 leading-relaxed font-medium">{tip}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-12">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-4 font-arabic-title">خدماتنا المتميزة والمتخصصة</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  اختر الخدمة المثالية لاحتياجاتك من مجموعة شاملة ومتنوعة من الحلول اللغوية المتقدمة
                </p>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {serviceTypes.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 group border-0 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-20 h-20 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <service.icon className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-xl mb-3 leading-relaxed">{service.title}</CardTitle>
                      <p className="text-slate-600 leading-relaxed">{service.description}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          المميزات الرئيسية:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-500" />
                          مناسب لـ:
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{service.suitable}</p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">السعر:</span>
                          <span className="text-primary font-bold">{service.price}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-6 group-hover:shadow-lg transition-all">
                        اطلب هذه الخدمة الآن
                        <ArrowLeft className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-12">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-4 font-arabic-title">التميز والجودة المضمونة</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  نحن لا نقدم مجرد وعود، بل نحقق معايير الجودة العالمية في كل مشروع نتعامل معه
                </p>
              </motion.div>
            </div>

            {/* Quality Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {qualityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center shadow-xl hover:shadow-2xl transition-all duration-300 border-0 h-full">
                    <CardContent className="pt-8 pb-6 space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-4">
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">{feature.description}</p>
                      <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg p-3">
                        <span className="text-xs font-bold text-primary">{feature.stats}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quality Process */}
            <Card className="bg-gradient-to-br from-slate-100 via-white to-blue-50 border-0 shadow-xl">
              <CardContent className="py-12">
                <div className="max-w-6xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                  >
                    <h3 className="text-3xl font-bold mb-4 font-arabic-title">نظام ضمان الجودة الثلاثي المتقدم</h3>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                      عملية مدروسة بعناية تضمن أعلى مستويات الدقة والجودة في كل مشروع
                    </p>
                  </motion.div>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    {processSteps.map((process, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center group"
                      >
                        <div className={`w-20 h-20 ${process.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                          <span className="text-2xl font-bold">{process.number}</span>
                        </div>
                        <h4 className="font-bold text-lg mb-4">{process.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{process.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-12 text-white"
            >
              <h3 className="text-3xl font-bold mb-4">جاهز لبدء مشروعك؟</h3>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                انضم إلى آلاف العملاء الراضين واحصل على خدمات لغوية متميزة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  احصل على عرض سعر مجاني
                  <Mail className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  تحدث مع خبير
                  <Phone className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientGuide;