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
import { Search, BookOpen, Users, Award, Brain, Target, CheckCircle, Clock, Star, Trophy, Lightbulb, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TrainingCourses = () => {
  const [courseForm, setCourseForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience_level: "",
    course_type: "",
    preferred_format: "",
    schedule_preference: "",
    group_size: "",
    specific_topics: "",
    additional_notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.email || !courseForm.course_type) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-service-inquiry', {
        body: {
          ...courseForm,
          service_type: 'training_courses'
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب التسجيل في الدورة بنجاح! سنتواصل معك قريباً");
      setCourseForm({
        name: "",
        email: "",
        phone: "",
        experience_level: "",
        course_type: "",
        preferred_format: "",
        schedule_preference: "",
        group_size: "",
        specific_topics: "",
        additional_notes: ""
      });
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("خطأ في إرسال الطلب: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const courses = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "مناهج البحث العلمي",
      description: "أساسيات البحث العلمي والمنهجية الصحيحة",
      duration: "20 ساعة",
      level: "للمبتدئين",
      price: "800 ريال",
      topics: ["أنواع البحوث العلمية", "تصميم البحث", "أدوات جمع البيانات", "كتابة التقارير"]
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "كتابة الأطروحات الأكاديمية",
      description: "مهارات متقدمة في كتابة الرسائل العلمية",
      duration: "30 ساعة",
      level: "متقدم",
      price: "1200 ريال",
      topics: ["هيكل الأطروحة", "المراجعة الأدبية", "التحليل والنقد", "التوثيق العلمي"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "التحليل الإحصائي",
      description: "استخدام برامج التحليل الإحصائي في البحوث",
      duration: "25 ساعة",
      level: "متوسط",
      price: "1000 ريال",
      topics: ["SPSS", "تحليل البيانات", "الإحصاء الوصفي", "الإحصاء الاستدلالي"]
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "النشر العلمي",
      description: "كيفية نشر البحوث في المجلات العلمية المحكمة",
      duration: "15 ساعة",
      level: "متقدم",
      price: "600 ريال",
      topics: ["اختيار المجلة", "إعداد المخطوط", "عملية المراجعة", "الرد على المحكمين"]
    }
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "مدربون خبراء",
      description: "أساتذة جامعيون وخبراء في مجال البحث العلمي"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "تدريب تطبيقي",
      description: "ورش عملية وتطبيقات حقيقية على مشاريع بحثية"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "شهادات معتمدة",
      description: "شهادات حضور معتمدة من جهات أكاديمية مرموقة"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "مجموعات صغيرة",
      description: "تدريب في مجموعات صغيرة لضمان التفاعل والاستفادة"
    }
  ];

  const packages = [
    {
      name: "دورة واحدة",
      price: "حسب الدورة",
      features: [
        "دورة تدريبية واحدة",
        "شهادة حضور",
        "مواد تدريبية",
        "دعم لمدة شهر"
      ],
      recommended: false
    },
    {
      name: "باقة الباحث",
      price: "2500 ريال",
      features: [
        "3 دورات من اختيارك",
        "استشارة فردية",
        "مراجعة مشروع بحثي",
        "شهادات معتمدة",
        "دعم لمدة 3 أشهر",
        "خصم 20%"
      ],
      recommended: true
    },
    {
      name: "برنامج الخبير",
      price: "4000 ريال",
      features: [
        "جميع الدورات المتاحة",
        "تدريب فردي مخصص",
        "مشروع بحثي كامل",
        "نشر في مجلة علمية",
        "دعم مدى الحياة",
        "خصم 35%"
      ],
      recommended: false
    }
  ];

  const schedule = [
    {
      course: "مناهج البحث العلمي",
      date: "1-5 نوفمبر 2024",
      time: "6:00-9:00 مساءً",
      seats: "15 مقعد متاح"
    },
    {
      course: "كتابة الأطروحات",
      date: "10-15 نوفمبر 2024",
      time: "4:00-7:00 مساءً",
      seats: "8 مقاعد متاحة"
    },
    {
      course: "التحليل الإحصائي",
      date: "20-25 نوفمبر 2024",
      time: "7:00-10:00 مساءً",
      seats: "12 مقعد متاح"
    }
  ];

  const faqs = [
    {
      question: "هل الدورات متاحة عن بُعد؟",
      answer: "نعم، نوفر الدورات بصيغة حضورية وعن بُعد، كما نقدم تسجيلات للمراجعة اللاحقة."
    },
    {
      question: "ما هي متطلبات الالتحاق بالدورات؟",
      answer: "متطلبات أساسية في استخدام الحاسوب والإنترنت، وبعض الدورات تتطلب خلفية أكاديمية محددة."
    },
    {
      question: "هل تقدمون شهادات معتمدة؟",
      answer: "نعم، نقدم شهادات حضور معتمدة من مؤسسات أكاديمية، وشهادات إتمام للدورات المتقدمة."
    },
    {
      question: "كيف يمكن تحديد موعد الدورات؟",
      answer: "نحدد مواعيد مرنة تناسب المشاركين، مع إمكانية تنظيم دورات خاصة للمجموعات."
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
            <GraduationCap className="h-20 w-20 mx-auto mb-6 animate-float text-white/90" />
            <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">
              الدورات التدريبية في البحث العلمي
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              طور مهاراتك في البحث العلمي مع دورات تدريبية متخصصة يقدمها خبراء أكاديميون
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong px-8">
                    سجل في دورة تدريبية
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-arabic-title">التسجيل في الدورات التدريبية</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>الاسم الكامل *</Label>
                        <Input
                          value={courseForm.name}
                          onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>البريد الإلكتروني *</Label>
                        <Input
                          type="email"
                          value={courseForm.email}
                          onChange={(e) => setCourseForm({...courseForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>رقم الهاتف</Label>
                        <Input
                          value={courseForm.phone}
                          onChange={(e) => setCourseForm({...courseForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>مستوى الخبرة</Label>
                        <Select value={courseForm.experience_level} onValueChange={(value) => setCourseForm({...courseForm, experience_level: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر مستوى خبرتك" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">مبتدئ</SelectItem>
                            <SelectItem value="intermediate">متوسط</SelectItem>
                            <SelectItem value="advanced">متقدم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>نوع الدورة المهتم بها *</Label>
                        <Select value={courseForm.course_type} onValueChange={(value) => setCourseForm({...courseForm, course_type: value})} required>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الدورة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="research_methods">مناهج البحث العلمي</SelectItem>
                            <SelectItem value="thesis_writing">كتابة الأطروحات</SelectItem>
                            <SelectItem value="statistical_analysis">التحليل الإحصائي</SelectItem>
                            <SelectItem value="scientific_publishing">النشر العلمي</SelectItem>
                            <SelectItem value="all">جميع الدورات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>نمط التدريب المفضل</Label>
                        <Select value={courseForm.preferred_format} onValueChange={(value) => setCourseForm({...courseForm, preferred_format: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النمط" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">عن بُعد</SelectItem>
                            <SelectItem value="offline">حضوري</SelectItem>
                            <SelectItem value="hybrid">مختلط</SelectItem>
                            <SelectItem value="no_preference">لا يوجد تفضيل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>التوقيت المفضل</Label>
                        <Select value={courseForm.schedule_preference} onValueChange={(value) => setCourseForm({...courseForm, schedule_preference: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التوقيت" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">صباحي (9-12)</SelectItem>
                            <SelectItem value="afternoon">بعد الظهر (2-5)</SelectItem>
                            <SelectItem value="evening">مسائي (6-9)</SelectItem>
                            <SelectItem value="weekend">نهاية الأسبوع</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>حجم المجموعة المفضل</Label>
                        <Select value={courseForm.group_size} onValueChange={(value) => setCourseForm({...courseForm, group_size: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر حجم المجموعة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">فردي</SelectItem>
                            <SelectItem value="small">مجموعة صغيرة (5-10)</SelectItem>
                            <SelectItem value="medium">مجموعة متوسطة (10-20)</SelectItem>
                            <SelectItem value="large">مجموعة كبيرة (20+)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>موضوعات محددة مهتم بها</Label>
                      <Textarea
                        value={courseForm.specific_topics}
                        onChange={(e) => setCourseForm({...courseForm, specific_topics: e.target.value})}
                        placeholder="اذكر أي موضوعات محددة تود التركيز عليها..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>ملاحظات إضافية</Label>
                      <Textarea
                        value={courseForm.additional_notes}
                        onChange={(e) => setCourseForm({...courseForm, additional_notes: e.target.value})}
                        placeholder="أي ملاحظات أو متطلبات خاصة..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "جاري الإرسال..." : "إرسال طلب التسجيل"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                تصفح الدورات
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4 text-foreground">
              الدورات المتاحة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مجموعة شاملة من الدورات التدريبية في مجال البحث العلمي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-secondary flex items-center justify-center text-white shadow-secondary animate-pulse-slow flex-shrink-0">
                      {course.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="font-arabic-title text-xl mb-2">{course.title}</CardTitle>
                      <CardDescription className="font-arabic-body mb-3">{course.description}</CardDescription>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{course.duration}</Badge>
                        <Badge variant="outline">{course.level}</Badge>
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary">{course.price}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h4 className="font-semibold text-sm">المحتوى:</h4>
                  <ul className="space-y-1">
                    {course.topics.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              مميزات دوراتنا التدريبية
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-secondary flex items-center justify-center text-white shadow-secondary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-arabic-title">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-arabic-title font-bold mb-4">
              الجدولة القادمة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مواعيد الدورات المجدولة للشهر القادم
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {schedule.map((item, index) => (
              <Card key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-arabic-title font-semibold mb-2">{item.course}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {item.date}
                        </div>
                        <div>
                          {item.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{item.seats}</Badge>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>سجل الآن</Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </div>
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
              باقات التدريب
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الباقة التي تناسب احتياجاتك التدريبية
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
            ابدأ رحلة التعلم معنا
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            سجل في دوراتنا التدريبية وطور مهاراتك في البحث العلمي مع خبراء متخصصين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  سجل في دورة تدريبية
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
    </div>
  );
};

export default TrainingCourses;