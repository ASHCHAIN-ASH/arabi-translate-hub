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
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  country_city: string;
  marketing_channel_url: string;
  terms_accepted: boolean;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  phone?: string;
  country_city?: string;
  marketing_channel_url?: string;
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
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }

    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'صيغة رقم الهاتف غير صحيحة';
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
        throw error;
      }

      if (data.success) {
        setSuccessData(data.data);
        toast({
          title: "تم التسجيل بنجاح! 🎉",
          description: "تم إرسال تفاصيل العضوية إلى بريدك الإلكتروني",
        });
      } else {
        throw new Error(data.error || 'فشل في التسجيل');
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      الاسم الكامل *
                    </label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className={`h-12 ${errors.full_name ? 'border-red-500 shake' : ''}`}
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
                    <label className="text-sm font-medium text-slate-700">
                      البريد الإلكتروني *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@domain.com"
                      className={`h-12 ${errors.email ? 'border-red-500 shake' : ''}`}
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
                    <label className="text-sm font-medium text-slate-700">
                      رقم الجوال (اختياري)
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+966xxxxxxxxx"
                      className={`h-12 ${errors.phone ? 'border-red-500 shake' : ''}`}
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
                    <label className="text-sm font-medium text-slate-700">
                      الدولة / المدينة (اختياري)
                    </label>
                    <Input
                      value={formData.country_city}
                      onChange={(e) => handleInputChange('country_city', e.target.value)}
                      placeholder="مثال: الرياض، المملكة العربية السعودية"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      رابط قناة التسويق (اختياري)
                    </label>
                    <Textarea
                      value={formData.marketing_channel_url}
                      onChange={(e) => handleInputChange('marketing_channel_url', e.target.value)}
                      placeholder="أدخل رابط موقعك الإلكتروني، صفحة السوشيال ميديا، أو قناة التسويق الخاصة بك"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <Checkbox
                        id="terms"
                        checked={formData.terms_accepted}
                        onCheckedChange={(checked) => handleInputChange('terms_accepted', !!checked)}
                        className={errors.terms_accepted ? 'border-red-500' : ''}
                      />
                      <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                        أوافق على{' '}
                        <a 
                          href="/terms-of-service" 
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          شروط وأحكام برنامج التسويق بالعمولة
                        </a>
                        {' '}وسياسة الخصوصية *
                      </label>
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
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        جاري التسجيل...
                      </>
                    ) : (
                      <>
                        انضم للبرنامج الآن
                        <ArrowLeft className="mr-2 h-5 w-5" />
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