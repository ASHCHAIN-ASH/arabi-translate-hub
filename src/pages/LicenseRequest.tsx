import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Scale, 
  Copyright, 
  FileCheck, 
  User, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Send,
  ArrowLeft,
  Eye,
  Globe,
  Lock,
  Fingerprint,
  Award,
  Star,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/data/legacy/client";
import { z } from "zod";

// Schema validation شديد الصرامة
const licenseRequestSchema = z.object({
  companyName: z.string()
    .trim()
    .min(2, "اسم الشركة يجب أن يكون حرفين على الأقل")
    .max(100, "اسم الشركة لا يجب أن يتجاوز 100 حرف")
    .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s\-&.()]+$/, "اسم الشركة يحتوي على أحرف غير مسموحة"),
  
  contactPerson: z.string()
    .trim()
    .min(3, "اسم الشخص المسؤول يجب أن يكون 3 أحرف على الأقل")
    .max(50, "اسم الشخص المسؤول لا يجب أن يتجاوز 50 حرف")
    .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على أحرف فقط"),
  
  email: z.string()
    .trim()
    .email("البريد الإلكتروني غير صالح")
    .max(255, "البريد الإلكتروني طويل جداً")
    .refine((email) => !email.includes('+'), "البريد الإلكتروني لا يجب أن يحتوي على رمز +")
    .refine((email) => email.split('@')[1]?.includes('.'), "نطاق البريد الإلكتروني غير صالح"),
  
  phone: z.string()
    .trim()
    .min(10, "رقم الهاتف قصير جداً")
    .max(15, "رقم الهاتف طويل جداً")
    .regex(/^[0-9+\-\s()]+$/, "رقم الهاتف يحتوي على أحرف غير صالحة"),
  
  licenseType: z.enum([
    "educational", 
    "commercial", 
    "research", 
    "non-profit", 
    "government",
    "personal"
  ], {
    required_error: "يجب اختيار نوع الترخيص",
    invalid_type_error: "نوع الترخيص غير صالح"
  }),
  
  usagePurpose: z.string()
    .trim()
    .min(20, "الغرض من الاستخدام يجب أن يكون 20 حرف على الأقل")
    .max(500, "الغرض من الاستخدام لا يجب أن يتجاوز 500 حرف"),
  
  contentType: z.enum([
    "texts", 
    "designs", 
    "software", 
    "educational-materials", 
    "trademarks",
    "mixed-content"
  ], {
    required_error: "يجب اختيار نوع المحتوى",
    invalid_type_error: "نوع المحتوى غير صالح"
  }),
  
  duration: z.enum([
    "3-months", 
    "6-months", 
    "1-year", 
    "2-years", 
    "permanent"
  ], {
    required_error: "يجب اختيار مدة الترخيص",
    invalid_type_error: "مدة الترخيص غير صالحة"
  }),
  
  additionalInfo: z.string().trim().max(1000, "المعلومات الإضافية لا يجب أن تتجاوز 1000 حرف").optional(),
  
  agreeToTerms: z.boolean().refine((val) => val === true, "يجب الموافقة على الشروط والأحكام"),
});

type LicenseRequestForm = z.infer<typeof licenseRequestSchema>;

