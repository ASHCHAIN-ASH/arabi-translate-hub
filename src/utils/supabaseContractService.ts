import { Contract, ContractStatus, ClientApproval, ServiceType } from '@/types/contract';

// Mock data - Contract tables not configured yet
console.warn('Supabase contract tables not configured, using mock data');

// بيانات وهمية للاختبار
const mockContracts: Contract[] = [
  {
    id: '1',
    clientId: 'client-1',
    clientName: 'أحمد محمد علي',
    clientEmail: 'ahmed@example.com',
    clientPhone: '+966501234567',
    serviceType: 'translation-legal',
    serviceDetails: {
      title: 'ترجمة عقد عمل',
      description: 'ترجمة عقد عمل من الإنجليزية إلى العربية',
      specifications: {
        wordCount: 1500,
        sourceLang: 'الإنجليزية',
        targetLang: 'العربية',
        domain: 'قانوني'
      },
      attachments: [],
      estimatedDuration: '5-7 أيام عمل',
      deliverables: ['ملف الترجمة النهائي', 'مراجعة لغوية']
    },
    contractContent: 'محتوى العقد الخاص بترجمة عقد العمل...',
    status: 'draft',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    approvedAt: null,
    clientSignature: null,
    digitalSignature: null,
    totalAmount: 450,
    deliveryDate: '2024-01-22',
    terms: [
      {
        id: '1',
        title: 'المدة الزمنية',
        content: 'سيتم تسليم الترجمة خلال 7 أيام عمل',
        required: true
      },
      {
        id: '2',
        title: 'الدفع',
        content: 'الدفع مقدماً قبل البدء في العمل',
        required: true
      }
    ]
  },
  {
    id: '2',
    clientId: 'client-2',
    clientName: 'فاطمة سالم',
    clientEmail: 'fatima@example.com',
    clientPhone: '+966507654321',
    serviceType: 'translation-medical',
    serviceDetails: {
      title: 'ترجمة تقرير طبي',
      description: 'ترجمة تقرير طبي من العربية إلى الإنجليزية',
      specifications: {
        wordCount: 800,
        sourceLang: 'العربية',
        targetLang: 'الإنجليزية',
        domain: 'طبي'
      },
      attachments: [],
      estimatedDuration: '3-5 أيام عمل',
      deliverables: ['ترجمة طبية معتمدة', 'شهادة ترجمة']
    },
    contractContent: 'محتوى العقد الخاص بترجمة التقرير الطبي...',
    status: 'approved',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    approvedAt: '2024-01-12T09:15:00Z',
    clientSignature: 'signature_hash_123',
    digitalSignature: 'digital_sig_456',
    totalAmount: 320,
    
    deliveryDate: '2024-01-17',
    terms: [
      {
        id: '3',
        title: 'السرية',
        content: 'الالتزام بسرية المعلومات الطبية',
        required: true
      }
    ]
  }
];

export const createContract = async (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  // Mock implementation - return a fake ID
  const newId = 'contract-' + Date.now();
  console.log('Mock contract created with ID:', newId);
  return newId;
};

export const getAllContracts = async (): Promise<Contract[]> => {
  // Return mock data
  return [...mockContracts];
};

export const getContractById = async (id: string): Promise<Contract | null> => {
  const contract = mockContracts.find(c => c.id === id);
  return contract || null;
};

export const updateContractStatus = async (
  contractId: string, 
  status: ContractStatus
): Promise<void> => {
  // Mock implementation - log the update
  console.log(`Contract ${contractId} status updated to ${status}`);
};

export const searchContracts = async (query: string): Promise<Contract[]> => {
  // Mock search implementation
  const lowerQuery = query.toLowerCase();
  return mockContracts.filter(contract => 
    contract.clientName.toLowerCase().includes(lowerQuery) ||
    contract.clientEmail.toLowerCase().includes(lowerQuery) ||
    contract.serviceDetails.title.toLowerCase().includes(lowerQuery)
  );
};

export const getContractsByStatus = async (status: ContractStatus): Promise<Contract[]> => {
  return mockContracts.filter(contract => contract.status === status);
};

export const saveClientApproval = async (
  contractId: string,
  approvalData: {
    clientName: string;
    signature: string;
    ipAddress: string;
    userAgent: string;
    comments?: string;
  }
): Promise<void> => {
  // Mock implementation - log the approval
  console.log(`Client approval saved for contract ${contractId}:`, approvalData);
};