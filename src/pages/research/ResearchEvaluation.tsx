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
import { Scale, CheckCircle, Award, Users, Star, Clock, Shield, Target, BookOpen, Search, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/data/legacy/client";

import Footer from '@/components/Footer';
import AuthCtaCard from "@/components/research/AuthCtaCard";
const ResearchEvaluation = () => {
  const [evaluationForm, setEvaluationForm] = useState({
    name: "",
    email: "",
    phone: "",
    document_type: "",
    field_of_study: "",
    evaluation_type: "",
    pages_count: "",
    urgency: "",
    specific_focus: "",
    additional_notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluationForm.name || !evaluationForm.email || !evaluationForm.document_type) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-service-inquiry', {
        body: {
          ...evaluationForm,
          service_type: 'research_evaluation'
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب التحكيم بنجاح! سنتواصل معك قريباً");
      setEvaluationForm({
        name: "",
        email: "",
        phone: "",
        document_type: "",
        field_of_study: "",
        evaluation_type: "",
        pages_count: "",
        urgency: "",
        specific_focus: "",
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
      icon: <Scale className="h-8 w-8" />,
      title: "تحكيم الدراسات البحثية",
      description: "تقييم شامل للبحوث العلمية من حيث المنهجية والنتائج",
      features: ["تقييم المنهجية", "مراجعة النتائج", "تقييم الإضافة العلمية", "تقرير تفصيلي"],
      price: "من 400 ريال"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "تحكيم الاستبانات والأدوات",
      description: "تقييم صدق وثبات أدوات جمع البيانات والاستبانات",
      features: ["تقييم الصدق الظاهري", "قياس الثبات", "التحليل الإحصائي", "تقييم الصياغة"],
      price: "من 300 ريال"
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "المراجعة الأكاديمية",
      description: "مراجعة شاملة للمحتوى العلمي والأكاديمي",
      features: ["مراجعة المحتوى", "تقييم الأسلوب", "فحص المراجع", "التدقيق العلمي"],
      price: "من 350 ريال"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "تقييم جودة البحث",
      description: "تقييم شامل لجودة البحث وإمكانية النشر",
      features: ["معايير الجودة", "إمكانية النشر", "التحسينات المقترحة", "التوصيات"],
      price: "من 500 ريال"
    }
  ];

  const evaluators = [
    {
      name: "د. محمد الأحمد",
      specialty: "مناهج البحث والإحصاء",
      experience: "20+ سنة",
      evaluations: "500+ تحكيم",
      rating: 4.9
    },
    {
      name: "د. سارة العلي",
      specialty: "البحوث التربوية والنفسية",
      experience: "15+ سنة",
      evaluations: "350+ تحكيم",
      rating: 4.8
    },
    {
      name: "د. أحمد المحمود",
      specialty: "البحوث الطبية والصحية",
      experience: "18+ سنة",
      evaluations: "400+ تحكيم",
      rating: 4.9
    }
  ];

  const packages = [
    {
      name: "تحكيم أساسي",
      price: "500 ريال",
      features: [
        "تحكيم من محكم واحد",
        "تقرير مفصل",
        "تقييم المنهجية",
        "توصيات للتحسين",
        "التسليم خلال 5 أيام"
      ],
      recommended: false
    },
    {
      name: "تحكيم متقدم",
      price: "800 ريال",
      features: [
        "تحكيم من محكمين اثنين",
        "تقرير شامل ومفصل",
        "تحليل إحصائي للأدوات",
        "استشارة مع المحكم",
        "خطة التحسين",
        "التسليم خلال 3 أيام"
      ],
      recommended: true
    },
    {
      name: "تحكيم شامل",
      price: "1200 ريال",
      features: [
        "تحكيم من 3 محكمين",
        "تقرير تفصيلي متكامل",
        "تقييم إمكانية النشر",
        "مراجعة ما بعد التحسين",
        "ضمان الجودة",
        "متابعة لمدة شهر",
        "التسليم خلال يومين"
      ],
      recommended: false
    }
  ];

  const criteria = [
    {
      category: "المنهجية العلمية",
      points: ["وضوح الأهداف", "مناسبة المنهج", "صحة الإجراءات", "دقة التطبيق"]
    },
    {
      category: "جودة المحتوى",
      points: ["الأصالة العلمية", "عمق التحليل", "قوة الحجج", "الإضافة المعرفية"]
    },
    {
      category: "التنظيم والعرض",
      points: ["التسلسل المنطقي", "وضوح الكتابة", "جودة التوثيق", "سلامة اللغة"]
    },
    {
      category: "النتائج والتوصيات",
      points: ["دقة النتائج", "مناسبة التفسير", "واقعية التوصيات", "إمكانية التطبيق"]
    }
  ];

  const faqs = [
    {
      question: "ما هي معايير اختيار المحكمين؟",
      answer: "نختار المحكمين بناءً على التخصص، الخبرة الأكاديمية، سجل النشر، والمصداقية العلمية في المجال."
    },
    {
      question: "كم يستغرق التحكيم؟",
      answer: "يتراوح من يومين إلى أسبوع حسب حجم العمل وتعقيده ونوع الباقة المختارة."
    },
    {
      question: "هل التحكيم سري؟",
      answer: "نعم، نضمن السرية التامة لجميع الأعمال المحكمة ولا نحتفظ بنسخ بعد انتهاء الخدمة."
    },
    {
      question: "هل يمكن طلب محكم محدد؟",
      answer: "نعم، يمكن طلب محكم محدد إذا كان متاحاً ومناسباً للتخصص، مع إمكانية تكلفة إضافية."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-secondary text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-secondary/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <Scale className="h-20 w-20 mx-auto mb-6 animate-float text-white/90" />
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">
              تحكيم الدراسات والاستبانات العلمية
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              خدمة تحكيم علمي متخصصة من أساتذة وخبراء أكاديميين لضمان جودة وصحة البحوث العلمية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong px-8">
                    اطلب تحكيم بحثك
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-arabic-title">طلب خدمة التحكيم العلمي</DialogTitle>
                  </DialogHeader>
                  <AuthCtaCard serviceTitle="تقييم الأبحاث" />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                معايير التحكيم
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
              خدمات التحكيم العلمي
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مجموعة شاملة من خدمات التحكيم العلمي المتخصص
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-secondary flex items-center justify-center text-white shadow-secondary animate-pulse-slow flex-shrink-0">
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
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">{service.price}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluators Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              فريق المحكمين المتخصصين
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نخبة من الأساتذة والخبراء الأكاديميين المتخصصين
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {evaluators.map((evaluator, index) => (
              <Card key={index} className="text-center hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-secondary flex items-center justify-center text-white text-2xl font-bold">
                    {evaluator.name.split(' ')[1][0]}
                  </div>
                  <CardTitle className="text-xl font-arabic-title">{evaluator.name}</CardTitle>
                  <CardDescription className="text-secondary font-medium">{evaluator.specialty}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-muted-foreground">الخبرة</div>
                      <div>{evaluator.experience}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-muted-foreground">التحكيمات</div>
                      <div>{evaluator.evaluations}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{evaluator.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Criteria Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              معايير التحكيم العلمي
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              معايير شاملة ودقيقة لضمان جودة التحكيم العلمي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {criteria.map((criterion, index) => (
              <Card key={index} className="hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-secondary flex items-center justify-center text-white">
                    <Shield className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-arabic-title text-center">{criterion.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {criterion.points.map((point, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                        {point}
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              باقات التحكيم العلمي
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الباقة التي تناسب احتياجاتك ومستوى التحكيم المطلوب
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`text-center hover-lift transition-all duration-500 animate-fade-in-up ${pkg.recommended ? 'ring-2 ring-secondary shadow-strong' : ''}`} style={{ animationDelay: `${index * 150}ms` }}>
                {pkg.recommended && (
                  <div className="bg-secondary text-white text-sm py-2 rounded-t-lg font-medium">
                    الأكثر طلباً
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-arabic-title">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-secondary mb-2">{pkg.price}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className={`w-full ${pkg.recommended ? 'bg-secondary hover:bg-secondary/90' : ''}`}>
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
      <section className="py-20 bg-gradient-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
            احصل على تحكيم علمي موثوق
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            ثق في خبرة محكمينا المتخصصين لتحكيم بحثك وضمان جودته العلمية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  اطلب تحكيم بحثك
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Search className="w-4 h-4 mr-2" />
              استشارة مجانية
            </Button>
          </div>
        </div>
      </section>
          <Footer />
    </div>
  );
};

export default ResearchEvaluation;