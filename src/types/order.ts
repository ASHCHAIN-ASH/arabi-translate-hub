export interface OrderStatus {
  id: string;
  trackingId: string;
  phoneLastFour: string;
  title: string;
  degree: string;
  currentStatus: string;
  progress: number;
  estimatedDelivery: string;
  createdAt: string;
  timeline: TimelineStep[];
  files: OrderFile[];
}

export interface TimelineStep {
  status: string;
  name: string;
  completed: boolean;
  date?: string;
  description: string;
}

export interface OrderFile {
  name: string;
  url: string;
  uploadedAt: string;
}

export const TIMELINE_STEPS = [
  { status: 'received', name: 'مستلم', description: 'تم استلام طلبكم بنجاح' },
  { status: 'under_review', name: 'تحت المراجعة', description: 'جاري مراجعة التفاصيل' },
  { status: 'research_plan', name: 'خطة البحث', description: 'إعداد خطة البحث' },
  { status: 'data_collection', name: 'جمع البيانات', description: 'جمع وتحليل المصادر' },
  { status: 'statistical_analysis', name: 'التحليل الإحصائي', description: 'تحليل البيانات إحصائياً' },
  { status: 'first_draft', name: 'المسودة الأولى', description: 'إعداد المسودة الأولى' },
  { status: 'revisions', name: 'المراجعات', description: 'المراجعة والتحسين' },
  { status: 'final_delivery', name: 'التسليم النهائي', description: 'التسليم النهائي للعمل' },
  { status: 'closed', name: 'مغلق', description: 'تم إنجاز العمل بنجاح' }
] as const;