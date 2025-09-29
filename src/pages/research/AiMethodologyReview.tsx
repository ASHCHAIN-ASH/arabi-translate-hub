import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, 
  Bot, 
  FileText, 
  Mail, 
  CheckCircle, 
  Loader2,
  Download,
  Brain,
  Search,
  BookOpen
} from "lucide-react";

const AiMethodologyReview = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    file: null as File | null,
    agreedToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const { toast } = useToast();

  const features = [
    {
      icon: Upload,
      title: "رفع ملفات البحث بسهولة",
      description: "دعم لملفات PDF و Word"
    },
    {
      icon: Bot,
      title: "مراجعة شاملة باستخدام الذكاء الاصطناعي",
      description: "تحليل متقدم للمحتوى والمنهجية"
    },
    {
      icon: FileText,
      title: "إعداد تقرير PDF منظم وجاهز",
      description: "تقرير شامل مع التوصيات"
    },
    {
      icon: Mail,
      title: "إشعارات فورية للعميل والإدارة",
      description: "تحديثات فورية عبر البريد الإلكتروني"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "نوع ملف غير مدعوم",
          description: "يرجى رفع ملف PDF أو Word فقط",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "حجم الملف كبير جداً",
          description: "يرجى رفع ملف أقل من 10 ميجابايت",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        file
      }));
      setUploadProgress(100);
    }
  };

  const simulateAnalysisProgress = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const intervals = [
      { progress: 20, delay: 1000, message: "استخراج المحتوى..." },
      { progress: 40, delay: 2000, message: "تحليل المنهجية..." },
      { progress: 60, delay: 2500, message: "فحص الجودة العلمية..." },
      { progress: 80, delay: 3000, message: "إعداد التقرير..." },
      { progress: 100, delay: 3500, message: "اكتمل التحليل" }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.file) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة ورفع الملف",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreedToTerms) {
      toast({
        title: "موافقة مطلوبة",
        description: "يرجى الموافقة على شروط الخدمة للمتابعة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    simulateAnalysisProgress();

    try {
      // Convert file to base64
      const fileBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(formData.file!);
      });

      // Call edge function
      const { data, error } = await supabase.functions.invoke('ai-methodology-review', {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          fileName: formData.file!.name,
          fileContent: fileBase64,
          fileType: formData.file!.type
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'حدث خطأ أثناء معالجة الطلب');
      }

      setSubmissionComplete(true);
      toast({
        title: "تم إرسال البحث بنجاح ✅",
        description: "ستصلك رسالة عبر بريدك الإلكتروني قريباً",
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        file: null,
        agreedToTerms: false
      });
      setUploadProgress(0);

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
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/15 rounded-full blur-2xl animate-pulse delay-500" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Bot className="h-16 w-16 text-primary" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FileText className="h-14 w-14 text-secondary" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent mb-6">
              المراجعة المنهجية بالذكاء الاصطناعي
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-4">
              خدمة مبتكرة تعتمد على الذكاء الاصطناعي لفحص وتحليل الأبحاث العلمية المرفقة، وإعداد تقرير مراجعة شامل يتم إرساله مباشرة إلى الإدارة بصيغة PDF.
            </p>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-primary/20 max-w-2xl mx-auto">
              <p className="text-lg font-semibold text-primary mb-2">💡 كيف تعمل الخدمة؟</p>
              <div className="text-right space-y-2 text-muted-foreground">
                <p>✅ 1. ارفع بحثك (PDF أو Word)</p>
                <p>✅ 2. تحليل فوري بالذكاء الاصطناعي</p>
                <p>✅ 3. تحديد السعر حسب تعقيد البحث</p>
                <p>✅ 4. إرسال عرض السعر خلال 24 ساعة</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                    className="mb-4"
                  >
                    <feature.icon className="h-12 w-12 text-primary mx-auto group-hover:text-secondary transition-colors" />
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-primary/20 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-l from-primary/5 to-secondary/5">
              <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                <Brain className="h-6 w-6" />
                نموذج رفع البحث للمراجعة
              </CardTitle>
              <CardDescription>
                قم برفع بحثك للحصول على مراجعة شاملة باستخدام الذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {submissionComplete ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    تم استلام بحثك بنجاح ✅
                  </h3>
                  <p className="text-muted-foreground">
                    ستصلك رسالة عبر بريدك الإلكتروني مع تقرير المراجعة المفصل
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="file" className="text-right flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      ملف البحث (PDF أو Word) *
                    </Label>
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                      <label htmlFor="file" className="cursor-pointer">
                        {formData.file ? (
                          <div className="space-y-2">
                            <FileText className="h-12 w-12 text-green-500 mx-auto" />
                            <p className="text-sm font-medium text-green-600">
                              {formData.file.name}
                            </p>
                            <Progress value={uploadProgress} className="w-full" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-12 w-12 text-primary mx-auto" />
                            <p className="text-sm text-muted-foreground">
                              اضغط هنا لرفع ملف البحث
                            </p>
                            <p className="text-xs text-muted-foreground">
                              الحد الأقصى: 10 ميجابايت
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Name Field */}
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

                  {/* Email Field */}
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

                  {/* Phone Field */}
                  <div className="space-y-2">
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

                  {/* Terms Checkbox */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, agreedToTerms: !!checked }))
                      }
                      required
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                      أوافق على شروط الخدمة وسياسة الخصوصية
                    </Label>
                  </div>

                  {/* Analysis Progress */}
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20"
                    >
                      <div className="flex items-center gap-2 text-primary">
                        <Bot className="h-5 w-5 animate-pulse" />
                        <span className="font-medium">جارٍ تحليل البحث بالذكاء الاصطناعي...</span>
                      </div>
                      <Progress value={analysisProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        {analysisProgress}% مكتمل
                      </p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.file || !formData.agreedToTerms}
                    className="w-full h-12 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        جارٍ المعالجة...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        إرسال للمراجعة
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <Card className="border-primary/20 bg-gradient-to-br from-white/90 to-primary/5 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4"
                >
                  <span className="text-white text-2xl">💰</span>
                </motion.div>
                <h3 className="text-2xl font-bold text-primary mb-2">هيكل التسعير والشروط المالية</h3>
                <p className="text-muted-foreground">نظام تسعير شفاف ومتدرج حسب نوعية البحث وتعقيده</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-white/80 p-4 rounded-lg border border-primary/10"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 text-xl">📄</span>
                    </div>
                    <h4 className="font-semibold text-green-700 mb-2">الأبحاث البسيطة</h4>
                    <p className="text-sm text-muted-foreground">
                      • حتى 50 صفحة<br/>
                      • منهجية واضحة<br/>
                      • سعر تنافسي
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="bg-white/80 p-4 rounded-lg border border-primary/10"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 text-xl">📚</span>
                    </div>
                    <h4 className="font-semibold text-blue-700 mb-2">الأبحاث المتوسطة</h4>
                    <p className="text-sm text-muted-foreground">
                      • 50-150 صفحة<br/>
                      • تحليل متقدم<br/>
                      • تسعير متدرج
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="bg-white/80 p-4 rounded-lg border border-primary/10"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 text-xl">🎓</span>
                    </div>
                    <h4 className="font-semibold text-purple-700 mb-2">الأبحاث المعقدة</h4>
                    <p className="text-sm text-muted-foreground">
                      • أكثر من 150 صفحة<br/>
                      • تحليل شامل<br/>
                      • استشارة مخصصة
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-l from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm">ℹ️</span>
                  </div>
                  <h4 className="font-semibold text-primary">شروط التسعير والدفع</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="mb-2">✅ <strong>عرض السعر:</strong> يتم إرسال عرض سعر مفصل خلال 24 ساعة</p>
                    <p className="mb-2">✅ <strong>طرق التواصل:</strong> البريد الإلكتروني أو الواتساب</p>
                  </div>
                  <div>
                    <p className="mb-2">✅ <strong>صالحية العرض:</strong> 7 أيام من تاريخ الإرسال</p>
                    <p className="mb-2">✅ <strong>طرق الدفع:</strong> تحويل بنكي أو دفع إلكتروني</p>
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

export default AiMethodologyReview;