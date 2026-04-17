import { supabase } from '@/integrations/supabase/client';

const STATUS_LABELS: Record<string, { label: string; emoji: string }> = {
  pending: { label: 'معلق', emoji: '⏳' },
  confirmed: { label: 'مؤكد', emoji: '✅' },
  review: { label: 'تحت المراجعة', emoji: '🔍' },
  in_progress: { label: 'قيد التنفيذ', emoji: '⚡' },
  completed: { label: 'مكتمل', emoji: '🎉' },
  refunded: { label: 'مسترد', emoji: '💸' },
  cancelled: { label: 'ملغي', emoji: '❌' },
};

interface SendArgs {
  orderId: string;
  trackingId: string;
  eventType: 'status' | 'quote' | 'attachment' | 'completed';
  newStatus?: string;
  note?: string;
  amount?: number | string;
  recipientEmail?: string | null;
  clientName?: string | null;
  serviceName?: string | null;
}

/**
 * Sends a transactional email to the client about an order update.
 * Silent on failure (logs only) — never throws to caller.
 */
export async function sendOrderEmail(args: SendArgs) {
  try {
    if (!args.recipientEmail) return;

    const statusInfo = args.newStatus ? STATUS_LABELS[args.newStatus] : undefined;
    const idempotencyKey = `order-${args.orderId}-${args.eventType}-${args.newStatus || ''}-${Date.now()}`;

    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'order-update',
        recipientEmail: args.recipientEmail,
        idempotencyKey,
        templateData: {
          clientName: args.clientName || undefined,
          trackingId: args.trackingId,
          serviceName: args.serviceName || undefined,
          newStatusLabel: statusInfo?.label,
          statusEmoji: statusInfo?.emoji,
          note: args.note,
          eventType: args.eventType,
          amount: args.amount,
        },
      },
    });

    if (error) console.error('[sendOrderEmail] error:', error);
  } catch (e) {
    console.error('[sendOrderEmail] exception:', e);
  }
}
