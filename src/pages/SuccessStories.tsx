import { motion } from "framer-motion";
import { Star, ArrowRight, Trophy, Users, Clock, Target, CheckCircle, Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SuccessStories = () => {
  const successStories = [
    {
      id: 1,
      title: "توطين منصة تعليمية عالمية للسوق العربية",
      client: "EdTech Global Solutions",
      industry: "التعليم التقني",
      challenge: "شركة تقنية عالمية أرادت دخول السوق العربية بمنصة تعليمية متقدمة تتضمن أكثر من 500 مقرر دراسي ومحتوى تفاعلي معقد",
      solution: "قمنا بتوطين كامل للمنصة شمل الترجمة، التكييف الثقافي، واختبار تجربة المستخدم العربية",
      results: [
        "زيادة معدل التسجيل بنسبة 340% في الأشهر الستة الأولى",
        "تحقيق رضا المستخدمين بنسبة 96% في استطلاع رضا العملاء",
        "توفير 8 أشهر من الوقت مقارنة بالجدول الزمني المتوقع",
        "زيادة معدل إتمام المقررات بنسبة 89%"
      ],
      duration: "4 أشهر",
      wordsCount: "2.5 مليون كلمة",
      languages: ["العربية", "الإنجليزية"],
      rating: 5,
      testimonial: "MasterEduPath لم يقوموا بالترجمة فقط، بل فهموا ثقافتنا وساعدونا في بناء جسر حقيقي مع الجمهور العربي. النتائج تجاوزت كل توقعاتنا.",
      clientImage: "/api/placeholder/400/400",
      companyLogo: "/api/placeholder/200/100",
      featured: true
    },
    {
      id: 2,
      title: "ترجمة مجموعة عقود قانونية دولية معقدة",
      client: "مجموعة الشركات القانونية الدولية",
      industry: "القانون والاستشارات",
      challenge: "ترجمة أكثر من 200 عقد قانوني معقد من الإنجليزية والفرنسية إلى العربية مع ضمان الدقة القانونية الكاملة",
      solution: "فريق متخصص من المترجمين القانونيين المعتمدين مع مراجعة من محامين متخصصين",
      results: [
        "إنجاز المشروع قبل الموعد المحدد بـ 3 أسابيع",
        "دقة قانونية 100% بدون أي تعديلات مطلوبة",
        "توفير 60% من التكلفة مقارنة بالمكاتب القانونية المحلية",
        "بناء شراكة طويلة المدى مع العميل"
      ],
      duration: "6 أسابيع",
      wordsCount: "800,000 كلمة",
      languages: ["العربية", "الإنجليزية", "الفرنسية"],
      rating: 5,
      testimonial: "الدقة والاحترافية التي قدمها فريق MasterEduPath جعلتنا نثق بهم في جميع مشاريعنا القانونية اللاحقة. خبرتهم في المصطلحات القانونية استثنائية.",
      clientImage: "/api/placeholder/400/400",
      companyLogo: "/api/placeholder/200/100",
      featured: false
    },
    {
      id: 3,
      title: "توطين تطبيق طبي للأطباء في الشرق الأوسط",
      client: "MedApp International",
      industry: "التكنولوجيا الطبية",
      challenge: "تطبيق طبي متقدم يحتاج توطين شامل للأطباء العرب مع الحفاظ على دقة المصطلحات الطبية",
      solution: "فريق من المترجمين الطبيين المتخصصين مع استشاريين أطباء لضمان الدقة السريرية",
      results: [
        "وصول التطبيق لأكثر من 15,000 طبيب في المنطقة",
        "تقييم 4.8 نجوم في متاجر التطبيقات",
        "زيادة الاستخدام اليومي بنسبة 250%",
        "شراكة مع 12 مستشفى رئيسي في المنطقة"
      ],
      duration: "3 أشهر",
      wordsCount: "1.2 مليون كلمة",
      languages: ["العربية", "الإنجليزية"],
      rating: 5,
      testimonial: "فهمهم العميق للمجال الطبي وقدرتهم على التوطين الثقافي جعل تطبيقنا يشعر وكأنه مصمم خصيصاً للأطباء العرب.",
      clientImage: "/api/placeholder/400/400",
      companyLogo: "/api/placeholder/200/100",
      featured: true
    },
    {
      id: 4,
      title: "ترجمة دليل تشغيل مصنع للطاقة المتجددة",
      client: "Green Energy Solutions",
      industry: "الطاقة المتجددة",
      challenge: "ترجمة أدلة تشغيل وصيانة معقدة لمحطة طاقة شمسية بقيمة 500 مليون دولار",
      solution: "فريق متخصص في الترجمة التقنية مع خبراء في مجال الطاقة المتجددة",
      results: [
        "تدريب 200+ مهندس وتقني بنجاح",
        "تشغيل المحطة بدون أي تأخير",
        "تقليل أخطاء التشغيل بنسبة 78%",
        "اعتماد دولي لجودة التوثيق التقني"
      ],
      duration: "8 أسابيع",
      wordsCount: "600,000 كلمة",
      languages: ["العربية", "الإنجليزية", "الألمانية"],
      rating: 5,
      testimonial: "خبرتهم التقنية وفهمهم لمتطلبات الصناعة جعل عملية نقل التكنولوجيا سلسة ومؤثرة.",
      clientImage: "/api/placeholder/400/400",
      companyLogo: "/api/placeholder/200/100",
      featured: false
    }
  ];

  const statistics = [
    {
      number: "500+",
      label: "مشروع ناجح",
      icon: Trophy,
      color: "text-yellow-600"
    },
    {
      number: "98%",
      label: "معدل رضا العملاء",
      icon: Star,
      color: "text-green-600"
    },
    {
      number: "50M+",
      label: "كلمة مترجمة",
      icon: Target,
      color: "text-blue-600"
    },
    {
      number: "120+",
      label: "عميل راض",
      icon: Users,
      color: "text-purple-600"
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
              <Trophy className="h-10 w-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl font-bold mb-6 font-arabic-title">
              قصص النجاح
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              اكتشف كيف ساعدنا عملاءنا في تحقيق أهدافهم وتجاوز توقعاتهم
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                    <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                    <p className="text-slate-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {successStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <Card className={`overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${story.featured ? 'ring-2 ring-primary/20' : ''}`}>
                  <div className="md:flex">
                    <div className="md:w-2/3">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary hover:text-white">
                                {story.industry}
                              </Badge>
                              {story.featured && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  مشروع مميز
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-2xl mb-2">{story.title}</CardTitle>
                            <p className="text-lg text-primary font-semibold">{story.client}</p>
                          </div>
                          <div className="flex text-yellow-500">
                            {[...Array(story.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-current" />
                            ))}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                              <Target className="h-5 w-5 text-red-500" />
                              التحدي
                            </h4>
                            <p className="text-slate-700 leading-relaxed">{story.challenge}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              الحل
                            </h4>
                            <p className="text-slate-700 leading-relaxed">{story.solution}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <Trophy className="h-5 w-5 text-yellow-500" />
                              النتائج المحققة
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {story.results.map((result, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 text-sm">{result}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-lg">
                            <Quote className="h-6 w-6 text-primary mb-2" />
                            <p className="text-slate-700 italic leading-relaxed mb-3">
                              "{story.testimonial}"
                            </p>
                            <p className="text-sm text-slate-500">- {story.client}</p>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <div className="md:w-1/3 bg-gradient-to-br from-slate-100 to-slate-200">
                      <CardContent className="p-6 h-full">
                        <div className="space-y-6">
                          <div className="text-center">
                            <img 
                              src={story.companyLogo} 
                              alt={story.client}
                              className="w-32 h-16 object-contain mx-auto mb-4 bg-white rounded p-2"
                            />
                            <img 
                              src={story.clientImage} 
                              alt="Client"
                              className="w-20 h-20 rounded-full mx-auto object-cover"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="text-center p-3 bg-white rounded-lg">
                              <Clock className="h-6 w-6 text-primary mx-auto mb-1" />
                              <p className="text-sm font-medium">مدة المشروع</p>
                              <p className="text-lg font-bold text-primary">{story.duration}</p>
                            </div>

                            <div className="text-center p-3 bg-white rounded-lg">
                              <Target className="h-6 w-6 text-green-500 mx-auto mb-1" />
                              <p className="text-sm font-medium">حجم المشروع</p>
                              <p className="text-lg font-bold text-green-600">{story.wordsCount}</p>
                            </div>

                            <div className="text-center p-3 bg-white rounded-lg">
                              <Users className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                              <p className="text-sm font-medium">اللغات</p>
                              <div className="flex flex-wrap gap-1 justify-center mt-2">
                                {story.languages.map((lang, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Button className="w-full">
                            مشروع مشابه
                            <ArrowRight className="mr-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16"
          >
            <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
              <CardContent className="py-12">
                <Trophy className="h-16 w-16 mx-auto mb-6 opacity-80" />
                <h3 className="text-3xl font-bold mb-4">هل أنت مستعد لتحقيق قصة نجاح جديدة؟</h3>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                  دعنا نساعدك في تحقيق أهدافك وتجاوز توقعاتك مع خدماتنا المتميزة
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="text-primary">
                    ابدأ مشروعك الآن
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    تحدث مع خبير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;