import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatNotificationRequest {
  message: string;
  timestamp: string;
  userInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, timestamp, userInfo }: ChatNotificationRequest = await req.json();

    const formattedTime = new Date(timestamp).toLocaleString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Aden'
    });

    const emailResponse = await resend.emails.send({
      from: "FekrahEdu <onboarding@resend.dev>",
      to: ["info@fekrahtech.com"], // إيميل المطور للاختبار
      subject: "🤖 رسالة جديدة من الشات بوت - FekrahEdu",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'IBM Plex Sans Arabic', 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              direction: rtl;
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              overflow: hidden;
              margin-top: 20px;
              margin-bottom: 20px;
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
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
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><path d="m0 20c20-10 40 0 60-10s40 10 40 10v-20h-100z" fill="rgba(255,255,255,0.1)"/></svg>') repeat-x;
              background-size: 100px 20px;
            }
            
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              position: relative;
            }
            
            .header .emoji {
              font-size: 40px;
              margin-bottom: 10px;
              display: block;
            }
            
            .content {
              padding: 40px 30px;
            }
            
            .message-card {
              background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
              border: 2px solid #e0e7ff;
              border-radius: 12px;
              padding: 25px;
              margin: 20px 0;
              position: relative;
            }
            
            .message-card::before {
              content: '💬';
              position: absolute;
              top: -10px;
              right: 20px;
              background: white;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              border: 2px solid #e0e7ff;
            }
            
            .message-text {
              background: white;
              padding: 20px;
              border-radius: 8px;
              border-right: 4px solid #667eea;
              font-size: 16px;
              line-height: 1.6;
              color: #374151;
              white-space: pre-line;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            
            .info-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 30px 0;
            }
            
            .info-card {
              background: linear-gradient(135deg, #fff 0%, #f9fafb 100%);
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
            }
            
            .info-card .icon {
              font-size: 24px;
              margin-bottom: 10px;
              display: block;
            }
            
            .info-card .label {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 5px;
              font-weight: 500;
            }
            
            .info-card .value {
              font-size: 16px;
              color: #1f2937;
              font-weight: 600;
            }
            
            .action-section {
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border: 2px solid #0284c7;
              border-radius: 12px;
              padding: 25px;
              margin: 30px 0;
              text-align: center;
            }
            
            .action-title {
              font-size: 18px;
              font-weight: 600;
              color: #0284c7;
              margin-bottom: 15px;
            }
            
            .whatsapp-links {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 10px;
              margin-top: 15px;
            }
            
            .whatsapp-btn {
              background: #25d366;
              color: white;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 25px;
              font-weight: 600;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: all 0.3s ease;
              border: none;
              font-size: 14px;
            }
            
            .whatsapp-btn:hover {
              background: #128c7e;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
            }
            
            .footer {
              background: #f9fafb;
              border-top: 1px solid #e5e7eb;
              padding: 30px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            
            .footer .logo {
              font-size: 20px;
              font-weight: 700;
              color: #667eea;
              margin-bottom: 10px;
            }
            
            @media (max-width: 600px) {
              .container {
                margin: 10px;
                border-radius: 12px;
              }
              
              .header, .content {
                padding: 20px;
              }
              
              .info-section {
                grid-template-columns: 1fr;
                gap: 15px;
              }
              
              .whatsapp-links {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="emoji">🤖</span>
              <h1>رسالة جديدة من الشات بوت</h1>
            </div>
            
            <div class="content">
              <div class="message-card">
                <div class="message-text">${message}</div>
              </div>
              
              <div class="info-section">
                <div class="info-card">
                  <span class="icon">⏰</span>
                  <div class="label">وقت الرسالة</div>
                  <div class="value">${formattedTime}</div>
                </div>
                
                <div class="info-card">
                  <span class="icon">👤</span>
                  <div class="label">المستخدم</div>
                  <div class="value">${userInfo || 'زائر'}</div>
                </div>
              </div>
              
              <div class="action-section">
                <div class="action-title">📞 للرد السريع على العميل</div>
                <p style="margin: 10px 0; color: #64748b;">يمكنك التواصل مباشرة مع العميل عبر واتساب:</p>
                
                <div class="whatsapp-links">
                  <a href="https://wa.me/966559600824" class="whatsapp-btn" target="_blank">
                    📱 الدعم الفني والاستشارات
                  </a>
                  <a href="https://wa.me/966559600824" class="whatsapp-btn" target="_blank">
                    💬 خدمة العملاء
                  </a>
                </div>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <strong style="color: #92400e;">💡 ملاحظة مهمة:</strong>
                <p style="margin: 5px 0 0 0; color: #92400e; font-size: 14px;">
                  هذه الرسالة تم إرسالها تلقائياً من الشات بوت الذكي في موقع FekrahEdu. 
                  يُنصح بالرد على العميل في أسرع وقت ممكن لضمان أفضل تجربة خدمة.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <div class="logo">🎓 FekrahEdu</div>
              <p>نظام إشعارات الشات بوت الذكي</p>
              <p style="font-size: 12px; color: #9ca3af;">
                تم الإرسال تلقائياً في ${formattedTime}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Chat notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
    
  } catch (error: any) {
    console.error("Error in send-chatbot-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
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