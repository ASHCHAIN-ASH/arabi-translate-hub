import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, UserPlus, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/MultiTenantAuthProvider';
import { useTenant } from '@/components/TenantProvider';
import { useToast } from '@/hooks/use-toast';

const MultiTenantLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { signIn, signUp, user } = useAuth();
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (['admin', 'manager', 'accountant', 'support'].includes(user.role)) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!loginEmail || !loginPassword) {
      setError('يرجى ملء جميع الحقول');
      setLoading(false);
      return;
    }

    const result = await signIn(loginEmail, loginPassword);
    
    if (result.error) {
      setError(result.error);
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: `أهلاً بك في ${tenant?.name}`,
      });
    }
    
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!registerName || !registerEmail || !registerPassword) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    if (registerPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      setLoading(false);
      return;
    }

    const result = await signUp(registerName, registerEmail, registerPassword, registerPhone);
    
    if (result.error) {
      setError(result.error);
      toast({
        title: 'خطأ في التسجيل',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم التسجيل بنجاح',
        description: `مرحباً بك في ${tenant?.name}`,
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl" style={{ direction: 'rtl' }}>
      {/* Academic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-cyan-400 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-pink-400 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        {/* Academic Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Floating Academic Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-20 text-white/10 text-6xl"
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, 0] 
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          📚
        </motion.div>
        <motion.div 
          className="absolute bottom-32 right-16 text-white/10 text-5xl"
          animate={{ 
            y: [10, -10, 10],
            rotate: [0, -5, 0] 
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🎓
        </motion.div>
        <motion.div 
          className="absolute top-1/2 right-10 text-white/10 text-4xl"
          animate={{ 
            x: [-5, 5, -5],
            y: [-8, 8, -8] 
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          📝
        </motion.div>
        <motion.div 
          className="absolute top-40 right-1/2 text-white/10 text-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0] 
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          🔬
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className="relative mx-auto mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <LogIn className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {tenant?.name || 'منصة وكالة ماستر إيدو باث'}
            </motion.h1>
            
            <motion.p 
              className="text-blue-100 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {activeTab === 'login' ? 'سجل دخولك للمتابعة' : 'انضم إلى منصتنا الأكاديمية'}
            </motion.p>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden" dir="rtl" style={{ direction: 'rtl' }}>
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl" style={{ direction: 'rtl' }}>
                  <TabsList className="grid w-full grid-cols-2 bg-white/80 rounded-2xl p-1" dir="rtl" style={{ direction: 'rtl' }}>
                    <TabsTrigger 
                      value="login" 
                      className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium"
                    >
                      تسجيل الدخول
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register"
                      className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium"
                    >
                      إنشاء حساب
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent className="p-8 space-y-6" dir="rtl" style={{ direction: 'rtl' }}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Tabs value={activeTab} className="w-full" dir="rtl" style={{ direction: 'rtl' }}>
                  <TabsContent value="login" className="space-y-6 mt-0" dir="rtl" style={{ direction: 'rtl' }}>
                    <form onSubmit={handleLogin} className="space-y-6" dir="rtl" style={{ direction: 'rtl' }}>
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <Label htmlFor="login-email" className="text-gray-700 font-medium text-right block" dir="rtl" style={{ textAlign: 'right', direction: 'rtl' }}>البريد الإلكتروني</Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="أدخل بريدك الإلكتروني"
                          required
                          disabled={loading}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-lg text-right placeholder:text-right"
                          dir="rtl"
                          style={{ textAlign: 'right', direction: 'rtl', unicodeBidi: 'plaintext' }}
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <Label htmlFor="login-password" className="text-gray-700 font-medium text-right block" dir="rtl" style={{ textAlign: 'right', direction: 'rtl' }}>كلمة المرور</Label>
                        <div className="relative" dir="rtl">
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="أدخل كلمة المرور"
                            required
                            disabled={loading}
                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-lg text-right pr-12 placeholder:text-right"
                            dir="rtl"
                            style={{ textAlign: 'right', direction: 'rtl', unicodeBidi: 'plaintext' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                          disabled={loading}
                          size="lg"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                              جاري تسجيل الدخول...
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-5 w-5" />
                              تسجيل الدخول
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-6 mt-0" dir="rtl" style={{ direction: 'rtl' }}>
                    <form onSubmit={handleRegister} className="space-y-6" dir="rtl" style={{ direction: 'rtl' }}>
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <Label htmlFor="register-name" className="text-gray-700 font-medium text-right block" dir="rtl" style={{ textAlign: 'right', direction: 'rtl' }}>الاسم الكامل *</Label>
                        <Input
                          id="register-name"
                          type="text"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          required
                          disabled={loading}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-right placeholder:text-right"
                          dir="rtl"
                          style={{ textAlign: 'right', direction: 'rtl', unicodeBidi: 'plaintext' }}
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <Label htmlFor="register-email" className="text-gray-700 font-medium text-right block" dir="rtl" style={{ textAlign: 'right', direction: 'rtl' }}>البريد الإلكتروني *</Label>
                        <Input
                          id="register-email"
                          type="email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          placeholder="أدخل بريدك الإلكتروني"
                          required
                          disabled={loading}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-right placeholder:text-right"
                          dir="rtl"
                          style={{ textAlign: 'right', direction: 'rtl', unicodeBidi: 'plaintext' }}
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                      >
                        <Label htmlFor="register-phone" className="text-gray-700 font-medium text-right block" dir="rtl" style={{ textAlign: 'right', direction: 'rtl' }}>رقم الهاتف</Label>
                        <Input
                          id="register-phone"
                          type="tel"
                          value={registerPhone}
                          onChange={(e) => setRegisterPhone(e.target.value)}
                          placeholder="أدخل رقم هاتفك"
                          disabled={loading}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-right placeholder:text-right"
                          dir="rtl"
                          style={{ textAlign: 'right', direction: 'rtl', unicodeBidi: 'plaintext' }}
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                      >
                        <Label htmlFor="register-password" className="text-gray-700 font-medium text-right block" dir="rtl" style={{ textAlign: 'right', direction: 'rtl' }}>كلمة المرور *</Label>
                        <div className="relative" dir="rtl">
                          <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                            required
                            disabled={loading}
                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-right pr-12 placeholder:text-right"
                            dir="rtl"
                            style={{ textAlign: 'right', direction: 'rtl', unicodeBidi: 'plaintext' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                      >
                        <Label htmlFor="confirm-password" className="text-gray-700 font-medium text-right block" dir="rtl" style={{ textAlign: 'right', direction: 'rtl' }}>تأكيد كلمة المرور *</Label>
                        <Input
                          id="confirm-password"
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="أعد كتابة كلمة المرور"
                          required
                          disabled={loading}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-right placeholder:text-right"
                          dir="rtl"
                          style={{ textAlign: 'right', direction: 'rtl', unicodeBidi: 'plaintext' }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                          disabled={loading}
                          size="lg"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                              جاري إنشاء الحساب...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-5 w-5" />
                              إنشاء حساب
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </TabsContent>
                </Tabs>

                <motion.div 
                  className="text-center pt-6 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  <Link 
                    to="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors group"
                  >
                    <Home className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
                    العودة للصفحة الرئيسية
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MultiTenantLogin;