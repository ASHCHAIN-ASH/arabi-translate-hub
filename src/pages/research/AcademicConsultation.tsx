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
import { Users, MessageCircle, Lightbulb, Target, BookOpen, Clock, Star, CheckCircle, Mail, Phone, Calendar, Award, Globe } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AcademicConsultation = () => {
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    email: "",
    phone: "",
    academic_level: "",
    subject_area: "",
    consultation_type: "",
    description: "",
    preferred_time: "",
    budget_range: ""
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationForm.name || !consultationForm.email || !consultationForm.consultation_type) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-academic-expertise-inquiry', {
        body: {
          ...consultationForm,
          inquiry_type: 'academic_consultation'
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب الاستشارة بنجاح! سنتواصل معك قريباً");
      setConsultationForm({
        name: "",
        email: "",
        phone: "",
        academic_level: "",
        subject_area: "",
        consultation_type: "",
        description: "",
        preferred_time: "",
        budget_range: ""
      });
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("خطأ في إرسال الطلب: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const consultationTypes = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "اختيار موضوع البحث",
      description: "مساعدة في اختيار وتحديد موضوع البحث المناسب",
      duration: "60 دقيقة",
      price: "من 300 ريال"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "تطوير منهجية البحث",
      description: "وضع منهجية علمية دقيقة للبحث",
      duration: "90 دقيقة", 
      price: "من 450 ريال"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "حل مشاكل البحث",
      description: "حلول للعقبات والمشاكل التي تواجه الباحث",
      duration: "45 دقيقة",
      price: "من 250 ريال"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "مراجعة شاملة",
      description: "مراجعة كاملة للبحث وتقديم التوصيات",
      duration: "120 دقيقة",
      price: "من 600 ريال"
    }
  ];

  const experts = [
    {
      name: "د. أحمد المحمد",
      specialty: "إدارة الأعمال والاقتصاد",
      experience: "15+ سنة",
      rating: 4.9,
      consultations: 500
    },
    {
      name: "د. فاطمة العلي",
      specialty: "التربية وعلم النفس", 
      experience: "12+ سنة",
      rating: 4.8,
      consultations: 350
    },
    {
      name: "د. محمد الأحمد",
      specialty: "الهندسة والتكنولوجيا",
      experience: "18+ سنة", 
      rating: 4.9,
      consultations: 420
    }
  ];

  const faqs = [
    {
      question: "كم تستغرق الاستشارة؟",
      answer: "تتراوح مدة الاستشارة من 45 إلى 120 دقيقة حسب نوع الاستشارة المطلوبة."
    },
    {
      question: "هل يمكن إجراء الاستشارة عن بُعد؟",
      answer: "نعم، نوفر استشارات عن بُعد عبر الفيديو أو الهاتف حسب تفضيلك."
    },
    {
      question: "ما هي آلية الدفع؟",
      answer: "يمكن الدفع عبر التحويل البنكي أو البطاقات الائتمانية، والدفع بعد تأكيد الموعد."
    },
    {
      question: "هل تقدمون متابعة بعد الاستشارة؟",
      answer: "نعم، نوفر متابعة مجانية لمدة أسبوعين بعد الاستشارة للإجابة على أي استفسارات."
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
            <Users className="h-20 w-20 mx-auto mb-6 animate-float text-white/90" />
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">
              الاستشارات الأكاديمية المتخصصة
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              احصل على استشارة من خبراء أكاديميين متخصصين لتطوير بحثك وتحقيق أهدافك العلمية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong px-8">
                    احجز استشارتك الآن
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-arabic-title">طلب استشارة أكاديمية</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>الاسم الكامل *</Label>
                        <Input
                          value={consultationForm.name}
                          onChange={(e) => setConsultationForm({...consultationForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>البريد الإلكتروني *</Label>
                        <Input
                          type="email"
                          value={consultationForm.email}
                          onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>رقم الهاتف</Label>
                        <Input
                          value={consultationForm.phone}
                          onChange={(e) => setConsultationForm({...consultationForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>المستوى الأكاديمي</Label>
                        <Select value={consultationForm.academic_level} onValueChange={(value) => setConsultationForm({...consultationForm, academic_level: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المستوى" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bachelor">بكالوريوس</SelectItem>
                            <SelectItem value="master">ماجستير</SelectItem>
                            <SelectItem value="phd">دكتوراه</SelectItem>
                            <SelectItem value="researcher">باحث</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>التخصص</Label>
                        <Input
                          value={consultationForm.subject_area}
                          onChange={(e) => setConsultationForm({...consultationForm, subject_area: e.target.value})}
                          placeholder="مثال: إدارة الأعمال"
                        />
                      </div>
                      <div>
                        <Label>نوع الاستشارة *</Label>
                        <Select value={consultationForm.consultation_type} onValueChange={(value) => setConsultationForm({...consultationForm, consultation_type: value})} required>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الاستشارة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="topic_selection">اختيار موضوع البحث</SelectItem>
                            <SelectItem value="methodology">تطوير منهجية البحث</SelectItem>
                            <SelectItem value="problem_solving">حل مشاكل البحث</SelectItem>
                            <SelectItem value="comprehensive_review">مراجعة شاملة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>وصف الاستشارة المطلوبة</Label>
                      <Textarea
                        value={consultationForm.description}
                        onChange={(e) => setConsultationForm({...consultationForm, description: e.target.value})}
                        placeholder="اشرح ما تحتاجه في الاستشارة..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>الوقت المفضل</Label>
                        <Select value={consultationForm.preferred_time} onValueChange={(value) => setConsultationForm({...consultationForm, preferred_time: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الوقت المناسب" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">صباحاً (9-12)</SelectItem>
                            <SelectItem value="afternoon">بعد الظهر (1-5)</SelectItem>
                            <SelectItem value="evening">مساءً (6-9)</SelectItem>
                            <SelectItem value="flexible">مرن</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>الميزانية المتوقعة</Label>
                        <Select value={consultationForm.budget_range} onValueChange={(value) => setConsultationForm({...consultationForm, budget_range: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النطاق السعري" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="200-400">200-400 ريال</SelectItem>
                            <SelectItem value="400-600">400-600 ريال</SelectItem>
                            <SelectItem value="600-800">600-800 ريال</SelectItem>
                            <SelectItem value="800+">800+ ريال</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "جاري الإرسال..." : "إرسال طلب الاستشارة"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Phone className="w-4 h-4 mr-2" />
                اتصل بنا مباشرة
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4 text-foreground">
              أنواع الاستشارات المتاحة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نوفر مجموعة شاملة من الاستشارات الأكاديمية المتخصصة لتلبية احتياجاتك البحثية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {consultationTypes.map((type, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card border-0 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-primary animate-pulse-slow">
                    {type.icon}
                  </div>
                  <CardTitle className="font-arabic-title text-lg">{type.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="font-arabic-body text-sm">{type.description}</CardDescription>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {type.duration}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{type.price}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              خبراؤنا الأكاديميون
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              فريق من الخبراء الأكاديميين المتخصصين في مختلف المجالات العلمية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <Card key={index} className="text-center hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <CardHeader>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                    {expert.name.split(' ')[1][0]}
                  </div>
                  <CardTitle className="font-arabic-title text-xl">{expert.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{expert.specialty}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-primary" />
                      {expert.experience}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {expert.rating}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {expert.consultations} استشارة
                  </Badge>
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
              كيف تتم الاستشارة؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              عملية بسيطة ومنظمة لضمان حصولك على أفضل استشارة أكاديمية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "احجز موعدك", description: "املأ النموذج واختر نوع الاستشارة", icon: <Calendar className="w-6 h-6" /> },
              { step: "2", title: "تأكيد الموعد", description: "سنتواصل معك لتأكيد التفاصيل", icon: <CheckCircle className="w-6 h-6" /> },
              { step: "3", title: "الاستشارة", description: "جلسة مخصصة مع الخبير المناسب", icon: <MessageCircle className="w-6 h-6" /> },
              { step: "4", title: "المتابعة", description: "دعم ومتابعة لمدة أسبوعين", icon: <Target className="w-6 h-6" /> }
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
            هل أنت مستعد لبدء رحلتك البحثية؟
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            احجز استشارتك الأكاديمية اليوم واحصل على الدعم المتخصص الذي تحتاجه
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  احجز استشارتك الآن
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Mail className="w-4 h-4 mr-2" />
              تواصل معنا
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcademicConsultation;