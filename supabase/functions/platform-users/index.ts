import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];

  try {
    // Authenticate user
    const authHeader = req.headers.get('authorization');
    let currentUser = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = JSON.parse(atob(token));
        if (payload.exp > Date.now()) {
          const { data: user } = await supabase
            .from('platform_users')
            .select('id, role, status')
            .eq('id', payload.sub)
            .eq('status', 'active')
            .single();
          currentUser = user;
        }
      } catch (e) {
        console.log('Invalid token:', e);
      }
    }

    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'مطلوب تسجيل الدخول' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    switch (req.method) {
      case 'GET':
        if (userId && userId !== 'platform-users') {
          return await handleGetUser(req, supabase, userId, currentUser);
        } else {
          return await handleGetUsers(req, supabase, url, currentUser);
        }
      
      case 'PUT':
        return await handleUpdateUser(req, supabase, userId, currentUser);
      
      case 'DELETE':
        return await handleDeleteUser(req, supabase, userId, currentUser);
      
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
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

async function handleGetUsers(req: Request, supabase: any, url: URL, currentUser: any): Promise<Response> {
  // Only admin can list all users
  if (currentUser.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'غير مصرح لك بهذا الإجراء' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const role = url.searchParams.get('role');
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let query = supabase
    .from('platform_users')
    .select(`
      id,
      email,
      full_name,
      phone,
      role,
      status,
      email_verified,
      phone_verified,
      last_login_at,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (role) {
    query = query.eq('role', role);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: users, error } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء جلب المستخدمين' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Get total count for pagination
  let countQuery = supabase
    .from('platform_users')
    .select('id', { count: 'exact', head: true });

  if (role) {
    countQuery = countQuery.eq('role', role);
  }

  if (status) {
    countQuery = countQuery.eq('status', status);
  }

  if (search) {
    countQuery = countQuery.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { count } = await countQuery;

  // Get stats
  const { data: stats } = await supabase
    .from('platform_users')
    .select('role, status')
    .then(({ data }) => {
      if (!data) return { data: null };
      
      const roleStats = data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusStats = data.reduce((acc, user) => {
        acc[user.status] = (acc[user.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        data: {
          total: data.length,
          byRole: roleStats,
          byStatus: statusStats
        }
      };
    });

  return new Response(JSON.stringify({
    users,
    pagination: {
      total: count || 0,
      limit,
      offset,
      hasMore: (offset + limit) < (count || 0)
    },
    stats: stats || {
      total: 0,
      byRole: {},
      byStatus: {}
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleGetUser(req: Request, supabase: any, userId: string, currentUser: any): Promise<Response> {
  // Users can view their own profile, admins can view any profile
  if (currentUser.role !== 'admin' && currentUser.id !== userId) {
    return new Response(JSON.stringify({ error: 'غير مصرح لك بعرض هذا الملف الشخصي' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const { data: user, error } = await supabase
    .from('platform_users')
    .select(`
      id,
      email,
      full_name,
      phone,
      role,
      status,
      email_verified,
      phone_verified,
      last_login_at,
      profile_data,
      preferences,
      created_at,
      updated_at
    `)
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    console.error('Error fetching user:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء جلب بيانات المستخدم' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // If admin is viewing, also get user stats
  let userStats = null;
  if (currentUser.role === 'admin' && currentUser.id !== userId) {
    const [ordersCount, notificationsCount] = await Promise.all([
      supabase
        .from('platform_orders')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', userId),
      supabase
        .from('platform_notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
    ]);

    userStats = {
      totalOrders: ordersCount.count || 0,
      totalNotifications: notificationsCount.count || 0
    };
  }

  return new Response(JSON.stringify({
    user,
    stats: userStats
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleUpdateUser(req: Request, supabase: any, userId: string, currentUser: any): Promise<Response> {
  // Users can update their own profile, admins can update any profile
  if (currentUser.role !== 'admin' && currentUser.id !== userId) {
    return new Response(JSON.stringify({ error: 'غير مصرح لك بتعديل هذا الملف الشخصي' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const updates = await req.json();

  // Get existing user for audit log
  const { data: existingUser } = await supabase
    .from('platform_users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!existingUser) {
    return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Filter allowed updates based on role
  let allowedUpdates: any = {};
  
  if (currentUser.role === 'admin') {
    // Admins can update most fields
    const adminAllowedFields = [
      'full_name', 'phone', 'role', 'status', 'email_verified', 
      'phone_verified', 'profile_data', 'preferences'
    ];
    allowedUpdates = Object.keys(updates)
      .filter(key => adminAllowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);
  } else {
    // Regular users can only update their own profile data
    const userAllowedFields = ['full_name', 'phone', 'profile_data', 'preferences'];
    allowedUpdates = Object.keys(updates)
      .filter(key => userAllowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);
  }

  if (Object.keys(allowedUpdates).length === 0) {
    return new Response(JSON.stringify({ error: 'لا توجد حقول صالحة للتحديث' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Handle email normalization if email is being updated (admin only)
  if (allowedUpdates.email && currentUser.role === 'admin') {
    allowedUpdates.email_normalized = allowedUpdates.email.toLowerCase().trim();
    
    // Check if email already exists
    const { data: emailExists } = await supabase
      .from('platform_users')
      .select('id')
      .eq('email_normalized', allowedUpdates.email_normalized)
      .neq('id', userId)
      .single();

    if (emailExists) {
      return new Response(JSON.stringify({ error: 'البريد الإلكتروني مستخدم بالفعل' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  const { data: user, error } = await supabase
    .from('platform_users')
    .update(allowedUpdates)
    .eq('id', userId)
    .select(`
      id,
      email,
      full_name,
      phone,
      role,
      status,
      email_verified,
      phone_verified,
      last_login_at,
      profile_data,
      preferences,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء تحديث بيانات المستخدم' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Log audit event
  await supabase
    .from('platform_audit_logs')
    .insert({
      actor_id: currentUser.id,
      action: 'USER_UPDATE',
      entity_type: 'user',
      entity_id: userId,
      old_data: existingUser,
      new_data: user,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

  return new Response(JSON.stringify({
    success: true,
    user
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleDeleteUser(req: Request, supabase: any, userId: string, currentUser: any): Promise<Response> {
  // Only admins can delete users
  if (currentUser.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'غير مصرح لك بهذا الإجراء' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Prevent self-deletion
  if (currentUser.id === userId) {
    return new Response(JSON.stringify({ error: 'لا يمكنك حذف حسابك الخاص' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Get existing user for audit log
  const { data: existingUser } = await supabase
    .from('platform_users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!existingUser) {
    return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Check if user has orders
  const { data: orders } = await supabase
    .from('platform_orders')
    .select('id')
    .eq('customer_id', userId)
    .limit(1);

  if (orders && orders.length > 0) {
    // Don't delete, just deactivate
    const { error } = await supabase
      .from('platform_users')
      .update({ status: 'blocked' })
      .eq('id', userId);

    if (error) {
      return new Response(JSON.stringify({ error: 'حدث خطأ أثناء إلغاء تفعيل المستخدم' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'تم إلغاء تفعيل المستخدم (لا يمكن حذفه لأن له طلبات)'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Safe to delete
  const { error } = await supabase
    .from('platform_users')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء حذف المستخدم' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Log audit event
  await supabase
    .from('platform_audit_logs')
    .insert({
      actor_id: currentUser.id,
      action: 'USER_DELETE',
      entity_type: 'user',
      entity_id: userId,
      old_data: existingUser,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

  return new Response(JSON.stringify({
    success: true,
    message: 'تم حذف المستخدم بنجاح'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

serve(handler);