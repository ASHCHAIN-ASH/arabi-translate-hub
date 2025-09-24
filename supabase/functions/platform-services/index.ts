import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ServiceRequest {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  category_id?: string;
  unit_type?: string;
  delivery_days?: number;
  is_active?: boolean;
  show_to_clients?: boolean;
  features_ar?: string[];
  features_en?: string[];
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

  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const serviceId = segments[segments.length - 1];

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

    switch (req.method) {
      case 'GET':
        return await handleGetServices(req, supabase, url);
      
      case 'POST':
        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'staff')) {
          return new Response(JSON.stringify({ error: 'غير مصرح لك بهذا الإجراء' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        return await handleCreateService(req, supabase, currentUser);
      
      case 'PUT':
        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'staff')) {
          return new Response(JSON.stringify({ error: 'غير مصرح لك بهذا الإجراء' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        return await handleUpdateService(req, supabase, serviceId, currentUser);
      
      case 'DELETE':
        if (!currentUser || currentUser.role !== 'admin') {
          return new Response(JSON.stringify({ error: 'غير مصرح لك بهذا الإجراء' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        return await handleDeleteService(req, supabase, serviceId, currentUser);
      
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

async function handleGetServices(req: Request, supabase: any, url: URL): Promise<Response> {
  const active = url.searchParams.get('active');
  const category = url.searchParams.get('category');
  const featured = url.searchParams.get('featured');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let query = supabase
    .from('platform_services')
    .select(`
      *,
      platform_categories!platform_services_category_id_fkey (
        id,
        name_ar,
        name_en,
        slug
      )
    `)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (active === 'true') {
    query = query.eq('is_active', true).eq('show_to_clients', true);
  }

  if (category) {
    if (category.includes('-')) {
      // Category slug
      query = query.eq('platform_categories.slug', category);
    } else {
      // Category ID
      query = query.eq('category_id', category);
    }
  }

  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data: services, error } = await query;

  if (error) {
    console.error('Error fetching services:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء جلب الخدمات' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Get total count for pagination
  let countQuery = supabase
    .from('platform_services')
    .select('id', { count: 'exact', head: true });

  if (active === 'true') {
    countQuery = countQuery.eq('is_active', true).eq('show_to_clients', true);
  }

  const { count } = await countQuery;

  return new Response(JSON.stringify({
    services,
    pagination: {
      total: count || 0,
      limit,
      offset,
      hasMore: (offset + limit) < (count || 0)
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleCreateService(req: Request, supabase: any, currentUser: any): Promise<Response> {
  const serviceData: ServiceRequest = await req.json();

  // Validate required fields
  if (!serviceData.name_ar || !serviceData.price || serviceData.price < 0) {
    return new Response(JSON.stringify({ error: 'اسم الخدمة والسعر مطلوبان' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Generate slug from Arabic name
  const slug = generateSlug(serviceData.name_ar);

  // Check if slug already exists
  const { data: existingService } = await supabase
    .from('platform_services')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existingService) {
    return new Response(JSON.stringify({ error: 'خدمة بهذا الاسم موجودة بالفعل' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const { data: service, error } = await supabase
    .from('platform_services')
    .insert({
      ...serviceData,
      slug,
      is_active: serviceData.is_active ?? true,
      show_to_clients: serviceData.show_to_clients ?? true,
      unit_type: serviceData.unit_type || 'service',
      delivery_days: serviceData.delivery_days || 7
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء إنشاء الخدمة' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Log audit event
  await supabase
    .from('platform_audit_logs')
    .insert({
      actor_id: currentUser.id,
      action: 'SERVICE_CREATE',
      entity_type: 'service',
      entity_id: service.id,
      new_data: service,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

  return new Response(JSON.stringify({
    success: true,
    service
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleUpdateService(req: Request, supabase: any, serviceId: string, currentUser: any): Promise<Response> {
  const updates: Partial<ServiceRequest> = await req.json();

  // Get existing service for audit log
  const { data: existingService } = await supabase
    .from('platform_services')
    .select('*')
    .eq('id', serviceId)
    .single();

  if (!existingService) {
    return new Response(JSON.stringify({ error: 'الخدمة غير موجودة' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Update slug if name changed
  if (updates.name_ar && updates.name_ar !== existingService.name_ar) {
    const newSlug = generateSlug(updates.name_ar);
    const { data: conflictService } = await supabase
      .from('platform_services')
      .select('id')
      .eq('slug', newSlug)
      .neq('id', serviceId)
      .single();

    if (conflictService) {
      return new Response(JSON.stringify({ error: 'خدمة بهذا الاسم موجودة بالفعل' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    (updates as any).slug = newSlug;
  }

  const { data: service, error } = await supabase
    .from('platform_services')
    .update(updates)
    .eq('id', serviceId)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء تحديث الخدمة' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Log audit event
  await supabase
    .from('platform_audit_logs')
    .insert({
      actor_id: currentUser.id,
      action: 'SERVICE_UPDATE',
      entity_type: 'service',
      entity_id: service.id,
      old_data: existingService,
      new_data: service,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

  return new Response(JSON.stringify({
    success: true,
    service
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleDeleteService(req: Request, supabase: any, serviceId: string, currentUser: any): Promise<Response> {
  // Get existing service for audit log
  const { data: existingService } = await supabase
    .from('platform_services')
    .select('*')
    .eq('id', serviceId)
    .single();

  if (!existingService) {
    return new Response(JSON.stringify({ error: 'الخدمة غير موجودة' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Check if service is used in any orders
  const { data: orderItems } = await supabase
    .from('platform_order_items')
    .select('id')
    .eq('service_id', serviceId)
    .limit(1);

  if (orderItems && orderItems.length > 0) {
    // Don't delete, just deactivate
    const { error } = await supabase
      .from('platform_services')
      .update({ is_active: false, show_to_clients: false })
      .eq('id', serviceId);

    if (error) {
      return new Response(JSON.stringify({ error: 'حدث خطأ أثناء إلغاء تفعيل الخدمة' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'تم إلغاء تفعيل الخدمة (لا يمكن حذفها لأنها مستخدمة في طلبات)'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Safe to delete
  const { error } = await supabase
    .from('platform_services')
    .delete()
    .eq('id', serviceId);

  if (error) {
    console.error('Error deleting service:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء حذف الخدمة' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Log audit event
  await supabase
    .from('platform_audit_logs')
    .insert({
      actor_id: currentUser.id,
      action: 'SERVICE_DELETE',
      entity_type: 'service',
      entity_id: serviceId,
      old_data: existingService,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

  return new Response(JSON.stringify({
    success: true,
    message: 'تم حذف الخدمة بنجاح'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

function generateSlug(text: string): string {
  // Simple slug generation for Arabic text
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, '') // Keep Arabic, English, numbers, spaces, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

serve(handler);