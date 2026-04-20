import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LogIn, Mail, Lock, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { WhatsappAuthForm } from '@/components/auth/WhatsappAuthForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from;
  const nextPath = redirectTo?.pathname
    ? `${redirectTo.pathname}${redirectTo.search ?? ''}`
    : null;

  React.useEffect(() => {
    if (!authLoading && user) {
      navigate(userRole === 'admin' ? '/adminmaster' : (nextPath || '/dashboard'), { replace: true });
    }
  }, [authLoading, user, userRole, navigate, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error);
        return;
      }
      
      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error: any) {
      toast.error(error.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
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
              <LogIn className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-arabic-formal font-bold text-slate-800 mb-2">
            تسجيل دخول العملاء
          </h1>
          <p className="text-slate-600 text-lg">
            مرحباً بك في منصة ماستر إيدو باث
          </p>
        </motion.div>

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

              <TabsContent value="email">
                <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                  dir="ltr"
                  className="mt-2 h-12 border-2 focus:border-blue-500 transition-colors"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="password" className="text-slate-700 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  كلمة المرور
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
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
                      جاري تسجيل الدخول...
                    </div>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
              </motion.div>
                </form>
              </TabsContent>

              <TabsContent value="whatsapp">
                <WhatsappAuthForm mode="login" />
                <p className="text-xs text-center text-slate-500 mt-4">
                  ليس لديك حساب؟ يمكنك إنشاء حساب جديد بواتساب من{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-emerald-600 hover:underline font-medium"
                  >
                    صفحة التسجيل
                  </button>
                </p>
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
                ليس لديك حساب؟{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
                  onClick={() => navigate('/register')}
                >
                  إنشاء حساب جديد
                </Button>
              </p>

              <Button
                variant="link"
                className="p-0 h-auto font-normal text-sm text-slate-500 hover:text-slate-700"
                onClick={() => navigate('/auth/forgot-password')}
              >
                نسيت كلمة المرور؟
              </Button>
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

export default Login;
