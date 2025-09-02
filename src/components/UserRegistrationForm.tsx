import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, User, Phone, Loader2 } from 'lucide-react';

interface UserRegistrationFormProps {
  onSuccess?: () => void;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // تسجيل المستخدم في جدول المستخدمين
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.toLowerCase().trim(),
            phone: formData.phone.trim() || null,
            role: 'client',
            status: 'active',
            password_hash: 'registration_pending' // سيتم تحديثها لاحقاً
          }
        ])
        .select()
        .single();

      if (userError) {
        console.error('User registration error:', userError);
        
        if (userError.code === '23505') {
          toast.error('هذا البريد الإلكتروني مسجل بالفعل');
        } else {
          toast.error(`خطأ في التسجيل: ${userError.message}`);
        }
        return;
      }

      console.log('User registered successfully:', userData);

      toast.success('تم تسجيل المستخدم بنجاح!', {
        description: `مرحباً ${formData.name}، تم إنشاء حسابك بنجاح`,
        duration: 5000,
      });

      // إعادة تعيين النموذج
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: ''
      });

      // استدعاء دالة النجاح إذا كانت موجودة
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // إزالة رسالة الخطأ عند بدء الكتابة
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">تسجيل مستخدم جديد</h2>
        <p className="text-sm text-muted-foreground mt-2">
          إضافة مستخدم جديد إلى النظام
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            الاسم الكامل *
          </Label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="name"
              type="text"
              placeholder="أدخل الاسم الكامل"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`pr-10 ${errors.name ? 'border-red-500' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            البريد الإلكتروني *
          </Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`pr-10 ${errors.email ? 'border-red-500' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            رقم الهاتف
          </Label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="phone"
              type="tel"
              placeholder="05xxxxxxxx"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="pr-10"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            كلمة المرور *
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="أدخل كلمة المرور"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={errors.password ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري التسجيل...
            </>
          ) : (
            'تسجيل المستخدم'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default UserRegistrationForm;