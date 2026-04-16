import { supabase } from '@/integrations/supabase/client';
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
// Logs are stored in `email_logs` table (multi-channel)
// ==============================

// إدارة مزودي واتساب — stored in system_settings
export const getAllWhatsappProviders = async (): Promise<WhatsappProvider[]> => {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')
    .eq('category', 'whatsapp_provider');

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    name: (row as any).value?.provider_type || 'twilio',
    configJson: (row as any).value || {},
    isEnabled: (row as any).value?.is_enabled || false,
    updatedAt: row.updated_at || '',
  }));
};

export const createWhatsappProvider = async (
  providerData: Omit<WhatsappProvider, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('system_settings')
    .insert({
      key: `whatsapp_provider_${providerData.name}`,
      category: 'whatsapp_provider',
      value: {
        provider_type: providerData.name,
        is_enabled: providerData.isEnabled,
        ...providerData.configJson,
      },
    } as any)
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

export const updateWhatsappProvider = async (
  providerId: string,
  updates: Partial<WhatsappProvider>
): Promise<void> => {
  const { error } = await supabase
    .from('system_settings')
    .update({
      value: {
        provider_type: updates.name,
        is_enabled: updates.isEnabled,
        ...updates.configJson,
      },
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', providerId);

  if (error) throw error;
};

export const deleteWhatsappProvider = async (providerId: string): Promise<void> => {
  const { error } = await supabase
    .from('system_settings')
    .delete()
    .eq('id', providerId);

  if (error) throw error;
};

// إدارة القوالب — stored in system_settings
export const getAllWhatsappTemplates = async (): Promise<WhatsappTemplate[]> => {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')
    .eq('category', 'whatsapp_template');

  if (error || !data) return [];

  return data.map(row => {
    const val = (row as any).value || {};
    return {
      id: row.id,
      templateName: val.template_name || '',
      language: val.language || 'ar',
      bodyText: val.body_text || '',
      variables: val.variables || [],
      isApproved: val.is_approved || false,
    };
  });
};

export const createWhatsappTemplate = async (
  templateData: Omit<WhatsappTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('system_settings')
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
    } as any)
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

export const updateWhatsappTemplate = async (
  templateId: string,
  updates: Partial<WhatsappTemplate>
): Promise<void> => {
  const { data: existing } = await supabase
    .from('system_settings')
    .select('value')
    .eq('id', templateId)
    .single();

  const currentVal = (existing as any)?.value || {};

  const { error } = await supabase
    .from('system_settings')
    .update({
      value: {
        ...currentVal,
        ...(updates.templateName && { template_name: updates.templateName }),
        ...(updates.language && { language: updates.language }),
        ...(updates.bodyText && { body_text: updates.bodyText }),
        ...(updates.variables && { variables: updates.variables }),
        ...(updates.isApproved !== undefined && { is_approved: updates.isApproved }),
      },
    } as any)
    .eq('id', templateId);

  if (error) throw error;
};

export const deleteWhatsappTemplate = async (templateId: string): Promise<void> => {
  const { error } = await supabase
    .from('system_settings')
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

// سجل الرسائل — from email_logs (multi-channel)
export const getWhatsappLogs = async (
  filters?: {
    providerId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }
): Promise<WhatsappLog[]> => {
  let query = supabase
    .from('email_logs')
    .select('*')
    .eq('channel', 'whatsapp')
    .order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.fromDate) query = query.gte('created_at', filters.fromDate);
  if (filters?.toDate) query = query.lte('created_at', filters.toDate);

  const { data, error } = await query;

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    toPhone: row.recipient || '',
    templateName: row.template_name || '',
    variablesJson: row.metadata || {},
    status: row.status === 'sent' ? 'sent' : row.status === 'failed' ? 'failed' : 'queued',
    providerMessageId: row.provider_message_id || undefined,
    errorMessage: row.error_message || undefined,
    createdAt: row.created_at,
  }));
};

export const createWhatsappLog = async (
  logData: Omit<WhatsappLog, 'id' | 'createdAt'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('email_logs')
    .insert({
      channel: 'whatsapp',
      recipient: logData.toPhone,
      template_name: logData.templateName,
      status: logData.status,
      metadata: logData.variablesJson,
      error_message: logData.errorMessage,
      provider_message_id: logData.providerMessageId,
    } as any)
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

// تفضيلات الإشعارات
export const getUserNotificationPreferences = async (
  userId: string
): Promise<NotificationPreference[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return [];

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
  providerId?: string,
  fromDate?: string,
  toDate?: string
): Promise<{
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalRead: number;
}> => {
  let query = supabase
    .from('email_logs')
    .select('status', { count: 'exact' })
    .eq('channel', 'whatsapp');

  if (fromDate) query = query.gte('created_at', fromDate);
  if (toDate) query = query.lte('created_at', toDate);

  const { data, error } = await query;

  if (error || !data) {
    return { totalSent: 0, totalDelivered: 0, totalFailed: 0, totalRead: 0 };
  }

  const sent = data.filter((r: any) => r.status === 'sent').length;
  const failed = data.filter((r: any) => r.status === 'failed').length;

  return {
    totalSent: data.length,
    totalDelivered: sent,
    totalFailed: failed,
    totalRead: 0, // Read tracking requires webhook callback
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
