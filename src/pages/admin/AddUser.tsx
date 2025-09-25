import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserRegistrationForm from '@/components/UserRegistrationForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddUser = () => {
  const navigate = useNavigate();

  const handleSuccessfulRegistration = () => {
    // التوجه إلى صفحة إدارة المستخدمين بعد التسجيل الناجح
    setTimeout(() => {
      navigate('/adminmaster/users');
    }, 2000);
  };

  return (
    <AdminLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">إضافة مستخدم جديد</h1>
                <p className="text-sm text-muted-foreground">
                  تسجيل مستخدم جديد في النظام
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/adminmaster/users')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للقائمة
            </Button>
          </div>
        </Card>

        {/* Registration Form */}
        <UserRegistrationForm onSuccess={handleSuccessfulRegistration} />

        {/* Instructions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-foreground">تعليمات:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• الاسم والبريد الإلكتروني مطلوبان</li>
            <li>• كلمة المرور يجب أن تكون 6 أحرف على الأقل</li>
            <li>• رقم الهاتف اختياري</li>
            <li>• سيتم إضافة المستخدم كعميل بحالة نشطة</li>
            <li>• سيظهر المستخدم الجديد فوراً في قائمة المستخدمين</li>
          </ul>
        </Card>
      </motion.div>
    </AdminLayout>
  );
};

export default AddUser;