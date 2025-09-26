interface AdminNotificationData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceName: string;
  serviceIcon: string;
  orderNumber?: string;
  priority: 'normal' | 'urgent' | 'high';
  submittedAt: string;
  serviceDetails?: any;
  estimatedValue?: string;
  deadline?: string;
  customerNotes?: string;
}

export const generateAdminNotificationTemplate = (data: AdminNotificationData): string => {
  const currentYear = new Date().getFullYear();
  const priorityConfig = {
    urgent: { 
      color: '#dc2626', 
      bgColor: '#fef2f2', 
      icon: '🚨', 
      label: 'عاجل جداً',
      borderColor: '#ef4444'
    },
    high: { 
      color: '#ea580c', 
      bgColor: '#fff7ed', 
      icon: '⚡', 
      label: 'أولوية عالية',
      borderColor: '#f97316'
    },
    normal: { 
      color: '#059669', 
      bgColor: '#f0fdf4', 
      icon: '📋', 
      label: 'أولوية عادية',
      borderColor: '#10b981'
    }
  };
  
  const priority = priorityConfig[data.priority] || priorityConfig.normal;
  
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تنبيه إداري: طلب جديد - وكالة ماستر إيدو باث</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #991b1b 100%);
      direction: rtl;
      text-align: right;
      margin: 0;
      padding: 20px 0;
    }
    
    .email-container {
      max-width: 750px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
      direction: rtl;
    }
    
    /* Alert Header */
    .alert-header {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
      position: relative;
      padding: 0;
      overflow: hidden;
    }
    
    .alert-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255, 255, 255, 0.1) 10px,
        rgba(255, 255, 255, 0.1) 20px
      );
      animation: moveStripes 2s linear infinite;
    }
    
    @keyframes moveStripes {
      0% { background-position: 0 0; }
      100% { background-position: 20px 20px; }
    }
    
    .alert-content {
      position: relative;
      z-index: 2;
      padding: 40px;
      text-align: center;
    }
    
    .alert-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      margin-bottom: 20px;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    .alert-title {
      font-size: 32px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .alert-subtitle {
      font-size: 18px;
      color: #fecaca;
      font-weight: 500;
      margin-bottom: 25px;
    }
    
    .timestamp-badge {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50px;
      padding: 12px 20px;
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
    }
    
    .timestamp-badge .icon {
      font-size: 16px;
      margin-left: 8px;
    }
    
    /* Priority Alert */
    .priority-section {
      background: ${priority.bgColor};
      border: 3px solid ${priority.borderColor};
      border-radius: 20px;
      padding: 30px;
      margin: 30px 40px;
      position: relative;
    }
    
    .priority-section::before {
      content: '${priority.icon}';
      position: absolute;
      top: -18px;
      right: 25px;
      font-size: 32px;
      background: ${priority.borderColor};
      width: 55px;
      height: 55px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
    
    .priority-title {
      font-size: 24px;
      color: ${priority.color};
      margin-bottom: 15px;
      font-weight: 800;
      text-align: center;
    }
    
    .priority-details {
      background: #ffffff;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .service-header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .service-icon {
      font-size: 40px;
      padding: 15px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 50%;
      color: white;
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
    }
    
    .service-name {
      font-size: 26px;
      color: #1e40af;
      font-weight: 700;
    }
    
    /* Customer Information */
    .customer-section {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-radius: 20px;
      padding: 35px 40px;
      margin: 30px 40px;
      border: 2px solid #3b82f6;
      position: relative;
    }
    
    .customer-section::before {
      content: '👤';
      position: absolute;
      top: -18px;
      right: 25px;
      font-size: 32px;
      background: #3b82f6;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
    }
    
    .customer-section h3 {
      font-size: 22px;
      color: #1e40af;
      margin-bottom: 25px;
      font-weight: 700;
      text-align: center;
    }
    
    .customer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .customer-info-item {
      background: #ffffff;
      padding: 25px;
      border-radius: 16px;
      border-right: 5px solid #3b82f6;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }
    
    .customer-info-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    }
    
    .info-label {
      font-size: 14px;
      color: #1e40af;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    
    .info-label .icon {
      font-size: 16px;
      margin-left: 8px;
    }
    
    .info-value {
      font-size: 17px;
      color: #1f2937;
      font-weight: 600;
      word-break: break-all;
    }
    
    .customer-name {
      color: #dc2626;
      font-size: 20px;
      font-weight: 800;
    }
    
    .full-width {
      grid-column: 1 / -1;
    }
    
    /* Order Details */
    .order-details {
      background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
      border-radius: 20px;
      padding: 35px 40px;
      margin: 30px 40px;
      border: 2px solid #f59e0b;
      position: relative;
    }
    
    .order-details::before {
      content: '📊';
      position: absolute;
      top: -18px;
      right: 25px;
      font-size: 32px;
      background: #f59e0b;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
    }
    
    .order-details h3 {
      font-size: 22px;
      color: #92400e;
      margin-bottom: 25px;
      font-weight: 700;
      text-align: center;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .detail-card {
      background: #ffffff;
      padding: 20px;
      border-radius: 14px;
      border-right: 4px solid #f59e0b;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease;
    }
    
    .detail-card:hover {
      transform: translateY(-2px);
    }
    
    .detail-label {
      font-size: 13px;
      color: #92400e;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .detail-value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 600;
    }
    
    /* Customer Notes */
    .notes-section {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 20px;
      padding: 35px 40px;
      margin: 30px 40px;
      border: 2px solid #0ea5e9;
      position: relative;
    }
    
    .notes-section::before {
      content: '💭';
      position: absolute;
      top: -18px;
      right: 25px;
      font-size: 32px;
      background: #0ea5e9;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
    }
    
    .notes-section h3 {
      font-size: 22px;
      color: #0c4a6e;
      margin-bottom: 20px;
      font-weight: 700;
      text-align: center;
    }
    
    .notes-content {
      background: #ffffff;
      padding: 25px;
      border-radius: 16px;
      border-right: 4px solid #0ea5e9;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      font-size: 16px;
      line-height: 1.8;
      color: #374151;
    }
    
    /* Action Buttons */
    .actions-section {
      padding: 40px;
      text-align: center;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-top: 3px solid #cbd5e1;
    }
    
    .actions-title {
      font-size: 24px;
      color: #1e293b;
      margin-bottom: 25px;
      font-weight: 700;
    }
    
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      padding: 16px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      min-width: 180px;
      justify-content: center;
    }
    
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .action-btn.primary {
      background: linear-gradient(135deg, #dc2626, #ef4444);
      color: white;
    }
    
    .action-btn.secondary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }
    
    .action-btn .icon {
      font-size: 18px;
      margin-left: 10px;
    }
    
    /* Footer */
    .admin-footer {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #94a3b8;
      padding: 40px;
      text-align: center;
      position: relative;
    }
    
    .admin-footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #ef4444, #f59e0b, #3b82f6);
    }
    
    .footer-content {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .footer-logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      margin-bottom: 20px;
    }
    
    .footer-title {
      font-size: 22px;
      color: #ffffff;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .footer-subtitle {
      font-size: 14px;
      color: #cbd5e1;
      margin-bottom: 25px;
    }
    
    .system-info {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      margin: 25px 0;
    }
    
    .system-info h5 {
      color: #e2e8f0;
      font-size: 16px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .system-info p {
      font-size: 13px;
      color: #94a3b8;
      margin: 5px 0;
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
      
      .alert-content,
      .priority-section,
      .customer-section,
      .order-details,
      .notes-section,
      .actions-section,
      .admin-footer {
        padding: 25px;
        margin: 20px 15px;
      }
      
      .alert-title {
        font-size: 26px;
      }
      
      .customer-grid,
      .details-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .action-btn {
        width: 100%;
        max-width: 300px;
      }
    }
    
    @media only screen and (max-width: 480px) {
      .alert-content,
      .priority-section,
      .customer-section,
      .order-details,
      .notes-section,
      .actions-section,
      .admin-footer {
        padding: 20px;
        margin: 15px 10px;
      }
      
      .alert-title {
        font-size: 22px;
      }
      
      .service-header {
        flex-direction: column;
      }
      
      .service-name {
        font-size: 22px;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Alert Header -->
    <div class="alert-header">
      <div class="alert-content">
        <div class="alert-icon">🚨</div>
        <h1 class="alert-title">تنبيه إداري عاجل</h1>
        <p class="alert-subtitle">طلب جديد يتطلب المراجعة الفورية</p>
        <div class="timestamp-badge">
          <span class="icon">🕐</span>
          <span>تم الاستلام: ${data.submittedAt}</span>
        </div>
      </div>
    </div>

    <!-- Priority Section -->
    <div class="priority-section">
      <h2 class="priority-title">مستوى الأولوية: ${priority.label}</h2>
      <div class="priority-details">
        <div class="service-header">
          <div class="service-icon">${data.serviceIcon}</div>
          <div class="service-name">${data.serviceName}</div>
        </div>
        ${data.orderNumber ? `
        <div style="text-align: center; margin-top: 15px;">
          <span style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 8px 20px; border-radius: 25px; font-weight: 600; font-size: 14px;">
            رقم الطلب: ${data.orderNumber}
          </span>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- Customer Information -->
    <div class="customer-section">
      <h3>معلومات العميل الكاملة</h3>
      <div class="customer-grid">
        <div class="customer-info-item">
          <div class="info-label">
            <span class="icon">👤</span>
            <span>اسم العميل</span>
          </div>
          <div class="info-value customer-name">${data.customerName}</div>
        </div>
        
        <div class="customer-info-item">
          <div class="info-label">
            <span class="icon">📧</span>
            <span>البريد الإلكتروني</span>
          </div>
          <div class="info-value">${data.customerEmail}</div>
        </div>
        
        ${data.customerPhone ? `
        <div class="customer-info-item">
          <div class="info-label">
            <span class="icon">📱</span>
            <span>رقم الهاتف</span>
          </div>
          <div class="info-value">${data.customerPhone}</div>
        </div>
        ` : ''}
        
        <div class="customer-info-item">
          <div class="info-label">
            <span class="icon">⏰</span>
            <span>وقت الاستلام</span>
          </div>
          <div class="info-value">${data.submittedAt}</div>
        </div>
      </div>
    </div>

    <!-- Order Details -->
    <div class="order-details">
      <h3>تفاصيل الطلب المُستلم</h3>
      <div class="details-grid">
        <div class="detail-card">
          <div class="detail-label">نوع الخدمة</div>
          <div class="detail-value">${data.serviceName}</div>
        </div>
        
        <div class="detail-card">
          <div class="detail-label">مستوى الأولوية</div>
          <div class="detail-value">${priority.label}</div>
        </div>
        
        ${data.estimatedValue ? `
        <div class="detail-card">
          <div class="detail-label">القيمة المتوقعة</div>
          <div class="detail-value">${data.estimatedValue}</div>
        </div>
        ` : ''}
        
        ${data.deadline ? `
        <div class="detail-card">
          <div class="detail-label">الموعد النهائي</div>
          <div class="detail-value">${data.deadline}</div>
        </div>
        ` : ''}
        
        <div class="detail-card full-width">
          <div class="detail-label">حالة المعالجة</div>
          <div class="detail-value" style="color: #dc2626; font-weight: 800;">في انتظار المراجعة الإدارية</div>
        </div>
      </div>
    </div>

    ${data.customerNotes ? `
    <!-- Customer Notes -->
    <div class="notes-section">
      <h3>ملاحظات العميل</h3>
      <div class="notes-content">
        ${data.customerNotes}
      </div>
    </div>
    ` : ''}

    <!-- Actions Section -->
    <div class="actions-section">
      <h3 class="actions-title">الإجراءات المطلوبة</h3>
      <div class="action-buttons">
        <a href="mailto:${data.customerEmail}" class="action-btn primary">
          <span class="icon">📧</span>
          <span>الرد على العميل</span>
        </a>
        
        <a href="https://www.masteredupath.com/admin/orders" class="action-btn secondary">
          <span class="icon">👁</span>
          <span>مراجعة في النظام</span>
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="admin-footer">
      <div class="footer-content">
        <div class="footer-logo">⚙️</div>
        <h4 class="footer-title">نظام الإشعارات الإدارية</h4>
        <p class="footer-subtitle">وكالة ماستر إيدو باث - نظام إدارة الطلبات</p>
        
        <div class="system-info">
          <h5>معلومات النظام</h5>
          <p>خادم الإشعارات: info@masteredupath.com</p>
          <p>وقت الإرسال: ${new Date().toLocaleString('ar-SA')}</p>
          <p>رقم الإشعار: ${Date.now()}</p>
          <p>نوع التنبيه: طلب خدمة جديد - ${priority.label}</p>
        </div>
        
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <p style="font-size: 12px; color: #64748b;">
            &copy; ${currentYear} نظام إدارة وكالة ماستر إيدو باث. جميع الحقوق محفوظة.
          </p>
          <p style="font-size: 11px; color: #475569; margin-top: 8px;">
            هذا إشعار تلقائي من النظام. يُرجى عدم الرد على هذا البريد الإلكتروني.
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};