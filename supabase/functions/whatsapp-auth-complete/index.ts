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
    const codeHash = await hashCode(String(code));

    // التحقق من OTP
    const { data: rows } = await supabase
      .from("whatsapp_otp_codes")
      .select("*")
      .eq("phone", normalized)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    const otp = rows?.[0];
    if (!otp) return resp({ success: false, error: "الرمز منتهٍ أو غير موجود" }, 200);
    if (otp.attempts >= 5) return resp({ success: false, error: "محاولات كثيرة" }, 200);
    const codeHash = await hashCode(code);
    if (codeHash !== otp.code_hash) {
      await supabase.from("auth_whatsapp_otp").update({ attempts: otp.attempts + 1 }).eq("id", otp.id);
      return resp({ success: false, error: "الرمز غير صحيح" }, 200);
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
        return resp({ success: false, error: "لا يوجد حساب بهذا الرقم. سجل أولاً." }, 404);
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
