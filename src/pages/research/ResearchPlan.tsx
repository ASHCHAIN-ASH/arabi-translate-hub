import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, BookOpen, Target, CheckCircle, Star, 
  ArrowRight, Clock, Users, Trophy, Sparkles, Search,
  Award, Shield, Rocket, Zap, PenTool, Database
} from "lucide-react";

const ResearchPlan = () => {
  const features = [
    {
      title: "منهجية علمية متطورة",
      description: "تطبيق أحدث المناهج البحثية المعتمدة عالمياً في إعداد خطة البحث",
      icon: <Target className="h-8 w-8" />,
      color: "bg-blue-500"
    },
    {
      title: "تصميم بحثي متكامل",
      description: "تصميم شامل يغطي جميع جوانب البحث من المقدمة حتى النتائج المتوقعة",
      icon: <PenTool className="h-8 w-8" />,
      color: "bg-green-500"
    },
    {
      title: "مراجعة أكاديمية دقيقة",
      description: "مراجعة متخصصة من أساتذة محكمين لضمان جودة ودقة المحتوى",
      icon: <Shield className="h-8 w-8" />,
      color: "bg-purple-500"
    },
    {
      title: "ضمان الجودة والقبول",
      description: "ضمان قبول الخطة من الجامعة مع إمكانية التعديل المجاني",
      icon: <Award className="h-8 w-8" />,
      color: "bg-orange-500"
    }
  ];

  const components = [
    {
      title: "المقدمة وخلفية البحث",
      description: "تقديم واضح لموضوع البحث مع عرض الخلفية النظرية والعملية",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: "مشكلة البحث والأسئلة",
      description: "تحديد دقيق لمشكلة البحث وصياغة الأسئلة البحثية الرئيسية",
      icon: <Search className="h-6 w-6" />
    },
    {
      title: "الأهداف والفرضيات",
      description: "وضع أهداف واضحة وقابلة للقياس مع صياغة الفرضيات العلمية",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "مراجعة الأدبيات",
      description: "مسح شامل للدراسات السابقة وتحديد الفجوة البحثية",
      icon: <Database className="h-6 w-6" />
    },
    {
      title: "المنهجية وتصميم البحث",
      description: "اختيار المنهج المناسب وتحديد أدوات جمع وتحليل البيانات",
      icon: <PenTool className="h-6 w-6" />
    },
    {
      title: "الجدول الزمني والميزانية",
      description: "وضع جدول زمني واقعي مع تقدير التكاليف المطلوبة",
      icon: <Clock className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <FileText className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-8">
              المساعدة في كتابة خطة البحث
            </h1>
            
            <p className="text-xl max-w-3xl mx-auto mb-12 font-arabic-body leading-relaxed text-orange-100">
              إعداد خطط بحثية متكاملة تشمل المنهجية العلمية وتصميم البحث بأعلى المعايير الأكاديمية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-orange-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold">
                <Zap className="h-5 w-5 ml-2" />
                اطلب خطة بحثية الآن
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4 rounded-full font-bold">
                <Users className="h-5 w-5 ml-2" />
                استشارة مجانية
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
              مميزات خدمة إعداد خطة البحث
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نقدم خدمة شاملة لإعداد خطط بحثية احترافية تلبي متطلبات الجامعات العالمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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

      {/* Components Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-arabic-title font-bold mb-8">
              مكونات خطة البحث
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              نغطي جميع العناصر الأساسية لخطة بحثية متكاملة ومعتمدة أكاديمياً
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {components.map((component, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                      {component.icon}
                    </div>
                    <CardTitle className="text-lg font-arabic-title font-bold text-white">
                      {component.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 leading-relaxed">
                    {component.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-4xl font-bold text-orange-600 mb-2">1500+</div>
              <div className="text-slate-600">خطة بحثية</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-slate-600">معدل قبول الخطط</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="text-4xl font-bold text-purple-600 mb-2">40+</div>
              <div className="text-slate-600">تخصص أكاديمي</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <div className="text-4xl font-bold text-blue-600 mb-2">7-10</div>
              <div className="text-slate-600">أيام للتسليم</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-arabic-title font-bold mb-8">
            احصل على خطة بحثية احترافية
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            خطة بحثية متكاملة تضمن قبول موضوعك البحثي وتساعدك في إنجاز رسالتك بنجاح
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-orange-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold">
              <Rocket className="h-5 w-5 ml-2" />
              اطلب الخدمة الآن
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full font-bold">
              <Users className="h-5 w-5 ml-2" />
              تحدث مع خبير
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResearchPlan;