// Master U Path — Invoice PDF generator (premium design, real PDF via Browserless)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM = {
  nameAr: "وكالة ماستر إيدو باث",
  nameEn: "Master Edu Path Agency",
  legal: "تتبع لشركة علي صالح الشهري القابضة",
  domain: "masteredupath.com",
  email: "info@masteredupath.com",
  phone: "+966 50 246 3367",
  address: "المملكة العربية السعودية — الرياض",
  jurisdiction: "المملكة العربية السعودية",
};

const NAVY = "#0a1f3d";
const GOLD = "#c9a961";
const CREAM = "#fdfbf5";
const INK = "#1a2540";
const MUTED = "#6b7a99";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmtMoney = (n: number, c = "SAR") =>
  new Intl.NumberFormat("ar-SA", { style: "currency", currency: c, maximumFractionDigits: 2 }).format(Number(n) || 0);

const fmtDate = (d?: string | null) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return String(d); }
};

const fmtDateTime = (d?: string | null) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleString("ar-SA", { dateStyle: "long", timeStyle: "short" }); }
  catch { return String(d); }
};

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

    // 1) جلب الفاتورة + البنود
    const { data: invoice, error: invErr } = await supabase
      .from("invoices")
      .select("*, invoice_items (*)")
      .eq("id", invoice_id)
      .single();
    if (invErr || !invoice) throw new Error(`فشل العثور على الفاتورة: ${invErr?.message}`);

    // 2) إعادة استخدام PDF موجود عند الطلب (إلا إذا force)
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

    // 3) إثراء بيانات العميل من profiles / customers / orders إذا ناقصة
    const enriched = await enrichInvoice(invoice);

    // 4) جلب آخر دفعة للمرجعية
    const { data: lastPayment } = await supabase
      .from("invoice_payments")
      .select("payment_method, reference_number, payment_date, amount")
      .eq("invoice_id", invoice_id)
      .order("payment_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 5) توليد HTML
    const html = buildInvoiceHTML(enriched, lastPayment);

    // 6) Browserless → PDF
    const pdfBytes = await renderPdfViaBrowserless(html);

    // 7) رفع للتخزين
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

    // 8) إيميل اختياري
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

  // استكمال بيانات العميل
  let customerName = invoice.customer_name?.trim();
  let customerEmail = invoice.customer_email?.trim();
  let customerPhone = invoice.customer_phone?.trim();

  // محاولة من جدول customers
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

  // محاولة من service_orders + profiles
  if (invoice.order_id && (!customerName || !customerPhone)) {
    const { data: order } = await supabase
      .from("service_orders")
      .select("user_id, service_name, metadata")
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
    }
    if (order && !out.invoice_items?.length) {
      // لو ما فيه بنود — نحط بند افتراضي بناءً على اسم الخدمة
      out.invoice_items = [{
        item_name: order.service_name || invoice.notes || "خدمة أكاديمية",
        description: invoice.notes || null,
        quantity: 1,
        unit_price: Number(invoice.subtotal || invoice.total_amount || 0),
        total_price: Number(invoice.subtotal || invoice.total_amount || 0),
      }];
    }
  }

  // لو لازال ما فيه بنود — نحط بند افتراضي عام
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

