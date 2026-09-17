// Temporary diagnostic: lists domains verified on the configured Resend API key.
// Delete after email setup is confirmed.
Deno.serve(async () => {
  const key = Deno.env.get('RESEND_API_KEY')
  if (!key) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const res = await fetch('https://api.resend.com/domains', {
    headers: { Authorization: `Bearer ${key}` },
  })
  const body = await res.text()
  let domains: unknown = body
  try {
    const parsed = JSON.parse(body)
    domains = Array.isArray(parsed?.data)
      ? parsed.data.map((d: Record<string, unknown>) => ({ name: d.name, status: d.status, region: d.region }))
      : parsed
  } catch { /* keep raw */ }
  return new Response(JSON.stringify({ status: res.status, domains }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
