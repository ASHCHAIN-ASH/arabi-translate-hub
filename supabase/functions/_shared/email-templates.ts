// ===============================================
// نظام قوالب البريد الإلكتروني الموحد والمتطور
// جميع القوالب RTL + خطوط عربية + متجاوبة + أنيميشن
// ===============================================

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface BaseEmailData {
  recipientName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  requestNumber?: string;
  date?: string;
}

// ===============================================
// الأساسيات والـ CSS المشترك
// ===============================================

const getBaseEmailCSS = () => `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100;200;300;400;500;600;700;800;900&family=Tahoma:wght@400;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Noto Sans Arabic', 'Tahoma', 'Arial', sans-serif;
    line-height: 1.8;
    color: #1a202c;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    direction: rtl;
    text-align: right;
    padding: 20px;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .email-wrapper {
    max-width: 700px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: fadeInUp 0.8s ease-out;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
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
    animation: pulse 3s ease-in-out infinite;
  }
  
  .company-logo {
    font-size: 48px;
    animation: float 4s ease-in-out infinite;
  }
  
  .company-title {
    font-size: 32px;
    font-weight: 900;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    position: relative;
    z-index: 2;
    animation: slideInRight 0.8s ease-out 0.2s both;
  }
  
  .company-subtitle {
    font-size: 18px;
    opacity: 0.95;
    font-weight: 300;
    position: relative;
    z-index: 2;
    animation: slideInRight 0.8s ease-out 0.4s both;
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
    padding: 25px;
    border-radius: 15px;
    border: 2px solid #e0e7ff;
    animation: slideInRight 0.8s ease-out 0.6s both;
  }
  
  .main-message {
    font-size: 18px;
    color: #2d3748;
    margin-bottom: 35px;
    line-height: 1.9;
    text-align: center;
    animation: slideInRight 0.8s ease-out 0.8s both;
  }
  
  .highlight-card {
    background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
    color: white;
    padding: 30px;
    border-radius: 18px;
    text-align: center;
    margin: 30px 0;
    box-shadow: 0 15px 35px rgba(124, 58, 237, 0.3);
    animation: slideInRight 0.8s ease-out 1s both;
  }
  
  .highlight-label {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 15px;
  }
  
  .highlight-value {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: 3px;
    font-family: 'Noto Sans Arabic', monospace;
  }
  
  .info-card {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 20px;
    padding: 40px;
    margin: 30px 0;
    border-right: 6px solid #1e40af;
    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
    animation: slideInRight 0.8s ease-out 1.2s both;
  }
  
  .info-header {
    color: #1e40af;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-bottom: 15px;
    background: white;
    border-radius: 12px;
    border-right: 4px solid #7c3aed;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .info-row:hover {
    transform: translateX(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
  
  .info-label {
    font-weight: 600;
    color: #1e40af;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .info-value {
    color: #1a202c;
    font-weight: 500;
    font-size: 16px;
  }
  
  .steps-card {
    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
    border-radius: 20px;
    padding: 40px;
    margin: 30px 0;
    border-right: 6px solid #22c55e;
    animation: slideInRight 0.8s ease-out 1.4s both;
  }
  
  .steps-header {
    color: #16a34a;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .step-item {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 25px;
    font-size: 16px;
    color: #374151;
    background: white;
    padding: 20px;
    border-radius: 12px;
    border-right: 3px solid #22c55e;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.3s ease;
  }
  
  .step-item:hover {
    transform: translateX(-3px);
  }
  
  .step-number {
    background: #22c55e;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .timeline-notice {
    font-size: 22px;
    color: #7c3aed;
    text-align: center;
    margin: 40px 0;
    padding: 30px;
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    border-radius: 18px;
    border: 2px solid #e9d5ff;
    font-weight: 600;
    animation: pulse 2s ease-in-out infinite;
  }
  
  .contact-section {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: white;
    border-radius: 20px;
    padding: 45px;
    margin: 30px 0;
    text-align: center;
    animation: slideInRight 0.8s ease-out 1.6s both;
  }
  
  .contact-title {
    color: #fbbf24;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 30px;
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 25px;
    margin: 30px 0;
  }
  
  .contact-item {
    text-align: center;
    padding: 25px;
    background: rgba(255,255,255,0.1);
    border-radius: 15px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .contact-item:hover {
    background: rgba(255,255,255,0.15);
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
  
  .contact-icon {
    font-size: 36px;
    color: #fbbf24;
    margin-bottom: 15px;
    display: block;
  }
  
  .contact-text {
    font-size: 16px;
    font-weight: 500;
  }
  
  .footer {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: white;
    padding: 35px;
    text-align: center;
  }
  
  .footer-content {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 25px;
    margin-top: 25px;
    font-size: 14px;
    opacity: 0.9;
    line-height: 1.6;
  }
  
  .urgency-banner {
    background: linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
    color: white;
    padding: 25px;
    text-align: center;
    font-weight: 800;
    font-size: 20px;
    animation: pulse 2s infinite;
  }
  
  .admin-section {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border: 3px solid #ef4444;
    border-radius: 18px;
    padding: 35px;
    margin: 30px 0;
    text-align: center;
  }
  
  .admin-title {
    color: #dc2626;
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
  
  .action-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
    margin: 25px 0;
  }
  
  .action-button {
    display: inline-block;
    padding: 18px 35px;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    color: white;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }
  
  .btn-secondary {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  }
  
  .action-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
  
  /* =============================================== */
  /* التجاوب مع الأجهزة المختلفة */
  /* =============================================== */
  
  @media (max-width: 768px) {
    body { padding: 10px; }
    .email-wrapper { border-radius: 15px; }
    .header { padding: 30px 20px; }
    .content { padding: 30px 25px; }
    .company-title { font-size: 26px; }
    .company-subtitle { font-size: 16px; }
    .greeting { font-size: 20px; padding: 20px; }
    .main-message { font-size: 16px; }
    .highlight-value { font-size: 28px; }
    .info-card, .steps-card, .contact-section { padding: 25px 20px; }
    .info-row { flex-direction: column; gap: 10px; text-align: right; }
    .contact-grid { grid-template-columns: 1fr; }
    .action-buttons { flex-direction: column; }
  }
  
  @media (max-width: 480px) {
    .company-title { font-size: 22px; }
    .greeting { font-size: 18px; }
    .highlight-value { font-size: 24px; }
    .step-item { flex-direction: column; text-align: center; }
    .step-number { margin-bottom: 10px; }
  }
</style>
`;

