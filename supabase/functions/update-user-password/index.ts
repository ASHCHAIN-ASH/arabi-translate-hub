import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdatePasswordRequest {
  userId: string;
  newPassword: string;
  adminUserId?: string;
  sendEmail?: boolean;
}

// Function to hash password using bcrypt
async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("https://deno.land/x/bcrypt@v0.4.1/mod.ts");
  return await bcrypt.hash(password);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, newPassword, adminUserId, sendEmail = true }: UpdatePasswordRequest = await req.json();

    // Validate input
    if (!userId || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters long' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get admin details
    let adminData = null;
    if (adminUserId) {
      const { data: adminCheck, error: adminError } = await supabaseAdmin
        .from('admin_credentials')
        .select('id, email, full_name, role, is_active')
        .eq('id', adminUserId)
        .single();

      if (adminError || !adminCheck || !adminCheck.is_active || adminCheck.role !== 'admin') {
        console.log('Admin verification failed:', adminError, adminCheck);
        return new Response(
          JSON.stringify({ error: 'Insufficient privileges' }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
      adminData = adminCheck;
    }

    // Get user details
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    let authUpdateSuccess = false;
    let customTableUpdateSuccess = false;

    // Try to update password in Supabase Auth (for users who use auth_users table)
    try {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (!authError) {
        authUpdateSuccess = true;
        console.log('Successfully updated password in Supabase Auth for user:', userId);
      } else {
        console.log('Failed to update in Supabase Auth (user might not exist there):', authError.message);
      }
    } catch (authError) {
      console.log('Auth update failed:', authError);
    }

    // Update password in custom users table (hash the password)
    try {
      const hashedPassword = await hashPassword(newPassword);
      
      const { error: tableError } = await supabaseAdmin
        .from('users')
        .update({ 
          password_hash: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (!tableError) {
        customTableUpdateSuccess = true;
        console.log('Successfully updated password in users table for user:', userId);
      } else {
        console.error('Failed to update users table:', tableError);
      }
    } catch (tableError) {
      console.error('Custom table update failed:', tableError);
    }

    // Check if at least one update succeeded
    if (!authUpdateSuccess && !customTableUpdateSuccess) {
      return new Response(
        JSON.stringify({ error: 'Failed to update password in both systems' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log(`Password updated successfully for user: ${userId} (Auth: ${authUpdateSuccess}, Custom: ${customTableUpdateSuccess})`);

    // Send email notification if requested
    let emailSent = false;
    if (sendEmail && userData.email) {
      try {
        const changeDate = new Intl.DateTimeFormat('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Riyadh'
        }).format(new Date());

        const adminRoleMap: { [key: string]: string } = {
          'admin': 'مدير عام',
          'superadmin': 'مدير فائق',
          'manager': 'مدير',
          'support': 'دعم فني'
        };

        const emailVariables = {
          user_name: userData.name || 'المستخدم',
          user_email: userData.email,
          new_password: newPassword,
          change_date: changeDate,
          admin_name: adminData?.full_name || 'الإدارة',
          admin_email: adminData?.email || 'admin@masteredupath.com',
          admin_role: adminRoleMap[adminData?.role] || 'مدير'
        };

        // Call send-email function
        const emailResponse = await supabaseAdmin.functions.invoke('send-email', {
          body: {
            to: userData.email,
            template_key: 'password_changed_notification',
            variables: emailVariables
          }
        });

        if (!emailResponse.error) {
          emailSent = true;
          console.log('Password change notification email sent successfully to:', userData.email);
        } else {
          console.error('Failed to send password change notification email:', emailResponse.error);
        }

      } catch (emailError) {
        console.error('Error sending password change notification email:', emailError);
      }
    }

    // Log security audit
    try {
      await supabaseAdmin
        .from('security_audit_logs')
        .insert({
          event_type: 'password_change',
          user_id: userId,
          action: 'admin_password_update',
          resource_type: 'user_account',
          resource_id: userId,
          risk_level: 'high',
          metadata: {
            admin_user_id: adminUserId,
            admin_email: adminData?.email,
            admin_name: adminData?.full_name,
            user_email: userData.email,
            user_name: userData.name,
            auth_updated: authUpdateSuccess,
            custom_table_updated: customTableUpdateSuccess,
            email_notification_sent: emailSent,
            change_timestamp: new Date().toISOString(),
            ip_address: req.headers.get('x-forwarded-for') || 'unknown'
          }
        });
    } catch (auditError) {
      console.error('Failed to log security audit:', auditError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password updated successfully',
        userId: userId,
        authUpdated: authUpdateSuccess,
        customTableUpdated: customTableUpdateSuccess,
        emailSent: emailSent
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Unexpected error in update-user-password function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);