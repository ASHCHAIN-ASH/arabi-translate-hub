import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">غير مصرح لك</CardTitle>
          <CardDescription>
            ليس لديك صلاحية للوصول إلى هذه الصفحة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            يرجى التأكد من تسجيل الدخول بالحساب المناسب أو الاتصال بالإدارة للحصول على الصلاحيات المطلوبة.
          </p>
          
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate('/')}>
              العودة إلى الصفحة الرئيسية
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login?type=client')}
            >
              تسجيل دخول العميل
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login?type=admin')}
            >
              تسجيل دخول الإدارة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;