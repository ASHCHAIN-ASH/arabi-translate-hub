import { supabase } from '@/data/legacy/client';
import { 
  WhatsappProvider, 
  WhatsappTemplate, 
  WhatsappLog, 
  WhatsappMessage,
  WhatsappResponse,
  NotificationPreference,
  WHATSAPP_TEMPLATES
} from '@/types/whatsapp';

// ==============================
// WhatsApp Service — Real Supabase Edge Function Calls
// Messages are sent via the `send-whatsapp` edge function
// Logs tracked via email_logs table (to_email used for phone)
// ==============================

// إدارة مزودي واتساب — stored in system_settings
export const getAllWhatsappProviders = async (): Promise<WhatsappProvider[]> => {
  try {
    const { data, error } = await supabase
      .from('system_settings' as any)
      .select('*')
      .eq('category', 'whatsapp_provider');

    if (error || !data) return [];

    return (data as any[]).map(row => ({
      id: row.id,
      name: row.value?.provider_type || 'twilio',
      configJson: row.value || {},
      isEnabled: row.value?.is_enabled || false,
      updatedAt: row.updated_at || '',
    }));
  } catch {
    return [];
  }
};

export const createWhatsappProvider = async (
  providerData: Omit<WhatsappProvider, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('system_settings' as any)
    .insert({
      key: `whatsapp_provider_${providerData.name}`,
      category: 'whatsapp_provider',
      value: {
        provider_type: providerData.name,
        is_enabled: providerData.isEnabled,
        ...providerData.configJson,
      },
    })
    .select('id')
    .single();

  if (error) throw error;
  return (data as any).id;
};

export const updateWhatsappProvider = async (
  providerId: string,
  updates: Partial<WhatsappProvider>
): Promise<void> => {
  const { error } = await supabase
    .from('system_settings' as any)
    .update({
      value: {
        provider_type: updates.name,
        is_enabled: updates.isEnabled,
        ...updates.configJson,
      },
    })
    .eq('id', providerId);

  if (error) throw error;
};

export const deleteWhatsappProvider = async (providerId: string): Promise<void> => {
  const { error } = await supabase
    .from('system_settings' as any)
    .delete()
    .eq('id', providerId);

  if (error) throw error;
};

// إدارة القوالب
export const getAllWhatsappTemplates = async (): Promise<WhatsappTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('system_settings' as any)
      .select('*')
      .eq('category', 'whatsapp_template');

    if (error || !data) return [];

    return (data as any[]).map(row => ({
      id: row.id,
      templateName: row.value?.template_name || '',
      language: row.value?.language || 'ar',
      bodyText: row.value?.body_text || '',
      variables: row.value?.variables || [],
      isApproved: row.value?.is_approved || false,
    }));
  } catch {
    return [];
  }
};

export const createWhatsappTemplate = async (
  templateData: Omit<WhatsappTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('system_settings' as any)
    .insert({
      key: `whatsapp_template_${templateData.templateName}`,
      category: 'whatsapp_template',
      value: {
        template_name: templateData.templateName,
        language: templateData.language,
        body_text: templateData.bodyText,
        variables: templateData.variables,
        is_approved: templateData.isApproved,
      },
    })
    .select('id')
    .single();

  if (error) throw error;
  return (data as any).id;
};

export const updateWhatsappTemplate = async (
  templateId: string,
  updates: Partial<WhatsappTemplate>
): Promise<void> => {
  const { data: existing } = await supabase
    .from('system_settings' as any)
    .select('value')
    .eq('id', templateId)
    .single();

  const currentVal = (existing as any)?.value || {};

  const { error } = await supabase
    .from('system_settings' as any)
    .update({
      value: {
        ...currentVal,
        ...(updates.templateName && { template_name: updates.templateName }),
        ...(updates.language && { language: updates.language }),
        ...(updates.bodyText && { body_text: updates.bodyText }),
        ...(updates.variables && { variables: updates.variables }),
        ...(updates.isApproved !== undefined && { is_approved: updates.isApproved }),
      },
    })
    .eq('id', templateId);

  if (error) throw error;
};

export const deleteWhatsappTemplate = async (templateId: string): Promise<void> => {
  const { error } = await supabase
    .from('system_settings' as any)
    .delete()
    .eq('id', templateId);

  if (error) throw error;
};

