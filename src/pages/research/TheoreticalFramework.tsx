import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Search, FileText, CheckCircle, Lightbulb, Target,
  Users, Clock, Trophy, Star, Zap, ArrowRight,
  MessageCircle, Mail, Phone, Award, Shield, Rocket
} from "lucide-react";

const TheoreticalFramework = () => {
  const [showForm, setShowForm] = useState(false);

  const features = [
    {
      title: "مراجعة شاملة للأدبيات",
      description: "جمع وتحليل نقدي للدراسات السابقة من أحدث المصادر العلمية المعتمدة",
      icon: <Search className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "تطوير الإطار النظري",
      description: "ربط النظريات العلمية بمشكلة البحث وتطوير إطار نظري متماسك ومنطقي",
      icon: <Lightbulb className="h-8 w-8" />,
      color: "from-green-500 to-green-600"
    },
    {
      title: "صياغة الفرضيات",
      description: "تطوير فرضيات بحثية قابلة للاختبار بناءً على الأسس النظرية القوية",
      icon: <Target className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "التوثيق الأكاديمي",
      description: "توثيق دقيق ومتكامل وفقاً لأحدث معايير التوثيق العلمي المعتمدة",
      icon: <FileText className="h-8 w-8" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const components = [
    {
      title: "مسح الأدبيات العلمية",
      description: "البحث في قواعد البيانات العلمية المعتمدة وجمع أحدث الدراسات ذات الصلة",
      icon: <Search className="h-6 w-6" />,
      items: ["البحث في قواعد البيانات", "تصنيف المصادر", "التقييم النقدي"]
    },
    {
      title: "تحليل الدراسات السابقة",
      description: "تحليل نقدي شامل للدراسات السابقة وتحديد نقاط القوة والضعف",
      icon: <BookOpen className="h-6 w-6" />,
      items: ["التحليل النقدي", "المقارنة بين الدراسات", "تحديد الاتجاهات"]
    },
    {
      title: "تطوير الإطار النظري",
      description: "بناء إطار نظري متكامل يربط بين النظريات والمفاهيم المختلفة",
      icon: <Lightbulb className="h-6 w-6" />,
      items: ["اختيار النظريات", "الربط المنطقي", "التكامل النظري"]
    },
    {
      title: "صياغة النموذج المفاهيمي",
      description: "تطوير نموذج مفاهيمي يوضح العلاقات بين متغيرات الدراسة",
      icon: <Target className="h-6 w-6" />,
      items: ["تحديد المتغيرات", "رسم العلاقات", "التوضيح البصري"]
    },
    {
      title: "صياغة الفرضيات",
      description: "وضع فرضيات علمية قابلة للاختبار ومرتبطة بالإطار النظري",
      icon: <CheckCircle className="h-6 w-6" />,
      items: ["الفرضيات الرئيسية", "الفرضيات الفرعية", "قابلية الاختبار"]
    },
    {
      title: "التوثيق والمراجع",
      description: "توثيق شامل ودقيق للمراجع وفقاً لأعلى المعايير الأكاديمية",
      icon: <FileText className="h-6 w-6" />,
      items: ["التوثيق الداخلي", "قائمة المراجع", "مراجعة الاقتباسات"]
    }
  ];

  const packages = [
    {
      name: "الباقة الأساسية",
      price: "1,500 ريال",
      duration: "12-15 يوم",
      features: [
        "إطار نظري أساسي (20-25 صفحة)",
        "مراجعة 30-40 مصدر علمي",
        "تحليل نظريات أساسية",
        "صياغة فرضيات رئيسية",
        "مراجعة واحدة مجانية"
      ],
      popular: false,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "الباقة المتقدمة",
      price: "2,500 ريال",
      duration: "8-12 يوم",
      features: [
        "إطار نظري شامل (30-35 صفحة)",
        "مراجعة 50-70 مصدر علمي",
        "تحليل نقدي متقدم",
        "نموذج مفاهيمي مطور",
        "ثلاث مراجعات مجانية",
        "استشارة مع متخصص"
      ],
      popular: true,
      color: "from-green-500 to-green-600"
    },
    {
      name: "الباقة الاحترافية",
      price: "4,000 ريال",
      duration: "5-8 أيام",
      features: [
        "إطار نظري احترافي (40-50 صفحة)",
        "مراجعة 80-100 مصدر علمي",
        "تحليل نقدي شامل ومعمق",
        "نموذج مفاهيمي متطور",
        "مراجعات غير محدودة",
        "جلسات استشارية متعددة",
        "ضمان الجودة الأكاديمية"
      ],
      popular: false,
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              كتابة الإطار النظري والأدبيات
            </h1>
            
            <p className="text-xl max-w-4xl mx-auto mb-12 leading-relaxed text-green-100">
              نساعدك في إعداد إطار نظري شامل ومتخصص يدعم بحثك العلمي بأقوى الأسس النظرية والأدبيات المعاصرة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowForm(true)}
                className="bg-white text-slate-900 hover:bg-green-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
              >
                <Zap className="h-5 w-5 ml-2" />
                ابدأ كتابة الإطار النظري
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4 rounded-full font-bold transition-all duration-300"
              >
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">
              مميزات خدمة كتابة الإطار النظري
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نقدم خدمة متخصصة وشاملة لكتابة الإطار النظري ومراجعة الأدبيات بأعلى المعايير الأكاديمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 group hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              مكونات الإطار النظري الشامل
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              نغطي جميع العناصر الأساسية والمتقدمة لإطار نظري متكامل ومدعم بأحدث الأدبيات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {components.map((component, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-all duration-300 group hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {component.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-white">
                      {component.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 leading-relaxed mb-4">
                    {component.description}
                  </CardDescription>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {component.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">
              باقات خدمة كتابة الإطار النظري
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              اختر الباقة التي تناسب احتياجاتك البحثية وميزانيتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-2 border-green-500 shadow-xl scale-105' : 'border-slate-200'} hover:shadow-xl transition-all duration-300`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1 text-sm font-bold">
                      الأكثر طلباً
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${pkg.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <Trophy className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                    {pkg.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {pkg.price}
                  </div>
                  <div className="text-slate-500 flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    {pkg.duration}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                    onClick={() => setShowForm(true)}
                  >
                    اطلب الآن
                  </Button>
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
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-green-600 mb-2">1,800+</div>
              <div className="text-slate-600">إطار نظري مكتمل</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-slate-600">مصدر علمي مراجع</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-slate-600">رضا العملاء</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-orange-600 mb-2">5-15</div>
              <div className="text-slate-600">يوم للتسليم</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              طرق التواصل المتاحة
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center text-white">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">واتساب</h3>
              <p className="text-slate-600">تواصل سريع ومباشر</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">البريد الإلكتروني</h3>
              <p className="text-slate-600">للاستفسارات التفصيلية</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center text-white">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">المكالمات</h3>
              <p className="text-slate-600">استشارة مباشرة</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            احصل على إطار نظري متكامل
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            إطار نظري شامل ومدعم بأحدث الأدبيات العلمية لدعم بحثك الأكاديمي بأقوى الأسس النظرية
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowForm(true)}
              className="bg-white text-slate-900 hover:bg-green-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
            >
              <Rocket className="h-5 w-5 ml-2" />
              اطلب الخدمة الآن
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full font-bold transition-all duration-300"
            >
              <Users className="h-5 w-5 ml-2" />
              استشارة مجانية
            </Button>
          </div>
        </div>
      </section>

      {/* Service Inquiry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">طلب خدمة كتابة الإطار النظري</h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>
            <ServiceInquiryForm 
              serviceName="كتابة الإطار النظري والأدبيات"
              serviceIcon="📚"
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TheoreticalFramework;