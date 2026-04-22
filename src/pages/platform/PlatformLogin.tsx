import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePlatformAuth } from '@/components/auth/PlatformAuthProvider';
import { toast } from 'sonner';
import { triggerLoginWelcome } from '@/components/LoginWelcomeOverlay';

export default function PlatformLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user } = usePlatformAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    const redirectPath = user.role === 'admin' ? '/platform/admin/dashboard' : '/platform/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      triggerLoginWelcome();
      const redirectPath = user?.role === 'admin' ? '/platform/admin/dashboard' : '/platform/dashboard';
      navigate(redirectPath);
    } else {
      setError(result.error || 'حدث خطأ أثناء تسجيل الدخول');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بيانات تسجيل الدخول للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-right"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-right"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
          
          <div className="mt-4 space-y-2 text-center text-sm">
            <Link 
              to="/platform/forgot-password" 
              className="text-primary hover:underline"
            >
              نسيت كلمة المرور؟
            </Link>
            <div>
              ليس لديك حساب؟{' '}
              <Link 
                to="/platform/register" 
                className="text-primary hover:underline"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}