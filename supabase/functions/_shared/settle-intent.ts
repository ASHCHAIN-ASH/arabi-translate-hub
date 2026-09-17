// تسوية نية الدفع بعد نجاح العملية لدى مزود الدفع — idempotent
// يُستخدم من paylink-webhook و moyasar-verify-payment و moyasar-webhook
import { getUserPhone, notifyWhatsApp } from './whatsapp-notify.ts';

export interface SettleOptions {
  /** رقم العملية لدى المزود */
  transactionNo?: string | null;
  /** اسم المزود لعرضه في الوصف */
  providerLabel?: string;
  /** طريقة الدفع المسجلة في invoice_payments */
  paymentMethod?: string;
}

/**
 * يُسوّي نية الدفع: يحدّث حالتها، ويضيف الرصيد للمحفظة أو يسجّل دفعة الفاتورة،
 * ثم يرسل إشعار واتساب. آمن للتكرار (لا يضاعف العمليات).
 */
export async function settlePaymentIntent(
  admin: any,
  intent: any,
  opts: SettleOptions = {},
): Promise<void> {
  const txNo = opts.transactionNo || intent.external_transaction_no || null;
  const providerLabel = opts.providerLabel || 'دفع إلكتروني';

  await admin.from('payment_intents').update({
    status: 'succeeded',
    succeeded_at: new Date().toISOString(),
    external_transaction_no: txNo,
  }).eq('id', intent.id);

  if (intent.purpose === 'wallet_topup') {
    let { data: wallet } = await admin.from('wallets')
      .select('id').eq('user_id', intent.user_id).maybeSingle();
    if (!wallet) {
      const { data: w } = await admin.from('wallets')
        .insert({ user_id: intent.user_id }).select('id').single();
      wallet = w;
    }

    const { data: existing } = await admin.from('wallet_transactions')
      .select('id').eq('payment_intent_id', intent.id).maybeSingle();
    if (existing) return; // سبق تسويتها

    await admin.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      user_id: intent.user_id,
      type: 'deposit',
      amount: intent.amount,
      description: `شحن المحفظة - ${providerLabel} - عملية ${intent.internal_order_number}`,
      reference_type: 'payment_intent',
      reference_id: intent.id,
      payment_intent_id: intent.id,
    });

    // إشعار واتساب بالإيداع
    try {
      const { data: fresh } = await admin.from('wallets')
        .select('balance').eq('id', wallet.id).maybeSingle();
      const { data: prof } = await admin.from('profiles')
        .select('full_name').eq('id', intent.user_id).maybeSingle();
      const phone = await getUserPhone(admin, intent.user_id);
      if (phone) {
        await notifyWhatsApp(admin, {
          to: phone,
          event_key: 'wallet_credited',
          variables: {
            name: prof?.full_name || 'عميلنا العزيز',
            amount: Number(intent.amount || 0).toLocaleString('ar-SA'),
            reason: `شحن المحفظة - ${providerLabel}`,
            balance: Number(fresh?.balance || 0).toLocaleString('ar-SA'),
            date: new Date().toISOString().slice(0, 10),
            link: 'https://fekrahedu.com/wallet',
          },
          user_id: intent.user_id,
          related_entity_type: 'wallet_topup',
          related_entity_id: intent.id,
        });
      }
    } catch (waError) {
      console.warn('wallet credit whatsapp skipped', waError);
    }
    return;
  }

  if (intent.purpose === 'invoice_payment' && intent.invoice_id) {
    const { data: existing } = await admin.from('invoice_payments')
      .select('id').eq('payment_intent_id', intent.id).maybeSingle();
    if (existing) return;

    await admin.from('invoice_payments').insert({
      invoice_id: intent.invoice_id,
      amount: intent.amount,
      payment_method: opts.paymentMethod || 'card',
      status: 'completed',
      reference_number: txNo,
      notes: `${providerLabel} - عملية ${intent.internal_order_number}`,
      created_by: intent.user_id,
      payment_intent_id: intent.id,
    });

    // بريد + واتساب الفاتورة
    try {
      await admin.functions.invoke('send-invoice-email', {
        body: {
          invoice_id: intent.invoice_id,
          event: 'payment_received',
          amount_paid: Number(intent.amount || 0),
          payment_method: 'card',
          reference_number: txNo,
        },
      });
    } catch (mailError) {
      console.warn('invoice payment email skipped', mailError);
    }
  }
}
