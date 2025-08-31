import { createClient } from '@supabase/supabase-js';

// This would be properly configured with your Supabase URL and key
const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';

// For now, this is a mock service that simulates Supabase operations
export interface DatabaseOrder {
  id: string;
  client_id: string;
  title: string;
  service_type: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  budget: number;
  deadline: string;
  created_at: string;
  updated_at: string;
  special_requirements?: string;
}

export interface OrderTimeline {
  id: string;
  order_id: string;
  status: string;
  name: string;
  description: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface OrderFile {
  id: string;
  order_id: string;
  filename: string;
  file_type: 'input' | 'output';
  file_size: string;
  file_url: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface OrderCommunication {
  id: string;
  order_id: string;
  sender_type: 'client' | 'admin' | 'specialist';
  sender_name: string;
  message: string;
  created_at: string;
  read_status: boolean;
}

// Mock data for demonstration
const mockOrders: DatabaseOrder[] = [
  {
    id: 'MEP250003',
    client_id: 'client-1',
    title: 'مراجعة لغوية وتدوية متخصصة للنص الأكاديمي مع تحسين الأسلوب',
    service_type: 'statistical_analysis',
    description: 'تحليل إحصائي شامل للبيانات البحثية باستخدام R و SPSS',
    status: 'in_progress',
    priority: 'medium',
    progress: 45,
    budget: 899,
    deadline: '2024-01-30',
    created_at: '2024-01-15',
    updated_at: '2024-01-20',
    special_requirements: 'يرجى التركيز على التحليل الوصفي والاستنتاجي'
  }
];

const mockTimeline: OrderTimeline[] = [
  { id: '1', order_id: 'MEP250003', status: 'received', name: 'مستلم', description: 'تم استلام طلبكم بنجاح', completed: true, completed_at: '2024-01-15', created_at: '2024-01-15' },
  { id: '2', order_id: 'MEP250003', status: 'under_review', name: 'تحت المراجعة', description: 'جاري مراجعة التفاصيل', completed: true, completed_at: '2024-01-16', created_at: '2024-01-15' },
  { id: '3', order_id: 'MEP250003', status: 'in_progress', name: 'قيد التنفيذ', description: 'بدء العمل على المشروع', completed: true, completed_at: '2024-01-18', created_at: '2024-01-15' },
  { id: '4', order_id: 'MEP250003', status: 'review', name: 'المراجعة', description: 'مراجعة العمل والتأكد من الجودة', completed: false, created_at: '2024-01-15' },
  { id: '5', order_id: 'MEP250003', status: 'delivery', name: 'التسليم', description: 'التسليم النهائي للعمل', completed: false, created_at: '2024-01-15' }
];

const mockFiles: OrderFile[] = [
  { id: '1', order_id: 'MEP250003', filename: 'البيانات_الأولية.xlsx', file_type: 'input', file_size: '2.3 MB', file_url: '/mock-file-1', uploaded_at: '2024-01-15', uploaded_by: 'client' },
  { id: '2', order_id: 'MEP250003', filename: 'متطلبات_المشروع.pdf', file_type: 'input', file_size: '1.1 MB', file_url: '/mock-file-2', uploaded_at: '2024-01-15', uploaded_by: 'client' },
  { id: '3', order_id: 'MEP250003', filename: 'التحليل_المبدئي.pdf', file_type: 'output', file_size: '3.7 MB', file_url: '/mock-file-3', uploaded_at: '2024-01-20', uploaded_by: 'specialist' }
];

const mockCommunications: OrderCommunication[] = [
  { id: '1', order_id: 'MEP250003', sender_type: 'client', sender_name: 'أحمد محمد علي', message: 'هل يمكن إضافة تحليل إضافي للمتغيرات؟', created_at: '2024-01-19 14:30', read_status: true },
  { id: '2', order_id: 'MEP250003', sender_type: 'specialist', sender_name: 'د. محمد أحمد', message: 'بالطبع، سيتم إضافة التحليل المطلوب وسيكون جاهز خلال يومين', created_at: '2024-01-19 16:45', read_status: true }
];

console.warn('Supabase order management system not yet configured. Using mock data.');

// Mock Supabase operations
export const getOrderById = async (orderId: string): Promise<DatabaseOrder | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockOrders.find(order => order.id === orderId) || null;
};

export const getOrderTimeline = async (orderId: string): Promise<OrderTimeline[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTimeline.filter(timeline => timeline.order_id === orderId);
};

export const getOrderFiles = async (orderId: string): Promise<OrderFile[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockFiles.filter(file => file.order_id === orderId);
};

export const getOrderCommunications = async (orderId: string): Promise<OrderCommunication[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCommunications.filter(comm => comm.order_id === orderId);
};

export const addOrderCommunication = async (orderId: string, message: string, senderType: 'client' | 'admin' | 'specialist' = 'client'): Promise<OrderCommunication> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newCommunication: OrderCommunication = {
    id: Date.now().toString(),
    order_id: orderId,
    sender_type: senderType,
    sender_name: senderType === 'client' ? 'العميل' : 'المختص',
    message,
    created_at: new Date().toLocaleString('ar-SA'),
    read_status: false
  };
  
  mockCommunications.push(newCommunication);
  return newCommunication;
};

export const updateOrderStatus = async (orderId: string, status: string, progress?: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex].status = status;
    if (progress !== undefined) {
      mockOrders[orderIndex].progress = progress;
    }
    mockOrders[orderIndex].updated_at = new Date().toISOString();
  }
};

export const updateOrderTimeline = async (orderId: string, status: string, completed: boolean): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const timelineIndex = mockTimeline.findIndex(timeline => timeline.order_id === orderId && timeline.status === status);
  if (timelineIndex !== -1) {
    mockTimeline[timelineIndex].completed = completed;
    if (completed) {
      mockTimeline[timelineIndex].completed_at = new Date().toISOString();
    }
  }
};

export const uploadOrderFile = async (orderId: string, file: File, fileType: 'input' | 'output'): Promise<OrderFile> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newFile: OrderFile = {
    id: Date.now().toString(),
    order_id: orderId,
    filename: file.name,
    file_type: fileType,
    file_size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    file_url: `/mock-file-${Date.now()}`,
    uploaded_at: new Date().toISOString(),
    uploaded_by: 'admin'
  };
  
  mockFiles.push(newFile);
  return newFile;
};

export const updateOrder = async (orderId: string, updates: Partial<DatabaseOrder>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex] = { ...mockOrders[orderIndex], ...updates, updated_at: new Date().toISOString() };
  }
};

// Admin functions for managing orders
export const getAllOrdersForAdmin = async (): Promise<DatabaseOrder[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockOrders;
};

export const getOrdersForClient = async (clientId: string): Promise<DatabaseOrder[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockOrders.filter(order => order.client_id === clientId);
};