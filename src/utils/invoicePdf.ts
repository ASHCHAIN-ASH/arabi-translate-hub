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
  name: 'ماستر إدو باث',
  nameEn: 'Mastered Edu Path',
  address: 'المملكة العربية السعودية',
  email: 'info@masteredupath.com',
  phone: '+966 50 000 0000',
  website: 'masteredupath.com',
};

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

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>فاتورة ${invoice.invoice_number}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: 'Cairo', system-ui, -apple-system, sans-serif; color: #1a1a1a; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { padding: 28px; direction: rtl; line-height: 1.6; font-size: 13px; }
  .page { max-width: 800px; margin: 0 auto; background: #fff; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1e3a8a; padding-bottom: 18px; margin-bottom: 22px; }
  .brand { display: flex; flex-direction: column; gap: 4px; }
  .brand-name { font-size: 22px; font-weight: 800; color: #1e3a8a; }
  .brand-en { font-size: 12px; color: #6b7280; letter-spacing: 1px; }
  .brand-meta { font-size: 11px; color: #6b7280; margin-top: 6px; line-height: 1.7; }
  .doc-title { text-align: left; }
  .doc-title h1 { font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: 2px; }
  .doc-title .num { font-family: 'Cairo', monospace; font-size: 14px; color: #475569; margin-top: 4px; font-weight: 600; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-top: 8px; }
  .badge-paid { background: #d1fae5; color: #065f46; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .badge-partial { background: #ffedd5; color: #9a3412; }
  .badge-overdue { background: #fee2e2; color: #991b1b; }
  .badge-default { background: #e5e7eb; color: #374151; }

  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; }
  .card h4 { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .card .row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 12px; }
  .card .row span:first-child { color: #64748b; }
  .card .row span:last-child { color: #0f172a; font-weight: 600; }
  .card .name { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }

  table.items { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  table.items thead { background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%); color: #fff; }
  table.items th { padding: 10px 12px; font-size: 12px; font-weight: 600; text-align: right; }
  table.items th.num, table.items td.num { text-align: center; }
  table.items td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; vertical-align: top; }
  table.items tbody tr:nth-child(even) { background: #f8fafc; }
  .item-name { font-weight: 600; color: #0f172a; }
  .item-desc { font-size: 11px; color: #64748b; margin-top: 2px; }
  .strong { font-weight: 700; color: #0f172a; }

  .totals-wrap { display: flex; justify-content: flex-start; margin-bottom: 18px; }
  .totals { width: 320px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; }
  .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px dashed #e2e8f0; }
  .totals .row:last-child { border-bottom: none; }
  .totals .row.grand { font-size: 15px; font-weight: 800; color: #0f766e; padding-top: 10px; margin-top: 4px; border-top: 2px solid #0f766e; border-bottom: none; }
  .totals .row.paid { color: #047857; }
  .totals .row.remaining { color: #b91c1c; font-weight: 700; }

  .section { margin-top: 18px; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; }
  .section h3 { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
  .section p { font-size: 12px; color: #475569; line-height: 1.7; white-space: pre-wrap; }
  table.payments { width: 100%; border-collapse: collapse; }
  table.payments th, table.payments td { padding: 8px 10px; text-align: right; font-size: 12px; border-bottom: 1px solid #e2e8f0; }
  table.payments th { background: #fff; color: #64748b; font-weight: 600; }

  .footer { margin-top: 26px; padding-top: 14px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
  .footer .thanks { font-size: 14px; color: #0f766e; font-weight: 700; margin-bottom: 6px; }

  .actions { position: fixed; top: 12px; left: 12px; display: flex; gap: 8px; z-index: 1000; }
  .actions button { font-family: 'Cairo', sans-serif; padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; }
  .btn-print { background: #0f766e; color: #fff; }
  .btn-close { background: #e5e7eb; color: #374151; }
  @media print {
    .actions { display: none; }
    body { padding: 0; }
    .page { max-width: 100%; }
  }
  @page { size: A4; margin: 12mm; }
</style>
</head>
<body>
<div class="actions">
  <button class="btn-print" onclick="window.print()">🖨️ طباعة / حفظ PDF</button>
  <button class="btn-close" onclick="window.close()">إغلاق</button>
</div>
<div class="page">
  <div class="header">
    <div class="brand">
      <div class="brand-name">${COMPANY.name}</div>
      <div class="brand-en">${COMPANY.nameEn}</div>
      <div class="brand-meta">
        ${COMPANY.address}<br/>
        ${COMPANY.email} • ${COMPANY.phone}<br/>
        ${COMPANY.website}
      </div>
    </div>
    <div class="doc-title">
      <h1>فاتورة</h1>
      <div class="num">${escapeHtml(invoice.invoice_number)}</div>
      <div class="badge ${badgeClass(invoice.status)}">${InvoiceService.statusLabel(invoice.status)}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="card">
      <h4>بيانات العميل</h4>
      <div class="name">${escapeHtml(invoice.customer_name ?? '-')}</div>
      ${invoice.customer_email ? `<div class="row"><span>البريد</span><span>${escapeHtml(invoice.customer_email)}</span></div>` : ''}
      ${invoice.customer_phone ? `<div class="row"><span>الهاتف</span><span>${escapeHtml(invoice.customer_phone)}</span></div>` : ''}
    </div>
    <div class="card">
      <h4>تفاصيل الفاتورة</h4>
      <div class="row"><span>تاريخ الإصدار</span><span>${invoice.issue_date}</span></div>
      <div class="row"><span>تاريخ الاستحقاق</span><span>${invoice.due_date ?? '-'}</span></div>
      ${invoice.order_id ? `<div class="row"><span>رقم الطلب</span><span>${invoice.order_id.slice(0, 8)}…</span></div>` : ''}
      <div class="row"><span>العملة</span><span>${invoice.currency}</span></div>
    </div>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th class="num" style="width:40px">#</th>
        <th>البند</th>
        <th class="num" style="width:60px">الكمية</th>
        <th class="num" style="width:110px">سعر الوحدة</th>
        <th class="num" style="width:90px">الخصم</th>
        <th class="num" style="width:120px">الإجمالي</th>
      </tr>
    </thead>
    <tbody>${itemsRows || `<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:20px">لا توجد بنود</td></tr>`}</tbody>
  </table>

  <div class="totals-wrap">
    <div class="totals">
      <div class="row"><span>المجموع الفرعي</span><span>${fmt(invoice.subtotal)}</span></div>
      ${invoice.discount_amount ? `<div class="row"><span>الخصم</span><span>- ${fmt(invoice.discount_amount)}</span></div>` : ''}
      ${invoice.tax_amount ? `<div class="row"><span>الضريبة</span><span>${fmt(invoice.tax_amount)}</span></div>` : ''}
      <div class="row grand"><span>الإجمالي</span><span>${fmt(invoice.total_amount)}</span></div>
      <div class="row paid"><span>المدفوع</span><span>${fmt(invoice.paid_amount)}</span></div>
      <div class="row remaining"><span>المتبقي</span><span>${fmt(invoice.remaining_amount)}</span></div>
    </div>
  </div>

  ${paymentsBlock}

  ${invoice.notes ? `<div class="section"><h3>ملاحظات</h3><p>${escapeHtml(invoice.notes)}</p></div>` : ''}
  ${invoice.terms ? `<div class="section"><h3>الشروط والأحكام</h3><p>${escapeHtml(invoice.terms)}</p></div>` : ''}

  <div class="footer">
    <div class="thanks">شكراً لتعاملكم معنا</div>
    <div>هذه الفاتورة صادرة إلكترونياً ولا تحتاج إلى توقيع.</div>
    <div>${COMPANY.website} • ${COMPANY.email}</div>
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
