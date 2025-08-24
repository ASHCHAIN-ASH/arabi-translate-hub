import { createClient } from '@supabase/supabase-js';
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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured, using mock data for WhatsApp');
}

// إدارة مزودي واتساب
export const getAllWhatsappProviders = async (): Promise<WhatsappProvider[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_providers')
        .select('*')
        .order('name');

      if (error) throw error;

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        configJson: row.config_json,
        isEnabled: row.is_enabled,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching WhatsApp providers:', error);
      return [];
    }
  }
  return [];
};

export const getActiveWhatsappProvider = async (): Promise<WhatsappProvider | null> => {
  const providers = await getAllWhatsappProviders();
  return providers.find(provider => provider.isEnabled) || null;
};

export const updateWhatsappProvider = async (
  providerId: string, 
  config: Record<string, any>,
  isEnabled: boolean
): Promise<void> => {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('whatsapp_providers')
        .update({
          config_json: config,
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', providerId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating WhatsApp provider:', error);
      throw error;
    }
  }
};

// إدارة قوالب واتساب
export const getAllWhatsappTemplates = async (): Promise<WhatsappTemplate[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .order('template_name');

      if (error) throw error;

      return data.map((row: any) => ({
        id: row.id,
        templateName: row.template_name,
        language: row.language,
        bodyText: row.body_text,
        variables: row.variables,
        isApproved: row.is_approved
      }));
    } catch (error) {
      console.error('Error fetching WhatsApp templates:', error);
      return [];
    }
  }
  return [];
};

export const getWhatsappTemplate = async (templateName: string): Promise<WhatsappTemplate | null> => {
  const templates = await getAllWhatsappTemplates();
  return templates.find(template => template.templateName === templateName) || null;
};

