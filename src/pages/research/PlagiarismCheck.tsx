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
import { Progress } from "@/components/ui/progress";
import { Shield, Search, CheckCircle, AlertTriangle, FileText, Clock, Award, Upload, Eye, Download, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import Footer from '@/components/Footer';
import AuthCtaCard from "@/components/research/AuthCtaCard";
const PlagiarismCheck = () => {
  const [checkForm, setCheckForm] = useState({
    name: "",
    email: "",
    phone: "",
    document_type: "",
    language: "",
    pages_count: "",
    urgency: "",
    additional_notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkForm.name || !checkForm.email || !checkForm.document_type) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-service-inquiry', {
        body: {
          ...checkForm,
          service_type: 'plagiarism_check'
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب فحص السرقة الأدبية بنجاح! سنتواصل معك قريباً");
      setCheckForm({
        name: "",
        email: "",
        phone: "",
        document_type: "",
        language: "",
        pages_count: "",
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

  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "فحص شامل ودقيق",
      description: "فحص شامل لجميع المصادر المحلية والعالمية",
      details: ["قواعد بيانات أكاديمية", "مواقع الإنترنت", "الكتب والمجلات", "الأطروحات والرسائل"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "تقرير مفصل",
      description: "تقرير شامل يوضح نسبة التشابه ومصادره",
      details: ["نسبة التشابه الإجمالية", "تحديد المصادر", "اقتراحات للتحسين", "خلاصة تنفيذية"]
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "ضمان الجودة",
      description: "مراجعة يدوية من خبراء متخصصين",
      details: ["تحليل سياقي", "تمييز الاقتباسات", "فحص الترجمة", "تقييم الأصالة"]
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "سرعة في التسليم",
      description: "نتائج سريعة ودقيقة في وقت قياسي",
      details: ["24 ساعة للفحص العادي", "6 ساعات للفحص السريع", "2 ساعة للفحص العاجل", "إشعارات فورية"]
    }
  ];

  const checkTypes = [
    {
      type: "أساسي",
      price: "50 ريال",
      features: ["فحص قواعد البيانات الأساسية", "تقرير نسبة التشابه", "تحديد المصادر", "التسليم خلال 24 ساعة"],
      recommended: false
    },
    {
      type: "متقدم", 
      price: "100 ريال",
      features: ["فحص شامل لجميع المصادر", "تقرير مفصل ملون", "اقتراحات للتحسين", "مراجعة يدوية", "التسليم خلال 12 ساعة"],
      recommended: true
    },
    {
      type: "احترافي",
      price: "150 ريال", 
      features: ["فحص متقدم مع AI", "تحليل سياقي عميق", "استشارة هاتفية", "مراجعة ما بعد التعديل", "التسليم خلال 6 ساعات"],
      recommended: false
    }
  ];

  const faqs = [
    {
      question: "ما هي نسبة التشابه المقبولة؟",
      answer: "تختلف النسبة حسب نوع البحث والجامعة، لكن عموماً يُقبل أقل من 15% للأبحاث الأكاديمية و10% للرسائل العلمية."
    },
    {
      question: "هل تشمل الفحص المراجع والببليوغرافيا؟",
      answer: "نعم، نوفر خيار استبعاد المراجع والاقتباسات المباشرة من حساب نسبة التشابه."
    },
    {
      question: "كيف يتم ضمان سرية الوثائق؟",
      answer: "نحن ملتزمون بسرية تامة، ولا نحتفظ بأي نسخ من الوثائق بعد انتهاء الخدمة."
    },
    {
      question: "هل يمكن فحص المحتوى بلغات متعددة؟",
      answer: "نعم، نوفر فحص للمحتوى العربي والإنجليزي والفرنسية وعدة لغات أخرى."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-primary/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <Shield className="h-20 w-20 mx-auto mb-6 animate-float text-white/90" />
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">
              فحص السرقة الأدبية والعلمية
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              تأكد من أصالة بحثك العلمي مع خدمة فحص شاملة ودقيقة للسرقة الأدبية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong px-8">
                    ابدأ الفحص الآن
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-arabic-title">طلب فحص السرقة الأدبية</DialogTitle>
                  </DialogHeader>
                  <AuthCtaCard serviceTitle="فحص الانتحال" />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Upload className="w-4 h-4 mr-2" />
                رفع ملف للفحص
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4 text-foreground">
              مميزات خدمة فحص السرقة الأدبية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نوفر خدمة فحص شاملة ودقيقة للتأكد من أصالة بحثك العلمي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-primary animate-pulse-slow flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="font-arabic-title text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="font-arabic-body">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              باقات فحص السرقة الأدبية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الباقة المناسبة لاحتياجاتك البحثية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {checkTypes.map((plan, index) => (
              <Card key={index} className={`text-center hover-lift transition-all duration-500 animate-fade-in-up ${plan.recommended ? 'ring-2 ring-primary shadow-strong' : ''}`} style={{ animationDelay: `${index * 150}ms` }}>
                {plan.recommended && (
                  <div className="bg-primary text-white text-sm py-2 rounded-t-lg font-medium">
                    الأكثر شعبية
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-arabic-title">{plan.type}</CardTitle>
                  <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                  <CardDescription>للوثيقة الواحدة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className={`w-full ${plan.recommended ? 'bg-primary hover:bg-primary/90' : ''}`}>
                        احجز الآن
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              كيف تتم عملية الفحص؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              عملية بسيطة ومنظمة لضمان حصولك على أدق النتائج
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "رفع الملف", description: "قم برفع ملف البحث بصيغة Word أو PDF", icon: <Upload className="w-6 h-6" /> },
              { step: "2", title: "الفحص التلقائي", description: "فحص شامل لقواعد البيانات العالمية", icon: <Search className="w-6 h-6" /> },
              { step: "3", title: "المراجعة اليدوية", description: "مراجعة من خبراء متخصصين", icon: <Eye className="w-6 h-6" /> },
              { step: "4", title: "التقرير النهائي", description: "تقرير مفصل مع التوصيات", icon: <Download className="w-6 h-6" /> }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary text-white flex items-center justify-center text-xl font-bold shadow-primary">
                  {item.step}
                </div>
                <h3 className="text-lg font-arabic-title font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              نموذج لتقرير الفحص
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مثال على التقرير المفصل الذي ستحصل عليه
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-xl font-arabic-title text-center">تقرير فحص السرقة الأدبية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12%</div>
                    <div className="text-sm text-green-600">نسبة التشابه الإجمالية</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-blue-600">مصادر التشابه</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">5%</div>
                    <div className="text-sm text-orange-600">تشابه بدون مراجع</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">التحليل التفصيلي:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                      <span className="text-sm">تشابه مع: "دراسة في الإدارة المالية" - د. أحمد محمد</span>
                      <Badge variant="secondary">3.2%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                      <span className="text-sm">تشابه مع: مقال من مجلة الأعمال العربية</span>
                      <Badge variant="destructive">2.8%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span className="text-sm">تشابه مع: رسالة ماجستير - جامعة الملك سعود</span>
                      <Badge>2.1%</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    تحميل التقرير الكامل
                  </Button>
                </div>
              </CardContent>
            </Card>
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
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
            تأكد من أصالة بحثك الآن
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            احصل على تقرير مفصل وموثوق لفحص السرقة الأدبية لبحثك العلمي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  ابدأ الفحص الآن
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Upload className="w-4 h-4 mr-2" />
              رفع ملف للفحص
            </Button>
          </div>
        </div>
      </section>
          <Footer />
    </div>
  );
};

export default PlagiarismCheck;