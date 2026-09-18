import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/SimpleAuthProvider';
import { authService } from '@/data';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [linkInvalid, setLinkInvalid] = useState(false);

  const { resetPassword, session, loading: authLoading } = useAuth();
  const tokenHash = searchParams.get('token_hash') || searchParams.get('token');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (tokenHash) {
        const { error: verifyError } = await authService.verifyEmailToken(tokenHash, 'recovery');
        if (cancelled) return;
        setLinkInvalid(Boolean(verifyError));
        setChecking(false);
        return;
      }

      if (authLoading) return;
      if (session) {
        setLinkInvalid(false);
        setChecking(false);
        return;
      }

      // امنح الجلسة فرصة للوصول بعد التحقق من الرابط
      setTimeout(() => {
        if (cancelled) return;
        setLinkInvalid(true);
        setChecking(false);
      }, 1200);
    })();

    return () => {
      cancelled = true;
    };
  }, [tokenHash, authLoading, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      setLoading(false);
      return;
    }

    const result = await resetPassword(tokenHash ?? '', formData.password);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      setSuccess(true);
      toast.success('تم تحديث كلمة المرور بنجاح');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">تم تحديث كلمة المرور</CardTitle>
            <CardDescription>
              تم تحديث كلمة المرور بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">رابط غير صحيح</CardTitle>
            <CardDescription>
              رمز إعادة التعيين غير صحيح أو منتهي الصلاحية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                يرجى طلب رابط إعادة تعيين كلمة المرور جديد
              </p>
              <Button onClick={() => navigate('/auth/forgot-password')} className="w-full">
                طلب رابط جديد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription>
            أدخل كلمة المرور الجديدة
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
              <Label htmlFor="password">كلمة المرور الجديدة</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="text-right"
                placeholder="أدخل كلمة المرور الجديدة"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="text-right"
                placeholder="أعد إدخال كلمة المرور"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}