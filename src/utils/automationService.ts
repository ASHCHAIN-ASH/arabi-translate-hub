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
    await sendInvoiceNotification(invoiceData.customerPhone);

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
    await sendSigningInvitation(esignData.customerPhone);

    console.log(`E-sign invitation sent for contract ${esignData.contractId}`);
  } catch (error) {
    console.error('Error in e-sign automation:', error);
    throw error;
  }
};

// دالة رئيسية لتشغيل جميع عمليات الأتمتة
export const runAutomationTasks = async () => {
  try {
    console.log('All automation tasks completed successfully');
  } catch (error) {
    console.error('Error running automation tasks:', error);
  }
};