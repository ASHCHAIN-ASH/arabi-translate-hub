import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecordInvoicePaymentBody {
  invoice_id?: string;
  payment_method?: 'wallet' | 'bank_transfer';
  payment_date?: string;
  reference_number?: string | null;
  notes?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    const authHeader = req.headers.get('Authorization') || '';
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();

    if (userError || !userData?.user) {
      return jsonResponse({ error: 'unauthorized', message: 'يجب تسجيل الدخول أولاً' }, 401);
    }

    const user = userData.user;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const body = (await req.json().catch(() => ({}))) as RecordInvoicePaymentBody;

    if (!body.invoice_id || !body.payment_method) {
      return jsonResponse({ error: 'invalid_request', message: 'بيانات الدفع غير مكتملة' }, 400);
    }

    if (!['wallet', 'bank_transfer'].includes(body.payment_method)) {
      return jsonResponse({ error: 'invalid_payment_method', message: 'طريقة الدفع غير مدعومة' }, 400);
    }

    const { data: invoice, error: invoiceError } = await admin
      .from('invoices')
      .select('id, user_id, total_amount, paid_amount, status')
      .eq('id', body.invoice_id)
      .maybeSingle();

    if (invoiceError) throw invoiceError;

    if (!invoice || invoice.user_id !== user.id) {
      return jsonResponse({ error: 'invoice_not_found', message: 'الفاتورة غير موجودة أو لا تملك صلاحية الدفع' }, 404);
    }

    const remaining = Math.max(Number(invoice.total_amount || 0) - Number(invoice.paid_amount || 0), 0);

    if (remaining <= 0 || invoice.status === 'paid') {
      return jsonResponse({ error: 'invoice_already_paid', message: 'هذه الفاتورة مدفوعة بالفعل' }, 409);
    }

    if (body.payment_method === 'wallet') {
      const { data: wallet, error: walletError } = await admin
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletError) throw walletError;

      if (!wallet) {
        return jsonResponse({ error: 'wallet_not_found', message: 'لم يتم العثور على المحفظة' }, 404);
      }

      if (Number(wallet.balance || 0) < remaining) {
        return jsonResponse({ error: 'insufficient_balance', message: 'رصيد المحفظة غير كافٍ' }, 400);
      }
    }

    if (body.payment_method === 'bank_transfer') {
      const { data: existingPending, error: pendingError } = await admin
        .from('invoice_payments')
        .select('id, status, amount')
        .eq('invoice_id', body.invoice_id)
        .eq('created_by', user.id)
        .eq('payment_method', 'bank_transfer')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pendingError) throw pendingError;

      if (existingPending) {
        return jsonResponse({
          ok: true,
          payment_id: existingPending.id,
          status: 'pending',
          amount: Number(existingPending.amount || remaining),
          existing: true,
        });
      }
    }

    const paymentStatus = body.payment_method === 'wallet' ? 'completed' : 'pending';
    const paymentNotes = body.notes?.trim()
      || (body.payment_method === 'wallet' ? 'دفع من المحفظة' : 'تحويل بنكي بانتظار المراجعة');

    const { data: payment, error: insertError } = await admin
      .from('invoice_payments')
      .insert({
        invoice_id: body.invoice_id,
        amount: remaining,
        payment_method: body.payment_method,
        payment_date: body.payment_date || new Date().toISOString().split('T')[0],
        status: paymentStatus,
        reference_number: body.reference_number?.trim() || null,
        notes: paymentNotes,
        created_by: user.id,
      })
      .select('id, status, amount')
      .single();

    if (insertError) throw insertError;

    // Invoice lifecycle email (non-blocking): receipt for a completed wallet payment,
    // acknowledgement for a bank transfer awaiting review.
    try {
      const { data: refreshed } = await admin
        .from('invoices')
        .select('customer_email, remaining_amount, status')
        .eq('id', body.invoice_id)
        .maybeSingle();

      if (refreshed?.customer_email) {
        const paymentDate = body.payment_date || new Date().toISOString().split('T')[0];
        await admin.functions.invoke('send-invoice-email', {
          body: {
            invoice_id: body.invoice_id,
            event: 'payment_received',
            amount_paid: Number(payment.amount || remaining),
            payment_method: body.payment_method,
            payment_date: paymentDate,
            reference_number: body.reference_number?.trim() || null,
          },
        });

        if (paymentStatus === 'completed' && Number(refreshed.remaining_amount ?? 0) <= 0) {
          await admin.functions.invoke('send-invoice-email', {
            body: { invoice_id: body.invoice_id, event: 'paid' },
          });
        }
      }
    } catch (emailError) {
      console.warn('invoice payment email skipped', emailError);
    }

    // إشعار واتساب بالسداد من المحفظة
    try {
      if (body.payment_method === 'wallet') {
        const { data: w } = await admin
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .maybeSingle();
        const phone = invoice.customer_phone || (await getUserPhone(admin, user.id));
        if (phone) {
          await notifyWhatsApp(admin, {
            to: phone,
            event_key: 'wallet_payment_made',
            variables: {
              name: invoice.customer_name ?? 'عميلنا العزيز',
              invoice_no: invoice.invoice_number,
              amount: Number(payment.amount || remaining).toLocaleString('ar-SA'),
              balance: Number(w?.balance || 0).toLocaleString('ar-SA'),
              date: body.payment_date || new Date().toISOString().split('T')[0],
              link: `https://fekrahedu.com/invoices/${body.invoice_id}`,
            },
            user_id: user.id,
            related_entity_type: 'invoice',
            related_entity_id: body.invoice_id,
          });
        }
      }
    } catch (waError) {
      console.warn('wallet payment whatsapp skipped', waError);
    }

    return jsonResponse({
      ok: true,
      payment_id: payment.id,
      status: payment.status,
      amount: Number(payment.amount || remaining),
    });
  } catch (error: any) {
    return jsonResponse(
      {
        error: 'internal_error',
        message: error?.message || 'تعذر تسجيل الدفعة حالياً',
      },
      500,
    );
  }
});

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}