const LicenseRequest = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<LicenseRequestForm>>({
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const totalSteps = 4;

  const licenseTypes = [
    { value: "educational", label: "تعليمي", icon: Award, color: "text-blue-600" },
    { value: "commercial", label: "تجاري", icon: Building2, color: "text-green-600" },
    { value: "research", label: "بحثي", icon: Eye, color: "text-purple-600" },
    { value: "non-profit", label: "غير ربحي", icon: Globe, color: "text-orange-600" },
    { value: "government", label: "حكومي", icon: Shield, color: "text-red-600" },
    { value: "personal", label: "شخصي", icon: User, color: "text-indigo-600" }
  ];

  const contentTypes = [
    { value: "texts", label: "النصوص والمحتوى", icon: FileCheck },
    { value: "designs", label: "التصاميم البصرية", icon: Eye },
    { value: "software", label: "الأنظمة والبرمجيات", icon: Zap },
    { value: "educational-materials", label: "المحتوى التعليمي", icon: Award },
    { value: "trademarks", label: "العلامات التجارية", icon: Star },
    { value: "mixed-content", label: "محتوى مختلط", icon: Globe }
  ];

  const durations = [
    { value: "3-months", label: "3 أشهر" },
    { value: "6-months", label: "6 أشهر" },
    { value: "1-year", label: "سنة واحدة" },
    { value: "2-years", label: "سنتان" },
    { value: "permanent", label: "دائم" }
  ];

  const handleInputChange = (field: keyof LicenseRequestForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};
    
    try {
      if (step === 1) {
        // Validate company info
        licenseRequestSchema.pick({ 
          companyName: true, 
          contactPerson: true, 
          email: true, 
          phone: true 
        }).parse(formData);
      } else if (step === 2) {
        // Validate license details
        licenseRequestSchema.pick({ 
          licenseType: true, 
          contentType: true, 
          duration: true 
        }).parse(formData);
      } else if (step === 3) {
        // Validate usage purpose
        licenseRequestSchema.pick({ 
          usagePurpose: true 
        }).parse(formData);
      } else if (step === 4) {
        // Validate terms agreement
        licenseRequestSchema.pick({ 
          agreeToTerms: true 
        }).parse(formData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          stepErrors[err.path[0] as string] = err.message;
        });
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    try {
      setIsSubmitting(true);
      
      // Final validation
      const validatedData = licenseRequestSchema.parse(formData);
      
      // Send email via edge function
      const { error } = await supabase.functions.invoke('send-license-request', {
        body: validatedData
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلب الترخيص بنجاح",
        description: "سنقوم بمراجعة طلبكم والرد عليكم خلال 24-48 ساعة",
      });

      // Reset form
      setFormData({ agreeToTerms: false });
      setCurrentStep(1);
      
    } catch (error: any) {
      console.error('License request error:', error);
      toast({
        variant: "destructive",
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال طلب الترخيص. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      scale: 0.95,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-8 shadow-2xl">
              <Scale className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              طلب ترخيص الاستخدام
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              احصل على الترخيص القانوني لاستخدام محتوياتنا المحمية بالملكية الفكرية
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { icon: Shield, text: "حماية قانونية" },
                { icon: FileCheck, text: "ترخيص رسمي" },
                { icon: Clock, text: "رد سريع" },
                { icon: Award, text: "جودة معتمدة" }
              ].map(({ icon: Icon, text }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
                >
                  <Icon className="h-5 w-5 text-blue-300" />
                  <span className="text-sm font-medium">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step <= currentStep
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                    animate={{ 
                      scale: step === currentStep ? 1.1 : 1,
                      boxShadow: step === currentStep ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 0 0px rgba(59, 130, 246, 0)'
                    }}
                  >
                    {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                  </motion.div>
                  {step < 4 && (
                    <div className={`w-full h-1 mx-2 transition-all duration-300 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-slate-600 font-medium">
                الخطوة {currentStep} من {totalSteps}: {
                  currentStep === 1 ? 'معلومات الشركة' :
                  currentStep === 2 ? 'تفاصيل الترخيص' :
                  currentStep === 3 ? 'الغرض من الاستخدام' :
                  'الشروط والأحكام'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Card className="shadow-2xl border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        {currentStep === 1 && <Building2 className="h-6 w-6" />}
                        {currentStep === 2 && <FileCheck className="h-6 w-6" />}
                        {currentStep === 3 && <Eye className="h-6 w-6" />}
                        {currentStep === 4 && <Shield className="h-6 w-6" />}
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          {currentStep === 1 && 'معلومات الشركة'}
                          {currentStep === 2 && 'تفاصيل الترخيص'}
                          {currentStep === 3 && 'الغرض من الاستخدام'}
                          {currentStep === 4 && 'الشروط والأحكام'}
                        </CardTitle>
                        <CardDescription className="text-blue-100">
                          {currentStep === 1 && 'أدخل معلومات شركتكم والشخص المسؤول'}
                          {currentStep === 2 && 'اختر نوع الترخيص والمحتوى المطلوب'}
                          {currentStep === 3 && 'وضح الغرض التفصيلي من الاستخدام'}
                          {currentStep === 4 && 'اقرأ ووافق على الشروط والأحكام'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 space-y-6">
                    {/* Step 1: Company Information */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
                              اسم الشركة *
                            </Label>
                            <Input
                              id="companyName"
                              placeholder="أدخل اسم الشركة أو المؤسسة"
                              value={formData.companyName || ''}
                              onChange={(e) => handleInputChange('companyName', e.target.value)}
                              className={`h-12 ${errors.companyName ? 'border-red-500' : ''}`}
                            />
                            {errors.companyName && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.companyName}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contactPerson" className="text-sm font-medium flex items-center gap-2">
                              <User className="h-4 w-4 text-green-600" />
                              الشخص المسؤول *
                            </Label>
                            <Input
                              id="contactPerson"
                              placeholder="اسم الشخص المسؤول عن الطلب"
                              value={formData.contactPerson || ''}
                              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                              className={`h-12 ${errors.contactPerson ? 'border-red-500' : ''}`}
                            />
                            {errors.contactPerson && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.contactPerson}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                              <Mail className="h-4 w-4 text-purple-600" />
                              البريد الإلكتروني *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="email@company.com"
                              value={formData.email || ''}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.email}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                              <Phone className="h-4 w-4 text-orange-600" />
                              رقم الهاتف *
                            </Label>
                            <Input
                              id="phone"
                              placeholder="0559600824"
                              value={formData.phone || ''}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className={`h-12 ${errors.phone ? 'border-red-500' : ''}`}
                            />
                            {errors.phone && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: License Details */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                        <div className="space-y-4">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Scale className="h-4 w-4 text-blue-600" />
                            نوع الترخيص *
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {licenseTypes.map((type) => (
                              <motion.div
                                key={type.value}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  formData.licenseType === type.value
                                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                                onClick={() => handleInputChange('licenseType', type.value)}
                              >
                                <div className="flex items-center gap-3">
                                  <type.icon className={`h-5 w-5 ${type.color}`} />
                                  <span className="font-medium text-slate-800">{type.label}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          {errors.licenseType && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {errors.licenseType}
                            </p>
                          )}
                        </div>

                        <div className="space-y-4">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Copyright className="h-4 w-4 text-purple-600" />
                            نوع المحتوى المطلوب *
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contentTypes.map((content) => (
                              <motion.div
                                key={content.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  formData.contentType === content.value
                                    ? 'border-purple-600 bg-purple-50 shadow-lg'
                                    : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                                onClick={() => handleInputChange('contentType', content.value)}
                              >
                                <div className="flex items-center gap-3">
                                  <content.icon className="h-5 w-5 text-purple-600" />
                                  <span className="font-medium text-slate-800">{content.label}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          {errors.contentType && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {errors.contentType}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            مدة الترخيص *
                          </Label>
                          <Select value={formData.duration || ""} onValueChange={(value) => handleInputChange('duration', value)}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="اختر مدة الترخيص" />
                            </SelectTrigger>
                            <SelectContent>
                              {durations.map((duration) => (
                                <SelectItem key={duration.value} value={duration.value}>
                                  {duration.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.duration && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {errors.duration}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Usage Purpose */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="usagePurpose" className="text-sm font-medium flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-600" />
                            الغرض من الاستخدام *
                          </Label>
                          <Textarea
                            id="usagePurpose"
                            placeholder="اشرح بالتفصيل الغرض من استخدام المحتوى المحمي بالملكية الفكرية، مجال الاستخدام، والجمهور المستهدف..."
                            value={formData.usagePurpose || ''}
                            onChange={(e) => handleInputChange('usagePurpose', e.target.value)}
                            className={`min-h-32 resize-none ${errors.usagePurpose ? 'border-red-500' : ''}`}
                            rows={6}
                          />
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>{(formData.usagePurpose || '').length}/500 حرف</span>
                            <span>يجب أن يكون 20 حرف على الأقل</span>
                          </div>
                          {errors.usagePurpose && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {errors.usagePurpose}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="additionalInfo" className="text-sm font-medium flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-purple-600" />
                            معلومات إضافية (اختياري)
                          </Label>
                          <Textarea
                            id="additionalInfo"
                            placeholder="أي معلومات إضافية تود إضافتها لطلب الترخيص..."
                            value={formData.additionalInfo || ''}
                            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                            className="min-h-24 resize-none"
                            rows={4}
                          />
                          <div className="text-xs text-slate-500">
                            {(formData.additionalInfo || '').length}/1000 حرف
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Terms and Conditions */}
                    {currentStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                            <h3 className="text-lg font-bold text-red-800">شروط الترخيص المهمة</h3>
                          </div>
                          <div className="space-y-3 text-sm text-red-700">
                            <div className="flex items-start gap-2">
                              <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <p>استخدام المحتوى يقتصر على الغرض المحدد في الطلب فقط</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Copyright className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <p>يمنع نقل أو تعديل أو إعادة توزيع المحتوى دون إذن كتابي</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Fingerprint className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <p>يجب ذكر المصدر والإشارة لحقوق الملكية الفكرية في جميع الاستخدامات</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Scale className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <p>أي انتهاك للشروط يعرض المرخص له للمساءلة القانونية</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileCheck className="h-5 w-5 text-blue-600" />
                            ملخص طلب الترخيص
                          </h3>
                          
                          <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <span className="text-sm text-slate-600">اسم الشركة:</span>
                                <p className="font-medium">{formData.companyName}</p>
                              </div>
                              <div>
                                <span className="text-sm text-slate-600">الشخص المسؤول:</span>
                                <p className="font-medium">{formData.contactPerson}</p>
                              </div>
                              <div>
                                <span className="text-sm text-slate-600">نوع الترخيص:</span>
                                <p className="font-medium">
                                  {licenseTypes.find(t => t.value === formData.licenseType)?.label}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm text-slate-600">نوع المحتوى:</span>
                                <p className="font-medium">
                                  {contentTypes.find(c => c.value === formData.contentType)?.label}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm text-slate-600">مدة الترخيص:</span>
                                <p className="font-medium">
                                  {durations.find(d => d.value === formData.duration)?.label}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id="agreeToTerms"
                              checked={formData.agreeToTerms || false}
                              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
                            />
                            <label htmlFor="agreeToTerms" className="text-sm text-slate-700 leading-relaxed">
                              أوافق على <strong>جميع الشروط والأحكام</strong> المذكورة أعلاه وأتعهد بالالتزام بها، 
                              وأقر بأن أي انتهاك لهذه الشروط يعرضني للمساءلة القانونية وفقاً للقوانين السعودية والدولية.
                            </label>
                          </div>
                          {errors.agreeToTerms && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {errors.agreeToTerms}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>

                  {/* Navigation Buttons */}
                  <div className="bg-slate-50 p-6 border-t">
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        السابق
                      </Button>

                      {currentStep < totalSteps ? (
                        <Button
                          onClick={nextStep}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          التالي
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !formData.agreeToTerms}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LicenseRequest;