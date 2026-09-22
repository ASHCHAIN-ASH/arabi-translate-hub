import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, ShieldCheck, CreditCard, Lock, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/data/legacy/client';
import { cn } from '@/lib/utils';

const MOYASAR_CSS = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.css';
const MOYASAR_JS = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.js';

function loadAsset(kind: 'css' | 'js', href: string) {
  return new Promise<void>((resolve, reject) => {
    const selector = kind === 'css' ? `link[href="${href}"]` : `script[src="${href}"]`;
    const existing = document.querySelector(selector) as HTMLElement | null;
    if (existing) {
      if (existing.dataset.loaded === '1') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('asset_failed')));
      return;
    }
    const el = kind === 'css'
      ? Object.assign(document.createElement('link'), { rel: 'stylesheet', href })
      : Object.assign(document.createElement('script'), { src: href, async: true });
    el.addEventListener('load', () => { (el as HTMLElement).dataset.loaded = '1'; resolve(); });
    el.addEventListener('error', () => reject(new Error('asset_failed')));
    document.head.appendChild(el);
  });
}

const fmt = (n: number) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface PublicInvoice {
  invoice_number: string;
  customer_name: string | null;
  currency: string;
  status: string;
  due_date: string | null;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  tax_enabled: boolean;
  tax_rate: number;
  tax_inclusive: boolean;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
}

const PublicInvoicePay: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [formReady, setFormReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fnErr } = await supabase.functions.invoke('invoice-public-pay', {
          body: { action: 'intent', token },
        });
        if (cancelled) return;
        if (fnErr && !data) throw new Error('تعذّر فتح رابط الدفع');
        if (data?.invoice) setInvoice(data.invoice as PublicInvoice);
        if (!data?.publishable_key) {
          throw new Error(data?.message || 'تعذّر تجهيز عملية الدفع');
        }

        await Promise.all([loadAsset('css', MOYASAR_CSS), loadAsset('js', MOYASAR_JS)]);
        if (cancelled) return;
        const Moyasar = (window as any).Moyasar;
        if (!Moyasar) throw new Error('تعذّر تحميل بوابة الدفع');
        if (containerRef.current) containerRef.current.innerHTML = '';
        Moyasar.init({
          element: containerRef.current,
          amount: data.amount_halalas,
          currency: data.currency || 'SAR',
          description: data.description,
          publishable_api_key: data.publishable_key,
          callback_url: data.callback_url,
          methods: ['creditcard', 'applepay', 'stcpay'],
          apple_pay: {
            country: 'SA',
            label: 'FekrahEdu',
            validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
          },
          language: 'ar',
          metadata: { order: data.internal_order_number },
        });
        setFormReady(true);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'تعذّر تجهيز عملية الدفع');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div dir="rtl" className="min-h-screen bg-muted/30 py-8 px-3 sm:px-4">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <img src="/fekrah-logo.jpg" alt="FekrahEdu" className="h-10 w-10 rounded-lg object-cover" />
          <span className="text-lg font-extrabold">فِكرة — FekrahEdu</span>
        </div>

        <Card className="overflow-hidden border-border/60 shadow-lg">
          <div className="bg-gradient-to-l from-primary to-primary/80 px-5 py-4 text-primary-foreground">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-bold">
                <FileText className="h-5 w-5" /> سداد فاتورة
              </div>
              {invoice && <Badge variant="secondary" dir="ltr">{invoice.invoice_number}</Badge>}
            </div>
            {invoice?.customer_name && (
              <p className="mt-1 text-sm opacity-90">العميل: {invoice.customer_name}</p>
            )}
          </div>

          <CardContent className="space-y-4 p-5">
            {loading && (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> جارٍ تحميل الفاتورة...
              </div>
            )}

            {invoice && (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">الإجمالي</span>
                  <span className="font-bold" dir="ltr">{fmt(invoice.total_amount)} ر.س</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">المسدد</span>
                  <span dir="ltr">{fmt(invoice.paid_amount)} ر.س</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2">
                  <span className="font-bold">المبلغ المستحق</span>
                  <span className="text-lg font-extrabold text-primary" dir="ltr">{fmt(invoice.remaining_amount)} ر.س</span>
                </div>
                {invoice.due_date && (
                  <p className="mt-2 text-xs text-muted-foreground">تاريخ الاستحقاق: <span dir="ltr">{invoice.due_date}</span></p>
                )}
              </div>
            )}

            {invoice && invoice.remaining_amount <= 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-5 w-5" /> هذه الفاتورة مدفوعة بالكامل — لا حاجة لأي إجراء.
              </div>
            )}

            {error && invoice?.remaining_amount !== 0 && (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!error && (
              <>
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CreditCard className="h-4 w-4 text-primary" /> الدفع الفوري بالبطاقة
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> دفع آمن ومشفّر
                  </div>
                </div>
                <div ref={containerRef} className={cn('mysr-form', !formReady && 'hidden')} />
              </>
            )}

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" />
              لا يتم تخزين بيانات بطاقتك لدينا — تُعالج مباشرة لدى بوابة الدفع المرخّصة.
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          للاستفسار: واتساب <span dir="ltr">0593799355</span> • info@fekrahedu.com
        </p>
      </div>
    </div>
  );
};

export default PublicInvoicePay;
