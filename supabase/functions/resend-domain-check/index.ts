// Temporary diagnostic: probes which sender domains the configured Resend API key
// is authorized to send from. Sends a real test email to the site inbox on success.
// Delete after email setup is confirmed.
const CANDIDATES = [
  'fekrahedu.com',
  'notify.fekrahedu.com',
  'mail.fekrahedu.com',
  'send.fekrahedu.com',
  'email.fekrahedu.com',
  'notifications.fekrahedu.com',
]

Deno.serve(async () => {
  const key = Deno.env.get('RESEND_API_KEY')
  if (!key) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const results: Record<string, string> = {}
  for (const domain of CANDIDATES) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `FekrahEdu <noreply@${domain}>`,
        to: ['info@fekrahedu.com'],
        subject: `اختبار إرسال — ${domain}`,
        text: `رسالة اختبار من النطاق ${domain}`,
      }),
    })
    const body = await res.text()
    results[domain] = res.ok ? `OK (${res.status})` : `${res.status}: ${body.slice(0, 200)}`
    if (res.ok) break
  }

  return new Response(JSON.stringify({ results }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
