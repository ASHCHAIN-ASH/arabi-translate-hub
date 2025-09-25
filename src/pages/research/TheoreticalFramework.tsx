import Header from "@/components/Header";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, FileText, CheckCircle, Lightbulb, Target } from "lucide-react";

const TheoreticalFramework = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-success text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-right">
              <h1 className="text-4xl md:text-5xl font-arabic-title font-bold mb-6 animate-fade-in-up">
                كتابة الإطار النظري
              </h1>
              <p className="text-lg md:text-xl mb-8 font-arabic-body animate-fade-in-up">
                نساعدك في إعداد إطار نظري شامل ومتخصص يدعم بحثك العلمي بأقوى الأسس النظرية
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong animate-fade-in-up">
                ابدأ كتابة الإطار النظري
              </Button>
            </div>
            <div className="flex-1 animate-float">
              <div className="w-64 h-64 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <BookOpen className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold text-foreground mb-6">
              خدماتنا في الإطار النظري
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-8 w-8" />,
                title: "مراجعة الأدبيات",
                description: "جمع وتحليل الدراسات السابقة ذات الصلة بموضوع البحث"
              },
              {
                icon: <Lightbulb className="h-8 w-8" />,
                title: "تطوير النظريات",
                description: "ربط النظريات بمشكلة البحث وتطوير إطار نظري متماسك"
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "صياغة الفرضيات",
                description: "تطوير فرضيات البحث بناءً على الأسس النظرية"
              }
            ].map((service, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-success flex items-center justify-center text-white shadow-success">
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

      {/* CTA */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-6">
            احصل على إطار نظري متكامل
          </h2>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
            ابدأ الآن
          </Button>
        </div>
      </section>

      
    </div>
  );
};

export default TheoreticalFramework;