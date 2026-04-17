import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Find contracts pending signature for >= 48h, where last reminder (if any) was >= 24h ago
    const cutoff48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: contracts, error } = await supabase
      .from('contracts')
      .select('id, contract_number, title, client_full_name, client_email, user_id, sent_at, created_at')
      .eq('status', 'pending_signature')
      .lte('sent_at', cutoff48h)

    if (error) throw error

    const results: any[] = []

    for (const c of contracts || []) {
      // Check last reminder
      const { data: lastReminder } = await supabase
        .from('contract_timeline')
        .select('created_at')
        .eq('contract_id', c.id)
        .eq('action_type', 'auto_reminder_sent')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (lastReminder && lastReminder.created_at > cutoff24h) {
        results.push({ id: c.id, skipped: 'recent reminder' })
        continue
      }

      const sentAt = c.sent_at || c.created_at
      const hoursPending = Math.floor((Date.now() - new Date(sentAt).getTime()) / (60 * 60 * 1000))

      // Send email
      if (c.client_email) {
        try {
          await supabase.functions.invoke('send-transactional-email', {
            body: {
              template: 'contract-reminder',
              to: c.client_email,
              data: {
                clientName: c.client_full_name || 'عميلنا الكريم',
                contractNumber: c.contract_number,
                contractTitle: c.title,
                hoursPending,
                contractUrl: `https://masteredupath.com/client/contracts/${c.id}`,
              },
              purpose: 'transactional',
              idempotency_key: `contract-reminder-${c.id}-${Math.floor(Date.now() / (24 * 3600 * 1000))}`,
            },
          })
        } catch (e) {
          console.error('Email send failed', c.id, e)
        }
      }

      // In-app notification
      if (c.user_id) {
        await supabase.from('user_notifications').insert({
          user_id: c.user_id,
          title: '⏰ تذكير: عقدك بانتظار التوقيع',
          message: `العقد رقم ${c.contract_number} لم يُوقّع بعد منذ ${hoursPending} ساعة`,
          type: 'contract',
          link: `/client/contracts/${c.id}`,
        })
      }

      // Timeline entry
      await supabase.from('contract_timeline').insert({
        contract_id: c.id,
        actor_type: 'system',
        action_type: 'auto_reminder_sent',
        action_label: 'تذكير تلقائي',
        description: `أرسل النظام تذكيراً تلقائياً للعميل (${hoursPending} ساعة بدون توقيع)`,
        metadata: { hoursPending },
      })

      results.push({ id: c.id, sent: true, hoursPending })
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (e) {
    console.error('contract-reminders error', e)
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
