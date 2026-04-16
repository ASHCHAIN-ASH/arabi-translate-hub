import { supabase } from '@/integrations/supabase/client';
import { Contract, ContractStatus, ClientApproval, ServiceType } from '@/types/contract';

const mapRowToContract = (row: any): Contract => ({
  id: row.id,
  clientId: row.user_id,
  clientName: row.client_name || row.title || '',
  clientEmail: row.client_email || '',
  clientPhone: row.client_phone || '',
  serviceType: (row.service_type || 'other') as ServiceType,
  serviceDetails: {
    title: row.title || '',
    description: row.content || '',
    specifications: {},
    attachments: [],
    estimatedDuration: '',
    deliverables: [],
  },
  contractContent: row.content || '',
  status: row.status as ContractStatus,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  approvedAt: row.signed_at || undefined,
  totalAmount: 0,
  paymentTerms: '',
  deliveryDate: '',
  terms: [],
});

export const createContract = async (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error('المستخدم غير مسجل الدخول');

  const { data, error } = await (supabase as any)
    .from('contracts')
    .insert({
      user_id: user.user.id,
      title: contractData.serviceDetails.title || contractData.clientName,
      content: contractData.contractContent || contractData.serviceDetails.description,
      status: contractData.status || 'draft',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

export const getAllContracts = async (): Promise<Contract[]> => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contracts:', error);
    return [];
  }

  return (data || []).map(mapRowToContract);
};

export const getContractById = async (id: string): Promise<Contract | null> => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapRowToContract(data);
};

export const updateContractStatus = async (
  contractId: string, 
  status: ContractStatus
): Promise<void> => {
  const updateData: Record<string, any> = { status, updated_at: new Date().toISOString() };
  
  if (status === 'signed') {
    updateData.signed_at = new Date().toISOString();
  }

  const { error } = await (supabase as any)
    .from('contracts')
    .update(updateData)
    .eq('id', contractId);

  if (error) throw error;
};

export const searchContracts = async (query: string): Promise<Contract[]> => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .or(`title.ilike.%${query}%,contract_number.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching contracts:', error);
    return [];
  }

  return (data || []).map(mapRowToContract);
};

export const getContractsByStatus = async (status: ContractStatus): Promise<Contract[]> => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).map(mapRowToContract);
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
  const { error } = await (supabase as any)
    .from('contracts')
    .update({
      signed_at: new Date().toISOString(),
      status: 'approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', contractId);

  if (error) throw error;
};
