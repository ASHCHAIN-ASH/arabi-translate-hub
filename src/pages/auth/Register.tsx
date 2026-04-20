import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { UserPlus, Mail, User, Phone, Lock, Eye, EyeOff, CheckCircle, Gift, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReferralService } from '@/utils/referralService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WhatsappAuthForm } from '@/components/auth/WhatsappAuthForm';

const Register = () => {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  const [referrerName, setReferrerName] = useState<string | null>(null);

  useEffect(() => {
    if (refCode) {
      ReferralService.storePendingCode(refCode);
      ReferralService.resolveReferrer(refCode).then((r) => {
        if (r) setReferrerName(r.name);
      });
    }
  }, [refCode]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password) || /[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getStrengthColor = (strength: number) => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength < 50) return 'ضعيفة';
    if (strength < 75) return 'متوسطة';
    return 'قوية';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (passwordStrength < 75) {
      toast.error('كلمة المرور يجب أن تحتوي على: 3 أحرف على الأقل + رمز واحد + رقم واحد');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
      });
      
      if (error) {
        toast.error(error);
        return;
      }
      
      toast.success('تم إنشاء الحساب بنجاح، يرجى تأكيد البريد الإلكتروني ثم تسجيل الدخول');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'خطأ في إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4" dir="rtl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-arabic-formal font-bold text-slate-800 mb-2">
            إنشاء حساب جديد
          </h1>
          <p className="text-slate-600 text-lg">
            انضم لمنصة ماستر إيدو باث
          </p>
        </motion.div>

        {refCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-emerald-900">
                  {referrerName ? `تمت دعوتك من ${referrerName} 🎉` : 'لديك دعوة إحالة 🎉'}
                </div>
                <div className="text-sm text-emerald-700 mt-0.5">
                  رمز الإحالة: <span className="font-mono font-bold">{refCode.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <Tabs defaultValue="email" dir="rtl" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="email" className="gap-2">
                  <Mail className="w-4 h-4" /> البريد الإلكتروني
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="gap-2">
                  <MessageCircle className="w-4 h-4" /> واتساب
                </TabsTrigger>
              </TabsList>

              <TabsContent value="whatsapp">
                <WhatsappAuthForm
                  mode="register"
                  onSuccess={() => navigate('/dashboard')}
                />
              </TabsContent>

              <TabsContent value="email">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <Label htmlFor="name" className="text-slate-700 font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  الاسم الكامل *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الكامل"
                  required
                  className="mt-2 h-12 border-2 focus:border-blue-500 transition-colors"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                  dir="ltr"
                  className="mt-2 h-12 border-2 focus:border-blue-500 transition-colors"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="phone" className="text-slate-700 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="أدخل رقم هاتفك"
                  dir="ltr"
                  className="mt-2 h-12 border-2 focus:border-blue-500 transition-colors"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="password" className="text-slate-700 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  كلمة المرور *
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="أدخل كلمة مرور قوية"
                    required
                    className="h-12 border-2 focus:border-blue-500 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">قوة كلمة المرور:</span>
                      <span className={`font-medium ${passwordStrength >= 80 ? 'text-green-600' : passwordStrength >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-3 h-3 ${formData.password.length >= 6 ? 'text-green-500' : 'text-slate-400'}`} />
                    <span>6 أحرف على الأقل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-3 h-3 ${(/[A-Za-z]/.test(formData.password)) ? 'text-green-500' : 'text-slate-400'}`} />
                    <span>حرف واحد على الأقل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-3 h-3 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-slate-400'}`} />
                    <span>رقم واحد على الأقل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-3 h-3 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-slate-400'}`} />
                    <span>رمز خاص واحد على الأقل</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  تأكيد كلمة المرور *
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="أعد إدخال كلمة المرور"
                    required
                    className="h-12 border-2 focus:border-blue-500 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">كلمات المرور غير متطابقة</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-medium text-lg shadow-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري إنشاء الحساب...
                    </div>
                  ) : (
                    'إنشاء حساب'
                  )}
                </Button>
              </motion.div>
            </form>
              </TabsContent>
            </Tabs>

            <motion.div variants={itemVariants} className="mt-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">أو</span>
                </div>
              </div>
              
              <p className="text-slate-600">
                لديك حساب بالفعل؟{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
                  onClick={() => navigate('/login')}
                >
                  تسجيل الدخول
                </Button>
              </p>
            </motion.div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-slate-800"
          >
            ← العودة للصفحة الرئيسية
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;