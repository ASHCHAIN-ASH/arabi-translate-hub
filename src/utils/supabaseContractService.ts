import { supabase } from '@/integrations/supabase/client';
import { Contract, ContractStatus, ClientApproval, ServiceType } from '@/types/contract';

// ==============================
// Contract Service — Real Supabase Queries
// Uses the `contracts` table
// ==============================

const mapRowToContract = (row: any): Contract => ({
  id: row.id,
  clientId: row.user_id,
  clientName: row.client_name,
  clientEmail: row.client_email,
  clientPhone: row.client_phone,
  serviceType: row.service_type as ServiceType,
  serviceDetails: {
    title: row.service_description || '',
    description: row.service_description || '',
    specifications: row.service_details || {},
    attachments: [],
    estimatedDuration: row.contract_duration || '',
    deliverables: [],
  },
  contractContent: row.contract_content || '',
  status: row.status as ContractStatus,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  approvedAt: row.client_approved_at || undefined,
  clientSignature: row.signed_by_client || undefined,
  digitalSignature: row.signed_by_company || undefined,
  totalAmount: row.service_price,
  paymentTerms: row.payment_terms || '',
  deliveryDate: row.delivery_date || '',
  terms: [],
});

export const createContract = async (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error('المستخدم غير مسجل الدخول');

  const { data, error } = await supabase
    .from('contracts')
    .insert({
      user_id: user.user.id,
      client_name: contractData.clientName,
      client_email: contractData.clientEmail,
      client_phone: contractData.clientPhone,
      client_type: 'individual',
      service_type: contractData.serviceType,
      service_description: contractData.serviceDetails.title,
      service_details: contractData.serviceDetails.specifications,
      contract_content: contractData.contractContent,
      service_price: contractData.totalAmount,
      payment_terms: contractData.paymentTerms,
      delivery_date: contractData.deliveryDate,
      status: contractData.status || 'draft',
      contract_number: `CNT-${Date.now()}`,
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
  
  if (status === 'approved') {
    updateData.client_approved = true;
    updateData.client_approved_at = new Date().toISOString();
  }
  if (status === 'signed') {
    updateData.company_approved = true;
    updateData.company_approved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('contracts')
    .update(updateData)
    .eq('id', contractId);

  if (error) throw error;
};

export const searchContracts = async (query: string): Promise<Contract[]> => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .or(`client_name.ilike.%${query}%,client_email.ilike.%${query}%,service_description.ilike.%${query}%`)
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
  const { error } = await supabase
    .from('contracts')
    .update({
      client_approved: true,
      client_approved_at: new Date().toISOString(),
      signed_by_client: approvalData.signature,
      status: 'approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', contractId);

  if (error) throw error;
};
