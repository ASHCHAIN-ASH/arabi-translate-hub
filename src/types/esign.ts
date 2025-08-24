// أنواع البيانات للتوقيع الإلكتروني
export interface EsignDocument {
  id: string;
  contractId: string;
  docTitle: string;
  docPdfUrl?: string;
  status: EsignStatus;
  hashChecksum?: string;
  createdAt: string;
  updatedAt: string;
  signers: EsignSigner[];
  events: EsignEvent[];
}

export type EsignStatus = 
  | 'draft'
  | 'sent' 
  | 'viewed'
  | 'partially_signed'
  | 'fully_signed'
  | 'void';

export interface EsignSigner {
  id: string;
  esignDocumentId: string;
  role: SignerRole;
  signerName: string;
  signerEmail: string;
  signerPhone?: string;
  signingOrder: number;
  signedAt?: string;
  signatureIp?: string;
  signatureAuditJson: Record<string, any>;
}

export type SignerRole = 'customer' | 'company';

export interface EsignEvent {
  id: string;
  esignDocumentId: string;
  eventType: EsignEventType;
  actor?: string;
  metaJson: Record<string, any>;
  createdAt: string;
}

export type EsignEventType = 
  | 'sent'
  | 'viewed'
  | 'signed'
  | 'declined'
  | 'voided';

export interface EsignToken {
  id: string;
  signerId: string;
  token: string;
  expiresAt: string;
  usedAt?: string;
}

export interface SigningSession {
  token: string;
  document: EsignDocument;
  signer: EsignSigner;
  isValid: boolean;
  expiresAt: string;
}

export interface SignatureData {
  signatureImage: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  otpVerified?: boolean;
}