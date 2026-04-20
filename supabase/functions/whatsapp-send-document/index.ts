// إرسال مستند PDF (عقد موقّع أو فاتورة مدفوعة) عبر واتساب SmartWats
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, sendWhatsAppMedia } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json();
    const {
      kind, // 'contract' | 'invoice'
      contract_id,
      invoice_id,
      to,            // optional override
      caption,       // optional caption
    } = body || {};

    if (!kind || !["contract", "invoice"].includes(kind)) {
      return json({ success: false, error: "kind مطلوب: contract أو invoice" }, 400);
    }

    let phone = to as string | undefined;
    let storagePath: string | null = null;
    let bucket = "contracts";
    let filename = "document.pdf";
    let defaultCaption = "تجدون المستند في المرفق.";
    let related_entity_type = kind;
    let related_entity_id: string | null = null;

    if (kind === "contract") {
      if (!contract_id) return json({ success: false, error: "contract_id مطلوب" }, 400);
      related_entity_id = contract_id;
      const { data: c, error } = await supabase
        .from("contracts")
        .select("id, contract_number, title, client_phone, signed_pdf_path, status, current_version_id")
        .eq("id", contract_id)
        .single();
      if (error || !c) return json({ success: false, error: "العقد غير موجود" }, 404);

      phone = phone || c.client_phone || undefined;
      storagePath = c.signed_pdf_path;

      // لو لا يوجد PDF موقّع، نحاول توليده
      if (!storagePath && c.status === "signed") {
        const { data: gen, error: genErr } = await supabase.functions.invoke("generate-contract-pdf", {
          body: { contract_id, mode: "signed_final" },
        });
        if (genErr) return json({ success: false, error: `فشل توليد PDF العقد: ${genErr.message}` }, 500);
        storagePath = gen?.pdf_storage_path || null;
      }
      if (!storagePath) return json({ success: false, error: "لا يوجد ملف PDF للعقد. يجب توقيعه أولاً." }, 400);

      bucket = "contracts";
      filename = `${c.contract_number || "contract"}.pdf`;
      defaultCaption = `📄 عقدكم الموقّع رقم ${c.contract_number}\n${c.title || ""}\n\nمنصة ماستر إيدو باث`;
    } else {
      if (!invoice_id) return json({ success: false, error: "invoice_id مطلوب" }, 400);
      related_entity_id = invoice_id;
      const { data: inv, error } = await supabase
        .from("invoices")
        .select("id, invoice_number, customer_phone, customer_name, total_amount, currency, status, pdf_storage_path")
        .eq("id", invoice_id)
        .single();
      if (error || !inv) return json({ success: false, error: "الفاتورة غير موجودة" }, 404);

      phone = phone || inv.customer_phone || undefined;
      storagePath = inv.pdf_storage_path;

      // لو لا يوجد PDF فاتورة محفوظ — نولّده ونرفعه
      if (!storagePath) {
        const { data: gen, error: genErr } = await supabase.functions.invoke("generate-invoice-pdf", {
          body: { invoice_id },
        });
        if (genErr || !gen?.success) {
          return json({ success: false, error: `فشل توليد PDF الفاتورة: ${genErr?.message || gen?.error}` }, 500);
        }
        // generate-invoice-pdf يُرجع HTML base64 حالياً — نحوله إلى ملف
        const htmlData = gen?.html_data || gen?.pdf_data;
        if (!htmlData) return json({ success: false, error: "لا توجد بيانات PDF للفاتورة" }, 500);
        const bytes = Uint8Array.from(atob(htmlData), (ch) => ch.charCodeAt(0));
        const path = `${inv.id}/${inv.invoice_number || inv.id}.pdf`;
        // نحفظه كـ HTML داخل bucket — أغلب عملاء واتساب يفتحون .pdf فقط، لذا نتركه HTML بامتداد .html
        // لنحافظ على إرسال PDF حقيقي، نرفع كـ application/pdf إن كانت البيانات PDF حقيقية، وإلا html.
        const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50; // %P
        const ext = isPdf ? "pdf" : "html";
        const realPath = path.replace(/\.pdf$/, `.${ext}`);
        const { error: upErr } = await supabase.storage
          .from("invoices")
          .upload(realPath, bytes, {
            contentType: isPdf ? "application/pdf" : "text/html; charset=utf-8",
            upsert: true,
          });
        if (upErr) return json({ success: false, error: `فشل رفع PDF: ${upErr.message}` }, 500);
        storagePath = realPath;
        await supabase.from("invoices").update({
          pdf_storage_path: realPath,
          pdf_generated_at: new Date().toISOString(),
        }).eq("id", inv.id);
      }

      bucket = "invoices";
      filename = `${inv.invoice_number || "invoice"}.pdf`;
      const amount = new Intl.NumberFormat("ar-SA", {
        style: "currency", currency: inv.currency || "SAR", maximumFractionDigits: 2,
      }).format(Number(inv.total_amount) || 0);
      defaultCaption = `🧾 فاتورتكم رقم ${inv.invoice_number}\nالإجمالي: ${amount}\n\nشكراً لتعاملكم مع ماستر إيدو باث`;
    }

    if (!phone) return json({ success: false, error: "رقم الهاتف غير متوفر" }, 400);

    // إعدادات واتساب
    const { data: settings } = await supabase
      .from("whatsapp_settings").select("*").eq("id", 1).single();
    if (settings && settings.is_enabled === false) {
      return json({ success: false, error: "خدمة واتساب معطّلة" }, 200);
    }

    // signed URL لمدة 7 أيام
    const { data: signed, error: sErr } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath!, 60 * 60 * 24 * 7);
    if (sErr || !signed?.signedUrl) {
      return json({ success: false, error: `فشل إنشاء رابط الملف: ${sErr?.message}` }, 500);
    }

    const phoneN = normalizePhone(phone, settings?.default_country_code || "966");
    const finalCaption = caption || defaultCaption;
    const result = await sendWhatsAppMedia(phoneN, signed.signedUrl, filename, finalCaption);

    // سجل الإرسال
    await supabase.from("whatsapp_send_log").insert({
      to_phone: phoneN,
      event_key: kind === "contract" ? "contract_pdf_sent" : "invoice_pdf_sent",
      message_body: finalCaption,
      variables: { filename, signed_url: signed.signedUrl },
      status: result.success ? "sent" : "failed",
      provider_message_id: result.messageId ?? null,
      error_message: result.success ? null : result.error,
      related_entity_type,
      related_entity_id,
    });

    return json(result, result.success ? 200 : 502);
  } catch (e: any) {
    console.error("whatsapp-send-document error", e);
    return json({ success: false, error: e?.message || "خطأ غير متوقع" }, 500);
  }
});
