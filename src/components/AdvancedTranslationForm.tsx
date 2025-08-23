import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import FileUploader from "./FileUploader";
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Globe, 
  Calendar, 
  Clock, 
  Star, 
  Shield, 
  FileText, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Eye,
  MessageSquare,
  MapPin,
  Users,
  Headphones,
  Timer,
  Building2,
  Award,
  Zap
} from "lucide-react";

interface TranslationFormData {
  // معلومات العميل
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  
  // تفاصيل الترجمة
  translationType: string;
  fromLanguage: string;
  toLanguage: string;
  urgency: 'standard' | 'fast' | 'urgent' | 'express';
  qualityLevel: 'standard' | 'premium' | 'expert';
  
  // معلومات إضافية
  projectDescription: string;
  specialRequirements: string;
  budget: string;
  deadline: string;
  
  // خيارات إضافية
  needsProofreading: boolean;
  needsCertification: boolean;
  needsRushDelivery: boolean;
  confidentialityAgreement: boolean;
  
  // الملفات
  files: File[];
}

interface AdvancedTranslationFormProps {
  translationType?: string;
  title?: string;
  description?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const AdvancedTranslationForm = ({ 
  translationType = "general",
  title = "طلب ترجمة احترافية",
  description = "احصل على ترجمة عالية الجودة من فريق الخبراء",
  gradientFrom = "blue-600",
  gradientTo = "indigo-600"
}: AdvancedTranslationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TranslationFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    companyName: "",
    translationType,
    fromLanguage: "ar",
    toLanguage: "en",
    urgency: "standard",
    qualityLevel: "premium",
    projectDescription: "",
    specialRequirements: "",
    budget: "",
    deadline: "",
    needsProofreading: false,
    needsCertification: false,
    needsRushDelivery: false,
    confidentialityAgreement: false,
    files: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const { toast } = useToast();

  const languages = [
    { code: "ar", name: "العربية" },
    { code: "en", name: "الإنجليزية" },
    { code: "fr", name: "الفرنسية" },
    { code: "de", name: "الألمانية" },
    { code: "es", name: "الإسبانية" },
    { code: "it", name: "الإيطالية" },
    { code: "ru", name: "الروسية" },
    { code: "zh", name: "الصينية" },
    { code: "ja", name: "اليابانية" },
    { code: "ko", name: "الكورية" }
  ];

  const translationTypes = [
    { value: "legal", label: "الترجمة القانونية" },
    { value: "medical", label: "الترجمة الطبية" },
    { value: "technical", label: "الترجمة التقنية" },
    { value: "business", label: "الترجمة التجارية" },
    { value: "academic", label: "الترجمة الأكاديمية" },
    { value: "literary", label: "الترجمة الأدبية" },
    { value: "media", label: "ترجمة الوسائط" },
    { value: "instant", label: "الترجمة الفورية" }
  ];

  const urgencyOptions = [
    { value: "standard", label: "عادي (7-10 أيام)", multiplier: "1x", icon: Clock },
    { value: "fast", label: "سريع (3-5 أيام)", multiplier: "1.5x", icon: ArrowRight },
    { value: "urgent", label: "عاجل (1-2 يوم)", multiplier: "2x", icon: AlertCircle },
    { value: "express", label: "فوري (خلال 24 ساعة)", multiplier: "3x", icon: Send }
  ];

  const qualityOptions = [
    { value: "standard", label: "جودة عادية", description: "ترجمة دقيقة ومراجعة أساسية" },
    { value: "premium", label: "جودة عالية", description: "ترجمة متخصصة مع مراجعة شاملة" },
    { value: "expert", label: "جودة خبير", description: "ترجمة من متخصصين مع مراجعة متعددة المستويات" }
  ];

  const handleInputChange = (field: keyof TranslationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFilesSelected = useCallback((files: File[]) => {
    setFormData(prev => ({ ...prev, files }));
  }, []);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.clientName && formData.clientEmail && formData.clientPhone);
      case 2:
        return !!(formData.translationType && formData.fromLanguage && formData.toLanguage);
      case 3:
        return formData.files.length > 0;
      case 4:
        return formData.confidentialityAgreement;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast({
        title: "يرجى إكمال الحقول المطلوبة",
        description: "تأكد من ملء جميع الحقول الإجبارية قبل المتابعة",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "يرجى الموافقة على الشروط",
        description: "يجب الموافقة على اتفاقية السرية للمتابعة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(0);

    // محاكاة عملية الإرسال مع شريط التقدم
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setSubmitProgress(i);
    }

    // محاكاة إرسال البيانات
    console.log('Form Data:', formData);
    
    toast({
      title: "تم إرسال طلبك بنجاح!",
      description: "سنتواصل معك خلال 24 ساعة لمناقشة التفاصيل",
    });

    setCurrentStep(5);
    setIsSubmitting(false);
  };

  const stepAnimation = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.3 }
  };

  const renderStep1 = () => (
    <motion.div {...stepAnimation} className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mb-4 shadow-lg"
        >
          <User className="h-10 w-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2 text-rtl">معلومات العميل</h3>
        <p className="text-muted-foreground text-rtl">نحتاج معلوماتك للتواصل معك</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 rtl-grid">
        <div className="space-y-2">
          <Label htmlFor="clientName" className="text-rtl">الاسم الكامل *</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className="text-rtl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientEmail" className="text-rtl">البريد الإلكتروني *</Label>
          <Input
            id="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={(e) => handleInputChange('clientEmail', e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone" className="text-rtl">رقم الهاتف *</Label>
          <Input
            id="clientPhone"
            value={formData.clientPhone}
            onChange={(e) => handleInputChange('clientPhone', e.target.value)}
            placeholder="+966 XX XXX XXXX"
            className="text-rtl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-rtl">اسم الشركة (اختياري)</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="اسم الشركة أو المؤسسة"
            className="text-rtl"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div {...stepAnimation} className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg"
        >
          <Globe className="h-10 w-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2 text-rtl">تفاصيل الترجمة</h3>
        <p className="text-muted-foreground text-rtl">حدد نوع الترجمة واللغات المطلوبة</p>
      </motion.div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-rtl">نوع الترجمة</Label>
          <Select value={formData.translationType} onValueChange={(value) => handleInputChange('translationType', value)}>
            <SelectTrigger className="text-rtl">
              <SelectValue placeholder="اختر نوع الترجمة" />
            </SelectTrigger>
            <SelectContent>
              {translationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-6 rtl-grid">
          <div className="space-y-2">
            <Label className="text-rtl">من اللغة</Label>
            <Select value={formData.fromLanguage} onValueChange={(value) => handleInputChange('fromLanguage', value)}>
              <SelectTrigger className="text-rtl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-rtl">إلى اللغة</Label>
            <Select value={formData.toLanguage} onValueChange={(value) => handleInputChange('toLanguage', value)}>
              <SelectTrigger className="text-rtl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-rtl">السرعة المطلوبة</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgencyOptions.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${formData.urgency === option.value ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  onClick={() => handleInputChange('urgency', option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={formData.urgency === option.value ? "default" : "secondary"}>
                        {option.multiplier}
                      </Badge>
                      <option.icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold text-rtl">{option.label}</h4>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-rtl">مستوى الجودة</Label>
          <div className="space-y-3">
            {qualityOptions.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${formData.qualityLevel === option.value ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  onClick={() => handleInputChange('qualityLevel', option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between rtl-flex">
                      <div className="text-rtl">
                        <h4 className="font-semibold">{option.label}</h4>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <Star className={`h-5 w-5 ${formData.qualityLevel === option.value ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div {...stepAnimation} className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg"
        >
          <FileText className="h-10 w-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2 text-rtl">رفع الملفات</h3>
        <p className="text-muted-foreground text-rtl">ارفع الملفات المراد ترجمتها</p>
      </motion.div>

      <FileUploader
        onFilesSelected={handleFilesSelected}
        maxFiles={10}
        acceptedTypes={['.doc', '.docx', '.pdf', '.txt', '.ppt', '.pptx', '.xls', '.xlsx']}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectDescription" className="text-rtl">وصف المشروع</Label>
          <Textarea
            id="projectDescription"
            value={formData.projectDescription}
            onChange={(e) => handleInputChange('projectDescription', e.target.value)}
            placeholder="صف مشروع الترجمة وأي تفاصيل مهمة..."
            className="min-h-[120px] text-rtl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequirements" className="text-rtl">متطلبات خاصة</Label>
          <Textarea
            id="specialRequirements"
            value={formData.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            placeholder="أي متطلبات خاصة أو تعليمات إضافية..."
            className="text-rtl"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 rtl-grid">
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-rtl">الميزانية المتوقعة</Label>
            <Input
              id="budget"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              placeholder="مثال: 1000 ريال"
              className="text-rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-rtl">الموعد النهائي المطلوب</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div {...stepAnimation} className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full mb-4 shadow-lg"
        >
          <Shield className="h-10 w-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2 text-rtl">خيارات إضافية والموافقات</h3>
        <p className="text-muted-foreground text-rtl">اختر الخدمات الإضافية وراجع الشروط</p>
      </motion.div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">خدمات إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Checkbox
                id="needsProofreading"
                checked={formData.needsProofreading}
                onCheckedChange={(checked) => handleInputChange('needsProofreading', checked)}
              />
              <div className="text-right">
                <Label htmlFor="needsProofreading" className="font-medium">مراجعة لغوية إضافية</Label>
                <p className="text-sm text-muted-foreground">مراجعة نهائية من مدقق لغوي</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                id="needsCertification"
                checked={formData.needsCertification}
                onCheckedChange={(checked) => handleInputChange('needsCertification', checked)}
              />
              <div className="text-right">
                <Label htmlFor="needsCertification" className="font-medium">ترجمة معتمدة ومختومة</Label>
                <p className="text-sm text-muted-foreground">ترجمة رسمية بختم المكتب</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                id="needsRushDelivery"
                checked={formData.needsRushDelivery}
                onCheckedChange={(checked) => handleInputChange('needsRushDelivery', checked)}
              />
              <div className="text-right">
                <Label htmlFor="needsRushDelivery" className="font-medium">تسليم عاجل</Label>
                <p className="text-sm text-muted-foreground">تسليم خلال 24 ساعة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3 space-x-reverse">
              <Checkbox
                id="confidentialityAgreement"
                checked={formData.confidentialityAgreement}
                onCheckedChange={(checked) => handleInputChange('confidentialityAgreement', checked)}
                className="mt-1"
                required
              />
              <div className="text-right space-y-2">
                <Label htmlFor="confidentialityAgreement" className="font-medium text-primary">
                  الموافقة على اتفاقية السرية والشروط *
                </Label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  أوافق على شروط الخدمة واتفاقية السرية. أتفهم أن جميع المعلومات والملفات المقدمة ستبقى سرية وآمنة.
                  لن يتم مشاركة أي من المحتوى مع أطراف ثالثة دون موافقة صريحة.
                </p>
                <div className="flex gap-4 text-sm">
                  <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                    <Eye className="h-4 w-4 ml-1" />
                    اقرأ الشروط كاملة
                  </Button>
                  <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                    <Download className="h-4 w-4 ml-1" />
                    تحميل اتفاقية السرية
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div {...stepAnimation} className="text-center space-y-6">
      <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <h3 className="text-3xl font-bold text-green-600">تم إرسال طلبك بنجاح!</h3>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        شكراً لك على ثقتك بخدماتنا. تم استلام طلب الترجمة وسيتم مراجعته من فريقنا المتخصص.
      </p>
      
      <div className="bg-primary/5 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-lg">الخطوات التالية:</h4>
        <div className="space-y-3 text-right">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <p>سنراجع طلبك وملفاتك خلال 2-4 ساعات</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <p>سنرسل لك عرض سعر مفصل ومدة التسليم</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <p>بعد الموافقة، سنبدأ العمل فوراً</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          تواصل معنا عبر الواتساب
        </Button>
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          طلب ترجمة جديد
        </Button>
      </div>
    </motion.div>
  );

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-0 shadow-2xl">
        {/* Header Section with Company Info */}
        <div className={`bg-gradient-to-l from-${gradientFrom} to-${gradientTo} text-white overflow-hidden relative`}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full animate-float"></div>
            <div className="absolute top-10 right-10 w-16 h-16 bg-white rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-5 left-5 w-12 h-12 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative z-10 p-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
              >
                <Building2 className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-rtl">{title}</h2>
              <p className="text-xl opacity-90 text-rtl">{description}</p>
            </motion.div>

            {/* Company Information Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
              >
                <MapPin className="h-8 w-8 mx-auto mb-2 text-white animate-pulse" />
                <h4 className="font-semibold text-rtl">موقعنا</h4>
                <p className="text-sm opacity-90 text-rtl">جدة، المملكة العربية السعودية</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
              >
                <Clock className="h-8 w-8 mx-auto mb-2 text-white animate-pulse" />
                <h4 className="font-semibold text-rtl">ساعات العمل</h4>
                <p className="text-sm opacity-90 text-rtl">الأحد - الخميس</p>
                <p className="text-xs opacity-80 text-rtl">10:00 ص - 7:00 م</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
              >
                <Headphones className="h-8 w-8 mx-auto mb-2 text-white animate-pulse" />
                <h4 className="font-semibold text-rtl">خدمة العملاء</h4>
                <p className="text-sm opacity-90 text-rtl">متاحة 24/7</p>
                <p className="text-xs opacity-80 text-rtl">على مدار الساعة</p>
              </motion.div>
            </div>

            {/* Progress Section */}
            {currentStep < 5 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <div className="flex justify-between items-center mb-4 rtl-flex">
                  <div className="text-rtl">
                    <h4 className="text-lg font-semibold">الخطوة {currentStep} من 4</h4>
                    <p className="text-sm opacity-90">{Math.round(progressPercentage)}% مكتمل</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 animate-spin" />
                    <span className="text-sm">جاري المعالجة...</span>
                  </div>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-3 bg-white/20"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <CardContent className="p-8 rtl-container">
          <AnimatePresence mode="wait">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </AnimatePresence>

          {/* Action Buttons */}
          {currentStep < 5 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between mt-8 pt-6 border-t rtl-flex"
            >
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 hover-scale"
              >
                <ArrowRight className="h-4 w-4" />
                السابق
              </Button>

              {currentStep < 4 ? (
                <Button 
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center gap-2 hover-scale bg-gradient-to-l from-primary to-primary/80"
                >
                  التالي
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="flex items-center gap-2 hover-scale bg-gradient-to-l from-green-600 to-green-500"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      إرسال الطلب
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          )}

          {/* Submission Progress */}
          {isSubmitting && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex justify-between items-center text-sm mb-2 rtl-flex">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 animate-pulse text-primary" />
                  جاري رفع الملفات ومعالجة الطلب...
                </span>
                <span className="font-semibold">{submitProgress}%</span>
              </div>
              <Progress value={submitProgress} className="h-2" />
            </motion.div>
          )}

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 grid md:grid-cols-3 gap-4"
          >
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Shield className="h-8 w-8 text-green-600 animate-pulse" />
              <div className="text-rtl">
                <h5 className="font-semibold text-green-800 dark:text-green-200">أمان تام</h5>
                <p className="text-xs text-green-600">حماية كاملة للبيانات</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Award className="h-8 w-8 text-blue-600 animate-pulse" />
              <div className="text-rtl">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200">جودة معتمدة</h5>
                <p className="text-xs text-blue-600">ISO 9001 معتمد</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 animate-pulse" />
              <div className="text-rtl">
                <h5 className="font-semibold text-purple-800 dark:text-purple-200">فريق خبراء</h5>
                <p className="text-xs text-purple-600">+500 مترجم محترف</p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedTranslationForm;