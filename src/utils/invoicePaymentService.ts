import { supabase } from '@/integrations/supabase/client';

export interface RecordInvoicePaymentInput {
  invoice_id: string;
  payment_method: 'wallet' | 'bank_transfer';
  payment_date?: string;
  reference_number?: string | null;
  notes?: string | null;
}

export interface RecordInvoicePaymentResponse {
  ok: boolean;
  payment_id: string;
  status: 'completed' | 'pending';
  amount: number;
}

const getFunctionErrorMessage = async (error: any) => {
  let message = error?.message || 'حدث خطأ غير متوقع';

  if (error?.name === 'FunctionsFetchError') {
    return 'تعذر الاتصال بخدمة الدفع، حاول مرة أخرى';
  }

  if (error?.name === 'FunctionsRelayError') {
    return 'خدمة الدفع غير متاحة حالياً';
  }

  if (error?.name === 'FunctionsHttpError' && error.context) {
    try {
      const payload = await error.context.json();
      message = payload?.message || payload?.error || message;
    } catch {
      return message;
    }
  }

  return message;
};

export const recordInvoicePayment = async (
  input: RecordInvoicePaymentInput,
): Promise<RecordInvoicePaymentResponse> => {
  const { data, error } = await supabase.functions.invoke('record-invoice-payment', {
    body: input,
  });

  if (error) {
    throw new Error(await getFunctionErrorMessage(error));
  }

  return data as RecordInvoicePaymentResponse;
};