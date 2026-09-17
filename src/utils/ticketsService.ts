import { supabase } from '@/data/legacy/client';

// ============ Types ============
export type TicketCategory = 'general' | 'technical' | 'billing' | 'complaint' | 'suggestion';
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Ticket {
  id: string;
  ticket_number: string;
  user_id: string;
  customer_id?: string | null;
  subject: string;
  description?: string | null;
  category: TicketCategory | string;
  priority: TicketPriority | string;
  status: TicketStatus | string;
  assigned_to?: string | null;
  assigned_admin_id?: string | null;
  related_invoice_id?: string | null;
  related_order_id?: string | null;
  related_contract_id?: string | null;
  related_payment_id?: string | null;
  last_message_at?: string | null;
  first_response_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  csat_rating?: number | null;
  csat_comment?: string | null;
  csat_submitted_at?: string | null;
  sla_due_at?: string | null;
  auto_created?: boolean;
  source?: string;
  tags?: string[];
  unread_for_client?: number;
  unread_for_admin?: number;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'client' | 'admin' | string;
  content: string;
  read_at?: string | null;
  created_at: string;
}

export interface TicketTimelineEntry {
  id: string;
  ticket_id: string;
  actor_id?: string | null;
  actor_type: string;
  action_type: string;
  action_label: string;
  description?: string | null;
  metadata?: any;
  created_at: string;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  user_id: string;
  uploaded_by_admin: boolean;
  file_name: string;
  file_size: number;
  file_type?: string | null;
  storage_path: string;
  created_at: string;
}

export interface TicketPresence {
  ticket_id: string;
  user_id: string;
  user_type: 'client' | 'admin';
  display_name?: string | null;
  last_seen_at: string;
}

export interface QuickReply {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  sort_order: number;
}

export interface KbArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful_count: number;
}

// ============ Labels & Colors (semantic-friendly) ============
export const CATEGORY_LABELS: Record<string, string> = {
  general: 'عام',
  technical: 'دعم تقني',
  billing: 'فوترة ومالية',
  complaint: 'شكوى',
  suggestion: 'اقتراح',
};

export const STATUS_LABELS: Record<string, string> = {
  open: 'مفتوحة',
  in_progress: 'قيد المعالجة',
  waiting: 'بانتظار العميل',
  resolved: 'تم الحل',
  closed: 'مغلقة',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
  critical: 'حرجة',
};

// HSL semantic-friendly tones via tailwind utility classes (kept as accents)
export const CATEGORY_COLOR: Record<string, string> = {
  general: 'bg-muted text-muted-foreground border-border',
  technical: 'bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400',
  billing: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
  complaint: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
  suggestion: 'bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400',
};

export const STATUS_COLOR: Record<string, string> = {
  open: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  in_progress: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
  waiting: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
  resolved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
  closed: 'bg-muted text-muted-foreground border-border',
};

export const PRIORITY_COLOR: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/30',
};

// ============ Service ============
export const SupportService = {
  async listForUser(userId: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets').select('*')
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false, nullsFirst: false });
    if (error) throw error;
    return (data || []) as Ticket[];
  },

  async listAll(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets').select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false });
    if (error) throw error;
    return (data || []) as Ticket[];
  },

  async get(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase.from('tickets').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return (data as Ticket) || null;
  },

  async create(input: Partial<Ticket>) {
    const { data, error } = await supabase.from('tickets').insert(input as any).select().single();
    if (error) throw error;
    return data as Ticket;
  },

  async update(id: string, patch: Partial<Ticket>) {
    const { error } = await supabase.from('tickets').update(patch as any).eq('id', id);
    if (error) throw error;
  },

  async getMessages(ticketId: string): Promise<TicketMessage[]> {
    const { data, error } = await supabase
      .from('ticket_messages').select('*')
      .eq('ticket_id', ticketId).order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []) as TicketMessage[];
  },

  async sendMessage(ticketId: string, senderId: string, senderType: 'client' | 'admin', content: string) {
    const { error } = await supabase.from('ticket_messages').insert({
      ticket_id: ticketId, sender_id: senderId, sender_type: senderType, content,
    } as any);
    if (error) throw error;
  },

  async markRead(ticketId: string, asAdmin: boolean) {
    const patch: any = asAdmin ? { unread_for_admin: 0 } : { unread_for_client: 0 };
    await supabase.from('tickets').update(patch).eq('id', ticketId);
  },

  async getTimeline(ticketId: string): Promise<TicketTimelineEntry[]> {
    const { data, error } = await supabase
      .from('ticket_timeline').select('*')
      .eq('ticket_id', ticketId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as TicketTimelineEntry[];
  },

  async getAttachments(ticketId: string): Promise<TicketAttachment[]> {
    const { data, error } = await supabase
      .from('ticket_attachments').select('*')
      .eq('ticket_id', ticketId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as TicketAttachment[];
  },

  async uploadAttachment(ticketId: string, userId: string, file: File, isAdmin: boolean) {
    const path = `${userId}/${ticketId}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from('ticket-attachments').upload(path, file);
    if (upErr) throw upErr;
    const { error } = await supabase.from('ticket_attachments').insert({
      ticket_id: ticketId, user_id: userId, uploaded_by_admin: isAdmin,
      file_name: file.name, file_size: file.size, file_type: file.type, storage_path: path,
    } as any);
    if (error) throw error;
  },

  async getSignedUrl(path: string) {
    const { data, error } = await supabase.storage.from('ticket-attachments').createSignedUrl(path, 60 * 60);
    if (error) throw error;
    return data.signedUrl;
  },

  // Presence
  async heartbeat(ticketId: string, userId: string, userType: 'client' | 'admin', displayName?: string) {
    await supabase.from('ticket_presence').upsert({
      ticket_id: ticketId, user_id: userId, user_type: userType,
      display_name: displayName || null, last_seen_at: new Date().toISOString(),
    } as any, { onConflict: 'ticket_id,user_id' });
  },

  async leavePresence(ticketId: string, userId: string) {
    await supabase.from('ticket_presence').delete().eq('ticket_id', ticketId).eq('user_id', userId);
  },

  async getPresence(ticketId: string): Promise<TicketPresence[]> {
    const { data } = await supabase.from('ticket_presence')
      .select('*').eq('ticket_id', ticketId)
      .gte('last_seen_at', new Date(Date.now() - 90_000).toISOString());
    return (data || []) as TicketPresence[];
  },

  // Typing
  async setTyping(ticketId: string, userId: string, userType: 'client' | 'admin', typing: boolean) {
    await supabase.from('ticket_typing').upsert({
      ticket_id: ticketId, user_id: userId, user_type: userType,
      is_typing: typing, updated_at: new Date().toISOString(),
    } as any, { onConflict: 'ticket_id,user_id' });
  },

  async getTyping(ticketId: string, excludeUserId: string) {
    const { data } = await supabase.from('ticket_typing')
      .select('*').eq('ticket_id', ticketId).eq('is_typing', true)
      .neq('user_id', excludeUserId)
      .gte('updated_at', new Date(Date.now() - 6000).toISOString());
    return data || [];
  },

  // Quick replies & KB
  async listQuickReplies(): Promise<QuickReply[]> {
    const { data } = await supabase.from('ticket_quick_replies')
      .select('*').eq('is_active', true).order('sort_order');
    return (data || []) as QuickReply[];
  },

  async listKb(): Promise<KbArticle[]> {
    const { data } = await supabase.from('support_kb_articles')
      .select('*').eq('is_published', true).order('sort_order');
    return (data || []) as KbArticle[];
  },

  // CSAT
  async submitCsat(ticketId: string, rating: number, comment: string) {
    const { error } = await supabase.from('tickets').update({
      csat_rating: rating, csat_comment: comment, csat_submitted_at: new Date().toISOString(),
    } as any).eq('id', ticketId);
    if (error) throw error;
  },

  // AI
  async ai(action: 'classify' | 'suggest_reply' | 'summarize' | 'rewrite', payload: any) {
    const { data, error } = await supabase.functions.invoke('support-ai', {
      body: { action, ...payload },
    });
    if (error) throw error;
    return data;
  },
};

// Backward-compat exports (legacy)
export const TicketsService = SupportService;
