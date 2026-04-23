import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  computeFinancingPreview,
  isEligibleForFinancing,
  FINANCING_DISCLAIMER_AR,
  FINANCING_MIN_AMOUNT,
} from '@/lib/financing';

interface FinancingCTAProps {
  amount: number;
  orderId?: string;
  invoiceId?: string;
  className?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 2 }).format(n);

const FinancingCTA: React.FC<FinancingCTAProps> = ({ amount, orderId, invoiceId, className }) => {
  if (!isEligibleForFinancing(amount)) return null;
  const p = computeFinancingPreview(amount);

  const params = new URLSearchParams();
  params.set('amount', String(amount));
  if (orderId) params.set('orderId', orderId);
  if (invoiceId) params.set('invoiceId', invoiceId);

  return (
    <Card
      dir="rtl"
      className={`relative overflow-hidden border-0 shadow-xl ${className ?? ''}`}
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.85) 50%, hsl(var(--accent) / 0.9) 100%)',
        color: 'hsl(var(--primary-foreground))',
      }}
    >
      <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

      <div className="relative p-6 md:p-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs opacity-80 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Master PayLater
            </div>
            <h3 className="text-lg md:text-xl font-bold">فعّل التمويل الآن</h3>
          </div>
        </div>

        <p className="text-sm opacity-95 leading-relaxed mb-5">
          ادفع الدفعة الأولى فقط، وقسّط الباقي على {p.duration} شهرًا بأقساط متساوية —
          متاح للطلبات من {fmt(FINANCING_MIN_AMOUNT)} ر.س فأكثر.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-3 text-center ring-1 ring-white/15">
            <div className="text-[11px] opacity-80 mb-1">الدفعة الأولى</div>
            <div className="font-bold">{fmt(p.downPayment)} ر.س</div>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-3 text-center ring-1 ring-white/15">
            <div className="text-[11px] opacity-80 mb-1">القسط الشهري</div>
            <div className="font-bold">{fmt(p.monthly)} ر.س</div>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-3 text-center ring-1 ring-white/15">
            <div className="text-[11px] opacity-80 mb-1">المدة</div>
            <div className="font-bold">{p.duration} شهر</div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-white/10 backdrop-blur p-3 mb-5 ring-1 ring-white/15">
          <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 opacity-90" />
          <p className="text-[11px] leading-relaxed opacity-95">{FINANCING_DISCLAIMER_AR}</p>
        </div>

        <Button
          asChild
          size="lg"
          className="w-full bg-white text-primary hover:bg-white/90 font-bold shadow-md"
        >
          <Link to={`/financing/new?${params.toString()}`}>
            ابدأ طلب التمويل
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default FinancingCTA;
