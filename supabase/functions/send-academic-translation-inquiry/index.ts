import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AcademicTranslationInquiryRequest {
  serviceType: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  position?: string;
  academicLevel: string;
  fieldOfStudy: string;
  documentType: string;
  sourceLanguage: string;
  targetLanguage: string;
  documentTitle: string;
  pageCount?: string;
  wordCount?: string;
  urgency: string;
  specialRequirements?: string;
  certificationNeeded: string;
  budgetRange?: string;
  additionalNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiryData: AcademicTranslationInquiryRequest = await req.json();
    console.log("Received academic translation inquiry:", inquiryData);

    // Validation
    if (!inquiryData.fullName || !inquiryData.email || !inquiryData.phone || 
        !inquiryData.organization || !inquiryData.academicLevel || 
        !inquiryData.fieldOfStudy || !inquiryData.documentType || 
        !inquiryData.sourceLanguage || !inquiryData.targetLanguage ||
        !inquiryData.documentTitle || !inquiryData.urgency || 
        !inquiryData.certificationNeeded) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiryData.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const currentDate = new Date().toLocaleString('ar-SA', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Map field values to Arabic labels
    const getFieldLabel = (field: string, value: string) => {
      const fieldMappings: Record<string, Record<string, string>> = {
        academicLevel: {
          'bachelor': 'بكالوريوس',
          'master': 'ماجستير',
          'phd': 'دكتوراه',
          'postdoc': 'ما بعد الدكتوراه',
          'researcher': 'باحث',
          'professor': 'أستاذ جامعي',
          'other': 'أخرى'
        },
        fieldOfStudy: {
          'medicine': 'الطب وعلوم الصحة',
          'engineering': 'الهندسة والتكنولوجيا',
          'social-sciences': 'العلوم الاجتماعية',
          'education': 'التربية وعلم النفس',
          'business': 'إدارة الأعمال والاقتصاد',
          'literature': 'الأدب واللغات',
          'law': 'القانون والشريعة',
          'natural-sciences': 'العلوم الطبيعية',
          'computer-science': 'علوم الحاسب وتقنية المعلومات',
          'agriculture': 'الزراعة والبيئة',
          'arts': 'الفنون والتصميم',
          'other': 'مجال آخر'
        },
        documentType: {
          'thesis': 'رسالة جامعية (ماجستير/دكتوراه)',
          'research-paper': 'بحث علمي',
          'journal-article': 'مقال في مجلة علمية',
          'conference-paper': 'ورقة مؤتمر',
          'book': 'كتاب أكاديمي',
          'report': 'تقرير بحثي',
          'proposal': 'مقترح بحثي',
          'abstract': 'ملخص بحثي',
          'cv-academic': 'سيرة ذاتية أكاديمية',
          'certificate': 'شهادة أكاديمية',
          'transcript': 'كشف درجات',
          'other': 'نوع آخر'
        },
        languages: {
          'arabic': 'العربية',
          'english': 'الإنجليزية',
          'french': 'الفرنسية',
          'german': 'الألمانية',
          'spanish': 'الإسبانية',
          'italian': 'الإيطالية',
          'chinese': 'الصينية',
          'japanese': 'اليابانية',
          'korean': 'الكورية',
          'russian': 'الروسية',
          'turkish': 'التركية',
          'urdu': 'الأردية',
          'other': 'لغة أخرى'
        },
        urgency: {
          'standard': 'عادي (5-7 أيام)',
          'urgent': 'عاجل (2-4 أيام)',
          'rush': 'طارئ (24-48 ساعة)',
          'flexible': 'مرن'
        },
        certificationNeeded: {
          'yes': 'نعم، أحتاج تصديق رسمي',
          'no': 'لا، ترجمة فقط',
          'notarized': 'تصديق من كاتب العدل',
          'embassy': 'تصديق من السفارة'
        },
        budgetRange: {
          'under-500': 'أقل من 500 ريال',
          '500-1000': '500 - 1,000 ريال',
          '1000-2500': '1,000 - 2,500 ريال',
          '2500-5000': '2,500 - 5,000 ريال',
          '5000-10000': '5,000 - 10,000 ريال',
          'above-10000': 'أكثر من 10,000 ريال',
          'flexible': 'مرن حسب الخدمة المطلوبة'
        }
      };
      
      return fieldMappings[field]?.[value] || fieldMappings['languages']?.[value] || value;
    };

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "نظام الترجمة الأكاديمية <noreply@masteredupath.com>",
      to: ["info@masteredupath.com", "support@masteredupath.com"],
      subject: `📚 طلب جديد للترجمة الأكاديمية - ${inquiryData.documentTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #2d3748; 
              direction: rtl; 
              background-color: #f7fafc;
            }
            .container { 
              max-width: 800px; 
              margin: 20px auto; 
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #3182ce 0%, #553c9a 100%);
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            }
            .header h1 {
              font-size: 28px;
              font-weight: 700;
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
              background: #ffffff;
            }
            .urgent { 
              background: linear-gradient(135deg, #fed7d7, #feb2b2);
              border: none;
              border-radius: 12px;
              padding: 20px; 
              margin: 20px 0; 
              text-align: center;
              color: #742a2a;
              font-weight: 600;
            }
            .section { 
              background: #f8fafc; 
              margin: 25px 0; 
              padding: 25px; 
              border-radius: 12px; 
              border-right: 4px solid #3182ce;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .section h3 {
              color: #2b6cb0;
              margin-bottom: 18px;
              font-size: 20px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 0;
              border-bottom: 2px solid #e2e8f0;
            }
            .icon {
              width: 28px;
              height: 28px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              font-size: 16px;
            }
            .icon-user { background: linear-gradient(135deg, #4299e1, #3182ce); }
            .icon-document { background: linear-gradient(135deg, #38a169, #2f855a); }
            .icon-translation { background: linear-gradient(135deg, #d69e2e, #b7791f); }
            .icon-notes { background: linear-gradient(135deg, #e53e3e, #c53030); }
            .icon-time { background: linear-gradient(135deg, #805ad5, #6b46c1); }
            .field { 
              margin: 12px 0; 
              display: flex;
              align-items: start;
              gap: 10px;
            }
            .label { 
              font-weight: 600; 
              color: #4a5568; 
              min-width: 150px;
              font-size: 14px;
            }
            .value { 
              color: #2d3748; 
              flex: 1;
              background: white;
              padding: 8px 12px;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            }
            /* RTL/LTR utility classes for all current and future templates */
            .value.ltr, .ltr { direction: ltr; text-align: left; unicode-bidi: plaintext; }
            .rtl { direction: rtl; text-align: right; unicode-bidi: plaintext; }
            ul, ol { direction: rtl; text-align: right; padding-right: 20px; }
            a.ltr { direction: ltr; text-align: left; unicode-bidi: plaintext; }
            .contact-info { 
              background: linear-gradient(135deg, #3182ce, #553c9a);
              color: white; 
              padding: 25px; 
              border-radius: 12px; 
              margin: 25px 0;
              text-align: center;
            }
            .contact-info h3 {
              margin-bottom: 15px;
              font-size: 20px;
            }
            .contact-info p {
              margin: 8px 0;
              font-size: 16px;
            }
            .footer { 
              background: #2d3748; 
              color: white; 
              padding: 30px; 
              text-align: center;
            }
            .footer p {
              margin: 8px 0;
            }
            .company-logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-logo">🎓 Master Edu Path</div>
              <h1>📚 طلب ترجمة أكاديمية جديد</h1>
              <p>تم استلام طلب جديد للترجمة الأكاديمية المتخصصة</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <strong>⚠️ مطلوب رد سريع:</strong> يجب التواصل مع العميل خلال 4 ساعات كحد أقصى
              </div>

              <div class="section">
                <h3><span class="icon icon-user">👤</span> معلومات العميل</h3>
                <div class="field"><span class="label">الاسم الكامل:</span> <span class="value">${inquiryData.fullName}</span></div>
                <div class="field"><span class="label">البريد الإلكتروني:</span> <span class="value ltr">${inquiryData.email}</span></div>
                <div class="field"><span class="label">رقم الهاتف:</span> <span class="value ltr">${inquiryData.phone}</span></div>
                <div class="field"><span class="label">المؤسسة/الجامعة:</span> <span class="value">${inquiryData.organization}</span></div>
                ${inquiryData.position ? `<div class="field"><span class="label">المنصب/الدرجة:</span> <span class="value">${inquiryData.position}</span></div>` : ''}
                <div class="field"><span class="label">المستوى الأكاديمي:</span> <span class="value">${getFieldLabel('academicLevel', inquiryData.academicLevel)}</span></div>
              </div>

              <div class="section">
                <h3><span class="icon icon-document">📚</span> معلومات الوثيقة</h3>
                <div class="field"><span class="label">مجال الدراسة:</span> <span class="value">${getFieldLabel('fieldOfStudy', inquiryData.fieldOfStudy)}</span></div>
                <div class="field"><span class="label">نوع الوثيقة:</span> <span class="value">${getFieldLabel('documentType', inquiryData.documentType)}</span></div>
                <div class="field"><span class="label">عنوان الوثيقة:</span> <span class="value">${inquiryData.documentTitle}</span></div>
                <div class="field"><span class="label">اللغة المصدر:</span> <span class="value">${getFieldLabel('languages', inquiryData.sourceLanguage)}</span></div>
                <div class="field"><span class="label">اللغة المستهدفة:</span> <span class="value">${getFieldLabel('languages', inquiryData.targetLanguage)}</span></div>
              </div>

              <div class="section">
                <h3><span class="icon icon-translation">🔍</span> تفاصيل الترجمة</h3>
                ${inquiryData.pageCount ? `<div class="field"><span class="label">عدد الصفحات:</span> <span class="value">${inquiryData.pageCount}</span></div>` : ''}
                ${inquiryData.wordCount ? `<div class="field"><span class="label">عدد الكلمات:</span> <span class="value">${inquiryData.wordCount}</span></div>` : ''}
                <div class="field"><span class="label">مستوى الأولوية:</span> <span class="value">${getFieldLabel('urgency', inquiryData.urgency)}</span></div>
                <div class="field"><span class="label">التصديق المطلوب:</span> <span class="value">${getFieldLabel('certificationNeeded', inquiryData.certificationNeeded)}</span></div>
                ${inquiryData.budgetRange ? `<div class="field"><span class="label">الميزانية المتوقعة:</span> <span class="value">${getFieldLabel('budgetRange', inquiryData.budgetRange)}</span></div>` : ''}
                ${inquiryData.specialRequirements ? `<div class="field"><span class="label">متطلبات خاصة:</span> <span class="value">${inquiryData.specialRequirements}</span></div>` : ''}
              </div>

              ${inquiryData.additionalNotes ? `
              <div class="section">
                <h3><span class="icon icon-notes">📝</span> ملاحظات إضافية</h3>
                <div class="field"><span class="value">${inquiryData.additionalNotes}</span></div>
              </div>
              ` : ''}

              <div class="section">
                <h3><span class="icon icon-time">🕒</span> معلومات الطلب</h3>
                <div class="field"><span class="label">تاريخ الطلب:</span> <span class="value">${currentDate}</span></div>
                <div class="field"><span class="label">نوع الخدمة:</span> <span class="value">ترجمة أكاديمية متخصصة</span></div>
              </div>

              <div class="contact-info">
                <h3>📞 معلومات التواصل العاجل</h3>
                <p><strong>البريد الإلكتروني:</strong> <span class="ltr">info@masteredupath.com</span></p>
                <p><strong>الهاتف:</strong> <span class="ltr">0500776343</span></p>
                <p><strong>واتساب:</strong> <span class="ltr">0500776343</span></p>
                <p><strong>أوقات العمل:</strong> الأحد - الخميس، 10:00 ص - 7:00 م</p>
              </div>
            </div>
            
            <div class="footer">
              <div class="company-logo">Master Edu Path</div>
              <p><strong>شكراً لاختيارك خدماتنا المتخصصة</strong></p>
              <p>نحن ملتزمون بتقديم أفضل خدمات الترجمة الأكاديمية</p>
              <p style="font-size: 14px; opacity: 0.8; margin-top: 15px;">
                هذا إشعار تلقائي من نظام إدارة طلبات الترجمة الأكاديمية
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "فريق الترجمة الأكاديمية <noreply@masteredupath.com>",
      to: [inquiryData.email],
      subject: `تأكيد استلام طلب الترجمة الأكاديمية - ${inquiryData.documentTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #2d3748; 
              direction: rtl; 
              background-color: #f7fafc;
            }
            .container { 
              max-width: 600px; 
              margin: 20px auto; 
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #3182ce 0%, #553c9a 100%);
              color: white; 
              padding: 40px 30px; 
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            }
            .header h1 {
              font-size: 26px;
              font-weight: 700;
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
              background: #ffffff;
            }
            .highlight { 
              background: linear-gradient(135deg, #e6f7ff, #bae7ff);
              border: none;
              border-radius: 12px;
              padding: 25px; 
              text-align: center; 
              margin: 25px 0;
              color: #003a8c;
            }
            .highlight h2 {
              color: #1c4ed8;
              margin-bottom: 10px;
              font-size: 22px;
            }
            .section { 
              background: #f8fafc; 
              margin: 25px 0; 
              padding: 25px; 
              border-radius: 12px; 
              border-right: 4px solid #3182ce;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .section h3 {
              color: #2b6cb0;
              margin-bottom: 18px;
              font-size: 20px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 0;
              border-bottom: 2px solid #e2e8f0;
            }
            .icon {
              width: 28px;
              height: 28px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              font-size: 16px;
            }
            .icon-summary { background: linear-gradient(135deg, #38a169, #2f855a); }
            .icon-timeline { background: linear-gradient(135deg, #805ad5, #6b46c1); }
            .icon-benefits { background: linear-gradient(135deg, #d69e2e, #b7791f); }
            .section ul, .section ol {
              text-align: right;
              padding-right: 20px;
            }
            .section li {
              margin: 8px 0;
              color: #4a5568;
            }
            .section li strong {
              color: #2d3748;
            }
            .contact-info { 
              background: linear-gradient(135deg, #3182ce, #553c9a);
              color: white; 
              padding: 25px; 
              border-radius: 12px; 
              margin: 25px 0;
              text-align: center;
            }
            .contact-info h3 {
              margin-bottom: 15px;
              font-size: 20px;
              color: white;
            }
            .contact-info p {
              margin: 8px 0;
              font-size: 16px;
            }
            .footer { 
              background: #2d3748; 
              color: white; 
              padding: 30px; 
              text-align: center;
            }
            .footer p {
              margin: 8px 0;
            }
            .company-logo {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .timeline-item {
              background: white;
              margin: 10px 0;
              padding: 15px;
              border-radius: 8px;
              border-right: 3px solid #3182ce;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-logo">🎓 Master Edu Path</div>
              <h1>📚 تم استلام طلبك بنجاح!</h1>
              <p>شكراً لاختيارك خدمة الترجمة الأكاديمية المتخصصة</p>
            </div>
            
            <div class="content">
              <div class="highlight">
                <h2>🎯 أهلاً بك ${inquiryData.fullName}</h2>
                <p>تم استلام طلبك لترجمة الوثيقة: <strong>"${inquiryData.documentTitle}"</strong></p>
                <p>من <strong>${getFieldLabel('languages', inquiryData.sourceLanguage)}</strong> إلى <strong>${getFieldLabel('languages', inquiryData.targetLanguage)}</strong></p>
              </div>

              <div class="section">
                <h3><span class="icon icon-summary">📋</span> ملخص طلبك:</h3>
                <ul style="text-align: right;">
                  <li><strong>نوع الوثيقة:</strong> ${getFieldLabel('documentType', inquiryData.documentType)}</li>
                  <li><strong>مجال الدراسة:</strong> ${getFieldLabel('fieldOfStudy', inquiryData.fieldOfStudy)}</li>
                  <li><strong>المستوى الأكاديمي:</strong> ${getFieldLabel('academicLevel', inquiryData.academicLevel)}</li>
                  <li><strong>مستوى الأولوية:</strong> ${getFieldLabel('urgency', inquiryData.urgency)}</li>
                  <li><strong>التصديق:</strong> ${getFieldLabel('certificationNeeded', inquiryData.certificationNeeded)}</li>
                </ul>
              </div>

              <div class="section">
                <h3><span class="icon icon-timeline">⏰</span> الخطوات التالية:</h3>
                <div class="timeline-item">
                  <strong>1. المراجعة الفنية:</strong> سيقوم فريق الخبراء بمراجعة الوثيقة خلال ساعة واحدة
                </div>
                <div class="timeline-item">
                  <strong>2. التواصل المبدئي:</strong> سنتصل بك خلال 4 ساعات لمناقشة التفاصيل وتحديد السعر
                </div>
                <div class="timeline-item">
                  <strong>3. إرسال العينة:</strong> سنرسل لك عينة مجانية من الترجمة لضمان الجودة
                </div>
                <div class="timeline-item">
                  <strong>4. بدء الترجمة:</strong> سنبدأ العمل فور الموافقة على العينة
                </div>
                <div class="timeline-item">
                  <strong>5. التسليم والمراجعة:</strong> سنسلم الترجمة مع إمكانية المراجعة المجانية
                </div>
              </div>

              <div class="section">
                <h3><span class="icon icon-benefits">🎓</span> ما يمكنك توقعه:</h3>
                <ul style="text-align: right;">
                  <li>ترجمة دقيقة ومتخصصة في مجالك الأكاديمي</li>
                  <li>مراجعة من خبراء متخصصين في المجال</li>
                  <li>تصديق رسمي إذا كان مطلوباً</li>
                  <li>تسليم في الوقت المحدد</li>
                  <li>ضمان الجودة والدقة العلمية</li>
                  <li>مراجعات مجانية حتى رضاك التام</li>
                  <li>سرية تامة للمحتوى الأكاديمي</li>
                </ul>
              </div>

              <div class="contact-info">
                <h3>📞 معلومات التواصل:</h3>
                <p><strong>البريد الإلكتروني:</strong> <span class="ltr">info@masteredupath.com</span></p>
                <p><strong>الهاتف:</strong> <span class="ltr">0500776343</span></p>
                <p><strong>واتساب:</strong> <span class="ltr">0500776343</span></p>
                <p><strong>أوقات العمل:</strong> الأحد - الخميس، 10:00 ص - 7:00 م</p>
              </div>
            </div>
            
            <div class="footer">
              <div class="company-logo">Master Edu Path</div>
              <p><strong>شكراً لثقتك في خدماتنا المتخصصة</strong></p>
              <p>نتطلع لمساعدتك في تحقيق أهدافك الأكاديمية والبحثية</p>
              <p style="font-size: 14px; margin-top: 15px; opacity: 0.8;">
                تاريخ الطلب: ${currentDate}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Client email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Academic translation inquiry submitted successfully",
        adminEmailId: adminEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id
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
    console.error("Error in send-academic-translation-inquiry function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        details: "Failed to process academic translation inquiry"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);