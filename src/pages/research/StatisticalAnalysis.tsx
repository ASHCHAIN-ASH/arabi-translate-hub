import Header from "@/components/Header";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, PieChart, Calculator } from "lucide-react";

const StatisticalAnalysis = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6 animate-fade-in-up">
            التحليل الإحصائي ومناقشة النتائج
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-arabic-body animate-fade-in-up">
            تحليل احترافي للبيانات وكتابة مناقشة علمية شاملة للنتائج
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong animate-fade-in-up">
            احصل على التحليل الآن
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "التحليل الوصفي",
                description: "تحليل البيانات الأساسية والمتوسطات والانحرافات"
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "التحليل الاستنتاجي", 
                description: "اختبار الفرضيات والارتباطات والانحدار"
              },
              {
                icon: <PieChart className="h-8 w-8" />,
                title: "الرسوم البيانية",
                description: "إنشاء رسوم بيانية احترافية للنتائج"
              },
              {
                icon: <Calculator className="h-8 w-8" />,
                title: "مناقشة النتائج",
                description: "كتابة مناقشة علمية شاملة للنتائج"
              }
            ].map((service, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-primary">
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

      
    </div>
  );
};

export default StatisticalAnalysis;