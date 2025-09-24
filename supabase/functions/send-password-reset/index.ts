import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResetPasswordRequest {
  email: string;
  redirect_url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

  try {
    const { email, redirect_url }: ResetPasswordRequest = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'البريد الإلكتروني مطلوب' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    console.log('Processing password reset request for:', emailNormalized);

    // Check if user exists in multiple tables
    let user: any = null;
    let userFound = false;
    
    console.log('Searching for user with email:', emailNormalized);
    
    // First try admin_credentials table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_credentials')
      .select('id, email, full_name')
      .eq('email', emailNormalized)
      .eq('is_active', true)
      .maybeSingle();
    
    console.log('Admin credentials search result:', { adminUser, adminError });
    
    if (adminUser && !adminError) {
      user = adminUser;
      userFound = true;
      console.log('Found user in admin_credentials');
    } else {
      // Try profiles table  
      const { data: profileUser, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .ilike('email', emailNormalized)
        .maybeSingle();
      
      console.log('Profiles search result:', { profileUser, profileError });
      
      if (profileUser && !profileError) {
        user = profileUser;
        userFound = true;
        console.log('Found user in profiles');
      } else {
        // Try auth.users via service role (fallback)
        try {
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          console.log('Auth users count:', authData?.users?.length || 0);
          
          if (authData?.users) {
            const authUser = authData.users.find(u => 
              u.email?.toLowerCase().trim() === emailNormalized
            );
            
            if (authUser) {
              user = {
                id: authUser.id,
                email: authUser.email,
                full_name: authUser.user_metadata?.full_name || authUser.email
              };
              userFound = true;
              console.log('Found user in auth.users');
            }
          }
        } catch (authErr) {
          console.log('Auth admin error:', authErr);
        }
      }
    }

    if (!userFound || !user) {
      console.log('User not found for email:', emailNormalized);
      // Always return success to prevent email enumeration
      return new Response(JSON.stringify({
        success: true,
        message: 'إذا كان البريد الإلكتروني موجود، ستتلقى رسالة لإعادة تعيين كلمة المرور'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Generate reset token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

    // Store reset token in password_reset_tokens table
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        email: user.email,
        token,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
        used: false
      });

    if (tokenError) {
      console.error('Error storing reset token:', tokenError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'حدث خطأ أثناء معالجة الطلب' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Prepare reset URL
    const baseUrl = redirect_url || req.headers.get('origin') || 'https://lovable.dev';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;
    
    console.log('Sending password reset email to:', user.email);
    console.log('Reset URL:', resetUrl);

    // Send custom reset email
    try {
      await resend.emails.send({
        from: 'نظام إدارة المشاريع <no-reply@masteredupath.com>',
        to: [user.email],
        subject: 'إعادة تعيين كلمة المرور - نظام إدارة المشاريع',
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>إعادة تعيين كلمة المرور</title>
              <style>
                  body {
                      font-family: 'Arial', 'Tahoma', sans-serif;
                      background-color: #f8fafc;
                      margin: 0;
                      padding: 20px;
                      direction: rtl;
                  }
                  .email-container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: white;
                      border-radius: 12px;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                      overflow: hidden;
                  }
                  .email-header {
                      background: linear-gradient(135deg, #3B82F6, #1E40AF);
                      color: white;
                      text-align: center;
                      padding: 40px 20px;
                  }
                  .email-header h1 {
                      margin: 0;
                      font-size: 28px;
                      font-weight: bold;
                  }
                  .email-body {
                      padding: 40px;
                      text-align: center;
                  }
                  .email-body h2 {
                      color: #1E293B;
                      margin: 0 0 20px 0;
                      font-size: 24px;
                  }
                  .email-body p {
                      color: #64748B;
                      line-height: 1.6;
                      margin: 16px 0;
                      font-size: 16px;
                  }
                  .reset-button {
                      display: inline-block;
                      background: #3B82F6;
                      color: white !important;
                      text-decoration: none;
                      padding: 16px 32px;
                      border-radius: 8px;
                      font-weight: bold;
                      margin: 24px 0;
                      font-size: 18px;
                      transition: background-color 0.3s;
                  }
                  .reset-button:hover {
                      background: #1E40AF;
                  }
                  .security-notice {
                      background: #FEF3C7;
                      border: 1px solid #F59E0B;
                      border-radius: 8px;
                      padding: 16px;
                      margin: 24px 0;
                  }
                  .security-notice p {
                      color: #92400E;
                      margin: 0;
                      font-size: 14px;
                  }
                  .email-footer {
                      background: #F8FAFC;
                      padding: 24px;
                      text-align: center;
                      border-top: 1px solid #E2E8F0;
                  }
                  .email-footer p {
                      color: #64748B;
                      font-size: 14px;
                      margin: 0;
                  }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <div class="email-header">
                      <h1>نظام إدارة المشاريع</h1>
                  </div>
                  
                  <div class="email-body">
                      <h2>إعادة تعيين كلمة المرور</h2>
                      
                      <p>مرحباً <strong>${user.full_name || user.email}</strong>،</p>
                      
                      <p>تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في نظام إدارة المشاريع.</p>
                      
                      <p>إذا كنت أنت من طلب إعادة التعيين، اضغط على الزر التالي:</p>
                      
                      <a href="${resetUrl}" class="reset-button">إعادة تعيين كلمة المرور</a>
                      
                      <div class="security-notice">
                          <p><strong>تنبيه أمني:</strong> هذا الرابط صالح لمدة 60 دقيقة فقط من وقت إرسال هذه الرسالة.</p>
                      </div>
                      
                      <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.</p>
                      
                      <p>إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.</p>
                  </div>
                  
                  <div class="email-footer">
                      <p>مع تحيات فريق نظام إدارة المشاريع</p>
                      <p>هذه رسالة تلقائية، يرجى عدم الرد عليها</p>
                  </div>
              </div>
          </body>
          </html>
        `,
      });
      
      console.log('Password reset email sent successfully');
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      // Don't reveal email sending failure to user
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'إذا كان البريد الإلكتروني موجود، ستتلقى رسالة لإعادة تعيين كلمة المرور'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in send-password-reset function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'حدث خطأ في النظام' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);