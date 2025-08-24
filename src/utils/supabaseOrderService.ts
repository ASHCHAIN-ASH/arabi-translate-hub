// Mock service - will be replaced with actual Supabase implementation
import { OrderStatus, TimelineStep } from '@/types/order';

export interface DatabaseOrder {
  id: string;
  tracking_id: string;
  phone_last_four: string;
  title: string;
  degree: string;
  current_status: string;
  progress: number;
  estimated_delivery: string;
  created_at: string;
  client_name: string;
  client_phone: string;
  client_email: string;
}

// Mock data for now
const mockOrders: DatabaseOrder[] = [
  {
    id: '1',
    tracking_id: 'TR001234',
    phone_last_four: '4567',
    title: 'تأثير التكنولوجيا على التعليم في المملكة العربية السعودية',
    degree: 'ماجستير إدارة الأعمال',
    current_status: 'data_collection',
    progress: 45,
    estimated_delivery: '2024-03-15',
    created_at: '2024-01-10',
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
    current_status: 'research_plan',
    progress: 25,
    estimated_delivery: '2024-04-20',
    created_at: '2024-01-15',
    client_name: 'فاطمة علي',
    client_phone: '0509876543',
    client_email: 'fatima@example.com'
  }
];

export const getAllOrders = async (): Promise<DatabaseOrder[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockOrders];
};

export const updateOrderStatus = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update mock data
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex].current_status = newStatus;
  }

  // Log the status change
  await logStatusChange(orderId, newStatus);
};

export const logStatusChange = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  console.log(`تغيير حالة الطلب ${orderId} إلى ${newStatus}`);
};

export const searchOrderByTracking = async (
  trackingId: string, 
  phoneLastFour: string
): Promise<OrderStatus | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const order = mockOrders.find(
    o => o.tracking_id === trackingId.toUpperCase() && 
         o.phone_last_four === phoneLastFour
  );

  if (!order) {
    return null;
  }

  // Convert database format to OrderStatus format
  const orderStatus: OrderStatus = {
    id: order.id,
    trackingId: order.tracking_id,
    phoneLastFour: order.phone_last_four,
    title: order.title,
    degree: order.degree,
    currentStatus: order.current_status,
    progress: order.progress,
    estimatedDelivery: order.estimated_delivery,
    createdAt: order.created_at,
    timeline: [], // Will be populated separately
    files: [] // Will be populated separately
  };

  return orderStatus;
};

export const createOrder = async (orderData: {
  trackingId: string;
  phoneLastFour: string;
  title: string;
  degree: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newOrder: DatabaseOrder = {
    id: String(mockOrders.length + 1),
    tracking_id: orderData.trackingId,
    phone_last_four: orderData.phoneLastFour,
    title: orderData.title,
    degree: orderData.degree,
    current_status: 'received',
    progress: 10,
    estimated_delivery: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    client_name: orderData.clientName,
    client_phone: orderData.clientPhone,
    client_email: orderData.clientEmail
  };
  
  mockOrders.push(newOrder);
  return newOrder.id;
};