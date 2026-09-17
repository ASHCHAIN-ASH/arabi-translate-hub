import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@4.0.0";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
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
  const url = new URL(req.url);
  const endpoint = url.pathname.split('/').pop();

  try {
    switch (endpoint) {
      case 'register':
        return await handleRegister(req, supabase, resend);
      case 'login':
        return await handleLogin(req, supabase);
      case 'forgot-password':
        return await handleForgotPassword(req, supabase, resend);
      case 'reset-password':
        return await handleResetPassword(req, supabase);
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function handleRegister(req: Request, supabase: any, resend: any): Promise<Response> {
  const { email, password, full_name, phone }: RegisterRequest = await req.json();

  // Validate input
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Validate password strength
  if (password.length < 8) {
    return new Response(JSON.stringify({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const emailNormalized = email.toLowerCase().trim();

  // Check if email already exists
  const { data: existingUser } = await supabase
    .from('platform_users')
    .select('id')
    .eq('email_normalized', emailNormalized)
    .single();

  if (existingUser) {
    return new Response(JSON.stringify({ error: 'البريد الإلكتروني مستخدم بالفعل' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Hash password with bcrypt
  const passwordHash = await bcrypt.hash(password);

  // Create user
  const { data: user, error } = await supabase
    .from('platform_users')
    .insert({
      email,
      email_normalized: emailNormalized,
      full_name,
      phone,
      password_hash: passwordHash,
      role: 'customer',
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء التسجيل' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Create welcome notification
  await supabase.rpc('create_platform_notification', {
    p_user_id: user.id,
    p_title_ar: 'مرحباً بك!',
    p_body_ar: 'تم إنشاء حسابك بنجاح. يمكنك الآن تصفح خدماتنا وإنشاء طلبات جديدة.',
    p_title_en: 'Welcome!',
    p_body_en: 'Your account has been created successfully. You can now browse our services and create new orders.',
    p_type: 'success',
    p_category: 'account'
  });

  // Log audit event
  await supabase
    .from('platform_audit_logs')
    .insert({
      actor_id: user.id,
      action: 'USER_REGISTER',
      entity_type: 'user',
      entity_id: user.id,
      new_data: { email: user.email, full_name: user.full_name },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

  // Generate signed JWT token
  const { signPlatformToken } = await import('../_shared/platform-jwt.ts');
  const token = await signPlatformToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  });

  return new Response(JSON.stringify({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    },
    token
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleLogin(req: Request, supabase: any): Promise<Response> {
  const { email, password }: LoginRequest = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const emailNormalized = email.toLowerCase().trim();

  // Get user from database
  const { data: user, error } = await supabase
    .from('platform_users')
    .select('*')
    .eq('email_normalized', emailNormalized)
    .eq('status', 'active')
    .single();

  if (error || !user) {
    return new Response(JSON.stringify({ error: 'بيانات تسجيل الدخول غير صحيحة' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return new Response(JSON.stringify({ error: 'بيانات تسجيل الدخول غير صحيحة' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Update last login
  await supabase
    .from('platform_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', user.id);

  // Generate signed JWT token
  const { signPlatformToken } = await import('../_shared/platform-jwt.ts');
  const token = await signPlatformToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  });

  return new Response(JSON.stringify({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone
    },
    token
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleForgotPassword(req: Request, supabase: any, resend: any): Promise<Response> {
  const { email }: ForgotPasswordRequest = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'البريد الإلكتروني مطلوب' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const emailNormalized = email.toLowerCase().trim();

  // Check if user exists
  const { data: user } = await supabase
    .from('platform_users')
    .select('id, email, full_name')
    .eq('email_normalized', emailNormalized)
    .eq('status', 'active')
    .single();

  // Always return success to prevent email enumeration
  if (!user) {
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
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  // Store reset token
  const { error } = await supabase
    .from('platform_password_resets')
    .insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

  if (error) {
    console.error('Error storing reset token:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء إرسال الرسالة' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Send reset email
  const resetUrl = `${req.headers.get('origin') || 'https://your-domain.com'}/reset-password?token=${token}`;
  
  try {
    await resend.emails.send({
      from: 'نظام إدارة المشاريع <no-reply@fekrahedu.com>',
      to: [user.email],
      subject: 'إعادة تعيين كلمة المرور',
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>إعادة تعيين كلمة المرور</h2>
          <p>مرحباً ${user.full_name || ''},</p>
          <p>تم طلب إعادة تعيين كلمة المرور لحسابك. إذا لم تكن أنت من طلب ذلك، يمكنك تجاهل هذه الرسالة.</p>
          <p>لإعادة تعيين كلمة المرور، اضغط على الرابط التالي:</p>
          <a href="${resetUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            إعادة تعيين كلمة المرور
          </a>
          <p>هذا الرابط صالح لمدة 30 دقيقة فقط.</p>
          <p>مع تحيات فريق إدارة المشاريع</p>
        </div>
      `,
    });
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
}

async function handleResetPassword(req: Request, supabase: any): Promise<Response> {
  const { token, password }: ResetPasswordRequest = await req.json();

  if (!token || !password) {
    return new Response(JSON.stringify({ error: 'الرمز وكلمة المرور الجديدة مطلوبان' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (password.length < 8) {
    return new Response(JSON.stringify({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Verify reset token
  const { data: resetRecord, error } = await supabase
    .from('platform_password_resets')
    .select('user_id, expires_at, used')
    .eq('token', token)
    .single();

  if (error || !resetRecord) {
    return new Response(JSON.stringify({ error: 'رمز إعادة التعيين غير صحيح أو منتهي الصلاحية' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (resetRecord.used || new Date(resetRecord.expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: 'رمز إعادة التعيين غير صحيح أو منتهي الصلاحية' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(password);

  // Update password
  const { error: updateError } = await supabase
    .from('platform_users')
    .update({ password_hash: passwordHash })
    .eq('id', resetRecord.user_id);

  if (updateError) {
    console.error('Error updating password:', updateError);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء تحديث كلمة المرور' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Mark token as used
  await supabase
    .from('platform_password_resets')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('token', token);

  return new Response(JSON.stringify({
    success: true,
    message: 'تم تحديث كلمة المرور بنجاح'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

serve(handler);