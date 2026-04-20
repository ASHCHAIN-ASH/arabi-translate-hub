// One-shot backfill: generate real signed_final PDF + evidence
// for every signed contract that doesn't yet have a contract_versions row.
// Admin-only. Idempotent — safe to run repeatedly.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", userData.user.id);
    const isAdmin = (roles || []).some((r: any) => r.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find signed contracts without a current signed_final version
    const { data: contracts, error } = await supabase
      .from("contracts")
      .select("id, contract_number, status, current_version_id")
      .in("status", ["signed", "active", "completed"])
      .is("current_version_id", null);
    if (error) throw error;

    const results: any[] = [];
    for (const c of contracts || []) {
      try {
        const { data, error: fnErr } = await supabase.functions.invoke("generate-contract-pdf", {
          body: { contract_id: c.id, mode: "signed_final" },
        });
        if (fnErr) throw fnErr;
        results.push({ id: c.id, contract_number: c.contract_number, ok: true, path: (data as any)?.pdf_storage_path });
      } catch (e: any) {
        results.push({ id: c.id, contract_number: c.contract_number, ok: false, error: e.message });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      succeeded: results.filter(r => r.ok).length,
      failed: results.filter(r => !r.ok).length,
      results,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("backfill error:", e);
    return new Response(JSON.stringify({ error: e.message || String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
