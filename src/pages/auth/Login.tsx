import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'client');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      
      // Navigate based on user type
      if (activeTab === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-arabic-formal font-bold text-foreground">
            تسجيل الدخول
          </h1>
          <p className="mt-2 text-muted-foreground">
            مرحباً بك في منصة التعليم الأكاديمي
          </p>
        </div>

        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="client" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                عميل
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                إدارة
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">دخول العملاء</h3>
                <p className="text-sm text-muted-foreground">لإدارة طلباتك وفواتيرك</p>
              </div>
            </TabsContent>

            <TabsContent value="admin">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">دخول الإدارة</h3>
                <p className="text-sm text-muted-foreground">لإدارة النظام والطلبات</p>
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ليس لديك حساب؟{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => navigate('/auth/register')}
              >
                إنشاء حساب جديد
              </Button>
            </p>
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-sm"
              onClick={() => navigate('/auth/forgot-password')}
            >
              نسيت كلمة المرور؟
            </Button>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground"
          >
            ← العودة للصفحة الرئيسية
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;