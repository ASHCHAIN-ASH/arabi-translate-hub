/**
 * Arabic Invoice PDF / Print generator
 * Strategy: build a fully-styled HTML document with Cairo Arabic font,
 * open in a new window for print/save-as-PDF.
 * Also exposes downloadAsPDF() that uses html2canvas + jsPDF for direct download
 * (preserves Arabic shaping perfectly because text is rendered by the browser).
 */
import type { Invoice, InvoiceItem, InvoicePayment } from './invoiceService';
import { InvoiceService } from './invoiceService';

const COMPANY = {
  name: 'فِكرة (FekrahEdu)',
  nameEn: 'FekrahEdu',
  address: 'المملكة العربية السعودية — الرياض',
  email: 'info@fekrahedu.com',
  phone: '0593799355',
  phoneIntl: '+966 59 379 9355',
  website: 'fekrahedu.com',
  vatNumber: '312206352700003',
  crNumber: '7039030916',
  holding: 'ASH HOLDING',
  iban: 'SA00 8000 0000 0000 0000 0000',
};

// ZATCA-style TLV base64 QR (Seller, VAT, Timestamp, Total, VAT amount)
function buildZatcaQrPayload(sellerName: string, vatNumber: string, timestampISO: string, total: string, vatAmount: string): string {
  const enc = new TextEncoder();
  const tlv = (tag: number, val: string) => {
    const v = enc.encode(val);
    const out = new Uint8Array(2 + v.length);
    out[0] = tag; out[1] = v.length; out.set(v, 2);
    return out;
  };
  const parts = [
    tlv(1, sellerName),
    tlv(2, vatNumber),
    tlv(3, timestampISO),
    tlv(4, total),
    tlv(5, vatAmount),
  ];
  const total_len = parts.reduce((s, p) => s + p.length, 0);
  const merged = new Uint8Array(total_len);
  let off = 0;
  for (const p of parts) { merged.set(p, off); off += p.length; }
  let bin = '';
  for (let i = 0; i < merged.length; i++) bin += String.fromCharCode(merged[i]);
  return typeof btoa !== 'undefined' ? btoa(bin) : '';
}

