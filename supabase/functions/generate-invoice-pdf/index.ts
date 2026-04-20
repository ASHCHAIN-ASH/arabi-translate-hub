// Master Edu Path — ZATCA-style Tax Invoice PDF generator (premium design)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// === بيانات المنصة الرسمية ===
const PLATFORM = {
  nameAr: "وكالة ماستر إيدو باث",
  nameEn: "Master Edu Path Agency",
  legal: "تتبع لشركة علي صالح الشهري القابضة",
  domain: "masteredupath.com",
  website: "https://masteredupath.com",
  email: "info@masteredupath.com",
  whatsapp1: "0500776343",
  whatsapp2: "0559600824",
  address: "المملكة العربية السعودية — الرياض",
  cr: "—", // السجل التجاري (يمكن إضافته لاحقاً)
  vatNumber: "—", // الرقم الضريبي (يمكن إضافته لاحقاً عبر متغير بيئة)
};

// VAT rate (KSA = 15%)
const VAT_RATE = 0.15;

const NAVY = "#0a1f3d";
const GOLD = "#c9a961";
const CREAM = "#fdfbf5";
const INK = "#1a2540";
const MUTED = "#6b7a99";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PLATFORM_VAT = Deno.env.get("PLATFORM_VAT_NUMBER") || "";
const PLATFORM_CR = Deno.env.get("PLATFORM_CR_NUMBER") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

if (PLATFORM_VAT) PLATFORM.vatNumber = PLATFORM_VAT;
if (PLATFORM_CR) PLATFORM.cr = PLATFORM_CR;

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmtMoney = (n: number, c = "SAR") =>
  new Intl.NumberFormat("ar-SA", { style: "currency", currency: c, maximumFractionDigits: 2 }).format(Number(n) || 0);

const fmtDate = (d?: string | null) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("ar-SA-u-ca-gregory", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return String(d); }
};

const fmtDateTime = (d?: string | null) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleString("ar-SA-u-ca-gregory", { dateStyle: "long", timeStyle: "short" }); }
  catch { return String(d); }
};

// تنسيق رقم الجوال السعودي بشكل قابل للقراءة: 05XX XXX XXXX
function formatPhone(raw?: string | null): string {
  if (!raw) return "—";
  let p = String(raw).replace(/[^\d+]/g, "");
  // تطبيع: 966XXXXXXXXX → 0XXXXXXXXX
  if (p.startsWith("+966")) p = "0" + p.slice(4);
  else if (p.startsWith("00966")) p = "0" + p.slice(5);
  else if (p.startsWith("966") && p.length >= 12) p = "0" + p.slice(3);
  // تنسيق
  if (/^05\d{8}$/.test(p)) {
    return `${p.slice(0,4)} ${p.slice(4,7)} ${p.slice(7)}`;
  }
  return p;
}

interface InvoicePDFRequest {
  invoice_id: string;
  send_email?: boolean;
  recipient_email?: string;
  force?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { invoice_id, send_email = false, recipient_email, force = false } =
      (await req.json()) as InvoicePDFRequest;
    console.log("[invoice-pdf] generating", invoice_id, { force });

    const { data: invoice, error: invErr } = await supabase
      .from("invoices")
      .select("*, invoice_items (*)")
      .eq("id", invoice_id)
      .single();
    if (invErr || !invoice) throw new Error(`فشل العثور على الفاتورة: ${invErr?.message}`);

    if (!force && (invoice as any).pdf_storage_path) {
      const { data: signed } = await supabase.storage
        .from("invoices")
        .createSignedUrl((invoice as any).pdf_storage_path, 60 * 60 * 24 * 7);
      return json({
        success: true,
        message: "تم استخدام PDF موجود",
        invoice_number: invoice.invoice_number,
        pdf_storage_path: (invoice as any).pdf_storage_path,
        signed_url: signed?.signedUrl,
        content_type: "application/pdf",
      });
    }

    const enriched = await enrichInvoice(invoice);

