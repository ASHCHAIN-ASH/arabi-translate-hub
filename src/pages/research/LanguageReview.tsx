import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileEdit, Zap, Shield } from "lucide-react";

const LanguageReview = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 bg-gradient-secondary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6 animate-fade-in-up">
            التدقيق اللغوي والمراجعة
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-arabic-body animate-fade-in-up">
            مراجعة وتدقيق شامل للنصوص العلمية لضمان الجودة اللغوية والأكاديمية
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong animate-fade-in-up">
            ابدأ التدقيق الآن
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "التدقيق النحوي",
                description: "مراجعة القواعد النحوية والإملائية"
              },
              {
                icon: <FileEdit className="h-8 w-8" />,
                title: "التدقيق الأسلوبي",
                description: "تحسين الأسلوب والوضوح في التعبير"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "التدقيق الأكاديمي",
                description: "مراجعة المصطلحات العلمية والأكاديمية"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "ضمان الجودة",
                description: "مراجعة نهائية شاملة للنص"
              }
            ].map((service, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-secondary flex items-center justify-center text-white shadow-secondary">
                    {service.icon}
                  </div>
                  <CardTitle className="font-arabic-title">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-arabic-body">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LanguageReview;