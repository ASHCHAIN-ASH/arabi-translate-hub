import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'client';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      
      // Redirect based on user type
      if (type === 'admin') {
        navigate('/adminmaster/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'فشل في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = type === 'admin';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {isAdmin ? (
                <Shield className="h-6 w-6 text-primary" />
              ) : (
                <Users className="h-6 w-6 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isAdmin ? 'تسجيل دخول الإدارة' : 'تسجيل دخول العميل'}
            </CardTitle>
            <CardDescription>
              {isAdmin 
                ? 'قم بتسجيل الدخول للوصول إلى لوحة الإدارة'
                : 'قم بتسجيل الدخول للوصول إلى حسابك'
              }
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
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                تسجيل الدخول
              </Button>
            </form>
            
            {!isAdmin && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ليس لديك حساب؟{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => navigate('/register')}
                  >
                    إنشاء حساب جديد
                  </Button>
                </p>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                العودة إلى الصفحة الرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;