import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/SimpleAuthProvider';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await forgotPassword(email);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      setSuccess(true);
      toast.success('تم إرسال رسالة إعادة تعيين كلمة المرور');
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
            <CardTitle className="text-2xl font-bold">تم إرسال الرسالة</CardTitle>
            <CardDescription>
              تفقد بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                ستتلقى رسالة إلكترونية تحتوي على رابط لإعادة تعيين كلمة المرور خلال بضع دقائق
              </p>
              <Link to="/login">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  العودة إلى تسجيل الدخول
                </Button>
              </Link>
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
          <CardTitle className="text-2xl font-bold">نسيت كلمة المرور؟</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
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
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-primary hover:underline flex items-center justify-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}