import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Eye, EyeOff, User, Mail, Phone, Lock, ArrowLeft, BookOpen, Users, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SimpleLogin = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('تم تسجيل الدخول بنجاح');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }
    
    if (registerData.password.length < 12) {
      toast.error('كلمة المرور يجب أن تكون 12 حرف على الأقل');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signUp(
        registerData.email,
        registerData.password,
        {
          name: registerData.name,
          phone: registerData.phone,
          role: 'client'
        }
      );
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('تم إنشاء الحساب بنجاح');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-academic flex" dir="rtl">
      {/* خلفية تفاعلية أكاديمية */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/15 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-float"></div>
      </div>

      {/* الجانب الأيسر - معلومات أكاديمية */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16 bg-gradient-to-br from-primary/95 to-secondary/95 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          {/* شعار الوكالة */}
          <div className="flex items-center mb-12">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ml-4 shadow-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-academic-title font-bold">وكالة ماستر إيدو باث</h1>
              <p className="text-white/90 text-lg font-medium">للحلول التعليمية والأكاديمية المتقدمة</p>
            </div>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl font-academic-title font-bold mb-8 leading-tight"
          >
            رحلتك الأكاديمية تبدأ هنا
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white/95 text-xl mb-12 leading-relaxed font-medium"
          >
            انضم إلى منصة تعليمية متطورة تجمع بين الخبرة الأكاديمية والتقنيات الحديثة لضمان تحقيق أهدافك التعليمية
          </motion.p>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center group"
            >
              <div className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center ml-6 group-hover:bg-white/35 transition-all duration-300">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">خدمات تعليمية متكاملة</h3>
                <p className="text-white/85 text-lg">برامج وحلول شاملة لجميع المراحل الأكاديمية</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex items-center group"
            >
              <div className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center ml-6 group-hover:bg-white/35 transition-all duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">نخبة من الخبراء الأكاديميين</h3>
                <p className="text-white/85 text-lg">فريق متخصص من الأكاديميين والباحثين المعتمدين</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex items-center group"
            >
              <div className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center ml-6 group-hover:bg-white/35 transition-all duration-300">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">معايير عالمية مضمونة</h3>
                <p className="text-white/85 text-lg">التزام بأعلى معايير الجودة الأكاديمية العالمية</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* الجانب الأيمن - نموذج التسجيل الأكاديمي */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg"
        >
          {/* شعار للشاشات الصغيرة */}
          <div className="lg:hidden text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-primary">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-3xl font-academic-title font-bold text-foreground mb-3">
              وكالة ماستر إيدو باث
            </h1>
            <p className="text-muted-foreground text-lg">
              منصة التعليم الأكاديمي المتقدمة
            </p>
          </div>

          {/* بطاقة التسجيل الأكاديمية المتطورة */}
          <Card className="academic-card p-10 border-0 shadow-strong bg-gradient-card backdrop-blur-md">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/60 p-2 rounded-2xl mb-10 h-14">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-bold text-base h-10"
                >
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-bold text-base h-10"
                >
                  حساب جديد
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-academic-heading font-bold text-foreground mb-3">أهلاً بعودتك</h3>
                    <p className="text-muted-foreground text-base">سجل دخولك للوصول إلى منصتك الأكاديمية</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="login-email" className="text-base font-bold text-foreground flex items-center">
                        <Mail className="w-5 h-5 ml-3 text-primary" />
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="example@domain.com"
                        required
                        className="h-14 rounded-2xl border-2 border-muted focus:border-primary transition-all duration-300 bg-background/80 text-base px-4"
                        style={{ direction: 'ltr', textAlign: 'left' }}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="login-password" className="text-base font-bold text-foreground flex items-center">
                        <Lock className="w-5 h-5 ml-3 text-primary" />
                        كلمة المرور
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="أدخل كلمة المرور"
                          required
                          className="h-14 rounded-2xl border-2 border-muted focus:border-primary transition-all duration-300 bg-background/80 text-base px-4 pl-14"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-gradient-primary hover:shadow-primary transition-all duration-300 text-white font-bold text-lg mt-8"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin ml-3"></div>
                          جاري تسجيل الدخول...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          تسجيل الدخول
                          <ArrowLeft className="w-6 h-6 mr-3" />
                        </div>
                      )}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-academic-heading font-bold text-foreground mb-3">انضم إلى الوكالة</h3>
                    <p className="text-muted-foreground text-base">أنشئ حسابك الأكاديمي وابدأ رحلة التميز</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-base font-bold text-foreground flex items-center">
                        <User className="w-5 h-5 ml-3 text-primary" />
                        الاسم الكامل *
                      </Label>
                      <Input
                        id="register-name"
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="أدخل اسمك الكامل"
                        required
                        className="h-14 rounded-2xl border-2 border-muted focus:border-primary transition-all duration-300 bg-background/80 text-base px-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-base font-bold text-foreground flex items-center">
                        <Mail className="w-5 h-5 ml-3 text-primary" />
                        البريد الإلكتروني *
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="example@domain.com"
                        required
                        className="h-14 rounded-2xl border-2 border-muted focus:border-primary transition-all duration-300 bg-background/80 text-base px-4"
                        style={{ direction: 'ltr', textAlign: 'left' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-phone" className="text-base font-bold text-foreground flex items-center">
                        <Phone className="w-5 h-5 ml-3 text-primary" />
                        رقم الهاتف
                      </Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+966 50 123 4567"
                        className="h-14 rounded-2xl border-2 border-muted focus:border-primary transition-all duration-300 bg-background/80 text-base px-4"
                        style={{ direction: 'ltr', textAlign: 'left' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-base font-bold text-foreground flex items-center">
                        <Lock className="w-5 h-5 ml-3 text-primary" />
                        كلمة المرور *
                      </Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="كلمة مرور قوية ومعقدة"
                          required
                          className="h-14 rounded-2xl border-2 border-muted focus:border-primary transition-all duration-300 bg-background/80 text-base px-4 pl-14"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center mt-2">
                        <Lock className="w-4 h-4 ml-2 text-primary" />
                        يجب أن تحتوي على 12 حرف على الأقل
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password" className="text-base font-bold text-foreground flex items-center">
                        <Lock className="w-5 h-5 ml-3 text-primary" />
                        تأكيد كلمة المرور *
                      </Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="أعد إدخال كلمة المرور"
                        required
                        className="h-14 rounded-2xl border-2 border-muted focus:border-primary transition-all duration-300 bg-background/80 text-base px-4"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-gradient-secondary hover:shadow-secondary transition-all duration-300 text-white font-bold text-lg mt-8"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin ml-3"></div>
                          جاري إنشاء الحساب...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          إنشاء حساب جديد
                          <User className="w-6 h-6 mr-3" />
                        </div>
                      )}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* رابط العودة الأكاديمي */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-10 text-center"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-primary transition-all duration-300 group text-lg font-medium"
            >
              العودة للصفحة الرئيسية
              <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleLogin;