import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  GraduationCap,
  Users,
  Award,
  CheckCircle,
  Star,
  BookOpen,
  Globe,
  Clock,
  FileText,
  Send,
  Phone,
  Mail,
  MapPin,
  Target,
  TrendingUp,
  Shield,
  Heart,
  Zap,
  Calendar,
  User,
  School,
  CreditCard,
  AlertTriangle,
  Info
} from "lucide-react";
import { z } from "zod";
import admissionBackground from "@/assets/university-admission-background.jpg";

// Schema validation for the admission form
const admissionSchema = z.object({
  fullName: z.string().trim().min(2, { message: "الاسم يجب أن يكون أكثر من حرفين" }).max(100, { message: "الاسم يجب أن يكون أقل من 100 حرف" }),
  email: z.string().trim().email({ message: "البريد الإلكتروني غير صحيح" }).max(255, { message: "البريد الإلكتروني طويل جداً" }),
  phone: z.string().trim().min(10, { message: "رقم الهاتف يجب أن يكون على الأقل 10 أرقام" }).max(15, { message: "رقم الهاتف طويل جداً" }),
  nationality: z.string().trim().min(2, { message: "يرجى اختيار الجنسية" }),
  currentEducation: z.string().trim().min(2, { message: "يرجى اختيار المستوى التعليمي الحالي" }),
  desiredField: z.string().trim().min(2, { message: "يرجى اختيار التخصص المرغوب" }),
  desiredUniversity: z.string().trim().min(2, { message: "يرجى اختيار الجامعة المرغوبة" }),
  gpa: z.string().trim().optional(),
  englishLevel: z.string().trim().min(1, { message: "يرجى اختيار مستوى اللغة الإنجليزية" }),
  additionalInfo: z.string().trim().max(1000, { message: "المعلومات الإضافية يجب أن تكون أقل من 1000 حرف" }).optional(),
  hasScholarship: z.boolean().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "يجب الموافقة على الشروط والأحكام" })
});