    const { data: lastPayment } = await supabase
      .from("invoice_payments")
      .select("payment_method, reference_number, payment_date, amount, notes")
      .eq("invoice_id", invoice_id)
      .order("payment_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const html = buildInvoiceHTML(enriched, lastPayment);
    const pdfBytes = await renderPdfViaBrowserless(html);

    const storagePath = `${invoice.id}/${invoice.invoice_number || invoice.id}.pdf`;
    const { error: upErr } = await supabase.storage
      .from("invoices")
      .upload(storagePath, pdfBytes, { contentType: "application/pdf", upsert: true });
    if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

    await supabase
      .from("invoices")
      .update({ pdf_storage_path: storagePath, pdf_generated_at: new Date().toISOString() })
      .eq("id", invoice.id);

    const { data: signed } = await supabase.storage
      .from("invoices")
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

    if (send_email && recipient_email) {
      const base64PDF = btoa(String.fromCharCode(...pdfBytes));
      sendInvoiceEmail(invoice, base64PDF, recipient_email).catch((e) =>
        console.error("sendInvoiceEmail failed", e),
      );
    }

    return json({
      success: true,
      message: "تم إنشاء PDF الفاتورة بنجاح",
      invoice_number: invoice.invoice_number,
      pdf_storage_path: storagePath,
      signed_url: signed?.signedUrl,
      content_type: "application/pdf",
    });
  } catch (e: any) {
    console.error("[invoice-pdf] error", e);
    return json({ success: false, error: e?.message || "خطأ غير متوقع" }, 500);
  }
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function enrichInvoice(invoice: any) {
  const out = { ...invoice };

  let customerName = invoice.customer_name?.trim();
  let customerEmail = invoice.customer_email?.trim();
  let customerPhone = invoice.customer_phone?.trim();

  if (invoice.customer_id && (!customerName || !customerEmail)) {
    const { data: c } = await supabase
      .from("customers")
      .select("name, email, phone")
      .eq("id", invoice.customer_id)
      .maybeSingle();
    if (c) {
      customerName = customerName || c.name;
      customerEmail = customerEmail || c.email;
      customerPhone = customerPhone || c.phone;
    }
  }

  if (invoice.order_id && (!customerName || !customerPhone || !customerEmail)) {
    const { data: order } = await supabase
      .from("service_orders")
      .select("user_id, service_name, metadata, total_amount")
      .eq("id", invoice.order_id)
      .maybeSingle();
    if (order?.user_id) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", order.user_id)
        .maybeSingle();
      if (prof) {
        customerName = customerName || prof.full_name;
        customerPhone = customerPhone || prof.phone;
      }
      // محاولة جلب البريد من auth.users عبر admin API
      if (!customerEmail) {
        try {
          const { data: u } = await supabase.auth.admin.getUserById(order.user_id);
          if (u?.user?.email) customerEmail = u.user.email;
        } catch (_) {}
      }
    }
    if (order && !out.invoice_items?.length) {
      out.invoice_items = [{
        item_name: order.service_name || invoice.notes || "خدمة أكاديمية",
        description: invoice.notes || null,
        quantity: 1,
        unit_price: Number(invoice.subtotal || invoice.total_amount || 0),
        total_price: Number(invoice.subtotal || invoice.total_amount || 0),
      }];
    }
  }

  if (!out.invoice_items || !out.invoice_items.length) {
    out.invoice_items = [{
      item_name: invoice.notes || "خدمة أكاديمية متفق عليها",
      description: null,
      quantity: 1,
      unit_price: Number(invoice.subtotal || invoice.total_amount || 0),
      total_price: Number(invoice.subtotal || invoice.total_amount || 0),
    }];
  }

  out.customer_name = customerName || "—";
  out.customer_email = customerEmail || "—";
  out.customer_phone = customerPhone || "—";
  return out;
}

/**
 * حساب الضريبة بطريقة متوافقة مع هيئة الزكاة:
 * - إذا كانت tax_amount = 0 و total_amount موجود → نعتبر السعر شامل الضريبة 15%
 *   subtotal = total / 1.15 ، tax = total - subtotal
 * - وإلا نستخدم القيم المخزنة كما هي
 */
function computeVatBreakdown(inv: any) {
  const total = Number(inv.total_amount || 0);
  let subtotal = Number(inv.subtotal || 0);
  let tax = Number(inv.tax_amount || 0);
  const discount = Number(inv.discount_amount || 0);

  if (tax <= 0 && total > 0) {
    // افتراض: الإجمالي شامل الضريبة
    const taxableBase = total / (1 + VAT_RATE);
    tax = +(total - taxableBase).toFixed(2);
    subtotal = +taxableBase.toFixed(2);
  } else if (subtotal <= 0) {
    subtotal = Math.max(0, total - tax + discount);
  }

  return { subtotal, tax, discount, total };
}

