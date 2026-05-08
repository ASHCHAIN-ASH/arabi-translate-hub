import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Info } from 'lucide-react';

/**
 * أي رابط قديم لقسم الطالب (سواء العميل أو الأدمن) يُعاد توجيهه
 * تلقائياً إلى لوحة التحكم المناسبة، مع إشعار عربي واضح للمستخدم.
 */
const LegacyStudentRedirect: React.FC = () => {
  const { user, userRole, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: 'تمت إزالة قسم الطالب',
      description:
        'هذا القسم لم يعد متاحاً. تم تحويلك إلى لوحة التحكم المناسبة.',
      duration: 5000,
    });
  }, [toast]);

  if (loading && !user) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-foreground"
      >
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">جاري إعادة التوجيه...</p>
      </div>
    );
  }

  // غير مسجّل دخول → صفحة تسجيل الدخول الرئيسية
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // أدمن → لوحة الأدمن، عميل → لوحة العميل
  const target = userRole === 'admin' ? '/adminmaster' : '/dashboard';
  return <Navigate to={target} replace />;
};

export default LegacyStudentRedirect;
