import { createClient } from '@supabase/supabase-js';
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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured, using mock data for e-signature');
}

// إنشاء مستند للتوقيع الإلكتروني
export const createEsignDocument = async (
  contractId: string,
  docTitle: string,
  signers: Array<{
    role: SignerRole;
    name: string;
    email: string;
    phone?: string;
    order: number;
  }>
): Promise<string> => {
  if (supabase) {
    try {
      // إنشاء المستند
      const { data: docData, error: docError } = await supabase
        .from('esign_documents')
        .insert([{
          contract_id: contractId,
          doc_title: docTitle,
          status: 'draft'
        }])
        .select('id')
        .single();

      if (docError) throw docError;

      // إضافة الموقعين
      const signersData = signers.map(signer => ({
        esign_document_id: docData.id,
        role: signer.role,
        signer_name: signer.name,
        signer_email: signer.email,
        signer_phone: signer.phone,
        signing_order: signer.order
      }));

      const { error: signersError } = await supabase
        .from('esign_signers')
        .insert(signersData);

      if (signersError) throw signersError;

      return docData.id;
    } catch (error) {
      console.error('Error creating esign document:', error);
      throw error;
    }
  }
  throw new Error('Supabase not configured');
};

// إرسال مستند للتوقيع
export const sendDocumentForSigning = async (documentId: string): Promise<void> => {
  if (supabase) {
    try {
      // الحصول على المستند والموقعين
      const { data: docData, error: docError } = await supabase
        .from('esign_documents')
        .select(`
          *,
          esign_signers (*)
        `)
        .eq('id', documentId)
        .single();

      if (docError) throw docError;

      // إنشاء رموز توقيع للموقعين
      const tokens = [];
      for (const signer of docData.esign_signers) {
        const token = generateSigningToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // صالح لمدة أسبوع

        const { error: tokenError } = await supabase
          .from('esign_tokens')
          .insert([{
            signer_id: signer.id,
            token,
            expires_at: expiresAt.toISOString()
          }]);

        if (tokenError) throw tokenError;
        tokens.push({ signerEmail: signer.signer_email, token });
      }

      // تحديث حالة المستند
      const { error: updateError } = await supabase
        .from('esign_documents')
        .update({ status: 'sent', updated_at: new Date().toISOString() })
        .eq('id', documentId);

      if (updateError) throw updateError;

      // تسجيل حدث الإرسال
      await logEsignEvent(documentId, 'sent', 'system', {
        sentAt: new Date().toISOString(),
        tokensGenerated: tokens.length
      });

      // هنا يمكن إرسال إشعارات بالبريد الإلكتروني وواتساب
      // sendSigningInvitations(tokens);

    } catch (error) {
      console.error('Error sending document for signing:', error);
      throw error;
    }
  }
};

// التحقق من صحة رمز التوقيع
export const validateSigningToken = async (token: string): Promise<SigningSession | null> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('esign_tokens')
        .select(`
          *,
          esign_signers (
            *,
            esign_documents (
              *,
              esign_signers (*)
            )
          )
        `)
        .eq('token', token)
        .is('used_at', null)
        .single();

      if (error || !data) return null;

      const now = new Date();
      const expiresAt = new Date(data.expires_at);

      if (now > expiresAt) return null;

      return {
        token: data.token,
        document: transformEsignDocument(data.esign_signers.esign_documents),
        signer: transformEsignSigner(data.esign_signers),
        isValid: true,
        expiresAt: data.expires_at
      };
    } catch (error) {
      console.error('Error validating signing token:', error);
      return null;
    }
  }
  return null;
};

