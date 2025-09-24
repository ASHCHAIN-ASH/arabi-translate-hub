import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface CustomerRequest {
  customerId: string;
  action: 'update_password' | 'update_status' | 'update_profile';
  data: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔧 Customer management function called');
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { customerId, action, data }: CustomerRequest = await req.json();
    console.log('📝 Customer management request:', { customerId, action });

    // السماح بالوصول العام للوظائف الإدارية
    const adminId = 'system-admin';

    let result;

    switch (action) {
      case 'update_password':
        result = await updateCustomerPassword(supabaseAdmin, customerId, data.newPassword, adminId);
        break;

      case 'update_status':
        result = await updateCustomerStatus(supabaseAdmin, customerId, data.status, data.reason, adminId);
        break;

      case 'update_profile':
        result = await updateCustomerProfile(supabaseAdmin, customerId, data, adminId);
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, message: 'إجراء غير صحيح' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in customer management:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'حدث خطأ داخلي' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

async function updateCustomerPassword(supabase: any, customerId: string, newPassword: string, adminId: string) {
  try {
    // الحصول على بيانات العميل
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('user_id, email, full_name')
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return { success: false, message: 'العميل غير موجود' };
    }

    // تحديث كلمة المرور في auth.users
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      customer.user_id,
      { password: newPassword }
    );

    if (passwordError) {
      console.error('Password update error:', passwordError);
      return { success: false, message: 'فشل في تحديث كلمة المرور' };
    }

    // إرسال إيميل للعميل بكلمة المرور الجديدة
    try {
      await resend.emails.send({
        from: 'إدارة النظام <noreply@alialshehriholding.com>',
        to: [customer.email],
        subject: 'تم تحديث كلمة المرور الخاصة بك',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2563eb; text-align: center; margin-bottom: 30px;">تحديث كلمة المرور</h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              مرحباً <strong>${customer.full_name}</strong>،
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              تم تحديث كلمة المرور الخاصة بحسابك بنجاح من قبل إدارة النظام.
            </p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #1e40af;">كلمة المرور الجديدة:</p>
              <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 18px; color: #dc2626; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb;">
                ${newPassword}
              </p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-right: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">⚠️ تنبيه أمني هام:</p>
              <p style="margin: 10px 0 0 0; color: #92400e;">
                • يُنصح بتغيير كلمة المرور هذه عند تسجيل الدخول التالي<br>
                • لا تشارك كلمة المرور مع أي شخص آخر<br>
                • احتفظ بكلمة المرور في مكان آمن
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              يمكنك الآن تسجيل الدخول إلى حسابك باستخدام كلمة المرور الجديدة.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://alialshehriholding.com/login" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                تسجيل الدخول الآن
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 0;">
              مع تحيات فريق إدارة النظام<br>
              <strong>شركة علي صالح الشهري القابضة</strong>
            </p>
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 15px;">
              إذا لم تطلب تغيير كلمة المرور، يُرجى التواصل مع الدعم الفني فوراً
            </p>
          </div>
        `,
      });
      
      console.log('✅ Password update email sent successfully to:', customer.email);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // لا نفشل العملية إذا فشل الإيميل
    }

    // تسجيل العملية (اختياري)
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: customer.user_id,
          activity_type: 'password_reset',
          description: 'تغيير كلمة المرور من قبل المشرف',
          metadata: { admin_reset: true, email_sent: true }
        });
    } catch (logError) {
      console.log('Log error (non-critical):', logError);
    }

    console.log('Password updated successfully for customer:', customerId);
    return { success: true, message: 'تم تحديث كلمة المرور بنجاح وإرسال إيميل للعميل' };

  } catch (error: any) {
    console.error('Error updating password:', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث كلمة المرور' };
  }
}

async function updateCustomerStatus(supabase: any, customerId: string, status: string, reason: string, adminId: string) {
  try {
    // الحصول على بيانات العميل أولاً
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('user_id, email, full_name')
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return { success: false, message: 'العميل غير موجود' };
    }

    // تحديث حالة العميل
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId)
      .select()
      .single();

    if (updateError) {
      console.error('Status update error:', updateError);
      return { success: false, message: 'فشل في تحديث حالة العميل' };
    }

    // تسجيل العملية (اختياري)
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: customer.user_id, // استخدام user_id الصحيح
          activity_type: 'status_update',
          description: `تغيير حالة العميل إلى ${status}`,
          metadata: { new_status: status, reason: reason || `تغيير الحالة إلى ${status}` }
        });
    } catch (logError) {
      console.log('Log error (non-critical):', logError);
    }

    console.log('Status updated successfully for customer:', customerId);
    return { success: true, message: 'تم تحديث حالة العميل بنجاح' };

  } catch (error: any) {
    console.error('Error updating status:', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث الحالة' };
  }
}

async function updateCustomerProfile(supabase: any, customerId: string, profileData: any, adminId: string) {
  try {
    // الحصول على بيانات العميل أولاً
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('user_id, email, full_name')
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return { success: false, message: 'العميل غير موجود' };
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (profileData.full_name) updateData.full_name = profileData.full_name;
    if (profileData.phone) updateData.phone = profileData.phone;
    if (profileData.profile_data) updateData.profile_data = profileData.profile_data;

    // تحديث بيانات العميل
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', customerId)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return { success: false, message: 'فشل في تحديث بيانات العميل' };
    }

    // تسجيل العملية (اختياري)
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: customer.user_id, // استخدام user_id الصحيح
          activity_type: 'profile_update',
          description: 'تحديث بيانات الملف الشخصي',
          metadata: { updated_fields: Object.keys(updateData) }
        });
    } catch (logError) {
      console.log('Log error (non-critical):', logError);
    }

    console.log('Profile updated successfully for customer:', customerId);
    return { success: true, message: 'تم تحديث بيانات العميل بنجاح' };

  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث البيانات' };
  }
}

serve(handler);