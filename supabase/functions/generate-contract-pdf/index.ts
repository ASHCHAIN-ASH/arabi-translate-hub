import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PARENT_COMPANY = "شركة علي صالح الشهري القابضة";
const BRAND = "منصة ماستر إيدو باث";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const contractId: string | undefined = body.contract_id || body.contractId;
    if (!contractId) {
      return new Response(JSON.stringify({ error: "contract_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: contract, error: cErr } = await supabase
      .from("contracts")
      .select("*")
      .eq("id", contractId)
      .single();
    if (cErr || !contract) throw new Error(cErr?.message || "Contract not found");

    const { data: signature } = await supabase
      .from("contract_signatures")
      .select("*")
      .eq("contract_id", contractId)
      .order("signed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Build PDF (Arabic fallback via Helvetica — text rendered RTL via right-aligned writes)
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    let y = margin;

    const writeRight = (text: string, size = 11, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, pageW - margin * 2);
      lines.forEach((ln: string) => {
        if (y > pageH - margin) { doc.addPage(); y = margin; }
        doc.text(ln, pageW - margin, y, { align: "right" });
        y += size + 6;
      });
    };
    const hr = () => {
      doc.setDrawColor(180);
      doc.line(margin, y, pageW - margin, y);
      y += 12;
    };

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(BRAND, pageW - margin, 32, { align: "right" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`تابعة لـ ${PARENT_COMPANY}`, pageW - margin, 52, { align: "right" });
    doc.setTextColor(20, 20, 20);
    y = 100;

    writeRight(`عقد رقم: ${contract.contract_number || contract.id}`, 14, true);
    writeRight(contract.title || "عقد خدمة", 13, true);
    hr();

    writeRight("بيانات العميل", 12, true);
    writeRight(`الاسم: ${contract.client_full_name || "-"}`);
    writeRight(`البريد: ${contract.client_email || "-"}`);
    writeRight(`الجوال: ${contract.client_phone || "-"}`);
    if (contract.client_id_number) writeRight(`الهوية: ${contract.client_id_number}`);
    hr();

    writeRight("تفاصيل الخدمة", 12, true);
    writeRight(`الخدمة: ${contract.service_name || "-"}`);
    writeRight(`المبلغ الإجمالي: ${contract.total_amount ?? 0} ${contract.currency || "SAR"}`);
    if (contract.payment_terms) writeRight(`شروط الدفع: ${contract.payment_terms}`);
    if (contract.delivery_date) writeRight(`تاريخ التسليم: ${contract.delivery_date}`);
    hr();

    writeRight("محتوى العقد", 12, true);
    writeRight(contract.content || "—");
    hr();

    if (signature) {
      writeRight("بيانات التوقيع الإلكتروني", 12, true);
      writeRight(`الموقّع: ${signature.signer_name}`);
      writeRight(`تاريخ التوقيع: ${new Date(signature.signed_at).toLocaleString("ar-SA")}`);
      if (signature.ip_address) writeRight(`IP: ${signature.ip_address}`);
      writeRight(`نص التوقيع: ${signature.signature_text}`);

      const hashSrc = `${contract.id}|${signature.signed_at}|${signature.ip_address || ""}|${signature.signature_text}`;
      const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(hashSrc));
      const hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
      writeRight(`بصمة التحقق (SHA-256): ${hash}`, 9);
    } else {
      writeRight("لم يتم تسجيل توقيع بعد", 11, true);
    }

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `${BRAND} • ${PARENT_COMPANY} • صفحة ${i} من ${pageCount}`,
        pageW / 2, pageH - 20, { align: "center" },
      );
    }

    const pdfBytes = doc.output("arraybuffer");
    const userId = contract.user_id || "system";
    const path = `${userId}/${contract.id}.pdf`;

    const { error: upErr } = await supabase.storage
      .from("contracts")
      .upload(path, new Uint8Array(pdfBytes), {
        contentType: "application/pdf",
        upsert: true,
      });
    if (upErr) throw upErr;

    await supabase
      .from("contracts")
      .update({
        signed_pdf_path: path,
        signed_pdf_generated_at: new Date().toISOString(),
      })
      .eq("id", contract.id);

    const { data: signed } = await supabase.storage
      .from("contracts")
      .createSignedUrl(path, 60 * 60 * 24 * 7);

    return new Response(
      JSON.stringify({
        success: true,
        path,
        signed_url: signed?.signedUrl || null,
        contract_id: contract.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("generate-contract-pdf error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e.message || String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