function buildInvoiceHTML(inv: any, lastPayment: any): string {
  const currency = inv.currency || "SAR";
  const { subtotal, tax, discount, total } = computeVatBreakdown(inv);
  const paid = Number(inv.paid_amount || 0);
  const remaining = Math.max(0, total - paid);

  const isPaid = String(inv.status || "").toLowerCase() === "paid" || remaining <= 0;
  const statusBadge = isPaid
    ? `<div class="status paid">✓ مدفوعة بالكامل</div>`
    : remaining < total
      ? `<div class="status partial">● مدفوعة جزئياً</div>`
      : `<div class="status unpaid">● غير مدفوعة</div>`;

  const items: any[] = inv.invoice_items || [];
  // عرض الأسعار قبل الضريبة في جدول البنود (متوافق مع ZATCA)
  const totalItemsAmount = items.reduce((s, it) => s + Number(it.total_price || (it.quantity * it.unit_price) || 0), 0) || total;
  const itemsRows = items.map((it, i) => {
    const qty = Number(it.quantity || 1);
    // نحسب سعر الوحدة قبل الضريبة بنسبة من المجموع الفرعي
    const lineRaw = Number(it.total_price || qty * Number(it.unit_price || 0));
    const lineNet = totalItemsAmount > 0 ? +(subtotal * (lineRaw / totalItemsAmount)).toFixed(2) : lineRaw;
    const lineTax = +(lineNet * VAT_RATE).toFixed(2);
    const lineGross = +(lineNet + lineTax).toFixed(2);
    const unitNet = +(lineNet / qty).toFixed(2);
    return `
      <tr>
        <td class="c-num">${i + 1}</td>
        <td class="c-name">
          <div class="iname">${esc(it.item_name || "—")}</div>
          ${it.description ? `<div class="idesc">${esc(it.description)}</div>` : ""}
        </td>
        <td class="c-mid">${qty}</td>
        <td class="c-mid">${fmtMoney(unitNet, currency)}</td>
        <td class="c-mid">${fmtMoney(lineNet, currency)}</td>
        <td class="c-mid">${fmtMoney(lineTax, currency)}</td>
        <td class="c-end">${fmtMoney(lineGross, currency)}</td>
      </tr>`;
  }).join("");

  const watermark = isPaid ? `<div class="watermark">PAID</div>` : "";

  const paymentInfo = lastPayment
    ? `
      <div class="pay-card">
        <div class="pay-title">◆ تفاصيل عملية السداد</div>
        <table class="kv">
          <tr><td>طريقة الدفع</td><td><strong>${esc(humanPaymentMethod(lastPayment.payment_method))}</strong></td></tr>
          ${lastPayment.reference_number ? `<tr><td>الرقم المرجعي</td><td class="mono">${esc(lastPayment.reference_number)}</td></tr>` : ""}
          <tr><td>تاريخ السداد</td><td>${fmtDate(lastPayment.payment_date)}</td></tr>
          <tr><td>المبلغ المدفوع</td><td><strong>${fmtMoney(lastPayment.amount, currency)}</strong></td></tr>
          ${lastPayment.notes ? `<tr><td>ملاحظات</td><td>${esc(lastPayment.notes)}</td></tr>` : ""}
        </table>
      </div>`
    : `<div class="pay-card">
        <div class="pay-title">◆ طرق السداد المتاحة</div>
        <div style="font-size:12px;color:${MUTED};line-height:1.8">
          • الدفع الإلكتروني (Mada، Visa، Mastercard، Apple Pay)<br/>
          • التحويل البنكي المباشر<br/>
          • محفظة المنصة الإلكترونية<br/>
          عبر بوابة ${PLATFORM.domain}
        </div>
      </div>`;

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>فاتورة ضريبية ${esc(inv.invoice_number)} — ${esc(PLATFORM.nameAr)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&family=Aref+Ruqaa:wght@700&display=swap" rel="stylesheet">
<style>
  :root{ --navy:${NAVY}; --gold:${GOLD}; --cream:${CREAM}; --ink:${INK}; --muted:${MUTED}; }
  *{ box-sizing:border-box; margin:0; padding:0; }
  @page{ size:A4; margin:0; }
  html,body{ background:#fff; color:var(--ink);
    font-family:'IBM Plex Sans Arabic',Tajawal,system-ui,sans-serif;
    line-height:1.65; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .page{ width:210mm; min-height:297mm; padding:12mm 12mm 14mm; background:var(--cream);
    position:relative; overflow:hidden; }
  .corner-tl{ position:absolute; top:0; right:0; width:220px; height:220px;
    background:radial-gradient(circle at top right,var(--navy) 0%,transparent 70%); opacity:.07; pointer-events:none; }
  .corner-br{ position:absolute; bottom:0; left:0; width:260px; height:260px;
    background:radial-gradient(circle at bottom left,var(--gold) 0%,transparent 70%); opacity:.13; pointer-events:none; }
  .watermark{ position:absolute; top:46%; left:50%; transform:translate(-50%,-50%) rotate(-22deg);
    font-size:170px; font-weight:900; color:rgba(22,163,74,.08); letter-spacing:.18em;
    pointer-events:none; user-select:none; z-index:0; border:8px solid rgba(22,163,74,.08); padding:10px 50px; border-radius:24px; }

  /* === HEADER === */
  header.brand{ display:grid; grid-template-columns:1.2fr 1fr; gap:18px; align-items:center;
    padding-bottom:14px; border-bottom:3px solid var(--navy); position:relative; z-index:1; }
  header.brand::after{ content:""; position:absolute; right:0; bottom:-6px; width:160px; height:3px; background:var(--gold); }
  .brand-left{ display:flex; gap:14px; align-items:center; }
  .logo{ width:72px; height:72px; border-radius:16px;
    background:linear-gradient(135deg,var(--navy) 0%,#16315c 100%);
    color:var(--gold); display:flex; align-items:center; justify-content:center;
    font-family:'Aref Ruqaa',serif; font-size:24px; font-weight:700;
    border:2px solid var(--gold); box-shadow:0 6px 18px rgba(10,31,61,.28); }
  .brand-text h1{ font-size:21px; color:var(--navy); margin:0 0 2px; line-height:1.2; }
  .brand-text .en{ font-size:10.5px; color:var(--gold); letter-spacing:.22em; font-weight:700; }
  .brand-text .legal{ font-size:11px; color:var(--muted); margin-top:3px; }
  .brand-text .ids{ font-size:10.5px; color:var(--muted); margin-top:4px; font-family:ui-monospace,Menlo,monospace; }

  .doc-title{ text-align:left; }
  .doc-title h2{ font-size:26px; color:var(--navy); margin:0; line-height:1.05; }
  .doc-title .en{ color:var(--gold); font-size:11px; letter-spacing:.3em; font-weight:700; margin-top:4px; }
  .doc-title .zatca{ font-size:10px; color:var(--muted); margin-top:4px; letter-spacing:.05em; }
  .status{ display:inline-block; margin-top:8px; padding:6px 18px; border-radius:24px;
    font-size:12px; font-weight:700; letter-spacing:.05em; }
  .status.paid{ background:#16a34a; color:#fff; box-shadow:0 4px 12px rgba(22,163,74,.35); }
  .status.partial{ background:#d97706; color:#fff; }
  .status.unpaid{ background:#dc2626; color:#fff; }

  /* === META STRIP === */
  .meta-strip{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:14px 0;
    background:linear-gradient(135deg,var(--navy) 0%,#16315c 100%); color:#fff;
    border-radius:12px; padding:12px 14px; border:1px solid var(--gold); position:relative; z-index:1; }
  .meta-strip .item{ text-align:center; padding:0 6px; border-left:1px solid rgba(201,169,97,.35); }
  .meta-strip .item:last-child{ border-left:0; }
  .meta-strip .lbl{ font-size:10px; color:var(--gold); letter-spacing:.08em; font-weight:600; margin-bottom:4px; }
  .meta-strip .val{ font-size:13px; font-weight:700; color:#fff; font-family:ui-monospace,Menlo,monospace; }
  .meta-strip .val.ar{ font-family:'IBM Plex Sans Arabic',sans-serif; }

  /* === PARTIES === */
  .parties{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; position:relative; z-index:1; }
  .party{ background:#fff; border:1px solid rgba(201,169,97,.4); border-radius:10px;
    padding:11px 13px; box-shadow:0 2px 8px rgba(10,31,61,.05); }
  .party .head{ display:flex; align-items:center; gap:8px; padding-bottom:7px;
    border-bottom:2px solid var(--gold); margin-bottom:7px; }
  .party .icon{ width:26px; height:26px; border-radius:8px; background:var(--navy); color:var(--gold);
    display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; }
  .party .ttl{ font-size:13px; font-weight:700; color:var(--navy); }
  .party table{ width:100%; border-collapse:collapse; font-size:12px; }
  .party td{ padding:2px 0; vertical-align:top; }
  .party td.k{ color:var(--muted); width:32%; padding-left:8px; font-size:11px; }
  .party td.v{ color:var(--ink); font-weight:600; }
  .party td.v.mono{ font-family:ui-monospace,Menlo,monospace; font-size:11.5px; direction:ltr; text-align:right; unicode-bidi:plaintext; }

  /* === ITEMS TABLE === */
  table.items{ width:100%; border-collapse:separate; border-spacing:0;
    margin-bottom:12px; border-radius:10px; overflow:hidden;
    border:1px solid rgba(201,169,97,.35); position:relative; z-index:1;
    box-shadow:0 3px 14px rgba(10,31,61,.07); }
  table.items th{ background:var(--navy); color:var(--gold); padding:10px 8px;
    font-size:11px; font-weight:700; letter-spacing:.04em; text-align:center; }
  table.items th.c-num{ width:34px; }
  table.items th.c-name{ text-align:right; padding-right:12px; }
  table.items td{ padding:10px 8px; border-bottom:1px solid rgba(201,169,97,.18);
    background:#fff; font-size:11.5px; vertical-align:middle; }
  table.items tr:last-child td{ border-bottom:0; }
  table.items tr:nth-child(even) td{ background:#fbf9f3; }
  table.items td.c-num{ text-align:center; color:var(--muted); font-weight:700; }
  table.items td.c-mid{ text-align:center; font-family:ui-monospace,Menlo,monospace; }
  table.items td.c-end{ text-align:center; font-weight:700; color:var(--navy); font-family:ui-monospace,Menlo,monospace; background:#fdf6e3 !important; }
  td.c-name .iname{ font-weight:700; color:var(--navy); margin-bottom:2px; font-size:12px; }
  td.c-name .idesc{ font-size:10.5px; color:var(--muted); }

  /* === TOTALS === */
  .totals-wrap{ display:grid; grid-template-columns:1fr 320px; gap:12px;
    margin-bottom:12px; position:relative; z-index:1; align-items:start; }
  .pay-card{ background:#fff; border:1px solid rgba(201,169,97,.35); border-right:4px solid var(--gold);
    border-radius:10px; padding:12px 14px; }
  .pay-card .pay-title{ color:var(--navy); font-weight:700; font-size:13px; margin-bottom:8px; padding-bottom:6px; border-bottom:1px dashed rgba(201,169,97,.5); }
  .pay-card .kv{ width:100%; border-collapse:collapse; font-size:12px; }
  .pay-card .kv td{ padding:4px 0; }
  .pay-card .kv td:first-child{ color:var(--muted); width:42%; }
  .pay-card .kv .mono{ font-family:ui-monospace,Menlo,monospace; font-size:11px; }

  .totals{ background:linear-gradient(180deg,#fff 0%,${CREAM} 100%);
    border:1px solid rgba(201,169,97,.55); border-radius:10px; padding:12px 14px;
    box-shadow:0 4px 14px rgba(10,31,61,.08); }
  .totals .row{ display:flex; justify-content:space-between; align-items:center;
    padding:5px 0; font-size:12.5px; }
  .totals .row .k{ color:var(--muted); }
  .totals .row .v{ color:var(--navy); font-weight:700; font-family:ui-monospace,Menlo,monospace; }
  .totals .row.muted .v{ color:#dc2626; }
  .totals .row.vat{ background:rgba(201,169,97,.12); padding:6px 8px; border-radius:6px; margin:2px 0; }
  .totals .row.vat .k{ color:var(--navy); font-weight:700; }
  .totals .divider{ height:1px; background:rgba(201,169,97,.4); margin:6px 0; }
  .totals .grand{ background:var(--navy); color:var(--gold); margin:8px -14px -12px;
    padding:14px 16px; border-radius:0 0 10px 10px;
    display:flex; justify-content:space-between; align-items:center; }
  .totals .grand .k{ font-size:13px; font-weight:700; letter-spacing:.05em; }
  .totals .grand .v{ font-size:18px; font-weight:800; font-family:ui-monospace,Menlo,monospace; }
  .totals .paid-line{ background:rgba(22,163,74,.12); color:#15803d; padding:6px 10px;
    border-radius:6px; margin-top:8px; font-size:12px; display:flex; justify-content:space-between; }
  .totals .paid-line.due{ background:rgba(220,38,38,.1); color:#b91c1c; }
  .totals .paid-line .v{ font-weight:700; font-family:ui-monospace,Menlo,monospace; }

  /* === NOTES + FOOTER === */
  .info-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; position:relative; z-index:1; }
  .note{ background:#fff; border:1px solid rgba(201,169,97,.25); border-radius:8px; padding:10px 12px; font-size:11px; color:var(--ink); line-height:1.7; }
  .note .ttl{ font-weight:700; color:var(--navy); margin-bottom:4px; font-size:12px; }
  .note .ttl::before{ content:"◆ "; color:var(--gold); }

  .zatca-bar{ display:flex; justify-content:space-between; align-items:center;
    background:#fff; border:1px dashed var(--gold); border-radius:8px; padding:8px 14px;
    margin-bottom:10px; font-size:11px; color:var(--muted); position:relative; z-index:1; }
  .zatca-bar b{ color:var(--navy); font-family:ui-monospace,Menlo,monospace; }

  footer.doc{ position:relative; z-index:1; margin-top:8px; padding-top:12px;
    border-top:2px solid var(--gold);
    display:grid; grid-template-columns:1fr 1.4fr 1fr; gap:12px; align-items:center;
    font-size:10.5px; color:var(--muted); }
  footer.doc .num{ font-family:ui-monospace,Menlo,monospace; font-weight:700;
    color:var(--navy); border:1px solid var(--gold); padding:6px 10px; border-radius:6px; text-align:center; font-size:11px; }
  footer.doc .center{ text-align:center; line-height:1.6; }
  footer.doc .center b{ color:var(--navy); display:block; font-size:11.5px; }
  footer.doc .right{ text-align:left; line-height:1.7; }
  footer.doc .right .url{ color:var(--navy); font-weight:700; }
  .thanks{ text-align:center; margin:10px 0 6px; padding:9px;
    background:linear-gradient(135deg,rgba(201,169,97,.15),rgba(10,31,61,.04));
    border-radius:8px; color:var(--navy); font-weight:600; font-size:12px;
    border:1px solid rgba(201,169,97,.4); position:relative; z-index:1; }
</style>
</head>
<body>
<div class="page">
  <div class="corner-tl"></div>
  <div class="corner-br"></div>
  ${watermark}

  <header class="brand">
    <div class="brand-left">
      <div class="logo">MEP</div>
      <div class="brand-text">
        <h1>${esc(PLATFORM.nameAr)}</h1>
        <div class="en">${esc(PLATFORM.nameEn.toUpperCase())}</div>
        <div class="legal">${esc(PLATFORM.legal)}</div>
        <div class="ids">س.ت: ${esc(PLATFORM.cr)} • الرقم الضريبي: ${esc(PLATFORM.vatNumber)}</div>
      </div>
    </div>
    <div class="doc-title">
      <h2>فاتورة ضريبية</h2>
      <div class="en">SIMPLIFIED TAX INVOICE</div>
      <div class="zatca">متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA)</div>
      ${statusBadge}
    </div>
  </header>

  <div class="meta-strip">
    <div class="item">
      <div class="lbl">رقم الفاتورة</div>
      <div class="val">${esc(inv.invoice_number)}</div>
    </div>
    <div class="item">
      <div class="lbl">تاريخ الإصدار</div>
      <div class="val ar">${fmtDate(inv.issue_date || inv.created_at)}</div>
    </div>
    <div class="item">
      <div class="lbl">${isPaid ? "تاريخ السداد" : "تاريخ الاستحقاق"}</div>
      <div class="val ar">${fmtDate(isPaid ? inv.paid_at : inv.due_date)}</div>
    </div>
    <div class="item">
      <div class="lbl">العملة</div>
      <div class="val">${esc(currency)}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="head"><div class="icon">M</div><div class="ttl">البائع / مُصدِر الفاتورة</div></div>
      <table>
        <tr><td class="k">الجهة:</td><td class="v">${esc(PLATFORM.nameAr)}</td></tr>
        <tr><td class="k">الكيان:</td><td class="v" style="font-size:11px">${esc(PLATFORM.legal)}</td></tr>
        <tr><td class="k">الرقم الضريبي:</td><td class="v mono">${esc(PLATFORM.vatNumber)}</td></tr>
        <tr><td class="k">السجل التجاري:</td><td class="v mono">${esc(PLATFORM.cr)}</td></tr>
        <tr><td class="k">الموقع:</td><td class="v mono">${esc(PLATFORM.domain)}</td></tr>
        <tr><td class="k">البريد:</td><td class="v mono">${esc(PLATFORM.email)}</td></tr>
        <tr><td class="k">واتساب:</td><td class="v mono">${esc(PLATFORM.whatsapp1)} • ${esc(PLATFORM.whatsapp2)}</td></tr>
        <tr><td class="k">العنوان:</td><td class="v">${esc(PLATFORM.address)}</td></tr>
      </table>
    </div>
    <div class="party">
      <div class="head"><div class="icon">C</div><div class="ttl">المشتري / فاتورة إلى</div></div>
      <table>
        <tr><td class="k">الاسم:</td><td class="v">${esc(inv.customer_name)}</td></tr>
        <tr><td class="k">الجوال:</td><td class="v mono">${esc(formatPhone(inv.customer_phone))}</td></tr>
        <tr><td class="k">البريد:</td><td class="v mono">${esc(inv.customer_email)}</td></tr>
        ${inv.order_id ? `<tr><td class="k">رقم الطلب:</td><td class="v mono">${esc(String(inv.order_id).slice(0,8))}</td></tr>` : ""}
      </table>
    </div>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th class="c-num">#</th>
        <th class="c-name">وصف الخدمة / البند</th>
        <th>الكمية</th>
        <th>سعر الوحدة</th>
        <th>الإجمالي قبل الضريبة</th>
        <th>ضريبة 15%</th>
        <th>الإجمالي شامل الضريبة</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div class="totals-wrap">
    ${paymentInfo}
    <div class="totals">
      <div class="row"><span class="k">المجموع الفرعي (قبل الضريبة)</span><span class="v">${fmtMoney(subtotal, currency)}</span></div>
      ${discount > 0 ? `<div class="row muted"><span class="k">الخصم</span><span class="v">- ${fmtMoney(discount, currency)}</span></div>` : ""}
      <div class="row vat"><span class="k">ضريبة القيمة المضافة (15%)</span><span class="v">${fmtMoney(tax, currency)}</span></div>
      <div class="divider"></div>
      <div class="grand"><span class="k">الإجمالي شامل الضريبة</span><span class="v">${fmtMoney(total, currency)}</span></div>
      ${paid > 0 ? `<div class="paid-line"><span>✓ المدفوع</span><span class="v">${fmtMoney(paid, currency)}</span></div>` : ""}
      ${remaining > 0 ? `<div class="paid-line due"><span>● المتبقي</span><span class="v">${fmtMoney(remaining, currency)}</span></div>` : ""}
    </div>
  </div>

  <div class="zatca-bar">
    <span>📋 رقم مرجعي للفاتورة: <b>${esc(inv.invoice_number)}</b></span>
    <span>الإجمالي بالحروف: <b>${esc(numberToArabicWords(total))} ${currency === "SAR" ? "ريال سعودي" : currency} لا غير</b></span>
  </div>

  ${(inv.notes || inv.terms) ? `
  <div class="info-grid">
    ${inv.notes ? `<div class="note"><div class="ttl">ملاحظات</div><div>${esc(inv.notes)}</div></div>` : ""}
    ${inv.terms ? `<div class="note"><div class="ttl">شروط الدفع</div><div>${esc(inv.terms)}</div></div>` : ""}
  </div>` : ""}

  <div class="thanks">
    شكراً لثقتكم بـ ${PLATFORM.nameAr} — نتشرّف بخدمتكم دائماً 🌟
  </div>

  <footer class="doc">
    <div class="num">${esc(inv.invoice_number)}</div>
    <div class="center">
      <b>${esc(PLATFORM.nameAr)}</b>
      ${esc(PLATFORM.legal)} • © ${new Date().getFullYear()}
      <div style="margin-top:3px;font-size:10px">فاتورة إلكترونية صادرة وفق نظام الفوترة الإلكترونية بالمملكة العربية السعودية</div>
    </div>
    <div class="right">
      <div class="url">${esc(PLATFORM.domain)}</div>
      <div>${esc(PLATFORM.email)}</div>
      <div>${esc(PLATFORM.whatsapp1)}</div>
    </div>
  </footer>
</div>
</body>
</html>`;
}

function humanPaymentMethod(m?: string | null): string {
  const map: Record<string, string> = {
    card: "بطاقة بنكية (Mada / Visa / Mastercard)",
    apple_pay: "Apple Pay",
    bank_transfer: "تحويل بنكي مباشر",
    cash: "نقداً",
    wallet: "محفظة المنصة الإلكترونية",
    moyasar: "بطاقة بنكية عبر بوابة ميسر",
    paytabs: "بطاقة بنكية عبر بوابة PayTabs",
    online: "دفع إلكتروني",
    check: "شيك",
    other: "طريقة أخرى",
  };
  return m ? (map[m] || m) : "دفع إلكتروني";
}

// تحويل بسيط للأرقام إلى الحروف العربية (مبسّط — يدعم حتى 999,999)
function numberToArabicWords(num: number): string {
  if (!num || num <= 0) return "صفر";
  const n = Math.round(num);
  const ones = ["","واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة","عشرة","أحد عشر","اثنا عشر","ثلاثة عشر","أربعة عشر","خمسة عشر","ستة عشر","سبعة عشر","ثمانية عشر","تسعة عشر"];
  const tens = ["","","عشرون","ثلاثون","أربعون","خمسون","ستون","سبعون","ثمانون","تسعون"];
  const hundreds = ["","مائة","مائتان","ثلاثمائة","أربعمائة","خمسمائة","ستمائة","سبعمائة","ثمانمائة","تسعمائة"];

  function under1000(x: number): string {
    if (x === 0) return "";
    const h = Math.floor(x / 100);
    const r = x % 100;
    let out = "";
    if (h) out += hundreds[h];
    if (r) {
      if (out) out += " و";
      if (r < 20) out += ones[r];
      else {
        const o = r % 10, t = Math.floor(r / 10);
        if (o) out += ones[o] + " و" + tens[t];
        else out += tens[t];
      }
    }
    return out;
  }

  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  let result = "";
  if (thousands === 1) result = "ألف";
  else if (thousands === 2) result = "ألفان";
  else if (thousands >= 3 && thousands <= 10) result = ones[thousands] + " آلاف";
  else if (thousands > 10) result = under1000(thousands) + " ألف";
  if (rest) result += (result ? " و" : "") + under1000(rest);
  return result || "صفر";
}

async function renderPdfViaBrowserless(html: string): Promise<Uint8Array> {
  const apiKey = Deno.env.get("BROWSERLESS_API_KEY");
  if (!apiKey) throw new Error("BROWSERLESS_API_KEY غير مُعَدّ");
  const endpoint = `https://production-sfo.browserless.io/pdf?token=${encodeURIComponent(apiKey)}`;
  const resp = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      html,
      options: {
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
        displayHeaderFooter: false,
      },
      gotoOptions: { waitUntil: "networkidle0", timeout: 30000 },
      waitForTimeout: 800,
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Browserless ${resp.status}: ${text.slice(0, 300)}`);
  }
  return new Uint8Array(await resp.arrayBuffer());
}

async function sendInvoiceEmail(_invoice: any, _base64PDF: string, _to: string) {
  return;
}

serve(handler);
