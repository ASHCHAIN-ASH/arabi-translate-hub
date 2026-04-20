// توليد إيصال PDF رسمي للمعاملة المالية وحفظه في bucket receipts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TYPE_LABEL: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  payment: "Service Payment",
  refund: "Refund",
  adjustment: "Adjustment",
};

const METHOD_LABEL: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  mada: "Mada Card",
  visa: "Visa Card",
  mastercard: "MasterCard",
  stc_pay: "STC Pay",
  apple_pay: "Apple Pay",
  cash: "Cash",
  wallet: "Wallet",
};

const fmt = (n: number, c = "SAR") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, minimumFractionDigits: 2 }).format(n || 0);

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d));

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

    const { transaction_id } = await req.json();
    if (!transaction_id) return resp({ success: false, error: "transaction_id مطلوب" }, 400);

    // التحقق من الجلسة (يفتح للأدمن أو للمالك)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return resp({ success: false, error: "غير مصرح" }, 401);
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claims } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
    const callerId = claims?.claims?.sub;
    if (!callerId) return resp({ success: false, error: "غير مصرح" }, 401);

    const { data: tx, error: txErr } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("id", transaction_id)
      .single();
    if (txErr || !tx) return resp({ success: false, error: "المعاملة غير موجودة" }, 404);

    // صلاحية: المالك أو الأدمن
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: callerId, _role: "admin" });
    if (tx.user_id !== callerId && !isAdmin) {
      return resp({ success: false, error: "غير مصرح" }, 403);
    }

    // جلب اسم العميل
    const { data: profile } = await supabase
      .from("profiles").select("full_name, phone").eq("id", tx.user_id).maybeSingle();

    // توليد PDF
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210;
    let y = 20;

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL RECEIPT", pageW / 2, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Mastered Edu Path  |  ALI SALEH ALSHEHRI HOLDING CO.", pageW / 2, 27, { align: "center" });
    doc.setFontSize(8);
    doc.text("Verified Digital Receipt - SHA-256 Signed", pageW / 2, 33, { align: "center" });

    y = 50;
    doc.setTextColor(15, 23, 42);

    // Receipt No box
    doc.setDrawColor(200);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y, 180, 18, 2, 2, "FD");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("RECEIPT NO.", 20, y + 6);
    doc.text("ISSUED AT", 120, y + 6);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(tx.receipt_number || tx.id.slice(0, 12), 20, y + 14);
    doc.setFontSize(10);
    doc.text(fmtDate(tx.signed_at || tx.created_at), 120, y + 14);
    y += 26;

    // Customer
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("CUSTOMER", 15, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 6;
    doc.text(`Name: ${profile?.full_name || "N/A"}`, 15, y); y += 5;
    doc.text(`Phone: ${profile?.phone || "N/A"}`, 15, y); y += 5;
    doc.text(`Customer ID: ${tx.user_id}`, 15, y); y += 10;

    // Transaction details table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TRANSACTION DETAILS", 15, y); y += 4;
    doc.setDrawColor(200);
    doc.line(15, y, 195, y); y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const sign = tx.type === "deposit" || tx.type === "refund" ? "+" : tx.type === "adjustment" ? "" : "-";
    const rows: [string, string][] = [
      ["Type", TYPE_LABEL[tx.type] || tx.type],
      ["Payment Method", METHOD_LABEL[tx.payment_method || ""] || tx.payment_method || "—"],
      ["Amount", `${sign} ${fmt(Math.abs(Number(tx.amount)), tx.currency || "SAR")}`],
      ["Fees", fmt(Number(tx.fee_amount || 0), tx.currency || "SAR")],
      ["VAT (15%)", fmt(Number(tx.vat_amount || 0), tx.currency || "SAR")],
      ["Currency", tx.currency || "SAR"],
      ["Gateway Reference", tx.gateway_ref || "—"],
      ["Account / Card", tx.masked_account || "—"],
      ["Balance Before", tx.balance_before != null ? fmt(Number(tx.balance_before), tx.currency || "SAR") : "—"],
      ["Balance After", fmt(Number(tx.balance_after), tx.currency || "SAR")],
      ["Status", tx.reconciled ? "RECONCILED & LOCKED" : "PENDING RECONCILIATION"],
    ];
    rows.forEach(([k, v]) => {
      doc.setTextColor(100);
      doc.text(k, 18, y);
      doc.setTextColor(15, 23, 42);
      doc.text(String(v), 195, y, { align: "right" });
      y += 6;
    });

    if (tx.description) {
      y += 2;
      doc.setTextColor(100); doc.text("Description", 18, y); y += 5;
      doc.setTextColor(15, 23, 42);
      const lines = doc.splitTextToSize(tx.description, 175);
      doc.text(lines, 18, y); y += lines.length * 5;
    }

    y += 6;
    // Signature box
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
    doc.roundedRect(15, y, 180, 28, 2, 2, "FD");
    doc.setTextColor(6, 95, 70);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("DIGITAL SIGNATURE (SHA-256)", 20, y + 7);
    doc.setFont("courier", "normal");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    const hash = tx.signature_hash || "—";
    const hashLines = [hash.slice(0, 64), hash.slice(64)];
    hashLines.forEach((l, i) => doc.text(l, 20, y + 14 + i * 4));
    doc.setFontSize(7);
    doc.setTextColor(6, 95, 70);
    doc.text("This signature proves the transaction has not been tampered with.", 20, y + 25);
    y += 36;

    // Footer
    doc.setDrawColor(200);
    doc.line(15, 275, 195, 275);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("This is a system-generated official receipt. No signature required.", pageW / 2, 281, { align: "center" });
    doc.text("masteredupath.com  |  info@masteredupath.com", pageW / 2, 286, { align: "center" });
    doc.text(`Generated: ${new Date().toISOString()}`, pageW / 2, 291, { align: "center" });

    const pdfBytes = doc.output("arraybuffer");

    // رفع
    const path = `${tx.user_id}/${tx.receipt_number || tx.id}.pdf`;
    const { error: upErr } = await supabase.storage
      .from("receipts")
      .upload(path, new Uint8Array(pdfBytes), {
        contentType: "application/pdf",
        upsert: true,
      });
    if (upErr) {
      console.error("upload err", upErr);
      return resp({ success: false, error: upErr.message }, 500);
    }

    // تحديث المسار
    await supabase.from("wallet_transactions")
      .update({ receipt_pdf_path: path, receipt_generated_at: new Date().toISOString() })
      .eq("id", tx.id);

    // signed url
    const { data: signed } = await supabase.storage
      .from("receipts").createSignedUrl(path, 3600);

    return resp({ success: true, signedUrl: signed?.signedUrl, path });
  } catch (e: any) {
    console.error("generate-receipt-pdf", e);
    return resp({ success: false, error: e?.message || "خطأ" }, 500);
  }
});
