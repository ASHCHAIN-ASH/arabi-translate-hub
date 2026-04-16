import { supabase } from '@/integrations/supabase/client';
import { 
  EsignDocument, 
  EsignSigner, 
  EsignEvent, 
  EsignStatus,
  SigningSession,
  SignatureData,
  SignerRole,
  EsignEventType
} from '@/types/esign';

export const createEsignDocument = async (
  contractId: string,
  docTitle: string,
  signers: Array<{ role: SignerRole; name: string; email: string; phone?: string; }>
): Promise<string> => {
  const { error } = await supabase
    .from('contracts')
    .update({ status: 'sent', updated_at: new Date().toISOString() })
    .eq('id', contractId);

  if (error) throw error;
  return contractId;
};

export const generateSigningToken = async (
  documentId: string,
  signerEmail: string,
  expiryHours: number = 72
): Promise<string> => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
};

export const validateSigningToken = async (token: string): Promise<SigningSession | null> => {
  return null;
};

export const saveSignature = async (
  sessionId: string,
  signatureData: SignatureData
): Promise<void> => {
  const signatureHash = await generateSignatureHash(signatureData);

  const { error } = await (supabase as any)
    .from('contracts')
    .update({
      signed_at: new Date().toISOString(),
      status: 'signed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) throw error;
};

async function generateSignatureHash(data: SignatureData): Promise<string> {
  const payload = `${data.signatureImage}|${data.timestamp}|${data.ipAddress}|${data.userAgent}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(payload));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const getAllEsignDocuments = async (): Promise<EsignDocument[]> => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .in('status', ['sent', 'signed', 'approved'])
    .order('updated_at', { ascending: false });

  if (error) return [];

  return (data || []).map(c => ({
    id: c.id,
    contractId: c.id,
    docTitle: c.title || 'عقد',
    status: mapContractStatusToEsign(c.status || ''),
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    signers: [],
    events: [],
  }));
};

function mapContractStatusToEsign(status: string): EsignStatus {
  switch (status) {
    case 'draft': return 'draft';
    case 'sent': return 'sent';
    case 'approved': return 'partially_signed';
    case 'signed': return 'fully_signed';
    case 'cancelled': return 'void';
    default: return 'draft';
  }
}

export const getEsignDocumentById = async (id: string): Promise<EsignDocument | null> => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    contractId: data.id,
    docTitle: data.title || 'عقد',
    status: mapContractStatusToEsign(data.status || ''),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    signers: [],
    events: [],
  };
};

export const updateDocumentStatus = async (
  documentId: string,
  status: EsignStatus
): Promise<void> => {
  const contractStatus = status === 'fully_signed' ? 'signed' 
    : status === 'void' ? 'cancelled' 
    : status === 'sent' ? 'sent' 
    : 'draft';

  const { error } = await supabase
    .from('contracts')
    .update({ status: contractStatus, updated_at: new Date().toISOString() })
    .eq('id', documentId);

  if (error) throw error;
};

export const getDocumentSigners = async (documentId: string): Promise<EsignSigner[]> => {
  const doc = await getEsignDocumentById(documentId);
  return doc?.signers || [];
};

export const getDocumentEvents = async (documentId: string): Promise<EsignEvent[]> => {
  return [];
};

export const sendSigningReminder = async (documentId: string, signerEmail: string): Promise<void> => {
  await supabase.functions.invoke('send-contract-notification', {
    body: { contractId: documentId, recipientEmail: signerEmail, type: 'reminder' },
  });
};

export const cancelDocument = async (documentId: string): Promise<void> => {
  await updateDocumentStatus(documentId, 'void');
};

export const exportCompletedDocument = async (documentId: string): Promise<string> => {
  const { data } = await supabase.functions.invoke('generate-contract-pdf', {
    body: { contractId: documentId },
  });
  return data?.url || '';
};

export const sendDocumentForSigning = async (documentId: string, signers: any[]): Promise<void> => {
  await supabase
    .from('contracts')
    .update({ status: 'sent', updated_at: new Date().toISOString() })
    .eq('id', documentId);

  for (const signer of signers) {
    const token = await generateSigningToken(documentId, signer.email);
    await supabase.functions.invoke('send-contract-notification', {
      body: { contractId: documentId, recipientEmail: signer.email, token, type: 'signing_invite' },
    });
  }
};

export const signDocument = async (token: string, signatureData: any): Promise<void> => {
  const session = await validateSigningToken(token);
  if (!session || !session.isValid) throw new Error('رمز التوقيع غير صالح أو منتهي الصلاحية');
  await saveSignature(session.document.id, signatureData);
};

export const logEsignEvent = async (eventData: any): Promise<void> => {
  console.log('E-sign event:', eventData);
};

export const voidEsignDocument = async (documentId: string): Promise<void> => {
  await cancelDocument(documentId);
};

export const updateEsignDocument = async (documentId: string, updateData: any): Promise<void> => {
  const { error } = await (supabase as any)
    .from('contracts')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', documentId);
  if (error) throw error;
};

export const createSigningSession = async (documentId: string): Promise<string> => {
  return documentId;
};
