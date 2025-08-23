import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, BarChart3, Search, CheckCircle, Layout, Shield, GraduationCap, Database, Cog, Scale, Globe, Users, Award } from "lucide-react";

const ResearchServices = () => {
  const services = [
    {
      id: "thesis-titles",
      title: "اقتراح عناوين رسائل ماجستير ودكتوراه",
      description: "نساعدك في إيجاد عناوين مبتكرة ومناسبة لتخصصك مع توفير الخطوط العريضة للبحث",
      icon: <GraduationCap className="h-8 w-8" />,
      color: "primary",
      href: "/research/thesis-titles"
    },
    {
      id: "research-plan",
      title: "المساعدة في كتابة خطة البحث",
      description: "إعداد خطط بحثية متكاملة ومنهجية علمية سليمة",
      icon: <FileText className="h-8 w-8" />,
      color: "secondary",
      href: "/research/research-plan"
    },
    {
      id: "theoretical-framework",
      title: "كتابة الإطار النظري",
      description: "إعداد إطار نظري شامل ومتخصص لبحثك العلمي",
      icon: <BookOpen className="h-8 w-8" />,
      color: "accent",
      href: "/research/theoretical-framework"
    },
    {
      id: "statistical-analysis",
      title: "التحليل الإحصائي ومناقشة النتائج",
      description: "تحليل البيانات إحصائياً وكتابة مناقشة علمية للنتائج",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "primary",
      href: "/research/statistical-analysis"
    },
    {
      id: "language-review",
      title: "التدقيق اللغوي والمراجعة",
      description: "مراجعة وتدقيق النصوص العلمية لغوياً ونحوياً",
      icon: <CheckCircle className="h-8 w-8" />,
      color: "secondary",
      href: "/research/language-review"
    },
    {
      id: "formatting",
      title: "تنسيق الرسائل العلمية",
      description: "تنسيق احترافي للرسائل والأطروحات وفقاً للمعايير الأكاديمية",
      icon: <Layout className="h-8 w-8" />,
      color: "accent",
      href: "/research/formatting"
    },
    {
      id: "plagiarism-check",
      title: "فحص السرقة الأدبية والعلمية",
      description: "فحص شامل للنصوص والتأكد من الأصالة العلمية",
      icon: <Shield className="h-8 w-8" />,
      color: "primary",
      href: "/research/plagiarism-check"
    },
    {
      id: "admission-services",
      title: "توفير القبول للدراسة واللغة",
      description: "مساعدة في الحصول على قبولات جامعية ودورات لغة",
      icon: <Globe className="h-8 w-8" />,
      color: "secondary",
      href: "/research/admission-services"
    },
    {
      id: "references",
      title: "توفير المراجع وتلخيص الدراسات السابقة",
      description: "جمع المراجع العلمية وتلخيص الدراسات ذات الصلة",
      icon: <Database className="h-8 w-8" />,
      color: "accent",
      href: "/research/references"
    },
    {
      id: "research-tools",
      title: "توفير أدوات الدراسة",
      description: "إعداد الاستبانات والمقاييس وأدوات جمع البيانات",
      icon: <Cog className="h-8 w-8" />,
      color: "primary",
      href: "/research/research-tools"
    },
    {
      id: "research-evaluation",
      title: "تحكيم الدراسات والاستبانات",
      description: "مراجعة وتقييم الدراسات من قبل خبراء متخصصين",
      icon: <Scale className="h-8 w-8" />,
      color: "secondary",
      href: "/research/research-evaluation"
    },
    {
      id: "publication",
      title: "نشر الأبحاث في المجلات العلمية",
      description: "مساعدة في نشر البحوث في المجلات العلمية المحكمة",
      icon: <Award className="h-8 w-8" />,
      color: "accent",
      href: "/research/publication"
    },
    {
      id: "academic-consultation",
      title: "الاستشارات الأكاديمية",
      description: "استشارات متخصصة من أكاديميين ذوي خبرة عالية",
      icon: <Users className="h-8 w-8" />,
      color: "primary",
      href: "/research/academic-consultation"
    },
    {
      id: "training-courses",
      title: "الدورات التدريبية",
      description: "دورات تدريبية متخصصة في مناهج البحث العلمي",
      icon: <Search className="h-8 w-8" />,
      color: "secondary",
      href: "/research/training-courses"
    }
  ];

  const getGradientClass = (color: string) => {
    switch (color) {
      case "primary": return "bg-gradient-primary";
      case "secondary": return "bg-gradient-secondary";
      case "accent": return "bg-gradient-success";
      default: return "bg-gradient-primary";
    }
  };

  const getShadowClass = (color: string) => {
    switch (color) {
      case "primary": return "shadow-primary";
      case "secondary": return "shadow-secondary";
      case "accent": return "shadow-success";
      default: return "shadow-primary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6 animate-fade-in-up">
            خدمات الأبحاث والكتابة الأكاديمية
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-arabic-body animate-fade-in-up">
            نقدم خدمات شاملة في مجال البحث العلمي والكتابة الأكاديمية بأعلى معايير الجودة والاحترافية
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong animate-fade-in-up">
            استشارة مجانية
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold text-foreground mb-6">
              خدماتنا المتخصصة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نوفر مجموعة شاملة من الخدمات الأكاديمية والبحثية لدعم رحلتك العلمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={service.id} className="group hover-lift hover:shadow-lg transition-all duration-300 animate-fade-in-up border-0 bg-gradient-card" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${getGradientClass(service.color)} flex items-center justify-center text-white ${getShadowClass(service.color)}`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-arabic-title font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground mb-6 font-arabic-body">
                    {service.description}
                  </CardDescription>
                  <Button asChild className={`w-full ${getGradientClass(service.color)} text-white border-0 hover:opacity-90`}>
                    <a href={service.href}>اطلب الخدمة</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold text-foreground mb-6">
              لماذا تختار خدماتنا؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-primary">
                <Award className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-arabic-title font-bold mb-4">خبرة عالية</h3>
              <p className="text-muted-foreground">فريق من الأكاديميين والباحثين ذوي الخبرة الطويلة</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-secondary flex items-center justify-center text-white shadow-secondary">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-arabic-title font-bold mb-4">جودة مضمونة</h3>
              <p className="text-muted-foreground">نلتزم بأعلى معايير الجودة والدقة العلمية</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-success flex items-center justify-center text-white shadow-success">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-arabic-title font-bold mb-4">دعم مستمر</h3>
              <p className="text-muted-foreground">متابعة ودعم مستمر حتى اكتمال مشروعك</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-6">
            ابدأ مشروعك البحثي اليوم
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            تواصل معنا الآن للحصول على استشارة مجانية ولنناقش احتياجاتك البحثية
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
            تواصل معنا الآن
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResearchServices;