import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/data/legacy/client';
import { CheckCircle, AlertCircle, MailX, RefreshCw } from 'lucide-react';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'valid' | 'already' | 'invalid' | 'success' | 'error'>('loading');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }
    
    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`, {
          headers: { apikey: anonKey },
        });
        const data = await res.json();
        if (data.valid === true) setStatus('valid');
        else if (data.reason === 'already_unsubscribed') setStatus('already');
        else setStatus('invalid');
      } catch { setStatus('invalid'); }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', {
        body: { token },
      });
      if (error) throw error;
      const result = typeof data === 'string' ? JSON.parse(data) : data;
      if (result.success) setStatus('success');
      else if (result.reason === 'already_unsubscribed') setStatus('already');
      else setStatus('error');
    } catch { setStatus('error'); } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          {status === 'loading' && <RefreshCw className="w-10 h-10 animate-spin text-primary mx-auto" />}
          
          {status === 'valid' && (
            <>
              <MailX className="w-12 h-12 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-bold">إلغاء الاشتراك</h2>
              <p className="text-muted-foreground">هل تريد إلغاء اشتراكك في رسائل البريد الإلكتروني؟</p>
              <Button onClick={handleUnsubscribe} disabled={submitting} className="w-full">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin ml-2" /> : null}
                تأكيد إلغاء الاشتراك
              </Button>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-bold">تم إلغاء الاشتراك</h2>
              <p className="text-muted-foreground">لن تتلقى المزيد من رسائل البريد الإلكتروني منا.</p>
            </>
          )}

          {status === 'already' && (
            <>
              <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-bold">تم الإلغاء مسبقاً</h2>
              <p className="text-muted-foreground">تم إلغاء اشتراكك بالفعل.</p>
            </>
          )}

          {status === 'invalid' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold">رابط غير صالح</h2>
              <p className="text-muted-foreground">الرابط غير صالح أو منتهي الصلاحية.</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold">حدث خطأ</h2>
              <p className="text-muted-foreground">يرجى المحاولة مرة أخرى لاحقاً.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
