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
import { Layout, FileText, Palette, Settings, CheckCircle, Star, Clock, Award, Layers, PenTool, Book, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/data/legacy/client";

import Footer from '@/components/Footer';
import AuthCtaCard from "@/components/research/AuthCtaCard";
const Formatting = () => {
  const [formatForm, setFormatForm] = useState({
    name: "",
    email: "",
    phone: "",
    document_type: "",
    academic_level: "",
    style_guide: "",
    pages_count: "",
    urgency: "",
    special_requirements: "",
    additional_notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formatForm.name || !formatForm.email || !formatForm.document_type) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-service-inquiry', {
        body: {
          ...formatForm,
          service_type: 'document_formatting'
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب التنسيق بنجاح! سنتواصل معك قريباً");
      setFormatForm({
        name: "",
        email: "",
        phone: "",
        document_type: "",
        academic_level: "",
        style_guide: "",
        pages_count: "",
        urgency: "",
        special_requirements: "",
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
      icon: <Layout className="h-8 w-8" />,
      title: "تنسيق هيكل الوثيقة",
      description: "تنظيم الفصول والأقسام والعناوين وفقاً للمعايير الأكاديمية",
      features: ["تنسيق العناوين", "ترقيم الصفحات", "جدول المحتويات", "فهرس الجداول والأشكال"],
      price: "من 300 ريال"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "تنسيق النصوص والخطوط",
      description: "تنسيق الخطوط والمسافات والهوامش حسب الدليل المعتمد",
      features: ["اختيار الخطوط المناسبة", "تنسيق المسافات", "ضبط الهوامش", "محاذاة النصوص"],
      price: "من 200 ريال"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "تنسيق المراجع والاقتباسات",
      description: "تنسيق قائمة المراجع والاقتباسات وفقاً للأسلوب المطلوب",
      features: ["أسلوب APA", "أسلوب MLA", "أسلوب Chicago", "الأسلوب العربي"],
      price: "من 250 ريال"
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "تنسيق الجداول والأشكال",
      description: "تصميم وتنسيق الجداول والرسوم البيانية والأشكال التوضيحية",
      features: ["تصميم الجداول", "الرسوم البيانية", "الأشكال التوضيحية", "التسميات والتوضيحات"],
      price: "من 400 ريال"
    }
  ];

  const styleGuides = [
    {
      name: "APA Style",
      description: "جمعية علم النفس الأمريكية",
      fields: ["علم النفس", "التربية", "الطب"],
      features: ["الإصدار السابع", "مراجع داخلية", "قائمة مراجع مفصلة"]
    },
    {
      name: "MLA Style",
      description: "جمعية اللغة الحديثة",
      fields: ["الأدب", "اللغات", "الفنون"],
      features: ["الإصدار التاسع", "اقتباسات داخلية", "صفحة الأعمال المقتبسة"]
    },
    {
      name: "Chicago Style",
      description: "دليل شيكاغو للأسلوب",
      fields: ["التاريخ", "الأدب", "الفنون"],
      features: ["نظام التاريخ والمؤلف", "الحواشي", "ببليوغرافيا"]
    },
    {
      name: "الأسلوب العربي",
      description: "المعايير العربية للتوثيق",
      fields: ["جميع التخصصات العربية"],
      features: ["التوثيق العربي", "المراجع العربية", "التوثيق المختلط"]
    }
  ];

  const packages = [
    {
      name: "تنسيق أساسي",
      price: "400 ريال",
      pages: "حتى 50 صفحة",
      features: [
        "تنسيق النصوص والخطوط",
        "تنسيق العناوين",
        "ترقيم الصفحات",
        "جدول المحتويات",
        "التسليم خلال 3 أيام"
      ],
      recommended: false
    },
    {
      name: "تنسيق متقدم",
      price: "700 ريال",
      pages: "حتى 100 صفحة",
      features: [
        "كل ما في الباقة الأساسية",
        "تنسيق المراجع والاقتباسات",
        "تنسيق الجداول والأشكال",
        "فهرس الجداول والأشكال",
        "مراجعة شاملة",
        "التسليم خلال يومين"
      ],
      recommended: true
    },
    {
      name: "تنسيق شامل",
      price: "1000 ريال",
      pages: "أكثر من 100 صفحة",
      features: [
        "كل ما في الباقة المتقدمة",
        "تصميم الغلاف",
        "تصميم احترافي للجداول",
        "تحسين الرسوم البيانية",
        "مراجعة متعددة",
        "استشارة مجانية",
        "التسليم خلال 24 ساعة"
      ],
      recommended: false
    }
  ];

  const faqs = [
    {
      question: "ما هي أنواع الوثائق التي تنسقونها؟",
      answer: "نقوم بتنسيق رسائل الماجستير والدكتوراه، البحوث العلمية، التقارير، الكتب، والمقالات الأكاديمية."
    },
    {
      question: "هل تتعاملون مع جميع أدلة الأساليب؟",
      answer: "نعم، نتعامل مع جميع الأساليب الشائعة مثل APA، MLA، Chicago، وكذلك الأساليب العربية المحلية."
    },
    {
      question: "كم يستغرق تنسيق الوثيقة؟",
      answer: "يعتمد على حجم الوثيقة وتعقيدها، لكن عادة من يوم إلى 5 أيام، مع إمكانية التسريع عند الحاجة."
    },
    {
      question: "هل تقدمون تعديلات مجانية؟",
      answer: "نعم، نقدم جولة تعديل مجانية واحدة خلال أسبوع من التسليم، وتعديلات إضافية برسوم رمزية."
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
            <Layout className="h-20 w-20 mx-auto mb-6 animate-float text-white/90" />
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">
              تنسيق الرسائل العلمية والوثائق الأكاديمية
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              تنسيق احترافي للرسائل العلمية والوثائق الأكاديمية وفقاً لأعلى المعايير الأكاديمية المحلية والدولية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong px-8">
                    اطلب تنسيق وثيقتك
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-arabic-title">طلب خدمة التنسيق</DialogTitle>
                  </DialogHeader>
                  <AuthCtaCard serviceTitle="التنسيق" />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <FileText className="w-4 h-4 mr-2" />
                عينات من أعمالنا
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
              خدمات التنسيق المتخصصة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مجموعة شاملة من خدمات التنسيق الأكاديمي المتخصص
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

      {/* Style Guides Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              أدلة الأساليب المدعومة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نتعامل مع جميع أدلة الأساليب الأكاديمية المعتمدة محلياً وعالمياً
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {styleGuides.map((guide, index) => (
              <Card key={index} className="hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-success flex items-center justify-center text-white">
                    <Book className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-arabic-title text-center">{guide.name}</CardTitle>
                  <CardDescription className="text-sm text-center">{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">التخصصات:</h4>
                    <div className="flex flex-wrap gap-1">
                      {guide.fields.map((field, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{field}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">المميزات:</h4>
                    <ul className="space-y-1">
                      {guide.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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
              باقات التنسيق
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الباقة التي تناسب احتياجاتك وحجم وثيقتك
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
                  <Badge variant="outline">{pkg.pages}</Badge>
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
              كيف تتم عملية التنسيق؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              عملية منظمة ومدروسة لضمان أفضل جودة في التنسيق
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "استلام الوثيقة", description: "استلام الملف وتحديد المتطلبات", icon: <FileText className="w-6 h-6" /> },
              { step: "2", title: "التحليل والتخطيط", description: "تحليل الوثيقة ووضع خطة التنسيق", icon: <Layers className="w-6 h-6" /> },
              { step: "3", title: "التنسيق الاحترافي", description: "تطبيق التنسيق وفق المعايير المطلوبة", icon: <PenTool className="w-6 h-6" /> },
              { step: "4", title: "المراجعة والتسليم", description: "مراجعة شاملة وتسليم الوثيقة المنسقة", icon: <Award className="w-6 h-6" /> }
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
            اجعل وثيقتك تبدو احترافية
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            احصل على تنسيق احترافي يلبي جميع المعايير الأكاديمية لوثيقتك العلمية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  اطلب تنسيق وثيقتك
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Zap className="w-4 h-4 mr-2" />
              استشارة مجانية
            </Button>
          </div>
        </div>
      </section>
          <Footer />
    </div>
  );
};

export default Formatting;