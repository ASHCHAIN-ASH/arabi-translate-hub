import { useState } from "react";
import Header from "@/components/Header";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from '@/components/Footer';
import { 
  CheckCircle, FileEdit, Zap, Shield, Users, Clock, Trophy, 
  Star, ArrowRight, MessageCircle, Mail, Phone,
  Award, Rocket, Target, BookOpen, Search, PenTool
} from "lucide-react";

const LanguageReview = () => {
  const [showForm, setShowForm] = useState(false);

  const features = [
    {
      title: "التدقيق النحوي والإملائي",
      description: "مراجعة شاملة للقواعد النحوية والإملائية وعلامات الترقيم بدقة عالية",
      icon: <CheckCircle className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "التدقيق الأسلوبي والبلاغي",
      description: "تحسين الأسلوب والوضوح في التعبير مع الحفاظ على الطابع الأكاديمي",
      icon: <FileEdit className="h-8 w-8" />,
      color: "from-green-500 to-green-600"
    },
    {
      title: "المراجعة الأكاديمية المتخصصة",
      description: "مراجعة المصطلحات العلمية والأكاديمية وضمان الدقة المعرفية",
      icon: <BookOpen className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "ضمان الجودة الشاملة",
      description: "مراجعة نهائية شاملة للنص لضمان الجودة والاتساق والوضوح",
      icon: <Shield className="h-8 w-8" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const reviewTypes = [
    {
      title: "التدقيق اللغوي الأساسي",
      description: "مراجعة شاملة للقواعد النحوية والإملائية وعلامات الترقيم",
      icon: <CheckCircle className="h-6 w-6" />,
      items: ["القواعد النحوية", "الأخطاء الإملائية", "علامات الترقيم", "التشكيل والضبط"]
    },
    {
      title: "التدقيق الأسلوبي",
      description: "تحسين الأسلوب والوضوح في التعبير مع الحفاظ على المعنى الأصلي",
      icon: <FileEdit className="h-6 w-6" />,
      items: ["وضوح التعبير", "تسلسل الأفكار", "الربط بين الجمل", "الأسلوب الأكاديمي"]
    },
    {
      title: "المراجعة المعرفية",
      description: "مراجعة المحتوى العلمي والمصطلحات المتخصصة ودقة المعلومات",
      icon: <BookOpen className="h-6 w-6" />,
      items: ["المصطلحات العلمية", "دقة المعلومات", "الاتساق المعرفي", "المراجع والاقتباسات"]
    },
    {
      title: "التدقيق الفني",
      description: "مراجعة التنسيق والخطوط والجداول والرسوم البيانية",
      icon: <Target className="h-6 w-6" />,
      items: ["تنسيق النصوص", "الجداول والأشكال", "ترقيم الصفحات", "فهرس المحتويات"]
    },
    {
      title: "مراجعة التوثيق",
      description: "مراجعة نظام التوثيق والمراجع والاقتباسات وفقاً للمعايير المطلوبة",
      icon: <Search className="h-6 w-6" />,
      items: ["نظام التوثيق", "قائمة المراجع", "دقة الاقتباسات", "التنسيق المطلوب"]
    },
    {
      title: "المراجعة النهائية",
      description: "مراجعة شاملة ونهائية للنص كاملاً لضمان الجودة والاكتمال",
      icon: <Award className="h-6 w-6" />,
      items: ["المراجعة الشاملة", "التدقيق النهائي", "ضمان الجودة", "التسليم النهائي"]
    }
  ];

  const packages = [
    {
      name: "الباقة الأساسية",
      price: "8 ريال/صفحة",
      duration: "3-5 أيام",
      features: [
        "تدقيق نحوي وإملائي",
        "مراجعة علامات الترقيم",
        "تصحيح الأخطاء الأساسية",
        "تقرير بالتعديلات",
        "مراجعة واحدة مجانية"
      ],
      popular: false,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "الباقة المتقدمة",
      price: "12 ريال/صفحة",
      duration: "2-4 أيام",
      features: [
        "تدقيق لغوي شامل",
        "تحسين الأسلوب والوضوح",
        "مراجعة المصطلحات العلمية",
        "تدقيق التوثيق والمراجع",
        "تقرير مفصل بالتعديلات",
        "مراجعتان مجانيتان"
      ],
      popular: true,
      color: "from-green-500 to-green-600"
    },
    {
      name: "الباقة الاحترافية",
      price: "18 ريال/صفحة",
      duration: "1-3 أيام",
      features: [
        "تدقيق لغوي احترافي شامل",
        "مراجعة أسلوبية متقدمة",
        "تدقيق المحتوى العلمي",
        "مراجعة التنسيق والتصميم",
        "تقرير شامل ومفصل",
        "مراجعات غير محدودة",
        "استشارة لغوية مجانية"
      ],
      popular: false,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const documentTypes = [
    { name: "رسائل الماجستير والدكتوراه", icon: "🎓" },
    { name: "البحوث والدراسات العلمية", icon: "📖" },
    { name: "المقالات الأكاديمية", icon: "📄" },
    { name: "التقارير العلمية", icon: "📊" },
    { name: "الكتب والمؤلفات", icon: "📚" },
    { name: "المحتوى التعليمي", icon: "🏫" }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <PenTool className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              التدقيق اللغوي والمراجعة
            </h1>
            
            <p className="text-xl max-w-4xl mx-auto mb-12 leading-relaxed text-teal-100">
              مراجعة وتدقيق شامل ومتخصص للنصوص العلمية والأكاديمية لضمان الجودة اللغوية والأكاديمية العالية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowForm(true)}
                className="bg-white text-slate-900 hover:bg-teal-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
              >
                <Zap className="h-5 w-5 ml-2" />
                ابدأ التدقيق الآن
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4 rounded-full font-bold transition-all duration-300"
              >
                <Users className="h-5 w-5 ml-2" />
                استشارة لغوية مجانية
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
              مميزات خدمة التدقيق اللغوي
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نقدم خدمة متخصصة وشاملة للتدقيق اللغوي والمراجعة بأعلى معايير الجودة الأكاديمية
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

      {/* Review Types Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              أنواع التدقيق والمراجعة المتاحة
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              نغطي جميع جوانب التدقيق اللغوي والمراجعة المطلوبة للنصوص الأكاديمية والعلمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewTypes.map((type, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-all duration-300 group hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {type.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-white">
                      {type.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 leading-relaxed mb-4">
                    {type.description}
                  </CardDescription>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {type.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-400" />
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

      {/* Document Types Section */}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              أنواع النصوص التي نراجعها
            </h2>
            <p className="text-lg text-slate-600">
              نتخصص في تدقيق جميع أنواع النصوص الأكاديمية والعلمية
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {documentTypes.map((doc, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{doc.icon}</div>
                <h3 className="font-bold text-slate-800 text-sm">{doc.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">
              باقات خدمة التدقيق اللغوي
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              اختر الباقة التي تناسب احتياجاتك ونوع النص المطلوب تدقيقه
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
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
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
              <div className="text-4xl font-bold text-teal-600 mb-2">5,000+</div>
              <div className="text-slate-600">نص مراجع</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-green-600 mb-2">99.8%</div>
              <div className="text-slate-600">دقة التدقيق</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-blue-600 mb-2">24</div>
              <div className="text-slate-600">ساعة متوسط التسليم</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-slate-600">مدقق متخصص</div>
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
              <p className="text-slate-600">استشارة لغوية مباشرة</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            احصل على تدقيق لغوي احترافي
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            تدقيق ومراجعة شاملة لنصوصك الأكاديمية والعلمية لضمان أعلى مستويات الجودة اللغوية
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowForm(true)}
              className="bg-white text-slate-900 hover:bg-teal-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
            >
              <Rocket className="h-5 w-5 ml-2" />
              اطلب التدقيق الآن
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full font-bold transition-all duration-300"
            >
              <Users className="h-5 w-5 ml-2" />
              استشارة لغوية مجانية
            </Button>
          </div>
        </div>
      </section>

      {/* Service Inquiry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">طلب خدمة التدقيق اللغوي</h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>
            <ServiceInquiryForm 
              serviceType="language-review"
              serviceName="التدقيق اللغوي والمراجعة"
              serviceIcon="✏️"
            />
          </div>
        </div>
      )}

          <Footer />
    </div>
  );
};

export default LanguageReview;