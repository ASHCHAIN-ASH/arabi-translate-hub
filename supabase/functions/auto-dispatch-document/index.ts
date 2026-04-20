// إرسال تلقائي لـ PDF العقد بعد التوقيع، أو الفاتورة بعد الدفع
// يُستدعى من DB trigger عبر pg_net (async، لا يُعطّل العملية الأصلية)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    const { kind, contract_id, invoice_id } = await req.json();
    console.log("[auto-dispatch-document] received", { kind, contract_id, invoice_id });

    // نمرّر العمل لخلفية حتى نرجع 202 فوراً ولا نوقف الـ trigger
    const work = (async () => {
      try {
        const body: any = { kind };
        if (kind === "contract") body.contract_id = contract_id;
        else body.invoice_id = invoice_id;

        const { data, error } = await supabase.functions.invoke("whatsapp-send-document", { body });
        if (error) {
          console.error("[auto-dispatch-document] invoke error", error);
        } else {
          console.log("[auto-dispatch-document] sent ok", { kind, success: data?.success });
        }
      } catch (e) {
        console.error("[auto-dispatch-document] background error", e);
      }
    })();

    // EdgeRuntime.waitUntil يضمن إكمال العمل بعد إرجاع الردّ
    // @ts-ignore
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(work);
    } else {
      await work;
    }

    return new Response(JSON.stringify({ accepted: true }), {
      status: 202,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("[auto-dispatch-document] error", e);
    return new Response(JSON.stringify({ error: e?.message || "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
