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
    const { userId, newPassword, adminUserId }: UpdatePasswordRequest = await req.json();

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

    // Verify the requesting user has admin privileges
    if (adminUserId) {
      const { data: adminCheck, error: adminError } = await supabaseAdmin
        .from('admin_credentials')
        .select('role, is_active')
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
    }

    // Check if user exists in custom users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password updated successfully',
        userId: userId,
        authUpdated: authUpdateSuccess,
        customTableUpdated: customTableUpdateSuccess
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