export function buildInvoiceHTML(invoice: Invoice, items: InvoiceItem[], payments: InvoicePayment[] = []): string {
  const fmt = (n: number | null | undefined) => InvoiceService.formatCurrency(n, invoice.currency);
  const itemsRows = items.map((it, idx) => `
    <tr>
      <td class="num">${idx + 1}</td>
      <td class="item">
        <div class="item-name">${escapeHtml(it.item_name)}</div>
        ${it.description ? `<div class="item-desc">${escapeHtml(it.description)}</div>` : ''}
      </td>
      <td class="num">${it.quantity}</td>
      <td class="num">${fmt(it.unit_price)}</td>
      <td class="num">${fmt(it.discount_amount ?? 0)}</td>
      <td class="num strong">${fmt(it.total_price)}</td>
    </tr>`).join('');

  const paymentsBlock = payments.length ? `
    <div class="section">
      <h3>المدفوعات</h3>
      <table class="payments">
        <thead><tr><th>التاريخ</th><th>الطريقة</th><th>المرجع</th><th>المبلغ</th></tr></thead>
        <tbody>
          ${payments.map(p => `<tr>
            <td>${p.payment_date}</td>
            <td>${escapeHtml(translatePaymentMethod(p.payment_method))}</td>
            <td>${escapeHtml(p.reference_number ?? '-')}</td>
            <td class="strong">${fmt(p.amount)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : '';

  const totalItems = items.length;
  const totalQty = items.reduce((s, it) => s + Number(it.quantity || 0), 0);

  // الضريبة حسب إعدادات الفاتورة نفسها (مفعّلة/نسبة/شاملة)
  const subtotal = Number(invoice.subtotal || 0);
  const discount = Number(invoice.discount_amount || 0);
  const anyInvoice = invoice as any;
  const taxEnabled = anyInvoice.tax_enabled !== false && (Number(invoice.tax_amount || 0) > 0 || anyInvoice.tax_enabled === true);
  const taxRate = Number(anyInvoice.tax_rate ?? 15);
  const taxInclusive = anyInvoice.tax_inclusive === true;
  const storedVat = Number(invoice.tax_amount || 0);
  const base = Math.max(subtotal - discount, 0);
  const computedVat = !taxEnabled
    ? 0
    : storedVat > 0
      ? storedVat
      : taxInclusive
        ? Math.round((base - base / (1 + taxRate / 100)) * 100) / 100
        : Math.round(base * (taxRate / 100) * 100) / 100;
  const docTitleAr = taxEnabled ? 'فاتورة ضريبية' : 'فاتورة';
  const docTitleEn = taxEnabled ? 'Tax Invoice' : 'Invoice';
  const taxLabel = taxEnabled
    ? `ضريبة القيمة المضافة (${taxRate}%)${taxInclusive ? ' — شاملة' : ''}`
    : 'بدون ضريبة';

  // طريقة الدفع الأساسية
  const primaryPayment = payments[0];
  const paymentMethodLabel = primaryPayment ? translatePaymentMethod(primaryPayment.payment_method) : '—';

  // QR ZATCA-style + رابط QuickChart للصورة
  const qrPayload = buildZatcaQrPayload(
    COMPANY.name,
    COMPANY.vatNumber,
    new Date(invoice.issue_date || invoice.created_at || Date.now()).toISOString(),
    String(invoice.total_amount ?? 0),
    String(computedVat),
  );
  const qrText = encodeURIComponent(qrPayload || `${invoice.invoice_number}|${invoice.total_amount}|${COMPANY.vatNumber}`);
  const qrImg = `https://quickchart.io/qr?text=${qrText}&size=180&margin=1&ecLevel=M`;

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>فاتورة ${invoice.invoice_number}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0b1220;
    --ink-2: #1e293b;
    --muted: #64748b;
    --muted-2: #94a3b8;
    --line: #e6ebf3;
    --line-2: #eef2f8;
    --bg: #f6f8fc;
    --primary: #1d4ed8;
    --primary-2: #1e40af;
    --primary-3: #312e81;
    --gold: #b8860b;
    --ok: #047857;
    --warn: #b45309;
    --danger: #b91c1c;
  }
  html, body { font-family: 'IBM Plex Sans Arabic', system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--ink); background: var(--bg); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { padding: 28px 18px; direction: rtl; line-height: 1.6; font-size: 13px; }
  .page { max-width: 860px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 12px 40px rgba(15,23,42,.08); overflow: hidden; position: relative; }

  /* Decorative ribbon */
  .ribbon { height: 6px; background: linear-gradient(90deg, var(--primary-3), var(--primary), var(--gold)); }

  /* HEADER */
  .header {
    position: relative;
    padding: 26px 32px 22px;
    background:
      radial-gradient(1200px 220px at 90% -40%, rgba(29,78,216,.08), transparent 60%),
      linear-gradient(180deg, #ffffff 0%, #fafbff 100%);
    border-bottom: 1px solid var(--line);
  }
  .header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
  .brand { display: flex; gap: 14px; align-items: flex-start; }
  .brand-mark {
    width: 56px; height: 56px; border-radius: 14px;
    background: linear-gradient(135deg, var(--primary-3), var(--primary));
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 20px; letter-spacing: -0.5px;
    box-shadow: 0 8px 20px rgba(29,78,216,.25);
  }
  .brand-text .brand-name { font-size: 19px; font-weight: 700; color: var(--ink); letter-spacing: -0.2px; }
  .brand-text .brand-en { font-size: 11px; color: var(--muted); margin-top: 2px; letter-spacing: 1px; text-transform: uppercase; }
  .brand-meta { font-size: 11px; color: var(--muted); margin-top: 8px; line-height: 1.8; }
  .brand-meta .dot { color: var(--line); margin: 0 6px; }

  .doc-title { text-align: left; min-width: 220px; }
  .doc-eyebrow { font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }
  .doc-title h1 { font-size: 28px; font-weight: 700; color: var(--ink); letter-spacing: -0.5px; margin-top: 4px; }
  .doc-num { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; padding: 6px 10px; background: #f1f5fb; border: 1px solid var(--line); border-radius: 8px; font-size: 12px; font-weight: 600; color: var(--ink-2); font-feature-settings: "tnum"; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-top: 10px; border: 1px solid transparent; }
  .badge::before { content: ""; width: 7px; height: 7px; border-radius: 50%; }
  .badge-paid { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
  .badge-paid::before { background: #10b981; }
  .badge-pending { background: #fffbeb; color: #92400e; border-color: #fde68a; }
  .badge-pending::before { background: #f59e0b; }
  .badge-partial { background: #fff7ed; color: #9a3412; border-color: #fed7aa; }
  .badge-partial::before { background: #fb923c; }
  .badge-overdue { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
  .badge-overdue::before { background: #ef4444; }
  .badge-default { background: #f1f5f9; color: #334155; border-color: #e2e8f0; }
  .badge-default::before { background: #94a3b8; }

  /* INFO CARDS */
  .body { padding: 22px 32px 8px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
  .card { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; position: relative; }
  .card-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed var(--line-2); }
  .card-head .ic { width: 22px; height: 22px; border-radius: 6px; background: #eef2ff; color: var(--primary-2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
  .card-head h4 { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
  .card .name { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; font-size: 12px; }
  .row .k { color: var(--muted); }
  .row .v { color: var(--ink-2); font-weight: 600; font-feature-settings: "tnum"; }

  /* META STRIP */
  .meta-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 0 0 18px; padding: 12px; background: linear-gradient(135deg, #f8fafc, #eef2ff); border: 1px solid var(--line); border-radius: 12px; }
  .meta { text-align: center; padding: 6px 4px; }
  .meta + .meta { border-right: 1px solid var(--line); }
  .meta .label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .meta .value { font-size: 14px; font-weight: 700; color: var(--ink); margin-top: 4px; font-feature-settings: "tnum"; }

  /* ITEMS */
  .items-wrap { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
  table.items { width: 100%; border-collapse: collapse; }
  table.items thead { background: linear-gradient(135deg, var(--primary-3), var(--primary)); color: #fff; }
  table.items th { padding: 11px 12px; font-size: 11px; font-weight: 600; text-align: right; letter-spacing: .3px; }
  table.items th.num, table.items td.num { text-align: center; }
  table.items th.amount, table.items td.amount { text-align: left; }
  table.items td { padding: 12px; border-bottom: 1px solid var(--line-2); font-size: 12px; vertical-align: top; font-feature-settings: "tnum"; }
  table.items tbody tr:last-child td { border-bottom: none; }
  table.items tbody tr:nth-child(even) { background: #fafbff; }
  .item-name { font-weight: 600; color: var(--ink); }
  .item-desc { font-size: 11px; color: var(--muted); margin-top: 3px; line-height: 1.6; }
  .strong { font-weight: 700; color: var(--ink); }
  .empty-row { text-align: center; color: var(--muted-2); padding: 28px !important; font-style: italic; }

  /* TOTALS */
  .totals-wrap { display: grid; grid-template-columns: 1fr 320px; gap: 14px; margin-bottom: 18px; align-items: flex-start; }
  .totals-note { background: linear-gradient(135deg, #eff6ff, #f0f9ff); border: 1px solid #dbeafe; border-radius: 12px; padding: 14px 16px; font-size: 11.5px; color: #1e3a8a; line-height: 1.8; }
  .totals-note .nt-title { font-weight: 700; color: var(--primary-2); margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
  .totals { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 14px 18px; }
  .totals .row { padding: 7px 0; font-size: 13px; border-bottom: 1px dashed var(--line-2); }
  .totals .row:last-child { border-bottom: none; }
  .totals .row.grand { font-size: 15px; font-weight: 700; color: var(--primary-2); padding: 12px 0; margin-top: 4px; border-top: 2px solid var(--primary-2); border-bottom: none; }
  .totals .row.grand .v { font-size: 17px; }
  .totals .row.paid .v { color: var(--ok); }
  .totals .row.remaining { background: #fef2f2; margin: 6px -10px 0; padding: 10px 10px; border-radius: 8px; border: 1px solid #fee2e2; border-bottom: none; }
  .totals .row.remaining .k, .totals .row.remaining .v { color: var(--danger); font-weight: 700; }
  .totals .row.fully-paid { background: #ecfdf5; margin: 6px -10px 0; padding: 10px 10px; border-radius: 8px; border: 1px solid #a7f3d0; border-bottom: none; }
  .totals .row.fully-paid .k, .totals .row.fully-paid .v { color: var(--ok); font-weight: 700; }

  /* SECTIONS */
  .section { margin-top: 14px; padding: 14px 16px; background: #fff; border: 1px solid var(--line); border-radius: 12px; }
  .section h3 { font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed var(--line-2); display: flex; align-items: center; gap: 8px; }
  .section h3 .pin { width: 4px; height: 14px; background: var(--primary); border-radius: 4px; }
  .section p { font-size: 12px; color: var(--ink-2); line-height: 1.8; white-space: pre-wrap; }
  table.payments { width: 100%; border-collapse: collapse; }
  table.payments th, table.payments td { padding: 9px 10px; text-align: right; font-size: 12px; border-bottom: 1px solid var(--line-2); font-feature-settings: "tnum"; }
  table.payments tbody tr:last-child td { border-bottom: none; }
  table.payments th { background: #f8fafc; color: var(--muted); font-weight: 600; font-size: 11px; }
  table.payments td.amount { text-align: left; font-weight: 700; color: var(--ok); }

  /* FOOTER */
  .footer { margin-top: 22px; padding: 18px 32px 24px; border-top: 1px solid var(--line); background: linear-gradient(180deg, #fafbff, #f6f8fc); text-align: center; }
  .footer .thanks { font-size: 14px; color: var(--primary-2); font-weight: 700; margin-bottom: 6px; }
  .footer .legal { font-size: 11px; color: var(--muted); line-height: 1.8; }
  .footer .stamp { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; padding: 6px 14px; background: #fff; border: 1px dashed var(--line); border-radius: 999px; font-size: 10px; color: var(--muted); letter-spacing: .5px; }

  /* ACTIONS BAR */
  .actions { position: fixed; top: 14px; left: 14px; display: flex; gap: 8px; z-index: 1000; }
  .actions button { font-family: inherit; padding: 9px 16px; border: none; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; box-shadow: 0 4px 12px rgba(15,23,42,.12); transition: transform .15s ease; }
  .actions button:hover { transform: translateY(-1px); }
  .btn-print { background: linear-gradient(135deg, var(--primary-3), var(--primary)); color: #fff; }
  .btn-close { background: #fff; color: var(--ink-2); border: 1px solid var(--line) !important; }

  @media print {
    body { padding: 0; background: #fff; }
    .actions { display: none; }
    .page { box-shadow: none; border-radius: 0; max-width: 100%; }
    .header { padding: 18px 22px 14px; }
    .body { padding: 14px 22px 4px; }
    .footer { padding: 12px 22px 16px; }
  }
  @page { size: A4; margin: 10mm; }
</style>
</head>
<body>
<div class="actions">
  <button class="btn-print" onclick="window.print()">🖨️ طباعة / حفظ PDF</button>
  <button class="btn-close" onclick="window.close()">إغلاق</button>
</div>
<div class="page">
  <div class="ribbon"></div>

  <div class="header">
    <div class="header-row">
      <div class="brand">
        <div class="brand-mark">ف</div>
        <div class="brand-text">
          <div class="brand-name">${COMPANY.name}</div>
          <div class="brand-en">إحدى مشاريع ${COMPANY.holding}</div>
          <div class="brand-meta">
            ${COMPANY.address}<br/>
            ${COMPANY.email}<span class="dot">•</span>${COMPANY.website}
          </div>
          <div class="legal-ids">
            <span class="lid lid-tax"><span class="lid-k">الرقم الضريبي</span><span class="lid-v" dir="ltr">${COMPANY.vatNumber}</span></span>
            <span class="lid lid-cr"><span class="lid-k">السجل التجاري</span><span class="lid-v" dir="ltr">${COMPANY.crNumber}</span></span>
            <span class="lid lid-phone"><span class="lid-k">جوال / واتساب</span><span class="lid-v" dir="ltr">${COMPANY.phoneIntl}</span></span>
          </div>
        </div>
      </div>
      <div class="doc-title">
        <div class="doc-eyebrow">${docTitleEn}</div>
        <h1>${docTitleAr}</h1>
        <div class="doc-num">رقم: ${escapeHtml(invoice.invoice_number)}</div>
        <div>
          <span class="badge ${badgeClass(invoice.status)}">${InvoiceService.statusLabel(invoice.status)}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="body">
    <div class="info-grid">
      <div class="card">
        <div class="card-head"><div class="ic">👤</div><h4>بيانات العميل</h4></div>
        <div class="name" style="font-size:16px;color:var(--primary-2)">${escapeHtml(invoice.customer_name ?? '—')}</div>
        ${invoice.customer_email ? `<div class="row"><span class="k">البريد الإلكتروني</span><span class="v">${escapeHtml(invoice.customer_email)}</span></div>` : ''}
        ${invoice.customer_phone ? `<div class="row"><span class="k">رقم الجوال</span><span class="v">${escapeHtml(invoice.customer_phone)}</span></div>` : ''}
      </div>
      <div class="card">
        <div class="card-head"><div class="ic">📄</div><h4>تفاصيل الفاتورة</h4></div>
        <div class="row"><span class="k">تاريخ الإصدار</span><span class="v">${invoice.issue_date}</span></div>
        <div class="row"><span class="k">تاريخ الاستحقاق</span><span class="v">${invoice.due_date ?? '—'}</span></div>
        ${invoice.order_id ? `<div class="row"><span class="k">رقم الطلب</span><span class="v">${invoice.order_id.slice(0, 8)}…</span></div>` : ''}
        <div class="row"><span class="k">العملة</span><span class="v">${invoice.currency}</span></div>
        <div class="row"><span class="k">طريقة الدفع</span><span class="v" style="color:var(--primary-2)">${escapeHtml(paymentMethodLabel)}</span></div>
      </div>
    </div>

    <div class="meta-strip">
      <div class="meta"><div class="label">عدد البنود</div><div class="value">${totalItems}</div></div>
      <div class="meta"><div class="label">إجمالي الكميات</div><div class="value">${totalQty}</div></div>
      <div class="meta"><div class="label">المدفوعات</div><div class="value">${payments.length}</div></div>
      <div class="meta"><div class="label">الإجمالي</div><div class="value">${fmt(invoice.total_amount)}</div></div>
    </div>

    <div class="items-wrap">
      <table class="items">
        <thead>
          <tr>
            <th class="num" style="width:40px">#</th>
            <th>البند</th>
            <th class="num" style="width:60px">الكمية</th>
            <th class="amount" style="width:110px">سعر الوحدة</th>
            <th class="amount" style="width:90px">الخصم</th>
            <th class="amount" style="width:120px">الإجمالي</th>
          </tr>
        </thead>
        <tbody>${itemsRows || `<tr><td colspan="6" class="empty-row">لا توجد بنود مسجّلة في هذه الفاتورة</td></tr>`}</tbody>
      </table>
    </div>

    <div class="totals-wrap">
      <div class="totals-note">
        <div class="nt-title">🛡️ فاتورة موثّقة إلكترونياً (متوافقة مع زاتكا)</div>
        صادرة من منصة <strong>${COMPANY.name}</strong> ومحفوظة في سجلاتنا الرقمية. يمكنك التحقق من صحتها بمسح رمز QR أدناه أو من خلال لوحة عميلك.
        <div style="margin-top:12px;display:flex;align-items:center;gap:12px;padding:10px;background:#fff;border:1px dashed #c7d2fe;border-radius:10px">
          <img src="${qrImg}" alt="QR" width="92" height="92" style="border-radius:6px;background:#fff" />
          <div style="font-size:10.5px;color:var(--muted);line-height:1.7">
            <div style="font-weight:700;color:var(--ink);margin-bottom:3px">رمز التحقق ZATCA</div>
            البائع: ${COMPANY.name}<br/>
            الرقم الضريبي: ${COMPANY.vatNumber}<br/>
            الإجمالي: ${fmt(invoice.total_amount)}<br/>
            ض.ق.م: ${fmt(computedVat)}
          </div>
        </div>
      </div>
      <div class="totals">
        <div class="row"><span class="k">المجموع الفرعي</span><span class="v">${fmt(invoice.subtotal)}</span></div>
        ${invoice.discount_amount ? `<div class="row"><span class="k">الخصم</span><span class="v">- ${fmt(invoice.discount_amount)}</span></div>` : ''}
        <div class="row"><span class="k">ضريبة القيمة المضافة (15%)</span><span class="v">${fmt(computedVat)}</span></div>
        <div class="row grand"><span class="k">الإجمالي المستحق</span><span class="v">${fmt(invoice.total_amount)}</span></div>
        <div class="row paid"><span class="k">المدفوع</span><span class="v">${fmt(invoice.paid_amount)}</span></div>
        ${Number(invoice.remaining_amount || 0) <= 0
          ? `<div class="row fully-paid"><span class="k">✓ تم السداد بالكامل</span><span class="v">${fmt(0)}</span></div>`
          : `<div class="row remaining"><span class="k">المبلغ المتبقي</span><span class="v">${fmt(invoice.remaining_amount)}</span></div>`
        }
      </div>
    </div>

    ${paymentsBlock}

    ${invoice.notes ? `<div class="section"><h3><span class="pin"></span>ملاحظات</h3><p>${escapeHtml(invoice.notes)}</p></div>` : ''}
    ${invoice.terms ? `<div class="section"><h3><span class="pin"></span>الشروط والأحكام</h3><p>${escapeHtml(invoice.terms)}</p></div>` : ''}
  </div>

  <div class="footer">
    <div class="thanks">شكراً لثقتكم بـ ${COMPANY.name} 🌟</div>
    <div class="legal">
      هذه الفاتورة صادرة إلكترونياً ولا تحتاج إلى توقيع أو ختم.<br/>
      للاستفسارات: ${COMPANY.email} • ${COMPANY.phone}
    </div>
    <div class="stamp">🔒 وثيقة رقمية موقّعة • ${COMPANY.website}</div>
  </div>
</div>
</body>
</html>`;
}

function escapeHtml(s: string | null | undefined): string {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function badgeClass(status: string): string {
  if (status === 'paid') return 'badge-paid';
  if (status === 'partially_paid') return 'badge-partial';
  if (status === 'pending' || status === 'sent') return 'badge-pending';
  if (status === 'overdue') return 'badge-overdue';
  return 'badge-default';
}

function translatePaymentMethod(m: string): string {
  const map: Record<string, string> = {
    bank_transfer: 'تحويل بنكي',
    cash: 'نقدي',
    card: 'بطاقة',
    wallet: 'محفظة إلكترونية',
    check: 'شيك',
    other: 'أخرى',
  };
  return map[m] ?? m;
}

export function openInvoicePrintWindow(invoice: Invoice, items: InvoiceItem[], payments: InvoicePayment[] = []) {
  const html = buildInvoiceHTML(invoice, items, payments);
  const w = window.open('', '_blank', 'width=900,height=1000');
  if (!w) {
    alert('يرجى السماح بالنوافذ المنبثقة لعرض الفاتورة');
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

/**
 * Download as PDF using the browser's native print engine.
 * This preserves Arabic shaping perfectly because the browser handles text rendering,
 * unlike html2canvas which rasterizes glyphs incorrectly for Arabic.
 *
 * Flow: opens a print window with the invoice + auto-triggers print dialog.
 * User chooses "Save as PDF" destination.
 */
export async function downloadInvoiceAsPDF(invoice: Invoice, items: InvoiceItem[], payments: InvoicePayment[] = []) {
  const html = buildInvoiceHTML(invoice, items, payments);
  const w = window.open('', '_blank', 'width=900,height=1000');
  if (!w) {
    alert('يرجى السماح بالنوافذ المنبثقة لتحميل الفاتورة كـ PDF');
    return;
  }
  // Inject auto-print script and set document title (becomes default PDF filename)
  const withAutoPrint = html.replace(
    '</body>',
    `<script>
      document.title = ${JSON.stringify(invoice.invoice_number)};
      window.addEventListener('load', function() {
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(function() { setTimeout(function(){ window.print(); }, 300); });
        } else {
          setTimeout(function(){ window.print(); }, 800);
        }
      });
    </script></body>`
  );
  w.document.open();
  w.document.write(withAutoPrint);
  w.document.close();
}
