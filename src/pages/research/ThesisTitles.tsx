import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Lightbulb, Target, CheckCircle, FileText, Users, Brain, Search, BookOpen, TrendingUp, Award, Zap, Star, Trophy, Rocket } from "lucide-react";

const ThesisTitles = () => {
  const features = [
    {
      icon: <Brain className="h-10 w-10" />,
      title: "ذكاء اصطناعي متقدم",
      description: "نستخدم تقنيات الذكاء الاصطناعي لتحليل آلاف الدراسات وإنتاج عناوين مبتكرة ومتميزة",
      gradient: "bg-gradient-primary"
    },
    {
      icon: <Search className="h-10 w-10" />,
      title: "بحث شامل في قواعد البيانات",
      description: "نبحث في أكبر قواعد البيانات العلمية العالمية لضمان حداثة وأصالة العناوين المقترحة",
      gradient: "bg-gradient-secondary"
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: "استهداف دقيق للتخصص",
      description: "عناوين مصممة خصيصاً لتخصصك الدقيق مع مراعاة الاتجاهات الحديثة في المجال",
      gradient: "bg-gradient-success"
    },
    {
      icon: <FileText className="h-10 w-10" />,
      title: "خطة بحثية مبدئية شاملة",
      description: "مع كل عنوان نقدم خطة بحثية أولية تشمل الأهداف والمنهجية والمراجع الأساسية",
      gradient: "bg-gradient-primary"
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "استشارة من خبراء متخصصين",
      description: "مراجعة وتقييم من أكاديميين متخصصين في مجالك مع توصيات للتطوير",
      gradient: "bg-gradient-secondary"
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: "ضمان القبول الأكاديمي",
      description: "عناوين مدروسة بعناية لزيادة فرص القبول من قبل المشرفين والجامعات",
      gradient: "bg-gradient-success"
    }
  ];

  const process = [
    {
      step: "01",
      title: "تحليل التخصص والاهتمامات",
      description: "نتعرف على تخصصك الدقيق، اهتماماتك البحثية، والموضوعات التي تود استكشافها",
      icon: <Brain className="h-8 w-8" />,
      color: "primary"
    },
    {
      step: "02", 
      title: "البحث العميق والتحليل",
      description: "نبحث في آلاف الدراسات الحديثة ونحلل الفجوات البحثية والاتجاهات المعاصرة",
      icon: <Search className="h-8 w-8" />,
      color: "secondary"
    },
    {
      step: "03",
      title: "إنتاج عناوين مبتكرة",
      description: "نقدم 10-15 عنوان متنوع مع تبرير علمي شامل وتقييم قابلية التطبيق لكل منها",
      icon: <Lightbulb className="h-8 w-8" />,
      color: "accent"
    },
    {
      step: "04",
      title: "المراجعة والتطوير التفاعلي",
      description: "نراجع ونطور العناوين بناء على ملاحظاتك مع جلسات استشارية مجانية",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "primary"
    }
  ];

  const specializations = [
    "العلوم الطبية والصحية", "الهندسة والتكنولوجيا", "إدارة الأعمال والاقتصاد",
    "التربية وعلم النفس", "القانون والعلوم السياسية", "الأدب واللغات",
    "الفيزياء والرياضيات", "الكيمياء والأحياء", "علوم الحاسوب والمعلومات",
    "الجيولوجيا وعلوم الأرض", "الزراعة والبيئة", "الصيدلة والعلوم الطبية المساعدة"
  ];

  const benefits = [
    {
      title: "توفير الوقت والجهد",
      description: "لا مزيد من أسابيع البحث عن عنوان مناسب، نوفر لك الحل خلال 48 ساعة",
      icon: <Zap className="h-8 w-8" />
    },
    {
      title: "زيادة فرص القبول",
      description: "عناوين مدروسة علمياً تزيد من فرص قبول مشروعك من المشرف والجامعة",
      icon: <Trophy className="h-8 w-8" />
    },
    {
      title: "توجيه واضح للبحث",
      description: "خطة مبدئية واضحة تساعدك على البدء فوراً في تنفيذ بحثك",
      icon: <Target className="h-8 w-8" />
    },
    {
      title: "تجنب التكرار والتداخل",
      description: "فحص شامل للتأكد من عدم تكرار الدراسات السابقة وضمان الأصالة",
      icon: <CheckCircle className="h-8 w-8" />
    }
  ];

  const successStories = [
    {
      name: "د. أحمد الخالدي",
      field: "الطب - جراحة القلب",
      title: "تقنيات الذكاء الاصطناعي في تشخيص أمراض القلب",
      result: "حصل على منحة بحثية بقيمة 500,000 ريال",
      university: "جامعة الملك سعود"
    },
    {
      name: "د. فاطمة العتيبي",
      field: "التربية - تكنولوجيا التعليم",
      title: "واقع افتراضي في تعليم العلوم للطلاب ذوي الإعاقة البصرية",
      result: "فازت بجائزة أفضل رسالة دكتوراه",
      university: "جامعة أم القرى"
    },
    {
      name: "د. محمد الشهري",
      field: "إدارة الأعمال - التجارة الإلكترونية",
      title: "البلوك تشين وتأثيرها على التجارة الإلكترونية في المنطقة العربية",
      result: "نشر في مجلة عالمية مفهرسة",
      university: "جامعة الملك فهد"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Enhanced */}
      <section className="relative py-32 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-vibrant opacity-20"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-white/3 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-right">
              <div className="animate-fade-in-up">
                <h1 className="text-5xl md:text-6xl font-arabic-title font-bold mb-8 leading-tight">
                  عناوين رسائل علمية
                  <span className="block text-gradient-vibrant">مبتكرة ومتميزة</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 font-arabic-body leading-relaxed">
                  نساعدك في إيجاد عنوان مثالي لرسالتك العلمية يتميز بالأصالة والجدة والقابلية للتطبيق
                  مع خطة بحثية شاملة تضمن نجاحك الأكاديمي
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong text-lg px-8 py-4 rounded-full font-bold">
                    <Rocket className="h-5 w-5 ml-2" />
                    احصل على اقتراحاتك الآن
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 rounded-full font-bold">
                    <Star className="h-5 w-5 ml-2" />
                    شاهد نماذج العناوين
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 animate-float">
              <div className="relative">
                <div className="w-80 h-80 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="h-40 w-40 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse-soft">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center animate-pulse-soft" style={{ animationDelay: '1s' }}>
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-foreground mb-8">
              لماذا نتميز في اقتراح العناوين؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نجمع بين التكنولوجيا المتقدمة والخبرة الأكاديمية لنقدم لك عناوين استثنائية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 animate-fade-in-up relative overflow-hidden group" style={{ animationDelay: `${index * 150}ms` }}>
                <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <CardHeader className="relative z-10">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${feature.gradient} flex items-center justify-center text-white shadow-primary group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="font-arabic-title text-xl mb-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="font-arabic-body leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Enhanced */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-foreground mb-8">
              منهجية العمل المتطورة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نتبع منهجية علمية دقيقة مطورة عبر سنوات من الخبرة لضمان جودة العناوين
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative mb-8">
                  <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-${step.color} flex items-center justify-center text-white shadow-${step.color} mb-4 hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-arabic-title font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground font-arabic-body leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations Section - New */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-foreground mb-8">
              التخصصات المغطاة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نغطي جميع التخصصات الأكاديمية مع فريق متنوع من الخبراء
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {specializations.map((spec, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gradient-card hover-lift animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <p className="font-arabic-body font-medium text-sm">{spec}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories - New */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-foreground mb-8">
              قصص نجاح ملهمة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              شاهد كيف ساعدنا باحثين آخرين في تحقيق أحلامهم الأكاديمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 shadow-medium animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-success flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-center font-arabic-title text-lg">
                    {story.name}
                  </CardTitle>
                  <CardDescription className="text-center font-medium">
                    {story.field}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <h4 className="font-bold mb-4 text-primary">"{story.title}"</h4>
                  <p className="text-success font-medium mb-2">{story.result}</p>
                  <p className="text-sm text-muted-foreground">{story.university}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-foreground mb-12">
                فوائد الحصول على عنوان متميز
              </h2>
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-16 h-16 rounded-full bg-gradient-success flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-arabic-title font-bold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground font-arabic-body leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-float">
              <Card className="p-10 bg-gradient-card border-0 shadow-strong">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-arabic-title font-bold text-foreground mb-6">
                    احصل على استشارة مجانية
                  </CardTitle>
                  <CardDescription className="font-arabic-body text-lg leading-relaxed">
                    تحدث مع أحد خبرائنا لمناقشة احتياجاتك البحثية واحصل على عرض مخصص
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">48</div>
                      <div className="text-sm text-muted-foreground">ساعة للتسليم</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">15</div>
                      <div className="text-sm text-muted-foreground">عنوان مقترح</div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-primary text-white hover:opacity-90 text-lg py-6 rounded-full">
                    <Rocket className="h-5 w-5 ml-2" />
                    احجز استشارتك المجانية
                  </Button>
                  <Button variant="outline" className="w-full text-lg py-6 rounded-full">
                    <Star className="h-5 w-5 ml-2" />
                    اطلب عرض سعر مخصص
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-32 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-vibrant opacity-30"></div>
        <div className="container relative mx-auto px-4 text-center">
          <Rocket className="h-20 w-20 mx-auto mb-8 animate-float" />
          <h2 className="text-4xl md:text-5xl font-arabic-title font-bold mb-8">
            ابدأ رحلتك البحثية بعنوان متميز
          </h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed">
            لا تدع اختيار العنوان يؤخر مشروعك البحثي. احصل على عناوين احترافية مبتكرة 
            تضمن لك التميز والنجاح الأكاديمي
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong text-xl px-10 py-5 rounded-full font-bold">
              <Zap className="h-6 w-6 ml-2" />
              ابدأ الآن - استشارة مجانية
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-xl px-10 py-5 rounded-full font-bold">
              <Trophy className="h-6 w-6 ml-2" />
              شاهد المزيد من النماذج
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThesisTitles;