export interface Contract {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: ServiceType;
  serviceDetails: ServiceDetails;
  contractContent: string;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  clientSignature?: string;
  digitalSignature?: string;
  totalAmount: number;
  paymentTerms: string;
  deliveryDate: string;
  terms: ContractTerm[];
}

export interface ServiceDetails {
  title: string;
  description: string;
  specifications: Record<string, any>;
  attachments: string[];
  estimatedDuration: string;
  deliverables: string[];
}

export interface ContractTerm {
  id: string;
  title: string;
  content: string;
  required: boolean;
}

export interface ContractTemplate {
  id: string;
  serviceType: ServiceType;
  name: string;
  content: string;
  terms: ContractTerm[];
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[];
}

export type ServiceType = 
  | 'translation-legal'
  | 'translation-business' 
  | 'translation-technical'
  | 'translation-medical'
  | 'translation-academic'
  | 'translation-literary'
  | 'translation-media'
  | 'research-thesis'
  | 'research-plan'
  | 'research-analysis'
  | 'research-formatting'
  | 'research-publication'
  | 'research-consultation'
  | 'custom-service';

export type ContractStatus = 
  | 'draft'        // مسودة
  | 'sent'         // مرسل للعميل
  | 'reviewed'     // تمت المراجعة
  | 'approved'     // موافق عليه
  | 'signed'       // موقع
  | 'active'       // نشط
  | 'completed'    // مكتمل
  | 'cancelled'    // ملغي
  | 'expired';     // منتهي الصلاحية

export interface ClientApproval {
  contractId: string;
  clientName: string;
  approvalDate: string;
  ipAddress: string;
  userAgent: string;
  signature: string;
  comments?: string;
}