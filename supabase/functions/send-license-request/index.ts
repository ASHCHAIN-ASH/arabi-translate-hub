import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LicenseRequestData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  licenseType: string;
  usagePurpose: string;
  contentType: string;
  duration: string;
  additionalInfo?: string;
  agreeToTerms: boolean;
}

// Map license types to Arabic
const licenseTypeMap: Record<string, string> = {
  "educational": "تعليمي",
  "commercial": "تجاري", 
  "research": "بحثي",
  "non-profit": "غير ربحي",
  "government": "حكومي",
  "personal": "شخصي"
};

const contentTypeMap: Record<string, string> = {
  "texts": "النصوص والمحتوى",
  "designs": "التصاميم البصرية", 
  "software": "الأنظمة والبرمجيات",
  "educational-materials": "المحتوى التعليمي",
  "trademarks": "العلامات التجارية",
  "mixed-content": "محتوى مختلط"
};

const durationMap: Record<string, string> = {
  "3-months": "3 أشهر",
  "6-months": "6 أشهر",
  "1-year": "سنة واحدة", 
  "2-years": "سنتان",
  "permanent": "دائم"
};

// Professional email template for client confirmation - Enhanced RTL
const getClientEmailTemplate = (data: LicenseRequestData, requestNumber: string) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد طلب ترخيص الاستخدام</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.8;
            color: #1a202c;
            background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
            direction: rtl;
            text-align: right;
            padding: 20px;
        }
        
        .email-container {
            max-width: 700px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #db2777 100%);
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
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1.5" fill="white" opacity="0.08"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            animation: float 20s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateX(0px) rotate(0deg); }
            50% { transform: translateX(-10px) rotate(1deg); }
        }
        
        .logo-container {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 0 auto 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
        }
        
        .logo-icon {
            font-size: 48px;
        }
        
        .company-name {
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 2;
        }
        
        .company-tagline {
            font-size: 18px;
            opacity: 0.95;
            font-weight: 300;
            position: relative;
            z-index: 2;
        }
        
        .content {
            padding: 50px 40px;
        }
        
        .greeting {
            font-size: 24px;
            color: #1e40af;
            margin-bottom: 25px;
            font-weight: 600;
            text-align: center;
            background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%);
            padding: 20px;
            border-radius: 15px;
            border: 2px solid #e0e7ff;
        }
        
        .intro-text {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 35px;
            line-height: 1.9;
            text-align: center;
        }
        
        .request-number {
            background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
            color: white;
            padding: 25px 30px;
            border-radius: 15px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
        }
        
        .request-number-label {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        
        .request-number-value {
            font-size: 32px;
            font-weight: 800;
            font-family: 'Cairo', monospace;
            letter-spacing: 3px;
        }
        
        .details-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 18px;
            padding: 35px;
            margin: 30px 0;
            border-right: 6px solid #1e40af;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .details-header {
            color: #1e40af;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            margin-bottom: 15px;
            background: white;
            border-radius: 12px;
            border-right: 4px solid #7c3aed;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: transform 0.2s ease;
        }
        
        .detail-row:hover {
            transform: translateX(-5px);
        }
        
        .detail-label {
            font-weight: 600;
            color: #1e40af;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .detail-value {
            color: #1a202c;
            font-weight: 500;
            font-size: 16px;
        }
        
        .next-steps {
            background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
            border-radius: 18px;
            padding: 35px;
            margin: 30px 0;
            border-right: 6px solid #22c55e;
        }
        
        .next-steps-header {
            color: #16a34a;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .step-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 20px;
            font-size: 16px;
            color: #374151;
            background: white;
            padding: 15px;
            border-radius: 10px;
            border-right: 3px solid #22c55e;
        }
        
        .step-icon {
            background: #22c55e;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .timeline-notice {
            font-size: 20px;
            color: #7c3aed;
            text-align: center;
            margin: 35px 0;
            padding: 25px;
            background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
            border-radius: 15px;
            border: 2px solid #e9d5ff;
            font-weight: 600;
        }
        
        .contact-section {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            border-radius: 18px;
            padding: 40px;
            margin: 30px 0;
            text-align: center;
        }
        
        .contact-header {
            color: #fbbf24;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 25px;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        
        .contact-item {
            text-align: center;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            transition: background 0.3s ease;
        }
        
        .contact-item:hover {
            background: rgba(255,255,255,0.15);
        }
        
        .contact-item .icon {
            font-size: 32px;
            color: #fbbf24;
            margin-bottom: 10px;
            display: block;
        }
        
        .contact-item .text {
            font-size: 16px;
            font-weight: 500;
        }
        
        .footer {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-copyright {
            font-size: 14px;
            opacity: 0.8;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 20px;
            margin-top: 20px;
        }
        
        @media (max-width: 600px) {
            body { padding: 10px; }
            .email-container { border-radius: 15px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 25px; }
            .details-card, .next-steps, .contact-section { padding: 25px 20px; }
            .detail-row { flex-direction: column; gap: 10px; text-align: right; }
            .contact-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-container">
                <div class="logo-icon">⚖️</div>
            </div>
            <h1 class="company-name">وكالة ماستر إيدو باث</h1>
            <p class="company-tagline">للحلول التعليمية والملكية الفكرية المتقدمة</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                السلام عليكم ${data.contactPerson} الكريم 🌟
            </div>
            
            <p class="intro-text">
                شكراً لكم على ثقتكم في خدماتنا المتخصصة. تم استلام طلب ترخيص الاستخدام بنجاح 
                وسنقوم بمراجعته وفقاً لأعلى معايير الجودة والأمان القانوني.
            </p>
            
            <!-- Request Number -->
            <div class="request-number">
                <div class="request-number-label">🎯 رقم الطلب الخاص بكم</div>
                <div class="request-number-value">${requestNumber}</div>
            </div>
            
            <!-- Details Card -->
            <div class="details-card">
                <h3 class="details-header">
                    📋 تفاصيل طلب الترخيص المُقدم
                </h3>
                
                <div class="detail-row">
                    <span class="detail-label">🏢 الشركة/المؤسسة</span>
                    <span class="detail-value">${data.companyName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">👨‍💼 الشخص المسؤول</span>
                    <span class="detail-value">${data.contactPerson}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📧 البريد الإلكتروني</span>
                    <span class="detail-value">${data.email}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📱 رقم الهاتف</span>
                    <span class="detail-value">${data.phone}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">⚖️ نوع الترخيص المطلوب</span>
                    <span class="detail-value">${licenseTypeMap[data.licenseType] || data.licenseType}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📄 نوع المحتوى</span>
                    <span class="detail-value">${contentTypeMap[data.contentType] || data.contentType}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📅 مدة الترخيص</span>
                    <span class="detail-value">${durationMap[data.duration] || data.duration}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📅 تاريخ تقديم الطلب</span>
                    <span class="detail-value">${new Date().toLocaleDateString('ar-SA', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                </div>
            </div>
            
            <!-- Next Steps -->
            <div class="next-steps">
                <h3 class="next-steps-header">
                    ⏰ مراحل معالجة طلبكم
                </h3>
                
                <div class="step-item">
                    <div class="step-icon">1</div>
                    <div><strong>المرحلة الأولى:</strong> مراجعة شاملة للطلب من قبل فريق الشؤون القانونية (24-48 ساعة)</div>
                </div>
                
                <div class="step-item">
                    <div class="step-icon">2</div>
                    <div><strong>المرحلة الثانية:</strong> إجراء تقييم قانوني وتقني لنوع الاستخدام المطلوب</div>
                </div>
                
                <div class="step-item">
                    <div class="step-icon">3</div>
                    <div><strong>المرحلة الثالثة:</strong> التواصل معكم لاستكمال المتطلبات الإضافية إن وجدت</div>
                </div>
                
                <div class="step-item">
                    <div class="step-icon">4</div>
                    <div><strong>المرحلة الأخيرة:</strong> إصدار الترخيص النهائي وإرساله إليكم رسمياً</div>
                </div>
            </div>
            
            <div class="timeline-notice">
                ⚡ سيتم التواصل معكم خلال <strong>48 ساعة عمل</strong> لمتابعة طلبكم
            </div>
        </div>
        
        <!-- Contact Section -->
        <div class="contact-section">
            <h3 class="contact-header">📞 قنوات التواصل والاستفسارات</h3>
            
            <div class="contact-grid">
                <div class="contact-item">
                    <span class="icon">📧</span>
                    <div class="text">legal@masteredupath.com</div>
                </div>
                <div class="contact-item">
                    <span class="icon">📱</span>
                    <div class="text">0500776343</div>
                </div>
                <div class="contact-item">
                    <span class="icon">🌐</span>
                    <div class="text">www.masteredupath.com</div>
                </div>
                <div class="contact-item">
                    <span class="icon">📍</span>
                    <div class="text">جدة، المملكة العربية السعودية</div>
                </div>
            </div>
            
            <div class="footer-copyright">
                هذا الإيميل تم إرساله تلقائياً من نظام إدارة التراخيص.<br>
                للاستفسارات والمتابعة، يرجى التواصل عبر القنوات الرسمية المذكورة أعلاه.<br><br>
                © 2024 وكالة ماستر إيدو باث للحلول التعليمية المتقدمة<br>
                جميع الحقوق محفوظة | المملكة العربية السعودية
            </div>
        </div>
    </div>
</body>
</html>
`;
// Professional admin notification template - Enhanced RTL
const getAdminEmailTemplate = (data: LicenseRequestData, requestNumber: string) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تنبيه: طلب ترخيص جديد</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.7;
            color: #1a202c;
            background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
            direction: rtl;
            text-align: right;
        }
        
        .email-container {
            max-width: 800px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }
        
        .urgent-banner {
            background: linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
            color: white;
            padding: 20px;
            text-align: center;
            font-weight: 800;
            font-size: 20px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .header {
            background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .admin-logo {
            background: rgba(239, 68, 68, 0.2);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(239, 68, 68, 0.3);
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
        }
        
        .admin-title {
            font-size: 28px;
            font-weight: 900;
            margin-bottom: 10px;
        }
        
        .admin-subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .priority-section {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 3px solid #ef4444;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .priority-title {
            color: #dc2626;
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        
        .request-info {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 15px;
            padding: 30px;
            margin: 25px 0;
            border-right: 8px solid #3b82f6;
        }
        
        .section-header {
            color: #1e40af;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .info-item {
            background: white;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .info-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-value {
            font-size: 16px;
            color: #1e293b;
            font-weight: 500;
        }
        
        .purpose-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
            border-radius: 15px;
            padding: 30px;
            margin: 25px 0;
            border-right: 8px solid #0ea5e9;
        }
        
        .purpose-text {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #bae6fd;
            white-space: pre-wrap;
            line-height: 1.8;
        }
        
        .action-section {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-radius: 15px;
            padding: 30px;
            margin: 25px 0;
            text-align: center;
            border-right: 8px solid #22c55e;
        }
        
        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        
        .action-button {
            display: inline-block;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
            color: white;
        }
        
        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .checklist {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 15px;
            padding: 30px;
            margin: 25px 0;
            border-right: 8px solid #f59e0b;
        }
        
        .checklist-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 15px;
            color: #92400e;
        }
        
        .checklist-icon {
            color: #d97706;
            font-size: 18px;
            margin-top: 2px;
        }
        
        .footer {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-warning {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.3);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
            .email-container {
                margin: 15px;
                border-radius: 15px;
            }
            
            .content {
                padding: 25px 20px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .action-buttons {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Urgent Banner -->
        <div class="urgent-banner">
            🚨 تنبيه عاجل: طلب ترخيص جديد يتطلب المراجعة الفورية 🚨
        </div>
        
        <!-- Header -->
        <div class="header">
            <div class="admin-logo">⚡</div>
            <h1 class="admin-title">نظام إدارة التراخيص</h1>
            <p class="admin-subtitle">وكالة ماستر إيدو باث - قسم الشؤون القانونية</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <!-- Priority Section -->
            <div class="priority-section">
                <h2 class="priority-title">
                    ⏰ طلب ترخيص عالي الأولوية
                </h2>
                <p style="font-size: 18px; color: #dc2626; font-weight: 600;">
                    تم استلام طلب ترخيص جديد في التاريخ: ${new Date().toLocaleDateString('ar-SA', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
                <p style="font-size: 24px; font-weight: 800; color: #dc2626; margin-top: 15px;">
                    رقم الطلب: ${requestNumber}
                </p>
            </div>
            
            <!-- Request Information -->
            <div class="request-info">
                <h3 class="section-header">
                    📋 معلومات مقدم الطلب
                </h3>
                
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">🏢 اسم الشركة</div>
                        <div class="info-value">${data.companyName}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">👨‍💼 الشخص المسؤول</div>
                        <div class="info-value">${data.contactPerson}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">📧 البريد الإلكتروني</div>
                        <div class="info-value">
                            <a href="mailto:${data.email}" style="color: #0ea5e9; text-decoration: none;">
                                ${data.email}
                            </a>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">📱 رقم الهاتف</div>
                        <div class="info-value">
                            <a href="tel:${data.phone}" style="color: #059669; text-decoration: none;">
                                ${data.phone}
                            </a>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">⚖️ نوع الترخيص</div>
                        <div class="info-value">${licenseTypeMap[data.licenseType] || data.licenseType}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">📄 نوع المحتوى</div>
                        <div class="info-value">${contentTypeMap[data.contentType] || data.contentType}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">📅 مدة الترخيص</div>
                        <div class="info-value">${durationMap[data.duration] || data.duration}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">✅ حالة الموافقة</div>
                        <div class="info-value" style="color: #059669; font-weight: 700;">
                            ${data.agreeToTerms ? 'وافق على جميع الشروط' : 'لم يوافق على الشروط'}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Purpose Section -->
            <div class="purpose-section">
                <h3 class="section-header">
                    🎯 الغرض التفصيلي من الاستخدام
                </h3>
                <div class="purpose-text">${data.usagePurpose}</div>
                
                ${data.additionalInfo ? `
                <h4 style="margin: 20px 0 15px 0; color: #0ea5e9; font-weight: 600;">📝 معلومات إضافية:</h4>
                <div class="purpose-text">${data.additionalInfo}</div>
                ` : ''}
            </div>
            
            <!-- Action Section -->
            <div class="action-section">
                <h3 class="section-header" style="color: #059669; justify-content: center;">
                    🔄 الإجراءات المطلوبة
                </h3>
                <p style="color: #065f46; font-size: 18px; font-weight: 600; margin-bottom: 20px;">
                    يرجى المراجعة والرد خلال 24-48 ساعة عمل
                </p>
                
                <div class="action-buttons">
                    <a href="mailto:${data.email}?subject=بخصوص طلب الترخيص رقم ${requestNumber}&body=عزيزي ${data.contactPerson}،%0A%0Aتحية طيبة وبعد،%0A%0Aبخصوص طلب الترخيص رقم ${requestNumber} المقدم من شركة ${data.companyName}..." 
                       class="action-button btn-primary">
                        📧 الرد على العميل
                    </a>
                    
                    <a href="tel:${data.phone}" class="action-button btn-secondary">
                        📞 الاتصال المباشر
                    </a>
                </div>
            </div>
            
            <!-- Checklist -->
            <div class="checklist">
                <h3 class="section-header" style="color: #d97706;">
                    ✅ قائمة المراجعة القانونية
                </h3>
                
                <div class="checklist-item">
                    <span class="checklist-icon">🔍</span>
                    <span>التحقق من صحة وتكامل البيانات المقدمة</span>
                </div>
                
                <div class="checklist-item">
                    <span class="checklist-icon">⚖️</span>
                    <span>تقييم نوع الاستخدام ومدى توافقه مع سياسات الملكية الفكرية</span>
                </div>
                
                <div class="checklist-item">
                    <span class="checklist-icon">📋</span>
                    <span>مراجعة الشروط والأحكام والتأكد من الموافقة الكاملة</span>
                </div>
                
                <div class="checklist-item">
                    <span class="checklist-icon">📄</span>
                    <span>إعداد اتفاقية الترخيص المخصصة في حالة الموافقة</span>
                </div>
                
                <div class="checklist-item">
                    <span class="checklist-icon">💾</span>
                    <span>توثيق وأرشفة جميع البيانات في نظام إدارة التراخيص</span>
                </div>
                
                <div class="checklist-item">
                    <span class="checklist-icon">📊</span>
                    <span>تحديث إحصائيات وتقارير قسم الشؤون القانونية</span>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-warning">
                <h4 style="color: #ef4444; font-weight: 700; margin-bottom: 10px;">⚠️ تنبيه أمني مهم</h4>
                <p style="color: #fecaca; font-size: 14px;">
                    هذه رسالة تلقائية من نظام إدارة التراخيص. جميع البيانات محمية وسرية. 
                    يُمنع مشاركة محتوى هذه الرسالة مع أطراف خارجية دون إذن رسمي.
                </p>
            </div>
            
            <p style="font-weight: 600; margin-bottom: 10px;">
                نظام إدارة التراخيص - وكالة ماستر إيدو باث
            </p>
            <p style="font-size: 14px; opacity: 0.8;">
                📧 legal@masteredupath.com | 📱 0500776343 | 🌐 masteredupath.com
            </p>
        </div>
    </div>
</body>
</html>
`;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: LicenseRequestData = await req.json();
    
    console.log("License request received:", {
      companyName: requestData.companyName,
      email: requestData.email,
      licenseType: requestData.licenseType,
      timestamp: new Date().toISOString()
    });
    
    // Validate required fields
    if (!requestData.companyName || !requestData.email || !requestData.contactPerson) {
      throw new Error("البيانات المطلوبة ناقصة");
    }

    if (!requestData.agreeToTerms) {
      throw new Error("يجب الموافقة على الشروط والأحكام");
    }
    
    // Generate unique license request number
    const requestNumber = `LIC${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
    
    // Send confirmation email to client
    const clientResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "وكالة ماستر إيدو باث <noreply@masteredupath.com>",
        to: [requestData.email],
        subject: `✅ تأكيد استلام طلب ترخيص الاستخدام - ${requestNumber}`,
        html: getClientEmailTemplate(requestData, requestNumber),
      }),
    });

    // Send notification email to admin team
    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "نظام التراخيص <noreply@masteredupath.com>",
        to: ["legal@masteredupath.com", "admin@masteredupath.com", "info@masteredupath.com"],
        subject: `🚨 تنبيه عاجل: طلب ترخيص جديد - ${requestNumber} - ${requestData.companyName}`,
        html: getAdminEmailTemplate(requestData, requestNumber),
      }),
    });

    console.log("Emails sent successfully:", {
      client: clientResponse.status,
      admin: adminResponse.status,
      requestNumber
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        requestNumber,
        message: "تم إرسال طلب الترخيص بنجاح مع إشعار الإدارة"
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
    
  } catch (error: any) {
    console.error("License request error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "حدث خطأ أثناء إرسال طلب الترخيص",
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});