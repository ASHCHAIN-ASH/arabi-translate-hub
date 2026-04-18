import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Operation = "correct" | "rephrase" | "academic" | "shorten" | "expand";
type Mode = "standard" | "pro";

const PROMPTS: Record<Operation, string> = {
  correct:
    "أنت مدقق لغوي محترف للغة العربية والإنجليزية. صحّح الأخطاء الإملائية والنحوية وعلامات الترقيم في النص التالي مع الحفاظ التام على المعنى والأسلوب الأصلي. أرجع النص المصحّح فقط بدون أي شرح أو تعليق.",
  rephrase:
    "أنت كاتب محترف. أعد صياغة النص التالي بأسلوب مختلف وكلمات جديدة مع الحفاظ الكامل على المعنى. استخدم تراكيب لغوية متنوعة وحاذر من التكرار. أرجع النص المُعاد صياغته فقط بدون أي شرح.",
  academic:
    "أنت محرر أكاديمي خبير. ارفع النص التالي إلى مستوى أكاديمي رصين يصلح للنشر في الأبحاث العلمية والمجلات المحكمة. استخدم المصطلحات الأكاديمية الدقيقة، التراكيب الرسمية، والأسلوب الموضوعي. تجنّب اللغة العامية والإنشائية. أرجع النص الأكاديمي فقط بدون أي شرح.",
  shorten:
    "أنت محرر محترف. اختصر النص التالي إلى ما يقارب 50% من حجمه الأصلي مع الحفاظ على جميع الأفكار الرئيسية والمعلومات الجوهرية. احذف الإطناب والتكرار فقط. أرجع النص المختصر فقط بدون أي شرح.",
  expand:
    "أنت كاتب أكاديمي خبير. وسّع النص التالي وأثرِه بالتفاصيل والأمثلة والتوضيحات الإضافية مع الحفاظ على نفس الفكرة الأساسية والاتجاه. اجعل النص أعمق وأكثر شمولاً (يقارب ضعف الحجم). أرجع النص الموسّع فقط بدون أي شرح.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "غير مصرح" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY غير مُعدّ" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const body = await req.json();
    const text: string = (body.text || "").toString().trim();
    const operation: Operation = body.operation;
    const mode: Mode = body.mode === "pro" ? "pro" : "standard";

    // Input validation
    if (!text || text.length < 10) {
      return new Response(
        JSON.stringify({ error: "النص قصير جداً (10 أحرف على الأقل)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const maxLength = mode === "pro" ? 20000 : 5000;
    if (text.length > maxLength) {
      return new Response(
        JSON.stringify({
          error: `النص طويل جداً. الحد الأقصى: ${maxLength} حرف للنمط ${
            mode === "pro" ? "المتقدم" : "القياسي"
          }`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!PROMPTS[operation]) {
      return new Response(JSON.stringify({ error: "عملية غير معروفة" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) Charge wallet / verify quota via RPC
    const { data: useData, error: useError } = await supabase.rpc(
      "use_smart_editor",
      {
        _operation: operation,
        _mode: mode,
        _input_length: text.length,
      }
    );

    if (useError) {
      return new Response(
        JSON.stringify({ error: useError.message || "فشل التحقق من الرصيد" }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const usage = useData as {
      ok: boolean;
      was_free: boolean;
      charged: number;
      mode: string;
      wallet_transaction_id: string | null;
      free_quota_remaining: number;
    };

    // 2) Call Lovable AI Gateway
    const model =
      mode === "pro" ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: PROMPTS[operation] },
            { role: "user", content: text },
          ],
        }),
      }
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);

      // Refund the charge by reversing wallet transaction (compensation)
      if (usage.wallet_transaction_id && !usage.was_free) {
        await supabase.from("wallet_transactions").insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          wallet_id: null,
          type: "refund",
          amount: usage.charged,
          description: "استرجاع - فشل المحرر الذكي",
          reference_type: "smart_editor_refund",
        });
      }

      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({
            error: "الخدمة مزدحمة حالياً، يرجى المحاولة بعد قليل",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "نفذت موارد الذكاء الاصطناعي" }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      return new Response(JSON.stringify({ error: "فشل معالجة النص" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const output: string = aiJson?.choices?.[0]?.message?.content?.trim() || "";

    if (!output) {
      return new Response(
        JSON.stringify({ error: "لم يُرجع النموذج نتيجة" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3) Log usage
    await supabase.rpc("log_smart_editor_usage", {
      _operation: operation,
      _mode: mode,
      _input_length: text.length,
      _output_length: output.length,
      _cost: usage.charged,
      _was_free: usage.was_free,
      _wallet_transaction_id: usage.wallet_transaction_id,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        output,
        operation,
        mode,
        was_free: usage.was_free,
        charged: usage.charged,
        free_quota_remaining: usage.free_quota_remaining,
        input_length: text.length,
        output_length: output.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("smart-editor error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "خطأ غير متوقع",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
