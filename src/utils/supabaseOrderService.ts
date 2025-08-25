import { OrderStatus, TIMELINE_STEPS } from '@/types/order';

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

// Mock data for orders - orders table not configured yet
console.warn('Supabase orders table not configured, using mock data');

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

// Get all orders (mock implementation)
export const getAllOrders = async (): Promise<DatabaseOrder[]> => {
  return [...mockOrders];
};

// Update order status (mock implementation)
export const updateOrderStatus = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  console.log(`تم تحديث حالة الطلب ${orderId} إلى ${newStatus}`);
};

// Search order by tracking ID and phone (mock implementation)
export const searchOrderByTracking = async (
  trackingId: string, 
  phoneLastFour: string
): Promise<OrderStatus | null> => {
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
};

// Create new order (mock implementation)
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
};