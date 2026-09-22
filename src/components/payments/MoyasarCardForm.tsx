import React, { useEffect, useRef, useState } from 'react';
import { Loader2, ShieldCheck, CreditCard, Lock } from 'lucide-react';
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

export interface MoyasarCardFormProps {
  purpose: 'wallet_topup' | 'invoice_payment' | 'contract_payment' | 'research_publication_payment';
  amount: number;
  invoiceId?: string;
  serviceOrderId?: string;
  contractId?: string;
  researchPublicationId?: string;
  note?: string;
  /** يُستدعى عند تعذّر تجهيز النموذج */
  onError?: (message: string) => void;
  className?: string;
}

/**
 * نموذج الدفع الفوري بالبطاقة (مُيسّر) — مضمّن داخل الصفحة بدون مغادرة الموقع.
 * يُنشئ نية دفع على الخادم أولاً (المبلغ يُحتسب من الخادم) ثم يُهيّئ نموذج البطاقة.
 */
const MoyasarCardForm: React.FC<MoyasarCardFormProps> = ({
  purpose, amount, invoiceId, serviceOrderId, contractId,
  researchPublicationId, note, onError, className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initKey = `${purpose}-${amount}-${invoiceId || ''}-${researchPublicationId || ''}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        if (!amount || amount <= 0) throw new Error('يرجى تحديد مبلغ صحيح أولاً');

        const { data, error: fnError } = await supabase.functions.invoke('moyasar-create-intent', {
          body: {
            purpose,
            amount,
            invoice_id: invoiceId,
            service_order_id: serviceOrderId,
            contract_id: contractId,
            research_publication_id: researchPublicationId,
            note,
            return_url: `${window.location.origin}/payment/return`,
          },
        });
        if (fnError) throw new Error('تعذّر تجهيز عملية الدفع، يرجى المحاولة مرة أخرى');
        if (!data?.publishable_key) throw new Error(data?.message || 'تعذّر تجهيز عملية الدفع');
        if (cancelled) return;

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
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        const msg = e?.message || 'تعذّر تجهيز عملية الدفع';
        setError(msg);
        setLoading(false);
        onError?.(msg);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initKey]);

  return (
    <div className={cn('space-y-4', className)} dir="rtl">
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CreditCard className="h-4 w-4 text-primary" />
          الدفع الفوري بالبطاقة
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          دفع آمن ومشفّر
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          جارٍ تجهيز نموذج الدفع الآمن...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div ref={containerRef} className={cn('mysr-form', (loading || error) && 'hidden')} />

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <Lock className="h-3 w-3" />
        لا يتم تخزين بيانات بطاقتك لدينا — تُعالج مباشرة لدى بوابة الدفع المرخّصة.
      </p>
    </div>
  );
};

export default MoyasarCardForm;
