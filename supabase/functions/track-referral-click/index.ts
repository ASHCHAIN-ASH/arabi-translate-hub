// Public edge function to record a referral click.
// Accepts anonymous calls (no JWT required). Captures IP + UA from headers.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const refRaw = (body?.ref_code ?? "").toString().trim().toUpperCase();
    if (!refRaw || refRaw.length < 4 || refRaw.length > 16) {
      return new Response(
        JSON.stringify({ success: false, error: "invalid_ref_code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      null;
    const ua = req.headers.get("user-agent") || null;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // Make sure ref_code exists; silently ignore if not
    const { data: refRow } = await admin
      .from("user_referrals")
      .select("ref_code")
      .eq("ref_code", refRaw)
      .maybeSingle();

    if (!refRow) {
      return new Response(
        JSON.stringify({ success: false, error: "unknown_ref_code" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error } = await admin
      .from("referral_clicks")
      .insert({ ref_code: refRaw, ip, user_agent: ua });

    if (error) {
      console.error("[track-referral-click] insert error:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("[track-referral-click] unexpected:", e);
    return new Response(
      JSON.stringify({ success: false, error: "server_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
