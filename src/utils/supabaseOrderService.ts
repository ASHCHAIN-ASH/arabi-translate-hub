import { createClient } from '@supabase/supabase-js';
import { OrderStatus, TIMELINE_STEPS } from '@/types/order';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

// Mock data for fallback when Supabase is not configured
const mockOrders: DatabaseOrder[] = [
  {
    id: '1',
    tracking_id: 'TR001234',
    phone_last_four: '4567',
    title: 'تأثير التكنولوجيا على التعليم في المملكة العربية السعودية',
    degree: 'ماجستير إدارة الأعمال',
    service_type: 'research-thesis',
    description: 'دراسة تحليلية شاملة لتأثير التكنولوجيا على منظومة التعليم',
    current_status: 'data_collection',
    estimated_delivery: '2024-03-15',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    client_name: 'أحمد محمد',
    client_phone: '0501234567',
    client_email: 'ahmed@example.com'
  },
  {
    id: '2',
    tracking_id: 'TR001235',
    phone_last_four: '6543',
    title: 'الذكاء الاصطناعي في الرعاية الصحية',
    degree: 'دكتوراه علوم الحاسوب',
    service_type: 'research-plan',
    description: 'خطة بحثية مفصلة لدراسة تطبيقات الذكاء الاصطناعي في المجال الطبي',
    current_status: 'research_plan',
    estimated_delivery: '2024-04-20',
    created_at: '2024-01-15T14:30:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    client_name: 'فاطمة علي',
    client_phone: '0509876543',
    client_email: 'fatima@example.com'
  }
];

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);
let supabase: any = null;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase environment variables not found. Using mock data.');
}

// Get all orders from database
export const getAllOrders = async (): Promise<DatabaseOrder[]> => {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured) {
      console.log('Using mock data - Supabase not configured');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return [...mockOrders];
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      // If table doesn't exist, return mock data
      if (error.code === 'PGRST116') {
        return [...mockOrders];
      }
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    // Fallback to mock data on error
    return [...mockOrders];
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  try {
    // If Supabase is not configured, simulate update with mock data
    if (!isSupabaseConfigured) {
      console.log('Using mock data - Supabase not configured');
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      const orderIndex = mockOrders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].current_status = newStatus;
        mockOrders[orderIndex].updated_at = new Date().toISOString();
      }
      
      console.log(`تم تحديث حالة الطلب ${orderId} إلى ${newStatus}`);
      return;
    }

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
    // If Supabase is not configured, search in mock data
    if (!isSupabaseConfigured) {
      console.log('Using mock data - Supabase not configured');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const order = mockOrders.find(
        o => o.tracking_id === trackingId.toUpperCase() && 
             o.phone_last_four === phoneLastFour
      );

      if (!order) {
        return null;
      }

      const currentStepIndex = TIMELINE_STEPS.findIndex(step => step.status === order.current_status);
      const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100 : 10;

      return {
        id: order.id,
        trackingId: order.tracking_id,
        phoneLastFour: order.phone_last_four,
        title: order.title,
        degree: order.degree,
        currentStatus: order.current_status,
        progress,
        estimatedDelivery: order.estimated_delivery,
        createdAt: order.created_at,
        timeline: [],
        files: []
      };
    }

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
  serviceType: string;
  description?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}): Promise<string> => {
  try {
    // If Supabase is not configured, add to mock data
    if (!isSupabaseConfigured) {
      console.log('Using mock data - Supabase not configured');
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      const newOrder: DatabaseOrder = {
        id: String(mockOrders.length + 1),
        tracking_id: orderData.trackingId,
        phone_last_four: orderData.phoneLastFour,
        title: orderData.title,
        degree: orderData.degree,
        service_type: orderData.serviceType,
        description: orderData.description,
        current_status: 'received',
        estimated_delivery: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_name: orderData.clientName,
        client_phone: orderData.clientPhone,
        client_email: orderData.clientEmail
      };
      
      mockOrders.push(newOrder);
      console.log('تم إنشاء الطلب بنجاح:', newOrder.tracking_id);
      return newOrder.id;
    }

    const estimatedDelivery = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        tracking_id: orderData.trackingId,
        phone_last_four: orderData.phoneLastFour,
        title: orderData.title,
        degree: orderData.degree,
        service_type: orderData.serviceType,
        description: orderData.description,
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