// ===============================================
// قالب العميل الأساسي
// ===============================================

export const generateClientEmailTemplate = (
  data: BaseEmailData & {
    title: string;
    message: string;
    highlightInfo?: { label: string; value: string };
    details?: Array<{ label: string; value: string; icon?: string }>;
    steps?: Array<{ title: string; description: string }>;
    timelineNotice?: string;
  }
): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
      ${getBaseEmailCSS()}
    </head>
    <body>
      <div class="email-wrapper">
        <!-- الهيدر -->
        <div class="header">
          <div class="logo-container">
            <div class="company-logo">⚖️</div>
          </div>
          <h1 class="company-title">وكالة ماستر إيدو باث</h1>
          <p class="company-subtitle">للحلول التعليمية والملكية الفكرية المتقدمة</p>
        </div>
        
        <!-- المحتوى -->
        <div class="content">
          <div class="greeting">
            السلام عليكم ${data.recipientName ? data.recipientName + ' الكريم' : ''} 🌟
          </div>
          
          <p class="main-message">${data.message}</p>
          
          ${data.highlightInfo ? `
          <div class="highlight-card">
            <div class="highlight-label">${data.highlightInfo.label}</div>
            <div class="highlight-value">${data.highlightInfo.value}</div>
          </div>
          ` : ''}
          
          ${data.details ? `
          <div class="info-card">
            <h3 class="info-header">
              📋 التفاصيل الكاملة
            </h3>
            ${data.details.map(detail => `
            <div class="info-row">
              <span class="info-label">${detail.icon || '📌'} ${detail.label}</span>
              <span class="info-value">${detail.value}</span>
            </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${data.steps ? `
          <div class="steps-card">
            <h3 class="steps-header">
              ⏰ المراحل التالية
            </h3>
            ${data.steps.map((step, index) => `
            <div class="step-item">
              <div class="step-number">${index + 1}</div>
              <div>
                <strong>${step.title}:</strong> ${step.description}
              </div>
            </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${data.timelineNotice ? `
          <div class="timeline-notice">
            ${data.timelineNotice}
          </div>
          ` : ''}
        </div>
        
        <!-- قسم التواصل -->
        <div class="contact-section">
          <h3 class="contact-title">📞 قنوات التواصل والاستفسارات</h3>
          
          <div class="contact-grid">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <div class="contact-text">legal@masteredupath.com</div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📱</span>
              <div class="contact-text">0500776343</div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">🌐</span>
              <div class="contact-text">www.masteredupath.com</div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <div class="contact-text">جدة، المملكة العربية السعودية</div>
            </div>
          </div>
          
          <div class="footer-content">
            هذا الإيميل تم إرساله تلقائياً من نظام إدارة العمليات.<br>
            للاستفسارات والمتابعة، يرجى التواصل عبر القنوات الرسمية المذكورة أعلاه.<br><br>
            © 2024 وكالة ماستر إيدو باث للحلول التعليمية المتقدمة<br>
            جميع الحقوق محفوظة | المملكة العربية السعودية
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // النص البديل
  const text = `
    ${data.title}
    
    السلام عليكم ${data.recipientName ? data.recipientName + ' الكريم' : ''}
    
    ${data.message}
    
    ${data.highlightInfo ? `${data.highlightInfo.label}: ${data.highlightInfo.value}` : ''}
    
    ${data.details ? data.details.map(d => `${d.label}: ${d.value}`).join('\n') : ''}
    
    ${data.timelineNotice || ''}
    
    للتواصل:
    📧 legal@masteredupath.com
    📱 0500776343
    🌐 www.masteredupath.com
    
    © 2024 وكالة ماستر إيدو باث للحلول التعليمية المتقدمة
  `;
  
  return {
    subject: data.title,
    html,
    text
  };
};

// ===============================================
// قالب الإدارة المتقدم
// ===============================================

export const generateAdminEmailTemplate = (
  data: BaseEmailData & {
    title: string;
    message: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    details?: Array<{ label: string; value: string; icon?: string }>;
    actionButtons?: Array<{ label: string; url: string; type: 'primary' | 'secondary' }>;
    checklist?: string[];
    additionalInfo?: string;
  }
): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
      ${getBaseEmailCSS()}
    </head>
    <body>
      <div class="email-wrapper">
        ${data.urgencyLevel === 'critical' || data.urgencyLevel === 'high' ? `
        <div class="urgency-banner">
          🚨 تنبيه ${data.urgencyLevel === 'critical' ? 'عاجل جداً' : 'عاجل'}: يتطلب الاهتمام الفوري 🚨
        </div>
        ` : ''}
        
        <!-- الهيدر -->
        <div class="header">
          <div class="logo-container">
            <div class="company-logo">⚡</div>
          </div>
          <h1 class="company-title">نظام الإدارة المتقدم</h1>
          <p class="company-subtitle">وكالة ماستر إيدو باث - لوحة التحكم الإدارية</p>
        </div>
        
        <!-- المحتوى -->
        <div class="content">
          <div class="admin-section">
            <h2 class="admin-title">
              ⏰ ${data.title}
            </h2>
            <p style="font-size: 18px; color: #dc2626; font-weight: 600;">
              ${data.message}
            </p>
            <p style="font-size: 20px; font-weight: 800; color: #dc2626; margin-top: 15px;">
              ${data.requestNumber ? `رقم المرجع: ${data.requestNumber}` : ''}
            </p>
          </div>
          
          ${data.details ? `
          <div class="info-card">
            <h3 class="info-header">
              📋 معلومات تفصيلية
            </h3>
            ${data.details.map(detail => `
            <div class="info-row">
              <span class="info-label">${detail.icon || '📌'} ${detail.label}</span>
              <span class="info-value">${detail.value}</span>
            </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${data.actionButtons ? `
          <div class="steps-card">
            <h3 class="steps-header">
              🔄 الإجراءات المطلوبة
            </h3>
            <p style="color: #065f46; font-size: 18px; font-weight: 600; margin-bottom: 25px; text-align: center;">
              يرجى المراجعة والرد خلال 24-48 ساعة عمل
            </p>
            
            <div class="action-buttons">
              ${data.actionButtons.map(button => `
              <a href="${button.url}" class="action-button btn-${button.type}">
                ${button.label}
              </a>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${data.checklist ? `
          <div class="admin-section">
            <h3 class="admin-title" style="color: #d97706; font-size: 22px;">
              ✅ قائمة المراجعة الإدارية
            </h3>
            ${data.checklist.map(item => `
            <div style="display: flex; align-items: flex-start; gap: 15px; margin: 15px 0; color: #92400e;">
              <span style="color: #d97706; font-size: 18px; margin-top: 2px;">🔍</span>
              <span>${item}</span>
            </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${data.additionalInfo ? `
          <div class="timeline-notice">
            📝 ${data.additionalInfo}
          </div>
          ` : ''}
        </div>
        
        <!-- الفوتر الإداري -->
        <div class="footer">
          <div style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h4 style="color: #ef4444; font-weight: 700; margin-bottom: 10px;">⚠️ تنبيه أمني مهم</h4>
            <p style="color: #fecaca; font-size: 14px;">
              هذه رسالة تلقائية من النظام الإداري. جميع البيانات محمية وسرية. 
              يُمنع مشاركة محتوى هذه الرسالة مع أطراف خارجية دون إذن رسمي.
            </p>
          </div>
          
          <p style="font-weight: 600; margin-bottom: 10px;">
            نظام الإدارة المتقدم - وكالة ماستر إيدو باث
          </p>
          <p style="font-size: 14px; opacity: 0.8;">
            📧 legal@masteredupath.com | 📱 0500776343 | 🌐 masteredupath.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    ${data.title}
    ${data.urgencyLevel === 'critical' || data.urgencyLevel === 'high' ? '🚨 URGENT 🚨' : ''}
    
    ${data.message}
    ${data.requestNumber ? `رقم المرجع: ${data.requestNumber}` : ''}
    
    ${data.details ? data.details.map(d => `${d.label}: ${d.value}`).join('\n') : ''}
    
    ${data.additionalInfo || ''}
    
    النظام الإداري - وكالة ماستر إيدو باث
    📧 legal@masteredupath.com | 📱 0500776343
  `;
  
  return {
    subject: `${data.urgencyLevel === 'critical' ? '🚨 عاجل جداً: ' : data.urgencyLevel === 'high' ? '🚨 عاجل: ' : ''}${data.title}`,
    html,
    text
  };
};

// ===============================================
// قالب إشعارات النظام
// ===============================================

export const generateSystemNotificationTemplate = (
  data: BaseEmailData & {
    title: string;
    message: string;
    notificationType: 'success' | 'warning' | 'error' | 'info';
    systemInfo?: Array<{ label: string; value: string }>;
  }
): EmailTemplate => {
  const iconMap = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };
  
  const colorMap = {
    success: '#22c55e',
    warning: '#f59e0b', 
    error: '#ef4444',
    info: '#3b82f6'
  };
  
  return generateClientEmailTemplate({
    ...data,
    title: `${iconMap[data.notificationType]} ${data.title}`,
    message: data.message,
    details: data.systemInfo?.map(info => ({
      label: info.label,
      value: info.value,
      icon: '🖥️'
    }))
  });
};

// ===============================================
// دوال مساعدة للتواريخ والتنسيق
// ===============================================

export const formatArabicDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateRequestNumber = (prefix: string = 'REQ'): string => {
  return `${prefix}${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
};

// ===============================================
// تصدير القوالب المخصصة لكل نوع
// ===============================================

export const EmailTemplates = {
  client: generateClientEmailTemplate,
  admin: generateAdminEmailTemplate, 
  system: generateSystemNotificationTemplate,
  utils: {
    formatArabicDate,
    generateRequestNumber
  }
};