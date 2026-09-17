-- إضافة قالب إيميل للفاتورة
INSERT INTO public.email_templates (
  template_key,
  name,
  subject_template,
  html_template,
  variables,
  is_active,
  category
) VALUES (
  'invoice_pdf',
  'فاتورة ضريبية PDF',
  'فاتورة ضريبية رقم {{invoice_number}} - وكالة فكرة إيدو',
  '
  <!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة ضريبية</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; direction: rtl;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: white;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #1a365d, #3182ce); color: white; border-radius: 8px;">
        <h1 style="margin: 0; font-size: 28px;">وكالة فكرة إيدو</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">FekrahEdu Agency</p>
      </div>
      
      <!-- Main Content -->
      <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1a365d; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          عزيزنا العميل {{customer_name}}
        </h2>
        
        <p style="font-size: 16px; margin-bottom: 15px;">
          نتشرف بإرسال فاتورتكم الضريبية رقم <strong style="color: #3182ce;">{{invoice_number}}</strong>
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 6px; border-right: 4px solid #38a169; margin: 20px 0;">
          <h3 style="color: #2d3748; margin-bottom: 15px;">تفاصيل الفاتورة:</h3>
          <p style="font-size: 18px; font-weight: bold; color: #1a365d;">
            إجمالي المبلغ: <span style="color: #38a169;">{{total_amount}} ريال سعودي</span>
          </p>
        </div>
        
        <div style="background: #fed7d7; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #fc8181;">
          <p style="font-weight: bold; color: #c53030; margin: 0; text-align: center;">
            ⚠️ هذه الفاتورة شاملة ضريبة القيمة المضافة 15%
          </p>
        </div>
      </div>
      
      <!-- Services Section -->
      <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1a365d; margin-bottom: 15px;">خدماتنا المتميزة:</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 10px;">📝</div>
            <p style="margin: 0; font-weight: bold; color: #2d3748;">ترجمة المستندات</p>
          </div>
          <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 10px;">🎓</div>
            <p style="margin: 0; font-weight: bold; color: #2d3748;">الخدمات التعليمية</p>
          </div>
          <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 10px;">⚖️</div>
            <p style="margin: 0; font-weight: bold; color: #2d3748;">الترجمة القانونية</p>
          </div>
          <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 10px;">💼</div>
            <p style="margin: 0; font-weight: bold; color: #2d3748;">الخدمات التجارية</p>
          </div>
        </div>
      </div>
      
      <!-- Payment Instructions -->
      <div style="background: #e6fffa; padding: 20px; border-radius: 8px; border-right: 4px solid #38b2ac; margin-bottom: 20px;">
        <h3 style="color: #234e52; margin-bottom: 15px;">تعليمات الدفع:</h3>
        <p style="margin: 8px 0;"><strong>البنك:</strong> البنك الأهلي السعودي</p>
        <p style="margin: 8px 0;"><strong>رقم الحساب:</strong> 123456789012</p>
        <p style="margin: 8px 0;"><strong>الآيبان:</strong> SA0210000012345678901234</p>
        <p style="font-size: 14px; color: #2d5016; margin-top: 15px; padding: 10px; background: #f0fff4; border-radius: 4px;">
          💡 يرجى سداد الفاتورة خلال 30 يوم من تاريخ الإصدار
        </p>
      </div>
      
      <!-- Contact Information -->
      <div style="background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h3 style="color: #1a365d; margin-bottom: 15px;">للاستفسارات والدعم الفني:</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center;">
          <div>
            <p style="margin: 5px 0;"><strong>📞 الهاتف:</strong></p>
            <p style="margin: 0; color: #3182ce; font-weight: bold;">+966 50 505 0505</p>
          </div>
          <div>
            <p style="margin: 5px 0;"><strong>✉️ البريد الإلكتروني:</strong></p>
            <p style="margin: 0; color: #3182ce; font-weight: bold;">info@fekrahedu.com</p>
          </div>
        </div>
      </div>
      
      <!-- Company Information -->
      <div style="background: linear-gradient(135deg, #edf2f7, #e2e8f0); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <p style="font-weight: bold; color: #1a365d; font-size: 16px; margin: 5px 0;">
          وكالة فكرة إيدو تتبع لشركة علي صالح الشهري القابضة
        </p>
        <p style="color: #666; font-size: 14px; margin: 5px 0; font-style: italic;">
          FekrahEdu Agency - Subsidiary of Ali Saleh Al-Shehri Holding Company
        </p>
        <div style="margin-top: 15px;">
          <p style="font-size: 12px; color: #718096; margin: 0;">
            الرقم الضريبي: ض.ب 1234567890 | السجل التجاري: س.ت 7001234567
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 15px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 5px 0; color: #666; font-size: 14px;">شكراً لثقتكم بخدماتنا</p>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Thank you for your business</p>
        <div style="margin-top: 10px;">
          <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 600;">
            🔒 بريد إلكتروني آمن ومشفر | ISO 27001 Certified
          </span>
        </div>
      </div>
      
    </div>
  </body>
  </html>
  ',
  '["invoice_number", "customer_name", "total_amount"]'::jsonb,
  true,
  'invoicing'
) ON CONFLICT (template_key) DO UPDATE SET
  html_template = EXCLUDED.html_template,
  subject_template = EXCLUDED.subject_template,
  variables = EXCLUDED.variables,
  updated_at = NOW();