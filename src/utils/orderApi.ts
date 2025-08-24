import { OrderStatus } from '../types/order';
import { searchOrderByTracking } from './supabaseOrderService';

// API function that uses Supabase service
export const searchOrder = async (trackingId: string, phoneLastFour: string): Promise<OrderStatus> => {
  const order = await searchOrderByTracking(trackingId, phoneLastFour);
  
  if (!order) {
    throw new Error('لم يتم العثور على طلب بهذه البيانات');
  }

  // Add timeline data (this would come from database in real implementation)
  const timeline = [
    { status: 'received', name: 'مستلم', completed: true, date: order.createdAt, description: 'تم استلام طلبكم بنجاح' },
    { status: 'under_review', name: 'تحت المراجعة', completed: order.currentStatus !== 'received', description: 'جاري مراجعة التفاصيل' },
    { status: 'research_plan', name: 'خطة البحث', completed: ['research_plan', 'data_collection', 'statistical_analysis', 'first_draft', 'revisions', 'final_delivery', 'closed'].includes(order.currentStatus), description: 'إعداد خطة البحث' },
    { status: 'data_collection', name: 'جمع البيانات', completed: ['data_collection', 'statistical_analysis', 'first_draft', 'revisions', 'final_delivery', 'closed'].includes(order.currentStatus), description: 'جمع وتحليل المصادر' },
    { status: 'statistical_analysis', name: 'التحليل الإحصائي', completed: ['statistical_analysis', 'first_draft', 'revisions', 'final_delivery', 'closed'].includes(order.currentStatus), description: 'تحليل البيانات إحصائياً' },
    { status: 'first_draft', name: 'المسودة الأولى', completed: ['first_draft', 'revisions', 'final_delivery', 'closed'].includes(order.currentStatus), description: 'إعداد المسودة الأولى' },
    { status: 'revisions', name: 'المراجعات', completed: ['revisions', 'final_delivery', 'closed'].includes(order.currentStatus), description: 'المراجعة والتحسين' },
    { status: 'final_delivery', name: 'التسليم النهائي', completed: ['final_delivery', 'closed'].includes(order.currentStatus), description: 'التسليم النهائي للعمل' },
    { status: 'closed', name: 'مغلق', completed: order.currentStatus === 'closed', description: 'تم إنجاز العمل بنجاح' }
  ];

  return {
    ...order,
    timeline,
    files: [] // Will be populated from database in real implementation
  };
};

// Future function to sync with Google Sheets/Airtable
export const syncWithExternalSheet = async (sheetUrl: string) => {
  // Implementation will depend on the external service API
  console.log('Syncing with external sheet:', sheetUrl);
};