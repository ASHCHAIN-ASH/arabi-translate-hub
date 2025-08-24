import { OrderStatus } from '../types/order';

// Mock API functions - replace with actual Supabase calls later
export const searchOrder = async (trackingId: string, phoneLastFour: string): Promise<OrderStatus> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock validation
  if (trackingId.length < 6 || phoneLastFour.length !== 4) {
    throw new Error('بيانات غير صحيحة');
  }

  // Mock data - replace with actual database query
  const mockOrder: OrderStatus = {
    id: '1',
    trackingId: trackingId.toUpperCase(),
    phoneLastFour,
    title: 'تأثير التكنولوجيا على التعليم في المملكة العربية السعودية',
    degree: 'ماجستير إدارة الأعمال',
    currentStatus: 'data_collection',
    progress: 45,
    estimatedDelivery: '2024-03-15',
    createdAt: '2024-01-10',
    timeline: [
      { status: 'received', name: 'مستلم', completed: true, date: '2024-01-10', description: 'تم استلام طلبكم بنجاح' },
      { status: 'under_review', name: 'تحت المراجعة', completed: true, date: '2024-01-12', description: 'جاري مراجعة التفاصيل' },
      { status: 'research_plan', name: 'خطة البحث', completed: true, date: '2024-01-15', description: 'إعداد خطة البحث' },
      { status: 'data_collection', name: 'جمع البيانات', completed: false, description: 'جمع وتحليل المصادر' },
      { status: 'statistical_analysis', name: 'التحليل الإحصائي', completed: false, description: 'تحليل البيانات إحصائياً' },
      { status: 'first_draft', name: 'المسودة الأولى', completed: false, description: 'إعداد المسودة الأولى' },
      { status: 'revisions', name: 'المراجعات', completed: false, description: 'المراجعة والتحسين' },
      { status: 'final_delivery', name: 'التسليم النهائي', completed: false, description: 'التسليم النهائي للعمل' },
      { status: 'closed', name: 'مغلق', completed: false, description: 'تم إنجاز العمل بنجاح' }
    ],
    files: [
      {
        name: 'خطة البحث المبدئية.pdf',
        url: '#',
        uploadedAt: '2024-01-15'
      }
    ]
  };

  return mockOrder;
};

// Future function to sync with Google Sheets/Airtable
export const syncWithExternalSheet = async (sheetUrl: string) => {
  // Implementation will depend on the external service API
  console.log('Syncing with external sheet:', sheetUrl);
};