import { createClient } from '@supabase/supabase-js';
import { Contract, ContractStatus, ClientApproval, ServiceType } from '@/types/contract';

// تحقق من وجود متغيرات البيئة لـ Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured, using mock data');
}

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
        targetLang: 'العربية'
      },
      attachments: [],
      estimatedDuration: '3 أيام',
      deliverables: ['ترجمة معتمدة', 'ملف PDF', 'ملف Word']
    },
    contractContent: 'محتوى العقد...',
    status: 'sent',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    totalAmount: 750,
    paymentTerms: '50% مقدم، 50% عند التسليم',
    deliveryDate: '2024-01-20',
    terms: []
  },
  {
    id: '2', 
    clientId: 'client-2',
    clientName: 'فاطمة أحمد',
    clientEmail: 'fatima@example.com',
    clientPhone: '+966507654321',
    serviceType: 'research-thesis',
    serviceDetails: {
      title: 'رسالة ماجستير في إدارة الأعمال',
      description: 'إعداد رسالة ماجستير كاملة',
      specifications: {
        thesisType: 'ماجستير',
        major: 'إدارة الأعمال',
        pageCount: 120
      },
      attachments: [],
      estimatedDuration: '45 يوم',
      deliverables: ['رسالة كاملة', 'عرض تقديمي', 'ملخص تنفيذي']
    },
    contractContent: 'محتوى العقد...',
    status: 'approved',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    approvedAt: '2024-01-12T14:30:00Z',
    totalAmount: 12000,
    paymentTerms: 'دفع على 3 مراحل',
    deliveryDate: '2024-03-01',
    terms: []
  }
];

// دالة إنشاء عقد جديد
export const createContract = async (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert([{
          ...contractData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  } else {
    // محاكاة إنشاء عقد
    const newId = `mock-${Date.now()}`;
    const newContract: Contract = {
      ...contractData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockContracts.push(newContract);
    return newId;
  }
};

// دالة جلب جميع العقود
export const getAllContracts = async (): Promise<Contract[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // تحويل البيانات من تنسيق قاعدة البيانات
      return data.map((row: any) => ({
        id: row.id,
        clientId: row.client_id,
        clientName: row.client_name,
        clientEmail: row.client_email,
        clientPhone: row.client_phone,
        serviceType: row.service_type,
        serviceDetails: row.service_details,
        contractContent: row.contract_content,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        approvedAt: row.approved_at,
        clientSignature: row.client_signature,
        digitalSignature: row.digital_signature,
        totalAmount: row.total_amount,
        paymentTerms: row.payment_terms,
        deliveryDate: row.delivery_date,
        terms: row.terms || []
      }));
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return mockContracts;
    }
  } else {
    return mockContracts;
  }
};

// دالة البحث عن عقد بالمعرف
export const getContractById = async (contractId: string): Promise<Contract | null> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        clientId: data.client_id,
        clientName: data.client_name,
        clientEmail: data.client_email,
        clientPhone: data.client_phone,
        serviceType: data.service_type,
        serviceDetails: data.service_details,
        contractContent: data.contract_content,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        approvedAt: data.approved_at,
        clientSignature: data.client_signature,
        digitalSignature: data.digital_signature,
        totalAmount: data.total_amount,
        paymentTerms: data.payment_terms,
        deliveryDate: data.delivery_date,
        terms: data.terms || []
      };
    } catch (error) {
      console.error('Error fetching contract:', error);
      return null;
    }
  } else {
    return mockContracts.find(c => c.id === contractId) || null;
  }
};

// دالة تحديث حالة العقد
export const updateContractStatus = async (contractId: string, newStatus: ContractStatus): Promise<void> => {
  if (supabase) {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'approved') {
        updateData.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('contracts')
        .update(updateData)
        .eq('id', contractId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating contract status:', error);
      throw error;
    }
  } else {
    // محاكاة التحديث
    const contract = mockContracts.find(c => c.id === contractId);
    if (contract) {
      contract.status = newStatus;
      contract.updatedAt = new Date().toISOString();
      if (newStatus === 'approved') {
        contract.approvedAt = new Date().toISOString();
      }
    }
  }
};

// دالة حفظ موافقة العميل
export const saveClientApproval = async (approval: ClientApproval): Promise<void> => {
  if (supabase) {
    try {
      // حفظ الموافقة
      const { error: approvalError } = await supabase
        .from('client_approvals')
        .insert([{
          contract_id: approval.contractId,
          client_name: approval.clientName,
          approval_date: approval.approvalDate,
          ip_address: approval.ipAddress,
          user_agent: approval.userAgent,
          signature: approval.signature,
          comments: approval.comments
        }]);

      if (approvalError) throw approvalError;

      // تحديث حالة العقد
      await updateContractStatus(approval.contractId, 'approved');
    } catch (error) {
      console.error('Error saving client approval:', error);
      throw error;
    }
  } else {
    // محاكاة حفظ الموافقة
    console.log('Mock: Client approval saved', approval);
    await updateContractStatus(approval.contractId, 'approved');
  }
};

// دالة البحث في العقود
export const searchContracts = async (query: string): Promise<Contract[]> => {
  const allContracts = await getAllContracts();
  
  if (!query.trim()) {
    return allContracts;
  }

  const searchTerm = query.toLowerCase();
  return allContracts.filter(contract => 
    contract.clientName.toLowerCase().includes(searchTerm) ||
    contract.clientEmail.toLowerCase().includes(searchTerm) ||
    contract.serviceDetails.title.toLowerCase().includes(searchTerm) ||
    contract.id.toLowerCase().includes(searchTerm)
  );
};

// دالة جلب العقود حسب الحالة
export const getContractsByStatus = async (status: ContractStatus): Promise<Contract[]> => {
  const allContracts = await getAllContracts();
  return allContracts.filter(contract => contract.status === status);
};

// دالة جلب العقود حسب نوع الخدمة
export const getContractsByServiceType = async (serviceType: ServiceType): Promise<Contract[]> => {
  const allContracts = await getAllContracts();
  return allContracts.filter(contract => contract.serviceType === serviceType);
};