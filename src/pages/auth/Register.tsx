import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        role: 'client'
      });
      
      toast.success('تم إنشاء الحساب بنجاح! يرجى تفعيل بريدك الإلكتروني');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'خطأ في إنشاء الحساب');
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
            إنشاء حساب جديد
          </h1>
          <p className="mt-2 text-muted-foreground">
            انضم لمنصة التعليم الأكاديمي
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني"
                required
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="أدخل رقم هاتفك"
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة مرور قوية"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                يجب أن تحتوي على 12 حرف على الأقل مع أحرف كبيرة وصغيرة وأرقام ورموز
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="أعد إدخال كلمة المرور"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              لديك حساب بالفعل؟{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => navigate('/auth/login')}
              >
                تسجيل الدخول
              </Button>
            </p>
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

export default Register;