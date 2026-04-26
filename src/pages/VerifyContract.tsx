import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  FileText,
  Calendar,
  User,
  Hash,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';

interface VerifiedContract {
  contract_number: string;
  title: string;
  status: string;
  signed_at: string | null;
  client_full_name: string | null;
  total_amount: number | null;
  currency: string | null;
  service_name: string | null;
  created_at: string;
}

/**
 * صفحة عامة للتحقق من صحة عقد عبر QR / verification_token.
 * لا تكشف بيانات حساسة — فقط معلومات التحقق الأساسية.
 */
const VerifyContract = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<VerifiedContract | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('رابط غير صالح');
        setLoading(false);
        return;
      }
      const { data, error: dbError } = await supabase
        .from('contracts')
        .select(
          'contract_number, title, status, signed_at, client_full_name, total_amount, currency, service_name, created_at'
        )
        .eq('verification_token', token)
        .maybeSingle();

      if (dbError || !data) {
        setError('لم يُعثر على العقد. الرابط قد يكون غير صحيح أو منتهي الصلاحية.');
      } else {
        setContract(data as VerifiedContract);
      }
      setLoading(false);
    };
    verify();
  }, [token]);

  return (
    <>
      <Helmet>
        <title>التحقق من صحة العقد | ماستر إيدو باث</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-8 shadow-2xl border-primary/10">
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-4">جاري التحقق من صحة العقد...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-destructive mb-2">عقد غير صالح</h1>
                <p className="text-muted-foreground">{error}</p>
                <Button asChild className="mt-6">
                  <Link to="/">العودة للصفحة الرئيسية</Link>
                </Button>
              </div>
            ) : contract ? (
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"
                >
                  <ShieldCheck className="w-10 h-10 text-emerald-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-center mb-1">عقد موثّق وأصلي</h1>
                <p className="text-center text-muted-foreground text-sm mb-6">
                  تم التحقق من هذا العقد عبر منصة ماستر إيدو باث
                </p>

                <div className="space-y-3 bg-muted/30 rounded-xl p-5">
                  <Field
                    icon={Hash}
                    label="رقم العقد"
                    value={contract.contract_number}
                  />
                  <Field icon={FileText} label="عنوان العقد" value={contract.title} />
                  {contract.client_full_name && (
                    <Field
                      icon={User}
                      label="اسم العميل"
                      value={contract.client_full_name}
                    />
                  )}
                  {contract.signed_at && (
                    <Field
                      icon={Calendar}
                      label="تاريخ التوقيع"
                      value={new Date(contract.signed_at).toLocaleDateString('en-GB')}
                    />
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">الحالة:</span>
                    <Badge
                      variant={contract.status === 'signed' ? 'default' : 'secondary'}
                      className={
                        contract.status === 'signed'
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                          : ''
                      }
                    >
                      {contract.status === 'signed' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 ml-1" />
                          موقّع
                        </>
                      ) : (
                        contract.status
                      )}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-6">
                  تم التحقق في {new Date().toLocaleString('en-GB')}
                </p>
              </div>
            ) : null}
          </Card>
        </motion.div>
      </div>
    </>
  );
};

const Field = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null;
}) => (
  <div className="flex items-start gap-3 text-sm">
    <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold truncate">{value ?? '—'}</div>
    </div>
  </div>
);

export default VerifyContract;
