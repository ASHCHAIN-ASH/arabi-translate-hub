import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, TrendingUp, PieChart, Calculator, Users, Clock, Trophy, 
  CheckCircle, Zap, ArrowRight, MessageCircle, Mail, Phone,
  Award, Shield, Rocket, Target, Database, FileSpreadsheet
} from "lucide-react";

const StatisticalAnalysis = () => {
  const [showForm, setShowForm] = useState(false);

  const features = [
    {
      title: "التحليل الإحصائي المتقدم",
      description: "تحليل شامل للبيانات باستخدام أحدث البرامج الإحصائية المتخصصة",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "الرسوم البيانية الاحترافية",
      description: "إنشاء رسوم بيانية وجداول احترافية توضح النتائج بشكل مرئي وواضح",
      icon: <PieChart className="h-8 w-8" />,
      color: "from-green-500 to-green-600"
    },
    {
      title: "مناقشة علمية شاملة",
      description: "كتابة مناقشة علمية معمقة للنتائج مع ربطها بالأدبيات والإطار النظري",
      icon: <Target className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "تفسير إحصائي دقيق",
      description: "تفسير النتائج الإحصائية بطريقة علمية واضحة ومفهومة",
      icon: <Calculator className="h-8 w-8" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const analysisTypes = [
    {
      title: "التحليل الوصفي",
      description: "تحليل البيانات الأساسية والمتوسطات والانحرافات المعيارية والتوزيعات",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      items: ["المتوسطات الحسابية", "الانحرافات المعيارية", "التوزيعات التكرارية", "مقاييس التشتت"]
    },
    {
      title: "التحليل الاستنتاجي",
      description: "اختبار الفرضيات والارتباطات والانحدار والتحليل المتقدم للبيانات",
      icon: <TrendingUp className="h-6 w-6" />,
      items: ["اختبار الفرضيات", "تحليل الارتباط", "تحليل الانحدار", "التحليل المتعدد"]
    },
    {
      title: "الاختبارات الإحصائية",
      description: "تطبيق الاختبارات الإحصائية المناسبة لنوع البيانات وطبيعة الدراسة",
      icon: <Calculator className="h-6 w-6" />,
      items: ["اختبار T", "تحليل التباين ANOVA", "اختبار كاي سكوير", "الاختبارات اللامعلمية"]
    },
    {
      title: "الرسوم البيانية",
      description: "إنشاء رسوم بيانية احترافية ومخططات توضيحية للنتائج",
      icon: <PieChart className="h-6 w-6" />,
      items: ["الرسوم البيانية الشريطية", "المخططات الدائرية", "رسوم الانتشار", "المخططات التفاعلية"]
    },
    {
      title: "مناقشة النتائج",
      description: "كتابة مناقشة علمية شاملة ومعمقة للنتائج مع التفسير والتحليل",
      icon: <Target className="h-6 w-6" />,
      items: ["تفسير النتائج", "ربط النتائج بالفرضيات", "المقارنة مع الدراسات السابقة", "الاستنتاجات العلمية"]
    },
    {
      title: "التوصيات والاقتراحات",
      description: "وضع توصيات علمية مبنية على النتائج مع اقتراحات للبحوث المستقبلية",
      icon: <Award className="h-6 w-6" />,
      items: ["التوصيات العملية", "اقتراحات للبحوث المستقبلية", "الآثار التطبيقية", "القيود والمحددات"]
    }
  ];

  const packages = [
    {
      name: "الباقة الأساسية",
      price: "1,800 ريال",
      duration: "10-14 يوم",
      features: [
        "تحليل إحصائي أساسي",
        "5-8 جداول ورسوم بيانية",
        "مناقشة النتائج (8-12 صفحة)",
        "تطبيق الاختبارات الأساسية",
        "مراجعة واحدة مجانية"
      ],
      popular: false,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "الباقة المتقدمة",
      price: "3,000 ريال",
      duration: "7-10 أيام",
      features: [
        "تحليل إحصائي شامل",
        "10-15 جدول ورسم بياني",
        "مناقشة مفصلة (15-20 صفحة)",
        "اختبارات إحصائية متقدمة",
        "تحليل الانحدار والارتباط",
        "ثلاث مراجعات مجانية",
        "استشارة مع خبير إحصائي"
      ],
      popular: true,
      color: "from-green-500 to-green-600"
    },
    {
      name: "الباقة الاحترافية",
      price: "5,000 ريال",
      duration: "5-7 أيام",
      features: [
        "تحليل إحصائي احترافي متكامل",
        "20+ جدول ورسم بياني تفاعلي",
        "مناقشة شاملة (25-30 صفحة)",
        "جميع الاختبارات الإحصائية",
        "تحليل متعدد المتغيرات",
        "نمذجة إحصائية متقدمة",
        "مراجعات غير محدودة",
        "دعم مستمر من خبراء"
      ],
      popular: false,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const softwareUsed = [
    { name: "SPSS", description: "للتحليل الإحصائي الشامل" },
    { name: "R Programming", description: "للتحليل المتقدم والنمذجة" },
    { name: "Python", description: "لتحليل البيانات الضخمة" },
    { name: "STATA", description: "للتحليل الاقتصادي والاجتماعي" },
    { name: "Excel", description: "للتحليل الأساسي والرسوم" },
    { name: "Tableau", description: "للرسوم البيانية التفاعلية" }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              التحليل الإحصائي ومناقشة النتائج
            </h1>
            
            <p className="text-xl max-w-4xl mx-auto mb-12 leading-relaxed text-blue-100">
              تحليل احترافي ومتقدم للبيانات وكتابة مناقشة علمية شاملة ومعمقة للنتائج مع التفسير الإحصائي الدقيق
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowForm(true)}
                className="bg-white text-slate-900 hover:bg-blue-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
              >
                <Zap className="h-5 w-5 ml-2" />
                احصل على التحليل الآن
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4 rounded-full font-bold transition-all duration-300"
              >
                <Users className="h-5 w-5 ml-2" />
                استشارة إحصائية مجانية
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
              مميزات خدمة التحليل الإحصائي
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نقدم خدمة متخصصة ومتقدمة للتحليل الإحصائي ومناقشة النتائج بأعلى المعايير العلمية
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

      {/* Analysis Types Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              أنواع التحليل الإحصائي المتاحة
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              نغطي جميع أنواع التحليل الإحصائي المطلوبة للبحوث الأكاديمية والعلمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analysisTypes.map((type, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-all duration-300 group hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
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
                        <CheckCircle className="h-4 w-4 text-blue-400" />
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

      {/* Software Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              البرامج الإحصائية المستخدمة
            </h2>
            <p className="text-lg text-slate-600">
              نستخدم أحدث البرامج الإحصائية المتخصصة لضمان دقة التحليل
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {softwareUsed.map((software, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {software.name.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{software.name}</h3>
                <p className="text-sm text-slate-600">{software.description}</p>
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
              باقات خدمة التحليل الإحصائي
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              اختر الباقة التي تناسب احتياجاتك البحثية ونوع البيانات لديك
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
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
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
              <div className="text-4xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-slate-600">تحليل إحصائي مكتمل</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-slate-600">عينة محللة</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-purple-600 mb-2">97%</div>
              <div className="text-slate-600">دقة التحليل</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-orange-600 mb-2">5-14</div>
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
              <p className="text-slate-600">استشارة إحصائية مباشرة</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            احصل على تحليل إحصائي احترافي
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            تحليل إحصائي شامل ومتقدم مع مناقشة علمية معمقة للنتائج تدعم بحثك الأكاديمي
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowForm(true)}
              className="bg-white text-slate-900 hover:bg-blue-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
            >
              <Rocket className="h-5 w-5 ml-2" />
              اطلب التحليل الآن
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full font-bold transition-all duration-300"
            >
              <Users className="h-5 w-5 ml-2" />
              استشارة إحصائية مجانية
            </Button>
          </div>
        </div>
      </section>

      {/* Service Inquiry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">طلب خدمة التحليل الإحصائي</h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>
            <ServiceInquiryForm 
              serviceName="التحليل الإحصائي ومناقشة النتائج"
              serviceIcon="📊"
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StatisticalAnalysis;