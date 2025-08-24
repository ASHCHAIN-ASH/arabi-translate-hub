// أنواع البيانات لواتساب
export interface WhatsappProvider {
  id: string;
  name: WhatsappProviderType;
  configJson: Record<string, any>;
  isEnabled: boolean;
  updatedAt: string;
}

export type WhatsappProviderType = 'twilio' | '360dialog' | 'mock';

export interface WhatsappTemplate {
  id: string;
  templateName: string;
  language: string;
  bodyText: string;
  variables: string[];
  isApproved: boolean;
}

export interface WhatsappLog {
  id: string;
  toPhone: string;
  templateName?: string;
  variablesJson: Record<string, any>;
  status: WhatsappStatus;
  providerMessageId?: string;
  errorMessage?: string;
  createdAt: string;
}

export type WhatsappStatus = 'queued' | 'sent' | 'failed';

export interface NotificationPreference {
  id: string;
  customerId: string;
  allowWhatsapp: boolean;
  allowEmail: boolean;
  preferredLanguage: string;
  updatedAt: string;
}

export interface WhatsappMessage {
  to: string;
  templateName: string;
  variables: Record<string, string>;
  language?: string;
}

export interface WhatsappResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// قوالب الرسائل المحددة مسبقاً
export const WHATSAPP_TEMPLATES = {
  INVOICE_NEW: 'invoice_new',
  INVOICE_REMINDER: 'invoice_reminder', 
  TICKET_UPDATE: 'ticket_update',
  ESIGN_INVITE: 'esign_invite'
} as const;

export type WhatsappTemplateType = typeof WHATSAPP_TEMPLATES[keyof typeof WHATSAPP_TEMPLATES];