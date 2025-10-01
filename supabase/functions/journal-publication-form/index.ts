import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JournalPublicationRequest {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  researchField: string;
  journalType: string;
  manuscriptTitle: string;
  currentStatus: string;
  deadline: string;
  additionalNotes: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: JournalPublicationRequest = await req.json();

    // Client email template
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد استلام طلب النشر في المجلات المعتمدة</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            direction: rtl;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            animation: slideIn 0.6s ease-out;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
          }
          .header p {
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          .content {
            padding: 40px 30px;
          }
          .welcome-message {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 2px solid #0ea5e9;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            text-align: center;
            animation: fadeIn 0.8s ease-out 0.3s both;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .welcome-message h2 {
            color: #0c4a6e;
            font-size: 22px;
            margin-bottom: 15px;
          }
          .welcome-message p {
            color: #075985;
            line-height: 1.6;
          }
          .details-section {
            background: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            animation: fadeIn 0.8s ease-out 0.5s both;
          }
          .details-section h3 {
            color: #1e293b;
            font-size: 20px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
          }
          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-item:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #475569;
            width: 40%;
          }
          .detail-value {
            color: #1e293b;
            width: 55%;
          }
          .next-steps {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            animation: fadeIn 0.8s ease-out 0.7s both;
          }
          .next-steps h3 {
            color: #92400e;
            font-size: 20px;
            margin-bottom: 15px;
          }
          .next-steps ul {
            color: #a16207;
            list-style: none;
            padding-right: 0;
          }
          .next-steps li {
            margin-bottom: 8px;
            position: relative;
            padding-right: 20px;
          }
          .next-steps li::before {
            content: '✓';
            position: absolute;
            right: 0;
            color: #059669;
            font-weight: bold;
          }
          .contact-info {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            animation: fadeIn 0.8s ease-out 0.9s both;
          }
          .contact-info h3 {
            color: #065f46;
            font-size: 20px;
            margin-bottom: 15px;
          }
          .contact-info p {
            color: #047857;
            margin-bottom: 10px;
          }
          .footer {
            background: #1f2937;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 14px;
          }
          .footer p {
            opacity: 0.8;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Master Edu Path</h1>
            <p>رفيقك الأكاديمي نحو التميز</p>
          </div>
          
          <div class="content">
            <div class="welcome-message">
              <h2>مرحباً ${formData.fullName} 👋</h2>
              <p>شكراً لك على اختيار خدماتنا للنشر في المجلات المعتمدة. تم استلام طلبك بنجاح وسيتم مراجعته من قبل فريقنا المتخصص.</p>
            </div>

            <div class="details-section">
              <h3>📋 تفاصيل طلبك</h3>
              <div class="detail-item">
                <span class="detail-label">الاسم الكامل:</span>
                <span class="detail-value">${formData.fullName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">البريد الإلكتروني:</span>
                <span class="detail-value">${formData.email}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">رقم الهاتف:</span>
                <span class="detail-value">${formData.phone}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">المؤسسة:</span>
                <span class="detail-value">${formData.institution}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">مجال البحث:</span>
                <span class="detail-value">${formData.researchField}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">نوع المجلة:</span>
                <span class="detail-value">${formData.journalType}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">عنوان المخطوطة:</span>
                <span class="detail-value">${formData.manuscriptTitle}</span>
              </div>
            </div>

            <div class="next-steps">
              <h3>⏭️ الخطوات التالية</h3>
              <ul>
                <li>سيتم مراجعة طلبك خلال 24 ساعة</li>
                <li>سنتواصل معك لمناقشة التفاصيل والتكلفة</li>
                <li>سيتم وضع خطة زمنية مخصصة لمشروعك</li>
                <li>بدء العمل على مخطوطتك بواسطة خبرائنا</li>
              </ul>
            </div>

            <div class="contact-info">
              <h3>📞 تواصل معنا</h3>
              <p><strong>البريد الإلكتروني:</strong> info@masteredupath.com</p>
              <p><strong>نحن هنا لمساعدتك في رحلتك الأكاديمية</strong></p>
            </div>
          </div>

          <div class="footer">
            <p>&copy; 2024 Master Edu Path. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Admin email template
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب جديد - النشر في المجلات المعتمدة</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            padding: 20px;
            direction: rtl;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
            animation: slideIn 0.6s ease-out;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .header {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 3s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.05); opacity: 0.6; }
          }
          .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          .header p {
            font-size: 14px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          .urgent-badge {
            background: #fbbf24;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          .content {
            padding: 30px;
          }
          .alert-section {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            border: 2px solid #ef4444;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            animation: fadeIn 0.8s ease-out 0.3s both;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .alert-section h2 {
            color: #dc2626;
            font-size: 20px;
            margin-bottom: 10px;
          }
          .client-details {
            background: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            animation: fadeIn 0.8s ease-out 0.5s both;
          }
          .client-details h3 {
            color: #1e293b;
            font-size: 18px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
          }
          .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .detail-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .detail-label {
            font-weight: 600;
            color: #475569;
            font-size: 14px;
            display: block;
            margin-bottom: 5px;
          }
          .detail-value {
            color: #1e293b;
            font-size: 16px;
          }
          .full-width {
            grid-column: 1 / -1;
          }
          .priority-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            animation: fadeIn 0.8s ease-out 0.7s both;
          }
          .priority-section h3 {
            color: #92400e;
            font-size: 18px;
            margin-bottom: 15px;
          }
          .priority-list {
            list-style: none;
            padding: 0;
          }
          .priority-list li {
            margin-bottom: 8px;
            padding: 8px 12px;
            background: rgba(255,255,255,0.5);
            border-radius: 6px;
            position: relative;
            padding-right: 30px;
          }
          .priority-list li::before {
            content: '⚡';
            position: absolute;
            right: 8px;
            color: #f59e0b;
          }
          .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 25px;
          }
          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
          }
          .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
          }
          .btn-secondary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }
          .footer {
            background: #374151;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="urgent-badge">طلب جديد عاجل</div>
            <h1>🔔 إشعار إداري</h1>
            <p>طلب جديد للنشر في المجلات المعتمدة</p>
          </div>
          
          <div class="content">
            <div class="alert-section">
              <h2>📧 طلب جديد تم استلامه</h2>
              <p>تم استلام طلب جديد للنشر في المجلات المعتمدة. يرجى المتابعة والرد خلال 24 ساعة.</p>
            </div>

            <div class="client-details">
              <h3>👤 تفاصيل العميل</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">الاسم الكامل</span>
                  <div class="detail-value">${formData.fullName}</div>
                </div>
                <div class="detail-item">
                  <span class="detail-label">البريد الإلكتروني</span>
                  <div class="detail-value">${formData.email}</div>
                </div>
                <div class="detail-item">
                  <span class="detail-label">رقم الهاتف</span>
                  <div class="detail-value">${formData.phone}</div>
                </div>
                <div class="detail-item">
                  <span class="detail-label">المؤسسة</span>
                  <div class="detail-value">${formData.institution}</div>
                </div>
                <div class="detail-item">
                  <span class="detail-label">مجال البحث</span>
                  <div class="detail-value">${formData.researchField}</div>
                </div>
                <div class="detail-item">
                  <span class="detail-label">نوع المجلة</span>
                  <div class="detail-value">${formData.journalType}</div>
                </div>
                <div class="detail-item full-width">
                  <span class="detail-label">عنوان المخطوطة</span>
                  <div class="detail-value">${formData.manuscriptTitle}</div>
                </div>
                <div class="detail-item">
                  <span class="detail-label">الحالة الحالية</span>
                  <div class="detail-value">${formData.currentStatus}</div>
                </div>
                <div class="detail-item">
                  <span class="detail-label">الموعد النهائي</span>
                  <div class="detail-value">${formData.deadline}</div>
                </div>
                ${formData.additionalNotes ? `
                <div class="detail-item full-width">
                  <span class="detail-label">ملاحظات إضافية</span>
                  <div class="detail-value">${formData.additionalNotes}</div>
                </div>
                ` : ''}
              </div>
            </div>

            <div class="priority-section">
              <h3>⚡ المطلوب إجراؤه</h3>
              <ul class="priority-list">
                <li>التواصل مع العميل خلال 24 ساعة</li>
                <li>مراجعة متطلبات المخطوطة</li>
                <li>تحديد التكلفة والجدولة الزمنية</li>
                <li>إرسال عرض سعر مفصل</li>
                <li>تحديد المجلات المناسبة</li>
              </ul>
            </div>

            <div class="action-buttons">
              <a href="mailto:${formData.email}" class="btn btn-primary">رد على العميل</a>
              <a href="tel:${formData.phone}" class="btn btn-secondary">اتصال مباشر</a>
            </div>
          </div>

          <div class="footer">
            <p>Master Edu Path - نظام إدارة الطلبات</p>
            <p>تاريخ الطلب: ${new Date().toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send client email
    await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      to: [formData.email],
      subject: "تأكيد استلام طلب النشر في المجلات المعتمدة - Master Edu Path",
      html: clientEmailHtml,
    });

    // Send admin email
    const adminEmailResponse = await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      to: ["info@masteredupath.com"],
      subject: `طلب جديد للنشر في المجلات المعتمدة من ${formData.fullName}`,
      html: adminEmailHtml,
    });

    console.log("Emails sent successfully for journal publication request");

    // إرسال إشعار للإدارة في لوحة التحكم
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    try {
      await fetch(`${supabaseUrl}/rest/v1/user_notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_email: 'info@masteredupath.com',
          title: '📚 طلب نشر في المجلات المعتمدة',
          message: `طلب جديد من ${formData.fullName} - ${formData.manuscriptTitle}`,
          type: 'info',
          category: 'research',
          metadata: { 
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            institution: formData.institution,
            researchField: formData.researchField,
            journalType: formData.journalType,
            manuscriptTitle: formData.manuscriptTitle,
            service: 'journal_publication',
            timestamp: new Date().toISOString()
          }
        })
      });
      console.log('Admin notification sent to dashboard');
    } catch (notifError) {
      console.error('Error sending admin notification:', notifError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح. سنتواصل معك قريباً." 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in journal-publication-form function:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.",
        details: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);