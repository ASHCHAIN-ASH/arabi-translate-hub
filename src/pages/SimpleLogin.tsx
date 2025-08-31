import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, BookOpen, Users, Award } from 'lucide-react';
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
      {/* خلفية تفاعلية */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-soft"></div>
      </div>

      {/* الجانب الأيسر - معلومات ومزايا */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 bg-gradient-to-br from-primary to-secondary">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center ml-4">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-academic-title">ماستر إيدو باث</h1>
              <p className="text-white/80 text-sm">للحلول التعليمية المتقدمة</p>
            </div>
          </div>

          <h2 className="text-4xl font-academic-title mb-6 leading-relaxed">
            انضم إلى منصة التعليم الأكاديمي الرائدة
          </h2>
          
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            اكتشف عالماً من المعرفة والخدمات التعليمية المتطورة التي تساعدك على تحقيق أهدافك الأكاديمية
          </p>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center ml-4">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">خدمات تعليمية شاملة</h3>
                <p className="text-white/80 text-sm">حلول متكاملة لجميع احتياجاتك الأكاديمية</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center ml-4">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">فريق من الخبراء</h3>
                <p className="text-white/80 text-sm">أكاديميون ومتخصصون ذوو خبرة عالية</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center ml-4">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">جودة مضمونة</h3>
                <p className="text-white/80 text-sm">معايير عالمية في التعليم والخدمات</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* الجانب الأيمن - نموذج التسجيل */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* شعار للشاشات الصغيرة */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-academic-title text-foreground mb-2">
              ماستر إيدو باث
            </h1>
            <p className="text-muted-foreground">
              منصة التعليم الأكاديمي الرائدة
            </p>
          </div>

          {/* بطاقة التسجيل العصرية */}
          <Card className="academic-card p-8 border-0 shadow-academic bg-gradient-card backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl mb-8">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg font-medium"
                >
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg font-medium"
                >
                  إنشاء حساب جديد
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-academic-heading text-foreground mb-2">أهلاً بعودتك</h3>
                    <p className="text-muted-foreground text-sm">سجل دخولك للوصول إلى حسابك</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium text-foreground flex items-center">
                        <Mail className="w-4 h-4 ml-2" />
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="example@domain.com"
                        required
                        className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors duration-300 bg-background/50 text-left"
                        style={{ direction: 'ltr' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium text-foreground flex items-center">
                        <Lock className="w-4 h-4 ml-2" />
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
                          className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors duration-300 bg-background/50 pr-4 pl-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-primary hover:shadow-primary transition-all duration-300 text-white font-medium text-base"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                          جاري تسجيل الدخول...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <ArrowRight className="w-5 h-5 ml-2" />
                          تسجيل الدخول
                        </div>
                      )}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-academic-heading text-foreground mb-2">انضم إلينا اليوم</h3>
                    <p className="text-muted-foreground text-sm">أنشئ حسابك الجديد وابدأ رحلتك التعليمية</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-sm font-medium text-foreground flex items-center">
                        <User className="w-4 h-4 ml-2" />
                        الاسم الكامل *
                      </Label>
                      <Input
                        id="register-name"
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="أدخل اسمك الكامل"
                        required
                        className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors duration-300 bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-sm font-medium text-foreground flex items-center">
                        <Mail className="w-4 h-4 ml-2" />
                        البريد الإلكتروني *
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="example@domain.com"
                        required
                        className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors duration-300 bg-background/50 text-left"
                        style={{ direction: 'ltr' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-phone" className="text-sm font-medium text-foreground flex items-center">
                        <Phone className="w-4 h-4 ml-2" />
                        رقم الهاتف (اختياري)
                      </Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+966 50 123 4567"
                        className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors duration-300 bg-background/50 text-left"
                        style={{ direction: 'ltr' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-sm font-medium text-foreground flex items-center">
                        <Lock className="w-4 h-4 ml-2" />
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
                          className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors duration-300 bg-background/50 pr-4 pl-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Lock className="w-3 h-3 ml-1" />
                        يجب أن تحتوي على 12 حرف على الأقل
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password" className="text-sm font-medium text-foreground flex items-center">
                        <Lock className="w-4 h-4 ml-2" />
                        تأكيد كلمة المرور *
                      </Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="أعد إدخال كلمة المرور"
                        required
                        className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors duration-300 bg-background/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-secondary hover:shadow-secondary transition-all duration-300 text-white font-medium text-base"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                          جاري إنشاء الحساب...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <User className="w-5 h-5 ml-2" />
                          إنشاء حساب جديد
                        </div>
                      )}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* رابط العودة */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-primary transition-colors duration-300 group"
            >
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              العودة للصفحة الرئيسية
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleLogin;