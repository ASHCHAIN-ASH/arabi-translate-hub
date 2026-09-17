import { supabase } from '@/data/legacy/client';

export interface InboxSendArgs {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  formType?: string;
  serviceType?: string;
  sourcePage?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Sends a public form submission to the unified admin inbox.
 * Best-effort: failures are logged but never thrown — so existing flows
 * (which may also call legacy notify functions) keep working.
 */
export async function sendToInbox(args: InboxSendArgs): Promise<void> {
  try {
    await supabase.functions.invoke('inbox-receive', {
      body: {
        name: args.name,
        email: args.email,
        phone: args.phone,
        subject: args.subject,
        message: args.message,
        formType: args.formType ?? 'contact',
        serviceType: args.serviceType,
        sourcePage: args.sourcePage ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
        metadata: args.metadata ?? {},
      },
    });
  } catch (e) {
    console.error('[inboxService] failed to push to inbox:', e);
  }
}
