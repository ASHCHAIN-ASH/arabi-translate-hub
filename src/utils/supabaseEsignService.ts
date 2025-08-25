import { 
  EsignDocument, 
  EsignSigner, 
  EsignEvent, 
  EsignToken,
  EsignStatus,
  SigningSession,
  SignatureData,
  SignerRole,
  EsignEventType
} from '@/types/esign';

// Mock data - E-signature tables not configured yet
console.warn('Supabase e-signature tables not configured, using mock data for e-signature');

// إنشاء مستند للتوقيع الإلكتروني
export const createEsignDocument = async (
  contractId: string,
  docTitle: string,
  signers: Array<{
    role: SignerRole;
    name: string;
    email: string;
    phone?: string;
  }>
): Promise<string> => {
  // Mock implementation - return a fake document ID
  const docId = 'esign-doc-' + Date.now();
  console.log(`Mock e-signature document created: ${docId} for contract ${contractId}`);
  return docId;
};

// إنشاء رابط التوقيع
export const generateSigningToken = async (
  documentId: string,
  signerEmail: string,
  expiryHours: number = 72
): Promise<string> => {
  // Mock implementation - return a fake token
  const token = 'mock-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  console.log(`Mock signing token generated: ${token} for document ${documentId}`);
  return token;
};

// التحقق من صحة الرمز المميز
export const validateSigningToken = async (token: string): Promise<SigningSession | null> => {
  // Mock implementation - return a fake session
  const mockSession: SigningSession = {
    id: 'session-' + Date.now(),
    documentId: 'doc-123',
    signerEmail: 'test@example.com',
    signerName: 'المستخدم التجريبي',
    signerRole: 'client',
    token: token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isValid: true,
    createdAt: new Date().toISOString()
  };
  
  return mockSession;
};

// حفظ التوقيع
export const saveSignature = async (
  sessionId: string,
  signatureData: SignatureData
): Promise<void> => {
  // Mock implementation - log the signature
  console.log(`Mock signature saved for session ${sessionId}:`, signatureData);
};

// الحصول على جميع مستندات التوقيع الإلكتروني
export const getAllEsignDocuments = async (): Promise<EsignDocument[]> => {
  // Mock implementation - return empty array
  return [];
};

// الحصول على مستند محدد
export const getEsignDocumentById = async (id: string): Promise<EsignDocument | null> => {
  // Mock implementation - return null
  return null;
};

// تحديث حالة المستند
export const updateDocumentStatus = async (
  documentId: string,
  status: EsignStatus
): Promise<void> => {
  // Mock implementation - log the update
  console.log(`Mock document ${documentId} status updated to ${status}`);
};

// الحصول على الموقعين
export const getDocumentSigners = async (documentId: string): Promise<EsignSigner[]> => {
  // Mock implementation - return empty array
  return [];
};

// الحصول على أحداث المستند
export const getDocumentEvents = async (documentId: string): Promise<EsignEvent[]> => {
  // Mock implementation - return empty array
  return [];
};

// إرسال تذكير
export const sendSigningReminder = async (
  documentId: string,
  signerEmail: string
): Promise<void> => {
  // Mock implementation - log the reminder
  console.log(`Mock signing reminder sent to ${signerEmail} for document ${documentId}`);
};

// إلغاء المستند
export const cancelDocument = async (documentId: string): Promise<void> => {
  // Mock implementation - log the cancellation
  console.log(`Mock document ${documentId} cancelled`);
};

// تصدير المستند النهائي
export const exportCompletedDocument = async (documentId: string): Promise<string> => {
  // Mock implementation - return a fake URL
  const mockUrl = `https://mock-storage.com/documents/${documentId}-signed.pdf`;
  console.log(`Mock document exported: ${mockUrl}`);
  return mockUrl;
};

// Mock functions for missing exports
export const sendDocumentForSigning = async (documentId: string, signers: any[]): Promise<void> => {
  console.log(`Mock document ${documentId} sent for signing to:`, signers);
};

export const signDocument = async (token: string, signatureData: any): Promise<void> => {
  console.log(`Mock document signed with token ${token}:`, signatureData);
};

export const logEsignEvent = async (eventData: any): Promise<void> => {
  console.log('Mock e-sign event logged:', eventData);
};

export const voidEsignDocument = async (documentId: string): Promise<void> => {
  console.log(`Mock document ${documentId} voided`);
};