/**
 * عجلة جوائز FekrahEdu — إدارة الأهلية (مرة واحدة كل 30 يومًا) وإرسال الجائزة بالبريد.
 *
 * الإجراءات (action):
 *  - "check" : يعيد أهلية المشارك وموعد محاولته القادمة (بدون أي تعديل).
 *  - "claim" : (الافتراضي) يوثّق الفوز في جدول spin_attempts ثم يرسل رسالتين:
 *              رسالة تهنئة للفائز + إشعار للإدارة، ويُسجّل الإرسال في email_send_log.
 *
 * قاعدة التوثيق: يُحسب موعد المحاولة القادمة = تاريخ الفوز + 30 يومًا،
 * ويُخزَّن في العمود next_eligible_at. التحقق يتم بمعرّف الجهاز والبريد معًا.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import SpinPrizeWon from "../_shared/transactional-email-templates/spin-prize-won.tsx";
import SpinPrizeAdmin from "../_shared/transactional-email-templates/spin-prize-admin.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM = "FekrahEdu <noreply@fekrahedu.com>";
const ADMIN_EMAIL = "info@fekrahedu.com";
export const COOLDOWN_DAYS = 30;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

const arDate = (d: Date) =>
  new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh",
  }).format(d);

/** آخر محاولة للمشارك (بالجهاز أو بالبريد) خلال فترة التهدئة */
async function findActiveAttempt(userIdentifier?: string, email?: string) {
  const since = new Date(Date.now() - COOLDOWN_DAYS * 86400000).toISOString();
  const ors: string[] = [];
  if (userIdentifier) ors.push(`user_identifier.eq.${userIdentifier}`);
  if (email) ors.push(`email.eq.${email.trim().toLowerCase()}`);
  if (!ors.length) return null;

  const { data, error } = await supabase
    .from("spin_attempts")
    .select("id, prize, email, created_at, next_eligible_at")
    .or(ors.join(","))
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("findActiveAttempt failed:", error.message);
    return null;
  }
  return data?.[0] ?? null;
}

const eligibilityPayload = (attempt: any) => {
  if (!attempt) return { eligible: true, cooldownDays: COOLDOWN_DAYS };
  const next = attempt.next_eligible_at
    ? new Date(attempt.next_eligible_at)
    : new Date(new Date(attempt.created_at).getTime() + COOLDOWN_DAYS * 86400000);
  if (next.getTime() <= Date.now()) return { eligible: true, cooldownDays: COOLDOWN_DAYS };
  return {
    eligible: false,
    cooldownDays: COOLDOWN_DAYS,
    nextEligibleAt: next.toISOString(),
    lastPrize: attempt.prize ?? null,
    lastSpinAt: attempt.created_at,
  };
};

async function logEmail(template: string, to: string, messageId: string | null, error?: string) {
  try {
    await supabase.from("email_send_log").insert({
      template_name: template,
      recipient_email: to,
      message_id: messageId,
      status: error ? "failed" : "sent",
      error_message: error ?? null,
      metadata: { source: "spin-the-wheel" },
    });
  } catch (e) {
    console.error("email_send_log insert failed:", (e as Error).message);
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action ?? "claim";
    const userIdentifier: string | undefined = body.userIdentifier;
    const email: string | undefined = body.email?.trim?.().toLowerCase?.();

    if (action === "check") {
      return json(eligibilityPayload(await findActiveAttempt(userIdentifier, email)));
    }

    // التسجيل في الموقع شرط أساسي للحصول على الجائزة
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    const { data: authData } = jwt
      ? await supabase.auth.getUser(jwt)
      : { data: { user: null } } as any;
    const authedUser = authData?.user ?? null;
    if (!authedUser?.email) {
      return json({ error: "التسجيل في الموقع شرط أساسي للحصول على الجائزة. سجّل دخولك ثم أعد المحاولة." }, 401);
    }
    const accountEmail = authedUser.email.trim().toLowerCase();

    const name: string = (body.name ?? "").trim();
    const prize: string = (body.prize ?? "").trim();
    if (!accountEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(accountEmail)) {
      return json({ error: "بريد إلكتروني غير صالح" }, 400);
    }
    if (!name || !prize) return json({ error: "الاسم والجائزة مطلوبان" }, 400);

    // فرض قاعدة الـ 30 يومًا على الخادم (لا يمكن تجاوزها من المتصفح)
    const active = await findActiveAttempt(authedUser.id, accountEmail);
    const eligibility = eligibilityPayload(active);
    if (!eligibility.eligible) {
      return json({ error: "لديك محاولة مسجّلة خلال آخر 30 يومًا", ...eligibility }, 429);
    }

    const now = new Date();
    const nextEligible = new Date(now.getTime() + COOLDOWN_DAYS * 86400000);
    const claimCode = `SPIN-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    const { data: inserted, error: insertError } = await supabase
      .from("spin_attempts")
      .insert({
        user_identifier: authedUser.id,
        name,
        email: accountEmail,
        prize,
        attempt_date: now.toISOString().split("T")[0],
        next_eligible_at: nextEligible.toISOString(),
        source: "web",
      })
      .select("id")
      .maybeSingle();

    if (insertError) {
      console.error("spin_attempts insert failed:", insertError.message);
      return json({ error: "تعذّر تسجيل المحاولة", details: insertError.message }, 500);
    }

    const shared = {
      prize,
      claimCode,
      wonAt: arDate(now),
      nextEligibleAt: arDate(nextEligible),
    };

    const clientHtml = await renderAsync(
      React.createElement(SpinPrizeWon, {
        customerName: name,
        validUntil: arDate(nextEligible),
        ...shared,
      }),
    );
    const adminHtml = await renderAsync(
      React.createElement(SpinPrizeAdmin, {
        customerName: name,
        customerEmail: email,
        deviceId: userIdentifier ?? "—",
        ...shared,
      }),
    );

    const clientRes = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: `🎉 مبروك! ربحت ${prize} — FekrahEdu`,
      html: clientHtml,
    });
    await logEmail("spin-prize-won", email, clientRes.data?.id ?? null, clientRes.error?.message);
    if (clientRes.error) {
      console.error("client email failed:", clientRes.error.message);
      return json({ error: "تعذّر إرسال الجائزة إلى بريدك", details: clientRes.error.message }, 502);
    }

    const adminRes = await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      subject: `🎊 فائز جديد في عجلة الجوائز — ${prize}`,
      html: adminHtml,
    });
    await logEmail("spin-prize-admin", ADMIN_EMAIL, adminRes.data?.id ?? null, adminRes.error?.message);

    if (inserted?.id) {
      await supabase.from("spin_attempts")
        .update({ email_sent_at: new Date().toISOString() })
        .eq("id", inserted.id);
    }

    return json({
      success: true,
      claimCode,
      nextEligibleAt: nextEligible.toISOString(),
      cooldownDays: COOLDOWN_DAYS,
    });
  } catch (error) {
    console.error("send-spin-winner error:", error);
    return json({ error: (error as Error).message }, 500);
  }
});
