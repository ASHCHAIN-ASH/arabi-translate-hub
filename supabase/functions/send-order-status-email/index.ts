import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderStatusEmailRequest {
  orderId: string;
  newStatus: string;
  orderTitle: string;
  clientName: string;
  clientEmail: string;
  trackingId?: string;
  estimatedDelivery?: string;
}

const getStatusNameArabic = (status: string): string => {
  const statusMap: Record<string, string> = {
    'received': 'مستلم',
    'under_review': 'تحت المراجعة',
    'research_plan': 'خطة البحث',
    'data_collection': 'جمع البيانات',
    'statistical_analysis': 'التحليل الإحصائي',
    'first_draft': 'المسودة الأولى',
    'revisions': 'المراجعات',
    'final_delivery': 'التسليم النهائي',
    'closed': 'مكتمل'
  };
  return statusMap[status] || status;
};

const createOrderStatusEmailTemplate = (data: OrderStatusEmailRequest): string => {
  const statusColor = getStatusColor(data.newStatus);
  const statusName = getStatusNameArabic(data.newStatus);
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحديث حالة الطلب</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            direction: rtl !important;
            text-align: right !important;
        }
        body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
            line-height: 1.8;
            color: #2c3e50;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            margin: 0;
            padding: 15px;
            direction: rtl !important;
            text-align: right !important;
        }
        .text-center { text-align: center !important; }
        .container {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border-radius: 25px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 40px 30px;
            text-align: center !important;
            position: relative;
            direction: rtl !important;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #ffd89b 0%, #19547b 100%);
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            text-align: center !important;
            direction: rtl !important;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
            text-align: center !important;
            direction: rtl !important;
        }
        .content {
            padding: 40px 30px;
            direction: rtl !important;
            text-align: right !important;
        }
        .status-badge {
            display: inline-block;
            background-color: ${statusColor};
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 14px;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .order-details {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 25px;
            margin: 20px 0;
            border-right: 4px solid #667eea;
        }
        .order-details h3 {
            margin: 0 0 15px 0;
            color: #374151;
            font-size: 18px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #6b7280;
        }
        .detail-value {
            color: #374151;
            font-weight: 500;
        }
        .timeline {
            margin: 30px 0;
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 8px;
        }
        .timeline h3 {
            margin: 0 0 20px 0;
            color: #374151;
        }
        .timeline-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px;
            background-color: white;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .timeline-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-left: 15px;
            flex-shrink: 0;
        }
        .timeline-dot.active {
            background-color: #10b981;
        }
        .timeline-dot.pending {
            background-color: #d1d5db;
        }
        .cta {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
            color: #6b7280;
            font-size: 14px;
        }
        .company-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 تحديث حالة طلبكم</h1>
            <p>مرحباً ${data.clientName}، لديكم تحديث جديد</p>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <span class="status-badge">${statusName}</span>
            </div>
            
            <div class="order-details">
                <h3>📋 تفاصيل الطلب</h3>
                <div class="detail-row">
                    <span class="detail-label">عنوان المشروع:</span>
                    <span class="detail-value">${data.orderTitle}</span>
                </div>
                ${data.trackingId ? `
                <div class="detail-row">
                    <span class="detail-label">رقم التتبع:</span>
                    <span class="detail-value">${data.trackingId}</span>
                </div>
                ` : ''}
                ${data.estimatedDelivery ? `
                <div class="detail-row">
                    <span class="detail-label">التسليم المتوقع:</span>
                    <span class="detail-value">${new Date(data.estimatedDelivery).toLocaleDateString('ar-SA')}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">الحالة الجديدة:</span>
                    <span class="detail-value" style="color: ${statusColor}; font-weight: bold;">${statusName}</span>
                </div>
            </div>

            <div class="timeline">
                <h3>📈 مراحل تقدم المشروع</h3>
                ${generateTimelineSteps(data.newStatus)}
            </div>

            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; color: #1e40af; font-weight: 500;">
                    💡 <strong>ملاحظة:</strong> سنقوم بإشعاركم فور الانتقال للمرحلة التالية. شكراً لثقتكم بنا!
                </p>
            </div>

            <div class="cta">
                <a href="https://masteredupath.com/order-tracking" class="btn">
                    📊 تتبع حالة الطلب
                </a>
            </div>
        </div>
        
        <div class="footer">
            <div class="company-info">
                <p><strong>مؤسسة علي صالح الشهري التعليمية</strong></p>
                <p>📧 support@masteredupath.com | 📱 +966 50 123 4567</p>
                <p>🌐 www.masteredupath.com</p>
                <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
                    جميع الحقوق محفوظة © ${new Date().getFullYear()}
                </p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'received': '#3b82f6',
    'under_review': '#f59e0b',
    'research_plan': '#8b5cf6',
    'data_collection': '#06b6d4',
    'statistical_analysis': '#ef4444',
    'first_draft': '#f97316',
    'revisions': '#eab308',
    'final_delivery': '#22c55e',
    'closed': '#10b981'
  };
  return colorMap[status] || '#6b7280';
};

const generateTimelineSteps = (currentStatus: string): string => {
  const steps = [
    'received', 'under_review', 'research_plan', 'data_collection',
    'statistical_analysis', 'first_draft', 'revisions', 'final_delivery', 'closed'
  ];
  
  const currentIndex = steps.indexOf(currentStatus);
  
  return steps.map((step, index) => {
    const isActive = index <= currentIndex;
    const statusName = getStatusNameArabic(step);
    
    return `
      <div class="timeline-item">
        <div class="timeline-dot ${isActive ? 'active' : 'pending'}"></div>
        <span style="color: ${isActive ? '#10b981' : '#6b7280'}; font-weight: ${isActive ? '600' : '400'};">
          ${statusName}
        </span>
      </div>
    `;
  }).join('');
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: OrderStatusEmailRequest = await req.json();
    console.log("Received email request:", requestData);

    // Generate the email template
    const emailHtml = createOrderStatusEmailTemplate(requestData);

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "مؤسسة علي الشهري التعليمية <orders@masteredupath.com>",
      to: [requestData.clientEmail],
      subject: `تحديث حالة طلبكم: ${getStatusNameArabic(requestData.newStatus)} - ${requestData.orderTitle}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log the email activity to database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase
      .from('user_notifications')
      .insert({
        user_email: requestData.clientEmail,
        title: `تحديث حالة الطلب: ${getStatusNameArabic(requestData.newStatus)}`,
        message: `تم تحديث حالة طلبكم "${requestData.orderTitle}" إلى: ${getStatusNameArabic(requestData.newStatus)}`,
        type: 'order_status_update',
        category: 'order_management',
        metadata: {
          orderId: requestData.orderId,
          newStatus: requestData.newStatus,
          trackingId: requestData.trackingId
        }
      });

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.data?.id,
      message: "تم إرسال الإيميل بنجاح"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-order-status-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: "فشل في إرسال الإيميل"
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