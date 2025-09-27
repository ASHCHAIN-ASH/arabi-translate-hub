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
import { Award, BookOpen, Globe, TrendingUp, Star, Clock, CheckCircle, Search, FileText, Users, Target } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Publication = () => {
  const [publicationForm, setPublicationForm] = useState({
    name: "",
    email: "",
    phone: "",
    research_title: "",
    subject_area: "",
    research_type: "",
    target_journals: "",
    publication_urgency: "",
    current_status: "",
    additional_notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicationForm.name || !publicationForm.email || !publicationForm.research_title) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('journal-publication-form', {
        body: {
          ...publicationForm,
          service_type: 'journal_publication'
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب النشر بنجاح! سنتواصل معك قريباً");
      setPublicationForm({
        name: "",
        email: "",
        phone: "",
        research_title: "",
        subject_area: "",
        research_type: "",
        target_journals: "",
        publication_urgency: "",
        current_status: "",
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
      title: "اختيار المجلة المناسبة",
      description: "نساعدك في اختيار أفضل المجلات العلمية المناسبة لبحثك",
      features: ["تحليل محتوى البحث", "مطابقة مع نطاق المجلة", "تقييم معامل التأثير", "فرص القبول"],
      price: "من 300 ريال"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "إعداد المخطوط للنشر",
      description: "تنسيق وإعداد البحث وفقاً لمتطلبات المجلة المختارة",
      features: ["تنسيق حسب المجلة", "مراجعة المراجع", "تحسين الجودة", "التدقيق اللغوي"],
      price: "من 500 ريال"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "المراجعة الأكاديمية",
      description: "مراجعة شاملة من خبراء متخصصين قبل التقديم",
      features: ["تقييم المحتوى", "مراجعة المنهجية", "تحسين الحجج", "ضمان الجودة"],
      price: "من 400 ريال"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "متابعة عملية النشر",
      description: "متابعة مستمرة لحالة البحث والرد على المراجعين",
      features: ["متابعة التقديم", "الرد على المراجعين", "التعديلات المطلوبة", "متابعة القبول"],
      price: "من 600 ريال"
    }
  ];

  const journals = [
    {
      name: "المجلة العربية للعلوم الإدارية",
      impact_factor: "1.2",
      acceptance_rate: "25%",
      area: "إدارة الأعمال",
      language: "عربي/إنجليزي"
    },
    {
      name: "مجلة جامعة الملك سعود",
      impact_factor: "0.8",
      acceptance_rate: "30%",
      area: "متعددة التخصصات",
      language: "عربي/إنجليزي"
    },
    {
      name: "المجلة الدولية للتعليم العالي",
      impact_factor: "2.1",
      acceptance_rate: "20%",
      area: "التربية والتعليم",
      language: "إنجليزي"
    },
    {
      name: "مجلة العلوم الطبية السعودية",
      impact_factor: "1.5",
      acceptance_rate: "22%",
      area: "الطب والصحة",
      language: "إنجليزي"
    }
  ];

  const packages = [
    {
      name: "باقة الاستشارة",
      price: "500 ريال",
      features: [
        "استشارة مع خبير النشر",
        "تحديد المجلات المناسبة",
        "تقييم فرص القبول",
        "خطة النشر"
      ],
      recommended: false
    },
    {
      name: "باقة التأهيل للنشر",
      price: "1200 ريال",
      features: [
        "كل ما في الباقة الأساسية",
        "إعداد المخطوط للنشر",
        "التدقيق اللغوي المتخصص",
        "المراجعة الأكاديمية",
        "ضمان التقديم لمجلتين"
      ],
      recommended: true
    },
    {
      name: "باقة النشر الشاملة",
      price: "2000 ريال",
      features: [
        "كل ما في الباقة المتقدمة",
        "متابعة كاملة للنشر",
        "الرد على المراجعين",
        "إعادة التقديم عند الحاجة",
        "ضمان النشر لمدة سنة"
      ],
      recommended: false
    }
  ];

  const faqs = [
    {
      question: "كم يستغرق نشر البحث في المجلات العلمية؟",
      answer: "تختلف المدة حسب المجلة، لكن عموماً تتراوح من 3-12 شهر من التقديم حتى النشر، وقد تكون أطول في بعض المجلات المرموقة."
    },
    {
      question: "هل تضمنون قبول البحث للنشر؟",
      answer: "لا يمكن ضمان القبول 100% حيث يخضع لتقييم المحكمين، لكننا نرفع فرص القبول بشكل كبير من خلال خبرتنا."
    },
    {
      question: "ما هي المعايير لاختيار المجلة المناسبة؟",
      answer: "نراعي نطاق المجلة، معامل التأثير، معدل القبول، سمعة المجلة، ومتطلبات الباحث."
    },
    {
      question: "هل تساعدون في الرد على ملاحظات المحكمين؟",
      answer: "نعم، نقدم مساعدة شاملة في الرد على ملاحظات المحكمين وإجراء التعديلات المطلوبة."
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
            <Award className="h-20 w-20 mx-auto mb-6 animate-float text-white/90" />
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">
              نشر الأبحاث في المجلات العلمية
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              نساعدك في نشر بحثك العلمي في أفضل المجلات العلمية المحكمة محلياً وعالمياً
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong px-8">
                    ابدأ عملية النشر
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-arabic-title">طلب خدمة النشر العلمي</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>الاسم الكامل *</Label>
                        <Input
                          value={publicationForm.name}
                          onChange={(e) => setPublicationForm({...publicationForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>البريد الإلكتروني *</Label>
                        <Input
                          type="email"
                          value={publicationForm.email}
                          onChange={(e) => setPublicationForm({...publicationForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>رقم الهاتف</Label>
                        <Input
                          value={publicationForm.phone}
                          onChange={(e) => setPublicationForm({...publicationForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>مجال التخصص</Label>
                        <Select value={publicationForm.subject_area} onValueChange={(value) => setPublicationForm({...publicationForm, subject_area: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التخصص" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="business">إدارة الأعمال</SelectItem>
                            <SelectItem value="education">التربية والتعليم</SelectItem>
                            <SelectItem value="medicine">الطب والصحة</SelectItem>
                            <SelectItem value="engineering">الهندسة</SelectItem>
                            <SelectItem value="law">القانون</SelectItem>
                            <SelectItem value="psychology">علم النفس</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>عنوان البحث *</Label>
                      <Input
                        value={publicationForm.research_title}
                        onChange={(e) => setPublicationForm({...publicationForm, research_title: e.target.value})}
                        placeholder="العنوان الكامل للبحث"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>نوع البحث</Label>
                        <Select value={publicationForm.research_type} onValueChange={(value) => setPublicationForm({...publicationForm, research_type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع البحث" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="experimental">تجريبي</SelectItem>
                            <SelectItem value="descriptive">وصفي</SelectItem>
                            <SelectItem value="analytical">تحليلي</SelectItem>
                            <SelectItem value="case_study">دراسة حالة</SelectItem>
                            <SelectItem value="review">مراجعة أدبيات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>الحالة الحالية للبحث</Label>
                        <Select value={publicationForm.current_status} onValueChange={(value) => setPublicationForm({...publicationForm, current_status: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">مسودة أولية</SelectItem>
                            <SelectItem value="completed">مكتمل</SelectItem>
                            <SelectItem value="under_review">قيد المراجعة</SelectItem>
                            <SelectItem value="rejected">مرفوض من مجلة سابقة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>المجلات المستهدفة</Label>
                        <Input
                          value={publicationForm.target_journals}
                          onChange={(e) => setPublicationForm({...publicationForm, target_journals: e.target.value})}
                          placeholder="أسماء المجلات المفضلة (إن وجدت)"
                        />
                      </div>
                      <div>
                        <Label>مستوى الاستعجال</Label>
                        <Select value={publicationForm.publication_urgency} onValueChange={(value) => setPublicationForm({...publicationForm, publication_urgency: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المستوى" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">عادي</SelectItem>
                            <SelectItem value="urgent">مستعجل</SelectItem>
                            <SelectItem value="very_urgent">عاجل جداً</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>ملاحظات إضافية</Label>
                      <Textarea
                        value={publicationForm.additional_notes}
                        onChange={(e) => setPublicationForm({...publicationForm, additional_notes: e.target.value})}
                        placeholder="أي معلومات إضافية أو متطلبات خاصة..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "جاري الإرسال..." : "إرسال طلب النشر"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                تصفح المجلات
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
              خدمات النشر العلمي
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مجموعة شاملة من الخدمات لضمان نشر بحثك في أفضل المجلات العلمية
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

      {/* Journals Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              المجلات التي نتعامل معها
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              شبكة واسعة من أفضل المجلات العلمية المحكمة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journals.map((journal, index) => (
              <Card key={index} className="hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-arabic-title mb-2">{journal.name}</CardTitle>
                      <CardDescription>{journal.area}</CardDescription>
                    </div>
                    <Badge variant="outline">{journal.language}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-bold text-blue-600">{journal.impact_factor}</div>
                      <div className="text-xs text-blue-600">معامل التأثير</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-600">{journal.acceptance_rate}</div>
                      <div className="text-xs text-green-600">معدل القبول</div>
                    </div>
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
              باقات النشر العلمي
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الباقة التي تناسب احتياجاتك ومرحلة بحثك
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
              مراحل عملية النشر
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              عملية منظمة ومدروسة لضمان أفضل فرص النشر
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "التقييم الأولي", description: "تقييم البحث وتحديد المجلات المناسبة", icon: <Search className="w-6 h-6" /> },
              { step: "2", title: "الإعداد للنشر", description: "تنسيق البحث وتحسين جودته", icon: <FileText className="w-6 h-6" /> },
              { step: "3", title: "التقديم للمجلة", description: "تقديم البحث للمجلة المختارة", icon: <Target className="w-6 h-6" /> },
              { step: "4", title: "المتابعة والنشر", description: "متابعة عملية المراجعة حتى النشر", icon: <Award className="w-6 h-6" /> }
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
            اجعل بحثك يصل للعالم
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            ابدأ رحلة نشر بحثك العلمي في أفضل المجلات المحكمة معنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  ابدأ عملية النشر
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Globe className="w-4 h-4 mr-2" />
              استشارة مجانية
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Publication;