const AdmissionServices = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    currentEducation: "",
    desiredField: "",
    desiredUniversity: "",
    gpa: "",
    englishLevel: "",
    additionalInfo: "",
    hasScholarship: false,
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = admissionSchema.parse(formData);
      
      // Call Supabase edge function to send emails
      const { data, error } = await supabase.functions.invoke('send-admission-inquiry', {
        body: validatedData
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "تم إرسال الطلب بنجاح",
        description: `رقم الطلب: ${data.applicationNumber}. سيتم التواصل معك خلال 24 ساعة لمتابعة طلب القبول`,
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        nationality: "",
        currentEducation: "",
        desiredField: "",
        desiredUniversity: "",
        gpa: "",
        englishLevel: "",
        additionalInfo: "",
        hasScholarship: false,
        agreeToTerms: false
      });
      
    } catch (error) {
      console.error("Submission error:", error);
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "خطأ في البيانات",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطأ في الإرسال",
          description: error?.message || "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: School,
      title: "اختيار الجامعة المناسبة",
      description: "نساعدك في اختيار الجامعة التي تناسب تخصصك وأهدافك المهنية",
      color: "text-white",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: FileText,
      title: "إعداد الوثائق",
      description: "نقوم بإعداد وترجمة جميع الوثائق المطلوبة للقبول الجامعي",
      color: "text-white",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: Target,
      title: "كتابة المقالات الشخصية",
      description: "فريقنا المتخصص يساعدك في كتابة مقالات شخصية مميزة",
      color: "text-white",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: Globe,
      title: "متابعة طلب القبول",
      description: "نتابع معك جميع مراحل طلب القبول حتى الحصول على القبول النهائي",
      color: "text-white",
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600"
    }
  ];

  const universities = [
    "الجامعات السعودية الحكومية",
    "الجامعات السعودية الأهلية", 
    "الجامعات الأمريكية",
    "الجامعات البريطانية",
    "الجامعات الكندية",
    "الجامعات الأسترالية",
    "الجامعات الألمانية",
    "جامعات أخرى"
  ];

  const fields = [
    "الطب البشري",
    "طب الأسنان",
    "الصيدلة",
    "الهندسة",
    "علوم الحاسب",
    "إدارة الأعمال",
    "القانون",
    "العلوم",
    "الآداب والعلوم الإنسانية",
    "التربية",
    "أخرى"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white" dir="rtl">
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${admissionBackground})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-900/30 to-purple-900/20"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full mb-6 shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              خدمات القبول الجامعي المتميزة
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              نحن شريكك المتخصص للحصول على القبول في أفضل الجامعات المحلية والدولية. 
              فريق خبراء متخصص لضمان نجاح رحلتك التعليمية
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { icon: Users, number: "5000+", label: "طالب حصل على القبول" },
              { icon: Award, number: "200+", label: "جامعة شريكة" },
              { icon: CheckCircle, number: "95%", label: "معدل نجاح القبول" },
              { icon: Star, number: "5.0", label: "تقييم العملاء" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="text-center bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full mb-4 shadow-md">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              خدماتنا المتخصصة
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الخدمات لضمان حصولك على القبول الجامعي المناسب
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className={`inline-flex items-center justify-center w-16 h-16 ${service.bgColor} rounded-full mb-4 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <service.icon className={`h-8 w-8 ${service.color}`} />
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              ابدأ رحلتك الجامعية معنا
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              املأ النموذج أدناه وسيتواصل معك فريقنا المتخصص لبدء إجراءات القبول
            </p>
            
            {/* Pricing Notice */}
            <Alert className="max-w-2xl mx-auto bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <strong>تنبيه مهم:</strong> خدمات القبول الجامعي مدفوعة الأجر. سيتم إرسال عرض الأسعار التفصيلي بعد مراجعة طلبكم والتأكد من صحة المعلومات المقدمة من قبل فريقنا الأكاديمي المتخصص.
              </AlertDescription>
            </Alert>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white text-center">
                <CardTitle className="text-xl md:text-2xl flex items-center justify-center gap-3">
                  <FileText className="h-6 w-6" />
                  نموذج طلب القبول الجامعي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                      <User className="h-5 w-5 text-primary" />
                      المعلومات الشخصية
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div 
                        className="space-y-2"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          الاسم الكامل *
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          className="w-full transition-all duration-300 focus:scale-105"
                          required
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          البريد الإلكتروني *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="example@email.com"
                          className="w-full transition-all duration-300 focus:scale-105"
                          required
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          رقم الهاتف *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+966501234567"
                          className="w-full transition-all duration-300 focus:scale-105"
                          required
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Label htmlFor="nationality" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          الجنسية *
                        </Label>
                        <Select value={formData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
                          <SelectTrigger className="transition-all duration-300 hover:scale-105">
                            <SelectValue placeholder="اختر الجنسية" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="saudi">السعودية</SelectItem>
                            <SelectItem value="egypt">مصر</SelectItem>
                            <SelectItem value="jordan">الأردن</SelectItem>
                            <SelectItem value="lebanon">لبنان</SelectItem>
                            <SelectItem value="syria">سوريا</SelectItem>
                            <SelectItem value="palestine">فلسطين</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentEducation" className="text-sm font-medium text-gray-700">
                        المستوى التعليمي الحالي *
                      </Label>
                      <Select value={formData.currentEducation} onValueChange={(value) => handleInputChange("currentEducation", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المستوى التعليمي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">الثانوية العامة</SelectItem>
                          <SelectItem value="bachelor">بكالوريوس</SelectItem>
                          <SelectItem value="master">ماجستير</SelectItem>
                          <SelectItem value="phd">دكتوراه</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gpa" className="text-sm font-medium text-gray-700">
                        المعدل التراكمي
                      </Label>
                      <Input
                        id="gpa"
                        type="text"
                        value={formData.gpa}
                        onChange={(e) => handleInputChange("gpa", e.target.value)}
                        placeholder="مثال: 4.5 من 5"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="desiredField" className="text-sm font-medium text-gray-700">
                        التخصص المرغوب *
                      </Label>
                      <Select value={formData.desiredField} onValueChange={(value) => handleInputChange("desiredField", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields.map((field) => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="desiredUniversity" className="text-sm font-medium text-gray-700">
                        الجامعة المرغوبة *
                      </Label>
                      <Select value={formData.desiredUniversity} onValueChange={(value) => handleInputChange("desiredUniversity", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجامعة" />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((university) => (
                            <SelectItem key={university} value={university}>{university}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="englishLevel" className="text-sm font-medium text-gray-700">
                        مستوى اللغة الإنجليزية *
                      </Label>
                      <Select value={formData.englishLevel} onValueChange={(value) => handleInputChange("englishLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى اللغة الإنجليزية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">مبتدئ</SelectItem>
                          <SelectItem value="intermediate">متوسط</SelectItem>
                          <SelectItem value="advanced">متقدم</SelectItem>
                          <SelectItem value="native">ممتاز</SelectItem>
                          <SelectItem value="ielts">حاصل على شهادة IELTS</SelectItem>
                          <SelectItem value="toefl">حاصل على شهادة TOEFL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
                      معلومات إضافية
                    </Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      placeholder="أي معلومات إضافية تود مشاركتها معنا..."
                      className="min-h-[100px]"
                      maxLength={1000}
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="hasScholarship"
                        checked={formData.hasScholarship}
                        onCheckedChange={(checked) => handleInputChange("hasScholarship", checked)}
                      />
                      <Label htmlFor="hasScholarship" className="text-sm text-gray-700">
                        أرغب في التقديم على منحة دراسية
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                        required
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                        أوافق على <a href="/terms-of-service" className="text-primary hover:underline">الشروط والأحكام</a> و
                        <a href="/privacy-policy" className="text-primary hover:underline"> سياسة الخصوصية</a> *
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        جارٍ الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        إرسال طلب القبول
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              تواصل مع خبرائنا
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              فريقنا المتخصص جاهز للإجابة على جميع استفساراتك ومساعدتك في رحلتك الجامعية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "اتصل بنا",
                description: "متاحون للرد على مكالماتك",
                contact: "+966501234567",
                color: "text-green-500",
                bgColor: "bg-green-50"
              },
              {
                icon: Mail,
                title: "راسلنا",
                description: "نرد على رسائلك خلال ساعات",
                contact: "info@masteredupath.com",
                color: "text-blue-500",
                bgColor: "bg-blue-50"
              },
              {
                icon: MapPin,
                title: "موقعنا",
                description: "زورونا في مقرنا الرئيسي",
                contact: "المملكة العربية السعودية",
                color: "text-purple-500",
                bgColor: "bg-purple-50"
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${contact.bgColor} rounded-full mb-4`}>
                      <contact.icon className={`h-8 w-8 ${contact.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{contact.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{contact.description}</p>
                    <p className="font-semibold text-gray-800">{contact.contact}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdmissionServices;