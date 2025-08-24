// خدمة الأتمتة لربط الأحداث بإرسال الإشعارات
import { 
  sendInvoiceNotification,
  sendSigningInvitation 
} from '@/utils/supabaseWhatsappService';
import { 
  createInvoiceJournalEntry,
  createPaymentJournalEntry 
} from '@/utils/supabaseAccountingService';

// أتمتة إصدار فاتورة جديدة
export const automateNewInvoice = async (invoiceData: {
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  taxAmount: number;
  netAmount: number;
  invoiceDate: string;
  dueDate: string;
  paymentLink: string;
}) => {
  try {
    // 1. إنشاء قيد محاسبي للفاتورة
    await createInvoiceJournalEntry({
      invoiceId: invoiceData.invoiceId,
      customerId: invoiceData.customerId,
      totalAmount: invoiceData.totalAmount,
      taxAmount: invoiceData.taxAmount,
      netAmount: invoiceData.netAmount,
      invoiceDate: invoiceData.invoiceDate
    });

    // 2. إرسال إشعار واتساب
    await sendInvoiceNotification(
      invoiceData.customerId,
      invoiceData.customerPhone,
      {
        invoiceNumber: invoiceData.invoiceId,
        customerName: invoiceData.customerName,
        grandTotal: `${invoiceData.totalAmount.toLocaleString('ar-SA')} ر.س`,
        dueDate: invoiceData.dueDate,
        paymentLink: invoiceData.paymentLink
      }
    );

    console.log(`Invoice automation completed for ${invoiceData.invoiceId}`);
  } catch (error) {
    console.error('Error in invoice automation:', error);
    throw error;
  }
};

// أتمتة استلام دفعة
export const automatePaymentReceived = async (paymentData: {
  paymentId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  feeAmount?: number;
  invoiceNumber?: string;
}) => {
  try {
    // 1. إنشاء قيد محاسبي للدفعة
    await createPaymentJournalEntry({
      paymentId: paymentData.paymentId,
      customerId: paymentData.customerId,
      amount: paymentData.amount,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      feeAmount: paymentData.feeAmount
    });

    // 2. يمكن إرسال إشعار تأكيد الدفع عبر واتساب هنا
    // await sendPaymentConfirmation(paymentData);

    console.log(`Payment automation completed for ${paymentData.paymentId}`);
  } catch (error) {
    console.error('Error in payment automation:', error);
    throw error;
  }
};

// أتمتة إرسال عقد للتوقيع الإلكتروني
export const automateEsignInvitation = async (esignData: {
  contractId: string;
  contractTitle: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  signLink: string;
  otp?: string;
}) => {
  try {
    // إرسال دعوة التوقيع عبر واتساب
    await sendSigningInvitation(
      esignData.customerId,
      esignData.customerPhone,
      {
        customer_name: esignData.customerName,
        contract_title: esignData.contractTitle,
        sign_link: esignData.signLink,
        otp: esignData.otp
      }
    );

    console.log(`E-sign invitation sent for contract ${esignData.contractId}`);
  } catch (error) {
    console.error('Error in e-sign automation:', error);
    throw error;
  }
};

// جدولة تذكيرات الفواتير المستحقة
export const scheduleInvoiceReminders = async () => {
  try {
    // في التطبيق الحقيقي، سيتم الحصول على الفواتير المستحقة من قاعدة البيانات
    // وإرسال تذكيرات حسب القواعد المحددة
    
    // مثال للتذكيرات:
    // - قبل الاستحقاق بـ 3 أيام
    // - يوم الاستحقاق
    // - بعد الاستحقاق بـ 3، 7، 14 يوم

    const overdueInvoices = await getOverdueInvoices();
    
    for (const invoice of overdueInvoices) {
      await sendInvoiceReminder(invoice);
    }

    console.log(`Processed ${overdueInvoices.length} invoice reminders`);
  } catch (error) {
    console.error('Error in invoice reminders automation:', error);
  }
};

// دالة مساعدة للحصول على الفواتير المستحقة (مثال)
const getOverdueInvoices = async (): Promise<any[]> => {
  // في التطبيق الحقيقي، سيتم استعلام قاعدة البيانات
  return [];
};

// دالة مساعدة لإرسال تذكير فاتورة (مثال)
const sendInvoiceReminder = async (invoice: any) => {
  // في التطبيق الحقيقي، سيتم إرسال تذكير واتساب
  console.log(`Sending reminder for invoice ${invoice.id}`);
};

// أتمتة تحديث حالة الفواتير المتأخرة
export const automateOverdueInvoices = async () => {
  try {
    // البحث عن الفواتير المتأخرة وتحديث حالتها
    // يمكن أيضاً إنشاء قيود محاسبية للغرامات إذا لزم الأمر
    
    console.log('Overdue invoices automation completed');
  } catch (error) {
    console.error('Error in overdue invoices automation:', error);
  }
};

// أتمتة إعادة إرسال دعوات التوقيع
export const automateEsignReminders = async () => {
  try {
    // البحث عن مستندات التوقيع التي لم يتم توقيعها بعد 48 ساعة
    // وإعادة إرسال الدعوة
    
    console.log('E-sign reminders automation completed');
  } catch (error) {
    console.error('Error in e-sign reminders automation:', error);
  }
};

// دالة رئيسية لتشغيل جميع عمليات الأتمتة
export const runAutomationTasks = async () => {
  try {
    await Promise.all([
      scheduleInvoiceReminders(),
      automateOverdueInvoices(),
      automateEsignReminders()
    ]);
    
    console.log('All automation tasks completed successfully');
  } catch (error) {
    console.error('Error running automation tasks:', error);
  }
};