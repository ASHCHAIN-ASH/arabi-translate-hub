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
  user_id?: string;
}

export interface OrderTimeline {
  id: string;
  order_id: string;
  title: string;
  description?: string;
  status: string;
  scheduled_date?: string;
  completed_date?: string;
  actor_type: string;
  actor_name?: string;
  created_at: string;
}

export interface OrderFile {
  id: string;
  order_id: string;
  file_name: string;
  file_url: string;
  file_type: 'input' | 'output';
  uploaded_at: string;
  uploaded_by?: string;
}

export interface OrderCommunication {
  id: string;
  order_id: string;
  message: string;
  sender_type: 'client' | 'admin' | 'specialist';
  sender_name?: string;
  created_at: string;
  read_at?: string;
}

const db = supabase as any;

export const getOrderById = async (orderId: string): Promise<DatabaseOrder | null> => {
  try {
    const { data, error } = await db.from('orders').select('*').eq('id', orderId).single();
    if (error) { console.error('Error fetching order:', error); return null; }
    return data;
  } catch (error) { console.error('Error in getOrderById:', error); return null; }
};

export const getOrderTimeline = async (orderId: string): Promise<OrderTimeline[]> => {
  try {
    const { data, error } = await db.from('order_timeline').select('*').eq('order_id', orderId).order('created_at', { ascending: true });
    if (error) { console.error('Error fetching timeline:', error); return []; }
    return data || [];
  } catch (error) { console.error('Error in getOrderTimeline:', error); return []; }
};

export const getOrderFiles = async (orderId: string): Promise<OrderFile[]> => { return []; };

export const getOrderCommunications = async (orderId: string): Promise<OrderCommunication[]> => { return []; };

export const addOrderCommunication = async (
  orderId: string, message: string, senderType: 'client' | 'admin' | 'specialist' = 'client'
): Promise<OrderCommunication> => {
  return { id: Date.now().toString(), order_id: orderId, message, sender_type: senderType, created_at: new Date().toISOString() };
};

export const updateOrderStatus = async (orderId: string, status: string, progress?: number): Promise<void> => {
  try {
    const { error } = await db.from('orders').update({ current_status: status, updated_at: new Date().toISOString() }).eq('id', orderId);
    if (error) throw error;
  } catch (error) { console.error('Error in updateOrderStatus:', error); throw error; }
};

export const updateOrderTimeline = async (orderId: string, status: string, completed: boolean): Promise<void> => {
  try {
    const { error } = await db.from('order_timeline').update({ completed_date: completed ? new Date().toISOString().split('T')[0] : null }).eq('order_id', orderId).eq('status', status);
    if (error) throw error;
  } catch (error) { console.error('Error in updateOrderTimeline:', error); throw error; }
};

export const uploadOrderFile = async (orderId: string, file: File, fileType: 'input' | 'output'): Promise<OrderFile> => {
  return { id: Date.now().toString(), order_id: orderId, file_name: file.name, file_url: URL.createObjectURL(file), file_type: fileType, uploaded_at: new Date().toISOString() };
};

export const updateOrder = async (orderId: string, updates: Partial<DatabaseOrder>): Promise<void> => {
  try {
    const { error } = await db.from('orders').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', orderId);
    if (error) throw error;
  } catch (error) { console.error('Error in updateOrder:', error); throw error; }
};

export const getAllOrdersForAdmin = async (): Promise<DatabaseOrder[]> => {
  try {
    const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
    if (error) { console.error('Error fetching orders:', error); return []; }
    return data || [];
  } catch (error) { console.error('Error in getAllOrdersForAdmin:', error); return []; }
};

export const getOrdersForClient = async (clientId: string): Promise<DatabaseOrder[]> => {
  try {
    const { data, error } = await db.from('orders').select('*').eq('user_id', clientId).order('created_at', { ascending: false });
    if (error) { console.error('Error fetching client orders:', error); return []; }
    return data || [];
  } catch (error) { console.error('Error in getOrdersForClient:', error); return []; }
};