// إرسال رسالة واتساب
export const sendWhatsappMessage = async (message: WhatsappMessage): Promise<WhatsappResponse> => {
  try {
    // الحصول على المزود النشط
    const provider = await getActiveWhatsappProvider();
    if (!provider) {
      throw new Error('No active WhatsApp provider configured');
    }

    // الحصول على القالب
    const template = await getWhatsappTemplate(message.templateName);
    if (!template) {
      throw new Error(`Template ${message.templateName} not found`);
    }

    // تحضير الرسالة
    let messageText = template.bodyText;
    for (const [key, value] of Object.entries(message.variables)) {
      messageText = messageText.replace(`{{${key}}}`, value);
    }

    // محاكاة الإرسال حسب المزود
    let response: WhatsappResponse;
    
    if (provider.name === 'mock') {
      // محاكاة الإرسال
      response = await mockSendMessage(message.to, messageText);
    } else {
      // هنا يمكن إضافة منطق الإرسال الفعلي للمزودين الحقيقيين
      response = await sendViaProvider(provider, message.to, messageText, message.templateName);
    }

    // تسجيل الرسالة
    await logWhatsappMessage({
      toPhone: message.to,
      templateName: message.templateName,
      variablesJson: message.variables,
      status: response.success ? 'sent' : 'failed',
      providerMessageId: response.messageId,
      errorMessage: response.error
    });

    return response;

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    
    // تسجيل الخطأ
    await logWhatsappMessage({
      toPhone: message.to,
      templateName: message.templateName,
      variablesJson: message.variables,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// محاكاة الإرسال
const mockSendMessage = async (to: string, message: string): Promise<WhatsappResponse> => {
  // محاكاة تأخير شبكة
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // محاكاة نجاح/فشل عشوائي (90% نجاح)
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      messageId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };
  } else {
    return {
      success: false,
      error: 'Mock delivery failure'
    };
  }
};

// الإرسال عبر مزود حقيقي
const sendViaProvider = async (
  provider: WhatsappProvider,
  to: string,
  message: string,
  templateName: string
): Promise<WhatsappResponse> => {
  // هنا يمكن إضافة منطق الإرسال الفعلي حسب المزود
  switch (provider.name) {
    case 'twilio':
      return await sendViaTwilio(provider.configJson, to, message);
    case '360dialog':
      return await sendVia360Dialog(provider.configJson, to, message, templateName);
    default:
      throw new Error(`Unsupported provider: ${provider.name}`);
  }
};

// إرسال عبر Twilio (مثال)
const sendViaTwilio = async (
  config: Record<string, any>,
  to: string,
  message: string
): Promise<WhatsappResponse> => {
  // تنفيذ إرسال Twilio
  // const twilioClient = require('twilio')(config.accountSid, config.authToken);
  // const result = await twilioClient.messages.create({...});
  
  return { success: false, error: 'Twilio integration not implemented' };
};

// إرسال عبر 360Dialog (مثال)
const sendVia360Dialog = async (
  config: Record<string, any>,
  to: string,
  message: string,
  templateName: string
): Promise<WhatsappResponse> => {
  // تنفيذ إرسال 360Dialog
  return { success: false, error: '360Dialog integration not implemented' };
};

// تسجيل رسالة واتساب
const logWhatsappMessage = async (logData: Omit<WhatsappLog, 'id' | 'createdAt'>): Promise<void> => {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('whatsapp_logs')
        .insert([{
          to_phone: logData.toPhone,
          template_name: logData.templateName,
          variables_json: logData.variablesJson,
          status: logData.status,
          provider_message_id: logData.providerMessageId,
          error_message: logData.errorMessage
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging WhatsApp message:', error);
    }
  }
};

// الحصول على سجل الرسائل
export const getWhatsappLogs = async (
  limit: number = 50,
  offset: number = 0
): Promise<WhatsappLog[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return data.map((row: any) => ({
        id: row.id,
        toPhone: row.to_phone,
        templateName: row.template_name,
        variablesJson: row.variables_json,
        status: row.status,
        providerMessageId: row.provider_message_id,
        errorMessage: row.error_message,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Error fetching WhatsApp logs:', error);
      return [];
    }
  }
  return [];
};

// إدارة تفضيلات الإشعارات
export const getNotificationPreferences = async (customerId: string): Promise<NotificationPreference | null> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (error) {
        // إذا لم توجد تفضيلات، إنشاء تفضيلات افتراضية
        if (error.code === 'PGRST116') {
          return await createDefaultNotificationPreferences(customerId);
        }
        throw error;
      }

      return {
        id: data.id,
        customerId: data.customer_id,
        allowWhatsapp: data.allow_whatsapp,
        allowEmail: data.allow_email,
        preferredLanguage: data.preferred_language,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }
  }
  return null;
};

const createDefaultNotificationPreferences = async (customerId: string): Promise<NotificationPreference> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert([{
          customer_id: customerId,
          allow_whatsapp: true,
          allow_email: true,
          preferred_language: 'ar'
        }])
        .select('*')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        customerId: data.customer_id,
        allowWhatsapp: data.allow_whatsapp,
        allowEmail: data.allow_email,
        preferredLanguage: data.preferred_language,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error creating default notification preferences:', error);
      throw error;
    }
  }
  throw new Error('Supabase not configured');
};

// رسائل أتمتة محددة
export const sendInvoiceNotification = async (
  customerId: string,
  customerPhone: string,
  invoiceData: {
    invoiceNumber: string;
    customerName: string;
    grandTotal: string;
    dueDate: string;
    paymentLink: string;
  }
): Promise<WhatsappResponse> => {
  const preferences = await getNotificationPreferences(customerId);
  
  if (!preferences || !preferences.allowWhatsapp) {
    return { success: false, error: 'WhatsApp notifications disabled for this customer' };
  }

  return await sendWhatsappMessage({
    to: customerPhone,
    templateName: WHATSAPP_TEMPLATES.INVOICE_NEW,
    variables: invoiceData
  });
};

export const sendSigningInvitation = async (
  customerId: string,
  customerPhone: string,
  signingData: {
    customer_name: string;
    contract_title: string;
    sign_link: string;
    otp?: string;
  }
): Promise<WhatsappResponse> => {
  const preferences = await getNotificationPreferences(customerId);
  
  if (!preferences || !preferences.allowWhatsapp) {
    return { success: false, error: 'WhatsApp notifications disabled for this customer' };
  }

  return await sendWhatsappMessage({
    to: customerPhone,
    templateName: WHATSAPP_TEMPLATES.ESIGN_INVITE,
    variables: signingData
  });
};

// اختبار إرسال رسالة
export const testWhatsappMessage = async (
  phoneNumber: string,
  templateName: string,
  variables: Record<string, string>
): Promise<WhatsappResponse> => {
  return await sendWhatsappMessage({
    to: phoneNumber,
    templateName,
    variables
  });
};