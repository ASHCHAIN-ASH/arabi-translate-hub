import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, BarChart3, Search, CheckCircle, Layout, Shield, GraduationCap, Database, Cog, Scale, Globe, Users, Award, Brain, Lightbulb, Target, TrendingUp, Star, Zap, Rocket, Trophy } from "lucide-react";

const ResearchServices = () => {
  const services = [
    {
      id: "thesis-titles",
      title: "اقتراح عناوين رسائل ماجستير ودكتوراه",
      description: "ابتكار عناوين مميزة وقابلة للتطبيق مع خطة بحثية مبدئية شاملة لضمان النجاح الأكاديمي",
      icon: <GraduationCap className="h-10 w-10" />,
      color: "primary",
      gradient: "bg-gradient-primary",
      shadow: "shadow-primary",
      href: "/research/thesis-titles",
      stats: "2000+ عنوان مقترح",
      features: ["عناوين مبتكرة", "خطة أولية", "مراجعة متخصصة"]
    },
    {
      id: "research-plan",
      title: "المساعدة في كتابة خطة البحث",
      description: "إعداد خطط بحثية متكاملة تشمل المنهجية العلمية وتصميم البحث بأعلى المعايير الأكاديمية",
      icon: <FileText className="h-10 w-10" />,
      color: "secondary",
      gradient: "bg-gradient-secondary",
      shadow: "shadow-secondary",
      href: "/research/research-plan",
      stats: "1500+ خطة بحثية",
      features: ["منهجية علمية", "تصميم متكامل", "مراجعة أكاديمية"]
    },
    {
      id: "theoretical-framework",
      title: "كتابة الإطار النظري",
      description: "بناء إطار نظري قوي ومتماسك يربط النظريات بمشكلة البحث مع مراجعة شاملة للأدبيات",
      icon: <BookOpen className="h-10 w-10" />,
      color: "accent",
      gradient: "bg-gradient-success",
      shadow: "shadow-success",
      href: "/research/theoretical-framework",
      stats: "800+ إطار نظري",
      features: ["مراجعة أدبية", "ربط نظري", "تحليل شامل"]
    },
    {
      id: "statistical-analysis",
      title: "التحليل الإحصائي ومناقشة النتائج",
      description: "تحليل إحصائي متقدم للبيانات مع كتابة مناقشة علمية عميقة وتفسير النتائج بطريقة احترافية",
      icon: <BarChart3 className="h-10 w-10" />,
      color: "primary",
      gradient: "bg-gradient-primary",
      shadow: "shadow-primary",
      href: "/research/statistical-analysis",
      stats: "1200+ تحليل إحصائي",
      features: ["تحليل متقدم", "مناقشة علمية", "تفسير شامل"]
    },
    {
      id: "language-review",
      title: "التدقيق اللغوي والمراجعة",
      description: "مراجعة لغوية شاملة تشمل التدقيق النحوي والأسلوبي مع تحسين الوضوح والتماسك النصي",
      icon: <CheckCircle className="h-10 w-10" />,
      color: "secondary",
      gradient: "bg-gradient-secondary",
      shadow: "shadow-secondary",
      href: "/research/language-review",
      stats: "3000+ مراجعة لغوية",
      features: ["تدقيق شامل", "تحسين أسلوبي", "مراجعة نهائية"]
    },
    {
      id: "formatting",
      title: "تنسيق الرسائل العلمية",
      description: "تنسيق احترافي متكامل للرسائل العلمية وفقاً للمعايير الدولية مع تصميم بصري أنيق",
      icon: <Layout className="h-10 w-10" />,
      color: "accent",
      gradient: "bg-gradient-success",
      shadow: "shadow-success",
      href: "/research/formatting",
      stats: "2500+ رسالة منسقة",
      features: ["معايير دولية", "تصميم أنيق", "تنسيق شامل"]
    },
    {
      id: "plagiarism-check",
      title: "فحص السرقة الأدبية والعلمية",
      description: "فحص دقيق ومتقدم للتأكد من الأصالة العلمية باستخدام أحدث الأدوات والتقنيات المتخصصة",
      icon: <Shield className="h-10 w-10" />,
      color: "primary",
      gradient: "bg-gradient-primary",
      shadow: "shadow-primary",
      href: "/research/plagiarism-check",
      stats: "5000+ فحص أصالة",
      features: ["فحص متقدم", "تقرير مفصل", "ضمان الأصالة"]
    },
    {
      id: "admission-services",
      title: "توفير القبول للدراسة واللغة",
      description: "مساعدة شاملة للحصول على قبولات جامعية ودورات لغة في أفضل المؤسسات التعليمية العالمية",
      icon: <Globe className="h-10 w-10" />,
      color: "secondary",
      gradient: "bg-gradient-secondary",
      shadow: "shadow-secondary",
      href: "/research/admission-services",
      stats: "1000+ قبول جامعي",
      features: ["جامعات عالمية", "دورات لغة", "إرشاد شامل"]
    },
    {
      id: "references",
      title: "توفير المراجع وتلخيص الدراسات السابقة",
      description: "جمع المراجع العلمية الحديثة وتلخيص الدراسات السابقة مع تحليل نقدي وتقييم شامل",
      icon: <Database className="h-10 w-10" />,
      color: "accent",
      gradient: "bg-gradient-success",
      shadow: "shadow-success",
      href: "/research/references",
      stats: "10000+ مرجع علمي",
      features: ["مراجع حديثة", "تلخيص نقدي", "تقييم شامل"]
    },
    {
      id: "research-tools",
      title: "توفير أدوات الدراسة",
      description: "تصميم وإعداد الاستبانات والمقاييس وأدوات جمع البيانات المتخصصة والمعايرة علمياً",
      icon: <Cog className="h-10 w-10" />,
      color: "primary",
      gradient: "bg-gradient-primary",
      shadow: "shadow-primary",
      href: "/research/research-tools",
      stats: "800+ أداة دراسة",
      features: ["أدوات معايرة", "تصميم متخصص", "صلاحية عالية"]
    },
    {
      id: "research-evaluation",
      title: "تحكيم الدراسات والاستبانات",
      description: "تحكيم علمي دقيق من خبراء متخصصين مع تقييم شامل للمنهجية والمحتوى والجودة العلمية",
      icon: <Scale className="h-10 w-10" />,
      color: "secondary",
      gradient: "bg-gradient-secondary",
      shadow: "shadow-secondary",
      href: "/research/research-evaluation",
      stats: "600+ دراسة محكمة",
      features: ["تحكيم علمي", "خبراء متخصصون", "تقييم شامل"]
    },
    {
      id: "publication",
      title: "نشر الأبحاث في المجلات العلمية",
      description: "مساعدة متكاملة في نشر البحوث في المجلات العلمية المحكمة مع إرشاد في اختيار المجلة المناسبة",
      icon: <Award className="h-10 w-10" />,
      color: "accent",
      gradient: "bg-gradient-success",
      shadow: "shadow-success",
      href: "/research/publication",
      stats: "400+ بحث منشور",
      features: ["مجلات محكمة", "اختيار مناسب", "متابعة كاملة"]
    },
    {
      id: "academic-consultation",
      title: "الاستشارات الأكاديمية",
      description: "استشارات أكاديمية متخصصة من أساتذة جامعيين وخبراء في مختلف التخصصات العلمية والإنسانية",
      icon: <Users className="h-10 w-10" />,
      color: "primary",
      gradient: "bg-gradient-primary",
      shadow: "shadow-primary",
      href: "/research/academic-consultation",
      stats: "2000+ استشارة",
      features: ["أساتذة خبراء", "تخصصات متنوعة", "حلول مخصصة"]
    },
    {
      id: "training-courses",
      title: "الدورات التدريبية",
      description: "دورات تدريبية متخصصة في مناهج البحث العلمي والكتابة الأكاديمية مع شهادات معتمدة",
      icon: <Brain className="h-10 w-10" />,
      color: "secondary",
      gradient: "bg-gradient-secondary",
      shadow: "shadow-secondary",
      href: "/research/training-courses",
      stats: "5000+ متدرب",
      features: ["دورات معتمدة", "خبراء مدربون", "شهادات دولية"]
    }
  ];

  const stats = [
    {
      number: "15000+",
      label: "مشروع بحثي مكتمل",
      icon: <Trophy className="h-12 w-12" />,
      color: "text-primary"
    },
    {
      number: "98%",
      label: "معدل رضا العملاء",
      icon: <Star className="h-12 w-12" />,
      color: "text-secondary"
    },
    {
      number: "500+",
      label: "باحث وأكاديمي متخصص",
      icon: <Users className="h-12 w-12" />,
      color: "text-accent"
    },
    {
      number: "50+",
      label: "تخصص أكاديمي مغطى",
      icon: <BookOpen className="h-12 w-12" />,
      color: "text-primary"
    }
  ];

  const testimonials = [
    {
      name: "د. محمد العلي",
      role: "دكتوراه في الإدارة",
      text: "الخدمة كانت استثنائية، ساعدوني في إنجاز رسالة الدكتوراه بجودة عالية وفي الوقت المحدد.",
      rating: 5
    },
    {
      name: "أ. فاطمة أحمد",
      role: "ماجستير في التربية",
      text: "فريق محترف جداً، الإطار النظري الذي أعدوه كان شاملاً ومتميزاً.",
      rating: 5
    },
    {
      name: "د. عبدالله السالم",
      role: "دكتوراه في الطب",
      text: "التحليل الإحصائي كان دقيقاً ومفصلاً، ساهم بشكل كبير في نجاح بحثي.",
      rating: 5
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "استشارة مجانية",
      description: "نبدأ بجلسة استشارة مجانية لفهم احتياجاتك البحثية",
      icon: <Lightbulb className="h-8 w-8" />
    },
    {
      step: "02",
      title: "وضع خطة العمل",
      description: "نضع خطة عمل مفصلة مع جدول زمني واضح",
      icon: <Target className="h-8 w-8" />
    },
    {
      step: "03",
      title: "التنفيذ المتقن",
      description: "فريق متخصص ينفذ العمل بأعلى معايير الجودة",
      icon: <Rocket className="h-8 w-8" />
    },
    {
      step: "04",
      title: "المراجعة والتسليم",
      description: "مراجعة شاملة وتسليم العمل مع ضمان الجودة",
      icon: <CheckCircle className="h-8 w-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Enhanced */}
      <section className="relative py-32 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-vibrant opacity-20"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-white/3 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-white/4 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <Brain className="h-24 w-24 mx-auto mb-8 animate-pulse-soft" />
            <h1 className="text-5xl md:text-7xl font-arabic-title font-bold mb-8 text-gradient-vibrant">
              مركز التميز للأبحاث والكتابة الأكاديمية
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 font-arabic-body leading-relaxed">
              نحن نقود ثورة في عالم البحث العلمي، نقدم خدمات متكاملة تضمن التميز الأكاديمي 
              ونساعد الباحثين على تحقيق أحلامهم العلمية بأعلى معايير الجودة العالمية
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong text-lg px-8 py-4 rounded-full font-bold">
                <Zap className="h-5 w-5 ml-2" />
                ابدأ رحلتك البحثية الآن
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 rounded-full font-bold">
                <Users className="h-5 w-5 ml-2" />
                تحدث مع خبير
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Statistics */}
        <div className="absolute bottom-10 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 200 + 1000}ms` }}>
                  <div className={`${stat.color} mb-2`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Enhanced */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-foreground mb-8">
              خدماتنا المتخصصة عالمياً
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نقدم مجموعة شاملة من الخدمات الأكاديمية والبحثية المتطورة التي تواكب أحدث المعايير العالمية
              وتضمن تحقيق أهدافكم العلمية بتميز واحترافية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <Card key={service.id} className="group hover-lift hover:shadow-strong transition-all duration-500 animate-fade-in-up border-0 bg-gradient-card relative overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <CardHeader className="text-center relative z-10 pb-4">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${service.gradient} flex items-center justify-center text-white ${service.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-arabic-title font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                    {service.title}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mb-4 font-medium">
                    {service.stats}
                  </div>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <CardDescription className="text-muted-foreground mb-6 font-arabic-body leading-relaxed">
                    {service.description}
                  </CardDescription>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <div className="flex flex-wrap justify-center gap-2">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button asChild className={`w-full ${service.gradient} text-white border-0 hover:opacity-90 shadow-medium rounded-full font-bold`}>
                    <a href={service.href}>
                      <TrendingUp className="h-4 w-4 ml-2" />
                      استكشف الخدمة
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - New */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-foreground mb-8">
              كيف نعمل معاً؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              منهجية عمل مدروسة ومجربة تضمن تحقيق أفضل النتائج
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-primary mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-arabic-title font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground font-arabic-body">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-foreground mb-8">
              شهادات عملائنا
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              آراء حقيقية من باحثين وأكاديميين تعاملوا معنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 shadow-medium animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-center font-arabic-title">
                    {testimonial.name}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {testimonial.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground font-arabic-body italic">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-foreground mb-8">
              لماذا نحن الخيار الأمثل؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Award className="h-12 w-12" />,
                title: "خبرة عالمية معتمدة",
                description: "فريق من الأكاديميين والباحثين ذوي الخبرة الطويلة والمعتمدين دولياً في مختلف التخصصات العلمية",
                color: "primary",
                stats: "15+ سنة خبرة"
              },
              {
                icon: <CheckCircle className="h-12 w-12" />,
                title: "جودة مضمونة ومعايير عالمية",
                description: "نلتزم بأعلى معايير الجودة العالمية ونضمن التميز في كل مشروع نتولاه مع ضمان الرضا التام",
                color: "secondary",
                stats: "98% معدل النجاح"
              },
              {
                icon: <Users className="h-12 w-12" />,
                title: "دعم شامل ومتابعة مستمرة",
                description: "متابعة ودعم مستمر على مدار 24/7 حتى اكتمال مشروعك مع فريق دعم متخصص ومتاح دائماً",
                color: "accent",
                stats: "24/7 دعم مستمر"
              }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className={`w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-${item.color} flex items-center justify-center text-white shadow-${item.color} hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-arabic-title font-bold mb-4">{item.title}</h3>
                <div className="text-sm text-primary font-bold mb-4">{item.stats}</div>
                <p className="text-muted-foreground font-arabic-body leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-32 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-vibrant opacity-30"></div>
        <div className="container relative mx-auto px-4 text-center">
          <Rocket className="h-20 w-20 mx-auto mb-8 animate-float" />
          <h2 className="text-4xl md:text-5xl font-arabic-title font-bold mb-8">
            ابدأ رحلتك البحثية الآن وحقق أحلامك الأكاديمية
          </h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed">
            لا تؤجل حلمك الأكاديمي، انضم إلى آلاف الباحثين الذين حققوا النجاح معنا. 
            استشارتك الأولى مجانية تماماً!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong text-xl px-10 py-5 rounded-full font-bold">
              <Zap className="h-6 w-6 ml-2" />
              احصل على استشارة مجانية
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-xl px-10 py-5 rounded-full font-bold">
              <Trophy className="h-6 w-6 ml-2" />
              شاهد نماذج أعمالنا
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResearchServices;