import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, 
  Bot, 
  BookOpen, 
  Globe, 
  BarChart3,
  CheckCircle, 
  Loader2,
  Brain,
  FileText,
  Users,
  Lightbulb,
  Target,
  Award,
  BookMarked
} from "lucide-react";

const SmartEditor = () => {
  const [formData, setFormData] = useState({
    researchTitle: '',
    researchAbstract: '',
    fullName: '',
    email: '',
    phone: '',
    agreedToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const { toast } = useToast();

  const features = [
    {
      icon: FileText,
      title: "اقتراح المجلات العلمية الأنسب",
      description: "تحليل ذكي لاختيار أفضل المجلات العالمية المناسبة لمجال بحثك",
      color: "text-blue-600"
    },
    {
      icon: Globe,
      title: "تحديد المؤتمرات العالمية",
      description: "العثور على المؤتمرات الدولية المرموقة في تخصصك",
      color: "text-green-600"
    },
    {
      icon: BookMarked,
      title: "توصية بالكتب والمراجع المهمة",
      description: "دليل شامل للمراجع الأساسية والكتب المؤثرة في مجالك",
      color: "text-purple-600"
    },
    {
      icon: BarChart3,
      title: "تحليل الاتجاهات البحثية الحديثة",
      description: "رصد الاتجاهات الناشئة والمواضيع الرائجة في التخصص",
      color: "text-orange-600"
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "دقة في الاستهداف",
      description: "99% دقة في اختيار المجلات المناسبة"
    },
    {
      icon: Users,
      title: "خبرة عالمية",
      description: "قاعدة بيانات تضم أكثر من 50,000 مجلة ومؤتمر"
    },
    {
      icon: Award,
      title: "معايير عالية",
      description: "التركيز على المجلات المفهرسة في ISI و Scopus"
    },
    {
      icon: Lightbulb,
      title: "توصيات ذكية",
      description: "خوارزميات متطورة لتحليل المحتوى والتطابق"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const simulateAnalysisProgress = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const intervals = [
      { progress: 15, delay: 800, message: "تحليل المحتوى..." },
      { progress: 35, delay: 1500, message: "تحديد المجال العلمي..." },
      { progress: 55, delay: 2200, message: "البحث في قواعد البيانات..." },
      { progress: 75, delay: 2800, message: "مطابقة المجلات والمؤتمرات..." },
      { progress: 90, delay: 3200, message: "إعداد التوصيات..." },
      { progress: 100, delay: 3800, message: "اكتمل التحليل" }
    ];

    intervals.forEach(({ progress, delay, message }) => {
      setTimeout(() => {
        setAnalysisProgress(progress);
        if (progress === 100) {
          setIsAnalyzing(false);
        }
      }, delay);
    });
  };

  const validateForm = () => {
    if (!formData.researchTitle.trim() || !formData.fullName.trim() || !formData.email.trim()) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.agreedToTerms) {
      toast({
        title: "موافقة مطلوبة",
        description: "يرجى الموافقة على شروط الخدمة للمتابعة",
        variant: "destructive"
      });
      return false;
    }

    // تحقق من طول النص (500 كلمة كحد أقصى)
    const wordCount = (formData.researchTitle + ' ' + formData.researchAbstract).split(/\s+/).length;
    if (wordCount > 500) {
      toast({
        title: "النص طويل جداً",
        description: "الحد الأقصى المسموح 500 كلمة",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    simulateAnalysisProgress();

    try {
      // استدعاء edge function
      const { data, error } = await supabase.functions.invoke('smart-editor-recommendations', {
        body: {
          researchTitle: formData.researchTitle.trim(),
          researchAbstract: formData.researchAbstract.trim(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'حدث خطأ أثناء معالجة الطلب');
      }

      setSubmissionComplete(true);
      toast({
        title: "تم إرسال طلبك بنجاح ✅",
        description: "ستتلقى التوصيات عبر بريدك الإلكتروني قريباً",
      });

      // إعادة تعيين النموذج
      setFormData({
        researchTitle: '',
        researchAbstract: '',
        fullName: '',
        email: '',
        phone: '',
        agreedToTerms: false
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "حدث خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setAnalysisProgress(0);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/15 py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent/15 rounded-full blur-2xl animate-pulse delay-500" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="flex justify-center items-center gap-6 mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Bot className="h-20 w-20 text-primary" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <BookOpen className="h-16 w-16 text-secondary" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="h-18 w-18 text-accent" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent mb-6">
              المحرر الذكي – دليل الباحثين للنشر
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-8">
              خدمة مبتكرة تعتمد على الذكاء الاصطناعي لتقديم توصيات فورية للباحثين حول المجلات الأنسب، 
              المؤتمرات العالمية، والكتب المرجعية، استناداً إلى موضوع البحث والاتجاهات الحديثة.
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-primary/20 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-primary mb-4">🤖 كيف يعمل المحرر الذكي؟</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <p className="text-muted-foreground">أدخل عنوان وملخص بحثك</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-secondary font-bold">2</span>
                  </div>
                  <p className="text-muted-foreground">تحليل ذكي للمحتوى والمجال</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-accent font-bold">3</span>
                  </div>
                  <p className="text-muted-foreground">مطابقة مع قواعد البيانات العالمية</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <p className="text-muted-foreground">توصيات مخصصة ومفصلة</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            مميزات المحرر الذكي
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            أدوات متطورة لمساعدة الباحثين في العثور على أفضل منصات النشر العلمي
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, translateY: -5 }}
              className="group"
            >
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                    className="mb-4"
                  >
                    <feature.icon className={`h-16 w-16 mx-auto group-hover:scale-110 transition-transform ${feature.color}`} />
                  </motion.div>
                  <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-l from-primary/5 to-secondary/5 rounded-2xl p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-primary mb-8">لماذا المحرر الذكي؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-primary/20 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center bg-gradient-to-l from-primary/5 to-secondary/5">
              <CardTitle className="text-3xl text-primary flex items-center justify-center gap-3">
                <Brain className="h-8 w-8" />
                احصل على توصياتك الذكية
              </CardTitle>
              <CardDescription className="text-lg">
                أدخل تفاصيل بحثك واحصل على توصيات مخصصة من الذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {submissionComplete ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: 2 }}
                  >
                    <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-600 mb-4">
                    تم استلام طلبك بنجاح ✅
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    ستتلقى رسالة عبر بريدك الإلكتروني مع التوصيات المفصلة قريباً
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      💡 ستحتوي التوصيات على: مجلات علمية مناسبة، مؤتمرات عالمية، مراجع مهمة، وتحليل للاتجاهات البحثية
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Research Title */}
                  <div className="space-y-2">
                    <Label htmlFor="researchTitle" className="text-right flex items-center gap-2 text-lg font-semibold">
                      <FileText className="h-5 w-5 text-primary" />
                      عنوان البحث *
                    </Label>
                    <Input
                      id="researchTitle"
                      name="researchTitle"
                      type="text"
                      value={formData.researchTitle}
                      onChange={handleInputChange}
                      placeholder="أدخل عنوان بحثك باللغة العربية أو الإنجليزية"
                      required
                      className="text-right text-lg py-3"
                    />
                  </div>

                  {/* Research Abstract */}
                  <div className="space-y-2">
                    <Label htmlFor="researchAbstract" className="text-right flex items-center gap-2 text-lg font-semibold">
                      <BookOpen className="h-5 w-5 text-secondary" />
                      ملخص البحث (اختياري)
                    </Label>
                    <Textarea
                      id="researchAbstract"
                      name="researchAbstract"
                      value={formData.researchAbstract}
                      onChange={handleInputChange}
                      placeholder="اكتب ملخصاً موجزاً لبحثك أو أهدافه الرئيسية (اختياري ولكن يحسن من دقة التوصيات)"
                      className="text-right min-h-[120px] text-base leading-relaxed"
                      rows={5}
                    />
                    <p className="text-sm text-muted-foreground text-right">
                      الحد الأقصى: 500 كلمة | الكلمات المكتوبة: {(formData.researchTitle + ' ' + formData.researchAbstract).split(/\s+/).filter(word => word.length > 0).length}
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-secondary/5 p-6 rounded-lg border border-secondary/20">
                    <h4 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      البيانات الشخصية
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="fullName">الاسم الكامل *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          required
                          className="text-right"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@domain.com"
                          required
                          className="text-right"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+966xxxxxxxxx"
                        className="text-right"
                      />
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-2 space-x-reverse p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, agreedToTerms: !!checked }))
                      }
                      required
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      أوافق على شروط الخدمة وسياسة الخصوصية، وأفهم أن هذه الخدمة تقدم توصيات استرشادية 
                      وأن القرار النهائي للنشر يعود للباحث
                    </Label>
                  </div>

                  {/* Analysis Progress */}
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 p-6 bg-primary/5 rounded-lg border border-primary/20"
                    >
                      <div className="flex items-center gap-3 text-primary">
                        <Bot className="h-6 w-6 animate-pulse" />
                        <span className="font-semibold text-lg">المحرر الذكي يحلل بحثك...</span>
                      </div>
                      <Progress value={analysisProgress} className="w-full h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{analysisProgress}% مكتمل</span>
                        <span>جارٍ التحليل والمطابقة مع قواعد البيانات العالمية</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.researchTitle || !formData.fullName || !formData.email || !formData.agreedToTerms}
                    className="w-full h-14 text-lg font-semibold"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        جارٍ التحليل والمعالجة...
                      </>
                    ) : (
                      <>
                        <Send className="mr-3 h-6 w-6" />
                        احصل على التوصيات الآن
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-800 mb-3 text-lg">ما ستحصل عليه</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <p className="mb-2 font-semibold">📑 توصيات المجلات:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 3-5 مجلات علمية مناسبة لبحثك</li>
                        <li>• معامل التأثير وتصنيف كل مجلة</li>
                        <li>• روابط مباشرة للمجلات</li>
                        <li>• تكلفة النشر وإرشادات التقديم</li>
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 font-semibold">🌍 المؤتمرات العالمية:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 2-3 مؤتمرات دولية مرموقة</li>
                        <li>• تواريخ ومواقع المؤتمرات</li>
                        <li>• مواعيد إرسال الأوراق البحثية</li>
                        <li>• رسوم المشاركة والتسجيل</li>
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 font-semibold">📖 المراجع المهمة:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 5-7 كتب أساسية في مجالك</li>
                        <li>• أحدث الدراسات والأبحاث</li>
                        <li>• مراجع باللغة العربية والإنجليزية</li>
                        <li>• روابط للحصول على المراجع</li>
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 font-semibold">📊 تحليل الاتجاهات:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• الاتجاهات الناشئة في مجالك</li>
                        <li>• الكلمات المفتاحية الرائجة</li>
                        <li>• توقعات مستقبل التخصص</li>
                        <li>• فرص البحث الجديدة</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SmartEditor;