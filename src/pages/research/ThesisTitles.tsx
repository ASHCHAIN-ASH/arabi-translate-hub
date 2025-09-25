import Header from "@/components/Header";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, BookOpen, Lightbulb, Target, CheckCircle, Star, 
  ArrowRight, Clock, Users, Trophy, Sparkles, FileText, PenTool,
  Award, Shield, Rocket, Zap
} from "lucide-react";

const ThesisTitles = () => {
  const features = [
    {
      title: "عناوين مبتكرة وأصيلة",
      description: "نقدم عناوين بحثية مبتكرة تتميز بالأصالة والحداثة مع مراعاة متطلبات التخصص",
      icon: <Lightbulb className="h-8 w-8" />,
      color: "bg-blue-500"
    },
    {
      title: "خطة بحثية أولية",
      description: "مع كل عنوان نقدم خطة بحثية أولية تتضمن الأهداف والمنهجية المقترحة",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-green-500"
    },
    {
      title: "مراجعة متخصصة",
      description: "مراجعة دقيقة من قبل أساتذة متخصصين في نفس المجال الأكاديمي",
      icon: <Shield className="h-8 w-8" />,
      color: "bg-purple-500"
    },
    {
      title: "توجيه أكاديمي شامل",
      description: "إرشاد كامل حول كيفية تطوير العنوان وتحويله إلى بحث متكامل",
      icon: <Target className="h-8 w-8" />,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-8">
              اقتراح عناوين رسائل ماجستير ودكتوراه
            </h1>
            
            <p className="text-xl max-w-3xl mx-auto mb-12 font-arabic-body leading-relaxed text-blue-100">
              نساعدك في ابتكار عناوين بحثية مميزة وقابلة للتطبيق مع خطة بحثية أولية شاملة تضمن النجاح الأكاديمي
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-blue-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold">
                <Zap className="h-5 w-5 ml-2" />
                اطلب عناوين مقترحة الآن
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
              مميزات خدمة اقتراح العناوين
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

      
    </div>
  );
};

export default ThesisTitles;