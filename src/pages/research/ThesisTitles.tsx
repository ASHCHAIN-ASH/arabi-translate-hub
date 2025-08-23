import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Lightbulb, Target, CheckCircle, FileText, Users } from "lucide-react";

const ThesisTitles = () => {
  const features = [
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "أفكار إبداعية",
      description: "نقدم عناوين مبتكرة ومتميزة في تخصصك"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "استهداف دقيق",
      description: "عناوين محددة وقابلة للتطبيق في فترة زمنية معقولة"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "خطة مبدئية",
      description: "نرفق مع كل عنوان خطة بحثية أولية"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "استشارة متخصصة",
      description: "من أكاديميين متخصصين في مجالك"
    }
  ];

  const process = [
    {
      step: "01",
      title: "تحديد التخصص",
      description: "نتعرف على تخصصك الدقيق واهتماماتك البحثية"
    },
    {
      step: "02", 
      title: "البحث والتحليل",
      description: "نبحث في الأدبيات الحديثة والفجوات البحثية"
    },
    {
      step: "03",
      title: "اقتراح العناوين",
      description: "نقدم عدة عناوين مع تبرير علمي لكل منها"
    },
    {
      step: "04",
      title: "المراجعة والتطوير",
      description: "نراجع ونطور العناوين بناء على ملاحظاتك"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-right">
              <h1 className="text-4xl md:text-5xl font-arabic-title font-bold mb-6 animate-fade-in-up">
                اقتراح عناوين رسائل الماجستير والدكتوراه
              </h1>
              <p className="text-lg md:text-xl mb-8 font-arabic-body animate-fade-in-up">
                نساعدك في إيجاد عنوان مثالي لرسالتك العلمية يتميز بالأصالة والجدة والقابلية للتطبيق
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong animate-fade-in-up">
                احصل على اقتراحات الآن
              </Button>
            </div>
            <div className="flex-1 animate-float">
              <div className="w-64 h-64 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <GraduationCap className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold text-foreground mb-6">
              مميزات خدمتنا
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نقدم خدمة شاملة لاقتراح عناوين الرسائل العلمية بأعلى معايير الجودة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-arabic-title">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-arabic-body">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold text-foreground mb-6">
              خطوات العمل
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نتبع منهجية علمية دقيقة لضمان جودة العناوين المقترحة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-secondary flex items-center justify-center text-white shadow-secondary">
                  <span className="text-2xl font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-arabic-title font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground font-arabic-body">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-arabic-title font-bold text-foreground mb-8">
                فوائد الحصول على عنوان متميز
              </h2>
              <div className="space-y-6">
                {[
                  "توجيه واضح لمسار البحث العلمي",
                  "زيادة فرص قبول المشروع من المشرف",
                  "تسهيل عملية جمع المراجع والمصادر",
                  "وضوح الأهداف والمخرجات المتوقعة",
                  "تجنب التكرار والتداخل مع دراسات أخرى"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-6 h-6 rounded-full bg-gradient-success flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-foreground font-arabic-body">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-float">
              <Card className="p-8 bg-gradient-card border-0 shadow-medium">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-arabic-title font-bold text-foreground mb-4">
                    احصل على استشارة مجانية
                  </CardTitle>
                  <CardDescription className="font-arabic-body">
                    تحدث مع أحد خبرائنا لمناقشة احتياجاتك البحثية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
                    احجز استشارتك المجانية
                  </Button>
                  <Button variant="outline" className="w-full">
                    اطلب عرض سعر
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-6">
            ابدأ رحلتك البحثية بعنوان متميز
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            لا تدع اختيار العنوان يؤخر مشروعك البحثي، احصل على اقتراحات احترافية الآن
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
            ابدأ الآن
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThesisTitles;