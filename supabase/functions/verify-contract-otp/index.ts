import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { contract_id, code } = await req.json();
    if (!contract_id || !code) {
      return new Response(JSON.stringify({ error: "contract_id و code مطلوبان" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: contract } = await supabase
      .from("contracts").select("client_email").eq("id", contract_id).single();

    if (!contract?.client_email) {
      return new Response(JSON.stringify({ error: "العقد غير موجود" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const code_hash = await sha256(String(code).trim());

    const { data: rec } = await supabase
      .from("contract_otp_codes")
      .select("*")
      .eq("contract_id", contract_id)
      .eq("email", contract.client_email)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!rec) {
      return new Response(JSON.stringify({ error: "الرمز منتهي الصلاحية أو غير موجود — يرجى طلب رمز جديد" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (rec.attempts >= 5) {
      await supabase.from("contract_otp_codes").update({ used: true }).eq("id", rec.id);
      return new Response(JSON.stringify({ error: "تم تجاوز عدد المحاولات — يرجى طلب رمز جديد" }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (rec.code_hash !== code_hash) {
      await supabase.from("contract_otp_codes")
        .update({ attempts: rec.attempts + 1 }).eq("id", rec.id);
      return new Response(JSON.stringify({ error: "رمز التحقق غير صحيح" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("contract_otp_codes").update({ used: true }).eq("id", rec.id);

    return new Response(JSON.stringify({ success: true, verified: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("verify-contract-otp error:", err);
    return new Response(JSON.stringify({ error: err.message || "خطأ غير متوقع" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
