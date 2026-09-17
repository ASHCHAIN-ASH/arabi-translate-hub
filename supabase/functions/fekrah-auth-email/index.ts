// رسائل حساب FekrahEdu (تفعيل البريد / إعادة تعيين كلمة المرور)
// تُرسل من نطاق fekrahedu.com عبر Resend مباشرة، وروابطها تعود إلى fekrahedu.com.
import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import VerificationEmail from '../_shared/transactional-email-templates/email-verification.tsx'
import PasswordResetEmail from '../_shared/transactional-email-templates/password-reset.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_NAME = 'FekrahEdu'
const FROM = `${SITE_NAME} <noreply@fekrahedu.com>`
const DEFAULT_SITE = 'https://fekrahedu.com'

function safeOrigin(candidate?: string | null): string {
  if (!candidate) return DEFAULT_SITE
  try {
    const u = new URL(candidate)
    const host = u.hostname
    const ok =
      host === 'fekrahedu.com' ||
      host === 'www.fekrahedu.com' ||
      host.endsWith('.lovable.app') ||
      host === 'localhost'
    return ok ? `${u.protocol}//${u.host}` : DEFAULT_SITE
  } catch {
    return DEFAULT_SITE
  }
}

async function sendViaResend(to: string, subject: string, html: string, text: string) {
  const key = Deno.env.get('RESEND_API_KEY')
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body}`)
  return body
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const messageId = crypto.randomUUID()
  let recipient = ''
  let templateName = 'email-verification'
  let createdUserId: string | null = null

  try {
    const body = await req.json().catch(() => ({}))
    const action: string = body.action || 'verify'
    const email: string = String(body.email || '').toLowerCase().trim()
    const name: string | undefined = body.name
    if (!email) throw new Error('البريد الإلكتروني مطلوب')
    recipient = email

    const origin = safeOrigin(body.origin || req.headers.get('origin'))

    // إنشاء الحساب دون إرسال أي رسالة من المنصة المضيفة
    if (action === 'signup') {
      const password: string = body.password
      if (!password) throw new Error('كلمة المرور مطلوبة')
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: body.metadata ?? {},
      })
      if (createErr && !/already been registered|already registered/i.test(createErr.message)) {
        throw createErr
      }
      if (createErr) {
        return new Response(JSON.stringify({ error: 'already_registered' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      createdUserId = created?.user?.id ?? null
    }

    const isRecovery = action === 'recovery'
    templateName = isRecovery ? 'password-reset' : 'email-verification'

    const next = isRecovery ? '/auth/reset-password' : '/login?verified=1'
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: isRecovery ? 'recovery' : 'magiclink',
      email,
      options: { redirectTo: `${origin}${next}` },
    })
    if (linkErr) throw linkErr

    const tokenHash = linkData?.properties?.hashed_token
    if (!tokenHash) throw new Error('تعذر توليد رابط التحقق')

    const confirmationUrl =
      `${origin}/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}` +
      `&type=${isRecovery ? 'recovery' : 'magiclink'}&next=${encodeURIComponent(next)}`

    const Component = isRecovery ? PasswordResetEmail : VerificationEmail
    const props = { name, confirmationUrl, expiresInMinutes: 60 }
    const html = await renderAsync(React.createElement(Component as never, props))
    const text = await renderAsync(React.createElement(Component as never, props), { plainText: true })

    const subject = isRecovery
      ? `إعادة تعيين كلمة المرور — ${SITE_NAME}`
      : `تفعيل حسابك في ${SITE_NAME}`

    await admin.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: email,
      status: 'pending',
    })

    await sendViaResend(email, subject, html, text)

    await admin.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: email,
      status: 'sent',
    })

    return new Response(JSON.stringify({ success: true, message_id: messageId, user_id: createdUserId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('fekrah-auth-email failed', msg)
    try {
      await admin.from('email_send_log').insert({
        message_id: messageId,
        template_name: templateName,
        recipient_email: recipient || 'unknown',
        status: 'failed',
        error_message: msg,
      })
    } catch (_) { /* ignore */ }
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
