import { createClient } from '@supabase/supabase-js';
import { OrderStatus, TIMELINE_STEPS } from '@/types/order';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface DatabaseOrder {
  id: string;
  tracking_id: string;
  phone_last_four: string;
  title: string;
  degree: string;
  current_status: string;
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_phone: string;
  client_email: string;
}

// Get all orders from database
export const getAllOrders = async (): Promise<DatabaseOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      // If table doesn't exist, return empty array
      if (error.code === 'PGRST116') {
        return [];
      }
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        current_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
    
    console.log(`تم تحديث حالة الطلب ${orderId} إلى ${newStatus}`);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
};

// Search order by tracking ID and phone
export const searchOrderByTracking = async (
  trackingId: string, 
  phoneLastFour: string
): Promise<OrderStatus | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('tracking_id', trackingId.toUpperCase())
      .eq('phone_last_four', phoneLastFour)
      .single();
    
    if (error || !data) {
      return null;
    }

    // Calculate progress based on current status
    const currentStepIndex = TIMELINE_STEPS.findIndex(step => step.status === data.current_status);
    const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100 : 10;

    return {
      id: data.id,
      trackingId: data.tracking_id,
      phoneLastFour: data.phone_last_four,
      title: data.title,
      degree: data.degree,
      currentStatus: data.current_status,
      progress,
      estimatedDelivery: data.estimated_delivery,
      createdAt: data.created_at,
      timeline: [],
      files: []
    };
  } catch (error) {
    console.error('Error in searchOrderByTracking:', error);
    return null;
  }
};

// Create new order
export const createOrder = async (orderData: {
  trackingId: string;
  phoneLastFour: string;
  title: string;
  degree: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}): Promise<string> => {
  try {
    const estimatedDelivery = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        tracking_id: orderData.trackingId,
        phone_last_four: orderData.phoneLastFour,
        title: orderData.title,
        degree: orderData.degree,
        current_status: 'received',
        estimated_delivery: estimatedDelivery,
        client_name: orderData.clientName,
        client_phone: orderData.clientPhone,
        client_email: orderData.clientEmail
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    console.log('تم إنشاء الطلب بنجاح:', data.tracking_id);
    return data.id;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};