import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';

import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  BookOpen, 
  CheckCircle, 
  Star, 
  Globe, 
  Award,
  Users,
  Clock,
  TrendingUp,
  Search,
  Edit3,
  Send,
  ArrowLeft,
  GraduationCap,
  Target,
  Zap,
  Shield,
  Phone,
  Mail,
  User,
  Building,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const JournalPublication = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    researchField: '',
    journalType: '',
    manuscriptTitle: '',
    currentStatus: '',
    deadline: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/journal-publication-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "تم إرسال الطلب بنجاح ✅",
          description: result.message || "سنتواصل معك قريباً لمناقشة التفاصيل",
        });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          institution: '',
          researchField: '',
          journalType: '',
          manuscriptTitle: '',
          currentStatus: '',
          deadline: '',
          additionalNotes: ''
        });
      } else {
        throw new Error(result.error || "حدث خطأ في إرسال الطلب");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: error.message || "يرجى المحاولة مرة أخرى لاحقاً",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Target,
      title: "دقة الاستهداف",
      description: "نحدد أفضل المجلات المناسبة لبحثك بناءً على التخصص ومعامل التأثير"
    },
    {
      icon: Zap,
      title: "سرعة النشر",
      description: "نضمن أسرع مسار للنشر مع الحفاظ على أعلى معايير الجودة العلمية"
    },
    {
      icon: Shield,
      title: "ضمان الجودة",
      description: "مراجعة شاملة ومتابعة دقيقة لضمان نجاح عملية النشر"
    },
    {
      icon: GraduationCap,
      title: "خبرة أكاديمية",
      description: "فريق من الخبراء الأكاديميين المتخصصين في جميع المجالات العلمية"
    }
  ];

  const journalTypes = [
    {
      type: "Scopus",
      description: "مجلات مفهرسة عالمياً",
      impact: "عالي",
      color: "from-blue-500 to-cyan-500"
    },
    {
      type: "Web of Science",
      description: "مجلات الفئة الأولى",
      impact: "عالي جداً",
      color: "from-emerald-500 to-teal-500"
    },
    {
      type: "ISI Impact Factor",
      description: "مجلات معامل التأثير",
      impact: "ممتاز",
      color: "from-purple-500 to-indigo-500"
    },
    {
      type: "عربية محكمة",
      description: "مجلات عربية معتمدة",
      impact: "جيد",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "500+", label: "بحث منشور", icon: FileText },
    { number: "98%", label: "معدل النجاح", icon: TrendingUp },
    { number: "50+", label: "مجلة متعاونة", icon: BookOpen },
    { number: "15", label: "يوم متوسط النشر", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 lg:py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="p-6 bg-gradient-to-r from-primary to-secondary rounded-3xl shadow-2xl">
                <GraduationCap className="h-16 w-16 text-primary-foreground" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 leading-tight"
            >
              النشر في المجلات المعتمدة
            </motion.h1>
            
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto"
            >
              شريكك الأكاديمي المتخصص في نشر البحوث العلمية في أرقى المجلات العالمية المحكمة مع ضمان أعلى معايير الجودة والمتابعة المهنية
            </motion.p>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 font-semibold px-10 py-6 rounded-2xl text-lg" asChild>
                <Link to="#request-form" className="flex items-center gap-3">
                  <span>احصل على استشارة مجانية</span>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4 p-3 bg-gradient-to-r from-primary to-secondary rounded-xl w-fit mx-auto">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{stat.number}</h3>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              لماذا نحن الخيار الأمثل؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نجمع بين الخبرة الأكاديمية العميقة والتقنيات الحديثة لضمان نشر بحثك في أفضل المجلات العلمية
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group text-center"
                >
                  <Card className="h-full p-8 hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm border-0 shadow-lg group-hover:scale-105">
                    <div className="mb-6 p-4 bg-gradient-to-r from-primary to-secondary rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform">
                      <IconComponent className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journal Types Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              أنواع المجلات المعتمدة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نتعامل مع جميع أنواع المجلات العلمية المحكمة والمعتمدة عالمياً
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journalTypes.map((journal, index) => (
              <motion.div
                key={journal.type}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className={`h-full p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${journal.color} text-white border-0 shadow-lg group-hover:scale-105`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      {journal.type}
                    </h3>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {journal.impact}
                    </Badge>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    {journal.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form Section */}
      <section id="request-form" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                ابدأ رحلة النشر العلمي
              </h2>
              <p className="text-xl text-muted-foreground">
                املأ النموذج أدناه وسنتواصل معك خلال 24 ساعة لمناقشة احتياجاتك البحثية
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2 text-foreground font-semibold">
                        <User className="h-4 w-4" />
                        الاسم الكامل *
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                        required
                        className="bg-background/50 border-2 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-foreground font-semibold">
                        <Mail className="h-4 w-4" />
                        البريد الإلكتروني *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@email.com"
                        required
                        className="bg-background/50 border-2 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-foreground font-semibold">
                        <Phone className="h-4 w-4" />
                        رقم الهاتف *
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="أدخل رقم هاتفك"
                        required
                        className="bg-background/50 border-2 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="institution" className="flex items-center gap-2 text-foreground font-semibold">
                        <Building className="h-4 w-4" />
                        المؤسسة الأكاديمية *
                      </Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        placeholder="اسم الجامعة أو المؤسسة"
                        required
                        className="bg-background/50 border-2 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="researchField" className="flex items-center gap-2 text-foreground font-semibold">
                        <BookOpen className="h-4 w-4" />
                        مجال البحث *
                      </Label>
                      <Select value={formData.researchField} onValueChange={(value) => handleInputChange('researchField', value)}>
                        <SelectTrigger className="bg-background/50 border-2 focus:border-primary">
                          <SelectValue placeholder="اختر مجال البحث" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الطب">الطب</SelectItem>
                          <SelectItem value="الهندسة">الهندسة</SelectItem>
                          <SelectItem value="العلوم الطبيعية">العلوم الطبيعية</SelectItem>
                          <SelectItem value="العلوم الاجتماعية">العلوم الاجتماعية</SelectItem>
                          <SelectItem value="العلوم الإنسانية">العلوم الإنسانية</SelectItem>
                          <SelectItem value="إدارة الأعمال">إدارة الأعمال</SelectItem>
                          <SelectItem value="التربية والتعليم">التربية والتعليم</SelectItem>
                          <SelectItem value="أخرى">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="journalType" className="flex items-center gap-2 text-foreground font-semibold">
                        <FileText className="h-4 w-4" />
                        نوع المجلة المطلوبة *
                      </Label>
                      <Select value={formData.journalType} onValueChange={(value) => handleInputChange('journalType', value)}>
                        <SelectTrigger className="bg-background/50 border-2 focus:border-primary">
                          <SelectValue placeholder="اختر نوع المجلة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scopus">مجلة Scopus</SelectItem>
                          <SelectItem value="Web of Science">مجلة Web of Science</SelectItem>
                          <SelectItem value="ISI Impact Factor">مجلة ISI</SelectItem>
                          <SelectItem value="عربية محكمة">مجلة عربية محكمة</SelectItem>
                          <SelectItem value="استشارة فقط">استشارة فقط</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manuscriptTitle" className="flex items-center gap-2 text-foreground font-semibold">
                      <FileText className="h-4 w-4" />
                      عنوان المخطوطة *
                    </Label>
                    <Input
                      id="manuscriptTitle"
                      value={formData.manuscriptTitle}
                      onChange={(e) => handleInputChange('manuscriptTitle', e.target.value)}
                      placeholder="أدخل عنوان البحث أو المخطوطة"
                      required
                      className="bg-background/50 border-2 focus:border-primary"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentStatus" className="flex items-center gap-2 text-foreground font-semibold">
                        <CheckCircle className="h-4 w-4" />
                        الحالة الحالية للبحث *
                      </Label>
                      <Select value={formData.currentStatus} onValueChange={(value) => handleInputChange('currentStatus', value)}>
                        <SelectTrigger className="bg-background/50 border-2 focus:border-primary">
                          <SelectValue placeholder="اختر الحالة الحالية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="مسودة أولى">مسودة أولى</SelectItem>
                          <SelectItem value="جاهز للمراجعة">جاهز للمراجعة</SelectItem>
                          <SelectItem value="تم رفضه من مجلة سابقة">تم رفضه من مجلة سابقة</SelectItem>
                          <SelectItem value="مكتمل ومراجع">مكتمل ومراجع</SelectItem>
                          <SelectItem value="فكرة البحث فقط">فكرة البحث فقط</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="flex items-center gap-2 text-foreground font-semibold">
                        <Calendar className="h-4 w-4" />
                        الموعد النهائي المطلوب
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        className="bg-background/50 border-2 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes" className="flex items-center gap-2 text-foreground font-semibold">
                      <Edit3 className="h-4 w-4" />
                      ملاحظات إضافية أو تفاصيل خاصة
                    </Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      placeholder="اكتب أي تفاصيل إضافية عن بحثك أو متطلبات خاصة..."
                      rows={4}
                      className="bg-background/50 border-2 focus:border-primary resize-none"
                    />
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                  >
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 font-semibold px-12 py-6 rounded-2xl text-lg disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>جاري الإرسال...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>إرسال الطلب</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default JournalPublication;