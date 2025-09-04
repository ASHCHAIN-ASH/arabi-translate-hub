import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResetPasswordConfirmRequest {
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

  try {
    const { token, password }: ResetPasswordConfirmRequest = await req.json();

    if (!token || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'الرمز المميز وكلمة المرور مطلوبان' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Processing password reset confirmation for token:', token);

    // Check if token exists and is valid
    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (tokenError) {
      console.error('Error checking reset token:', tokenError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'حدث خطأ في النظام' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!resetToken) {
      console.log('Invalid or expired token:', token);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'رمز إعادة التعيين غير صحيح أو منتهي الصلاحية' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Valid token found for user:', resetToken.user_id);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password);

    // Update password in auth.users using Supabase Admin API
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
      resetToken.user_id,
      { password: password }
    );

    if (authUpdateError) {
      console.error('Error updating auth password:', authUpdateError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'حدث خطأ أثناء تحديث كلمة المرور' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Update password in admin_credentials table if user exists there
    const { error: adminUpdateError } = await supabase
      .from('admin_credentials')
      .update({ 
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', resetToken.user_id);

    // Note: We don't treat admin update errors as fatal since user might not be in admin table

    // Mark token as used
    const { error: markUsedError } = await supabase
      .from('password_reset_tokens')
      .update({ 
        used: true,
        used_at: new Date().toISOString()
      })
      .eq('token', token);

    if (markUsedError) {
      console.error('Error marking token as used:', markUsedError);
      // Continue anyway, password was already updated
    }

    // Log the password change event
    const { error: logError } = await supabase
      .from('security_audit_logs')
      .insert({
        event_type: 'password_reset_completed',
        user_id: resetToken.user_id,
        action: 'password_reset_confirm',
        risk_level: 'medium',
        metadata: {
          email: resetToken.email,
          reset_method: 'email_token',
          timestamp: new Date().toISOString()
        }
      });

    if (logError) {
      console.error('Error logging security event:', logError);
      // Continue anyway
    }

    console.log('Password reset completed successfully for user:', resetToken.user_id);

    return new Response(JSON.stringify({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in reset-password-confirm function:', error);
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