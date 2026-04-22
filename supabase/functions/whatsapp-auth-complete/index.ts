// إكمال تسجيل الدخول/التسجيل عبر OTP واتساب — يُرجع magic link لإنشاء جلسة
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hashCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(code);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const resp = (d: any, s = 200) =>
    new Response(JSON.stringify(d), {
      status: s,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { phone, code, full_name, purpose = "login" } = await req.json();
    if (!phone || !code) return resp({ success: false, error: "البيانات ناقصة" }, 200);

    const normalized = normalizePhone(phone);

    // التحقق من قفل الحساب (24 ساعة بعد 5 محاولات فاشلة)
    const { data: activeLock } = await supabase
      .from("auth_phone_lockouts")
      .select("locked_until")
      .eq("phone", normalized)
      .gt("locked_until", new Date().toISOString())
      .order("locked_until", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeLock) {
      const until = new Date(activeLock.locked_until);
      const hoursLeft = Math.max(1, Math.ceil((until.getTime() - Date.now()) / (1000 * 60 * 60)));
      return resp({
        success: false,
        locked: true,
        locked_until: activeLock.locked_until,
        error: `تم قفل حسابك مؤقتاً بسبب محاولات متكررة. يرجى المحاولة بعد ${hoursLeft} ساعة، أو تواصل مع الدعم.`,
      }, 200);
    }

    // التحقق من OTP
    const { data: rows } = await supabase
      .from("auth_whatsapp_otp")
      .select("*")
      .eq("phone", normalized)
      .is("consumed_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    const otp = rows?.[0];
    if (!otp) {
      return resp({ success: false, error: "انتهت صلاحية الرمز أو لم يُرسل. يرجى طلب رمز جديد." }, 200);
    }

    const codeHash = await hashCode(String(code));
    if (codeHash !== otp.code_hash) {
      const newAttempts = (otp.attempts ?? 0) + 1;
      await supabase
        .from("auth_whatsapp_otp")
        .update({ attempts: newAttempts })
        .eq("id", otp.id);

      const remaining = Math.max(0, 5 - newAttempts);

      // إذا وصل للحد الأقصى، نُقفل الحساب 24 ساعة
      if (newAttempts >= 5) {
        const lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await supabase.from("auth_phone_lockouts").insert({
          phone: normalized,
          locked_until: lockedUntil,
          reason: "too_many_otp_attempts",
        });
        // إبطال جميع رموز OTP النشطة لهذا الرقم
        await supabase
          .from("auth_whatsapp_otp")
          .update({ consumed_at: new Date().toISOString() })
          .eq("phone", normalized)
          .is("consumed_at", null);

        return resp({
          success: false,
          locked: true,
          locked_until: lockedUntil,
          error: "تجاوزت الحد المسموح من المحاولات. تم قفل حسابك لمدة 24 ساعة لحماية أمانك.",
        }, 200);
      }

      return resp({
        success: false,
        attempts_remaining: remaining,
        error: `الرمز الذي أدخلته غير صحيح. تبقّى لديك ${remaining} ${remaining === 1 ? "محاولة" : "محاولات"} قبل قفل الحساب لمدة 24 ساعة.`,
      }, 200);
    }

    await supabase.from("auth_whatsapp_otp").update({ consumed_at: new Date().toISOString() }).eq("id", otp.id);


    // البحث عن مستخدم موجود برقم الجوال
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("phone", normalized)
      .maybeSingle();

    let userId = existingProfile?.id;
    let userEmail: string | null = null;

    if (!userId) {
      if (purpose !== "register") {
        return resp({ success: false, error: "لا يوجد حساب بهذا الرقم. سجل أولاً." }, 200);
      }
      // إنشاء مستخدم جديد ببريد شكلي مرتبط بالرقم
      userEmail = `wa_${normalized}@whatsapp.local`;
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: userEmail,
        phone: normalized,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: { full_name: full_name || `مستخدم ${normalized.slice(-4)}`, phone: normalized },
      });
      if (createErr || !created.user) {
        return resp({ success: false, error: createErr?.message || "تعذر إنشاء الحساب" }, 500);
      }
      userId = created.user.id;
      await supabase.from("profiles").upsert({
        id: userId,
        full_name: full_name || `مستخدم ${normalized.slice(-4)}`,
        phone: normalized,
      });
    } else {
      // جلب البريد للمستخدم الحالي
      const { data: u } = await supabase.auth.admin.getUserById(userId);
      userEmail = u.user?.email ?? `wa_${normalized}@whatsapp.local`;
    }

    // توليد magic link لإنشاء جلسة على العميل
    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: userEmail!,
    });

    if (linkErr || !linkData) {
      return resp({ success: false, error: linkErr?.message || "تعذر إنشاء الجلسة" }, 500);
    }

    // استخراج التوكنات من الـ hashed_token + verifyOtp على العميل
    const props = linkData.properties;
    return resp({
      success: true,
      user_id: userId,
      email: userEmail,
      action_link: props?.action_link,
      hashed_token: props?.hashed_token,
      email_otp: props?.email_otp,
    });
  } catch (e: any) {
    console.error("whatsapp-auth-complete", e);
    return resp({ success: false, error: e?.message || "خطأ" }, 500);
  }
});
