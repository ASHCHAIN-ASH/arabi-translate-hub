import { useState } from "react";
import Header from "@/components/Header";
import Breadcrumb from '@/components/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, BookOpen, Lightbulb, Target, CheckCircle, Star, 
  ArrowRight, Clock, Users, Trophy, Sparkles, FileText, PenTool,
  Award, Shield, Rocket, Zap, Search, Brain, Layers, Eye
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import Footer from '@/components/Footer';
import AuthCtaCard from "@/components/research/AuthCtaCard";
const ThesisTitles = () => {
  const [titleForm, setTitleForm] = useState({
    name: "",
    email: "",
    phone: "",
    academic_level: "",
    subject_area: "",
    specialization: "",
    research_interest: "",
    title_count: "",
    urgency: "",
    additional_notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleForm.name || !titleForm.email || !titleForm.subject_area) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-service-inquiry', {
        body: {
          ...titleForm,
          service_type: 'thesis_titles_suggestion'
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب اقتراح العناوين بنجاح! سنتواصل معك قريباً");
      setTitleForm({
        name: "",
        email: "",
        phone: "",
        academic_level: "",
        subject_area: "",
        specialization: "",
        research_interest: "",
        title_count: "",
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
      title: "عناوين مبتكرة وأصيلة",
      description: "نقدم عناوين بحثية مبتكرة تتميز بالأصالة والحداثة مع مراعاة متطلبات التخصص",
      icon: <Lightbulb className="h-8 w-8" />,
      color: "bg-gradient-primary"
    },
    {
      title: "خطة بحثية أولية",
      description: "مع كل عنوان نقدم خطة بحثية أولية تتضمن الأهداف والمنهجية المقترحة",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-gradient-success"
    },
    {
      title: "مراجعة متخصصة",
      description: "مراجعة دقيقة من قبل أساتذة متخصصين في نفس المجال الأكاديمي",
      icon: <Shield className="h-8 w-8" />,
      color: "bg-gradient-secondary"
    },
    {
      title: "توجيه أكاديمي شامل",
      description: "إرشاد كامل حول كيفية تطوير العنوان وتحويله إلى بحث متكامل",
      icon: <Target className="h-8 w-8" />,
      color: "bg-gradient-primary"
    }
  ];

  const specializations = [
    {
      field: "إدارة الأعمال",
      topics: ["إدارة الموارد البشرية", "التسويق الرقمي", "ريادة الأعمال", "الإدارة المالية"],
      count: "150+ عنوان"
    },
    {
      field: "التربية والتعليم",
      topics: ["تقنيات التعليم", "المناهج وطرق التدريس", "الإدارة التربوية", "التعليم الإلكتروني"],
      count: "200+ عنوان"
    },
    {
      field: "علم النفس",
      topics: ["علم النفس التربوي", "علم النفس الإكلينيكي", "علم النفس الاجتماعي", "القياس النفسي"],
      count: "120+ عنوان"
    },
    {
      field: "الطب والصحة",
      topics: ["الصحة العامة", "التمريض", "الطب الوقائي", "إدارة المستشفيات"],
      count: "180+ عنوان"
    }
  ];

  const packages = [
    {
      name: "باقة أساسية",
      price: "200 ريال",
      titles: "5 عناوين",
      features: [
        "5 عناوين مقترحة",
        "وصف مختصر لكل عنوان",
        "تحديد نطاق البحث",
        "التسليم خلال 3 أيام"
      ],
      recommended: false
    },
    {
      name: "باقة متقدمة",
      price: "350 ريال",
      titles: "10 عناوين",
      features: [
        "10 عناوين مقترحة",
        "خطة بحثية أولية لكل عنوان",
        "قائمة مراجع أساسية",
        "استشارة هاتفية 30 دقيقة",
        "التسليم خلال يومين"
      ],
      recommended: true
    },
    {
      name: "باقة شاملة",
      price: "500 ريال",
      titles: "15 عنوان",
      features: [
        "15 عنوان مقترح",
        "خطة بحثية مفصلة",
        "تحليل الجدوى والإمكانية",
        "مراجع وأدبيات مختارة",
        "استشارة مع أستاذ متخصص",
        "متابعة لمدة شهر",
        "التسليم خلال 24 ساعة"
      ],
      recommended: false
    }
  ];

  const faqs = [
    {
      question: "كيف تضمنون أصالة العناوين المقترحة؟",
      answer: "نستخدم قواعد بيانات شاملة للتأكد من عدم تكرار العناوين، كما نقوم بفحص شامل للأدبيات الحديثة في التخصص."
    },
    {
      question: "هل يمكن تعديل العناوين المقترحة؟",
      answer: "نعم، نوفر جولة تعديل مجانية واحدة لكل عنوان، كما نقدم استشارة لتطوير العنوان حسب تفضيلاتك."
    },
    {
      question: "ما مدى تفصيل الخطة البحثية المرفقة؟",
      answer: "تشمل الخطة الأهداف، المشكلة، الأهمية، المنهجية المقترحة، والنتائج المتوقعة بشكل مختصر ومفيد."
    },
    {
      question: "هل تقدمون مساعدة في اختيار أفضل عنوان؟",
      answer: "نعم، نقدم تقييم مفصل لكل عنوان من حيث الجدوى، الأهمية، وإمكانية التطبيق لمساعدتك في الاختيار."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumb items={[
        { label: 'الخدمات البحثية', href: '/research-services' },
        { label: 'عناوين البحوث' }
      ]} />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-primary/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <GraduationCap className="h-20 w-20 mx-auto mb-6 animate-float text-white/90" />
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">
              اقتراح عناوين رسائل ماجستير ودكتوراه
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              نساعدك في ابتكار عناوين بحثية مميزة وقابلة للتطبيق مع خطة بحثية أولية شاملة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong px-8">
                    اطلب عناوين مقترحة الآن
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-arabic-title">طلب اقتراح عناوين الرسائل</DialogTitle>
                  </DialogHeader>
                  <AuthCtaCard serviceTitle="عناوين الرسائل" />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                تصفح العناوين
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
              مميزات خدمة اقتراح العناوين
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نوفر عناوين بحثية مبتكرة ومدروسة مع خطط بحثية أولية شاملة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-strong`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-arabic-title font-bold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              التخصصات المتاحة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نغطي مجموعة واسعة من التخصصات الأكاديمية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specializations.map((spec, index) => (
              <Card key={index} className="hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-primary flex items-center justify-center text-white">
                    <Brain className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-arabic-title text-center">{spec.field}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">{spec.count}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {spec.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{topic}</span>
                      </div>
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
              باقات اقتراح العناوين
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الباقة المناسبة لاحتياجاتك البحثية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`text-center hover-lift transition-all duration-500 animate-fade-in-up ${pkg.recommended ? 'ring-2 ring-primary shadow-strong' : ''}`} style={{ animationDelay: `${index * 150}ms` }}>
                {pkg.recommended && (
                  <div className="bg-primary text-white text-sm py-2 rounded-t-lg font-medium">
                    الأكثر طلباً
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-arabic-title">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary mb-2">{pkg.price}</div>
                  <Badge variant="outline">{pkg.titles}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className={`w-full ${pkg.recommended ? 'bg-primary hover:bg-primary/90' : ''}`}>
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
      <section className="py-20 bg-muted/30">
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
            ابدأ رحلتك البحثية بعنوان مميز
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            احصل على عناوين بحثية مبتكرة وقابلة للتطبيق من خبراء متخصصين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  اطلب عناوين مقترحة الآن
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

export default ThesisTitles;