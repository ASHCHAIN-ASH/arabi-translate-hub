import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RIYADH_TZ = 'Asia/Riyadh';

function nowInRiyadh(): Date {
  // Returns a Date representing wall-clock time in Riyadh
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: RIYADH_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
  return new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
}

function formatRiyadhTime(iso: string): string {
  return new Intl.DateTimeFormat('ar-SA', {
    timeZone: RIYADH_TZ, hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

async function sendWhatsApp(supabase: any, phone: string, message: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-whatsapp', {
      body: { to: phone, message },
    });
    if (error) return { ok: false, error: error.message };
    if (data && data.success === false) return { ok: false, error: data.error || 'send failed' };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

async function resolvePhone(supabase: any, userId: string): Promise<string | null> {
  // Override on profile first
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('whatsapp_phone_override, whatsapp_notifications_enabled')
    .eq('user_id', userId)
    .maybeSingle();

  if (profile && profile.whatsapp_notifications_enabled === false) return null;
  if (profile?.whatsapp_phone_override) return profile.whatsapp_phone_override;

  // Fallback: auth user phone
  const { data: userRes } = await supabase.auth.admin.getUserById(userId);
  return userRes?.user?.phone || (userRes?.user?.user_metadata as any)?.phone || null;
}

async function processLog(supabase: any, logId: string) {
  const { data: log, error } = await supabase
    .from('student_notifications_log')
    .select('*')
    .eq('id', logId)
    .maybeSingle();
  if (error || !log) return { ok: false, error: 'log not found' };
  if (log.status !== 'pending') return { ok: true, skipped: true };

  const phone = log.phone || await resolvePhone(supabase, log.user_id);
  if (!phone) {
    await supabase.from('student_notifications_log').update({
      status: 'skipped', error: 'no phone or notifications disabled',
    }).eq('id', logId);
    return { ok: true, skipped: true };
  }

  const result = await sendWhatsApp(supabase, phone, log.message || '');
  await supabase.from('student_notifications_log').update({
    status: result.ok ? 'sent' : 'failed',
    error: result.error || null,
    phone,
    sent_at: result.ok ? new Date().toISOString() : null,
  }).eq('id', logId);

  return result;
}

async function scanAndQueue(supabase: any) {
  // Scan upcoming events in next ~16 minutes (Riyadh time) and emit reminders
  const now = nowInRiyadh();
  const in15Start = new Date(now.getTime() + 14 * 60 * 1000); // 14-16 min window
  const in15End = new Date(now.getTime() + 16 * 60 * 1000);
  const startWindowEnd = new Date(now.getTime() + 1 * 60 * 1000); // 0-1 min window

  // Convert Riyadh wall-clock back to UTC by subtracting offset (Riyadh = UTC+3, no DST)
  const toUtc = (d: Date) => new Date(d.getTime() - 3 * 60 * 60 * 1000).toISOString();

  // 15-min reminders
  const { data: soonEvents } = await supabase
    .from('student_events')
    .select('id, user_id, title, event_type, starts_at')
    .eq('is_done', false)
    .gte('starts_at', toUtc(in15Start))
    .lte('starts_at', toUtc(in15End));

  for (const ev of soonEvents || []) {
    const time = formatRiyadhTime(ev.starts_at);
    const typeLabel = ev.event_type === 'exam' ? '📝 اختبار' : ev.event_type === 'focus' ? '⏱️ جلسة تركيز' : '📚 مذاكرة';
    await supabase.rpc('notify_student_whatsapp', {
      _user_id: ev.user_id,
      _type: 'event_reminder_15m',
      _message: `⏰ تذكير: لديك ${typeLabel} "${ev.title}" بعد 15 دقيقة (${time}).`,
      _reference_id: ev.id,
      _reference_kind: 'event',
      _dedupe_key: `event_15m:${ev.id}`,
    });
  }

  // Start-time reminders
  const { data: startNow } = await supabase
    .from('student_events')
    .select('id, user_id, title, event_type, starts_at')
    .eq('is_done', false)
    .gte('starts_at', toUtc(now))
    .lte('starts_at', toUtc(startWindowEnd));

  for (const ev of startNow || []) {
    const typeLabel = ev.event_type === 'exam' ? '📝 الاختبار' : ev.event_type === 'focus' ? '⏱️ جلسة التركيز' : '📚 المذاكرة';
    await supabase.rpc('notify_student_whatsapp', {
      _user_id: ev.user_id,
      _type: 'event_start',
      _message: `🚀 ابدأ الآن: ${typeLabel} "${ev.title}". بالتوفيق!`,
      _reference_id: ev.id,
      _reference_kind: 'event',
      _dedupe_key: `event_start:${ev.id}`,
    });
  }

  // Daily morning brief at 07:00 Riyadh time (run window 07:00-07:01)
  const hh = now.getHours();
  const mm = now.getMinutes();
  if (hh === 7 && mm < 2) {
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
    const { data: pendingTasks } = await supabase
      .from('student_tasks')
      .select('user_id, id, title');
    const grouped = new Map<string, any[]>();
    for (const t of pendingTasks || []) {
      if (!grouped.has(t.user_id)) grouped.set(t.user_id, []);
      grouped.get(t.user_id)!.push(t);
    }
    const dateKey = now.toISOString().slice(0, 10);
    for (const [userId, tasks] of grouped) {
      const top = tasks.slice(0, 5).map((t, i) => `${i + 1}. ${t.title}`).join('\n');
      await supabase.rpc('notify_student_whatsapp', {
        _user_id: userId,
        _type: 'daily_brief',
        _message: `☀️ صباح الخير! مهامك اليوم:\n${top}\n\nابدأ يومك بنشاط 💪`,
        _reference_id: null,
        _reference_kind: 'daily',
        _dedupe_key: `daily:${userId}:${dateKey}`,
      });
    }
  }

  // Process pending logs (the rpc fires net.http_post, but we also process here as a safety net)
  const { data: pending } = await supabase
    .from('student_notifications_log')
    .select('id')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(50);

  let processed = 0;
  for (const p of pending || []) {
    await processLog(supabase, p.id);
    processed++;
  }
  return { soonEvents: soonEvents?.length || 0, startNow: startNow?.length || 0, processed };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    let body: any = {};
    try { body = await req.json(); } catch { /* GET or empty */ }

    if (body.log_id) {
      const r = await processLog(supabase, body.log_id);
      return new Response(JSON.stringify(r), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Cron mode
    const r = await scanAndQueue(supabase);
    return new Response(JSON.stringify({ ok: true, ...r }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
