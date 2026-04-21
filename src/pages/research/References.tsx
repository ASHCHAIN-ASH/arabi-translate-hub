import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Database, BookOpen, Search, FileText, Globe, Clock, Award, CheckCircle, Download, Archive, Filter } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import Footer from '@/components/Footer';
import AuthCtaCard from "@/components/research/AuthCtaCard";
const References = () => {
  const [referenceForm, setReferenceForm] = useState({
    name: "",
    email: "",
    phone: "",
    research_topic: "",
    academic_level: "",
    subject_area: "",
    reference_count: "",
    language_preference: "",
    urgency: "",
    additional_notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceForm.name || !referenceForm.email || !referenceForm.research_topic) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-service-inquiry', {
        body: {
          ...referenceForm,
          service_type: 'references_research'
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب توفير المراجع بنجاح! سنتواصل معك قريباً");
      setReferenceForm({
        name: "",
        email: "",
        phone: "",
        research_topic: "",
        academic_level: "",
        subject_area: "",
        reference_count: "",
        language_preference: "",
        urgency: "",
        additional_notes: ""
      });
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("خطأ في إرسال الطلب: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "البحث عن المراجع",
      description: "بحث شامل في قواعد البيانات العلمية العالمية",
      features: ["قواعد البيانات الأكاديمية", "المجلات العلمية المحكمة", "الكتب والمؤلفات", "الأطروحات الجامعية"],
      price: "من 200 ريال"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "تلخيص الدراسات",
      description: "تلخيص مفصل ودقيق للدراسات والبحوث ذات الصلة",
      features: ["ملخص تنفيذي", "النتائج الرئيسية", "المنهجية المتبعة", "التوصيات"],
      price: "من 150 ريال"
    },
    {
      icon: <Archive className="h-8 w-8" />,
      title: "تنظيم المراجع",
      description: "تنظيم وتنسيق المراجع وفقاً للأسلوب المطلوب",
      features: ["أسلوب APA", "أسلوب MLA", "أسلوب Chicago", "الأسلوب العربي"],
      price: "من 100 ريال"
    },
    {
      icon: <Filter className="h-8 w-8" />,
      title: "تقييم المصادر",
      description: "تقييم جودة وموثوقية المراجع العلمية",
      features: ["تقييم المصداقية", "حداثة المصادر", "الصلة بالموضوع", "جودة المحتوى"],
      price: "من 250 ريال"
    }
  ];

  const databases = [
    {
      name: "PubMed",
      description: "قاعدة بيانات للعلوم الطبية والحيوية",
      coverage: "30+ مليون مقال",
      languages: ["إنجليزية", "متعددة"]
    },
    {
      name: "IEEE Xplore",
      description: "قاعدة بيانات للهندسة والتكنولوجيا",
      coverage: "5+ مليون وثيقة",
      languages: ["إنجليزية"]
    },
    {
      name: "JSTOR",
      description: "أرشيف أكاديمي متعدد التخصصات",
      coverage: "12+ مليون مقال",
      languages: ["إنجليزية", "متعددة"]
    },
    {
      name: "دار المنظومة",
      description: "قاعدة بيانات عربية شاملة",
      coverage: "500,000+ مصدر عربي",
      languages: ["عربية", "إنجليزية"]
    }
  ];

  const packages = [
    {
      name: "باقة أساسية",
      price: "300 ريال",
      features: [
        "20 مرجع علمي",
        "تلخيص 5 دراسات",
        "تنسيق APA أو MLA",
        "التسليم خلال 5 أيام"
      ],
      recommended: false
    },
    {
      name: "باقة متقدمة",
      price: "500 ريال", 
      features: [
        "40 مرجع علمي",
        "تلخيص 10 دراسات",
        "تنسيق متعدد الأساليب",
        "تقييم جودة المصادر",
        "التسليم خلال 3 أيام"
      ],
      recommended: true
    },
    {
      name: "باقة شاملة",
      price: "800 ريال",
      features: [
        "60+ مرجع علمي",
        "تلخيص 15 دراسة",
        "مراجعة أدبيات كاملة",
        "خريطة مفاهيمية",
        "استشارة مع خبير",
        "التسليم خلال يومين"
      ],
      recommended: false
    }
  ];

  const faqs = [
    {
      question: "ما هي المصادر التي تبحثون فيها؟",
      answer: "نبحث في أكثر من 50 قاعدة بيانات علمية عالمية وعربية، بما في ذلك PubMed، IEEE، JSTOR، ودار المنظومة."
    },
    {
      question: "هل تقدمون مراجع بلغات متعددة؟",
      answer: "نعم، نوفر مراجع باللغة العربية والإنجليزية والفرنسية حسب تخصصك واحتياجاتك."
    },
    {
      question: "كيف تضمنون جودة المراجع؟",
      answer: "جميع المراجع من مصادر محكمة ومعترف بها أكاديمياً، ونقوم بتقييم حداثتها وصلتها بموضوع البحث."
    },
    {
      question: "هل يمكن طلب مراجع إضافية بعد التسليم؟",
      answer: "نعم، يمكن طلب مراجع إضافية أو تعديل القائمة خلال أسبوع من التسليم برسوم إضافية."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-success text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-success/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <Database className="h-20 w-20 mx-auto mb-6 animate-float text-white/90" />
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">
              توفير المراجع وتلخيص الدراسات
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              خدمة شاملة لجمع المراجع العلمية من أفضل قواعد البيانات العالمية وتلخيص الدراسات ذات الصلة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong px-8">
                    اطلب خدمة المراجع
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-arabic-title">طلب خدمة توفير المراجع</DialogTitle>
                  </DialogHeader>
                  <AuthCtaCard serviceTitle="إعداد المراجع" />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                تصفح قواعد البيانات
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4 text-foreground">
              خدماتنا المتخصصة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مجموعة شاملة من الخدمات لدعم بحثك العلمي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-success flex items-center justify-center text-white shadow-success animate-pulse-slow flex-shrink-0">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="font-arabic-title text-xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="font-arabic-body">{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Badge variant="secondary" className="bg-success/10 text-success">{service.price}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Databases Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              قواعد البيانات التي نبحث فيها
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نصل إلى أفضل قواعد البيانات العلمية العالمية والعربية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {databases.map((db, index) => (
              <Card key={index} className="text-center hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-success flex items-center justify-center text-white">
                    <Database className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-arabic-title">{db.name}</CardTitle>
                  <CardDescription className="text-sm">{db.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium">{db.coverage}</div>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {db.languages.map((lang, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{lang}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              باقات خدمة المراجع
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الباقة المناسبة لاحتياجاتك البحثية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`text-center hover-lift transition-all duration-500 animate-fade-in-up ${pkg.recommended ? 'ring-2 ring-success shadow-strong' : ''}`} style={{ animationDelay: `${index * 150}ms` }}>
                {pkg.recommended && (
                  <div className="bg-success text-white text-sm py-2 rounded-t-lg font-medium">
                    الأكثر طلباً
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-arabic-title">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-success mb-2">{pkg.price}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className={`w-full ${pkg.recommended ? 'bg-success hover:bg-success/90' : ''}`}>
                        اختر هذه الباقة
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              كيف نعمل؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              عملية منظمة ومدروسة لضمان حصولك على أفضل المراجع
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "تحديد المتطلبات", description: "نحدد موضوع البحث والمتطلبات بدقة", icon: <Search className="w-6 h-6" /> },
              { step: "2", title: "البحث الشامل", description: "بحث في قواعد البيانات المتخصصة", icon: <Database className="w-6 h-6" /> },
              { step: "3", title: "التقييم والفلترة", description: "تقييم جودة المراجع وصلتها بالموضوع", icon: <Filter className="w-6 h-6" /> },
              { step: "4", title: "التسليم والمتابعة", description: "تسليم قائمة المراجع مع الملخصات", icon: <Download className="w-6 h-6" /> }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-success text-white flex items-center justify-center text-xl font-bold shadow-success">
                  {item.step}
                </div>
                <h3 className="text-lg font-arabic-title font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              الأسئلة الشائعة
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle className="text-lg font-arabic-title">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-success text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
            ابدأ بحثك بقائمة مراجع قوية
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            احصل على مراجع علمية موثوقة وحديثة من أفضل قواعد البيانات العالمية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  اطلب خدمة المراجع
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Globe className="w-4 h-4 mr-2" />
              تصفح قواعد البيانات
            </Button>
          </div>
        </div>
      </section>
          <Footer />
    </div>
  );
};

export default References;