interface CustomerEmailData {
  name: string;
  email: string;
  phone?: string;
  serviceName: string;
  serviceIcon: string;
  serviceDetails?: any;
  orderNumber?: string;
  estimatedDelivery?: string;
  priority?: string;
}

export const generateCustomerConfirmationTemplate = (data: CustomerEmailData): string => {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد استلام طلبكم - وكالة ماستر إيدو باث</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
      color: #1a365d;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      direction: rtl;
      text-align: right;
      margin: 0;
      padding: 20px 0;
    }
    
    .email-container {
      max-width: 700px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      direction: rtl;
    }
    
    /* Header Section */
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #581c87 100%);
      position: relative;
      padding: 0;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="80" r="1" fill="white" opacity="0.08"/><circle cx="40" cy="60" r="1" fill="white" opacity="0.06"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
      opacity: 0.3;
    }
    
    .header-content {
      position: relative;
      z-index: 2;
      padding: 45px 40px 35px;
      text-align: center;
    }
    
    .logo-section {
      margin-bottom: 25px;
    }
    
    .main-logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      color: white;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
    
    .company-name {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      margin: 20px 0 8px;
      letter-spacing: 0.5px;
    }
    
    .company-tagline {
      font-size: 16px;
      color: #e2e8f0;
      font-weight: 400;
      opacity: 0.95;
      margin-bottom: 25px;
    }
    
    .service-badge {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      padding: 12px 24px;
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
    }
    
    .service-badge .icon {
      font-size: 20px;
      margin-left: 12px;
    }
    
    /* Main Content */
    .main-content {
      padding: 50px 40px;
    }
    
    .greeting {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 35px;
      border-right: 6px solid #0ea5e9;
      position: relative;
    }
    
    .greeting::before {
      content: '✨';
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 24px;
      background: #0ea5e9;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .greeting h2 {
      font-size: 22px;
      color: #0c4a6e;
      margin-bottom: 15px;
      font-weight: 700;
    }
    
    .greeting p {
      font-size: 17px;
      color: #0f172a;
      line-height: 1.8;
      margin: 0;
    }
    
    .customer-name {
      color: #1e40af;
      font-weight: 700;
      font-size: 19px;
    }
    
    /* Service Details Card */
    .details-card {
      background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
      border-radius: 20px;
      padding: 35px;
      margin: 35px 0;
      border: 2px solid #fbbf24;
      position: relative;
    }
    
    .details-card::before {
      content: '📋';
      position: absolute;
      top: -15px;
      right: 25px;
      font-size: 30px;
      background: #fbbf24;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
    }
    
    .details-card h3 {
      font-size: 20px;
      color: #92400e;
      margin-bottom: 25px;
      font-weight: 700;
      text-align: center;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    
    .detail-item {
      background: #ffffff;
      padding: 20px;
      border-radius: 12px;
      border-right: 4px solid #f59e0b;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease;
    }
    
    .detail-item:hover {
      transform: translateY(-2px);
    }
    
    .detail-label {
      font-size: 14px;
      color: #92400e;
      font-weight: 600;
      margin-bottom: 8px;
      display: block;
    }
    
    .detail-value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 700;
    }
    
    .full-width {
      grid-column: 1 / -1;
    }
    
    /* Next Steps Section */
    .steps-section {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-radius: 20px;
      padding: 35px;
      margin: 35px 0;
      border: 2px solid #22c55e;
      position: relative;
    }
    
    .steps-section::before {
      content: '⚡';
      position: absolute;
      top: -15px;
      right: 25px;
      font-size: 30px;
      background: #22c55e;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
    }
    
    .steps-section h3 {
      font-size: 20px;
      color: #15803d;
      margin-bottom: 25px;
      font-weight: 700;
      text-align: center;
    }
    
    .steps-list {
      list-style: none;
      padding: 0;
      margin: 0;
      counter-reset: step-counter;
    }
    
    .steps-list li {
      counter-increment: step-counter;
      background: #ffffff;
      margin: 16px 0;
      padding: 20px 25px 20px 70px;
      border-radius: 14px;
      position: relative;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      font-size: 16px;
      font-weight: 600;
      color: #064e3b;
      border-right: 4px solid #10b981;
      transition: all 0.3s ease;
    }
    
    .steps-list li:hover {
      transform: translateX(-5px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }
    
    .steps-list li::before {
      content: counter(step-counter);
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    /* Priority Alert */
    .priority-alert {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border: 2px solid #ef4444;
      border-radius: 16px;
      padding: 25px;
      margin: 25px 0;
      text-align: center;
    }
    
    .priority-alert .icon {
      font-size: 32px;
      margin-bottom: 12px;
      display: block;
    }
    
    .priority-alert h4 {
      color: #dc2626;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .priority-alert p {
      color: #991b1b;
      font-size: 15px;
      margin: 0;
    }
    
    /* Contact Section */
    .contact-section {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-radius: 20px;
      padding: 40px;
      margin: 35px 0;
      color: #ffffff;
      position: relative;
      overflow: hidden;
    }
    
    .contact-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="2" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1.5" fill="white" opacity="0.08"/></svg>') repeat;
      opacity: 0.3;
    }
    
    .contact-content {
      position: relative;
      z-index: 2;
    }
    
    .contact-section h3 {
      font-size: 22px;
      margin-bottom: 25px;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .contact-item {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 20px;
      border-radius: 14px;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .contact-item:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-3px);
    }
    
    .contact-item .icon {
      font-size: 24px;
      margin-bottom: 10px;
      display: block;
    }
    
    .contact-item .label {
      font-size: 14px;
      color: #cbd5e1;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .contact-item .value {
      font-size: 15px;
      color: #ffffff;
      font-weight: 700;
    }
    
    /* Footer */
    .footer {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #94a3b8;
      padding: 50px 40px;
      text-align: center;
      position: relative;
    }
    
    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b);
    }
    
    .footer-content {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .footer-logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      margin-bottom: 20px;
    }
    
    .footer h4 {
      font-size: 24px;
      color: #ffffff;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .footer-tagline {
      font-size: 16px;
      color: #cbd5e1;
      margin-bottom: 30px;
      font-style: italic;
    }
    
    .footer-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    
    .info-block {
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .info-block h5 {
      color: #e2e8f0;
      font-size: 16px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .info-block p {
      font-size: 14px;
      color: #94a3b8;
      margin: 6px 0;
      line-height: 1.6;
    }
    
    .info-block a {
      color: #60a5fa;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }
    
    .info-block a:hover {
      color: #93c5fd;
    }
    
    .social-links {
      margin: 30px 0 20px;
    }
    
    .social-links a {
      display: inline-flex;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      margin: 0 8px;
      font-size: 18px;
      color: #cbd5e1;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .social-links a:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      transform: translateY(-2px);
    }
    
    .copyright {
      font-size: 13px;
      color: #64748b;
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .legal-links {
      margin-top: 15px;
    }
    
    .legal-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 12px;
      margin: 0 10px;
      transition: color 0.2s ease;
    }
    
    .legal-links a:hover {
      color: #cbd5e1;
    }
    
    /* Responsive Design */
    @media only screen and (max-width: 768px) {
      body {
        padding: 10px 0;
      }
      
      .email-container {
        margin: 0 10px;
        border-radius: 16px;
      }
      
      .header-content,
      .main-content,
      .footer {
        padding: 30px 25px;
      }
      
      .company-name {
        font-size: 24px;
      }
      
      .details-grid,
      .contact-grid {
        grid-template-columns: 1fr;
      }
      
      .steps-list li {
        padding: 16px 20px 16px 60px;
        font-size: 15px;
      }
      
      .steps-list li::before {
        width: 30px;
        height: 30px;
        right: 15px;
        font-size: 14px;
      }
      
      .footer-info {
        grid-template-columns: 1fr;
      }
    }
    
    @media only screen and (max-width: 480px) {
      .header-content,
      .main-content,
      .footer {
        padding: 25px 20px;
      }
      
      .company-name {
        font-size: 20px;
      }
      
      .greeting h2 {
        font-size: 18px;
      }
      
      .details-card h3,
      .steps-section h3,
      .contact-section h3 {
        font-size: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="main-logo">🎓</div>
        </div>
        <h1 class="company-name">وكالة ماستر إيدو باث</h1>
        <p class="company-tagline">Master Edu Path Agency</p>
        <div class="service-badge">
          <span class="icon">${data.serviceIcon}</span>
          <span>تأكيد استلام طلب ${data.serviceName}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Greeting -->
      <div class="greeting">
        <h2>السلام عليكم ورحمة الله وبركاته</h2>
        <p>
          المحترم/ة <span class="customer-name">${data.name}</span><br>
          نشكركم لثقتكم الغالية في خدماتنا المتميزة، ويسعدنا إعلامكم بأنه تم استلام طلبكم بنجاح وسيتم التعامل معه بأقصى درجات الاحترافية والسرعة.
        </p>
      </div>

      <!-- Service Details -->
      <div class="details-card">
        <h3>تفاصيل طلبكم المُستلم</h3>
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">الاسم الكامل</span>
            <div class="detail-value">${data.name}</div>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">البريد الإلكتروني</span>
            <div class="detail-value">${data.email}</div>
          </div>
          
          ${data.phone ? `
          <div class="detail-item">
            <span class="detail-label">رقم الهاتف</span>
            <div class="detail-value">${data.phone}</div>
          </div>
          ` : ''}
          
          <div class="detail-item">
            <span class="detail-label">نوع الخدمة</span>
            <div class="detail-value">${data.serviceName}</div>
          </div>
          
          ${data.orderNumber ? `
          <div class="detail-item">
            <span class="detail-label">رقم الطلب</span>
            <div class="detail-value">${data.orderNumber}</div>
          </div>
          ` : ''}
          
          ${data.estimatedDelivery ? `
          <div class="detail-item">
            <span class="detail-label">الموعد المتوقع للتسليم</span>
            <div class="detail-value">${data.estimatedDelivery}</div>
          </div>
          ` : ''}
        </div>
      </div>

      ${data.priority === 'urgent' ? `
      <!-- Priority Alert -->
      <div class="priority-alert">
        <span class="icon">🚨</span>
        <h4>طلب عاجل - أولوية قصوى</h4>
        <p>تم تصنيف طلبكم كطلب عاجل وسيحصل على أولوية قصوى في التنفيذ</p>
      </div>
      ` : ''}

      <!-- Next Steps -->
      <div class="steps-section">
        <h3>الخطوات التالية في رحلة خدمتكم</h3>
        <ul class="steps-list">
          <li>مراجعة شاملة ودقيقة لتفاصيل طلبكم من قبل فريق الخبراء المتخصصين</li>
          <li>التواصل المباشر معكم خلال 4 ساعات كحد أقصى لمناقشة التفاصيل</li>
          <li>إعداد عرض سعر مفصل وخطة زمنية واضحة ومدروسة</li>
          <li>بدء العمل فور موافقتكم وفق أعلى معايير الجودة العالمية</li>
          <li>تسليم النتائج النهائية بجودة استثنائية في الموعد المحدد</li>
        </ul>
      </div>

      <!-- Contact Section -->
      <div class="contact-section">
        <div class="contact-content">
          <h3>🌟 طرق التواصل المباشر معنا</h3>
          <div class="contact-grid">
            <div class="contact-item">
              <span class="icon">📧</span>
              <div class="label">البريد الإلكتروني</div>
              <div class="value">info@masteredupath.com</div>
            </div>
            
            <div class="contact-item">
              <span class="icon">📱</span>
              <div class="label">الواتساب</div>
              <div class="value">+966 50 505 0505</div>
            </div>
            
            <div class="contact-item">
              <span class="icon">🌐</span>
              <div class="label">الموقع الإلكتروني</div>
              <div class="value">www.masteredupath.com</div>
            </div>
            
            <div class="contact-item">
              <span class="icon">⏰</span>
              <div class="label">خدمة العملاء</div>
              <div class="value">متاحة 24/7</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-content">
        <div class="footer-logo">🎓</div>
        <h4>وكالة ماستر إيدو باث</h4>
        <p class="footer-tagline">شريكك الموثوق في التميز الأكاديمي والمهني</p>
        
        <div class="footer-info">
          <div class="info-block">
            <h5>معلومات التواصل</h5>
            <p>📧 <a href="mailto:info@masteredupath.com">info@masteredupath.com</a></p>
            <p>📧 <a href="mailto:support@masteredupath.com">support@masteredupath.com</a></p>
            <p>📱 <a href="https://wa.me/966505050505">+966 50 505 0505</a></p>
          </div>
          
          <div class="info-block">
            <h5>العنوان الرسمي</h5>
            <p>المملكة العربية السعودية</p>
            <p>الرياض - حي الملقا</p>
            <p>طريق الملك فهد - مجمع الأعمال</p>
            <p>الدور الثالث - مكتب 301</p>
          </div>
        </div>
        
        <div class="social-links">
          <a href="https://twitter.com/masteredupath" title="تويتر">🐦</a>
          <a href="https://linkedin.com/company/masteredupath" title="لينكد إن">💼</a>
          <a href="https://instagram.com/masteredupath" title="انستغرام">📷</a>
          <a href="https://www.masteredupath.com" title="الموقع الرسمي">🌐</a>
        </div>
        
        <div class="copyright">
          <p>&copy; ${currentYear} وكالة ماستر إيدو باث. جميع الحقوق محفوظة.</p>
          <p>ترخيص وزارة التجارة رقم: 1010123456 | ISO 27001 Certified</p>
          
          <div class="legal-links">
            <a href="https://www.masteredupath.com/privacy">سياسة الخصوصية</a>
            <a href="https://www.masteredupath.com/terms">الشروط والأحكام</a>
            <a href="mailto:info@masteredupath.com?subject=إلغاء الاشتراك">إلغاء الاشتراك</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};