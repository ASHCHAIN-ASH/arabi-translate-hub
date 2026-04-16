import { OrderStatus, TIMELINE_STEPS } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseOrder {
  id: string;
  tracking_id: string;
  phone_last_four: string;
  title: string;
  degree: string;
  service_type: string;
  description?: string;
  current_status: string;
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_phone: string;
  client_email: string;
}

const db = supabase as any;

export const getAllOrders = async (): Promise<DatabaseOrder[]> => {
  try {
    const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) { console.error('Error in getAllOrders:', error); return []; }
};

export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<void> => {
  try {
    const { error } = await db.from('orders').update({ current_status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
    if (error) throw error;
  } catch (error) { console.error('Error in updateOrderStatus:', error); throw error; }
};

export const searchOrderByTracking = async (trackingId: string, phoneLastFour: string): Promise<OrderStatus | null> => {
  try {
    const { data, error } = await db.rpc('track_order', { _tracking_id: trackingId.toUpperCase(), _phone_last_four: phoneLastFour }).single();
    if (error || !data) return null;
    const currentStepIndex = TIMELINE_STEPS.findIndex(step => step.status === data.current_status);
    const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100 : 10;
    return {
      id: data.id, trackingId: data.tracking_id, phoneLastFour: data.phone_last_four,
      title: data.title, degree: data.degree, currentStatus: data.current_status,
      progress, estimatedDelivery: data.estimated_delivery, createdAt: data.created_at,
      timeline: [], files: []
    };
  } catch (error) { console.error('Error in searchOrderByTracking:', error); return null; }
};

export const createOrder = async (orderData: {
  trackingId: string; phoneLastFour: string; title: string; degree: string;
  serviceType: string; description?: string; clientName: string; clientPhone: string; clientEmail: string;
}): Promise<string> => {
  try {
    const { data, error } = await db.from('orders').insert({
      tracking_id: orderData.trackingId, phone_last_four: orderData.phoneLastFour,
      title: orderData.title, degree: orderData.degree, service_type: orderData.serviceType,
      description: orderData.description, current_status: 'received',
      estimated_delivery: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      client_name: orderData.clientName, client_phone: orderData.clientPhone, client_email: orderData.clientEmail
    }).select('id').single();
    if (error) throw error;
    return data.id;
  } catch (error) { console.error('Error in createOrder:', error); throw error; }
};
