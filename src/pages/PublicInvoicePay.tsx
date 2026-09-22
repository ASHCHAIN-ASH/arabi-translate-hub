import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, FileText, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/data/legacy/client';

/**
 * رابط الفاتورة المختصر: يحوّل العميل إلى تسجيل الدخول ثم صفحة سداد الفاتورة داخل الموقع.
 */
const PublicInvoicePay: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error: fnErr } = await supabase.functions.invoke('invoice-public-pay', {
          body: { action: 'get', token },
        });
        if (cancelled) return;
        const invoiceId = data?.invoice?.id;
        if (fnErr || !invoiceId) {
          throw new Error(data?.message || 'رابط الفاتورة غير صالح أو منتهي');
        }

        const target = `/invoices/${invoiceId}/pay`;
        const { data: sessionData } = await supabase.auth.getSession();
        if (cancelled) return;

        if (sessionData?.session) {
          navigate(target, { replace: true });
        } else {
          navigate(`/login?redirect=${encodeURIComponent(target)}`, { replace: true });
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'تعذّر فتح الفاتورة');
      }
    })();
    return () => { cancelled = true; };
  }, [token, navigate]);

  return (
    <div dir="rtl" className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-border/60 shadow-lg">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary">
            <img src="/fekrah-logo.jpg" alt="FekrahEdu" className="h-10 w-10 rounded-lg object-cover" />
            <span className="text-lg font-extrabold">فِكرة — FekrahEdu</span>
          </div>

          {!error ? (
            <>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> جارٍ تحويلك إلى صفحة سداد الفاتورة...
              </div>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <LogIn className="h-3.5 w-3.5" /> يلزم تسجيل الدخول لإتمام السداد بأمان
              </p>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive text-right">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
              <Button onClick={() => navigate('/login')} className="w-full gap-2">
                <FileText className="h-4 w-4" /> الدخول إلى حسابي
              </Button>
            </>
          )}

          <p className="text-xs text-muted-foreground">
            للاستفسار: واتساب <span dir="ltr">0593799355</span> • info@fekrahedu.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicInvoicePay;
