import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Plus, FileText, Clock, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import {
  FINANCING_DISCLAIMER_AR,
  FINANCING_STATUS_LABELS_AR,
  FINANCING_MIN_AMOUNT,
} from '@/lib/financing';

interface FinancingApp {
  id: string;
  total_amount: number;
  down_payment: number;
  monthly_installment: number;
  duration_months: number;
  status: string;
  created_at: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 2 }).format(n);

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (['approved', 'active', 'completed'].includes(status)) return 'default';
  if (['rejected', 'cancelled', 'overdue'].includes(status)) return 'destructive';
  if (['draft'].includes(status)) return 'outline';
  return 'secondary';
};

const FinancingHome: React.FC = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<FinancingApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Master PayLater — التمويل | منصة ماستر';
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('financing_applications')
        .select('id,total_amount,down_payment,monthly_installment,duration_months,status,created_at')
        .order('created_at', { ascending: false });
      if (!error && data) setApps(data as FinancingApp[]);
      setLoading(false);
    })();
  }, [user]);

  return (
    <ClientLayout>
      <div dir="rtl" className="space-y-6">
        {/* Hero */}
        <Card
          className="relative overflow-hidden border-0 shadow-xl"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.85) 50%, hsl(var(--accent) / 0.9) 100%)',
            color: 'hsl(var(--primary-foreground))',
          }}
        >
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative p-6 md:p-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/25">
                <CreditCard className="h-7 w-7" />
              </div>
              <div>
                <div className="text-xs opacity-80">Master PayLater</div>
                <h1 className="text-2xl md:text-3xl font-bold">تمويل ماستر الذكي</h1>
              </div>
            </div>
            <p className="text-sm md:text-base opacity-95 max-w-2xl leading-relaxed mb-5">
              قسّط طلباتك التي تتجاوز {fmt(FINANCING_MIN_AMOUNT)} ر.س على 12 شهرًا بأقساط متساوية،
              ادفع الدفعة الأولى فقط — وبعد الموافقة يُضاف الرصيد إلى محفظتك داخل المنصة فورًا.
            </p>
            <div className="flex items-start gap-2 rounded-lg bg-white/10 backdrop-blur p-3 mb-5 ring-1 ring-white/20 max-w-2xl">
              <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed">{FINANCING_DISCLAIMER_AR}</p>
            </div>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold shadow-md">
              <Link to="/financing/new">
                <Plus className="ml-2 h-4 w-4" />
                طلب تمويل جديد
              </Link>
            </Button>
          </div>
        </Card>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { i: 1, t: 'إرسال الطلب', d: 'املأ بياناتك ووثّق هويتك وكشف حسابك' },
            { i: 2, t: 'مراجعة الإدارة', d: 'تقييم الأهلية والموافقة' },
            { i: 3, t: 'توقيع العقد + الدفعة الأولى', d: 'وقّع إلكترونيًا وادفع 20%' },
            { i: 4, t: 'تفعيل الرصيد', d: 'يُضاف الرصيد لمحفظتك ويُستخدم لسداد الطلب' },
          ].map((s) => (
            <Card key={s.i} className="p-4 border-border/60">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-3">
                {s.i}
              </div>
              <div className="font-semibold mb-1 text-sm">{s.t}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.d}</p>
            </Card>
          ))}
        </div>

        {/* Applications list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">طلباتي التمويلية</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/financing/new">
                <Plus className="ml-1 h-4 w-4" /> طلب جديد
              </Link>
            </Button>
          </div>

          {loading ? (
            <Card className="p-8 text-center text-muted-foreground">جاري التحميل…</Card>
          ) : apps.length === 0 ? (
            <Card className="p-10 text-center border-dashed">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
              <h3 className="font-semibold mb-1">لا توجد طلبات تمويل بعد</h3>
              <p className="text-sm text-muted-foreground mb-4">
                ابدأ أول طلب تمويل لك عبر Master PayLater
              </p>
              <Button asChild>
                <Link to="/financing/new">إنشاء طلب جديد</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apps.map((a) => (
                <Card key={a.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        رقم الطلب: {a.id.slice(0, 8)}
                      </div>
                      <div className="font-bold">{fmt(a.total_amount)} ر.س</div>
                    </div>
                    <Badge variant={statusVariant(a.status)}>
                      {FINANCING_STATUS_LABELS_AR[a.status] ?? a.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                    <div className="rounded-md bg-muted/50 p-2">
                      <div className="text-muted-foreground mb-0.5">الدفعة الأولى</div>
                      <div className="font-semibold">{fmt(a.down_payment)}</div>
                    </div>
                    <div className="rounded-md bg-muted/50 p-2">
                      <div className="text-muted-foreground mb-0.5">القسط</div>
                      <div className="font-semibold">{fmt(a.monthly_installment)}</div>
                    </div>
                    <div className="rounded-md bg-muted/50 p-2">
                      <div className="text-muted-foreground mb-0.5">المدة</div>
                      <div className="font-semibold">{a.duration_months} شهر</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(a.created_at).toLocaleDateString('ar-SA')}
                    </span>
                    {a.status === 'approved' || a.status === 'active' ? (
                      <span className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="h-3 w-3" /> فعّال
                      </span>
                    ) : a.status === 'rejected' ? (
                      <span className="flex items-center gap-1 text-destructive">
                        <XCircle className="h-3 w-3" /> مرفوض
                      </span>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default FinancingHome;
