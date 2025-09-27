import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Headphones, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle,
  Copy,
  Loader2,
  AlertCircle,
  Shield,
  Users,
  Award,
  ArrowLeft,
  UserPlus,
  Star,
  Target,
  MessageCircle,
  Activity,
  FileText,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  country_city: string;
  marketing_channel_url: string;
  marketing_experience: string;
  social_media_followers: string;
  expected_monthly_sales: string;
  motivation: string;
  terms_accepted: boolean;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  phone?: string;
  country_city?: string;
  marketing_channel_url?: string;
  marketing_experience?: string;
  social_media_followers?: string;
  expected_monthly_sales?: string;
  motivation?: string;
  terms_accepted?: string;
}

interface SuccessData {
  affiliate_id: string;
  discount_code: string;
  full_name: string;
  email: string;
}

const AffiliateMarketing = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    country_city: '',
    marketing_channel_url: '',
    marketing_experience: '',
    social_media_followers: '',
    expected_monthly_sales: '',
    motivation: '',
    terms_accepted: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'الاسم الكامل مطلوب';
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'صيغة رقم الهاتف غير صحيحة';
    }

    if (!formData.country_city.trim()) {
      newErrors.country_city = 'الدولة/المدينة مطلوبة';
    }

    if (formData.marketing_channel_url && !/^https?:\/\/.+/.test(formData.marketing_channel_url)) {
      newErrors.marketing_channel_url = 'يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://';
    }

    if (!formData.marketing_experience.trim()) {
      newErrors.marketing_experience = 'يرجى تحديد مستوى خبرتك في التسويق';
    }

    if (!formData.expected_monthly_sales.trim()) {
      newErrors.expected_monthly_sales = 'يرجى تحديد توقعاتك للمبيعات الشهرية';
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'يرجى كتابة دوافعك للانضمام للبرنامج';
    } else if (formData.motivation.trim().length < 20) {
      newErrors.motivation = 'يرجى كتابة دوافعك بتفصيل أكثر (20 حرف على الأقل)';
    }

    if (!formData.terms_accepted) {
      newErrors.terms_accepted = 'يجب الموافقة على شروط البرنامج';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التحقق من البيانات المدخلة وإصلاح الأخطاء",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('affiliate-registration', {
        body: formData
      });

      if (error) {
        console.error('Registration error:', error);
        
        let errorTitle = "خطأ في التسجيل";
        let errorDescription = "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.";
        
        // Handle specific error cases
        if (error.message && error.message.includes('FunctionsHttpError')) {
          // Check if it's a 409 conflict (duplicate email)
          if (error.context && error.context.status === 409) {
            errorTitle = "البريد الإلكتروني مُسجل مسبقاً";
            errorDescription = "هذا البريد الإلكتروني مسجل بالفعل في برنامج التسويق بالعمولة. إذا كنت تواجه مشكلة، يرجى التواصل معنا على 0500776343.";
          } else if (error.message.includes('400')) {
            errorTitle = "خطأ في البيانات";
            errorDescription = "يرجى التأكد من صحة جميع البيانات المدخلة.";
          } else {
            // Try to get the actual error message from network response
            errorDescription = "هذا البريد الإلكتروني مسجل مسبقاً في البرنامج. يرجى استخدام بريد إلكتروني مختلف أو التواصل معنا.";
          }
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        });
        return;
      }

      // Check if there's an error in the response data
      if (data && data.error) {
        console.error('Registration data error:', data.error);
        toast({
          title: "خطأ في التسجيل",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (data && data.success) {
        setSuccessData(data.data);
        toast({
          title: "تم التسجيل بنجاح! 🎉",
          description: "تم إرسال تفاصيل العضوية إلى بريدك الإلكتروني",
        });
      } else {
        throw new Error('فشل في التسجيل');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        description: "تم نسخ الكود بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في النسخ",
        description: "تعذر نسخ الكود. يرجى نسخه يدوياً.",
        variant: "destructive",
      });
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-green-200 shadow-2xl">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </motion.div>

                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                  🎉 تم التسجيل بنجاح!
                </h1>
                
                <p className="text-slate-600 mb-8">
                  مرحباً بك {successData.full_name} في برنامج التسويق بالعمولة
                </p>

                <div className="grid gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">رقم العضوية</h3>
                    <div className="flex items-center justify-between bg-white border border-blue-300 rounded-lg p-3">
                      <span className="font-mono text-lg font-bold text-blue-900">
                        {successData.affiliate_id}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(successData.affiliate_id, 'affiliate_id')}
                        className="mr-2"
                      >
                        {copiedField === 'affiliate_id' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">كود الخصم (10%)</h3>
                    <div className="flex items-center justify-between bg-white border border-green-300 rounded-lg p-3">
                      <span className="font-mono text-lg font-bold text-green-900">
                        {successData.discount_code}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(successData.discount_code, 'discount_code')}
                        className="mr-2"
                      >
                        {copiedField === 'discount_code' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-amber-800 text-sm">
                    📧 تم إرسال التفاصيل الكاملة إلى بريدك الإلكتروني
                  </p>
                </div>

                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  العودة للرئيسية
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              انضم لبرنامج
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> التسويق بالعمولة</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              احصل على عمولة مجزية من كل عميل تجلبه لنا واربح مع أفضل خدمات الترجمة والأبحاث الأكاديمية
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                عمولة تنافسية
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                نظام موثوق
              </span>
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                دعم متخصص
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              {
                icon: DollarSign,
                title: "عمولة مجزية",
                description: "احصل على نسبة عمولة تنافسية من كل عملية بيع تتم عبر كود الخصم الخاص بك. الأرباح تُحول أسبوعياً عند وصولها لـ 100 ريال سعودي",
                color: "text-green-600",
                bgColor: "bg-green-100"
              },
              {
                icon: TrendingUp,
                title: "دفع أسبوعي",
                description: "نقوم بتحويل أرباحك أسبوعياً مباشرة إلى حسابك البنكي عند وصول الرصيد للحد الأدنى 100 ريال سعودي",
                color: "text-blue-600",
                bgColor: "bg-blue-100"
              },
              {
                icon: Headphones,
                title: "دعم متخصص",
                description: "فريق دعم مخصص لمساعدتك في رحلة التسويق وتقديم المواد التسويقية اللازمة لنجاحك",
                color: "text-purple-600",
                bgColor: "bg-purple-100"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center"
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
                    >
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* How it Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">كيف يعمل البرنامج؟</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "التسجيل",
                  description: "سجل في البرنامج واحصل على رقم العضوية وكود الخصم الخاص بك",
                  icon: UserPlus,
                  color: "bg-blue-500"
                },
                {
                  step: "2", 
                  title: "شارك الكود",
                  description: "أرسل رقم عضويتك وكود الخصم للعملاء المحتملين عبر قنواتك التسويقية",
                  icon: Users,
                  color: "bg-green-500"
                },
                {
                  step: "3",
                  title: "العميل يطلب الخدمة",
                  description: "عندما يستخدم العميل كود الخصم الخاص بك، ستحصل على عمولتك",
                  icon: Award,
                  color: "bg-purple-500"
                },
                {
                  step: "4",
                  title: "استلام الأرباح",
                  description: "نحول لك أرباحك أسبوعياً عند وصولها لـ 100 ريال سعودي كحد أدنى",
                  icon: DollarSign,
                  color: "bg-amber-500"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-slate-300 flex items-center justify-center">
                      <span className="text-sm font-bold text-slate-700">{step.step}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-3">{step.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-green-800 mb-2">معلومات الدفع المهمة</h4>
                  <ul className="text-green-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>الحد الأدنى للتحويل: 100 ريال سعودي</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>تكرار الدفع: أسبوعياً (كل يوم أحد)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>طريقة الدفع: تحويل بنكي مباشر</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>تقارير الأرباح: يومية عبر البريد الإلكتروني</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                    ابدأ رحلتك معنا الآن
                  </h2>
                  <p className="text-slate-600">
                    املأ النموذج أدناه وسنتواصل معك خلال 24 ساعة
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">المعلومات الأساسية</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          الاسم الكامل *
                        </Label>
                        <Input
                          value={formData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          className={`h-12 transition-colors ${errors.full_name ? 'border-red-500 shake' : 'focus:border-blue-500'}`}
                        />
                        <AnimatePresence>
                          {errors.full_name && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-1 text-red-600 text-sm"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.full_name}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-500" />
                          البريد الإلكتروني *
                        </Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="example@domain.com"
                          className={`h-12 transition-colors ${errors.email ? 'border-red-500 shake' : 'focus:border-blue-500'}`}
                        />
                        <AnimatePresence>
                          {errors.email && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-1 text-red-600 text-sm"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.email}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-500" />
                          رقم الجوال *
                        </Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+966xxxxxxxxx"
                          className={`h-12 transition-colors ${errors.phone ? 'border-red-500 shake' : 'focus:border-blue-500'}`}
                        />
                        <AnimatePresence>
                          {errors.phone && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-1 text-red-600 text-sm"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.phone}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          الدولة / المدينة *
                        </Label>
                        <Input
                          value={formData.country_city}
                          onChange={(e) => handleInputChange('country_city', e.target.value)}
                          placeholder="مثال: الرياض، المملكة العربية السعودية"
                          className={`h-12 transition-colors ${errors.country_city ? 'border-red-500 shake' : 'focus:border-blue-500'}`}
                        />
                        <AnimatePresence>
                          {errors.country_city && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-1 text-red-600 text-sm"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.country_city}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Experience Section */}
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <BarChart className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">الخبرة التسويقية</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Target className="h-4 w-4 text-emerald-500" />
                          مستوى الخبرة في التسويق *
                        </Label>
                        <Select onValueChange={(value) => handleInputChange('marketing_experience', value)}>
                          <SelectTrigger className={`h-12 transition-colors ${errors.marketing_experience ? 'border-red-500' : 'focus:border-emerald-500'}`}>
                            <SelectValue placeholder="اختر مستوى خبرتك" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">مبتدئ (أقل من سنة)</SelectItem>
                            <SelectItem value="intermediate">متوسط (1-3 سنوات)</SelectItem>
                            <SelectItem value="advanced">متقدم (3-5 سنوات)</SelectItem>
                            <SelectItem value="expert">خبير (أكثر من 5 سنوات)</SelectItem>
                          </SelectContent>
                        </Select>
                        <AnimatePresence>
                          {errors.marketing_experience && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-1 text-red-600 text-sm"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.marketing_experience}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-emerald-500" />
                          عدد المتابعين في وسائل التواصل
                        </Label>
                        <Select onValueChange={(value) => handleInputChange('social_media_followers', value)}>
                          <SelectTrigger className="h-12 focus:border-emerald-500">
                            <SelectValue placeholder="اختر عدد المتابعين" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1k">أقل من 1,000</SelectItem>
                            <SelectItem value="1k-10k">1,000 - 10,000</SelectItem>
                            <SelectItem value="10k-50k">10,000 - 50,000</SelectItem>
                            <SelectItem value="50k-100k">50,000 - 100,000</SelectItem>
                            <SelectItem value="100k+">أكثر من 100,000</SelectItem>
                            <SelectItem value="no-social">لا أستخدم وسائل التواصل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          توقعات المبيعات الشهرية *
                        </Label>
                        <Select onValueChange={(value) => handleInputChange('expected_monthly_sales', value)}>
                          <SelectTrigger className={`h-12 transition-colors ${errors.expected_monthly_sales ? 'border-red-500' : 'focus:border-emerald-500'}`}>
                            <SelectValue placeholder="كم تتوقع أن تبيع شهرياً؟" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">1-5 خدمات</SelectItem>
                            <SelectItem value="6-15">6-15 خدمة</SelectItem>
                            <SelectItem value="16-30">16-30 خدمة</SelectItem>
                            <SelectItem value="31-50">31-50 خدمة</SelectItem>
                            <SelectItem value="50+">أكثر من 50 خدمة</SelectItem>
                          </SelectContent>
                        </Select>
                        <AnimatePresence>
                          {errors.expected_monthly_sales && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-1 text-red-600 text-sm"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.expected_monthly_sales}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-emerald-500" />
                          رابط قناة التسويق (اختياري)
                        </Label>
                        <Input
                          value={formData.marketing_channel_url}
                          onChange={(e) => handleInputChange('marketing_channel_url', e.target.value)}
                          placeholder="https://example.com أو رابط وسائل التواصل"
                          className={`h-12 transition-colors ${errors.marketing_channel_url ? 'border-red-500 shake' : 'focus:border-emerald-500'}`}
                        />
                        <AnimatePresence>
                          {errors.marketing_channel_url && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-1 text-red-600 text-sm"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.marketing_channel_url}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Motivation Section */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">دوافعك للانضمام</h3>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-500" />
                        لماذا تريد الانضمام لبرنامج التسويق بالعمولة؟ *
                      </Label>
                      <Textarea
                        value={formData.motivation}
                        onChange={(e) => handleInputChange('motivation', e.target.value)}
                        placeholder="اكتب دوافعك وأهدافك من الانضمام للبرنامج، وكيف ستساعد في تسويق خدماتنا..."
                        rows={4}
                        className={`transition-colors ${errors.motivation ? 'border-red-500 shake' : 'focus:border-purple-500'}`}
                      />
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>{formData.motivation.length}/500</span>
                        <span>الحد الأدنى: 20 حرف</span>
                      </div>
                      <AnimatePresence>
                        {errors.motivation && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 text-red-600 text-sm"
                          >
                            <AlertCircle className="h-4 w-4" />
                            {errors.motivation}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Terms and Submit */}
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3 space-x-reverse p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <Checkbox
                        id="terms"
                        checked={formData.terms_accepted}
                        onCheckedChange={(checked) => handleInputChange('terms_accepted', !!checked)}
                        className={errors.terms_accepted ? 'border-red-500' : ''}
                      />
                      <Label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        أوافق على{' '}
                        <a 
                          href="/terms-of-service" 
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 underline font-semibold"
                        >
                          شروط وأحكام برنامج التسويق بالعمولة
                        </a>
                        {' '}وسياسة الخصوصية، وأتعهد بالالتزام بقواعد التسويق المهني والأخلاقي *
                      </Label>
                    </div>
                    <AnimatePresence>
                      {errors.terms_accepted && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-1 text-red-600 text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.terms_accepted}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            جاري التسجيل...
                          </>
                        ) : (
                          <>
                            انضم للبرنامج الآن
                            <ArrowLeft className="mr-2 h-6 w-6" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-6">هل لديك أسئلة؟</h3>
            <div className="flex flex-wrap justify-center gap-8">
              <a href="mailto:legal@masteredupath.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
                legal@masteredupath.com
              </a>
              <a href="tel:0500776343" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Phone className="h-5 w-5" />
                0500776343
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AffiliateMarketing;