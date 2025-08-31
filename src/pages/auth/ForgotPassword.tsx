import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      setSent(true);
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور');
    } catch (error: any) {
      toast.error(error.message || 'خطأ في إرسال البريد');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-arabic-formal font-bold text-foreground">
              تم الإرسال بنجاح
            </h1>
            <p className="mt-2 text-muted-foreground">
              تحقق من بريدك الإلكتروني واتبع التعليمات
            </p>
          </div>

          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى:
            </p>
            <p className="font-semibold text-foreground mb-6">{email}</p>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full"
              >
                العودة لتسجيل الدخول
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false);
                  setEmail('');
                }}
                className="w-full"
              >
                إرسال لبريد آخر
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-arabic-formal font-bold text-foreground">
            نسيت كلمة المرور؟
          </h1>
          <p className="mt-2 text-muted-foreground">
            أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور
          </p>
        </div>

        <Card className="p-6">
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

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
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

export default ForgotPassword;