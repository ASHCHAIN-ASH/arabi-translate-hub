import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoicePDFRequest {
  invoice_id: string;
  send_email?: boolean;
  recipient_email?: string;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoice_id, send_email = false, recipient_email, force = false }: InvoicePDFRequest & { force?: boolean } = await req.json();
    console.log("Generating PDF for invoice:", invoice_id);

    // جلب الفاتورة
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, invoice_items (*)')
      .eq('id', invoice_id)
      .single();
    if (invoiceError || !invoice) {
      throw new Error(`فشل في العثور على الفاتورة: ${invoiceError?.message}`);
    }

    // إعادة استخدام PDF موجود إن وُجد ولم يُطلب التجديد
    if (!force && (invoice as any).pdf_storage_path) {
      const { data: signed } = await supabase.storage
        .from('invoices')
        .createSignedUrl((invoice as any).pdf_storage_path, 60 * 60 * 24 * 7);
      return new Response(JSON.stringify({
        success: true,
        message: "تم استخدام PDF موجود",
        invoice_number: invoice.invoice_number,
        pdf_storage_path: (invoice as any).pdf_storage_path,
        signed_url: signed?.signedUrl,
        content_type: "application/pdf",
      }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // توليد HTML كامل
    const invoiceHTML = generateProfessionalInvoiceHTML(invoice);
    const fullHTML = invoiceHTML.includes('</head>')
      ? invoiceHTML.replace('</head>', `<style>${generateInvoiceCSS()}</style></head>`)
      : `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"/><style>${generateInvoiceCSS()}</style></head><body>${invoiceHTML}</body></html>`;

    // تحويل HTML → PDF عبر Browserless
    const browserlessKey = Deno.env.get("BROWSERLESS_API_KEY");
    let pdfBytes: Uint8Array | null = null;
    let pdfError: string | null = null;
    if (browserlessKey) {
      try {
        const endpoint = `https://production-sfo.browserless.io/pdf?token=${encodeURIComponent(browserlessKey)}`;
        const r = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: fullHTML,
            options: {
              format: "A4",
              printBackground: true,
              preferCSSPageSize: true,
              margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
              displayHeaderFooter: false,
            },
            gotoOptions: { waitUntil: "networkidle0", timeout: 30000 },
            waitForTimeout: 600,
          }),
        });
        if (!r.ok) {
          pdfError = `Browserless ${r.status}: ${(await r.text()).slice(0, 300)}`;
        } else {
          pdfBytes = new Uint8Array(await r.arrayBuffer());
        }
      } catch (e: any) {
        pdfError = e?.message || "browserless network error";
      }
    } else {
      pdfError = "BROWSERLESS_API_KEY غير مهيّأ";
    }

    // رفع الملف إلى التخزين
    let storagePath: string | null = null;
    let signedUrl: string | null = null;
    if (pdfBytes) {
      storagePath = `${invoice.id}/${invoice.invoice_number || invoice.id}.pdf`;
      const { error: upErr } = await supabase.storage
        .from('invoices')
        .upload(storagePath, pdfBytes, { contentType: 'application/pdf', upsert: true });
      if (upErr) {
        console.error('upload error', upErr);
        pdfError = `Storage upload failed: ${upErr.message}`;
      } else {
        await supabase.from('invoices').update({
          pdf_storage_path: storagePath,
          pdf_generated_at: new Date().toISOString(),
        }).eq('id', invoice.id);
        const { data: signed } = await supabase.storage
          .from('invoices').createSignedUrl(storagePath, 60 * 60 * 24 * 7);
        signedUrl = signed?.signedUrl || null;
      }
    }

    // إرسال الإيميل مع المرفق إن طُلب
    if (send_email && recipient_email && pdfBytes) {
      const base64PDF = btoa(String.fromCharCode(...pdfBytes));
      await sendInvoiceEmail(invoice, base64PDF, recipient_email).catch((e) =>
        console.error('sendInvoiceEmail failed', e));
    }

    if (!pdfBytes) {
      // فشل توليد PDF — نُرجع HTML كحل احتياطي
      const base64HTML = btoa(unescape(encodeURIComponent(fullHTML)));
      return new Response(JSON.stringify({
        success: false,
        error: pdfError || 'تعذّر توليد PDF',
        invoice_number: invoice.invoice_number,
        html_data: base64HTML,
        content_type: "text/html",
      }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "تم إنشاء PDF الفاتورة بنجاح",
      invoice_number: invoice.invoice_number,
      pdf_storage_path: storagePath,
      signed_url: signedUrl,
      pdf_data: btoa(String.fromCharCode(...pdfBytes)),
      content_type: "application/pdf",
    }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });

  } catch (error: any) {
    console.error("Error generating invoice PDF:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "حدث خطأ في إنشاء الفاتورة"
    }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

function generateProfessionalInvoiceHTML(invoice: any): string {
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const dueDate = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('ar-SA') : '';
  
  const items = invoice.invoice_items || [];
  const subtotal = parseFloat(invoice.subtotal || 0);
  const vatAmount = parseFloat(invoice.vat_amount || 0);
  const total = parseFloat(invoice.amount || 0);
  
  const itemsHTML = items.map((item: any, index: number) => `
    <tr class="item-row">
      <td class="text-center">${index + 1}</td>
      <td class="item-name">${item.item_name}</td>
      <td class="text-center">${parseFloat(item.quantity).toFixed(0)}</td>
      <td class="text-left">${parseFloat(item.unit_price).toFixed(2)} ر.س</td>
      <td class="text-left total-cell">${parseFloat(item.total_price).toFixed(2)} ر.س</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة ضريبية - ${invoice.invoice_number}</title>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header Section -->
        <div class="header-section">
          <div class="company-info">
            <div class="company-logo">
              <div class="logo-circle">
                <span class="logo-text">MEP</span>
              </div>
              <div class="company-details">
                <h1 class="company-name">وكالة ماستر إيدو باث</h1>
                <p class="company-subtitle">Master Edu Path Agency</p>
              </div>
            </div>
            <div class="contact-info">
              <p><strong>الهاتف:</strong> +966 50 505 0505</p>
              <p><strong>البريد الإلكتروني:</strong> info@masteredupath.com</p>
              <p><strong>العنوان:</strong> ${invoice.address}</p>
            </div>
          </div>
          
          <div class="invoice-header">
            <h2 class="invoice-title">فاتورة ضريبية</h2>
            <p class="invoice-subtitle">Tax Invoice</p>
            <div class="invoice-details">
              <div class="detail-item">
                <span class="label">رقم الفاتورة:</span>
                <span class="value">${invoice.invoice_number}</span>
              </div>
              <div class="detail-item">
                <span class="label">تاريخ الإصدار:</span>
                <span class="value">${currentDate}</span>
              </div>
              ${dueDate ? `
              <div class="detail-item">
                <span class="label">تاريخ الاستحقاق:</span>
                <span class="value">${dueDate}</span>
              </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Company Registration Info -->
        <div class="registration-section">
          <div class="reg-item">
            <span class="reg-label">الرقم الضريبي:</span>
            <span class="reg-value">${invoice.tax_number}</span>
          </div>
          <div class="reg-item">
            <span class="reg-label">السجل التجاري:</span>
            <span class="reg-value">${invoice.company_registration}</span>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="customer-section">
          <h3 class="section-title">بيانات العميل</h3>
          <div class="customer-info">
            <div class="customer-detail">
              <span class="label">اسم العميل:</span>
              <span class="value">${invoice.customer_name}</span>
            </div>
            <div class="customer-detail">
              <span class="label">البريد الإلكتروني:</span>
              <span class="value">${invoice.customer_email}</span>
            </div>
            ${invoice.customer_phone ? `
            <div class="customer-detail">
              <span class="label">رقم الهاتف:</span>
              <span class="value">${invoice.customer_phone}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Invoice Items -->
        <div class="items-section">
          <table class="items-table">
            <thead>
              <tr class="table-header">
                <th class="text-center">#</th>
                <th>وصف الخدمة</th>
                <th class="text-center">الكمية</th>
                <th class="text-left">سعر الوحدة</th>
                <th class="text-left">المجموع</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <!-- Totals Section -->
        <div class="totals-section">
          <div class="totals-container">
            <div class="total-row">
              <span class="total-label">المجموع الفرعي:</span>
              <span class="total-value">${subtotal.toFixed(2)} ر.س</span>
            </div>
            ${invoice.include_vat ? `
            <div class="total-row vat-row">
              <span class="total-label">ضريبة القيمة المضافة (${invoice.vat_rate}%):</span>
              <span class="total-value">${vatAmount.toFixed(2)} ر.س</span>
            </div>
            ` : ''}
            <div class="total-row final-total">
              <span class="total-label">المبلغ الإجمالي:</span>
              <span class="total-value">${total.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>

        ${invoice.include_vat ? `
        <div class="vat-notice">
          <p><strong>تنبيه:</strong> هذه الفاتورة شاملة ضريبة القيمة المضافة بنسبة ${invoice.vat_rate}%</p>
          <p><strong>Notice:</strong> This invoice includes VAT at ${invoice.vat_rate}%</p>
        </div>
        ` : ''}

        <!-- Terms and Payment Info -->
        <div class="terms-section">
          <div class="payment-terms">
            <h4>شروط الدفع:</h4>
            <p>${invoice.terms_conditions}</p>
          </div>
          
          <div class="bank-details">
            <h4>بيانات الحساب البنكي:</h4>
            <p><strong>البنك:</strong> ${invoice.bank_details?.bank_name}</p>
            <p><strong>رقم الحساب:</strong> ${invoice.bank_details?.account_number}</p>
            <p><strong>الآيبان:</strong> ${invoice.bank_details?.iban}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer-section">
          <div class="parent-company">
            <p><strong>وكالة ماستر إيدو باث تتبع لشركة علي صالح الشهري القابضة</strong></p>
            <p><em>Master Edu Path Agency - Subsidiary of Ali Saleh Al-Shehri Holding Company</em></p>
          </div>
          
          <div class="footer-note">
            <p>شكراً لثقتكم بخدماتنا | Thank you for your business</p>
            <p>هذه فاتورة محاسبية معتمدة ومطابقة لأنظمة الهيئة العامة للزكاة والدخل</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateInvoiceCSS(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', 'Dubai', 'Tahoma', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      direction: rtl;
      font-size: 14px;
    }

    .invoice-container {
      max-width: 794px;
      margin: 0 auto;
      padding: 30px;
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #1a365d;
    }

    .company-info {
      flex: 1;
    }

    .company-logo {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }

    .logo-circle {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #1a365d, #3182ce);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
    }

    .logo-text {
      color: white;
      font-weight: bold;
      font-size: 18px;
    }

    .company-name {
      font-size: 24px;
      font-weight: bold;
      color: #1a365d;
      margin-bottom: 5px;
    }

    .company-subtitle {
      font-size: 14px;
      color: #666;
      font-style: italic;
    }

    .contact-info {
      margin-top: 15px;
    }

    .contact-info p {
      margin: 5px 0;
      font-size: 12px;
      color: #555;
    }

    .invoice-header {
      text-align: left;
      direction: ltr;
    }

    .invoice-title {
      font-size: 28px;
      font-weight: bold;
      color: #1a365d;
      margin-bottom: 5px;
    }

    .invoice-subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }

    .invoice-details {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border-right: 4px solid #3182ce;
    }

    .detail-item {
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
    }

    .label {
      font-weight: 600;
      color: #2d3748;
    }

    .value {
      font-weight: bold;
      color: #1a365d;
    }

    .registration-section {
      background: linear-gradient(135deg, #edf2f7, #e2e8f0);
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    .reg-item {
      display: flex;
      flex-direction: column;
    }

    .reg-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }

    .reg-value {
      font-weight: bold;
      color: #1a365d;
      font-size: 14px;
    }

    .customer-section {
      margin: 25px 0;
      padding: 20px;
      background: #f7fafc;
      border-radius: 8px;
      border-right: 4px solid #38a169;
    }

    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #1a365d;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }

    .customer-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .customer-detail {
      display: flex;
      flex-direction: column;
    }

    .customer-detail .label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }

    .customer-detail .value {
      font-weight: 600;
      color: #2d3748;
    }

    .items-section {
      margin: 30px 0;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .table-header {
      background: linear-gradient(135deg, #1a365d, #2d3748);
      color: white;
    }

    .table-header th {
      padding: 15px;
      font-weight: bold;
      text-align: center;
      font-size: 14px;
    }

    .item-row {
      border-bottom: 1px solid #e2e8f0;
      transition: background-color 0.2s;
    }

    .item-row:nth-child(even) {
      background: #f8fafc;
    }

    .item-row:hover {
      background: #edf2f7;
    }

    .item-row td {
      padding: 12px 15px;
      font-size: 13px;
    }

    .item-name {
      font-weight: 600;
      color: #2d3748;
    }

    .text-center {
      text-align: center;
    }

    .text-left {
      text-align: left;
      direction: ltr;
    }

    .total-cell {
      font-weight: bold;
      color: #1a365d;
    }

    .totals-section {
      margin: 30px 0;
      display: flex;
      justify-content: flex-end;
    }

    .totals-container {
      min-width: 350px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 8px 0;
    }

    .total-label {
      font-weight: 600;
      color: #4a5568;
    }

    .total-value {
      font-weight: bold;
      color: #2d3748;
      direction: ltr;
    }

    .vat-row {
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      background: #edf2f7;
      margin: 15px -20px;
      padding: 12px 20px;
    }

    .final-total {
      font-size: 18px;
      font-weight: bold;
      background: linear-gradient(135deg, #1a365d, #2d3748);
      color: white;
      margin: 15px -20px -20px -20px;
      padding: 15px 20px;
      border-radius: 0 0 8px 8px;
    }

    .vat-notice {
      background: linear-gradient(135deg, #fed7d7, #feb2b2);
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
      border: 2px solid #fc8181;
    }

    .vat-notice p {
      margin: 5px 0;
      font-weight: 600;
    }

    .terms-section {
      margin: 30px 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .payment-terms, .bank-details {
      background: #f7fafc;
      padding: 20px;
      border-radius: 8px;
      border-right: 4px solid #3182ce;
    }

    .payment-terms h4, .bank-details h4 {
      color: #1a365d;
      margin-bottom: 10px;
      font-size: 16px;
    }

    .payment-terms p, .bank-details p {
      font-size: 13px;
      color: #4a5568;
      margin: 5px 0;
    }

    .footer-section {
      margin-top: 40px;
      border-top: 2px solid #e2e8f0;
      padding-top: 20px;
    }

    .parent-company {
      text-align: center;
      background: linear-gradient(135deg, #edf2f7, #e2e8f0);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .parent-company p {
      font-weight: bold;
      margin: 5px 0;
    }

    .parent-company p:first-child {
      color: #1a365d;
      font-size: 16px;
    }

    .parent-company p:last-child {
      color: #666;
      font-size: 14px;
    }

    .footer-note {
      text-align: center;
      color: #666;
    }

    .footer-note p {
      margin: 5px 0;
      font-size: 12px;
    }

    @media print {
      .invoice-container {
        box-shadow: none;
        margin: 0;
        padding: 20px;
      }
    }
  `;
}

async function generateSimplePDF(invoice: any): Promise<string> {
  // هذه دالة مبسطة لإنشاء PDF في حالة عدم توفر خدمة خارجية
  // يمكن تطويرها لاحقاً باستخدام مكتبات أخرى
  const invoiceContent = `
    فاتورة ضريبية - ${invoice.invoice_number}
    
    وكالة ماستر إيدو باث
    Master Edu Path Agency
    
    العميل: ${invoice.customer_name}
    البريد: ${invoice.customer_email}
    
    تفاصيل الفاتورة:
    المجموع الفرعي: ${parseFloat(invoice.subtotal || 0).toFixed(2)} ر.س
    ضريبة القيمة المضافة: ${parseFloat(invoice.vat_amount || 0).toFixed(2)} ر.س
    المجموع الإجمالي: ${parseFloat(invoice.amount || 0).toFixed(2)} ر.س
    
    شركة تابعة لمجموعة علي صالح الشهري القابضة
  `;
  
  return btoa(unescape(encodeURIComponent(invoiceContent)));
}

async function sendInvoiceEmail(invoice: any, pdfData: string, recipientEmail: string) {
  try {
    const response = await supabase.functions.invoke('send-email', {
      body: {
        to: [recipientEmail],
        subject: `فاتورة ضريبية - ${invoice.invoice_number}`,
        template_key: 'invoice_pdf',
        variables: {
          invoice_number: invoice.invoice_number,
          customer_name: invoice.customer_name,
          total_amount: parseFloat(invoice.amount || 0).toFixed(2),
          pdf_attachment: pdfData
        }
      }
    });

    console.log("Invoice email sent:", response);
  } catch (error) {
    console.error("Error sending invoice email:", error);
  }
}

serve(handler);