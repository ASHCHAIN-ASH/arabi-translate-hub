import { supabase } from '@/integrations/supabase/client';

export type TicketCategory = 'financial' | 'service_order' | 'complaint' | 'technical' | 'general';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_client' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

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
  related_invoice_id?: string | null;
  related_order_id?: string | null;
  last_message_at?: string | null;
  resolved_at?: string | null;
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

export const CATEGORY_LABELS: Record<string, string> = {
  financial: 'مالي',
  service_order: 'طلبات الخدمات',
  complaint: 'شكوى',
  technical: 'دعم تقني',
  general: 'عام',
};

export const STATUS_LABELS: Record<string, string> = {
  open: 'مفتوحة',
  in_progress: 'قيد المعالجة',
  waiting_client: 'بانتظار العميل',
  resolved: 'تم الحل',
  closed: 'مغلقة',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
  urgent: 'عاجلة',
};

export const CATEGORY_COLOR: Record<string, string> = {
  financial: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  service_order: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  complaint: 'bg-red-500/10 text-red-600 border-red-500/20',
  technical: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  general: 'bg-muted text-muted-foreground border-border',
};

export const STATUS_COLOR: Record<string, string> = {
  open: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  in_progress: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  waiting_client: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  closed: 'bg-muted text-muted-foreground border-border',
};

export const PRIORITY_COLOR: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-500/10 text-blue-600',
  high: 'bg-amber-500/10 text-amber-600',
  urgent: 'bg-red-500/10 text-red-600',
};

export const TicketsService = {
  async listForUser(userId: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Ticket[];
  },

  async listAll(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Ticket[];
  },

  async listForCustomer(customerId: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
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

  async updateStatus(id: string, status: TicketStatus) {
    const { error } = await supabase.from('tickets').update({ status }).eq('id', id);
    if (error) throw error;
  },

  async updatePriority(id: string, priority: TicketPriority) {
    const { error } = await supabase.from('tickets').update({ priority }).eq('id', id);
    if (error) throw error;
  },

  async getMessages(ticketId: string): Promise<TicketMessage[]> {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []) as TicketMessage[];
  },

  async sendMessage(ticketId: string, senderId: string, senderType: 'client' | 'admin', content: string) {
    const { error } = await supabase.from('ticket_messages').insert({
      ticket_id: ticketId, sender_id: senderId, sender_type: senderType, content,
    } as any);
    if (error) throw error;
  },

  async getTimeline(ticketId: string): Promise<TicketTimelineEntry[]> {
    const { data, error } = await supabase
      .from('ticket_timeline')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as TicketTimelineEntry[];
  },

  async getAttachments(ticketId: string): Promise<TicketAttachment[]> {
    const { data, error } = await supabase
      .from('ticket_attachments')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });
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
};
