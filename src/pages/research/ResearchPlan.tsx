import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, BookOpen, BarChart3, Users, CheckCircle } from "lucide-react";

const ResearchPlan = () => {
  const planComponents = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "مشكلة البحث والأهداف",
      description: "تحديد واضح لمشكلة البحث والأهداف المراد تحقيقها"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "الإطار النظري",
      description: "مراجعة شاملة للأدبيات والدراسات السابقة"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "منهجية البحث",
      description: "تصميم منهجي علمي مناسب لطبيعة البحث"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "عينة الدراسة",
      description: "تحديد مجتمع البحث وعينة الدراسة المناسبة"
    }
  ];

  const benefits = [
    "خطة بحثية متكاملة ومنهجية",
    "مراجعة من خبراء متخصصين",
    "توافق مع معايير الجامعات",
    "دعم في التطوير والتعديل",
    "ضمان الجودة والأصالة العلمية"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-secondary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-right">
              <h1 className="text-4xl md:text-5xl font-arabic-title font-bold mb-6 animate-fade-in-up">
                المساعدة في كتابة خطة البحث
              </h1>
              <p className="text-lg md:text-xl mb-8 font-arabic-body animate-fade-in-up">
                نساعدك في إعداد خطة بحثية شاملة ومتكاملة تضمن نجاح مشروعك العلمي
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong animate-fade-in-up">
                ابدأ إعداد خطتك الآن
              </Button>
            </div>
            <div className="flex-1 animate-float">
              <div className="w-64 h-64 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <FileText className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Components */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold text-foreground mb-6">
              مكونات خطة البحث
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نقوم بإعداد جميع عناصر خطة البحث وفقاً للمعايير الأكاديمية المعتمدة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {planComponents.map((component, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-secondary flex items-center justify-center text-white shadow-secondary">
                    {component.icon}
                  </div>
                  <CardTitle className="font-arabic-title">{component.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-arabic-body">{component.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Process */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-arabic-title font-bold text-foreground mb-8">
                عملية إعداد خطة البحث
              </h2>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "دراسة المتطلبات",
                    description: "تحليل متطلبات الجامعة والقسم الأكاديمي"
                  },
                  {
                    step: "02",
                    title: "تحديد المشكلة",
                    description: "صياغة مشكلة البحث بطريقة علمية دقيقة"
                  },
                  {
                    step: "03",
                    title: "المراجعة الأدبية",
                    description: "جمع ومراجعة الدراسات السابقة ذات الصلة"
                  },
                  {
                    step: "04",
                    title: "تصميم المنهجية",
                    description: "اختيار المنهج الأنسب وأدوات جمع البيانات"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-12 h-12 rounded-full bg-gradient-secondary flex items-center justify-center text-white shadow-secondary flex-shrink-0">
                      <span className="font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-arabic-title font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground font-arabic-body">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-float">
              <Card className="p-8 bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className="text-2xl font-arabic-title font-bold text-foreground mb-4">
                    ما يشمله العمل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-success flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-foreground font-arabic-body">{benefit}</p>
                    </div>
                  ))}
                  <Button className="w-full mt-6 bg-gradient-secondary text-white hover:opacity-90">
                    اطلب خدمة إعداد الخطة
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold text-foreground mb-6">
              لماذا نتميز في إعداد خطط البحث؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-10 w-10" />,
                title: "فريق متخصص",
                description: "أكاديميون وباحثون مختصون في مختلف المجالات",
                color: "primary"
              },
              {
                icon: <CheckCircle className="h-10 w-10" />,
                title: "معايير عالمية",
                description: "نلتزم بالمعايير الأكاديمية العالمية في الكتابة",
                color: "secondary"
              },
              {
                icon: <Target className="h-10 w-10" />,
                title: "خطط قابلة للتطبيق",
                description: "خطط واقعية ومدروسة يمكن تنفيذها بنجاح",
                color: "accent"
              }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-${item.color} flex items-center justify-center text-white shadow-${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-arabic-title font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground font-arabic-body">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-6">
            احصل على خطة بحثية احترافية
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            لا تترك نجاح بحثك للصدفة، احصل على خطة بحثية متكاملة من الخبراء
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

export default ResearchPlan;