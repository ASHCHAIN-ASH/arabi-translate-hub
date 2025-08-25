import { 
  WhatsappProvider, 
  WhatsappTemplate, 
  WhatsappLog, 
  WhatsappMessage,
  WhatsappResponse,
  NotificationPreference,
  WhatsappTemplateType,
  WHATSAPP_TEMPLATES
} from '@/types/whatsapp';

// Mock data - WhatsApp tables not configured yet
console.warn('Supabase WhatsApp tables not configured, using mock data for WhatsApp');

// إدارة مزودي واتساب
export const getAllWhatsappProviders = async (): Promise<WhatsappProvider[]> => {
  // Mock implementation - return empty array
  return [];
};

export const createWhatsappProvider = async (
  providerData: Omit<WhatsappProvider, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  // Mock implementation - return a fake ID
  const providerId = 'provider-' + Date.now();
  console.log('Mock WhatsApp provider created:', providerId);
  return providerId;
};

export const updateWhatsappProvider = async (
  providerId: string,
  updates: Partial<WhatsappProvider>
): Promise<void> => {
  // Mock implementation - log the update
  console.log(`Mock WhatsApp provider ${providerId} updated:`, updates);
};

export const deleteWhatsappProvider = async (providerId: string): Promise<void> => {
  // Mock implementation - log the deletion
  console.log(`Mock WhatsApp provider ${providerId} deleted`);
};

// إدارة القوالب
export const getAllWhatsappTemplates = async (): Promise<WhatsappTemplate[]> => {
  // Mock implementation - return empty array
  return [];
};

export const createWhatsappTemplate = async (
  templateData: Omit<WhatsappTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  // Mock implementation - return a fake ID
  const templateId = 'template-' + Date.now();
  console.log('Mock WhatsApp template created:', templateId);
  return templateId;
};

export const updateWhatsappTemplate = async (
  templateId: string,
  updates: Partial<WhatsappTemplate>
): Promise<void> => {
  // Mock implementation - log the update
  console.log(`Mock WhatsApp template ${templateId} updated:`, updates);
};

export const deleteWhatsappTemplate = async (templateId: string): Promise<void> => {
  // Mock implementation - log the deletion
  console.log(`Mock WhatsApp template ${templateId} deleted`);
};

// إرسال الرسائل
export const sendWhatsappMessage = async (
  providerId: string,
  message: WhatsappMessage
): Promise<WhatsappResponse> => {
  // Mock implementation - return a fake response
  const mockResponse: WhatsappResponse = {
    success: true,
    messageId: 'msg-' + Date.now()
  };
  
  console.log(`Mock WhatsApp message sent via provider ${providerId}:`, message);
  return mockResponse;
};

export const sendBulkWhatsappMessages = async (
  providerId: string,
  messages: WhatsappMessage[]
): Promise<WhatsappResponse[]> => {
  // Mock implementation - return fake responses
  const responses: WhatsappResponse[] = messages.map((_, index) => ({
    success: true,
    messageId: 'bulk-msg-' + Date.now() + '-' + index
  }));
  
  console.log(`Mock bulk WhatsApp messages sent via provider ${providerId}:`, messages.length, 'messages');
  return responses;
};

// سجل الرسائل
export const getWhatsappLogs = async (
  filters?: {
    providerId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }
): Promise<WhatsappLog[]> => {
  // Mock implementation - return empty array
  return [];
};

export const createWhatsappLog = async (
  logData: Omit<WhatsappLog, 'id' | 'createdAt'>
): Promise<string> => {
  // Mock implementation - return a fake ID
  const logId = 'log-' + Date.now();
  console.log('Mock WhatsApp log created:', logId);
  return logId;
};

// تفضيلات الإشعارات
export const getUserNotificationPreferences = async (
  userId: string
): Promise<NotificationPreference[]> => {
  // Mock implementation - return empty array
  return [];
};

export const updateNotificationPreference = async (
  userId: string,
  eventType: string,
  enabled: boolean
): Promise<void> => {
  // Mock implementation - log the update
  console.log(`Mock notification preference updated for user ${userId}: ${eventType} = ${enabled}`);
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
  // Mock implementation - return fake stats
  return {
    totalSent: 150,
    totalDelivered: 142,
    totalFailed: 8,
    totalRead: 128
  };
};

// اختبار الاتصال
export const testWhatsappConnection = async (providerId: string): Promise<boolean> => {
  // Mock implementation - return true
  console.log(`Mock WhatsApp connection test for provider ${providerId}: success`);
  return true;
};

// Mock functions for missing exports
export const testWhatsappMessage = async (providerId: string, message: WhatsappMessage): Promise<WhatsappResponse> => {
  return sendWhatsappMessage(providerId, message);
};

export const sendInvoiceNotification = async (invoiceData: any): Promise<void> => {
  console.log('Mock invoice notification sent:', invoiceData);
};

export const sendSigningInvitation = async (signingData: any): Promise<void> => {
  console.log('Mock signing invitation sent:', signingData);
};