import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Home, ArrowRight } from 'lucide-react';

export default function PlatformUnauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">غير مخول للوصول</CardTitle>
          <CardDescription>
            ليس لديك صلاحية للوصول إلى هذه الصفحة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            يرجى التواصل مع المشرف إذا كنت تعتقد أن هذا خطأ
          </p>
          
          <div className="flex flex-col gap-3">
            <Link to="/platform/dashboard">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                العودة إلى لوحة التحكم
              </Button>
            </Link>
            
            <Link to="/platform/login">
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                تسجيل الخروج
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}