import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the required tokens
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      toast.error('رابط غير صالح أو منتهي الصلاحية');
      navigate('/auth/forgot-password');
      return;
    }

    // Set the session with the tokens
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 12) {
      toast.error('كلمة المرور يجب أن تكون 12 حرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast.success('تم تحديث كلمة المرور بنجاح');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'خطأ في تحديث كلمة المرور');
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
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-arabic-formal font-bold text-foreground">
            إعادة تعيين كلمة المرور
          </h1>
          <p className="mt-2 text-muted-foreground">
            أدخل كلمة المرور الجديدة
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">كلمة المرور الجديدة</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة مرور قوية"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                يجب أن تحتوي على 12 حرف على الأقل مع أحرف كبيرة وصغيرة وأرقام ورموز
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => navigate('/auth/login')}
            >
              العودة لتسجيل الدخول
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

export default ResetPassword;