function buildInvoiceHTML(inv: any, lastPayment: any): string {
  const currency = inv.currency || "SAR";
  const subtotal = Number(inv.subtotal || 0) || Number(inv.total_amount || 0);
  const tax = Number(inv.tax_amount || 0);
  const discount = Number(inv.discount_amount || 0);
  const total = Number(inv.total_amount || 0);
  const paid = Number(inv.paid_amount || 0);
  const remaining = Math.max(0, total - paid);

  const isPaid = String(inv.status || "").toLowerCase() === "paid" || remaining <= 0;
  const statusBadge = isPaid
    ? `<div class="status paid">✓ مدفوعة</div>`
    : remaining < total
      ? `<div class="status partial">● مدفوعة جزئياً</div>`
      : `<div class="status unpaid">● غير مدفوعة</div>`;

  const items: any[] = inv.invoice_items || [];
  const itemsRows = items.map((it, i) => {
    const qty = Number(it.quantity || 1);
    const unit = Number(it.unit_price || 0);
    const line = Number(it.total_price || qty * unit);
    return `
      <tr>
        <td class="c-num">${i + 1}</td>
        <td class="c-name">
          <div class="iname">${esc(it.item_name || "—")}</div>
          ${it.description ? `<div class="idesc">${esc(it.description)}</div>` : ""}
        </td>
        <td class="c-mid">${qty}</td>
        <td class="c-mid">${fmtMoney(unit, currency)}</td>
        <td class="c-end">${fmtMoney(line, currency)}</td>
      </tr>`;
  }).join("");

  const watermark = isPaid
    ? `<div class="watermark">PAID</div>`
    : "";

  const paymentInfo = lastPayment
    ? `
      <div class="pay-card">
        <div class="pay-title">◆ تفاصيل آخر دفعة</div>
        <table class="kv">
          <tr><td>طريقة الدفع</td><td><strong>${esc(humanPaymentMethod(lastPayment.payment_method))}</strong></td></tr>
          ${lastPayment.reference_number ? `<tr><td>الرقم المرجعي</td><td class="mono">${esc(lastPayment.reference_number)}</td></tr>` : ""}
          <tr><td>التاريخ</td><td>${fmtDateTime(lastPayment.payment_date)}</td></tr>
          <tr><td>المبلغ</td><td><strong>${fmtMoney(lastPayment.amount, currency)}</strong></td></tr>
        </table>
      </div>`
    : "";

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>فاتورة ${esc(inv.invoice_number)} — ${esc(PLATFORM.nameAr)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Aref+Ruqaa:wght@700&display=swap" rel="stylesheet">
<style>
  :root{ --navy:${NAVY}; --gold:${GOLD}; --cream:${CREAM}; --ink:${INK}; --muted:${MUTED}; }
  *{ box-sizing:border-box; margin:0; padding:0; }
  @page{ size:A4; margin:0; }
  html,body{ background:#fff; color:var(--ink);
    font-family:'IBM Plex Sans Arabic',Tajawal,system-ui,sans-serif;
    line-height:1.7; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .page{ width:210mm; min-height:297mm; padding:14mm 13mm; background:var(--cream);
    position:relative; overflow:hidden; }
  .corner-tl{ position:absolute; top:0; right:0; width:200px; height:200px;
    background:linear-gradient(225deg,var(--navy) 0%,transparent 70%); opacity:.06; pointer-events:none; }
  .corner-br{ position:absolute; bottom:0; left:0; width:240px; height:240px;
    background:linear-gradient(45deg,var(--gold) 0%,transparent 70%); opacity:.10; pointer-events:none; }
  .watermark{ position:absolute; top:42%; left:50%; transform:translate(-50%,-50%) rotate(-22deg);
    font-size:160px; font-weight:900; color:${GOLD}1f; letter-spacing:.18em;
    pointer-events:none; user-select:none; z-index:0; }

  /* HEADER */
  header.brand{ display:grid; grid-template-columns:1fr 1fr; gap:18px; align-items:center;
    padding-bottom:16px; border-bottom:3px solid var(--navy); position:relative; z-index:1; }
  header.brand::after{ content:""; position:absolute; right:0; bottom:-6px; width:140px; height:3px; background:var(--gold); }
  .brand-left{ display:flex; gap:14px; align-items:center; }
  .logo{ width:64px; height:64px; border-radius:14px;
    background:linear-gradient(135deg,var(--navy) 0%,#16315c 100%);
    color:var(--gold); display:flex; align-items:center; justify-content:center;
    font-family:'Aref Ruqaa',serif; font-size:22px; font-weight:700;
    border:2px solid var(--gold); box-shadow:0 4px 14px rgba(10,31,61,.25); }
  .brand-text h1{ font-size:20px; color:var(--navy); margin:0 0 2px; }
  .brand-text .en{ font-size:10.5px; color:var(--gold); letter-spacing:.22em; font-weight:700; }
  .brand-text .legal{ font-size:11px; color:var(--muted); margin-top:4px; }

  .doc-title{ text-align:left; }
  .doc-title h2{ font-size:30px; color:var(--navy); margin:0; line-height:1; }
  .doc-title .en{ color:var(--gold); font-size:11px; letter-spacing:.3em; font-weight:700; margin-top:4px; }
  .status{ display:inline-block; margin-top:10px; padding:6px 16px; border-radius:24px;
    font-size:12px; font-weight:700; letter-spacing:.05em; }
  .status.paid{ background:#16a34a; color:#fff; }
  .status.partial{ background:#d97706; color:#fff; }
  .status.unpaid{ background:#dc2626; color:#fff; }

  /* META STRIP */
  .meta-strip{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin:18px 0;
    background:linear-gradient(135deg,var(--navy) 0%,#16315c 100%); color:#fff;
    border-radius:12px; padding:14px 16px; border:1px solid var(--gold); position:relative; z-index:1; }
  .meta-strip .item{ text-align:center; padding:0 8px; border-left:1px solid ${GOLD}55; }
  .meta-strip .item:last-child{ border-left:0; }
  .meta-strip .lbl{ font-size:10.5px; color:var(--gold); letter-spacing:.1em; font-weight:600; margin-bottom:4px; }
  .meta-strip .val{ font-size:14px; font-weight:700; color:#fff; font-family:ui-monospace,Menlo,monospace; }
  .meta-strip .val.ar{ font-family:'IBM Plex Sans Arabic',sans-serif; }

  /* PARTIES */
  .parties{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; position:relative; z-index:1; }
  .party{ background:#fff; border:1px solid ${GOLD}66; border-radius:10px;
    padding:12px 14px; box-shadow:0 2px 8px rgba(10,31,61,.04); }
  .party .head{ display:flex; align-items:center; gap:8px; padding-bottom:8px;
    border-bottom:2px solid var(--gold); margin-bottom:8px; }
  .party .icon{ width:28px; height:28px; border-radius:8px; background:var(--navy); color:var(--gold);
    display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; }
  .party .ttl{ font-size:13px; font-weight:700; color:var(--navy); }
  .party table{ width:100%; border-collapse:collapse; font-size:12.5px; }
  .party td{ padding:3px 0; vertical-align:top; }
  .party td.k{ color:var(--muted); width:35%; padding-left:8px; font-size:11.5px; }
  .party td.v{ color:var(--ink); font-weight:600; }
  .party td.v.mono{ font-family:ui-monospace,Menlo,monospace; font-size:11.5px; }

  /* ITEMS TABLE */
  table.items{ width:100%; border-collapse:separate; border-spacing:0;
    margin-bottom:14px; border-radius:10px; overflow:hidden;
    border:1px solid ${GOLD}55; position:relative; z-index:1;
    box-shadow:0 2px 12px rgba(10,31,61,.06); }
  table.items th{ background:var(--navy); color:var(--gold); padding:11px 10px;
    font-size:12px; font-weight:700; letter-spacing:.05em; text-align:right; }
  table.items th.c-num{ width:42px; text-align:center; }
  table.items th.c-mid{ width:78px; text-align:center; }
  table.items th.c-end{ width:120px; text-align:left; }
  table.items td{ padding:11px 10px; border-bottom:1px solid ${GOLD}22;
    background:#fff; font-size:12.5px; }
  table.items tr:last-child td{ border-bottom:0; }
  table.items tr:nth-child(even) td{ background:#fbf9f3; }
  table.items td.c-num{ text-align:center; color:var(--muted); font-weight:700; }
  table.items td.c-mid{ text-align:center; }
  table.items td.c-end{ text-align:left; font-weight:700; color:var(--navy); font-family:ui-monospace,Menlo,monospace; }
  td.c-name .iname{ font-weight:700; color:var(--navy); margin-bottom:2px; }
  td.c-name .idesc{ font-size:11px; color:var(--muted); }

  /* TOTALS */
  .totals-wrap{ display:grid; grid-template-columns:1fr 320px; gap:12px;
    margin-bottom:14px; position:relative; z-index:1; }
  .pay-card{ background:#fff; border:1px solid ${GOLD}55; border-right:4px solid var(--gold);
    border-radius:10px; padding:12px 14px; }
  .pay-card .pay-title{ color:var(--navy); font-weight:700; font-size:13px; margin-bottom:8px; }
  .pay-card .kv{ width:100%; border-collapse:collapse; font-size:12px; }
  .pay-card .kv td{ padding:3px 0; }
  .pay-card .kv td:first-child{ color:var(--muted); width:45%; }
  .pay-card .kv .mono{ font-family:ui-monospace,Menlo,monospace; font-size:11px; }

  .totals{ background:linear-gradient(180deg,#fff 0%,${CREAM} 100%);
    border:1px solid ${GOLD}88; border-radius:10px; padding:14px 16px;
    box-shadow:0 4px 14px rgba(10,31,61,.08); }
  .totals .row{ display:flex; justify-content:space-between; align-items:center;
    padding:6px 0; font-size:13px; }
  .totals .row .k{ color:var(--muted); }
  .totals .row .v{ color:var(--navy); font-weight:700; font-family:ui-monospace,Menlo,monospace; }
  .totals .row.muted .v{ color:var(--muted); }
  .totals .divider{ height:1px; background:${GOLD}55; margin:6px 0; }
  .totals .grand{ background:var(--navy); color:var(--gold); margin:8px -16px -14px;
    padding:14px 16px; border-radius:0 0 10px 10px;
    display:flex; justify-content:space-between; align-items:center; }
  .totals .grand .k{ font-size:13px; font-weight:700; letter-spacing:.05em; }
  .totals .grand .v{ font-size:18px; font-weight:700; font-family:ui-monospace,Menlo,monospace; }
  .totals .paid-line{ background:#16a34a15; color:#15803d; padding:6px 10px;
    border-radius:6px; margin-top:8px; font-size:12px; display:flex; justify-content:space-between; }
  .totals .paid-line .v{ font-weight:700; font-family:ui-monospace,Menlo,monospace; }

  /* NOTES + FOOTER */
  .info-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; position:relative; z-index:1; }
  .note{ background:#fff; border:1px solid ${GOLD}33; border-radius:8px; padding:10px 12px; font-size:11.5px; color:var(--ink); }
  .note .ttl{ font-weight:700; color:var(--navy); margin-bottom:4px; font-size:12px; }
  .note .ttl::before{ content:"◆ "; color:var(--gold); }

  footer.doc{ position:relative; z-index:1; margin-top:auto; padding-top:14px;
    border-top:2px solid var(--gold);
    display:grid; grid-template-columns:1fr 1.4fr 1fr; gap:12px; align-items:center;
    font-size:11px; color:var(--muted); }
  footer.doc .num{ font-family:ui-monospace,Menlo,monospace; font-weight:700;
    color:var(--navy); border:1px solid var(--gold); padding:6px 10px; border-radius:6px; text-align:center; }
  footer.doc .center{ text-align:center; line-height:1.6; }
  footer.doc .center b{ color:var(--navy); display:block; font-size:12px; }
  footer.doc .right{ text-align:left; line-height:1.6; }
  footer.doc .right .url{ color:var(--navy); font-weight:700; }
  .thanks{ text-align:center; margin:14px 0 6px; padding:10px;
    background:linear-gradient(135deg,${GOLD}1a,${NAVY}08);
    border-radius:8px; color:var(--navy); font-weight:600; font-size:12px;
    border:1px solid ${GOLD}55; position:relative; z-index:1; }
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
      </div>
    </div>
    <div class="doc-title">
      <h2>فاتورة</h2>
      <div class="en">TAX INVOICE</div>
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
  </div>

  <div class="parties">
    <div class="party">
      <div class="head"><div class="icon">M</div><div class="ttl">مُصدِر الفاتورة</div></div>
      <table>
        <tr><td class="k">الجهة:</td><td class="v">${esc(PLATFORM.nameAr)}</td></tr>
        <tr><td class="k">النطاق:</td><td class="v">${esc(PLATFORM.domain)}</td></tr>
        <tr><td class="k">البريد:</td><td class="v mono">${esc(PLATFORM.email)}</td></tr>
        <tr><td class="k">الجوال:</td><td class="v mono">${esc(PLATFORM.phone)}</td></tr>
        <tr><td class="k">المقر:</td><td class="v">${esc(PLATFORM.address)}</td></tr>
      </table>
    </div>
    <div class="party">
      <div class="head"><div class="icon">C</div><div class="ttl">فاتورة إلى (العميل)</div></div>
      <table>
        <tr><td class="k">الاسم:</td><td class="v">${esc(inv.customer_name)}</td></tr>
        <tr><td class="k">الجوال:</td><td class="v mono">${esc(inv.customer_phone)}</td></tr>
        <tr><td class="k">البريد:</td><td class="v mono">${esc(inv.customer_email)}</td></tr>
      </table>
    </div>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th class="c-num">#</th>
        <th>وصف الخدمة</th>
        <th class="c-mid">الكمية</th>
        <th class="c-mid">سعر الوحدة</th>
        <th class="c-end">المجموع</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div class="totals-wrap">
    ${paymentInfo || `<div class="note">
      <div class="ttl">طرق السداد المتاحة</div>
      <div>الدفع الإلكتروني عبر منصة ${PLATFORM.domain} — بطاقات الدفع، Apple Pay، التحويل البنكي.</div>
    </div>`}
    <div class="totals">
      <div class="row"><span class="k">المجموع الفرعي</span><span class="v">${fmtMoney(subtotal, currency)}</span></div>
      ${discount > 0 ? `<div class="row muted"><span class="k">الخصم</span><span class="v">- ${fmtMoney(discount, currency)}</span></div>` : ""}
      ${tax > 0 ? `<div class="row"><span class="k">ضريبة القيمة المضافة (15%)</span><span class="v">${fmtMoney(tax, currency)}</span></div>` : ""}
      <div class="divider"></div>
      <div class="grand"><span class="k">الإجمالي المستحق</span><span class="v">${fmtMoney(total, currency)}</span></div>
      ${paid > 0 ? `<div class="paid-line"><span>المدفوع</span><span class="v">${fmtMoney(paid, currency)}</span></div>` : ""}
      ${remaining > 0 ? `<div class="paid-line" style="background:#dc262615;color:#b91c1c;"><span>المتبقي</span><span class="v">${fmtMoney(remaining, currency)}</span></div>` : ""}
    </div>
  </div>

  ${(inv.notes || inv.terms) ? `
  <div class="info-grid">
    ${inv.notes ? `<div class="note"><div class="ttl">ملاحظات</div><div>${esc(inv.notes)}</div></div>` : ""}
    ${inv.terms ? `<div class="note"><div class="ttl">شروط الدفع</div><div>${esc(inv.terms)}</div></div>` : ""}
  </div>` : ""}

  <div class="thanks">
    شكراً لثقتكم بـ ${PLATFORM.nameAr} — نتطلّع لخدمتكم دائماً
  </div>

  <footer class="doc">
    <div class="num">${esc(inv.invoice_number)}</div>
    <div class="center">
      <b>${esc(PLATFORM.nameAr)}</b>
      ${esc(PLATFORM.legal)} • ${new Date().getFullYear()}
    </div>
    <div class="right">
      <div class="url">${esc(PLATFORM.domain)}</div>
      <div>${esc(PLATFORM.email)}</div>
    </div>
  </footer>
</div>
</body>
</html>`;
}

function humanPaymentMethod(m?: string | null): string {
  const map: Record<string, string> = {
    card: "بطاقة بنكية",
    apple_pay: "Apple Pay",
    bank_transfer: "تحويل بنكي",
    cash: "نقداً",
    wallet: "محفظة المنصة",
    moyasar: "بطاقة عبر ميسر",
    paytabs: "بطاقة عبر PayTabs",
    online: "دفع إلكتروني",
  };
  return m ? (map[m] || m) : "دفع إلكتروني";
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
  // اختياري — يمكن ربطه بـ Resend مستقبلاً
  return;
}

serve(handler);