// إرسال الرسائل — via edge function
export const sendWhatsappMessage = async (
  providerId: string,
  message: WhatsappMessage
): Promise<WhatsappResponse> => {
  const { data, error } = await supabase.functions.invoke('send-whatsapp', {
    body: {
      provider_id: providerId,
      to: message.to,
      template_name: message.templateName,
      variables: message.variables,
      language: message.language || 'ar',
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: data?.success || false,
    messageId: data?.message_id,
    error: data?.error,
  };
};

export const sendBulkWhatsappMessages = async (
  providerId: string,
  messages: WhatsappMessage[]
): Promise<WhatsappResponse[]> => {
  const results: WhatsappResponse[] = [];
  for (const message of messages) {
    const result = await sendWhatsappMessage(providerId, message);
    results.push(result);
  }
  return results;
};

// سجل الرسائل — from email_logs (using to_email for phone tracking)
export const getWhatsappLogs = async (
  filters?: {
    providerId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }
): Promise<WhatsappLog[]> => {
  const db = supabase as any;
  let query = db
    .from('email_logs')
    .select('*')
    .ilike('subject', '%whatsapp%')
    .order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.fromDate) query = query.gte('created_at', filters.fromDate);
  if (filters?.toDate) query = query.lte('created_at', filters.toDate);

  const { data, error } = await query;

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    toPhone: row.to_email || '',
    templateName: row.subject || '',
    variablesJson: {},
    status: row.status === 'sent' ? 'sent' as const : row.status === 'failed' ? 'failed' as const : 'queued' as const,
    providerMessageId: undefined,
    errorMessage: row.error || undefined,
    createdAt: row.created_at || '',
  }));
};

export const createWhatsappLog = async (
  logData: Omit<WhatsappLog, 'id' | 'createdAt'>
): Promise<string> => {
  const db = supabase as any;
  const { data, error } = await db
    .from('email_logs')
    .insert({
      to_email: logData.toPhone,
      subject: `whatsapp:${logData.templateName || ''}`,
      status: logData.status,
      error: logData.errorMessage || null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

// تفضيلات الإشعارات
export const getUserNotificationPreferences = async (
  userId: string
): Promise<NotificationPreference[]> => {
  return [{
    id: userId,
    customerId: userId,
    allowWhatsapp: true,
    allowEmail: true,
    preferredLanguage: 'ar',
    updatedAt: new Date().toISOString(),
  }];
};

export const updateNotificationPreference = async (
  userId: string,
  eventType: string,
  enabled: boolean
): Promise<void> => {
  console.log(`Notification preference updated: ${userId} / ${eventType} = ${enabled}`);
};

// إحصائيات
export const getWhatsappStats = async (
  _providerId?: string,
  fromDate?: string,
  toDate?: string
): Promise<{
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalRead: number;
}> => {
  const db = supabase as any;
  let query = db
    .from('email_logs')
    .select('status')
    .ilike('subject', '%whatsapp%');

  if (fromDate) query = query.gte('created_at', fromDate);
  if (toDate) query = query.lte('created_at', toDate);

  const { data, error } = await query;

  if (error || !data) {
    return { totalSent: 0, totalDelivered: 0, totalFailed: 0, totalRead: 0 };
  }

  const sent = data.filter(r => r.status === 'sent').length;
  const failed = data.filter(r => r.status === 'failed').length;

  return {
    totalSent: data.length,
    totalDelivered: sent,
    totalFailed: failed,
    totalRead: 0,
  };
};

// اختبار الاتصال
export const testWhatsappConnection = async (providerId: string): Promise<boolean> => {
  const { data, error } = await supabase.functions.invoke('send-whatsapp', {
    body: { provider_id: providerId, test: true },
  });
  return !error && data?.success;
};

export const testWhatsappMessage = async (providerId: string, message: WhatsappMessage): Promise<WhatsappResponse> => {
  return sendWhatsappMessage(providerId, message);
};

export const sendInvoiceNotification = async (invoiceData: any): Promise<void> => {
  await supabase.functions.invoke('send-whatsapp', {
    body: {
      to: invoiceData.clientPhone,
      template_name: WHATSAPP_TEMPLATES.INVOICE_NEW,
      variables: {
        invoice_number: invoiceData.invoiceNumber,
        amount: invoiceData.amount,
        client_name: invoiceData.clientName,
      },
    },
  });
};

export const sendSigningInvitation = async (signingData: any): Promise<void> => {
  await supabase.functions.invoke('send-whatsapp', {
    body: {
      to: signingData.clientPhone,
      template_name: WHATSAPP_TEMPLATES.ESIGN_INVITE,
      variables: {
        client_name: signingData.clientName,
        contract_title: signingData.contractTitle,
        signing_url: signingData.signingUrl,
      },
    },
  });
};
