import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // تسجيل العملية (اختياري)
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: customer.user_id,
          activity_type: 'password_reset',
          description: 'تغيير كلمة المرور من قبل المشرف',
          metadata: { admin_reset: true }
        });
    } catch (logError) {
      console.log('Log error (non-critical):', logError);
    }

    console.log('Password updated successfully for customer:', customerId);
    return { success: true, message: 'تم تحديث كلمة المرور بنجاح' };

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