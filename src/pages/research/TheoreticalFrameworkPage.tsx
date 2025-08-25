import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Search, Target, CheckCircle, Star, 
  ArrowRight, Clock, Users, Trophy, Sparkles, FileText,
  Award, Shield, Rocket, Zap, PenTool, Database, Library
} from "lucide-react";

const TheoreticalFrameworkPage = () => {
  const features = [
    {
      title: "مراجعة أدبية شاملة",
      description: "مسح شامل للأدبيات والدراسات السابقة في مجال البحث مع تحليل نقدي معمق",
      icon: <Library className="h-8 w-8" />,
      color: "bg-green-500"
    },
    {
      title: "ربط نظري متماسك",
      description: "ربط النظريات المختلفة بمشكلة البحث وإنشاء إطار نظري متماسك ومنطقي",
      icon: <Target className="h-8 w-8" />,
      color: "bg-blue-500"
    },
    {
      title: "تحليل شامل ونقدي",
      description: "تحليل نقدي للنظريات والدراسات مع إبراز نقاط القوة والضعف",
      icon: <Search className="h-8 w-8" />,
      color: "bg-purple-500"
    },
    {
      title: "مصادر حديثة ومتنوعة",
      description: "استخدام مصادر علمية حديثة ومتنوعة من أفضل المجلات والمؤتمرات العالمية",
      icon: <Database className="h-8 w-8" />,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white overflow-hidden">
        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-8">
              كتابة الإطار النظري والأدبيات
            </h1>
            
            <p className="text-xl max-w-3xl mx-auto mb-12 font-arabic-body leading-relaxed text-green-100">
              بناء إطار نظري قوي ومتماسك يربط النظريات بمشكلة البحث مع مراجعة شاملة للأدبيات السابقة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-green-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold">
                <Zap className="h-5 w-5 ml-2" />
                اطلب إطار نظري احترافي
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold text-slate-800 mb-8">
              مميزات خدمة الإطار النظري
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 animate-fade-in-up">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-arabic-title font-bold text-slate-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
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

export default TheoreticalFrameworkPage;