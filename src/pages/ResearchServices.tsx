import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, FileText, BarChart3, Search, CheckCircle, Layout, Shield, GraduationCap, 
  Database, Cog, Scale, Globe, Users, Award, Brain, Lightbulb, Target, TrendingUp, 
  Star, Zap, Rocket, Trophy, ArrowRight, Clock, CheckCheck, Sparkles, Medal,
  BookMarked, PenTool, FlaskConical, Microscope, Calculator, Eye, FileCheck,
  University, UserCheck, Library, Settings, Crown, Gem, Phone
} from "lucide-react";

const ResearchServices = () => {
  const services = [
    {
      id: "thesis-titles",
      title: "اقتراح عناوين رسائل ماجستير ودكتوراه",
      description: "ابتكار عناوين مميزة وقابلة للتطبيق مع خطة بحثية مبدئية شاملة تضمن النجاح الأكاديمي وتواكب أحدث الاتجاهات البحثية العالمية",
      icon: <GraduationCap className="h-8 w-8" />,
      color: "primary",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
      href: "/research/thesis-titles",
      stats: "2000+ عنوان مقترح",
      features: ["عناوين مبتكرة", "خطة أولية", "مراجعة متخصصة", "توجيه أكاديمي"],
      duration: "3-5 أيام"
    },
    {
      id: "research-plan",
      title: "المساعدة في كتابة خطة البحث",
      description: "إعداد خطط بحثية متكاملة تشمل المنهجية العلمية وتصميم البحث بأعلى المعايير الأكاديمية مع الالتزام بمتطلبات الجامعات العالمية",
      icon: <FileText className="h-8 w-8" />,
      color: "secondary",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
      href: "/research/research-plan",
      stats: "1500+ خطة بحثية",
      features: ["منهجية علمية", "تصميم متكامل", "مراجعة أكاديمية", "ضمان الجودة"],
      duration: "7-10 أيام"
    },
    {
      id: "theoretical-framework",
      title: "كتابة الإطار النظري والأدبيات",
      description: "بناء إطار نظري قوي ومتماسك يربط النظريات بمشكلة البحث مع مراجعة شاملة للأدبيات السابقة وتحليل نقدي معمق",
      icon: <BookOpen className="h-8 w-8" />,
      color: "success",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
      href: "/research/theoretical-framework",
      stats: "800+ إطار نظري",
      features: ["مراجعة أدبية", "ربط نظري", "تحليل شامل", "مصادر حديثة"],
      duration: "10-14 يوم"
    },
    {
      id: "statistical-analysis",
      title: "التحليل الإحصائي ومناقشة النتائج",
      description: "تحليل إحصائي متقدم للبيانات باستخدام أحدث البرامج الإحصائية مع كتابة مناقشة علمية عميقة وتفسير احترافي للنتائج",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "primary",
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
      href: "/research/statistical-analysis",
      stats: "1200+ تحليل إحصائي",
      features: ["SPSS & R", "تحليل متقدم", "مناقشة علمية", "رسوم بيانية"],
      duration: "5-8 أيام"
    },
    {
      id: "language-review",
      title: "التدقيق اللغوي والمراجعة الأكاديمية",
      description: "مراجعة لغوية شاملة على يد خبراء متخصصين تشمل التدقيق النحوي والأسلوبي مع تحسين الوضوح والتماسك النصي الأكاديمي",
      icon: <CheckCircle className="h-8 w-8" />,
      color: "secondary",
      gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
      href: "/research/language-review",
      stats: "3000+ مراجعة لغوية",
      features: ["تدقيق شامل", "تحسين أسلوبي", "مراجعة نهائية", "ضمان الجودة"],
      duration: "3-5 أيام"
    },
    {
      id: "formatting",
      title: "تنسيق الرسائل العلمية الاحترافي",
      description: "تنسيق احترافي متكامل للرسائل العلمية وفقاً للمعايير الدولية مع تصميم بصري أنيق يراعي معايير الجامعات العالمية",
      icon: <Layout className="h-8 w-8" />,
      color: "success",
      gradient: "bg-gradient-to-br from-rose-500 to-pink-600",
      href: "/research/formatting",
      stats: "2500+ رسالة منسقة",
      features: ["معايير دولية", "تصميم أنيق", "تنسيق شامل", "جاهز للطباعة"],
      duration: "2-4 أيام"
    }
  ];

  const premiumServices = [
    {
      id: "plagiarism-check",
      title: "فحص السرقة الأدبية المتقدم",
      description: "فحص دقيق ومتقدم للتأكد من الأصالة العلمية باستخدام أحدث الأدوات والتقنيات المتخصصة عالمياً",
      icon: <Shield className="h-8 w-8" />,
      gradient: "bg-gradient-to-br from-amber-500 to-yellow-600",
      href: "/research/plagiarism-check",
      stats: "5000+ فحص أصالة",
      features: ["Turnitin Premium", "تقرير مفصل", "ضمان الأصالة", "استشارة تصحيح"],
      isPremium: true
    },
    {
      id: "admission-services",
      title: "خدمات القبول الجامعي الدولي",
      description: "مساعدة شاملة للحصول على قبولات جامعية ودورات لغة في أفضل المؤسسات التعليمية العالمية المرموقة",
      icon: <Globe className="h-8 w-8" />,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      href: "/research/admission-services",
      stats: "1000+ قبول جامعي",
      features: ["جامعات عالمية", "دورات لغة", "إرشاد شامل", "متابعة كاملة"],
      isPremium: true
    },
    {
      id: "publication",
      title: "نشر الأبحاث في المجلات العلمية",
      description: "مساعدة متكاملة في نشر البحوث في المجلات العلمية المحكمة مع إرشاد متخصص في اختيار المجلة المناسبة",
      icon: <Award className="h-8 w-8" />,
      gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
      href: "/research/publication",
      stats: "400+ بحث منشور",
      features: ["مجلات محكمة", "اختيار مناسب", "متابعة كاملة", "ضمان النشر"],
      isPremium: true
    }
  ];

  const stats = [
    {
      number: "15,000+",
      label: "مشروع بحثي مكتمل",
      icon: <Trophy className="h-8 w-8" />,
      color: "text-blue-600"
    },
    {
      number: "98%",
      label: "معدl رضا العملاء",
      icon: <Star className="h-8 w-8" />,
      color: "text-orange-500"
    },
    {
      number: "500+",
      label: "باحث وأكاديمي متخصص",
      icon: <Users className="h-8 w-8" />,
      color: "text-green-600"
    },
    {
      number: "50+",
      label: "تخصص أكاديمي مغطى",
      icon: <BookOpen className="h-8 w-8" />,
      color: "text-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "د. محمد العلي",
      role: "دكتوراه في إدارة الأعمال - جامعة الملك سعود",
      text: "الخدمة كانت استثنائية بكل المقاييس. ساعدوني في إنجاز رسالة الدكتوراه بجودة عالية وفي الوقت المحدد. فريق محترف ومتعاون.",
      rating: 5,
      avatar: "👨‍🎓"
    },
    {
      name: "أ. فاطمة أحمد",
      role: "ماجستير في التربية - الجامعة الأمريكية",
      text: "فريق محترف جداً ومتفهم لاحتياجات الباحثين. الإطار النظري الذي أعدوه كان شاملاً ومتميزاً وساهم في نجاح رسالتي.",
      rating: 5,
      avatar: "👩‍🎓"
    },
    {
      name: "د. عبدالله السالم",
      role: "دكتوراه في الطب - جامعة هارفارد",
      text: "التحليل الإحصائي كان دقيقاً ومفصلاً بشكل رائع. ساهم بشكل كبير في نجاح بحثي ونشره في مجلة علمية مرموقة.",
      rating: 5,
      avatar: "🩺"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "استشارة مجانية متخصصة",
      description: "جلسة استشارة شاملة مع خبراء أكاديميين لفهم احتياجاتك البحثية وتحديد الخطة المثلى",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      step: "02",
      title: "وضع خطة العمل التفصيلية",
      description: "إعداد خطة عمل مفصلة مع جدول زمني واضح وتحديد المراحل والمسؤوليات",
      icon: <Target className="h-6 w-6" />,
      color: "bg-orange-500"
    },
    {
      step: "03",
      title: "التنفيذ المتقن والمتابعة",
      description: "فريق متخصص من الخبراء ينفذ العمل بأعلى معايير الجودة الأكاديمية مع متابعة مستمرة",
      icon: <Rocket className="h-6 w-6" />,
      color: "bg-green-500"
    },
    {
      step: "04",
      title: "المراجعة والتسليم النهائي",
      description: "مراجعة شاملة متعددة المستويات وتسليم العمل مع ضمان الجودة والدعم المستمر",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "bg-purple-500"
    }
  ];

  const certifications = [
    { name: "ISO 9001:2015", desc: "إدارة الجودة" },
    { name: "Academic Standards", desc: "المعايير الأكاديمية" },
    { name: "Research Ethics", desc: "أخلاقيات البحث" },
    { name: "Quality Assurance", desc: "ضمان الجودة" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Enhanced Academic Design */}
      <section className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
          
          {/* Academic Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            {/* Academic Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 animate-glow">
              <Brain className="h-12 w-12 text-white animate-pulse-soft" />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-arabic-title font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                وكالة ماستر إيدو باث
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 bg-clip-text text-transparent">
                MasterEduPath Agency
              </span>
            </h1>
            
            <p className="text-lg md:text-xl max-w-4xl mx-auto mb-12 font-arabic-body leading-relaxed text-blue-100">
              نحن نقود ثورة في عالم البحث العلمي، نقدم خدمات متكاملة تضمن التميز الأكاديمي 
              ونساعد الباحثين على تحقيق أحلامهم العلمية بأعلى معايير الجودة العالمية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-blue-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105">
                <Zap className="h-5 w-5 ml-2" />
                ابدأ رحلتك البحثية الآن
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4 rounded-full font-bold transition-all duration-300">
                <Users className="h-5 w-5 ml-2" />
                تحدث مع خبير
              </Button>
            </div>

            {/* Floating Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="animate-scale-in bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20" style={{ animationDelay: `${index * 200 + 1000}ms` }}>
                  <div className={`${stat.color} mb-3 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="py-24 relative bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <Crown className="h-4 w-4" />
              خدماتنا المتخصصة عالمياً
            </div>
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-slate-800 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              حلول أكاديمية متكاملة
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              نقدم مجموعة شاملة من الخدمات الأكاديمية والبحثية المتطورة التي تواكب أحدث المعايير العالمية
              وتضمن تحقيق أهدافكم العلمية بتميز واحترافية
            </p>
          </div>

          {/* Main Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <Card key={service.id} className="group hover:shadow-2xl transition-all duration-500 animate-fade-in-up border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden hover:-translate-y-2" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="text-center relative z-10 pb-4">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${service.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-arabic-title font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-3">
                    {service.title}
                  </CardTitle>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {service.stats}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {service.duration}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="text-center relative z-10 pt-0">
                  <CardDescription className="text-slate-600 mb-6 font-arabic-body leading-relaxed">
                    {service.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {service.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-center mb-6">
                    <span className="text-sm font-medium text-slate-500">مدة الإنجاز: {service.duration}</span>
                  </div>

                  <Button asChild className={`w-full ${service.gradient} text-white border-0 hover:opacity-90 shadow-lg rounded-full font-bold group-hover:scale-105 transition-transform duration-300`}>
                    <a href={service.href}>
                      <ArrowRight className="h-4 w-4 ml-2" />
                      استكشف الخدمة
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Premium Services */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-8 mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Gem className="h-4 w-4" />
                خدمات مميزة
              </div>
              <h3 className="text-3xl font-arabic-title font-bold text-slate-800 mb-4">
                خدمات النخبة الأكاديمية
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumServices.map((service, index) => (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-300 bg-white/90">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${service.gradient} flex items-center justify-center text-white shadow-lg`}>
                      {service.icon}
                    </div>
                    <CardTitle className="text-lg font-arabic-title font-bold text-slate-800 mb-2">
                      {service.title}
                    </CardTitle>
                    <div className="text-sm text-amber-600 font-medium">
                      {service.stats}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="text-center pt-0">
                    <CardDescription className="text-slate-600 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {service.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-amber-300 text-amber-700">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 rounded-full font-bold">
                      <a href={service.href}>
                        <Medal className="h-4 w-4 ml-2" />
                        اطلب الآن
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold mb-8">
              رحلتك الأكاديمية معنا
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              نتبع منهجية علمية مدروسة لضمان تحقيق أفضل النتائج الأكاديمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className={`w-16 h-16 mx-auto mb-6 ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {step.icon}
                </div>
                <div className="text-3xl font-bold mb-4 text-blue-400">{step.step}</div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-slate-800 mb-8">
              شهادات عملائنا المتميزين
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              آراء الباحثين والأكاديميين الذين حققوا النجاح معنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                      <p className="text-sm text-slate-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-arabic-body">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Trust */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-arabic-title font-bold text-slate-800 mb-4">
              شهادات الجودة والاعتماد
            </h3>
            <p className="text-slate-600">نلتزم بأعلى معايير الجودة الأكاديمية العالمية</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{cert.name}</h4>
                <p className="text-sm text-slate-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-arabic-title font-bold mb-8">
            ابدأ رحلتك الأكاديمية اليوم
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            انضم إلى آلاف الباحثين الذين حققوا النجاح الأكاديمي مع خبرائنا المتميزين
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-blue-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold">
              <Sparkles className="h-5 w-5 ml-2" />
              احجز استشارة مجانية
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full font-bold">
              <Phone className="h-5 w-5 ml-2" />
              تواصل معنا الآن
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResearchServices;