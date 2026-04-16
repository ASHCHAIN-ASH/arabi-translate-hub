import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderRequest {
  items: Array<{
    service_id: string;
    quantity: number;
    custom_requirements?: string;
  }>;
  customer_notes?: string;
  billing_data?: any;
}

interface OrderStatusUpdate {
  status: string;
  admin_notes?: string;
  internal_notes?: string;
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
  const orderId = segments[segments.length - 1];
  const isStatusUpdate = segments.includes('status');

  try {
    // Authenticate user with signed JWT
    const { authenticatePlatformRequest } = await import('../_shared/platform-jwt.ts');
    const currentUser = await authenticatePlatformRequest(req, supabase);

    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'مطلوب تسجيل الدخول' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    switch (req.method) {
      case 'GET':
        if (orderId && orderId !== 'platform-orders') {
          return await handleGetOrder(req, supabase, orderId, currentUser);
        } else {
          return await handleGetOrders(req, supabase, url, currentUser);
        }
      
      case 'POST':
        return await handleCreateOrder(req, supabase, currentUser);
      
      case 'PUT':
        if (isStatusUpdate) {
          return await handleUpdateOrderStatus(req, supabase, orderId, currentUser);
        } else {
          return await handleUpdateOrder(req, supabase, orderId, currentUser);
        }
      
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

async function handleGetOrders(req: Request, supabase: any, url: URL, currentUser: any): Promise<Response> {
  const status = url.searchParams.get('status');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let query = supabase
    .from('platform_orders')
    .select(`
      *,
      platform_users!platform_orders_customer_id_fkey (
        id,
        full_name,
        email,
        phone
      ),
      platform_order_items (
        id,
        service_name,
        quantity,
        unit_price,
        line_total,
        custom_requirements,
        platform_services (
          id,
          name_ar,
          name_en
        )
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply access control
  if (currentUser.role === 'customer') {
    query = query.eq('customer_id', currentUser.id);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء جلب الطلبات' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Get total count
  let countQuery = supabase
    .from('platform_orders')
    .select('id', { count: 'exact', head: true });

  if (currentUser.role === 'customer') {
    countQuery = countQuery.eq('customer_id', currentUser.id);
  }

  if (status) {
    countQuery = countQuery.eq('status', status);
  }

  const { count } = await countQuery;

  return new Response(JSON.stringify({
    orders,
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

async function handleGetOrder(req: Request, supabase: any, orderId: string, currentUser: any): Promise<Response> {
  let query = supabase
    .from('platform_orders')
    .select(`
      *,
      platform_users!platform_orders_customer_id_fkey (
        id,
        full_name,
        email,
        phone
      ),
      platform_order_items (
        id,
        service_name,
        service_description,
        quantity,
        unit_price,
        line_total,
        custom_requirements,
        attachments,
        platform_services (
          id,
          name_ar,
          name_en,
          slug
        )
      )
    `)
    .eq('id', orderId);

  // Apply access control
  if (currentUser.role === 'customer') {
    query = query.eq('customer_id', currentUser.id);
  }

  const { data: order, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return new Response(JSON.stringify({ error: 'الطلب غير موجود' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    console.error('Error fetching order:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء جلب الطلب' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ order }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleCreateOrder(req: Request, supabase: any, currentUser: any): Promise<Response> {
  if (currentUser.role !== 'customer') {
    return new Response(JSON.stringify({ error: 'العملاء فقط يمكنهم إنشاء طلبات' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const orderData: OrderRequest = await req.json();

  if (!orderData.items || orderData.items.length === 0) {
    return new Response(JSON.stringify({ error: 'يجب إضافة عنصر واحد على الأقل للطلب' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Get services data for pricing calculation
  const serviceIds = orderData.items.map(item => item.service_id);
  const { data: services, error: servicesError } = await supabase
    .from('platform_services')
    .select('id, name_ar, name_en, description_ar, price, is_active, show_to_clients')
    .in('id', serviceIds);

  if (servicesError) {
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء التحقق من الخدمات' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Validate all services exist and are active
  for (const item of orderData.items) {
    const service = services.find((s: any) => s.id === item.service_id);
    if (!service) {
      return new Response(JSON.stringify({ error: 'خدمة غير موجودة' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    if (!service.is_active || !service.show_to_clients) {
      return new Response(JSON.stringify({ error: 'خدمة غير متاحة حالياً' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = orderData.items.map(item => {
    const service = services.find((s: any) => s.id === item.service_id)!;
    const lineTotal = service.price * item.quantity;
    subtotal += lineTotal;
    
    return {
      service_id: item.service_id,
      service_name: service.name_ar,
      service_description: service.description_ar,
      quantity: item.quantity,
      unit_price: service.price,
      line_total: lineTotal,
      custom_requirements: item.custom_requirements
    };
  });

  const vatPercent = 15.00;
  const vatAmount = (subtotal * vatPercent) / 100;
  const total = subtotal + vatAmount;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('platform_orders')
    .insert({
      customer_id: currentUser.id,
      subtotal,
      vat_percent: vatPercent,
      vat_amount: vatAmount,
      total,
      customer_notes: orderData.customer_notes,
      billing_data: orderData.billing_data || {},
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء إنشاء الطلب' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Create order items
  const orderItemsWithOrderId = orderItems.map(item => ({
    ...item,
    order_id: order.id
  }));

  const { error: itemsError } = await supabase
    .from('platform_order_items')
    .insert(orderItemsWithOrderId);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    // Rollback order creation
    await supabase.from('platform_orders').delete().eq('id', order.id);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء إنشاء عناصر الطلب' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Create notification for customer
  await supabase.rpc('create_platform_notification', {
    p_user_id: currentUser.id,
    p_title_ar: 'تم إنشاء طلبك بنجاح',
    p_body_ar: `تم إنشاء طلبك رقم ${order.order_number} بنجاح. سيتم مراجعته وسنتواصل معك قريباً.`,
    p_title_en: 'Order Created Successfully',
    p_body_en: `Your order ${order.order_number} has been created successfully. It will be reviewed and we will contact you soon.`,
    p_type: 'success',
    p_category: 'order',
    p_data: JSON.stringify({ order_id: order.id, order_number: order.order_number })
  });

  // Log audit event
  await supabase
    .from('platform_audit_logs')
    .insert({
      actor_id: currentUser.id,
      action: 'ORDER_CREATE',
      entity_type: 'order',
      entity_id: order.id,
      new_data: { ...order, items: orderItemsWithOrderId },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

  return new Response(JSON.stringify({
    success: true,
    order: {
      ...order,
      items: orderItemsWithOrderId
    }
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleUpdateOrderStatus(req: Request, supabase: any, orderId: string, currentUser: any): Promise<Response> {
  // Only admin and staff can update order status
  if (currentUser.role !== 'admin' && currentUser.role !== 'staff') {
    return new Response(JSON.stringify({ error: 'غير مصرح لك بهذا الإجراء' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const { status, admin_notes, internal_notes }: OrderStatusUpdate = await req.json();

  if (!status) {
    return new Response(JSON.stringify({ error: 'حالة الطلب مطلوبة' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Valid statuses
  const validStatuses = ['pending', 'paid', 'processing', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return new Response(JSON.stringify({ error: 'حالة الطلب غير صحيحة' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Get existing order
  const { data: existingOrder } = await supabase
    .from('platform_orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (!existingOrder) {
    return new Response(JSON.stringify({ error: 'الطلب غير موجود' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Prepare update data
  const updateData: any = { status };
  
  if (admin_notes) updateData.admin_notes = admin_notes;
  if (internal_notes) updateData.internal_notes = internal_notes;
  
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  } else if (status === 'cancelled') {
    updateData.cancelled_at = new Date().toISOString();
  }

  // Update order
  const { data: order, error } = await supabase
    .from('platform_orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء تحديث حالة الطلب' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Create notification for customer
  const statusMessages = {
    pending: { ar: 'طلبك قيد المراجعة', en: 'Your order is under review' },
    paid: { ar: 'تم استقبال الدفع لطلبك', en: 'Payment received for your order' },
    processing: { ar: 'جاري العمل على طلبك', en: 'Your order is being processed' },
    completed: { ar: 'تم إكمال طلبك بنجاح', en: 'Your order has been completed' },
    cancelled: { ar: 'تم إلغاء طلبك', en: 'Your order has been cancelled' }
  };

  await supabase.rpc('create_platform_notification', {
    p_user_id: existingOrder.customer_id,
    p_title_ar: `تحديث حالة الطلب ${existingOrder.order_number}`,
    p_body_ar: statusMessages[status as keyof typeof statusMessages].ar,
    p_title_en: `Order ${existingOrder.order_number} Status Update`,
    p_body_en: statusMessages[status as keyof typeof statusMessages].en,
    p_type: status === 'completed' ? 'success' : status === 'cancelled' ? 'warning' : 'info',
    p_category: 'order',
    p_data: JSON.stringify({ order_id: order.id, order_number: order.order_number, new_status: status })
  });

  // Log audit event
  await supabase
    .from('platform_audit_logs')
    .insert({
      actor_id: currentUser.id,
      action: 'ORDER_STATUS_UPDATE',
      entity_type: 'order',
      entity_id: order.id,
      old_data: existingOrder,
      new_data: order,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent')
    });

  return new Response(JSON.stringify({
    success: true,
    order
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleUpdateOrder(req: Request, supabase: any, orderId: string, currentUser: any): Promise<Response> {
  // Get existing order to check ownership
  const { data: existingOrder } = await supabase
    .from('platform_orders')
    .select('customer_id, status')
    .eq('id', orderId)
    .single();

  if (!existingOrder) {
    return new Response(JSON.stringify({ error: 'الطلب غير موجود' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Check permissions
  const canUpdate = currentUser.role === 'admin' || 
                   currentUser.role === 'staff' || 
                   (currentUser.role === 'customer' && existingOrder.customer_id === currentUser.id && existingOrder.status === 'pending');

  if (!canUpdate) {
    return new Response(JSON.stringify({ error: 'غير مصرح لك بتعديل هذا الطلب' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const updates = await req.json();

  // Customers can only update certain fields and only if order is pending
  if (currentUser.role === 'customer') {
    const allowedFields = ['customer_notes', 'billing_data'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);
    
    if (Object.keys(filteredUpdates).length === 0) {
      return new Response(JSON.stringify({ error: 'لا يمكنك تعديل هذه الحقول' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    let updatesObj = filteredUpdates;
  }

  const { data: order, error } = await supabase
    .from('platform_orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء تحديث الطلب' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({
    success: true,
    order
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

serve(handler);