// توقيع المستند
export const signDocument = async (
  token: string,
  signatureData: SignatureData
): Promise<void> => {
  if (supabase) {
    try {
      // الحصول على معلومات التوقيع
      const session = await validateSigningToken(token);
      if (!session) throw new Error('Invalid or expired signing token');

      // تحديث بيانات الموقع
      const { error: signerError } = await supabase
        .from('esign_signers')
        .update({
          signed_at: signatureData.timestamp,
          signature_ip: signatureData.ipAddress,
          signature_audit_json: {
            signatureImage: signatureData.signatureImage,
            userAgent: signatureData.userAgent,
            otpVerified: signatureData.otpVerified || false,
            signedAt: signatureData.timestamp
          }
        })
        .eq('id', session.signer.id);

      if (signerError) throw signerError;

      // تمييز الرمز كمستخدم
      const { error: tokenError } = await supabase
        .from('esign_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('token', token);

      if (tokenError) throw tokenError;

      // تسجيل حدث التوقيع
      await logEsignEvent(session.document.id, 'signed', session.signer.signerName, {
        signedAt: signatureData.timestamp,
        ipAddress: signatureData.ipAddress,
        otpVerified: signatureData.otpVerified
      });

      // التحقق من اكتمال جميع التوقيعات
      await checkAndUpdateDocumentStatus(session.document.id);

    } catch (error) {
      console.error('Error signing document:', error);
      throw error;
    }
  }
};

// التحقق من حالة المستند وتحديثها
const checkAndUpdateDocumentStatus = async (documentId: string): Promise<void> => {
  if (supabase) {
    try {
      const { data: signers, error } = await supabase
        .from('esign_signers')
        .select('*')
        .eq('esign_document_id', documentId)
        .order('signing_order');

      if (error) throw error;

      const totalSigners = signers.length;
      const signedCount = signers.filter(s => s.signed_at).length;

      let newStatus: EsignStatus;
      if (signedCount === 0) {
        newStatus = 'sent';
      } else if (signedCount === totalSigners) {
        newStatus = 'fully_signed';
      } else {
        newStatus = 'partially_signed';
      }

      const { error: updateError } = await supabase
        .from('esign_documents')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      // إذا اكتمل التوقيع، قم بإنشاء PDF مختوم
      if (newStatus === 'fully_signed') {
        await generateSignedPDF(documentId);
      }

    } catch (error) {
      console.error('Error checking document status:', error);
    }
  }
};

// إنشاء PDF مختوم
const generateSignedPDF = async (documentId: string): Promise<void> => {
  // هنا يمكن تنفيذ منطق إنشاء PDF مختوم بالتوقيعات
  // والطوابع الزمنية ومعلومات التدقيق
  console.log('Generating signed PDF for document:', documentId);
};

// تسجيل أحداث التوقيع الإلكتروني
export const logEsignEvent = async (
  documentId: string,
  eventType: EsignEventType,
  actor: string,
  meta: Record<string, any> = {}
): Promise<void> => {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('esign_events')
        .insert([{
          esign_document_id: documentId,
          event_type: eventType,
          actor,
          meta_json: meta
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging esign event:', error);
    }
  }
};

// الحصول على جميع مستندات التوقيع
export const getAllEsignDocuments = async (): Promise<EsignDocument[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('esign_documents')
        .select(`
          *,
          esign_signers (*),
          esign_events (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(transformEsignDocument);
    } catch (error) {
      console.error('Error fetching esign documents:', error);
      return [];
    }
  }
  return [];
};

// الحصول على مستند توقيع بالمعرف
export const getEsignDocumentById = async (documentId: string): Promise<EsignDocument | null> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('esign_documents')
        .select(`
          *,
          esign_signers (*),
          esign_events (*)
        `)
        .eq('id', documentId)
        .single();

      if (error) throw error;

      return transformEsignDocument(data);
    } catch (error) {
      console.error('Error fetching esign document:', error);
      return null;
    }
  }
  return null;
};

// إبطال مستند التوقيع
export const voidEsignDocument = async (documentId: string, reason: string): Promise<void> => {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('esign_documents')
        .update({ 
          status: 'void',
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;

      await logEsignEvent(documentId, 'voided', 'admin', { reason });
    } catch (error) {
      console.error('Error voiding document:', error);
      throw error;
    }
  }
};

// دوال مساعدة
const generateSigningToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
};

const transformEsignDocument = (data: any): EsignDocument => ({
  id: data.id,
  contractId: data.contract_id,
  docTitle: data.doc_title,
  docPdfUrl: data.doc_pdf_url,
  status: data.status,
  hashChecksum: data.hash_checksum,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  signers: (data.esign_signers || []).map(transformEsignSigner),
  events: (data.esign_events || []).map((event: any) => ({
    id: event.id,
    esignDocumentId: event.esign_document_id,
    eventType: event.event_type,
    actor: event.actor,
    metaJson: event.meta_json,
    createdAt: event.created_at
  }))
});

const transformEsignSigner = (data: any): EsignSigner => ({
  id: data.id,
  esignDocumentId: data.esign_document_id,
  role: data.role,
  signerName: data.signer_name,
  signerEmail: data.signer_email,
  signerPhone: data.signer_phone,
  signingOrder: data.signing_order,
  signedAt: data.signed_at,
  signatureIp: data.signature_ip,
  signatureAuditJson: data.signature_audit_json || {}
});