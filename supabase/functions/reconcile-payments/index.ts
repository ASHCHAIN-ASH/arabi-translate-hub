// reconcile-payments
// مهمة Reconciliation: تقارن payment_intents الداخلية مع حالة Paylink الفعلية
// تشغيل يدوي من لوحة Admin أو تلقائي عبر pg_cron يومياً
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { getPaylinkOrderByOrderNumber, mapPaylinkStatus } from '../_shared/paylink-adapter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));
    const runType: 'manual' | 'scheduled' = body.run_type || 'scheduled';
    const lookbackHours: number = Math.min(Math.max(Number(body.lookback_hours || 48), 1), 720);

    // Open run
    const { data: run, error: runErr } = await admin.from('payment_reconciliation_runs')
      .insert({ provider: 'paylink', run_type: runType, status: 'running' })
      .select().single();
    if (runErr) throw runErr;

    // Pull intents that are non-terminal OR succeeded recently (to confirm)
    const since = new Date(Date.now() - lookbackHours * 3600_000).toISOString();
    const { data: intents } = await admin
      .from('payment_intents')
      .select('id, internal_order_number, external_transaction_no, amount, status, purpose, user_id, invoice_id')
      .gte('created_at', since)
      .in('status', ['created', 'pending', 'processing', 'succeeded', 'failed'])
      .limit(500);

    let checked = 0, matched = 0, mismatched = 0;
    const items: any[] = [];

    for (const pi of intents || []) {
      checked++;
      try {
        const remote = await getPaylinkOrderByOrderNumber(pi.internal_order_number);
        const actualStatus = remote ? mapPaylinkStatus(remote.orderStatus) : 'pending';
        const actualAmount = remote ? Number(remote.amount || 0) : null;
        const isMatch = actualStatus === pi.status &&
          (actualAmount === null || Math.abs(actualAmount - Number(pi.amount)) < 0.01);

        if (isMatch) matched++; else mismatched++;

        items.push({
          run_id: run.id,
          payment_intent_id: pi.id,
          internal_order_number: pi.internal_order_number,
          external_transaction_no: remote?.transactionNo || pi.external_transaction_no,
          expected_status: pi.status,
          actual_status: actualStatus,
          expected_amount: pi.amount,
          actual_amount: actualAmount,
          matched: isMatch,
          mismatch_reason: isMatch ? null
            : (actualStatus !== pi.status ? `status: ${pi.status} → ${actualStatus}` : 'amount mismatch'),
          raw_external: remote || null,
        });

        // Auto-heal terminal mismatches: if remote is succeeded but local is pending
        if (!isMatch && actualStatus === 'succeeded' && pi.status !== 'succeeded') {
          await admin.from('payment_intents').update({
            status: 'succeeded',
            succeeded_at: new Date().toISOString(),
            external_transaction_no: remote?.transactionNo || pi.external_transaction_no,
          }).eq('id', pi.id);
        }
      } catch (e: any) {
        mismatched++;
        items.push({
          run_id: run.id,
          payment_intent_id: pi.id,
          internal_order_number: pi.internal_order_number,
          expected_status: pi.status,
          matched: false,
          mismatch_reason: 'lookup_error: ' + (e?.message || String(e)),
        });
      }
    }

    if (items.length > 0) {
      // chunk insert
      for (let i = 0; i < items.length; i += 100) {
        await admin.from('payment_reconciliation_items').insert(items.slice(i, i + 100));
      }
    }

    await admin.from('payment_reconciliation_runs').update({
      status: 'completed',
      finished_at: new Date().toISOString(),
      total_checked: checked,
      total_matched: matched,
      total_mismatched: mismatched,
      summary: { lookback_hours: lookbackHours },
    }).eq('id', run.id);

    return new Response(JSON.stringify({
      ok: true, run_id: run.id, checked, matched, mismatched,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'internal_error', message: e?.message || String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
