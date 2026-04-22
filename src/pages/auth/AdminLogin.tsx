import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { triggerLoginWelcome } from '@/components/LoginWelcomeOverlay';
import { Card } from '@/components/ui/card';
import { Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect based on role once resolved
  React.useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    
    if (userRole === 'admin') {
      navigate('/adminmaster', { replace: true });
    } else if (userRole) {
      // Non-admin user trying admin login → send to client dashboard
      toast.error('هذا الحساب ليس حساب إدارة');
      navigate('/dashboard', { replace: true });
    }
  }, [user, userRole, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      triggerLoginWelcome();
      // Navigation will happen via useEffect when userRole is set
    } catch (error: any) {
      toast.error(error.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-arabic-formal font-bold text-white mb-2">
            دخول الإدارة
          </h1>
          <p className="text-slate-300 text-lg">
            منصة ماستر إيدو باث
          </p>
        </div>

        <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">أهلاً بعودتك</h2>
            <p className="text-slate-300">سجل دخولك للوصول إلى منصتك الأكاديمية</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white text-right block mb-2">
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
                className="bg-white/10 border-white/30 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white text-right block mb-2">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                className="bg-white/10 border-white/30 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="text-sm text-slate-400 mb-4">
              هذه منطقة مخصصة للإداريين فقط
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              ← العودة للصفحة الرئيسية
            </Button>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            أو{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-orange-400 hover:text-orange-300"
              onClick={() => navigate('/login?type=client')}
            >
              تسجيل دخول العملاء
            </Button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
