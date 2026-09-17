import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { authService } from '@/data';
import { Button } from '@/components/ui/button';

type State = 'loading' | 'success' | 'error';

const AuthConfirm = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<State>('loading');
  const [message, setMessage] = useState('');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const tokenHash = params.get('token_hash');
    const type = (params.get('type') || 'magiclink') as 'magiclink' | 'recovery' | 'signup' | 'email_change';
    const next = params.get('next') || '/dashboard';

    if (!tokenHash) {
      setState('error');
      setMessage('الرابط غير مكتمل. يرجى فتح الرابط كما وصلك في البريد.');
      return;
    }

    (async () => {
      const { error } = await authService.verifyEmailToken(tokenHash, type);
      if (error) {
        setState('error');
        setMessage('انتهت صلاحية الرابط أو سبق استخدامه. يمكنك طلب رسالة جديدة من صفحة الدخول.');
        return;
      }
      setState('success');
      setMessage(
        type === 'recovery'
          ? 'تم التحقق بنجاح، سيتم تحويلك لتعيين كلمة مرور جديدة.'
          : 'تم تفعيل بريدك الإلكتروني بنجاح، مرحبًا بك في FekrahEdu.',
      );
      setTimeout(() => navigate(next, { replace: true }), 2200);
    })();
  }, [params, navigate]);

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg animate-fade-in">
        {state === 'loading' && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h1 className="mt-5 text-xl font-bold">جارٍ التحقق من الرابط…</h1>
            <p className="mt-2 text-sm text-muted-foreground">لحظات من فضلك</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary animate-scale-in" />
            <h1 className="mt-5 text-xl font-bold">تم التحقق بنجاح</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{message}</p>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="mx-auto h-14 w-14 text-destructive" />
            <h1 className="mt-5 text-xl font-bold">تعذّر إتمام التحقق</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{message}</p>
            <Button asChild className="mt-6 w-full">
              <Link to="/login">العودة إلى تسجيل الدخول</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthConfirm;
